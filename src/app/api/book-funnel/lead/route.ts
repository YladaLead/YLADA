import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const PROFILE_LABELS: Record<string, string> = {
  metodo: 'O gap está no método',
  campo: 'A convicção está travada no campo',
  pergunta: 'A pergunta certa muda tudo',
}

const QUESTION_LABELS: Record<string, string> = {
  q1: 'Como atua',
  q2: 'Maior travamento',
  q3: 'Convicção hoje',
}

const OPTION_LABELS: Record<string, string> = {
  empresa: 'Empresa/equipe',
  rede: 'Rede de vendas',
  autonomo: 'Autônomo/liberal',
  sabem_nao_fazem: 'Sabem mas não fazem',
  conversa_nao_avanca: 'Conversa não avança',
  nao_escala: 'Não escala',
  falta_clareza: 'Falta clareza',
  tem_clareza_falta_acao: 'Tem clareza, falta ação',
  tem_acao_sem_resultado: 'Tem ação, sem resultado',
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, nome, whatsapp, perfil, respostas, desafio } = body

    if (!nome || !whatsapp || !slug) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }

    // Formatar WhatsApp (garante prefixo 55)
    const digits = whatsapp.replace(/\D/g, '')
    const formattedPhone = digits.startsWith('55') ? digits : `55${digits}`

    // Capturar UTM e origem
    const origin = request.headers.get('origin') || ''
    const referer = request.headers.get('referer') || ''

    // Salvar no Supabase
    const { error: dbError } = await supabase.from('book_funnel_leads').insert({
      slug,
      nome: nome.trim(),
      whatsapp: formattedPhone,
      perfil,
      resposta_q1: respostas?.q1 ?? null,
      resposta_q2: respostas?.q2 ?? null,
      resposta_q3: respostas?.q3 ?? null,
      desafio: desafio?.trim() || null,
      origin,
      referer,
      created_at: new Date().toISOString(),
    })

    if (dbError) {
      console.error('[book-funnel] Erro ao salvar lead:', dbError)
      // Não falha o usuário por erro de DB — tenta notificar Andre de qualquer forma
    }

    // Notificar Andre via WhatsApp
    await notifyAndre({ nome, whatsapp: formattedPhone, perfil, respostas, desafio: desafio?.trim(), slug })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[book-funnel] Erro:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

async function notifyAndre(data: {
  nome: string
  whatsapp: string
  perfil: string
  respostas: Record<string, string>
  desafio?: string
  slug: string
}) {
  const token = process.env.WHATSAPP_TOKEN
  const phoneId = process.env.WHATSAPP_PHONE_ID
  const andreNumber = '5519981868000'

  if (!token || !phoneId) return

  const perfilLabel = PROFILE_LABELS[data.perfil] ?? data.perfil

  const resumoRespostas = Object.entries(data.respostas)
    .map(([qId, optId]) => {
      const qLabel = QUESTION_LABELS[qId] ?? qId
      const optLabel = OPTION_LABELS[optId] ?? optId
      return `• ${qLabel}: ${optLabel}`
    })
    .join('\n')

  const desafioBlock = data.desafio ? `\n\n💬 *Desafio:*\n${data.desafio}` : ''

  const msg = `📚 *Novo leitor do livro* — /conviccao\n\n👤 *${data.nome}*\n📱 ${data.whatsapp}\n\n🎯 Perfil: *${perfilLabel}*\n\n${resumoRespostas}${desafioBlock}`

  try {
    await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: andreNumber,
        type: 'text',
        text: { body: msg },
      }),
    })
  } catch (err) {
    console.error('[book-funnel] Falha ao notificar Andre:', err)
  }
}
