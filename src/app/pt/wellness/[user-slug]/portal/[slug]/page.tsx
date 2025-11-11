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

  useEffect(() => {
    if (slug) {
      carregarPortal()
    }
  }, [slug])

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
          // Navegação Sequencial
          <div className="space-y-6">
            {portal.tools.map((tool, index) => (
              <div
                key={tool.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${primaryColor}20` }}
                    >
                      {tool.tool.emoji || '🔧'}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{tool.tool.title}</h3>
                      {tool.tool.description && (
                        <p className="text-sm text-gray-600 mt-1">{tool.tool.description}</p>
                      )}
                    </div>
                  </div>
                  <Link
                    href={getToolUrl(tool)}
                    className="px-6 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {index === 0 ? 'Começar' : 'Continuar'}
                  </Link>
                </div>
              </div>
            ))}
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

