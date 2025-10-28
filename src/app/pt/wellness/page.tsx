'use client'

import Link from 'next/link'
import YLADALogo from '../../../components/YLADALogo'
import LanguageSelector from '../../../components/LanguageSelector'
import { useTranslations } from '../../../hooks/useTranslations'

export default function WellnessLandingPage() {
  const { t } = useTranslations()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-4 py-0.5 flex items-center justify-between">
          <Link href="/pt">
            <YLADALogo size="md" responsive={true} />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="text-center max-w-6xl mx-auto mb-16">
          
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/pt"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              ← Voltar para a página principal
            </Link>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-teal-50 text-teal-700 text-sm font-medium rounded-full border border-teal-200 mb-6">
            💚 Especialmente para Consultores de Bem-Estar
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Transforme Suas{' '}
            <span className="text-teal-600">
              Avaliações de Bem-Estar
            </span>{' '}
            em Conexões Duradouras
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Ferramentas profissionais para avaliação, engajamento e acompanhamento em bem-estar. 
            Ideal para coaches, distribuidores e consultores que transformam vidas.
          </p>

          {/* CTA Principal */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/pt/wellness/dashboard"
              className="px-8 py-4 bg-teal-600 text-white text-lg font-semibold rounded-xl hover:bg-teal-700 transition-colors"
            >
              Acessar Dashboard →
            </Link>
            <Link 
              href="/pt/templates"
              className="px-8 py-4 bg-white border-2 border-teal-600 text-teal-600 text-lg font-semibold rounded-xl hover:bg-teal-50 transition-colors"
            >
              Ver Templates
            </Link>
          </div>
        </div>

        {/* Seção de Benefícios */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-teal-300 transition-colors">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Quizzes de Avaliação
            </h3>
            <p className="text-gray-600 text-sm">
              Crie avaliações personalizadas de bem-estar, nutrição e estilo de vida para seus clientes.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-teal-300 transition-colors">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Gestão de Leads
            </h3>
            <p className="text-gray-600 text-sm">
              Capture, organize e acompanhe seus leads de forma eficiente e profissional.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-teal-300 transition-colors">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Automação Inteligente
            </h3>
            <p className="text-gray-600 text-sm">
              Automatize processos de follow-up e comunicação com seus clientes.
            </p>
          </div>
        </div>

        {/* Seção de Filtros */}
        <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 border border-gray-200 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Perfeito para Distribuidores e Consultores
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">📋</span>
                Avaliações Personalizadas
              </h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Quizzes de bem-estar e nutrição
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Avaliação de objetivos de vida saudável
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Diagnóstico de necessidades
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="text-2xl mr-3">📞</span>
                Integração WhatsApp
              </h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Conversões automáticas de leads
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Follow-up personalizado
                </li>
                <li className="flex items-start">
                  <span className="text-teal-600 mr-2">✓</span>
                  Gestão profissional de contatos
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <Link 
            href="/pt/wellness/dashboard"
            className="inline-flex items-center px-8 py-4 bg-teal-600 text-white text-lg font-semibold rounded-xl hover:bg-teal-700 transition-colors"
          >
            Começar Agora →
          </Link>
        </div>
      </main>
    </div>
  )
}

