import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Registrar evento de memória
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const { tipo, conteudo, util } = body

    if (!tipo || !['acao', 'resultado', 'feedback'].includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo inválido. Use: acao, resultado ou feedback' },
        { status: 400 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('ai_memory_events')
      .insert({
        user_id: user.id,
        tipo,
        conteudo: conteudo || {},
        util: util !== undefined ? util : null
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao registrar evento:', error)
      return NextResponse.json(
        { error: 'Erro ao registrar evento' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      event: data
    })
  } catch (error: any) {
    console.error('❌ Erro ao processar evento:', error)
    return NextResponse.json(
      { error: 'Erro ao processar evento', details: error.message },
      { status: 500 }
    )
  }
}

