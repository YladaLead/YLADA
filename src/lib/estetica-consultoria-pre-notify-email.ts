import { FROM_EMAIL, FROM_NAME, isResendConfigured, resend } from '@/lib/resend'
import { esteticaConsultSegmentLabel, type EsteticaConsultSegment } from '@/lib/estetica-consultoria'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Destino das notificações «alguém preencheu o pré-diagnóstico».
 * 1) ESTETICA_CONSULTORIA_PRE_NOTIFY_EMAIL (dedicado)
 * 2) ADMIN_EMAIL (fallback comum no projeto)
 */
export function resolveEsteticaPreNotifyEmail(): string | null {
  const a = process.env.ESTETICA_CONSULTORIA_PRE_NOTIFY_EMAIL?.trim().toLowerCase()
  if (a && EMAIL_RE.test(a)) return a
  const b = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  if (b && EMAIL_RE.test(b)) return b
  return null
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function sendEsteticaPreDiagnosticoFilledNotifyEmail(params: {
  toEmail: string
  businessName: string
  segment: EsteticaConsultSegment
  adminPanelUrl: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isResendConfigured() || !resend) {
    return { ok: false, error: 'Envio de e-mail não configurado (RESEND_API_KEY).' }
  }

  const seg = esteticaConsultSegmentLabel(params.segment)
  const subject = `Novo pré-diagnóstico — ${params.businessName.slice(0, 60)}`
  const html = `
<p>Olá,</p>
<p>Alguém acabou de <strong>enviar o pré-diagnóstico</strong> (${escapeHtml(seg)}).</p>
<ul style="margin:12px 0;padding-left:20px;color:#333">
  <li><strong>Clínica / marca:</strong> ${escapeHtml(params.businessName)}</li>
  <li><strong>Segmento:</strong> ${escapeHtml(seg)}</li>
</ul>
<p><a href="${escapeHtml(params.adminPanelUrl)}" style="display:inline-block;margin:16px 0;padding:12px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;">Abrir painel — consultoria estética</a></p>
<p style="word-break:break-all;font-size:13px;color:#444">${escapeHtml(params.adminPanelUrl)}</p>
<p style="font-size:12px;color:#666">A ficha foi criada ou atualizada automaticamente; pesquisa pelo nome na lista se não abrir direto.</p>
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

/** Aviso simples quando alguém envia o formulário longo de diagnóstico (pós confirmação de e-mail). */
export async function sendEsteticaDiagnosticoFilledNotifyEmail(params: {
  toEmail: string
  businessName: string
  segment: EsteticaConsultSegment
  adminPanelUrl: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isResendConfigured() || !resend) {
    return { ok: false, error: 'Envio de e-mail não configurado (RESEND_API_KEY).' }
  }

  const seg = esteticaConsultSegmentLabel(params.segment)
  const subject = `Novo diagnóstico completo — ${params.businessName.slice(0, 60)}`
  const html = `
<p>Olá,</p>
<p>Alguém acabou de <strong>enviar o diagnóstico completo</strong> (${escapeHtml(seg)}).</p>
<ul style="margin:12px 0;padding-left:20px;color:#333">
  <li><strong>Clínica / marca:</strong> ${escapeHtml(params.businessName)}</li>
  <li><strong>Segmento:</strong> ${escapeHtml(seg)}</li>
</ul>
<p><a href="${escapeHtml(params.adminPanelUrl)}" style="display:inline-block;margin:16px 0;padding:12px 20px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;">Abrir painel — consultoria estética</a></p>
<p style="word-break:break-all;font-size:13px;color:#444">${escapeHtml(params.adminPanelUrl)}</p>
<p style="font-size:12px;color:#666">A resposta foi guardada na ficha da clínica associada ao link.</p>
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
