'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

interface WhatsAppStats {
  totalConversas: number
  totalMensagens: number
  mensagensRecebidas: number
  mensagensEnviadas: number
  taxaResposta: number
  conversasSemResposta: number
}

interface Funil {
  captacao: number
  convite: number
  participacao: number
  interessado: number
  negociando: number
  cliente: number
}

interface Taxas {
  conversao: number
  participacao: number
}

interface TagData {
  tag: string
  count: number
}

interface MensagemPorDia {
  date: string
  total: number
  recebidas: number
  enviadas: number
}

interface AnalyticsData {
  periodo: string
  area: string
  estatisticas: WhatsAppStats
  funil: Funil
  taxas: Taxas
  tags: {
    distribuicao: Record<string, number>
    topTags: TagData[]
    porFase: Record<string, any>
  }
  mensagensPorDia: MensagemPorDia[]
  conversasPorArea: Record<string, number>
  conversasSemResposta: Array<{
    id: string
    phone: string
    customer_name: string | null
    last_message_at: string
  }>
}

function WhatsAppRelatoriosContent() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [periodo, setPeriodo] = useState<'7dias' | '30dias' | '90dias' | '1ano' | 'todos'>('30dias')
  const [area, setArea] = useState<string>('todas')
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    carregarDados()
  }, [periodo, area])

  const carregarDados = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      params.set('periodo', periodo)
      if (area !== 'todas') {
        params.set('area', area)
      }

      const response = await fetch(`/api/admin/whatsapp/analytics?${params.toString()}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar relatórios')
      }

      const result = await response.json()
      if (result.success) {
        setData(result)
      } else {
        throw new Error(result.error || 'Erro ao processar dados')
      }
    } catch (err: any) {
      console.error('Erro ao carregar relatórios:', err)
      setError(err.message || 'Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const exportarCSV = () => {
    if (!data) return

    // Preparar dados para CSV
    const linhas = [
      ['Período', 'Área', 'Total Conversas', 'Total Mensagens', 'Taxa Conversão', 'Taxa Participação'],
      [
        periodo,
        area,
        data.estatisticas.totalConversas.toString(),
        data.estatisticas.totalMensagens.toString(),
        `${data.taxas.conversao}%`,
        `${data.taxas.participacao}%`
      ]
    ]

    const csv = linhas.map(linha => linha.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `whatsapp-relatorio-${periodo}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const getTagLabel = (tag: string): string => {
    const tagMap: Record<string, string> = {
      'veio_aula_pratica': 'Aula Prática',
      'recebeu_link_workshop': 'Link Workshop',
      'participou_aula': 'Participou',
      'nao_participou_aula': 'Não Participou',
      'interessado': 'Interessado',
      'duvidas': 'Dúvidas',
      'analisando': 'Analisando',
      'negociando': 'Negociando',
      'cliente_nutri': 'Cliente Nutri',
      'perdeu': 'Perdeu',
    }
    return tagMap[tag] || tag
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando relatórios...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={carregarDados}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📊 Relatórios WhatsApp</h1>
              <p className="text-sm text-gray-500 mt-1">Análise e diagnósticos baseados em tags</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportarCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <span>📥</span>
                <span>Exportar CSV</span>
              </button>
              <Link
                href="/admin"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                ← Voltar ao admin
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="7dias">Últimos 7 dias</option>
                <option value="30dias">Últimos 30 dias</option>
                <option value="90dias">Últimos 90 dias</option>
                <option value="1ano">Último ano</option>
                <option value="todos">Todo período</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Área</label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="todas">Todas</option>
                <option value="nutri">Nutri</option>
                <option value="wellness">Wellness</option>
                <option value="coach">Coach</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Conversas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{data.estatisticas.totalConversas}</p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Mensagens</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{data.estatisticas.totalMensagens}</p>
              </div>
              <div className="text-4xl">📨</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Taxa Conversão</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{data.taxas.conversao}%</p>
              </div>
              <div className="text-4xl">📈</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Taxa Participação</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{data.taxas.participacao}%</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        {/* Funil de Conversão */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🎯 Funil de Conversão</h2>
          <div className="space-y-4">
            {[
              { label: 'Captação (Aula Prática)', value: data.funil.captacao, color: 'bg-blue-500' },
              { label: 'Convite (Link Workshop)', value: data.funil.convite, color: 'bg-purple-500' },
              { label: 'Participação', value: data.funil.participacao, color: 'bg-green-500' },
              { label: 'Interessado', value: data.funil.interessado, color: 'bg-yellow-500' },
              { label: 'Negociando', value: data.funil.negociando, color: 'bg-orange-500' },
              { label: 'Cliente', value: data.funil.cliente, color: 'bg-green-600' },
            ].map((etapa, index) => {
              const maxValue = data.funil.captacao || 1
              const porcentagem = (etapa.value / maxValue) * 100
              return (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{etapa.label}</span>
                    <span className="text-sm font-bold text-gray-900">{etapa.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className={`${etapa.color} h-4 rounded-full transition-all duration-500`}
                      style={{ width: `${porcentagem}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Top Tags */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🏷️ Top Tags</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.tags.topTags.map((tag, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{getTagLabel(tag.tag)}</span>
                  <span className="text-lg font-bold text-gray-900">{tag.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mensagens por Dia */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">📊 Mensagens por Dia</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {data.mensagensPorDia.map((dia, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700">
                  {new Date(dia.date).toLocaleDateString('pt-BR')}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">📥 {dia.recebidas}</span>
                  <span className="text-sm text-gray-600">📤 {dia.enviadas}</span>
                  <span className="text-sm font-bold text-gray-900">Total: {dia.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversas Sem Resposta */}
        {data.conversasSemResposta.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              ⚠️ Conversas Sem Resposta (últimas 24h)
            </h2>
            <div className="space-y-2">
              {data.conversasSemResposta.map((conv) => (
                <div key={conv.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {conv.customer_name || conv.phone}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(conv.last_message_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <Link
                    href={`/admin/whatsapp?conversation=${conv.id}`}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Ver Conversa
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function WhatsAppRelatoriosPage() {
  return (
    <AdminProtectedRoute>
      <WhatsAppRelatoriosContent />
    </AdminProtectedRoute>
  )
}
