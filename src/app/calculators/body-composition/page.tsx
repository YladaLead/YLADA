'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Star,
  MessageCircle,
  Users,
  Heart,
  Activity,
  Target
} from 'lucide-react'
import { useUserData } from '@/lib/useUserData'

interface BodyCompositionResults {
  bmi: string
  bodyFatPercentage: string
  leanMass: string
  fatMass: string
  category: string
  color: string
  recommendations: string[]
  improvements: string[]
  measurements: string[]
}

export default function BodyCompositionCalculatorPage() {
  const { userData, getWhatsAppUrl, getCustomMessage, getPageTitle, getButtonText } = useUserData()
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    waist: '',
    hip: '',
    neck: ''
  })
  const [results, setResults] = useState<BodyCompositionResults | null>(null)
  const [showResults, setShowResults] = useState(false)

  const calculateBodyComposition = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height) / 100 // Convert cm to meters
    const age = parseInt(formData.age)
    const waist = parseFloat(formData.waist)
    const hip = parseFloat(formData.hip)
    const neck = parseFloat(formData.neck)
    
    if (!weight || !height || !age || !waist || !neck) return null
    
    // Calculate BMI
    const bmi = weight / (height * height)
    
    // Calculate body fat percentage using Navy method
    let bodyFatPercentage = 0
    
    if (formData.gender === 'masculino') {
      // Male formula: %BF = 495 / (1.0324 - 0.19077 * log10(waist - neck) + 0.15456 * log10(height)) - 450
      const logWaistNeck = Math.log10(waist - neck)
      const logHeight = Math.log10(height * 100) // Convert back to cm
      bodyFatPercentage = 495 / (1.0324 - 0.19077 * logWaistNeck + 0.15456 * logHeight) - 450
    } else {
      // Female formula: %BF = 495 / (1.29579 - 0.35004 * log10(waist + hip - neck) + 0.22100 * log10(height)) - 450
      if (!hip) return null
      const logWaistHipNeck = Math.log10(waist + hip - neck)
      const logHeight = Math.log10(height * 100) // Convert back to cm
      bodyFatPercentage = 495 / (1.29579 - 0.35004 * logWaistHipNeck + 0.22100 * logHeight) - 450
    }
    
    // Calculate fat mass and lean mass
    const fatMass = (weight * bodyFatPercentage / 100).toFixed(1)
    const leanMass = (weight - parseFloat(fatMass)).toFixed(1)
    
    let category = ''
    let color = ''
    let recommendations = []
    let improvements = []
    let measurements = []
    
    // Body fat categories
    if (formData.gender === 'masculino') {
      if (bodyFatPercentage < 6) {
        category = 'Gordura Essencial'
        color = 'text-blue-600'
        recommendations = [
          'Consulte um especialista para avaliação',
          'Monitore saúde cardiovascular',
          'Mantenha nutrição adequada'
        ]
        improvements = [
          'Otimizar composição corporal',
          'Manter saúde metabólica',
          'Prevenir perda muscular'
        ]
      } else if (bodyFatPercentage < 14) {
        category = 'Atleta'
        color = 'text-green-600'
        recommendations = [
          'Excelente composição corporal',
          'Mantenha rotina de exercícios',
          'Continue alimentação balanceada'
        ]
        improvements = [
          'Manter performance atlética',
          'Otimizar recuperação',
          'Prevenir lesões'
        ]
      } else if (bodyFatPercentage < 18) {
        category = 'Boa Forma'
        color = 'text-emerald-600'
        recommendations = [
          'Boa composição corporal',
          'Mantenha atividade física regular',
          'Monitore progresso'
        ]
        improvements = [
          'Manter massa muscular',
          'Otimizar definição',
          'Melhorar resistência'
        ]
      } else if (bodyFatPercentage < 25) {
        category = 'Aceitável'
        color = 'text-yellow-600'
        recommendations = [
          'Consulte um especialista para melhorias',
          'Aumente atividade física',
          'Ajuste alimentação'
        ]
        improvements = [
          'Reduzir gordura corporal',
          'Aumentar massa muscular',
          'Melhorar condicionamento'
        ]
      } else {
        category = 'Acima do Ideal'
        color = 'text-red-600'
        recommendations = [
          'Consulte um especialista urgentemente',
          'Plano de exercícios supervisionado',
          'Acompanhamento nutricional'
        ]
        improvements = [
          'Reduzir riscos à saúde',
          'Melhorar composição corporal',
          'Prevenir doenças crônicas'
        ]
      }
    } else {
      // Female categories
      if (bodyFatPercentage < 10) {
        category = 'Gordura Essencial'
        color = 'text-blue-600'
        recommendations = [
          'Consulte um especialista para avaliação',
          'Monitore saúde hormonal',
          'Mantenha nutrição adequada'
        ]
        improvements = [
          'Otimizar composição corporal',
          'Manter saúde metabólica',
          'Prevenir perda muscular'
        ]
      } else if (bodyFatPercentage < 16) {
        category = 'Atleta'
        color = 'text-green-600'
        recommendations = [
          'Excelente composição corporal',
          'Mantenha rotina de exercícios',
          'Continue alimentação balanceada'
        ]
        improvements = [
          'Manter performance atlética',
          'Otimizar recuperação',
          'Prevenir lesões'
        ]
      } else if (bodyFatPercentage < 20) {
        category = 'Boa Forma'
        color = 'text-emerald-600'
        recommendations = [
          'Boa composição corporal',
          'Mantenha atividade física regular',
          'Monitore progresso'
        ]
        improvements = [
          'Manter massa muscular',
          'Otimizar definição',
          'Melhorar resistência'
        ]
      } else if (bodyFatPercentage < 25) {
        category = 'Aceitável'
        color = 'text-yellow-600'
        recommendations = [
          'Consulte um especialista para melhorias',
          'Aumente atividade física',
          'Ajuste alimentação'
        ]
        improvements = [
          'Reduzir gordura corporal',
          'Aumentar massa muscular',
          'Melhorar condicionamento'
        ]
      } else {
        category = 'Acima do Ideal'
        color = 'text-red-600'
        recommendations = [
          'Consulte um especialista urgentemente',
          'Plano de exercícios supervisionado',
          'Acompanhamento nutricional'
        ]
        improvements = [
          'Reduzir riscos à saúde',
          'Melhorar composição corporal',
          'Prevenir doenças crônicas'
        ]
      }
    }
    
    measurements = [
      'Circunferência da cintura: ' + waist + 'cm',
      'Circunferência do pescoço: ' + neck + 'cm',
      formData.gender === 'feminino' ? 'Circunferência do quadril: ' + hip + 'cm' : 'Altura: ' + (height * 100) + 'cm',
      'Peso corporal: ' + weight + 'kg'
    ]
    
    return {
      bmi: bmi.toFixed(1),
      bodyFatPercentage: bodyFatPercentage.toFixed(1),
      leanMass,
      fatMass,
      category,
      color,
      recommendations,
      improvements,
      measurements
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const bodyCompositionResults = calculateBodyComposition()
    if (bodyCompositionResults) {
      setResults(bodyCompositionResults)
      setShowResults(true)
    }
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
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
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Seus Resultados</h1>
                  <p className="text-sm text-gray-600">Composição Corporal - Herbalead</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sua Composição Corporal</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full mb-4">
                  <span className="text-4xl font-bold text-purple-600">{results.bodyFatPercentage}%</span>
                </div>
                <h3 className={`text-2xl font-semibold ${results.color} mb-2`}>
                  {results.category}
                </h3>
                <p className="text-gray-600">Percentual de Gordura Corporal</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mb-4">
                  <span className="text-4xl font-bold text-indigo-600">{results.leanMass}kg</span>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Massa Magra
                </h3>
                <p className="text-gray-600">Músculos, ossos e órgãos</p>
              </div>
            </div>

            {/* Body Composition Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">IMC</h4>
                <p className="text-2xl font-bold text-gray-700">{results.bmi}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Massa Gorda</h4>
                <p className="text-2xl font-bold text-gray-700">{results.fatMass}kg</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Massa Magra</h4>
                <p className="text-2xl font-bold text-gray-700">{results.leanMass}kg</p>
              </div>
            </div>

            {/* Improvements Section */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 text-purple-600 mr-2" />
                O que você pode melhorar
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.improvements.map((improvement, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-gray-900">{improvement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Measurements */}
            <div className="bg-indigo-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Users className="w-5 h-5 text-indigo-600 mr-2" />
                Medidas Utilizadas
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.measurements.map((measurement, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">{measurement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-purple-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-purple-600 mr-2" />
                Recomendações Personalizadas
              </h4>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-8 text-center shadow-2xl border-2 border-purple-200">
            <h3 className="text-3xl font-bold mb-4 text-gray-800">
              🎯 {getPageTitle()}
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              {getCustomMessage()}
            </p>
            <button 
              onClick={() => {
                const whatsappUrl = getWhatsAppUrl()
                console.log('📱 Abrindo WhatsApp:', whatsappUrl)
                console.log('👤 Dados do usuário:', userData)
                window.open(whatsappUrl, '_blank')
              }}
              className="px-12 py-6 bg-purple-600 text-white rounded-xl font-bold text-xl hover:bg-purple-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl flex items-center justify-center mx-auto border-4 border-purple-500"
            >
              <MessageCircle className="w-8 h-8 mr-3" />
              {getButtonText()}
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => window.history.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Composição Corporal</h1>
                <p className="text-sm text-gray-600">Análise corporal completa e personalizada</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">O que é composição corporal?</h2>
          <p className="text-gray-600 mb-6">
            A composição corporal analisa a proporção de gordura, músculos, ossos e água no seu corpo. 
            É mais precisa que o IMC pois diferencia massa muscular de gordura, fornecendo uma visão 
            completa da sua saúde física e condicionamento.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Precisão</h3>
              <p className="text-sm text-gray-600">Método científico da Marinha dos EUA</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personalizado</h3>
              <p className="text-sm text-gray-600">Baseado nas suas medidas corporais</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Completo</h3>
              <p className="text-sm text-gray-600">Analisa gordura, músculos e saúde</p>
            </div>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Calcule sua Composição Corporal</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero *
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="175"
                />
              </div>
            </div>

            {/* Circumferences */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cintura (cm) *
                </label>
                <input
                  type="number"
                  required
                  min="30"
                  max="200"
                  step="0.1"
                  value={formData.waist}
                  onChange={(e) => setFormData({...formData, waist: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="80.0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pescoço (cm) *
                </label>
                <input
                  type="number"
                  required
                  min="20"
                  max="60"
                  step="0.1"
                  value={formData.neck}
                  onChange={(e) => setFormData({...formData, neck: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="35.0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quadril (cm) {formData.gender === 'feminino' ? '*' : '(opcional)'}
                </label>
                <input
                  type="number"
                  required={formData.gender === 'feminino'}
                  min="30"
                  max="200"
                  step="0.1"
                  value={formData.hip}
                  onChange={(e) => setFormData({...formData, hip: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="95.0"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-purple-600 text-white rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center"
              >
                Calcular Composição Corporal
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
                Esta calculadora é uma ferramenta de orientação baseada no método da Marinha dos EUA. 
                Não substitui uma avaliação médica completa. Consulte sempre um especialista.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}