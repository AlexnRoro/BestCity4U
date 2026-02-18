import { UserProfile, CityMatch } from '../types'

export interface Badge {
  id: string
  name: string
  icon: string
  description: string
}

export function calculateBadges(userProfile: UserProfile, topCity: CityMatch): Badge[] {
  const badges: Badge[] = []
  const weights = userProfile.weights
  const scores = userProfile.scores
  
  // 环球探索者
  const highWeights = Object.values(weights).filter(w => w > 0.7).length
  if (highWeights >= 5) {
    badges.push({
      id: 'explorer',
      name: '环球探索者',
      icon: '🌍',
      description: '你对多个维度都有高要求，是全面型选手'
    })
  }
  
  // 务实主义者
  if (weights.Cost > 0.8 || weights.Safety > 0.8) {
    badges.push({
      id: 'pragmatist',
      name: '务实主义者',
      icon: '💼',
      description: '你注重实际，追求稳定和性价比'
    })
  }
  
  // 文化爱好者
  if (weights.Culture > 0.75 && scores.Culture > 0.7) {
    badges.push({
      id: 'culture_lover',
      name: '文化爱好者',
      icon: '🎭',
      description: '你热爱艺术和文化生活'
    })
  }
  
  // 自然派
  if (weights.Nature > 0.75 && scores.Nature > 0.7) {
    badges.push({
      id: 'nature_lover',
      name: '自然派',
      icon: '🌿',
      description: '你向往绿色生活，亲近自然'
    })
  }
  
  // 职场精英
  if (weights.Career > 0.8 && scores.Career > 0.7) {
    badges.push({
      id: 'career_focused',
      name: '职场精英',
      icon: '🚀',
      description: '你以事业为重，追求职业发展'
    })
  }
  
  // 世界公民
  if (weights.International > 0.75 && topCity.dimension_scores.International > 0.8) {
    badges.push({
      id: 'global_citizen',
      name: '世界公民',
      icon: '✈️',
      description: '你拥有国际化视野，开放包容'
    })
  }
  
  // 完美匹配
  if (topCity.match_score >= 90) {
    badges.push({
      id: 'perfect_match',
      name: '完美匹配',
      icon: '⭐',
      description: '找到了高度契合的理想城市'
    })
  }
  
  // 冒险家
  const lowSafety = weights.Safety < 0.5
  const highCareer = weights.Career > 0.8
  if (lowSafety && highCareer) {
    badges.push({
      id: 'adventurer',
      name: '冒险家',
      icon: '🎯',
      description: '你敢于冒险，追求机遇'
    })
  }
  
  return badges.slice(0, 3) // 最多显示3个徽章
}
