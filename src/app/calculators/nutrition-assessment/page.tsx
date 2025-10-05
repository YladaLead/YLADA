'use client'

import { useState } from 'react'
import { 
  Calculator, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Activity,
  Target,
  Share2,
  Copy,
  Brain,
  Shield
} from 'lucide-react'
import Link from 'next/link'

interface NutritionAssessmentResults {
  overallScore: string
  riskLevel: string
  riskColor: string
  deficiencies: string[]
  recommendations: string[]
  supplements: string[]
  lifestyleChanges: string[]
  nextSteps: string[]
}

export default function NutritionAssessmentPage() {
  const [formData, setFormData] = useState({
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
  const [results, setResults] = useState<NutritionAssessmentResults | null>(null)
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

  const calculateNutritionAssessment = () => {
    const age = parseFloat(formData.age)
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height)
    
    if (!age || !weight || !height) return null
    
    let score = 0
    
    // Avaliação por sintomas (40 pontos)
    const symptomScore = Math.max(0, 40 - (formData.symptoms.length * 2.5))
    score += symptomScore
    
    // Avaliação por dieta (20 pontos)
    const dietScores = {
      'excellent': 20,
      'good': 15,
      'moderate': 10,
      'poor': 5,
      'very-poor': 0
    }
    score += dietScores[formData.diet as keyof typeof dietScores] || 0
    
    // Avaliação por estilo de vida (20 pontos)
    const lifestyleScores = {
      'excellent': 20,
      'good': 15,
      'moderate': 10,
      'poor': 5,
      'very-poor': 0
    }
    score += lifestyleScores[formData.lifestyle as keyof typeof lifestyleScores] || 0
    
    // Avaliação por condições de saúde (10 pontos)
    const healthScore = Math.max(0, 10 - (formData.healthConditions.length * 2))
    score += healthScore
    
    // Avaliação por estresse (5 pontos)
    const stressScores = {
      'low': 5,
      'moderate': 3,
      'high': 1,
      'very-high': 0
    }
    score += stressScores[formData.stress as keyof typeof stressScores] || 0
    
    // Avaliação por sono (5 pontos)
    const sleepScores = {
      'excellent': 5,
      'good': 4,
      'moderate': 3,
      'poor': 2,
      'very-poor': 1
    }
    score += sleepScores[formData.sleep as keyof typeof sleepScores] || 0
    
    const overallScore = Math.max(0, Math.min(100, score))
    
    // Determinar nível de risco
    let riskLevel = 'Baixo'
    let riskColor = 'text-green-600'
    
    if (overallScore < 40) {
      riskLevel = 'Alto'
      riskColor = 'text-red-600'
    } else if (overallScore < 60) {
      riskLevel = 'Moderado'
      riskColor = 'text-yellow-600'
    }
    
    // Identificar possíveis deficiências baseadas em sintomas
    const deficiencies = []
    if (formData.symptoms.includes('Fadiga constante') || formData.symptoms.includes('Fraqueza muscular')) {
      deficiencies.push('Ferro (Anemia)')
    }
    if (formData.symptoms.includes('Queda de cabelo') || formData.symptoms.includes('Unhas quebradiças')) {
      deficiencies.push('Biotina')
    }
    if (formData.symptoms.includes('Pele seca') || formData.symptoms.includes('Problemas de visão')) {
      deficiencies.push('Vitamina A')
    }
    if (formData.symptoms.includes('Cãibras musculares') || formData.symptoms.includes('Problemas de sono')) {
      deficiencies.push('Magnésio')
    }
    if (formData.symptoms.includes('Problemas de memória') || formData.symptoms.includes('Irritabilidade')) {
      deficiencies.push('Vitamina B12')
    }
    if (formData.symptoms.includes('Sensibilidade ao frio') || formData.symptoms.includes('Problemas de tireoide')) {
      deficiencies.push('Iodo')
    }
    if (formData.symptoms.includes('Dores nas articulações') || formData.symptoms.includes('Cicatrização lenta')) {
      deficiencies.push('Vitamina C')
    }
    
    // Recomendações baseadas em diretrizes da OMS
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
    
    // Suplementos sugeridos (baseados em deficiências identificadas)
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
    if (deficiencies.includes('Vitamina D')) {
      supplements.push('Vitamina D3')
    }
    if (overallScore < 60) {
      supplements.push('Multivitamínico de qualidade')
    }
    
    // Mudanças de estilo de vida
    const lifestyleChanges = [
      'Estabeleça uma rotina de sono regular (7-9 horas)',
      'Pratique exercícios físicos regularmente',
      'Gerencie o estresse através de técnicas de relaxamento',
      'Evite fumar e limite o consumo de álcool',
      'Exponha-se ao sol moderadamente para vitamina D',
      'Mantenha um peso saudável',
      'Faça exames médicos regulares',
      'Consulte um nutricionista para plano personalizado'
    ]
    
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
      overallScore: overallScore.toFixed(0),
      riskLevel,
      riskColor,
      deficiencies: deficiencies.length > 0 ? deficiencies : ['Nenhuma deficiência específica identificada'],
      recommendations,
      supplements: supplements.length > 0 ? supplements : ['Multivitamínico básico (opcional)'],
      lifestyleChanges,
      nextSteps
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const assessmentResults = calculateNutritionAssessment()
    if (assessmentResults) {
      setResults(assessmentResults)
      setShowResults(true)
    }
  }

  const toggleSymptom = (symptom: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom]
    }))
  }

  const toggleHealthCondition = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter(c => c !== condition)
        : [...prev.healthConditions, condition]
    }))
  }

  const copyResults = () => {
    if (!results) return
    const text = `Minha Avaliação Nutricional:
Pontuação Geral: ${results.overallScore}/100
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
    const text = `Fiz minha avaliação nutricional com YLADA! Minha pontuação: ${results.overallScore}/100 - ${results.riskLevel}. Que tal você também fazer a sua?`
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
                  <p className="text-sm text-gray-600">Avaliação Nutricional - YLADA</p>
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
                <p className="text-4xl font-bold text-blue-600">{results.overallScore}/100</p>
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

            {/* Lifestyle Changes */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 text-blue-600 mr-2" />
                Mudanças de Estilo de Vida
              </h4>
              <ul className="space-y-2">
                {results.lifestyleChanges.map((change, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-700">{change}</span>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Avaliação Nutricional</h1>
                <p className="text-sm text-gray-600">Identifique deficiências nutricionais</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Avaliação Nutricional Completa</h2>
          <p className="text-gray-600 mb-6">
            Uma avaliação nutricional adequada pode identificar possíveis deficiências e orientar 
            melhorias na alimentação. Nossa ferramenta utiliza critérios baseados em diretrizes da 
            Organização Mundial da Saúde (OMS) para fornecer uma análise abrangente do seu estado nutricional.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Brain className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Completa</h3>
              <p className="text-sm text-gray-600">Avalia múltiplos aspectos nutricionais</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Precisa</h3>
              <p className="text-sm text-gray-600">Baseada em critérios científicos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Orientativa</h3>
              <p className="text-sm text-gray-600">Fornece recomendações práticas</p>
            </div>
          </div>
        </div>

        {/* Assessment Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Faça sua Avaliação Nutricional</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
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
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
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
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>
            </div>

            {/* Physical Measurements */}
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
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
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
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="175"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sexo *
              </label>
              <select
                required
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>

            {/* Symptoms */}
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
                      formData.symptoms.includes(symptom)
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            {/* Diet Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualidade da sua alimentação *
              </label>
              <select
                required
                value={formData.diet}
                onChange={(e) => setFormData({...formData, diet: e.target.value})}
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

            {/* Lifestyle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estilo de vida geral *
              </label>
              <select
                required
                value={formData.lifestyle}
                onChange={(e) => setFormData({...formData, lifestyle: e.target.value})}
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

            {/* Health Conditions */}
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
                      formData.healthConditions.includes(condition)
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {condition}
                  </button>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medicamentos que você toma regularmente
              </label>
              <textarea
                value={formData.medications}
                onChange={(e) => setFormData({...formData, medications: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ex: Metformina, Losartana..."
                rows={3}
              />
            </div>

            {/* Stress Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de estresse *
              </label>
              <select
                required
                value={formData.stress}
                onChange={(e) => setFormData({...formData, stress: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="low">Baixo</option>
                <option value="moderate">Moderado</option>
                <option value="high">Alto</option>
                <option value="very-high">Muito alto</option>
              </select>
            </div>

            {/* Sleep Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualidade do sono *
              </label>
              <select
                required
                value={formData.sleep}
                onChange={(e) => setFormData({...formData, sleep: e.target.value})}
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

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-emerald-600 text-white rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                Fazer Avaliação Nutricional
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </form>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Importante</h4>
              <p className="text-yellow-700 text-sm">
                Esta avaliação fornece uma análise preliminar baseada em critérios da OMS. 
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
