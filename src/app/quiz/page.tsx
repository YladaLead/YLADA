'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, Zap, Heart, Brain, Shield } from 'lucide-react'
import Link from 'next/link'
import { getStripe } from '@/lib/stripe'
import { unitConfigs, convertWeight, convertHeight, convertWater, formatHeightInches, parseHeightInches, type Language } from '@/lib/units'

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [language, setLanguage] = useState<Language>('pt')
  const [answers, setAnswers] = useState({
    medication: '',
    duration: '',
    mainChallenge: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity: ''
  })
  const [showResults, setShowResults] = useState(false)

  const steps = [
    {
      id: 'medication',
      title: 'Você usa medicação para emagrecimento?',
      subtitle: 'Canetas injetáveis, comprimidos orais ou outros inibidores de apetite',
      options: [
        { value: 'currently_using_injection', label: 'Estou usando caneta injetável', icon: Zap },
        { value: 'currently_using_pill', label: 'Estou usando comprimido oral', icon: CheckCircle },
        { value: 'currently_using_other', label: 'Estou usando outro inibidor de apetite', icon: Heart },
        { value: 'used_before', label: 'Usei antes mas parei', icon: ArrowRight },
        { value: 'planning_to_use', label: 'Pretendo usar', icon: Brain },
        { value: 'considering', label: 'Estou considerando', icon: Shield },
        { value: 'natural_alternative', label: 'Prefiro alternativas naturais', icon: Shield }
      ]
    },
    {
      id: 'duration',
      title: 'Há quanto tempo você está usando?',
      subtitle: 'Isso nos ajuda a entender suas necessidades atuais',
      options: [
        { value: 'less_than_1_month', label: 'Menos de 1 mês' },
        { value: '1_to_3_months', label: '1-3 meses' },
        { value: '3_to_6_months', label: '3-6 meses' },
        { value: 'more_than_6_months', label: 'Mais de 6 meses' },
        { value: 'not_applicable', label: 'Não se aplica' }
      ],
      showIf: ['currently_using']
    },
    {
      id: 'mainChallenge',
      title: 'Qual é seu maior desafio?',
      subtitle: 'Selecione o problema mais importante que você quer resolver',
      options: [
        { value: 'muscle_loss', label: 'Prevenção de perda muscular', icon: Zap },
        { value: 'digestive_issues', label: 'Problemas digestivos', icon: Heart },
        { value: 'low_energy', label: 'Baixa energia', icon: Brain },
        { value: 'nutrient_deficiency', label: 'Deficiências nutricionais', icon: Shield },
        { value: 'weight_plateau', label: 'Estagnação do peso', icon: ArrowRight }
      ]
    },
    {
      id: 'profile',
      title: 'Conte-nos sobre você',
      subtitle: 'Isso nos ajuda a calcular suas necessidades nutricionais específicas',
      fields: [
        { id: 'age', label: 'Idade', type: 'number', placeholder: 'ex: 35' },
        { id: 'weight', label: `Peso (${unitConfigs[language].weight.unit})`, type: 'number', placeholder: unitConfigs[language].weight.placeholder },
        { id: 'height', label: `Altura (${unitConfigs[language].height.unit})`, type: 'number', placeholder: unitConfigs[language].height.placeholder },
        { id: 'gender', label: 'Sexo', type: 'select', options: ['Masculino', 'Feminino', 'Outro'] },
        { id: 'activity', label: 'Nível de Atividade', type: 'select', options: ['Sedentário', 'Leve', 'Moderado', 'Ativo', 'Muito Ativo'] }
      ]
    }
  ]

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    
    // Auto-advance for single choice questions
    if (questionId !== 'profile') {
      setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1)
        }
      }, 500)
    }
  }

  const handleProfileSubmit = () => {
    // Validate profile data
    const { age, weight, height, gender, activity } = answers
    if (!age || !weight || !height || !gender || !activity) {
      alert('Por favor, preencha todas as informações do perfil')
      return
    }
    
    setShowResults(true)
  }

  const handlePurchase = async (protocolId: string) => {
    try {
      // In a real app, you would use actual Stripe price IDs
      const priceId = 'price_' + protocolId // This would be your actual Stripe price ID
      
      const stripe = await getStripe()
      if (!stripe) {
        throw new Error('Stripe failed to initialize')
      }

      // For demo purposes, we'll redirect to a success page
      // In production, you would create a checkout session
      window.location.href = '/success?protocol=' + protocolId
    } catch (error) {
      console.error('Error processing payment:', error)
      alert('Erro no processamento do pagamento. Tente novamente.')
    }
  }

  const calculateResults = () => {
    const { age, weight, height, gender, activity, medication, duration, mainChallenge } = answers
    
    // Convert units to metric system for calculations
    const weightNum = parseFloat(weight)
    const heightNum = parseFloat(height)
    
    // Convert to kg and cm for calculations
    const weightKg = unitConfigs[language].weight.conversion.toKg(weightNum)
    const heightCm = unitConfigs[language].height.conversion.toCm(heightNum)
    
    // Calculate BMI
    const bmi = weightKg / ((heightCm / 100) * (heightCm / 100))
    
    // Calculate protein needs (higher for GLP-1 users)
    const baseProtein = weightKg * 0.8 // Standard (using kg)
    const glp1Multiplier = (medication === 'currently_using_injection' || medication === 'currently_using_pill' || medication === 'currently_using_other') ? 1.5 : 1.2
    const activityMultiplier = {
      'Sedentário': 1.0,
      'Leve': 1.1,
      'Moderado': 1.2,
      'Ativo': 1.3,
      'Muito Ativo': 1.4
    }[activity] || 1.2
    
    const proteinNeeds = baseProtein * glp1Multiplier * activityMultiplier
    
    // Calculate water needs (in ml)
    const waterNeedsMl = weightKg * 35 // ml per kg
    
    // Determine recommended protocols
    const protocols = []
    
    if (mainChallenge === 'muscle_loss' || medication === 'currently_using_injection' || medication === 'currently_using_pill' || medication === 'currently_using_other') {
      protocols.push({
        id: 'muscle_protection',
        name: 'Protocolo de Proteção Muscular',
        description: 'Prevenir perda muscular durante o emagrecimento',
        price: 9.90,
        features: ['Otimização de proteína', 'Guia de treino resistido', 'Protocolos de recuperação']
      })
    }
    
    if (mainChallenge === 'digestive_issues' || duration === 'less_than_1_month') {
      protocols.push({
        id: 'digestive_health',
        name: 'Protocolo de Saúde Digestiva',
        description: 'Suporte à digestão saudável e função intestinal',
        price: 9.90,
        features: ['Otimização de fibras', 'Orientação probiótica', 'Enzimas digestivas']
      })
    }
    
    if (mainChallenge === 'low_energy' || mainChallenge === 'nutrient_deficiency') {
      protocols.push({
        id: 'energy_immunity',
        name: 'Protocolo de Energia e Imunidade',
        description: 'Aumentar energia e apoiar função imunológica',
        price: 9.90,
        features: ['Otimização de vitaminas', 'Equilíbrio mineral', 'Protocolos de energia']
      })
    }
    
    return {
      bmi: bmi.toFixed(1),
      bmiCategory: bmi < 18.5 ? 'Abaixo do peso' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Sobrepeso' : 'Obesidade',
      proteinNeeds: proteinNeeds.toFixed(1),
      waterNeeds: waterNeedsMl.toFixed(0),
      protocols,
      risks: [
        'Risco de perda de massa muscular',
        'Risco de deficiência nutricional',
        'Risco de problemas digestivos',
        'Risco de depleção energética'
      ]
    }
  }

  if (showResults) {
    const results = calculateResults()
    
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
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Seus Resultados</h1>
                  <p className="text-sm text-gray-600">Recomendações personalizadas</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seu Perfil Nutricional</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">IMC</h3>
                <p className="text-3xl font-bold text-blue-600">{results.bmi}</p>
                <p className="text-sm text-gray-600">{results.bmiCategory}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Necessidade de Proteína</h3>
                <p className="text-3xl font-bold text-green-600">{results.proteinNeeds}g</p>
                <p className="text-sm text-gray-600">Necessidade diária</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Necessidade de Água</h3>
                <p className="text-3xl font-bold text-purple-600">{convertWater(parseFloat(results.waterNeeds), 'pt', language).toFixed(0)}{unitConfigs[language].water.unit}</p>
                <p className="text-sm text-gray-600">Necessidade diária</p>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-yellow-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                Riscos Potenciais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.risks.map((risk, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    {risk}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Protocols */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Protocolos Recomendados</h2>
            <p className="text-gray-600 mb-8">
              Com base no seu perfil, aqui estão os protocolos que vão ajudar você a manter a saúde ideal enquanto usa medicação para emagrecimento.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.protocols.map((protocol, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{protocol.name}</h3>
                  <p className="text-gray-600 mb-4">{protocol.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Inclui:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {protocol.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-blue-600">R$ {protocol.price}</span>
                    <button 
                      onClick={() => handlePurchase(protocol.id)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Obter Protocolo
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bundle Offer */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Pacote Completo</h3>
              <p className="text-blue-100 mb-6">
                Obtenha todos os protocolos mais atualizações futuras por apenas R$ 39,90/mês
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">R$ 39,90<span className="text-lg font-normal">/mês</span></p>
                  <p className="text-blue-100">Cancele a qualquer momento</p>
                </div>
                <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Obter Acesso Completo
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const currentStepData = steps[currentStep]
  const isProfileStep = currentStepData.id === 'profile'

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Avaliação de Saúde</h1>
                  <p className="text-sm text-gray-600">Passo {currentStep + 1} de {steps.length}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Idioma:</span>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="pt">Português</option>
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
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

        {/* Question */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentStepData.title}</h2>
          <p className="text-lg text-gray-600 mb-8">{currentStepData.subtitle}</p>

          {isProfileStep ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentStepData.fields?.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      value={answers[field.id as keyof typeof answers]}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [field.id]: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      value={answers[field.id as keyof typeof answers]}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [field.id]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStepData.options?.map((option) => {
                const IconComponent = 'icon' in option ? option.icon : null
                return (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(currentStepData.id, option.value)}
                    className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                      answers[currentStepData.id as keyof typeof answers] === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {IconComponent && (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          answers[currentStepData.id as keyof typeof answers] === option.value
                            ? 'bg-blue-500'
                            : 'bg-gray-100'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            answers[currentStepData.id as keyof typeof answers] === option.value
                              ? 'text-white'
                              : 'text-gray-600'
                          }`} />
                        </div>
                      )}
                      <span className="font-medium text-gray-900">{option.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="w-4 h-4 inline mr-2" />
              Anterior
            </button>
            
            {isProfileStep ? (
              <button
                onClick={handleProfileSubmit}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Obter Meus Resultados
                <ArrowRight className="w-4 h-4 inline ml-2" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                disabled={!answers[currentStepData.id as keyof typeof answers]}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Próximo
                <ArrowRight className="w-4 h-4 inline ml-2" />
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
