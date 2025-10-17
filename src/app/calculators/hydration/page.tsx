'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Star,
  MessageCircle,
  Droplets,
  Heart,
  Activity,
  Target
} from 'lucide-react'
import { useUserData } from '@/lib/useUserData'

interface HydrationResults {
  dailyWater: string
  dailyWaterLiters: string
  category: string
  color: string
  recommendations: string[]
  improvements: string[]
  hydrationTips: string[]
}

export default function HydrationCalculatorPage() {
  const { userData, getWhatsAppUrl, getCustomMessage, getPageTitle, getButtonText } = useUserData()
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity: '',
    climate: ''
  })
  const [results, setResults] = useState<HydrationResults | null>(null)
  const [showResults, setShowResults] = useState(false)

  const calculateHydration = () => {
    const weight = parseFloat(formData.weight)
    const age = parseInt(formData.age)
    
    if (!weight || !age) return null
    
    // Base: 35ml por kg de peso corporal
    let baseWater = weight * 35
    
    // Ajustar baseado no nível de atividade
    switch (formData.activity) {
      case 'sedentario':
        baseWater += 0
        break
      case 'leve':
        baseWater += 300 // +300ml
        break
      case 'moderado':
        baseWater += 500 // +500ml
        break
      case 'intenso':
        baseWater += 800 // +800ml
        break
      case 'muito-intenso':
        baseWater += 1000 // +1000ml
        break
    }
    
    // Ajustar baseado no clima
    switch (formData.climate) {
      case 'frio':
        baseWater += 0
        break
      case 'temperado':
        baseWater += 200 // +200ml
        break
      case 'quente':
        baseWater += 500 // +500ml
        break
    }
    
    // Ajustar baseado na idade (idosos precisam de mais água)
    if (age > 65) {
      baseWater += 200
    }
    
    const dailyWaterLiters = (baseWater / 1000).toFixed(1)
    
    let category = ''
    let color = ''
    let recommendations = []
    let improvements = []
    let hydrationTips = []
    
    if (baseWater < weight * 30) {
      category = 'Hidratação Insuficiente'
      color = 'text-red-600'
      recommendations = [
        'Consulte um especialista para aumentar ingestão hídrica',
        'Inclua mais água na rotina diária',
        'Monitore sinais de desidratação'
      ]
      improvements = [
        'Melhorar função renal',
        'Otimizar circulação sanguínea',
        'Prevenir fadiga e cansaço'
      ]
    } else if (baseWater <= weight * 40) {
      category = 'Hidratação Adequada'
      color = 'text-green-600'
      recommendations = [
        'Mantenha a ingestão hídrica atual',
        'Distribua água ao longo do dia',
        'Monitore sinais de sede'
      ]
      improvements = [
        'Manter equilíbrio hídrico',
        'Otimizar função celular',
        'Prevenir desidratação'
      ]
    } else if (baseWater <= weight * 50) {
      category = 'Hidratação Otimizada'
      color = 'text-blue-600'
      recommendations = [
        'Excelente ingestão hídrica',
        'Mantenha distribuição equilibrada',
        'Considere eletrólitos durante exercícios'
      ]
      improvements = [
        'Maximizar performance física',
        'Melhorar recuperação',
        'Otimizar função cognitiva'
      ]
    } else {
      category = 'Hidratação Elevada'
      color = 'text-purple-600'
      recommendations = [
        'Consulte um especialista para monitoramento',
        'Verifique equilíbrio eletrolítico',
        'Ajuste conforme necessário'
      ]
      improvements = [
        'Maximizar hidratação celular',
        'Otimizar transporte de nutrientes',
        'Manter saúde renal'
      ]
    }
    
    hydrationTips = [
      'Beba água ao acordar para ativar o metabolismo',
      'Consuma água 30 minutos antes das refeições',
      'Mantenha uma garrafa de água sempre por perto',
      'Monitore a cor da urina (deve ser clara)',
      'Inclua frutas e vegetais ricos em água'
    ]
    
    return {
      dailyWater: baseWater.toFixed(0),
      dailyWaterLiters,
      category,
      color,
      recommendations,
      improvements,
      hydrationTips
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const hydrationResults = calculateHydration()
    if (hydrationResults) {
      setResults(hydrationResults)
      setShowResults(true)
    }
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
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
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Seus Resultados</h1>
                  <p className="text-sm text-gray-600">Calculadora de Hidratação - Herbalead</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sua Necessidade Diária de Água</h2>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full mb-4">
                <span className="text-4xl font-bold text-blue-600">{results.dailyWaterLiters}L</span>
              </div>
              <h3 className={`text-2xl font-semibold ${results.color} mb-2`}>
                {results.category}
              </h3>
              <p className="text-gray-600">
                {results.dailyWater}ml por dia baseado no seu perfil
              </p>
            </div>

            {/* Improvements Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 text-blue-600 mr-2" />
                O que você pode melhorar
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.improvements.map((improvement, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-gray-900">{improvement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hydration Tips */}
            <div className="bg-cyan-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Droplets className="w-5 h-5 text-cyan-600 mr-2" />
                Dicas de Hidratação
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.hydrationTips.map((tip, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">{tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                Recomendações Personalizadas
              </h4>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8 text-center shadow-2xl border-2 border-blue-200">
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
              className="px-12 py-6 bg-blue-600 text-white rounded-xl font-bold text-xl hover:bg-blue-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl flex items-center justify-center mx-auto border-4 border-blue-500"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Droplets className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Calculadora de Hidratação</h1>
                <p className="text-sm text-gray-600">Análise hídrica completa e personalizada</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Por que a hidratação é importante?</h2>
          <p className="text-gray-600 mb-6">
            A água é essencial para todas as funções corporais, incluindo regulação da temperatura, 
            transporte de nutrientes, eliminação de toxinas e manutenção da saúde celular. 
            Suas necessidades variam conforme peso, atividade física, clima e idade.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Saúde</h3>
              <p className="text-sm text-gray-600">Essencial para funções vitais</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-cyan-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
              <p className="text-sm text-gray-600">Melhora energia e concentração</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personalizado</h3>
              <p className="text-sm text-gray-600">Baseado no seu perfil</p>
            </div>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Calcule sua Necessidade de Hidratação</h2>
          
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="sedentario">Sedentário (pouco ou nenhum exercício)</option>
                <option value="leve">Leve (exercício leve 1-3 dias/semana)</option>
                <option value="moderado">Moderado (exercício moderado 3-5 dias/semana)</option>
                <option value="intenso">Intenso (exercício intenso 6-7 dias/semana)</option>
                <option value="muito-intenso">Muito Intenso (exercício muito intenso, trabalho físico)</option>
              </select>
            </div>

            {/* Climate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clima da Região *
              </label>
              <select
                required
                value={formData.climate}
                onChange={(e) => setFormData({...formData, climate: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="frio">Frio (temperaturas baixas)</option>
                <option value="temperado">Temperado (clima moderado)</option>
                <option value="quente">Quente (temperaturas altas)</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                Calcular Hidratação
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
                Esta calculadora é uma ferramenta de orientação e não substitui uma avaliação médica completa. 
                Consulte sempre um especialista para um plano de hidratação personalizado.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}