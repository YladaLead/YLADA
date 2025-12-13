"use client"
import { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Sparkles } from 'lucide-react'
import QRCode from '@/components/QRCode'
import NutriNavBar from '@/components/nutri/NutriNavBar'
import { buildNutriToolUrl, getAppUrl } from '@/lib/url-utils'

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
  const [userSlug, setUserSlug] = useState<string | null>(null)
  const [linkCopiado, setLinkCopiado] = useState<string | null>(null)
  const [qrCopiado, setQrCopiado] = useState<string | null>(null)

  // Carregar userSlug do perfil
  useEffect(() => {
    const carregarUserSlug = async () => {
      try {
        const response = await fetch('/api/nutri/profile', {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          if (data.profile?.user_slug) {
            setUserSlug(data.profile.user_slug)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar user_slug:', error)
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
        alert('⚠️ Link não disponível. Configure seu user_slug no perfil primeiro.')
        return
      }
      await navigator.clipboard.writeText(link)
      setLinkCopiado(templateId)
      setTimeout(() => setLinkCopiado(null), 2000)
      alert('✅ Link copiado!')
    } catch (error) {
      console.error('Erro ao copiar link:', error)
      alert('⚠️ Erro ao copiar link. Tente selecionar e copiar manualmente.')
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
        alert('Link não disponível. Configure seu perfil primeiro.')
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
      alert('✅ QR Code copiado!')
    } catch (error) {
      console.error('Erro ao copiar QR code:', error)
      try {
        // Fallback: copiar o link se QR code não funcionar
        await navigator.clipboard.writeText(link)
        alert('✅ Link copiado (QR code não suportado, mas link foi copiado)!')
      } catch (e) {
        alert('⚠️ Erro ao copiar. Tente salvar a imagem manualmente.')
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NutriNavBar showTitle title="Templates Nutri" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 rounded-2xl p-8 border border-sky-100 shadow-sm mb-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-sky-700 uppercase tracking-wide">
                Catálogo Nutri
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">
                Ferramentas prontas para transformar leads em clientes
              </h1>
              <p className="text-gray-700 mt-3 max-w-2xl">
                Agora a área Nutri usa os mesmos templates modulados da Wellness. Escolha uma ferramenta, visualize o fluxo completo e personalize em poucos minutos mantendo o visual exclusivo do seu portal.
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-sky-100 shadow p-5 w-full sm:w-auto">
              <p className="text-sm text-gray-500">Templates disponíveis</p>
              <p className="text-4xl font-bold text-sky-600">{templates.length}</p>
              <p className="text-xs text-gray-500 mt-1">Atualizados automaticamente</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-sky-600 text-xl">✅</div>
              <div>
                <p className="font-semibold text-gray-900">{templates.length} templates modulados</p>
                <p className="text-xs text-gray-600">Com diagnósticos prontos para Nutri</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-blue-500 text-xl">⚡</div>
              <div>
                <p className="font-semibold text-gray-900">Configuração em 5 minutos</p>
                <p className="text-xs text-gray-600">Crie e compartilhe sem código</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center text-indigo-600 text-xl">🎯</div>
              <div>
                <p className="font-semibold text-gray-900">Alta conversão</p>
                <p className="text-xs text-gray-600">Templates validados na prática</p>
              </div>
            </div>
          </div>
        </div>

        {/* Busca */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex-1 min-w-[280px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar Template
            </label>
            <div className="relative">
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome, descrição ou categoria..."
                className="w-full px-4 py-2 pl-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              <span className="absolute left-4 top-2.5 text-xl">🔍</span>
            </div>
            {busca && (
              <p className="mt-2 text-sm text-gray-600">
                {templatesFiltrados.length} template(s) encontrado(s)
              </p>
            )}
          </div>
        </div>
        <div className="mb-8" />

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
            <p className="text-gray-700 font-medium">Nenhum template encontrado.</p>
            <p className="text-sm text-gray-500 mt-1">
              Ajuste a busca ou experimente termos diferentes para continuar explorando.
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

                    <div className="bg-gray-50 rounded-xl p-3 mt-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">Preview</p>
                      <p className="text-sm text-gray-700">{template.preview || template.descricao}</p>
                    </div>

                    {/* Link e QR Code */}
                    {linkTemplate && (
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-gray-500">Link:</span>
                          <span className="text-gray-700 font-mono truncate flex-1">{linkTemplate}</span>
                          <button
                            onClick={(e) => copiarLink(linkTemplate, template.id, e)}
                            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                              linkCopiado === template.id
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            {linkCopiado === template.id ? '✓ Copiado' : 'Copiar'}
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <QRCode url={linkTemplate} size={80} />
                          <button
                            onClick={(e) => copiarQRCode(linkTemplate, template.id, e)}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                              qrCopiado === template.id
                                ? 'bg-green-100 text-green-700'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            }`}
                          >
                            {qrCopiado === template.id ? '✓ QR Copiado' : 'Copiar QR'}
                          </button>
                        </div>
                      </div>
                    )}
                    {!linkTemplate && userSlug === null && (
                      <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-700">
                        Configure seu user_slug no perfil para gerar links
                      </div>
                    )}
                  </div>

                  <div className="p-6 pt-0 flex flex-col gap-3">
                    <button
                      onClick={() => setTemplatePreviewAberto(template.id)}
                      className="w-full bg-sky-600 text-white text-center py-2.5 rounded-xl font-semibold hover:bg-sky-700 transition-colors"
                    >
                      Ver Preview
                    </button>
                    {linkTemplate && (
                      <Link
                        href={linkTemplate}
                        target="_blank"
                        className="w-full text-center py-2.5 rounded-xl font-semibold border-2 border-sky-600 text-sky-700 hover:bg-sky-50 transition-colors"
                      >
                        Abrir Ferramenta →
                      </Link>
                    )}
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
        <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Como funciona</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Explore os templates usando a busca inteligente</li>
                <li>• Clique em <strong>Ver Preview</strong> para visualizar o fluxo completo</li>
                <li>• Selecione <strong>Criar com este template</strong> para personalizar seu link</li>
                <li>• Compartilhe com seus leads e acompanhe o desempenho no dashboard</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
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
