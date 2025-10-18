import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <YLADALogo />
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transforme suas ideias em{' '}
            <span className="text-blue-600">links inteligentes</span>{' '}
            em 60 segundos
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Digite o que você quer e receba um link pronto para gerar leads e engajamento. 
            Powered by AI.
          </p>

          {/* CTA Principal */}
          <div className="space-y-4">
            <Link 
              href="/create"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Criar meu primeiro link
            </Link>
            
            <p className="text-sm text-gray-500">
              Gratuito • Sem cartão de crédito • Resultados em segundos
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Super Rápido</h3>
              <p className="text-gray-600">Criação de links em menos de 60 segundos</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Powered by AI</h3>
              <p className="text-gray-600">Inteligência artificial entende exatamente o que você quer</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Global</h3>
              <p className="text-gray-600">Funciona em todos os idiomas e segmentos</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>&copy; 2024 YLADA. Transformando ideias em links inteligentes.</p>
        </div>
      </footer>
    </div>
  )
}