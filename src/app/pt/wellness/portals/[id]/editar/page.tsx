'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import { useAuth } from '@/hooks/useAuth'

interface Tool {
  id: string
  title: string
  slug: string
  template_slug: string
  description: string
  emoji: string
}

export default function EditarPortalWellness() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <EditarPortalWellnessContent />
    </ProtectedRoute>
  )
}

function EditarPortalWellnessContent() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const portalId = params?.id as string
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [tools, setTools] = useState<Tool[]>([])
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [userSlug, setUserSlug] = useState<string | null>(null)
  const [carregandoSlug, setCarregandoSlug] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    navigation_type: 'menu' as 'menu' | 'sequential',
    header_text: '',
    footer_text: ''
  })
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null)
  const [checkingSlug, setCheckingSlug] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (portalId) {
      carregarPortal()
      carregarFerramentas()
      carregarUserSlug()
    }
  }, [portalId])

  const carregarUserSlug = async () => {
    try {
      setCarregandoSlug(true)
      const response = await fetch('/api/wellness/profile', {
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

  const carregarFerramentas = async () => {
    try {
      const response = await fetch('/api/wellness/ferramentas', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setTools(data.tools || [])
      }
    } catch (error) {
      console.error('Erro ao carregar ferramentas:', error)
    }
  }

  const carregarPortal = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/wellness/portals?id=${portalId}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar portal')
      }

      const data = await response.json()
      const portal = data.data?.portal || data.portal

      if (portal) {
        setFormData({
          name: portal.name || '',
          slug: portal.slug || '',
          description: portal.description || '',
          navigation_type: portal.navigation_type || 'menu',
          header_text: portal.header_text || '',
          footer_text: portal.footer_text || ''
        })

        // Carregar ferramentas do portal
        const toolsResponse = await fetch(`/api/wellness/portals/${portalId}/tools`, {
          credentials: 'include'
        })
        
        if (toolsResponse.ok) {
          const toolsData = await toolsResponse.json()
          const portalTools = toolsData.data?.tools || toolsData.tools || []
          setSelectedTools(portalTools.map((pt: any) => pt.tool_id || pt.tool?.id).filter(Boolean))
        }
      }
    } catch (err: any) {
      console.error('Erro ao carregar portal:', err)
      setError('Erro ao carregar portal. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const gerarSlug = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const verificarSlug = async (slug: string) => {
    if (!slug) {
      setSlugAvailable(null)
      return
    }

    setCheckingSlug(true)
    try {
      const response = await fetch(`/api/wellness/portals/check-slug?slug=${encodeURIComponent(slug)}&excludeId=${portalId}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setSlugAvailable(data.available)
      } else {
        setSlugAvailable(false)
      }
    } catch (error) {
      console.error('Erro ao verificar slug:', error)
      setSlugAvailable(false)
    } finally {
      setCheckingSlug(false)
    }
  }

  const handleNameChange = (name: string) => {
    setFormData({ ...formData, name })
    const slug = gerarSlug(name)
    setFormData(prev => ({ ...prev, slug }))
    verificarSlug(slug)
  }

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.slug) {
      alert('Nome e slug são obrigatórios')
      return
    }

    if (selectedTools.length === 0) {
      alert('Selecione pelo menos uma ferramenta')
      return
    }

    if (slugAvailable === false) {
      alert('Este nome de URL já está em uso. Escolha outro.')
      return
    }

    setSaving(true)
    setError(null)

    try {
      // Atualizar portal
      const portalResponse = await fetch('/api/wellness/portals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          id: portalId,
          ...formData
        }),
      })

      if (!portalResponse.ok) {
        const errorData = await portalResponse.json()
        throw new Error(errorData.error || 'Erro ao atualizar portal')
      }

      // Atualizar ferramentas do portal
      await fetch(`/api/wellness/portals/${portalId}/tools`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          tools: selectedTools.map((toolId, index) => ({
            tool_id: toolId,
            position: index + 1,
            is_required: false
          }))
        }),
      })

      alert('Portal atualizado com sucesso!')
      router.push('/pt/wellness/portals')
    } catch (err: any) {
      console.error('Erro ao atualizar portal:', err)
      setError(err.message || 'Erro ao atualizar portal. Tente novamente.')
    } finally {
      setSaving(false)
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="Editar Portal de Bem-Estar" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome e Slug */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Portal <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL do Portal <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {typeof window !== 'undefined' ? window.location.hostname : 'ylada.app'}/pt/wellness/
                    {userSlug ? (
                      <span className="text-green-600 font-semibold">{userSlug}</span>
                    ) : (
                      <span className="text-gray-400">[configure]</span>
                    )}
                    /portal/
                  </span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      const slug = gerarSlug(e.target.value)
                      setFormData(prev => ({ ...prev, slug }))
                      verificarSlug(slug)
                    }}
                    required
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                {checkingSlug ? (
                  <p className="text-xs text-gray-500 mt-1">Verificando...</p>
                ) : slugAvailable === true ? (
                  <p className="text-xs text-green-600 mt-1">✓ Disponível</p>
                ) : slugAvailable === false ? (
                  <p className="text-xs text-red-600 mt-1">✗ Já em uso</p>
                ) : null}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Tipo de Navegação */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tipo de Navegação</h2>
            <select
              value={formData.navigation_type}
              onChange={(e) => setFormData({ ...formData, navigation_type: e.target.value as 'menu' | 'sequential' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="menu">Menu (usuário escolhe a ordem)</option>
              <option value="sequential">Sequencial (ordem fixa)</option>
            </select>
          </div>

          {/* Textos Personalizados */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Textos Personalizados (Opcional)</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto do Cabeçalho
                </label>
                <input
                  type="text"
                  value={formData.header_text}
                  onChange={(e) => setFormData({ ...formData, header_text: e.target.value })}
                  placeholder="Ex: Bem-vindo ao meu portal!"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Texto do Rodapé
                </label>
                <input
                  type="text"
                  value={formData.footer_text}
                  onChange={(e) => setFormData({ ...formData, footer_text: e.target.value })}
                  placeholder="Ex: Entre em contato para mais informações"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Seleção de Ferramentas */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Selecionar Ferramentas ({selectedTools.length} selecionadas)
            </h2>

            {/* Nota informativa discreta */}
            <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
              <p className="text-sm text-blue-700">
                <span className="font-medium">ℹ️ Informação:</span> As ferramentas disponíveis são apenas as que você criou. 
                Para adicionar mais ferramentas ao portal,{' '}
                <Link href="/pt/wellness/ferramentas/nova" className="text-blue-600 hover:underline font-medium">
                  crie-as individualmente primeiro
                </Link>.
              </p>
            </div>

            {tools.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhuma ferramenta encontrada. Crie ferramentas primeiro em{' '}
                <Link href="/pt/wellness/ferramentas/nova" className="text-green-600 hover:underline">
                  Ferramentas → Nova
                </Link>
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {tools.map((tool) => (
                  <label
                    key={tool.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTools.includes(tool.id)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedTools.includes(tool.id)}
                      onChange={() => toggleTool(tool.id)}
                      className="mr-3"
                    />
                    <span className="text-xl mr-2">{tool.emoji || '🔧'}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{tool.title}</p>
                      <p className="text-xs text-gray-500">{tool.template_slug}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Botões */}
          <div className="flex justify-end space-x-3">
            <Link
              href="/pt/wellness/portals"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={saving || slugAvailable === false || selectedTools.length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

