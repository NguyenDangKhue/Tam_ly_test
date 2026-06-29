import type { AppData, Choice, Scenario } from '../types'

function makeId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

interface NestedAgeGroup {
  age: number
  scenarios: Array<{
    id?: string
    title: string
    situation: string
    choices: Array<{
      id?: string
      text: string
      result: string
      emotionDelta: number
      logicDelta: number
    }>
  }>
}

function parseSlotFromId(id: string, index: number): number {
  const match = id.match(/th(\d+)$/i)
  if (match) return Number(match[1])
  return index + 1
}

function normalizeChoice(
  raw: NestedAgeGroup['scenarios'][0]['choices'][0],
  scenarioId: string,
  index: number,
): Choice {
  return {
    id: raw.id ?? `${scenarioId}-c${index + 1}`,
    text: raw.text,
    result: raw.result,
    emotionDelta: raw.emotionDelta ?? 0,
    logicDelta: raw.logicDelta ?? 0,
  }
}

function normalizeScenario(
  raw: NestedAgeGroup['scenarios'][0],
  age: number,
  index: number,
): Scenario {
  const id = raw.id ?? `age${age}-th${index + 1}`
  return {
    id,
    age,
    slot: parseSlotFromId(id, index),
    title: raw.title,
    situation: raw.situation,
    choices: (raw.choices ?? []).map((c, i) => normalizeChoice(c, id, i)),
  }
}

function isNestedFormat(data: Record<string, unknown>): boolean {
  const scenarios = data.scenarios
  if (!Array.isArray(scenarios) || scenarios.length === 0) return false
  const first = scenarios[0] as Record<string, unknown>
  return typeof first.age === 'number' && Array.isArray(first.scenarios)
}

function isFlatFormat(data: Record<string, unknown>): boolean {
  const scenarios = data.scenarios
  if (!Array.isArray(scenarios) || scenarios.length === 0) return true
  const first = scenarios[0] as Record<string, unknown>
  return (
    typeof first.age === 'number' &&
    typeof first.title === 'string' &&
    !Array.isArray(first.scenarios)
  )
}

export function normalizeImportedData(raw: unknown, existing?: AppData): AppData {
  if (!raw || typeof raw !== 'object') {
    throw new Error('File JSON không hợp lệ')
  }

  const data = raw as Record<string, unknown>
  let scenarios: Scenario[] = []

  if (isNestedFormat(data)) {
    const groups = data.scenarios as NestedAgeGroup[]
    for (const group of groups) {
      if (!Array.isArray(group.scenarios)) continue
      group.scenarios.forEach((s, i) => {
        scenarios.push(normalizeScenario(s, group.age, i))
      })
    }
  } else if (isFlatFormat(data)) {
    const flat = data.scenarios as Array<Partial<Scenario> & { choices?: Partial<Choice>[] }>
    scenarios = flat.map((s, i) => {
      const id = s.id ?? makeId('scenario')
      return {
        id,
        age: s.age ?? existing?.minAge ?? 5,
        slot: s.slot ?? parseSlotFromId(id, i),
        title: s.title ?? 'Tình huống',
        situation: s.situation ?? '',
        choices: (s.choices ?? []).map((c, ci) =>
          normalizeChoice(c as NestedAgeGroup['scenarios'][0]['choices'][0], id, ci),
        ),
      }
    })
  } else {
    throw new Error('File JSON không đúng định dạng. Cần có mảng scenarios.')
  }

  if (scenarios.length === 0) {
    throw new Error('File không có tình huống nào')
  }

  return {
    title: (data.title as string) ?? existing?.title ?? 'Đồng Hành Cùng Trẻ',
    description: (data.description as string) ?? existing?.description ?? '',
    totalQuestions: (data.totalQuestions as number) ?? existing?.totalQuestions ?? 15,
    minAge: (data.minAge as number) ?? existing?.minAge ?? 5,
    maxAge: (data.maxAge as number) ?? existing?.maxAge ?? 20,
    scenariosPerAge: (data.scenariosPerAge as number) ?? existing?.scenariosPerAge ?? 10,
    initialEmotionScore:
      (data.initialEmotionScore as number) ?? existing?.initialEmotionScore ?? 50,
    initialLogicScore:
      (data.initialLogicScore as number) ?? existing?.initialLogicScore ?? 50,
    scenarios,
  }
}

export function isValidAppData(data: unknown): data is AppData {
  if (!data || typeof data !== 'object') return false
  const d = data as AppData
  if (!Array.isArray(d.scenarios) || typeof d.totalQuestions !== 'number') return false

  if (isNestedFormat(d as unknown as Record<string, unknown>)) return true

  return d.scenarios.every(
    (s) =>
      typeof s.age === 'number' &&
      typeof s.title === 'string' &&
      Array.isArray(s.choices) &&
      s.choices.every(
        (c) =>
          typeof c.text === 'string' &&
          typeof c.emotionDelta === 'number' &&
          typeof c.logicDelta === 'number',
      ),
  )
}
