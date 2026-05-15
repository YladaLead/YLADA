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
  custom_colors: { principal: string; secundaria: string }
  cta_type: 'whatsapp' | 'url_externa'
  whatsapp_number?: string
  external_url?: string
  cta_button_text: string
  custom_whatsapp_message?: string
  show_whatsapp_button?: boolean
  template_slug: string
  content?: {
    leader_data_collection?: {
      enabled?: boolean
      fields?: { name?: boolean; email?: boolean; phone?: boolean }
    }
  }
  user_profiles?: { user_slug: string }
  users?: { name: string }
}

// Templates compartilhados com wellness
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

export default function FerramentaCoachBemEstarPage() {
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
      // Coach-bem-estar compartilha infraestrutura de ferramentas com wellness
      const response = await fetch(
        `/api/wellness/ferramentas/by-url?user_slug=${userSlug}&tool_slug=${toolSlug}`
      )
      if (!response.ok) throw new Error('Ferramenta não encontrada')
      const data = await response.json()
      setTool(data.tool)

      // Rastrear visualização no sistema unificado (link_events)
      if (data.tool?.id) {
        fetch('/api/link-events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_type: 'view',
            link_source: 'user_template',
            link_id: data.tool.id,
            area: 'coach-bem-estar',
          }),
        }).catch(() => {})
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar ferramenta'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto" />
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (error || !tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center border-2 border-red-200">
          <span className="text-red-600 text-5xl">⚠️</span>
          <h2 className="mt-4 text-xl font-bold text-gray-900">Ferramenta não encontrada</h2>
          <p className="mt-2 text-gray-600">
            {error || 'Este link não existe ou foi removido.'}
          </p>
          <button
            onClick={() => router.push('/pt/coach-bem-estar/home')}
            className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            Voltar para Página Inicial
          </button>
        </div>
      </div>
    )
  }

  const leaderDataCollection = tool.content?.leader_data_collection
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
    show_whatsapp_button: tool.show_whatsapp_button !== false,
    leader_data_collection: leaderDataCollection?.enabled
      ? {
          coletar_dados: true,
          campos_coleta: {
            nome: leaderDataCollection.fields?.name || false,
            email: leaderDataCollection.fields?.email || false,
            telefone: leaderDataCollection.fields?.phone || false,
          },
        }
      : undefined,
  }

  const normalizedSlug = normalizeTemplateSlug(tool.template_slug)

  switch (normalizedSlug) {
    case 'calc-imc':                         return <TemplateIMC config={config} />
    case 'calc-proteina':                    return <TemplateProteina config={config} />
    case 'calc-hidratacao':                  return <TemplateHidratacao config={config} />
    case 'calc-calorias':                    return <TemplateCalorias config={config} />
    case 'quiz-ganhos':                      return <TemplateGanhos config={config} />
    case 'quiz-potencial':                   return <TemplatePotencial config={config} />
    case 'quiz-proposito':                   return <TemplateProposito config={config} />
    case 'quiz-alimentacao':                 return <TemplateAlimentacao config={config} />
    case 'quiz-wellness-profile':            return <TemplateWellnessProfile config={config} />
    case 'template-desafio-7dias':
    case 'desafio-7-dias':                   return <Template7DayChallenge config={config} />
    case 'template-desafio-21dias':
    case 'desafio-21-dias':                  return <Template21DayChallenge config={config} />
    case 'guia-hidratacao':                  return <TemplateHydrationGuide config={config} />
    case 'avaliacao-intolerancia':
    case 'quiz-intolerancia':
    case 'intolerancia':                     return <TemplateIntoleranceAssessment config={config} />
    case 'avaliacao-perfil-metabolico':
    case 'quiz-perfil-metabolico':
    case 'perfil-metabolico':                return <TemplateMetabolicProfileAssessment config={config} />
    case 'diagnostico-eletrolitos':
    case 'quiz-eletrolitos':
    case 'eletrolitos':                      return <TemplateElectrolyteDiagnosis config={config} />
    case 'diagnostico-sintomas-intestinais':
    case 'sintomas-intestinais':             return <TemplateIntestinalSymptomsDiagnosis config={config} />
    case 'pronto-emagrecer':
    case 'quiz-pronto-emagrecer':            return <TemplateReadyToLoseWeight config={config} />
    case 'tipo-fome':
    case 'quiz-tipo-fome':
    case 'quiz-fome-emocional':
    case 'fome-emocional':                   return <TemplateHungerType config={config} />
    case 'alimentacao-saudavel':
    case 'quiz-alimentacao-saudavel':
    case 'healthy-eating-quiz':
    case 'healthy-eating':                   return <TemplateHealthyEatingQuiz config={config} />
    case 'sindrome-metabolica':
    case 'risco-sindrome-metabolica':
    case 'metabolic-syndrome-risk':          return <TemplateMetabolicSyndromeRisk config={config} />
    case 'retencao-liquidos':
    case 'teste-retencao-liquidos':
    case 'water-retention-test':             return <TemplateWaterRetentionTest config={config} />
    case 'conhece-seu-corpo':
    case 'voce-conhece-seu-corpo':
    case 'body-awareness':                   return <TemplateBodyAwareness config={config} />
    case 'nutrido-vs-alimentado':
    case 'nourished-vs-fed':                 return <TemplateNourishedVsFed config={config} />
    case 'alimentacao-rotina':
    case 'eating-routine':                   return <TemplateEatingRoutine config={config} />
    case 'ganhos-prosperidade':
    case 'gains-and-prosperity':             return <TemplateGainsAndProsperity config={config} />
    case 'potencial-crescimento':
    case 'potential-and-growth':             return <TemplatePotentialAndGrowth config={config} />
    case 'proposito-equilibrio':
    case 'purpose-and-balance':              return <TemplatePurposeAndBalance config={config} />
    case 'template-story-interativo':
    case 'story-interativo':                 return <TemplateStory config={config} />
    case 'template-avaliacao-inicial':
    case 'avaliacao-inicial':                return <TemplateInitialAssessment config={config} />
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center border-2 border-yellow-200">
            <span className="text-yellow-600 text-5xl">⚠️</span>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Template não disponível</h2>
            <p className="mt-2 text-gray-600 text-sm">
              O template "{tool.template_slug}" não está configurado neste vertical.
            </p>
            <button
              onClick={() => router.push('/pt/coach-bem-estar/links')}
              className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              Ver meus links
            </button>
          </div>
        </div>
      )
  }
}
