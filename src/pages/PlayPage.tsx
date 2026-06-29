import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/Button'
import { QuizPlayer } from '../components/QuizPlayer'
import { GameResult } from '../components/GameResult'
import { ScoreBoard } from '../components/ScoreBoard'
import { useAppData } from '../context/DataContext'
import { initGame, applyChoice, advanceQuestion } from '../services/gameEngine'
import type { Choice, GameState } from '../types'

type PlayPhase = 'intro' | 'playing' | 'finished'

export function PlayPage() {
  const { data } = useAppData()
  const [phase, setPhase] = useState<PlayPhase>('intro')
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [selectedChoice, setSelectedChoice] = useState<Choice | null>(null)
  const [quizKey, setQuizKey] = useState(0)

  const currentScenario = gameState?.scenarios[gameState.questionIndex]
  const questionNumber = (gameState?.questionIndex ?? 0) + 1
  const isLastQuestion = gameState
    ? gameState.questionIndex === gameState.scenarios.length - 1
    : false

  const startGame = () => {
    const state = initGame(data)
    setGameState(state)
    setSelectedChoice(null)
    setPhase('playing')
    setQuizKey((k) => k + 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleChoiceSelect = (choice: Choice) => {
    if (!gameState || selectedChoice) return
    setGameState(applyChoice(gameState, choice))
    setSelectedChoice(choice)
  }

  const handleNext = () => {
    if (!gameState) return
    const advanced = advanceQuestion(gameState)
    if (advanced.finished) {
      setGameState(advanced)
      setPhase('finished')
    } else {
      setGameState(advanced)
      setSelectedChoice(null)
      setQuizKey((k) => k + 1)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePlayAgain = () => {
    startGame()
  }

  if (phase === 'intro') {
    return (
      <Layout showFooter={false}>
        <div className="max-w-lg mx-auto py-8 space-y-6 animate-fade-in">
          <div className="text-center">
            <h2 className="text-2xl font-serif font-bold text-calm-800 mb-3">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-calm-600 leading-relaxed">
              Bạn sẽ trả lời <strong>{data.totalQuestions} câu</strong> — mỗi câu tương ứng{' '}
              <strong>một độ tuổi</strong> của trẻ, tăng dần từ{' '}
              <strong>{data.minAge} đến {data.minAge + data.totalQuestions - 1} tuổi</strong>.
              
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
              {Array.from({ length: data.totalQuestions }, (_, i) => (
                <span key={i} className="px-2 py-1 bg-white rounded-lg border border-calm-100 text-calm-600">
                  Câu {i + 1}: {data.minAge + i}t
                </span>
              ))}
            </div>
          </div>

          <ScoreBoard
            emotionScore={data.initialEmotionScore}
            logicScore={data.initialLogicScore}
          />

          <div className="bg-calm-50 rounded-2xl p-4 text-sm text-calm-600 space-y-2">
            <p>💗 <strong>Tình cảm</strong> — tăng khi lựa chọn thấu hiểu cảm xúc trẻ</p>
            <p>🧠 <strong>Lý trí</strong> — tăng khi xử lý tình huống có hệ thống, hợp lý</p>
            <p className="text-xs text-calm-400 pt-1">Mỗi phương án có thể cộng hoặc trừ điểm ở cả hai cột.</p>
          </div>

          <Button onClick={startGame} size="lg" className="w-full">
            Bắt đầu {data.totalQuestions} câu
          </Button>

          <div className="text-center">
            <Link to="/" className="text-sm text-calm-500 hover:text-calm-700">
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  if (phase === 'finished' && gameState) {
    return (
      <Layout showFooter={false}>
        <GameResult gameState={gameState} onPlayAgain={handlePlayAgain} />
      </Layout>
    )
  }

  if (!gameState || !currentScenario) {
    return (
      <Layout>
        <div className="text-center py-16">
          <p className="text-calm-600 mb-4">Không đủ dữ liệu tình huống để chơi.</p>
          <Link to="/">
            <Button variant="outline">Về trang chủ</Button>
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout showFooter={false}>
      <QuizPlayer
        key={quizKey}
        scenario={currentScenario}
        questionNumber={questionNumber}
        totalQuestions={gameState.scenarios.length}
        emotionScore={gameState.emotionScore}
        logicScore={gameState.logicScore}
        onChoiceSelect={handleChoiceSelect}
        onNext={handleNext}
        selectedChoice={selectedChoice}
        isLastQuestion={isLastQuestion}
      />
    </Layout>
  )
}
