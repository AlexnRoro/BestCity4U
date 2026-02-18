import { DIMENSIONS, DIMENSION_NAMES } from '../constants'
import './RadarChart.css'

interface RadarChartProps {
  userScores: Record<string, number>
  cityScores: Record<string, number>
}

export default function RadarChart({ userScores, cityScores }: RadarChartProps) {
  const size = 300
  const center = size / 2
  const radius = size / 2 - 40
  
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / DIMENSIONS.length - Math.PI / 2
    const r = radius * value
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    }
  }
  
  const userPoints = DIMENSIONS.map((dim, i) => getPoint(i, userScores[dim]))
  const cityPoints = DIMENSIONS.map((dim, i) => getPoint(i, cityScores[dim]))
  
  const userPath = userPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  const cityPath = cityPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'
  
  return (
    <div className="radar-chart">
      <svg width={size} height={size}>
        {/* 背景网格 */}
        {[0.2, 0.4, 0.6, 0.8, 1].map(scale => (
          <polygon
            key={scale}
            points={DIMENSIONS.map((_, i) => {
              const p = getPoint(i, scale)
              return `${p.x},${p.y}`
            }).join(' ')}
            fill="none"
            stroke="#e0e0e0"
            strokeWidth="1"
          />
        ))}
        
        {/* 轴线 */}
        {DIMENSIONS.map((_, i) => {
          const p = getPoint(i, 1)
          return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#e0e0e0" strokeWidth="1" />
        })}
        
        {/* 城市数据 */}
        <path d={cityPath} fill="rgba(102, 126, 234, 0.2)" stroke="#667eea" strokeWidth="2" />
        
        {/* 用户数据 */}
        <path d={userPath} fill="rgba(255, 107, 107, 0.2)" stroke="#ff6b6b" strokeWidth="2" />
        
        {/* 标签 */}
        {DIMENSIONS.map((dim, i) => {
          const p = getPoint(i, 1.15)
          return (
            <text
              key={dim}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              fontSize="12"
              fill="#666"
            >
              {DIMENSION_NAMES[dim]}
            </text>
          )
        })}
      </svg>
      
      <div className="radar-legend">
        <div className="legend-item">
          <span className="legend-color user"></span>
          <span>你的偏好</span>
        </div>
        <div className="legend-item">
          <span className="legend-color city"></span>
          <span>城市特征</span>
        </div>
      </div>
    </div>
  )
}
