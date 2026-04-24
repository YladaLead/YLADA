import { FROM_EMAIL, FROM_NAME, isResendConfigured, resend } from '@/lib/resend'
import { buildEsteticaConsultoriaResponderUrl } from '@/lib/estetica-consultoria'

export function maskRecipientEmail(email: string): string {
  const e = email.trim().toLowerCase()
  const at = e.indexOf('@')
  if (at < 1) return '***'
  const user = e.slice(0, at)
  const domain = e.slice(at + 1)
  const show = user.slice(0, 1)
  return `${show}***@${domain}`
}

export async function sendEsteticaDiagnosticoConfirmEmail(params: {
  origin: string
  shareToken: string
  confirmToken: string
  toEmail: string
  clinicName: string
  /** Qual formulário fixo — texto do e-mail. */
  formArea?: 'corporal' | 'capilar'
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isResendConfigured() || !resend) {
    return { ok: false, error: 'Envio de e-mail não configurado (RESEND_API_KEY).' }
  }
  const area = params.formArea ?? 'corporal'
  const areaLabel = area === 'capilar' ? 'terapia capilar' : 'estética corporal'
  const url = `${buildEsteticaConsultoriaResponderUrl(params.origin, params.shareToken)}?confirm=${encodeURIComponent(params.confirmToken)}`
  const subject = 'Confirme para abrir o diagnóstico — YLADA'
  const html = `
<p>Olá,</p>
<p>Você recebeu o convite para preencher o <strong>diagnóstico de ${escapeHtml(areaLabel)}</strong> da clínica <strong>${escapeHtml(
    params.clinicName
  )}</strong>.</p>
<p><a href="${url}" style="display:inline-block;margin:16px 0;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;">Confirmar e abrir o formulário</a></p>
<p>Ou copie este link no navegador:</p>
<p style="word-break:break-all;font-size:13px;color:#444">${escapeHtml(url)}</p>
<p style="font-size:12px;color:#666">Se não foi você, ignore este e-mail.</p>
<p>— YLADA</p>
`.trim()

  const { error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: params.toEmail,
    subject,
    html,
  })
  if (error) {
    return { ok: false, error: error.message || 'Falha ao enviar e-mail.' }
  }
  return { ok: true }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
