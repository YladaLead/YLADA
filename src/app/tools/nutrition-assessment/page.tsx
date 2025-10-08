'use client'

import { useState } from 'react'
import { Heart, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import SpecialistCTA from '@/components/SpecialistCTA'

export default function NutritionAssessmentPage() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'masculino' as 'masculino' | 'feminino',
    activity: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active',
    dietQuality: 'regular' as 'poor' | 'regular' | 'good' | 'excellent',
    mealFrequency: '3' as '1-2' | '3' | '4-5' | '6+',
    waterIntake: 'adequate' as 'inadequate' | 'adequate' | 'excellent',
    healthConditions: [] as string[],
    symptoms: [] as string[]
  })
  
  const [result, setResult] = useState<{
    score: string
    percentage: string
    category: string
    color: string
    nutritionalNeeds: {
      calories: string
      protein: string
      carbs: string
      fats: string
      fiber: string
      water: string
    }
    recommendations: string[]
    priorityAreas: string[]
  } | null>(null)

  const calculateNutritionAssessment = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height) / 100
    const age = parseInt(formData.age)
    
    if (!weight || !height || !age) return
    
    // Cálculo do BMR e TDEE
    let bmr = 0
    if (formData.gender === 'masculino') {
      bmr = (10 * weight) + (6.25 * (height * 100)) - (5 * age) + 5
    } else {
      bmr = (10 * weight) + (6.25 * (height * 100)) - (5 * age) - 161
    }
    
    let activityMultiplier = 1.2
    switch (formData.activity) {
      case 'sedentary': activityMultiplier = 1.2; break
      case 'light': activityMultiplier = 1.375; break
      case 'moderate': activityMultiplier = 1.55; break
      case 'active': activityMultiplier = 1.725; break
      case 'very-active': activityMultiplier = 1.9; break
    }
    
    const dailyCalories = bmr * activityMultiplier
    
    // Cálculo da pontuação nutricional
    let score = 0
    const maxScore = 100
    
    // Pontuação baseada na qualidade da dieta
    switch (formData.dietQuality) {
      case 'poor': score += 20; break
      case 'regular': score += 40; break
      case 'good': score += 70; break
      case 'excellent': score += 90; break
    }
    
    // Pontuação baseada na frequência das refeições
    switch (formData.mealFrequency) {
      case '1-2': score += 10; break
      case '3': score += 30; break
      case '4-5': score += 50; break
      case '6+': score += 40; break
    }
    
    // Pontuação baseada na hidratação
    switch (formData.waterIntake) {
      case 'inadequate': score += 5; break
      case 'adequate': score += 20; break
      case 'excellent': score += 30; break
    }
    
    // Penalização por condições de saúde
    score -= formData.healthConditions.length * 10
    score -= formData.symptoms.length * 5
    
    // Garantir que a pontuação não seja negativa
    score = Math.max(0, score)
    
    const percentage = Math.round((score / maxScore) * 100)
    
    let category = ''
    let color = ''
    let recommendations: string[] = []
    let priorityAreas: string[] = []
    
    if (percentage >= 80) {
      category = 'Excelente Perfil Nutricional'
      color = 'text-green-600'
      recommendations = [
        'Continue mantendo seus hábitos alimentares saudáveis',
        'Mantenha a diversidade na alimentação',
        'Continue monitorando sua hidratação',
        'Considere consultas regulares com nutricionista'
      ]
      priorityAreas = ['Manutenção', 'Otimização']
    } else if (percentage >= 60) {
      category = 'Bom Perfil Nutricional'
      color = 'text-blue-600'
      recommendations = [
        'Melhore a qualidade geral da alimentação',
        'Aumente a frequência das refeições',
        'Inclua mais frutas e vegetais',
        'Monitore sua hidratação diária'
      ]
      priorityAreas = ['Qualidade Alimentar', 'Frequência das Refeições']
    } else if (percentage >= 40) {
      category = 'Perfil Nutricional Regular'
      color = 'text-yellow-600'
      recommendations = [
        'Implemente mudanças graduais na alimentação',
        'Aumente significativamente a ingestão de água',
        'Procure orientação nutricional profissional',
        'Foque em alimentos integrais e naturais'
      ]
      priorityAreas = ['Hidratação', 'Qualidade Alimentar', 'Orientação Profissional']
    } else {
      category = 'Perfil Nutricional Precisa de Atenção'
      color = 'text-red-600'
      recommendations = [
        'Procure orientação médica e nutricional urgente',
        'Implemente mudanças básicas na alimentação',
        'Aumente drasticamente a ingestão de água',
        'Considere acompanhamento especializado'
      ]
      priorityAreas = ['Orientação Médica', 'Hidratação', 'Alimentação Básica']
    }
    
    // Necessidades nutricionais calculadas
    const protein = Math.round((dailyCalories * 0.25) / 4)
    const carbs = Math.round((dailyCalories * 0.45) / 4)
    const fats = Math.round((dailyCalories * 0.30) / 9)
    const fiber = Math.round(weight * 0.4) // 0.4g por kg de peso
    const water = Math.round(weight * 35) // 35ml por kg de peso
    
    setResult({
      score: score.toString(),
      percentage: percentage.toString(),
      category,
      color,
      nutritionalNeeds: {
        calories: Math.round(dailyCalories).toString(),
        protein: protein.toString(),
        carbs: carbs.toString(),
        fats: fats.toString(),
        fiber: fiber.toString(),
        water: water.toString()
      },
      recommendations,
      priorityAreas
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateNutritionAssessment()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
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
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Avaliação Nutricional</h1>
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
              Avaliação Nutricional Completa
            </h2>
            <p className="text-lg text-gray-600">
              Análise detalhada do seu perfil nutricional e necessidades específicas
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    Qualidade da Alimentação
                  </label>
                  <select
                    value={formData.dietQuality}
                    onChange={(e) => setFormData({...formData, dietQuality: e.target.value as 'poor' | 'regular' | 'good' | 'excellent'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="poor">Ruim</option>
                    <option value="regular">Regular</option>
                    <option value="good">Boa</option>
                    <option value="excellent">Excelente</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequência de Refeições
                  </label>
                  <select
                    value={formData.mealFrequency}
                    onChange={(e) => setFormData({...formData, mealFrequency: e.target.value as '1-2' | '3' | '4-5' | '6+'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="1-2">1-2 refeições/dia</option>
                    <option value="3">3 refeições/dia</option>
                    <option value="4-5">4-5 refeições/dia</option>
                    <option value="6+">6+ refeições/dia</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ingestão de Água
                  </label>
                  <select
                    value={formData.waterIntake}
                    onChange={(e) => setFormData({...formData, waterIntake: e.target.value as 'inadequate' | 'adequate' | 'excellent'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="inadequate">Inadequada</option>
                    <option value="adequate">Adequada</option>
                    <option value="excellent">Excelente</option>
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
              >
                Realizar Avaliação Nutricional
              </button>
            </form>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Resultado da Avaliação
                </h3>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {result.percentage}%
                </div>
                <p className={`text-xl font-semibold ${result.color}`}>
                  {result.category}
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-purple-800 mb-1">Calorias</h4>
                  <p className="text-xl font-bold text-purple-600">{result.nutritionalNeeds.calories}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-blue-800 mb-1">Proteína</h4>
                  <p className="text-xl font-bold text-blue-600">{result.nutritionalNeeds.protein}g</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-green-800 mb-1">Carboidratos</h4>
                  <p className="text-xl font-bold text-green-600">{result.nutritionalNeeds.carbs}g</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-yellow-800 mb-1">Gorduras</h4>
                  <p className="text-xl font-bold text-yellow-600">{result.nutritionalNeeds.fats}g</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-orange-800 mb-1">Fibras</h4>
                  <p className="text-xl font-bold text-orange-600">{result.nutritionalNeeds.fiber}g</p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-cyan-800 mb-1">Água</h4>
                  <p className="text-xl font-bold text-cyan-600">{result.nutritionalNeeds.water}ml</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-purple-50 rounded-lg p-6">
                  <h4 className="font-semibold text-purple-800 mb-4 text-lg">
                    Recomendações:
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-purple-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-indigo-50 rounded-lg p-6">
                  <h4 className="font-semibold text-indigo-800 mb-4 text-lg">
                    Áreas Prioritárias:
                  </h4>
                  <ul className="space-y-2">
                    {result.priorityAreas.map((area, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-indigo-700">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setResult(null)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold mr-4"
                >
                  Refazer Avaliação
                </button>
              </div>
              
              {/* Botão personalizado do especialista */}
              <SpecialistCTA toolName="nutrition-assessment" />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
