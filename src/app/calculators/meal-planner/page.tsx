'use client'

import { useState } from 'react'
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Star,
  MessageCircle,
  Utensils,
  Heart,
  Activity,
  Target
} from 'lucide-react'
import { useUserData } from '@/lib/useUserData'

interface MealPlanResults {
  dailyCalories: string
  protein: string
  carbs: string
  fat: string
  meals: {
    name: string
    calories: string
    protein: string
    carbs: string
    fat: string
    time: string
  }[]
  recommendations: string[]
  improvements: string[]
  mealTips: string[]
}

export default function MealPlannerCalculatorPage() {
  const { userData, getWhatsAppUrl, getCustomMessage, getPageTitle, getButtonText } = useUserData()
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity: '',
    goal: ''
  })
  const [results, setResults] = useState<MealPlanResults | null>(null)
  const [showResults, setShowResults] = useState(false)

  const calculateMealPlan = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height) / 100 // Convert cm to meters
    const age = parseInt(formData.age)
    
    if (!weight || !height || !age) return null
    
    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    let bmr = 0
    if (formData.gender === 'masculino') {
      bmr = 10 * weight + 6.25 * (height * 100) - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * (height * 100) - 5 * age - 161
    }
    
    // Activity multiplier
    let activityMultiplier = 1.2 // Sedentary
    switch (formData.activity) {
      case 'sedentario':
        activityMultiplier = 1.2
        break
      case 'leve':
        activityMultiplier = 1.375
        break
      case 'moderado':
        activityMultiplier = 1.55
        break
      case 'intenso':
        activityMultiplier = 1.725
        break
      case 'muito-intenso':
        activityMultiplier = 1.9
        break
    }
    
    // Goal adjustment
    let goalMultiplier = 1.0
    switch (formData.goal) {
      case 'perda-peso':
        goalMultiplier = 0.8 // 20% deficit
        break
      case 'ganho-peso':
        goalMultiplier = 1.2 // 20% surplus
        break
      case 'manutencao':
        goalMultiplier = 1.0
        break
    }
    
    const dailyCalories = Math.round(bmr * activityMultiplier * goalMultiplier)
    
    // Macronutrient distribution
    const protein = Math.round(dailyCalories * 0.25 / 4) // 25% calories from protein
    const carbs = Math.round(dailyCalories * 0.45 / 4) // 45% calories from carbs
    const fat = Math.round(dailyCalories * 0.30 / 9) // 30% calories from fat
    
    // Meal distribution (5 meals)
    const meals = [
      {
        name: 'Café da Manhã',
        calories: Math.round(dailyCalories * 0.25).toString(),
        protein: Math.round(protein * 0.25).toString(),
        carbs: Math.round(carbs * 0.25).toString(),
        fat: Math.round(fat * 0.25).toString(),
        time: '07:00'
      },
      {
        name: 'Lanche da Manhã',
        calories: Math.round(dailyCalories * 0.10).toString(),
        protein: Math.round(protein * 0.10).toString(),
        carbs: Math.round(carbs * 0.10).toString(),
        fat: Math.round(fat * 0.10).toString(),
        time: '10:00'
      },
      {
        name: 'Almoço',
        calories: Math.round(dailyCalories * 0.30).toString(),
        protein: Math.round(protein * 0.30).toString(),
        carbs: Math.round(carbs * 0.30).toString(),
        fat: Math.round(fat * 0.30).toString(),
        time: '13:00'
      },
      {
        name: 'Lanche da Tarde',
        calories: Math.round(dailyCalories * 0.15).toString(),
        protein: Math.round(protein * 0.15).toString(),
        carbs: Math.round(carbs * 0.15).toString(),
        fat: Math.round(fat * 0.15).toString(),
        time: '16:00'
      },
      {
        name: 'Jantar',
        calories: Math.round(dailyCalories * 0.20).toString(),
        protein: Math.round(protein * 0.20).toString(),
        carbs: Math.round(carbs * 0.20).toString(),
        fat: Math.round(fat * 0.20).toString(),
        time: '19:00'
      }
    ]
    
    let recommendations = []
    let improvements = []
    let mealTips = []
    
    if (formData.goal === 'perda-peso') {
      recommendations = [
        'Consulte um especialista para plano personalizado',
        'Mantenha déficit calórico controlado',
        'Priorize alimentos integrais e proteínas'
      ]
      improvements = [
        'Reduzir gordura corporal',
        'Manter massa muscular',
        'Melhorar composição corporal'
      ]
    } else if (formData.goal === 'ganho-peso') {
      recommendations = [
        'Consulte um especialista para ganho saudável',
        'Aumente calorias gradualmente',
        'Foque em alimentos nutritivos e calóricos'
      ]
      improvements = [
        'Aumentar massa muscular',
        'Melhorar densidade óssea',
        'Otimizar absorção de nutrientes'
      ]
    } else {
      recommendations = [
        'Mantenha alimentação equilibrada',
        'Monitore progresso regularmente',
        'Ajuste conforme necessário'
      ]
      improvements = [
        'Manter composição corporal',
        'Otimizar performance',
        'Prevenir ganho de peso'
      ]
    }
    
    mealTips = [
      'Faça 5-6 refeições por dia para manter metabolismo ativo',
      'Consuma proteína em todas as refeições',
      'Inclua vegetais em pelo menos 2 refeições',
      'Beba água entre as refeições',
      'Evite pular refeições para manter energia estável'
    ]
    
    return {
      dailyCalories: dailyCalories.toString(),
      protein: protein.toString(),
      carbs: carbs.toString(),
      fat: fat.toString(),
      meals,
      recommendations,
      improvements,
      mealTips
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const mealPlanResults = calculateMealPlan()
    if (mealPlanResults) {
      setResults(mealPlanResults)
      setShowResults(true)
    }
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
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
                <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                  <Utensils className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Seu Plano de Refeições</h1>
                  <p className="text-sm text-gray-600">Planejador de Refeições - Herbalead</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seu Plano Nutricional Diário</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-100 to-red-100 rounded-full mb-4">
                  <span className="text-2xl font-bold text-orange-600">{results.dailyCalories}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Calorias</h3>
                <p className="text-gray-600 text-sm">Por dia</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-red-100 to-orange-100 rounded-full mb-4">
                  <span className="text-2xl font-bold text-red-600">{results.protein}g</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Proteína</h3>
                <p className="text-gray-600 text-sm">25% das calorias</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full mb-4">
                  <span className="text-2xl font-bold text-yellow-600">{results.carbs}g</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Carboidratos</h3>
                <p className="text-gray-600 text-sm">45% das calorias</p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-100 to-yellow-100 rounded-full mb-4">
                  <span className="text-2xl font-bold text-green-600">{results.fat}g</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Gorduras</h3>
                <p className="text-gray-600 text-sm">30% das calorias</p>
              </div>
            </div>

            {/* Meal Plan */}
            <div className="bg-orange-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Utensils className="w-5 h-5 text-orange-600 mr-2" />
                Distribuição das Refeições
              </h4>
              <div className="space-y-4">
                {results.meals.map((meal, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-semibold text-gray-900">{meal.name}</h5>
                      <span className="text-sm text-gray-500">{meal.time}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Calorias:</span>
                        <span className="font-semibold text-orange-600 ml-1">{meal.calories}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Proteína:</span>
                        <span className="font-semibold text-red-600 ml-1">{meal.protein}g</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Carboidratos:</span>
                        <span className="font-semibold text-yellow-600 ml-1">{meal.carbs}g</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Gorduras:</span>
                        <span className="font-semibold text-green-600 ml-1">{meal.fat}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvements Section */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 text-orange-600 mr-2" />
                O que você pode melhorar
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.improvements.map((improvement, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-gray-900">{improvement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meal Tips */}
            <div className="bg-red-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 text-red-600 mr-2" />
                Dicas de Alimentação
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.mealTips.map((tip, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">{tip}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-orange-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-orange-600 mr-2" />
                Recomendações Personalizadas
              </h4>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8 text-center shadow-2xl border-2 border-orange-200">
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
              className="px-12 py-6 bg-orange-600 text-white rounded-xl font-bold text-xl hover:bg-orange-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl flex items-center justify-center mx-auto border-4 border-orange-500"
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
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
              <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Planejador de Refeições</h1>
                <p className="text-sm text-gray-600">Plano nutricional completo e personalizado</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Por que planejar suas refeições?</h2>
          <p className="text-gray-600 mb-6">
            O planejamento de refeições ajuda a manter uma alimentação equilibrada, controlar calorias, 
            distribuir macronutrientes adequadamente e alcançar seus objetivos de saúde e fitness. 
            Um plano estruturado facilita a adesão e melhora os resultados.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Equilíbrio</h3>
              <p className="text-sm text-gray-600">Distribuição adequada de nutrientes</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Controle</h3>
              <p className="text-sm text-gray-600">Gestão precisa de calorias</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Objetivos</h3>
              <p className="text-sm text-gray-600">Alinhado com suas metas</p>
            </div>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Crie seu Plano de Refeições</h2>
          
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="manutencao">Manutenção do peso atual</option>
                <option value="perda-peso">Perda de peso</option>
                <option value="ganho-peso">Ganho de peso</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-orange-600 text-white rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center"
              >
                Criar Plano de Refeições
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
                Este planejador é uma ferramenta de orientação baseada na equação de Mifflin-St Jeor. 
                Não substitui uma avaliação nutricional completa. Consulte sempre um especialista.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}