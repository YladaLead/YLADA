'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { normalizeTemplateSlug } from '@/lib/template-slug-map'
import FluxoDiagnostico from '@/components/wellness-system/FluxoDiagnostico'
import DynamicTemplatePreview from '@/components/shared/DynamicTemplatePreview'
import { FluxoCliente } from '@/types/wellness-system'

interface Tool {
  id: string
  title: string
  description: string
  emoji: string
  custom_colors: {
    principal: string
    secundaria: string
  }
  cta_type: 'whatsapp' | 'url_externa'
  whatsapp_number?: string
  external_url?: string
  cta_button_text: string
  custom_whatsapp_message?: string
  template_slug: string
  user_profiles?: {
    user_slug: string
    country_code?: string
  }
  users?: {
    name: string
  }
  is_fluxo?: boolean
  fluxo_tipo?: 'recrutamento' | 'vendas'
  content?: {
    template_type?: string
    fluxo?: FluxoCliente
    tipo?: 'recrutamento' | 'vendas'
  }
}

// Importar templates dinamicamente com as configurações
const TemplateIMC = dynamic(() => import('@/app/pt/wellness/templates/imc/page'), { ssr: false })
const TemplateProteina = dynamic(() => import('@/app/pt/wellness/templates/proteina/page'), { ssr: false })
const TemplateHidratacao = dynamic(() => import('@/app/pt/wellness/templates/hidratacao/page'), { ssr: false })
const TemplateCalorias = dynamic(() => import('@/app/pt/wellness/templates/calorias/page'), { ssr: false })
const TemplateGanhos = dynamic(() => import('@/app/pt/wellness/templates/ganhos/page'), { ssr: false })
const TemplatePotencial = dynamic(() => import('@/app/pt/wellness/templates/potencial/page'), { ssr: false })
const TemplateProposito = dynamic(() => import('@/app/pt/wellness/templates/proposito/page'), { ssr: false })
const TemplateAlimentacao = dynamic(() => import('@/app/pt/wellness/templates/healthy-eating/page'), { ssr: false })
const TemplateWellnessProfile = dynamic(() => import('@/app/pt/wellness/templates/wellness-profile/page'), { ssr: false })
const Template7DayChallenge = dynamic(() => import('@/app/pt/wellness/templates/7-day-challenge/page'), { ssr: false })
const Template21DayChallenge = dynamic(() => import('@/app/pt/wellness/templates/21-day-challenge/page'), { ssr: false })
const TemplateHydrationGuide = dynamic(() => import('@/app/pt/wellness/templates/hydration-guide/page'), { ssr: false })
const TemplateIntoleranceAssessment = dynamic(() => import('@/app/pt/wellness/templates/intolerance-assessment/page'), { ssr: false })
const TemplateMetabolicProfileAssessment = dynamic(() => import('@/app/pt/wellness/templates/metabolic-profile-assessment/page'), { ssr: false })
const TemplateElectrolyteDiagnosis = dynamic(() => import('@/app/pt/wellness/templates/electrolyte-diagnosis/page'), { ssr: false })
const TemplateIntestinalSymptomsDiagnosis = dynamic(() => import('@/app/pt/wellness/templates/intestinal-symptoms-diagnosis/page'), { ssr: false })
const TemplateReadyToLoseWeight = dynamic(() => import('@/app/pt/wellness/templates/ready-to-lose-weight/page'), { ssr: false })
const TemplateHungerType = dynamic(() => import('@/app/pt/wellness/templates/hunger-type/page'), { ssr: false })
const TemplateHealthyEatingQuiz = dynamic(() => import('@/app/pt/wellness/templates/healthy-eating-quiz/page'), { ssr: false })
const TemplateMetabolicSyndromeRisk = dynamic(() => import('@/app/pt/wellness/templates/metabolic-syndrome-risk/page'), { ssr: false })
const TemplateWaterRetentionTest = dynamic(() => import('@/app/pt/wellness/templates/water-retention-test/page'), { ssr: false })
const TemplateBodyAwareness = dynamic(() => import('@/app/pt/wellness/templates/body-awareness/page'), { ssr: false })
const TemplateNourishedVsFed = dynamic(() => import('@/app/pt/wellness/templates/nourished-vs-fed/page'), { ssr: false })
const TemplateEatingRoutine = dynamic(() => import('@/app/pt/wellness/templates/eating-routine/page'), { ssr: false })
const TemplateGainsAndProsperity = dynamic(() => import('@/app/pt/wellness/templates/gains-and-prosperity/page'), { ssr: false })
const TemplatePotentialAndGrowth = dynamic(() => import('@/app/pt/wellness/templates/potential-and-growth/page'), { ssr: false })
const TemplatePurposeAndBalance = dynamic(() => import('@/app/pt/wellness/templates/purpose-and-balance/page'), { ssr: false })
const TemplateStory = dynamic(() => import('@/app/pt/wellness/templates/story-interativo/page'), { ssr: false })
// ⚠️ Template "Cardápio Detox" removido conforme solicitado
const TemplateInitialAssessment = dynamic(() => import('@/app/pt/wellness/templates/initial-assessment/page'), { ssr: false })

