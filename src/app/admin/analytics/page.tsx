'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface Stats {
  usuariosTotal: number
  leadsTotal: number
  conversoesTotal: number
  taxaConversao: number
  receitaTotal: number
  receitaMensal: number
  templatesTotal: number
  visualizacoesTotal: number
}

interface GrowthData {
  month: string
  usuarios: number
  leads: number
  conversoes: number
  receita: number
}

interface Comparison {
  [area: string]: {
    usuarios: number
    usuariosAtivos: number
    leads: number
    conversoes: number
    taxaConversao: number
    receita: number
    templates: number
    visualizacoes: number
  }
}

interface Funnel {
  visualizacoes: number
  leads: number
  conversoes: number
  taxaLeads: number
  taxaConversoes: number
  taxaGeral: number
}

interface TopTemplate {
  templateId: string
  templateName: string
  templateType: string
  linksCriados: number
  totalViews: number
  totalLeads: number
  totalConversoes: number
  taxaConversao: number
}

interface TopUser {
  userId: string
  nome: string
  email: string
  area: string
  totalTemplates: number
  totalLeads: number
  totalConversoes: number
  taxaConversao: number
}

function AdminAnalyticsContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Dados
  const [stats, setStats] = useState<Stats | null>(null)
  const [growthData, setGrowthData] = useState<GrowthData[]>([])
  const [comparison, setComparison] = useState<Comparison>({})
  const [funnel, setFunnel] = useState<Funnel | null>(null)
  const [topTemplates, setTopTemplates] = useState<TopTemplate[]>([])
  const [topUsers, setTopUsers] = useState<TopUser[]>([])
  
  // Filtros
  const [period, setPeriod] = useState<'7d' | '30d' | '3m' | '6m' | '1y' | 'all'>('30d')
  const [funnelArea, setFunnelArea] = useState<'todos' | 'wellness' | 'nutri' | 'coach' | 'nutra'>('todos')

  // Carregar todos os dados
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true)
        setError(null)

        // Carregar em paralelo
        const [statsRes, growthRes, comparisonRes, funnelRes, templatesRes, usersRes] = await Promise.all([
          fetch('/api/admin/analytics/stats', { credentials: 'include' }),
          fetch(`/api/admin/analytics/growth?period=${period}`, { credentials: 'include' }),
          fetch('/api/admin/analytics/comparison', { credentials: 'include' }),
          fetch(`/api/admin/analytics/funnel?area=${funnelArea}`, { credentials: 'include' }),
          fetch('/api/admin/analytics/top-templates?metric=leads&limit=10', { credentials: 'include' }),
          fetch('/api/admin/analytics/top-users?metric=leads&limit=10', { credentials: 'include' })
        ])

        if (!statsRes.ok || !growthRes.ok || !comparisonRes.ok || !funnelRes.ok || !templatesRes.ok || !usersRes.ok) {
          throw new Error('Erro ao carregar dados')
        }

        const [statsData, growthData, comparisonData, funnelData, templatesData, usersData] = await Promise.all([
          statsRes.json(),
          growthRes.json(),
          comparisonRes.json(),
          funnelRes.json(),
          templatesRes.json(),
          usersRes.json()
        ])

        if (statsData.success) setStats(statsData.stats)
        if (growthData.success) setGrowthData(growthData.data || [])
        if (comparisonData.success) setComparison(comparisonData.comparison || {})
        if (funnelData.success) setFunnel(funnelData.funnel)
        if (templatesData.success) setTopTemplates(templatesData.topTemplates || [])
        if (usersData.success) setTopUsers(usersData.topUsers || [])

      } catch (err: any) {
        console.error('Erro ao carregar analytics:', err)
        setError(err.message || 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [period, funnelArea])

  // Componente de gráfico de barras simples
  const SimpleBarChart = ({ data, labelKey, valueKey, title }: { data: any[], labelKey: string, valueKey: string, title: string }) => {
    const maxValue = Math.max(...data.map(d => d[valueKey]), 1)
    
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div className="space-y-3">
          {data.map((item, idx) => (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{item[labelKey]}</span>
                <span className="text-gray-600">{item[valueKey].toLocaleString('pt-BR')}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all"
                  style={{ width: `${(item[valueKey] / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Componente de gráfico de linha simples
  const SimpleLineChart = ({ data, title }: { data: GrowthData[], title: string }) => {
    if (data.length === 0) return null

    const maxValue = Math.max(
      ...data.map(d => Math.max(d.usuarios, d.leads, d.conversoes)),
      1
    )

    const points = data.map((d, idx) => ({
      x: (idx / (data.length - 1 || 1)) * 100,
      usuarios: (d.usuarios / maxValue) * 100,
      leads: (d.leads / maxValue) * 100,
      conversoes: (d.conversoes / maxValue) * 100
    }))

    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
        <div className="relative h-64">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map(y => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
            ))}
            {/* Usuários */}
            <polyline
              points={points.map(p => `${p.x},${100 - p.usuarios}`).join(' ')}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="1"
            />
            {/* Leads */}
            <polyline
              points={points.map(p => `${p.x},${100 - p.leads}`).join(' ')}
              fill="none"
              stroke="#10b981"
              strokeWidth="1"
            />
            {/* Conversões */}
            <polyline
              points={points.map(p => `${p.x},${100 - p.conversoes}`).join(' ')}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1"
            />
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
            {data.map((d, idx) => (
              <span key={idx} className="transform -rotate-45 origin-left">
                {new Date(d.month + '-01').toLocaleDateString('pt-BR', { month: 'short' })}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-600"></div>
            <span>Usuários</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500"></div>
            <span>Leads</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500"></div>
            <span>Conversões</span>
          </div>
        </div>
      </div>
    )
  }

  // Componente de funil
  const FunnelChart = ({ funnel }: { funnel: Funnel }) => {
    const maxValue = funnel.visualizacoes || 1

    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold mb-4">Funil de Conversão</h3>
        <div className="space-y-4">
          {/* Visualizações */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Visualizações</span>
              <span className="text-gray-600">{funnel.visualizacoes.toLocaleString('pt-BR')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-lg h-12 flex items-center justify-center">
              <div
                className="bg-blue-600 rounded-lg h-full flex items-center justify-center text-white font-bold"
                style={{ width: '100%' }}
              >
                {funnel.visualizacoes.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Leads */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Leads ({funnel.taxaLeads.toFixed(2)}%)</span>
              <span className="text-gray-600">{funnel.leads.toLocaleString('pt-BR')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-lg h-12 flex items-center justify-center">
              <div
                className="bg-green-600 rounded-lg h-full flex items-center justify-center text-white font-bold"
                style={{ width: `${(funnel.leads / maxValue) * 100}%` }}
              >
                {funnel.leads.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Conversões */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Conversões ({funnel.taxaConversoes.toFixed(2)}%)</span>
              <span className="text-gray-600">{funnel.conversoes.toLocaleString('pt-BR')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-lg h-12 flex items-center justify-center">
              <div
                className="bg-yellow-600 rounded-lg h-full flex items-center justify-center text-white font-bold"
                style={{ width: `${(funnel.conversoes / maxValue) * 100}%` }}
              >
                {funnel.conversoes.toLocaleString('pt-BR')}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Taxa de Conversão Geral:</strong> {funnel.taxaGeral.toFixed(2)}%
          </p>
        </div>
      </div>
    )
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
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-sm text-gray-600">Análise completa de dados e métricas</p>
              </div>
            </div>
            <Link
              href="/admin"
              className="text-gray-600 hover:text-gray-900 text-sm px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Voltar
            </Link>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período de Crescimento</label>
              <div className="flex gap-2">
                {(['7d', '30d', '3m', '6m', '1y', 'all'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      period === p
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : p === '3m' ? '3 meses' : p === '6m' ? '6 meses' : p === '1y' ? '1 ano' : 'Tudo'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Área do Funil</label>
              <div className="flex gap-2">
                {(['todos', 'wellness', 'nutri', 'coach', 'nutra'] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => setFunnelArea(a)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      funnelArea === a
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {a === 'todos' ? 'Todos' : a.charAt(0).toUpperCase() + a.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Carregando analytics...</p>
          </div>
        ) : (
          <>
            {/* Cards de Estatísticas Gerais */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm border-2 border-blue-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total de Usuários</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.usuariosTotal.toLocaleString('pt-BR')}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm border-2 border-green-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total de Leads</p>
                  <p className="text-3xl font-bold text-green-700">{stats.leadsTotal.toLocaleString('pt-BR')}</p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 shadow-sm border-2 border-yellow-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">Total de Conversões</p>
                  <p className="text-3xl font-bold text-yellow-700">{stats.conversoesTotal.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-gray-600 mt-1">Taxa: {stats.taxaConversao.toFixed(2)}%</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm border-2 border-purple-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">Receita Mensal</p>
                  <p className="text-3xl font-bold text-purple-700">R$ {stats.receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            )}

            {/* Gráfico de Crescimento */}
            {growthData.length > 0 && (
              <div className="mb-8">
                <SimpleLineChart data={growthData} title="Crescimento ao Longo do Tempo" />
              </div>
            )}

            {/* Comparativo por Área e Funil */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {comparison && Object.keys(comparison).length > 0 && (
                <SimpleBarChart
                  data={Object.entries(comparison).map(([area, data]) => ({
                    area: area.charAt(0).toUpperCase() + area.slice(1),
                    leads: data.leads
                  }))}
                  labelKey="area"
                  valueKey="leads"
                  title="Leads por Área"
                />
              )}
              {funnel && <FunnelChart funnel={funnel} />}
            </div>

            {/* Top Templates e Top Users */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {topTemplates.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold">Top 10 Templates (por Leads)</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Template</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leads</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversões</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Taxa</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {topTemplates.map((template, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{template.templateName}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{template.totalLeads}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{template.totalConversoes}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{template.taxaConversao.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {topUsers.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold">Top 10 Usuários (por Leads)</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuário</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leads</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversões</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {topUsers.map((user, idx) => (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.nome}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 capitalize">{user.area}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{user.totalLeads}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{user.totalConversoes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default function AdminAnalyticsPage() {
  return (
    <AdminProtectedRoute>
      <AdminAnalyticsContent />
    </AdminProtectedRoute>
  )
}

