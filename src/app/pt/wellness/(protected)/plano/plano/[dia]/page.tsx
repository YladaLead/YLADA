'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
// REMOVIDO: ProtectedRoute e RequireSubscription - layout server-side cuida disso
import WellnessNavBar from '@/components/wellness/WellnessNavBar'

interface PlanoDia {
  dia: number
  titulo: string
  foco: string
  microtarefas: string[]
  scripts_sugeridos: string[]
  mensagem_noel: string
  fase: number
}

// Layout server-side já valida autenticação, perfil e assinatura
export default function PlanoDiaPage() {
  return <PlanoDiaContent />
}

function PlanoDiaContent() {
  const router = useRouter()
  const params = useParams()
  const diaParam = params?.dia as string
  const diaNumero = parseInt(diaParam || '1')

  const [planoDia, setPlanoDia] = useState<PlanoDia | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!diaParam) return

    const carregarPlanoDia = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`/api/wellness/plano/dia/${diaNumero}`, {
          credentials: 'include'
        })

        if (!response.ok) {
          throw new Error('Erro ao carregar plano do dia')
        }

        const data = await response.json()
        if (data.success && data.data) {
          setPlanoDia(data.data)
        } else {
          throw new Error('Dados do plano não encontrados')
        }
      } catch (err: any) {
        console.error('Erro ao carregar plano do dia:', err)
        setError(err.message || 'Erro ao carregar plano do dia')
      } finally {
        setLoading(false)
      }
    }

    carregarPlanoDia()
  }, [diaNumero, diaParam])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Plano do Dia" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando tarefas do dia...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !planoDia) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Plano do Dia" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <p className="text-red-800">{error || 'Plano do dia não encontrado'}</p>
            <button
              onClick={() => router.push('/pt/wellness/home')}
              className="mt-4 text-red-600 hover:text-red-700 font-medium"
            >
              ← Voltar para Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  const faseNome = planoDia.fase === 1 ? 'Fundamentos' :
                   planoDia.fase === 2 ? 'Ritmo' :
                   planoDia.fase === 3 ? 'Consistência' :
                   'Liderança'

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <WellnessNavBar showTitle={true} title="Plano do Dia" />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header do Dia */}
        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold">
                  {planoDia.dia}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{planoDia.titulo}</h1>
                  <p className="text-sm text-gray-500">Fase {planoDia.fase}: {faseNome} • Dia {planoDia.dia} / 90</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/pt/wellness/home')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              ← Voltar
            </button>
          </div>
        </div>

        {/* Foco do Dia */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 sm:p-6 border border-green-200 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <span>🎯</span>
            <span>Foco do Dia</span>
          </h2>
          <p className="text-gray-700">{planoDia.foco}</p>
        </div>

        {/* Tarefas do Dia */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span>✅</span>
            <span>Ações Objetivas do Dia</span>
          </h2>
          <ul className="space-y-3">
            {planoDia.microtarefas.map((tarefa, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="bg-green-100 text-green-700 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-gray-700 flex-1 pt-0.5">{tarefa}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Mensagem do NOEL */}
        {planoDia.mensagem_noel && (
          <div className="bg-blue-50 rounded-xl p-5 sm:p-6 border border-blue-200 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <span>🤖</span>
              <span>Mensagem do NOEL</span>
            </h2>
            <p className="text-gray-700 italic">"{planoDia.mensagem_noel}"</p>
          </div>
        )}

        {/* Botão para falar com NOEL */}
        <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600 mb-4">
            Precisa de ajuda para executar essas tarefas?
          </p>
          <button
            onClick={() => router.push('/pt/wellness/noel')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            Falar com o NOEL
          </button>
        </div>
      </main>
    </div>
  )
}
