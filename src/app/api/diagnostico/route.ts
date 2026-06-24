import { NextRequest, NextResponse } from 'next/server'
import { sendWhatsAppMessage } from '@/lib/carol/sender'
import { getCarolAndreNotifyPhone } from '@/lib/carol/andre-notifications'

/**
 * Captura do diagnóstico público (ylada.com/diagnostico).
 * Assim que a pessoa preenche e vê o resultado, o Andre recebe as respostas no
 * WhatsApp na hora — não depende de ela clicar no botão final. Sem armazenamento
 * próprio ainda (próximo passo: salvar em tabela + painel).
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const v = (k: string) => {
      const raw = body[k]
      return typeof raw === 'string' ? raw.trim().slice(0, 300) : ''
    }

    const linhas: string[] = ['📋 *Novo diagnóstico preenchido* (ylada.com/diagnostico)']
    const nome = v('nome')
    const telefone = v('telefone')
    const instagram = v('instagram')
    if (nome) linhas.push(`Nome: ${nome}`)
    if (telefone) linhas.push(`WhatsApp: ${telefone}`)
    if (instagram) linhas.push(`Instagram: ${instagram}`)
    if (v('dor')) linhas.push(`Dor principal: ${v('dor')}`)
    if (v('tempo')) linhas.push(`Há quanto tempo: ${v('tempo')}`)
    if (v('perde')) linhas.push(`Interessada que não fecha: ${v('perde')}`)
    if (v('quem')) linhas.push(`Quem decide: ${v('quem')}`)

    const andre = getCarolAndreNotifyPhone()
    if (andre) {
      await sendWhatsAppMessage(andre, linhas.join('\n')).catch((e) => {
        console.error('[diagnostico] falha ao notificar Andre:', e)
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[diagnostico] erro:', e)
    // 200 de propósito: a captura não pode quebrar a experiência da pessoa
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
