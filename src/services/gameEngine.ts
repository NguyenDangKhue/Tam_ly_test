import { GAME_CONFIG } from '../constants/game'
import type { AppData, Choice, GameState, Scenario } from '../types'

/** Câu 1 → 5 tuổi, câu 2 → 6 tuổi, ... (mỗi câu +1 tuổi, bốc ngẫu nhiên 1/10 TH của tuổi đó) */
export function getSessionAges(data: AppData): number[] {
  return Array.from(
    { length: data.totalQuestions },
    (_, i) => data.minAge + i,
  )
}

export function getAgeForQuestion(questionIndex: number, data: AppData): number {
  return data.minAge + questionIndex
}

export function getScenariosForAge(scenarios: Scenario[], age: number): Scenario[] {
  return scenarios
    .filter((s) => s.age === age)
    .sort((a, b) => a.slot - b.slot)
}

export function pickRandomScenario(scenarios: Scenario[], age: number): Scenario | null {
  const pool = getScenariosForAge(scenarios, age)
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

export function drawScenariosForSession(data: AppData, ages: number[]): Scenario[] {
  return ages.map((age) => {
    const picked = pickRandomScenario(data.scenarios, age)
    if (picked) return picked
    return {
      id: `placeholder-${age}`,
      age,
      slot: 0,
      title: `Chưa có tình huống (tuổi ${age})`,
      situation: `Admin chưa thêm tình huống cho độ tuổi ${age}. Vui lòng bổ sung trong phần quản trị.`,
      choices: [
        {
          id: `placeholder-choice-${age}`,
          text: 'Tiếp tục',
          result: 'Tình huống mẫu — cần admin bổ sung nội dung.',
          emotionDelta: 0,
          logicDelta: 0,
        },
      ],
    }
  })
}

export function initGame(data: AppData): GameState {
  const ages = getSessionAges(data)
  const scenarios = drawScenariosForSession(data, ages)
  return {
    questionIndex: 0,
    ages,
    scenarios,
    emotionScore: data.initialEmotionScore,
    logicScore: data.initialLogicScore,
    answers: [],
    finished: false,
  }
}

export function clampScore(value: number): number {
  return Math.max(GAME_CONFIG.MIN_SCORE, Math.min(GAME_CONFIG.MAX_SCORE, value))
}

export function applyChoice(state: GameState, choice: Choice): GameState {
  const scenario = state.scenarios[state.questionIndex]
  const newEmotion = clampScore(state.emotionScore + choice.emotionDelta)
  const newLogic = clampScore(state.logicScore + choice.logicDelta)
  const answer = {
    scenarioId: scenario.id,
    choiceId: choice.id,
    age: scenario.age,
    emotionDelta: choice.emotionDelta,
    logicDelta: choice.logicDelta,
  }

  return {
    ...state,
    emotionScore: newEmotion,
    logicScore: newLogic,
    answers: [...state.answers, answer],
  }
}

export function advanceQuestion(state: GameState): GameState {
  const nextIndex = state.questionIndex + 1
  if (nextIndex >= state.scenarios.length) {
    return { ...state, finished: true }
  }
  return { ...state, questionIndex: nextIndex }
}

export interface ScoreInterpretation {
  title: string
  description: string
  emotionLabel: string
  logicLabel: string
}

export function interpretScores(emotion: number, logic: number): ScoreInterpretation {
  const emotionLabel =
    emotion >= 70 ? 'Phong phú' : emotion >= 40 ? 'Cân bằng' : 'Hạn chế'
  const logicLabel =
    logic >= 70 ? 'Phát triển tốt' : logic >= 40 ? 'Trung bình' : 'Cần củng cố'

  let title = 'Hồ sơ phát triển đa chiều'
  let description =
    'Kết quả phản ánh xu hướng phản ứng qua các tình huống — không phải đánh giá y khoa. Mỗi lựa chọn thể hiện sự cân bằng giữa thấu hiểu cảm xúc và tư duy lý trí khi đối diện hoàn cảnh của trẻ.'

  if (emotion >= 65 && logic >= 65) {
    title = 'Cân bằng tình cảm & lý trí'
    description =
      'Bạn thường vừa thấu hiểu cảm xúc trẻ, vừa xử lý tình huống có hệ thống. Đây là nền tảng tốt để đồng hành cùng trẻ qua các giai đoạn phát triển.'
  } else if (emotion >= 65 && logic < 45) {
    title = 'Ưu tiên thấu cảm'
    description =
      'Bạn nhạy cảm với cảm xúc trẻ, đôi khi ưu tiên an ủi hơn phân tích. Có thể bổ sung thêm góc nhìn lý trí để hỗ trợ trẻ hiểu hậu quả hành vi.'
  } else if (emotion < 45 && logic >= 65) {
    title = 'Ưu tiên lý trí'
    description =
      'Bạn xử lý tình huống có cấu trúc, rõ ràng. Nên dành thêm không gian lắng nghe cảm xúc để trẻ cảm thấy được thấu hiểu trước khi nhận hướng dẫn.'
  } else if (emotion < 45 && logic < 45) {
    title = 'Cần thêm kỹ năng đồng hành'
    description =
      'Các lựa chọn cho thấy bạn có thể cần thêm công cụ — cả về thấu hiểu cảm xúc lẫn xử lý tình huống có hệ thống. Đây là cơ hội học hỏi, không phải điểm yếu.'
  }

  return { title, description, emotionLabel, logicLabel }
}

export function formatDelta(value: number): string {
  if (value > 0) return `+${value}`
  if (value < 0) return `${value}`
  return '0'
}
