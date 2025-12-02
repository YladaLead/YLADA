'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ExercicioLayout from '@/components/formacao/ExercicioLayout'
import ExercicioChecklist from '@/components/formacao/ExercicioChecklist'
import ExercicioCampoTexto from '@/components/formacao/ExercicioCampoTexto'
import { useAuth } from '@/hooks/useAuth'

export default function RitualFinalPage() {
  const { user } = useAuth()
  const router = useRouter()
  const exercicioId = 'ritual-final'
  const [salvando, setSalvando] = useState(false)
  const [concluindo, setConcluindo] = useState(false)

  useEffect(() => {
    // Verificar se o Dia 29 foi concluído
    const verificarDia29 = async () => {
      try {
        const res = await fetch('/api/nutri/metodo/jornada/dia/29', {
          credentials: 'include'
        })
        if (res.ok) {
          const data = await res.json()
          if (!data.data?.progress?.completed) {
            router.push('/pt/nutri/metodo/jornada/dia/29')
          }
        }
      } catch (error) {
        console.error('Erro ao verificar Dia 29:', error)
      }
    }
    verificarDia29()
  }, [router])

  const concluirJornada = async () => {
    if (!user) return

    try {
      setConcluindo(true)
      
      // Salvar ritual final primeiro
      const resRitual = await fetch('/api/nutri/metodo/jornada/ritual-final', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          maior_aprendizado: '', // Será salvo pelos campos ExercicioCampoTexto
          mudanca_interna: '',
          novo_posicionamento: ''
        })
      })

      // Concluir exercício
      await fetch('/api/nutri/metodo/exercicios/concluir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ exercicio_id: exercicioId })
      })
      
      // Concluir Dia 30
      const res = await fetch('/api/nutri/metodo/jornada/dia/30/concluir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          checklist_completed: []
        })
      })

      if (!res.ok) {
        throw new Error('Erro ao concluir jornada')
      }

      // Redirecionar para página de conclusão
      router.push('/pt/nutri/metodo/jornada/concluida')
    } catch (error) {
      console.error('Erro ao concluir jornada:', error)
      alert('Erro ao concluir jornada')
    } finally {
      setConcluindo(false)
    }
  }

  return (
    <ExercicioLayout
      title="🎉 Exercício — Ritual Final da Jornada"
      subtitle="Conclusão oficial da identidade YLADA."
    >
      {/* Header Especial */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 mb-6 text-white text-center shadow-lg">
        <div className="text-6xl mb-4">🎉</div>
        <p className="text-lg opacity-90">
          Hoje, você não conclui um método. Você se torna YLADA.
        </p>
      </div>

      {/* Conteúdo */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-gray-900 mb-2">Revisar sua transformação</p>
            <p className="text-gray-700 text-sm">
              Olhe para trás e veja como você evoluiu durante os 30 dias.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="font-semibold text-gray-900 mb-2">Registrar insights finais</p>
            <p className="text-gray-700 text-sm">
              Anote os aprendizados mais importantes que você teve.
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <p className="font-semibold text-gray-900 mb-2">Declarar seu novo posicionamento</p>
            <p className="text-gray-700 text-sm">
              Defina como você quer ser vista e como você se posiciona agora.
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-gray-900 mb-2">Confirmar conclusão da Jornada</p>
            <p className="text-gray-700 text-sm">
              Finalize oficialmente sua jornada de 30 dias.
            </p>
          </div>
        </div>
      </div>

      {/* Campos */}
      <div className="space-y-6 mb-6">
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="maior-aprendizado"
          label="💡 Revisar aprendizados"
          placeholder="Qual foi o maior aprendizado que você teve durante esta jornada?"
          rows={6}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="mudanca-interna"
          label="🦋 Escrever mudança interna"
          placeholder="Como você mudou por dentro durante esta jornada?"
          rows={6}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="novo-posicionamento"
          label="🎯 Registrar novo posicionamento"
          placeholder="Qual é o seu novo posicionamento profissional após esta jornada?"
          rows={6}
        />
      </div>

      {/* Checklist */}
      <ExercicioChecklist
        exercicioId={exercicioId}
        items={[
          'Revisar aprendizados',
          'Escrever mudança interna',
          'Registrar novo posicionamento',
          'Concluir Jornada'
        ]}
      />

      {/* Botão Concluir */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <button
          onClick={concluirJornada}
          disabled={concluindo}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-colors font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {concluindo ? 'Concluindo Jornada...' : '🎉 Concluir Jornada YLADA'}
        </button>
      </div>

      {/* Mensagem Final */}
      <div className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border-l-4 border-amber-400">
        <p className="text-lg text-gray-800 italic text-center">
          "Hoje, você não conclui um método. Você se torna YLADA."
        </p>
      </div>
    </ExercicioLayout>
  )
}

