import { useState, useEffect } from 'react'
import { CityData, CityMatch } from '../types'
import { matchCities } from '../utils/matching'
import { generateRecommendation } from '../utils/recommendation'
import { getCityImage } from '../utils/cityImages'
import { generatePersonality } from '../utils/personality'
import { calculateBadges } from '../utils/badges'
import { exportToPDF, addPrintStyles } from '../utils/pdfExport'
import { ResultsSkeleton } from '../components/Skeleton'
import RadarChart from '../components/RadarChart'
import ShareCard from '../components/ShareCard'
import { DIMENSIONS, DIMENSION_NAMES } from '../constants'
import './Results.css'

interface ResultsProps {
  data: any
  onRestart: () => void
}

export default function Results({ data, onRestart }: ResultsProps) {
  const [cityData, setCityData] = useState<CityData | null>(null)
  const [topCities, setTopCities] = useState<CityMatch[]>([])
  const [selectedCity, setSelectedCity] = useState<CityMatch | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showShareTip, setShowShareTip] = useState(false)
  const [showShareCard, setShowShareCard] = useState(false)

  useEffect(() => {
    if (!data) return
    
    addPrintStyles()
    
    const baseUrl = import.meta.env.DEV ? '' : '/BestCity4U'
    fetch(`${baseUrl}/data/cities.lite.v1.json`)
      .then(res => {
        if (!res.ok) throw new Error('加载城市数据失败')
        return res.json()
      })
      .then((cities: CityData) => {
        setCityData(cities)
        const matches = matchCities(data.userProfile, cities.cities)
        const top10 = matches.slice(0, 10)
        setTopCities(top10)
        setSelectedCity(top10[0])
      })
      .catch(err => setError(err.message || '加载失败，请刷新重试'))
  }, [data])

  if (error) return <div className="loading" style={{color: '#e65100'}}>{error}</div>
  if (!data || !cityData || topCities.length === 0) {
    return <ResultsSkeleton />
  }

  const handleShare = () => {
    const text = `我的最佳城市是 ${topCities[0].city_name}！匹配度 ${topCities[0].match_score}分\n\n立即测试你的最佳城市 👉 ${window.location.origin}${window.location.pathname}`
    
    if (navigator.share) {
      navigator.share({ title: 'Best City for You', text }).catch(() => {})
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setShowShareTip(true)
        setTimeout(() => setShowShareTip(false), 2000)
      })
    }
  }

  const handleShareImage = () => {
    setShowShareCard(true)
  }

  return (
    <div className="results">
      <div className="results-header">
        <h1>你的最佳城市匹配</h1>
        <div className="header-buttons">
          <button className="export-button" onClick={exportToPDF}>📊 导出PDF</button>
          <button className="share-button" onClick={handleShareImage}>📷 分享图片</button>
          <button className="share-button" onClick={handleShare}>分享结果</button>
          <button className="restart-button" onClick={onRestart}>重新测评</button>
        </div>
      </div>

      {showShareTip && <div className="share-tip">已复制到剪贴板</div>}

      <div className="hero-card" style={{ backgroundImage: `linear-gradient(rgba(102, 126, 234, 0.85), rgba(118, 75, 162, 0.85)), url(${getCityImage(topCities[0].city_name)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="hero-badge">Top 1</div>
        <h2 className="hero-city">{topCities[0].city_name}</h2>
        <p className="hero-country">{topCities[0].country_name}</p>
        <div className="hero-score">{topCities[0].match_score}</div>
        <p className="hero-label">匹配度</p>
        <div className="hero-recommendation">
          {generateRecommendation(topCities[0], data.userProfile)}
        </div>
        <div className="hero-tags">
          {topCities[0].tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="top5-section">
        <h2>Top 10 城市</h2>
        <div className="top5-grid">
          {topCities.map((city, index) => (
            <div 
              key={city.city_id} 
              className={`city-card ${selectedCity?.city_id === city.city_id ? 'active' : ''}`}
              onClick={() => setSelectedCity(city)}
            >
              <div className="city-rank">#{index + 1}</div>
              <h3>{city.city_name}</h3>
              <p className="city-country">{city.country_name}</p>
              <div className="city-score">{city.match_score}</div>
              <div className="city-tags">
                {city.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="tag-small">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCity && (
        <div className="detail-section">
          <h2>{selectedCity.city_name} 详细分析</h2>
          
          <div className="detail-grid">
            <div className="detail-card">
              <h3>雷达图对比</h3>
              <RadarChart 
                userScores={data.userProfile.scores} 
                cityScores={selectedCity.dimension_scores}
              />
            </div>
            
            <div className="detail-card">
              <h3>维度匹配度</h3>
              <div className="dimensions-list">
                {DIMENSIONS.map(dim => {
                  const cityScore = selectedCity.dimension_scores[dim]
                  const userScore = data.userProfile.scores[dim]
                  const match = Math.round((1 - Math.abs(cityScore - userScore)) * 100)
                  
                  return (
                    <div key={dim} className="dimension-item">
                      <div className="dimension-header">
                        <span className="dimension-name">{DIMENSION_NAMES[dim]}</span>
                        <span className="dimension-match">{match}%</span>
                      </div>
                      <div className="dimension-bar">
                        <div className="dimension-fill" style={{ width: `${match}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="detail-card">
              <h3>优势与风险</h3>
              <div className="factors">
                <div className="factor-group">
                  <h4>✅ 匹配优势</h4>
                  {selectedCity.top_factors.map(dim => (
                    <div key={dim} className="factor-item positive">
                      {DIMENSION_NAMES[dim]}
                    </div>
                  ))}
                </div>
                <div className="factor-group">
                  <h4>⚠️ 需要注意</h4>
                  {selectedCity.known_tradeoffs.map(risk => (
                    <div key={risk} className="factor-item negative">
                      {risk}
                    </div>
                  ))}
                </div>
              </div>
              <div className="confidence">
                数据置信度: <strong>{selectedCity.confidence}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="user-profile-section">
        <div className="profile-header">
          <h2>你的偏好画像</h2>
          <div className="personality-tag">{generatePersonality(data.userProfile)}</div>
        </div>
        
        <div className="badges-section">
          <h3>获得徽章</h3>
          <div className="badges-grid">
            {calculateBadges(data.userProfile, topCities[0]).map(badge => (
              <div key={badge.id} className="badge-card">
                <span className="badge-icon">{badge.icon}</span>
                <h4>{badge.name}</h4>
                <p>{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {data.consistency !== undefined && data.consistency < 0.7 && (
          <div className="consistency-warning">
            ⚠️ 检测到部分答案不一致，建议重新审视相关问题以获得更准确的结果
          </div>
        )}
        <div className="profile-dimensions">
          {DIMENSIONS.map(dim => {
            const score = Math.round(data.userProfile.scores[dim] * 100)
            const weight = Math.round(data.userProfile.weights[dim] * 100)
            
            return (
              <div key={dim} className="profile-item">
                <span className="profile-name">{DIMENSION_NAMES[dim]}</span>
                <div className="profile-bars">
                  <div className="profile-bar-container">
                    <div className="profile-bar" style={{ width: `${score}%` }} />
                    <span className="profile-value">{score}</span>
                  </div>
                  <div className="profile-weight">重视度: {weight}%</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      
      {showShareCard && (
        <ShareCard 
          city={topCities[0]} 
          personality={generatePersonality(data.userProfile)}
          onClose={() => setShowShareCard(false)}
        />
      )}
    </div>
  )
}
