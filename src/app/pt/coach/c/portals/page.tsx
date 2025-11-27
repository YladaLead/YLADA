'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CoachNavBar from '@/components/coach/CoachNavBar'
import QRCode from '@/components/QRCode'

interface Portal {
  id: string
  name: string
  slug: string
  description: string
  status: string
  views: number
  navigation_type: 'sequential' | 'menu'
  created_at: string
  tools_count: number
  short_code?: string | null
}

export default function PortalsCoach() {
  // Renderizar diretamente sem verificação prévia - deixar a API tratar autenticação
  return <PortalsCoachContent />
}

function PortalsCoachContent() {
  const [portals, setPortals] = useState<Portal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userSlug, setUserSlug] = useState<string | null>(null)
  const [carregandoSlug, setCarregandoSlug] = useState(true)

  useEffect(() => {
    // Carregar portais diretamente - a API vai verificar autenticação
    carregarPortais()
    carregarUserSlug()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const carregarUserSlug = async () => {
    try {
      setCarregandoSlug(true)
      // TODO: Criar API /api/c/profile quando necessário
      // Por enquanto, usar wellness como fallback ou criar API genérica
      const response = await fetch('/api/coach/profile', {
        credentials: 'include'
      })
      if (response.ok) {
        const data = await response.json()
        if (data.profile?.userSlug) {
          setUserSlug(data.profile.userSlug)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar user_slug:', error)
    } finally {
      setCarregandoSlug(false)
    }
  }

  const carregarPortais = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/c/portals', {
        credentials: 'include',
        cache: 'no-store'
      })

      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({ error: 'Não autenticado' }))
        setError(`Erro 401: ${errorData.error || 'Não autenticado. Faça login novamente.'}`)
        setLoading(false)
        // Não redirecionar automaticamente - deixar usuário ver o erro
        return
      }

      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({ error: 'Acesso negado' }))
        setError(`Erro 403: ${errorData.error || 'Você não tem permissão para acessar esta área. Verifique seu perfil Coach.'}`)
        setLoading(false)
        return
      }

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: `Erro ${response.status}: ${response.statusText}` }
        }
        
        // Mostrar erro específico se disponível
        const errorMessage = errorData.error || errorData.message || `Erro ${response.status}`
        setError(`Erro ${response.status}: ${errorMessage}`)
        setLoading(false)
        console.error('Erro na API:', { status: response.status, error: errorData })
        return
      }

      const data = await response.json()
      
      // Verificar se a resposta tem o formato esperado
      if (!data.success && !data.data) {
        setError('Resposta inválida do servidor')
        setLoading(false)
        return
      }

      const portalsData = (data.data?.portals || []).map((portal: any) => ({
        id: portal.id,
        name: portal.name,
        slug: portal.slug,
        description: portal.description || '',
        status: portal.status,
        views: portal.views || 0,
        navigation_type: portal.navigation_type || 'menu',
        created_at: portal.created_at,
        tools_count: portal.portal_tools?.length || 0,
        short_code: portal.short_code || null
      }))

      setPortals(portalsData)
    } catch (err: any) {
      console.error('Erro ao carregar portais:', err)
      setError(`Erro ao carregar portais: ${err.message || 'Erro desconhecido'}`)
    } finally {
      setLoading(false)
    }
  }

  const deletarPortal = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este portal?')) {
      return
    }

    try {
      const response = await fetch(`/api/c/portals?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar portal')
      }

      carregarPortais()
    } catch (err: any) {
      console.error('Erro ao deletar portal:', err)
      alert('Erro ao deletar portal')
    }
  }

  const stats = {
    total: portals.length,
    ativos: portals.filter(p => p.status === 'active').length,
    totalViews: portals.reduce((sum, p) => sum + p.views, 0),
    totalTools: portals.reduce((sum, p) => sum + p.tools_count, 0)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CoachNavBar showTitle={true} title="Portal do Bem-Estar" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Total de Portais</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Portais Ativos</p>
            <p className="text-2xl font-bold text-green-600">{stats.ativos}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Total de Visualizações</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalViews}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Ferramentas nos Portais</p>
            <p className="text-2xl font-bold text-purple-600">{stats.totalTools}</p>
          </div>
        </div>

        {/* Aviso de configuração de slug */}
        {!carregandoSlug && !userSlug && (
          <div className="mb-6 bg-yellow-50 border border-yellow-300 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-yellow-800 mb-2">
                  ⚠️ <strong>Configure seu slug pessoal</strong> para personalizar as URLs dos seus portais
                </p>
                <p className="text-xs text-yellow-700 mb-3">
                  Sem o slug configurado, suas URLs não serão personalizadas. Configure agora para ter URLs como: <span className="font-mono">ylada.app/pt/c/[seu-slug]/portal/[nome-portal]</span>
                </p>
                <Link
                  href="/pt/coach/configuracao"
                  className="inline-block text-sm text-yellow-900 underline hover:text-yellow-700 font-medium"
                >
                  Ir para Configurações →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Meus Portais</h2>
            <p className="text-sm text-gray-600">Gerencie todos os seus portais do bem-estar</p>
          </div>
          <Link
            href="/pt/coach/portals/novo"
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 shadow-lg font-medium"
          >
            + Criar Novo Link
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold mb-2">⚠️ Erro ao acessar portais:</p>
            <p className="mb-3">{error}</p>
            <div className="mt-3 flex space-x-3">
              <button
                onClick={() => window.location.href = '/pt/coach/login'}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Fazer Login
              </button>
              <button
                onClick={carregarPortais}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Carregando portais...</p>
          </div>
        )}

        {/* Portals List */}
        {!loading && portals.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm border border-gray-200">
            <p className="text-gray-600 mb-4">Você ainda não criou nenhum portal.</p>
            <Link
              href="/pt/coach/portals/novo"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Criar Primeiro Portal
            </Link>
          </div>
        )}

        {/* Portals Grid */}
        {!loading && portals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portals.map((portal) => (
              <div
                key={portal.id}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{portal.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{portal.description || 'Sem descrição'}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded ${
                        portal.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {portal.status === 'active' ? 'Ativo' : 'Inativo'}
                      </span>
                      <span>•</span>
                      <span>{portal.navigation_type === 'sequential' ? 'Sequencial' : 'Menu'}</span>
                      <span>•</span>
                      <span>{portal.tools_count} ferramentas</span>
                    </div>
                  </div>
                </div>

                {/* URL do Portal */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">URL do Portal:</p>
                  {carregandoSlug ? (
                    <div className="animate-pulse bg-gray-200 h-4 w-full rounded"></div>
                  ) : userSlug ? (
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="text-xs text-gray-600 font-mono break-all">
                        {typeof window !== 'undefined' ? window.location.hostname : 'ylada.app'}/pt/c/<span className="text-purple-600 font-semibold">{userSlug}</span>/portal/{portal.slug}
                      </span>
                      <button
                        onClick={() => {
                          const url = `${window.location.origin}/pt/c/${userSlug}/portal/${portal.slug}`
                          navigator.clipboard.writeText(url)
                          alert('URL copiada!')
                        }}
                        className="text-xs text-purple-600 hover:text-purple-700 underline"
                      >
                        Copiar
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-400">
                      <span className="font-mono">ylada.app/pt/c/[configure]/portal/{portal.slug}</span>
                      <Link href="/pt/coach/configuracoes" className="text-purple-600 hover:text-purple-700 underline ml-1">
                        Configurar
                      </Link>
                    </div>
                  )}
                  {portal.short_code && (
                    <>
                      <div className="flex items-center gap-1 flex-wrap mt-2">
                        <span className="text-xs text-gray-500">URL Encurtada:</span>
                        <span className="text-xs text-purple-600 font-mono break-all">
                          {typeof window !== 'undefined' ? window.location.origin : 'https://ylada.app'}/p/{portal.short_code}
                        </span>
                        <button
                          onClick={() => {
                            const shortUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://ylada.app'}/p/${portal.short_code}`
                            navigator.clipboard.writeText(shortUrl)
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
                          url={`${typeof window !== 'undefined' ? window.location.origin : 'https://ylada.app'}/p/${portal.short_code}`}
                          size={120}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    {portal.views} visualizações
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href={userSlug ? `/pt/c/${userSlug}/portal/${portal.slug}` : `/pt/c/portal/${portal.slug}`}
                      target="_blank"
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      Ver
                    </Link>
                    <Link
                      href={`/pt/coach/c/portals/${portal.id}/editar`}
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => deletarPortal(portal.id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Deletar
                    </button>
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



