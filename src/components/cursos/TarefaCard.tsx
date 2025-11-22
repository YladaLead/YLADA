'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface Tarefa {
  id: string
  descricao: string
  obrigatoria: boolean
  ordem: number
  completed?: boolean
  resposta?: string | null
}

interface TarefaCardProps {
  tarefa: Tarefa
  onCompleted?: () => void
}

export default function TarefaCard({ tarefa, onCompleted }: TarefaCardProps) {
  const { user } = useAuth()
  const [completed, setCompleted] = useState(tarefa.completed || false)
  const [resposta, setResposta] = useState(tarefa.resposta || '')
  const [loading, setLoading] = useState(false)

  const handleMarkCompleted = async () => {
    if (!user) return

    setLoading(true)

    try {
      const response = await fetch('/api/nutri/cursos/tarefas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tarefa_id: tarefa.id,
          completed: !completed,
          resposta: resposta || null,
        }),
        credentials: 'include',
      })

      if (response.ok) {
        setCompleted(!completed)
        if (onCompleted) {
          onCompleted()
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className={`rounded-lg border-2 p-4 ${
        completed
          ? 'bg-green-50 border-green-200'
          : tarefa.obrigatoria
          ? 'bg-orange-50 border-orange-200'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-semibold text-gray-900">{tarefa.descricao}</h4>
            {tarefa.obrigatoria && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                Obrigatória
              </span>
            )}
          </div>
        </div>
        {completed && (
          <span className="text-green-600 font-semibold">✅ Concluída</span>
        )}
      </div>

      {/* Campo de resposta (opcional) */}
      {!completed && (
        <div className="mb-3">
          <textarea
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            placeholder="Digite sua resposta aqui (opcional)..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      )}

      {/* Resposta salva */}
      {completed && resposta && (
        <div className="mb-3 p-3 bg-white rounded border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Sua resposta:</p>
          <p className="text-gray-900">{resposta}</p>
        </div>
      )}

      {/* Botão */}
      <button
        onClick={handleMarkCompleted}
        disabled={loading}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          completed
            ? 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading
          ? 'Salvando...'
          : completed
          ? 'Desmarcar como Concluída'
          : 'Marcar como Concluída'}
      </button>
    </div>
  )
}

