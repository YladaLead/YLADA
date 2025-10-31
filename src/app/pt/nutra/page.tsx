'use client'

import Link from 'next/link'
import YLADALogo from '../../../components/YLADALogo'
import LanguageSelector from '../../../components/LanguageSelector'
import { useTranslations } from '../../../hooks/useTranslations'

export default function NutraLandingPage() {
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
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200 mb-6">
            💊 Especialmente para Consultores Nutra
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Acelere Suas{' '}
            <span className="text-blue-600">
              Vendas de Suplementos
            </span>{' '}
            com Ferramentas Inteligentes
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Templates científicos que qualificam leads, aumentam conversões e 
            transformam cada visita em uma oportunidade de venda para seu negócio.
          </p>

          {/* CTA Principal */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/pt/templates"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <span className="mr-3">🚀</span>
              Ver Templates Disponíveis
            </Link>
            <Link
              href="/calculadora-imc"
              className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              <span className="mr-3">📊</span>
              Testar Calculadora Grátis
            </Link>
          </div>

          {/* Credibilidade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">+300%</div>
              <div className="text-sm text-gray-600">Aumento nas Vendas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">1.800+</div>
              <div className="text-sm text-gray-600">Consultores Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">10min</div>
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
                Dificuldade para Qualificar Clientes
              </h3>
              <p className="text-gray-600 text-sm">
                Muitos leads que não se convertem em vendas reais, desperdiçando seu tempo e investimento em marketing.
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
                Poucos visitantes do seu site ou redes sociais se transformam em clientes que compram seus produtos.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Falta de Tempo para Atendimento
              </h3>
              <p className="text-gray-600 text-sm">
                Entre vendas e atendimentos, sobra pouco tempo para criar conteúdo educativo e engajar clientes.
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
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Qualificação Automática
              </h3>
              <p className="text-gray-600 text-sm">
                Ferramentas inteligentes que identificam clientes qualificados antes mesmo do primeiro contato comercial.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Aumento de Vendas
              </h3>
              <p className="text-gray-600 text-sm">
                Templates científicos que aumentam em até 300% sua taxa de conversão de leads em vendas.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Configuração Rápida
              </h3>
              <p className="text-gray-600 text-sm">
                Em apenas 10 minutos você tem ferramentas profissionais funcionando e gerando vendas.
              </p>
            </div>
          </div>
        </div>

        {/* Templates Específicos */}
        <div className="bg-blue-50 rounded-2xl p-8 sm:p-12 border border-blue-200 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Templates Exclusivos para Consultores Nutra
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Calculadora de ROI
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Calcule o retorno de investimentos em marketing e demonstre o valor dos seus produtos.
              </p>
              <Link 
                href="/pt/templates"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Ver Detalhes →
              </Link>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">💊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Quiz de Produtos
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Descubra o produto ideal para cada cliente e personalize a recomendação em minutos.
              </p>
              <Link 
                href="/pt/templates"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Ver Detalhes →
              </Link>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Calculadora de Necessidades
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Avalie as necessidades nutricionais do cliente e recomende produtos específicos.
              </p>
              <Link 
                href="/calculadora-imc"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Testar Agora →
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center bg-gray-50 rounded-2xl p-8 sm:p-12 border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Pronto para Acelerar Suas Vendas?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a mais de 1.800 consultores que já estão usando o YLADA 
            para aumentar suas vendas e otimizar seu tempo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pt/templates"
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <span className="mr-3">🚀</span>
              Começar Agora
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
