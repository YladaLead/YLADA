'use client'

import { useState } from 'react'
import ExercicioLayout from '@/components/formacao/ExercicioLayout'
import ExercicioCampoTexto from '@/components/formacao/ExercicioCampoTexto'

export default function GSALLucrarPage() {
  const exercicioId = 'gsal-lucrar'
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
      title="💰 Exercício — L de Lucrar"
      subtitle="Estruturando uma agenda que gera resultados."
    >
      {/* Conteúdo */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
        <div className="space-y-4">
          <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500">
            <p className="font-semibold text-gray-900 mb-2">Definir horários fixos de atendimento</p>
            <p className="text-gray-700 text-sm">
              Estabeleça horários fixos em que você estará disponível para atendimentos. Isso cria previsibilidade e organização.
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="font-semibold text-gray-900 mb-2">Criar agenda mínima semanal</p>
            <p className="text-gray-700 text-sm">
              Defina sua rotina mínima semanal: horários de captação, atendimento, GSAL e construção.
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <p className="font-semibold text-gray-900 mb-2">Registrar estrutura final</p>
            <p className="text-gray-700 text-sm">
              Anote sua estrutura oficial de agenda para manter compromisso e clareza.
            </p>
          </div>
        </div>
      </div>

      {/* Campos */}
      <div className="space-y-6 mb-6">
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="horarios-atendimento"
          label="Definir horários fixos de atendimento"
          placeholder="Ex: Segunda a Sexta, 9h às 12h e 14h às 18h"
          rows={4}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="agenda-minima"
          label="Criar agenda mínima semanal"
          placeholder="Segunda - Revisar leads, Terça - Distribuir ferramenta, Quarta - Acompanhamento..."
          rows={6}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="estrutura-final"
          label="Registrar estrutura final"
          placeholder="Anote aqui sua estrutura oficial de agenda..."
          rows={6}
        />
      </div>

      {/* Mensagem */}
      <div className="mt-6 bg-amber-50 rounded-lg p-4 border-l-4 border-amber-500">
        <p className="text-gray-800 italic">
          "Lucrar é consequência de estruturar."
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

