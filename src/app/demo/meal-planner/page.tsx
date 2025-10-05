'use client'

import { useState } from 'react'
import { ArrowLeft, Heart, CheckCircle, Clock, Utensils } from 'lucide-react'
import Link from 'next/link'

export default function MealPlannerDemoPage() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'masculino',
    activity: 'moderate',
    goal: 'maintenance',
    mealsPerDay: '3',
    dietaryRestrictions: []
  })
  const [result, setResult] = useState<{
    tdee: number
    proteinGrams: number
    carbGrams: number
    fatGrams: number
    proteinPerMeal: number
    carbPerMeal: number
    fatPerMeal: number
    mealsPerDay: number
    mealSuggestions: {
      breakfast: string[]
      lunch: string[]
      dinner: string[]
      snacks: string[]
    }
    shoppingList: string[]
  } | null>(null)
  const [showResult, setShowResult] = useState(false)

  const dietaryOptions = [
    { value: 'vegetarian', label: 'Vegetariano' },
    { value: 'vegan', label: 'Vegano' },
    { value: 'keto', label: 'Cetogênica' },
    { value: 'low-carb', label: 'Low Carb' },
    { value: 'gluten-free', label: 'Sem Glúten' },
    { value: 'lactose-free', label: 'Sem Lactose' }
  ]

  const calculateMealPlan = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height) / 100
    const age = parseInt(formData.age)
    
    // Cálculo do TDEE
    let bmr = 0
    if (formData.gender === 'masculino') {
      bmr = (10 * weight) + (6.25 * height * 100) - (5 * age) + 5
    } else {
      bmr = (10 * weight) + (6.25 * height * 100) - (5 * age) - 161
    }
    
    const activityMultipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9
    }
    
    let tdee = bmr * activityMultipliers[formData.activity as keyof typeof activityMultipliers]
    
    // Ajuste por objetivo
    const goalAdjustments = {
      'weight-loss': 0.8,
      'maintenance': 1.0,
      'muscle-gain': 1.1
    }
    
    tdee = tdee * goalAdjustments[formData.goal as keyof typeof goalAdjustments]
    
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
    
    const proteinCalories = tdee * proteinRatio
    const carbCalories = tdee * carbRatio
    const fatCalories = tdee * fatRatio
    
    const proteinGrams = Math.round(proteinCalories / 4)
    const carbGrams = Math.round(carbCalories / 4)
    const fatGrams = Math.round(fatCalories / 9)
    
    // Distribuição por refeições
    const mealsPerDay = parseInt(formData.mealsPerDay)
    const proteinPerMeal = Math.round(proteinGrams / mealsPerDay)
    const carbPerMeal = Math.round(carbGrams / mealsPerDay)
    const fatPerMeal = Math.round(fatGrams / mealsPerDay)
    
    // Sugestões de refeições
    const mealSuggestions = generateMealSuggestions(formData.dietaryRestrictions)
    
    // Lista de compras
    const shoppingList = generateShoppingList(formData.dietaryRestrictions)

    setResult({
      tdee: Math.round(tdee),
      proteinGrams,
      carbGrams,
      fatGrams,
      proteinPerMeal,
      carbPerMeal,
      fatPerMeal,
      mealsPerDay,
      mealSuggestions,
      shoppingList
    })
    setShowResult(true)
  }

  const generateMealSuggestions = (_restrictions: string[]) => {
    const suggestions = {
      breakfast: [
        'Aveia com frutas e leite',
        'Ovos mexidos com pão integral',
        'Smoothie de banana e whey protein',
        'Iogurte grego com granola'
      ],
      lunch: [
        'Frango grelhado com arroz e legumes',
        'Salmão com batata doce e brócolis',
        'Quinoa com vegetais e tofu',
        'Salada de grão-de-bico com atum'
      ],
      dinner: [
        'Carne magra com purê de batata',
        'Peixe assado com legumes',
        'Lentilha com arroz integral',
        'Frango com salada verde'
      ],
      snacks: [
        'Frutas frescas',
        'Castanhas e nozes',
        'Iogurte natural',
        'Vegetais com homus'
      ]
    }
    
    return suggestions
  }

  const generateShoppingList = (_restrictions: string[]) => {
    return [
      'Proteínas: Frango, peixe, ovos, tofu',
      'Carboidratos: Arroz integral, quinoa, batata doce',
      'Vegetais: Brócolis, espinafre, tomate, cenoura',
      'Frutas: Banana, maçã, frutas vermelhas',
      'Gorduras: Azeite, abacate, castanhas',
      'Laticínios: Leite, iogurte grego, queijo cottage'
    ]
  }

  const handleDietaryChange = (value: string) => {
    const restrictions = formData.dietaryRestrictions.includes(value)
      ? formData.dietaryRestrictions.filter(r => r !== value)
      : [...formData.dietaryRestrictions, value]
    
    setFormData({ ...formData, dietaryRestrictions: restrictions })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Planejador de Refeições - Demo</h1>
                <p className="text-sm text-gray-600">Demonstração da ferramenta profissional</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Esta é uma demonstração
              </h3>
              <p className="text-blue-700">
                Esta é uma versão de demonstração da ferramenta. Na versão completa, 
                você receberá os dados dos seus clientes automaticamente e poderá 
                personalizar com sua marca.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Planejador de Refeições
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="175"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sexo *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível de Atividade *
                  </label>
                  <select
                    value={formData.activity}
                    onChange={(e) => setFormData({...formData, activity: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                    Objetivo *
                  </label>
                  <select
                    value={formData.goal}
                    onChange={(e) => setFormData({...formData, goal: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="weight-loss">Perda de Peso</option>
                    <option value="maintenance">Manutenção</option>
                    <option value="muscle-gain">Ganho de Massa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Refeições por Dia *
                </label>
                <select
                  value={formData.mealsPerDay}
                  onChange={(e) => setFormData({...formData, mealsPerDay: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="3">3 refeições</option>
                  <option value="4">4 refeições</option>
                  <option value="5">5 refeições</option>
                  <option value="6">6 refeições</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Restrições Alimentares
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {dietaryOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.dietaryRestrictions.includes(option.value)}
                        onChange={() => handleDietaryChange(option.value)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={calculateMealPlan}
                disabled={!formData.weight || !formData.height || !formData.age}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Gerar Plano de Refeições
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Plano de Refeições
            </h2>
            
            {showResult && result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{result.tdee}</div>
                    <div className="text-sm text-gray-600">Calorias/dia</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{result.mealsPerDay}</div>
                    <div className="text-sm text-gray-600">Refeições/dia</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-lg font-bold text-red-600">{result.proteinGrams}g</div>
                    <div className="text-xs text-gray-600">Proteína</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-lg font-bold text-yellow-600">{result.carbGrams}g</div>
                    <div className="text-xs text-gray-600">Carboidrato</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-600">{result.fatGrams}g</div>
                    <div className="text-xs text-gray-600">Gordura</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Por Refeição:</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-red-600">{result.proteinPerMeal}g</div>
                      <div className="text-gray-600">Proteína</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-yellow-600">{result.carbPerMeal}g</div>
                      <div className="text-gray-600">Carboidrato</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-600">{result.fatPerMeal}g</div>
                      <div className="text-gray-600">Gordura</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Sugestões de Refeições:</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center mb-1">
                        <Clock className="w-4 h-4 text-orange-500 mr-2" />
                        <span className="font-medium text-gray-900">Café da Manhã</span>
                      </div>
                      <ul className="text-sm text-gray-600 ml-6">
                        {result.mealSuggestions.breakfast.map((meal: string, index: number) => (
                          <li key={index}>• {meal}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <Utensils className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="font-medium text-gray-900">Almoço</span>
                      </div>
                      <ul className="text-sm text-gray-600 ml-6">
                        {result.mealSuggestions.lunch.map((meal: string, index: number) => (
                          <li key={index}>• {meal}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <Utensils className="w-4 h-4 text-purple-500 mr-2" />
                        <span className="font-medium text-gray-900">Jantar</span>
                      </div>
                      <ul className="text-sm text-gray-600 ml-6">
                        {result.mealSuggestions.dinner.map((meal: string, index: number) => (
                          <li key={index}>• {meal}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Lista de Compras:</h3>
                  <ul className="space-y-1">
                    {result.shoppingList.map((item: string, index: number) => (
                      <li key={index} className="flex items-start text-sm text-gray-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Preencha os dados para ver o plano</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Gostou da demonstração?
          </h3>
          <p className="text-emerald-100 mb-6">
            Com a versão completa, você receberá os dados dos seus clientes automaticamente 
            e poderá personalizar com sua marca.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/register"
              className="px-8 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Começar Gratuitamente
            </a>
            <Link
              href="/"
              className="px-8 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
            >
              Ver Outras Ferramentas
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}