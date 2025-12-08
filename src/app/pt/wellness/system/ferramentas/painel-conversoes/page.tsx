'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

interface Estatisticas {
  totalDiagnosticos: number
  totalConversoes: number
  taxaConversao: number
  diagnosticosPorFluxo: Array<{
    fluxo_id: string
    fluxo_nome: string
    total: number
    conversoes: number
    taxa: number
  }>
  diagnosticosPorKit: Array<{
    kit: string
    total: number
    conversoes: number
    taxa: number
  }>
  diagnosticosPorDia: Array<{
    data: string
    total: number
    conversoes: number
  }>
}

function PainelConversoesPageContent() {
  const [estatisticas, setEstatisticas] = useState<Estatisticas | null>(null)
  const [loading, setLoading] = useState(true)
  const [periodo, setPeriodo] = useState<'7dias' | '30dias' | 'todos'>('30dias')

  useEffect(() => {
    carregarEstatisticas()
  }, [periodo])

  const carregarEstatisticas = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (periodo !== 'todos') {
        // TODO: Implementar filtro de período na API
      }

      const response = await fetch(`/api/wellness/diagnosticos?${params.toString()}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        const diagnosticos = data.diagnosticos || []

        // Calcular estatísticas
        const totalDiagnosticos = diagnosticos.length
        const totalConversoes = diagnosticos.filter((d: any) => d.conversao).length
        const taxaConversao = totalDiagnosticos > 0 ? Math.round((totalConversoes / totalDiagnosticos) * 100) : 0

        // Por fluxo
        const porFluxo: Record<string, { nome: string; total: number; conversoes: number }> = {}
        diagnosticos.forEach((d: any) => {
          if (!porFluxo[d.fluxo_id]) {
            porFluxo[d.fluxo_id] = { nome: d.fluxo_nome, total: 0, conversoes: 0 }
          }
          porFluxo[d.fluxo_id].total++
          if (d.conversao) {
            porFluxo[d.fluxo_id].conversoes++
          }
        })

        const diagnosticosPorFluxo = Object.entries(porFluxo).map(([fluxo_id, dados]: [string, any]) => ({
          fluxo_id,
          fluxo_nome: dados.nome,
          total: dados.total,
          conversoes: dados.conversoes,
          taxa: dados.total > 0 ? Math.round((dados.conversoes / dados.total) * 100) : 0
        })).sort((a, b) => b.total - a.total)

        // Por kit
        const porKit: Record<string, { total: number; conversoes: number }> = {}
        diagnosticos.forEach((d: any) => {
          const kit = d.kit_recomendado || 'outros'
          if (!porKit[kit]) {
            porKit[kit] = { total: 0, conversoes: 0 }
          }
          porKit[kit].total++
          if (d.conversao) {
            porKit[kit].conversoes++
          }
        })

        const diagnosticosPorKit = Object.entries(porKit).map(([kit, dados]: [string, any]) => ({
          kit: kit === 'energia' ? 'Kit Energia' : kit === 'acelera' ? 'Kit Acelera' : 'Outros',
          total: dados.total,
          conversoes: dados.conversoes,
          taxa: dados.total > 0 ? Math.round((dados.conversoes / dados.total) * 100) : 0
        })).sort((a, b) => b.total - a.total)

        setEstatisticas({
          totalDiagnosticos,
          totalConversoes,
          taxaConversao,
          diagnosticosPorFluxo,
          diagnosticosPorKit,
          diagnosticosPorDia: [] // TODO: Implementar agrupamento por dia
        })
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar showTitle title="Painel de Conversões" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Voltar ao Sistema - Bem visível no topo */}
        <div className="mb-6">
          <Link
            href="/pt/wellness/home"
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Painel de Conversões
              </h1>
              <p className="text-lg text-gray-600">
                Acompanhe suas métricas e otimize seus resultados
              </p>
            </div>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="7dias">Últimos 7 dias</option>
              <option value="30dias">Últimos 30 dias</option>
              <option value="todos">Todos</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando estatísticas...</p>
          </div>
        ) : estatisticas ? (
          <>
            {/* Cards de Resumo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total de Diagnósticos</p>
                    <p className="text-3xl font-bold text-gray-900">{estatisticas.totalDiagnosticos}</p>
                  </div>
                  <div className="text-4xl">📊</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Conversões</p>
                    <p className="text-3xl font-bold text-green-600">{estatisticas.totalConversoes}</p>
                  </div>
                  <div className="text-4xl">✅</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Taxa de Conversão</p>
                    <p className="text-3xl font-bold text-blue-600">{estatisticas.taxaConversao}%</p>
                  </div>
                  <div className="text-4xl">📈</div>
                </div>
              </div>
            </div>

            {/* Por Fluxo */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Conversões por Fluxo
              </h2>
              {estatisticas.diagnosticosPorFluxo.length === 0 ? (
                <p className="text-gray-600">Nenhum dado disponível ainda.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Fluxo</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900">Diagnósticos</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900">Conversões</th>
                        <th className="text-right py-3 px-4 font-semibold text-gray-900">Taxa</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estatisticas.diagnosticosPorFluxo.map((item, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">{item.fluxo_nome}</td>
                          <td className="py-3 px-4 text-right text-gray-700">{item.total}</td>
                          <td className="py-3 px-4 text-right text-green-600 font-medium">{item.conversoes}</td>
                          <td className="py-3 px-4 text-right text-blue-600 font-medium">{item.taxa}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Por Kit */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Conversões por Kit Recomendado
              </h2>
              {estatisticas.diagnosticosPorKit.length === 0 ? (
                <p className="text-gray-600">Nenhum dado disponível ainda.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {estatisticas.diagnosticosPorKit.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{item.kit}</h3>
                        <span className="text-2xl">
                          {item.kit.includes('Energia') ? '⚡' : item.kit.includes('Acelera') ? '🌿' : '📦'}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          Diagnósticos: <span className="font-medium text-gray-900">{item.total}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Conversões: <span className="font-medium text-green-600">{item.conversoes}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                          Taxa: <span className="font-medium text-blue-600">{item.taxa}%</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">
              Nenhum dado disponível ainda. Comece a usar os fluxos para ver suas estatísticas!
            </p>
          </div>
        )}

        {/* Voltar */}
        <div className="text-center mt-8">
          <Link
            href="/pt/wellness/home"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Voltar ao Sistema
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function PainelConversoesPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <PainelConversoesPageContent />
    </ProtectedRoute>
  )
}

