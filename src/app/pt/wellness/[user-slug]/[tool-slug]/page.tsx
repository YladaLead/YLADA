'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

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
  }
  users?: {
    name: string
  }
}

// Importar templates dinamicamente com as configurações
const TemplateIMC = dynamic(() => import('@/app/pt/wellness/templates/imc/page'), { ssr: false })
const TemplateProteina = dynamic(() => import('@/app/pt/wellness/templates/proteina/page'), { ssr: false })
const TemplateHidratacao = dynamic(() => import('@/app/pt/wellness/templates/hidratacao/page'), { ssr: false })
const TemplateComposicao = dynamic(() => import('@/app/pt/wellness/templates/composicao/page'), { ssr: false })
const TemplateGanhos = dynamic(() => import('@/app/pt/wellness/templates/ganhos/page'), { ssr: false })
const TemplatePotencial = dynamic(() => import('@/app/pt/wellness/templates/potencial/page'), { ssr: false })
const TemplateProposito = dynamic(() => import('@/app/pt/wellness/templates/proposito/page'), { ssr: false })
const TemplateParasitas = dynamic(() => import('@/app/pt/wellness/templates/parasitas/page'), { ssr: false })
const TemplateAlimentacao = dynamic(() => import('@/app/pt/wellness/templates/healthy-eating/page'), { ssr: false })
const TemplateWellnessProfile = dynamic(() => import('@/app/pt/wellness/templates/wellness-profile/page'), { ssr: false })
const TemplateNutritionAssessment = dynamic(() => import('@/app/pt/wellness/templates/nutrition-assessment/page'), { ssr: false })
const TemplateDailyWellness = dynamic(() => import('@/app/pt/wellness/templates/daily-wellness/page'), { ssr: false })
const TemplateMealPlanner = dynamic(() => import('@/app/pt/wellness/templates/meal-planner/page'), { ssr: false })

export default function FerramentaPersonalizadaPage() {
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
        `/api/wellness/ferramentas/by-url?user_slug=${userSlug}&tool_slug=${toolSlug}`
      )

      if (!response.ok) {
        throw new Error('Ferramenta não encontrada')
      }

      const data = await response.json()
      setTool(data.tool)
    } catch (err: any) {
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Ferramenta não encontrada'}</p>
          <button
            onClick={() => router.push('/pt/wellness')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    )
  }

  // Renderizar template específico com configurações
  const renderizarTemplate = () => {
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
    }

    switch (tool.template_slug) {
      case 'calc-imc':
        return <TemplateIMC config={config} />
      case 'calc-proteina':
        return <TemplateProteina config={config} />
      case 'calc-hidratacao':
        return <TemplateHidratacao config={config} />
      case 'calc-composicao':
        return <TemplateComposicao config={config} />
      case 'quiz-ganhos':
        return <TemplateGanhos config={config} />
      case 'quiz-potencial':
        return <TemplatePotencial config={config} />
      case 'quiz-proposito':
        return <TemplateProposito config={config} />
      case 'quiz-parasitas':
        return <TemplateParasitas config={config} />
      case 'quiz-alimentacao':
        return <TemplateAlimentacao config={config} />
      case 'quiz-wellness-profile':
        return <TemplateWellnessProfile config={config} />
      case 'quiz-nutrition-assessment':
        return <TemplateNutritionAssessment config={config} />
      case 'tabela-daily-wellness':
      case 'planilha-daily-wellness':
        return <TemplateDailyWellness config={config} />
      case 'planilha-meal-planner':
        return <TemplateMealPlanner config={config} />
      default:
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Template não encontrado: {tool.template_slug}</p>
              <button
                onClick={() => router.push('/pt/wellness')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Voltar ao Dashboard
              </button>
            </div>
          </div>
        )
    }
  }

  return renderizarTemplate()
}
