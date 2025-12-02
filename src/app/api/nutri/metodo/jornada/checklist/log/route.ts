import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST - Salvar log de checklist (marcar/desmarcar item)
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
    const { day_number, item_index, marcado } = body

    if (day_number === undefined || item_index === undefined || marcado === undefined) {
      return NextResponse.json(
        { error: 'day_number, item_index e marcado são obrigatórios' },
        { status: 400 }
      )
    }

    // Upsert do log
    const { data, error } = await supabaseAdmin
      .from('journey_checklist_log')
      .upsert(
        {
          user_id: user.id,
          day_number,
          item_index,
          marcado
        },
        {
          onConflict: 'user_id,day_number,item_index'
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar log do checklist:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar log do checklist' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error: any) {
    console.error('Erro na API de log do checklist:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

