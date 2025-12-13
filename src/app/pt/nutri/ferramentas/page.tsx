'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import QRCode from '@/components/QRCode'
import NutriNavBar from '@/components/nutri/NutriNavBar'
import VideoPlayerYLADA from '@/components/formacao/VideoPlayerYLADA'
import { buildNutriToolUrl, buildNutriToolUrlFallback, buildShortUrl } from '@/lib/url-utils'

interface Ferramenta {
  id: string
  nome: string
  categoria: string
  tipo?: 'fluxos' | 'quizzes' | 'templates'
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

export default function FerramentasNutri() {
  const [ferramentas, setFerramentas] = useState<Ferramenta[]>([])
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'ativa' | 'inativa'>('todas')
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'fluxos' | 'quizzes' | 'templates'>('todos')
  const [loading, setLoading] = useState(true)
  const [ferramentaExcluindoId, setFerramentaExcluindoId] = useState<string | null>(null)
  const [ferramentaDuplicandoId, setFerramentaDuplicandoId] = useState<string | null>(null)
  const [previewFerramentaId, setPreviewFerramentaId] = useState<string | null>(null)
  const [previewFerramenta, setPreviewFerramenta] = useState<Ferramenta | null>(null)

  // Carregar ferramentas do banco de dados
  useEffect(() => {
    carregarFerramentas()
  }, [])

  const carregarFerramentas = async () => {
    try {
      setLoading(true)

      const response = await fetch(
        `/api/nutri/ferramentas?profession=nutri`,
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
        // Determinar categoria e tipo
        let categoria = 'Planilha'
        let tipo: 'fluxos' | 'quizzes' | 'templates' = 'fluxos'
        
        if (tool.is_quiz || tool.template_slug === 'quiz-personalizado') {
          categoria = 'Quiz Personalizado'
          tipo = 'quizzes'
        } else if (tool.template_slug?.startsWith('calc-')) {
          categoria = 'Calculadora'
          tipo = 'templates'
        } else if (tool.template_slug?.startsWith('quiz-')) {
          categoria = 'Quiz'
          tipo = 'quizzes'
        } else if (tool.template_slug?.startsWith('template-')) {
          categoria = 'Template'
          tipo = 'templates'
        } else {
          tipo = 'fluxos'
        }

        // Construir URL - quizzes personalizados usam rota diferente
        let url = ''
        if (tool.is_quiz || tool.template_slug === 'quiz-personalizado') {
          // URL para quiz personalizado: /pt/nutri/{user-slug}/quiz/{slug}
          if (tool.user_profiles?.user_slug) {
            const baseUrl = typeof window !== 'undefined' ? window.location.protocol + '//' + window.location.host : 'https://ylada.app'
            url = `${baseUrl}/pt/nutri/${tool.user_profiles.user_slug}/quiz/${tool.slug}`
          } else {
            url = buildNutriToolUrlFallback(tool.id)
          }
        } else {
          // URL padrão para outras ferramentas
          url = tool.user_profiles?.user_slug 
            ? buildNutriToolUrl(tool.user_profiles.user_slug, tool.slug)
            : buildNutriToolUrlFallback(tool.id)
        }

        return {
          id: tool.id,
          nome: tool.title,
          categoria: categoria,
          tipo: tipo,
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
      const response = await fetch(`/api/nutri/ferramentas?id=${id}`, {
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

  const duplicarFerramenta = async (ferramenta: Ferramenta) => {
    try {
      setFerramentaDuplicandoId(ferramenta.id)
      
      // Buscar dados completos da ferramenta
      const response = await fetch(`/api/nutri/ferramentas?id=${ferramenta.id}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar dados da ferramenta')
      }

      const data = await response.json()
      const toolData = data.tool

      if (!toolData) {
        throw new Error('Ferramenta não encontrada')
      }

      // Criar nova ferramenta com dados duplicados
      const newSlug = `${toolData.slug}-copia-${Date.now()}`
      const newTitle = `${toolData.title} (Cópia)`

      const duplicateResponse = await fetch('/api/nutri/ferramentas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          template_slug: toolData.template_slug,
          title: newTitle,
          description: toolData.description,
          slug: newSlug,
          emoji: toolData.emoji,
          custom_colors: toolData.custom_colors,
          cta_type: toolData.cta_type,
          external_url: toolData.external_url,
          cta_button_text: toolData.cta_button_text,
          custom_whatsapp_message: toolData.custom_whatsapp_message,
          content: toolData.content,
          profession: 'nutri'
        })
      })

      if (!duplicateResponse.ok) {
        const errorData = await duplicateResponse.json().catch(() => ({}))
        throw new Error(errorData.error || 'Erro ao duplicar ferramenta')
      }

      // Recarregar lista
      await carregarFerramentas()
      alert('Ferramenta duplicada com sucesso!')
    } catch (error: any) {
      console.error('Erro ao duplicar ferramenta:', error)
      alert(error.message || 'Erro ao duplicar ferramenta. Tente novamente.')
    } finally {
      setFerramentaDuplicandoId(null)
    }
  }

  const abrirPreview = async (ferramenta: Ferramenta) => {
    setPreviewFerramenta(ferramenta)
    setPreviewFerramentaId(ferramenta.id)
  }

  const stats = {
    totalFerramentas: ferramentas.length,
    ferramentasAtivas: ferramentas.filter(f => f.status === 'ativa').length,
    totalLeads: ferramentas.reduce((sum, f) => sum + f.leads, 0),
    taxaConversaoMedia: ferramentas.length > 0 
      ? ferramentas.reduce((sum, f) => sum + f.conversao, 0) / ferramentas.length 
      : 0
  }

  const ferramentasFiltradas = ferramentas.filter(ferramenta => {
    const statusMatch = filtroStatus === 'todas' || ferramenta.status === filtroStatus
    const tipoMatch = filtroTipo === 'todos' || ferramenta.tipo === filtroTipo
    return statusMatch && tipoMatch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <NutriNavBar showTitle={true} title="Meus Links" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vídeo 3 — Ferramentas YLADA */}
        <div className="mb-8">
          <VideoPlayerYLADA
            videoUrl={process.env.NEXT_PUBLIC_VIDEO_FERRAMENTAS_YLADA}
            title="Ferramentas YLADA — Guia Completo"
            description="Aprenda a usar todas as ferramentas de captação e atendimento do YLADA."
          />
        </div>

        {/* Atalhos Rápidos - Apenas Quiz Personalizado */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Criar Nova Ferramenta</h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 max-w-md">
            <Link
              href="/pt/nutri/quiz-personalizado"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg transition-colors font-medium text-center shadow-sm"
            >
              Criar Quiz Personalizado
            </Link>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              💡 <strong>Nota:</strong> As ferramentas pré-definidas (calculadoras, templates) já estão prontas para uso com links fixos. 
              Você pode criar apenas Quizzes personalizados para customizar completamente.
            </p>
          </div>
        </div>

        {/* Filtros por Tipo */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Filtrar por Tipo</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFiltroTipo('todos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === 'todos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroTipo('fluxos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === 'fluxos'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
              }`}
            >
              Fluxos
            </button>
            <button
              onClick={() => setFiltroTipo('quizzes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === 'quizzes'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
              }`}
            >
              Quizzes
            </button>
            <button
              onClick={() => setFiltroTipo('templates')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === 'templates'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
              }`}
            >
              Templates
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
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

        {/* Filtros e Botão Criar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFiltroStatus('todas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'todas'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltroStatus('ativa')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'ativa'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
              }`}
            >
              Ativas
            </button>
            <button
              onClick={() => setFiltroStatus('inativa')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroStatus === 'inativa'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-300'
              }`}
            >
              Inativas
            </button>
          </div>
          
          <Link
            href="/pt/nutri/ferramentas/nova"
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
          >
            <span>➕</span>
            Criar Link
          </Link>
        </div>

        {/* Lista de Ferramentas */}
        {loading ? (
          <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
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
              href="/pt/nutri/ferramentas/nova"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Novo Link
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ferramentasFiltradas.map((ferramenta) => (
              <div
                key={ferramenta.id}
                className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
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
                      <p className="text-xl font-bold text-blue-600">{ferramenta.leads}</p>
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
                          className="text-xs text-blue-600 hover:text-blue-700 underline"
                        >
                          Copiar
                        </button>
                      </div>
                      {/* Link Curto e Código - sempre mostrar se existir */}
                      {ferramenta.shortCode ? (
                        <>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500">Código Curto:</span>
                            <span className="text-xs text-purple-600 font-mono font-bold">
                              {ferramenta.shortCode}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(ferramenta.shortCode || '')
                                alert('Código copiado!')
                              }}
                              className="text-xs text-blue-600 hover:text-blue-700 underline"
                            >
                              Copiar
                            </button>
                          </div>
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
                              className="text-xs text-blue-600 hover:text-blue-700 underline"
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
                      ) : (
                        <div className="text-xs text-gray-400 italic mb-2">
                          Sem link curto configurado
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col space-y-2 ml-4 text-right sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 sm:text-left">
                      {/* Botão Pré-visualizar */}
                      <button
                        onClick={() => abrirPreview(ferramenta)}
                        className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                      >
                        👁️ Pré-visualizar
                      </button>
                      
                      {/* Botão Duplicar */}
                      <button
                        onClick={() => duplicarFerramenta(ferramenta)}
                        disabled={ferramentaDuplicandoId === ferramenta.id}
                        className="text-sm text-green-600 hover:text-green-800 font-medium disabled:opacity-50"
                      >
                        {ferramentaDuplicandoId === ferramenta.id ? 'Duplicando...' : '📋 Duplicar'}
                      </button>

                      {/* Botão Abrir no GSAL - apenas para fluxos e quizzes */}
                      {(ferramenta.tipo === 'fluxos' || ferramenta.tipo === 'quizzes') && (
                        <Link
                          href={`/pt/nutri/gsal?attachTool=${ferramenta.id}`}
                          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800 font-medium"
                        >
                          <span>📊</span>
                          <span>Abrir no GSAL</span>
                        </Link>
                      )}
                      <Link
                        href={ferramenta.url}
                        target="_blank"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Ver Link →
                      </Link>
                      {/* Botão Editar - apenas para Quiz Personalizado */}
                      {ferramenta.categoria === 'Quiz Personalizado' ? (
                        <Link
                          href={`/pt/nutri/ferramentas/${ferramenta.id}/editar`}
                          className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                        >
                          Editar
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400 italic">
                          Link fixo (não editável)
                        </span>
                      )}
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

      {/* Modal de Pré-visualização */}
      {previewFerramenta && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setPreviewFerramenta(null)
            setPreviewFerramentaId(null)
          }}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pré-visualização</h3>
                <p className="text-sm text-gray-600">{previewFerramenta.nome}</p>
              </div>
              <button
                onClick={() => {
                  setPreviewFerramenta(null)
                  setPreviewFerramentaId(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                <div className="text-center mb-4">
                  {previewFerramenta.cores && (
                    <div 
                      className="w-16 h-16 rounded-lg mx-auto mb-4 flex items-center justify-center text-2xl"
                      style={{ backgroundColor: previewFerramenta.cores.primaria || '#3B82F6' }}
                    >
                      🎯
                    </div>
                  )}
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{previewFerramenta.nome}</h4>
                  <p className="text-sm text-gray-600 mb-4">{previewFerramenta.objetivo}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-4">
                    Esta é uma pré-visualização da estrutura. Para ver a ferramenta completa, use "Ver Link".
                  </p>
                  <Link
                    href={previewFerramenta.url}
                    target="_blank"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Ver Ferramenta Completa →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}