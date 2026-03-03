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
    const refVendedorFiltro = searchParams.get('ref_vendedor') || 'todos' // 'todos' | 'paula' | etc.
    
    // Novos filtros de período
    const periodoInicio = searchParams.get('periodo_inicio') // YYYY-MM-DD
    const periodoFim = searchParams.get('periodo_fim') // YYYY-MM-DD
    const periodoTipo = searchParams.get('periodo_tipo') // 'mes' | 'trimestre' | 'custom' | 'ultimos_n'
    const ultimosNMeses = searchParams.get('ultimos_n') // número de meses
    
    // Log para debug
    if (process.env.NODE_ENV === 'development') {
      console.log('📥 Parâmetros recebidos:', {
        periodoInicio,
        periodoFim,
        periodoTipo,
        ultimosNMeses,
        areaFiltro,
        statusFiltro
      })
    }

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
    // BUSCAR ASSINATURAS COM DADOS DE USUÁRIOS E ÚLTIMO PAGAMENTO
    // =====================================================
    // Colunas opcionais (podem não existir se migrations não foram aplicadas):
    // is_migrated, migrated_from, requires_manual_renewal, ref_vendedor
    const selectCompleto = `
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
        requires_manual_renewal,
        ref_vendedor
      `
    const selectBase = `
        id,
        user_id,
        area,
        plan_type,
        amount,
        currency,
        status,
        current_period_start,
        current_period_end,
        created_at
      `

    const runQuery = async (selectCols: string, useRefVendedorFiltro: boolean) => {
      let q = supabaseAdmin
        .from('subscriptions')
        .select(selectCols)
        .order('created_at', { ascending: false })
      if (areaFiltro !== 'todos') q = q.eq('area', areaFiltro)
      if (statusFiltro !== 'todos') q = q.eq('status', statusFiltro)
      if (useRefVendedorFiltro && refVendedorFiltro !== 'todos' && refVendedorFiltro.trim()) {
        q = q.eq('ref_vendedor', refVendedorFiltro.trim())
      }
      return await q
    }

    // Aplicar filtros de período (APENAS se especificamente solicitado)
    // IMPORTANTE: Se não houver filtro de período, retornar TODAS as assinaturas ativas
    let periodoInicioDate: Date | null = null
    let periodoFimDate: Date | null = null
    
    if (periodoInicio && periodoFim) {
      const [anoInicio, mesInicio, diaInicio] = periodoInicio.split('-').map(Number)
      const [anoFim, mesFim, diaFim] = periodoFim.split('-').map(Number)
      periodoInicioDate = new Date(anoInicio, mesInicio - 1, diaInicio, 0, 0, 0, 0)
      periodoFimDate = new Date(anoFim, mesFim - 1, diaFim, 23, 59, 59, 999)
    } else if (ultimosNMeses) {
      const mesesAtras = parseInt(ultimosNMeses)
      const dataLimite = new Date()
      dataLimite.setMonth(dataLimite.getMonth() - mesesAtras)
      periodoInicioDate = dataLimite
      periodoFimDate = new Date()
    } else if (periodoTipo === 'mes' && periodoInicio) {
      const [ano, mes] = periodoInicio.split('-')
      periodoInicioDate = new Date(parseInt(ano), parseInt(mes) - 1, 1)
      periodoFimDate = new Date(parseInt(ano), parseInt(mes), 0, 23, 59, 59)
    } else if (periodoTipo === 'trimestre' && periodoInicio) {
      const [ano, trimestre] = periodoInicio.split('-Q')
      const mesInicio = (parseInt(trimestre) - 1) * 3
      const mesFim = parseInt(trimestre) * 3 - 1
      periodoInicioDate = new Date(parseInt(ano), mesInicio, 1)
      periodoFimDate = new Date(parseInt(ano), mesFim + 1, 0, 23, 59, 59)
    }

    let allSubscriptions: any[] | null = null
    let subscriptionsError: any = null
    let useOptionalColumns = true

    const result = await runQuery(selectCompleto, true)
    subscriptionsError = result.error
    allSubscriptions = result.data

    // Se falhou (ex: coluna inexistente), tentar só com colunas base
    const isColumnError = subscriptionsError?.message && (
      /column .* does not exist/i.test(subscriptionsError.message) ||
      /Could not find the column/i.test(subscriptionsError.message)
    )
    if (subscriptionsError && isColumnError) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Colunas opcionais não encontradas em subscriptions, usando query base:', subscriptionsError.message)
      }
      const fallback = await runQuery(selectBase, false)
      subscriptionsError = fallback.error
      allSubscriptions = fallback.data
      useOptionalColumns = false
    }

    if (subscriptionsError) {
      console.error('Erro ao buscar assinaturas:', subscriptionsError)
      return NextResponse.json(
        { error: 'Erro ao buscar assinaturas', details: subscriptionsError.message },
        { status: 500 }
      )
    }
    
    // Log para debug - mostrar todas as assinaturas antes do filtro
    if (process.env.NODE_ENV === 'development') {
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      const hojeStr = hoje.toISOString().split('T')[0]
      
      const assinaturasHoje = (allSubscriptions || []).filter((s: any) => {
        if (!s.created_at) return false
        const createdStr = new Date(s.created_at).toISOString().split('T')[0]
        return createdStr === hojeStr
      })
      
      console.log('📋 Todas as assinaturas encontradas (antes do filtro):', {
        total: allSubscriptions?.length || 0,
        mensais: allSubscriptions?.filter((s: any) => s.plan_type === 'monthly').length || 0,
        anuais: allSubscriptions?.filter((s: any) => s.plan_type === 'annual').length || 0,
        criadasHoje: assinaturasHoje.length,
        mensaisHoje: assinaturasHoje.filter((s: any) => s.plan_type === 'monthly').length,
        anuaisHoje: assinaturasHoje.filter((s: any) => s.plan_type === 'annual').length,
        assinaturasHoje: assinaturasHoje.map((s: any) => ({
          id: s.id,
          plan_type: s.plan_type,
          amount: s.amount,
          valorReais: s.amount ? (s.amount / 100).toFixed(2) : '0.00',
          created_at: s.created_at,
          created_at_date: s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : 'N/A',
          status: s.status,
          area: s.area
        })),
        exemplos: (allSubscriptions || []).slice(0, 10).map((s: any) => ({
          id: s.id,
          plan_type: s.plan_type,
          amount: s.amount,
          created_at: s.created_at,
          created_at_date: s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : 'N/A',
          status: s.status,
          area: s.area
        }))
      })
    }

    // =====================================================
    // BUSCAR ÚLTIMOS PAGAMENTOS (ANTES DO FILTRO)
    // =====================================================
    // Buscar último pagamento de cada subscription para identificar novas vs renovações
    // Isso precisa ser feito ANTES do filtro para que possamos usar a data do pagamento no filtro
    const allSubscriptionIds = (allSubscriptions || []).map((sub: any) => sub.id)
    let lastPayments: Record<string, { date: string; amount: number }> = {}
    
    if (allSubscriptionIds.length > 0) {
      let payments: any[] | null = null
      let paymentsError: any = null
      
      const result = await supabaseAdmin
        .from('payments')
        .select('subscription_id, created_at, amount, status')
        .in('subscription_id', allSubscriptionIds)
        .eq('status', 'succeeded')
        .order('created_at', { ascending: false })
      
      payments = result.data
      paymentsError = result.error
      
      // Filtrar nulls manualmente (caso algum pagamento não tenha subscription_id)
      if (payments) {
        payments = payments.filter((p: any) => p.subscription_id !== null)
        
        // Agrupar por subscription_id e pegar o mais recente
        payments.forEach((payment: any) => {
          if (payment.subscription_id) {
            if (!lastPayments[payment.subscription_id] || 
                new Date(payment.created_at) > new Date(lastPayments[payment.subscription_id].date)) {
              lastPayments[payment.subscription_id] = {
                date: payment.created_at,
                amount: payment.amount
              }
            }
          }
        })
        
        // Log para debug
        if (process.env.NODE_ENV === 'development') {
          console.log('💳 Pagamentos encontrados:', {
            total: payments.length,
            subscriptionsComPagamento: Object.keys(lastPayments).length,
            subscriptionsSemPagamento: allSubscriptionIds.length - Object.keys(lastPayments).length
          })
        }
      }
      
      if (paymentsError) {
        console.error('❌ Erro ao buscar pagamentos:', paymentsError)
      }
    }

    // Aplicar filtro de período no código
    // IMPORTANTE: Novas usam created_at, renovações usam data do último pagamento
    // Isso garante que ambas apareçam no período correto
    let subscriptions = allSubscriptions || []
    if (periodoInicioDate && periodoFimDate) {
      // Normalizar datas para comparar apenas a data (sem hora)
      const inicioNormalizado = new Date(periodoInicioDate)
      inicioNormalizado.setHours(0, 0, 0, 0)
      const fimNormalizado = new Date(periodoFimDate)
      fimNormalizado.setHours(23, 59, 59, 999)
      
      // Log para debug
      if (process.env.NODE_ENV === 'development') {
        console.log('📅 Aplicando filtro de período:', {
          periodoInicioDate: periodoInicioDate.toISOString(),
          periodoFimDate: periodoFimDate.toISOString(),
          inicioNormalizado: inicioNormalizado.toISOString().split('T')[0],
          fimNormalizado: fimNormalizado.toISOString().split('T')[0],
          totalAssinaturasAntes: allSubscriptions?.length || 0
        })
      }
      
      // Função auxiliar para formatar data como YYYY-MM-DD (local, sem timezone)
      const formatarDataLocal = (date: Date) => {
        const ano = date.getFullYear()
        const mes = String(date.getMonth() + 1).padStart(2, '0')
        const dia = String(date.getDate()).padStart(2, '0')
        return `${ano}-${mes}-${dia}`
      }
      
      subscriptions = subscriptions.filter((sub: any) => {
        if (!sub.created_at) return false
        
        const lastPayment = lastPayments[sub.id]
        
        // Determinar se é nova ou renovação ANTES de filtrar
        const subscriptionCreatedAt = new Date(sub.created_at)
        const subscriptionCreatedStr = formatarDataLocal(subscriptionCreatedAt)
        const lastPaymentDate = lastPayment ? new Date(lastPayment.date) : null
        const lastPaymentStr = lastPaymentDate ? formatarDataLocal(lastPaymentDate) : null
        
        // É nova se: não tem pagamento OU created_at está no mesmo dia do último pagamento (diferença < 2 horas)
        let isNova = false
        if (!lastPaymentDate) {
          isNova = true
        } else {
          const diffTime = Math.abs(lastPaymentDate.getTime() - subscriptionCreatedAt.getTime())
          const diffHours = diffTime / (1000 * 60 * 60)
          isNova = diffHours < 2 && subscriptionCreatedStr === lastPaymentStr
        }
        
        // Para filtrar: novas usam created_at, renovações usam data do último pagamento
        // Isso garante que:
        // - Novas aparecem quando foram criadas no período
        // - Renovações aparecem quando foram pagas no período
        const dataParaFiltrar = isNova ? sub.created_at : (lastPayment?.date || sub.created_at)
        
        if (!dataParaFiltrar) return false
        
        // Extrair apenas a data (YYYY-MM-DD) como string para comparação (local, sem timezone)
        const dataFiltro = new Date(dataParaFiltrar)
        const dataFiltroStr = formatarDataLocal(dataFiltro)
        const inicioStr = formatarDataLocal(inicioNormalizado)
        const fimStr = formatarDataLocal(fimNormalizado)
        
        const dentro = dataFiltroStr >= inicioStr && dataFiltroStr <= fimStr
        
        // Log para debug (apenas em desenvolvimento)
        if (process.env.NODE_ENV === 'development' && sub.plan_type !== 'free') {
          console.log('🔍 Filtro período:', {
            id: sub.id,
            plan_type: sub.plan_type,
            amount: sub.amount,
            created_at: sub.created_at,
            last_payment_date: lastPayment?.date,
            isNova,
            dataParaFiltrar,
            dataFiltroStr,
            inicioStr,
            fimStr,
            dentro
          })
        }
        
        return dentro
      })
      
      // Log para debug
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Filtro aplicado - Resumo:', {
          periodoInicio: periodoInicioDate.toISOString().split('T')[0],
          periodoFim: periodoFimDate.toISOString().split('T')[0],
          totalAntes: allSubscriptions?.length || 0,
          totalDepois: subscriptions.length,
          mensais: subscriptions.filter((s: any) => s.plan_type === 'monthly').length,
          anuais: subscriptions.filter((s: any) => s.plan_type === 'annual').length,
          subscriptions: subscriptions.map((s: any) => ({
            id: s.id,
            created_at: s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : 'N/A',
            created_at_original: s.created_at,
            plan_type: s.plan_type,
            amount: s.amount,
            valorReais: s.amount ? (s.amount / 100).toFixed(2) : '0.00',
            currency: s.currency,
            status: s.status,
            area: s.area
          }))
        })
        
        // Log detalhado das assinaturas que foram filtradas FORA
        const filtradasFora = (allSubscriptions || []).filter((sub: any) => {
          if (!sub.created_at) return true
          const createdAt = new Date(sub.created_at)
          const createdAtStr = createdAt.toISOString().split('T')[0]
          const inicioStr = inicioNormalizado.toISOString().split('T')[0]
          const fimStr = fimNormalizado.toISOString().split('T')[0]
          return !(createdAtStr >= inicioStr && createdAtStr <= fimStr)
        })
        
        console.log('🚫 Assinaturas filtradas FORA (não estão no período):', {
          total: filtradasFora.length,
          mensais: filtradasFora.filter((s: any) => s.plan_type === 'monthly').length,
          anuais: filtradasFora.filter((s: any) => s.plan_type === 'annual').length,
          exemplos: filtradasFora.slice(0, 5).map((s: any) => ({
            id: s.id,
            plan_type: s.plan_type,
            created_at: s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : 'N/A',
            amount: s.amount
          }))
        })
      }
    }

    // Buscar perfis de usuários em lote (incluindo is_admin e is_support)
    const userIds = [...new Set((subscriptions || []).map((sub: any) => sub.user_id))]
    let userProfiles = null
    let profilesError = null
    
    if (userIds.length > 0) {
      const result = await supabaseAdmin
        .from('user_profiles')
        .select('user_id, nome_completo, email, is_admin, is_support, nome_presidente')
        .in('user_id', userIds)
      userProfiles = result.data
      profilesError = result.error
    }
    
    // NOTA: A busca de pagamentos já foi feita ANTES do filtro (linha ~188)
    // lastPayments já está disponível aqui

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
    const receitas = subscriptions.map((sub: any) => {
      const userProfile = profilesMap.get(sub.user_id) || {}
      const valor = sub.amount ? sub.amount / 100 : 0 // Converter centavos para reais/dólares
      
      // Identificar tipo de assinatura
      const isAdmin = userProfile.is_admin === true
      const isSupport = userProfile.is_support === true
      
      // =====================================================
      // LÓGICA CORRIGIDA: Priorizar amount=0 para identificar gratuitas
      // =====================================================
      // 
      // 1. SUPORTE: Admin ou Support sempre é suporte
      // 2. GRATUITA: Se amount=0 E não é admin/suporte → SEMPRE é gratuita
      //              OU se plan_type='free' E não é admin/suporte
      // 3. PAGANTE: Não é admin/suporte, não é gratuita, E amount > 0
      // 
      // IMPORTANTE: amount=0 tem PRIORIDADE - se não tem valor, é gratuita
      // Mesmo que plan_type='annual' ou 'monthly', se amount=0, é gratuita
      
      // É gratuita SE:
      // - Não é admin/suporte E amount = 0 (PRIORIDADE MÁXIMA - se não tem valor, é gratuita)
      // OU
      // - plan_type = 'free' E não é admin/suporte
      const isFree = (!isAdmin && !isSupport && valor === 0) || (sub.plan_type === 'free' && !isAdmin && !isSupport)
      
      // É pagante SE:
      // - Não é admin/suporte
      // - Não é gratuita (ou seja, amount > 0)
      // - E amount > 0
      const isPagante = !isAdmin && !isSupport && !isFree && valor > 0
      
      // Calcular histórico (valor total pago até agora)
      // Por enquanto, vamos usar o valor da assinatura atual
      // No futuro, podemos somar pagamentos da tabela payments
      const historico = valor
      
      // Identificar se é nova assinatura ou renovação
      // Comparar created_at da subscription com a data do último pagamento
      const lastPayment = lastPayments[sub.id]
      const subscriptionCreatedAt = sub.created_at ? new Date(sub.created_at) : null
      const lastPaymentDate = lastPayment ? new Date(lastPayment.date) : null
      
      // É nova se:
      // 1. Não tem pagamento registrado (muito raro, mas possível)
      // 2. A subscription foi criada no mesmo dia do último pagamento (ou muito próximo, até 2 horas de diferença)
      let isNova = false
      let dataUltimoPagamento: string | null = null
      
      if (!lastPaymentDate) {
        // Se não tem pagamento, considerar como nova (baseado apenas na criação)
        isNova = true
      } else {
        dataUltimoPagamento = lastPaymentDate.toISOString().split('T')[0]
        const subscriptionCreatedDate = subscriptionCreatedAt ? subscriptionCreatedAt.toISOString().split('T')[0] : null
        
        // Se a subscription foi criada no mesmo dia do último pagamento, é nova
        // Se foi criada antes, é renovação
        if (subscriptionCreatedDate && dataUltimoPagamento) {
          // Comparar apenas a data (ignorar hora)
          const diffTime = Math.abs(lastPaymentDate.getTime() - (subscriptionCreatedAt?.getTime() || 0))
          const diffHours = diffTime / (1000 * 60 * 60)
          
          // Se a diferença for menor que 2 horas, considerar como nova
          // Isso cobre casos onde o webhook pode processar em momentos ligeiramente diferentes
          isNova = diffHours < 2 && subscriptionCreatedDate === dataUltimoPagamento
        } else {
          isNova = false
        }
      }

      return {
        id: sub.id,
        user_id: sub.user_id,
        usuario: userProfile.nome_completo || userProfile.email || 'Usuário sem nome',
        email: userProfile.email || '',
        area: sub.area,
        // Determinar tipo: se é gratuita (amount=0), sempre mostra como 'gratuito'
        // Caso contrário, usa o plan_type
        tipo: isFree ? 'gratuito' : (sub.plan_type === 'annual' ? 'anual' : sub.plan_type === 'monthly' ? 'mensal' : 'gratuito'),
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
        // Campo adicional para data de criação (quando entrou na conta)
        dataCriacao: sub.created_at ? new Date(sub.created_at).toISOString().split('T')[0] : '',
        // Novos campos para categorização
        is_admin: isAdmin,
        is_support: isSupport,
        is_pagante: isPagante,
        categoria: isAdmin ? 'suporte' : isSupport ? 'suporte' : isFree ? 'gratuita' : 'pagante',
        // Campos para identificar novas vs renovações
        is_nova: isNova,
        is_renovacao: !isNova && !!lastPaymentDate,
        data_ultimo_pagamento: dataUltimoPagamento,
        ref_vendedor: sub.ref_vendedor || null,
        nome_presidente: userProfile.nome_presidente || null
      }
    })

    // =====================================================
    // CALCULAR TOTAIS (SEPARANDO NOVAS DE RENOVAÇÕES)
    // =====================================================
    const receitasAtivas = receitas.filter(r => r.status === 'ativa')
    const receitasPagantes = receitasAtivas.filter(r => r.categoria === 'pagante')
    
    // Separar novas e renovações
    const novas = receitasPagantes.filter(r => r.is_nova)
    const renovacoes = receitasPagantes.filter(r => r.is_renovacao)
    
    // Totais gerais (todas as pagantes)
    const totalMensal = receitasPagantes
      .filter(r => r.tipo === 'mensal')
      .reduce((sum, r) => sum + r.valor, 0)

    const totalAnual = receitasPagantes
      .filter(r => r.tipo === 'anual')
      .reduce((sum, r) => sum + r.valor, 0)

    // Para planos anuais, calcular equivalente mensal
    const totalAnualMensalizado = receitasPagantes
      .filter(r => r.tipo === 'anual')
      .reduce((sum, r) => sum + (r.valor / 12), 0)

    const totalReceitas = totalMensal + totalAnualMensalizado
    
    // Totais de NOVAS assinaturas
    // IMPORTANTE: Para novas assinaturas, o anual é mostrado INTEGRAL (não mensalizado)
    // Isso facilita a análise: R$450 anual = R$450, não R$37,50/mês
    const totalMensalNovas = novas
      .filter(r => r.tipo === 'mensal')
      .reduce((sum, r) => sum + r.valor, 0)
    
    const totalAnualNovas = novas
      .filter(r => r.tipo === 'anual')
      .reduce((sum, r) => sum + r.valor, 0)
    
    // Para novas: não mensalizar o anual (mostrar valor integral)
    const totalAnualMensalizadoNovas = 0 // Não usar mensalizado para novas
    
    // Total de novas: mensal + anual integral (não mensalizado)
    const totalReceitasNovas = totalMensalNovas + totalAnualNovas
    
    // Totais de RENOVAÇÕES
    const totalMensalRenovacoes = renovacoes
      .filter(r => r.tipo === 'mensal')
      .reduce((sum, r) => sum + r.valor, 0)
    
    const totalAnualRenovacoes = renovacoes
      .filter(r => r.tipo === 'anual')
      .reduce((sum, r) => sum + r.valor, 0)
    
    const totalAnualMensalizadoRenovacoes = renovacoes
      .filter(r => r.tipo === 'anual')
      .reduce((sum, r) => sum + (r.valor / 12), 0)
    
    const totalReceitasRenovacoes = totalMensalRenovacoes + totalAnualMensalizadoRenovacoes

    return NextResponse.json({
      success: true,
      receitas,
      totais: {
        // Totais gerais (novas + renovações)
        mensal: Math.round(totalMensal * 100) / 100,
        anual: Math.round(totalAnual * 100) / 100,
        anualMensalizado: Math.round(totalAnualMensalizado * 100) / 100,
        geral: Math.round(totalReceitas * 100) / 100,
        ativas: receitasAtivas.length,
        total: receitas.length,
        // Totais de NOVAS assinaturas
        novas: {
          mensal: Math.round(totalMensalNovas * 100) / 100,
          anual: Math.round(totalAnualNovas * 100) / 100,
          anualMensalizado: Math.round(totalAnualMensalizadoNovas * 100) / 100,
          geral: Math.round(totalReceitasNovas * 100) / 100,
          quantidade: novas.length,
          quantidadeMensais: novas.filter(r => r.tipo === 'mensal').length,
          quantidadeAnuais: novas.filter(r => r.tipo === 'anual').length
        },
        // Totais de RENOVAÇÕES
        renovacoes: {
          mensal: Math.round(totalMensalRenovacoes * 100) / 100,
          anual: Math.round(totalAnualRenovacoes * 100) / 100,
          anualMensalizado: Math.round(totalAnualMensalizadoRenovacoes * 100) / 100,
          geral: Math.round(totalReceitasRenovacoes * 100) / 100,
          quantidade: renovacoes.length,
          quantidadeMensais: renovacoes.filter(r => r.tipo === 'mensal').length,
          quantidadeAnuais: renovacoes.filter(r => r.tipo === 'anual').length
        }
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

