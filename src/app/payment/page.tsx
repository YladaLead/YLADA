'use client'

import { useState } from 'react'
import { Check, Star, Zap, Shield, ArrowRight, CreditCard, Smartphone, Globe } from 'lucide-react'
import Link from 'next/link'

export default function PaymentPage() {
  const [selectedPlan, setSelectedPlan] = useState('monthly')

  const plans = {
    monthly: {
      price: 'R$ 97',
      period: '/mês',
      total: 'R$ 97',
      description: 'Acesso completo por 30 dias',
      features: [
        'Todas as 9 ferramentas',
        'Links personalizados ilimitados',
        'Dashboard completo',
        'Suporte por WhatsApp',
        'Relatórios de leads',
        'Sem taxa de setup'
      ]
    },
    yearly: {
      price: 'R$ 67',
      period: '/mês',
      total: 'R$ 804',
      description: 'Economize 30% pagando anualmente',
      features: [
        'Todas as 9 ferramentas',
        'Links personalizados ilimitados',
        'Dashboard completo',
        'Suporte prioritário',
        'Relatórios avançados',
        '2 meses grátis',
        'Sem taxa de setup'
      ]
    }
  }

  const currentPlan = plans[selectedPlan as keyof typeof plans]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/user" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-600 to-green-600 rounded-lg flex items-center justify-center">
                <ArrowRight className="w-6 h-6 text-white rotate-180" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FitLead</h1>
                <p className="text-sm text-gray-600">Área do Profissional</p>
              </div>
            </Link>
            <div className="text-sm text-gray-600">
              Teste grátis por 7 dias
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu Plano FitLead
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Comece a gerar leads profissionais hoje mesmo
          </p>
          
          {/* Testimonial */}
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-gray-700 italic mb-4">
              "Em 2 semanas já gerei mais leads do que em 3 meses usando métodos tradicionais. O FitLead é revolucionário!"
            </p>
            <p className="text-sm text-gray-500">- Maria Silva, Nutricionista</p>
          </div>
        </div>

        {/* Plan Selection */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Escolha seu plano</h2>
            
            {/* Plan Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-lg p-1 flex">
                <button
                  onClick={() => setSelectedPlan('monthly')}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    selectedPlan === 'monthly'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setSelectedPlan('yearly')}
                  className={`px-6 py-3 rounded-md font-medium transition-colors ${
                    selectedPlan === 'yearly'
                      ? 'bg-white text-emerald-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Anual
                  <span className="ml-2 px-2 py-1 bg-emerald-100 text-emerald-600 text-xs rounded-full">
                    -30%
                  </span>
                </button>
              </div>
            </div>

            {/* Plan Details */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold text-emerald-600 mb-2">
                {currentPlan.price}
              </div>
              <div className="text-lg text-gray-600 mb-2">
                {currentPlan.period}
              </div>
              <div className="text-sm text-gray-500">
                {currentPlan.description}
              </div>
              {selectedPlan === 'yearly' && (
                <div className="text-sm text-emerald-600 font-medium mt-2">
                  Total anual: {currentPlan.total}
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {currentPlan.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Payment Methods */}
          <div className="border-t pt-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Formas de Pagamento
            </h3>
            <div className="flex justify-center space-x-4 mb-8">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Cartão</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
                <Smartphone className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">PIX</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-50 rounded-lg">
                <Globe className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Boleto</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <button className="bg-emerald-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors flex items-center space-x-3 mx-auto">
                <Zap className="w-6 h-6" />
                <span>Começar Agora</span>
                <ArrowRight className="w-6 h-6" />
              </button>
              <p className="text-sm text-gray-500 mt-4">
                7 dias grátis • Cancele quando quiser • Sem compromisso
              </p>
            </div>
          </div>
        </div>

        {/* Guarantee */}
        <div className="bg-emerald-50 rounded-xl p-6 text-center">
          <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Garantia de 7 dias
          </h3>
          <p className="text-gray-600">
            Se não ficar satisfeito, devolvemos seu dinheiro. Sem perguntas.
          </p>
        </div>
      </main>
    </div>
  )
}

