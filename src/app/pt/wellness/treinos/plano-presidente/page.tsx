'use client'

import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'

const fases = [
  {
    numero: 1,
    nome: 'Fundamentos',
    dias: 'Dias 1-22',
    objetivo: 'Construir base sólida de clientes e rotina diária',
    acoes: [
      'Executar 2-5-10 diariamente',
      'Construir lista de 50+ contatos',
      'Fazer primeiras vendas',
      'Aprender produtos básicos'
    ],
    meta: '10-20 clientes ativos'
  },
  {
    numero: 2,
    nome: 'Ritmo',
    dias: 'Dias 23-45',
    objetivo: 'Estabelecer ritmo consistente e aumentar volume',
    acoes: [
      'Manter 2-5-10 diário',
      'Aumentar follow-ups sistemáticos',
      'Começar a recrutar',
      'Desenvolver scripts próprios'
    ],
    meta: '20-30 clientes, 2-3 distribuidores'
  },
  {
    numero: 3,
    nome: 'Consistência',
    dias: 'Dias 46-68',
    objetivo: 'Consolidar processos e formar equipe',
    acoes: [
      'Treinar novos distribuidores',
      'Duplicar processos',
      'Aumentar ticket médio',
      'Criar sistema de acompanhamento'
    ],
    meta: '30-50 clientes, 5-10 distribuidores'
  },
  {
    numero: 4,
    nome: 'Liderança',
    dias: 'Dias 69-90',
    objetivo: 'Tornar-se líder e escalar o negócio',
    acoes: [
      'Formar líderes na equipe',
      'Criar sistemas duplicáveis',
      'Expandir geograficamente',
      'Desenvolver novos líderes'
    ],
    meta: '50+ clientes, 10+ distribuidores, 2+ líderes'
  }
]

export default function TreinoPlanoPresidentePage() {
  const router = useRouter()

  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-8">
                <button
                  onClick={() => router.push('/pt/wellness/treinos')}
                  className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 text-sm"
                  >
                  ← Voltar para Treinos
                </button>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">🏆 Plano Presidente</h1>
                <p className="text-lg text-gray-600">
                  A jornada profissional de 90 dias para transformar distribuidores em líderes
                </p>
              </div>

              {/* Introdução */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">🎯 O Que É o Plano Presidente?</h2>
                <p className="text-gray-700 mb-3">
                  O Plano Presidente é uma jornada estruturada de 90 dias dividida em 4 fases. 
                  Cada fase tem objetivos claros, ações específicas e metas mensuráveis.
                </p>
                <p className="text-gray-700">
                  <strong>O objetivo:</strong> Transformar você de distribuidor iniciante em líder capaz de 
                  duplicar conhecimento, formar equipe e escalar seu negócio.
                </p>
              </div>

              {/* Fases */}
              <div className="space-y-6 mb-8">
                {fases.map((fase) => (
                  <div
                    key={fase.numero}
                    className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-sm"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-2xl">
                          {fase.numero}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-2xl font-bold text-gray-900">{fase.nome}</h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {fase.dias}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4">{fase.objetivo}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <span>✅</span>
                              <span>Ações Principais</span>
                            </h4>
                            <ul className="space-y-1">
                              {fase.acoes.map((acao, index) => (
                                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                                  <span className="text-blue-600 mt-0.5">•</span>
                                  <span>{acao}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                              <span>🎯</span>
                              <span>Meta da Fase</span>
                            </h4>
                            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                              <p className="text-sm text-blue-900 font-medium">{fase.meta}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* O Que Fazer Todos os Dias */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">📅 O Que Fazer Todos os Dias</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 mt-0.5 font-bold">1.</span>
                    <div>
                      <p className="font-semibold text-gray-900">Executar o 2-5-10</p>
                      <p className="text-sm text-gray-600">2 convites, 5 follow-ups, 10 contatos novos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 mt-0.5 font-bold">2.</span>
                    <div>
                      <p className="font-semibold text-gray-900">Usar os produtos</p>
                      <p className="text-sm text-gray-600">Você é sua melhor prova social</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 mt-0.5 font-bold">3.</span>
                    <div>
                      <p className="font-semibold text-gray-900">Acompanhar clientes</p>
                      <p className="text-sm text-gray-600">Garantir resultados e gerar recompras</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 mt-0.5 font-bold">4.</span>
                    <div>
                      <p className="font-semibold text-gray-900">Estudar e aprender</p>
                      <p className="text-sm text-gray-600">15 minutos por dia lendo materiais ou assistindo vídeos</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* O Que Evitar */}
              <div className="bg-red-50 rounded-xl p-6 border border-red-200 shadow-sm mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">⚠️ O Que Evitar</h2>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <p className="text-gray-700">Pular dias do 2-5-10</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <p className="text-gray-700">Focar só em vender, sem recrutar</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <p className="text-gray-700">Não acompanhar clientes</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <p className="text-gray-700">Tentar fazer tudo sozinho</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-600">✗</span>
                    <p className="text-gray-700">Desistir quando não ver resultados imediatos</p>
                  </div>
                </div>
              </div>

              {/* Como Acelerar */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200 shadow-sm mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 Como Acelerar</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">1. Use o Sistema</h4>
                    <p className="text-sm text-gray-700">
                      Siga os fluxos, use os scripts, acesse a biblioteca. Não reinvente a roda.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">2. Peça Ajuda</h4>
                    <p className="text-sm text-gray-700">
                      Use o NOEL, participe dos grupos, peça ajuda ao seu líder. Você não está sozinho.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">3. Seja Consistente</h4>
                    <p className="text-sm text-gray-700">
                      Melhor fazer pouco todo dia que muito uma vez por semana.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">4. Duplique</h4>
                    <p className="text-sm text-gray-700">
                      Treine outros desde o início. Duplicação acelera tudo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => router.push('/pt/wellness/treinos/2-5-10')}
                  className="bg-white rounded-xl p-6 border-2 border-green-200 shadow-sm hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">⚡</span>
                    <h3 className="text-lg font-bold text-gray-900">Treino 2-5-10</h3>
                  </div>
                  <p className="text-sm text-gray-600">Comece aqui: o método diário de crescimento</p>
                </button>
                <button
                  onClick={() => router.push('/pt/wellness/fluxos')}
                  className="bg-white rounded-xl p-6 border-2 border-blue-200 shadow-sm hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-3xl">🔄</span>
                    <h3 className="text-lg font-bold text-gray-900">Fluxos & Ações</h3>
                  </div>
                  <p className="text-sm text-gray-600">Processos prontos para seguir</p>
                </button>
              </div>

              {/* Botão NOEL */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 text-center">
                <p className="text-gray-700 mb-4">
                  Precisa de ajuda para seguir o Plano Presidente?
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
