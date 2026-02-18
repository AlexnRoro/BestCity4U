import { CityMatch } from '../types'
import './ShareCard.css'

interface ShareCardProps {
  city: CityMatch
  personality: string
  onClose: () => void
}

export default function ShareCard({ city, personality, onClose }: ShareCardProps) {
  const downloadImage = () => {
    const card = document.getElementById('share-card')
    if (!card) return
    
    // 使用html2canvas需要安装库，这里提供简化版本
    // 实际项目中可以使用 html2canvas 或 dom-to-image
    alert('请截图保存此卡片，或使用浏览器的"打印为PDF"功能')
  }
  
  return (
    <div className="share-overlay" onClick={onClose}>
      <div className="share-card-container" onClick={e => e.stopPropagation()}>
        <div id="share-card" className="share-card">
          <div className="share-header">
            <h2>Best City for You</h2>
            <p>我的最佳城市匹配</p>
          </div>
          
          <div className="share-city">
            <div className="share-badge">Top 1</div>
            <h1>{city.city_name}</h1>
            <p>{city.country_name}</p>
          </div>
          
          <div className="share-score">
            <div className="score-circle">{city.match_score}</div>
            <p>匹配度</p>
          </div>
          
          <div className="share-tags">
            {city.tags.map(tag => (
              <span key={tag} className="share-tag">{tag}</span>
            ))}
          </div>
          
          <div className="share-personality">
            {personality}
          </div>
          
          <div className="share-footer">
            立即测试你的最佳城市 👉 bestcityforyou.com
          </div>
        </div>
        
        <div className="share-actions">
          <button onClick={downloadImage}>📥 保存图片</button>
          <button onClick={onClose}>关闭</button>
        </div>
      </div>
    </div>
  )
}
