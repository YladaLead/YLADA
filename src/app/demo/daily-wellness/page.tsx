'use client'

import { useState } from 'react'
import { ArrowLeft, ArrowRight, Calendar, AlertTriangle, MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface WellnessEntry {
  date: string
  sleep: number
  exercise: number
  nutrition: number
  hydration: number
  mood: number
  energy: number
  stress: number
  notes: string
}

export default function DailyWellnessDemoPage() {
  const [wellnessEntry, setWellnessEntry] = useState<WellnessEntry>({
    date: new Date().toISOString().split('T')[0],
    sleep: 0,
    exercise: 0,
    nutrition: 0,
    hydration: 0,
    mood: 0,
    energy: 0,
    stress: 0,
    notes: ''
  })

  const [showResults, setShowResults] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowResults(true)
  }

  const calculateWellnessScore = () => {
    const scores = [
      wellnessEntry.sleep,
      wellnessEntry.exercise,
      wellnessEntry.nutrition,
      wellnessEntry.hydration,
      wellnessEntry.mood,
      wellnessEntry.energy,
      10 - wellnessEntry.stress // Invert stress score
    ]
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
  }

  const getWellnessLevel = (score: number) => {
    if (score >= 8) return { level: 'Excelente', color: 'text-green-600', bg: 'bg-green-100' }
    if (score >= 6) return { level: 'Bom', color: 'text-blue-600', bg: 'bg-blue-100' }
    if (score >= 4) return { level: 'Regular', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    return { level: 'Precisa Melhorar', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const handleInputChange = (field: keyof WellnessEntry, value: string | number) => {
    setWellnessEntry(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tabela: Bem-Estar Diário</h1>
                <p className="text-sm text-gray-600">Demo - Herbalead</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Impact Header */}
        <div className="bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl shadow-lg p-8 mb-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Veja como seus clientes terão uma experiência incrível
          </h2>
          <p className="text-xl text-teal-100 mb-6">
            E como cada ferramenta pode gerar novos contatos automaticamente!
          </p>
          <div className="bg-white/20 rounded-lg p-4 inline-block">
            <p className="text-sm">
              💡 Esta é uma versão de demonstração. Quando você adquirir o acesso, poderá personalizar o botão, mensagem e link de destino (WhatsApp, formulário ou site).
            </p>
          </div>
        </div>

        {/* Wellness Table */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Registre seu Bem-Estar Diário</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sleep */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualidade do Sono (0-10) *
              </label>
              <input
                type="number"
                min="0"
                max="10"
                required
                value={wellnessEntry.sleep}
                onChange={(e) => handleInputChange('sleep', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="0 = muito ruim, 10 = excelente"
              />
            </div>

            {/* Exercise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exercício Físico (0-10) *
              </label>
              <input
                type="number"
                min="0"
                max="10"
                required
                value={wellnessEntry.exercise}
                onChange={(e) => handleInputChange('exercise', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="0 = nenhum, 10 = muito intenso"
              />
            </div>

            {/* Nutrition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alimentação (0-10) *
              </label>
              <input
                type="number"
                min="0"
                max="10"
                required
                value={wellnessEntry.nutrition}
                onChange={(e) => handleInputChange('nutrition', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="0 = muito ruim, 10 = excelente"
              />
            </div>

            {/* Hydration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hidratação (0-10) *
              </label>
              <input
                type="number"
                min="0"
                max="10"
                required
                value={wellnessEntry.hydration}
                onChange={(e) => handleInputChange('hydration', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="0 = muito pouca, 10 = excelente"
              />
            </div>

            {/* Mood */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Humor (0-10) *
              </label>
              <input
                type="number"
                min="0"
                max="10"
                required
                value={wellnessEntry.mood}
                onChange={(e) => handleInputChange('mood', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="0 = muito ruim, 10 = excelente"
              />
            </div>

            {/* Energy */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Energia (0-10) *
              </label>
              <input
                type="number"
                min="0"
                max="10"
                required
                value={wellnessEntry.energy}
                onChange={(e) => handleInputChange('energy', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="0 = muito baixo, 10 = muito alto"
              />
            </div>

            {/* Stress */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Estresse (0-10) *
              </label>
              <input
                type="number"
                min="0"
                max="10"
                required
                value={wellnessEntry.stress}
                onChange={(e) => handleInputChange('stress', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="0 = sem estresse, 10 = muito estressado"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Observações (opcional)
              </label>
              <textarea
                value={wellnessEntry.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                placeholder="Como foi seu dia? O que funcionou bem? O que pode melhorar?"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-teal-600 text-white rounded-lg text-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center"
              >
                Testar Ferramenta (Demo)
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </form>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Seu Score de Bem-Estar</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${getWellnessLevel(calculateWellnessScore()).bg} ${getWellnessLevel(calculateWellnessScore()).color}`}>
                  {calculateWellnessScore()}
                </div>
                <h3 className="text-xl font-semibold mt-4 text-gray-800">Score Geral</h3>
                <p className={`text-lg font-medium ${getWellnessLevel(calculateWellnessScore()).color}`}>
                  {getWellnessLevel(calculateWellnessScore()).level}
                </p>
              </div>

              {/* Individual Scores */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Detalhamento:</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Sono:</span>
                    <span className="font-semibold">{wellnessEntry.sleep}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Exercício:</span>
                    <span className="font-semibold">{wellnessEntry.exercise}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Alimentação:</span>
                    <span className="font-semibold">{wellnessEntry.nutrition}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Hidratação:</span>
                    <span className="font-semibold">{wellnessEntry.hydration}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Humor:</span>
                    <span className="font-semibold">{wellnessEntry.mood}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Energia:</span>
                    <span className="font-semibold">{wellnessEntry.energy}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Estresse:</span>
                    <span className="font-semibold">{wellnessEntry.stress}/10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="mt-8 p-6 bg-teal-50 rounded-lg">
              <h3 className="text-lg font-semibold text-teal-800 mb-3">💡 Recomendações:</h3>
              <ul className="text-teal-700 space-y-2">
                {wellnessEntry.sleep < 6 && <li>• Melhore a qualidade do seu sono com uma rotina consistente</li>}
                {wellnessEntry.exercise < 5 && <li>• Incorpore mais atividade física na sua rotina</li>}
                {wellnessEntry.nutrition < 6 && <li>• Foque em uma alimentação mais equilibrada</li>}
                {wellnessEntry.hydration < 6 && <li>• Aumente sua ingestão de água durante o dia</li>}
                {wellnessEntry.mood < 6 && <li>• Pratique atividades que melhorem seu humor</li>}
                {wellnessEntry.energy < 6 && <li>• Revise seus hábitos para aumentar a energia</li>}
                {wellnessEntry.stress > 6 && <li>• Pratique técnicas de relaxamento e gestão de estresse</li>}
                {calculateWellnessScore() >= 7 && <li>• Continue mantendo esses excelentes hábitos!</li>}
              </ul>
            </div>

            {/* CTA Button - Consultar Especialista */}
            <div className="text-center mt-8">
              <button 
                onClick={() => window.location.href = '/payment'}
                className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-lg hover:bg-purple-700 transition-all duration-300 shadow-lg transform hover:scale-105 flex items-center justify-center mx-auto"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Consultar Especialista
              </button>
              <p className="text-sm text-gray-500 mt-3">
                💡 Esta é uma demonstração! Na versão real, este botão redirecionaria para o WhatsApp do especialista.
              </p>
            </div>
          </div>
        )}

        {/* Final CTA */}
        <div className="bg-gray-50 rounded-xl p-8 text-center shadow-lg border border-gray-200">
          <h3 className="text-3xl font-bold mb-4 text-gray-800">
            💼 Pronto para ter esta ferramenta com seu nome e link personalizado?
          </h3>
          <p className="text-gray-600 mb-8 text-lg">
            Clique em &quot;Assinar Agora&quot; e comece a gerar seus próprios leads com o Herbalead.
          </p>
            <button 
              onClick={() => window.location.href = '/payment'}
              className="px-12 py-6 bg-emerald-600 text-white rounded-xl font-bold text-xl hover:bg-emerald-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl"
            >
              Clique abaixo e começa a gerar seus leads agora
            </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Importante</h4>
              <p className="text-yellow-700 text-sm">
                Esta tabela é uma ferramenta de orientação para monitoramento pessoal. 
                Não substitui uma avaliação profissional completa. Consulte sempre um especialista.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
