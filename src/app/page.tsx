import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - Clean Design */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 flex items-center">
        <div className="container mx-auto px-4 py-0.5 flex items-center justify-between">
          <YLADALogo size="md" responsive={true} />
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section - Filosofia YLADA */}
      <main className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        <div className="text-center max-w-5xl mx-auto">

          {/* Badge de Filosofia */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 border border-blue-200">
            🧭 Transformando intenções em conexões reais
          </div>

          {/* Título Principal - Filosofia Universal */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            O YLADA nasceu para{' '}
            <span className="text-blue-600">
              transformar intenções
            </span>{' '}
            em{' '}
            <span className="text-blue-500">
              oportunidades
            </span>
          </h1>
          
          {/* Subtítulo - Propósito Universal */}
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Em apenas <span className="text-gray-900 font-semibold">um link</span>, você conecta{' '}
            <span className="text-blue-600 font-semibold">pessoas</span>,{' '}
            <span className="text-blue-500 font-semibold">produtos</span> e{' '}
            <span className="text-blue-700 font-semibold">propósitos</span>.
            <br className="hidden sm:block" />
            <span className="text-gray-500">Sem complicação, sem código — apenas inteligência que funciona.</span>
          </p>

          {/* CTA Principal - Chamada Universal */}
          <div className="space-y-6 mb-16">
            <Link 
              href="/escolha-perfil"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="mr-3 text-lg">🚀</span>
              Descubra como o YLADA funciona para você
            </Link>
            
            {/* Credibilidade Universal */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">✅</span>
                <span className="text-gray-700 font-medium">+10.000 profissionais</span> já transformaram suas conexões
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">🌍</span>
                <span className="text-gray-700 font-medium">Global</span> e multilíngue
              </div>
              <div className="flex items-center">
                <span className="text-blue-500 mr-2">⚡</span>
                <span className="text-gray-700 font-medium">60 segundos</span> para começar
              </div>
            </div>
          </div>

          {/* Benefícios - 3 Pilares da Filosofia YLADA */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl text-blue-600">⚡</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900 text-center">Simplicidade</h3>
              <p className="text-gray-600 text-sm leading-relaxed text-center">
                <span className="text-blue-600 font-semibold">Um link, infinitas possibilidades</span>. 
                Transforme qualquer ideia em uma ferramenta inteligente em segundos.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl text-blue-600">🎯</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900 text-center">Inteligência</h3>
              <p className="text-gray-600 text-sm leading-relaxed text-center">
                <span className="text-blue-600 font-semibold">IA que entende seu público</span>. 
                Cada ferramenta é otimizada para converter visitantes em conexões reais.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl text-blue-600">🌍</span>
              </div>
              <h3 className="text-lg font-bold mb-3 text-gray-900 text-center">Escalabilidade</h3>
              <p className="text-gray-600 text-sm leading-relaxed text-center">
                <span className="text-blue-600 font-semibold">Cresça sem limites</span>. 
                Da primeira conexão ao milhão de usuários, o YLADA escala com você.
              </p>
            </div>
          </div>

          {/* Credibilidade - Filosofia Universal */}
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
              Uma plataforma para{' '}
              <span className="text-blue-600">
                todos os profissionais
              </span>
            </h2>
            <p className="text-base text-gray-600 mb-8 text-center max-w-2xl mx-auto">
              Seja qual for sua área, o YLADA se adapta ao seu público e objetivos. 
              Descubra como funciona especificamente para você.
            </p>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-3xl mb-3">🥗</div>
                <h3 className="text-base font-bold mb-2 text-gray-900">Nutricionistas</h3>
                <p className="text-gray-600 mb-2 text-xs">Transforme consultas em conexões duradouras</p>
                <div className="text-xs text-blue-600 font-medium">✨ Disponível</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-3xl mb-3">💊</div>
                <h3 className="text-base font-bold mb-2 text-gray-900">Vendedores</h3>
                <p className="text-gray-600 mb-2 text-xs">Conecte produtos com pessoas certas</p>
                <div className="text-xs text-blue-600 font-medium">✨ Disponível</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-3xl mb-3">🧘‍♀️</div>
                <h3 className="text-base font-bold mb-2 text-gray-900">Coaches</h3>
                <p className="text-gray-600 mb-2 text-xs">Engaje e transforme vidas</p>
                <div className="text-xs text-blue-600 font-medium">✨ Disponível</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300">
                <div className="text-3xl mb-3">💼</div>
                <h3 className="text-base font-bold mb-2 text-gray-900">Empreendedores</h3>
                <p className="text-gray-600 mb-2 text-xs">Escale seu negócio inteligentemente</p>
                <div className="text-xs text-blue-600 font-medium">✨ Disponível</div>
              </div>
            </div>
          </div>

          {/* CTA Final - Chamada Universal */}
          <div className="text-center">
            <Link 
              href="/escolha-perfil"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mb-6"
            >
              <span className="mr-3 text-lg">🚀</span>
              Descubra como o YLADA funciona para você
            </Link>
            <p className="text-gray-500 text-base">
              Gratuito para começar • Sem compromisso • Resultados em minutos
            </p>
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