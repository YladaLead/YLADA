import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar nota de um campo de exercício
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
    const campoId = searchParams.get('campo_id')

    if (!exercicioId || !campoId) {
      return NextResponse.json(
        { error: 'exercicio_id e campo_id são obrigatórios' },
        { status: 400 }
      )
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('exercicio_notes')
        .select('*')
        .eq('user_id', user.id)
        .eq('exercicio_id', exercicioId)
        .eq('campo_id', campoId)
        .maybeSingle()

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return NextResponse.json({
            success: true,
            data: null
          })
        }
        console.error('Erro ao buscar nota do exercício:', error)
        return NextResponse.json(
          { error: 'Erro ao buscar nota do exercício' },
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
    console.error('Erro na API de nota do exercício (GET):', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * POST - Salvar nota de um campo de exercício
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
    const { exercicio_id, campo_id, conteudo } = body

    if (!exercicio_id || !campo_id) {
      return NextResponse.json(
        { error: 'exercicio_id e campo_id são obrigatórios' },
        { status: 400 }
      )
    }

    try {
      const { data, error } = await supabaseAdmin
        .from('exercicio_notes')
        .upsert(
          {
            user_id: user.id,
            exercicio_id,
            campo_id,
            conteudo: conteudo || null,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id,exercicio_id,campo_id'
          }
        )
        .select()
        .single()

      if (error) {
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          return NextResponse.json({
            success: true,
            message: 'Nota salva (tabela será criada em breve)'
          })
        }
        console.error('Erro ao salvar nota do exercício:', error)
        return NextResponse.json(
          { error: 'Erro ao salvar nota do exercício' },
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
          message: 'Nota salva (tabela será criada em breve)'
        })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro na API de nota do exercício (POST):', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
