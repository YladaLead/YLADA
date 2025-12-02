'use client'

import { useState } from 'react'
import ExercicioLayout from '@/components/formacao/ExercicioLayout'
import ExercicioCampoTexto from '@/components/formacao/ExercicioCampoTexto'

export default function GSALServirPage() {
  const exercicioId = 'gsal-servir'
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
      title="🤝 Exercício — S de Servir"
      subtitle="Entregando valor de forma simples e leve."
    >
      {/* Conteúdo */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
        <div className="space-y-4">
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <p className="font-semibold text-gray-900 mb-2">Escolher 1 microconteúdo</p>
            <p className="text-gray-700 text-sm">
              Selecione um conteúdo curto e valioso (dica, receita, informação útil) que você vai compartilhar.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="font-semibold text-gray-900 mb-2">Enviar para 3 pessoas</p>
            <p className="text-gray-700 text-sm">
              Escolha 3 pessoas específicas que podem se beneficiar deste conteúdo e envie de forma personalizada.
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-gray-900 mb-2">Registrar retornos</p>
            <p className="text-gray-700 text-sm">
              Anote as respostas, agradecimentos e interações que você recebeu.
            </p>
          </div>
        </div>
      </div>

      {/* Campos */}
      <div className="space-y-6 mb-6">
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="microconteudo"
          label="Microconteúdo escolhido"
          placeholder="Descreva o microconteúdo que você escolheu..."
          rows={4}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="pessoas-enviadas"
          label="3 pessoas para quem você enviou"
          placeholder="1. Nome - Por que escolheu...&#10;2. Nome - Por que escolheu...&#10;3. Nome - Por que escolheu..."
          rows={5}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="retornos"
          label="Registrar retornos"
          placeholder="Anote aqui as respostas e interações que você recebeu..."
          rows={5}
        />
      </div>

      {/* Mensagem */}
      <div className="mt-6 bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
        <p className="text-gray-800 italic">
          "Quando você serve, você se torna inesquecível."
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

