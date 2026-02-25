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

    // Valores padrão (usados se alguma query falhar)
    let usuariosTotal: number = 0
    let usuariosAtivos: number = 0
    let cursosTotal: number = 0
    let cursosAtivos: number = 0
    let leadsTotal: number = 0
    let subscriptions: Array<{ amount: number; plan_type?: string }> = []

    // =====================================================
    // 1. TOTAL DE USUÁRIOS
    // =====================================================
    try {
      let usuariosQuery = supabaseAdmin
        .from('user_profiles')
        .select('user_id, perfil', { count: 'exact', head: false })

      if (areaFiltro !== 'todos') {
        usuariosQuery = usuariosQuery.eq('perfil', areaFiltro)
      }

      const res = await usuariosQuery
      if (!res.error) usuariosTotal = res.count ?? 0
      else console.error('Erro ao buscar usuários:', res.error)
    } catch (e) {
      console.error('Erro ao buscar usuários:', e)
    }

    // =====================================================
    // 2. USUÁRIOS ATIVOS (com assinatura ativa)
    // =====================================================
    try {
      let usuariosAtivosQuery = supabaseAdmin
        .from('subscriptions')
        .select('user_id', { count: 'exact', head: false })
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())

      if (areaFiltro !== 'todos') {
        usuariosAtivosQuery = usuariosAtivosQuery.eq('area', areaFiltro)
      }

      const res = await usuariosAtivosQuery
      if (!res.error) usuariosAtivos = res.count ?? 0
      else console.error('Erro ao buscar usuários ativos:', res.error)
    } catch (e) {
      console.error('Erro ao buscar usuários ativos:', e)
    }

    // =====================================================
    // 3. TOTAL DE CURSOS (módulos)
    // =====================================================
    try {
      const { count: cTotal, error: cursosError } = await supabaseAdmin
        .from('wellness_curso_modulos')
        .select('id', { count: 'exact', head: true })

      if (!cursosError) {
        cursosTotal = cTotal ?? 0
        cursosAtivos = cursosTotal
      } else console.error('Erro ao buscar cursos:', cursosError)
    } catch (e) {
      console.error('Erro ao buscar cursos:', e)
    }

    // =====================================================
    // 4. TOTAL DE LEADS
    // =====================================================
    try {
      const { count: lTotal, error: leadsError } = await supabaseAdmin
        .from('leads')
        .select('id', { count: 'exact', head: true })

      if (!leadsError) leadsTotal = lTotal ?? 0
      else console.error('Erro ao buscar leads:', leadsError)
    } catch (e) {
      console.error('Erro ao buscar leads:', e)
    }

    // =====================================================
    // 5. RECEITA MENSAL
    // =====================================================
    try {
      let receitaQuery = supabaseAdmin
        .from('subscriptions')
        .select('amount, currency, plan_type')
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())

      if (areaFiltro !== 'todos') {
        receitaQuery = receitaQuery.eq('area', areaFiltro)
      }

      const { data: subs, error: receitaError } = await receitaQuery
      if (!receitaError && subs) subscriptions = subs
      else if (receitaError) console.error('Erro ao buscar receita:', receitaError)
    } catch (e) {
      console.error('Erro ao buscar receita:', e)
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

    try {
      for (const area of ['nutri', 'coach', 'nutra', 'wellness']) {
        const { count: total } = await supabaseAdmin
          .from('user_profiles')
          .select('user_id', { count: 'exact', head: true })
          .eq('perfil', area)

        usuariosPorArea[area].total = total || 0

        const { count: ativos } = await supabaseAdmin
          .from('subscriptions')
          .select('user_id', { count: 'exact', head: true })
          .eq('area', area)
          .eq('status', 'active')
          .gt('current_period_end', new Date().toISOString())

        usuariosPorArea[area].ativos = ativos || 0
      }
    } catch (e) {
      console.error('Erro ao buscar usuários por área:', e)
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

    try {
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
    } catch (e) {
      console.error('Erro ao buscar receitas por área:', e)
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

    try {
      const { data: ultimosLeads } = await supabaseAdmin
        .from('leads')
        .select('id, name, created_at, template_id')
        .order('created_at', { ascending: false })
        .limit(5)

      if (ultimosLeads) {
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

      atividadesRecentes.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    } catch (e) {
      console.error('Erro ao buscar atividades recentes:', e)
    }

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

