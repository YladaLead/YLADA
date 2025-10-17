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
  Heart
} from 'lucide-react'
import Link from 'next/link'

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

export default function MealPlannerDemoPage() {
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
                  <p className="text-sm text-gray-600">Planejador de Refeições - Demo Herbalead</p>
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

            {/* CTA Button - Consultar Especialista */}
            <div className="text-center mt-8">
              <button 
                onClick={() => window.location.href = '/payment'}
                className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center mx-auto"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Consultar Especialista
              </button>
              <p className="text-sm text-gray-500 mt-3">
                💡 Esta é uma demonstração! Na versão real, este botão redirecionaria para o WhatsApp do especialista.
              </p>
            </div>

          </div>

          {/* CTA Section - Simples após resultado */}
          <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-gray-200 mt-8">
            <h3 className="text-3xl font-bold mb-4 text-gray-800">
              💼 Pronto para gerar seus próprios links com seu nome pessoal?
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Clique em &quot;Quero gerar meus links&quot; e comece a gerar seus próprios leads com o Herbalead.
            </p>
            <button 
              onClick={() => window.location.href = '/payment'}
              className="px-12 py-6 bg-emerald-600 text-white rounded-xl font-bold text-xl hover:bg-emerald-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl"
            >
              Clique abaixo e começa a gerar seus leads agora
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
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Planejador de Refeições</h1>
                <p className="text-sm text-gray-600">Demo - Herbalead</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Impact Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl shadow-lg p-8 mb-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Veja como seus clientes terão uma experiência incrível
          </h2>
          <p className="text-xl text-orange-100 mb-6">
            E como cada ferramenta pode gerar novos contatos automaticamente!
          </p>
          <div className="bg-white/20 rounded-lg p-4 inline-block">
            <p className="text-sm">
              💡 Esta é uma versão de demonstração. Quando você adquirir o acesso, poderá personalizar o botão, mensagem e link de destino (WhatsApp, formulário ou site).
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 Como funciona esta ferramenta para gerar leads
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">1️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cliente preenche dados</h4>
              <p className="text-sm text-gray-600">Peso, altura, idade, atividade física e objetivos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">2️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sistema calcula plano</h4>
              <p className="text-sm text-gray-600">Calorias, macronutrientes e distribuição de refeições</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">3️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cliente entra em contato</h4>
              <p className="text-sm text-gray-600">Clica no botão e conversa com você automaticamente</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-orange-600 font-semibold">💬 Você escolhe o texto e o link do botão!</p>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
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

        {/* CTA Section - Persuasiva */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-center shadow-2xl border-2 border-emerald-400">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            🚀 Pronto para começar a gerar seus próprios leads?
          </h3>
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            Você acabou de ver como funciona! Agora imagine ter esta ferramenta com <strong>seu nome</strong>, <strong>seu link</strong> e <strong>sua mensagem personalizada</strong>.
          </p>
          
          <div className="bg-white/20 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <h4 className="text-2xl font-bold text-white mb-4">✨ O que você vai receber:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-emerald-100">Calculadora personalizada com seu nome</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-emerald-100">Link único para compartilhar</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-emerald-100">Mensagem personalizada para WhatsApp</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-emerald-100">Todas as 9 ferramentas disponíveis</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 mb-8">
            <h4 className="text-2xl font-bold text-gray-800 mb-4">💡 Como funciona na prática:</h4>
            <ul className="text-left text-gray-600 space-y-3 text-lg">
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">1</span>
                </div>
                <span>Cliente preenche os dados e vê o resultado</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">2</span>
                </div>
                <span>Clica no botão &quot;Consultar Especialista&quot;</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">3</span>
                </div>
                <span>É redirecionado automaticamente para seu WhatsApp</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">4</span>
                </div>
                <span>Mensagem personalizada já vem pronta</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">5</span>
                </div>
                <span><strong>Você recebe o lead qualificado!</strong></span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 mb-8">
            <h4 className="text-2xl font-bold text-white mb-3">🔥 Oferta Especial!</h4>
            <p className="text-white text-lg mb-4">
              Comece hoje mesmo e tenha acesso a <strong>todas as 9 ferramentas</strong> por apenas <strong>R$ 60/mês</strong>
            </p>
            <p className="text-white/90 text-sm">
              ✅ 7 dias para cancelar sem questionamentos ✅ Suporte prioritário ✅ Sem taxa de setup
            </p>
          </div>

          <button 
            onClick={() => window.location.href = '/payment'}
            className="px-16 py-6 bg-white text-emerald-600 rounded-2xl font-bold text-2xl hover:bg-gray-50 transition-all duration-300 shadow-2xl transform hover:scale-105 hover:shadow-white/25 flex items-center justify-center mx-auto"
          >
            <Star className="w-8 h-8 mr-4" />
            Quero começar a gerar leads agora!
            <ArrowRight className="w-8 h-8 ml-4" />
          </button>
          
          <p className="text-emerald-200 text-sm mt-4">
            💳 Pagamento seguro • 🔒 Sem compromisso • ⚡ Ativação imediata
          </p>
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