import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'

export default function NutricionistaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-300 bg-white/95 backdrop-blur-md shadow-lg h-12 sm:h-16 flex items-center">
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
              href="/pt"
              className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <span className="mr-2">←</span>
              Escolher outro perfil
            </Link>
          </div>

          {/* Badge Específico */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-semibold mb-8 shadow-lg">
            🥗 Especialmente para Nutricionistas
          </div>

          {/* Título Principal */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 sm:mb-8 leading-tight">
            Transforme suas{' '}
            <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
              consultas nutricionais
            </span>{' '}
            em{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              conexões duradouras
            </span>
          </h1>
          
          {/* Subtítulo Específico */}
          <p className="text-xl sm:text-2xl text-gray-300 mb-12 sm:mb-16 max-w-4xl mx-auto leading-relaxed">
            <span className="text-white font-semibold">Nutricionistas que usam o YLADA</span> capturam em média{' '}
            <span className="text-green-400 font-bold">47 leads por semana</span> e aumentam suas vendas em{' '}
            <span className="text-yellow-400 font-bold">340%</span>.
            <br className="hidden sm:block" />
            <span className="text-gray-400">Sem precisar de programador, sem complicação — apenas personalize e comece a engajar.</span>
          </p>

          {/* CTA Principal */}
          <div className="space-y-8 mb-20">
            <Link 
              href="/create"
              className="inline-flex items-center px-10 sm:px-16 py-5 sm:py-6 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl sm:text-2xl font-bold rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 border-2 border-green-400"
            >
              <span className="mr-4 text-2xl">🥗</span>
              Crie seu link inteligente em 60 segundos
            </Link>
            
            {/* Credibilidade Específica */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-base text-gray-300">
              <div className="flex items-center">
                <span className="text-green-400 mr-3 text-xl">✅</span>
                <span className="text-white font-semibold text-lg">2.847 nutricionistas</span> já usam
              </div>
              <div className="flex items-center">
                <span className="text-blue-400 mr-3 text-xl">📊</span>
                <span className="text-white font-semibold text-lg">47 leads/semana</span> em média
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-3 text-xl">💰</span>
                <span className="text-white font-semibold text-lg">340% aumento</span> nas vendas
              </div>
            </div>
          </div>

          {/* Ferramentas Específicas para Nutricionistas */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-20 sm:mb-24">
            <div className="bg-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-700 hover:border-green-500">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-3xl sm:text-4xl">🧩</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">Quiz de Perfil Metabólico</h3>
              <p className="text-gray-300 text-lg sm:text-xl leading-relaxed text-center">
                <span className="text-green-400 font-bold">Descubra o tipo metabólico</span> do seu cliente em minutos. 
                Ferramenta que já gerou mais de 15.000 leads qualificados.
              </p>
              <div className="mt-6 bg-green-500/20 px-4 py-2 rounded-full inline-block">
                <span className="text-green-300 font-semibold">35% conversão média</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-700 hover:border-blue-500">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-3xl sm:text-4xl">🧮</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">Calculadora de IMC Inteligente</h3>
              <p className="text-gray-300 text-lg sm:text-xl leading-relaxed text-center">
                <span className="text-blue-400 font-bold">Calcule e interprete</span> o IMC com recomendações personalizadas. 
                Mais de 8.000 cálculos realizados este mês.
              </p>
              <div className="mt-6 bg-blue-500/20 px-4 py-2 rounded-full inline-block">
                <span className="text-blue-300 font-semibold">28% conversão média</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-3xl p-8 sm:p-10 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-700 hover:border-purple-500 sm:col-span-2 lg:col-span-1">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg">
                <span className="text-3xl sm:text-4xl">📋</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-6 text-white text-center">Checklist de Rotina Saudável</h3>
              <p className="text-gray-300 text-lg sm:text-xl leading-relaxed text-center">
                <span className="text-purple-400 font-bold">10 sinais</span> de que seu cliente precisa mudar a rotina. 
                Ferramenta de engajamento que funciona.
              </p>
              <div className="mt-6 bg-purple-500/20 px-4 py-2 rounded-full inline-block">
                <span className="text-purple-300 font-semibold">42% conversão média</span>
              </div>
            </div>
          </div>

          {/* Depoimentos de Nutricionistas */}
          <div className="bg-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-700 mb-16 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
              O que dizem{' '}
              <span className="bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">
                nutricionistas de sucesso
              </span>
            </h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-700 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Maria Silva</h3>
                <p className="text-green-400 font-semibold mb-3">Nutricionista Clínica</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "Em 3 meses usando o YLADA, aumentei meus clientes em 250%. O quiz de perfil metabólico é genial!"
                </p>
              </div>
              
              <div className="bg-gray-700 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Ana Costa</h3>
                <p className="text-blue-400 font-semibold mb-3">Nutricionista Esportiva</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "A calculadora de IMC inteligente me ajuda a engajar muito melhor com meus atletas. Recomendo!"
                </p>
              </div>
              
              <div className="bg-gray-700 rounded-2xl p-6 text-center sm:col-span-2 lg:col-span-1">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">C</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Carlos Mendes</h3>
                <p className="text-purple-400 font-semibold mb-3">Nutricionista Funcional</p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  "O checklist de rotina saudável é perfeito para engajar clientes. Minha agenda está sempre cheia!"
                </p>
              </div>
            </div>
          </div>

          {/* CTA Final */}
          <div className="text-center">
            <Link 
              href="/create"
              className="inline-flex items-center px-10 sm:px-16 py-5 sm:py-6 bg-gradient-to-r from-green-500 to-green-600 text-white text-xl sm:text-2xl font-bold rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 mb-8 border-2 border-green-400"
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
