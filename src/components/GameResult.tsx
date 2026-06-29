import { Link } from 'react-router-dom'
import type { GameState } from '../types'
import { Card } from './Card'
import { Button } from './Button'
import { ScoreBoard } from './ScoreBoard'
import { interpretScores } from '../services/gameEngine'

interface GameResultProps {
  gameState: GameState
  onPlayAgain: () => void
}

export function GameResult({ gameState, onPlayAgain }: GameResultProps) {
  const interpretation = interpretScores(gameState.emotionScore, gameState.logicScore)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <span className="inline-block px-4 py-1.5 text-sm font-medium text-sage-700 bg-sage-100 rounded-full mb-4">
          Hoàn thành {gameState.answers.length} câu
        </span>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-calm-800 mb-2">
          {interpretation.title}
        </h2>
        <p className="text-calm-600 max-w-xl mx-auto leading-relaxed">
          {interpretation.description}
        </p>
      </div>

      <ScoreBoard
        emotionScore={gameState.emotionScore}
        logicScore={gameState.logicScore}
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="!p-4 text-center">
          <p className="text-2xl mb-1">💗</p>
          <p className="text-sm text-calm-500">Mức Tình cảm</p>
          <p className="text-lg font-semibold text-rose-700">{interpretation.emotionLabel}</p>
        </Card>
        <Card className="!p-4 text-center">
          <p className="text-2xl mb-1">🧠</p>
          <p className="text-sm text-calm-500">Mức Lý trí</p>
          <p className="text-lg font-semibold text-calm-700">{interpretation.logicLabel}</p>
        </Card>
      </div>

      <Card>
        <h3 className="font-semibold text-calm-800 mb-3">Hành trình {gameState.answers.length} câu</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {gameState.answers.map((a, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-sm py-2 border-b border-calm-50 last:border-0"
            >
              <span className="text-calm-600">
                Câu {i + 1} · Tuổi {a.age}
              </span>
              <span className="font-mono text-xs text-calm-500">
                TC {a.emotionDelta >= 0 ? '+' : ''}{a.emotionDelta} · LT {a.logicDelta >= 0 ? '+' : ''}{a.logicDelta}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <p className="text-xs text-center text-calm-400">
        Kết quả mang tính tham khảo giáo dục, không thay thế tư vấn tâm lý chuyên nghiệp.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button onClick={onPlayAgain} size="lg" variant="secondary">
          Chơi lại
        </Button>
        <Link to="/">
          <Button variant="outline" size="lg">Về trang chủ</Button>
        </Link>
      </div>
    </div>
  )
}
