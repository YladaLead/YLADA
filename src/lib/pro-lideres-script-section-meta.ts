import {
  ALL_SCRIPT_TOOL_ROWS,
  PL_SCRIPT_GUIDED_OBJECTIVES,
} from '@/lib/pro-lideres-script-guided-briefing'

export const PL_SCRIPT_SECTION_FOCUS_OPTIONS = [
  { id: 'vendas', label: 'Vendas' },
  { id: 'recrutamento', label: 'Recrutamento' },
] as const

export type PlScriptSectionFocusId = (typeof PL_SCRIPT_SECTION_FOCUS_OPTIONS)[number]['id']

const FOCUS_SET = new Set<string>(PL_SCRIPT_SECTION_FOCUS_OPTIONS.map((x) => x.id))

const OBJECTIVE_IDS = new Set(PL_SCRIPT_GUIDED_OBJECTIVES.map((o) => o.id))

export const PL_SCRIPT_SECTION_INTENTION_OPTIONS: { id: string; label: string }[] = [
  { id: 'geral', label: 'Geral' },
  ...PL_SCRIPT_GUIDED_OBJECTIVES.map((o) => ({ id: o.id, label: o.label })),
]

export function normalizeFocusMain(v: unknown): PlScriptSectionFocusId {
  const s = typeof v === 'string' ? v.trim().toLowerCase() : ''
  if (s === 'recrutamento') return 'recrutamento'
  return 'vendas'
}

export function normalizeIntentionKey(v: unknown): string {
  const s = typeof v === 'string' ? v.trim().toLowerCase() : ''
  if (s && (OBJECTIVE_IDS.has(s) || s === 'geral')) return s
  return 'geral'
}

/** Aliases de presets antigos → id atual (ex.: migration de labels). */
const TOOL_PRESET_LEGACY_IDS: Record<string, string> = {
  desafio_dias: 'desafio_21',
}

/** Preset de ferramenta do guiado ou null. */
export function clipToolPresetKey(v: unknown): string | null {
  if (v === null || v === undefined) return null
  const s = String(v).trim().slice(0, 80)
  if (!s) return null
  if (s === 'outra') return null
  const mapped = TOOL_PRESET_LEGACY_IDS[s] ?? s
  const ok = ALL_SCRIPT_TOOL_ROWS.some((r) => r.id === mapped)
  return ok ? mapped : null
}

export function focusLabel(id: string): string {
  return PL_SCRIPT_SECTION_FOCUS_OPTIONS.find((x) => x.id === id)?.label ?? id
}

export function intentionLabel(id: string): string {
  return PL_SCRIPT_SECTION_INTENTION_OPTIONS.find((x) => x.id === id)?.label ?? id
}

export function toolPresetLabelFromKey(key: string | null | undefined): string | null {
  if (!key?.trim()) return null
  const row = ALL_SCRIPT_TOOL_ROWS.find((r) => r.id === key.trim())
  return row?.label ?? key
}

export function isValidFocusMain(s: string): boolean {
  return FOCUS_SET.has(s)
}

export type ScriptLibraryFilters = {
  focus: 'todos' | 'vendas' | 'recrutamento'
  intention: string
  tool: string
  /** `todos` ou id de PL_SCRIPT_CONVERSATION_STAGE_OPTIONS */
  stage: 'todos' | (typeof PL_SCRIPT_CONVERSATION_STAGE_OPTIONS)[number]['id']
}

/** Momento da conversa (biblioteca YLADA + secções com metadados). */
export const PL_SCRIPT_CONVERSATION_STAGE_OPTIONS = [
  { id: 'primeiro_contato', label: 'Primeiro contacto' },
  { id: 'pos_interesse', label: 'Depois de interesse' },
  { id: 'convite', label: 'Convite / direcionar' },
  { id: 'reativacao', label: 'Reativação' },
  { id: 'fechamento', label: 'Fechamento' },
  { id: 'objecao', label: 'Objeções' },
  { id: 'indicacao', label: 'Indicação' },
  { id: 'acompanhamento', label: 'Acompanhamento' },
] as const

const STAGE_IDS = new Set(PL_SCRIPT_CONVERSATION_STAGE_OPTIONS.map((x) => x.id))

export function conversationStageLabel(id: string | null | undefined): string | null {
  if (!id?.trim()) return null
  return PL_SCRIPT_CONVERSATION_STAGE_OPTIONS.find((x) => x.id === id)?.label ?? id
}

export function normalizeConversationStage(v: unknown): string | null {
  const s = typeof v === 'string' ? v.trim().toLowerCase() : ''
  if (!s || !STAGE_IDS.has(s)) return null
  return s
}

export const DEFAULT_SCRIPT_LIBRARY_FILTERS: ScriptLibraryFilters = {
  focus: 'todos',
  intention: 'todos',
  tool: 'todos',
  stage: 'todos',
}

type SectionFilterSlice = {
  focus_main?: 'vendas' | 'recrutamento'
  intention_key?: string
  tool_preset_key?: string | null
  ylada_link_id?: string | null
  conversation_stage?: string | null
}

export function sectionMatchesLibraryFilters(s: SectionFilterSlice, f: ScriptLibraryFilters): boolean {
  const focus = s.focus_main ?? 'vendas'
  const intention = (s.intention_key ?? 'geral').toLowerCase()
  const toolKey = clipToolPresetKey(s.tool_preset_key) ?? s.tool_preset_key ?? null
  const stage = (s.conversation_stage ?? '').trim().toLowerCase()
  if (f.focus !== 'todos' && focus !== f.focus) return false
  if (f.intention !== 'todos' && intention !== f.intention.toLowerCase()) return false
  if (f.stage !== 'todos' && stage !== f.stage) return false
  if (f.tool === 'todos') return true
  if (f.tool === '__ylada__') return !!s.ylada_link_id
  return toolKey === f.tool
}
