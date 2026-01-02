'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Video, Image, FileText, Sparkles, TrendingUp, Target, Users, Zap, ArrowRight } from 'lucide-react'

interface AdTemplate {
  id: string
  title: string
  description: string
  type: 'video' | 'image' | 'carousel' | 'story'
  duration?: string
  objective: 'atrair' | 'educar' | 'converter' | 'fidelizar'
  hook: string
  cta: string
}

const templates: AdTemplate[] = [
  // VÍDEOS CURTOS (15-30s) - ATRAIR
  {
    id: 'video-1',
    title: 'Como Conseguir 291 Leads em 30 Dias',
    description: 'Vídeo de case de sucesso - 15s',
    type: 'video',
    duration: '15s',
    objective: 'atrair',
    hook: 'Como a Dra. Ana conseguiu 291 leads qualificados em apenas 30 dias usando a YLADA',
    cta: 'Comece grátis por 7 dias →',
  },
  {
    id: 'video-2',
    title: 'Pare de Perder Clientes',
    description: 'Vídeo problema/solução - 30s',
    type: 'video',
    duration: '30s',
    objective: 'atrair',
    hook: '73% dos nutricionistas faturam menos de R$ 5.000/mês. Não por falta de conhecimento, mas por falta de ferramentas',
    cta: 'Veja como mudar isso →',
  },
  {
    id: 'video-3',
    title: 'Automatize Sua Captação',
    description: 'Vídeo demonstrativo - 20s',
    type: 'video',
    duration: '20s',
    objective: 'atrair',
    hook: 'Quizzes automáticos que capturam leads enquanto você dorme',
    cta: 'Teste grátis →',
  },
  // VÍDEOS EDUCACIONAIS (60s) - EDUCAR
  {
    id: 'video-4',
    title: 'Como Funciona a YLADA',
    description: 'Vídeo explicativo completo - 60s',
    type: 'video',
    duration: '60s',
    objective: 'educar',
    hook: 'A plataforma completa para nutricionistas que querem escalar seu negócio',
    cta: 'Assista a demonstração completa →',
  },
  {
    id: 'video-5',
    title: 'Templates Prontos para Nutri',
    description: 'Vídeo mostrando templates - 45s',
    type: 'video',
    duration: '45s',
    objective: 'educar',
    hook: '29 templates prontos: quizzes, calculadoras, planilhas e muito mais',
    cta: 'Ver todos os templates →',
  },
  // CARROSSÉIS/STORIES - CONVERTER
  {
    id: 'carousel-1',
    title: '5 Benefícios da YLADA',
    description: 'Carrossel Instagram - 5 slides',
    type: 'carousel',
    objective: 'converter',
    hook: '5 motivos pelos quais nutricionistas estão migrando para YLADA',
    cta: 'Comece agora →',
  },
  {
    id: 'carousel-2',
    title: 'Antes vs Depois',
    description: 'Carrossel comparativo - 4 slides',
    type: 'carousel',
    objective: 'converter',
    hook: 'Veja a diferença que a YLADA faz no seu negócio',
    cta: 'Transforme seu negócio →',
  },
  // IMAGENS ESTÁTICAS - FIDELIZAR
  {
    id: 'image-1',
    title: 'Dica do Dia: Captação',
    description: 'Post educativo - Instagram',
    type: 'image',
    objective: 'fidelizar',
    hook: '3 estratégias para captar mais leads como nutricionista',
    cta: 'Salve este post!',
  },
  {
    id: 'image-2',
    title: 'Estatísticas Nutri',
    description: 'Infográfico - Instagram',
    type: 'image',
    objective: 'atrair',
    hook: '73% dos nutricionistas não usam ferramentas digitais',
    cta: 'Seja parte dos 27% →',
  },
]

export default function TemplatesPage() {
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)

  const filteredTemplates = templates.filter((template) => {
    if (selectedObjective && template.objective !== selectedObjective) return false
    if (selectedType && template.type !== selectedType) return false
    return true
  })

  const objectives = [
    { id: 'atrair', label: 'Atrair', icon: Target, color: 'green' },
    { id: 'educar', label: 'Educar', icon: Sparkles, color: 'blue' },
    { id: 'converter', label: 'Converter', icon: TrendingUp, color: 'purple' },
    { id: 'fidelizar', label: 'Fidelizar', icon: Users, color: 'orange' },
  ]

  const types = [
    { id: 'video', label: 'Vídeos', icon: Video, count: templates.filter((t) => t.type === 'video').length },
    { id: 'image', label: 'Imagens', icon: Image, count: templates.filter((t) => t.type === 'image').length },
    { id: 'carousel', label: 'Carrosséis', icon: FileText, count: templates.filter((t) => t.type === 'carousel').length },
    { id: 'story', label: 'Stories', icon: Zap, count: templates.filter((t) => t.type === 'story').length },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/pt/creative-studio"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Creative Studio
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📋 Templates de Anúncios
          </h1>
          <p className="text-lg text-gray-600">
            Templates prontos para criar anúncios que atraem nutricionistas. Vídeos curtos, carrosséis e posts.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por:</h2>
          
          {/* Objetivo */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Objetivo</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedObjective(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedObjective === null
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              {objectives.map((obj) => {
                const Icon = obj.icon
                return (
                  <button
                    key={obj.id}
                    onClick={() => setSelectedObjective(obj.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedObjective === obj.id
                        ? `bg-${obj.color}-600 text-white`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {obj.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tipo */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Tipo de Material</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedType(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === null
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              {types.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      selectedType === type.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label} ({type.count})
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const objective = objectives.find((o) => o.id === template.objective)
            const type = types.find((t) => t.id === template.type)
            const ObjectiveIcon = objective?.icon || Target
            const TypeIcon = type?.icon || Video

            return (
              <Link
                key={template.id}
                href={`/pt/creative-studio/templates/${template.id}`}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    template.type === 'video' ? 'bg-blue-100' :
                    template.type === 'image' ? 'bg-green-100' :
                    template.type === 'carousel' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <TypeIcon className={`w-6 h-6 ${
                      template.type === 'video' ? 'text-blue-600' :
                      template.type === 'image' ? 'text-green-600' :
                      template.type === 'carousel' ? 'text-purple-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  {template.duration && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {template.duration}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {template.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {template.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs">
                    <ObjectiveIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 capitalize">{template.objective}</span>
                  </div>
                  <div className="text-xs text-gray-500 italic">
                    "{template.hook}"
                  </div>
                </div>

                <div className="flex items-center text-purple-600 font-medium group-hover:text-purple-700">
                  Usar template <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

