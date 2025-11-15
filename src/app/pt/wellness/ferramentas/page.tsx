'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import QRCode from '@/components/QRCode'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import { buildWellnessToolUrl, buildWellnessToolUrlFallback, buildShortUrl } from '@/lib/url-utils'

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

export default function FerramentasWellness() {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([])
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'ativa' | 'inativa'>('todas')
  const [loading, setLoading] = useState(true)

  // Carregar ferramentas do banco de dados
  useEffect(() => {
    carregarFerramentas()
  }, [])

  const carregarFerramentas = async () => {
    try {
      setLoading(true)

      const response = await fetch(
        `/api/wellness/ferramentas?profession=wellness`,
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
          // URL para quiz personalizado: /pt/wellness/{user-slug}/quiz/{slug}
          if (tool.user_profiles?.user_slug) {
            const baseUrl = typeof window !== 'undefined' ? window.location.protocol + '//' + window.location.host : 'https://ylada.app'
            url = `${baseUrl}/pt/wellness/${tool.user_profiles.user_slug}/quiz/${tool.slug}`
          } else {
            url = buildWellnessToolUrlFallback(tool.id)
          }
        } else {
          // URL padrão para outras ferramentas
          url = tool.user_profiles?.user_slug 
            ? buildWellnessToolUrl(tool.user_profiles.user_slug, tool.slug)
            : buildWellnessToolUrlFallback(tool.id)
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
          cores: tool.custom_colors || { primaria: '#10B981', secundaria: '#059669' },
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

  const stats = {
    totalFerramentas: ferramentas.length,
    ferramentasAtivas: ferramentas.filter(f => f.status === 'ativa').length,
    totalLeads: ferramentas.reduce((sum, f) => sum + f.leads, 0),
    taxaConversaoMedia: ferramentas.length > 0 
      ? ferramentas.reduce((sum, f) => sum + f.conversao, 0) / ferramentas.length 
      : 0
  }

  const ferramentasFiltradas = filtroStatus === 'todas'
    ? ferramentas
    : ferramentas.filter(f => f.status === filtroStatus)

  const categorias = [...new Set(ferramentas.map(f => f.categoria))]

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="Meus Links" />
      
      {/* Botão Criar Link */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-end mb-4">
          <Link
            href="/pt/wellness/ferramentas/nova"
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg font-medium"
          >
            + Criar Link
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Links</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFerramentas}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Links Ativos</p>
                <p className="text-2xl font-bold text-green-600">{stats.ferramentasAtivas}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Leads</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalLeads}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taxa de Conversão</p>
                <p className="text-2xl font-bold text-purple-600">{stats.taxaConversaoMedia.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📊</span>
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando ferramentas...</p>
          </div>
        ) : ferramentasFiltradas.length === 0 ? (
          <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
            <span className="text-6xl mb-4 block">🔧</span>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum link encontrado
            </h3>
            <p className="text-gray-600 mb-6">
              {filtroStatus === 'todas' 
                ? 'Crie seu primeiro link para começar.'
                : `Nenhum link ${filtroStatus === 'ativa' ? 'ativa' : 'inativa'} encontrado.`}
            </p>
            <Link
              href="/pt/wellness/ferramentas/nova"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              + Criar Link
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
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: ferramenta.cores.primaria }}
                      >
                        <span className="text-white text-xl">
                          {ferramenta.categoria === 'Quiz Personalizado' ? '🎯' : 
                           ferramenta.categoria === 'Quiz' ? '📝' :
                           ferramenta.categoria === 'Calculadora' ? '🧮' : '📊'}
                        </span>
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
                      <p className="text-xs text-gray-500">Leads</p>
                      <p className="text-xl font-bold text-gray-900">{ferramenta.leads}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Visualizações</p>
                      <p className="text-xl font-bold text-gray-900">{ferramenta.visualizacoes}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Conversão</p>
                      <p className="text-xl font-bold text-gray-900">{ferramenta.conversao.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        Última atividade: {ferramenta.ultimaAtividade}
                      </p>
                      {/* URL Completa */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-500">URL:</span>
                        <span className="text-xs text-gray-700 font-mono break-all">{ferramenta.url}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(ferramenta.url)
                            alert('URL copiada!')
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 underline"
                        >
                          Copiar
                        </button>
                      </div>
                      {/* URL Encurtada */}
                      {ferramenta.shortUrl && (
                        <div className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="text-xs text-gray-500 block mb-1">URL Encurtada:</span>
                              <span className="text-sm text-purple-700 font-mono font-semibold">{ferramenta.shortUrl}</span>
                            </div>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(ferramenta.shortUrl!)
                                alert('URL encurtada copiada!')
                              }}
                              className="text-xs text-purple-600 hover:text-purple-700 underline px-2 py-1 bg-white rounded border border-purple-200"
                            >
                              Copiar
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Código: <code className="bg-white px-1 py-0.5 rounded">{ferramenta.shortCode}</code>
                          </p>
                        </div>
                      )}
                      {/* QR Code */}
                      {ferramenta.shortUrl && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500 mb-2">QR Code:</p>
                          <QRCode url={ferramenta.shortUrl} size={120} />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">
                      <Link
                        href={ferramenta.url}
                        target="_blank"
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium text-right"
                      >
                        Ver Link →
                      </Link>
                      <Link
                        href={`/pt/wellness/ferramentas/${ferramenta.id}/editar`}
                        className="text-sm text-gray-600 hover:text-gray-800 font-medium text-right"
                      >
                        Editar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

