import type { NinaSupportUi } from '@/lib/ylada-nina-support-prompt'

export interface NinaSupportQuickChip {
  label: string
  /** Texto enviado ao chat da Nina ao clicar. */
  message: string
}

const MATRIX_BASE_CHIPS: NinaSupportQuickChip[] = [
  { label: 'Conta', message: 'Como altero senha e dados da conta?' },
  { label: 'Links', message: 'Onde ficam meus links e como compartilho?' },
  { label: 'Leads', message: 'Onde vejo leads?' },
  { label: 'Plano', message: 'Onde vejo assinatura e pagamentos?' },
  { label: 'Falar com a equipe', message: 'Preciso falar com alguém da equipe (WhatsApp ou chamado).' },
  {
    label: 'Prévia no WhatsApp',
    message: 'No WhatsApp, a imagem ou o título do meu link aparece errado.',
  },
]

const NUTRI_EXTRA: NinaSupportQuickChip = {
  label: 'Cancelamento',
  message: 'Como cancelo minha assinatura?',
}

const WELLNESS_CHIPS: NinaSupportQuickChip[] = [
  { label: 'Noel', message: 'Onde abro o Noel no Wellness?' },
  { label: 'Links', message: 'Onde ficam meus links?' },
  { label: 'Configurações', message: 'Onde altero dados da conta?' },
  { label: 'Perfil', message: 'Onde fica meu perfil e minhas metas?' },
  { label: 'Suporte', message: 'Como falo com o suporte?' },
  { label: 'Prévia no WhatsApp', message: 'No WhatsApp, imagem ou título do link errados.' },
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
    const idx = chips.findIndex((c) => c.label === 'Plano')
    if (idx >= 0) {
      chips.splice(idx + 1, 0, NUTRI_EXTRA)
    } else {
      chips.push(NUTRI_EXTRA)
    }
  }
  return chips
}
