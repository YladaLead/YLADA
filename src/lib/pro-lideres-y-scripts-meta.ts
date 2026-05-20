/** Etapas de `prolider_scripts.stage` → rótulo e cores Y-Scripts (paleta Ylada). */
export type ProLiderScriptStage = 'gerar_contato' | 'abordagem' | 'followup' | 'objecoes'

export type YScriptCategoryKey =
  | 'abertura'
  | 'primeiro_contato'
  | 'followup'
  | 'objecao'
  | 'resposta'
  | 'convite'

export type YScriptCategoryStyle = {
  key: YScriptCategoryKey
  label: string
  bg: string
  text: string
}

const CATEGORY_BY_STAGE: Record<ProLiderScriptStage, YScriptCategoryStyle> = {
  gerar_contato: {
    key: 'abertura',
    label: 'Abertura',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
  },
  abordagem: {
    key: 'primeiro_contato',
    label: 'Primeiro contato',
    bg: 'bg-teal-50',
    text: 'text-teal-800',
  },
  followup: {
    key: 'followup',
    label: 'Follow-up',
    bg: 'bg-amber-50',
    text: 'text-amber-900',
  },
  objecoes: {
    key: 'objecao',
    label: 'Objeção',
    bg: 'bg-red-50',
    text: 'text-red-800',
  },
}

const FALLBACK_CATEGORY: YScriptCategoryStyle = {
  key: 'resposta',
  label: 'Script',
  bg: 'bg-sky-50',
  text: 'text-sky-800',
}

export function yScriptCategoryFromStage(stage: string | null | undefined): YScriptCategoryStyle {
  if (stage && stage in CATEGORY_BY_STAGE) {
    return CATEGORY_BY_STAGE[stage as ProLiderScriptStage]
  }
  return FALLBACK_CATEGORY
}

/** Destaque de pasta ativa — roxo Ylada */
export const Y_SCRIPTS_ACTIVE_FOLDER_BORDER = 'border-[#7F77DD]'
export const Y_SCRIPTS_ACTIVE_FOLDER_RING = 'ring-2 ring-[#7F77DD]/25'
