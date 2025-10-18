'use client'

import { useState } from 'react'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'

// Templates pré-definidos por segmento
const TEMPLATES = {
  'nutricionista': [
    { id: 'quiz-avaliacao-nutricional', name: 'Quiz de Avaliação Nutricional', type: 'quiz', description: 'Avalie hábitos alimentares e necessidades nutricionais' },
    { id: 'calculadora-imc', name: 'Calculadora de IMC', type: 'calculator', description: 'Calcule índice de massa corporal e classificação' },
    { id: 'plano-alimentar', name: 'Plano Alimentar Personalizado', type: 'form', description: 'Crie plano alimentar baseado em objetivos' },
    { id: 'diario-alimentar', name: 'Diário Alimentar', type: 'tracker', description: 'Registre refeições e acompanhe progresso' }
  ],
  'fisioterapeuta': [
    { id: 'quiz-avaliacao-postural', name: 'Quiz de Avaliação Postural', type: 'quiz', description: 'Identifique problemas posturais e dores' },
    { id: 'teste-flexibilidade', name: 'Teste de Flexibilidade', type: 'quiz', description: 'Avalie amplitude de movimento articular' },
    { id: 'avaliacao-dor', name: 'Avaliação de Dor Muscular', type: 'quiz', description: 'Identifique origem e intensidade da dor' },
    { id: 'plano-exercicios', name: 'Plano de Exercícios', type: 'form', description: 'Crie rotina de exercícios terapêuticos' }
  ],
  'personal-trainer': [
    { id: 'quiz-condicionamento', name: 'Quiz de Condicionamento Físico', type: 'quiz', description: 'Avalie nível de condicionamento atual' },
    { id: 'teste-forca', name: 'Teste de Força', type: 'quiz', description: 'Meça força muscular e resistência' },
    { id: 'objetivos-fitness', name: 'Definir Objetivos Fitness', type: 'form', description: 'Estabeleça metas de treinamento' },
    { id: 'plano-treino', name: 'Plano de Treino', type: 'form', description: 'Crie programa de exercícios personalizado' }
  ],
  'distribuidor-suplementos': [
    { id: 'quiz-necessidades-nutricionais', name: 'Quiz de Necessidades Nutricionais', type: 'quiz', description: 'Identifique necessidades de suplementação' },
    { id: 'avaliacao-produtos', name: 'Avaliação de Produtos', type: 'quiz', description: 'Recomende produtos baseado no perfil' },
    { id: 'calculadora-dosagem', name: 'Calculadora de Dosagem', type: 'calculator', description: 'Calcule dosagem ideal de suplementos' },
    { id: 'plano-suplementacao', name: 'Plano de Suplementação', type: 'form', description: 'Crie cronograma de suplementação' }
  ],
  'esteticista': [
    { id: 'quiz-tipo-pele', name: 'Quiz de Tipo de Pele', type: 'quiz', description: 'Identifique tipo e necessidades da pele' },
    { id: 'avaliacao-facial', name: 'Avaliação Facial', type: 'quiz', description: 'Avalie condições da pele facial' },
    { id: 'rotina-skincare', name: 'Rotina de Skincare', type: 'form', description: 'Crie rotina personalizada de cuidados' },
    { id: 'agendamento-tratamento', name: 'Agendamento de Tratamento', type: 'form', description: 'Agende consulta e tratamento' }
  ],
  'consultor-beleza': [
    { id: 'quiz-estilo', name: 'Quiz de Estilo Pessoal', type: 'quiz', description: 'Descubra estilo e preferências de beleza' },
    { id: 'avaliacao-maquiagem', name: 'Avaliação de Maquiagem', type: 'quiz', description: 'Identifique tons e produtos ideais' },
    { id: 'tutorial-produtos', name: 'Tutorial de Produtos', type: 'form', description: 'Demonstre uso de produtos cosméticos' },
    { id: 'consultoria-beleza', name: 'Consultoria de Beleza', type: 'form', description: 'Agende consultoria personalizada' }
  ],
  'distribuidor-cosmeticos': [
    { id: 'quiz-necessidades-beleza', name: 'Quiz de Necessidades de Beleza', type: 'quiz', description: 'Identifique necessidades cosméticas' },
    { id: 'avaliacao-produtos-cosmeticos', name: 'Avaliação de Produtos Cosméticos', type: 'quiz', description: 'Recomende produtos baseado no perfil' },
    { id: 'demonstracao-produtos', name: 'Demonstração de Produtos', type: 'form', description: 'Demonstre benefícios dos produtos' },
    { id: 'plano-beleza', name: 'Plano de Beleza', type: 'form', description: 'Crie rotina completa de beleza' }
  ],
  'dermatologista': [
    { id: 'quiz-avaliacao-dermatologica', name: 'Quiz de Avaliação Dermatológica', type: 'quiz', description: 'Avalie condições da pele e cabelo' },
    { id: 'teste-sensibilidade', name: 'Teste de Sensibilidade', type: 'quiz', description: 'Identifique sensibilidades cutâneas' },
    { id: 'agendamento-consulta', name: 'Agendamento de Consulta', type: 'form', description: 'Agende consulta dermatológica' },
    { id: 'prescricao-tratamento', name: 'Prescrição de Tratamento', type: 'form', description: 'Prescreva tratamento personalizado' }
  ]
}

