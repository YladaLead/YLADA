import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header - Mobile First */}
      <header className="sticky top-0 z-50 border-b border-gray-300 bg-white/95 backdrop-blur-md shadow-lg">
        <div className="container mx-auto px-4 py-4 sm:py-6 flex items-center justify-between">
          <YLADALogo size="xl" responsive={true} />
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section - Foco em Resultados Comerciais */}
      <main className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="text-center max-w-6xl mx-auto">

          {/* Badge de Urgência */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-semibold mb-6 animate-pulse">
            🔥 OFERTA LIMITADA: 50% OFF nos primeiros 100 usuários
          </div>

          {/* Título Principal - Gatilho Mental */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            <span className="text-red-400">PARE</span> de perder clientes!{' '}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Capture 3x mais leads
            </span>{' '}
            com templates que já geraram{' '}
            <span className="text-yellow-400">R$ 2.3 milhões</span> em vendas
          </h1>
          
          {/* Subtítulo - Benefício Claro */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
            <span className="text-white font-semibold">Nutricionistas que usam nossos templates</span> capturam em média{' '}
            <span className="text-green-400 font-bold">47 leads por semana</span> e aumentam suas vendas em{' '}
            <span className="text-yellow-400 font-bold">340%</span>.
            <br className="hidden sm:block" />
            <span className="text-gray-400">Sem precisar de programador, sem complicação — apenas personalize e comece a vender.</span>
          </p>

          {/* CTA Principal - Verde */}
          <div className="space-y-6 mb-16">
            <Link 
              href="/templates"
              className="inline-flex items-center px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg sm:text-xl font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 border-2 border-green-400"
            >
              <span className="mr-3 text-xl">💰</span>
              QUERO GERAR R$ 50.000+ EM VENDAS
            </Link>
            
            {/* Credibilidade */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-300">
              <div className="flex items-center">
                <span className="text-green-400 mr-2">✅</span>
                <span className="text-white font-semibold">2.847 nutricionistas</span> já usam
              </div>
              <div className="flex items-center">
                <span className="text-blue-400 mr-2">🌍</span>
                <span className="text-white font-semibold">3 idiomas</span> disponíveis
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-2">⚡</span>
                <span className="text-white font-semibold">60 segundos</span> para criar
              </div>
            </div>
          </div>

          {/* Benefícios - 3 Cards Focados em Resultado */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
            <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl sm:text-3xl">⚡</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Resultados em 24h</h3>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                <span className="text-green-400 font-bold">47 leads por semana</span> em média. 
                Templates testados que convertem visitantes em clientes pagantes em menos de 24 horas.
              </p>
            </div>
            
            <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl sm:text-3xl">🎯</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Feito para Nutrição</h3>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">Criados por <span className="text-blue-400 font-bold">nutricionistas de sucesso</span> que já faturaram milhões. Cada template foi testado e otimizado para o mercado nutra.</p>
            </div>
            
            <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-700 sm:col-span-2 lg:col-span-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl sm:text-3xl">💰</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">ROI Garantido</h3>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed"><span className="text-yellow-400 font-bold">340% de aumento</span> nas vendas em 90 dias. Sem complicação, sem código — apenas personalize e comece a faturar.</p>
            </div>
          </div>

          {/* Credibilidade - Profissionais Atendidos */}
          <div className="bg-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-700 mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 text-center">
              Perfeito para quem trabalha com{' '}
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Nutrição e Mercado de Suplementos
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-12 text-center max-w-3xl mx-auto">
              Templates específicos para atrair clientes e aumentar as vendas no mercado nutra.
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg transition-shadow border border-green-400">
                <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">🥗</div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">Nutricionistas</h3>
                <p className="text-gray-200 mb-4 text-sm sm:text-base">Quiz de avaliação nutricional, calculadoras de IMC, planilhas de dieta personalizadas</p>
                <div className="text-sm text-green-200 font-medium">✅ Disponível</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg transition-shadow border border-blue-400">
                <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">💊</div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">Distribuidores de Suplementos</h3>
                <p className="text-gray-200 mb-4 text-sm sm:text-base">Quiz de produtos, calculadoras nutricionais, catálogos interativos</p>
                <div className="text-sm text-blue-200 font-medium">✅ Disponível</div>
              </div>
              
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 sm:p-8 text-center hover:shadow-lg transition-shadow border border-yellow-400 sm:col-span-2 lg:col-span-1">
                <div className="text-4xl sm:text-5xl mb-4 sm:mb-6">💼</div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">Vendedores de Nutracêuticos</h3>
                <p className="text-gray-200 mb-4 text-sm sm:text-base">Revendedores, consultores e vendedores independentes de nutracêuticos</p>
                <div className="text-sm text-yellow-200 font-medium">✅ Disponível</div>
              </div>
            </div>
          </div>

          {/* CTA Final - Chamada à Ação */}
          <div className="text-center">
            <Link 
              href="/templates"
              className="inline-flex items-center px-8 sm:px-12 py-4 sm:py-5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg sm:text-xl font-bold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-6 border-2 border-green-400"
            >
              <span className="mr-3 text-xl">💰</span>
              QUERO GERAR R$ 50.000+ EM VENDAS
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-white/95 backdrop-blur-md mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="mb-6">
              <YLADALogo size="xl" />
            </div>
            <p className="text-gray-600 text-lg mb-4">
              Templates prontos para nutricionistas e distribuidores de suplementos
            </p>
            <p className="text-gray-500">
              &copy; 2024 YLADA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}