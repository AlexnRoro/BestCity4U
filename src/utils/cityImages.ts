// 使用Unsplash Source API获取城市图片
export function getCityImage(cityName: string): string {
  const cityMap: Record<string, string> = {
    '北京': 'beijing',
    '上海': 'shanghai',
    '广州': 'guangzhou',
    '深圳': 'shenzhen',
    '杭州': 'hangzhou',
    '成都': 'chengdu',
    '东京': 'tokyo',
    '大阪': 'osaka',
    '首尔': 'seoul',
    '新加坡': 'singapore',
    '曼谷': 'bangkok',
    '纽约': 'new-york',
    '旧金山': 'san-francisco'
  }
  
  const query = cityMap[cityName] || cityName.toLowerCase()
  return `https://source.unsplash.com/800x400/?${query},city,skyline`
}
