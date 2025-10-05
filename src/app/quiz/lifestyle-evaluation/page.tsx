'use client'

import { useState } from 'react'
import { 
  Calculator, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Heart,
  Activity,
  Target,
  Share2,
  Copy,
  Brain,
  Shield
} from 'lucide-react'
import Link from 'next/link'

interface QuizResults {
  score: number
  riskLevel: string
  riskColor: string
  lifestyleAreas: {
    diet: { score: number; recommendations: string[] }
    exercise: { score: number; recommendations: string[] }
    stress: { score: number; recommendations: string[] }
    sleep: { score: number; recommendations: string[] }
  }
  overallRecommendations: string[]
  nextSteps: string[]
}

export default function LifestyleEvaluationQuiz() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    dietHabits: [] as string[],
    exerciseHabits: [] as string[],
    stressLevel: '',
    sleepQuality: '',
    workSchedule: '',
    socialLife: '',
    healthGoals: [] as string[]
  })
  const [results, setResults] = useState<QuizResults | null>(null)
  const [showResults, setShowResults] = useState(false)

  const dietHabits = [
    'Consumo regular de frutas e vegetais',
    'Prefere alimentos integrais',
    'Evita alimentos processados',
    'Bebe água regularmente',
    'Faz refeições regulares',
    'Controla porções',
    'Evita açúcar em excesso',
    'Limita consumo de sal',
    'Inclui proteínas magras',
    'Consome gorduras saudáveis'
  ]

  const exerciseHabits = [
    'Exercícios aeróbicos regulares',
    'Treinamento de força',
    'Atividades ao ar livre',
    'Caminhadas diárias',
    'Alongamento/flexibilidade',
    'Esportes recreativos',
    'Atividades em grupo',
    'Exercícios em casa',
    'Uso de escadas',
    'Movimento durante trabalho'
  ]

  const healthGoals = [
    'Perder peso',
    'Ganhar massa muscular',
    'Melhorar energia',
    'Reduzir estresse',
    'Melhorar sono',
    'Prevenir doenças',
    'Aumentar longevidade',
    'Melhorar humor',
    'Aumentar produtividade',
    'Melhorar qualidade de vida'
  ]

  const steps = [
    {
      id: 'personal-info',
      title: 'Informações Pessoais',
      subtitle: 'Vamos começar com alguns dados básicos',
      fields: ['name', 'email', 'phone', 'age', 'weight', 'height', 'gender']
    },
    {
      id: 'diet-habits',
      title: 'Hábitos Alimentares',
      subtitle: 'Selecione seus hábitos alimentares atuais',
      fields: ['dietHabits']
    },
    {
      id: 'exercise-habits',
      title: 'Atividade Física',
      subtitle: 'Como você se mantém ativo fisicamente?',
      fields: ['exerciseHabits']
    },
    {
      id: 'lifestyle-factors',
      title: 'Fatores de Estilo de Vida',
      subtitle: 'Avalie outros aspectos do seu estilo de vida',
      fields: ['stressLevel', 'sleepQuality', 'workSchedule', 'socialLife']
    },
    {
      id: 'health-goals',
      title: 'Objetivos de Saúde',
      subtitle: 'Quais são seus principais objetivos de saúde?',
      fields: ['healthGoals']
    }
  ]

  const calculateResults = () => {
    let totalScore = 0

    // Avaliação de hábitos alimentares (25 pontos)
    const dietScore = Math.min(25, answers.dietHabits.length * 2.5)
    totalScore += dietScore

    // Avaliação de exercícios (25 pontos)
    const exerciseScore = Math.min(25, answers.exerciseHabits.length * 2.5)
    totalScore += exerciseScore

    // Avaliação de estresse (15 pontos)
    const stressScores = {
      'very-low': 15,
      'low': 12,
      'moderate': 8,
      'high': 4,
      'very-high': 0
    }
    totalScore += stressScores[answers.stressLevel as keyof typeof stressScores] || 0

    // Avaliação de sono (15 pontos)
    const sleepScores = {
      'excellent': 15,
      'good': 12,
      'moderate': 8,
      'poor': 4,
      'very-poor': 0
    }
    totalScore += sleepScores[answers.sleepQuality as keyof typeof sleepScores] || 0

    // Avaliação de trabalho (10 pontos)
    const workScores = {
      'flexible': 10,
      'regular': 8,
      'demanding': 5,
      'stressful': 2,
      'very-stressful': 0
    }
    totalScore += workScores[answers.workSchedule as keyof typeof workScores] || 0

    // Avaliação de vida social (10 pontos)
    const socialScores = {
      'very-active': 10,
      'active': 8,
      'moderate': 6,
      'limited': 3,
      'isolated': 0
    }
    totalScore += socialScores[answers.socialLife as keyof typeof socialScores] || 0

    const finalScore = Math.max(0, Math.min(100, totalScore))

    // Determinar nível de risco
    let riskLevel = 'Excelente'
    let riskColor = 'text-green-600'

    if (finalScore < 40) {
      riskLevel = 'Alto'
      riskColor = 'text-red-600'
    } else if (finalScore < 60) {
      riskLevel = 'Moderado'
      riskColor = 'text-yellow-600'
    } else if (finalScore < 80) {
      riskLevel = 'Bom'
      riskColor = 'text-blue-600'
    }

    // Recomendações por área
    const dietRecommendations = []
    if (dietScore < 15) {
      dietRecommendations.push('Aumente o consumo de frutas e vegetais')
      dietRecommendations.push('Prefira alimentos integrais aos refinados')
      dietRecommendations.push('Reduza o consumo de alimentos processados')
    }
    if (answers.dietHabits.length < 5) {
      dietRecommendations.push('Estabeleça horários regulares para refeições')
      dietRecommendations.push('Mantenha hidratação adequada')
    }

    const exerciseRecommendations = []
    if (exerciseScore < 15) {
      exerciseRecommendations.push('Inclua pelo menos 30 minutos de atividade física diária')
      exerciseRecommendations.push('Combine exercícios aeróbicos e de força')
      exerciseRecommendations.push('Encontre atividades que você goste')
    }
    if (answers.exerciseHabits.length < 3) {
      exerciseRecommendations.push('Comece com caminhadas regulares')
      exerciseRecommendations.push('Use escadas em vez de elevador')
    }

    const stressRecommendations = []
    if (answers.stressLevel === 'high' || answers.stressLevel === 'very-high') {
      stressRecommendations.push('Pratique técnicas de respiração')
      stressRecommendations.push('Inclua momentos de relaxamento na rotina')
      stressRecommendations.push('Considere meditação ou yoga')
    }

    const sleepRecommendations = []
    if (answers.sleepQuality === 'poor' || answers.sleepQuality === 'very-poor') {
      sleepRecommendations.push('Estabeleça uma rotina de sono regular')
      sleepRecommendations.push('Evite telas antes de dormir')
      sleepRecommendations.push('Crie um ambiente propício ao sono')
    }

    // Recomendações gerais
    const overallRecommendations = [
      'Mantenha uma rotina diária consistente',
      'Priorize o autocuidado e bem-estar',
      'Busque equilíbrio entre trabalho e vida pessoal',
      'Mantenha conexões sociais positivas',
      'Monitore regularmente sua saúde',
      'Ajuste gradualmente seus hábitos',
      'Celebre pequenas conquistas',
      'Consulte profissionais quando necessário'
    ]

    // Próximos passos
    const nextSteps = [
      'Implemente mudanças graduais nos hábitos',
      'Monitore progresso semanalmente',
      'Ajuste estratégias conforme necessário',
      'Busque apoio de profissionais qualificados',
      'Mantenha motivação através de metas claras',
      'Compartilhe objetivos com pessoas próximas'
    ]

    return {
      score: finalScore,
      riskLevel,
      riskColor,
      lifestyleAreas: {
        diet: { score: dietScore, recommendations: dietRecommendations },
        exercise: { score: exerciseScore, recommendations: exerciseRecommendations },
        stress: { score: stressScores[answers.stressLevel as keyof typeof stressScores] || 0, recommendations: stressRecommendations },
        sleep: { score: sleepScores[answers.sleepQuality as keyof typeof sleepScores] || 0, recommendations: sleepRecommendations }
      },
      overallRecommendations,
      nextSteps
    }
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      const quizResults = calculateResults()
      setResults(quizResults)
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleArrayItem = (arrayName: 'dietHabits' | 'exerciseHabits' | 'healthGoals', item: string) => {
    setAnswers(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].includes(item)
        ? prev[arrayName].filter(i => i !== item)
        : [...prev[arrayName], item]
    }))
  }

  const copyResults = () => {
    if (!results) return
    const text = `Minha Avaliação de Estilo de Vida:
Pontuação Geral: ${results.score}/100
Nível de Risco: ${results.riskLevel}

Áreas Avaliadas:
• Alimentação: ${results.lifestyleAreas.diet.score}/25
• Exercícios: ${results.lifestyleAreas.exercise.score}/25
• Estresse: ${results.lifestyleAreas.stress.score}/15
• Sono: ${results.lifestyleAreas.sleep.score}/15

Recomendações:
${results.overallRecommendations.map(r => `• ${r}`).join('\n')}

Calculado com YLADA - Ferramentas profissionais de bem-estar`
    navigator.clipboard.writeText(text)
    alert('Resultados copiados para a área de transferência!')
  }

  const shareResults = () => {
    if (!results) return
    const text = `Fiz minha avaliação de estilo de vida com YLADA! Minha pontuação: ${results.score}/100 - ${results.riskLevel}. Que tal você também fazer a sua?`
    const url = window.location.href
    navigator.share({ title: 'Minha Avaliação de Estilo de Vida - YLADA', text, url })
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <button
                onClick={() => setShowResults(false)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Sua Avaliação de Estilo de Vida</h1>
                  <p className="text-sm text-gray-600">Avaliação de Estilo de Vida - YLADA</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resultado da Sua Avaliação de Estilo de Vida</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Pontuação Geral</h3>
                <p className="text-4xl font-bold text-blue-600">{results.score}/100</p>
                <p className="text-sm text-gray-600">Avaliação completa de estilo de vida</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Nível de Risco</h3>
                <p className={`text-2xl font-bold ${results.riskColor}`}>{results.riskLevel}</p>
                <p className="text-sm text-gray-600">
                  {results.riskLevel === 'Excelente' ? 'Continue mantendo excelentes hábitos' :
                   results.riskLevel === 'Bom' ? 'Algumas melhorias podem ser feitas' :
                   results.riskLevel === 'Moderado' ? 'Melhorias significativas são necessárias' :
                   'Mudanças urgentes são recomendadas'}
                </p>
              </div>
            </div>

            {/* Lifestyle Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-emerald-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Heart className="w-5 h-5 text-emerald-600 mr-2" />
                  Alimentação ({results.lifestyleAreas.diet.score}/25)
                </h3>
                <ul className="space-y-2">
                  {results.lifestyleAreas.diet.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 text-blue-600 mr-2" />
                  Exercícios ({results.lifestyleAreas.exercise.score}/25)
                </h3>
                <ul className="space-y-2">
                  {results.lifestyleAreas.exercise.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-5 h-5 text-yellow-600 mr-2" />
                  Estresse ({results.lifestyleAreas.stress.score}/15)
                </h3>
                <ul className="space-y-2">
                  {results.lifestyleAreas.stress.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-3 mt-2"></div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 text-purple-600 mr-2" />
                  Sono ({results.lifestyleAreas.sleep.score}/15)
                </h3>
                <ul className="space-y-2">
                  {results.lifestyleAreas.sleep.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 mt-2"></div>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Overall Recommendations */}
            <div className="bg-emerald-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                Recomendações Gerais
              </h4>
              <ul className="space-y-2">
                {results.overallRecommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="bg-orange-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 text-orange-600 mr-2" />
                Próximos Passos Recomendados
              </h4>
              <ul className="space-y-2">
                {results.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={copyResults}
                className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                <Copy className="w-5 h-5 mr-2" />
                Copiar Avaliação
              </button>
              <button
                onClick={shareResults}
                className="flex-1 px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Compartilhar
              </button>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Quer uma avaliação mais completa e personalizada?
            </h3>
            <p className="text-emerald-100 mb-6">
              Consulte um profissional de bem-estar para uma avaliação detalhada e plano personalizado baseado nas suas necessidades específicas
            </p>
            <button className="px-8 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Consultar Profissional de Bem-Estar
            </button>
          </div>
        </main>
      </div>
    )
  }

  const currentStepData = steps[currentStep]
  const isStepComplete = currentStepData.fields.every(field => {
    if (field === 'dietHabits' || field === 'exerciseHabits' || field === 'healthGoals') {
      return Array.isArray(answers[field as keyof typeof answers]) && 
             (answers[field as keyof typeof answers] as string[]).length > 0
    }
    return answers[field as keyof typeof answers] !== ''
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/quiz" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Avaliação de Estilo de Vida</h1>
                <p className="text-sm text-gray-600">Passo {currentStep + 1} de {steps.length}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso</span>
            <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {currentStepData.title}
          </h2>
          <p className="text-gray-600 mb-8">
            {currentStepData.subtitle}
          </p>

          {/* Personal Info Step */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={answers.name}
                    onChange={(e) => setAnswers({...answers, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={answers.email}
                    onChange={(e) => setAnswers({...answers, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={answers.phone}
                    onChange={(e) => setAnswers({...answers, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idade *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    value={answers.age}
                    onChange={(e) => setAnswers({...answers, age: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="25"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="300"
                    step="0.1"
                    value={answers.weight}
                    onChange={(e) => setAnswers({...answers, weight: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="70.5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (cm) *
                  </label>
                  <input
                    type="number"
                    required
                    min="50"
                    max="250"
                    value={answers.height}
                    onChange={(e) => setAnswers({...answers, height: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="175"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo *
                </label>
                <select
                  required
                  value={answers.gender}
                  onChange={(e) => setAnswers({...answers, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>
            </div>
          )}

          {/* Diet Habits Step */}
          {currentStep === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Hábitos alimentares que você pratica (selecione todos que se aplicam):
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {dietHabits.map((habit) => (
                  <button
                    key={habit}
                    type="button"
                    onClick={() => toggleArrayItem('dietHabits', habit)}
                    className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                      answers.dietHabits.includes(habit)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {habit}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Exercise Habits Step */}
          {currentStep === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Atividades físicas que você pratica (selecione todas que se aplicam):
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {exerciseHabits.map((habit) => (
                  <button
                    key={habit}
                    type="button"
                    onClick={() => toggleArrayItem('exerciseHabits', habit)}
                    className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                      answers.exerciseHabits.includes(habit)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {habit}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Lifestyle Factors Step */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de estresse atual *
                </label>
                <select
                  required
                  value={answers.stressLevel}
                  onChange={(e) => setAnswers({...answers, stressLevel: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="very-low">Muito baixo</option>
                  <option value="low">Baixo</option>
                  <option value="moderate">Moderado</option>
                  <option value="high">Alto</option>
                  <option value="very-high">Muito alto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualidade do sono *
                </label>
                <select
                  required
                  value={answers.sleepQuality}
                  onChange={(e) => setAnswers({...answers, sleepQuality: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="excellent">Excelente (7-9 horas, sono profundo)</option>
                  <option value="good">Boa (6-8 horas, sono razoável)</option>
                  <option value="moderate">Moderada (5-7 horas, sono irregular)</option>
                  <option value="poor">Ruim (4-6 horas, sono superficial)</option>
                  <option value="very-poor">Muito ruim (menos de 4 horas)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rotina de trabalho *
                </label>
                <select
                  required
                  value={answers.workSchedule}
                  onChange={(e) => setAnswers({...answers, workSchedule: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="flexible">Flexível (home office, horários livres)</option>
                  <option value="regular">Regular (8h/dia, horário fixo)</option>
                  <option value="demanding">Exigente (muitas horas, prazos apertados)</option>
                  <option value="stressful">Estressante (alta pressão, responsabilidades)</option>
                  <option value="very-stressful">Muito estressante (sobrecarga constante)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vida social *
                </label>
                <select
                  required
                  value={answers.socialLife}
                  onChange={(e) => setAnswers({...answers, socialLife: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="very-active">Muito ativa (muitos amigos, eventos frequentes)</option>
                  <option value="active">Ativa (alguns amigos próximos, atividades regulares)</option>
                  <option value="moderate">Moderada (poucos amigos, atividades ocasionais)</option>
                  <option value="limited">Limitada (poucos contatos, atividades raras)</option>
                  <option value="isolated">Isolada (pouco contato social)</option>
                </select>
              </div>
            </div>
          )}

          {/* Health Goals Step */}
          {currentStep === 4 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Objetivos de saúde que você tem (selecione todos que se aplicam):
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {healthGoals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleArrayItem('healthGoals', goal)}
                    className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                      answers.healthGoals.includes(goal)
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Anterior
            </button>
            
            <button
              onClick={handleNext}
              disabled={!isStepComplete}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {currentStep === steps.length - 1 ? 'Finalizar Avaliação' : 'Próximo'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Importante</h4>
              <p className="text-yellow-700 text-sm">
                Esta avaliação fornece uma análise preliminar baseada em critérios científicos. 
                Para um diagnóstico preciso e plano personalizado, consulte sempre um 
                profissional de bem-estar qualificado.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
