import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'

export default function VendedorPage() {
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
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold mb-8 shadow-lg">
            💊 Especialmente para Vendedores
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Conecte{' '}
            <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
              produtos certos
            </span>{' '}
            com{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              pessoas certas
            </span>
          </h1>
          
          {/* Subtítulo Específico */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 sm:mb-16 max-w-4xl mx-auto leading-relaxed">
            <span className="text-white font-semibold">Vendedores que usam o YLADA</span> aumentam suas vendas em{' '}
            <span className="text-blue-400 font-bold">280%</span> e reduzem o tempo de conversão em{' '}
            <span className="text-yellow-400 font-bold">65%</span>.
            <br className="hidden sm:block" />
            <span className="text-gray-400">Ferramentas inteligentes que vendem por você, 24 horas por dia.</span>
          </p>

          {/* CTA Principal */}
          <div className="space-y-8 mb-20">
            <Link 
              href="/create"
              className="inline-flex items-center px-10 sm:px-16 py-5 sm:py-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl sm:text-2xl font-bold rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 border-2 border-blue-400"
            >
              <span className="mr-4 text-2xl">💊</span>
              Crie seu link inteligente em 60 segundos
            </Link>
            
            {/* Credibilidade Específica */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-base text-gray-300">
              <div className="flex items-center">
                <span className="text-blue-400 mr-3 text-xl">✅</span>
                <span className="text-white font-semibold text-lg">1.200+ vendedores</span> já usam
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-3 text-xl">📈</span>
                <span className="text-white font-semibold text-lg">280% aumento</span> nas vendas
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-3 text-xl">⚡</span>
                <span className="text-white font-semibold text-lg">65% menos tempo</span> para vender
              </div>
            </div>
          </div>

          {/* Ferramentas Específicas para Vendedores */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-20 sm:mb-24">
            <div className="bg-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-700 hover:border-blue-500">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-3xl sm:text-4xl">🧩</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">Quiz de Produtos</h3>
              <p className="text-gray-300 text-lg sm:text-xl leading-relaxed text-center">
                <span className="text-blue-400 font-bold">Descubra o produto ideal</span> para cada cliente. 
                Ferramenta que já gerou mais de 8.000 vendas qualificadas.
              </p>
              <div className="mt-6 bg-blue-500/20 px-4 py-2 rounded-full inline-block">
                <span className="text-blue-300 font-semibold">45% conversão média</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-700 hover:border-green-500">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-3xl sm:text-4xl">🧮</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">Calculadora de Necessidades</h3>
              <p className="text-gray-300 text-lg sm:text-xl leading-relaxed text-center">
                <span className="text-green-400 font-bold">Calcule a dosagem ideal</span> baseada no perfil do cliente. 
                Mais de 5.000 cálculos realizados este mês.
              </p>
              <div className="mt-6 bg-green-500/20 px-4 py-2 rounded-full inline-block">
                <span className="text-green-300 font-semibold">38% conversão média</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-700 hover:border-purple-500 sm:col-span-2 lg:col-span-1">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-3xl sm:text-4xl">📋</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">Catálogo Interativo</h3>
              <p className="text-gray-300 text-lg sm:text-xl leading-relaxed text-center">
                <span className="text-purple-400 font-bold">Apresente produtos</span> de forma interativa e envolvente. 
                Ferramenta que aumenta o engajamento em 200%.
              </p>
              <div className="mt-6 bg-purple-500/20 px-4 py-2 rounded-full inline-block">
                <span className="text-purple-300 font-semibold">52% conversão média</span>
              </div>
            </div>
          </div>

          {/* Depoimentos de Vendedores */}
          <div className="bg-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-700 mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
              O que dizem{' '}
              <span className="bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">
                vendedores de sucesso
              </span>
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-700 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Roberto Lima</h3>
                <p className="text-blue-400 font-semibold mb-3">Vendedor de Suplementos</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "O quiz de produtos é incrível! Meus clientes se sentem mais confiantes na compra e minhas vendas triplicaram."
                </p>
              </div>
              
              <div className="bg-gray-700 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">S</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Silvia Santos</h3>
                <p className="text-green-400 font-semibold mb-3">Distribuidora Independente</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "A calculadora de necessidades me ajuda a vender mais e melhor. Clientes ficam impressionados com a precisão!"
                </p>
              </div>
              
              <div className="bg-gray-700 rounded-2xl p-6 text-center sm:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Fernando Costa</h3>
                <p className="text-purple-400 font-semibold mb-3">Consultor Nutricional</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "O catálogo interativo é perfeito para apresentar produtos. Meus clientes ficam muito mais engajados!"
                </p>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <Link 
              href="/create"
              className="inline-flex items-center px-10 sm:px-16 py-5 sm:py-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xl sm:text-2xl font-bold rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 mb-8 border-2 border-blue-400"
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
