'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'

function WellnessSystemPageContent() {
  const router = useRouter()

  const modulos = [
    {
      id: 'recrutar',
      titulo: 'RECRUTAR PESSOAS PARA O NEGÓCIO',
      emoji: '👥',
      cor: 'from-blue-500 to-blue-600',
      corHover: 'hover:from-blue-600 hover:to-blue-700',
      rota: '/pt/wellness/system/recrutar'
    },
    {
      id: 'vender',
      titulo: 'VENDER BEBIDAS FUNCIONAIS',
      emoji: '💚',
      cor: 'from-green-500 to-green-600',
      corHover: 'hover:from-green-600 hover:to-green-700',
      rota: '/pt/wellness/system/vender'
    },
    {
      id: 'scripts',
      titulo: 'SCRIPTS (BIBLIOTECA COMPLETA)',
      emoji: '📚',
      cor: 'from-purple-500 to-purple-600',
      corHover: 'hover:from-purple-600 hover:to-purple-700',
      rota: '/pt/wellness/system/scripts'
    },
    {
      id: 'treinamento',
      titulo: 'TREINAMENTO DO CONSULTOR',
      emoji: '🎓',
      cor: 'from-orange-500 to-orange-600',
      corHover: 'hover:from-orange-600 hover:to-orange-700',
      rota: '/pt/wellness/system/treinamento'
    },
    {
      id: 'ferramentas',
      titulo: 'FERRAMENTAS',
      emoji: '🛠️',
      cor: 'from-teal-500 to-teal-600',
      corHover: 'hover:from-teal-600 hover:to-teal-700',
      rota: '/pt/wellness/system/ferramentas'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Botão Voltar - Discreto no topo */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center space-x-2 text-sm text-gray-500 hover:text-gray-700 transition-colors group"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Voltar</span>
          </button>
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            O que você quer fazer agora?
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha uma opção abaixo para começar
          </p>
        </div>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {modulos.map((modulo) => (
            <Link
              key={modulo.id}
              href={modulo.rota}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group"
            >
              {/* Botão Principal do Módulo */}
              <div className={`w-full p-6 sm:p-8 bg-gradient-to-r ${modulo.cor} ${modulo.corHover} text-white transition-all duration-300 relative`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <span className="text-4xl sm:text-5xl flex-shrink-0">{modulo.emoji}</span>
                    <h2 className="text-lg sm:text-xl font-bold text-left leading-tight">
                      {modulo.titulo}
                    </h2>
                  </div>
                  <svg
                    className="w-6 h-6 flex-shrink-0 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Rodapé com informações */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-sm text-gray-500">
            💡 <strong>Dica:</strong> Clique em qualquer módulo para acessar suas opções
          </p>
        </div>
      </main>
    </div>
  )
}

export default function WellnessSystemPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <WellnessSystemPageContent />
    </ProtectedRoute>
  )
}

