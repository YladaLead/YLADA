import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'

export default function EscolhaPerfilPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 flex items-center">
        <div className="container mx-auto px-4 py-0.5 flex items-center justify-between">
          <Link href="/">
            <YLADALogo size="md" responsive={true} />
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
              href="/"
              className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors"
            >
              <span className="mr-2">←</span>
              Voltar à página inicial
            </Link>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
            Escolha seu{' '}
            <span className="text-blue-600">
              perfil profissional
            </span>
          </h1>
          
          {/* Subtítulo */}
          <p className="text-lg sm:text-xl text-gray-600 mb-12 sm:mb-16 max-w-4xl mx-auto leading-relaxed">
            Cada perfil tem ferramentas e estratégias específicas para{' '}
            <span className="text-gray-900 font-semibold">maximizar seus resultados</span>.
            <br className="hidden sm:block" />
            <span className="text-gray-500">Escolha o que melhor representa você:</span>
          </p>

          {/* Cards de Perfil */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
            
            {/* Nutricionista */}
            <Link 
              href="/nutricionista"
              className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-green-300 hover:-translate-y-1"
            >
              <div className="text-5xl mb-4 group-hover:scale-105 transition-transform duration-300">🥗</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Sou Nutricionista</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Transforme consultas em conexões duradouras com ferramentas inteligentes de avaliação nutricional.
              </p>
              <div className="bg-green-50 px-3 py-2 rounded-lg inline-block">
                <span className="text-green-700 font-semibold text-sm">Começar agora →</span>
              </div>
            </Link>

            {/* Vendedor */}
            <Link 
              href="/vendedor"
              className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:-translate-y-1"
            >
              <div className="text-5xl mb-4 group-hover:scale-105 transition-transform duration-300">💊</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Sou Vendedor(a)</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Conecte produtos com pessoas certas usando ferramentas de engajamento e conversão.
              </p>
              <div className="bg-blue-50 px-3 py-2 rounded-lg inline-block">
                <span className="text-blue-700 font-semibold text-sm">Começar agora →</span>
              </div>
            </Link>

            {/* Coach */}
            <Link 
              href="/coach"
              className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-purple-300 hover:-translate-y-1"
            >
              <div className="text-5xl mb-4 group-hover:scale-105 transition-transform duration-300">🧘‍♀️</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Sou Coach</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Engaje e transforme vidas com ferramentas personalizadas de bem-estar e desenvolvimento.
              </p>
              <div className="bg-purple-50 px-3 py-2 rounded-lg inline-block">
                <span className="text-purple-700 font-semibold text-sm">Começar agora →</span>
              </div>
            </Link>

            {/* Empreendedor */}
            <Link 
              href="/empreendedor"
              className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-yellow-300 hover:-translate-y-1"
            >
              <div className="text-5xl mb-4 group-hover:scale-105 transition-transform duration-300">💼</div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Sou Empreendedor</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                Escale seu negócio inteligentemente com ferramentas de crescimento e automação.
              </p>
              <div className="bg-yellow-50 px-3 py-2 rounded-lg inline-block">
                <span className="text-yellow-700 font-semibold text-sm">Começar agora →</span>
              </div>
            </Link>
          </div>

          {/* Seção de Dúvidas */}
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Não tem certeza do seu perfil?
            </h2>
            <p className="text-base text-gray-600 mb-6 text-center max-w-2xl mx-auto">
              Não se preocupe! Você pode mudar seu perfil a qualquer momento e ter acesso a todas as ferramentas.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                <div className="text-3xl mb-3">🔄</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Flexibilidade Total</h3>
                <p className="text-gray-600 text-sm">
                  Mude seu perfil quantas vezes quiser sem perder dados ou configurações.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Personalização Inteligente</h3>
                <p className="text-gray-600 text-sm">
                  O YLADA se adapta ao seu perfil para oferecer as melhores ferramentas para você.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Alternativo */}
          <div className="text-center">
            <p className="text-gray-500 text-base mb-4">
              Ou prefere explorar todas as funcionalidades?
            </p>
            <Link 
              href="/templates"
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 text-base font-medium rounded-lg hover:bg-gray-200 transition-all duration-300"
            >
              <span className="mr-2 text-lg">🔍</span>
              Explorar todas as ferramentas
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
              Transformando intenções em conexões reais desde 2024
            </p>
            <p className="text-gray-500 text-xs">
              &copy; 2024 YLADA. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
