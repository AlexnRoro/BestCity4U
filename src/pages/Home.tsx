import './Home.css'

interface HomeProps {
  onStart: (mode: 'full' | 'quick') => void
}

export default function Home({ onStart }: HomeProps) {
  return (
    <div className="home">
      <div className="home-container">
        <h1 className="home-title">Best City for You</h1>
        <p className="home-subtitle">找到最适合你长期居住和工作的城市</p>
        
        <div className="home-features">
          <div className="feature">
            <span className="feature-icon">🌍</span>
            <h3>全球覆盖</h3>
            <p>150+ 全球城市</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <h3>精准匹配</h3>
            <p>8 维度个性化评估</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <h3>隐私保护</h3>
            <p>本地计算，不上传数据</p>
          </div>
        </div>

        <div className="mode-selection">
          <button className="mode-button full" onClick={() => onStart('full')}>
            <span className="mode-icon">📋</span>
            <h3>完整模式</h3>
            <p>45 道题 · 5-8 分钟</p>
            <span className="mode-badge">推荐</span>
          </button>
          <button className="mode-button quick" onClick={() => onStart('quick')}>
            <span className="mode-icon">⚡</span>
            <h3>快速模式</h3>
            <p>20 道题 · 2-3 分钟</p>
          </button>
        </div>

        <p className="home-note">
          快速模式提供基础匹配，完整模式结果更精准
        </p>
      </div>
    </div>
  )
}
