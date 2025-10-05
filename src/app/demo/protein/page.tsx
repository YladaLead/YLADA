'use client'

import { useState } from 'react'
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function ProteinDemoPage() {
  const [formData, setFormData] = useState({
    weight: '',
    age: '',
    gender: 'masculino',
    activity: 'moderate',
    goal: 'maintenance'
  })
  const [result, setResult] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)

  const calculateProtein = () => {
    const weight = parseFloat(formData.weight)
    const age = parseInt(formData.age)
    
    let baseProtein = 0.8
    if (age > 65) baseProtein = 1.0
    if (age < 18) baseProtein = 1.2
    
    const goalMultipliers = {
      'weight-loss': 1.2,
      'muscle-gain': 1.6,
      'maintenance': 1.0,
      'endurance': 1.4
    }
    
    const activityMultipliers = {
      'sedentary': 0.8,
      'light': 1.0,
      'moderate': 1.2,
      'active': 1.4,
      'very-active': 1.6
    }
    
    const proteinPerKg = baseProtein * goalMultipliers[formData.goal as keyof typeof goalMultipliers] * activityMultipliers[formData.activity as keyof typeof activityMultipliers]
    const totalProtein = Math.round(weight * proteinPerKg)
    
    const proteinSources = [
      'Carnes magras (frango, peixe, carne bovina)',
      'Ovos (especialmente a clara)',
      'Laticínios (queijo cottage, iogurte grego)',
      'Leguminosas (feijão, lentilha, grão-de-bico)',
      'Quinoa e outros grãos integrais',
      'Suplementos de whey protein (se necessário)'
    ]
    
    const recommendations = []
    
    if (formData.goal === 'muscle-gain') {
      recommendations.push('Distribua a proteína em 4-6 refeições ao longo do dia')
      recommendations.push('Consuma proteína antes e depois dos treinos')
      recommendations.push('Considere suplementação com whey protein')
    } else if (formData.goal === 'weight-loss') {
      recommendations.push('Priorize proteínas magras para manter a saciedade')
      recommendations.push('Consuma proteína em todas as refeições principais')
      recommendations.push('Evite proteínas com alto teor de gordura')
    } else {
      recommendations.push('Mantenha uma distribuição equilibrada ao longo do dia')
      recommendations.push('Varie as fontes de proteína para obter todos os aminoácidos')
      recommendations.push('Combine proteínas vegetais para melhor absorção')
    }

    setResult({
      totalProtein,
      proteinPerKg: proteinPerKg.toFixed(1),
      sources: proteinSources,
      recommendations
    })
    setShowResult(true)
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
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Necessidades de Proteína - Demo</h1>
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
              Calculadora de Proteína
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
                    <option value="maintenance">Manutenção do peso</option>
                    <option value="weight-loss">Perda de peso</option>
                    <option value="muscle-gain">Ganho de massa muscular</option>
                    <option value="endurance">Resistência/Endurance</option>
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={calculateProtein}
                disabled={!formData.weight || !formData.age}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Calcular Necessidades de Proteína
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Resultado
            </h2>
            
            {showResult && result ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">
                    {result.totalProtein}g
                  </div>
                  <div className="text-lg text-gray-600">
                    Proteína por dia
                  </div>
                  <div className="text-sm text-gray-500 mt-2">
                    ({result.proteinPerKg}g por kg de peso corporal)
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Fontes Recomendadas:
                  </h3>
                  <ul className="space-y-2">
                    {result.sources.map((source: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                        <span className="text-gray-700">{source}</span>
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
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></div>
                        <span className="text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Shield className="w-16 h-16 mx-auto mb-4 text-gray-300" />
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
            <a
              href="/auth/register"
              className="px-8 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Começar Gratuitamente
            </a>
            <a
              href="/"
              className="px-8 py-3 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-emerald-600 transition-colors"
            >
              Ver Outras Ferramentas
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}