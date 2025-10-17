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
  Star,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'
import { useUserData } from '@/lib/useUserData'
import HelpButton from '@/components/HelpButton'

interface BMIResults {
  bmi: string
  category: string
  color: string
  recommendations: string[]
  improvements: string[]
  idealWeight: {
    min: string
    max: string
  }
}

export default function BMICalculatorPage() {
  const { userData, getWhatsAppUrl, getCustomMessage, getPageTitle, getButtonText } = useUserData()
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity: ''
  })
  const [results, setResults] = useState<BMIResults | null>(null)
  const [showResults, setShowResults] = useState(false)

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height) / 100 // Convert cm to meters
    
    if (!weight || !height) return null
    
    const bmi = weight / (height * height)
    
    let category = ''
    let color = ''
    let recommendations = []
    let improvements = []
    
    if (bmi < 18.5) {
      category = 'Abaixo do peso'
      color = 'text-blue-600'
      recommendations = [
        'Consulte um especialista para ganho de peso saudável',
        'Foque em alimentos nutritivos e calóricos',
        'Considere exercícios de força para ganho de massa muscular'
      ]
      improvements = [
        'Aumentar massa muscular com exercícios de força',
        'Melhorar densidade óssea com atividades físicas',
        'Otimizar absorção de nutrientes com alimentação balanceada'
      ]
    } else if (bmi < 25) {
      category = 'Peso normal'
      color = 'text-green-600'
      recommendations = [
        'Mantenha uma alimentação equilibrada',
        'Continue praticando exercícios regularmente',
        'Monitore seu peso periodicamente'
      ]
      improvements = [
        'Manter composição corporal ideal',
        'Otimizar performance física',
        'Prevenir ganho de peso futuro'
      ]
    } else if (bmi < 30) {
      category = 'Sobrepeso'
      color = 'text-yellow-600'
      recommendations = [
        'Consulte um especialista para plano de emagrecimento',
        'Reduza calorias e aumente atividade física',
        'Foque em alimentos integrais e vegetais'
      ]
      improvements = [
        'Reduzir gordura corporal de forma saudável',
        'Aumentar massa muscular magra',
        'Melhorar resistência cardiovascular'
      ]
    } else {
      category = 'Obesidade'
      color = 'text-red-600'
      recommendations = [
        'Consulte um especialista urgentemente',
        'Plano de emagrecimento supervisionado',
        'Acompanhamento médico regular'
      ]
      improvements = [
        'Reduzir riscos cardiovasculares',
        'Melhorar qualidade de vida',
        'Prevenir complicações de saúde'
      ]
    }
    
    return {
      bmi: bmi.toFixed(1),
      category,
      color,
      recommendations,
      improvements,
      idealWeight: {
        min: (18.5 * height * height).toFixed(1),
        max: (24.9 * height * height).toFixed(1)
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const bmiResults = calculateBMI()
    if (bmiResults) {
      setResults(bmiResults)
      setShowResults(true)
    }
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
                  <h1 className="text-2xl font-bold text-gray-900">Seus Resultados</h1>
                  <p className="text-sm text-gray-600">Calculadora de IMC - Herbalead</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seu Resultado de IMC</h2>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full mb-4">
                <span className="text-4xl font-bold text-emerald-600">{results.bmi}</span>
              </div>
              <h3 className={`text-2xl font-semibold ${results.color} mb-2`}>
                {results.category}
              </h3>
              <p className="text-gray-600">
                Peso ideal para sua altura: {results.idealWeight.min}kg - {results.idealWeight.max}kg
              </p>
            </div>

            {/* BMI Scale */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Escala de IMC</h4>
              <div className="relative h-8 bg-gray-200 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex">
                  <div className="w-1/4 bg-blue-500"></div>
                  <div className="w-1/4 bg-green-500"></div>
                  <div className="w-1/4 bg-yellow-500"></div>
                  <div className="w-1/4 bg-red-500"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white px-2 py-1 rounded text-sm font-medium">
                    Seu IMC: {results.bmi}
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-2">
                <span>&lt; 18.5</span>
                <span>18.5 - 24.9</span>
                <span>25 - 29.9</span>
                <span>&gt; 30</span>
              </div>
            </div>

            {/* Improvements Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 text-emerald-600 mr-2" />
                O que você pode melhorar
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.improvements.map((improvement, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-gray-900">{improvement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-emerald-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                Recomendações Personalizadas
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

          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-8 text-center shadow-2xl border-2 border-emerald-200">
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
              className="px-12 py-6 bg-emerald-600 text-white rounded-xl font-bold text-xl hover:bg-emerald-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl flex items-center justify-center mx-auto border-4 border-emerald-500"
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
                <h1 className="text-2xl font-bold text-gray-900">Calculadora de IMC</h1>
                <p className="text-sm text-gray-600">Análise corporal completa e personalizada</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">O que é o IMC?</h2>
          <p className="text-gray-600 mb-6">
            O Índice de Massa Corporal (IMC) é uma medida que relaciona peso e altura para avaliar se uma pessoa está 
            dentro de uma faixa de peso considerada saudável. É uma ferramenta útil para identificar possíveis riscos 
            à saúde relacionados ao peso.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Saúde</h3>
              <p className="text-sm text-gray-600">Avalia riscos relacionados ao peso</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Precisão</h3>
              <p className="text-sm text-gray-600">Baseado em dados científicos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personalizado</h3>
              <p className="text-sm text-gray-600">Recomendações específicas para você</p>
            </div>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Calcule seu IMC</h2>
          
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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

            {/* Activity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Atividade Física *
              </label>
              <select
                required
                value={formData.activity}
                onChange={(e) => setFormData({...formData, activity: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="sedentario">Sedentário (pouco ou nenhum exercício)</option>
                <option value="leve">Leve (exercício leve 1-3 dias/semana)</option>
                <option value="moderado">Moderado (exercício moderado 3-5 dias/semana)</option>
                <option value="intenso">Intenso (exercício intenso 6-7 dias/semana)</option>
                <option value="muito-intenso">Muito Intenso (exercício muito intenso, trabalho físico)</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-emerald-600 text-white rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                Calcular IMC
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
                O IMC é uma ferramenta de triagem e não substitui uma avaliação médica completa. 
                Consulte sempre um profissional de saúde para uma análise mais detalhada da sua saúde.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      {/* Botão de Ajuda */}
      <HelpButton />
    </div>
  )
}
