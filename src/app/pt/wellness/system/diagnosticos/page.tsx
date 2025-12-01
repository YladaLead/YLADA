'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useWellnessProfile } from '@/hooks/useWellnessProfile'

interface Diagnostico {
  id: string
  fluxo_id: string
  fluxo_tipo: string
  fluxo_nome: string
  perfil_identificado: string
  kit_recomendado: string
  score: number
  conversao: boolean
  conversao_at: string | null
  created_at: string
}

function DiagnosticosPageContent() {
  const { profile } = useWellnessProfile()
  const [diagnosticos, setDiagnosticos] = useState<Diagnostico[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroFluxo, setFiltroFluxo] = useState<string>('todos')
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'cliente' | 'recrutamento'>('todos')
  const [filtroConversao, setFiltroConversao] = useState<'todos' | 'sim' | 'nao'>('todos')
  const [total, setTotal] = useState(0)

  useEffect(() => {
    carregarDiagnosticos()
  }, [filtroFluxo, filtroTipo, filtroConversao])

  const carregarDiagnosticos = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filtroFluxo !== 'todos') {
        params.append('fluxo_id', filtroFluxo)
      }
      
      if (filtroTipo !== 'todos') {
        params.append('fluxo_tipo', filtroTipo)
      }

      const response = await fetch(`/api/wellness/diagnosticos?${params.toString()}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        let diagnosticosFiltrados = data.diagnosticos || []

        // Filtrar por conversão no frontend (já que a API não suporta)
        if (filtroConversao === 'sim') {
          diagnosticosFiltrados = diagnosticosFiltrados.filter((d: Diagnostico) => d.conversao)
        } else if (filtroConversao === 'nao') {
          diagnosticosFiltrados = diagnosticosFiltrados.filter((d: Diagnostico) => !d.conversao)
        }

        setDiagnosticos(diagnosticosFiltrados)
        setTotal(data.total || 0)
      }
    } catch (error) {
      console.error('Erro ao carregar diagnósticos:', error)
    } finally {
      setLoading(false)
    }
  }

  const getKitEmoji = (kit: string) => {
    if (kit === 'energia') return '⚡'
    if (kit === 'acelera') return '🌿'
    return '📦'
  }

  const getKitCor = (kit: string) => {
    if (kit === 'energia') return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    if (kit === 'acelera') return 'bg-green-100 text-green-800 border-green-300'
    return 'bg-purple-100 text-purple-800 border-purple-300'
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Estatísticas rápidas
  const totalDiagnosticos = diagnosticos.length
  const totalConversoes = diagnosticos.filter(d => d.conversao).length
  const taxaConversao = totalDiagnosticos > 0 ? Math.round((totalConversoes / totalDiagnosticos) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar showTitle title="Histórico de Diagnósticos" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Voltar ao Sistema - Bem visível no topo */}
        <div className="mb-6">
          <Link
            href="/pt/wellness/system"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Voltar ao Sistema</span>
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Histórico de Diagnósticos
          </h1>
          <p className="text-lg text-gray-600">
            Acompanhe todos os diagnósticos realizados e suas conversões
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Diagnósticos</p>
                <p className="text-3xl font-bold text-gray-900">{totalDiagnosticos}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Conversões</p>
                <p className="text-3xl font-bold text-green-600">{totalConversoes}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Taxa de Conversão</p>
                <p className="text-3xl font-bold text-blue-600">{taxaConversao}%</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Fluxo
              </label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="todos">Todos</option>
                <option value="cliente">Cliente</option>
                <option value="recrutamento">Recrutamento</option>
              </select>
            </div>

            {/* Filtro por Conversão */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Conversão
              </label>
              <select
                value={filtroConversao}
                onChange={(e) => setFiltroConversao(e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="todos">Todos</option>
                <option value="sim">Com Conversão</option>
                <option value="nao">Sem Conversão</option>
              </select>
            </div>

            {/* Botão Limpar Filtros */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFiltroFluxo('todos')
                  setFiltroTipo('todos')
                  setFiltroConversao('todos')
                }}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Diagnósticos */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando diagnósticos...</p>
          </div>
        ) : diagnosticos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              Nenhum diagnóstico encontrado
            </p>
            <Link
              href="/pt/wellness/system/vender/fluxos"
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Ver Fluxos Disponíveis
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {diagnosticos.map((diagnostico) => (
              <div
                key={diagnostico.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">
                        {getKitEmoji(diagnostico.kit_recomendado)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {diagnostico.fluxo_nome}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {diagnostico.perfil_identificado}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getKitCor(diagnostico.kit_recomendado)}`}>
                            {getKitEmoji(diagnostico.kit_recomendado)} {diagnostico.kit_recomendado === 'energia' ? 'Kit Energia' : diagnostico.kit_recomendado === 'acelera' ? 'Kit Acelera' : 'Ambos'}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                            Score: {diagnostico.score}%
                          </span>
                          {diagnostico.conversao && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-300">
                              ✅ Convertido
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      {formatarData(diagnostico.created_at)}
                    </p>
                    {diagnostico.conversao_at && (
                      <p className="text-xs text-green-600 mt-1">
                        Convertido: {formatarData(diagnostico.conversao_at)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Voltar */}
        <div className="text-center mt-8">
          <Link
            href="/pt/wellness/system"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Voltar ao Sistema
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function DiagnosticosPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <DiagnosticosPageContent />
    </ProtectedRoute>
  )
}

