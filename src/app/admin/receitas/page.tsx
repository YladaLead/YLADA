'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, ReactElement } from 'react'

interface Receita {
  id: string
  user_id: string
  usuario: string
  email: string
  area: 'nutri' | 'coach' | 'nutra' | 'wellness'
  tipo: 'mensal' | 'anual' | 'gratuito'
  valor: number
  status: 'ativa' | 'cancelada' | 'expirada' | 'atrasada' | 'não paga' | 'trial'
  dataInicio: string
  proxVencimento: string
  historico: number
  is_migrated?: boolean
  migrated_from?: string | null
  requires_manual_renewal?: boolean
  currency?: string
  is_admin?: boolean
  is_support?: boolean
  is_pagante?: boolean
  categoria?: 'pagante' | 'gratuita' | 'suporte'
  dataCriacao?: string // Data de criação (quando entrou na conta)
  is_nova?: boolean // Se é nova assinatura
  is_renovacao?: boolean // Se é renovação
  data_ultimo_pagamento?: string | null // Data do último pagamento
  ref_vendedor?: string | null // Atribuição de venda (ex: paula)
}

interface Totais {
  mensal: number
  anual: number
  anualMensalizado: number
  geral: number
  ativas: number
  total: number
  novas?: {
    mensal: number
    anual: number
    anualMensalizado: number
    geral: number
    quantidade: number
    quantidadeMensais: number
    quantidadeAnuais: number
  }
  renovacoes?: {
    mensal: number
    anual: number
    anualMensalizado: number
    geral: number
    quantidade: number
    quantidadeMensais: number
    quantidadeAnuais: number
  }
}

