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

// =====================================================
// SCRIPTS DE ABORDAGEM PARA NUTRICIONISTAS
// =====================================================

interface ScriptItem {
  id: string
  titulo: string
  mensagem: string
  dica?: string
}

interface ScriptCategoria {
  id: string
  nome: string
  emoji: string
  cor: string
  descricao: string
  scripts: ScriptItem[]
}

const SCRIPTS_NUTRI: ScriptCategoria[] = [
  {
    id: 'lista-quente',
    nome: 'Lista Quente',
    emoji: '🔥',
    cor: 'orange',
    descricao: 'Para amigos próximos, família e conhecidos',
    scripts: [
      {
        id: 'lq-1',
        titulo: 'Convite direto',
        mensagem: `Oi [NOME]! Tudo bem?

Lembrei de você quando criei esse quiz sobre hidratação. Sei que você sempre comenta sobre isso rs

Faz rapidinho e me conta o resultado? 💧

[LINK]`,
        dica: 'Use com pessoas que já comentaram sobre o tema'
      },
      {
        id: 'lq-2',
        titulo: 'Pedindo opinião',
        mensagem: `Ei [NOME]! Preciso da sua ajuda 🙏

Criei uma calculadora de água pra usar com meus pacientes. Você pode testar e me dar um feedback sincero?

Leva menos de 1 minuto:
[LINK]

Me conta o que achou!`,
        dica: 'Funciona bem para validar suas ferramentas'
      },
      {
        id: 'lq-3',
        titulo: 'Compartilhando novidade',
        mensagem: `[NOME]! Tenho uma novidade 🎉

Lancei um quiz interativo sobre alimentação. Você responde algumas perguntas e descobre seu perfil nutricional.

Fiz pensando em pessoas como você que se preocupam com saúde!

Testa aqui: [LINK]`,
        dica: 'Ideal para anunciar novas ferramentas'
      }
    ]
  },
  {
    id: 'conhecidos',
    nome: 'Conhecidos',
    emoji: '🤝',
    cor: 'blue',
    descricao: 'Para colegas, ex-colegas e contatos profissionais',
    scripts: [
      {
        id: 'c-1',
        titulo: 'Retomando contato',
        mensagem: `Oi [NOME], tudo bem? Aqui é a [SEU NOME], nutricionista.

Faz tempo que não conversamos! Vi que você postou sobre rotina corrida e lembrei de um quiz que criei sobre alimentação e rotina.

Se quiser fazer, é bem rápido: [LINK]

Qualquer dúvida, estou por aqui! 😊`,
        dica: 'Bom para reativar contatos antigos'
      },
      {
        id: 'c-2',
        titulo: 'Oferecendo valor',
        mensagem: `Oi [NOME]!

Sou nutricionista e criei uma calculadora gratuita de IMC que dá o resultado na hora com dicas personalizadas.

Achei que poderia te interessar:
[LINK]

Se tiver alguma dúvida sobre o resultado, fico à disposição!`,
        dica: 'Direto ao ponto, oferecendo valor primeiro'
      },
      {
        id: 'c-3',
        titulo: 'Contexto profissional',
        mensagem: `Oi [NOME], tudo bem?

Estou divulgando um quiz gratuito sobre bem-estar que criei para ajudar pessoas a entenderem melhor seus hábitos.

Você faz em 2 minutos e já recebe o resultado:
[LINK]

Se gostar, agradeço se puder compartilhar! 🙏`,
        dica: 'Tom profissional mas acessível'
      }
    ]
  },
  {
    id: 'frios',
    nome: 'Contatos Frios',
    emoji: '🌱',
    cor: 'green',
    descricao: 'Para pessoas que não te conhecem ainda',
    scripts: [
      {
        id: 'f-1',
        titulo: 'Apresentação + Valor',
        mensagem: `Oi! Tudo bem?

Me chamo [SEU NOME], sou nutricionista e criei uma ferramenta gratuita que calcula a quantidade ideal de água por dia.

É rápido e você descobre na hora:
[LINK]

Espero que seja útil! 💧`,
        dica: 'Curto e direto, sem pressão'
      },
      {
        id: 'f-2',
        titulo: 'Baseado em interesse',
        mensagem: `Oi [NOME]!

Vi que você se interessa por [TEMA - alimentação/saúde/emagrecimento]. 

Sou nutricionista e tenho um quiz gratuito que pode te ajudar a entender melhor seu perfil. Quer testar?

[LINK]`,
        dica: 'Personalize baseado no perfil da pessoa'
      },
      {
        id: 'f-3',
        titulo: 'Abordagem leve',
        mensagem: `Oi! 😊

Posso te mandar um quiz rápido sobre alimentação? É gratuito e você descobre seu perfil em 2 minutos.

Se não quiser, sem problemas!`,
        dica: 'Pede permissão antes, gera mais confiança'
      }
    ]
  },
  {
    id: 'indicacoes',
    nome: 'Pedir Indicações',
    emoji: '🎁',
    cor: 'purple',
    descricao: 'Para pedir que compartilhem com outras pessoas',
    scripts: [
      {
        id: 'i-1',
        titulo: 'Após resultado positivo',
        mensagem: `Que bom que gostou do resultado! 🎉

Você conhece alguém que também se preocupa com [TEMA]? Pode compartilhar o link com ela, é gratuito:

[LINK]

Agradeço muito! 🙏`,
        dica: 'Use logo após a pessoa completar o quiz'
      },
      {
        id: 'i-2',
        titulo: 'Pedido direto',
        mensagem: `[NOME], preciso de uma ajuda sua!

Estou divulgando meu trabalho e criei esse quiz gratuito. Você conhece 3 pessoas que poderiam se interessar?

Pode ser qualquer pessoa que se preocupe com alimentação e saúde.

[LINK]

Muito obrigada! ❤️`,
        dica: 'Número específico (3) aumenta chances de indicação'
      },
      {
        id: 'i-3',
        titulo: 'Para grupos',
        mensagem: `Oi pessoal! 👋

Sou nutricionista e criei um [TIPO] gratuito sobre [TEMA]. É rápido e você recebe o resultado na hora.

Se alguém quiser testar:
[LINK]

Podem compartilhar com quem acharem que vai gostar! 😊`,
        dica: 'Adapte para grupos de WhatsApp ou redes'
      }
    ]
  },
  {
    id: 'stories',
    nome: 'Stories e Redes',
    emoji: '📱',
    cor: 'pink',
    descricao: 'Textos curtos para legendas e stories',
    scripts: [
      {
        id: 's-1',
        titulo: 'Story com CTA',
        mensagem: `Você sabe quanta água deveria beber por dia? 💧

Criei uma calculadora gratuita que te dá o resultado em segundos.

Link nos destaques! ⬆️`,
        dica: 'Use com imagem chamativa'
      },
      {
        id: 's-2',
        titulo: 'Legenda engajadora',
        mensagem: `Seu corpo está pedindo detox? 🍃

Fiz um quiz rápido que te ajuda a descobrir. É gratuito e você recebe o resultado na hora!

Comenta "QUERO" que eu mando o link no direct 💬`,
        dica: 'Gera engajamento nos comentários'
      },
      {
        id: 's-3',
        titulo: 'Story pergunta',
        mensagem: `Enquete: Você sabe seu IMC atual?

[ ] Sim, sei de cor
[ ] Mais ou menos
[ ] Não faço ideia

Se marcou a última, tenho uma calculadora gratuita pra você! 🎯`,
        dica: 'Use o recurso de enquete do Instagram'
      },
      {
        id: 's-4',
        titulo: 'Bio / Link',
        mensagem: `🥗 Nutricionista
📍 [CIDADE]
🎯 Ajudo você a [BENEFÍCIO]

⬇️ Faça o quiz gratuito:`,
        dica: 'Para bio do Instagram com link'
      }
    ]
  }
]

