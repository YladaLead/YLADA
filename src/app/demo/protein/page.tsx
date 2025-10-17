'use client'

import { useState } from 'react'
import { 
  Calculator, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Star,
  Heart,
  MessageCircle
} from 'lucide-react'
import Link from 'next/link'

interface ProteinResults {
  dailyProtein: string
  category: string
  color: string
  recommendations: string[]
  improvements: string[]
  proteinSources: string[]
}

export default function ProteinDemoPage() {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity: '',
    goal: ''
  })
  const [results, setResults] = useState<ProteinResults | null>(null)
  const [showResults, setShowResults] = useState(false)

  const calculateProtein = () => {
    const weight = parseFloat(formData.weight)
    const age = parseInt(formData.age)
    
    if (!weight || !age) return null
    
    let proteinPerKg = 0.8 // Base para sedentários
    
    // Ajustar baseado no nível de atividade
    switch (formData.activity) {
      case 'sedentario':
        proteinPerKg = 0.8
        break
      case 'leve':
        proteinPerKg = 1.0
        break
      case 'moderado':
        proteinPerKg = 1.2
        break
      case 'intenso':
        proteinPerKg = 1.6
        break
      case 'muito-intenso':
        proteinPerKg = 2.0
        break
    }
    
    // Ajustar baseado no objetivo
    switch (formData.goal) {
      case 'perda-peso':
        proteinPerKg += 0.2
        break
      case 'ganho-massa':
        proteinPerKg += 0.4
        break
      case 'manutencao':
        // Manter valor atual
        break
    }
    
    const dailyProtein = weight * proteinPerKg
    
    let category = ''
    let color = ''
    let recommendations = []
    let improvements = []
    let proteinSources = []
    
    if (dailyProtein < weight * 0.8) {
      category = 'Proteína Insuficiente'
      color = 'text-red-600'
      recommendations = [
        'Consulte um especialista para aumentar ingestão proteica',
        'Inclua mais fontes de proteína na alimentação',
        'Considere suplementação se necessário'
      ]
      improvements = [
        'Aumentar massa muscular',
        'Melhorar recuperação pós-exercício',
        'Otimizar síntese proteica'
      ]
    } else if (dailyProtein <= weight * 1.2) {
      category = 'Proteína Adequada'
      color = 'text-green-600'
      recommendations = [
        'Mantenha a ingestão proteica atual',
        'Distribua proteína ao longo do dia',
        'Monitore resultados regularmente'
      ]
      improvements = [
        'Manter massa muscular',
        'Otimizar performance',
        'Prevenir perda muscular'
      ]
    } else if (dailyProtein <= weight * 1.6) {
      category = 'Proteína Otimizada'
      color = 'text-blue-600'
      recommendations = [
        'Excelente ingestão para atividade física',
        'Mantenha distribuição equilibrada',
        'Considere timing das refeições'
      ]
      improvements = [
        'Maximizar ganho muscular',
        'Melhorar recuperação',
        'Otimizar composição corporal'
      ]
    } else {
      category = 'Proteína Elevada'
      color = 'text-purple-600'
      recommendations = [
        'Consulte um especialista para monitoramento',
        'Verifique função renal regularmente',
        'Ajuste conforme necessário'
      ]
      improvements = [
        'Maximizar resultados atléticos',
        'Otimizar recuperação intensa',
        'Manter saúde renal'
      ]
    }
    
    proteinSources = [
      'Carnes magras (frango, peixe, carne vermelha)',
      'Ovos e laticínios',
      'Leguminosas (feijão, lentilha, grão-de-bico)',
      'Nozes e sementes',
      'Suplementos proteicos'
    ]
    
    return {
      dailyProtein: dailyProtein.toFixed(1),
      category,
      color,
      recommendations,
      improvements,
      proteinSources
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const proteinResults = calculateProtein()
    if (proteinResults) {
      setResults(proteinResults)
      setShowResults(true)
    }
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
                  <p className="text-sm text-gray-600">Calculadora de Proteína - Demo Herbalead</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Results Summary */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sua Necessidade Diária de Proteína</h2>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-emerald-100 to-green-100 rounded-full mb-4">
                <span className="text-4xl font-bold text-emerald-600">{results.dailyProtein}g</span>
              </div>
              <h3 className={`text-2xl font-semibold ${results.color} mb-2`}>
                {results.category}
              </h3>
              <p className="text-gray-600">
                Recomendação diária baseada no seu perfil
              </p>
            </div>

            {/* Improvements Section */}
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Star className="w-5 h-5 text-emerald-600 mr-2" />
                O que você pode melhorar
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.improvements.map((improvement, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                      <span className="text-sm font-medium text-gray-900">{improvement}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Protein Sources */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 text-blue-600 mr-2" />
                Fontes de Proteína Recomendadas
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.proteinSources.map((source, index) => (
                  <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">{source}</span>
                    </div>
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

          {/* CTA Section - Simples após resultado */}
          <div className="bg-white rounded-xl p-8 text-center shadow-lg border border-gray-200 mt-8">
            <h3 className="text-3xl font-bold mb-4 text-gray-800">
              💼 Pronto para gerar seus próprios links com seu nome pessoal?
            </h3>
            <p className="text-gray-600 mb-8 text-lg">
              Clique em &quot;Quero gerar meus links&quot; e comece a gerar seus próprios leads com o Herbalead.
            </p>
            <button 
              onClick={() => window.location.href = '/payment'}
              className="px-12 py-6 bg-emerald-600 text-white rounded-xl font-bold text-xl hover:bg-emerald-700 transition-all duration-300 shadow-2xl transform hover:scale-110 hover:shadow-3xl"
            >
              Clique abaixo e começa a gerar seus leads agora
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
                <h1 className="text-2xl font-bold text-gray-900">Calculadora de Proteína</h1>
                <p className="text-sm text-gray-600">Demo - Herbalead</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Impact Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl shadow-lg p-8 mb-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Veja como seus clientes terão uma experiência incrível
          </h2>
          <p className="text-xl text-emerald-100 mb-6">
            E como cada ferramenta pode gerar novos contatos automaticamente!
          </p>
          <div className="bg-white/20 rounded-lg p-4 inline-block">
            <p className="text-sm">
              💡 Esta é uma versão de demonstração. Quando você adquirir o acesso, poderá personalizar o botão, mensagem e link de destino (WhatsApp, formulário ou site).
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 Como funciona esta ferramenta para gerar leads
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">1️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cliente preenche dados</h4>
              <p className="text-sm text-gray-600">Peso, idade, sexo, atividade física e objetivos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">2️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Sistema calcula proteína</h4>
              <p className="text-sm text-gray-600">Necessidade diária com recomendações personalizadas</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">3️⃣</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Cliente entra em contato</h4>
              <p className="text-sm text-gray-600">Clica no botão e conversa com você automaticamente</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-emerald-600 font-semibold">💬 Você escolhe o texto e o link do botão!</p>
          </div>
        </div>

        {/* Calculator Form */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Calcule sua Necessidade de Proteína</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gênero *
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

            {/* Activity Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nível de Atividade Física *
              </label>
              <select
                required
                value={formData.activity}
                onChange={(e) => setFormData({...formData, activity: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="sedentario">Sedentário (pouco ou nenhum exercício)</option>
                <option value="leve">Leve (exercício leve 1-3 dias/semana)</option>
                <option value="moderado">Moderado (exercício moderado 3-5 dias/semana)</option>
                <option value="intenso">Intenso (exercício intenso 6-7 dias/semana)</option>
                <option value="muito-intenso">Muito Intenso (exercício muito intenso, trabalho físico)</option>
              </select>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objetivo *
              </label>
              <select
                required
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="manutencao">Manutenção do peso atual</option>
                <option value="perda-peso">Perda de peso</option>
                <option value="ganho-massa">Ganho de massa muscular</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-emerald-600 text-white rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center justify-center"
              >
                Calcular Proteína
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </form>
        </div>

        {/* CTA Section - Persuasiva */}
        <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl p-8 text-center shadow-2xl border-2 border-emerald-400">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            🚀 Pronto para começar a gerar seus próprios leads?
          </h3>
          <p className="text-xl text-emerald-100 mb-8 max-w-3xl mx-auto">
            Você acabou de ver como funciona! Agora imagine ter esta ferramenta com <strong>seu nome</strong>, <strong>seu link</strong> e <strong>sua mensagem personalizada</strong>.
          </p>
          
          <div className="bg-white/20 rounded-xl p-6 mb-8 backdrop-blur-sm">
            <h4 className="text-2xl font-bold text-white mb-4">✨ O que você vai receber:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-emerald-100">Calculadora personalizada com seu nome</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-emerald-100">Link único para compartilhar</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-emerald-100">Mensagem personalizada para WhatsApp</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-emerald-100">Todas as 9 ferramentas disponíveis</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 mb-8">
            <h4 className="text-2xl font-bold text-gray-800 mb-4">💡 Como funciona na prática:</h4>
            <ul className="text-left text-gray-600 space-y-3 text-lg">
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">1</span>
                </div>
                <span>Cliente preenche os dados e vê o resultado</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">2</span>
                </div>
                <span>Clica no botão &quot;Consultar Especialista&quot;</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">3</span>
                </div>
                <span>É redirecionado automaticamente para seu WhatsApp</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">4</span>
                </div>
                <span>Mensagem personalizada já vem pronta</span>
              </li>
              <li className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-bold text-sm">5</span>
                </div>
                <span><strong>Você recebe o lead qualificado!</strong></span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 mb-8">
            <h4 className="text-2xl font-bold text-white mb-3">🔥 Oferta Especial!</h4>
            <p className="text-white text-lg mb-4">
              Comece hoje mesmo e tenha acesso a <strong>todas as 9 ferramentas</strong> por apenas <strong>R$ 60/mês</strong>
            </p>
            <p className="text-white/90 text-sm">
              ✅ 7 dias para cancelar sem questionamentos ✅ Suporte prioritário ✅ Sem taxa de setup
            </p>
          </div>

          <button 
            onClick={() => window.location.href = '/payment'}
            className="px-16 py-6 bg-white text-emerald-600 rounded-2xl font-bold text-2xl hover:bg-gray-50 transition-all duration-300 shadow-2xl transform hover:scale-105 hover:shadow-white/25 flex items-center justify-center mx-auto"
          >
            <Star className="w-8 h-8 mr-4" />
            Quero começar a gerar leads agora!
            <ArrowRight className="w-8 h-8 ml-4" />
          </button>
          
          <p className="text-emerald-200 text-sm mt-4">
            💳 Pagamento seguro • 🔒 Sem compromisso • ⚡ Ativação imediata
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Importante</h4>
              <p className="text-yellow-700 text-sm">
                Esta calculadora é uma ferramenta de orientação e não substitui uma avaliação nutricional completa. 
                Consulte sempre um especialista para um plano alimentar personalizado.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}