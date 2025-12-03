import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST - Salvar nota de item do checklist
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase Admin não configurado' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { day_number, item_index, nota } = body

    if (day_number === undefined || item_index === undefined) {
      return NextResponse.json(
        { error: 'day_number e item_index são obrigatórios' },
        { status: 400 }
      )
    }

    // Upsert da nota
    // Se nota for fornecida, também atualizar completed_at
    const updateData: any = {
      user_id: user.id,
      day_number,
      item_index,
      nota: nota || null
    }

    // Se há nota, significa que o item foi marcado, então atualizar completed_at
    if (nota && nota.trim()) {
      updateData.completed_at = new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('journey_checklist_notes')
      .upsert(
        updateData,
        {
          onConflict: 'user_id,day_number,item_index'
        }
      )
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar nota do checklist:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar nota do checklist' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error: any) {
    console.error('Erro na API de nota do checklist:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

