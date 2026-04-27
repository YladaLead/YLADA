/**
 * Contas só **Pro Estética Capilar** — números ilustrativos na tela Ritmo (demo).
 * Alinhado aos e-mails bootstrap em `pro-estetica-capilar-server` e ao script SQL demo.
 */
export const PRO_ESTETICA_CAPILAR_RITMO_DEMO_EMAILS = [
  'demo@proesteticacapilar.com',
  'demo.capilar@ylada.app',
] as const

export function shouldShowProEsteticaCapilarRitmoPlacebo(email: string | null | undefined): boolean {
  if (!email) return false
  const n = email.trim().toLowerCase()
  return (PRO_ESTETICA_CAPILAR_RITMO_DEMO_EMAILS as readonly string[]).includes(n)
}

/** Valores apenas para modo demonstração (rótulo visível na UI). */
export const PRO_ESTETICA_CAPILAR_RITMO_PLACEBO_METRICS = {
  conversas: 18,
  respostas: 9,
  acoes: 12,
  diasAtivos: 4,
  diasTotal: 7,
  semanaPassada: 10,
  semanaAtual: 18,
  evolucaoPct: 80,
} as const
