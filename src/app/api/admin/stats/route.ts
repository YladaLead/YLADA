import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/admin/stats
 * Retorna estatísticas reais do sistema para o dashboard admin
 * Apenas admin pode acessar
 * 
 * Query params:
 * - area?: 'todos' | 'wellness' | 'nutri' | 'coach' | 'nutra' - Filtrar por área
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

    // Validar área
    const areasValidas = ['todos', 'wellness', 'nutri', 'coach', 'nutra']
    if (!areasValidas.includes(areaFiltro)) {
      return NextResponse.json(
        { error: 'Área inválida' },
        { status: 400 }
      )
    }

    // =====================================================
    // 1. TOTAL DE USUÁRIOS
    // =====================================================
    let usuariosQuery = supabaseAdmin
      .from('user_profiles')
      .select('id, user_id, perfil', { count: 'exact', head: false })

    // Aplicar filtro de área se não for 'todos'
    if (areaFiltro !== 'todos') {
      usuariosQuery = usuariosQuery.eq('perfil', areaFiltro)
    }

    const { count: usuariosTotal, error: usuariosError } = await usuariosQuery

    if (usuariosError) {
      console.error('Erro ao buscar usuários:', usuariosError)
    }

    // =====================================================
    // 2. USUÁRIOS ATIVOS (com assinatura ativa)
    // =====================================================
    let usuariosAtivosQuery = supabaseAdmin
      .from('subscriptions')
      .select('user_id', { count: 'exact', head: false })
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())

    // Aplicar filtro de área se não for 'todos'
    if (areaFiltro !== 'todos') {
      usuariosAtivosQuery = usuariosAtivosQuery.eq('area', areaFiltro)
    }

    const { count: usuariosAtivos, error: usuariosAtivosError } = await usuariosAtivosQuery

    if (usuariosAtivosError) {
      console.error('Erro ao buscar usuários ativos:', usuariosAtivosError)
    }

    // =====================================================
    // 3. TOTAL DE CURSOS (módulos)
    // =====================================================
    // Por enquanto, só temos wellness_curso_modulos
    // No futuro, teremos módulos para outras áreas também
    const { count: cursosTotal, error: cursosError } = await supabaseAdmin
      .from('wellness_curso_modulos')
      .select('id', { count: 'exact', head: true })

    if (cursosError) {
      console.error('Erro ao buscar cursos:', cursosError)
    }

    // Contar módulos ativos (que têm pelo menos um tópico com material)
    // Por enquanto, vamos considerar todos como ativos
    const cursosAtivos = cursosTotal || 0

    // =====================================================
    // 4. TOTAL DE LEADS
    // =====================================================
    let leadsQuery = supabaseAdmin
      .from('leads')
      .select('id', { count: 'exact', head: true })

    // Se tivermos filtro de área, precisaríamos fazer join com user_templates
    // Por enquanto, vamos buscar todos
    const { count: leadsTotal, error: leadsError } = await leadsQuery

    if (leadsError) {
      console.error('Erro ao buscar leads:', leadsError)
    }

    // =====================================================
    // 5. RECEITA MENSAL
    // =====================================================
    let receitaQuery = supabaseAdmin
      .from('subscriptions')
      .select('amount, currency, plan_type')
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())

    // Aplicar filtro de área se não for 'todos'
    if (areaFiltro !== 'todos') {
      receitaQuery = receitaQuery.eq('area', areaFiltro)
    }

    const { data: subscriptions, error: receitaError } = await receitaQuery

    if (receitaError) {
      console.error('Erro ao buscar receita:', receitaError)
    }

    // Calcular receita mensal
    // amount está em centavos, então dividir por 100 para obter valor em reais/dólares
    // Para planos anuais, dividir por 12 para obter valor mensal
    // Planos gratuitos não contam na receita
    let receitaMensal = 0
    if (subscriptions) {
      receitaMensal = subscriptions.reduce((total, sub) => {
        // Ignorar planos gratuitos
        if (sub.plan_type === 'free') {
          return total
        }
        
        const valor = sub.amount / 100 // Converter centavos para reais/dólares
        
        // Se for plano anual, dividir por 12 para obter mensal
        if (sub.plan_type === 'annual') {
          return total + (valor / 12)
        }
        
        // Plano mensal
        return total + valor
      }, 0)
    }

    // Contar assinaturas ativas
    const assinaturasAtivas = subscriptions?.length || 0

    // =====================================================
    // 6. USUÁRIOS POR ÁREA
    // =====================================================
    const usuariosPorArea: Record<string, { total: number; ativos: number }> = {
      nutri: { total: 0, ativos: 0 },
      coach: { total: 0, ativos: 0 },
      nutra: { total: 0, ativos: 0 },
      wellness: { total: 0, ativos: 0 }
    }

    // Buscar total de usuários por área
    for (const area of ['nutri', 'coach', 'nutra', 'wellness']) {
      const { count: total } = await supabaseAdmin
        .from('user_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('perfil', area)

      usuariosPorArea[area].total = total || 0

      // Buscar usuários ativos por área
      const { count: ativos } = await supabaseAdmin
        .from('subscriptions')
        .select('user_id', { count: 'exact', head: true })
        .eq('area', area)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())

      usuariosPorArea[area].ativos = ativos || 0
    }

    // =====================================================
    // 7. RECEITAS POR ÁREA
    // =====================================================
    const receitasPorArea: Record<string, { mensal: number; anual: number }> = {
      nutri: { mensal: 0, anual: 0 },
      coach: { mensal: 0, anual: 0 },
      nutra: { mensal: 0, anual: 0 },
      wellness: { mensal: 0, anual: 0 }
    }

    // Buscar receita por área
    for (const area of ['nutri', 'coach', 'nutra', 'wellness']) {
      const { data: areaSubscriptions } = await supabaseAdmin
        .from('subscriptions')
        .select('amount, plan_type, currency')
        .eq('area', area)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())

      if (areaSubscriptions) {
        let receitaMensalArea = 0
        let receitaAnualArea = 0

        areaSubscriptions.forEach(sub => {
          // Ignorar planos gratuitos
          if (sub.plan_type === 'free') {
            return
          }
          
          const valor = sub.amount / 100 // Converter centavos para reais/dólares
          
          if (sub.plan_type === 'annual') {
            // Plano anual: dividir por 12 para mensal, valor total para anual
            receitaMensalArea += valor / 12
            receitaAnualArea += valor
          } else {
            // Plano mensal
            receitaMensalArea += valor
            receitaAnualArea += valor * 12
          }
        })

        receitasPorArea[area] = {
          mensal: Math.round(receitaMensalArea * 100) / 100,
          anual: Math.round(receitaAnualArea * 100) / 100
        }
      }
    }

    // =====================================================
    // 8. ATIVIDADE RECENTE
    // =====================================================
    const atividadesRecentes: Array<{
      tipo: string
      descricao: string
      area?: string
      timestamp: string
    }> = []

    // Últimos leads (últimas 5)
    const { data: ultimosLeads } = await supabaseAdmin
      .from('leads')
      .select('id, name, created_at, template_id')
      .order('created_at', { ascending: false })
      .limit(5)

    if (ultimosLeads) {
      // Buscar informações dos templates para identificar área
      for (const lead of ultimosLeads) {
        if (lead.template_id) {
          const { data: template } = await supabaseAdmin
            .from('user_templates')
            .select('title, profession')
            .eq('id', lead.template_id)
            .maybeSingle()

          atividadesRecentes.push({
            tipo: 'lead',
            descricao: `Novo lead: ${lead.name}`,
            area: template?.profession || 'unknown',
            timestamp: lead.created_at
          })
        }
      }
    }

    // Últimos módulos criados (últimos 3)
    const { data: ultimosModulos } = await supabaseAdmin
      .from('wellness_curso_modulos')
      .select('id, titulo, created_at')
      .order('created_at', { ascending: false })
      .limit(3)

    if (ultimosModulos) {
      ultimosModulos.forEach(modulo => {
        atividadesRecentes.push({
          tipo: 'curso',
          descricao: `Novo módulo criado: ${modulo.titulo}`,
          area: 'wellness',
          timestamp: modulo.created_at
        })
      })
    }

    // Ordenar por timestamp (mais recente primeiro)
    atividadesRecentes.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    // Limitar a 5 atividades mais recentes
    const atividadesRecentesLimitadas = atividadesRecentes.slice(0, 5)

    // =====================================================
    // 9. MONTAR RESPOSTA
    // =====================================================
    const stats = {
      usuariosTotal: usuariosTotal || 0,
      usuariosAtivos: usuariosAtivos || 0,
      cursosTotal: cursosTotal || 0,
      cursosAtivos: cursosAtivos,
      leadsTotal: leadsTotal || 0,
      receitaMensal: Math.round(receitaMensal * 100) / 100, // Arredondar para 2 casas decimais
      assinaturasAtivas: assinaturasAtivas,
      usuariosPorArea,
      receitasPorArea,
      atividadesRecentes: atividadesRecentesLimitadas,
      filtroAplicado: areaFiltro
    }

    return NextResponse.json({
      success: true,
      stats
    })
  } catch (error: any) {
    console.error('Erro ao buscar estatísticas admin:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar estatísticas',
        technical: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

