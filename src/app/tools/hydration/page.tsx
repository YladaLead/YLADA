'use client'

import { useState } from 'react'
import { Activity, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import SpecialistCTA from '@/components/SpecialistCTA'

export default function HydrationPage() {
  const [formData, setFormData] = useState({
    weight: '',
    age: '',
    gender: 'masculino' as 'masculino' | 'feminino',
    activity: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active',
    climate: 'temperate' as 'cold' | 'temperate' | 'hot' | 'very-hot',
    exerciseDuration: '',
    exerciseIntensity: 'moderate' as 'light' | 'moderate' | 'intense'
  })
  
  const [result, setResult] = useState<{
    dailyWater: string
    exerciseWater: string
    totalWater: string
    tips: string[]
    recommendations: string[]
  } | null>(null)

  const calculateHydration = () => {
    const weight = parseFloat(formData.weight)
    const age = parseInt(formData.age)
    const exerciseDuration = parseFloat(formData.exerciseDuration) || 0
    
    if (!weight || !age) return
    
    // Base water needs (35ml per kg body weight)
    let baseWater = weight * 35
    
    // Adjust for age
    if (age > 65) {
      baseWater *= 0.9 // Elderly need slightly less
    }
    
    // Adjust for gender
    if (formData.gender === 'feminino') {
      baseWater *= 0.9 // Women generally need slightly less
    }
    
    // Adjust for climate
    switch (formData.climate) {
      case 'cold':
        baseWater *= 1.0
        break
      case 'temperate':
        baseWater *= 1.1
        break
      case 'hot':
        baseWater *= 1.3
        break
      case 'very-hot':
        baseWater *= 1.5
        break
    }
    
    // Calculate exercise water needs
    let exerciseWater = 0
    if (exerciseDuration > 0) {
      const intensityMultiplier = formData.exerciseIntensity === 'light' ? 0.5 : 
                                 formData.exerciseIntensity === 'moderate' ? 0.7 : 1.0
      exerciseWater = exerciseDuration * 10 * intensityMultiplier // 10ml per minute
    }
    
    const totalWater = baseWater + exerciseWater
    
    const tips = [
      'Beba água ao acordar para hidratar após o sono',
      'Mantenha uma garrafa de água sempre por perto',
      'Beba água antes de sentir sede',
      'Consuma frutas e vegetais com alto teor de água',
      'Evite bebidas desidratantes como álcool e cafeína em excesso',
      'Monitore a cor da urina (deve ser clara)'
    ]
    
    const recommendations = [
      '⏰ Distribua a ingestão ao longo do dia para máxima absorção',
      '🏃‍♂️ Beba mais água durante exercícios para manter performance',
      '🌡️ Aumente a ingestão em climas quentes para evitar desidratação',
      '⚡ Considere eletrólitos após exercícios intensos para recuperação rápida',
      '🎯 Ajuste conforme sua atividade física para resultados otimizados',
      '👨‍⚕️ Consulte um médico se tiver problemas renais para segurança total'
    ]
    
    setResult({
      dailyWater: Math.round(baseWater).toString(),
      exerciseWater: Math.round(exerciseWater).toString(),
      totalWater: Math.round(totalWater).toString(),
      tips,
      recommendations
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateHydration()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
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
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Monitor de Hidratação</h1>
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
              Calculadora de Necessidades Hídricas
            </h2>
            <p className="text-lg text-gray-600">
              Descubra quanta água você precisa para manter-se hidratado
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 70"
                    min="1"
                    max="300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idade
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 35"
                    min="1"
                    max="120"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gênero
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as 'masculino' | 'feminino'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível de Atividade
                  </label>
                  <select
                    value={formData.activity}
                    onChange={(e) => setFormData({...formData, activity: e.target.value as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sedentary">Sedentário</option>
                    <option value="light">Leve</option>
                    <option value="moderate">Moderado</option>
                    <option value="active">Ativo</option>
                    <option value="very-active">Muito Ativo</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clima
                  </label>
                  <select
                    value={formData.climate}
                    onChange={(e) => setFormData({...formData, climate: e.target.value as 'cold' | 'temperate' | 'hot' | 'very-hot'})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cold">Frio</option>
                    <option value="temperate">Temperado</option>
                    <option value="hot">Quente</option>
                    <option value="very-hot">Muito Quente</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Exercício (min/dia)
                  </label>
                  <input
                    type="number"
                    value={formData.exerciseDuration}
                    onChange={(e) => setFormData({...formData, exerciseDuration: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: 30"
                    min="0"
                    max="300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Intensidade do Exercício
                </label>
                <select
                  value={formData.exerciseIntensity}
                  onChange={(e) => setFormData({...formData, exerciseIntensity: e.target.value as 'light' | 'moderate' | 'intense'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Leve</option>
                  <option value="moderate">Moderado</option>
                  <option value="intense">Intenso</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Calcular Necessidades Hídricas
              </button>
            </form>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Suas Necessidades Hídricas
                </h3>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {result.totalWater}ml
                </div>
                <p className="text-lg text-gray-600">
                  por dia ({Math.round(parseFloat(result.totalWater) / 1000 * 100) / 100} litros)
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-blue-800 mb-1">Água Base</h4>
                  <p className="text-2xl font-bold text-blue-600">{result.dailyWater}ml</p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4 text-center">
                  <h4 className="font-semibold text-cyan-800 mb-1">+ Exercício</h4>
                  <p className="text-2xl font-bold text-cyan-600">{result.exerciseWater}ml</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-4 text-lg">
                    Dicas de Hidratação:
                  </h4>
                  <ul className="space-y-2">
                    {result.tips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-cyan-50 rounded-lg p-6">
                  <h4 className="font-semibold text-cyan-800 mb-4 text-lg">
                    Recomendações:
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-cyan-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-cyan-700">{rec}</span>
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
                  Calcular Novamente
                </button>
                
                {/* Botão personalizado do especialista */}
                <SpecialistCTA toolName="hydration" />
                
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
