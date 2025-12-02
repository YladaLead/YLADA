'use client'

import { useState } from 'react'
import ExercicioLayout from '@/components/formacao/ExercicioLayout'
import ExercicioCampoTexto from '@/components/formacao/ExercicioCampoTexto'

export default function GSALAcompanharPage() {
  const exercicioId = 'gsal-acompanhar'
  const [concluindo, setConcluindo] = useState(false)

  const concluirExercicio = async () => {
    try {
      setConcluindo(true)
      const res = await fetch('/api/nutri/metodo/exercicios/concluir', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ exercicio_id: exercicioId })
      })

      if (res.ok) {
        alert('Exercício concluído com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao concluir exercício:', error)
    } finally {
      setConcluindo(false)
    }
  }

  return (
    <ExercicioLayout
      title="📞 Exercício — A de Acompanhar"
      subtitle="Acompanhamento inteligente que converte."
    >
      {/* Conteúdo */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-gray-900 mb-2">Revisar contatos dos últimos 7 dias</p>
            <p className="text-gray-700 text-sm">
              Revise todas as pessoas que entraram em contato ou demonstraram interesse na última semana.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="font-semibold text-gray-900 mb-2">Enviar mensagens de acompanhamento</p>
            <p className="text-gray-700 text-sm">
              Envie mensagens leves e estratégicas para pessoas que ainda não responderam ou precisam de retorno.
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <p className="font-semibold text-gray-900 mb-2">Registrar quem respondeu</p>
            <p className="text-gray-700 text-sm">
              Anote quem respondeu, quem avançou e quem precisa de mais tempo.
            </p>
          </div>
        </div>
      </div>

      {/* Campos */}
      <div className="space-y-6 mb-6">
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="contatos-revisados"
          label="Contatos dos últimos 7 dias revisados"
          placeholder="Liste aqui os contatos que você revisou..."
          rows={6}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="mensagens-enviadas"
          label="Mensagens de acompanhamento enviadas"
          placeholder="Anote aqui as mensagens que você enviou e para quem..."
          rows={6}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="quem-respondeu"
          label="Registrar quem respondeu"
          placeholder="Anote aqui quem respondeu, quem avançou e quem precisa de mais tempo..."
          rows={6}
        />
      </div>

      {/* Mensagem */}
      <div className="mt-6 bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
        <p className="text-gray-800 italic">
          "Acompanhamento é profissionalismo, não insistência."
        </p>
      </div>

      {/* Botão Concluir */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <button
          onClick={concluirExercicio}
          disabled={concluindo}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {concluindo ? 'Concluindo...' : '✓ Concluir Exercício'}
        </button>
      </div>
    </ExercicioLayout>
  )
}

