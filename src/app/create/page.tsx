'use client'

import { useState } from 'react'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'

// Novas categorias organizadas por prioridade
const PROFESSIONS = [
  // Prioridade 1: Saúde & Bem-estar
  { id: 'nutricionista', name: 'Nutricionista', category: 'saude-bemestar', icon: '🥗' },
  { id: 'coach-saude', name: 'Coach de Saúde', category: 'saude-bemestar', icon: '💪' },
  { id: 'distribuidor-suplementos', name: 'Distribuidor de Suplementos', category: 'saude-bemestar', icon: '🌿' },
  { id: 'personal-trainer', name: 'Personal Trainer', category: 'saude-bemestar', icon: '🏋️' },
  { id: 'fisioterapeuta', name: 'Fisioterapeuta', category: 'saude-bemestar', icon: '🩺' },
  
  // Prioridade 2: Beleza & Cosméticos
  { id: 'esteticista', name: 'Esteticista', category: 'beleza-cosmeticos', icon: '✨' },
  { id: 'consultor-beleza', name: 'Consultor de Beleza', category: 'beleza-cosmeticos', icon: '💄' },
  { id: 'distribuidor-cosmeticos', name: 'Distribuidor de Cosméticos', category: 'beleza-cosmeticos', icon: '🧴' },
  
  // Outras áreas
  { id: 'coach-executivo', name: 'Coach Executivo', category: 'negocios', icon: '💼' },
  { id: 'vendedor', name: 'Vendedor/Vendas', category: 'negocios', icon: '📈' },
  { id: 'educador', name: 'Educador/Professor', category: 'educacao', icon: '🎓' },
  { id: 'consultor', name: 'Consultor', category: 'servicos', icon: '💡' },
  { id: 'empreendedor', name: 'Empreendedor', category: 'negocios', icon: '🚀' },
]

const OBJECTIVES = {
  'saude-bemestar': [
    'Gerar leads para consultas',
    'Educar sobre nutrição',
    'Vender produtos de saúde',
    'Agendar avaliações',
    'Criar comunidade de bem-estar'
  ],
  'beleza-cosmeticos': [
    'Demonstrar produtos',
    'Agendar consultas de beleza',
    'Educar sobre skincare',
    'Vender cosméticos',
    'Criar tutorial de maquiagem'
  ],
  'negocios': [
    'Gerar leads B2B',
    'Agendar reuniões',
    'Demonstrar produtos',
    'Educar clientes',
    'Fechar vendas'
  ],
  'educacao': [
    'Capturar interessados em cursos',
    'Educar sobre temas',
    'Agendar aulas',
    'Vender cursos online',
    'Criar comunidade de aprendizado'
  ],
  'servicos': [
    'Agendar consultorias',
    'Demonstrar serviços',
    'Educar clientes',
    'Gerar leads qualificados',
    'Fechar contratos'
  ]
}

const TOOL_SUGGESTIONS = {
  'nutricionista': { type: 'quiz', suggestion: 'Quiz de Avaliação Nutricional' },
  'coach-saude': { type: 'quiz', suggestion: 'Quiz de Bem-estar' },
  'distribuidor-suplementos': { type: 'quiz', suggestion: 'Quiz de Suplementos e Nutracêuticos' },
  'personal-trainer': { type: 'quiz', suggestion: 'Quiz de Condicionamento Físico' },
  'fisioterapeuta': { type: 'quiz', suggestion: 'Quiz de Avaliação Postural' },
  'esteticista': { type: 'quiz', suggestion: 'Quiz de Cuidados com a Pele' },
  'consultor-beleza': { type: 'quiz', suggestion: 'Quiz de Tipo de Pele' },
  'distribuidor-cosmeticos': { type: 'quiz', suggestion: 'Quiz de Produtos Cosméticos' },
  'coach-executivo': { type: 'quiz', suggestion: 'Quiz de Desenvolvimento Profissional' },
  'vendedor': { type: 'quiz', suggestion: 'Quiz de Necessidades do Cliente' },
  'educador': { type: 'quiz', suggestion: 'Quiz Educacional' },
  'consultor': { type: 'quiz', suggestion: 'Quiz de Avaliação de Necessidades' },
  'empreendedor': { type: 'quiz', suggestion: 'Quiz de Perfil Empreendedor' }
}

export default function CreatePage() {
  const [step, setStep] = useState(1)
  const [selectedProfession, setSelectedProfession] = useState('')
  const [selectedObjective, setSelectedObjective] = useState('')
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLink, setGeneratedLink] = useState('')

  const handleProfessionSelect = (professionId: string) => {
    setSelectedProfession(professionId)
    setStep(2)
  }

  const handleObjectiveSelect = (objective: string) => {
    setSelectedObjective(objective)
    setStep(3)
  }

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    try {
      const profession = PROFESSIONS.find(p => p.id === selectedProfession)
      const toolSuggestion = TOOL_SUGGESTIONS[selectedProfession as keyof typeof TOOL_SUGGESTIONS]

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          profession: profession?.name,
          category: profession?.category,
          type: toolSuggestion?.type || 'quiz',
          objective: selectedObjective
        }),
      })

      const data = await response.json()

      if (data.success) {
        setGeneratedLink(data.data.url)
        setStep(4)
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
    setSelectedObjective('')
    setPrompt('')
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
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    step >= stepNumber 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 4 && (
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {PROFESSIONS.map((profession) => (
                  <button
                    key={profession.id}
                    onClick={() => handleProfessionSelect(profession.id)}
                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="text-2xl mb-2">{profession.icon}</div>
                    <div className="font-semibold text-gray-900">{profession.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Objetivo */}
          {step === 2 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Qual seu objetivo?
              </h2>
              <div className="space-y-3">
                {OBJECTIVES[PROFESSIONS.find(p => p.id === selectedProfession)?.category as keyof typeof OBJECTIVES]?.map((objective) => (
                  <button
                    key={objective}
                    onClick={() => handleObjectiveSelect(objective)}
                    className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="font-semibold text-gray-900">{objective}</div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                className="mt-6 text-blue-600 hover:text-blue-800"
              >
                ← Voltar
              </button>
            </div>
          )}

          {/* Step 3: Prompt */}
          {step === 3 && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Descreva o que você precisa
              </h2>
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Sugestão:</strong> {TOOL_SUGGESTIONS[selectedProfession as keyof typeof TOOL_SUGGESTIONS]?.suggestion}
                </p>
              </div>
              <textarea
                className="w-full p-4 border border-gray-300 rounded-lg mb-4 focus:ring-blue-500 focus:border-blue-500"
                rows={5}
                placeholder={`Ex: Quero um quiz de avaliação nutricional para capturar leads interessados em emagrecimento saudável.`}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isGenerating}
              />
              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  ← Voltar
                </button>
                <button
                  onClick={handleGenerate}
                  className={`flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors ${
                    isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  disabled={isGenerating}
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Link em 60 Segundos'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Resultado */}
          {step === 4 && generatedLink && (
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