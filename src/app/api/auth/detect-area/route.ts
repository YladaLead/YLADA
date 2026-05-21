import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/auth/detect-area?email=...
 *
 * Dado um e-mail, descobre em qual vertical/área o usuário está cadastrado
 * e retorna a URL de login correta com o e-mail pré-preenchido.
 *
 * Usado pela tela de entrada central do app (Opção 1 — email inteligente).
 *
 * Ordem de prioridade:
 *  1. Pro Líderes         → /pro-lideres/entrar
 *  2. Pro Estética Capilar → /pro-estetica-capilar/entrar
 *  3. Pro Estética Corporal → /pro-estetica-corporal/entrar
 *  4. Wellness            → /pt/wellness/login
 *  5. Matriz YLADA geral  → /pt/login
 *  0. Não encontrado      → {found: false}
 */
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')?.trim().toLowerCase()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  }

  try {
    // 1. Buscar user_id pelo email no auth.users (admin)
    const { data: listData, error: listError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    })

    // Supabase Admin SDK não tem filtro direto por email no listUsers,
    // então usamos a busca via getUserByEmail se disponível, senão filtramos
    let userId: string | null = null

    // Tentativa 1: getUserByEmail (disponível em versões recentes)
    try {
      const { data: userData } = await (supabaseAdmin.auth.admin as any).getUserByEmail(email)
      if (userData?.user?.id) {
        userId = userData.user.id
      }
    } catch {
      // Fallback: buscar via user_profiles pelo email cadastrado
    }

    // Tentativa 2 (fallback): buscar pelo email na tabela user_profiles
    if (!userId) {
      const { data: profileData } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id, email')
        .ilike('email', email)
        .maybeSingle()

      if (profileData?.user_id) {
        userId = profileData.user_id
      }
    }

    if (!userId) {
      return NextResponse.json({ found: false })
    }

    const encoded = encodeURIComponent(email)

    // 2. Checar em paralelo todas as áreas
    const [proLideresOwner, proLideresMember, wellnessProfile, capilarTenant, corporalTenant, matrizProfile] =
      await Promise.all([
        // Pro Líderes — dono do tenant
        supabaseAdmin
          .from('leader_tenants')
          .select('id, vertical_code')
          .eq('owner_user_id', userId)
          .eq('vertical_code', 'h-lider')
          .maybeSingle(),

        // Pro Líderes — membro do tenant
        supabaseAdmin
          .from('leader_tenant_members')
          .select('id, leader_tenant_id')
          .eq('user_id', userId)
          .maybeSingle(),

        // Wellness
        supabaseAdmin
          .from('wellness_consultant_profile')
          .select('user_id')
          .eq('user_id', userId)
          .maybeSingle(),

        // Pro Estética Capilar
        supabaseAdmin
          .from('leader_tenants')
          .select('id, vertical_code')
          .eq('owner_user_id', userId)
          .eq('vertical_code', 'estetica-capilar')
          .maybeSingle(),

        // Pro Estética Corporal
        supabaseAdmin
          .from('leader_tenants')
          .select('id, vertical_code')
          .eq('owner_user_id', userId)
          .eq('vertical_code', 'estetica-corporal')
          .maybeSingle(),

        // Matriz YLADA (nutri, coach, med, psi, etc.)
        supabaseAdmin
          .from('user_profiles')
          .select('user_id, perfil')
          .eq('user_id', userId)
          .maybeSingle(),
      ])

    // 3. Retornar a área mais específica
    if (proLideresOwner.data || proLideresMember.data) {
      return NextResponse.json({
        found: true,
        area: 'pro-lideres',
        loginUrl: `/pro-lideres/entrar?email=${encoded}`,
      })
    }

    if (capilarTenant.data) {
      return NextResponse.json({
        found: true,
        area: 'pro-estetica-capilar',
        loginUrl: `/pro-estetica-capilar/entrar?email=${encoded}`,
      })
    }

    if (corporalTenant.data) {
      return NextResponse.json({
        found: true,
        area: 'pro-estetica-corporal',
        loginUrl: `/pro-estetica-corporal/entrar?email=${encoded}`,
      })
    }

    if (wellnessProfile.data) {
      return NextResponse.json({
        found: true,
        area: 'wellness',
        loginUrl: `/pt/wellness/login?email=${encoded}`,
      })
    }

    if (matrizProfile.data) {
      return NextResponse.json({
        found: true,
        area: matrizProfile.data.perfil || 'ylada',
        loginUrl: `/pt/login?email=${encoded}`,
      })
    }

    // Usuário existe no auth mas não tem perfil em nenhuma área conhecida
    return NextResponse.json({
      found: true,
      area: 'ylada',
      loginUrl: `/pt/login?email=${encoded}`,
    })
  } catch (err) {
    console.error('[detect-area] erro:', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
