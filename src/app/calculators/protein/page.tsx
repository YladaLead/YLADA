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
import { useUserData } from '@/lib/useUserData'

interface ProteinResults {
  dailyProtein: string
  category: string
  color: string
  recommendations: string[]
  improvements: string[]
  proteinSources: string[]
}

export default function ProteinCalculatorPage() {
  const { userData, getWhatsAppUrl, getCustomMessage, getPageTitle, getButtonText } = useUserData()
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity: '',
    goal: ''
  })
  const [results, setResults] = useState<ProteinResults | null>(null)
  const [showResults, setShowResults] = useState(false)

  const calculateProtein = () => {
    const weight = parseFloat(formData.weight)
    const age = parseInt(formData.age)
    
    if (!weight || !age) return null
    
    let proteinPerKg = 0.8 // Base para sedentários
    
    // Ajustar baseado no nível de atividade
    switch (formData.activity) {
      case 'sedentario':
        proteinPerKg = 0.8
        break
      case 'leve':
        proteinPerKg = 1.0
        break
      case 'moderado':
        proteinPerKg = 1.2
        break
      case 'intenso':
        proteinPerKg = 1.6
        break
      case 'muito-intenso':
        proteinPerKg = 2.0
        break
    }
    
    // Ajustar baseado no objetivo
    switch (formData.goal) {
      case 'perda-peso':
        proteinPerKg += 0.2
        break
      case 'ganho-massa':
        proteinPerKg += 0.4
        break
      case 'manutencao':
        // Manter valor atual
        break
    }
    
    const dailyProtein = weight * proteinPerKg
    
    let category = ''
    let color = ''
    let recommendations = []
    let improvements = []
    let proteinSources = []
    
    if (dailyProtein < weight * 0.8) {
      category = 'Proteína Insuficiente'
      color = 'text-red-600'
      recommendations = [
        'Consulte um especialista para aumentar ingestão proteica',
        'Inclua mais fontes de proteína na alimentação',
        'Considere suplementação se necessário'
      ]
      improvements = [
        'Aumentar massa muscular',
        'Melhorar recuperação pós-exercício',
        'Otimizar síntese proteica'
      ]
    } else if (dailyProtein <= weight * 1.2) {
      category = 'Proteína Adequada'
      color = 'text-green-600'
      recommendations = [
        'Mantenha a ingestão proteica atual',
        'Distribua proteína ao longo do dia',
        'Monitore resultados regularmente'
      ]
      improvements = [
        'Manter massa muscular',
        'Otimizar performance',
        'Prevenir perda muscular'
      ]
    } else if (dailyProtein <= weight * 1.6) {
      category = 'Proteína Otimizada'
      color = 'text-blue-600'
      recommendations = [
        'Excelente ingestão para atividade física',
        'Mantenha distribuição equilibrada',
        'Considere timing das refeições'
      ]
      improvements = [
        'Maximizar ganho muscular',
        'Melhorar recuperação',
        'Otimizar composição corporal'
      ]
    } else {
      category = 'Proteína Elevada'
      color = 'text-purple-600'
      recommendations = [
        'Consulte um especialista para monitoramento',
        'Verifique função renal regularmente',
        'Ajuste conforme necessário'
      ]
      improvements = [
        'Maximizar resultados atléticos',
        'Otimizar recuperação intensa',
        'Manter saúde renal'
      ]
    }
    
    proteinSources = [
      'Carnes magras (frango, peixe, carne vermelha)',
      'Ovos e laticínios',
      'Leguminosas (feijão, lentilha, grão-de-bico)',
      'Nozes e sementes',
      'Suplementos proteicos'
    ]
    
    return {
      dailyProtein: dailyProtein.toFixed(1),
      category,
      color,
      recommendations,
      improvements,
      proteinSources
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const proteinResults = calculateProtein()
    if (proteinResults) {
      setResults(proteinResults)
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
                  <p className="text-sm text-gray-600">Calculadora de Proteína - Herbalead</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sua Necessidade Diária de Proteína</h2>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full mb-4">
                <span className="text-4xl font-bold text-emerald-600">{results.dailyProtein}g</span>
              </div>
              <h3 className={`text-2xl font-semibold ${results.color} mb-2`}>
                {results.category}
              </h3>
              <p className="text-gray-600">
                Recomendação diária baseada no seu perfil
              </p>
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

            {/* Protein Sources */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 text-blue-600 mr-2" />
                Fontes de Proteína Recomendadas
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.proteinSources.map((source, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">{source}</span>
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
            <button
              onClick={() => window.history.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Calculadora de Proteína</h1>
                <p className="text-sm text-gray-600">Análise nutricional completa e personalizada</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Por que a proteína é importante?</h2>
          <p className="text-gray-600 mb-6">
            A proteína é essencial para construção e reparo muscular, produção de enzimas e hormônios, 
            e manutenção da saúde óssea. Suas necessidades variam conforme idade, peso, atividade física e objetivos.
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
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
              <p className="text-sm text-gray-600">Melhora recuperação e força</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personalizado</h3>
              <p className="text-sm text-gray-600">Baseado no seu perfil</p>
            </div>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Calcule sua Necessidade de Proteína</h2>
          
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

            {/* Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo *
              </label>
              <select
                required
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="manutencao">Manutenção do peso atual</option>
                <option value="perda-peso">Perda de peso</option>
                <option value="ganho-massa">Ganho de massa muscular</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-emerald-600 text-white rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                Calcular Proteína
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
                Esta calculadora é uma ferramenta de orientação e não substitui uma avaliação nutricional completa. 
                Consulte sempre um especialista para um plano alimentar personalizado.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}