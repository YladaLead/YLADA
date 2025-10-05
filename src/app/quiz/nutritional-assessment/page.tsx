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
  deficiencies: string[]
  recommendations: string[]
  supplements: string[]
  nextSteps: string[]
}

export default function NutritionalAssessmentQuiz() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    symptoms: [] as string[],
    diet: '',
    lifestyle: '',
    healthConditions: [] as string[],
    medications: '',
    stress: '',
    sleep: ''
  })
  const [results, setResults] = useState<QuizResults | null>(null)
  const [showResults, setShowResults] = useState(false)

  const symptoms = [
    'Fadiga constante',
    'Fraqueza muscular',
    'Queda de cabelo',
    'Unhas quebradiças',
    'Pele seca',
    'Cicatrização lenta',
    'Problemas de memória',
    'Irritabilidade',
    'Dores de cabeça frequentes',
    'Problemas digestivos',
    'Cãibras musculares',
    'Sensibilidade ao frio',
    'Problemas de visão',
    'Dores nas articulações',
    'Problemas de sono',
    'Mudanças de humor'
  ]

  const healthConditions = [
    'Diabetes',
    'Hipertensão',
    'Doença cardíaca',
    'Problemas de tireoide',
    'Doença renal',
    'Doença hepática',
    'Anemia',
    'Osteoporose',
    'Artrite',
    'Depressão',
    'Ansiedade',
    'Problemas digestivos'
  ]

  const steps = [
    {
      id: 'personal-info',
      title: 'Informações Pessoais',
      subtitle: 'Vamos começar com alguns dados básicos',
      fields: ['name', 'email', 'phone', 'age', 'weight', 'height', 'gender']
    },
    {
      id: 'symptoms',
      title: 'Sintomas Atuais',
      subtitle: 'Selecione todos os sintomas que você apresenta',
      fields: ['symptoms']
    },
    {
      id: 'diet-lifestyle',
      title: 'Dieta e Estilo de Vida',
      subtitle: 'Avalie sua alimentação e hábitos de vida',
      fields: ['diet', 'lifestyle']
    },
    {
      id: 'health-conditions',
      title: 'Condições de Saúde',
      subtitle: 'Informe sobre condições de saúde existentes',
      fields: ['healthConditions', 'medications']
    },
    {
      id: 'stress-sleep',
      title: 'Estresse e Sono',
      subtitle: 'Avalie seus níveis de estresse e qualidade do sono',
      fields: ['stress', 'sleep']
    }
  ]

  const calculateResults = () => {
    let score = 0
    const maxScore = 100
    
    // Avaliação por sintomas (40 pontos)
    const symptomScore = Math.max(0, 40 - (answers.symptoms.length * 2.5))
    score += symptomScore
    
    // Avaliação por dieta (20 pontos)
    const dietScores = {
      'excellent': 20,
      'good': 15,
      'moderate': 10,
      'poor': 5,
      'very-poor': 0
    }
    score += dietScores[answers.diet as keyof typeof dietScores] || 0
    
    // Avaliação por estilo de vida (20 pontos)
    const lifestyleScores = {
      'excellent': 20,
      'good': 15,
      'moderate': 10,
      'poor': 5,
      'very-poor': 0
    }
    score += lifestyleScores[answers.lifestyle as keyof typeof lifestyleScores] || 0
    
    // Avaliação por condições de saúde (10 pontos)
    const healthScore = Math.max(0, 10 - (answers.healthConditions.length * 2))
    score += healthScore
    
    // Avaliação por estresse (5 pontos)
    const stressScores = {
      'low': 5,
      'moderate': 3,
      'high': 1,
      'very-high': 0
    }
    score += stressScores[answers.stress as keyof typeof stressScores] || 0
    
    // Avaliação por sono (5 pontos)
    const sleepScores = {
      'excellent': 5,
      'good': 4,
      'moderate': 3,
      'poor': 2,
      'very-poor': 1
    }
    score += sleepScores[answers.sleep as keyof typeof sleepScores] || 0
    
    const finalScore = Math.max(0, Math.min(100, score))
    
    // Determinar nível de risco
    let riskLevel = 'Baixo'
    let riskColor = 'text-green-600'
    
    if (finalScore < 40) {
      riskLevel = 'Alto'
      riskColor = 'text-red-600'
    } else if (finalScore < 60) {
      riskLevel = 'Moderado'
      riskColor = 'text-yellow-600'
    }
    
    // Identificar possíveis deficiências
    const deficiencies = []
    if (answers.symptoms.includes('Fadiga constante') || answers.symptoms.includes('Fraqueza muscular')) {
      deficiencies.push('Ferro (Anemia)')
    }
    if (answers.symptoms.includes('Queda de cabelo') || answers.symptoms.includes('Unhas quebradiças')) {
      deficiencies.push('Biotina')
    }
    if (answers.symptoms.includes('Pele seca') || answers.symptoms.includes('Problemas de visão')) {
      deficiencies.push('Vitamina A')
    }
    if (answers.symptoms.includes('Cãibras musculares') || answers.symptoms.includes('Problemas de sono')) {
      deficiencies.push('Magnésio')
    }
    if (answers.symptoms.includes('Problemas de memória') || answers.symptoms.includes('Irritabilidade')) {
      deficiencies.push('Vitamina B12')
    }
    if (answers.symptoms.includes('Sensibilidade ao frio') || answers.symptoms.includes('Problemas de tireoide')) {
      deficiencies.push('Iodo')
    }
    if (answers.symptoms.includes('Dores nas articulações') || answers.symptoms.includes('Cicatrização lenta')) {
      deficiencies.push('Vitamina C')
    }
    
    // Recomendações
    const recommendations = [
      'Consuma pelo menos 5 porções de frutas e vegetais por dia',
      'Prefira grãos integrais aos refinados',
      'Inclua fontes de proteína magra em todas as refeições',
      'Mantenha hidratação adequada (35ml/kg/dia)',
      'Limite o consumo de açúcar a menos de 10% das calorias',
      'Reduza o sal para menos de 5g por dia',
      'Evite gorduras trans e limite gorduras saturadas',
      'Faça refeições regulares ao longo do dia'
    ]
    
    // Suplementos sugeridos
    const supplements = []
    if (deficiencies.includes('Ferro (Anemia)')) {
      supplements.push('Suplemento de Ferro (com orientação médica)')
    }
    if (deficiencies.includes('Vitamina B12')) {
      supplements.push('Vitamina B12 ou Complexo B')
    }
    if (deficiencies.includes('Magnésio')) {
      supplements.push('Suplemento de Magnésio')
    }
    if (finalScore < 60) {
      supplements.push('Multivitamínico de qualidade')
    }
    
    // Próximos passos
    const nextSteps = [
      'Agende consulta com nutricionista',
      'Faça exames laboratoriais completos',
      'Implemente mudanças graduais na dieta',
      'Monitore sintomas e progresso',
      'Consulte médico se necessário',
      'Mantenha diário alimentar'
    ]
    
    return {
      score: finalScore,
      riskLevel,
      riskColor,
      deficiencies: deficiencies.length > 0 ? deficiencies : ['Nenhuma deficiência específica identificada'],
      recommendations,
      supplements: supplements.length > 0 ? supplements : ['Multivitamínico básico (opcional)'],
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

  const toggleSymptom = (symptom: string) => {
    setAnswers(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }))
  }

  const toggleHealthCondition = (condition: string) => {
    setAnswers(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter(c => c !== condition)
        : [...prev.healthConditions, condition]
    }))
  }

  const copyResults = () => {
    if (!results) return
    const text = `Minha Avaliação Nutricional:
Pontuação Geral: ${results.score}/100
Nível de Risco: ${results.riskLevel}

Possíveis Deficiências:
${results.deficiencies.map(d => `• ${d}`).join('\n')}

Recomendações:
${results.recommendations.map(r => `• ${r}`).join('\n')}

Calculado com YLADA - Ferramentas profissionais de bem-estar`
    navigator.clipboard.writeText(text)
    alert('Resultados copiados para a área de transferência!')
  }

  const shareResults = () => {
    if (!results) return
    const text = `Fiz minha avaliação nutricional com YLADA! Minha pontuação: ${results.score}/100 - ${results.riskLevel}. Que tal você também fazer a sua?`
    const url = window.location.href
    navigator.share({ title: 'Minha Avaliação Nutricional - YLADA', text, url })
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
                  <h1 className="text-2xl font-bold text-gray-900">Sua Avaliação Nutricional</h1>
                  <p className="text-sm text-gray-600">Avaliação Nutricional Completa - YLADA</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resultado da Sua Avaliação Nutricional</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Pontuação Geral</h3>
                <p className="text-4xl font-bold text-blue-600">{results.score}/100</p>
                <p className="text-sm text-gray-600">Baseado em múltiplos fatores</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Nível de Risco</h3>
                <p className={`text-2xl font-bold ${results.riskColor}`}>{results.riskLevel}</p>
                <p className="text-sm text-gray-600">
                  {results.riskLevel === 'Baixo' ? 'Continue mantendo bons hábitos' :
                   results.riskLevel === 'Moderado' ? 'Algumas melhorias são necessárias' :
                   'Consulte um profissional urgentemente'}
                </p>
              </div>
            </div>

            {/* Deficiencies */}
            <div className="bg-yellow-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                Possíveis Deficiências Nutricionais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.deficiencies.map((deficiency, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    {deficiency}
                  </div>
                ))}
              </div>
            </div>

            {/* Supplements */}
            <div className="bg-purple-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 text-purple-600 mr-2" />
                Suplementos Sugeridos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.supplements.map((supplement, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    {supplement}
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-emerald-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                Recomendações Nutricionais
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
              Quer uma avaliação nutricional completa?
            </h3>
            <p className="text-emerald-100 mb-6">
              Consulte um nutricionista profissional para uma avaliação detalhada e plano personalizado
            </p>
            <button className="px-8 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Consultar Nutricionista Profissional
            </button>
          </div>
        </main>
      </div>
    )
  }

  const currentStepData = steps[currentStep]
  const isStepComplete = currentStepData.fields.every(field => {
    if (field === 'symptoms' || field === 'healthConditions') {
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
                <h1 className="text-2xl font-bold text-gray-900">Avaliação Nutricional</h1>
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

          {/* Symptoms Step */}
          {currentStep === 1 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Sintomas que você apresenta (selecione todos que se aplicam):
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {symptoms.map((symptom) => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                      answers.symptoms.includes(symptom)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Diet and Lifestyle Step */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualidade da sua alimentação *
                </label>
                <select
                  required
                  value={answers.diet}
                  onChange={(e) => setAnswers({...answers, diet: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="excellent">Excelente (muitas frutas, vegetais, grãos integrais)</option>
                  <option value="good">Boa (algumas frutas e vegetais)</option>
                  <option value="moderate">Moderada (poucas frutas e vegetais)</option>
                  <option value="poor">Ruim (poucos alimentos naturais)</option>
                  <option value="very-poor">Muito ruim (principalmente processados)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estilo de vida geral *
                </label>
                <select
                  required
                  value={answers.lifestyle}
                  onChange={(e) => setAnswers({...answers, lifestyle: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="excellent">Excelente (exercícios regulares, sono adequado)</option>
                  <option value="good">Bom (alguns exercícios, sono razoável)</option>
                  <option value="moderate">Moderado (poucos exercícios, sono irregular)</option>
                  <option value="poor">Ruim (sedentário, sono ruim)</option>
                  <option value="very-poor">Muito ruim (sedentário, sono muito ruim)</option>
                </select>
              </div>
            </div>
          )}

          {/* Health Conditions Step */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Condições de saúde (selecione todas que se aplicam):
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {healthConditions.map((condition) => (
                    <button
                      key={condition}
                      type="button"
                      onClick={() => toggleHealthCondition(condition)}
                      className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                        answers.healthConditions.includes(condition)
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {condition}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicamentos que você toma regularmente
                </label>
                <textarea
                  value={answers.medications}
                  onChange={(e) => setAnswers({...answers, medications: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="Ex: Metformina, Losartana..."
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Stress and Sleep Step */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de estresse *
                </label>
                <select
                  required
                  value={answers.stress}
                  onChange={(e) => setAnswers({...answers, stress: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
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
                  value={answers.sleep}
                  onChange={(e) => setAnswers({...answers, sleep: e.target.value})}
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
                nutricionista ou médico qualificado.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
