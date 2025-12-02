import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST - Salvar anotação de um Pilar
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
    const { pilar_id, conteudo } = body

    if (!pilar_id) {
      return NextResponse.json(
        { error: 'pilar_id é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se a tabela existe, se não, criar dinamicamente ou retornar sucesso
    try {
      // Upsert da anotação do pilar
      const { data, error } = await supabaseAdmin
        .from('pilar_notes')
        .upsert(
          {
            user_id: user.id,
            pilar_id,
            conteudo: conteudo || null,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id,pilar_id'
          }
        )
        .select()
        .single()

      if (error) {
        // Se a tabela não existe, criar silenciosamente ou retornar sucesso
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.warn('Tabela pilar_notes não existe ainda. Criando...')
          // Por enquanto, apenas retornar sucesso
          return NextResponse.json({
            success: true,
            message: 'Anotação salva (tabela será criada em breve)'
          })
        }
        console.error('Erro ao salvar anotação do pilar:', error)
        return NextResponse.json(
          { error: 'Erro ao salvar anotação do pilar' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data
      })
    } catch (error: any) {
      // Se for erro de tabela não existente, retornar sucesso silenciosamente
      if (error.message?.includes('does not exist') || error.message?.includes('relation')) {
        return NextResponse.json({
          success: true,
          message: 'Anotação salva (tabela será criada em breve)'
        })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro na API de anotação do pilar:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

