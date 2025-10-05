'use client'

import { useState } from 'react'
import { ArrowLeft, Zap, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function BodyCompositionDemoPage() {
  const [formData, setFormData] = useState({
    weight: '',
    height: '',
    age: '',
    gender: 'masculino',
    waist: '',
    neck: '',
    hip: ''
  })
  const [result, setResult] = useState<{
    bmi: number
    bodyFatPercentage: number
    fatCategory: string
    fatColor: string
    fatMass: number
    leanMass: number
    bmr: number
    tdee: number
    recommendations: string[]
  } | null>(null)
  const [showResult, setShowResult] = useState(false)

  const calculateBodyComposition = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height) / 100
    const age = parseInt(formData.age)
    const waist = parseFloat(formData.waist)
    const neck = parseFloat(formData.neck)
    const hip = parseFloat(formData.hip)
    
    // Cálculo do IMC
    const bmi = weight / (height * height)
    
    // Estimativa de gordura corporal usando fórmula de Deurenberg
    let bodyFatPercentage = 0
    if (formData.gender === 'masculino') {
      bodyFatPercentage = (1.20 * bmi) + (0.23 * age) - 16.2
    } else {
      bodyFatPercentage = (1.20 * bmi) + (0.23 * age) - 5.4
    }
    
    // Massa gorda e massa magra
    const fatMass = (weight * bodyFatPercentage) / 100
    const leanMass = weight - fatMass
    
    // Taxa Metabólica Basal (BMR) - Fórmula de Mifflin-St Jeor
    let bmr = 0
    if (formData.gender === 'masculino') {
      bmr = (10 * weight) + (6.25 * height * 100) - (5 * age) + 5
    } else {
      bmr = (10 * weight) + (6.25 * height * 100) - (5 * age) - 161
    }
    
    // TDEE (Taxa de Dispêndio Energético Total) - estimativa moderada
    const tdee = bmr * 1.55
    
    // Classificação da gordura corporal
    let fatCategory = ''
    let fatColor = ''
    
    if (formData.gender === 'masculino') {
      if (bodyFatPercentage < 6) {
        fatCategory = 'Atlético'
        fatColor = 'text-blue-600'
      } else if (bodyFatPercentage < 14) {
        fatCategory = 'Bom'
        fatColor = 'text-green-600'
      } else if (bodyFatPercentage < 18) {
        fatCategory = 'Aceitável'
        fatColor = 'text-yellow-600'
      } else if (bodyFatPercentage < 25) {
        fatCategory = 'Sobrepeso'
        fatColor = 'text-orange-600'
      } else {
        fatCategory = 'Obeso'
        fatColor = 'text-red-600'
      }
    } else {
      if (bodyFatPercentage < 10) {
        fatCategory = 'Atlético'
        fatColor = 'text-blue-600'
      } else if (bodyFatPercentage < 20) {
        fatCategory = 'Bom'
        fatColor = 'text-green-600'
      } else if (bodyFatPercentage < 25) {
        fatCategory = 'Aceitável'
        fatColor = 'text-yellow-600'
      } else if (bodyFatPercentage < 32) {
        fatCategory = 'Sobrepeso'
        fatColor = 'text-orange-600'
      } else {
        fatCategory = 'Obeso'
        fatColor = 'text-red-600'
      }
    }

    // Recomendações baseadas nos resultados
    const recommendations = []
    
    if (bodyFatPercentage > 25) {
      recommendations.push('Foque em exercícios cardiovasculares para redução de gordura')
      recommendations.push('Mantenha um déficit calórico moderado (300-500 kcal/dia)')
      recommendations.push('Inclua treinamento de força para preservar massa muscular')
    } else if (bodyFatPercentage < 15) {
      recommendations.push('Mantenha uma dieta equilibrada para preservar massa muscular')
      recommendations.push('Foque em treinamento de força para ganho de massa')
      recommendations.push('Considere um pequeno superávit calórico se o objetivo for hipertrofia')
    } else {
      recommendations.push('Mantenha uma dieta equilibrada e exercícios regulares')
      recommendations.push('Combine treinamento cardiovascular e de força')
      recommendations.push('Monitore regularmente sua composição corporal')
    }

    setResult({
      bmi: bmi.toFixed(1),
      bodyFatPercentage: bodyFatPercentage.toFixed(1),
      fatCategory,
      fatColor,
      fatMass: fatMass.toFixed(1),
      leanMass: leanMass.toFixed(1),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
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
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Composição Corporal - Demo</h1>
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
              Composição Corporal
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cintura (cm)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="200"
                    value={formData.waist}
                    onChange={(e) => setFormData({...formData, waist: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="80"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pescoço (cm)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="60"
                    value={formData.neck}
                    onChange={(e) => setFormData({...formData, neck: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="35"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quadril (cm)
                  </label>
                  <input
                    type="number"
                    min="30"
                    max="200"
                    value={formData.hip}
                    onChange={(e) => setFormData({...formData, hip: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="95"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={calculateBodyComposition}
                disabled={!formData.weight || !formData.height || !formData.age}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Calcular Composição Corporal
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Resultado
            </h2>
            
            {showResult && result ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">{result.bmi}</div>
                    <div className="text-sm text-gray-600">IMC</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className={`text-2xl font-bold ${result.fatColor}`}>{result.bodyFatPercentage}%</div>
                    <div className="text-sm text-gray-600">Gordura Corporal</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-xl font-bold text-red-600">{result.fatMass}kg</div>
                    <div className="text-sm text-gray-600">Massa Gorda</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{result.leanMass}kg</div>
                    <div className="text-sm text-gray-600">Massa Magra</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-xl font-bold text-blue-600">{result.bmr}</div>
                    <div className="text-sm text-gray-600">BMR (kcal/dia)</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-xl font-bold text-purple-600">{result.tdee}</div>
                    <div className="text-sm text-gray-600">TDEE (kcal/dia)</div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-lg font-semibold ${result.fatColor}`}>
                    Classificação: {result.fatCategory}
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
                <Zap className="w-16 h-16 mx-auto mb-4 text-gray-300" />
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