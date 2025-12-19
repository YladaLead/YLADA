"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Sparkles } from 'lucide-react'
import NutriNavBar from '@/components/nutri/NutriNavBar'
import ScriptsNutriModal from '@/components/nutri/ScriptsNutriModal'
import { buildNutriToolUrl } from '@/lib/url-utils'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from '@/components/ui/Toast'

type TemplateContent = {
  questions?: unknown[]
  items?: unknown[]
}

interface ApiTemplate {
  id: string
  nome?: string
  slug?: string
  categoria?: string
  descricao?: string
  description?: string
  icon?: string
  cor?: string
  content?: TemplateContent | null
  type?: string
  [key: string]: unknown
}

const CATEGORY_MAP: Record<string, string> = {
  quiz: 'Quiz',
  calculadora: 'Calculadora',
  planilha: 'Planilha',
  checklist: 'Checklist',
  conteudo: 'Conteúdo',
  diagnostico: 'Diagnóstico',
  default: 'Outros'
}

const ICON_MAP: Record<string, string> = {
  Quiz: '🎯',
  Calculadora: '🧮',
  Planilha: '📊',
  Checklist: '📋',
  Conteúdo: '📚',
  Diagnóstico: '🔍'
}

const COLOR_MAP: Record<string, string> = {
  Quiz: 'blue',
  Calculadora: 'green',
  Planilha: 'purple',
  Checklist: 'blue',
  Conteúdo: 'purple',
  Diagnóstico: 'red'
}


// Lazy load do componente pesado
const DynamicTemplatePreviewLazy = dynamic(() => import('@/components/shared/DynamicTemplatePreview'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600">Carregando preview...</p>
    </div>
  </div>
})

interface TemplateCard {
  id: string
  nome: string
  categoria: string
  descricao: string
  icon: string
  cor: string
  preview: string
  slug?: string
  content?: TemplateContent | null
  type?: string
}

