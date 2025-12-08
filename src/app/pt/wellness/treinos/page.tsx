'use client'

import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'

interface TreinoCard {
  id: string
  titulo: string
  descricao: string
  icone: string
  cor: string
  link: string
}

const treinos: TreinoCard[] = [
  {
    id: '2-5-10',
    titulo: 'Treino 2-5-10',
    descricao: 'Método diário interativo: 2 convites, 5 follow-ups, 10 contatos. A base da duplicação.',
    icone: '⚡',
    cor: 'green',
    link: '/pt/wellness/treinos/2-5-10'
  },
  {
    id: 'filosofia',
    titulo: 'Filosofia YLADA',
    descricao: 'Os 10 fundamentos comportamentais para alta performance e duplicação.',
    icone: '✨',
    cor: 'purple',
    link: '/pt/wellness/treinos/filosofia'
  },
  {
    id: 'lideranca',
    titulo: 'Treinamento de Liderança',
    descricao: 'Guias para formar líderes, conduzir reuniões e duplicar com profissionalismo.',
    icone: '👑',
    cor: 'yellow',
    link: '/pt/wellness/treinos/lideranca'
  },
  {
    id: 'plano-presidente',
    titulo: 'Plano Presidente',
    descricao: 'Jornada completa de 90 dias em 4 fases para transformar distribuidores em líderes.',
    icone: '🏆',
    cor: 'blue',
    link: '/pt/wellness/treinos/plano-presidente'
  }
]

const getCorClasses = (cor: string) => {
  const cores: Record<string, string> = {
    green: 'bg-green-50 border-green-200 hover:bg-green-100',
    purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    yellow: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
  }
  return cores[cor] || 'bg-gray-50 border-gray-200 hover:bg-gray-100'
}

export default function TreinosPage() {
  const router = useRouter()

  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">🎯 Treinos & Plano Presidente</h1>
                <p className="text-lg text-gray-600">
                  A parte educacional que transforma distribuidores em líderes
                </p>
              </div>

              {/* Grid de Treinos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {treinos.map((treino) => (
                  <button
                    key={treino.id}
                    onClick={() => router.push(treino.link)}
                    className={`${getCorClasses(treino.cor)} rounded-xl p-6 border-2 shadow-sm transition-all text-left group`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-5xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {treino.icone}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{treino.titulo}</h3>
                          <span className="text-gray-400 group-hover:text-gray-600 transition-colors">→</span>
                        </div>
                        <p className="text-sm text-gray-600">{treino.descricao}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Ajuda NOEL */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 text-center">
                <p className="text-gray-700 mb-4">
                  Precisa de ajuda para aplicar os treinos na prática?
                </p>
                <button
                  onClick={() => router.push('/pt/wellness/noel')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
                >
                  Falar com o NOEL →
                </button>
              </div>
            </div>
          </div>
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}
