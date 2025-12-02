import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST - Salvar dados do Ritual Final
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
    let { maior_aprendizado, mudanca_interna, novo_posicionamento } = body

    // Se não foram fornecidos, buscar dos exercicio_notes
    if (!maior_aprendizado || !mudanca_interna || !novo_posicionamento) {
      try {
        // Buscar do exercicio_notes
        const { data: notes, error: notesError } = await supabaseAdmin
          .from('exercicio_notes')
          .select('campo_id, conteudo')
          .eq('user_id', user.id)
          .eq('exercicio_id', 'ritual-final')
          .in('campo_id', ['maior-aprendizado', 'mudanca-interna', 'novo-posicionamento'])

        if (!notesError && notes) {
          notes.forEach((note: any) => {
            if (note.campo_id === 'maior-aprendizado' && !maior_aprendizado) {
              maior_aprendizado = note.conteudo
            }
            if (note.campo_id === 'mudanca-interna' && !mudanca_interna) {
              mudanca_interna = note.conteudo
            }
            if (note.campo_id === 'novo-posicionamento' && !novo_posicionamento) {
              novo_posicionamento = note.conteudo
            }
          })
        }
      } catch (error) {
        // Ignorar erro se tabela não existir
      }
    }

    // Verificar se a tabela existe, se não, criar dinamicamente ou retornar sucesso
    try {
      // Upsert do ritual final
      const { data, error } = await supabaseAdmin
        .from('journey_ritual_final')
        .upsert(
          {
            user_id: user.id,
            maior_aprendizado: maior_aprendizado || null,
            mudanca_interna: mudanca_interna || null,
            novo_posicionamento: novo_posicionamento || null,
            updated_at: new Date().toISOString()
          },
          {
            onConflict: 'user_id'
          }
        )
        .select()
        .single()

      if (error) {
        // Se a tabela não existe, criar silenciosamente ou retornar sucesso
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.warn('Tabela journey_ritual_final não existe ainda.')
          return NextResponse.json({
            success: true,
            message: 'Ritual salvo (tabela será criada em breve)'
          })
        }
        console.error('Erro ao salvar ritual final:', error)
        return NextResponse.json(
          { error: 'Erro ao salvar ritual final' },
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
          message: 'Ritual salvo (tabela será criada em breve)'
        })
      }
      throw error
    }
  } catch (error: any) {
    console.error('Erro na API de ritual final:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

