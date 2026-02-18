import { useState, useEffect } from 'react'
import { QuestionData } from '../types'
import { calculateUserProfile } from '../utils/matching'
import { QuizSkeleton } from '../components/Skeleton'
import './Quiz.css'

interface QuizProps {
  onComplete: (data: any) => void
  mode?: 'full' | 'quick'
}

export default function Quiz({ onComplete, mode = 'full' }: QuizProps) {
  const [questionData, setQuestionData] = useState<QuestionData | null>(null)
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem('quiz_progress')
    return saved ? JSON.parse(saved).currentIndex : 0
  })
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('quiz_progress')
    return saved ? JSON.parse(saved).answers : {}
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const baseUrl = import.meta.env.DEV ? '' : '/BestCity4U'
    fetch(`${baseUrl}/data/questions.v1.json`)
      .then(res => {
        if (!res.ok) throw new Error('加载题目失败')
        return res.json()
      })
      .then(data => {
        if (mode === 'quick') {
          const quickQuestions = data.questions.filter((_: any, i: number) => i % 2 === 0 || i < 8)
          setQuestionData({ ...data, questions: quickQuestions.slice(0, 20) })
        } else {
          setQuestionData(data)
        }
      })
      .catch(err => setError(err.message || '加载失败，请刷新重试'))
  }, [])

  useEffect(() => {
    localStorage.setItem('quiz_progress', JSON.stringify({ currentIndex, answers }))
  }, [currentIndex, answers])

  if (error) return <div className="loading" style={{color: '#e65100'}}>{error}</div>
  if (!questionData) return <QuizSkeleton />

  const question = questionData.questions[currentIndex]
  const progress = ((currentIndex + 1) / questionData.questions.length) * 100

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [question.question_id]: value })
  }

  const handleNext = () => {
    if (currentIndex < questionData.questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      const userProfile = calculateUserProfile(answers, questionData.questions)
      const consistency = checkConsistency(answers, questionData.consistency_checks)
      localStorage.removeItem('quiz_progress')
      onComplete({ userProfile, answers, consistency })
    }
  }

  const checkConsistency = (answers: Record<string, number>, checks: string[]) => {
    if (!checks || checks.length < 2) return 1
    const values = checks.map(qid => answers[qid]).filter(v => v !== undefined)
    if (values.length < 2) return 1
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length
    return Math.max(0, 1 - variance / 10)
  }

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1)
  }

  const currentAnswer = answers[question.question_id]

  return (
    <div className="quiz">
      <div className="quiz-header">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-text">
          {currentIndex + 1} / {questionData.questions.length}
        </p>
      </div>

      <div className="quiz-content">
        <h2 className="question-text">{question.text}</h2>

        <div className="scale-container">
          {Array.from({ length: question.scale.max - question.scale.min + 1 }, (_, i) => {
            const value = question.scale.min + i
            return (
              <button
                key={value}
                className={`scale-button ${currentAnswer === value ? 'selected' : ''}`}
                onClick={() => handleAnswer(value)}
              >
                {value}
              </button>
            )
          })}
        </div>

        <div className="scale-labels">
          <span>{question.scale.labels[0]}</span>
          <span>{question.scale.labels[1]}</span>
        </div>

        <div className="quiz-nav">
          <button 
            className="nav-button" 
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            上一题
          </button>
          <button 
            className="nav-button primary" 
            onClick={handleNext}
            disabled={currentAnswer === undefined}
          >
            {currentIndex === questionData.questions.length - 1 ? '完成' : '下一题'}
          </button>
        </div>
      </div>
    </div>
  )
}
