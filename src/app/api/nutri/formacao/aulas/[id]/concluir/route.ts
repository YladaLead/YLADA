import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, error: authError } = await requireApiAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const aulaId = params.id

    // Buscar aula para pegar trail_id
    const { data: aula, error: aulaError } = await supabaseAdmin
      .from('trails_lessons')
      .select('trail_id')
      .eq('id', aulaId)
      .single()

    if (aulaError || !aula) {
      return NextResponse.json({ error: 'Aula não encontrada' }, { status: 404 })
    }

    // Verificar se já existe progresso
    const { data: progressoExistente } = await supabaseAdmin
      .from('progress_user_trails')
      .select('id')
      .eq('user_id', user.id)
      .eq('lesson_id', aulaId)
      .single()

    if (progressoExistente) {
      // Atualizar progresso existente
      const { error: updateError } = await supabaseAdmin
        .from('progress_user_trails')
        .update({
          is_completed: true,
          watched_percentage: 100,
          completed_at: new Date().toISOString()
        })
        .eq('id', progressoExistente.id)

      if (updateError) {
        console.error('Erro ao atualizar progresso:', updateError)
        return NextResponse.json({ error: 'Erro ao atualizar progresso' }, { status: 500 })
      }
    } else {
      // Criar novo progresso
      const { error: insertError } = await supabaseAdmin
        .from('progress_user_trails')
        .insert({
          user_id: user.id,
          trail_id: aula.trail_id,
          lesson_id: aulaId,
          is_completed: true,
          watched_percentage: 100,
          completed_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('Erro ao criar progresso:', insertError)
        return NextResponse.json({ error: 'Erro ao salvar progresso' }, { status: 500 })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Aula marcada como concluída'
    })
  } catch (error: any) {
    console.error('Erro na API de concluir aula:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

