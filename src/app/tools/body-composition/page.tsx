import SpecialistCTA from '@/components/SpecialistCTA'
'use client'

import { useState } from 'react'
import { Activity, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function BodyCompositionPage() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'masculino' as 'masculino' | 'feminino',
    activity: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
  })
  
  const [result, setResult] = useState<{
    bmi: string
    bmr: string
    tdee: string
    muscleMass: string
    fatMass: string
    recommendations: string[]
  } | null>(null)

  const calculateBodyComposition = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height) / 100 // converter cm para m
    const age = parseInt(formData.age)
    
    if (!weight || !height || !age) return
    
    // Cálculo do IMC
    const bmi = weight / (height * height)
    
    // Cálculo do BMR (Taxa Metabólica Basal) - Fórmula de Mifflin-St Jeor
    let bmr = 0
    if (formData.gender === 'masculino') {
      bmr = (10 * weight) + (6.25 * (height * 100)) - (5 * age) + 5
    } else {
      bmr = (10 * weight) + (6.25 * (height * 100)) - (5 * age) - 161
    }
    
    // Cálculo do TDEE (Taxa Metabólica Total) baseado na atividade
    let activityMultiplier = 1.2
    switch (formData.activity) {
      case 'sedentary':
        activityMultiplier = 1.2
        break
      case 'light':
        activityMultiplier = 1.375
        break
      case 'moderate':
        activityMultiplier = 1.55
        break
      case 'active':
        activityMultiplier = 1.725
        break
      case 'very-active':
        activityMultiplier = 1.9
        break
    }
    
    const tdee = bmr * activityMultiplier
    
    // Estimativa de massa muscular e gordura (baseada em percentuais médios)
    let fatPercentage = 0
    if (formData.gender === 'masculino') {
      if (bmi < 18.5) fatPercentage = 8
      else if (bmi < 25) fatPercentage = 12
      else if (bmi < 30) fatPercentage = 20
      else fatPercentage = 25
    } else {
      if (bmi < 18.5) fatPercentage = 12
      else if (bmi < 25) fatPercentage = 18
      else if (bmi < 30) fatPercentage = 25
      else fatPercentage = 30
    }
    
    const fatMass = weight * (fatPercentage / 100)
    const muscleMass = weight - fatMass
    
    const recommendations = [
      '🥗 Mantenha uma dieta equilibrada com proteínas adequadas para maximizar resultados',
      '💪 Pratique exercícios de força para aumentar massa muscular de qualidade',
      '🏃‍♂️ Inclua exercícios cardiovasculares para reduzir gordura rapidamente',
      '📊 Monitore sua composição corporal regularmente para acompanhar progresso',
      '👨‍⚕️ Consulte um profissional para avaliação mais precisa e resultados garantidos',
      '💧 Mantenha hidratação adequada para otimizar todos os seus resultados'
    ]
    
    setResult({
      bmi: bmi.toFixed(1),
      bmr: Math.round(bmr).toString(),
      tdee: Math.round(tdee).toString(),
      muscleMass: muscleMass.toFixed(1),
      fatMass: fatMass.toFixed(1),
      recommendations
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateBodyComposition()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
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
              <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Composição Corporal</h1>
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
              Avaliação de Composição Corporal
            </h2>
            <p className="text-lg text-gray-600">
              Descubra sua taxa metabólica, massa muscular e necessidades calóricas
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Atividade Física
                </label>
                <select
                  value={formData.activity}
                  onChange={(e) => setFormData({...formData, activity: e.target.value as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="sedentary">Sedentário (pouco ou nenhum exercício)</option>
                  <option value="light">Leve (exercício leve 1-3 dias/semana)</option>
                  <option value="moderate">Moderado (exercício moderado 3-5 dias/semana)</option>
                  <option value="active">Ativo (exercício intenso 6-7 dias/semana)</option>
                  <option value="very-active">Muito Ativo (exercício muito intenso, trabalho físico)</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full px-8 py-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-lg"
              >
                Calcular Composição Corporal
              </button>
            </form>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Sua Composição Corporal
                </h3>
                <p className="text-lg text-gray-600">
                  Análise completa do seu metabolismo e composição corporal
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-blue-800 mb-1">IMC</h4>
                  <p className="text-2xl font-bold text-blue-600">{result.bmi}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-green-800 mb-1">BMR</h4>
                  <p className="text-2xl font-bold text-green-600">{result.bmr} kcal</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-purple-800 mb-1">TDEE</h4>
                  <p className="text-2xl font-bold text-purple-600">{result.tdee} kcal</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-orange-800 mb-1">Massa Muscular</h4>
                  <p className="text-2xl font-bold text-orange-600">{result.muscleMass} kg</p>
                </div>
              </div>
              
              <div className="bg-yellow-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-yellow-800 mb-4 text-lg">
                  Recomendações Personalizadas:
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-yellow-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => setResult(null)}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold mr-4"
                >
                  Calcular Novamente
                </button>
                
                {/* Botão personalizado do especialista */}
                <SpecialistCTA toolName="body-composition" />
                
                <Link
                  href="/fitlead"
                  className="mt-4 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-semibold inline-block"
                >
                  Voltar às Ferramentas
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
