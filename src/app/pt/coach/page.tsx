'use client'

import Link from 'next/link'
import YLADALogo from '../../../components/YLADALogo'
import LanguageSelector from '../../../components/LanguageSelector'
import { useTranslations } from '../../../hooks/useTranslations'

export default function CoachLandingPage() {
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
          <div className="inline-flex items-center px-4 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-full border border-purple-200 mb-6">
            🧘‍♀️ Especialmente para Coaches de Bem-estar
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Acelere o{' '}
            <span className="text-purple-600">
              Processo de Transformação
            </span>{' '}
            dos Seus Clientes
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Ferramentas interativas que engajam clientes, aumentam retenção e 
            transformam cada sessão em uma oportunidade de crescimento pessoal.
          </p>

          {/* CTA Principal */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/pt/templates"
              className="inline-flex items-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-xl hover:bg-purple-700 transition-colors"
            >
              <span className="mr-3">🚀</span>
              Ver Templates Disponíveis
            </Link>
            <Link
              href="/calculadora-imc"
              className="inline-flex items-center px-8 py-4 bg-gray-100 text-gray-700 text-lg font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              <span className="mr-3">📊</span>
              Testar Ferramenta Grátis
            </Link>
          </div>

          {/* Credibilidade */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">+250%</div>
              <div className="text-sm text-gray-600">Aumento na Retenção</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">1.200+</div>
              <div className="text-sm text-gray-600">Coaches Ativos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">12min</div>
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
                Dificuldade para Engajar Clientes
              </h3>
              <p className="text-gray-600 text-sm">
                Clientes que não se comprometem com o processo de transformação, abandonando o programa antes dos resultados.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📉</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Baixa Taxa de Retenção
              </h3>
              <p className="text-gray-600 text-sm">
                Poucos clientes completam o programa de coaching, impactando sua receita e reputação.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⏰</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Falta de Tempo para Acompanhamento
              </h3>
              <p className="text-gray-600 text-sm">
                Entre sessões e atendimentos, sobra pouco tempo para criar conteúdo motivacional e acompanhar progressos.
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
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Engajamento Automático
              </h3>
              <p className="text-gray-600 text-sm">
                Ferramentas interativas que mantêm clientes engajados e comprometidos com o processo de transformação.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Aumento de Retenção
              </h3>
              <p className="text-gray-600 text-sm">
                Templates científicos que aumentam em até 250% a retenção de clientes no programa de coaching.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Configuração Rápida
              </h3>
              <p className="text-gray-600 text-sm">
                Em apenas 12 minutos você tem ferramentas profissionais funcionando e engajando clientes.
              </p>
            </div>
          </div>
        </div>

        {/* Templates Específicos */}
        <div className="bg-purple-50 rounded-2xl p-8 sm:p-12 border border-purple-200 mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
            Templates Exclusivos para Coaches de Bem-estar
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🧘‍♀️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Quiz de Bem-Estar
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Avalie o nível de bem-estar do cliente e personalize o programa de coaching em minutos.
              </p>
              <Link 
                href="/pt/templates"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Ver Detalhes →
              </Link>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Checklist de Crescimento
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Avalie o potencial de crescimento do cliente e crie estratégias personalizadas de desenvolvimento.
              </p>
              <Link 
                href="/pt/templates"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Ver Detalhes →
              </Link>
            </div>
            
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Desafio de Transformação
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Crie desafios personalizados que motivam clientes e aceleram o processo de transformação.
              </p>
              <Link 
                href="/pt/templates"
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                Ver Detalhes →
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center bg-gray-50 rounded-2xl p-8 sm:p-12 border border-gray-200">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Pronto para Acelerar a Transformação?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se a mais de 1.200 coaches que já estão usando o YLADA 
            para aumentar a retenção e acelerar a transformação dos clientes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pt/templates"
              className="inline-flex items-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-xl hover:bg-purple-700 transition-colors"
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
