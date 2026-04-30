import { FROM_EMAIL, FROM_NAME, isResendConfigured, resend } from '@/lib/resend'
import type { SupabaseClient } from '@supabase/supabase-js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export type ProLideresLeaderNotifyTarget = { toEmail: string; displayName: string | null }

/**
 * E-mail para avisar o líder: `contact_email` do tenant; senão e-mail do dono (auth).
 */
export async function resolveProLideresLeaderNotifyTarget(
  supabase: SupabaseClient,
  leaderTenantId: string
): Promise<ProLideresLeaderNotifyTarget | null> {
  const { data: row, error } = await supabase
    .from('leader_tenants')
    .select('contact_email, owner_user_id, display_name')
    .eq('id', leaderTenantId)
    .maybeSingle()

  if (error || !row) return null

  const displayName = row.display_name == null ? null : String(row.display_name).trim().slice(0, 200) || null

  const ce = row.contact_email == null ? '' : String(row.contact_email).trim().toLowerCase()
  if (ce && EMAIL_RE.test(ce)) {
    return { toEmail: ce.slice(0, 320), displayName }
  }

  const { data: userData, error: authErr } = await supabase.auth.admin.getUserById(row.owner_user_id as string)
  if (authErr || !userData?.user?.email) return null
  const em = userData.user.email.trim().toLowerCase()
  if (!EMAIL_RE.test(em)) return null
  return { toEmail: em, displayName }
}

export async function sendProLideresPreDiagnosticoFilledNotifyEmail(params: {
  toEmail: string
  leaderDisplayName: string | null
  respondentName: string | null
  respondentEmail: string | null
  respondentWhatsapp: string | null
  respostasAdminUrl: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isResendConfigured() || !resend) {
    return { ok: false, error: 'Envio de e-mail não configurado (RESEND_API_KEY).' }
  }

  const who = (params.respondentName || 'Alguém').slice(0, 120)
  const subject = `Pro Líderes: novo pré-diagnóstico — ${who}`
  const space = params.leaderDisplayName?.trim() || 'o seu espaço'

  const html = `
<p>Olá,</p>
<p>Recebeu um <strong>novo envio do pré-diagnóstico estratégico</strong> em <strong>${escapeHtml(space)}</strong>.</p>
<ul style="margin:12px 0;padding-left:20px;color:#333">
  <li><strong>Nome:</strong> ${escapeHtml(params.respondentName ?? '—')}</li>
  <li><strong>E-mail:</strong> ${escapeHtml(params.respondentEmail ?? '—')}</li>
  <li><strong>WhatsApp:</strong> ${escapeHtml(params.respondentWhatsapp ?? '—')}</li>
</ul>
<p><a href="${escapeHtml(params.respostasAdminUrl)}" style="display:inline-block;margin:16px 0;padding:12px 20px;background:#1d4ed8;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;">Abrir respostas no admin (Pro Líderes)</a></p>
<p style="word-break:break-all;font-size:13px;color:#444">${escapeHtml(params.respostasAdminUrl)}</p>
<p style="font-size:12px;color:#666">O préenchimento está na consultoria Pro Líderes (área administrativa YLADA).</p>
<p>— YLADA</p>
`.trim()

  const replyTo = params.respondentEmail && EMAIL_RE.test(params.respondentEmail) ? params.respondentEmail : undefined

  const { error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: params.toEmail,
    ...(replyTo ? { replyTo } : {}),
    subject,
    html,
  })
  if (error) {
    return { ok: false, error: error.message || 'Falha ao enviar e-mail.' }
  }
  return { ok: true }
}
