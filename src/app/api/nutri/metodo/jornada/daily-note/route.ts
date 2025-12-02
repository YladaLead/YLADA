import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST - Salvar anotação diária (reflexão do dia)
 */
export async function POST(request: NextRequest) {
  try {
    const user = await requireApiAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase Admin não configurado' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { day_number, conteudo } = body

    if (day_number === undefined) {
      return NextResponse.json(
        { error: 'day_number é obrigatório' },
        { status: 400 }
      )
    }

    // Upsert da anotação diária
    const { data, error } = await supabaseAdmin
      .from('journey_daily_notes')
      .upsert(
        {
          user_id: user.id,
          day_number,
          conteudo: conteudo || null
        },
        {
          onConflict: 'user_id,day_number'
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar anotação diária:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar anotação diária' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error: any) {
    console.error('Erro na API de anotação diária:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

