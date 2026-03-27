import { getYladaAreaPathPrefix } from '@/config/ylada-areas'
import type { NinaSupportUi } from '@/lib/ylada-nina-support-prompt'

export interface NinaSupportQuickChip {
  label: string
  /** Texto enviado ao chat da Nina ao clicar. */
  message: string
}

/**
 * Rota do Noel (mentor) no app — matriz: `/pt/{area}/home`; Wellness: `/pt/wellness/noel`.
 */
export function getNinaNoelHref(params: {
  areaCodigo: string
  supportUi: NinaSupportUi
}): string {
  if (params.supportUi === 'wellness') return '/pt/wellness/noel'
  const prefix = getYladaAreaPathPrefix(params.areaCodigo)
  return `${prefix}/home`
}

const MATRIX_BASE_CHIPS: NinaSupportQuickChip[] = [
  {
    label: 'Senha e conta',
    message: 'Onde altero minha senha e os dados da minha conta?',
  },
  {
    label: 'Meus links',
    message: 'Onde encontro meus links e como compartilho?',
  },
  {
    label: 'Leads',
    message: 'Onde vejo leads e conversas?',
  },
  {
    label: 'Assinatura',
    message: 'Onde vejo minha assinatura, plano e pagamentos?',
  },
  {
    label: 'Chamado técnico',
    message: 'Como abro um chamado de suporte para bug ou melhoria?',
  },
  {
    label: 'Prévia no WhatsApp',
    message:
      'Ao compartilhar o link no WhatsApp a imagem ou o título aparece errado. O que fazer?',
  },
]

const NUTRI_EXTRA: NinaSupportQuickChip = {
  label: 'Cancelar assinatura',
  message: 'Como funciona o cancelamento da minha assinatura?',
}

const WELLNESS_CHIPS: NinaSupportQuickChip[] = [
  {
    label: 'Onde fica o NOEL',
    message: 'Onde abro o NOEL no app Wellness?',
  },
  {
    label: 'Meus links',
    message: 'Onde ficam meus links na área Wellness?',
  },
  {
    label: 'Configurações',
    message: 'Onde altero dados da conta e configurações?',
  },
  {
    label: 'Perfil e metas',
    message: 'Onde fica meu perfil e minhas metas?',
  },
  {
    label: 'Chamado de suporte',
    message: 'Como abro um chamado de suporte?',
  },
  {
    label: 'Prévia no WhatsApp',
    message: 'O link no WhatsApp mostra imagem ou título errado.',
  },
]

export function getNinaSupportQuickChips(params: {
  supportUi: NinaSupportUi
  areaCodigo: string
}): NinaSupportQuickChip[] {
  if (params.supportUi === 'wellness') {
    return [...WELLNESS_CHIPS]
  }
  const chips = [...MATRIX_BASE_CHIPS]
  if (params.areaCodigo === 'nutri') {
    const idx = chips.findIndex((c) => c.label === 'Assinatura')
    if (idx >= 0) {
      chips.splice(idx + 1, 0, NUTRI_EXTRA)
    } else {
      chips.push(NUTRI_EXTRA)
    }
  }
  return chips
}
