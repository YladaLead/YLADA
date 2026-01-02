'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Video, ArrowRight, Sparkles, Target, Zap, TrendingUp } from 'lucide-react'

type Area = 'nutri' | 'coach' | 'wellness' | 'nutra'
type VideoPurpose = 'quick-ad' | 'sales-page' | 'educational' | 'testimonial' | 'custom'

interface AreaConfig {
  name: string
  description: string
  icon: string
  color: string
}

interface PurposeConfig {
  name: string
  description: string
  duration: string
  structure: string[]
  icon: React.ReactNode
}

const areas: Record<Area, AreaConfig> = {
  nutri: {
    name: 'YLADA NUTRI',
    description: 'Vídeos para nutricionistas',
    icon: '🥗',
    color: 'bg-green-500',
  },
  coach: {
    name: 'YLADA COACH',
    description: 'Vídeos para personal trainers',
    icon: '💪',
    color: 'bg-orange-500',
  },
  wellness: {
    name: 'YLADA WELLNESS',
    description: 'Vídeos para bem-estar',
    icon: '🌿',
    color: 'bg-blue-500',
  },
  nutra: {
    name: 'YLADA NUTRA',
    description: 'Vídeos para nutrição',
    icon: '🍎',
    color: 'bg-yellow-500',
  },
}

const purposes: Record<VideoPurpose, PurposeConfig> = {
  'quick-ad': {
    name: 'Anúncio Rápido',
    description: 'Vídeo curto para Instagram/Facebook (15-30s)',
    duration: '15-30 segundos',
    structure: ['Hook impactante', 'Problema', 'Solução', 'CTA'],
    icon: <Zap className="w-6 h-6" />,
  },
  'sales-page': {
    name: 'Página de Vendas',
    description: 'Vídeo completo de vendas (60-120s)',
    duration: '60-120 segundos',
    structure: ['Hook', 'Problema ampliado', 'Solução detalhada', 'Prova social', 'CTA forte'],
    icon: <TrendingUp className="w-6 h-6" />,
  },
  'educational': {
    name: 'Conteúdo Educativo',
    description: 'Vídeo educativo para engajamento (30-60s)',
    duration: '30-60 segundos',
    structure: ['Título/Hook', 'Conteúdo educativo', 'CTA suave'],
    icon: <Sparkles className="w-6 h-6" />,
  },
  'testimonial': {
    name: 'Depoimento',
    description: 'Vídeo de prova social (30-45s)',
    duration: '30-45 segundos',
    structure: ['Apresentação', 'Resultado', 'Transformação', 'CTA'],
    icon: <Target className="w-6 h-6" />,
  },
  'custom': {
    name: 'Personalizado',
    description: 'Defina seu próprio objetivo',
    duration: 'Variável',
    structure: ['Personalizado'],
    icon: <Video className="w-6 h-6" />,
  },
}

export default function CreativeStudioPage() {
  const router = useRouter()
  const [selectedArea, setSelectedArea] = useState<Area | null>(null)
  const [selectedPurpose, setSelectedPurpose] = useState<VideoPurpose | null>(null)
  const [customObjective, setCustomObjective] = useState('')

  const handleContinue = () => {
    if (!selectedArea || !selectedPurpose) return

    const params = new URLSearchParams({
      mode: 'create',
      area: selectedArea,
      purpose: selectedPurpose,
    })

    if (selectedPurpose === 'custom' && customObjective) {
      params.set('objective', customObjective)
    }

    router.push(`/pt/creative-studio/editor?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎬 Creative Studio
          </h1>
          <p className="text-xl text-gray-600">
            Crie vídeos de marketing/vendas profissionais em minutos
          </p>
        </div>

        {/* Step 1: Selecionar Área */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
              1
            </span>
            Para qual área você quer criar o vídeo?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(areas) as Area[]).map((area) => {
              const config = areas[area]
              const isSelected = selectedArea === area
              return (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`
                    p-6 rounded-xl border-2 transition-all text-left
                    ${isSelected
                      ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                    }
                  `}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">{config.icon}</span>
                    <div>
                      <h3 className="font-bold text-gray-900">{config.name}</h3>
                      <p className="text-sm text-gray-600">{config.description}</p>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Step 2: Selecionar Propósito */}
        {selectedArea && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              Qual é o propósito do vídeo?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(Object.keys(purposes) as VideoPurpose[]).map((purpose) => {
                const config = purposes[purpose]
                const isSelected = selectedPurpose === purpose
                return (
                  <button
                    key={purpose}
                    onClick={() => setSelectedPurpose(purpose)}
                    className={`
                      p-6 rounded-xl border-2 transition-all text-left
                      ${isSelected
                        ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {config.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{config.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{config.description}</p>
                        <p className="text-xs text-purple-600 font-medium">Duração: {config.duration}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 font-medium mb-1">Estrutura:</p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {config.structure.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-purple-600 rounded-full"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Campo customizado */}
            {selectedPurpose === 'custom' && (
              <div className="mt-6 p-6 bg-white rounded-xl border-2 border-purple-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descreva o objetivo do vídeo:
                </label>
                <textarea
                  value={customObjective}
                  onChange={(e) => setCustomObjective(e.target.value)}
                  placeholder="Ex: Vídeo de lançamento de novo produto, vídeo de boas-vindas, etc."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            )}
          </div>
        )}

        {/* Botão Continuar */}
        {selectedArea && selectedPurpose && (
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              Continuar para o Editor
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Preview do que será criado */}
        {selectedArea && selectedPurpose && (
          <div className="mt-8 p-6 bg-white rounded-xl border-2 border-purple-200">
            <h3 className="font-bold text-gray-900 mb-3">📋 Resumo do que será criado:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Área:</strong> {areas[selectedArea].name}</p>
              <p><strong>Propósito:</strong> {purposes[selectedPurpose].name}</p>
              <p><strong>Duração:</strong> {purposes[selectedPurpose].duration}</p>
              <p><strong>Estrutura:</strong> {purposes[selectedPurpose].structure.join(' → ')}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
