'use client'

import { useState } from 'react'
import { 
  Calculator, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Heart,
  Target,
  Share2,
  Copy,
  Utensils,
  Clock
} from 'lucide-react'
import Link from 'next/link'

interface MealPlanResults {
  dailyCalories: string
  mealCalories: {
    breakfast: string
    lunch: string
    dinner: string
    snacks: string
  }
  macronutrients: {
    protein: string
    carbs: string
    fat: string
  }
  mealSuggestions: {
    breakfast: string[]
    lunch: string[]
    dinner: string[]
    snacks: string[]
  }
  recommendations: string[]
  shoppingList: string[]
}

export default function MealPlannerPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity: '',
    goal: '',
    dietaryRestrictions: '',
    preferences: ''
  })
  const [results, setResults] = useState<MealPlanResults | null>(null)
  const [showResults, setShowResults] = useState(false)

  const calculateMealPlan = () => {
    const weight = parseFloat(formData.weight)
    const age = parseFloat(formData.age)
    const height = parseFloat(formData.height)
    
    if (!weight || !age || !height) return null
    
    // Cálculo de calorias baseado na fórmula de Mifflin-St Jeor (OMS)
    let bmr
    if (formData.gender === 'masculino') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }
    
    // Fatores de atividade (OMS)
    const activityFactors = {
      'sedentario': 1.2,
      'leve': 1.375,
      'moderado': 1.55,
      'ativo': 1.725,
      'muito-ativo': 1.9
    }
    
    const activityFactor = activityFactors[formData.activity as keyof typeof activityFactors] || 1.2
    let dailyCalories = bmr * activityFactor
    
    // Ajustes por objetivo
    if (formData.goal === 'weight-loss') {
      dailyCalories = dailyCalories * 0.8 // Déficit de 20%
    } else if (formData.goal === 'muscle-gain') {
      dailyCalories = dailyCalories * 1.1 // Superávit de 10%
    }
    
    // Distribuição das calorias por refeição (OMS)
    const mealCalories = {
      breakfast: (dailyCalories * 0.25).toFixed(0),
      lunch: (dailyCalories * 0.35).toFixed(0),
      dinner: (dailyCalories * 0.25).toFixed(0),
      snacks: (dailyCalories * 0.15).toFixed(0)
    }
    
    // Distribuição de macronutrientes (OMS)
    const macronutrients = {
      protein: (dailyCalories * 0.15 / 4).toFixed(1), // 15% das calorias
      carbs: (dailyCalories * 0.55 / 4).toFixed(1), // 55% das calorias
      fat: (dailyCalories * 0.30 / 9).toFixed(1) // 30% das calorias
    }
    
    // Sugestões de refeições baseadas em diretrizes da OMS
    const mealSuggestions = {
      breakfast: [
        'Aveia com frutas e leite',
        'Pão integral com ovos e abacate',
        'Iogurte grego com granola',
        'Smoothie de frutas com proteína'
      ],
      lunch: [
        'Salada com proteína magra',
        'Arroz integral com frango grelhado',
        'Quinoa com legumes e peixe',
        'Sopa de legumes com pão integral'
      ],
      dinner: [
        'Peixe grelhado com vegetais',
        'Frango com batata doce',
        'Lentilhas com arroz integral',
        'Salmão com quinoa e brócolis'
      ],
      snacks: [
        'Frutas frescas',
        'Oleaginosas (castanhas, amêndoas)',
        'Iogurte natural',
        'Vegetais com hummus'
      ]
    }
    
    // Lista de compras baseada nas sugestões
    const shoppingList = [
      'Aveia integral',
      'Frutas da estação',
      'Leite ou leite vegetal',
      'Pão integral',
      'Ovos',
      'Abacate',
      'Iogurte grego',
      'Granola sem açúcar',
      'Proteína em pó',
      'Vegetais frescos',
      'Proteína magra (frango, peixe)',
      'Arroz integral',
      'Quinoa',
      'Leguminosas',
      'Oleaginosas',
      'Azeite extra virgem'
    ]
    
    // Recomendações baseadas em diretrizes da OMS
    const recommendations = [
      'Consuma pelo menos 5 porções de frutas e vegetais por dia',
      'Prefira grãos integrais aos refinados',
      'Limite o consumo de açúcar a menos de 10% das calorias',
      'Reduza o sal para menos de 5g por dia',
      'Evite gorduras trans e limite gorduras saturadas',
      'Mantenha hidratação adequada (35ml/kg/dia)',
      'Faça refeições regulares ao longo do dia',
      'Consulte um nutricionista para plano personalizado'
    ]
    
    return {
      dailyCalories: dailyCalories.toFixed(0),
      mealCalories,
      macronutrients,
      mealSuggestions,
      recommendations,
      shoppingList
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

  const copyResults = () => {
    if (!results) return
    const text = `Meu Plano de Refeições:
Calorias Diárias: ${results.dailyCalories}kcal

Distribuição por Refeição:
• Café da manhã: ${results.mealCalories.breakfast}kcal
• Almoço: ${results.mealCalories.lunch}kcal
• Jantar: ${results.mealCalories.dinner}kcal
• Lanches: ${results.mealCalories.snacks}kcal

Macronutrientes:
• Proteína: ${results.macronutrients.protein}g
• Carboidratos: ${results.macronutrients.carbs}g
• Gorduras: ${results.macronutrients.fat}g

Calculado com YLADA - Ferramentas profissionais de bem-estar`
    navigator.clipboard.writeText(text)
    alert('Resultados copiados para a área de transferência!')
  }

  const shareResults = () => {
    if (!results) return
    const text = `Criei meu plano de refeições personalizado com YLADA! Preciso de ${results.dailyCalories}kcal por dia. Que tal você também criar o seu?`
    const url = window.location.href
    navigator.share({ title: 'Meu Plano de Refeições - YLADA', text, url })
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
                  <h1 className="text-2xl font-bold text-gray-900">Seu Plano de Refeições</h1>
                  <p className="text-sm text-gray-600">Planejador de Refeições - YLADA</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seu Plano de Refeições Personalizado</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Calorias Diárias</h3>
                <p className="text-3xl font-bold text-blue-600">{results.dailyCalories}kcal</p>
                <p className="text-sm text-gray-600">Baseado em diretrizes da OMS</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Distribuição</h3>
                <p className="text-lg font-bold text-green-600">25% - 35% - 25% - 15%</p>
                <p className="text-sm text-gray-600">Café - Almoço - Jantar - Lanches</p>
              </div>
            </div>

            {/* Meal Calories */}
            <div className="bg-purple-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 text-purple-600 mr-2" />
                Distribuição de Calorias por Refeição
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <h4 className="font-medium text-gray-900">Café da Manhã</h4>
                  <p className="text-xl font-bold text-purple-600">{results.mealCalories.breakfast}kcal</p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-gray-900">Almoço</h4>
                  <p className="text-xl font-bold text-purple-600">{results.mealCalories.lunch}kcal</p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-gray-900">Jantar</h4>
                  <p className="text-xl font-bold text-purple-600">{results.mealCalories.dinner}kcal</p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-gray-900">Lanches</h4>
                  <p className="text-xl font-bold text-purple-600">{results.mealCalories.snacks}kcal</p>
                </div>
              </div>
            </div>

            {/* Macronutrients */}
            <div className="bg-yellow-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 text-yellow-600 mr-2" />
                Distribuição de Macronutrientes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <h4 className="font-medium text-gray-900">Proteína</h4>
                  <p className="text-2xl font-bold text-yellow-600">{results.macronutrients.protein}g</p>
                  <p className="text-sm text-gray-600">15% das calorias</p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-gray-900">Carboidratos</h4>
                  <p className="text-2xl font-bold text-yellow-600">{results.macronutrients.carbs}g</p>
                  <p className="text-sm text-gray-600">55% das calorias</p>
                </div>
                <div className="text-center">
                  <h4 className="font-medium text-gray-900">Gorduras</h4>
                  <p className="text-2xl font-bold text-yellow-600">{results.macronutrients.fat}g</p>
                  <p className="text-sm text-gray-600">30% das calorias</p>
                </div>
              </div>
            </div>

            {/* Meal Suggestions */}
            <div className="bg-emerald-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Utensils className="w-5 h-5 text-emerald-600 mr-2" />
                Sugestões de Refeições
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Café da Manhã</h4>
                  <ul className="space-y-1">
                    {results.mealSuggestions.breakfast.map((meal, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                        {meal}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Almoço</h4>
                  <ul className="space-y-1">
                    {results.mealSuggestions.lunch.map((meal, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                        {meal}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Jantar</h4>
                  <ul className="space-y-1">
                    {results.mealSuggestions.dinner.map((meal, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                        {meal}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Lanches</h4>
                  <ul className="space-y-1">
                    {results.mealSuggestions.snacks.map((meal, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                        {meal}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Shopping List */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 text-blue-600 mr-2" />
                Lista de Comras Sugerida
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {results.shoppingList.map((item, index) => (
                  <div key={index} className="text-sm text-gray-700 flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                    {item}
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
              Quer um plano alimentar personalizado?
            </h3>
            <p className="text-emerald-100 mb-6">
              Consulte um nutricionista profissional para um plano alimentar detalhado baseado nas suas necessidades específicas
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
                <h1 className="text-2xl font-bold text-gray-900">Planejador de Refeições</h1>
                <p className="text-sm text-gray-600">Cardápio personalizado e lista de compras</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Planejamento Nutricional Inteligente</h2>
          <p className="text-gray-600 mb-6">
            Um plano de refeições bem estruturado é fundamental para alcançar seus objetivos de saúde. 
            Nossa calculadora utiliza diretrizes oficiais da Organização Mundial da Saúde (OMS) 
            para criar um plano personalizado baseado nas suas necessidades específicas.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Utensils className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personalizado</h3>
              <p className="text-sm text-gray-600">Baseado em suas necessidades específicas</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Equilibrado</h3>
              <p className="text-sm text-gray-600">Distribuição ideal de macronutrientes</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Prático</h3>
              <p className="text-sm text-gray-600">Lista de compras e sugestões incluídas</p>
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

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Atividade *
                </label>
                <select
                  required
                  value={formData.activity}
                  onChange={(e) => setFormData({...formData, activity: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="sedentario">Sedentário</option>
                  <option value="leve">Leve (1-3x/semana)</option>
                  <option value="moderado">Moderado (3-5x/semana)</option>
                  <option value="ativo">Ativo (6-7x/semana)</option>
                  <option value="muito-ativo">Muito Ativo (2x/dia)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo Principal *
                </label>
                <select
                  required
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="maintenance">Manutenção</option>
                  <option value="weight-loss">Perda de Peso</option>
                  <option value="muscle-gain">Ganho de Massa Muscular</option>
                  <option value="performance">Performance Esportiva</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restrições Alimentares
                </label>
                <select
                  value={formData.dietaryRestrictions}
                  onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Nenhuma</option>
                  <option value="vegetarian">Vegetariano</option>
                  <option value="vegan">Vegano</option>
                  <option value="gluten-free">Sem Glúten</option>
                  <option value="lactose-free">Sem Lactose</option>
                  <option value="keto">Cetogênica</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferências Alimentares
              </label>
              <textarea
                value={formData.preferences}
                onChange={(e) => setFormData({...formData, preferences: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Ex: Não gosto de peixe, prefiro refeições rápidas..."
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-emerald-600 text-white rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
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
                Este plano fornece uma base nutricional baseada em diretrizes da OMS. 
                Para necessidades específicas, restrições alimentares ou condições de saúde, 
                consulte sempre um nutricionista qualificado.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
