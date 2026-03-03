import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/admin/trial-invites/list
 * Lista todos os convites de trial (admin) com presidente prefixado.
 * Convites enviados por presidentes na área wellness aparecem com o presidente associado.
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { profile } = authResult

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Apenas administradores podem ver convites' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status') || 'all' // 'pending', 'used', 'expired', 'all'

    let query = supabaseAdmin
      .from('trial_invites')
      .select('id, token, email, nome_completo, whatsapp, status, expires_at, created_at, used_at, created_by_user_id, nome_presidente')
      .order('created_at', { ascending: false })
      .limit(100)

    if (statusFilter !== 'all') {
      if (statusFilter === 'expired') {
        query = query.eq('status', 'expired')
      } else {
        query = query.eq('status', statusFilter)
      }
    }

    const { data: invites, error } = await query

    if (error) {
      console.error('❌ Erro ao listar trial_invites:', error)
      throw error
    }

    // Buscar presidentes_autorizados para mapear created_by_user_id -> presidente_id
    const createdByUserIds = [...new Set((invites || []).map((i: any) => i.created_by_user_id).filter(Boolean))]
    let presidenteMap = new Map<string, { id: string; nome_completo: string }>()

    if (createdByUserIds.length > 0) {
      const { data: presidentes } = await supabaseAdmin
        .from('presidentes_autorizados')
        .select('id, user_id, nome_completo')
        .in('user_id', createdByUserIds)
        .eq('status', 'ativo')

      ;(presidentes || []).forEach((p: any) => {
        if (p.user_id) {
          presidenteMap.set(p.user_id, { id: p.id, nome_completo: p.nome_completo || '' })
        }
      })
    }

    const result = (invites || []).map((inv: any) => {
      const presidenteInfo = inv.created_by_user_id
        ? presidenteMap.get(inv.created_by_user_id)
        : null
      return {
        id: inv.id,
        token: inv.token,
        email: inv.email,
        nome_completo: inv.nome_completo,
        whatsapp: inv.whatsapp,
        status: inv.status,
        expires_at: inv.expires_at,
        created_at: inv.created_at,
        used_at: inv.used_at,
        // Presidente prefixado: nome vindo do convite ou do mapeamento
        nome_presidente: inv.nome_presidente || presidenteInfo?.nome_completo || null,
        presidente_id: presidenteInfo?.id || null, // Para prefixar no form de gerar convite
      }
    })

    return NextResponse.json({
      success: true,
      invites: result,
    })
  } catch (error: any) {
    console.error('❌ Erro ao listar trial_invites:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao listar convites' },
      { status: 500 }
    )
  }
}
