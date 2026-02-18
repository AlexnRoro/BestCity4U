import { City, UserProfile, CityMatch } from '../types'
import { DIMENSIONS } from '../constants'

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
      if (weight > 0) {
        scores[dim] += score * Math.abs(weight)
        weights[dim] += Math.abs(weight)
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
  
  const matches: CityMatch[] = cities.map(city => {
    const contributions: Record<string, number> = {}
    let totalContribution = 0

    dimensions.forEach(d => {
      const similarity = 1 - Math.abs(userProfile.scores[d] - city.dimension_scores[d])
      const contribution = userProfile.weights[d] * similarity
      contributions[d] = contribution
      totalContribution += contribution
    })

    const weightSum = dimensions.reduce((sum, d) => sum + userProfile.weights[d], 0)
    let baseScore = weightSum > 0 ? totalContribution / weightSum : 0

    let penalty = 0
    dimensions.forEach(d => {
      if (userProfile.weights[d] > 0.75 && city.dimension_scores[d] < 0.35) {
        penalty += userProfile.weights[d] * (0.35 - city.dimension_scores[d]) * 1.5
      }
    })

    const finalScore = Math.max(0, Math.min(1, baseScore - penalty))

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
