'use client'

import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { getApresentacaoNegocio } from '@/lib/wellness-system/apresentacao-negocio'
import WellnessCTAButton from '@/components/wellness/WellnessCTAButton'
import { useWellnessProfile } from '@/hooks/useWellnessProfile'

function ApresentacaoNegocioPageContent() {
  const { profile, loading: loadingProfile } = useWellnessProfile()
  const apresentacao = getApresentacaoNegocio()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Botão Voltar ao Sistema - Bem visível no topo */}
          <div className="mb-6">
            <Link
              href="/pt/wellness/system"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Voltar ao Sistema</span>
            </Link>
          </div>

          {/* Cabeçalho */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Oportunidade de Negócio
            </h1>
            <p className="text-xl text-gray-600">
              Bebidas Funcionais - Mercado em Crescimento
            </p>
          </div>

          {/* Apresentação */}
          <div className="space-y-8">
            {/* 1. Abertura */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                1. O Mercado de Bebidas Funcionais
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {apresentacao.estrutura.abertura}
              </p>
            </div>

            {/* 2. Demonstração */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                2. Nossos Produtos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {apresentacao.estrutura.demonstracao.map((produto, index) => (
                  <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-gray-800 font-medium">{produto}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. História */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                3. Histórias de Sucesso
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {apresentacao.estrutura.historia}
              </p>
            </div>

            {/* 4. Oportunidade */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 sm:p-8 border-2 border-green-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                4. A Oportunidade
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                {apresentacao.estrutura.oportunidade}
              </p>
            </div>

            {/* 5. Plano Simples */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                5. Plano Simples - 3 Formas de Ganhar
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">💰 Ganho 1: Consumo</h3>
                  <p className="text-gray-700">{apresentacao.estrutura.planoSimples.ganho1}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-2">💚 Ganho 2: Vendas</h3>
                  <p className="text-gray-700">{apresentacao.estrutura.planoSimples.ganho2}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h3 className="font-semibold text-gray-900 mb-2">🚀 Ganho 3: Construção</h3>
                  <p className="text-gray-700">{apresentacao.estrutura.planoSimples.ganho3}</p>
                </div>
              </div>
            </div>

            {/* 6. Fechamento */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 sm:p-8 border-2 border-green-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                6. Próximo Passo
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                {apresentacao.estrutura.fechamento}
              </p>

              {/* CTA Button */}
              {loadingProfile ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                </div>
              ) : (
                <div className="text-center">
                  <WellnessCTAButton
                    config={{
                      cta_type: 'whatsapp',
                      whatsapp_number: profile?.whatsapp || '',
                      country_code: profile?.countryCode || 'BR',
                      cta_button_text: 'Quero conhecer melhor essa oportunidade',
                      custom_whatsapp_message: 'Olá! Vi a apresentação de negócio e tenho interesse em saber mais. Pode me explicar melhor?',
                      show_whatsapp_button: true
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ApresentacaoNegocioPage() {
  return (
    <ApresentacaoNegocioPageContent />
  )
}

