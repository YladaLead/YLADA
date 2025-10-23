'use client'

import Link from 'next/link'
import YLADALogo from '../../../components/YLADALogo'
import LanguageSelector from '../../../components/LanguageSelector'
import { useTranslations } from '../../../hooks/useTranslations'

export default function NutriLandingPage() {
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
          <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 text-sm font-medium rounded-full border border-green-200 mb-6">
            🥗 Especialmente para Nutricionistas
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Transforme Suas{' '}
            <span className="text-green-600">
              Consultas Nutricionais
            </span>{' '}
            em Resultados Mensuráveis
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Ferramentas inteligentes que qualificam leads, aumentam conversões e 
            transformam cada consulta em uma oportunidade de crescimento para seu consultório.
          </p>

          {/* CTA Principal */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/calculadora-imc"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              <span className="mr-3">🚀</span>
              Testar Calculadora de IMC Grátis
            </Link>
            <Link
              href="/pt/templates"
              className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              <span className="mr-3">📋</span>
              Ver Todos os Templates
            </Link>
          </div>

          {/* Credibilidade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">+340%</div>
              <div className="text-sm text-gray-600">Aumento na Conversão</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">2.500+</div>
              <div className="text-sm text-gray-600">Nutricionistas Ativas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">15min</div>
              <div className="text-sm text-gray-600">Para Configurar</div>
            </div>
          </div>
        </div>

        {/* Seção de Problemas */}
        <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 border border-gray-200 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Você Reconhece Algum Desses Desafios?
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">😰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Dificuldade para Qualificar Leads
              </h3>
              <p className="text-gray-600 text-sm">
                Muitos contatos que não se convertem em consultas reais, desperdiçando seu tempo e energia.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📉</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Baixa Taxa de Conversão
              </h3>
              <p className="text-gray-600 text-sm">
                Poucos visitantes do seu site ou redes sociais se transformam em clientes pagantes.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Falta de Tempo para Marketing
              </h3>
              <p className="text-gray-600 text-sm">
                Entre consultas e atendimentos, sobra pouco tempo para criar conteúdo e engajar clientes.
              </p>
            </div>
          </div>
        </div>

        {/* Seção de Solução */}
        <div className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Como o YLADA Resolve Isso Para Você
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Qualificação Automática
              </h3>
              <p className="text-gray-600 text-sm">
                Ferramentas inteligentes que identificam leads qualificados antes mesmo da primeira consulta.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Aumento de Conversão
              </h3>
              <p className="text-gray-600 text-sm">
                Templates científicos que aumentam em até 340% sua taxa de conversão de leads em clientes.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Configuração Rápida
              </h3>
              <p className="text-gray-600 text-sm">
                Em apenas 15 minutos você tem ferramentas profissionais funcionando e gerando resultados.
              </p>
            </div>
          </div>
        </div>

        {/* Templates Específicos */}
        <div className="bg-green-50 rounded-2xl p-8 sm:p-12 border border-green-200 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Templates Exclusivos para Nutricionistas
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Calculadora de IMC Inteligente
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Calcule e interprete o IMC com recomendações personalizadas baseadas em evidências científicas.
              </p>
              <Link 
                href="/calculadora-imc"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Testar Agora →
              </Link>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🧬</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Quiz de Perfil Metabólico
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Descubra o tipo metabólico do cliente e personalize o plano nutricional em minutos.
              </p>
              <Link 
                href="/pt/templates"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Ver Detalhes →
              </Link>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📋</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Avaliação Nutricional Completa
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Formulário inteligente que coleta dados essenciais antes da consulta presencial.
              </p>
              <Link 
                href="/pt/templates"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Ver Detalhes →
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center bg-gray-50 rounded-2xl p-8 sm:p-12 border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Pronto para Transformar seu Consultório?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a mais de 2.500 nutricionistas que já estão usando o YLADA 
            para aumentar suas conversões e otimizar seu tempo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/calculadora-imc"
              className="inline-flex items-center px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition-colors"
            >
              <span className="mr-3">🚀</span>
              Começar Grátis Agora
            </Link>
            <Link
              href="/pt/como-funciona"
              className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              <span className="mr-3">📖</span>
              Como Funciona
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <YLADALogo size="lg" />
            </div>
            <p className="text-gray-600 text-sm mb-3">
              {t.footer.tagline}
            </p>
            <p className="text-gray-500 text-xs">
              {t.footer.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
