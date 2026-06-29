import { GAME_CONFIG } from '../constants/game'

interface ScoreBoardProps {
  emotionScore: number
  logicScore: number
  showLabels?: boolean
  compact?: boolean
}

export function ScoreBoard({
  emotionScore,
  logicScore,
  showLabels = true,
  compact = false,
}: ScoreBoardProps) {
  return (
    <div className={`grid grid-cols-2 gap-3 ${compact ? '' : 'sm:gap-4'}`}>
      <ScoreColumn
        label="Tình cảm"
        score={emotionScore}
        icon="💗"
        gradient="from-rose-400 to-pink-500"
        bgLight="bg-rose-50"
        border="border-rose-200"
        text="text-rose-800"
        showLabel={showLabels}
        compact={compact}
      />
      <ScoreColumn
        label="Lý trí"
        score={logicScore}
        icon="🧠"
        gradient="from-calm-400 to-calm-600"
        bgLight="bg-calm-50"
        border="border-calm-200"
        text="text-calm-800"
        showLabel={showLabels}
        compact={compact}
      />
    </div>
  )
}

function ScoreColumn({
  label,
  score,
  icon,
  gradient,
  bgLight,
  border,
  text,
  showLabel,
  compact,
}: {
  label: string
  score: number
  icon: string
  gradient: string
  bgLight: string
  border: string
  text: string
  showLabel: boolean
  compact: boolean
}) {
  const pct = Math.max(0, Math.min(100, score))

  return (
    <div className={`rounded-2xl border ${border} ${bgLight} ${compact ? 'p-3' : 'p-4'} shadow-card`}>
      {showLabel && (
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{icon}</span>
          <span className={`text-sm font-semibold ${text}`}>{label}</span>
        </div>
      )}
      <div className={`font-bold ${text} ${compact ? 'text-2xl' : 'text-3xl'} mb-2`}>
        {score}
        <span className="text-xs font-normal opacity-60"> / {GAME_CONFIG.MAX_SCORE}</span>
      </div>
      <div className="h-2.5 bg-white/80 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