// Profissões simplificadas - APENAS AS MAIS ÓBVIAS
const PROFESSIONS = [
  // Profissões mais óbvias e comuns
  { id: 'nutricionista', name: 'Nutricionista', category: 'saude-bemestar', icon: '🥗', status: 'active' },
  { id: 'personal-trainer', name: 'Personal Trainer', category: 'saude-bemestar', icon: '🏋️', status: 'active' },
  { id: 'fisioterapeuta', name: 'Fisioterapeuta', category: 'saude-bemestar', icon: '🩺', status: 'active' },
  { id: 'distribuidor-suplementos', name: 'Distribuidor de Suplementos', category: 'saude-bemestar', icon: '🌿', status: 'active' },
  { id: 'esteticista', name: 'Esteticista', category: 'beleza-cosmeticos', icon: '✨', status: 'active' },
  
  // Opção para outros casos
  { id: 'outro', name: 'Outro', category: 'outros', icon: '✏️', status: 'custom' }
]


export default function CreatePage() {
  const [step, setStep] = useState(1)
  const [selectedProfession, setSelectedProfession] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')
  const [currentSlide, setCurrentSlide] = useState(0)

  const handleProfessionSelect = (professionId: string) => {
    const profession = PROFESSIONS.find(p => p.id === professionId)
    
    if (profession?.status === 'coming-soon') {
      alert('Esta área está em construção! Em breve teremos templates específicos para esta profissão.')
      return
    }
    
    if (profession?.status === 'custom') {
      // Para "Outro", ir direto para criação personalizada
      setSelectedProfession('outro')
      setStep(2)
      return
    }
    
    setSelectedProfession(professionId)
    setStep(2)
  }

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)

    try {
      const profession = PROFESSIONS.find(p => p.id === selectedProfession)
      const template = TEMPLATES[selectedProfession as keyof typeof TEMPLATES]?.find(t => t.id === selectedTemplate)
      
      // Se não selecionou template, usar prompt personalizado
      const finalPrompt = selectedTemplate 
        ? `${template?.name}: ${template?.description}` 
        : customPrompt

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: finalPrompt,
          profession: profession?.name,
          category: profession?.category,
          type: template?.type || 'quiz',
          templateId: selectedTemplate
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedLink(data.data.url)
        setStep(3)
      } else {
        throw new Error(data.error || 'Erro ao gerar link')
      }
    } catch (error) {
      console.error('Erro ao gerar link:', error)
      alert('Erro ao gerar link. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const resetForm = () => {
    setStep(1)
    setSelectedProfession('')
    setSelectedTemplate('')
    setCustomPrompt('')
    setGeneratedLink('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <YLADALogo />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Crie seu link inteligente com IA
            </h1>
            <p className="text-lg text-gray-600">
              Vamos personalizar sua ferramenta de geração de leads
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= stepNumber 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-8 h-0.5 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Profissão */}
          {step === 1 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                O que você é?
              </h2>
              {/* Mobile-First Carousel */}
              <div className="relative">
                {/* Cards Container */}
                <div className="overflow-hidden">
                  <div 
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {/* Slide 1: Primeiras 3 profissões */}
                    <div className="w-full flex-shrink-0 px-2">
                      <div className="grid grid-cols-1 gap-4">
                        {PROFESSIONS.slice(0, 3).map((profession) => (
                          <button
                            key={profession.id}
                            onClick={() => handleProfessionSelect(profession.id)}
                            className={`p-6 border-2 rounded-xl transition-all text-left relative ${
                              profession.status === 'coming-soon'
                                ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                            }`}
                            disabled={profession.status === 'coming-soon'}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="text-4xl">{profession.icon}</div>
                              <div className="font-semibold text-gray-900 text-lg">{profession.name}</div>
                            </div>
                            {profession.status === 'coming-soon' && (
                              <div className="absolute top-2 right-2">
                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                  Em breve
                                </span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Slide 2: Últimas 3 profissões */}
                    <div className="w-full flex-shrink-0 px-2">
                      <div className="grid grid-cols-1 gap-4">
                        {PROFESSIONS.slice(3).map((profession) => (
                          <button
                            key={profession.id}
                            onClick={() => handleProfessionSelect(profession.id)}
                            className={`p-6 border-2 rounded-xl transition-all text-left relative ${
                              profession.status === 'coming-soon'
                                ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                                : 'border-gray-200 hover:border-blue-500 hover:bg-blue-50'
                            }`}
                            disabled={profession.status === 'coming-soon'}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="text-4xl">{profession.icon}</div>
                              <div className="font-semibold text-gray-900 text-lg">{profession.name}</div>
                            </div>
                            {profession.status === 'coming-soon' && (
                              <div className="absolute top-2 right-2">
                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                  Em breve
                                </span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation Dots */}
                <div className="flex justify-center mt-6 space-x-2">
                  {[0, 1].map((index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        currentSlide === index ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                  disabled={currentSlide === 0}
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setCurrentSlide(Math.min(1, currentSlide + 1))}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
                  disabled={currentSlide === 1}
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Templates ou Personalizado */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              {selectedProfession === 'outro' ? (
                // Interface para "Outro"
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Descreva sua profissão e o que você precisa
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sua profissão:
                      </label>
                      <input
                        type="text"
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Ex: Coach de Vida, Consultor Financeiro, etc."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        disabled={isGenerating}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        O que você quer criar:
                      </label>
                      <textarea
                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        rows={4}
                        placeholder="Ex: Quero um quiz de avaliação financeira para capturar leads interessados em investimentos..."
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        disabled={isGenerating}
                      />
                    </div>
                  </div>
                </>
              ) : (
                // Interface normal com templates
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                    Escolha um template ou crie personalizado
                  </h2>
                  
                  {/* Templates Pré-definidos */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Templates Recomendados:</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {TEMPLATES[selectedProfession as keyof typeof TEMPLATES]?.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateSelect(template.id)}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            selectedTemplate === template.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl">
                              {template.type === 'quiz' ? '❓' : 
                               template.type === 'calculator' ? '🧮' : 
                               template.type === 'form' ? '📝' : 
                               template.type === 'tracker' ? '📊' : '📋'}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
                              <p className="text-sm text-gray-600">{template.description}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Opção Personalizada */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Ou crie algo personalizado:</h3>
                    <textarea
                      className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Descreva exatamente o que você precisa..."
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      disabled={isGenerating}
                    />
                  </div>
                </>
              )}

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  onClick={handleGenerate}
                  className={`flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors ${
                    isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isGenerating || (!selectedTemplate && !customPrompt.trim())}
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Link em 60 Segundos'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Resultado */}
          {step === 3 && generatedLink && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Link Gerado com Sucesso!
                </h2>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
                  <Link href={generatedLink} target="_blank" className="text-blue-600 hover:underline break-all">
                    {generatedLink}
                  </Link>
                </div>
                <p className="text-gray-600 mb-6">
                  Compartilhe este link para começar a gerar leads.
                </p>
                <button
                  onClick={resetForm}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Criar Outro Link
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>© 2024 YLADA. Transformando ideias em links inteligentes.</p>
        </div>
      </footer>
    </div>
  )
}