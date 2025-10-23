import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'

export default function CoachPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-300 bg-white/95 backdrop-blur-md shadow-lg h-16 flex items-center">
        <div className="container mx-auto px-4 py-0.5 flex items-center justify-between">
          <Link href="/">
            <YLADALogo size="xl" responsive={true} />
          </Link>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="text-center max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              href="/escolha-perfil"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <span className="mr-2">←</span>
              Escolher outro perfil
            </Link>
          </div>

          {/* Badge Específico */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-semibold mb-8 shadow-lg">
            🧘‍♀️ Especialmente para Coaches
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Engaje e{' '}
            <span className="bg-gradient-to-r from-purple-400 to-purple-300 bg-clip-text text-transparent">
              transforme vidas
            </span>{' '}
            com{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              ferramentas inteligentes
            </span>
          </h1>
          
          {/* Subtítulo Específico */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 sm:mb-16 max-w-4xl mx-auto leading-relaxed">
            <span className="text-white font-semibold">Coaches que usam o YLADA</span> aumentam o engajamento em{' '}
            <span className="text-purple-400 font-bold">320%</span> e reduzem o tempo de conversão em{' '}
            <span className="text-yellow-400 font-bold">45%</span>.
            <br className="hidden sm:block" />
            <span className="text-gray-400">Ferramentas personalizadas que conectam com o coração das pessoas.</span>
          </p>

          {/* CTA Principal */}
          <div className="space-y-8 mb-20">
            <Link 
              href="/create"
              className="inline-flex items-center px-10 sm:px-16 py-5 sm:py-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xl sm:text-2xl font-bold rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 border-2 border-purple-400"
            >
              <span className="mr-4 text-2xl">🧘‍♀️</span>
              Crie seu link inteligente em 60 segundos
            </Link>
            
            {/* Credibilidade Específica */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-base text-gray-300">
              <div className="flex items-center">
                <span className="text-purple-400 mr-3 text-xl">✅</span>
                <span className="text-white font-semibold text-lg">850+ coaches</span> já usam
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-3 text-xl">📈</span>
                <span className="text-white font-semibold text-lg">320% mais engajamento</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-3 text-xl">⚡</span>
                <span className="text-white font-semibold text-lg">45% menos tempo</span> para converter
              </div>
            </div>
          </div>

          {/* Ferramentas Específicas para Coaches */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-20 sm:mb-24">
            <div className="bg-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-700 hover:border-purple-500">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-3xl sm:text-4xl">🧩</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">Quiz de Bem-Estar</h3>
              <p className="text-gray-300 text-lg sm:text-xl leading-relaxed text-center">
                <span className="text-purple-400 font-bold">Descubra o nível de bem-estar</span> do seu cliente. 
                Ferramenta que já engajou mais de 12.000 pessoas.
              </p>
              <div className="mt-6 bg-purple-500/20 px-4 py-2 rounded-full inline-block">
                <span className="text-purple-300 font-semibold">48% conversão média</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-700 hover:border-green-500">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-3xl sm:text-4xl">🧮</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">Calculadora de Estresse</h3>
              <p className="text-gray-300 text-lg sm:text-xl leading-relaxed text-center">
                <span className="text-green-400 font-bold">Avalie o nível de estresse</span> e ofereça soluções personalizadas. 
                Mais de 6.000 avaliações realizadas este mês.
              </p>
              <div className="mt-6 bg-green-500/20 px-4 py-2 rounded-full inline-block">
                <span className="text-green-300 font-semibold">42% conversão média</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-700 hover:border-blue-500 sm:col-span-2 lg:col-span-1">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-3xl sm:text-4xl">📋</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">Checklist de Hábitos</h3>
              <p className="text-gray-300 text-lg sm:text-xl leading-relaxed text-center">
                <span className="text-blue-400 font-bold">Avalie hábitos saudáveis</span> e crie planos de transformação. 
                Ferramenta que aumenta o comprometimento em 180%.
              </p>
              <div className="mt-6 bg-blue-500/20 px-4 py-2 rounded-full inline-block">
                <span className="text-blue-300 font-semibold">55% conversão média</span>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <Link 
              href="/create"
              className="inline-flex items-center px-10 sm:px-16 py-5 sm:py-6 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xl sm:text-2xl font-bold rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 mb-8 border-2 border-purple-400"
            >
              <span className="mr-4 text-2xl">🚀</span>
              Começar agora - Gratuito
            </Link>
            <p className="text-gray-400 text-lg">
              Sem compromisso • Resultados em 24h • Suporte especializado
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-300 bg-white/95 backdrop-blur-md mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-6">
              <YLADALogo size="xl" />
            </div>
            <p className="text-gray-600 text-lg mb-4">
              Transformando intenções em conexões reais desde 2024
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
