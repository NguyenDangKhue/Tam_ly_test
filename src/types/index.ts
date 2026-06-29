export interface Choice {
  id: string
  text: string
  result: string
  emotionDelta: number
  logicDelta: number
}

export interface Scenario {
  id: string
  age: number
  slot: number
  title: string
  situation: string
  choices: Choice[]
}

export interface AppData {
  title: string
  description: string
  totalQuestions: number
  minAge: number
  maxAge: number
  scenariosPerAge: number
  initialEmotionScore: number
  initialLogicScore: number
  scenarios: Scenario[]
}

export interface AdminSession {
  loggedIn: boolean
  timestamp: number
}

export interface GameAnswer {
  scenarioId: string
  choiceId: string
  age: number
  emotionDelta: number
  logicDelta: number
}

export interface GameState {
  questionIndex: number
  ages: number[]
  scenarios: Scenario[]
  emotionScore: number
  logicScore: number
  answers: GameAnswer[]
  finished: boolean
}
