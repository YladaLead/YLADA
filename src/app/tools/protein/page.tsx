'use client'

import { useState } from 'react'
import { Shield, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import SpecialistCTA from '@/components/SpecialistCTA'

export default function ProteinPage() {
  const [formData, setFormData] = useState({
    weight: '',
    age: '',
    goal: 'maintenance' as 'weight-loss' | 'muscle-gain' | 'maintenance' | 'endurance',
    activity: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
  })
  
  const [result, setResult] = useState<{
    totalProtein: string
    proteinPerKg: string
    sources: string[]
    recommendations: string[]
  } | null>(null)

  const calculateProtein = () => {
    const weight = parseFloat(formData.weight)
    const age = parseInt(formData.age)
    
    if (!weight || !age) return
    
    // Base protein needs (g per kg body weight)
    let baseProteinPerKg = 0.8
    
    // Adjust based on goal
    switch (formData.goal) {
      case 'weight-loss':
        baseProteinPerKg = 1.2
        break
      case 'muscle-gain':
        baseProteinPerKg = 1.6
        break
      case 'endurance':
        baseProteinPerKg = 1.4
        break
      default:
        baseProteinPerKg = 0.8
    }
    
    // Adjust based on activity level
    switch (formData.activity) {
      case 'sedentary':
        baseProteinPerKg *= 0.9
        break
      case 'light':
        baseProteinPerKg *= 1.0
        break
      case 'moderate':
        baseProteinPerKg *= 1.1
        break
      case 'active':
        baseProteinPerKg *= 1.2
        break
      case 'very-active':
        baseProteinPerKg *= 1.3
        break
    }
    
    const totalProtein = Math.round(weight * baseProteinPerKg)
    const proteinPerKg = baseProteinPerKg.toFixed(1)
    
    const sources = [
      'Carnes magras (frango, peixe, carne bovina)',
      'Ovos e derivados',
      'Leguminosas (feijão, lentilha, grão-de-bico)',
      'Laticínios (leite, iogurte, queijo)',
      'Nozes e sementes',
      'Suplementos de proteína (se necessário)'
    ]
    
    const recommendations = [
      '⏰ Distribua a proteína ao longo do dia para maximizar absorção',
      '💪 Consuma proteína após exercícios para acelerar recuperação',
      '🥩 Prefira fontes completas de proteína para melhores resultados',
      '🍚 Combine com carboidratos para melhor absorção e energia',
      '💧 Mantenha hidratação adequada para otimizar metabolismo',
      '👨‍⚕️ Consulte um nutricionista para ajustes individuais e resultados garantidos'
    ]
    
    setResult({
      totalProtein: totalProtein.toString(),
      proteinPerKg,
      sources,
      recommendations
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateProtein()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
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
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Necessidades de Proteína</h1>
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
              Calculadora de Necessidades de Proteína
            </h2>
            <p className="text-lg text-gray-600">
              Descubra quanta proteína você precisa baseado em suas metas e estilo de vida
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Ex: 35"
                    min="1"
                    max="120"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo Principal
                </label>
                <select
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value as 'weight-loss' | 'muscle-gain' | 'maintenance' | 'endurance'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="maintenance">Manutenção do Peso</option>
                  <option value="weight-loss">Perda de Peso</option>
                  <option value="muscle-gain">Ganho de Massa Muscular</option>
                  <option value="endurance">Melhorar Resistência</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível de Atividade Física
                </label>
                <select
                  value={formData.activity}
                  onChange={(e) => setFormData({...formData, activity: e.target.value as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                className="w-full px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-lg"
              >
                Calcular Necessidades de Proteína
              </button>
            </form>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Suas Necessidades de Proteína
                </h3>
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {result.totalProtein}g
                </div>
                <p className="text-lg text-gray-600">
                  por dia ({result.proteinPerKg}g por kg de peso corporal)
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-emerald-50 rounded-lg p-6">
                  <h4 className="font-semibold text-emerald-800 mb-4 text-lg">
                    Fontes Recomendadas:
                  </h4>
                  <ul className="space-y-2">
                    {result.sources.map((source, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-emerald-700">{source}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-4 text-lg">
                    Recomendações:
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-blue-700">{rec}</span>
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
                <SpecialistCTA toolName="protein" />
                
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