// Templates Hype Drink
const TemplateHypeEnergiaFoco = dynamic(() => import('@/app/pt/wellness/templates/hype-drink/energia-foco/page'), { ssr: false })
const TemplateHypePreTreino = dynamic(() => import('@/app/pt/wellness/templates/hype-drink/pre-treino/page'), { ssr: false })
const TemplateHypeRotinaProdutiva = dynamic(() => import('@/app/pt/wellness/templates/hype-drink/rotina-produtiva/page'), { ssr: false })
const TemplateHypeConstancia = dynamic(() => import('@/app/pt/wellness/templates/hype-drink/constancia/page'), { ssr: false })
const TemplateHypeConsumoCafeina = dynamic(() => import('@/app/pt/wellness/templates/hype-drink/consumo-cafeina/page'), { ssr: false })
const TemplateHypeCustoEnergia = dynamic(() => import('@/app/pt/wellness/templates/hype-drink/custo-energia/page'), { ssr: false })

export default function FerramentaPersonalizadaPage() {
  const params = useParams()
  const router = useRouter()
  const userSlug = params['user-slug'] as string
  const toolSlug = params['tool-slug'] as string

  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Verificar se é um template do Hype Drink (não precisa buscar no banco)
  const isHypeDrinkTemplate = (slug: string): boolean => {
    const hypeSlugs = [
      'energia-foco',
      'pre-treino',
      'rotina-produtiva',
      'constancia',
      'consumo-cafeina',
      'custo-energia'
    ]
    return hypeSlugs.includes(slug)
  }

  useEffect(() => {
    // Se for template do Hype Drink, buscar perfil do usuário para config
    if (isHypeDrinkTemplate(toolSlug)) {
      carregarPerfilUsuario()
    } else {
      carregarFerramenta()
    }
  }, [userSlug, toolSlug])

  const carregarPerfilUsuario = async () => {
    try {
      setLoading(true)
      // Buscar perfil público do usuário para obter configurações (whatsapp, etc)
      const response = await fetch(`/api/wellness/profile/by-slug?user_slug=${userSlug}`)
      
      let whatsapp = ''
      let countryCode = 'BR'
      
      if (response.ok) {
        const data = await response.json()
        whatsapp = data.profile?.whatsapp || ''
        countryCode = data.profile?.countryCode || 'BR'
      }
      
      // Criar objeto mock para templates do Hype Drink
      setTool({
        id: `hype-${toolSlug}`,
        title: 'Hype Drink',
        description: 'Template Hype Drink',
        emoji: '🥤',
        custom_colors: {
          principal: '#fbbf24',
          secundaria: '#f59e0b'
        },
        cta_type: 'whatsapp',
        whatsapp_number: whatsapp,
        cta_button_text: 'Falar com Especialista',
        template_slug: toolSlug,
        user_profiles: {
          user_slug: userSlug,
          country_code: countryCode
        }
      } as Tool)
    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err)
      // Criar tool básico mesmo em caso de erro
      setTool({
        id: `hype-${toolSlug}`,
        title: 'Hype Drink',
        description: 'Template Hype Drink',
        emoji: '🥤',
        custom_colors: {
          principal: '#fbbf24',
          secundaria: '#f59e0b'
        },
        cta_type: 'whatsapp',
        cta_button_text: 'Falar com Especialista',
        template_slug: toolSlug,
        user_profiles: {
          user_slug: userSlug,
          country_code: 'BR'
        }
      } as Tool)
    } finally {
      setLoading(false)
    }
  }

  const carregarFerramenta = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/wellness/ferramentas/by-url?user_slug=${userSlug}&tool_slug=${toolSlug}`
      )

      // Tratar erro 403 (assinatura expirada/indisponível)
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}))
        setError('link_indisponivel')
        setTool(null)
        setLoading(false)
        return
      }

      // Tratar erro 404 (ferramenta não encontrada)
      if (response.status === 404) {
        const errorData = await response.json().catch(() => ({}))
        setError('ferramenta_nao_encontrada')
        setTool(null)
        setLoading(false)
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // Se não for 403 ou 404, tratar como erro genérico
        if (response.status >= 500) {
          setError('erro_servidor')
        } else {
          setError('ferramenta_nao_encontrada')
        }
        setTool(null)
        setLoading(false)
        return
      }

      const data = await response.json()
      setTool(data.tool)
      
      // Debug: verificar se country_code está vindo da API
      console.log('🔍 Tool carregado (Wellness):', {
        tool_id: data.tool?.id,
        whatsapp_number: data.tool?.whatsapp_number,
        country_code: data.tool?.user_profiles?.country_code,
        user_profiles: data.tool?.user_profiles
      })

      // Incrementar contador de visualizações
      if (data.tool?.id) {
        try {
          await fetch('/api/wellness/ferramentas/track-view', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tool_id: data.tool.id }),
          })
          // Silencioso - não interrompe se falhar
        } catch (err) {
          console.error('Erro ao registrar visualização:', err)
        }
      }
    } catch (err: any) {
      console.error('Erro ao carregar ferramenta:', err)
      setError(err.message || 'Erro ao carregar ferramenta')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando ferramenta...</p>
        </div>
      </div>
    )
  }

  if (error || !tool) {
    const isLinkUnavailable = error === 'link_indisponivel'
    const isFerramentaNaoEncontrada = error === 'ferramenta_nao_encontrada'
    const isErroServidor = error === 'erro_servidor'
    
    // Determinar mensagem e ícone baseado no tipo de erro
    let titulo = 'Erro ao carregar ferramenta'
    let mensagem = 'Ocorreu um erro ao carregar esta ferramenta. Tente novamente mais tarde.'
    let icone = '⚠️'
    let corBorda = 'border-red-200'
    let corBotao = 'bg-green-600 hover:bg-green-700'
    
    if (isLinkUnavailable) {
      titulo = 'Link indisponível'
      mensagem = 'Este link está indisponível porque a assinatura precisa ser renovada. Se você já fez o pagamento, aguarde alguns minutos ou entre em contato com o suporte.'
      icone = '⛔'
      corBorda = 'border-orange-200'
      corBotao = 'bg-orange-600 hover:bg-orange-700'
    } else if (isFerramentaNaoEncontrada) {
      titulo = 'Ferramenta não encontrada'
      mensagem = 'A ferramenta que você está procurando não existe, foi removida ou o link está incorreto. Verifique se o link está completo e correto.'
      icone = '🔍'
      corBorda = 'border-red-200'
      corBotao = 'bg-green-600 hover:bg-green-700'
    } else if (isErroServidor) {
      titulo = 'Erro no servidor'
      mensagem = 'Ocorreu um erro técnico ao carregar esta ferramenta. Nossa equipe foi notificada. Tente novamente em alguns instantes.'
      icone = '🔧'
      corBorda = 'border-yellow-200'
      corBotao = 'bg-yellow-600 hover:bg-yellow-700'
    }
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className={`max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center border-2 ${corBorda}`}>
          <div className="mb-4">
            <span className="text-5xl">{icone}</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {titulo}
          </h2>
          <p className="text-gray-600 mb-6">
            {mensagem}
          </p>
          <div className="space-y-2">
            {isLinkUnavailable && (
              <button
                onClick={() => router.push(`/pt/wellness/checkout?plan=monthly`)}
                className={`w-full px-4 py-2 ${corBotao} text-white rounded-lg transition-colors font-medium`}
              >
                Renovar Assinatura
              </button>
            )}
            <button
              onClick={() => router.push('/pt/wellness/ferramentas')}
              className={`w-full px-4 py-2 ${corBotao} text-white rounded-lg transition-colors font-medium`}
            >
              Voltar para Meus Links
            </button>
            <button
              onClick={() => router.push('/pt/wellness')}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Ir para Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar template específico com configurações
  const renderizarTemplate = () => {
    // Passar configurações via props
    const countryCode = tool.user_profiles?.country_code || null
    
    // Se for um fluxo, renderizar FluxoDiagnostico
    if (tool.is_fluxo && tool.content?.fluxo) {
      const fluxo = tool.content.fluxo
      const tipo = tool.content.tipo || tool.fluxo_tipo || 'vendas'
      
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Cabeçalho */}
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {fluxo.nome}
              </h1>
              {/* Removido: fluxo.objetivo - informação interna do usuário, não deve ser exibida publicamente */}
            </div>

            {/* Componente de Diagnóstico */}
            <FluxoDiagnostico
              fluxo={fluxo}
              whatsappNumber={tool.whatsapp_number || ''}
              countryCode={tool.user_profiles?.country_code || 'BR'}
              mostrarProdutos={tipo === 'vendas'}
            />
          </main>
        </div>
      )
    }

    // Debug: verificar country_code antes de passar para o config
    console.log('🔍 Config sendo criado (Wellness):', {
      whatsapp_number: tool.whatsapp_number,
      country_code: countryCode,
      user_profiles: tool.user_profiles
    })
    
    const config = {
      title: tool.title,
      description: tool.description,
      emoji: tool.emoji,
      custom_colors: tool.custom_colors,
      cta_type: tool.cta_type,
      whatsapp_number: tool.whatsapp_number,
      external_url: tool.external_url,
      cta_button_text: tool.cta_button_text,
      custom_whatsapp_message: tool.custom_whatsapp_message,
      country_code: countryCode, // Incluir country_code do perfil
      template_slug: tool.template_slug || normalizedSlug, // Incluir template_slug para mensagens WhatsApp
      slug: tool.template_slug || normalizedSlug, // Incluir slug como fallback
    }

    // ✅ Normalizar template_slug para garantir consistência
    const normalizedSlug = normalizeTemplateSlug(tool.template_slug)

    switch (normalizedSlug) {
      case 'calc-imc':
        return <TemplateIMC config={config} />
      case 'calc-proteina':
        return <TemplateProteina config={config} />
      case 'calc-hidratacao':
      case 'agua': // ✅ Adicionado case direto para slug 'agua'
        return <TemplateHidratacao config={config} />
      case 'calc-calorias':
        return <TemplateCalorias config={config} />
      case 'quiz-ganhos':
        return <TemplateGanhos config={config} />
      case 'quiz-potencial':
        return <TemplatePotencial config={config} />
      case 'quiz-proposito':
        return <TemplateProposito config={config} />
      case 'quiz-alimentacao':
        return <TemplateAlimentacao config={config} />
      case 'quiz-wellness-profile':
        return <TemplateWellnessProfile config={config} />
      case 'template-desafio-7dias':
      case 'desafio-7-dias':
        return <Template7DayChallenge config={config} />
      case 'template-desafio-21dias':
      case 'desafio-21-dias':
        return <Template21DayChallenge config={config} />
      case 'guia-hidratacao':
        return <TemplateHydrationGuide config={config} />
      case 'avaliacao-intolerancia':
      case 'quiz-intolerancia':
      case 'intolerancia':
        return <TemplateIntoleranceAssessment config={config} />
      case 'avaliacao-perfil-metabolico':
      case 'quiz-perfil-metabolico':
      case 'perfil-metabolico':
      case 'perfil-metabólico':
        return <TemplateMetabolicProfileAssessment config={config} />
      case 'diagnostico-eletrolitos':
      case 'quiz-eletrolitos':
      case 'eletrolitos':
      case 'eletrólitos':
        return <TemplateElectrolyteDiagnosis config={config} />
      case 'diagnostico-sintomas-intestinais':
      case 'quiz-sintomas-intestinais':
      case 'sintomas-intestinais':
      case 'sintomas intestinais':
        return <TemplateIntestinalSymptomsDiagnosis config={config} />
      case 'pronto-emagrecer':
      case 'quiz-pronto-emagrecer':
      case 'pronto para emagrecer':
        return <TemplateReadyToLoseWeight config={config} />
      case 'tipo-fome':
      case 'quiz-tipo-fome':
      case 'qual-e-o-seu-tipo-de-fome':
      case 'tipo de fome':
      case 'quiz-fome-emocional':
      case 'avaliacao-fome-emocional':
      case 'avaliação-fome-emocional':
      case 'fome-emocional':
        return <TemplateHungerType config={config} />
      case 'alimentacao-saudavel':
      case 'quiz-alimentacao-saudavel':
      case 'healthy-eating-quiz':
      case 'healthy-eating':
        return <TemplateHealthyEatingQuiz config={config} />
      case 'sindrome-metabolica':
      case 'risco-sindrome-metabolica':
      case 'metabolic-syndrome-risk':
      case 'metabolic-syndrome':
        return <TemplateMetabolicSyndromeRisk config={config} />
      case 'retencao-liquidos':
      case 'teste-retencao-liquidos':
      case 'water-retention-test':
      case 'water-retention':
        return <TemplateWaterRetentionTest config={config} />
      case 'conhece-seu-corpo':
      case 'voce-conhece-seu-corpo':
      case 'body-awareness':
      case 'autoconhecimento-corporal':
        return <TemplateBodyAwareness config={config} />
      case 'nutrido-vs-alimentado':
      case 'voce-nutrido-ou-apenas-alimentado':
      case 'nourished-vs-fed':
      case 'nutrido ou alimentado':
        return <TemplateNourishedVsFed config={config} />
      case 'alimentacao-rotina':
      case 'voce-alimentando-conforme-rotina':
      case 'eating-routine':
      case 'alimentação conforme rotina':
        return <TemplateEatingRoutine config={config} />
      case 'ganhos-prosperidade':
      case 'quiz-ganhos-prosperidade':
      case 'gains-and-prosperity':
      case 'ganhos e prosperidade':
      case 'quiz-ganhos':
        return <TemplateGainsAndProsperity config={config} />
      case 'potencial-crescimento':
      case 'quiz-potencial-crescimento':
      case 'potential-and-growth':
      case 'potencial e crescimento':
      case 'quiz-potencial':
        return <TemplatePotentialAndGrowth config={config} />
      case 'proposito-equilibrio':
      case 'quiz-proposito-equilibrio':
      case 'purpose-and-balance':
      case 'propósito e equilíbrio':
      case 'quiz-proposito':
        return <TemplatePurposeAndBalance config={config} />
      // ⚠️ Template "quiz-interativo" removido conforme solicitado (foi descartado)
      // ⚠️ Template "Cardápio Detox" removido conforme solicitado
      case 'template-avaliacao-inicial':
      case 'avaliacao-inicial':
      case 'avaliação-inicial':
        return <TemplateInitialAssessment config={config} />
      // Templates Hype Drink
      case 'energia-foco':
        return <TemplateHypeEnergiaFoco config={config} />
      case 'pre-treino':
        return <TemplateHypePreTreino config={config} />
      case 'rotina-produtiva':
        return <TemplateHypeRotinaProdutiva config={config} />
      case 'constancia':
        return <TemplateHypeConstancia config={config} />
      case 'consumo-cafeina':
        return <TemplateHypeConsumoCafeina config={config} />
      case 'custo-energia':
        return <TemplateHypeCustoEnergia config={config} />
      default:
        // ✅ PADRÃO GENÉRICO: Verificar se o template tem content com questions
        // Se tiver, usar DynamicTemplatePreview automaticamente para TODOS os templates
        // Isso funciona para: perfil-intestino, quiz-energetico, quiz-detox, quiz-bem-estar, etc.
        const hasContent = tool.content && (
          tool.content.template_type === 'quiz' || 
          tool.content.questions || 
          (Array.isArray(tool.content.questions) && tool.content.questions.length > 0) ||
          (tool.content.items && Array.isArray(tool.content.items))
        )
        
        if (hasContent) {
          return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
              <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <DynamicTemplatePreview
                  template={{
                    id: tool.id,
                    nome: tool.title,
                    name: tool.title,
                    slug: tool.template_slug,
                    type: tool.content?.template_type || 'quiz',
                    content: tool.content,
                    description: tool.description,
                    whatsapp_number: tool.whatsapp_number,
                    country_code: tool.user_profiles?.country_code
                  }}
                  profession="wellness"
                  onClose={() => router.push('/pt/wellness/ferramentas')}
                  isPreview={false} // ✅ Link copiado para cliente - SEM explicações para dono
                />
              </main>
            </div>
          )
        }
        
        // Fallback: Template não encontrado ou sem content
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center border-2 border-yellow-200">
              <div className="mb-4">
                <span className="text-yellow-600 text-5xl">⚠️</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Template não encontrado</h2>
              <p className="text-gray-600 mb-4">
                O template "{tool.template_slug}" não está disponível no momento.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {!tool.content ? 'Este template não possui conteúdo configurado.' : 'Entre em contato com o suporte se este problema persistir.'}
              </p>
              <button
                onClick={() => router.push('/pt/wellness/ferramentas')}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Voltar para Meus Links
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Template da Ferramenta */}
      {renderizarTemplate()}
    </div>
  )
}
