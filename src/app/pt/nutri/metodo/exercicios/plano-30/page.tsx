'use client'

import { useState } from 'react'
import ExercicioLayout from '@/components/formacao/ExercicioLayout'
import ExercicioCampoTexto from '@/components/formacao/ExercicioCampoTexto'

export default function Plano30Page() {
  const exercicioId = 'plano-30'
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
        alert('Plano criado com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao concluir exercício:', error)
    } finally {
      setConcluindo(false)
    }
  }

  return (
    <ExercicioLayout
      title="📅 Exercício — Plano YLADA 30 Dias"
      subtitle="Seu novo ciclo começa aqui."
    >
      {/* Conteúdo */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="font-semibold text-gray-900 mb-2">Definir 3 metas principais</p>
            <p className="text-gray-700 text-sm">
              O que você quer alcançar nos próximos 30 dias? Seja específica e realista.
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-gray-900 mb-2">Escolher ações diárias</p>
            <p className="text-gray-700 text-sm">
              Quais são as ações que você vai fazer todos os dias para alcançar suas metas?
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <p className="font-semibold text-gray-900 mb-2">Organizar calendário</p>
            <p className="text-gray-700 text-sm">
              Organize sua semana: horários de captação, atendimento, GSAL e rotina mínima.
            </p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-gray-900 mb-2">Criar plano pessoal</p>
            <p className="text-gray-700 text-sm">
              Anote seu plano oficial para manter compromisso e clareza.
            </p>
          </div>
        </div>
      </div>

      {/* Campos */}
      <div className="space-y-6 mb-6">
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="metas-principais"
          label="Definir 3 metas principais"
          placeholder="1. Meta 1...&#10;2. Meta 2...&#10;3. Meta 3..."
          rows={6}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="acoes-diarias"
          label="Escolher ações diárias"
          placeholder="Liste as ações que você vai fazer todos os dias..."
          rows={6}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="calendario"
          label="Organizar calendário"
          placeholder="Segunda - ...&#10;Terça - ...&#10;Quarta - ...&#10;..."
          rows={8}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="plano-pessoal"
          label="Criar plano pessoal"
          placeholder="Anote aqui seu plano oficial completo para os próximos 30 dias..."
          rows={8}
        />
      </div>

      {/* Mensagem */}
      <div className="mt-6 bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
        <p className="text-gray-800 italic">
          "Planejamento cria liberdade."
        </p>
      </div>

      {/* Botão Concluir */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <button
          onClick={concluirExercicio}
          disabled={concluindo}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {concluindo ? 'Salvando...' : '✓ Salvar Plano'}
        </button>
      </div>
    </ExercicioLayout>
  )
}

