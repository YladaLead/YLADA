'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'

function RecrutarPageContent() {
  const router = useRouter()

  const subitens = [
    { id: 'fluxos-recrutamento', titulo: 'Ver Fluxos de Recrutamento', rota: '/pt/wellness/system/recrutar/fluxos' },
    { id: 'scripts-recrutamento', titulo: 'Ver Scripts de Recrutamento', rota: '/pt/wellness/system/recrutar/scripts' },
    { id: 'enviar-link', titulo: 'Enviar Link de Apresentação', rota: '/pt/wellness/system/recrutar/enviar-link' },
    { id: 'objecoes-recrutamento', titulo: 'Objeções de Recrutamento', rota: '/pt/wellness/system/recrutar/objecoes' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar showTitle title="Recrutar Pessoas para o Negócio" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Voltar ao Sistema - Bem visível no topo */}
        <div className="mb-6">
          <Link
            href="/pt/wellness/system"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Voltar ao Sistema</span>
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4">
            <span className="text-4xl">👥</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            RECRUTAR PESSOAS PARA O NEGÓCIO
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ferramentas e recursos para identificar e recrutar pessoas interessadas no negócio
          </p>
        </div>

        {/* Lista de Subitens */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subitens.map((subitem) => (
              <Link
                key={subitem.id}
                href={subitem.rota}
                className="block p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium text-gray-800 group-hover:text-blue-700 flex-1">
                    {subitem.titulo}
                  </span>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all flex-shrink-0 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

export default function RecrutarPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <RecrutarPageContent />
      </RequireSubscription>
    </ProtectedRoute>
  )
}

