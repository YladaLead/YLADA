import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET - Busca metas de construção do usuário
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { data, error } = await supabaseAdmin
      .from('wellness_metas_construcao')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar metas de construção:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar metas' },
        { status: 500 }
      )
    }

    // Se não existir, retornar null (será criado no onboarding)
    return NextResponse.json({
      success: true,
      metas: data || null
    })
  } catch (error: any) {
    console.error('❌ Erro no GET /api/wellness/metas-construcao:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * PUT - Atualiza metas de construção do usuário
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const {
      meta_pv_equipe,
      meta_recrutamento,
      meta_royalties,
      nivel_carreira_alvo,
      prazo_meses,
      reflexao_metas
    } = body

    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (meta_pv_equipe !== undefined) updateData.meta_pv_equipe = meta_pv_equipe
    if (meta_recrutamento !== undefined) updateData.meta_recrutamento = meta_recrutamento
    if (meta_royalties !== undefined) updateData.meta_royalties = meta_royalties
    if (nivel_carreira_alvo !== undefined) updateData.nivel_carreira_alvo = nivel_carreira_alvo
    if (prazo_meses !== undefined) updateData.prazo_meses = prazo_meses
    if (reflexao_metas !== undefined) updateData.reflexao_metas = reflexao_metas

    const doUpsert = async (payload: any) => {
      return await supabaseAdmin
        .from('wellness_metas_construcao')
        .upsert(payload, { onConflict: 'user_id' })
        .select()
        .single()
    }

    let { data, error } = await doUpsert({
      user_id: user.id,
      ...updateData
    })

    // Retrocompatibilidade: se o banco ainda não tiver a coluna nova, salvar sem ela
    if (error) {
      const msg = `${error.message || ''} ${error.details || ''} ${error.hint || ''}`.toLowerCase()
      const shouldRetryWithoutReflexao =
        (msg.includes('reflexao_metas') && (msg.includes('schema cache') || msg.includes('column') || msg.includes('does not exist'))) ||
        error.code === '42703'

      if (shouldRetryWithoutReflexao) {
        console.warn('⚠️ Coluna reflexao_metas não encontrada no banco; salvando metas sem esse campo.', {
          code: error.code,
          message: error.message
        })
        // Recriar payload sem reflexao_metas
        const { reflexao_metas: _ignored, ...updateDataSemReflexao } = updateData
        const retry = await doUpsert({
          user_id: user.id,
          ...updateDataSemReflexao
        })
        data = retry.data
        error = retry.error
      }
    }

    if (error) {
      console.error('❌ Erro ao atualizar metas de construção:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar metas', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      metas: data
    })
  } catch (error: any) {
    console.error('❌ Erro no PUT /api/wellness/metas-construcao:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

