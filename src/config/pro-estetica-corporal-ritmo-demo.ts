/**
 * Contas **só Pro Estética corporal** — números ilustrativos na tela Ritmo (demo).
 * Capilar usa outro e-mail: `demo@proesteticacapilar.com` (ver script SQL e bootstrap capilar).
 */
export const PRO_ESTETICA_CORPORAL_RITMO_DEMO_EMAILS = ['demo@proesteticacorporal.com'] as const

export function shouldShowProEsteticaRitmoPlacebo(email: string | null | undefined): boolean {
  if (!email) return false
  const n = email.trim().toLowerCase()
  return (PRO_ESTETICA_CORPORAL_RITMO_DEMO_EMAILS as readonly string[]).includes(n)
}

/** Valores apenas para modo demonstração (rótulo visível na UI). */
export const PRO_ESTETICA_RITMO_PLACEBO_METRICS = {
  conversas: 18,
  respostas: 9,
  acoes: 12,
  diasAtivos: 4,
  diasTotal: 7,
  semanaPassada: 10,
  semanaAtual: 18,
  evolucaoPct: 80,
} as const
