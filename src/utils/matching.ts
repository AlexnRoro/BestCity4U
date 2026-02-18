import { City, UserProfile, CityMatch } from '../types'
import { DIMENSIONS } from '../constants'

type UserType = {
  type: string
  adjustments: Record<string, number>
}

function identifyUserType(profile: UserProfile): UserType {
  const { weights } = profile
  
  // 职业驱动型
  if (weights.Career > 0.8 && weights.Cost < 0.5) {
    return {
      type: 'career-driven',
      adjustments: { Career: 1.3, Cost: 0.7 }
    }
  }
  
  // 生活质量型
  if (weights.Safety > 0.8 && weights.Culture > 0.7) {
    return {
      type: 'quality-of-life',
      adjustments: { Safety: 1.2, Culture: 1.2, Career: 0.8 }
    }
  }
  
  // 预算敏感型
  if (weights.Cost > 0.9) {
    return {
      type: 'budget-conscious',
      adjustments: { Cost: 1.5, Career: 0.9 }
    }
  }
  
  // 数字游民型
  if (weights.International > 0.8 && weights.Career < 0.5) {
    return {
      type: 'digital-nomad',
      adjustments: { International: 1.3, Cost: 1.2, Career: 0.6 }
    }
  }
  
  // 自然爱好者
  if (weights.Nature > 0.85 && weights.Climate > 0.75) {
    return {
      type: 'nature-lover',
      adjustments: { Nature: 1.3, Climate: 1.2 }
    }
  }
  
  return { type: 'balanced', adjustments: {} }
}

function calculateDynamicPenalty(userScore: number, cityScore: number, weight: number): number {
  const gap = Math.abs(userScore - cityScore)
  const tolerance = 0.3 * (1 - weight)
  
  if (gap > tolerance) {
    const excessGap = gap - tolerance
    return weight * Math.pow(excessGap, 1.5) * 2
  }
  return 0
}

function calculateNonLinearSimilarity(userScore: number, cityScore: number, dimension: string): number {
  const gap = Math.abs(userScore - cityScore)
  
  const sensitivity: Record<string, number> = {
    Safety: 2.0,
    Cost: 1.5,
    Climate: 1.2,
    Career: 1.3,
    Mobility: 1.1,
    Nature: 1.0,
    Culture: 0.8,
    International: 0.9
  }
  
  const s = sensitivity[dimension] || 1.0
  return 1 / (1 + Math.exp(s * (gap - 0.2)))
}

function applyDimensionInteractions(
  cityScores: Record<string, number>,
  userProfile: UserProfile,
  similarities: Record<string, number>
): number {
  let bonus = 0
  
  const costGap = Math.abs(userProfile.scores.Cost - cityScores.Cost)
  const careerSim = similarities.Career
  const safetySim = similarities.Safety
  
  if (careerSim > 0.8 && userProfile.weights.Career > 0.7 && costGap > 0.2) {
    bonus += costGap * 0.3
  }
  
  if (safetySim > 0.85 && costGap > 0.2) {
    bonus += costGap * 0.25
  }
  
  const climateSim = similarities.Climate
  const natureSim = similarities.Nature
  if (climateSim > 0.8 && natureSim > 0.8) {
    bonus += 0.05
  }
  
  const cultureSim = similarities.Culture
  const internationalSim = similarities.International
  if (cultureSim > 0.75 && internationalSim > 0.75) {
    bonus += 0.04
  }
  
  return bonus
}

export function calculateUserProfile(answers: Record<string, number>, questions: any[]): UserProfile {
  const scores: Record<string, number> = {}
  const weights: Record<string, number> = {}
  const counts: Record<string, number> = {}

  DIMENSIONS.forEach(d => {
    scores[d] = 0
    weights[d] = 0
    counts[d] = 0
  })

  questions.forEach(q => {
    const answer = answers[q.question_id]
    if (answer === undefined) return

    const normalized = (answer - q.scale.min) / (q.scale.max - q.scale.min)
    const score = q.reverse_scoring ? 1 - normalized : normalized

    Object.entries(q.dimension_weights).forEach(([dim, weight]) => {
      const w = weight as number
      if (w > 0) {
        scores[dim] += score * Math.abs(w)
        weights[dim] += Math.abs(w)
        counts[dim]++
      }
    })
  })

  DIMENSIONS.forEach(d => {
    if (counts[d] > 0) {
      scores[d] = scores[d] / weights[d]
      weights[d] = weights[d] / counts[d]
    }
  })

  const maxWeight = Math.max(...Object.values(weights))
  DIMENSIONS.forEach(d => {
    weights[d] = maxWeight > 0 ? weights[d] / maxWeight : 0
  })

  return { scores, weights }
}

export function matchCities(userProfile: UserProfile, cities: City[]): CityMatch[] {
  const dimensions = Object.keys(userProfile.scores)
  const userType = identifyUserType(userProfile)
  
  const adjustedWeights = { ...userProfile.weights }
  Object.entries(userType.adjustments).forEach(([dim, adj]) => {
    if (adjustedWeights[dim] !== undefined) {
      adjustedWeights[dim] = Math.min(1, adjustedWeights[dim] * adj)
    }
  })
  
  const matches: CityMatch[] = cities.map(city => {
    const contributions: Record<string, number> = {}
    const similarities: Record<string, number> = {}
    let totalContribution = 0

    dimensions.forEach(d => {
      const similarity = calculateNonLinearSimilarity(
        userProfile.scores[d],
        city.dimension_scores[d],
        d
      )
      similarities[d] = similarity
      const contribution = adjustedWeights[d] * similarity
      contributions[d] = contribution
      totalContribution += contribution
    })

    const weightSum = dimensions.reduce((sum, d) => sum + adjustedWeights[d], 0)
    let baseScore = weightSum > 0 ? totalContribution / weightSum : 0

    let penalty = 0
    dimensions.forEach(d => {
      penalty += calculateDynamicPenalty(
        userProfile.scores[d],
        city.dimension_scores[d],
        adjustedWeights[d]
      )
    })
    
    const interactionBonus = applyDimensionInteractions(
      city.dimension_scores,
      userProfile,
      similarities
    )

    const finalScore = Math.max(0, Math.min(1, baseScore - penalty + interactionBonus))

    const sortedContributions = Object.entries(contributions)
      .sort((a, b) => b[1] - a[1])
    
    const top_factors = sortedContributions.slice(0, 3).map(([d]) => d)
    const top_risks = sortedContributions.slice(-2).map(([d]) => d).reverse()

    return {
      ...city,
      match_score: Math.round(finalScore * 100),
      contributions,
      top_factors,
      top_risks
    }
  })

  return matches.sort((a, b) => b.match_score - a.match_score)
}
