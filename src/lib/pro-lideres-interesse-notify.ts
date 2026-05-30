import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from '@/lib/resend'

const PRO_LIDERES_INTERESSE_NOTIFY_TO = ['suporte@ylada.com', 'faulaandre@gmail.com'] as const

export async function notifyProLideresInteresseClick(params: {
  source?: string | null
}): Promise<{ ok: boolean }> {
  if (!isResendConfigured() || !resend) {
    console.warn('[Pro Líderes interesse] Resend não configurado — e-mail não enviado')
    return { ok: false }
  }

  const source = params.source?.trim() || 'pro-lideres (direto)'
  const when = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })

  const html = `
    <div style="font-family:sans-serif;line-height:1.5;color:#111">
      <p><strong>Alguém clicou em «Tenho interesse» no Ylada Pro Líderes.</strong></p>
      <p>Horário: ${when}</p>
      <p>Origem: <code>${source}</code></p>
      <p style="color:#666;font-size:14px">A pessoa deve ter sido redirecionada para o WhatsApp da Ylada (19) 99604-9800.</p>
    </div>
  `

  try {
    await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: [...PRO_LIDERES_INTERESSE_NOTIFY_TO],
      subject: `[Pro Líderes] Interesse — ${source}`,
      html,
    })
    return { ok: true }
  } catch (err) {
    console.error('[Pro Líderes interesse] Erro ao enviar e-mail:', err)
    return { ok: false }
  }
}
