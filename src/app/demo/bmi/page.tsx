'use client'

import { useState } from 'react'
import { ArrowLeft, Calculator, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function BMIDemoPage() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'masculino'
  })
  const [result, setResult] = useState<{
    bmi: number
    category: string
    recommendation: string
  } | null>(null)
  const [showResult, setShowResult] = useState(false)

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height) / 100
    const bmi = weight / (height * height)
    
    let category = ''
    let color = ''
    let recommendations = []

    if (bmi < 18.5) {
      category = 'Abaixo do peso'
      color = 'text-blue-600'
      recommendations = [
        'Consulte um nutricionista para ganho de peso saudável',
        'Aumente a ingestão calórica com alimentos nutritivos',
        'Inclua exercícios de força para ganho de massa muscular'
      ]
    } else if (bmi < 25) {
      category = 'Peso normal'
      color = 'text-green-600'
      recommendations = [
        'Mantenha uma alimentação equilibrada',
        'Continue praticando exercícios regularmente',
        'Monitore seu peso periodicamente'
      ]
    } else if (bmi < 30) {
      category = 'Sobrepeso'
      color = 'text-yellow-600'
      recommendations = [
        'Reduza a ingestão calórica gradualmente',
        'Aumente a atividade física',
        'Consulte um nutricionista para plano personalizado'
      ]
    } else {
      category = 'Obesidade'
      color = 'text-red-600'
      recommendations = [
        'Consulte um médico e nutricionista urgentemente',
        'Inicie um programa de exercícios supervisionado',
        'Considere acompanhamento multidisciplinar'
      ]
    }

    setResult({
      bmi: bmi.toFixed(1),
      category,
      color,
      recommendations
    })
    setShowResult(true)
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
                <h1 className="text-2xl font-bold text-gray-900">Calculadora de IMC - Demo</h1>
                <p className="text-sm text-gray-600">Demonstração da ferramenta profissional</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Notice */}
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
          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Calculadora de IMC
            </h2>
            
            <form className="space-y-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Idade
                </label>
                <input
                  type="number"
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
                  Sexo
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

              <button
                type="button"
                onClick={calculateBMI}
                disabled={!formData.weight || !formData.height}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Calcular IMC
              </button>
            </form>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Resultado
            </h2>
            
            {showResult && result ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {result.bmi}
                  </div>
                  <div className={`text-xl font-semibold ${result.color}`}>
                    {result.category}
                  </div>
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
                <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Preencha os dados para ver o resultado</p>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
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