/**
 * UI e lembretes para `leader_tenant_members.team_access_expires_at`.
 * Alinhado ao gate em `membershipExpiryStillValid` (timestamp completo).
 */

export type ProLideresMemberExpiryUrgency = 'none' | 'info' | 'warning' | 'urgent'

export type ProLideresMemberAccessExpiryUi = {
  /** Sem data de fim ou já expirado — não mostrar banner no painel ativo. */
  showBanner: boolean
  urgency: ProLideresMemberExpiryUrgency
  /** Dias até expirar (arredondado para cima). 0 = expira ainda hoje. null = sem data. */
  daysLeft: number | null
  expiresAtIso: string | null
  /** Botão de renovação / falar com equipe (≤7 dias). */
  showRenewCta: boolean
}

export function isProLideresTeamAccessExpired(
  expiresAt: string | null | undefined,
  nowMs: number = Date.now()
): boolean {
  if (!expiresAt) return false
  const end = new Date(expiresAt).getTime()
  return !Number.isNaN(end) && end <= nowMs
}

/** Dias até o fim do período. Negativo = já expirou. */
export function daysUntilProLideresTeamAccessEnds(
  expiresAt: string | null | undefined,
  nowMs: number = Date.now()
): number | null {
  if (!expiresAt) return null
  const end = new Date(expiresAt).getTime()
  if (Number.isNaN(end)) return null
  return Math.ceil((end - nowMs) / 86400000)
}

export function formatProLideresAccessExpiryDatePtBr(expiresAt: string): string {
  return new Date(expiresAt).toLocaleDateString('pt-BR', { dateStyle: 'long' })
}

export function computeProLideresMemberAccessExpiryUi(
  expiresAt: string | null | undefined,
  nowMs: number = Date.now()
): ProLideresMemberAccessExpiryUi {
  if (!expiresAt || isProLideresTeamAccessExpired(expiresAt, nowMs)) {
    return {
      showBanner: false,
      urgency: 'none',
      daysLeft: null,
      expiresAtIso: expiresAt ?? null,
      showRenewCta: false,
    }
  }

  const daysLeft = daysUntilProLideresTeamAccessEnds(expiresAt, nowMs)
  if (daysLeft === null) {
    return {
      showBanner: false,
      urgency: 'none',
      daysLeft: null,
      expiresAtIso: expiresAt,
      showRenewCta: false,
    }
  }

  let urgency: ProLideresMemberExpiryUrgency = 'info'
  if (daysLeft <= 3) urgency = 'urgent'
  else if (daysLeft <= 7) urgency = 'warning'

  return {
    showBanner: true,
    urgency,
    daysLeft,
    expiresAtIso: expiresAt,
    showRenewCta: daysLeft <= 7,
  }
}

export function proLideresMemberExpiryBannerMessage(ui: ProLideresMemberAccessExpiryUi): string {
  if (!ui.showBanner || !ui.expiresAtIso) return ''
  const dateLabel = formatProLideresAccessExpiryDatePtBr(ui.expiresAtIso)

  if (ui.urgency === 'info') {
    return `Acesso válido até ${dateLabel}.`
  }
  if (ui.urgency === 'warning' && ui.daysLeft != null) {
    return `Seu acesso vence em ${ui.daysLeft} dia${ui.daysLeft === 1 ? '' : 's'} (${dateLabel}). Renove com sua equipe para não perder o acesso.`
  }
  if (ui.daysLeft === 0) {
    return `Seu acesso vence hoje (${dateLabel}).`
  }
  if (ui.daysLeft != null && ui.daysLeft > 0) {
    return `Faltam ${ui.daysLeft} dia${ui.daysLeft === 1 ? '' : 's'} para o fim do seu acesso (${dateLabel}).`
  }
  return `Seu acesso vence em ${dateLabel}.`
}
