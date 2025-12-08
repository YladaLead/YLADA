'use client'

import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'

const topicosLideranca = [
  {
    titulo: 'Como Conduzir Reuniões',
    descricao: 'Estrutura e técnicas para conduzir reuniões eficazes com sua equipe',
    link: '/pt/wellness/fluxos/treino-novos'
  },
  {
    titulo: 'Como Treinar Equipe',
    descricao: 'Métodos para treinar novos distribuidores e desenvolver sua equipe',
    link: '/pt/wellness/fluxos/treino-novos'
  },
  {
    titulo: 'Como Fazer Acompanhamento',
    descricao: 'Sistemas de acompanhamento para garantir que sua equipe está progredindo',
    link: '/pt/wellness/fluxos/acompanhamento'
  },
  {
    titulo: 'Como Recrutar com Profissionalismo',
    descricao: 'Processo completo de recrutamento profissional e duplicável',
    link: '/pt/wellness/fluxos/recrutamento'
  },
  {
    titulo: 'Como Apresentar o Wellness System',
    descricao: 'Como apresentar o sistema para novos distribuidores e líderes',
    link: '/pt/wellness/biblioteca'
  }
]

export default function TreinoLiderancaPage() {
  const router = useRouter()

  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <button
                  onClick={() => router.push('/pt/wellness/treinos')}
                  className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 text-sm"
                >
                  ← Voltar para Treinos
                </button>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">👑 Treinamento de Liderança</h1>
                <p className="text-lg text-gray-600">
                  Guias e fluxos para formar líderes, conduzir reuniões e duplicar com profissionalismo
                </p>
              </div>

              {/* Introdução */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200 shadow-sm mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">🎯 O Papel do Líder</h2>
                <p className="text-gray-700 mb-3">
                  Liderança não é sobre ter mais vendas, é sobre formar pessoas. Um líder verdadeiro:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Treina e desenvolve sua equipe</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Duplica conhecimento e processos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Cria sistemas que funcionam sem ele</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 mt-0.5">•</span>
                    <span>Foca em crescimento da equipe, não só próprio</span>
                  </li>
                </ul>
              </div>

              {/* Tópicos de Liderança */}
              <div className="space-y-4 mb-8">
                {topicosLideranca.map((topico, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(topico.link)}
                    className="w-full bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl flex-shrink-0">{index === 0 ? '📋' : index === 1 ? '🎓' : index === 2 ? '👥' : index === 3 ? '🎯' : '📚'}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{topico.titulo}</h3>
                        <p className="text-sm text-gray-600 mb-3">{topico.descricao}</p>
                        <span className="text-green-600 text-sm font-medium">Ver conteúdo →</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Princípios de Liderança */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">💎 Princípios Fundamentais</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">1. Liderar pelo Exemplo</h4>
                    <p className="text-sm text-gray-600">
                      Faça você mesmo o que pede para sua equipe fazer. Se você quer que façam 2-5-10, faça também.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">2. Investir em Pessoas</h4>
                    <p className="text-sm text-gray-600">
                      O tempo que você investe treinando sua equipe retorna multiplicado em resultados.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">3. Criar Sistemas</h4>
                    <p className="text-sm text-gray-600">
                      Desenvolva processos que funcionem mesmo quando você não está presente.
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">4. Celebrar Sucessos</h4>
                    <p className="text-sm text-gray-600">
                      Reconheça e celebre cada vitória da sua equipe, por menor que seja.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão NOEL */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 text-center">
                <p className="text-gray-700 mb-4">
                  Precisa de ajuda para desenvolver suas habilidades de liderança?
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
