export const GAME_CONFIG = {
  TOTAL_QUESTIONS: 15,
  MIN_AGE: 5,
  MAX_AGE: 20,
  SCENARIOS_PER_AGE: 10,
  INITIAL_EMOTION: 50,
  INITIAL_LOGIC: 50,
  MIN_SCORE: 0,
  MAX_SCORE: 100,
} as const

export const AGE_RANGE = Array.from(
  { length: GAME_CONFIG.MAX_AGE - GAME_CONFIG.MIN_AGE + 1 },
  (_, i) => GAME_CONFIG.MIN_AGE + i,
)
