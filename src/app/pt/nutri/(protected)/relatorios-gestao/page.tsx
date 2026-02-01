'use client'

import { useEffect, useMemo, useState } from 'react'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import { useAuth } from '@/contexts/AuthContext'

type Periodo = '7dias' | '30dias' | '90dias' | '1ano'

type LeadRow = {
  id: string
  name: string | null
  email: string | null
  phone: string | null
  template_id?: string | null
  link_id?: string | null
  additional_data?: Record<string, any> | null
  created_at: string
}

type ToolRow = {
  id: string
  title: string | null
  slug: string | null
  views?: number | null
  leads_count?: number | null
  conversions_count?: number | null
}

const STATUS_LABELS: Record<string, string> = {
  novo: 'Novo',
  contatado: 'Em conversa',
  agendou: 'Agendou',
  convertido: 'Convertido',
  perdido: 'Perdido',
}

export default function MetricasCaptacaoNutriPage() {
  return <MetricasCaptacaoNutriContent />
}

function MetricasCaptacaoNutriContent() {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [periodo, setPeriodo] = useState<Periodo>('30dias')
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [leads, setLeads] = useState<LeadRow[]>([])
  const [tools, setTools] = useState<ToolRow[]>([])

  const { inicio, fim } = useMemo(() => {
    const hoje = new Date()
    const start = new Date()

    switch (periodo) {
      case '7dias':
        start.setDate(hoje.getDate() - 7)
        break
      case '30dias':
        start.setDate(hoje.getDate() - 30)
        break
      case '90dias':
        start.setDate(hoje.getDate() - 90)
        break
      case '1ano':
        start.setFullYear(hoje.getFullYear() - 1)
        break
      default:
        start.setDate(hoje.getDate() - 30)
    }

    return { inicio: start, fim: hoje }
  }, [periodo])

  useEffect(() => {
    if (!user) return

    const carregar = async () => {
      setCarregando(true)
      setErro(null)
      try {
        const [leadsRes, toolsRes] = await Promise.all([
          fetch('/api/leads?limit=500', { credentials: 'include' }),
          fetch('/api/nutri/ferramentas?profession=nutri', { credentials: 'include' }),
        ])

        if (!leadsRes.ok) {
          const err = await leadsRes.json().catch(() => ({}))
          throw new Error(err.error || 'Erro ao carregar leads')
        }

        const leadsJson = await leadsRes.json()
        setLeads((leadsJson?.data?.leads || []) as LeadRow[])

        if (toolsRes.ok) {
          const toolsJson = await toolsRes.json().catch(() => ({}))
          setTools((toolsJson?.tools || []) as ToolRow[])
        } else {
          setTools([])
        }
      } catch (e: any) {
        console.error('Erro ao carregar métricas:', e)
        setErro(e?.message || 'Erro ao carregar métricas')
      } finally {
        setCarregando(false)
      }
    }

    carregar()
  }, [user, periodo])

  const leadsNoPeriodo = useMemo(() => {
    return leads.filter((l) => {
      const d = new Date(l.created_at)
      return d >= inicio && d <= fim
    })
  }, [leads, inicio, fim])

  const statusCount = useMemo(() => {
    return leadsNoPeriodo.reduce<Record<string, number>>((acc, l) => {
      const status = (l.additional_data?.status as string) || 'novo'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})
  }, [leadsNoPeriodo])

  const totalLeads = leadsNoPeriodo.length
  const totalConvertidos = statusCount.convertido || 0
  const taxaConversao = totalLeads > 0 ? ((totalConvertidos / totalLeads) * 100).toFixed(1) : '0.0'

  const topStatus = useMemo(() => {
    return Object.entries(statusCount).sort((a, b) => b[1] - a[1]).slice(0, 10)
  }, [statusCount])

  const topFontes = useMemo(() => {
    const fontesCount = leadsNoPeriodo.reduce<Record<string, number>>((acc, l) => {
      const fonte =
        (l.additional_data?.ferramenta as string) ||
        (l.template_id as string) ||
        (l.additional_data?.source as string) ||
        '—'
      acc[fonte] = (acc[fonte] || 0) + 1
      return acc
    }, {})
    return Object.entries(fontesCount).sort((a, b) => b[1] - a[1]).slice(0, 10)
  }, [leadsNoPeriodo])

  const toolsOrdenadas = useMemo(() => {
    return [...tools].sort((a, b) => (b.leads_count || 0) - (a.leads_count || 0)).slice(0, 12)
  }, [tools])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NutriSidebar isMobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 lg:ml-56">
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Métricas</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Métricas de Captação</h1>
            <p className="text-gray-600 mt-1">Aqui é só captação: leads, origem e performance dos links.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
                <select
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value as Periodo)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="7dias">Últimos 7 dias</option>
                  <option value="30dias">Últimos 30 dias</option>
                  <option value="90dias">Últimos 90 dias</option>
                  <option value="1ano">Último ano</option>
                </select>
              </div>
            </div>
          </div>

          {erro && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {erro}
            </div>
          )}

          {carregando ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando métricas...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-sm font-medium text-gray-600">Leads no período</p>
                  <p className="text-3xl font-bold text-gray-900">{totalLeads}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-sm font-medium text-gray-600">Novos</p>
                  <p className="text-3xl font-bold text-gray-900">{statusCount.novo || 0}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-sm font-medium text-gray-600">Convertidos</p>
                  <p className="text-3xl font-bold text-gray-900">{totalConvertidos}</p>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <p className="text-sm font-medium text-gray-600">Taxa (convertido/leads)</p>
                  <p className="text-3xl font-bold text-gray-900">{taxaConversao}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Leads por status (período)</h2>
                  {topStatus.length === 0 ? (
                    <p className="text-sm text-gray-500">Sem dados no período.</p>
                  ) : (
                    <div className="space-y-2">
                      {topStatus.map(([status, count]) => (
                        <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700">{STATUS_LABELS[status] || status}</span>
                          <span className="text-sm font-semibold text-gray-900">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Leads por fonte (período)</h2>
                  {topFontes.length === 0 ? (
                    <p className="text-sm text-gray-500">Sem dados no período.</p>
                  ) : (
                    <div className="space-y-2">
                      {topFontes.map(([fonte, count]) => (
                        <div key={fonte} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-700 truncate pr-4">{fonte}</span>
                          <span className="text-sm font-semibold text-gray-900">{count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Links com mais leads (geral)</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Isso usa os contadores da ferramenta (views/leads). Não é acompanhamento de cliente.
                </p>

                {toolsOrdenadas.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhuma ferramenta encontrada.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="py-2 pr-4">Ferramenta</th>
                          <th className="py-2 pr-4">Views</th>
                          <th className="py-2 pr-4">Leads</th>
                          <th className="py-2 pr-4">Conversões</th>
                          <th className="py-2">Lead/View</th>
                        </tr>
                      </thead>
                      <tbody>
                        {toolsOrdenadas.map((t) => {
                          const views = t.views || 0
                          const leadsCount = t.leads_count || 0
                          const conv = t.conversions_count || 0
                          const rate = views > 0 ? ((leadsCount / views) * 100).toFixed(1) : '0.0'
                          return (
                            <tr key={t.id} className="border-b last:border-b-0">
                              <td className="py-2 pr-4 text-gray-900">{t.title || t.slug || '—'}</td>
                              <td className="py-2 pr-4 text-gray-700">{views}</td>
                              <td className="py-2 pr-4 text-gray-700">{leadsCount}</td>
                              <td className="py-2 pr-4 text-gray-700">{conv}</td>
                              <td className="py-2 text-gray-700">{rate}%</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

