'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { normalizeTemplateSlug } from '@/lib/template-slug-map'

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
  show_whatsapp_button?: boolean // Mostrar botão WhatsApp pequeno
  template_slug: string
  content?: {
    leader_data_collection?: {
      enabled?: boolean
      fields?: {
        name?: boolean
        email?: boolean
        phone?: boolean
      }
    }
  }
  user_profiles?: {
    user_slug: string
  }
  users?: {
    name: string
  }
}

// Importar templates dinamicamente com as configurações
// Os templates são compartilhados entre Wellness e Coach
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
const TemplateInitialAssessment = dynamic(() => import('@/app/pt/wellness/templates/initial-assessment/page'), { ssr: false })

export default function FerramentaPersonalizadaCoachPage() {
  const params = useParams()
  const router = useRouter()
  const userSlug = params['user-slug'] as string
  const toolSlug = params['tool-slug'] as string

  const [tool, setTool] = useState<Tool | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    carregarFerramenta()
  }, [userSlug, toolSlug])

  const carregarFerramenta = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `/api/coach/ferramentas/by-url?user_slug=${userSlug}&tool_slug=${toolSlug}`
      )

      if (!response.ok) {
        throw new Error('Ferramenta não encontrada')
      }

      const data = await response.json()
      setTool(data.tool)

      // Incrementar contador de visualizações
      if (data.tool?.id) {
        try {
          await fetch('/api/coach/ferramentas/track-view', {
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
      console.error('Erro ao carregar ferramenta Coach:', err)
      setError(err.message || 'Erro ao carregar ferramenta')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando ferramenta...</p>
        </div>
      </div>
    )
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center border-2 border-red-200">
          <div className="mb-4">
            <span className="text-red-600 text-5xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ferramenta não encontrada</h2>
          <p className="text-gray-600 mb-6">
            {error || 'A ferramenta que você está procurando não existe ou foi removida.'}
          </p>
          <div className="space-y-2">
            <button
              onClick={() => router.push('/pt/coach/home')}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Voltar para Página Inicial
            </button>
            <button
              onClick={() => router.push('/pt/coach/ferramentas')}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Ver Meus Links
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Renderizar template específico com configurações
  const renderizarTemplate = () => {
    // Extrair leader_data_collection do content se existir
    const leaderDataCollection = tool.content?.leader_data_collection
    
    // Passar configurações via props
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
      show_whatsapp_button: tool.show_whatsapp_button !== false, // Mostrar botão WhatsApp pequeno (padrão: true)
      // ✅ Adicionar configuração de coleta de dados (mapear do formato do banco para o formato esperado pelo componente)
      leader_data_collection: leaderDataCollection?.enabled ? {
        coletar_dados: true,
        campos_coleta: {
          nome: leaderDataCollection.fields?.name || false,
          email: leaderDataCollection.fields?.email || false,
          telefone: leaderDataCollection.fields?.phone || false,
        }
      } : undefined,
    }
    
    // Debug: verificar se leader_data_collection está sendo passado
    console.log('🔍 Coach Template - Config passado:', {
      has_leader_data_collection: !!config.leader_data_collection,
      coletar_dados: config.leader_data_collection?.coletar_dados,
      campos_coleta: config.leader_data_collection?.campos_coleta,
      original_content: tool.content?.leader_data_collection
    })

    // ✅ Normalizar template_slug para garantir consistência
    const normalizedSlug = normalizeTemplateSlug(tool.template_slug)

    switch (normalizedSlug) {
      case 'calc-imc':
        return <TemplateIMC config={config} />
      case 'calc-proteina':
        return <TemplateProteina config={config} />
      case 'calc-hidratacao':
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
      case 'template-story-interativo':
      case 'story-interativo':
      case 'quiz-interativo':
        return <TemplateStory config={config} />
      case 'template-avaliacao-inicial':
      case 'avaliacao-inicial':
      case 'avaliação-inicial':
        return <TemplateInitialAssessment config={config} />
      default:
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
                Entre em contato com o suporte se este problema persistir.
              </p>
              <button
                onClick={() => router.push('/pt/coach/ferramentas')}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Voltar para Meus Links
              </button>
            </div>
          </div>
        )
    }
  }

  return renderizarTemplate()
}



