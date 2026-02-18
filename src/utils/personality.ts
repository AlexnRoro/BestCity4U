import { UserProfile } from '../types'

export function generatePersonality(userProfile: UserProfile): string {
  const weights = userProfile.weights
  
  // 找出最重视的维度
  const topWeight = Object.entries(weights).sort((a, b) => b[1] - a[1])[0]
  const topDim = topWeight[0]
  
  const personalities: Record<string, string[]> = {
    Career: ['职业导向的奋斗者', '追求事业发展的实干家', '以职业为重的进取者'],
    Cost: ['务实理性的规划者', '精打细算的生活家', '追求性价比的智者'],
    Safety: ['追求稳定的安全主义者', '注重保障的谨慎派', '稳健务实的生活家'],
    Culture: ['热爱生活的文化探索者', '追求品质的生活美学家', '文艺气息的城市漫游者'],
    Nature: ['亲近自然的生态主义者', '向往绿色的自然派', '追求健康的户外爱好者'],
    International: ['开放包容的世界公民', '国际化视野的探索者', '多元文化的拥抱者'],
    Climate: ['注重舒适的享乐主义者', '追求宜居的生活家', '气候敏感的品质派'],
    Mobility: ['高效便捷的都市人', '注重效率的行动派', '追求便利的现代人']
  }
  
  const options = personalities[topDim] || ['独特的城市探索者']
  return options[Math.floor(Math.random() * options.length)]
}
