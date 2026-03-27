'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import { formatYmdSlashPtBr, toLocalDateStringISO } from '@/lib/date-utils'

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

interface UsersOverview {
  ylada: { total: number; emTrial: number; pagantes: number; free: number; usando: number; receitaMensal: number; porArea: Record<string, number> }
  herbalife: { total: number; emTrial: number; pagantes: number; free: number; usando: number; receitaMensal: number; porArea: Record<string, number> }
  usuariosEmTrial: Array<{ userId: string; nome: string; email: string; area: string; diasRestantes: number; dataInicio: string; dataFim: string }>
  usuariosFree: Array<{ userId: string; nome: string; email: string; area: string; dataCadastro: string }>
  totalGeral: { total: number; emTrial: number; pagantes: number; free: number; usando: number; receitaMensal: number }
}

interface ProductActivityRow {
  bucket: string
  novosUsuarios: number
  novosJaPagaram: number
  novosNuncaPagaram: number
  linksCriados: number
  visualizacoesLinks: number
}

interface ProductActivityTotals {
  novosUsuarios: number
  novosJaPagaram: number
  novosNuncaPagaram: number
  linksCriados: number
  visualizacoesLinks: number
}

interface ProductActivityPayload {
  granularity: 'day' | 'month'
  data: ProductActivityRow[]
  totals: ProductActivityTotals
  period: string
  customRange: { de: string; ate: string } | null
}

