'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import WellnessChatWidget from '@/components/wellness/WellnessChatWidget'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import WellnessNotificacoes from '@/components/ylada-flow/WellnessNotificacoes'

function WellnessSystemPageContent() {
  const router = useRouter()

  // Registrar ação de acesso à página principal
  useEffect(() => {
    const registrarAcao = async () => {
      try {
        await fetch('/api/wellness/acoes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            tipo: 'acessou_sistema',
            descricao: 'Acessou a página principal do sistema',
            pagina: 'Sistema Principal',
            rota: '/pt/wellness/system'
          })
        })
      } catch (error) {
        console.error('Erro ao registrar ação:', error)
      }
    }

    registrarAcao()
  }, [])

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
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Cabeçalho Compacto */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            O que você quer fazer agora?
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Escolha uma opção abaixo para começar
          </p>
        </div>

        {/* Grid de Módulos Compacto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-7xl mx-auto mb-4 sm:mb-6">
          {modulos.map((modulo) => (
            <Link
              key={modulo.id}
              href={modulo.rota}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.01] group"
            >
              {/* Botão Principal do Módulo */}
              <div className={`w-full p-4 sm:p-5 bg-gradient-to-r ${modulo.cor} ${modulo.corHover} text-white transition-all duration-300 relative`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <span className="text-3xl sm:text-4xl flex-shrink-0">{modulo.emoji}</span>
                    <h2 className="text-sm sm:text-base font-bold text-left leading-tight">
                      {modulo.titulo}
                    </h2>
                  </div>
                  <svg
                    className="w-5 h-5 flex-shrink-0 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
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

        {/* Trilha de Aprendizado - Destaque Especial */}
        <div className="max-w-7xl mx-auto mb-4 sm:mb-6">
          <Link
            href="/pt/wellness/cursos"
            className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.01] group relative"
          >
            <div className="p-5 sm:p-6 text-white relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="bg-white bg-opacity-20 rounded-full p-3 sm:p-4">
                    <span className="text-3xl sm:text-4xl">📚</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold mb-1">
                      Trilha de Aprendizado
                    </h2>
                    <p className="text-sm sm:text-base text-white text-opacity-90">
                      Aprenda tudo que precisa para ter sucesso no seu negócio
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm sm:text-base font-semibold hidden sm:inline">Acessar</span>
                  <svg
                    className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              {/* Efeito de brilho animado */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 group-hover:translate-x-full transition-all duration-1000"></div>
            </div>
          </Link>
        </div>

        {/* Notificações/Lembretes - Compacto */}
        <div className="max-w-7xl mx-auto">
          <WellnessNotificacoes />
        </div>
      </main>

      {/* Chat Widget Flutuante - Mentor como padrão no System */}
      <WellnessChatWidget chatbotId="mentor" />
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

