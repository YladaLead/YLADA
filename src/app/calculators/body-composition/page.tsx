'use client'

import { useState } from 'react'
import { 
  Calculator, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Heart,
  Activity,
  Target,
  Share2,
  Copy
} from 'lucide-react'
import Link from 'next/link'

interface BodyCompositionResults {
  bmi: string
  bmiCategory: string
  bodyFatPercentage: string
  bodyFatCategory: string
  bodyFatColor: string
  leanMass: string
  fatMass: string
  bmr: string
  tdee: string
  recommendations: string[]
}

export default function BodyCompositionPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    waist: '',
    neck: '',
    hip: '',
    activity: ''
  })
  const [results, setResults] = useState<BodyCompositionResults | null>(null)
  const [showResults, setShowResults] = useState(false)

  const calculateBodyComposition = () => {
    const weight = parseFloat(formData.weight)
    const height = parseFloat(formData.height)
    const age = parseFloat(formData.age)
    const waist = parseFloat(formData.waist)
    const neck = parseFloat(formData.neck)
    const hip = parseFloat(formData.hip)
    
    if (!weight || !height || !age || !waist || !neck) return null
    
    // Calculate BMI
    const bmi = weight / ((height / 100) * (height / 100))
    
    // Estimate body fat percentage using Navy method
    let bodyFatPercentage
    if (formData.gender === 'masculino') {
      bodyFatPercentage = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76
    } else {
      const hipNum = hip || waist // Use waist if hip not provided
      bodyFatPercentage = 163.205 * Math.log10(waist + hipNum - neck) - 97.684 * Math.log10(height) - 78.387
    }
    
    bodyFatPercentage = Math.max(0, Math.min(100, bodyFatPercentage))
    
    // Calculate lean mass
    const leanMass = weight * (1 - bodyFatPercentage / 100)
    const fatMass = weight * (bodyFatPercentage / 100)
    
    // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
    let bmr
    if (formData.gender === 'masculino') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161
    }
    
    // Activity multipliers
    const activityMultipliers = {
      'sedentario': 1.2,
      'leve': 1.375,
      'moderado': 1.55,
      'ativo': 1.725,
      'muito-ativo': 1.9
    }
    
    const tdee = bmr * (activityMultipliers[formData.activity as keyof typeof activityMultipliers] || 1.2)
    
    // Determine body fat category
    let bodyFatCategory = ''
    let bodyFatColor = ''
    if (formData.gender === 'masculino') {
      if (bodyFatPercentage < 6) {
        bodyFatCategory = 'Atlético'
        bodyFatColor = 'text-blue-600'
      } else if (bodyFatPercentage < 14) {
        bodyFatCategory = 'Atlético'
        bodyFatColor = 'text-green-600'
      } else if (bodyFatPercentage < 18) {
        bodyFatCategory = 'Fitness'
        bodyFatColor = 'text-green-600'
      } else if (bodyFatPercentage < 25) {
        bodyFatCategory = 'Aceitável'
        bodyFatColor = 'text-yellow-600'
      } else {
        bodyFatCategory = 'Obeso'
        bodyFatColor = 'text-red-600'
      }
    } else {
      if (bodyFatPercentage < 10) {
        bodyFatCategory = 'Atlético'
        bodyFatColor = 'text-blue-600'
      } else if (bodyFatPercentage < 16) {
        bodyFatCategory = 'Atlético'
        bodyFatColor = 'text-green-600'
      } else if (bodyFatPercentage < 20) {
        bodyFatCategory = 'Fitness'
        bodyFatColor = 'text-green-600'
      } else if (bodyFatPercentage < 32) {
        bodyFatCategory = 'Aceitável'
        bodyFatColor = 'text-yellow-600'
      } else {
        bodyFatCategory = 'Obeso'
        bodyFatColor = 'text-red-600'
      }
    }
    
    return {
      bmi: bmi.toFixed(1),
      bmiCategory: bmi < 18.5 ? 'Abaixo do peso' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Sobrepeso' : 'Obesidade',
      bodyFatPercentage: bodyFatPercentage.toFixed(1),
      bodyFatCategory,
      bodyFatColor,
      leanMass: leanMass.toFixed(1),
      fatMass: fatMass.toFixed(1),
      bmr: bmr.toFixed(0),
      tdee: tdee.toFixed(0),
      recommendations: [
        'Mantenha uma dieta equilibrada com proteínas adequadas',
        'Inclua exercícios de força para preservar massa muscular',
        'Monitore sua composição corporal regularmente',
        'Consulte um profissional para orientação personalizada'
      ]
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const compositionResults = calculateBodyComposition()
    if (compositionResults) {
      setResults(compositionResults)
      setShowResults(true)
    }
  }

  const copyResults = () => {
    if (!results) return
    const text = `Minha Composição Corporal:
IMC: ${results.bmi} - ${results.bmiCategory}
Gordura Corporal: ${results.bodyFatPercentage}% - ${results.bodyFatCategory}
Massa Magra: ${results.leanMass}kg
Massa Gorda: ${results.fatMass}kg
TDEE: ${results.tdee} calorias/dia

Calculado com YLADA - Ferramentas profissionais de bem-estar`
    navigator.clipboard.writeText(text)
    alert('Resultados copiados para a área de transferência!')
  }

  const shareResults = () => {
    if (!results) return
    const text = `Descobri minha composição corporal com YLADA! Meu percentual de gordura: ${results.bodyFatPercentage}% - ${results.bodyFatCategory}. Que tal você também calcular o seu?`
    const url = window.location.href
    navigator.share({ title: 'Minha Composição Corporal - YLADA', text, url })
  }

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <button
                onClick={() => setShowResults(false)}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Seus Resultados</h1>
                  <p className="text-sm text-gray-600">Composição Corporal - YLADA</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sua Composição Corporal</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">IMC</h3>
                <p className="text-3xl font-bold text-blue-600">{results.bmi}</p>
                <p className="text-sm text-gray-600">{results.bmiCategory}</p>
              </div>
              
              <div className="bg-red-50 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Gordura Corporal</h3>
                <p className={`text-3xl font-bold ${results.bodyFatColor}`}>{results.bodyFatPercentage}%</p>
                <p className="text-sm text-gray-600">{results.bodyFatCategory}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Massa Magra</h3>
                <p className="text-3xl font-bold text-green-600">{results.leanMass}kg</p>
                <p className="text-sm text-gray-600">Músculos + Órgãos</p>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">TDEE</h3>
                <p className="text-3xl font-bold text-purple-600">{results.tdee}</p>
                <p className="text-sm text-gray-600">Calorias/dia</p>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Distribuição de Massa</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Massa Magra:</span>
                    <span className="font-semibold">{results.leanMass}kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Massa Gorda:</span>
                    <span className="font-semibold">{results.fatMass}kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Peso Total:</span>
                    <span className="font-semibold">{formData.weight}kg</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Metabolismo</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxa Metabólica Basal:</span>
                    <span className="font-semibold">{results.bmr} cal/dia</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gasto Total Diário:</span>
                    <span className="font-semibold">{results.tdee} cal/dia</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-emerald-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-600 mr-2" />
                Recomendações Personalizadas
              </h4>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3 mt-2"></div>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={copyResults}
                className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                <Copy className="w-5 h-5 mr-2" />
                Copiar Resultados
              </button>
              <button
                onClick={shareResults}
                className="flex-1 px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors flex items-center justify-center"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Compartilhar
              </button>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Quer uma análise mais completa?
            </h3>
            <p className="text-emerald-100 mb-6">
              Consulte um profissional de bem-estar para um plano personalizado baseado na sua composição corporal
            </p>
            <button className="px-8 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Consultar Profissional de Bem-Estar
            </button>
          </div>
        </main>
      </div>
    )
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
                <h1 className="text-2xl font-bold text-gray-900">Composição Corporal</h1>
                <p className="text-sm text-gray-600">Avalie massa muscular e gordura corporal</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">O que é Composição Corporal?</h2>
          <p className="text-gray-600 mb-6">
            A composição corporal é a análise da distribuição de massa no seu corpo, incluindo massa muscular, 
            gordura corporal, água e outros componentes. É uma medida mais precisa que o peso sozinho para 
            avaliar sua saúde e condicionamento físico.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Saúde</h3>
              <p className="text-sm text-gray-600">Avalia riscos relacionados à composição corporal</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Precisão</h3>
              <p className="text-sm text-gray-600">Baseado em fórmulas científicas validadas</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personalizado</h3>
              <p className="text-sm text-gray-600">Recomendações específicas para você</p>
            </div>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Calcule sua Composição Corporal</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="(11) 99999-9999"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="25"
                />
              </div>
            </div>

            {/* Physical Measurements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="175"
                />
              </div>
            </div>

            {/* Body Measurements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cintura (cm) *
                </label>
                <input
                  type="number"
                  required
                  min="30"
                  max="200"
                  value={formData.waist}
                  onChange={(e) => setFormData({...formData, waist: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="85"
                />
                <p className="text-xs text-gray-500 mt-1">Meça na parte mais estreita do abdômen</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pescoço (cm) *
                </label>
                <input
                  type="number"
                  required
                  min="20"
                  max="60"
                  value={formData.neck}
                  onChange={(e) => setFormData({...formData, neck: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="38"
                />
                <p className="text-xs text-gray-500 mt-1">Meça logo abaixo do pomo de Adão</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo *
                </label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quadril (cm) - Opcional
                </label>
                <input
                  type="number"
                  min="30"
                  max="200"
                  value={formData.hip}
                  onChange={(e) => setFormData({...formData, hip: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="95"
                />
                <p className="text-xs text-gray-500 mt-1">Recomendado para mulheres</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Atividade *
              </label>
              <select
                required
                value={formData.activity}
                onChange={(e) => setFormData({...formData, activity: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="sedentario">Sedentário</option>
                <option value="leve">Leve</option>
                <option value="moderado">Moderado</option>
                <option value="ativo">Ativo</option>
                <option value="muito-ativo">Muito Ativo</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-emerald-600 text-white rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                Calcular Composição Corporal
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </form>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Importante</h4>
              <p className="text-yellow-700 text-sm">
                Esta calculadora fornece uma estimativa baseada em fórmulas científicas. 
                Para medições mais precisas, consulte um profissional de saúde que pode usar 
                métodos como DEXA scan, bioimpedância ou adipômetro.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
