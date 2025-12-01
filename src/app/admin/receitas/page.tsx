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
  const [filtroArea, setFiltroArea] = useState<'todos' | 'nutri' | 'coach' | 'nutra' | 'wellness'>('todos')
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'active' | 'canceled' | 'past_due' | 'unpaid'>('todos')
  const [filtroCategoria, setFiltroCategoria] = useState<'todos' | 'pagante' | 'gratuita' | 'suporte'>('todos')
  const [periodo, setPeriodo] = useState<'mes' | 'ano' | 'historico'>('mes')
  
  // Novos filtros de período avançado
  const [periodoTipo, setPeriodoTipo] = useState<'rapido' | 'mes' | 'trimestre' | 'custom'>('rapido')
  const [periodoRapido, setPeriodoRapido] = useState<'este_mes' | 'mes_passado' | 'ultimos_3' | 'ultimos_6' | 'ultimos_12' | 'este_trimestre' | 'trimestre_passado'>('este_mes')
  const [mesSelecionado, setMesSelecionado] = useState<string>('')
  const [trimestreSelecionado, setTrimestreSelecionado] = useState<string>('')
  const [dataInicio, setDataInicio] = useState<string>('')
  const [dataFim, setDataFim] = useState<string>('')
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
        // Se for histórico, buscar todas as assinaturas (não filtrar por status)
        if (filtroStatus !== 'todos' && periodo !== 'historico') {
          params.append('status', filtroStatus)
        }

        // Adicionar filtros de período avançado
        if (periodoTipo === 'rapido') {
          // Períodos rápidos
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
              inicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
              fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0, 23, 59, 59)
          }
          
          params.append('periodo_inicio', inicio.toISOString().split('T')[0])
          params.append('periodo_fim', fim.toISOString().split('T')[0])
          params.append('periodo_tipo', 'custom')
        } else if (periodoTipo === 'mes' && mesSelecionado) {
          params.append('periodo_inicio', mesSelecionado)
          params.append('periodo_tipo', 'mes')
        } else if (periodoTipo === 'trimestre' && trimestreSelecionado) {
          params.append('periodo_inicio', trimestreSelecionado)
          params.append('periodo_tipo', 'trimestre')
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
  }, [filtroArea, filtroStatus, periodo, periodoTipo, periodoRapido, mesSelecionado, trimestreSelecionado, dataInicio, dataFim])

  // Filtrar receitas por período e categoria (frontend)
  const receitasFiltradas = receitas.filter(r => {
    // Filtro de categoria
    if (filtroCategoria !== 'todos') {
      if (filtroCategoria === 'pagante' && r.categoria !== 'pagante') return false
      if (filtroCategoria === 'gratuita' && r.categoria !== 'gratuita') return false
      if (filtroCategoria === 'suporte' && r.categoria !== 'suporte') return false
    }
    
    // Filtro de período
    if (periodo === 'mes') {
      return r.tipo === 'mensal' || r.tipo === 'gratuito'
    } else if (periodo === 'ano') {
      return r.tipo === 'anual'
    }
    // histórico mostra tudo (todas as assinaturas, independente do tipo)
    return true
  })

  // Calcular totais SEMPRE (independente do período selecionado)
  // Separar por categoria: PAGANTES, GRATUITAS e SUPORTE
  
  // =====================================================
  // TOTAIS DE PAGANTES (apenas assinaturas que pagam)
  // =====================================================
  const receitasPagantes = receitas.filter(r => r.status === 'ativa' && r.categoria === 'pagante')
  
  // Total Mensal PAGANTE: assinaturas mensais que pagam
  const totalMensalPagante = receitasPagantes
    .filter(r => r.tipo === 'mensal')
    .reduce((sum, r) => sum + r.valor, 0)

  // Total Anual PAGANTE: assinaturas anuais que pagam
  const totalAnualPagante = receitasPagantes
    .filter(r => r.tipo === 'anual')
    .reduce((sum, r) => sum + r.valor, 0)

  // Total Anual Mensalizado PAGANTE: valor anual dividido por 12
  const totalAnualMensalizadoPagante = receitasPagantes
    .filter(r => r.tipo === 'anual')
    .reduce((sum, r) => sum + (r.valor / 12), 0)

  // Total Geral PAGANTE: mensal + anual mensalizado
  const totalReceitasPagante = totalMensalPagante + totalAnualMensalizadoPagante

  // =====================================================
  // TOTAIS GERAIS (incluindo todas as categorias para referência)
  // =====================================================
  const receitasAtivas = receitas.filter(r => r.status === 'ativa')
  
  // Total Mensal GERAL: todas as assinaturas mensais/gratuitas ativas
  const totalMensal = receitasAtivas
    .filter(r => r.tipo === 'mensal' || r.tipo === 'gratuito')
    .reduce((sum, r) => sum + r.valor, 0)

  // Total Anual GERAL: todas as assinaturas anuais ativas
  const totalAnual = receitasAtivas
    .filter(r => r.tipo === 'anual')
    .reduce((sum, r) => sum + r.valor, 0)

  // Total Anual Mensalizado GERAL
  const totalAnualMensalizado = receitasAtivas
    .filter(r => r.tipo === 'anual')
    .reduce((sum, r) => sum + (r.valor / 12), 0)

  // Total Geral: mensal + anual mensalizado
  const totalReceitas = totalMensal + totalAnualMensalizado

  // =====================================================
  // CONTADORES POR CATEGORIA
  // =====================================================
  const totalPagantes = receitasPagantes.length
  const totalGratuitas = receitas.filter(r => r.status === 'ativa' && r.categoria === 'gratuita').length
  const totalSuporte = receitas.filter(r => r.status === 'ativa' && r.categoria === 'suporte').length

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

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro Área */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Área</label>
              <div className="flex flex-wrap gap-2">
                {['todos', 'nutri', 'coach', 'nutra', 'wellness'].map((area) => (
                  <button
                    key={area}
                    onClick={() => setFiltroArea(area as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filtroArea === area
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {area === 'todos' ? 'Todos' : area.charAt(0).toUpperCase() + area.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtro Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filtrar por Status</label>
              <div className="flex flex-wrap gap-2">
                {['todos', 'active', 'canceled', 'past_due', 'unpaid'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFiltroStatus(status as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filtroStatus === status
                        ? 'bg-purple-600 text-white'
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

            {/* Período */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <div className="flex gap-2">
                {['mes', 'ano', 'historico'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriodo(p as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      periodo === p
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {p === 'mes' ? 'Mensal' : p === 'ano' ? 'Anual' : 'Histórico'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Financeiro */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Carregando receitas...</p>
          </div>
        ) : (
          <>
            {/* TOTAIS PAGANTES (Destaque) */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">💰 Receita de Pagantes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border-2 border-green-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Mensal Pagante</p>
                      <p className="text-3xl font-bold text-green-700">{formatCurrency(totalMensalPagante)}</p>
                    </div>
                    <div className="h-12 w-12 bg-green-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-2xl text-white">📅</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {receitasPagantes.filter(r => r.tipo === 'mensal').length} assinaturas pagantes
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-sm border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Anual Pagante</p>
                      <p className="text-3xl font-bold text-blue-700">{formatCurrency(totalAnualPagante)}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-2xl text-white">💎</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {receitasPagantes.filter(r => r.tipo === 'anual').length} assinaturas pagantes
                    <br />
                    <span className="text-gray-500">({formatCurrency(totalAnualMensalizadoPagante)}/mês equivalente)</span>
                  </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 shadow-sm border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Pagante</p>
                      <p className="text-3xl font-bold text-purple-700">{formatCurrency(totalReceitasPagante)}</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-2xl text-white">💰</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {totalPagantes} pagantes ativos
                    <br />
                    <span className="text-gray-500">(Receita recorrente mensal)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* RESUMO POR CATEGORIA */}
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
          </>
        )}

        {/* Lista de Receitas */}
        {loading ? null : (
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
                        Nenhuma receita encontrada
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
                          <div className="text-sm font-medium text-gray-900">{formatCurrency(receita.historico, receita.currency)}</div>
                          <div className="text-xs text-gray-500">Total pago</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link 
                            href={`/admin/subscriptions?user_id=${receita.user_id}`}
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
        )}
      </main>
    </div>
  )
}

