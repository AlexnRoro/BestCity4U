export const DIMENSIONS = [
  "Climate",
  "Cost",
  "Safety",
  "Mobility",
  "Career",
  "Culture",
  "Nature",
  "International"
] as const

export const DIMENSION_NAMES: Record<string, string> = {
  Climate: "气候舒适",
  Cost: "生活成本",
  Safety: "安全稳定",
  Mobility: "交通便利",
  Career: "职业机会",
  Culture: "文化生活",
  Nature: "自然环境",
  International: "国际化"
}

export type Dimension = typeof DIMENSIONS[number]
