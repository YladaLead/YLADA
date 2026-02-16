export interface TrilhaNeed {
  id: string
  code: string
  type: 'fundamento' | 'necessidade'
  title: string
  description_short: string | null
  order_index: number
  steps?: TrilhaStep[]
}

export interface TrilhaStep {
  id: string
  need_id: string
  code: string
  title: string
  objective: string
  guidance: string
  checklist_items: string[]
  motivational_phrase: string | null
  order_index: number
}

export interface TrilhaProgress {
  id: string
  user_id: string
  step_id: string
  status: 'not_started' | 'in_progress' | 'stuck' | 'done'
  confidence: number | null
  completed_at: string | null
}
