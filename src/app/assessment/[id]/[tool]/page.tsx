'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Calculator, CheckCircle } from 'lucide-react'

export default function ProfessionalAssessmentPage() {
  const params = useParams()
  const professionalId = params.id as string
  // const toolType = params.tool as string
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    weight: '',
    height: '',
    age: '',
    gender: 'masculino'
  })
  const [result, setResult] = useState<{
    bmi: string
    category: string
    color: string
    recommendations: string[]
  } | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [professional, setProfessional] = useState<{
    name: string
    specialty: string
    company?: string
  } | null>(null)

  const fetchProfessionalData = useCallback(async () => {
    try {
      const response = await fetch(`/api/professionals/${professionalId}`)
      const data = await response.json()
      setProfessional(data.professional)
    } catch (error) {
      console.error('Erro ao buscar dados do profissional:', error)
    }
  }, [professionalId])

  useEffect(() => {
    // Buscar dados do profissional
    fetchProfessionalData()
  }, [fetchProfessionalData])

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

  const saveAssessment = async () => {
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          age: parseInt(formData.age),
          gender: formData.gender,
          weight: parseFloat(formData.weight),
          height: parseInt(formData.height),
          calculatorType: 'bmi',
          results: result,
          professionalId: professionalId,
          source: 'professional_link'
        })
      })
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error)
    }
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Avaliação de {professional.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {professional.specialty} • {professional.company}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Professional Info */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Avaliação Personalizada
            </h2>
            <p className="text-gray-600 mb-4">
              Preencha os dados abaixo para receber sua avaliação personalizada
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>Profissional: {professional.name}</span>
              <span>•</span>
              <span>{professional.specialty}</span>
              {professional.company && (
                <>
                  <span>•</span>
                  <span>{professional.company}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Dados Pessoais
            </h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="(11) 99999-9999"
                />
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
              </div>

              <button
                type="button"
                onClick={calculateBMI}
                disabled={!formData.name || !formData.email || !formData.weight || !formData.height}
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

                <button
                  onClick={saveAssessment}
                  className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Salvar Avaliação
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Calculator className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Preencha os dados para ver o resultado</p>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {showResult && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-1">
                  Avaliação Concluída!
                </h3>
                <p className="text-green-700">
                  Sua avaliação foi enviada para {professional.name}. 
                  Em breve você receberá um contato personalizado.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
