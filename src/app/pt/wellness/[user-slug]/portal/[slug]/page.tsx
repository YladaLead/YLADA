'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface PortalTool {
  id: string
  tool_id: string
  position: number
  is_required: boolean
  redirect_to_tool_id?: string
  tool: {
    id: string
    title: string
    slug: string
    template_slug: string
    emoji: string
    description: string
    custom_colors?: {
      principal: string
      secundaria: string
    }
    user_profiles?: {
      user_slug: string
    }
  }
}

interface Portal {
  id: string
  name: string
  slug: string
  description: string
  navigation_type: 'sequential' | 'menu'
  custom_colors: {
    primary: string
    secondary: string
  }
  header_text?: string
  footer_text?: string
  tools: PortalTool[]
}

export default function PortalPublicPageWithUserSlug() {
  const params = useParams()
  const router = useRouter()
  const userSlug = params?.['user-slug'] as string
  const slug = params?.slug as string

  const [portal, setPortal] = useState<Portal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [completedTools, setCompletedTools] = useState<Set<string>>(new Set())
  const [justCompletedToolId, setJustCompletedToolId] = useState<string | null>(null)

  // Função para obter chave do localStorage para este portal
  const getPortalProgressKey = (portalId: string) => {
    return `portal_progress_${portalId}`
  }

  // Carregar progresso salvo do localStorage
  const loadProgress = (portalId: string) => {
    if (typeof window === 'undefined') return new Set<string>()
    
    try {
      const saved = localStorage.getItem(getPortalProgressKey(portalId))
      if (saved) {
        const completed = JSON.parse(saved) as string[]
        return new Set(completed)
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error)
    }
    return new Set<string>()
  }

  // Salvar progresso no localStorage
  const saveProgress = (portalId: string, toolIds: Set<string>) => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(
        getPortalProgressKey(portalId),
        JSON.stringify(Array.from(toolIds))
      )
    } catch (error) {
      console.error('Erro ao salvar progresso:', error)
    }
  }

  // Marcar ferramenta como completada
  const markToolAsCompleted = (toolId: string) => {
    if (!portal) return
    
    const newCompleted = new Set(completedTools)
    newCompleted.add(toolId)
    setCompletedTools(newCompleted)
    saveProgress(portal.id, newCompleted)
  }

  // Verificar se ferramenta está liberada (primeira sempre liberada, demais só se anterior foi completada)
  const isToolUnlocked = (toolIndex: number, toolId: string): boolean => {
    if (toolIndex === 0) return true // Primeira sempre liberada
    
    // Verificar se a ferramenta anterior foi completada
    const previousTool = portal?.tools[toolIndex - 1]
    if (!previousTool) return false
    
    return completedTools.has(previousTool.tool_id)
  }

  useEffect(() => {
    if (slug) {
      carregarPortal()
    }
  }, [slug])

  // Carregar progresso quando portal for carregado
  useEffect(() => {
    if (portal) {
      const savedProgress = loadProgress(portal.id)
      setCompletedTools(savedProgress)
    }
  }, [portal?.id])

  // Verificar se voltou de uma ferramenta (via URL params)
  useEffect(() => {
    if (typeof window === 'undefined' || !portal) return

    const urlParams = new URLSearchParams(window.location.search)
    const completedToolId = urlParams.get('completed_tool_id')
    const portalId = urlParams.get('portal_id')

    if (completedToolId && portalId === portal.id) {
      // Marcar ferramenta como completada
      const newCompleted = new Set(completedTools)
      newCompleted.add(completedToolId)
      setCompletedTools(newCompleted)
      saveProgress(portal.id, newCompleted)
      
      // Marcar que acabou de completar esta ferramenta (para mostrar banner)
      setJustCompletedToolId(completedToolId)
      
      // Limpar URL params
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
      
      // Scroll para o topo para ver o banner
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [portal?.id, portal, completedTools])

  const carregarPortal = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/wellness/portals/by-slug/${slug}`)

      if (!response.ok) {
        if (response.status === 404) {
          setError('Portal não encontrado ou inativo')
        } else {
          setError('Erro ao carregar portal')
        }
        setLoading(false)
        return
      }

      const data = await response.json()
      setPortal(data.data?.portal || null)
    } catch (err: any) {
      console.error('Erro ao carregar portal:', err)
      setError('Erro ao carregar portal')
    } finally {
      setLoading(false)
    }
  }

  const getToolUrl = (tool: PortalTool) => {
    if (tool.tool.user_profiles?.user_slug) {
      return `/pt/wellness/${tool.tool.user_profiles.user_slug}/${tool.tool.slug}`
    }
    return `/pt/wellness/ferramenta/${tool.tool.id}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando portal...</p>
        </div>
      </div>
    )
  }

  if (error || !portal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Portal não encontrado</h1>
          <p className="text-gray-600 mb-6">{error || 'O portal que você está procurando não existe ou foi removido.'}</p>
          <Link
            href="/pt/wellness"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    )
  }

  const primaryColor = portal.custom_colors?.primary || '#10B981'
  const secondaryColor = portal.custom_colors?.secondary || '#059669'

  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: `${primaryColor}15` }}
    >
      {/* Header do Portal */}
      {portal.header_text && (
        <div 
          className="text-center py-4 px-4"
          style={{ backgroundColor: primaryColor, color: 'white' }}
        >
          <p className="text-sm font-medium">{portal.header_text}</p>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Banner de Sucesso - Mostrar quando completar uma ferramenta no modo sequencial */}
        {justCompletedToolId && portal.navigation_type === 'sequential' && (() => {
          const completedIndex = portal.tools.findIndex(t => t.tool_id === justCompletedToolId)
          const nextTool = completedIndex >= 0 && completedIndex < portal.tools.length - 1 
            ? portal.tools[completedIndex + 1] 
            : null
          const completedTool = portal.tools[completedIndex]
          
          return (
            <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl p-6 shadow-lg">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-green-900 mb-2">
                    ✅ {completedTool?.tool.title || 'Etapa'} concluída com sucesso!
                  </h3>
                  {nextTool && isToolUnlocked(completedIndex + 1, nextTool.tool_id) ? (
                    <div>
                      <p className="text-sm text-green-700 mb-4">
                        Parabéns! Agora você pode continuar para a próxima etapa.
                      </p>
                      <Link
                        href={`${getToolUrl(nextTool)}?portal_id=${portal.id}&tool_id=${nextTool.tool_id}&return_to=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                        onClick={() => setJustCompletedToolId(null)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors shadow-md"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <span>➡️</span>
                        <span>Continuar para: {nextTool.tool.title}</span>
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-green-700 mb-4">
                        🎉 Parabéns! Você completou todas as etapas do portal!
                      </p>
                      <button
                        onClick={() => setJustCompletedToolId(null)}
                        className="text-sm text-green-700 hover:text-green-900 font-medium underline"
                      >
                        Fechar
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setJustCompletedToolId(null)}
                  className="flex-shrink-0 text-green-600 hover:text-green-800 text-xl font-bold leading-none"
                  aria-label="Fechar"
                >
                  ×
                </button>
              </div>
            </div>
          )
        })()}

        {/* Título e Descrição */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{portal.name}</h1>
          {portal.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{portal.description}</p>
          )}
        </div>

        {/* Ferramentas */}
        {portal.tools.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
            <p className="text-gray-600">Este portal ainda não possui ferramentas.</p>
          </div>
        ) : portal.navigation_type === 'sequential' ? (
          // Navegação Sequencial (ordem forçada)
          <div className="space-y-6">
            {portal.tools.map((tool, index) => {
              const isUnlocked = isToolUnlocked(index, tool.tool_id)
              const isCompleted = completedTools.has(tool.tool_id)
              const isLocked = !isUnlocked

              return (
                <div
                  key={tool.id}
                  className={`bg-white rounded-lg p-6 shadow-sm border transition-all ${
                    isLocked
                      ? 'border-gray-300 opacity-60 cursor-not-allowed'
                      : isCompleted
                      ? 'border-green-300 hover:shadow-md'
                      : 'border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                          isLocked ? 'bg-gray-200' : isCompleted ? 'bg-green-100' : ''
                        }`}
                        style={!isLocked && !isCompleted ? { backgroundColor: `${primaryColor}20` } : {}}
                      >
                        {isLocked ? '🔒' : isCompleted ? '✅' : tool.tool.emoji || '🔧'}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                              {index + 1}
                            </div>
                            <h3 className={`text-xl font-semibold ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                              {tool.tool.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">
                              {index === 0 ? '1ª Etapa' : index === 1 ? '2ª Etapa' : index === 2 ? '3ª Etapa' : `${index + 1}ª Etapa`}
                            </span>
                            {isCompleted && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                Concluído
                              </span>
                            )}
                            {isLocked && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                                Bloqueado
                              </span>
                            )}
                          </div>
                        </div>
                        {tool.tool.description && (
                          <p className={`text-sm mt-1 ${isLocked ? 'text-gray-400' : 'text-gray-600'}`}>
                            {tool.tool.description}
                          </p>
                        )}
                        {isLocked && index > 0 && (
                          <p className="text-xs text-gray-500 mt-2 italic">
                            Complete a etapa anterior para desbloquear
                          </p>
                        )}
                      </div>
                    </div>
                    {isLocked ? (
                      <button
                        disabled
                        className="px-6 py-2 rounded-lg text-gray-400 font-medium bg-gray-100 cursor-not-allowed"
                      >
                        Bloqueado
                      </button>
                    ) : (
                      <Link
                        href={`${getToolUrl(tool)}?portal_id=${portal.id}&tool_id=${tool.tool_id}&return_to=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''}`}
                        className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {isCompleted ? 'Refazer' : index === 0 ? 'Começar' : 'Continuar'}
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          // Navegação em Menu
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portal.tools.map((tool) => (
              <Link
                key={tool.id}
                href={getToolUrl(tool)}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all transform hover:-translate-y-1"
              >
                <div className="flex items-start space-x-4">
                  <div 
                    className="w-16 h-16 rounded-lg flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ backgroundColor: `${primaryColor}20` }}
                  >
                    {tool.tool.emoji || '🔧'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{tool.tool.title}</h3>
                    {tool.tool.description && (
                      <p className="text-sm text-gray-600 mb-4">{tool.tool.description}</p>
                    )}
                    <span 
                      className="inline-block text-sm font-medium px-4 py-2 rounded-lg text-white"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Acessar →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Footer do Portal */}
      {portal.footer_text && (
        <div 
          className="mt-12 text-center py-6 px-4"
          style={{ backgroundColor: `${primaryColor}10` }}
        >
          <p className="text-sm text-gray-700">{portal.footer_text}</p>
        </div>
      )}
    </div>
  )
}

