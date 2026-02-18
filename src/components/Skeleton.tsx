import './Skeleton.css'

export function QuizSkeleton() {
  return (
    <div className="quiz">
      <div className="quiz-header">
        <div className="skeleton" style={{ height: '8px', marginBottom: '0.5rem' }} />
        <div className="skeleton" style={{ height: '20px', width: '60px', margin: '0 auto' }} />
      </div>
      <div className="skeleton-quiz">
        <div className="skeleton skeleton-title" />
        <div className="skeleton-buttons">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="skeleton skeleton-button" />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="skeleton" style={{ flex: 1, height: '48px' }} />
          <div className="skeleton" style={{ flex: 1, height: '48px' }} />
        </div>
      </div>
    </div>
  )
}

export function ResultsSkeleton() {
  return (
    <div className="skeleton-results">
      <div className="skeleton skeleton-hero" />
      <div className="skeleton-grid">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="skeleton skeleton-card" />
        ))}
      </div>
    </div>
  )
}
