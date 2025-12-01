'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

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
}

interface Totais {
  mensal: number
  anual: number
  anualMensalizado: number
  geral: number
  ativas: number
  total: number
}

export default function AdminReceitas() {
  // =====================================================
  // ESTADOS DE FILTROS (SEMPRE VISÍVEIS)
  // =====================================================
  const [filtroArea, setFiltroArea] = useState<'todos' | 'nutri' | 'coach' | 'nutra' | 'wellness'>('todos')
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'active' | 'canceled' | 'past_due' | 'unpaid'>('todos')
  const [periodo, setPeriodo] = useState<'mes' | 'ano' | 'historico'>('mes')
  
  // =====================================================
  // FILTRO AVANÇADO DE PERÍODO (COLAPSÁVEL)
  // =====================================================
  const [filtroAvancadoAberto, setFiltroAvancadoAberto] = useState(false)
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
        if (filtroStatus !== 'todos' && periodo !== 'historico') {
          params.append('status', filtroStatus)
        }

        // Adicionar filtros de período avançado (apenas se não for "todos")
        if (periodoTipo === 'rapido' && periodoRapido !== 'todos') {
          const hoje = new Date()
          let inicio: Date, fim: Date
          
          switch (periodoRapido) {
            case 'este_mes':
              inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
              fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59)
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
            params.append('periodo_inicio', inicio.toISOString().split('T')[0])
            params.append('periodo_fim', fim.toISOString().split('T')[0])
            params.append('periodo_tipo', 'custom')
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
          throw new Error('Erro ao carregar receitas')
        }

        const data = await response.json()

        if (data.success && data.receitas) {
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
  }, [filtroArea, filtroStatus, periodo, periodoTipo, periodoRapido, mesSelecionado, trimestreSelecionado, diaSelecionado, dataInicio, dataFim])

  // =====================================================
  // VALORES LÍQUIDOS (JÁ DESCONTADAS AS TAXAS)
  // =====================================================
  const VALOR_MENSAL_LIQUIDO = 47 // R$ 47 (já descontado taxa Mercado Livre)
  const VALOR_ANUAL_LIQUIDO = 450 // R$ 450 (já descontado taxa Mercado Livre)

  // =====================================================
  // CALCULAR TOTAIS - APENAS PAGANTES (PARA ANÁLISE DE RECEITAS)
  // =====================================================
  const receitasAtivas = receitas.filter(r => r.status === 'ativa')
  const receitasPagantes = receitasAtivas.filter(r => r.categoria === 'pagante')
  
  // Contar quantidades
  const qtdMensais = receitasPagantes.filter(r => r.tipo === 'mensal').length
  const qtdAnuais = receitasPagantes.filter(r => r.tipo === 'anual').length
  
  // Calcular totais usando valores líquidos
  // ANUAL: Como é antecipado (recebe tudo de uma vez), soma o valor integral
  // MENSAL: Soma o valor mensal por quantidade
  const totalMensalPagante = qtdMensais * VALOR_MENSAL_LIQUIDO
  const totalAnualPagante = qtdAnuais * VALOR_ANUAL_LIQUIDO
  
  // Total do mês: Anual (integral, pois entrou tudo no mês) + Mensal (do mês)
  const totalReceitasPagante = totalAnualPagante + totalMensalPagante
  
  // Totais por área (apenas pagantes) - usando valores líquidos
  const totaisPorArea = verPorArea ? receitasPagantes.reduce((acc, r) => {
    if (!acc[r.area]) {
      acc[r.area] = {
        mensal: 0,
        anual: 0,
        total: 0,
        pagantes: 0,
        qtdMensais: 0,
        qtdAnuais: 0
      }
    }
    
    if (r.tipo === 'mensal') {
      acc[r.area].qtdMensais++
      acc[r.area].pagantes++
    } else if (r.tipo === 'anual') {
      acc[r.area].qtdAnuais++
      acc[r.area].pagantes++
    }
    
    // Calcular usando valores líquidos
    acc[r.area].mensal = acc[r.area].qtdMensais * VALOR_MENSAL_LIQUIDO
    acc[r.area].anual = acc[r.area].qtdAnuais * VALOR_ANUAL_LIQUIDO
    acc[r.area].total = acc[r.area].anual + acc[r.area].mensal // Anual integral + mensal
    
    return acc
  }, {} as Record<string, { mensal: number; anual: number; total: number; pagantes: number; qtdMensais: number; qtdAnuais: number }>) : null

  // Contadores por categoria (para seção de assinaturas)
  const totalPagantes = receitasPagantes.length
  const totalGratuitas = receitasAtivas.filter(r => r.categoria === 'gratuita').length
  const totalSuporte = receitasAtivas.filter(r => r.categoria === 'suporte').length

  // Filtrar receitas para tabela
  const receitasFiltradas = receitas.filter(r => {
    if (periodo === 'mes') {
      return r.tipo === 'mensal' || r.tipo === 'gratuito'
    } else if (periodo === 'ano') {
      return r.tipo === 'anual'
    }
    return true
  })

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
    const badges: Record<string, JSX.Element> = {
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
    
    const badges: Record<string, JSX.Element> = {
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
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                ← Voltar
              </Link>
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

            {/* Filtro Período - SEMPRE VISÍVEL */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="text-lg">📅</span>
                Filtrar por Período
              </label>
              <div className="space-y-3">
                {/* Tipo de Plano - SEMPRE VISÍVEL */}
                <div>
                  <p className="text-xs text-gray-600 mb-2">Tipo de Plano:</p>
                  <div className="flex gap-2">
                    {['mes', 'ano', 'historico'].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriodo(p as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          periodo === p
                            ? 'bg-green-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {p === 'mes' ? 'Mensal' : p === 'ano' ? 'Anual' : 'Histórico'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filtro Avançado - COLAPSÁVEL */}
                <div className="border-t border-gray-200 pt-3">
                  <button
                    onClick={() => setFiltroAvancadoAberto(!filtroAvancadoAberto)}
                    className="w-full flex items-center justify-between text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <span>⚙️</span>
                      Filtro Avançado de Período
                      {periodoRapido !== 'todos' && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                          Ativo
                        </span>
                      )}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transition-transform ${filtroAvancadoAberto ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {filtroAvancadoAberto && (
                    <div className="mt-4 space-y-4">
                      {/* Tipo de Filtro */}
                      <div>
                        <label className="block text-xs text-gray-600 mb-2">Tipo de Filtro:</label>
                        <div className="flex gap-2 flex-wrap">
                          {['rapido', 'mes', 'trimestre', 'dia', 'custom'].map((tipo) => (
                            <button
                              key={tipo}
                              onClick={() => setPeriodoTipo(tipo as any)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                periodoTipo === tipo
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {tipo === 'rapido' ? 'Rápido' : 
                               tipo === 'mes' ? 'Mês' :
                               tipo === 'trimestre' ? 'Trimestre' :
                               tipo === 'dia' ? 'Dia' :
                               tipo === 'custom' ? 'Personalizado' : tipo}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Opções Específicas */}
                      {periodoTipo === 'rapido' && (
                        <select
                          value={periodoRapido}
                          onChange={(e) => setPeriodoRapido(e.target.value as any)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="todos">Todos os Períodos</option>
                          <option value="este_mes">Este Mês</option>
                          <option value="mes_passado">Mês Passado</option>
                          <option value="ultimos_3">Últimos 3 Meses</option>
                          <option value="ultimos_6">Últimos 6 Meses</option>
                          <option value="ultimos_12">Últimos 12 Meses</option>
                          <option value="este_trimestre">Este Trimestre</option>
                          <option value="trimestre_passado">Trimestre Passado</option>
                        </select>
                      )}

                      {periodoTipo === 'mes' && (
                        <input
                          type="month"
                          value={mesSelecionado}
                          onChange={(e) => setMesSelecionado(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      )}

                      {periodoTipo === 'trimestre' && (
                        <select
                          value={trimestreSelecionado}
                          onChange={(e) => setTrimestreSelecionado(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Selecione o Trimestre</option>
                          {(() => {
                            const hoje = new Date()
                            const anoAtual = hoje.getFullYear()
                            const trimestres = []
                            for (let ano = anoAtual - 1; ano <= anoAtual + 1; ano++) {
                              for (let q = 1; q <= 4; q++) {
                                trimestres.push(`${ano}-Q${q}`)
                              }
                            }
                            return trimestres.map(t => (
                              <option key={t} value={t}>
                                {t.replace('-Q', ' - Q')}
                              </option>
                            ))
                          })()}
                        </select>
                      )}

                      {periodoTipo === 'dia' && (
                        <input
                          type="date"
                          value={diaSelecionado}
                          onChange={(e) => setDiaSelecionado(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                      )}

                      {periodoTipo === 'custom' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Data Início</label>
                            <input
                              type="date"
                              value={dataInicio}
                              onChange={(e) => setDataInicio(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Data Fim</label>
                            <input
                              type="date"
                              value={dataFim}
                              onChange={(e) => setDataFim(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
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
                              <p className="text-xs text-gray-500">{totais.qtdMensais} × R$ {VALOR_MENSAL_LIQUIDO}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600">Anual</p>
                              <p className="text-xl font-bold text-blue-700">{formatCurrency(totais.anual)}</p>
                              <p className="text-xs text-gray-500">{totais.qtdAnuais} × R$ {VALOR_ANUAL_LIQUIDO} (integral)</p>
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
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">💰 Análise de Receitas (Apenas Pagantes)</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Total Mensal */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border-2 border-green-200">
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
                          {qtdMensais} assinaturas mensais pagantes
                          <br />
                          <span className="text-gray-500">R$ {VALOR_MENSAL_LIQUIDO} cada (líquido)</span>
                        </p>
                      </div>

                      {/* Total Anual */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border-2 border-blue-200">
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
                          {qtdAnuais} assinaturas anuais pagantes
                          <br />
                          <span className="text-gray-500">R$ {VALOR_ANUAL_LIQUIDO} cada (líquido, entrada integral)</span>
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
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Próximo Vencimento</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Histórico</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {receitasFiltradas.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
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
    </div>
  )
}
