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
  Shield,
  Zap
} from 'lucide-react'
import Link from 'next/link'

interface QuizResults {
  primaryGoal: string
  secondaryGoals: string[]
  priorityAreas: string[]
  actionPlan: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
  recommendations: string[]
  timeline: string
  successMetrics: string[]
}

export default function HealthGoalsQuiz() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    primaryGoal: '',
    secondaryGoals: [] as string[],
    currentChallenges: [] as string[],
    motivationLevel: '',
    timeAvailability: '',
    budget: '',
    supportSystem: ''
  })
  const [results, setResults] = useState<QuizResults | null>(null)
  const [showResults, setShowResults] = useState(false)

  const primaryGoals = [
    { value: 'weight-loss', label: 'Perder Peso', icon: Target, description: 'Reduzir peso corporal e gordura' },
    { value: 'muscle-gain', label: 'Ganhar Massa Muscular', icon: Activity, description: 'Aumentar massa muscular e força' },
    { value: 'energy-boost', label: 'Aumentar Energia', icon: Zap, description: 'Melhorar níveis de energia e vitalidade' },
    { value: 'stress-reduction', label: 'Reduzir Estresse', icon: Brain, description: 'Gerenciar estresse e ansiedade' },
    { value: 'sleep-improvement', label: 'Melhorar Sono', icon: Shield, description: 'Otimizar qualidade do sono' },
    { value: 'disease-prevention', label: 'Prevenir Doenças', icon: Heart, description: 'Prevenir doenças crônicas' },
    { value: 'longevity', label: 'Aumentar Longevidade', icon: CheckCircle, description: 'Viver mais e melhor' },
    { value: 'performance', label: 'Melhorar Performance', icon: Activity, description: 'Otimizar desempenho físico/mental' }
  ]

  const secondaryGoals = [
    'Melhorar alimentação',
    'Aumentar atividade física',
    'Reduzir estresse',
    'Melhorar sono',
    'Perder peso',
    'Ganhar massa muscular',
    'Aumentar energia',
    'Melhorar humor',
    'Prevenir doenças',
    'Aumentar produtividade',
    'Melhorar relacionamentos',
    'Aumentar confiança'
  ]

  const currentChallenges = [
    'Falta de tempo',
    'Falta de motivação',
    'Falta de conhecimento',
    'Falta de recursos financeiros',
    'Falta de apoio social',
    'Problemas de saúde',
    'Estresse excessivo',
    'Má alimentação',
    'Sedentarismo',
    'Problemas de sono',
    'Falta de disciplina',
    'Medo de mudança'
  ]

  const steps = [
    {
      id: 'personal-info',
      title: 'Informações Pessoais',
      subtitle: 'Vamos começar com alguns dados básicos',
      fields: ['name', 'email', 'phone', 'age', 'weight', 'height', 'gender']
    },
    {
      id: 'primary-goal',
      title: 'Objetivo Principal',
      subtitle: 'Qual é o seu objetivo principal de saúde?',
      fields: ['primaryGoal']
    },
    {
      id: 'secondary-goals',
      title: 'Objetivos Secundários',
      subtitle: 'Quais outros objetivos você gostaria de alcançar?',
      fields: ['secondaryGoals']
    },
    {
      id: 'challenges',
      title: 'Desafios Atuais',
      subtitle: 'Quais são os principais desafios que você enfrenta?',
      fields: ['currentChallenges']
    },
    {
      id: 'resources',
      title: 'Recursos Disponíveis',
      subtitle: 'Avalie seus recursos para alcançar seus objetivos',
      fields: ['motivationLevel', 'timeAvailability', 'budget', 'supportSystem']
    }
  ]

  const calculateResults = () => {
    const primaryGoalData = primaryGoals.find(goal => goal.value === answers.primaryGoal)
    
    // Determinar áreas prioritárias baseadas no objetivo principal
    const priorityAreas = []
    if (answers.primaryGoal === 'weight-loss') {
      priorityAreas.push('Nutrição', 'Exercícios Cardiovasculares', 'Controle de Porções')
    } else if (answers.primaryGoal === 'muscle-gain') {
      priorityAreas.push('Treinamento de Força', 'Proteína', 'Descanso')
    } else if (answers.primaryGoal === 'energy-boost') {
      priorityAreas.push('Sono', 'Nutrição', 'Gestão de Estresse')
    } else if (answers.primaryGoal === 'stress-reduction') {
      priorityAreas.push('Técnicas de Relaxamento', 'Exercícios', 'Sono')
    } else if (answers.primaryGoal === 'sleep-improvement') {
      priorityAreas.push('Higiene do Sono', 'Gestão de Estresse', 'Rotina')
    } else if (answers.primaryGoal === 'disease-prevention') {
      priorityAreas.push('Nutrição Preventiva', 'Exercícios', 'Check-ups')
    } else if (answers.primaryGoal === 'longevity') {
      priorityAreas.push('Nutrição Anti-envelhecimento', 'Exercícios', 'Gestão de Estresse')
    } else if (answers.primaryGoal === 'performance') {
      priorityAreas.push('Treinamento Específico', 'Nutrição', 'Recuperação')
    }

    // Criar plano de ação baseado no objetivo e recursos
    const actionPlan = {
      immediate: [] as string[],
      shortTerm: [] as string[],
      longTerm: [] as string[]
    }

    // Ações imediatas (1-2 semanas)
    if (answers.primaryGoal === 'weight-loss') {
      actionPlan.immediate.push('Estabelecer déficit calórico de 300-500 calorias/dia')
      actionPlan.immediate.push('Iniciar caminhadas de 30 minutos, 5x/semana')
      actionPlan.immediate.push('Eliminar bebidas açucaradas')
    } else if (answers.primaryGoal === 'muscle-gain') {
      actionPlan.immediate.push('Iniciar treino de força 3x/semana')
      actionPlan.immediate.push('Aumentar ingestão de proteína para 1.6g/kg/dia')
      actionPlan.immediate.push('Estabelecer rotina de sono de 7-9 horas')
    } else if (answers.primaryGoal === 'energy-boost') {
      actionPlan.immediate.push('Estabelecer horário fixo para dormir e acordar')
      actionPlan.immediate.push('Incluir proteína em todas as refeições')
      actionPlan.immediate.push('Reduzir consumo de cafeína após 14h')
    }

    // Ações de curto prazo (1-3 meses)
    if (answers.primaryGoal === 'weight-loss') {
      actionPlan.shortTerm.push('Perder 2-4kg por mês')
      actionPlan.shortTerm.push('Aumentar intensidade dos exercícios')
      actionPlan.shortTerm.push('Implementar jejum intermitente')
    } else if (answers.primaryGoal === 'muscle-gain') {
      actionPlan.shortTerm.push('Aumentar carga dos exercícios progressivamente')
      actionPlan.shortTerm.push('Ganhar 0.5-1kg de massa muscular por mês')
      actionPlan.shortTerm.push('Otimizar timing de nutrientes')
    }

    // Ações de longo prazo (3-12 meses)
    if (answers.primaryGoal === 'weight-loss') {
      actionPlan.longTerm.push('Alcançar peso ideal e mantê-lo')
      actionPlan.longTerm.push('Desenvolver hábitos alimentares sustentáveis')
      actionPlan.longTerm.push('Manter atividade física regular')
    } else if (answers.primaryGoal === 'muscle-gain') {
      actionPlan.longTerm.push('Alcançar composição corporal desejada')
      actionPlan.longTerm.push('Desenvolver força máxima')
      actionPlan.longTerm.push('Manter massa muscular a longo prazo')
    }

    // Recomendações gerais
    const recommendations = [
      'Estabeleça metas SMART (Específicas, Mensuráveis, Atingíveis, Relevantes, Temporais)',
      'Monitore progresso regularmente',
      'Celebre pequenas conquistas',
      'Ajuste estratégias conforme necessário',
      'Mantenha consistência acima da perfeição',
      'Busque apoio profissional quando necessário',
      'Crie um ambiente propício ao sucesso',
      'Desenvolva hábitos sustentáveis'
    ]

    // Timeline baseada no objetivo
    let timeline = '3-6 meses'
    if (answers.primaryGoal === 'weight-loss') {
      timeline = '6-12 meses para resultados significativos'
    } else if (answers.primaryGoal === 'muscle-gain') {
      timeline = '6-18 meses para ganhos substanciais'
    } else if (answers.primaryGoal === 'energy-boost') {
      timeline = '2-4 semanas para melhorias iniciais'
    } else if (answers.primaryGoal === 'stress-reduction') {
      timeline = '4-8 semanas para redução significativa'
    }

    // Métricas de sucesso
    const successMetrics = []
    if (answers.primaryGoal === 'weight-loss') {
      successMetrics.push('Redução de peso corporal')
      successMetrics.push('Diminuição de medidas corporais')
      successMetrics.push('Melhora na composição corporal')
      successMetrics.push('Aumento de energia')
    } else if (answers.primaryGoal === 'muscle-gain') {
      successMetrics.push('Aumento de massa muscular')
      successMetrics.push('Melhora na força')
      successMetrics.push('Melhora na composição corporal')
      successMetrics.push('Melhora na performance')
    } else if (answers.primaryGoal === 'energy-boost') {
      successMetrics.push('Níveis de energia mais altos')
      successMetrics.push('Melhor qualidade do sono')
      successMetrics.push('Maior produtividade')
      successMetrics.push('Melhor humor')
    }

    return {
      primaryGoal: primaryGoalData?.label || '',
      secondaryGoals: answers.secondaryGoals,
      priorityAreas,
      actionPlan,
      recommendations,
      timeline,
      successMetrics
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

  const toggleArrayItem = (arrayName: 'secondaryGoals' | 'currentChallenges', item: string) => {
    setAnswers(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].includes(item)
        ? prev[arrayName].filter(i => i !== item)
        : [...prev[arrayName], item]
    }))
  }

  const copyResults = () => {
    if (!results) return
    const text = `Meu Plano de Objetivos de Saúde:
Objetivo Principal: ${results.primaryGoal}

Objetivos Secundários:
${results.secondaryGoals.map(g => `• ${g}`).join('\n')}

Áreas Prioritárias:
${results.priorityAreas.map(a => `• ${a}`).join('\n')}

Timeline: ${results.timeline}

Plano de Ação:
Ações Imediatas:
${results.actionPlan.immediate.map(a => `• ${a}`).join('\n')}

Ações de Curto Prazo:
${results.actionPlan.shortTerm.map(a => `• ${a}`).join('\n')}

Ações de Longo Prazo:
${results.actionPlan.longTerm.map(a => `• ${a}`).join('\n')}

Calculado com YLADA - Ferramentas profissionais de bem-estar`
    navigator.clipboard.writeText(text)
    alert('Resultados copiados para a área de transferência!')
  }

  const shareResults = () => {
    if (!results) return
    const text = `Criei meu plano de objetivos de saúde com YLADA! Meu objetivo principal: ${results.primaryGoal}. Que tal você também criar o seu?`
    const url = window.location.href
    navigator.share({ title: 'Meu Plano de Objetivos de Saúde - YLADA', text, url })
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
                  <h1 className="text-2xl font-bold text-gray-900">Seu Plano de Objetivos de Saúde</h1>
                  <p className="text-sm text-gray-600">Definição de Objetivos de Saúde - YLADA</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seu Plano Personalizado de Objetivos de Saúde</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-purple-50 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Objetivo Principal</h3>
                <p className="text-2xl font-bold text-purple-600">{results.primaryGoal}</p>
                <p className="text-sm text-gray-600">Foco principal do seu plano</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Timeline Estimada</h3>
                <p className="text-lg font-bold text-blue-600">{results.timeline}</p>
                <p className="text-sm text-gray-600">Para resultados significativos</p>
              </div>
            </div>

            {/* Secondary Goals */}
            <div className="bg-green-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 text-green-600 mr-2" />
                Objetivos Secundários
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {results.secondaryGoals.map((goal, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    {goal}
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Areas */}
            <div className="bg-yellow-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Zap className="w-5 h-5 text-yellow-600 mr-2" />
                Áreas Prioritárias
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {results.priorityAreas.map((area, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    {area}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Plan */}
            <div className="space-y-6 mb-8">
              <div className="bg-emerald-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Activity className="w-5 h-5 text-emerald-600 mr-2" />
                  Ações Imediatas (1-2 semanas)
                </h3>
                <ul className="space-y-2">
                  {results.actionPlan.immediate.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Heart className="w-5 h-5 text-blue-600 mr-2" />
                  Ações de Curto Prazo (1-3 meses)
                </h3>
                <ul className="space-y-2">
                  {results.actionPlan.shortTerm.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-5 h-5 text-purple-600 mr-2" />
                  Ações de Longo Prazo (3-12 meses)
                </h3>
                <ul className="space-y-2">
                  {results.actionPlan.longTerm.map((action, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                      <span className="text-gray-700">{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="bg-orange-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-orange-600 mr-2" />
                Métricas de Sucesso
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.successMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    {metric}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-emerald-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 text-emerald-600 mr-2" />
                Recomendações Gerais
              </h4>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-700">{rec}</span>
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
                Copiar Plano
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
              Quer um plano mais completo e personalizado?
            </h3>
            <p className="text-emerald-100 mb-6">
              Consulte um profissional de bem-estar para um plano detalhado e acompanhamento personalizado baseado nas suas necessidades específicas
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
    if (field === 'secondaryGoals' || field === 'currentChallenges') {
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
                <h1 className="text-2xl font-bold text-gray-900">Definição de Objetivos de Saúde</h1>
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

          {/* Primary Goal Step */}
          {currentStep === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Selecione seu objetivo principal de saúde:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {primaryGoals.map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => setAnswers({...answers, primaryGoal: goal.value})}
                    className={`p-4 rounded-lg border text-left transition-colors ${
                      answers.primaryGoal === goal.value
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`w-12 h-12 ${answers.primaryGoal === goal.value ? 'bg-emerald-500' : 'bg-gray-200'} rounded-lg flex items-center justify-center mr-4`}>
                        <goal.icon className={`w-6 h-6 ${answers.primaryGoal === goal.value ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{goal.label}</h3>
                        <p className="text-sm text-gray-600">{goal.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Secondary Goals Step */}
          {currentStep === 2 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Objetivos secundários que você gostaria de alcançar (selecione todos que se aplicam):
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {secondaryGoals.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleArrayItem('secondaryGoals', goal)}
                    className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                      answers.secondaryGoals.includes(goal)
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

          {/* Challenges Step */}
          {currentStep === 3 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Principais desafios que você enfrenta (selecione todos que se aplicam):
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {currentChallenges.map((challenge) => (
                  <button
                    key={challenge}
                    type="button"
                    onClick={() => toggleArrayItem('currentChallenges', challenge)}
                    className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                      answers.currentChallenges.includes(challenge)
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {challenge}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Resources Step */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de motivação atual *
                </label>
                <select
                  required
                  value={answers.motivationLevel}
                  onChange={(e) => setAnswers({...answers, motivationLevel: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="very-high">Muito alta (pronto para grandes mudanças)</option>
                  <option value="high">Alta (motivado para mudanças)</option>
                  <option value="moderate">Moderada (alguma motivação)</option>
                  <option value="low">Baixa (precisa de incentivo)</option>
                  <option value="very-low">Muito baixa (desmotivado)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tempo disponível para mudanças *
                </label>
                <select
                  required
                  value={answers.timeAvailability}
                  onChange={(e) => setAnswers({...answers, timeAvailability: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="abundant">Abundante (mais de 2h/dia)</option>
                  <option value="good">Bom (1-2h/dia)</option>
                  <option value="moderate">Moderado (30min-1h/dia)</option>
                  <option value="limited">Limitado (menos de 30min/dia)</option>
                  <option value="very-limited">Muito limitado (poucos minutos/dia)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orçamento disponível *
                </label>
                <select
                  required
                  value={answers.budget}
                  onChange={(e) => setAnswers({...answers, budget: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="high">Alto (pode investir em soluções premium)</option>
                  <option value="moderate">Moderado (pode investir em soluções básicas)</option>
                  <option value="low">Baixo (precisa de soluções econômicas)</option>
                  <option value="very-low">Muito baixo (soluções gratuitas)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sistema de apoio *
                </label>
                <select
                  required
                  value={answers.supportSystem}
                  onChange={(e) => setAnswers({...answers, supportSystem: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="excellent">Excelente (família e amigos muito apoiadores)</option>
                  <option value="good">Bom (algum apoio da família/amigos)</option>
                  <option value="moderate">Moderado (apoio limitado)</option>
                  <option value="poor">Ruim (pouco apoio)</option>
                  <option value="none">Nenhum (sem apoio)</option>
                </select>
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
                Este plano fornece uma base para seus objetivos de saúde. 
                Para um plano detalhado e acompanhamento personalizado, consulte sempre um 
                profissional de bem-estar qualificado.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
