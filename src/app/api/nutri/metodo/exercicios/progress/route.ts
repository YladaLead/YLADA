import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar progresso de um exercício
 */
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const exercicioId = searchParams.get('exercicio_id')

    if (!exercicioId) {
      return NextResponse.json(
        { error: 'exercicio_id é obrigatório' },
        { status: 400 }
      )
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('exercicio_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('exercicio_id', exercicioId)
        .maybeSingle()

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return NextResponse.json({
            success: true,
            data: null
          })
        }
        console.error('Erro ao buscar progresso do exercício:', error)
        return NextResponse.json(
          { error: 'Erro ao buscar progresso do exercício' },
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
          data: null
        })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro na API de progresso do exercício:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

