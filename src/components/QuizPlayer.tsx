import { useState } from 'react'
import type { Scenario, Choice } from '../types'
import { Card } from './Card'
import { Button } from './Button'
import { ScoreBoard } from './ScoreBoard'
import { formatDelta } from '../services/gameEngine'

interface QuizPlayerProps {
  scenario: Scenario
  questionNumber: number
  totalQuestions: number
  emotionScore: number
  logicScore: number
  onChoiceSelect: (choice: Choice) => void
  onNext: () => void
  selectedChoice: Choice | null
  isLastQuestion: boolean
}

export function QuizPlayer({
  scenario,
  questionNumber,
  totalQuestions,
  emotionScore,
  logicScore,
  onChoiceSelect,
  onNext,
  selectedChoice,
  isLastQuestion,
}: QuizPlayerProps) {
  const [revealed, setRevealed] = useState(false)

  const handleChoiceClick = (choice: Choice) => {
    if (selectedChoice) return
    onChoiceSelect(choice)
    setRevealed(true)
  }

  const progress = (questionNumber / totalQuestions) * 100

  return (
    <div className="space-y-5 animate-fade-in">
      <ScoreBoard emotionScore={emotionScore} logicScore={logicScore} compact />

      <div>
        <div className="flex items-center justify-between text-xs text-calm-500 mb-2">
          <span>Câu {questionNumber} / {totalQuestions}</span>
          <span className="font-semibold text-calm-700">
            Bé {scenario.age} tuổi
          </span>
        </div>
        <div className="h-2 bg-calm-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-calm-400 to-sage-400 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-center">
        <span className="inline-block px-3 py-1 text-xs font-medium text-sage-700 bg-sage-100 rounded-full">
          Tình huống #{scenario.slot || '—'}
        </span>
        <h2 className="mt-3 text-xl sm:text-2xl font-serif font-bold text-calm-800">
          {scenario.title}
        </h2>
      </div>

      <Card variant="situation">
        <h3 className="text-sm font-semibold text-calm-600 uppercase tracking-wide mb-2">
          Hoàn cảnh
        </h3>
        <p className="text-calm-800 leading-relaxed font-serif text-base sm:text-lg">
          {scenario.situation}
        </p>
      </Card>

      <div>
        <h3 className="text-sm font-semibold text-calm-600 uppercase tracking-wide mb-3">
          Bạn sẽ phản ứng thế nào?
        </h3>
        <div className="space-y-3">
          {scenario.choices.map((choice, index) => {
            const isSelected = selectedChoice?.id === choice.id
            const isDisabled = selectedChoice !== null && !isSelected

            return (
              <button
                key={choice.id}
                onClick={() => handleChoiceClick(choice)}
                disabled={isDisabled}
                className={`w-full text-left rounded-2xl border p-4 sm:p-5 transition-all duration-200 ${
                  isSelected
                    ? 'border-calm-500 bg-calm-50 shadow-soft ring-2 ring-calm-200'
                    : isDisabled
                      ? 'border-calm-100 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-calm-100 bg-white hover:border-calm-300 hover:shadow-soft cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isSelected ? 'bg-calm-500 text-white' : 'bg-calm-100 text-calm-600'
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <div className="flex-1">
                    <p className="text-calm-800 leading-relaxed">{choice.text}</p>
                    {isSelected && revealed && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <DeltaBadge label="TC" value={choice.emotionDelta} positive="rose" />
                        <DeltaBadge label="LT" value={choice.logicDelta} positive="calm" />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {selectedChoice && revealed && (
        <>
          <Card variant="result" className="animate-slide-up">
            <h3 className="text-sm font-semibold text-sage-700 uppercase tracking-wide mb-2">
              Phản hồi
            </h3>
            <p className="text-calm-800 leading-relaxed">{selectedChoice.result}</p>
          </Card>

          <div className="flex justify-center pt-2 animate-slide-up">
            <Button onClick={onNext} size="lg">
              {isLastQuestion ? 'Xem kết quả' : 'Câu tiếp theo'}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function DeltaBadge({
  label,
  value,
  positive,
}: {
  label: string
  value: number
  positive: 'rose' | 'calm'
}) {
  const isPos = value > 0
  const isNeg = value < 0
  const color =
    isPos
      ? positive === 'rose'
        ? 'bg-rose-100 text-rose-700'
        : 'bg-calm-100 text-calm-700'
      : isNeg
        ? 'bg-gray-100 text-gray-600'
        : 'bg-gray-50 text-gray-500'

  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {label}: {formatDelta(value)}
    </span>
  )
}
