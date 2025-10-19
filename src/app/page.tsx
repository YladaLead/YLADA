import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <YLADALogo />
          <LanguageSelector />
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
            Powered by AI • Criado em 60 segundos
          </div>

          <h1 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Transforme suas ideias em{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              links inteligentes
            </span>{' '}
            em segundos
          </h1>
          
          <p className="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Digite o que você quer e receba um link pronto para gerar leads e engajamento. 
            <span className="font-semibold text-gray-800"> Sem complicação, sem código.</span>
          </p>

          {/* CTA Principal */}
          <div className="space-y-6 mb-16">
            <Link 
              href="/create"
              className="inline-flex items-center px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xl font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <span className="mr-3">🚀</span>
              Criar meu primeiro link
            </Link>
            
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Gratuito
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Sem cartão de crédito
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Resultados em segundos
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Super Rápido</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Criação de links em menos de 60 segundos com IA avançada</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Powered by AI</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Inteligência artificial entende exatamente o que você quer criar</p>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Personalizado</h3>
              <p className="text-gray-600 text-lg leading-relaxed">Adaptado para sua profissão e objetivos específicos</p>
            </div>
          </div>

          {/* Categories - FOCO EM SAÚDE & BEM-ESTAR */}
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
              Perfeito para profissionais de{' '}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Saúde & Bem-estar
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl mx-auto">
              Templates específicos criados por IA para cada área de atuação
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow border border-green-200">
                <div className="text-5xl mb-6">🥗</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Nutricionistas</h3>
                <p className="text-gray-600 mb-4">Quiz de avaliação nutricional, calculadoras de IMC, planilhas de dieta</p>
                <div className="text-sm text-green-600 font-medium">✓ Disponível</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow border border-blue-200">
                <div className="text-5xl mb-6">🩺</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Fisioterapeutas</h3>
                <p className="text-gray-600 mb-4">Quiz de avaliação postural, checklists de exercícios, diagnósticos</p>
                <div className="text-sm text-green-600 font-medium">✓ Disponível</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow border border-purple-200">
                <div className="text-5xl mb-6">🏋️</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Personal Trainers</h3>
                <p className="text-gray-600 mb-4">Quiz de condicionamento físico, calculadoras de treino, planilhas</p>
                <div className="text-sm text-green-600 font-medium">✓ Disponível</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow border border-orange-200">
                <div className="text-5xl mb-6">🌿</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">Distribuidores de Suplementos</h3>
                <p className="text-gray-600 mb-4">Quiz de produtos, calculadoras nutricionais, catálogos</p>
                <div className="text-sm text-green-600 font-medium">✓ Disponível</div>
              </div>
            </div>
            
            {/* Coming Soon Section */}
            <div className="mt-12">
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 border border-orange-200">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-3xl mr-3">🚧</span>
                  <h3 className="text-2xl font-bold text-orange-800">
                    Em Construção
                  </h3>
                </div>
                <p className="text-orange-700 text-lg mb-2">
                  Em breve teremos templates específicos para <strong>Beleza & Cosméticos</strong>!
                </p>
                <p className="text-orange-600">
                  Estamos focando primeiro em Saúde & Bem-estar para garantir a melhor qualidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/95 backdrop-blur-md mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="mb-6">
              <YLADALogo />
            </div>
            <p className="text-gray-600 text-lg mb-4">
              Transformando ideias em links inteligentes com IA
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