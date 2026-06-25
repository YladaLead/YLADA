import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppMessage } from '@/lib/carol/sender'
import { getCarolAndreNotifyPhone } from '@/lib/carol/andre-notifications'
import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from '@/lib/resend'

/**
 * Captura do diagnóstico público (ylada.com/diagnostico).
 * A pessoa NÃO recebe o diagnóstico — só uma mensagem que promove a reunião.
 * Quando ela envia as respostas, o Andre recebe por E-MAIL (canal principal,
 * confiável, fica registrado) e também um ping no WhatsApp (instantâneo, best
 * effort). Sem armazenamento próprio ainda (próximo passo: tabela + painel).
 */

// Traduz os códigos do formulário para texto legível no e-mail/WhatsApp.
const LABELS_DOR: Record<string, string> = {
  agenda: 'Agenda que oscila (semanas cheias, semanas com buracos)',
  sozinha: 'Faz quase tudo sozinha (a clínica depende dela pra tudo)',
  lucro: 'O lucro não cresce (trabalha bastante, mas não sobra)',
}
const LABELS_TEMPO: Record<string, string> = {
  '0': 'Há poucas semanas',
  '1': 'Há alguns meses',
  '2': 'Há mais de um ano',
}
const LABELS_PERDE: Record<string, string> = {
  '0': 'Acompanha até a pessoa decidir',
  '1': 'Manda uma promoção',
  '2': 'Espera ela voltar sozinha',
  '3': 'Acaba se perdendo sem ver',
}

const ANDRE_EMAIL =
  process.env.ADMIN_EMAIL ||
  process.env.CONTACT_NOTIFICATION_EMAIL ||
  'faulaandre@gmail.com'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const v = (k: string) => {
      const raw = body[k]
      return typeof raw === 'string' ? raw.trim().slice(0, 300) : ''
    }

    const nome = v('nome')
    const telefone = v('telefone')
    const instagram = v('instagram')
    const dor = LABELS_DOR[v('dor')] || v('dor')
    const tempo = LABELS_TEMPO[v('tempo')] || v('tempo')
    const perde = LABELS_PERDE[v('perde')] || v('perde')
    const quem = v('quem')

    const campos: Array<[string, string]> = []
    if (nome) campos.push(['Nome', nome])
    if (telefone) campos.push(['WhatsApp', telefone])
    if (instagram) campos.push(['Instagram', instagram])
    if (dor) campos.push(['Dor principal', dor])
    if (tempo) campos.push(['Há quanto tempo', tempo])
    if (perde) campos.push(['Quando alguém se interessa e não fecha', perde])
    if (quem) campos.push(['Quem decide', quem])

    // --- E-mail (canal principal) ---
    if (isResendConfigured() && resend) {
      const linkWa = telefone
        ? `https://wa.me/${telefone.replace(/\D/g, '')}`
        : ''
      const linhasHtml = campos
        .map(
          ([k, val]) =>
            `<tr><td style="padding:6px 12px;color:#64748b;font-size:13px;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 12px;color:#0f172a;font-size:14px;font-weight:600">${val}</td></tr>`
        )
        .join('')
      const html = `
        <div style="font-family:Arial,sans-serif;background:#f5f7f6;padding:24px;margin:0">
          <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:28px;box-shadow:0 2px 6px rgba(0,0,0,.06)">
            <div style="font-size:13px;color:#0d9488;font-weight:700;text-transform:uppercase;letter-spacing:.5px">Novo diagnóstico preenchido</div>
            <h1 style="margin:8px 0 18px;font-size:20px;color:#0f172a">${nome || 'Alguém'} respondeu o diagnóstico</h1>
            <table style="width:100%;border-collapse:collapse;border-top:1px solid #eef2f1">${linhasHtml}</table>
            ${linkWa ? `<a href="${linkWa}" style="display:inline-block;margin-top:22px;background:#0d9488;color:#fff;text-decoration:none;padding:11px 20px;border-radius:9px;font-weight:700;font-size:14px">Chamar no WhatsApp ›</a>` : ''}
            <p style="margin-top:24px;color:#94a3b8;font-size:12px">ylada.com/diagnostico</p>
          </div>
        </div>`
      await resend.emails
        .send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: ANDRE_EMAIL,
          subject: `Novo diagnóstico: ${nome || 'sem nome'}${v('dor') ? ` · ${v('dor')}` : ''}`,
          html,
        })
        .catch((e) => console.error('[diagnostico] falha ao enviar e-mail:', e))
    } else {
      console.warn('[diagnostico] Resend não configurado — e-mail não enviado')
    }

    // --- WhatsApp (ping instantâneo, best effort) ---
    const linhas: string[] = [
      '📋 *Novo diagnóstico preenchido* (ylada.com/diagnostico)',
      ...campos.map(([k, val]) => `${k}: ${val}`),
    ]
    const andre = getCarolAndreNotifyPhone()
    if (andre) {
      await sendWhatsAppMessage(andre, linhas.join('\n')).catch((e) => {
        console.error('[diagnostico] falha ao notificar Andre no WhatsApp:', e)
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[diagnostico] erro:', e)
    // 200 de propósito: a captura não pode quebrar a experiência da pessoa
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
