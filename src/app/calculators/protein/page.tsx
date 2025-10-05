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
  Copy,
  Shield
} from 'lucide-react'
import Link from 'next/link'

interface ProteinResults {
  dailyProtein: string
  proteinPerMeal: string
  proteinSources: string[]
  recommendations: string[]
  riskLevel: string
  riskColor: string
}

export default function ProteinCalculatorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity: '',
    goal: '',
    healthCondition: ''
  })
  const [results, setResults] = useState<ProteinResults | null>(null)
  const [showResults, setShowResults] = useState(false)

  const calculateProteinNeeds = () => {
    const weight = parseFloat(formData.weight)
    const age = parseFloat(formData.age)
    const height = parseFloat(formData.height)
    
    if (!weight || !age || !height) return null
    
    // Cálculo baseado em diretrizes da OMS e FAO
    // RDA (Recommended Dietary Allowance) para proteína: 0.8g/kg/dia (adultos saudáveis)
    let baseProtein = weight * 0.8 // RDA básica
    
    // Ajustes por idade (OMS)
    if (age >= 65) {
      baseProtein = weight * 1.0 // Idosos precisam de mais proteína
    } else if (age < 18) {
      baseProtein = weight * 1.2 // Adolescentes em crescimento
    }
    
    // Ajustes por atividade física (OMS/FAO)
    const activityMultipliers = {
      'sedentario': 1.0,
      'leve': 1.1,
      'moderado': 1.2,
      'ativo': 1.3,
      'muito-ativo': 1.4,
      'atleta': 1.6
    }
    
    const activityMultiplier = activityMultipliers[formData.activity as keyof typeof activityMultipliers] || 1.0
    let adjustedProtein = baseProtein * activityMultiplier
    
    // Ajustes por objetivos específicos
    if (formData.goal === 'muscle-gain') {
      adjustedProtein = weight * 1.6 // Para ganho de massa muscular
    } else if (formData.goal === 'weight-loss') {
      adjustedProtein = weight * 1.2 // Para preservar massa muscular durante perda de peso
    } else if (formData.goal === 'maintenance') {
      adjustedProtein = weight * 1.0 // Manutenção
    }
    
    // Ajustes por condições de saúde
    if (formData.healthCondition === 'diabetes') {
      adjustedProtein = weight * 1.1 // Diabéticos podem precisar de mais proteína
    } else if (formData.healthCondition === 'kidney-disease') {
      adjustedProtein = weight * 0.6 // Doença renal requer restrição
    } else if (formData.healthCondition === 'pregnancy') {
      adjustedProtein = weight * 1.1 // Gestantes precisam de mais proteína
    }
    
    const proteinPerMeal = adjustedProtein / 3 // Distribuir em 3 refeições
    
    // Fontes de proteína recomendadas (OMS)
    const proteinSources = [
      'Carnes magras (frango, peixe, carne bovina)',
      'Ovos (proteína completa)',
      'Leite e derivados (queijo, iogurte)',
      'Leguminosas (feijão, lentilha, grão-de-bico)',
      'Oleaginosas (amêndoas, castanhas)',
      'Quinoa e outros grãos integrais'
    ]
    
    // Recomendações baseadas em diretrizes da OMS
    const recommendations = [
      'Distribua a proteína ao longo do dia em 3-4 refeições',
      'Consuma proteína de alta qualidade biológica',
      'Combine proteínas vegetais para melhor absorção',
      'Evite excesso de proteína (>2g/kg/dia) sem orientação médica',
      'Mantenha hidratação adequada (35ml/kg/dia)',
      'Consulte um nutricionista para plano personalizado'
    ]
    
    // Avaliação de risco
    let riskLevel = 'Normal'
    let riskColor = 'text-green-600'
    
    if (adjustedProtein < weight * 0.8) {
      riskLevel = 'Baixo'
      riskColor = 'text-blue-600'
    } else if (adjustedProtein > weight * 2.0) {
      riskLevel = 'Alto'
      riskColor = 'text-red-600'
    }
    
    return {
      dailyProtein: adjustedProtein.toFixed(1),
      proteinPerMeal: proteinPerMeal.toFixed(1),
      proteinSources,
      recommendations,
      riskLevel,
      riskColor
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const proteinResults = calculateProteinNeeds()
    if (proteinResults) {
      setResults(proteinResults)
      setShowResults(true)
    }
  }

  const copyResults = () => {
    if (!results) return
    const text = `Minhas Necessidades de Proteína:
Proteína Diária: ${results.dailyProtein}g
Por Refeição: ${results.proteinPerMeal}g
Nível de Risco: ${results.riskLevel}

Recomendações:
${results.recommendations.map(r => `• ${r}`).join('\n')}

Calculado com YLADA - Ferramentas profissionais de bem-estar`
    navigator.clipboard.writeText(text)
    alert('Resultados copiados para a área de transferência!')
  }

  const shareResults = () => {
    if (!results) return
    const text = `Descobri minhas necessidades de proteína com YLADA! Preciso de ${results.dailyProtein}g por dia. Que tal você também calcular as suas?`
    const url = window.location.href
    navigator.share({ title: 'Minhas Necessidades de Proteína - YLADA', text, url })
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
                  <p className="text-sm text-gray-600">Necessidades de Proteína - YLADA</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Suas Necessidades de Proteína</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Proteína Diária</h3>
                <p className="text-3xl font-bold text-blue-600">{results.dailyProtein}g</p>
                <p className="text-sm text-gray-600">Baseado em diretrizes da OMS</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Por Refeição</h3>
                <p className="text-3xl font-bold text-green-600">{results.proteinPerMeal}g</p>
                <p className="text-sm text-gray-600">Distribuído em 3 refeições</p>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-yellow-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 text-yellow-600 mr-2" />
                Avaliação de Risco
              </h3>
              <div className="flex items-center">
                <span className={`text-xl font-bold ${results.riskColor} mr-3`}>
                  {results.riskLevel}
                </span>
                <span className="text-gray-700">
                  {results.riskLevel === 'Normal' ? 'Necessidades dentro dos parâmetros saudáveis' :
                   results.riskLevel === 'Baixo' ? 'Considere aumentar a ingestão de proteína' :
                   'Consulte um profissional antes de aumentar a ingestão'}
                </span>
              </div>
            </div>

            {/* Protein Sources */}
            <div className="bg-purple-50 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 text-purple-600 mr-2" />
                Fontes de Proteína Recomendadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.proteinSources.map((source, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-700">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    {source}
                  </div>
                ))}
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
              Quer um plano nutricional personalizado?
            </h3>
            <p className="text-emerald-100 mb-6">
              Consulte um nutricionista profissional para um plano alimentar baseado nas suas necessidades específicas de proteína
            </p>
            <button className="px-8 py-3 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Consultar Nutricionista Profissional
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
                <h1 className="text-2xl font-bold text-gray-900">Necessidades de Proteína</h1>
                <p className="text-sm text-gray-600">Calcule suas necessidades diárias de proteína</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Por que a Proteína é Importante?</h2>
          <p className="text-gray-600 mb-6">
            A proteína é essencial para a construção e reparo de tecidos, produção de enzimas e hormônios, 
            e manutenção da massa muscular. Nossa calculadora utiliza diretrizes oficiais da Organização 
            Mundial da Saúde (OMS) para determinar suas necessidades específicas.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Heart className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Saúde</h3>
              <p className="text-sm text-gray-600">Baseado em diretrizes da OMS</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personalizado</h3>
              <p className="text-sm text-gray-600">Considera idade, atividade e objetivos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Preciso</h3>
              <p className="text-sm text-gray-600">Cálculos científicos validados</p>
            </div>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Calcule suas Necessidades de Proteína</h2>
          
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
                  <option value="leve">Leve (1-3x/semana)</option>
                  <option value="moderado">Moderado (3-5x/semana)</option>
                  <option value="ativo">Ativo (6-7x/semana)</option>
                  <option value="muito-ativo">Muito Ativo (2x/dia)</option>
                  <option value="atleta">Atleta</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo Principal *
                </label>
                <select
                  required
                  value={formData.goal}
                  onChange={(e) => setFormData({...formData, goal: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="maintenance">Manutenção</option>
                  <option value="muscle-gain">Ganho de Massa Muscular</option>
                  <option value="weight-loss">Perda de Peso</option>
                  <option value="performance">Performance Esportiva</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condição de Saúde
                </label>
                <select
                  value={formData.healthCondition}
                  onChange={(e) => setFormData({...formData, healthCondition: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="">Nenhuma</option>
                  <option value="diabetes">Diabetes</option>
                  <option value="kidney-disease">Doença Renal</option>
                  <option value="pregnancy">Gestação</option>
                  <option value="hypertension">Hipertensão</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-emerald-600 text-white rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                Calcular Necessidades de Proteína
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
                Esta calculadora fornece uma estimativa baseada em diretrizes da OMS. 
                Para necessidades específicas ou condições de saúde, consulte sempre um 
                nutricionista ou médico qualificado.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
