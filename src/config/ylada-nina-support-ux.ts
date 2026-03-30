import type { NinaSupportUi } from '@/lib/ylada-nina-support-prompt'

export interface NinaSupportQuickChip {
  label: string
  /** Texto enviado ao chat da Nina ao clicar (ignorado se `action` for whatsapp). */
  message: string
  /** Último CTA: abre WhatsApp e notifica a equipe (não envia mensagem ao chat). */
  action?: 'whatsapp'
}

const WHATSAPP_CTA: NinaSupportQuickChip = {
  label: 'Falar por WhatsApp',
  message: '',
  action: 'whatsapp',
}

const MATRIX_BASE_CHIPS: NinaSupportQuickChip[] = [
  { label: 'Conta', message: 'Como altero senha e dados da conta?' },
  { label: 'Links', message: 'Onde ficam meus links e como compartilho?' },
  { label: 'Leads', message: 'Onde vejo leads?' },
  { label: 'Plano', message: 'Onde vejo assinatura e pagamentos?' },
  WHATSAPP_CTA,
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
  WHATSAPP_CTA,
]

export function getNinaSupportQuickChips(params: {
  supportUi: NinaSupportUi
  areaCodigo: string
}): NinaSupportQuickChip[] {
  if (params.supportUi === 'wellness') {
    return [...WELLNESS_CHIPS]
  }
  const chips = MATRIX_BASE_CHIPS.filter((c) => c.action !== 'whatsapp')
  const wa = MATRIX_BASE_CHIPS.find((c) => c.action === 'whatsapp') ?? WHATSAPP_CTA
  if (params.areaCodigo === 'nutri') {
    const idx = chips.findIndex((c) => c.label === 'Plano')
    if (idx >= 0) {
      chips.splice(idx + 1, 0, NUTRI_EXTRA)
    } else {
      chips.push(NUTRI_EXTRA)
    }
  }
  return [...chips, wa]
}
