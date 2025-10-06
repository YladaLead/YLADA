'use client'

import { useState } from 'react'
import { Calculator, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function BMIPage() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'masculino' as 'masculino' | 'feminino'
  })
  
  const [result, setResult] = useState<{
    bmi: string
    category: string
    color: string
    recommendations: string[]
  } | null>(null)

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height) / 100 // converter cm para m
    const age = parseInt(formData.age)
    
    if (!weight || !height || !age) return
    
    const bmi = weight / (height * height)
    const bmiRounded = bmi.toFixed(1)
    
    let category = ''
    let color = ''
    let recommendations: string[] = []
    
    if (bmi < 18.5) {
      category = 'Abaixo do peso'
      color = 'text-blue-600'
      recommendations = [
        'Consulte um nutricionista para ganho de peso saudável',
        'Aumente a ingestão calórica gradualmente',
        'Inclua exercícios de força para ganho de massa muscular',
        'Considere suplementos nutricionais adequados'
      ]
    } else if (bmi >= 18.5 && bmi < 25) {
      category = 'Peso normal'
      color = 'text-green-600'
      recommendations = [
        'Mantenha uma alimentação equilibrada',
        'Continue praticando exercícios regularmente',
        'Monitore seu peso periodicamente',
        'Mantenha hábitos saudáveis de sono'
      ]
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Sobrepeso'
      color = 'text-yellow-600'
      recommendations = [
        'Reduza a ingestão calórica gradualmente',
        'Aumente a atividade física',
        'Foque em alimentos integrais e vegetais',
        'Considere acompanhamento nutricional'
      ]
    } else {
      category = 'Obesidade'
      color = 'text-red-600'
      recommendations = [
        'Procure acompanhamento médico e nutricional',
        'Implemente mudanças graduais no estilo de vida',
        'Aumente significativamente a atividade física',
        'Considere programas estruturados de perda de peso'
      ]
    }
    
    setResult({
      bmi: bmiRounded,
      category,
      color,
      recommendations
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    calculateBMI()
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
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Calculadora de IMC</h1>
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
              Calculadora de Índice de Massa Corporal
            </h2>
            <p className="text-lg text-gray-600">
              Descubra sua categoria de peso e receba recomendações personalizadas
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
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                  </select>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-lg"
              >
                Calcular IMC
              </button>
            </form>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-10 h-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Seu Resultado
                </h3>
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {result.bmi}
                </div>
                <p className={`text-xl font-semibold ${result.color}`}>
                  {result.category}
                </p>
              </div>
              
              <div className="bg-emerald-50 rounded-lg p-6 mb-6">
                <h4 className="font-semibold text-emerald-800 mb-4 text-lg">
                  Recomendações Personalizadas:
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-emerald-700">{rec}</span>
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
                <Link
                  href="/fitlead"
                  className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold inline-block"
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
