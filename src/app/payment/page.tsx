'use client'

import { useState } from 'react'
import { Zap, Shield, ArrowRight, CreditCard, Smartphone, Globe } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState('monthly')
  const [loading, setLoading] = useState(false)

  const plans = {
        monthly: {
          price: 'R$ 60',
          period: '/mês',
          total: 'R$ 60',
          description: 'Acesso completo por 30 dias',
          features: [
            '🚀 Gere contatos novos todos os dias, sem depender de anúncios',
            '🔗 Crie links inteligentes que atraem e convertem',
            '📊 Veja tudo em um painel simples e visual',
            '❤️ Suporte humano e rápido — sem enrolação',
            '🧠 Descubra quais campanhas realmente trazem resultado',
            '🎓 Cursos completos ensinando como pensar e argumentar melhor'
          ]
        },
        yearly: {
          price: 'R$ 47,50',
          period: '/mês',
          total: 'R$ 570 anual',
          description: '',
          features: [
            '🚀 Gere contatos novos todos os dias, sem depender de anúncios',
            '🔗 Crie links inteligentes que atraem e convertem',
            '📊 Veja tudo em um painel simples e visual',
            '❤️ Suporte prioritário e rápido — sem enrolação',
            '🧠 Descubra quais campanhas realmente trazem resultado',
            '🎓 Cursos completos ensinando como pensar e argumentar melhor'
          ]
        }
  }

  const currentPlan = plans[selectedPlan as keyof typeof plans]

  const handlePayment = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planType: selectedPlan })
      })
      
      if (!response.ok) {
        throw new Error('Erro ao criar assinatura')
      }
      
      const { url } = await response.json()
      
      // Redirect to Stripe checkout
      window.location.href = url
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Erro ao processar assinatura. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-xl border-b-2 border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/user" className="flex items-center space-x-3">
              <Image
                src="/logos/herbalead/herbalead-logo-horizontal.png"
                alt="Herbalead"
                width={140}
                height={45}
                className="h-12 w-auto"
              />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-8 shadow-lg">
            💡 Ferramenta oficial para gerar leads com alto potencial de conversão
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Transforme seu negócio em uma<br />
            <span className="text-emerald-600">máquina de gerar contatos</span><br />
            com o Herbalead 🚀
          </h1>
        </div>

        {/* Plan Selection */}
        <div className="bg-white rounded-3xl shadow-2xl p-12 mb-12 border-2 border-emerald-200">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Escolha seu plano</h2>
            
            {/* Plan Toggle */}
            <div className="flex justify-center mb-12">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-2 flex shadow-inner">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    selectedPlan === 'monthly'
                      ? 'bg-white text-emerald-600 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${
                    selectedPlan === 'yearly'
                      ? 'bg-white text-emerald-600 shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  Anual
                  <span className="ml-3 px-3 py-1 bg-emerald-500 text-white text-sm rounded-full font-bold">
                    -20%
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Details */}
            <div className="text-center mb-12">
              <div className="relative">
                <div className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">
                  {currentPlan.price}
                  <span className="text-sm md:text-base text-gray-500 ml-2 font-normal">
                    {currentPlan.period}
                  </span>
                </div>
                {selectedPlan === 'yearly' && (
                  <div className="text-sm text-gray-400 mb-4">
                    {currentPlan.total}
                  </div>
                )}
                <div className="text-base md:text-lg text-gray-500 mb-6">
                  {currentPlan.description}
                </div>
                <div className="mb-8">
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg inline-block shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Processando...' : 'Começar agora'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 gap-6 mb-12">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-lg transition-all duration-300">
                <div className="text-2xl flex-shrink-0">{feature.split(' ')[0]}</div>
                <span className="text-gray-800 font-semibold text-base md:text-lg leading-relaxed">{feature.substring(feature.indexOf(' ') + 1)}</span>
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="border-t border-gray-200 pt-12">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-8 text-center">
              Formas de Pagamento Aceitas
            </h3>
            <div className="flex justify-center space-x-6 mb-12">
              <div className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <span className="text-blue-800 font-semibold">Cartão</span>
              </div>
              <div className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                <Smartphone className="w-6 h-6 text-purple-600" />
                <span className="text-purple-800 font-semibold">PIX</span>
              </div>
              <div className="flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <Globe className="w-6 h-6 text-green-600" />
                <span className="text-green-800 font-semibold">Boleto</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button 
                onClick={handlePayment}
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-12 md:px-16 py-4 md:py-6 rounded-2xl font-bold text-lg md:text-xl hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 flex items-center space-x-4 mx-auto disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl hover:shadow-emerald-500/25 transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-8 h-8" />
                    <span>Ativar minha geração de leads agora</span>
                    <ArrowRight className="w-8 h-8" />
                  </>
                )}
              </button>
              <p className="text-base md:text-lg text-gray-600 mt-6 font-medium">
                🔒 Sem risco. Você testa por 7 dias e cancela quando quiser.
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Cobrança automática</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Cartão de crédito</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Cancele quando quiser</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Section */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 mb-12 border-2 border-red-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-red-600 mb-6">❌ Sem o Herbalead:</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Você fica sem norte, sem ferramentas para fazer o cliente chegar até você</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Não sabe como argumentar e convencer seus prospects</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Fica travado na geração de contatos e vendas</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-emerald-600 mb-6">✅ Com o Herbalead:</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Cursos completos ensinando como pensar e argumentar melhor</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Novas ferramentas constantemente implantadas</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Seus links fazem o trabalho de atrair e converter</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 border-2 border-blue-200">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            💡 Ideal para quem:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-4xl mb-3">🎯</div>
              <p className="text-gray-700 font-medium">
                Quer aprender a argumentar melhor e convencer prospects
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">📚</div>
              <p className="text-gray-700 font-medium">
                Precisa de cursos práticos para melhorar suas vendas
              </p>
            </div>
            <div className="text-center p-4">
              <div className="text-4xl mb-3">⚡</div>
              <p className="text-gray-700 font-medium">
                Deseja ter acesso a ferramentas sempre atualizadas
              </p>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl p-8 text-center border border-emerald-200 shadow-lg">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            💚 7 dias grátis. Cancele quando quiser.
          </h3>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            🚀 Comece agora e veja o primeiro resultado ainda hoje.
          </p>
        </div>
      </main>
    </div>
  )
}

