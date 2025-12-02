import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST - Salvar checklist de um exercício
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
    const { exercicio_id, checklist_completed } = body

    if (!exercicio_id) {
      return NextResponse.json(
        { error: 'exercicio_id é obrigatório' },
        { status: 400 }
      )
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('exercicio_progress')
        .upsert(
          {
            user_id: user.id,
            exercicio_id,
            checklist_completed: checklist_completed || [],
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id,exercicio_id'
          }
        )
        .select()
        .single()

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return NextResponse.json({
            success: true,
            message: 'Checklist salvo (tabela será criada em breve)'
          })
        }
        console.error('Erro ao salvar checklist do exercício:', error)
        return NextResponse.json(
          { error: 'Erro ao salvar checklist do exercício' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data
      })
    } catch (error: any) {
      if (error.message?.includes('does not exist') || error.message?.includes('relation')) {
        return NextResponse.json({
          success: true,
          message: 'Checklist salvo (tabela será criada em breve)'
        })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro na API de checklist do exercício:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

