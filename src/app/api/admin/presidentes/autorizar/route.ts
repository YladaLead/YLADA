import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/admin/presidentes/autorizar
 * Adiciona presidente à lista de autorizados
 * 
 * Body:
 * {
 *   nome_completo: string (obrigatório)
 *   email?: string (opcional)
 *   observacoes?: string (opcional)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação (apenas admin)
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Apenas administradores podem autorizar presidentes' },
        { status: 403 }
      )
    }

    const body = await request.json()
    let { nome_completo, email, observacoes, user_id: userId } = body

    if (!nome_completo || nome_completo.length < 3) {
      return NextResponse.json(
        { error: 'Nome completo é obrigatório (mínimo 3 caracteres)' },
        { status: 400 }
      )
    }

    const emailNorm = email?.trim()?.toLowerCase()
    if (emailNorm && !userId) {
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id')
        .eq('email', emailNorm)
        .eq('perfil', 'wellness')
        .maybeSingle()
      if (profile?.user_id) userId = profile.user_id
    }

    // Verificar se já existe
    const { data: existing } = await supabaseAdmin
      .from('presidentes_autorizados')
      .select('id, nome_completo, status')
      .ilike('nome_completo', nome_completo.trim())
      .maybeSingle()

    if (existing) {
      // Se existe mas está inativo, reativar
      if (existing.status === 'inativo') {
        let linkUserId = userId
        if (emailNorm && linkUserId == null) {
          const { data: profile } = await supabaseAdmin
            .from('user_profiles')
            .select('user_id')
            .eq('email', emailNorm)
            .eq('perfil', 'wellness')
            .maybeSingle()
          if (profile?.user_id) linkUserId = profile.user_id
        }
        const updatePayload: Record<string, unknown> = {
          status: 'ativo',
          email: email || null,
          observacoes: observacoes || null,
          autorizado_por_user_id: user.id,
          autorizado_por_email: user.email,
          updated_at: new Date().toISOString(),
        }
        if (linkUserId !== undefined) updatePayload.user_id = linkUserId ?? null
        const { error: updateError } = await supabaseAdmin
          .from('presidentes_autorizados')
          .update(updatePayload)
          .eq('id', existing.id)

        if (updateError) {
          throw updateError
        }

        return NextResponse.json({
          success: true,
          message: 'Presidente reativado com sucesso',
          presidente: {
            id: existing.id,
            nome_completo: existing.nome_completo,
            status: 'ativo',
          },
        })
      } else {
        return NextResponse.json(
          { error: 'Este presidente já está autorizado' },
          { status: 400 }
        )
      }
    }

    // Criar novo registro
    const { data: novoPresidente, error: createError } = await supabaseAdmin
      .from('presidentes_autorizados')
      .insert({
        nome_completo: nome_completo.trim(),
        email: email?.trim() || null,
        observacoes: observacoes?.trim() || null,
        status: 'ativo',
        autorizado_por_user_id: user.id,
        autorizado_por_email: user.email,
        user_id: userId || null,
      })
      .select()
      .single()

    if (createError) {
      console.error('❌ Erro ao autorizar presidente:', createError)
      throw createError
    }

    return NextResponse.json({
      success: true,
      message: 'Presidente autorizado com sucesso',
      presidente: novoPresidente,
    })
  } catch (error: any) {
    console.error('❌ Erro ao autorizar presidente:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao autorizar presidente' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/admin/presidentes/autorizar
 * Lista todos os presidentes autorizados
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação (apenas admin)
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { profile } = authResult

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Apenas administradores podem ver a lista' },
        { status: 403 }
      )
    }

    let presidentes: any[] = []
    let error: any = null

    const { data: full, error: errFull } = await supabaseAdmin
      .from('presidentes_autorizados')
      .select('*')
      .order('nome_completo', { ascending: true })

    if (errFull) {
      const msg = (errFull.message || '').toLowerCase()
      if (msg.includes('user_id') || msg.includes('schema cache') || errFull.code === '42703') {
        const { data: fallback, error: errFallback } = await supabaseAdmin
          .from('presidentes_autorizados')
          .select('id, nome_completo, email, status, observacoes, autorizado_por_email, created_at, updated_at')
          .order('nome_completo', { ascending: true })
        if (!errFallback && fallback) {
          presidentes = fallback.map((p: any) => ({ ...p, user_id: null }))
        }
      } else {
        throw errFull
      }
    } else {
      presidentes = full || []
    }

    return NextResponse.json({
      success: true,
      presidentes,
      total: presidentes.length,
    })
  } catch (error: any) {
    console.error('❌ Erro ao listar presidentes:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao listar presidentes' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/admin/presidentes/autorizar
 * Atualiza presidente (vincular/desvincular conta de usuário)
 * Body:
 * {
 *   id: string (UUID do presidente)
 *   user_id?: string | null (UUID do auth.users — null para desvincular)
 * }
 */
export async function PATCH(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { profile } = authResult

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Apenas administradores podem atualizar presidentes' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      id,
      user_id: userId,
      autoriza_equipe_automatico: autorizaEquipe,
      data_autorizacao_equipe_automatico: dataAutorizacaoEquipe,
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID do presidente é obrigatório' },
        { status: 400 }
      )
    }

    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    if (userId !== undefined) updatePayload.user_id = userId ?? null
    if (autorizaEquipe !== undefined) updatePayload.autoriza_equipe_automatico = !!autorizaEquipe
    if (dataAutorizacaoEquipe !== undefined) updatePayload.data_autorizacao_equipe_automatico = dataAutorizacaoEquipe || null
    if (autorizaEquipe === true && (dataAutorizacaoEquipe === undefined || dataAutorizacaoEquipe === null)) {
      updatePayload.data_autorizacao_equipe_automatico = new Date().toISOString()
    }

    const { data, error } = await supabaseAdmin
      .from('presidentes_autorizados')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: userId ? 'Conta vinculada ao presidente com sucesso.' : 'Conta desvinculada com sucesso.',
      presidente: data,
    })
  } catch (error: any) {
    console.error('❌ Erro ao atualizar presidente:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar presidente' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/presidentes/autorizar
 * Desativa presidente (não remove, apenas marca como inativo)
 * 
 * Body:
 * {
 *   id: string (UUID do presidente)
 * }
 */
export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticação (apenas admin)
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { profile } = authResult

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Apenas administradores podem desativar presidentes' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID do presidente é obrigatório' },
        { status: 400 }
      )
    }

    const { error: updateError } = await supabaseAdmin
      .from('presidentes_autorizados')
      .update({
        status: 'inativo',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({
      success: true,
      message: 'Presidente desativado com sucesso',
    })
  } catch (error: any) {
    console.error('❌ Erro ao desativar presidente:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao desativar presidente' },
      { status: 500 }
    )
  }
}
