'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function NutritionAssessmentDemoPage() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'masculino' as 'masculino' | 'feminino',
    weight: '',
    height: '',
    activity: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active',
    dietQuality: 'good' as 'poor' | 'fair' | 'good' | 'excellent',
    mealFrequency: '3' as '1-2' | '3' | '4-5' | '6+',
    waterIntake: 'adequate' as 'inadequate' | 'adequate' | 'excellent',
    supplements: 'none' as 'none' | 'basic' | 'comprehensive',
    healthConditions: [] as string[],
    symptoms: [] as string[]
  })
  const [result, setResult] = useState<{
    bmi: string
    tdee: string
    score: string
    maxScore: number
    percentage: string
    category: string
    color: string
    recommendations: string[]
    priorityAreas: string[]
    nutritionalNeeds: {
      calories: string
      protein: string
      carbs: string
      fat: string
      fiber: string
      water: string
    }
  } | null>(null)
  const [showResult, setShowResult] = useState(false)

  const healthConditions = [
    'Diabetes',
    'Hipertensão',
    'Colesterol alto',
    'Problemas digestivos',
    'Alergias alimentares',
    'Intolerâncias',
    'Outros'
  ]

  const symptoms = [
    'Fadiga constante',
    'Dificuldade de concentração',
    'Problemas de sono',
    'Mudanças de humor',
    'Problemas digestivos',
    'Dores de cabeça',
    'Fraqueza muscular',
    'Outros'
  ]

  const calculateNutritionAssessment = () => {
    const age = parseInt(formData.age)
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height) / 100
    
    // Cálculo do IMC
    const bmi = weight / (height * height)
    
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
    
    const tdee = bmr * activityMultipliers[formData.activity as keyof typeof activityMultipliers]
    
    // Avaliação da qualidade da dieta
    let dietScore = 0
    switch(formData.dietQuality) {
      case 'excellent': dietScore = 4; break
      case 'good': dietScore = 3; break
      case 'fair': dietScore = 2; break
      case 'poor': dietScore = 1; break
    }
    
    // Avaliação da frequência de refeições
    let mealScore = 0
    switch(formData.mealFrequency) {
      case '1-2': mealScore = 1; break
      case '3': mealScore = 3; break
      case '4-5': mealScore = 4; break
      case '6+': mealScore = 2; break
    }
    
    // Avaliação da hidratação
    let waterScore = 0
    switch(formData.waterIntake) {
      case 'inadequate': waterScore = 1; break
      case 'adequate': waterScore = 3; break
      case 'excellent': waterScore = 4; break
    }
    
    // Penalidades por condições de saúde e sintomas
    const healthPenalty = formData.healthConditions.length * 0.5
    const symptomPenalty = formData.symptoms.length * 0.3
    
    // Cálculo do score total
    const totalScore = dietScore + mealScore + waterScore - healthPenalty - symptomPenalty
    const maxScore = 11
    const percentage = (totalScore / maxScore) * 100
    
    // Classificação
    let category = ''
    let color = ''
    let recommendations = []
    let priorityAreas = []
    let nutritionalNeeds = {
      calories: '0',
      protein: '0',
      carbs: '0',
      fat: '0',
      fiber: '0',
      water: '0'
    }
    
    if (percentage >= 80) {
      category = 'Excelente Estado Nutricional'
      color = 'text-green-600'
      recommendations = [
        'Continue mantendo seus hábitos alimentares saudáveis',
        'Monitore regularmente sua composição corporal',
        'Considere otimizações específicas para seus objetivos',
        'Mantenha a consistência na hidratação'
      ]
      priorityAreas = ['Manutenção', 'Otimização', 'Consistência']
    } else if (percentage >= 60) {
      category = 'Bom Estado Nutricional'
      color = 'text-blue-600'
      recommendations = [
        'Melhore gradualmente a qualidade da sua alimentação',
        'Ajuste a frequência das refeições conforme necessário',
        'Mantenha hidratação adequada',
        'Considere suplementação específica se necessário'
      ]
      priorityAreas = ['Qualidade alimentar', 'Hidratação', 'Frequência de refeições']
    } else if (percentage >= 40) {
      category = 'Estado Nutricional Regular'
      color = 'text-yellow-600'
      recommendations = [
        'Foque em melhorar a qualidade da alimentação',
        'Estabeleça uma rotina regular de refeições',
        'Aumente a ingestão de água',
        'Considere buscar orientação nutricional profissional'
      ]
      priorityAreas = ['Qualidade alimentar', 'Rotina alimentar', 'Hidratação']
    } else {
      category = 'Estado Nutricional Precisa Atenção'
      color = 'text-red-600'
      recommendations = [
        'Busque orientação nutricional profissional urgente',
        'Implemente mudanças graduais na alimentação',
        'Priorize hidratação adequada',
        'Considere avaliação médica completa',
        'Foque em alimentos integrais e nutritivos'
      ]
      priorityAreas = ['Orientação profissional', 'Mudanças alimentares', 'Hidratação']
    }
    
    // Necessidades nutricionais específicas
    nutritionalNeeds = {
      calories: tdee.toFixed(0),
      protein: (weight * 1.2).toFixed(0), // g/kg
      carbs: (tdee * 0.45 / 4).toFixed(0), // 45% das calorias
      fat: (tdee * 0.25 / 9).toFixed(0), // 25% das calorias
      fiber: (weight * 0.4).toFixed(0), // g/kg
      water: (weight * 35).toFixed(0) // ml/kg
    }

    setResult({
      bmi: bmi.toFixed(1),
      tdee: tdee.toFixed(0),
      score: totalScore.toFixed(1),
      maxScore,
      percentage: percentage.toFixed(0),
      category,
      color,
      recommendations,
      priorityAreas,
      nutritionalNeeds
    })
    setShowResult(true)
  }

  const handleHealthConditionChange = (condition: string) => {
    const conditions = formData.healthConditions.includes(condition)
      ? formData.healthConditions.filter(c => c !== condition)
      : [...formData.healthConditions, condition]
    
    setFormData({ ...formData, healthConditions: conditions })
  }

  const handleSymptomChange = (symptom: string) => {
    const symptoms = formData.symptoms.includes(symptom)
      ? formData.symptoms.filter(s => s !== symptom)
      : [...formData.symptoms, symptom]
    
    setFormData({ ...formData, symptoms })
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
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Avaliação Nutricional - Demo</h1>
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
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
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
              Avaliação Nutricional
            </h2>
            
            <form className="space-y-6">
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
                    onChange={(e) => setFormData({...formData, gender: e.target.value as 'masculino' | 'feminino'})}
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
                    Nível de Atividade *
                  </label>
                  <select
                    value={formData.activity}
                    onChange={(e) => setFormData({...formData, activity: e.target.value as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'})}
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
                    Qualidade da Dieta *
                  </label>
                  <select
                    value={formData.dietQuality}
                    onChange={(e) => setFormData({...formData, dietQuality: e.target.value as 'poor' | 'fair' | 'good' | 'excellent'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="excellent">Excelente</option>
                    <option value="good">Boa</option>
                    <option value="fair">Regular</option>
                    <option value="poor">Ruim</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refeições por Dia *
                  </label>
                  <select
                    value={formData.mealFrequency}
                    onChange={(e) => setFormData({...formData, mealFrequency: e.target.value as '1-2' | '3' | '4-5' | '6+'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="1-2">1-2 refeições</option>
                    <option value="3">3 refeições</option>
                    <option value="4-5">4-5 refeições</option>
                    <option value="6+">6+ refeições</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hidratação *
                  </label>
                  <select
                    value={formData.waterIntake}
                    onChange={(e) => setFormData({...formData, waterIntake: e.target.value as 'inadequate' | 'adequate' | 'excellent'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="inadequate">Inadequada</option>
                    <option value="adequate">Adequada</option>
                    <option value="excellent">Excelente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condições de Saúde
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {healthConditions.map((condition) => (
                    <label key={condition} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.healthConditions.includes(condition)}
                        onChange={() => handleHealthConditionChange(condition)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{condition}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sintomas Relacionados à Nutrição
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {symptoms.map((symptom) => (
                    <label key={symptom} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.symptoms.includes(symptom)}
                        onChange={() => handleSymptomChange(symptom)}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700">{symptom}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={calculateNutritionAssessment}
                disabled={!formData.age || !formData.weight || !formData.height}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Realizar Avaliação Nutricional
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Resultado da Avaliação
            </h2>
            
            {showResult && result ? (
              <div className="space-y-6">
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <div className={`text-4xl font-bold ${result.color} mb-2`}>
                    {result.percentage}%
                  </div>
                  <div className={`text-xl font-semibold ${result.color}`}>
                    {result.category}
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    Score: {result.score}/{result.maxScore}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{result.bmi}</div>
                    <div className="text-sm text-gray-600">IMC</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{result.tdee}</div>
                    <div className="text-sm text-gray-600">Calorias/dia</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
                    Necessidades Nutricionais Diárias:
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-red-50 rounded-lg text-center">
                      <div className="font-bold text-red-600">{result.nutritionalNeeds.protein}g</div>
                      <div className="text-xs text-gray-600">Proteína</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg text-center">
                      <div className="font-bold text-yellow-600">{result.nutritionalNeeds.carbs}g</div>
                      <div className="text-xs text-gray-600">Carboidrato</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg text-center">
                      <div className="font-bold text-purple-600">{result.nutritionalNeeds.fat}g</div>
                      <div className="text-xs text-gray-600">Gordura</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="font-bold text-green-600">{result.nutritionalNeeds.fiber}g</div>
                      <div className="text-xs text-gray-600">Fibra</div>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg text-center">
                    <div className="font-bold text-blue-600">{result.nutritionalNeeds.water}ml</div>
                    <div className="text-xs text-gray-600">Água</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2" />
                    Áreas Prioritárias:
                  </h3>
                  <ul className="space-y-2">
                    {result.priorityAreas.map((area: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 mt-2"></div>
                        <span className="text-gray-700">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Recomendações:
                  </h3>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Preencha os dados para ver o resultado</p>
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
            <Link
              href="/auth/register"
              className="px-8 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Começar Gratuitamente
            </Link>
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