/** Dimensões de filtro de `prolider_scripts` (Y-Scripts / Ferramentas). */

export type ProliderScriptStage = 'gerar_contato' | 'abordagem' | 'followup' | 'objecoes'
export type ProliderScriptPublico = 'geral' | 'lista_quente' | 'lista_fria' | 'indicacao'
export type ProliderScriptCanal = 'geral' | 'presencial' | 'online'

export type ProliderScriptStageFilter = ProliderScriptStage | 'todos'
export type ProliderScriptPublicoFilter = ProliderScriptPublico | 'todos'
export type ProliderScriptCanalFilter = ProliderScriptCanal | 'todos'

export const PROLIDER_SCRIPT_STAGES: {
  key: ProliderScriptStage
  label: string
  shortLabel: string
  desc?: string
}[] = [
  {
    key: 'gerar_contato',
    label: '📣 Abertura',
    shortLabel: 'Abertura',
    desc: 'Primeira mensagem — desperta curiosidade e pede permissão',
  },
  {
    key: 'abordagem',
    label: '💬 Primeiro contato',
    shortLabel: 'Primeiro contato',
    desc: 'Quando a pessoa responde — aprofunde e entenda a situação',
  },
  {
    key: 'followup',
    label: '🔁 Acompanhamento',
    shortLabel: 'Acompanhamento',
    desc: 'Após visita, experimentação ou silêncio prolongado',
  },
  {
    key: 'objecoes',
    label: '🛡️ Objeções',
    shortLabel: 'Objeções',
    desc: 'Respostas para dúvidas e resistências comuns',
  },
]

export const PROLIDER_SCRIPT_PUBLICOS: {
  key: ProliderScriptPublico
  label: string
  badge: string
}[] = [
  { key: 'lista_quente', label: '🔥 Conhecido', badge: 'bg-orange-100 text-orange-700' },
  { key: 'lista_fria', label: '❄️ Não conhecido', badge: 'bg-sky-100 text-sky-700' },
  { key: 'indicacao', label: '🤝 Indicação', badge: 'bg-purple-100 text-purple-700' },
]

export const PROLIDER_SCRIPT_CANAIS: {
  key: ProliderScriptCanal
  label: string
  badge: string
}[] = [
  { key: 'presencial', label: '🏠 Presencial', badge: 'bg-green-100 text-green-700' },
  { key: 'online', label: '📱 Online', badge: 'bg-indigo-100 text-indigo-700' },
]

export function proLiderScriptPublicoInfo(c?: ProliderScriptPublico | string | null) {
  return PROLIDER_SCRIPT_PUBLICOS.find((x) => x.key === (c ?? 'geral')) ?? null
}

export function proLiderScriptCanalInfo(c?: ProliderScriptCanal | string | null) {
  return PROLIDER_SCRIPT_CANAIS.find((x) => x.key === (c ?? 'geral')) ?? null
}

export function proLiderScriptMatchesStageFilter(
  scriptStage: string | null | undefined,
  filter: ProliderScriptStageFilter
): boolean {
  if (filter === 'todos') return true
  return scriptStage === filter
}

/** Scripts com `geral` aparecem em qualquer filtro de público. */
export function proLiderScriptMatchesPublicoFilter(
  scriptPublico: string | null | undefined,
  filter: ProliderScriptPublicoFilter
): boolean {
  if (filter === 'todos') return true
  const pub = scriptPublico ?? 'geral'
  return pub === 'geral' || pub === filter
}

/** Scripts com `geral` servem para presencial e online. */
export function proLiderScriptMatchesCanalFilter(
  scriptCanal: string | null | undefined,
  filter: ProliderScriptCanalFilter
): boolean {
  if (filter === 'todos') return true
  const canal = scriptCanal ?? 'geral'
  return canal === 'geral' || canal === filter
}

export type ProliderScriptFilterable = {
  stage: string
  contexto?: string | null
  canal?: string | null
}

export function proLiderScriptMatchesFilters(
  script: ProliderScriptFilterable,
  filters: {
    stage: ProliderScriptStageFilter
    publico: ProliderScriptPublicoFilter
    canal: ProliderScriptCanalFilter
  }
): boolean {
  return (
    proLiderScriptMatchesStageFilter(script.stage, filters.stage) &&
    proLiderScriptMatchesPublicoFilter(script.contexto, filters.publico) &&
    proLiderScriptMatchesCanalFilter(script.canal, filters.canal)
  )
}
