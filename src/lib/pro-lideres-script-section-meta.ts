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

/** Preset de ferramenta do guiado ou null. */
export function clipToolPresetKey(v: unknown): string | null {
  if (v === null || v === undefined) return null
  const s = String(v).trim().slice(0, 80)
  if (!s) return null
  if (s === 'outra') return null
  const ok = ALL_SCRIPT_TOOL_ROWS.some((r) => r.id === s)
  return ok ? s : null
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
}

export const DEFAULT_SCRIPT_LIBRARY_FILTERS: ScriptLibraryFilters = {
  focus: 'todos',
  intention: 'todos',
  tool: 'todos',
}

type SectionFilterSlice = {
  focus_main?: 'vendas' | 'recrutamento'
  intention_key?: string
  tool_preset_key?: string | null
  ylada_link_id?: string | null
}

export function sectionMatchesLibraryFilters(s: SectionFilterSlice, f: ScriptLibraryFilters): boolean {
  const focus = s.focus_main ?? 'vendas'
  const intention = (s.intention_key ?? 'geral').toLowerCase()
  const toolKey = s.tool_preset_key ?? null
  if (f.focus !== 'todos' && focus !== f.focus) return false
  if (f.intention !== 'todos' && intention !== f.intention.toLowerCase()) return false
  if (f.tool === 'todos') return true
  if (f.tool === '__ylada__') return !!s.ylada_link_id
  return toolKey === f.tool
}
