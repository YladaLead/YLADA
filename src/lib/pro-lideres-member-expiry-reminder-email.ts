import { FROM_EMAIL, FROM_NAME, isResendConfigured, resend } from '@/lib/resend'
import { formatProLideresAccessExpiryDatePtBr } from '@/lib/pro-lideres-team-access-expiry-ui'

function baseUrlFromEnv() {
  return (
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    'https://www.ylada.com'
  )
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendProLideresMemberAccessExpiryReminderEmail(params: {
  to: string
  memberName: string | null
  teamLabel: string
  accessExpiresAt: string
  daysLeft: number
  kind: '7d' | '3d' | '1d'
  cardUrl?: string | null
  pixUrl?: string | null
}): Promise<{ ok: boolean; error?: string }> {
  if (!isResendConfigured() || !resend) {
    return { ok: false, error: 'Resend não configurado' }
  }

  const base = baseUrlFromEnv()
  const greet = params.memberName?.trim() || 'tudo bem'
  const until = formatProLideresAccessExpiryDatePtBr(params.accessExpiresAt)

  const subjectByKind =
    params.kind === '7d'
      ? `Pro Líderes — seu acesso vence em cerca de 7 dias (${until})`
      : params.kind === '3d'
        ? `Pro Líderes — faltam 3 dias para renovar seu acesso`
        : `Pro Líderes — seu acesso vence amanhã ou hoje`

  const paymentLines: string[] = []
  if (params.pixUrl) paymentLines.push(`<li><a href="${escapeHtml(params.pixUrl)}">Pagar com Pix</a></li>`)
  if (params.cardUrl)
    paymentLines.push(`<li><a href="${escapeHtml(params.cardUrl)}">Cartão / Mercado Pago</a></li>`)
  const paymentBlock =
    paymentLines.length > 0
      ? `<p>Links de pagamento da equipe <strong>${escapeHtml(params.teamLabel)}</strong>:</p><ul>${paymentLines.join('')}</ul>`
      : `<p>Entre em contato com sua equipe (<strong>${escapeHtml(params.teamLabel)}</strong>) para combinar a renovação.</p>`

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111827;padding:24px;max-width:560px;">
  <p>Olá, ${escapeHtml(greet)}.</p>
  <p>Seu acesso ao <strong>Pro Líderes</strong> da equipe <strong>${escapeHtml(params.teamLabel)}</strong> vence em <strong>${escapeHtml(until)}</strong>${params.daysLeft >= 0 ? ` (faltam cerca de ${params.daysLeft} dia${params.daysLeft === 1 ? '' : 's'})` : ''}.</p>
  ${paymentBlock}
  <p><a href="${base}/pro-lideres/membro/renovar">Renovar acesso no painel</a> · <a href="${base}/pro-lideres/entrar">Entrar</a></p>
  <p style="font-size:12px;color:#6b7280;margin-top:24px;">Mensagem automática — YLADA Pro Líderes</p>
</body></html>`

  try {
    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: params.to,
      subject: subjectByKind,
      html,
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro ao enviar'
    return { ok: false, error: msg }
  }
}
