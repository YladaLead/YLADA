import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/admin/presidentes/definir-usuario
 * Define um usuário Wellness como presidente (cria ou vincula em presidentes_autorizados).
 * Body: { user_id: string }
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { profile } = authResult

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Apenas administradores podem definir presidente.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { user_id: targetUserId } = body

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'user_id é obrigatório' },
        { status: 400 }
      )
    }

    const { data: profileUser, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, nome_completo, email, perfil')
      .eq('user_id', targetUserId)
      .single()

    if (profileError || !profileUser) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    if (profileUser.perfil !== 'wellness') {
      return NextResponse.json(
        { error: 'Apenas usuários da área Wellness podem ser definidos como presidente.' },
        { status: 400 }
      )
    }

    const nomeCompleto = (profileUser.nome_completo || profileUser.email || 'Presidente').trim()
    const emailNorm = profileUser.email?.trim()?.toLowerCase() || null

    let existing: { id: string; user_id: string | null; status: string } | null = null
    if (emailNorm) {
      const { data: byEmail } = await supabaseAdmin
        .from('presidentes_autorizados')
        .select('id, user_id, status')
        .eq('email', emailNorm)
        .maybeSingle()
      existing = byEmail
    }
    if (!existing && nomeCompleto) {
      const { data: byNome } = await supabaseAdmin
        .from('presidentes_autorizados')
        .select('id, user_id, status')
        .ilike('nome_completo', nomeCompleto)
        .maybeSingle()
      existing = byNome
    }

    if (existing) {
      const { error: updateErr } = await supabaseAdmin
        .from('presidentes_autorizados')
        .update({
          user_id: targetUserId,
          email: emailNorm || existing.email,
          status: 'ativo',
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)

      if (updateErr) throw updateErr
      return NextResponse.json({
        success: true,
        message: 'Presidente vinculado à conta com sucesso.',
        presidente_id: existing.id,
      })
    }

    const { data: novo, error: insertErr } = await supabaseAdmin
      .from('presidentes_autorizados')
      .insert({
        nome_completo: nomeCompleto,
        email: emailNorm,
        status: 'ativo',
        user_id: targetUserId,
        autorizado_por_user_id: profile?.user_id || null,
        autorizado_por_email: profile?.email || null,
      })
      .select('id')
      .single()

    if (insertErr) {
      if (insertErr.message?.includes('user_id') || insertErr.code === '42703') {
        return NextResponse.json(
          {
            error:
              'A coluna user_id ainda não existe na tabela presidentes_autorizados. Rode a migration 222 no Supabase (SQL em migrations/222-presidentes-autorizados-user-id.sql).',
          },
          { status: 503 }
        )
      }
      throw insertErr
    }

    return NextResponse.json({
      success: true,
      message: 'Usuário definido como presidente com sucesso.',
      presidente_id: novo?.id,
    })
  } catch (error: any) {
    console.error('Erro ao definir usuário como presidente:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao definir presidente' },
      { status: 500 }
    )
  }
}
