import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/** Áreas YLADA (ylada.com) - página institucional */
const YLADA_AREAS = ['nutri', 'coach', 'nutra', 'med', 'psi', 'psicanalise', 'odonto', 'estetica', 'fitness', 'perfumaria', 'ylada']

/** Área Herbalife - fora da página oficial */
const HERBALIFE_AREAS = ['wellness']

interface BlocoStats {
  total: number
  emTrial: number
  pagantes: number
  free: number
  usando: number // ativos nos últimos 30 dias (last_login)
  receitaMensal: number
  porArea: Record<string, number>
}

interface UserInTrial {
  userId: string
  nome: string
  email: string
  area: string
  diasRestantes: number
  dataInicio: string
  dataFim: string
}

interface UserFree {
  userId: string
  nome: string
  email: string
  area: string
  dataCadastro: string
}

/**
 * GET /api/admin/analytics/users-overview
 * Retorna visão agregada por bloco: YLADA (ylada.com) vs Herbalife
 * Inclui: total, em trial (7 dias), pagantes, free, receita, usuários em trial
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const bloco = searchParams.get('bloco') || 'todos' // 'ylada' | 'wellness' | 'todos'

    // =====================================================
    // 1. BUSCAR TODOS OS PERFIS
    // =====================================================
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('id, user_id, nome_completo, email, perfil, last_login, created_at')

    if (profilesError) {
      console.error('Erro ao buscar perfis:', profilesError)
      return NextResponse.json({ error: 'Erro ao buscar perfis' }, { status: 500 })
    }

    const profilesList = profiles || []

    // =====================================================
    // 2. BUSCAR TODAS AS ASSINATURAS ATIVAS (não vencidas)
    // =====================================================
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('id, user_id, area, plan_type, status, amount, current_period_start, current_period_end')
      .gt('current_period_end', new Date().toISOString())

    if (subError) {
      console.error('Erro ao buscar subscriptions:', subError)
      return NextResponse.json({ error: 'Erro ao buscar assinaturas', details: subError.message }, { status: 500 })
    }

    const subsList = subscriptions || []

    // =====================================================
    // 3. CLASSIFICAR USUÁRIOS POR BLOCO E STATUS
    // =====================================================
    const isYlada = (perfil: string | null) => perfil && YLADA_AREAS.includes(perfil)
    const isHerbalife = (perfil: string | null) => perfil && HERBALIFE_AREAS.includes(perfil)

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString()

    const ylada: BlocoStats = {
      total: 0,
      emTrial: 0,
      pagantes: 0,
      free: 0,
      usando: 0,
      receitaMensal: 0,
      porArea: {}
    }

    const herbalife: BlocoStats = {
      total: 0,
      emTrial: 0,
      pagantes: 0,
      free: 0,
      usando: 0,
      receitaMensal: 0,
      porArea: {}
    }

    const usersInTrial: UserInTrial[] = []
    const usuariosFree: UserFree[] = []

    // Mapa: user_id -> melhor subscription (trial > pagante > free)
    const subByUser = new Map<string, { area: string; plan_type: string; status: string; amount: number; current_period_start: string; current_period_end: string }>()
    for (const sub of subsList) {
      const existing = subByUser.get(sub.user_id)
      if (!existing) {
        subByUser.set(sub.user_id, {
          area: sub.area,
          plan_type: sub.plan_type || 'free',
          status: sub.status || 'active',
          amount: sub.amount || 0,
          current_period_start: sub.current_period_start || '',
          current_period_end: sub.current_period_end || ''
        })
      }
    }

    for (const p of profilesList) {
      const perfil = p.perfil || ''
      let target: BlocoStats | null = null

      if (isYlada(perfil)) {
        target = ylada
      } else if (isHerbalife(perfil)) {
        target = herbalife
      } else {
        // Perfis não mapeados (ex: admin) - ignorar ou contar em ylada
        continue
      }

      if (bloco === 'ylada' && target !== ylada) continue
      if (bloco === 'wellness' && target !== herbalife) continue

      target.total++

      // Usando = last_login nos últimos 30 dias
      if (p.last_login && p.last_login >= thirtyDaysAgoISO) {
        target.usando++
      }

      // Por área
      if (!target.porArea[perfil]) target.porArea[perfil] = 0
      target.porArea[perfil]++

      const sub = subByUser.get(p.user_id)

      if (sub) {
        const isTrial = sub.status === 'trialing' || sub.plan_type === 'trial'
        const isPagante = (sub.status === 'active') && ['monthly', 'annual'].includes(sub.plan_type)
        const isFree = sub.plan_type === 'free'

        if (isTrial) {
          target.emTrial++
          const end = new Date(sub.current_period_end)
          const now = new Date()
          const diasRestantes = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
          usersInTrial.push({
            userId: p.user_id,
            nome: p.nome_completo || 'Sem nome',
            email: p.email || '',
            area: perfil,
            diasRestantes,
            dataInicio: sub.current_period_start,
            dataFim: sub.current_period_end
          })
        } else if (isPagante) {
          target.pagantes++
        } else if (isFree) {
          target.free++
          usuariosFree.push({
            userId: p.user_id,
            nome: p.nome_completo || 'Sem nome',
            email: p.email || '',
            area: perfil,
            dataCadastro: p.created_at || ''
          })
        } else {
          target.free++
          usuariosFree.push({
            userId: p.user_id,
            nome: p.nome_completo || 'Sem nome',
            email: p.email || '',
            area: perfil,
            dataCadastro: p.created_at || ''
          })
        }
      } else {
        target.free++
        usuariosFree.push({
          userId: p.user_id,
          nome: p.nome_completo || 'Sem nome',
          email: p.email || '',
          area: perfil,
          dataCadastro: p.created_at || ''
        })
      }
    }

    // Calcular receita mensal (subscriptions anuais = valor/12)
    for (const sub of subsList) {
      if (sub.status !== 'active') continue
      if (!['monthly', 'annual'].includes(sub.plan_type || '')) continue

      const p = profilesList.find(pr => pr.user_id === sub.user_id)
      if (!p) continue

      const perfil = p.perfil || ''
      let target: BlocoStats | null = null
      if (isYlada(perfil)) target = ylada
      else if (isHerbalife(perfil)) target = herbalife
      else continue

      if (bloco === 'ylada' && target !== ylada) continue
      if (bloco === 'wellness' && target !== herbalife) continue

      const valor = (sub.amount || 0) / 100
      target.receitaMensal += sub.plan_type === 'annual' ? valor / 12 : valor
    }

    ylada.receitaMensal = Math.round(ylada.receitaMensal * 100) / 100
    herbalife.receitaMensal = Math.round(herbalife.receitaMensal * 100) / 100

    // Ordenar usuários em trial por dias restantes
    usersInTrial.sort((a, b) => a.diasRestantes - b.diasRestantes)

    // Ordenar usuários Free por data de cadastro (mais recentes primeiro)
    usuariosFree.sort((a, b) => (b.dataCadastro || '').localeCompare(a.dataCadastro || ''))

    return NextResponse.json({
      success: true,
      ylada,
      herbalife,
      usuariosEmTrial: usersInTrial,
      usuariosFree,
      totalGeral: {
        total: ylada.total + herbalife.total,
        emTrial: ylada.emTrial + herbalife.emTrial,
        pagantes: ylada.pagantes + herbalife.pagantes,
        free: ylada.free + herbalife.free,
        usando: ylada.usando + herbalife.usando,
        receitaMensal: ylada.receitaMensal + herbalife.receitaMensal
      }
    })
  } catch (error: any) {
    console.error('Erro na API users-overview:', error)
    return NextResponse.json(
      {
        error: 'Erro ao buscar overview',
        details: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    )
  }
}