export default function AdminReceitas() {
  // =====================================================
  // ESTADOS DE FILTROS (SEMPRE VISÍVEIS)
  // =====================================================
  const [filtroArea, setFiltroArea] = useState<'todos' | 'nutri' | 'coach' | 'nutra' | 'wellness'>('todos')
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'active' | 'canceled' | 'past_due' | 'unpaid'>('todos')
  const [filtroVendedor, setFiltroVendedor] = useState<string>('todos') // 'todos' ou ref (ex: paula, maria)
  const [listaVendedores, setListaVendedores] = useState<string[]>([]) // ref_vendedor distintos da API
  
  // =====================================================
  // FILTRO DE PERÍODO (UNIFICADO E SIMPLIFICADO)
  // =====================================================
  const [filtroPeriodoAberto, setFiltroPeriodoAberto] = useState(false)
  const [periodoTipo, setPeriodoTipo] = useState<'rapido' | 'mes' | 'trimestre' | 'dia' | 'custom'>('rapido')
  const [periodoRapido, setPeriodoRapido] = useState<'todos' | 'este_mes' | 'mes_passado' | 'ultimos_3' | 'ultimos_6' | 'ultimos_12' | 'este_trimestre' | 'trimestre_passado'>('todos')
  const [mesSelecionado, setMesSelecionado] = useState<string>('')
  const [trimestreSelecionado, setTrimestreSelecionado] = useState<string>('')
  const [diaSelecionado, setDiaSelecionado] = useState<string>('')
  const [dataInicio, setDataInicio] = useState<string>('')
  const [dataFim, setDataFim] = useState<string>('')
  
  // =====================================================
  // TOGGLE PARA VISUALIZAÇÃO
  // =====================================================
  const [abaAtiva, setAbaAtiva] = useState<'receitas' | 'assinaturas'>('receitas') // Nova aba: Receitas vs Assinaturas
  const [verPorArea, setVerPorArea] = useState(false)
  
  const [receitas, setReceitas] = useState<Receita[]>([])
  const [totais, setTotais] = useState<Totais>({
    mensal: 0,
    anual: 0,
    anualMensalizado: 0,
    geral: 0,
    ativas: 0,
    total: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar lista de vendedores (ref_vendedor distintos) para o dropdown
  useEffect(() => {
    const carregarVendedores = async () => {
      try {
        const res = await fetch('/api/admin/receitas/vendedores', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setListaVendedores(data.vendedores || [])
        }
      } catch {
        // Ignorar; dropdown ficará vazio além de "Todos"
      }
    }
    carregarVendedores()
  }, [])

  // Buscar dados da API
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (filtroArea !== 'todos') {
          params.append('area', filtroArea)
        }
        if (filtroStatus !== 'todos') {
          params.append('status', filtroStatus)
        }
        if (filtroVendedor !== 'todos' && filtroVendedor.trim()) {
          params.append('ref_vendedor', filtroVendedor.trim())
        }

        // Adicionar filtros de período avançado (apenas se não for "todos")
        if (periodoTipo === 'rapido' && periodoRapido !== 'todos') {
          const hoje = new Date()
          let inicio: Date | undefined, fim: Date | undefined
          
          switch (periodoRapido) {
            case 'este_mes':
              // Criar datas no início e fim do mês atual (timezone local)
              inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1, 0, 0, 0, 0)
              fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59, 999)
              break
            case 'mes_passado':
              inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, 1)
              fim = new Date(hoje.getFullYear(), hoje.getMonth(), 0, 23, 59, 59)
              break
            case 'ultimos_3':
              inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 3, 1)
              fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59)
              break
            case 'ultimos_6':
              inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 6, 1)
              fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59)
              break
            case 'ultimos_12':
              inicio = new Date(hoje.getFullYear(), hoje.getMonth() - 12, 1)
              fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59)
              break
            case 'este_trimestre':
              const trimestreAtual = Math.floor(hoje.getMonth() / 3)
              inicio = new Date(hoje.getFullYear(), trimestreAtual * 3, 1)
              fim = new Date(hoje.getFullYear(), (trimestreAtual + 1) * 3, 0, 23, 59, 59)
              break
            case 'trimestre_passado':
              const trimestrePassado = Math.floor(hoje.getMonth() / 3) - 1
              inicio = new Date(hoje.getFullYear(), trimestrePassado * 3, 1)
              fim = new Date(hoje.getFullYear(), (trimestrePassado + 1) * 3, 0, 23, 59, 59)
              break
            default:
              break
          }
          
          if (inicio && fim) {
            // Converter para YYYY-MM-DD sem usar toISOString (que converte para UTC)
            // Isso evita problemas de timezone
            const formatarData = (data: Date) => {
              const ano = data.getFullYear()
              const mes = String(data.getMonth() + 1).padStart(2, '0')
              const dia = String(data.getDate()).padStart(2, '0')
              return `${ano}-${mes}-${dia}`
            }
            
            params.append('periodo_inicio', formatarData(inicio))
            params.append('periodo_fim', formatarData(fim))
            params.append('periodo_tipo', 'custom')
            
            // Log para debug
            console.log('📤 Enviando filtro de período:', {
              periodoRapido,
              inicio: formatarData(inicio),
              fim: formatarData(fim),
              inicioISO: inicio.toISOString(),
              fimISO: fim.toISOString()
            })
          }
        } else if (periodoTipo === 'mes' && mesSelecionado) {
          params.append('periodo_inicio', mesSelecionado)
          params.append('periodo_tipo', 'mes')
        } else if (periodoTipo === 'trimestre' && trimestreSelecionado) {
          params.append('periodo_inicio', trimestreSelecionado)
          params.append('periodo_tipo', 'trimestre')
        } else if (periodoTipo === 'dia' && diaSelecionado) {
          params.append('periodo_inicio', diaSelecionado)
          params.append('periodo_fim', diaSelecionado)
          params.append('periodo_tipo', 'custom')
        } else if (periodoTipo === 'custom' && dataInicio && dataFim) {
          params.append('periodo_inicio', dataInicio)
          params.append('periodo_fim', dataFim)
          params.append('periodo_tipo', 'custom')
        }

        const url = `/api/admin/receitas${params.toString() ? `?${params.toString()}` : ''}`
        const response = await fetch(url, {
          credentials: 'include'
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Sessão expirada. Por favor, faça login novamente.')
          } else if (response.status === 403) {
            throw new Error('Acesso negado. Você não tem permissão para acessar esta página.')
          } else {
            const errorData = await response.json().catch(() => ({}))
            const msg = errorData.error || `Erro ao carregar receitas (${response.status})`
            const detail = errorData.details ? ` ${errorData.details}` : ''
            throw new Error(msg + detail)
          }
        }

        const data = await response.json()

        if (data.success && data.receitas) {
          // Log para debug
          const hoje = new Date()
          hoje.setHours(0, 0, 0, 0)
          // Usar formato local para evitar problemas de timezone
          const ano = hoje.getFullYear()
          const mes = String(hoje.getMonth() + 1).padStart(2, '0')
          const dia = String(hoje.getDate()).padStart(2, '0')
          const hojeStr = `${ano}-${mes}-${dia}`
          
          const receitasHoje = data.receitas.filter((r: Receita) => {
            const dataCriacaoStr = r.dataCriacao || r.dataInicio
            if (!dataCriacaoStr) return false
            
            // Converter para formato YYYY-MM-DD sem usar toISOString (que converte para UTC)
            const dataCriacao = new Date(dataCriacaoStr)
            const anoCriacao = dataCriacao.getFullYear()
            const mesCriacao = String(dataCriacao.getMonth() + 1).padStart(2, '0')
            const diaCriacao = String(dataCriacao.getDate()).padStart(2, '0')
            const dataCriacaoStrOnly = `${anoCriacao}-${mesCriacao}-${diaCriacao}`
            
            return dataCriacaoStrOnly === hojeStr
          })
          
          console.log('📥 Dados recebidos da API:', {
            totalReceitas: data.receitas.length,
            receitasMensais: data.receitas.filter((r: Receita) => r.tipo === 'mensal' && r.categoria === 'pagante').length,
            receitasAnuais: data.receitas.filter((r: Receita) => r.tipo === 'anual' && r.categoria === 'pagante').length,
            receitasHoje: receitasHoje.length,
            hojeStr,
            todasReceitas: data.receitas.map((r: Receita) => {
              // Converter datas para formato YYYY-MM-DD sem usar toISOString
              const formatarData = (dataStr: string | undefined) => {
                if (!dataStr) return null
                const d = new Date(dataStr)
                const ano = d.getFullYear()
                const mes = String(d.getMonth() + 1).padStart(2, '0')
                const dia = String(d.getDate()).padStart(2, '0')
                return `${ano}-${mes}-${dia}`
              }
              
              return {
                id: r.id,
                tipo: r.tipo,
                categoria: r.categoria,
                valor: r.valor,
                currency: r.currency,
                dataCriacao: r.dataCriacao,
                dataInicio: r.dataInicio,
                dataCriacaoDate: formatarData(r.dataCriacao),
                dataInicioDate: formatarData(r.dataInicio),
                status: r.status,
                area: r.area
              }
            })
          })
          
          setReceitas(data.receitas)
          setTotais(data.totais || {
            mensal: 0,
            anual: 0,
            anualMensalizado: 0,
            geral: 0,
            ativas: 0,
            total: 0
          })
        } else {
          throw new Error('Formato de dados inválido')
        }
      } catch (err: any) {
        console.error('Erro ao carregar receitas:', err)
        setError(err.message || 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [filtroArea, filtroStatus, filtroVendedor, periodoTipo, periodoRapido, mesSelecionado, trimestreSelecionado, diaSelecionado, dataInicio, dataFim])

  // =====================================================
  // ESTADOS PARA MODAIS DE DETALHES
  // =====================================================
  const [mostrarDetalhesMensal, setMostrarDetalhesMensal] = useState(false)
  const [mostrarDetalhesAnual, setMostrarDetalhesAnual] = useState(false)

  // =====================================================
  // CALCULAR TOTAIS - APENAS PAGANTES (USANDO VALORES REAIS)
  // =====================================================
  const receitasAtivas = receitas.filter(r => r.status === 'ativa')
  const receitasPagantes = receitasAtivas.filter(r => r.categoria === 'pagante')
  
  // Separar mensais e anuais
  const receitasMensais = receitasPagantes.filter(r => r.tipo === 'mensal')
  const receitasAnuais = receitasPagantes.filter(r => r.tipo === 'anual')
  
  // Calcular totais usando VALORES REAIS das assinaturas
  // ANUAL: Como é antecipado (recebe tudo de uma vez), soma o valor integral
  // MENSAL: Soma o valor mensal real de cada assinatura
  const totalMensalPagante = receitasMensais.reduce((sum, r) => sum + r.valor, 0)
  const totalAnualPagante = receitasAnuais.reduce((sum, r) => sum + r.valor, 0)
  
  // DEBUG: Log para verificar (apenas em desenvolvimento)
  if (typeof window !== 'undefined') {
    // Verificar assinaturas criadas hoje
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const receitasHoje = receitas.filter(r => {
      // Usar dataCriacao se disponível, senão usar dataInicio
      const dataCriacaoStr = r.dataCriacao || r.dataInicio
      if (!dataCriacaoStr) return false
      const dataCriacao = new Date(dataCriacaoStr)
      dataCriacao.setHours(0, 0, 0, 0)
      return dataCriacao.getTime() === hoje.getTime()
    })
    const mensaisWellnessHoje = receitasMensais.filter(r => {
      const dataCriacaoStr = r.dataCriacao || r.dataInicio
      if (!dataCriacaoStr) return false
      const dataCriacao = new Date(dataCriacaoStr)
      dataCriacao.setHours(0, 0, 0, 0)
      return dataCriacao.getTime() === hoje.getTime() && r.area === 'wellness'
    })
    
    console.log('🔍 DEBUG Receitas:', {
      totalReceitas: receitas.length,
      receitasAtivas: receitasAtivas.length,
      receitasPagantes: receitasPagantes.length,
      receitasMensais: receitasMensais.length,
      receitasAnuais: receitasAnuais.length,
      mensaisWellness: receitasMensais.filter(r => r.area === 'wellness').length,
      mensaisWellnessDetalhes: receitasMensais.filter(r => r.area === 'wellness').map(r => ({
        usuario: r.usuario,
        email: r.email,
        valor: r.valor,
        categoria: r.categoria,
        tipo: r.tipo,
        area: r.area,
        status: r.status,
        dataInicio: r.dataInicio
      })),
      // NOVO: Informações sobre assinaturas de hoje
      receitasCriadasHoje: receitasHoje.length,
      mensaisWellnessHoje: mensaisWellnessHoje.length,
      mensaisWellnessHojeDetalhes: mensaisWellnessHoje.map(r => ({
        usuario: r.usuario,
        email: r.email,
        valor: r.valor,
        categoria: r.categoria,
        tipo: r.tipo,
        area: r.area,
        status: r.status,
        dataInicio: r.dataInicio
      })),
      totalMensalPagante,
      filtroArea,
      filtroStatus,
      periodoTipo,
      periodoRapido
    })
  }
  
  // Total do mês: Anual (integral, pois entrou tudo no mês) + Mensal (do mês)
  const totalReceitasPagante = totalAnualPagante + totalMensalPagante
  
  // Totais por área (apenas pagantes) - usando valores reais
  const totaisPorArea = verPorArea ? receitasPagantes.reduce((acc, r) => {
    if (!acc[r.area]) {
      acc[r.area] = {
        mensal: 0,
        anual: 0,
        total: 0,
        pagantes: 0,
        receitasMensais: [] as Receita[],
        receitasAnuais: [] as Receita[]
      }
    }
    
    if (r.tipo === 'mensal') {
      acc[r.area].mensal += r.valor
      acc[r.area].receitasMensais.push(r)
      acc[r.area].pagantes++
    } else if (r.tipo === 'anual') {
      acc[r.area].anual += r.valor
      acc[r.area].receitasAnuais.push(r)
      acc[r.area].pagantes++
    }
    
    acc[r.area].total = acc[r.area].anual + acc[r.area].mensal // Anual integral + mensal
    
    return acc
  }, {} as Record<string, { mensal: number; anual: number; total: number; pagantes: number; receitasMensais: Receita[]; receitasAnuais: Receita[] }>) : null

  // Contadores por categoria (para seção de assinaturas)
  const totalPagantes = receitasPagantes.length
  const totalGratuitas = receitasAtivas.filter(r => r.categoria === 'gratuita').length
  const totalSuporte = receitasAtivas.filter(r => r.categoria === 'suporte').length

  // Filtrar receitas para tabela (agora mostra todas, o filtro de período é aplicado na API)
  const receitasFiltradas = receitas

  const getAreaIcon = (area: string) => {
    switch (area) {
      case 'nutri': return '🥗'
      case 'coach': return '💜'
      case 'nutra': return '🔬'
      case 'wellness': return '💖'
      default: return '👤'
    }
  }

  const getStatusBadge = (status: string, isMigrated?: boolean) => {
    const badges: Record<string, ReactElement> = {
      'ativa': <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Ativa</span>,
      'cancelada': <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelada</span>,
      'expirada': <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Expirada</span>,
      'atrasada': <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Atrasada</span>,
      'não paga': <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Não Paga</span>,
      'trial': <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Trial</span>
    }

    return (
      <div className="flex items-center gap-1">
        {badges[status] || <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>}
        {isMigrated && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800" title="Migrado">🔄</span>
        )}
      </div>
    )
  }

  const getCategoriaBadge = (categoria?: string) => {
    if (!categoria) return null
    
    const badges: Record<string, ReactElement> = {
      'pagante': <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800" title="Cliente pagante">💳 Pagante</span>,
      'gratuita': <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800" title="Plano gratuito">🆓 Gratuita</span>,
      'suporte': <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800" title="Admin/Suporte">🛟 Suporte</span>
    }

    return badges[categoria] || null
  }

  const formatCurrency = (valor: number, currency: string = 'usd') => {
    const symbol = currency === 'brl' ? 'R$' : '$'
    return `${symbol} ${valor.toFixed(2).replace('.', ',')}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Image
                  src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
                  alt="YLADA"
                  width={180}
                  height={60}
                  className="h-12"
                />
              </Link>
              <div className="h-12 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Receitas & Assinaturas</h1>
                <p className="text-sm text-gray-600">Controle financeiro completo por área</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/subscriptions"
                className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                🎁 Criar Plano Gratuito
              </Link>
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Voltar
              </Link>
            </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensagens de Erro */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* ===================================================== */}
        {/* FILTROS SEMPRE VISÍVEIS */}
        {/* ===================================================== */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 space-y-6">
            {/* Filtro Área - SEMPRE VISÍVEL */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-lg">🌐</span>
                Filtrar por Área
              </label>
              <div className="flex flex-wrap gap-2">
                {['todos', 'nutri', 'coach', 'nutra', 'wellness'].map((area) => (
                  <button
                    key={area}
                    onClick={() => setFiltroArea(area as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filtroArea === area
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {area === 'todos' ? 'Todos' : area.charAt(0).toUpperCase() + area.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro Status - SEMPRE VISÍVEL */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-lg">📊</span>
                Filtrar por Status
              </label>
              <div className="flex flex-wrap gap-2">
                {['todos', 'active', 'canceled', 'past_due', 'unpaid'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFiltroStatus(status as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filtroStatus === status
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'todos' ? 'Todos' : 
                     status === 'active' ? 'Ativas' :
                     status === 'canceled' ? 'Canceladas' :
                     status === 'past_due' ? 'Atrasadas' :
                     status === 'unpaid' ? 'Não Pagas' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro Vendedor - vendas atribuídas (ex: Paula); lista dinâmica da API */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-lg">👤</span>
                Vendedor
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFiltroVendedor('todos')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filtroVendedor === 'todos'
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Todos
                </button>
                {listaVendedores.map((ref) => {
                  const label = ref.charAt(0).toUpperCase() + ref.slice(1).toLowerCase()
                  return (
                    <button
                      key={ref}
                      onClick={() => setFiltroVendedor(ref)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filtroVendedor === ref
                          ? 'bg-teal-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Filtro Período - UNIFICADO E SIMPLIFICADO */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-lg">📅</span>
                Filtrar por Período
                {(periodoRapido !== 'todos' || mesSelecionado || trimestreSelecionado || diaSelecionado || (dataInicio && dataFim)) && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                    Filtro Ativo
                  </span>
                )}
              </label>
              
              {/* Opções Rápidas - SEMPRE VISÍVEIS */}
              {periodoTipo === 'rapido' && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <button
                      onClick={() => setPeriodoRapido('todos')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        periodoRapido === 'todos'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setPeriodoRapido('este_mes')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        periodoRapido === 'este_mes'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Este Mês
                    </button>
                    <button
                      onClick={() => setPeriodoRapido('mes_passado')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        periodoRapido === 'mes_passado'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Mês Passado
                    </button>
                    <button
                      onClick={() => setPeriodoRapido('ultimos_3')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        periodoRapido === 'ultimos_3'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Últimos 3 Meses
                    </button>
                    <button
                      onClick={() => setPeriodoRapido('ultimos_6')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        periodoRapido === 'ultimos_6'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Últimos 6 Meses
                    </button>
                    <button
                      onClick={() => setPeriodoRapido('ultimos_12')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        periodoRapido === 'ultimos_12'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Últimos 12 Meses
                    </button>
                    <button
                      onClick={() => setPeriodoRapido('este_trimestre')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        periodoRapido === 'este_trimestre'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Este Trimestre
                    </button>
                    <button
                      onClick={() => setPeriodoRapido('trimestre_passado')}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        periodoRapido === 'trimestre_passado'
                          ? 'bg-green-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Trimestre Passado
                    </button>
                  </div>
                </div>
              )}

              {/* Opções Avançadas - COLAPSÁVEL */}
              <div className="border-t border-gray-200 pt-3">
                <button
                  onClick={() => setFiltroPeriodoAberto(!filtroPeriodoAberto)}
                  className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span>⚙️</span>
                    Opções Avançadas
                  </span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${filtroPeriodoAberto ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                  
                {filtroPeriodoAberto && (
                    <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {/* Tipo de Filtro - Cards Visuais */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Escolha o tipo de filtro:</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          <button
                            onClick={() => setPeriodoTipo('rapido')}
                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                              periodoTipo === 'rapido'
                                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            <div className="text-lg mb-1">⚡</div>
                            <div>Rápido</div>
                          </button>
                          <button
                            onClick={() => setPeriodoTipo('mes')}
                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                              periodoTipo === 'mes'
                                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            <div className="text-lg mb-1">📅</div>
                            <div>Mês</div>
                          </button>
                          <button
                            onClick={() => setPeriodoTipo('trimestre')}
                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                              periodoTipo === 'trimestre'
                                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            <div className="text-lg mb-1">📊</div>
                            <div>Trimestre</div>
                          </button>
                          <button
                            onClick={() => setPeriodoTipo('dia')}
                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                              periodoTipo === 'dia'
                                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            <div className="text-lg mb-1">📆</div>
                            <div>Dia</div>
                          </button>
                          <button
                            onClick={() => setPeriodoTipo('custom')}
                            className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                              periodoTipo === 'custom'
                                ? 'bg-blue-600 text-white shadow-md transform scale-105'
                                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                            }`}
                          >
                            <div className="text-lg mb-1">🔧</div>
                            <div>Personalizado</div>
                          </button>
                        </div>
                      </div>

                      {/* Opções Específicas - Apenas quando não for 'rapido' */}
                      {periodoTipo !== 'rapido' && (
                        <div className="space-y-4">
                          {periodoTipo === 'mes' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selecione o mês e ano:
                              </label>
                              <input
                                type="month"
                                value={mesSelecionado}
                                onChange={(e) => setMesSelecionado(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                                placeholder="Ex: 2025-01"
                              />
                              <p className="mt-2 text-xs text-gray-500">
                                💡 Exemplo: Selecione "2025-01" para ver receitas de Janeiro de 2025
                              </p>
                            </div>
                          )}

                          {periodoTipo === 'trimestre' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selecione o trimestre:
                              </label>
                              <select
                                value={trimestreSelecionado}
                                onChange={(e) => setTrimestreSelecionado(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                              >
                                <option value="">-- Selecione um trimestre --</option>
                                {(() => {
                                  const hoje = new Date()
                                  const anoAtual = hoje.getFullYear()
                                  const trimestres = []
                                  const meses = ['Jan-Mar', 'Abr-Jun', 'Jul-Set', 'Out-Dez']
                                  
                                  for (let ano = anoAtual + 1; ano >= anoAtual - 1; ano--) {
                                    for (let q = 4; q >= 1; q--) {
                                      trimestres.push({ ano, q, label: `${ano} - Q${q} (${meses[q-1]})` })
                                    }
                                  }
                                  
                                  return trimestres.map(t => (
                                    <option key={`${t.ano}-Q${t.q}`} value={`${t.ano}-Q${t.q}`}>
                                      {t.label}
                                    </option>
                                  ))
                                })()}
                              </select>
                              <p className="mt-2 text-xs text-gray-500">
                                💡 Q1 = Jan-Mar | Q2 = Abr-Jun | Q3 = Jul-Set | Q4 = Out-Dez
                              </p>
                            </div>
                          )}

                          {periodoTipo === 'dia' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Selecione o dia:
                              </label>
                              <input
                                type="date"
                                value={diaSelecionado}
                                onChange={(e) => setDiaSelecionado(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium"
                              />
                              <p className="mt-2 text-xs text-gray-500">
                                💡 Selecione uma data específica para ver receitas apenas desse dia
                              </p>
                            </div>
                          )}

                          {periodoTipo === 'custom' && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                Selecione o período personalizado:
                              </label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-2">📅 Data Início</label>
                                  <input
                                    type="date"
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-600 mb-2">📅 Data Fim</label>
                                  <input
                                    type="date"
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                  />
                                </div>
                              </div>
                              <p className="mt-2 text-xs text-gray-500">
                                💡 Selecione o intervalo de datas que deseja analisar
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        {/* ===================================================== */}
        {/* ABAS: RECEITAS vs ASSINATURAS */}
        {/* ===================================================== */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setAbaAtiva('receitas')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                  abaAtiva === 'receitas'
                    ? 'bg-green-50 text-green-700 border-b-2 border-green-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                💰 Análise de Receitas
              </button>
              <button
                onClick={() => setAbaAtiva('assinaturas')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                  abaAtiva === 'assinaturas'
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                📋 Assinaturas
              </button>
            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* SEÇÃO 1: ANÁLISE DE RECEITAS (APENAS PAGANTES) */}
        {/* ===================================================== */}
        {abaAtiva === 'receitas' && (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Carregando receitas...</p>
              </div>
            ) : (
              <>
                {/* Toggle Ver por Área / Totais Gerais */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Visualização:</span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setVerPorArea(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          !verPorArea
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Totais Gerais
                      </button>
                      <button
                        onClick={() => setVerPorArea(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          verPorArea
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Por Área
                      </button>
                    </div>
                  </div>
                </div>

                {/* TOTAIS POR ÁREA */}
                {verPorArea && totaisPorArea && (
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Receitas por Área (Apenas Pagantes)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(totaisPorArea).map(([area, totais]) => (
                        <div key={area} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">{getAreaIcon(area)}</span>
                            <h3 className="font-bold text-gray-900 capitalize">{area}</h3>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-600">Mensal</p>
                              <p className="text-xl font-bold text-green-700">{formatCurrency(totais.mensal)}</p>
                              <p className="text-xs text-gray-500">{totais.receitasMensais.length} assinaturas</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Anual</p>
                              <p className="text-xl font-bold text-blue-700">{formatCurrency(totais.anual)}</p>
                              <p className="text-xs text-gray-500">{totais.receitasAnuais.length} assinaturas (integral)</p>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                              <p className="text-xs text-gray-600">Total do Mês</p>
                              <p className="text-2xl font-bold text-purple-700">{formatCurrency(totais.total)}</p>
                              <p className="text-xs text-gray-500">Anual integral + Mensal</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">{totais.pagantes} pagantes</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TOTAIS GERAIS */}
                {!verPorArea && (
                  <div className="mb-6 space-y-6">
                    <h2 className="text-lg font-bold text-gray-900">💰 Análise de Receitas (Apenas Pagantes)</h2>
                    
                    {/* Separador: Novas vs Renovações */}
                    {totais.novas && totais.renovacoes && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {/* Novas Assinaturas */}
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 shadow-sm border-2 border-emerald-200">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-600">🆕 Novas Assinaturas</p>
                              <p className="text-2xl font-bold text-emerald-700">{formatCurrency(totais.novas.geral)}</p>
                            </div>
                            <div className="h-12 w-12 bg-emerald-500 rounded-lg flex items-center justify-center shadow-md">
                              <span className="text-2xl text-white">🆕</span>
                            </div>
                          </div>
                          <div className="space-y-2 text-xs text-gray-600">
                            <p>Mensal: {formatCurrency(totais.novas.mensal)} ({totais.novas.quantidadeMensais})</p>
                            <p>Anual: {formatCurrency(totais.novas.anual)} ({totais.novas.quantidadeAnuais})</p>
                            <p className="text-gray-500">{totais.novas.quantidade} novas assinaturas</p>
                          </div>
                        </div>

                        {/* Renovações */}
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 shadow-sm border-2 border-amber-200">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-600">🔄 Renovações</p>
                              <p className="text-2xl font-bold text-amber-700">{formatCurrency(totais.renovacoes.geral)}</p>
                            </div>
                            <div className="h-12 w-12 bg-amber-500 rounded-lg flex items-center justify-center shadow-md">
                              <span className="text-2xl text-white">🔄</span>
                            </div>
                          </div>
                          <div className="space-y-2 text-xs text-gray-600">
                            <p>Mensal: {formatCurrency(totais.renovacoes.mensal)} ({totais.renovacoes.quantidadeMensais})</p>
                            <p>Anual: {formatCurrency(totais.renovacoes.anual)} ({totais.renovacoes.quantidadeAnuais})</p>
                            <p className="text-gray-500">{totais.renovacoes.quantidade} renovações</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Totais Gerais */}
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Mensal */}
                        <div 
                          className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border-2 border-green-200 cursor-pointer hover:shadow-lg transition-all"
                          onClick={() => setMostrarDetalhesMensal(true)}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-600">💰 Receita Mensal</p>
                              <p className="text-3xl font-bold text-green-700">{formatCurrency(totalMensalPagante)}</p>
                            </div>
                            <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
                              <span className="text-2xl text-white">📅</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600">
                            {receitasMensais.length} assinaturas mensais pagantes
                            <br />
                            <span className="text-blue-600 hover:text-blue-800 underline text-xs mt-1 inline-block">
                              Clique para ver detalhes →
                            </span>
                          </p>
                        </div>

                        {/* Total Anual */}
                        <div 
                          className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border-2 border-blue-200 cursor-pointer hover:shadow-lg transition-all"
                          onClick={() => setMostrarDetalhesAnual(true)}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-600">💎 Receita Anual</p>
                              <p className="text-3xl font-bold text-blue-700">{formatCurrency(totalAnualPagante)}</p>
                            </div>
                            <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                              <span className="text-2xl text-white">💎</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600">
                            {receitasAnuais.length} assinaturas anuais pagantes
                            <br />
                            <span className="text-blue-600 hover:text-blue-800 underline text-xs mt-1 inline-block">
                              Clique para ver detalhes →
                            </span>
                          </p>
                        </div>

                        {/* Total Geral */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-sm border-2 border-purple-200">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-sm font-medium text-gray-600">📊 Total Geral</p>
                              <p className="text-3xl font-bold text-purple-700">{formatCurrency(totalReceitasPagante)}</p>
                            </div>
                            <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
                              <span className="text-2xl text-white">💰</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600">
                            {totalPagantes} pagantes ativos
                            <br />
                            <span className="text-gray-500">(Anual integral + Mensal do mês)</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ===================================================== */}
        {/* SEÇÃO 2: ASSINATURAS (TODAS AS CATEGORIAS) */}
        {/* ===================================================== */}
        {abaAtiva === 'assinaturas' && (
          <div>
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Carregando assinaturas...</p>
              </div>
            ) : (
              <>
                {/* Resumo por Categoria */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Resumo por Categoria</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Pagantes</p>
                          <p className="text-2xl font-bold text-green-700">{totalPagantes}</p>
                        </div>
                        <span className="text-2xl">💳</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Gratuitas</p>
                          <p className="text-2xl font-bold text-blue-700">{totalGratuitas}</p>
                        </div>
                        <span className="text-2xl">🆓</span>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Suporte</p>
                          <p className="text-2xl font-bold text-orange-700">{totalSuporte}</p>
                        </div>
                        <span className="text-2xl">🛟</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabela de Assinaturas */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuário</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Próximo Vencimento</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Histórico</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {receitasFiltradas.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                              Nenhuma assinatura encontrada
                            </td>
                          </tr>
                        ) : (
                          receitasFiltradas.map((receita) => (
                            <tr key={receita.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{receita.usuario}</div>
                                {receita.email && (
                                  <div className="text-xs text-gray-500">{receita.email}</div>
                                )}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <span className="text-xl mr-2">{getAreaIcon(receita.area)}</span>
                                  <span className="text-sm text-gray-900 capitalize">{receita.area}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  receita.tipo === 'mensal' 
                                    ? 'bg-blue-100 text-blue-800' 
                                    : receita.tipo === 'anual'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {receita.tipo === 'mensal' ? 'Mensal' : receita.tipo === 'anual' ? 'Anual' : 'Gratuito'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-900">{formatCurrency(receita.valor, receita.currency)}</div>
                                <div className="text-xs text-gray-500">
                                  {receita.tipo === 'mensal' ? '/mês' : receita.tipo === 'anual' ? '/ano' : 'gratuito'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getCategoriaBadge(receita.categoria)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {getStatusBadge(receita.status, receita.is_migrated)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm text-gray-700">{receita.ref_vendedor ? String(receita.ref_vendedor) : '—'}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {receita.proxVencimento ? new Date(receita.proxVencimento).toLocaleDateString('pt-BR') : '-'}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-gray-900">{formatCurrency(receita.historico, receita.currency)}</div>
                                <div className="text-xs text-gray-500">Total pago</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <Link
                                  href={`/admin/subscriptions?user=${receita.user_id}`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  Ver
                                </Link>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* ===================================================== */}
      {/* MODAL: DETALHES RECEITA MENSAL */}
      {/* ===================================================== */}
      {mostrarDetalhesMensal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">💰 Receita Mensal - Detalhes</h2>
                <p className="text-green-100 text-sm mt-1">
                  Total: {formatCurrency(totalMensalPagante)} • {receitasMensais.length} assinaturas
                </p>
              </div>
              <button
                onClick={() => setMostrarDetalhesMensal(false)}
                className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {receitasMensais.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">Nenhuma assinatura mensal pagante encontrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {receitasMensais.map((receita) => (
                    <div key={receita.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-green-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{getAreaIcon(receita.area)}</span>
                            <div>
                              <p className="font-semibold text-gray-900">{receita.usuario}</p>
                              <p className="text-xs text-gray-500">{receita.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="capitalize">{receita.area}</span>
                            <span>•</span>
                            <span>Vence: {receita.proxVencimento ? new Date(receita.proxVencimento).toLocaleDateString('pt-BR') : '-'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-700">{formatCurrency(receita.valor, receita.currency)}</p>
                          <p className="text-xs text-gray-500">/mês</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================== */}
      {/* MODAL: DETALHES RECEITA ANUAL */}
      {/* ===================================================== */}
      {mostrarDetalhesAnual && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">💎 Receita Anual - Detalhes</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Total: {formatCurrency(totalAnualPagante)} • {receitasAnuais.length} assinaturas (entrada integral)
                </p>
              </div>
              <button
                onClick={() => setMostrarDetalhesAnual(false)}
                className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {receitasAnuais.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">Nenhuma assinatura anual pagante encontrada</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {receitasAnuais.map((receita) => (
                    <div key={receita.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{getAreaIcon(receita.area)}</span>
                            <div>
                              <p className="font-semibold text-gray-900">{receita.usuario}</p>
                              <p className="text-xs text-gray-500">{receita.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="capitalize">{receita.area}</span>
                            <span>•</span>
                            <span>Vence: {receita.proxVencimento ? new Date(receita.proxVencimento).toLocaleDateString('pt-BR') : '-'}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-blue-700">{formatCurrency(receita.valor, receita.currency)}</p>
                          <p className="text-xs text-gray-500">entrada integral</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
