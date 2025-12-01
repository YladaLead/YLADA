import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/admin/receitas
 * Retorna lista de assinaturas/receitas reais para a página de receitas admin
 * Apenas admin pode acessar
 * 
 * Query params:
 * - area?: 'todos' | 'wellness' | 'nutri' | 'coach' | 'nutra' - Filtrar por área
 * - status?: 'todos' | 'active' | 'canceled' | 'past_due' | 'unpaid' - Filtrar por status
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const areaFiltro = searchParams.get('area') || 'todos'
    const statusFiltro = searchParams.get('status') || 'todos'
    
    // Novos filtros de período
    const periodoInicio = searchParams.get('periodo_inicio') // YYYY-MM-DD
    const periodoFim = searchParams.get('periodo_fim') // YYYY-MM-DD
    const periodoTipo = searchParams.get('periodo_tipo') // 'mes' | 'trimestre' | 'custom' | 'ultimos_n'
    const ultimosNMeses = searchParams.get('ultimos_n') // número de meses

    // Validar área
    const areasValidas = ['todos', 'wellness', 'nutri', 'coach', 'nutra']
    if (!areasValidas.includes(areaFiltro)) {
      return NextResponse.json(
        { error: 'Área inválida' },
        { status: 400 }
      )
    }

    // Validar status
    const statusValidos = ['todos', 'active', 'canceled', 'past_due', 'unpaid', 'trialing', 'incomplete']
    if (!statusValidos.includes(statusFiltro)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      )
    }

    // =====================================================
    // BUSCAR ASSINATURAS COM DADOS DE USUÁRIOS
    // =====================================================
    // Primeiro buscar assinaturas
    let subscriptionsQuery = supabaseAdmin
      .from('subscriptions')
      .select(`
        id,
        user_id,
        area,
        plan_type,
        amount,
        currency,
        status,
        current_period_start,
        current_period_end,
        created_at,
        is_migrated,
        migrated_from,
        requires_manual_renewal
      `)
      .order('created_at', { ascending: false })

    // Aplicar filtro de área
    if (areaFiltro !== 'todos') {
      subscriptionsQuery = subscriptionsQuery.eq('area', areaFiltro)
    }

    // Aplicar filtro de status
    if (statusFiltro !== 'todos') {
      subscriptionsQuery = subscriptionsQuery.eq('status', statusFiltro)
    }

    // Aplicar filtros de período
    if (periodoInicio && periodoFim) {
      // Filtro por período customizado (data início - data fim)
      subscriptionsQuery = subscriptionsQuery
        .gte('created_at', `${periodoInicio}T00:00:00.000Z`)
        .lte('created_at', `${periodoFim}T23:59:59.999Z`)
    } else if (ultimosNMeses) {
      // Filtro por últimos N meses
      const mesesAtras = parseInt(ultimosNMeses)
      const dataLimite = new Date()
      dataLimite.setMonth(dataLimite.getMonth() - mesesAtras)
      subscriptionsQuery = subscriptionsQuery.gte('created_at', dataLimite.toISOString())
    } else if (periodoTipo === 'mes' && periodoInicio) {
      // Filtro por mês específico (YYYY-MM)
      const [ano, mes] = periodoInicio.split('-')
      const inicioMes = new Date(parseInt(ano), parseInt(mes) - 1, 1)
      const fimMes = new Date(parseInt(ano), parseInt(mes), 0, 23, 59, 59)
      subscriptionsQuery = subscriptionsQuery
        .gte('created_at', inicioMes.toISOString())
        .lte('created_at', fimMes.toISOString())
    } else if (periodoTipo === 'trimestre' && periodoInicio) {
      // Filtro por trimestre (Q1, Q2, Q3, Q4)
      const [ano, trimestre] = periodoInicio.split('-Q')
      const mesInicio = (parseInt(trimestre) - 1) * 3
      const mesFim = parseInt(trimestre) * 3 - 1
      const inicioTrimestre = new Date(parseInt(ano), mesInicio, 1)
      const fimTrimestre = new Date(parseInt(ano), mesFim + 1, 0, 23, 59, 59)
      subscriptionsQuery = subscriptionsQuery
        .gte('created_at', inicioTrimestre.toISOString())
        .lte('created_at', fimTrimestre.toISOString())
    }

    const { data: subscriptions, error: subscriptionsError } = await subscriptionsQuery

    if (subscriptionsError) {
      console.error('Erro ao buscar assinaturas:', subscriptionsError)
      return NextResponse.json(
        { error: 'Erro ao buscar assinaturas', details: subscriptionsError.message },
        { status: 500 }
      )
    }

    // Buscar perfis de usuários em lote (incluindo is_admin e is_support)
    const userIds = [...new Set((subscriptions || []).map((sub: any) => sub.user_id))]
    const { data: userProfiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, nome_completo, email, is_admin, is_support')
      .in('user_id', userIds)

    if (profilesError) {
      console.error('Erro ao buscar perfis:', profilesError)
    }

    // Criar mapa de perfis por user_id
    const profilesMap = new Map()
    if (userProfiles) {
      userProfiles.forEach((profile: any) => {
        profilesMap.set(profile.user_id, profile)
      })
    }

    // =====================================================
    // FORMATAR DADOS PARA O FRONTEND
    // =====================================================
    const receitas = (subscriptions || []).map((sub: any) => {
      const userProfile = profilesMap.get(sub.user_id) || {}
      const valor = sub.amount ? sub.amount / 100 : 0 // Converter centavos para reais/dólares
      
      // Identificar tipo de assinatura
      const isAdmin = userProfile.is_admin === true
      const isSupport = userProfile.is_support === true
      
      // =====================================================
      // LÓGICA CORRIGIDA: Priorizar plan_type='free'
      // =====================================================
      // 
      // 1. SUPORTE: Admin ou Support sempre é suporte
      // 2. GRATUITA: Se plan_type='free' → SEMPRE é gratuita (prioridade máxima)
      //              OU se amount=0 E não é admin/suporte
      // 3. PAGANTE: Não é admin/suporte, não é gratuita, E amount > 0
      // 
      // IMPORTANTE: plan_type='free' tem PRIORIDADE - se está marcado como free, é gratuita
      
      // É gratuita SE:
      // - plan_type = 'free' (PRIORIDADE MÁXIMA - se está marcado como free, é gratuita)
      // OU
      // - Não é admin/suporte E amount = 0
      const isFree = sub.plan_type === 'free' || (!isAdmin && !isSupport && valor === 0)
      
      // É pagante SE:
      // - Não é admin/suporte
      // - Não é gratuita (ou seja, plan_type != 'free' E amount > 0)
      // - E amount > 0
      const isPagante = !isAdmin && !isSupport && !isFree && valor > 0
      
      // Calcular histórico (valor total pago até agora)
      // Por enquanto, vamos usar o valor da assinatura atual
      // No futuro, podemos somar pagamentos da tabela payments
      const historico = valor

      return {
        id: sub.id,
        user_id: sub.user_id,
        usuario: userProfile.nome_completo || userProfile.email || 'Usuário sem nome',
        email: userProfile.email || '',
        area: sub.area,
        tipo: sub.plan_type === 'annual' ? 'anual' : sub.plan_type === 'monthly' ? 'mensal' : sub.plan_type === 'free' ? 'gratuito' : 'gratuito',
        valor: Math.round(valor * 100) / 100, // Arredondar para 2 casas decimais
        status: sub.status === 'active' ? 'ativa' : 
                sub.status === 'canceled' ? 'cancelada' : 
                sub.status === 'past_due' ? 'atrasada' : 
                sub.status === 'unpaid' ? 'não paga' : 
                sub.status === 'trialing' ? 'trial' : 'expirada',
        dataInicio: sub.current_period_start ? new Date(sub.current_period_start).toISOString().split('T')[0] : '',
        proxVencimento: sub.current_period_end ? new Date(sub.current_period_end).toISOString().split('T')[0] : '',
        historico: Math.round(historico * 100) / 100,
        is_migrated: sub.is_migrated || false,
        migrated_from: sub.migrated_from || null,
        requires_manual_renewal: sub.requires_manual_renewal || false,
        currency: sub.currency || 'usd',
        created_at: sub.created_at,
        // Novos campos para categorização
        is_admin: isAdmin,
        is_support: isSupport,
        is_pagante: isPagante,
        categoria: isAdmin ? 'suporte' : isSupport ? 'suporte' : isFree ? 'gratuita' : 'pagante'
      }
    })

    // =====================================================
    // CALCULAR TOTAIS
    // =====================================================
    const receitasAtivas = receitas.filter(r => r.status === 'ativa')
    
    const totalMensal = receitasAtivas
      .filter(r => r.tipo === 'mensal')
      .reduce((sum, r) => sum + r.valor, 0)

    const totalAnual = receitasAtivas
      .filter(r => r.tipo === 'anual')
      .reduce((sum, r) => sum + r.valor, 0)

    // Para planos anuais, calcular equivalente mensal
    const totalAnualMensalizado = receitasAtivas
      .filter(r => r.tipo === 'anual')
      .reduce((sum, r) => sum + (r.valor / 12), 0)

    const totalReceitas = totalMensal + totalAnualMensalizado

    return NextResponse.json({
      success: true,
      receitas,
      totais: {
        mensal: Math.round(totalMensal * 100) / 100,
        anual: Math.round(totalAnual * 100) / 100,
        anualMensalizado: Math.round(totalAnualMensalizado * 100) / 100,
        geral: Math.round(totalReceitas * 100) / 100,
        ativas: receitasAtivas.length,
        total: receitas.length
      }
    })
  } catch (error: any) {
    console.error('Erro na API de receitas:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar receitas',
        details: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    )
  }
}

