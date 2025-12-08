'use client'

import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'

const fundamentos = [
  {
    numero: 1,
    titulo: 'Consistência sobre Intensidade',
    descricao: 'Pequenas ações diárias valem mais que grandes ações esporádicas. O 2-5-10 diário é mais poderoso que 20-50-100 uma vez por semana.',
    exemplo: 'Fazer 2 convites todos os dias é melhor que fazer 20 convites uma vez por semana.'
  },
  {
    numero: 2,
    titulo: 'Duplicação é o Caminho',
    descricao: 'O verdadeiro crescimento vem de duplicar, não apenas de vender. Construir equipe é construir legado.',
    exemplo: 'Um distribuidor que forma 5 distribuidores ativos tem mais impacto que um que vende sozinho.'
  },
  {
    numero: 3,
    titulo: 'Autenticidade Gera Conexão',
    descricao: 'Seja você mesmo. As pessoas compram de pessoas, não de robôs. Compartilhe sua experiência real.',
    exemplo: 'Falar sobre seus próprios resultados é mais poderoso que apenas listar benefícios dos produtos.'
  },
  {
    numero: 4,
    titulo: 'Valor Antes de Venda',
    descricao: 'Ofereça valor primeiro. Ajude, eduque, inspire. A venda vem naturalmente quando você ajuda de verdade.',
    exemplo: 'Compartilhar dicas de bem-estar antes de oferecer produtos cria confiança e interesse genuíno.'
  },
  {
    numero: 5,
    titulo: 'Sistema sobre Talento',
    descricao: 'Um sistema simples seguido com consistência supera talento sem método. O 2-5-10 é o sistema.',
    exemplo: 'Seguir o fluxo de convite leve todos os dias é mais eficaz que tentar criar mensagens novas a cada vez.'
  },
  {
    numero: 6,
    titulo: 'Paciência e Persistência',
    descricao: 'Resultados levam tempo. Construir um negócio é maratona, não sprint. Continue mesmo quando não ver resultados imediatos.',
    exemplo: 'Fazer 2 convites por dia durante 30 dias (60 convites) gera mais resultados que 60 convites em um dia.'
  },
  {
    numero: 7,
    titulo: 'Aprendizado Contínuo',
    descricao: 'Sempre há algo novo para aprender. Use os materiais, participe dos treinamentos, aprenda com líderes.',
    exemplo: 'Ler uma cartilha por semana e aplicar o que aprendeu acelera seu crescimento exponencialmente.'
  },
  {
    numero: 8,
    titulo: 'Comunidade e Suporte',
    descricao: 'Você não está sozinho. Use os grupos, peça ajuda, compartilhe desafios. Juntos somos mais fortes.',
    exemplo: 'Participar ativamente dos grupos de treinamento e pedir ajuda quando precisa acelera seu aprendizado.'
  },
  {
    numero: 9,
    titulo: 'Foco no Cliente',
    descricao: 'O cliente em primeiro lugar. Quando você ajuda pessoas a alcançarem seus objetivos, seu negócio cresce naturalmente.',
    exemplo: 'Acompanhar clientes e garantir resultados deles gera indicações e recompras automáticas.'
  },
  {
    numero: 10,
    titulo: 'Mentalidade de Líder',
    descricao: 'Pense como líder desde o início. Você não está apenas vendendo, está construindo um negócio e formando uma equipe.',
    exemplo: 'Treinar novos distribuidores e ajudá-los a ter sucesso é o caminho para se tornar líder.'
  }
]

export default function TreinoFilosofiaPage() {
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
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">✨ Filosofia YLADA — Mentalidade</h1>
                <p className="text-lg text-gray-600">
                  Os 10 fundamentos comportamentais para alta performance e duplicação
                </p>
              </div>

              {/* Introdução */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200 shadow-sm mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">🧠 A Mentalidade que Transforma</h2>
                <p className="text-gray-700">
                  A Filosofia YLADA não é sobre técnicas ou estratégias. É sobre a mentalidade que transforma 
                  distribuidores em líderes e ações em resultados duradouros. Estes 10 fundamentos são a base 
                  de todo sucesso no negócio.
                </p>
              </div>

              {/* Fundamentos */}
              <div className="space-y-4 mb-8">
                {fundamentos.map((fundamento) => (
                  <div
                    key={fundamento.numero}
                    className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                          {fundamento.numero}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{fundamento.titulo}</h3>
                        <p className="text-gray-700 mb-3">{fundamento.descricao}</p>
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Exemplo:</span> {fundamento.exemplo}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Aplicação Prática */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">🎯 Como Aplicar na Prática</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <p className="text-gray-700">
                      <strong>Comece com 1 fundamento por semana:</strong> Escolha um fundamento e foque nele durante a semana inteira.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <p className="text-gray-700">
                      <strong>Reflita diariamente:</strong> No final do dia, pergunte-se: "Como apliquei este fundamento hoje?"
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <p className="text-gray-700">
                      <strong>Compartilhe com sua equipe:</strong> Ensine os fundamentos para seus novos distribuidores.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <p className="text-gray-700">
                      <strong>Use o NOEL:</strong> Peça ao NOEL para te ajudar a aplicar qualquer fundamento em situações específicas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão NOEL */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200 text-center">
                <p className="text-gray-700 mb-4">
                  Quer ajuda para aplicar a Filosofia YLADA na sua rotina?
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
