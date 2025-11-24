'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import CoachNavBar from '@/components/c/CoachNavBar'
import { buildCoachToolUrl, buildCoachToolUrlFallback, buildShortUrl } from '@/lib/url-utils'

// 🚀 OTIMIZAÇÃO: Lazy load do QRCode (componente pesado, só usado quando necessário)
const QRCode = dynamic(() => import('@/components/QRCode'), {
  ssr: false,
  loading: () => <div className="w-[200px] h-[200px] bg-gray-100 rounded-lg animate-pulse" />
})

interface Ferramenta {
  id: string
  nome: string
  categoria: string
  objetivo: string
  url: string
  shortUrl?: string
  shortCode?: string
  status: 'ativa' | 'inativa'
  leads: number
  visualizacoes: number
  conversao: number
  ultimaAtividade: string
  cores: {
    primaria: string
    secundaria: string
  }
  criadaEm: string
}

export default function FerramentasCoach() {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([])
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'ativa' | 'inativa'>('todas')
  const [loading, setLoading] = useState(true)
  const [ferramentaExcluindoId, setFerramentaExcluindoId] = useState<string | null>(null)

  // Carregar ferramentas do banco de dados
  useEffect(() => {
    carregarFerramentas()
  }, [])

  const carregarFerramentas = async () => {
    try {
      setLoading(true)

      const response = await fetch(
        `/api/c/ferramentas?profession=coach`,
        {
          credentials: 'include'
        }
      )

      if (!response.ok) {
        throw new Error('Erro ao carregar ferramentas')
      }

      const data = await response.json()
      
      // Transformar dados da API para o formato da interface
      const ferramentasFormatadas: Ferramenta[] = (data.tools || []).map((tool: any) => {
        // Determinar categoria
        let categoria = 'Planilha'
        if (tool.is_quiz || tool.template_slug === 'quiz-personalizado') {
          categoria = 'Quiz Personalizado'
        } else if (tool.template_slug?.startsWith('calc-')) {
          categoria = 'Calculadora'
        } else if (tool.template_slug?.startsWith('quiz-')) {
          categoria = 'Quiz'
        }

        // Construir URL - quizzes personalizados usam rota diferente
        let url = ''
        if (tool.is_quiz || tool.template_slug === 'quiz-personalizado') {
          // URL para quiz personalizado: /pt/c/{user-slug}/quiz/{slug}
          if (tool.user_profiles?.user_slug) {
            const baseUrl = typeof window !== 'undefined' ? window.location.protocol + '//' + window.location.host : 'https://ylada.app'
            url = `${baseUrl}/pt/c/${tool.user_profiles.user_slug}/quiz/${tool.slug}`
          } else {
            url = buildCoachToolUrlFallback(tool.id)
          }
        } else {
          // URL padrão para outras ferramentas
          url = tool.user_profiles?.user_slug 
            ? buildCoachToolUrl(tool.user_profiles.user_slug, tool.slug)
            : buildCoachToolUrlFallback(tool.id)
        }

        return {
          id: tool.id,
          nome: tool.title,
          categoria: categoria,
          objetivo: tool.description || '',
          url: url,
          shortUrl: tool.short_code ? buildShortUrl(tool.short_code) : undefined,
          shortCode: tool.short_code,
          status: tool.status === 'active' ? 'ativa' : 'inativa',
          leads: tool.leads_count || 0,
          visualizacoes: tool.views || 0,
          conversao: tool.views > 0 ? (tool.leads_count || 0) / tool.views * 100 : 0,
          ultimaAtividade: new Date(tool.updated_at).toLocaleDateString('pt-BR'),
          cores: tool.custom_colors || { primaria: '#3B82F6', secundaria: '#2563EB' },
          criadaEm: new Date(tool.created_at).toLocaleDateString('pt-BR')
        }
      })

      setFerramentas(ferramentasFormatadas)
    } catch (error) {
      console.error('Erro ao carregar ferramentas:', error)
      // Em caso de erro, manter array vazio
      setFerramentas([])
    } finally {
      setLoading(false)
    }
  }

  const excluirFerramenta = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este link?')) {
      return
    }

    try {
      setFerramentaExcluindoId(id)
      const response = await fetch(`/api/c/ferramentas?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Erro ao excluir link')
      }

      setFerramentas(prev => prev.filter(f => f.id !== id))
      alert('Link excluído com sucesso!')
    } catch (error: any) {
      console.error('Erro ao excluir link:', error)
      alert(error.message || 'Erro ao excluir link. Tente novamente.')
    } finally {
      setFerramentaExcluindoId(null)
    }
  }

  // 🚀 OTIMIZAÇÃO: useMemo para evitar recálculo desnecessário
  const stats = useMemo(() => ({
    totalFerramentas: ferramentas.length,
    ferramentasAtivas: ferramentas.filter(f => f.status === 'ativa').length,
    totalLeads: ferramentas.reduce((sum, f) => sum + f.leads, 0),
    taxaConversaoMedia: ferramentas.length > 0 
      ? ferramentas.reduce((sum, f) => sum + f.conversao, 0) / ferramentas.length 
      : 0
  }), [ferramentas])

  // 🚀 OTIMIZAÇÃO: useMemo para evitar refiltro desnecessário
  const ferramentasFiltradas = useMemo(() => {
    return ferramentas.filter(ferramenta => {
      const statusMatch = filtroStatus === 'todas' || ferramenta.status === filtroStatus
      return statusMatch
    })
  }, [ferramentas, filtroStatus])

  return (
    <div className="min-h-screen bg-gray-50">
      <CoachNavBar showTitle={true} title="Meus Links" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header com botão Criar Novo Link */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              🔗 Meus Links
            </h1>
            <p className="text-gray-600">
              Gerencie todos os seus links personalizados
            </p>
          </div>
          <Link
            href="/pt/coach/ferramentas/nova"
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 shadow-lg font-medium"
          >
            + Criar Novo Link
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🛠️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Links</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFerramentas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Links Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.ferramentasAtivas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-gray-900">{stats.taxaConversaoMedia.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => setFiltroStatus('todas')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroStatus === 'todas'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-purple-300'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltroStatus('ativa')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroStatus === 'ativa'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-purple-300'
            }`}
          >
            Ativas
          </button>
          <button
            onClick={() => setFiltroStatus('inativa')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroStatus === 'inativa'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-600 border border-gray-300 hover:border-purple-300'
            }`}
          >
            Inativas
          </button>
        </div>

        {/* Lista de Ferramentas */}
        {loading ? (
          <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando links...</p>
          </div>
        ) : ferramentasFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
            <span className="text-6xl mb-4 block">🛠️</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum link encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              {ferramentas.length === 0 
                ? 'Crie seu primeiro link para começar a capturar leads'
                : 'Tente ajustar os filtros para ver mais links'}
            </p>
            <Link
              href="/pt/coach/ferramentas/nova"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Criar Novo Link
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ferramentasFiltradas.map((ferramenta) => (
              <div
                key={ferramenta.id}
                className="bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                        style={{ backgroundColor: ferramenta.cores.primaria || '#3B82F6' }}
                      >
                        🎯
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{ferramenta.nome}</h3>
                        <p className="text-sm text-gray-600">{ferramenta.categoria} • {ferramenta.objetivo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          ferramenta.status === 'ativa'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {ferramenta.status === 'ativa' ? 'Ativa' : 'Inativa'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Visualizações</p>
                      <p className="text-xl font-bold text-gray-900">{ferramenta.visualizacoes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Leads</p>
                      <p className="text-xl font-bold text-purple-600">{ferramenta.leads}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Taxa de Conversão</p>
                      <p className="text-xl font-bold text-purple-600">{ferramenta.conversao.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        Criado em: {ferramenta.criadaEm}
                      </p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">URL:</span>
                        <span className="text-xs text-gray-700 font-mono break-all">{ferramenta.url}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(ferramenta.url)
                            alert('URL copiada!')
                          }}
                          className="text-xs text-purple-600 hover:text-purple-700 underline"
                        >
                          Copiar
                        </button>
                      </div>
                      {ferramenta.shortCode && (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500">URL Encurtada:</span>
                            <span className="text-xs text-purple-600 font-mono break-all">
                              {ferramenta.shortUrl}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(ferramenta.shortUrl || '')
                                alert('URL encurtada copiada!')
                              }}
                              className="text-xs text-purple-600 hover:text-purple-700 underline"
                            >
                              Copiar
                            </button>
                          </div>
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">QR Code:</p>
                            <QRCode 
                              url={ferramenta.shortUrl || ''}
                              size={120}
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2 ml-4 text-right sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 sm:text-left">
                      <Link
                        href={ferramenta.url}
                        target="_blank"
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Ver Link →
                      </Link>
                      <Link
                        href={`/pt/coach/ferramentas/${ferramenta.id}/editar`}
                        className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => excluirFerramenta(ferramenta.id)}
                        disabled={ferramentaExcluindoId === ferramenta.id}
                        className="text-sm text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
                      >
                        {ferramentaExcluindoId === ferramenta.id ? 'Excluindo...' : 'Excluir'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}