export default function TemplatesNutri() {
  const [templates, setTemplates] = useState<TemplateCard[]>([])
  const [carregandoTemplates, setCarregandoTemplates] = useState(true)
  const [busca, setBusca] = useState('')
  const [templatePreviewAberto, setTemplatePreviewAberto] = useState<string | null>(null)
  const [scriptsAberto, setScriptsAberto] = useState<{
    nome: string
    slug: string
    icon: string
    link: string
  } | null>(null)
  const [userSlug, setUserSlug] = useState<string | null>(null)
  const [loadingUserSlug, setLoadingUserSlug] = useState(true)
  const [linkCopiado, setLinkCopiado] = useState<string | null>(null)
  const [qrCopiado, setQrCopiado] = useState<string | null>(null)
  const { toasts, showSuccess, showError, showWarning, removeToast } = useToast()

  // Carregar userSlug do perfil
  useEffect(() => {
    const carregarUserSlug = async () => {
      setLoadingUserSlug(true)
      try {
        const response = await fetch('/api/nutri/profile', {
          credentials: 'include',
          cache: 'no-store'
        })
        if (response.ok) {
          const data = await response.json()
          console.log('📋 [Templates] Dados do perfil recebidos:', {
            hasProfile: !!data.profile,
            userSlug: data.profile?.userSlug,
            user_slug: data.profile?.user_slug,
            email: data.profile?.email,
            fullData: data.profile
          })
          // API retorna userSlug (camelCase), mas pode ter user_slug também
          const slug = data.profile?.userSlug || data.profile?.user_slug
          if (slug) {
            setUserSlug(slug)
            console.log('✅ [Templates] user_slug carregado:', slug)
          } else {
            console.warn('⚠️ [Templates] user_slug não encontrado no perfil')
            setUserSlug('') // String vazia indica que foi verificado mas não existe
          }
        } else {
          console.error('❌ [Templates] Erro ao buscar perfil:', response.status)
          setUserSlug('') // Marcar como verificado mesmo em caso de erro
        }
      } catch (error) {
        console.error('❌ [Templates] Erro ao carregar user_slug:', error)
        setUserSlug('') // Marcar como verificado mesmo em caso de erro
      } finally {
        setLoadingUserSlug(false)
      }
    }
    carregarUserSlug()
  }, [])

  // Carregar templates do banco
  useEffect(() => {
    let cancelled = false
    
    const carregarTemplates = async () => {
      try {
        setCarregandoTemplates(true)
        const response = await fetch('/api/nutri/templates', {
          cache: 'no-store',
          signal: AbortSignal.timeout(10000) // Timeout de 10 segundos
        })
        
        if (cancelled) return
        
        if (response.ok) {
          const data = await response.json()
          if (data.templates && data.templates.length > 0) {
            console.log('📦 Templates Nutri carregados do banco:', data.templates.length)
            
            // Transformar templates do banco para formato da página
            const templatesFormatados = (data.templates as ApiTemplate[])
              .filter((t: ApiTemplate) => {
                // Apenas garantir que o template tem nome
                if (!t.nome || !t.nome.trim()) {
                  console.log('⚠️ Template sem nome ignorado:', t.id)
                  return false
                }
                return true
              })
              .map((t: ApiTemplate) => {
                // Normalizar ID para detecção (slug ou nome em lowercase com hífens)
                const normalizedId = (t.slug || t.id || '').toLowerCase().replace(/\s+/g, '-')
                // Determinar categoria
                const categoria =
                  t.categoria ||
                  (t.type ? CATEGORY_MAP[t.type as keyof typeof CATEGORY_MAP] : undefined) ||
                  CATEGORY_MAP.default
                
                // Determinar ícone e cor
                const icon = t.icon || ICON_MAP[categoria] || '📋'
                const cor = t.cor || COLOR_MAP[categoria] || 'blue'
                
                return {
                  id: normalizedId || t.slug || t.id,
                  nome: t.nome || '',
                  categoria,
                  descricao: t.descricao || t.description || '',
                  icon,
                  cor,
                  preview: t.descricao || t.description || '',
                  slug: t.slug || normalizedId,
                  content: t.content, // Incluir content para preview dinâmico
                  type: t.type // Incluir type para preview dinâmico
                }
              })
            
            setTemplates(templatesFormatados)
            console.log(`✅ ${templatesFormatados.length} templates Nutri formatados e carregados`)
          } else {
            console.warn('⚠️ Nenhum template Nutri encontrado na API')
            setTemplates([])
          }
        } else {
          console.error('❌ Erro ao carregar templates Nutri:', response.status)
          setTemplates([])
        }
      } catch (error) {
        console.error('❌ Erro ao carregar templates Nutri:', error)
        setTemplates([])
      } finally {
        if (!cancelled) {
          setCarregandoTemplates(false)
        }
      }
    }

    carregarTemplates()
    
    return () => {
      cancelled = true
    }
  }, [])

  const templatesFiltrados = templates.filter(template => {
    const termo = busca.toLowerCase()
    const { nome = '', descricao = '', preview = '' } = template
    const matchBusca =
      termo === '' ||
      nome.toLowerCase().includes(termo) ||
      descricao.toLowerCase().includes(termo) ||
      preview.toLowerCase().includes(termo)
    return matchBusca
  })

  const templatePreviewSelecionado = templates.find(t => t.id === templatePreviewAberto)

  // Gerar link fixo para template
  const gerarLinkTemplate = (template: TemplateCard): string | null => {
    if (!userSlug || !template.slug) {
      return null
    }
    return buildNutriToolUrl(userSlug, template.slug)
  }

  // Copiar link
  const copiarLink = async (link: string, templateId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    try {
      if (!link || link.trim() === '') {
        showWarning('Link não disponível', {
          message: 'Configure seu user_slug no perfil primeiro para gerar links.',
        })
        return
      }
      await navigator.clipboard.writeText(link)
      setLinkCopiado(templateId)
      setTimeout(() => setLinkCopiado(null), 2000)
      
      // Encontrar o template para mostrar informações
      const template = templates.find(t => t.id === templateId)
      showSuccess('Link copiado!', {
        message: template ? `Link da ferramenta "${template.nome}" copiado para a área de transferência.` : 'Link copiado para a área de transferência.',
        link: link,
        icon: 'link',
        duration: 5000,
      })
    } catch (error) {
      console.error('Erro ao copiar link:', error)
      showError('Erro ao copiar link', {
        message: 'Tente selecionar e copiar manualmente.',
      })
    }
  }

  // Copiar QR Code
  const copiarQRCode = async (link: string, templateId: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    try {
      if (!link) {
        showWarning('Link não disponível', {
          message: 'Configure seu perfil primeiro para gerar QR codes.',
        })
        return
      }
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`
      const response = await fetch(qrUrl)
      if (!response.ok) throw new Error('Erro ao gerar QR code')
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      setQrCopiado(templateId)
      setTimeout(() => setQrCopiado(null), 2000)
      
      // Encontrar o template para mostrar informações
      const template = templates.find(t => t.id === templateId)
      showSuccess('QR Code copiado!', {
        message: template ? `QR Code da ferramenta "${template.nome}" copiado para a área de transferência.` : 'QR Code copiado para a área de transferência.',
        link: link,
        icon: 'qr',
        duration: 5000,
      })
    } catch (error) {
      console.error('Erro ao copiar QR code:', error)
      try {
        // Fallback: copiar o link se QR code não funcionar
        await navigator.clipboard.writeText(link)
        showSuccess('Link copiado', {
          message: 'QR code não suportado, mas o link foi copiado para a área de transferência.',
          link: link,
          icon: 'link',
          duration: 5000,
        })
      } catch (e) {
        showError('Erro ao copiar', {
          message: 'Tente salvar a imagem manualmente.',
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <NutriNavBar showTitle title="Atrair" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero - Mobile-friendly */}
        <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 rounded-2xl p-4 sm:p-6 border border-sky-100 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Quizzes e Calculadoras
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Escolha, personalize e compartilhe em minutos.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl border border-sky-100 shadow-sm px-4 py-2">
              <span className="text-2xl font-bold text-sky-600">{templates.length}</span>
              <span className="text-xs text-gray-500">disponíveis</span>
            </div>
          </div>
        </div>

        {/* Busca - Compacta */}
        <div className="relative mb-6">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="🔍 Buscar quiz ou calculadora..."
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
          />
          {busca && (
            <span className="absolute right-4 top-3 text-sm text-gray-500">
              {templatesFiltrados.length} resultado(s)
            </span>
          )}
        </div>

        {/* Grid */}
        {carregandoTemplates ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600 mb-4"></div>
              <p className="text-gray-600">Carregando templates...</p>
            </div>
          </div>
        ) : templatesFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-700 font-medium">Nenhum resultado encontrado.</p>
            <p className="text-sm text-gray-500 mt-1">
              Tente buscar por outro termo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templatesFiltrados.map((template) => {
              const linkTemplate = gerarLinkTemplate(template)
              return (
                <div
                  key={template.id}
                  className="bg-white rounded-2xl border border-gray-200 hover:border-sky-300 transition-all duration-300 shadow-sm hover:shadow-lg group flex flex-col"
                >
                  <div className="p-6 flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 text-white text-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">{template.nome}</h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-sky-50 text-sky-700 font-medium">
                            {template.categoria}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{template.descricao}</p>
                      </div>
                    </div>

                    {!loadingUserSlug && !linkTemplate && !userSlug && (
                      <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                        Configure seu user_slug no perfil para gerar links
                      </div>
                    )}
                  </div>

                  <div className="p-4 pt-0 border-t border-gray-100">
                    {/* Botões em grid 2x2 */}
                    <div className="grid grid-cols-2 gap-2">
                      {/* Linha 1: Preview + Link */}
                      <button
                        onClick={() => setTemplatePreviewAberto(template.id)}
                        className="bg-sky-600 text-white text-center py-2 px-2 rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
                        title="Ver Preview"
                      >
                        👁️ Preview
                      </button>
                      {linkTemplate ? (
                        <button
                          onClick={(e) => copiarLink(linkTemplate, template.id, e)}
                          className={`text-center py-2 px-2 rounded-lg text-sm font-medium transition-colors ${
                            linkCopiado === template.id
                              ? 'bg-green-500 text-white'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                          title="Copiar Link"
                        >
                          {linkCopiado === template.id ? '✓ Copiado' : '🔗 Link'}
                        </button>
                      ) : (
                        <div className="text-center py-2 text-xs text-gray-400 bg-gray-100 rounded-lg">
                          Configure perfil
                        </div>
                      )}
                      
                      {/* Linha 2: QR + Scripts */}
                      {linkTemplate ? (
                        <>
                          <button
                            onClick={(e) => copiarQRCode(linkTemplate, template.id, e)}
                            className={`text-center py-2 px-2 rounded-lg text-sm font-medium transition-colors ${
                              qrCopiado === template.id
                                ? 'bg-green-500 text-white'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            }`}
                            title="Copiar QR Code"
                          >
                            {qrCopiado === template.id ? '✓ Copiado' : '📱 QR'}
                          </button>
                          <button
                            onClick={() => setScriptsAberto({
                              nome: template.nome,
                              slug: template.slug || '',
                              icon: template.icon,
                              link: linkTemplate
                            })}
                            className="bg-amber-100 text-amber-700 hover:bg-amber-200 text-center py-2 px-2 rounded-lg text-sm font-medium transition-colors"
                            title="Ver Scripts"
                          >
                            💬 Scripts
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="text-center py-2 text-xs text-gray-400 bg-gray-100 rounded-lg">
                            -
                          </div>
                          <div className="text-center py-2 text-xs text-gray-400 bg-gray-100 rounded-lg">
                            -
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Criar Quiz Personalizado */}
        <div className="mt-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Criar Quiz Personalizado</h3>
            <p className="text-sm text-gray-600 mb-4">
              Crie um quiz completamente personalizado com suas próprias perguntas e respostas.
            </p>
            <Link
              href="/pt/nutri/quiz-personalizado"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Criar Quiz Personalizado →
            </Link>
          </div>
        </div>

        {/* Guia rápido */}
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Como usar</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Busque por nome ou categoria</li>
                <li>• Clique em <strong>Preview</strong> para ver o fluxo</li>
                <li>• Copie o <strong>Link</strong> ou <strong>QR Code</strong></li>
                <li>• Compartilhe e acompanhe os resultados</li>
              </ul>
            </div>
          </div>
        </div>

      </main>

      {/* Modal de Scripts */}
      {scriptsAberto && (
        <ScriptsNutriModal
          isOpen={true}
          onClose={() => setScriptsAberto(null)}
          ferramentaNome={scriptsAberto.nome}
          ferramentaSlug={scriptsAberto.slug}
          ferramentaIcon={scriptsAberto.icon}
          linkFerramenta={scriptsAberto.link}
        />
      )}
      {/* Modal de Preview - Usando DynamicTemplatePreview para TODOS os templates */}
      {templatePreviewSelecionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setTemplatePreviewAberto(null)}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-4xl">{templatePreviewSelecionado.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{templatePreviewSelecionado.nome}</h2>
                    <p className="text-blue-100 text-sm">Visualize o fluxo completo deste template</p>
                  </div>
                </div>
                <button
                  onClick={() => setTemplatePreviewAberto(null)}
                  className="text-white hover:text-gray-200 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Conteúdo do Preview - DynamicTemplatePreview para TODOS */}
            <div className="flex-1 overflow-y-auto p-6">
              <DynamicTemplatePreviewLazy
                template={templatePreviewSelecionado}
                profession="nutri"
                onClose={() => setTemplatePreviewAberto(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
