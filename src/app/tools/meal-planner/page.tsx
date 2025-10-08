'use client'

import { useState } from 'react'
import { Heart, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function MealPlannerPage() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'masculino' as 'masculino' | 'feminino',
    activity: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active',
    goal: 'maintenance' as 'weight-loss' | 'muscle-gain' | 'maintenance' | 'endurance',
    dietaryRestrictions: [] as string[]
  })
  
  const [result, setResult] = useState<{
    dailyCalories: string
    protein: string
    carbs: string
    fats: string
    meals: {
      breakfast: string[]
      lunch: string[]
      dinner: string[]
      snacks: string[]
    }
    shoppingList: string[]
  } | null>(null)

  const calculateMealPlan = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height) / 100
    const age = parseInt(formData.age)
    
    if (!weight || !height || !age) return
    
    // Cálculo do BMR
    let bmr = 0
    if (formData.gender === 'masculino') {
      bmr = (10 * weight) + (6.25 * (height * 100)) - (5 * age) + 5
    } else {
      bmr = (10 * weight) + (6.25 * (height * 100)) - (5 * age) - 161
    }
    
    // Cálculo do TDEE
    let activityMultiplier = 1.2
    switch (formData.activity) {
      case 'sedentary': activityMultiplier = 1.2; break
      case 'light': activityMultiplier = 1.375; break
      case 'moderate': activityMultiplier = 1.55; break
      case 'active': activityMultiplier = 1.725; break
      case 'very-active': activityMultiplier = 1.9; break
    }
    
    let dailyCalories = bmr * activityMultiplier
    
    // Ajuste baseado no objetivo
    switch (formData.goal) {
      case 'weight-loss':
        dailyCalories *= 0.8 // Déficit de 20%
        break
      case 'muscle-gain':
        dailyCalories *= 1.1 // Superávit de 10%
        break
      case 'endurance':
        dailyCalories *= 1.15 // Superávit de 15%
        break
    }
    
    // Distribuição de macronutrientes
    let proteinRatio = 0.25
    let carbRatio = 0.45
    let fatRatio = 0.30
    
    if (formData.goal === 'muscle-gain') {
      proteinRatio = 0.30
      carbRatio = 0.40
      fatRatio = 0.30
    } else if (formData.goal === 'weight-loss') {
      proteinRatio = 0.30
      carbRatio = 0.35
      fatRatio = 0.35
    }
    
    const protein = Math.round((dailyCalories * proteinRatio) / 4)
    const carbs = Math.round((dailyCalories * carbRatio) / 4)
    const fats = Math.round((dailyCalories * fatRatio) / 9)
    
    // Sugestões de refeições
    const meals = {
      breakfast: [
        'Aveia com frutas e leite',
        'Ovos mexidos com pão integral',
        'Smoothie de banana e proteína',
        'Iogurte grego com granola'
      ],
      lunch: [
        'Frango grelhado com arroz integral',
        'Salmão com batata-doce',
        'Salada de quinoa com vegetais',
        'Peixe assado com legumes'
      ],
      dinner: [
        'Carne magra com batata',
        'Frango com vegetais salteados',
        'Peixe com quinoa',
        'Omelete com vegetais'
      ],
      snacks: [
        'Frutas frescas',
        'Nozes e castanhas',
        'Iogurte natural',
        'Barras de proteína caseiras'
      ]
    }
    
    const shoppingList = [
      'Proteínas magras (frango, peixe, ovos)',
      'Carboidratos complexos (arroz integral, quinoa, batata-doce)',
      'Vegetais variados (brócolis, espinafre, cenoura)',
      'Frutas frescas',
      'Gorduras saudáveis (azeite, abacate, nozes)',
      'Laticínios (leite, iogurte grego)',
      'Temperos e ervas',
      'Grãos integrais'
    ]
    
    setResult({
      dailyCalories: Math.round(dailyCalories).toString(),
      protein: protein.toString(),
      carbs: carbs.toString(),
      fats: fats.toString(),
      meals,
      shoppingList
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateMealPlan()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-3">
              <Link href="/fitlead" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
                <span>Voltar</span>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Planejador de Refeições</h1>
                <p className="text-xs text-gray-600">Powered by YLADA</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Planejador de Refeições Personalizado
            </h2>
            <p className="text-lg text-gray-600">
              Receba um cardápio completo baseado em suas necessidades nutricionais
            </p>
          </div>

          {!result ? (
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ex: 70"
                    min="1"
                    max="300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ex: 165"
                    min="50"
                    max="250"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idade
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ex: 35"
                    min="1"
                    max="120"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gênero
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as 'masculino' | 'feminino'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível de Atividade
                  </label>
                  <select
                    value={formData.activity}
                    onChange={(e) => setFormData({...formData, activity: e.target.value as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="sedentary">Sedentário</option>
                    <option value="light">Leve</option>
                    <option value="moderate">Moderado</option>
                    <option value="active">Ativo</option>
                    <option value="very-active">Muito Ativo</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objetivo
                  </label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({...formData, goal: e.target.value as 'weight-loss' | 'muscle-gain' | 'maintenance' | 'endurance'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="maintenance">Manutenção</option>
                    <option value="weight-loss">Perda de Peso</option>
                    <option value="muscle-gain">Ganho de Massa</option>
                    <option value="endurance">Melhorar Resistência</option>
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg"
              >
                Gerar Plano de Refeições
              </button>
            </form>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Seu Plano de Refeições
                </h3>
                <p className="text-lg text-gray-600">
                  Cardápio personalizado para seus objetivos
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-red-800 mb-1">Calorias</h4>
                  <p className="text-xl font-bold text-red-600">{result.dailyCalories}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-blue-800 mb-1">Proteína</h4>
                  <p className="text-xl font-bold text-blue-600">{result.protein}g</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-green-800 mb-1">Carboidratos</h4>
                  <p className="text-xl font-bold text-green-600">{result.carbs}g</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-yellow-800 mb-1">Gorduras</h4>
                  <p className="text-xl font-bold text-yellow-600">{result.fats}g</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-red-50 rounded-lg p-6">
                  <h4 className="font-semibold text-red-800 mb-4 text-lg">Café da Manhã</h4>
                  <ul className="space-y-2">
                    {result.meals.breakfast.map((meal, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-red-700">{meal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-4 text-lg">Almoço</h4>
                  <ul className="space-y-2">
                    {result.meals.lunch.map((meal, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-700">{meal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-green-50 rounded-lg p-6">
                  <h4 className="font-semibold text-green-800 mb-4 text-lg">Jantar</h4>
                  <ul className="space-y-2">
                    {result.meals.dinner.map((meal, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-green-700">{meal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h4 className="font-semibold text-yellow-800 mb-4 text-lg">Lanches</h4>
                  <ul className="space-y-2">
                    {result.meals.snacks.map((meal, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-yellow-700">{meal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-gray-800 mb-4 text-lg">
                  Lista de Compras:
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {result.shoppingList.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-gray-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setResult(null)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold mr-4"
                >
                  Gerar Novo Plano
                </button>
              </div>
              
              {/* Botão personalizado do especialista */}
              <SpecialistCTA toolName="meal-planner" />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