function formatActivityBucketLabel(bucket: string): string {
  if (bucket.length === 7 && /^\d{4}-\d{2}$/.test(bucket)) {
    const [y, m] = bucket.split('-').map(Number)
    return new Date(y, m - 1, 1).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
  }
  if (bucket.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(bucket)) {
    const [y, m, d] = bucket.slice(0, 10).split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR')
  }
  return bucket
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
  const [usersOverview, setUsersOverview] = useState<UsersOverview | null>(null)
  const [productActivity, setProductActivity] = useState<ProductActivityPayload | null>(null)
  const [activityLoading, setActivityLoading] = useState(true)
  const [activityError, setActivityError] = useState<string | null>(null)
  const [monitorDeInput, setMonitorDeInput] = useState('')
  const [monitorAteInput, setMonitorAteInput] = useState('')
  const [monitorCustom, setMonitorCustom] = useState(false)
  const [monitorDe, setMonitorDe] = useState('')
  const [monitorAte, setMonitorAte] = useState('')
  const [monitorPreset, setMonitorPreset] = useState<null | '7d' | '30d' | 'mes_passado' | 'meses_3'>(null)

  // Filtros
  const [period, setPeriod] = useState<'7d' | '30d' | '3m' | '6m' | '1y' | 'all'>('30d')
  const [funnelArea, setFunnelArea] = useState<'todos' | 'ylada' | 'wellness'>('todos')
  const [blocoFiltro, setBlocoFiltro] = useState<'todos' | 'ylada' | 'wellness'>('todos')

  // Carregar todos os dados
  useEffect(() => {
    const carregarDados = async () => {
      try {
        setLoading(true)
        setError(null)

        // Carregar em paralelo (users-overview é opcional - não quebra o resto se falhar)
        const [statsRes, growthRes, comparisonRes, funnelRes, templatesRes, usersRes, overviewRes] =
          await Promise.all([
            fetch('/api/admin/analytics/stats', { credentials: 'include' }),
            fetch(`/api/admin/analytics/growth?period=${period}`, { credentials: 'include' }),
            fetch('/api/admin/analytics/comparison', { credentials: 'include' }),
            fetch(`/api/admin/analytics/funnel?area=${funnelArea}`, { credentials: 'include' }),
            fetch('/api/admin/analytics/top-templates?metric=leads&limit=10', { credentials: 'include' }),
            fetch('/api/admin/analytics/top-users?metric=leads&limit=10', { credentials: 'include' }),
            fetch(`/api/admin/analytics/users-overview?bloco=${blocoFiltro}`, { credentials: 'include' }),
          ])

        // APIs principais devem funcionar
        const failed = [
          !statsRes.ok && 'stats',
          !growthRes.ok && 'growth',
          !comparisonRes.ok && 'comparison',
          !funnelRes.ok && 'funnel',
          !templatesRes.ok && 'top-templates',
          !usersRes.ok && 'top-users'
        ].filter(Boolean)
        if (failed.length > 0) {
          throw new Error(`Erro ao carregar dados (${failed.join(', ')})`)
        }

        const [statsData, growthData, comparisonData, funnelData, templatesData, usersData, overviewData] = await Promise.all([
          statsRes.json(),
          growthRes.json(),
          comparisonRes.json(),
          funnelRes.json(),
          templatesRes.json(),
          usersRes.json(),
          overviewRes.ok ? overviewRes.json() : Promise.resolve({ success: false })
        ])

        if (statsData.success) setStats(statsData.stats)
        if (growthData.success) setGrowthData(growthData.data || [])
        if (comparisonData.success) setComparison(comparisonData.comparison || {})
        if (funnelData.success) setFunnel(funnelData.funnel)
        if (templatesData.success) setTopTemplates(templatesData.topTemplates || [])
        if (usersData.success) setTopUsers(usersData.topUsers || [])
        if (overviewData?.success) setUsersOverview(overviewData)

      } catch (err: any) {
        console.error('Erro ao carregar analytics:', err)
        setError(err.message || 'Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [period, funnelArea, blocoFiltro])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setActivityLoading(true)
      setActivityError(null)
      try {
        const params = new URLSearchParams()
        params.set('bloco', blocoFiltro)
        if (monitorCustom && monitorDe && monitorAte) {
          params.set('de', monitorDe)
          params.set('ate', monitorAte)
        } else {
          params.set('period', period)
        }
        const res = await fetch(`/api/admin/analytics/product-activity?${params.toString()}`, {
          credentials: 'include',
        })
        const json = await res.json()
        if (cancelled) return
        if (!res.ok) {
          setActivityError(typeof json?.error === 'string' ? json.error : 'Erro ao carregar monitoramento')
          setProductActivity(null)
          return
        }
        if (json?.success && Array.isArray(json.data) && json.totals) {
          setProductActivity({
            granularity: json.granularity,
            data: json.data,
            totals: json.totals,
            period: json.period ?? period,
            customRange: json.customRange ?? null,
          })
        } else {
          setProductActivity(null)
        }
      } catch (e: unknown) {
        if (!cancelled) {
          const msg = e instanceof Error ? e.message : 'Erro ao carregar monitoramento'
          setActivityError(msg)
          setProductActivity(null)
        }
      } finally {
        if (!cancelled) setActivityLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [period, blocoFiltro, monitorCustom, monitorDe, monitorAte])

  const aplicarDatasMonitoramento = () => {
    const de = monitorDeInput.trim()
    const ate = monitorAteInput.trim()
    const ok = /^\d{4}-\d{2}-\d{2}$/
    if (!ok.test(de) || !ok.test(ate)) {
      setActivityError('Informe data inicial e final válidas.')
      return
    }
    let d = de
    let a = ate
    if (d > a) {
      const t = d
      d = a
      a = t
    }
    setMonitorDe(d)
    setMonitorAte(a)
    setMonitorDeInput(d)
    setMonitorAteInput(a)
    setMonitorCustom(true)
    setMonitorPreset(null)
    setActivityError(null)
  }

  const aplicarPresetMonitoramento = (preset: '7d' | '30d' | 'mes_passado' | 'meses_3') => {
    const now = new Date()
    const hoje = toLocalDateStringISO(now)
    if (!hoje) return

    let de: string
    let ate: string

    if (preset === '7d') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
      de = toLocalDateStringISO(start) || hoje
      ate = hoje
    } else if (preset === '30d') {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29)
      de = toLocalDateStringISO(start) || hoje
      ate = hoje
    } else if (preset === 'mes_passado') {
      const firstPrev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastPrev = new Date(now.getFullYear(), now.getMonth(), 0)
      de = toLocalDateStringISO(firstPrev) || hoje
      ate = toLocalDateStringISO(lastPrev) || hoje
    } else {
      const start = new Date(now.getFullYear(), now.getMonth() - 2, 1)
      de = toLocalDateStringISO(start) || hoje
      ate = hoje
    }

    let d = de
    let a = ate
    if (d > a) {
      const t = d
      d = a
      a = t
    }
    setMonitorDeInput(d)
    setMonitorAteInput(a)
    setMonitorDe(d)
    setMonitorAte(a)
    setMonitorCustom(true)
    setMonitorPreset(preset)
    setActivityError(null)
  }

  const limparDatasMonitoramento = () => {
    setMonitorCustom(false)
    setMonitorDe('')
    setMonitorAte('')
    setMonitorDeInput('')
    setMonitorAteInput('')
    setMonitorPreset(null)
    setActivityError(null)
  }

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
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/admin" className="shrink-0 touch-manipulation">
                <Image
                  src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png"
                  alt="YLADA"
                  width={180}
                  height={60}
                  className="h-9 sm:h-12 w-auto max-w-[140px] sm:max-w-none"
                />
              </Link>
              <div className="hidden sm:block h-10 sm:h-12 w-px bg-gray-300 shrink-0" aria-hidden />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900 leading-tight">Analytics</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 line-clamp-2 sm:line-clamp-none">
                  Dados e métricas
                </p>
              </div>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center justify-center sm:justify-start min-h-[44px] sm:min-h-0 text-gray-700 hover:text-gray-900 text-sm font-medium px-4 py-2.5 rounded-lg border border-gray-200 sm:border-0 hover:bg-gray-50 transition-colors touch-manipulation self-stretch sm:self-auto text-center"
            >
              ← Voltar ao admin
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 pb-24 sm:pb-8">
        {/* Mensagens de Erro */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Filtros */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bloco</label>
              <div className="grid grid-cols-3 gap-2">
                {(['todos', 'ylada', 'wellness'] as const).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBlocoFiltro(b)}
                    className={`min-h-[44px] px-2 sm:px-4 py-2.5 rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                      blocoFiltro === b
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                    }`}
                  >
                    {b === 'todos' ? 'Todos' : b === 'ylada' ? 'YLADA' : 'Wellness'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Período de Crescimento</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(['7d', '30d', '3m', '6m', '1y', 'all'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPeriod(p)}
                    className={`min-h-[44px] px-2 sm:px-4 py-2.5 rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                      period === p
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                    }`}
                  >
                    {p === '7d' ? '7 dias' : p === '30d' ? '30 dias' : p === '3m' ? '3 meses' : p === '6m' ? '6 meses' : p === '1y' ? '1 ano' : 'Tudo'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Área do Funil</label>
              <div className="grid grid-cols-3 gap-2">
                {(['todos', 'ylada', 'wellness'] as const).map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setFunnelArea(a)}
                    className={`min-h-[44px] px-2 sm:px-4 py-2.5 rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                      funnelArea === a
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 active:bg-gray-200'
                    }`}
                  >
                    {a === 'todos' ? 'Todos' : a === 'ylada' ? 'YLADA' : 'Wellness'}
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

            {/* Usuários - área central para ver Free, Pagantes, Mensal, Anual, Manual */}
            <div className="mb-8">
              <div className="bg-white rounded-xl border-2 border-indigo-200 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-2">👥 Usuários</h2>
                <p className="text-gray-600 mb-4">
                  Lista completa de usuários: quem está no Free, pagantes, mensal, anual, manual. Filtre por área e tipo de assinatura.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/admin/usuarios"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Ver Usuários →
                  </Link>
                  <Link
                    href="/admin/trials"
                    className="inline-flex items-center gap-2 px-4 py-2 text-amber-700 hover:text-amber-900 font-medium border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    Trial 3 dias (Wellness)
                  </Link>
                </div>
              </div>
            </div>

            {/* Cards YLADA vs Wellness - Perfil de Usuários */}
            {usersOverview && (
              <div className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">📊 Perfil de Usuários por Bloco</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-1">Total</p>
                    <p className="text-2xl font-bold text-gray-900">{usersOverview.totalGeral.total.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-200 bg-emerald-50/50">
                    <p className="text-sm font-medium text-gray-600 mb-1">Pagantes</p>
                    <p className="text-2xl font-bold text-emerald-700">{usersOverview.totalGeral.pagantes.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 bg-slate-50/50">
                    <p className="text-sm font-medium text-gray-600 mb-1">Free</p>
                    <p className="text-2xl font-bold text-slate-700">{usersOverview.totalGeral.free.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-sky-200 bg-sky-50/50">
                    <p className="text-sm font-medium text-gray-600 mb-1">Usando (30 dias)</p>
                    <p className="text-2xl font-bold text-sky-700">{usersOverview.totalGeral.usando.toLocaleString('pt-BR')}</p>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                    <p className="text-sm font-medium text-gray-600 mb-1">Receita Mensal</p>
                    <p className="text-2xl font-bold text-gray-900">R$ {usersOverview.totalGeral.receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                  </div>
                </div>

                {/* Lista de Usuários Free */}
                {(usersOverview.usuariosFree?.length ?? 0) > 0 && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-200 bg-slate-50/50">
                      <h3 className="text-lg font-bold text-slate-900">Usuários Free</h3>
                      <p className="text-sm text-slate-700 mt-1">{usersOverview.usuariosFree.length} usuário(s) no plano Free (com limites)</p>
                    </div>
                    <div className="overflow-x-auto max-h-80 overflow-y-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cadastro</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {usersOverview.usuariosFree.map((u, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.nome}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                              <td className="px-4 py-3 text-sm text-gray-600 capitalize">{u.area}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {u.dataCadastro ? new Date(u.dataCadastro).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Detalhe por bloco quando filtro = todos */}
                {blocoFiltro === 'todos' && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                      <h3 className="font-bold text-indigo-700 mb-3">YLADA</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Total:</span> {usersOverview.ylada.total} | <span className="font-medium">Pagantes:</span> {usersOverview.ylada.pagantes} | <span className="font-medium">Free:</span> {usersOverview.ylada.free} | <span className="font-medium">Usando:</span> {usersOverview.ylada.usando}</p>
                        <p><span className="font-medium">Receita:</span> R$ {usersOverview.ylada.receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        {Object.keys(usersOverview.ylada.porArea).length > 0 && (
                          <p className="text-gray-600">Por área: {Object.entries(usersOverview.ylada.porArea).map(([a, n]) => `${a}: ${n}`).join(', ')}</p>
                        )}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                      <h3 className="font-bold text-green-700 mb-3">Wellness</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Total:</span> {usersOverview.herbalife.total} | <span className="font-medium">Pagantes:</span> {usersOverview.herbalife.pagantes} | <span className="font-medium">Free:</span> {usersOverview.herbalife.free} | <span className="font-medium">Usando:</span> {usersOverview.herbalife.usando}</p>
                        <p><span className="font-medium">Receita:</span> R$ {usersOverview.herbalife.receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                        {Object.keys(usersOverview.herbalife.porArea).length > 0 && (
                          <p className="text-gray-600">Por área: {Object.entries(usersOverview.herbalife.porArea).map(([a, n]) => `${a}: ${n}`).join(', ')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* Cadastros, uso de links e histórico de pagamento por data */}
            <div className="mb-8">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-200 bg-slate-50/80">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">Monitoramento por data</h2>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    Novos cadastros (com split de quem já teve plano mensal ou anual alguma vez), links YLADA criados e
                    visualizações. O bloco segue o seletor <strong>Bloco</strong> no topo da página.
                    {productActivity && (
                      <>
                        {' '}
                        Agrupado por{' '}
                        {productActivity.granularity === 'day' ? 'dia (calendário Brasil)' : 'mês'}.
                        {monitorCustom && productActivity.customRange
                          ? ` Intervalo: ${formatYmdSlashPtBr(productActivity.customRange.de)} a ${formatYmdSlashPtBr(productActivity.customRange.ate)}.`
                          : ` Período rápido: ${period === '7d' ? '7 dias' : period === '30d' ? '30 dias' : period === '3m' ? '3 meses' : period === '6m' ? '6 meses' : period === '1y' ? '1 ano' : 'tudo'}.`}
                      </>
                    )}
                  </p>
                  <p className="md:hidden mt-2 text-xs text-indigo-700 font-medium">
                    No celular, cada dia aparece em um cartão abaixo; na tabela larga, use a rolagem horizontal.
                  </p>
                  <div className="mt-4">
                    <p className="text-xs font-medium text-gray-600 mb-2">Atalhos (um clique)</p>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { id: '7d' as const, label: 'Últimos 7 dias' },
                          { id: '30d' as const, label: 'Últimos 30 dias' },
                          { id: 'mes_passado' as const, label: 'Mês passado' },
                          { id: 'meses_3' as const, label: 'Últimos 3 meses' },
                        ] as const
                      ).map(({ id, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => aplicarPresetMonitoramento(id)}
                          className={`min-h-[44px] px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors touch-manipulation border ${
                            monitorCustom && monitorPreset === id
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-2 ring-indigo-500/30'
                              : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50 active:bg-gray-100'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1.5 text-[11px] text-gray-500">
                      Mês passado = calendário completo do mês anterior. Últimos 3 meses = do dia 1 (há dois meses) até
                      hoje.
                    </p>
                  </div>
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row lg:flex-wrap lg:items-end gap-3">
                    <div className="min-w-0 sm:min-w-[10rem]">
                      <label htmlFor="monitor-de" className="block text-xs font-medium text-gray-600 mb-1">
                        Data inicial
                      </label>
                      <input
                        id="monitor-de"
                        type="date"
                        value={monitorDeInput}
                        onChange={(e) => {
                          setMonitorDeInput(e.target.value)
                          setMonitorPreset(null)
                        }}
                        className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 touch-manipulation"
                      />
                    </div>
                    <div className="min-w-0 sm:min-w-[10rem]">
                      <label htmlFor="monitor-ate" className="block text-xs font-medium text-gray-600 mb-1">
                        Data final
                      </label>
                      <input
                        id="monitor-ate"
                        type="date"
                        value={monitorAteInput}
                        onChange={(e) => {
                          setMonitorAteInput(e.target.value)
                          setMonitorPreset(null)
                        }}
                        className="w-full min-h-[44px] px-3 py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 touch-manipulation"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 sm:col-span-2 lg:col-span-1 lg:flex lg:gap-2 gap-2">
                      <button
                        type="button"
                        onClick={aplicarDatasMonitoramento}
                        className="min-h-[48px] w-full lg:w-auto px-4 py-3 text-sm font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 transition-colors touch-manipulation"
                      >
                        Aplicar datas
                      </button>
                      <button
                        type="button"
                        onClick={limparDatasMonitoramento}
                        className={`min-h-[48px] w-full lg:w-auto px-4 py-3 text-sm font-medium rounded-lg border transition-colors touch-manipulation ${
                          monitorCustom
                            ? 'border-gray-400 text-gray-800 hover:bg-gray-100 active:bg-gray-200'
                            : 'border-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!monitorCustom}
                      >
                        Usar período do topo
                      </button>
                    </div>
                  </div>
                  {activityError && (
                    <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      {activityError}
                    </p>
                  )}
                </div>
                {activityLoading ? (
                  <div className="p-12 flex flex-col items-center justify-center text-gray-500 text-sm">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-3" />
                    Carregando monitoramento…
                  </div>
                ) : !productActivity ? (
                  <div className="p-8 text-center text-gray-500 text-sm">Não foi possível carregar os dados.</div>
                ) : productActivity.data.length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    Nenhum dado neste período para o bloco selecionado.
                  </div>
                ) : (
                  <>
                    {/* Celular: cartões legíveis sem zoom */}
                    <div className="md:hidden divide-y divide-gray-200 max-h-[min(70vh,32rem)] overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch]">
                      {productActivity.data.map((row) => (
                        <div key={row.bucket} className="p-4 bg-white">
                          <p className="text-base font-bold text-gray-900 mb-3">
                            {formatActivityBucketLabel(row.bucket)}
                          </p>
                          <dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2.5 text-sm">
                            <dt className="text-gray-600">Novos usuários</dt>
                            <dd className="text-right font-semibold tabular-nums text-gray-900">
                              {row.novosUsuarios.toLocaleString('pt-BR')}
                            </dd>
                            <dt className="text-emerald-800/90">Já pagaram*</dt>
                            <dd className="text-right font-semibold tabular-nums text-emerald-700">
                              {row.novosJaPagaram.toLocaleString('pt-BR')}
                            </dd>
                            <dt className="text-slate-600">Nunca pagaram*</dt>
                            <dd className="text-right font-semibold tabular-nums text-slate-700">
                              {row.novosNuncaPagaram.toLocaleString('pt-BR')}
                            </dd>
                            <dt className="text-indigo-800/90">Links criados</dt>
                            <dd className="text-right font-semibold tabular-nums text-indigo-700">
                              {row.linksCriados.toLocaleString('pt-BR')}
                            </dd>
                            <dt className="text-sky-800/90">Views nos links</dt>
                            <dd className="text-right font-semibold tabular-nums text-sky-700">
                              {row.visualizacoesLinks.toLocaleString('pt-BR')}
                            </dd>
                          </dl>
                        </div>
                      ))}
                      <div className="p-4 bg-gray-100 border-t-2 border-gray-200">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          Totais no período
                        </p>
                        <dl className="grid grid-cols-[1fr_auto] gap-x-3 gap-y-2 text-sm">
                          <dt className="text-gray-700 font-medium">Novos usuários</dt>
                          <dd className="text-right font-bold tabular-nums">
                            {productActivity.totals.novosUsuarios.toLocaleString('pt-BR')}
                          </dd>
                          <dt className="text-emerald-800 font-medium">Já pagaram*</dt>
                          <dd className="text-right font-bold tabular-nums text-emerald-800">
                            {productActivity.totals.novosJaPagaram.toLocaleString('pt-BR')}
                          </dd>
                          <dt className="text-gray-700 font-medium">Nunca pagaram*</dt>
                          <dd className="text-right font-bold tabular-nums">
                            {productActivity.totals.novosNuncaPagaram.toLocaleString('pt-BR')}
                          </dd>
                          <dt className="text-indigo-900 font-medium">Links criados</dt>
                          <dd className="text-right font-bold tabular-nums text-indigo-800">
                            {productActivity.totals.linksCriados.toLocaleString('pt-BR')}
                          </dd>
                          <dt className="text-sky-900 font-medium">Views nos links</dt>
                          <dd className="text-right font-bold tabular-nums text-sky-800">
                            {productActivity.totals.visualizacoesLinks.toLocaleString('pt-BR')}
                          </dd>
                        </dl>
                      </div>
                    </div>
                    {/* Tablet/desktop: tabela */}
                    <div className="hidden md:block overflow-x-auto max-h-[28rem] overflow-y-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] shadow-[inset_-12px_0_12px_-12px_rgba(0,0,0,0.08)]">
                      <table className="min-w-[640px] w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                          <tr>
                            <th className="sticky left-0 z-20 bg-gray-50 px-4 py-3 text-left font-semibold text-gray-700 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)]">
                              Período
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                              Novos usuários
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                              …já pagaram*
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                              …nunca pagaram*
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                              Links criados
                            </th>
                            <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">
                              Views nos links
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {productActivity.data.map((row) => (
                            <tr key={row.bucket} className="group hover:bg-gray-50/80">
                              <td className="sticky left-0 z-10 bg-white group-hover:bg-gray-50/80 px-4 py-2.5 font-medium text-gray-900 whitespace-nowrap shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)]">
                                {formatActivityBucketLabel(row.bucket)}
                              </td>
                              <td className="px-4 py-2.5 text-right tabular-nums text-gray-800">
                                {row.novosUsuarios.toLocaleString('pt-BR')}
                              </td>
                              <td className="px-4 py-2.5 text-right tabular-nums text-emerald-700">
                                {row.novosJaPagaram.toLocaleString('pt-BR')}
                              </td>
                              <td className="px-4 py-2.5 text-right tabular-nums text-slate-600">
                                {row.novosNuncaPagaram.toLocaleString('pt-BR')}
                              </td>
                              <td className="px-4 py-2.5 text-right tabular-nums text-indigo-700">
                                {row.linksCriados.toLocaleString('pt-BR')}
                              </td>
                              <td className="px-4 py-2.5 text-right tabular-nums text-sky-700">
                                {row.visualizacoesLinks.toLocaleString('pt-BR')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-gray-100/95 sticky bottom-0 z-10 font-semibold border-t border-gray-200">
                          <tr>
                            <td className="sticky left-0 z-20 bg-gray-100 px-4 py-3 text-gray-900 shadow-[2px_0_6px_-2px_rgba(0,0,0,0.06)]">
                              Totais no período
                            </td>
                            <td className="px-4 py-3 text-right tabular-nums">
                              {productActivity.totals.novosUsuarios.toLocaleString('pt-BR')}
                            </td>
                            <td className="px-4 py-3 text-right tabular-nums text-emerald-800">
                              {productActivity.totals.novosJaPagaram.toLocaleString('pt-BR')}
                            </td>
                            <td className="px-4 py-3 text-right tabular-nums">
                              {productActivity.totals.novosNuncaPagaram.toLocaleString('pt-BR')}
                            </td>
                            <td className="px-4 py-3 text-right tabular-nums text-indigo-800">
                              {productActivity.totals.linksCriados.toLocaleString('pt-BR')}
                            </td>
                            <td className="px-4 py-3 text-right tabular-nums text-sky-800">
                              {productActivity.totals.visualizacoesLinks.toLocaleString('pt-BR')}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </>
                )}
                <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 leading-relaxed">
                  * “Já pagaram” / “Nunca pagaram” referem-se a quem já teve assinatura mensal ou anual em algum momento
                  (como na lista de usuários), não apenas ao plano atual.
                </div>
              </div>
            </div>

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