// Componente de Scripts
function ScriptsNutriSection() {
  const [categoriaAberta, setCategoriaAberta] = useState<string | null>(null)
  const [scriptCopiado, setScriptCopiado] = useState<string | null>(null)

  const copiarScript = async (mensagem: string, scriptId: string) => {
    try {
      await navigator.clipboard.writeText(mensagem)
      setScriptCopiado(scriptId)
      setTimeout(() => setScriptCopiado(null), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
      alert('Erro ao copiar. Tente selecionar e copiar manualmente.')
    }
  }

  return (
    <div className="mt-10">
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-2xl border border-amber-200 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white text-2xl flex items-center justify-center shadow-md">
            💬
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Scripts de Abordagem</h2>
            <p className="text-sm text-gray-600">Mensagens prontas para compartilhar suas ferramentas</p>
          </div>
        </div>

        {/* Grid de Categorias */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {SCRIPTS_NUTRI.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => setCategoriaAberta(categoriaAberta === categoria.id ? null : categoria.id)}
              className={`p-3 rounded-xl border-2 transition-all text-center ${
                categoriaAberta === categoria.id
                  ? 'border-amber-400 bg-amber-100 shadow-md'
                  : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-amber-50'
              }`}
            >
              <span className="text-2xl block mb-1">{categoria.emoji}</span>
              <span className="text-xs font-medium text-gray-700 block">{categoria.nome}</span>
            </button>
          ))}
        </div>

        {/* Scripts da Categoria Selecionada */}
        {categoriaAberta && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            {SCRIPTS_NUTRI.filter(c => c.id === categoriaAberta).map((categoria) => (
              <div key={categoria.id}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">{categoria.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{categoria.nome}</h3>
                    <p className="text-xs text-gray-500">{categoria.descricao}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {categoria.scripts.map((script) => (
                    <div key={script.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-medium text-gray-800 text-sm">{script.titulo}</h4>
                        <button
                          onClick={() => copiarScript(script.mensagem, script.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all flex-shrink-0 ${
                            scriptCopiado === script.id
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                          }`}
                        >
                          {scriptCopiado === script.id ? '✓ Copiado!' : '📋 Copiar'}
                        </button>
                      </div>
                      <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans bg-white rounded-lg p-3 border border-gray-200">
                        {script.mensagem}
                      </pre>
                      {script.dica && (
                        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                          <span>💡</span> {script.dica}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dica geral */}
        {!categoriaAberta && (
          <div className="text-center py-4 text-sm text-gray-500">
            👆 Clique em uma categoria para ver os scripts
          </div>
        )}

        {/* Instruções */}
        <div className="mt-6 bg-amber-50 rounded-lg p-4 border border-amber-100">
          <h4 className="font-medium text-amber-800 text-sm mb-2">📝 Como usar os scripts:</h4>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>• Substitua <strong>[NOME]</strong> pelo nome da pessoa</li>
            <li>• Substitua <strong>[SEU NOME]</strong> pelo seu nome</li>
            <li>• Substitua <strong>[LINK]</strong> pelo link da ferramenta</li>
            <li>• Substitua <strong>[TEMA]</strong> pelo assunto (hidratação, emagrecimento, etc)</li>
            <li>• Personalize conforme o contexto e sua forma de falar</li>
          </ul>
        </div>
      </div>
    </div>
  )
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
  const [loadingUserSlug, setLoadingUserSlug] = useState(true)
  const [linkCopiado, setLinkCopiado] = useState<string | null>(null)
  const [qrCopiado, setQrCopiado] = useState<string | null>(null)

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
                    {/* Botões lado a lado */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTemplatePreviewAberto(template.id)}
                        className="flex-1 bg-sky-600 text-white text-center py-2 px-2 rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors"
                        title="Ver Preview"
                      >
                        <span className="hidden sm:inline">👁️ Preview</span>
                        <span className="sm:hidden">👁️</span>
                      </button>
                      {linkTemplate ? (
                        <>
                          <button
                            onClick={(e) => copiarLink(linkTemplate, template.id, e)}
                            className={`flex-1 text-center py-2 px-2 rounded-lg text-sm font-medium transition-colors ${
                              linkCopiado === template.id
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                            title="Copiar Link"
                          >
                            <span className="hidden sm:inline">{linkCopiado === template.id ? '✓ Copiado' : '🔗 Link'}</span>
                            <span className="sm:hidden">{linkCopiado === template.id ? '✓' : '🔗'}</span>
                          </button>
                          <button
                            onClick={(e) => copiarQRCode(linkTemplate, template.id, e)}
                            className={`flex-1 text-center py-2 px-2 rounded-lg text-sm font-medium transition-colors ${
                              qrCopiado === template.id
                                ? 'bg-green-100 text-green-700'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                            }`}
                            title="Copiar QR Code"
                          >
                            <span className="hidden sm:inline">{qrCopiado === template.id ? '✓ Copiado' : '📱 QR'}</span>
                            <span className="sm:hidden">{qrCopiado === template.id ? '✓' : '📱'}</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex-1 text-center py-2 text-xs text-gray-400">
                          Configure perfil
                        </div>
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

        {/* Scripts de Abordagem */}
        <ScriptsNutriSection />
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
