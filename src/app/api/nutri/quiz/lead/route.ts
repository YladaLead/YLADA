import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const GRUPOS = ['recem_formada', 'agenda_instavel', 'sobrecarregada', 'financeiro_travado', 'confusa'] as const

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { nome, email, telefone, grupo, respostas } = body

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { error: 'E-mail é obrigatório' },
        { status: 400 }
      )
    }

    if (!grupo || !GRUPOS.includes(grupo)) {
      return NextResponse.json(
        { error: 'Grupo inválido. Use: ' + GRUPOS.join(', ') },
        { status: 400 }
      )
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null
    const userAgent = request.headers.get('user-agent')?.substring(0, 500) || null

    const { data, error } = await supabaseAdmin
      .from('quiz_nutri_leads')
      .insert({
        nome: nome?.trim()?.substring(0, 255) || null,
        email: email.trim().toLowerCase().substring(0, 255),
        telefone: telefone?.trim()?.replace(/\D/g, '')?.substring(0, 20) || null,
        grupo,
        respostas: respostas && typeof respostas === 'object' ? respostas : {},
        source: 'quiz_carreira',
        ip_address: ip,
        user_agent: userAgent,
      })
      .select('id, grupo')
      .single()

    if (error) {
      console.error('[quiz/lead] insert error:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar. Tente novamente.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ id: data.id, grupo: data.grupo }, { status: 201 })
  } catch (e) {
    console.error('[quiz/lead]', e)
    return NextResponse.json(
      { error: 'Erro interno. Tente novamente.' },
      { status: 500 }
    )
  }
}
