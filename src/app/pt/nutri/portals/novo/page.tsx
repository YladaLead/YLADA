'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import NutriNavBar from '@/components/nutri/NutriNavBar'
import { useAuth } from '@/contexts/AuthContext'

interface Tool {
  id: string
  title: string
  slug: string
  template_slug: string
  description: string
  emoji: string
}

export default function NovoPortalNutri() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <NovoPortalNutriContent />
    </ProtectedRoute>
  )
}

function NovoPortalNutriContent() {
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
  const [generateShortUrl, setGenerateShortUrl] = useState(false) // Gerar URL encurtada
  const [customShortCode, setCustomShortCode] = useState('')
  const [shortCodeDisponivel, setShortCodeDisponivel] = useState<boolean | null>(null)
  const [verificandoShortCode, setVerificandoShortCode] = useState(false)
  const [usarCodigoPersonalizado, setUsarCodigoPersonalizado] = useState(false)
  const [coletarDados, setColetarDados] = useState(true)
  const [camposColeta, setCamposColeta] = useState({
    nome: true,
    email: true,
    telefone: false
  })
  const [mensagemPersonalizada, setMensagemPersonalizada] = useState('')

  useEffect(() => {
    carregarFerramentas()
    carregarUserSlug()
  }, [])

  const carregarUserSlug = async () => {
    try {
      setCarregandoSlug(true)
      const response = await fetch('/api/wellness/profile', { // TODO: Criar /api/nutri/profile quando necessário
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
      const response = await fetch('/api/nutri/ferramentas', {
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
      const response = await fetch(`/api/nutri/portals/check-slug?slug=${encodeURIComponent(slug)}`, {
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
      const portalResponse = await fetch('/api/nutri/portals', {
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
          tools_order: selectedTools,
          generate_short_url: generateShortUrl,
          custom_short_code: usarCodigoPersonalizado && customShortCode.length >= 3 && shortCodeDisponivel ? customShortCode : null,
          leader_data_collection: {
            coletar_dados: coletarDados,
            campos_coleta: camposColeta,
            mensagem_personalizada: mensagemPersonalizada
          }
        })
      })

      if (!portalResponse.ok) {
        const error = await portalResponse.json()
        throw new Error(error.error || 'Erro ao criar portal')
      }

      const portalData = await portalResponse.json()
      const portalId = portalData.data?.portal?.id
      const portalSlug = portalData.data?.portal?.slug

      if (!portalId) {
        throw new Error('Portal criado mas ID não retornado')
      }

      // Adicionar ferramentas ao portal
      for (let i = 0; i < selectedTools.length; i++) {
        const toolId = selectedTools[i]
        await fetch(`/api/nutri/portals/${portalId}/tools`, {
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

      // Buscar user_slug para construir URL completa
      const profileResponse = await fetch('/api/wellness/profile', {
        credentials: 'include'
      })
      let userSlug = null
      if (profileResponse.ok) {
        const profileData = await profileResponse.json()
        userSlug = profileData.profile?.userSlug || null
      }

      // Construir URL do portal
      const baseUrl = typeof window !== 'undefined' ? window.location.protocol + '//' + window.location.host : 'https://ylada.app'
      const portalUrl = userSlug 
        ? `${baseUrl}/pt/nutri/${userSlug}/portal/${portalSlug}`
        : `${baseUrl}/pt/nutri/portal/${portalSlug}`

      // Criar mensagem de sucesso bonita
      const mensagemSucesso = document.createElement('div')
      mensagemSucesso.className = 'fixed top-4 right-4 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl shadow-2xl p-6 z-50 max-w-md animate-slide-in'
      mensagemSucesso.style.animation = 'slideInRight 0.3s ease-out'
      mensagemSucesso.innerHTML = `
        <div class="flex items-start space-x-4">
          <div class="flex-shrink-0">
            <div class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-bold text-green-900 mb-2">🎉 Seu portal foi criado com sucesso!</h3>
            <p class="text-sm text-green-700 mb-3">Agora você pode compartilhar seu portal com seus clientes.</p>
            <div class="bg-white rounded-lg p-3 mb-3 border border-green-200 shadow-sm">
              <p class="text-xs text-gray-500 mb-1 font-medium">Link do seu portal:</p>
              <p class="text-xs text-gray-800 font-mono break-all">${portalUrl}</p>
            </div>
            <div class="flex items-center gap-2">
              <button 
                onclick="navigator.clipboard.writeText('${portalUrl}').then(() => { const btn = this; const original = btn.innerHTML; btn.innerHTML = '✓ Copiado!'; btn.classList.add('bg-green-600'); setTimeout(() => { btn.innerHTML = original; btn.classList.remove('bg-green-600'); }, 2000); })"
                class="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
              >
                📋 Copiar Link
              </button>
              <a 
                href="${portalUrl}"
                target="_blank"
                class="flex-1 bg-white hover:bg-green-50 text-green-700 border-2 border-green-600 text-xs font-semibold px-4 py-2 rounded-lg transition-colors text-center shadow-sm"
              >
                🔗 Ver Portal
              </a>
            </div>
          </div>
          <button 
            onclick="this.closest('div').remove()"
            class="text-green-600 hover:text-green-800 text-xl font-bold leading-none"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
      `
      document.body.appendChild(mensagemSucesso)
      
      // Adicionar animação CSS se não existir
      if (!document.getElementById('portal-success-animation')) {
        const style = document.createElement('style')
        style.id = 'portal-success-animation'
        style.textContent = `
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `
        document.head.appendChild(style)
      }
      
      // Redirecionar para o portal após 4 segundos
      setTimeout(() => {
        mensagemSucesso.remove()
        window.location.href = portalUrl
      }, 4000)
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
      <NutriNavBar showTitle={true} title="Novo Portal de Bem-Estar" />

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      href="/pt/nutri/configuracao"
                      className="text-sm text-yellow-900 underline hover:text-yellow-700"
                    >
                      Ir para Configurações →
                    </Link>
                    <div className="mt-3 flex items-center text-gray-500 text-sm">
                      <span>ylada.app/pt/nutri/</span>
                      <span className="px-2 py-1 bg-gray-200 rounded text-gray-600 font-mono">[seu-slug]</span>
                      <span>/portal/</span>
                      <span className="px-2 py-1 bg-gray-200 rounded text-gray-600 font-mono">[slug-do-portal]</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-gray-500 text-sm">ylada.app/pt/nutri/</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">{userSlug}</span>
                      <span className="text-gray-500 text-sm">/portal/</span>
                      <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => {
                          const slug = gerarSlug(e.target.value) // Normaliza automaticamente: acentos, espaços, maiúsculas
                          setFormData({ ...formData, slug })
                          verificarSlug(slug)
                        }}
                        className="flex-1 min-w-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      URL completa: <span className="font-mono">ylada.app/pt/nutri/{userSlug}/portal/{formData.slug || '[slug-do-portal]'}</span>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="menu">Menu (usuário escolhe a ordem)</option>
                  <option value="sequential">Sequencial (ordem fixa)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seção de URL Encurtada */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-3">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">URL Encurtada</h2>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="generateShortUrlPortal"
                  checked={generateShortUrl}
                  onChange={(e) => {
                    setGenerateShortUrl(e.target.checked)
                    if (!e.target.checked) {
                      setUsarCodigoPersonalizado(false)
                      setCustomShortCode('')
                      setShortCodeDisponivel(null)
                    }
                  }}
                  className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="generateShortUrlPortal" className="flex-1 cursor-pointer">
                  <span className="text-sm font-medium text-gray-900 block">
                    🔗 Gerar URL Encurtada
                  </span>
                  <span className="text-xs text-gray-600 mt-1 block">
                    Crie um link curto como <code className="bg-white px-1 py-0.5 rounded">{typeof window !== 'undefined' ? window.location.hostname : 'ylada.app'}/p/abc123</code> para facilitar compartilhamento via WhatsApp, SMS ou impresso.
                  </span>
                </label>
              </div>
            </div>

            {/* Opção de Código Personalizado */}
            {generateShortUrl && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-3 mb-3">
                  <input
                    type="checkbox"
                    id="usarCodigoPersonalizadoPortal"
                    checked={usarCodigoPersonalizado}
                    onChange={(e) => {
                      setUsarCodigoPersonalizado(e.target.checked)
                      if (!e.target.checked) {
                        setCustomShortCode('')
                        setShortCodeDisponivel(null)
                      }
                    }}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="usarCodigoPersonalizadoPortal" className="flex-1 cursor-pointer">
                    <span className="text-sm font-medium text-gray-900 block">
                      ✏️ Personalizar Código
                    </span>
                    <span className="text-xs text-gray-600 mt-1 block">
                      Escolha seu próprio código (3-10 caracteres, letras, números e hífens)
                    </span>
                  </label>
                </div>

                {usarCodigoPersonalizado && (
                  <div className="mt-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600 font-mono">{typeof window !== 'undefined' ? window.location.origin : 'https://ylada.app'}/p/</span>
                          <input
                            type="text"
                            value={customShortCode}
                            onChange={async (e) => {
                              const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 10)
                              setCustomShortCode(value)
                              
                              if (value.length >= 3) {
                                setVerificandoShortCode(true)
                                try {
                                  const response = await fetch(
                                    `/api/nutri/check-short-code?code=${encodeURIComponent(value)}&type=portal`
                                  )
                                  const data = await response.json()
                                  setShortCodeDisponivel(data.available)
                                } catch (error) {
                                  console.error('Erro ao verificar código:', error)
                                  setShortCodeDisponivel(false)
                                } finally {
                                  setVerificandoShortCode(false)
                                }
                              } else {
                                setShortCodeDisponivel(null)
                              }
                            }}
                            placeholder="meu-codigo"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                          />
                        </div>
                        {verificandoShortCode && (
                          <p className="text-xs text-gray-500 mt-1">Verificando...</p>
                        )}
                        {!verificandoShortCode && shortCodeDisponivel === true && customShortCode.length >= 3 && (
                          <p className="text-xs text-green-600 mt-1">✅ Código disponível!</p>
                        )}
                        {!verificandoShortCode && shortCodeDisponivel === false && customShortCode.length >= 3 && (
                          <p className="text-xs text-red-600 mt-1">❌ Este código já está em uso</p>
                        )}
                        {customShortCode.length > 0 && customShortCode.length < 3 && (
                          <p className="text-xs text-yellow-600 mt-1">⚠️ Mínimo de 3 caracteres</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Coletar Dados do Cliente */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Coleta de Dados do Cliente</h2>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <label className="flex items-center space-x-2 mb-3">
                <input
                  type="checkbox"
                  checked={coletarDados}
                  onChange={(e) => setColetarDados(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-blue-900">Coletar dados do cliente ao acessar o portal</span>
              </label>
              
              {coletarDados && (
                <div className="ml-6 mt-3 space-y-2">
                  <h4 className="text-xs font-medium text-blue-700 mb-2">Campos para coletar:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={camposColeta.nome}
                        onChange={(e) => setCamposColeta({ ...camposColeta, nome: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-blue-700">Nome</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={camposColeta.email}
                        onChange={(e) => setCamposColeta({ ...camposColeta, email: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-blue-700">Email</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={camposColeta.telefone}
                        onChange={(e) => setCamposColeta({ ...camposColeta, telefone: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-blue-700">Telefone</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-blue-700 mb-2">
                      Mensagem de agradecimento (opcional)
                    </label>
                    <textarea
                      value={mensagemPersonalizada}
                      onChange={(e) => setMensagemPersonalizada(e.target.value)}
                      placeholder="Obrigado por acessar! Seu acesso foi liberado."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-blue-600 mt-1">
                      💡 Esta mensagem aparecerá após o cliente enviar os dados.
                    </p>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    💡 Os dados coletados serão salvos automaticamente como leads na sua área de gestão.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Seleção de Ferramentas */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Selecionar Ferramentas ({selectedTools.length} selecionadas)
              </h2>
            </div>

            {/* Mostrar ordem das ferramentas selecionadas */}
            {selectedTools.length > 0 && (
              <div className="mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <span>📋</span>
                  <span>Ordem das Ferramentas no Portal:</span>
                </h3>
                <div className="space-y-2">
                  {selectedTools.map((toolId, index) => {
                    const tool = tools.find(t => t.id === toolId)
                    if (!tool) return null
                    return (
                      <div
                        key={toolId}
                        className="flex items-center gap-3 bg-white rounded-lg p-3 border border-blue-200 shadow-sm"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {index + 1}
                        </div>
                        <span className="text-xl">{tool.emoji || '🔧'}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{tool.title}</p>
                          <p className="text-xs text-gray-500">{tool.template_slug}</p>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">
                          {index === 0 ? '1ª Etapa' : index === 1 ? '2ª Etapa' : index === 2 ? '3ª Etapa' : `${index + 1}ª Etapa`}
                        </span>
                      </div>
                    )
                  })}
                </div>
                {formData.navigation_type === 'sequential' && (
                  <p className="text-xs text-blue-700 mt-3 italic">
                    💡 No modo sequencial, os usuários seguirão esta ordem exata. A primeira ferramenta estará sempre liberada.
                  </p>
                )}
              </div>
            )}

            {/* Nota informativa discreta */}
            <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
              <p className="text-sm text-blue-700">
                <span className="font-medium">ℹ️ Informação:</span> As ferramentas disponíveis são apenas as que você criou. 
                Para adicionar mais ferramentas ao portal,{' '}
                <Link href="/pt/nutri/ferramentas/nova" className="text-blue-600 hover:underline font-medium">
                  crie-as individualmente primeiro
                </Link>.
              </p>
            </div>

            {tools.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Nenhuma ferramenta encontrada. Crie ferramentas primeiro em{' '}
                <Link href="/pt/nutri/ferramentas/nova" className="text-blue-600 hover:underline">
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
                        ? 'border-blue-500 bg-blue-50'
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
              href="/pt/nutri/portals"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading || slugAvailable === false || selectedTools.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando...' : 'Criar Portal'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

