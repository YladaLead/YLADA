'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/hooks/useAuth'

interface Tool {
  id: string
  title: string
  slug: string
  template_slug: string
  description: string
  emoji: string
}

export default function NovoPortalWellness() {
  return (
    <ProtectedRoute perfil="wellness">
      <NovoPortalWellnessContent />
    </ProtectedRoute>
  )
}

function NovoPortalWellnessContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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

  useEffect(() => {
    carregarFerramentas()
    carregarUserSlug()
  }, [])

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

  const gerarSlug = (nome: string) => {
    return nome
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-') // Substitui tudo que não é letra/número por hífen
      .replace(/-+/g, '-') // Remove múltiplos hífens seguidos
      .replace(/^-+|-+$/g, '') // Remove hífens do início e fim
  }

  const verificarSlug = async (slug: string) => {
    if (!slug) {
      setSlugAvailable(null)
      return
    }

    setCheckingSlug(true)
    try {
      const response = await fetch(`/api/wellness/portals?slug=${slug}`, {
        credentials: 'include'
      })

      if (response.status === 404) {
        setSlugAvailable(true)
      } else {
        setSlugAvailable(false)
      }
    } catch (error) {
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

    setLoading(true)

    try {
      // Criar portal
      const portalResponse = await fetch('/api/wellness/portals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          description: formData.description,
          navigation_type: formData.navigation_type,
          header_text: formData.header_text,
          footer_text: formData.footer_text,
          tools_order: selectedTools
        })
      })

      if (!portalResponse.ok) {
        const error = await portalResponse.json()
        throw new Error(error.error || 'Erro ao criar portal')
      }

      const portalData = await portalResponse.json()
      const portalId = portalData.data?.portal?.id

      if (!portalId) {
        throw new Error('Portal criado mas ID não retornado')
      }

      // Adicionar ferramentas ao portal
      for (let i = 0; i < selectedTools.length; i++) {
        const toolId = selectedTools[i]
        await fetch(`/api/wellness/portals/${portalId}/tools`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            tool_id: toolId,
            position: i + 1,
            is_required: false
          })
        })
      }

      alert('Portal criado com sucesso!')
      router.push('/pt/wellness/portals')
    } catch (error: any) {
      console.error('Erro ao criar portal:', error)
      alert(error.message || 'Erro ao criar portal')
    } finally {
      setLoading(false)
    }
  }

  const toggleTool = (toolId: string) => {
    setSelectedTools(prev =>
      prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/pt/wellness/dashboard">
                <Image
                  src="/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png"
                  alt="YLADA"
                  width={280}
                  height={84}
                  className="h-10 w-auto"
                />
              </Link>
              <div className="h-8 w-px bg-gray-300"></div>
              <h1 className="text-xl font-bold text-gray-900">Novo Portal de Bem-Estar</h1>
            </div>
            <Link
              href="/pt/wellness/portals"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Voltar
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Portal *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Ex: Portal de Bem-Estar Completo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL do Portal *
                </label>
                {carregandoSlug ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse bg-gray-200 h-10 flex-1 rounded-lg"></div>
                  </div>
                ) : !userSlug ? (
                  <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 mb-2">
                      ⚠️ <strong>Configure seu slug pessoal</strong> para personalizar suas URLs
                    </p>
                    <Link
                      href="/pt/wellness/configuracao"
                      className="text-sm text-yellow-900 underline hover:text-yellow-700"
                    >
                      Ir para Configurações →
                    </Link>
                    <div className="mt-3 flex items-center text-gray-500 text-sm">
                      <span>ylada.app/pt/wellness/</span>
                      <span className="px-2 py-1 bg-gray-200 rounded text-gray-600 font-mono">[seu-slug]</span>
                      <span>/portal/</span>
                      <span className="px-2 py-1 bg-gray-200 rounded text-gray-600 font-mono">[slug-do-portal]</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-gray-500 text-sm">ylada.app/pt/wellness/</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-medium">{userSlug}</span>
                      <span className="text-gray-500 text-sm">/portal/</span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => {
                          const slug = gerarSlug(e.target.value) // Normaliza automaticamente: acentos, espaços, maiúsculas
                          setFormData({ ...formData, slug })
                          verificarSlug(slug)
                        }}
                        className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="meu-portal"
                        required
                      />
                      {checkingSlug && (
                        <span className="text-gray-500 text-sm">Verificando...</span>
                      )}
                      {slugAvailable === true && (
                        <span className="text-green-600 text-sm">✓ Disponível</span>
                      )}
                      {slugAvailable === false && (
                        <span className="text-red-600 text-sm">✗ Já em uso</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      URL completa: <span className="font-mono">ylada.app/pt/wellness/{userSlug}/portal/{formData.slug || '[slug-do-portal]'}</span>
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Descreva o propósito deste portal..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Navegação
                </label>
                <select
                  value={formData.navigation_type}
                  onChange={(e) => setFormData({ ...formData, navigation_type: e.target.value as 'menu' | 'sequential' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="menu">Menu (usuário escolhe a ordem)</option>
                  <option value="sequential">Sequencial (ordem fixa)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seleção de Ferramentas */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Selecionar Ferramentas ({selectedTools.length} selecionadas)
            </h2>

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
              disabled={loading || slugAvailable === false || selectedTools.length === 0}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : 'Criar Portal'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

