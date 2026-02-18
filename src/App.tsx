import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Results from './pages/Results'

type Page = 'home' | 'quiz' | 'results'

function App() {
  const [page, setPage] = useState<Page>('home')
  const [results, setResults] = useState<any>(null)
  const [quizMode, setQuizMode] = useState<'full' | 'quick'>('full')

  useEffect(() => {
    const hash = window.location.hash.slice(1) || 'home'
    setPage(hash as Page)
    
    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1) || 'home'
      setPage(newHash as Page)
    }
    
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (to: Page, data?: any) => {
    window.location.hash = to
    setPage(to)
    if (data) setResults(data)
  }

  return (
    <>
      {page === 'home' && <Home onStart={(mode) => { setQuizMode(mode); navigate('quiz'); }} />}
      {page === 'quiz' && <Quiz mode={quizMode} onComplete={(data) => navigate('results', data)} />}
      {page === 'results' && <Results data={results} onRestart={() => navigate('home')} />}
    </>
  )
}

export default App
