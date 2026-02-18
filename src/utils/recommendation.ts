import { CityMatch, UserProfile } from '../types'
import { DIMENSION_NAMES } from '../constants'

export function generateRecommendation(city: CityMatch, userProfile: UserProfile): string {
  const topDim = city.top_factors[0]
  const weight = userProfile.weights[topDim]
  
  const reasons: string[] = []
  
  // 主要匹配原因
  if (weight > 0.8) {
    reasons.push(`你非常重视${DIMENSION_NAMES[topDim]}，而${city.city_name}在这方面表现优异`)
  } else {
    reasons.push(`${city.city_name}在${DIMENSION_NAMES[topDim]}方面与你的期望高度契合`)
  }
  
  // 次要优势
  const secondDim = city.top_factors[1]
  if (userProfile.weights[secondDim] > 0.6) {
    reasons.push(`同时在${DIMENSION_NAMES[secondDim]}上也能满足你的需求`)
  }
  
  // 综合评价
  if (city.match_score >= 85) {
    reasons.push(`综合匹配度高达${city.match_score}分，是你的理想选择`)
  } else if (city.match_score >= 75) {
    reasons.push(`整体匹配度${city.match_score}分，各方面较为均衡`)
  }
  
  return reasons.join('，') + '。'
}
