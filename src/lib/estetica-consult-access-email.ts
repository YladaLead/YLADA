import { FROM_EMAIL, FROM_NAME, isResendConfigured, resend } from '@/lib/resend'
import type { EsteticaConsultSegment } from '@/lib/estetica-consultoria'

function baseUrlFromEnv() {
  return (
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    'https://www.ylada.com'
  )
}

function segmentLabel(s: EsteticaConsultSegment): string {
  if (s === 'corporal') return 'YLADA Pro — Estética corporal'
  if (s === 'capilar') return 'YLADA Pro — Terapia capilar'
  return 'YLADA Pro — Terapia capilar e Estética corporal'
}

function loginLinksHtml(segment: EsteticaConsultSegment, base: string): string {
  if (segment === 'ambos') {
    return `<p><a href="${base}/pro-estetica-capilar/entrar">Entrar — Terapia capilar</a></p>
<p><a href="${base}/pro-estetica-corporal/entrar">Entrar — Estética corporal</a></p>`
  }
  if (segment === 'capilar') {
    return `<p><a href="${base}/pro-estetica-capilar/entrar">Entrar no painel</a></p>`
  }
  return `<p><a href="${base}/pro-estetica-corporal/entrar">Entrar no painel</a></p>`
}

export async function sendEsteticaConsultAccessExpiryReminderEmail(params: {
  to: string
  businessName: string
  contactName: string | null
  segment: EsteticaConsultSegment
  accessValidUntil: string
  daysLeft: number
  kind: '15d' | '7d' | '1d'
}): Promise<{ ok: boolean; error?: string }> {
  if (!isResendConfigured() || !resend) {
    return { ok: false, error: 'Resend não configurado' }
  }

  const base = baseUrlFromEnv()
  const label = segmentLabel(params.segment)
  const greet = params.contactName?.trim() || params.businessName
  const until = params.accessValidUntil.slice(0, 10)

  const subjectByKind =
    params.kind === '15d'
      ? `YLADA — O teu acesso ${label} caduca em breve (${until})`
      : params.kind === '7d'
        ? `YLADA — Faltam cerca de 7 dias para renovar o acesso (${label})`
        : `YLADA — Último dia de acesso ao ${label} (${until})`

  const bodyByKind =
    params.kind === '15d'
      ? `Daqui a cerca de <strong>${params.daysLeft} dias</strong> termina o período de acesso ao <strong>${label}</strong> (válido até <strong>${until}</strong>, inclusive nesse dia).`
      : params.kind === '7d'
        ? `Faltam cerca de <strong>${params.daysLeft} dias</strong> para o fim do acesso ao <strong>${label}</strong> (até <strong>${until}</strong>).`
        : `Hoje ou amanhã termina o período de acesso ao <strong>${label}</strong> (data de referência: <strong>${until}</strong>). Renova connosco para continuar sem interrupções.`

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;line-height:1.5;color:#111827;padding:24px;max-width:560px;">
  <p>Olá, ${escapeHtml(greet)}.</p>
  <p>${bodyByKind}</p>
  <p>Para renovar, responde a este e-mail ou contacta a equipa YLADA pelo canal habitual.</p>
  ${loginLinksHtml(params.segment, base)}
  <p style="font-size:12px;color:#6b7280;margin-top:24px;">Mensagem automática — YLADA Consultoria Estética</p>
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

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
