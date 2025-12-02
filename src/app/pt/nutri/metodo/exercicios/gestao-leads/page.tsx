'use client'

import { useState } from 'react'
import ExercicioLayout from '@/components/formacao/ExercicioLayout'
import ExercicioCampoTexto from '@/components/formacao/ExercicioCampoTexto'

export default function GestaoLeadsPage() {
  const exercicioId = 'gestao-leads'
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
      title="📋 Exercício — Gestão de Leads YLADA"
      subtitle="Organizar para converter mais."
    >
      {/* Explicação */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
        <p className="text-gray-700 leading-relaxed">
          Leads quentes devem ser atendidos primeiro. Organização aumenta conversão.
        </p>
      </div>

      {/* Módulos */}
      <div className="space-y-6 mb-6">
        <div className="bg-red-50 rounded-xl p-6 shadow-md border-l-4 border-red-500">
          <h3 className="font-bold text-gray-900 mb-4">🔥 Lista de Leads Quentes</h3>
          <p className="text-sm text-gray-600 mb-4">
            Pessoas que demonstraram interesse imediato, responderam rapidamente e estão prontas para agendar
          </p>
          <ExercicioCampoTexto
            exercicioId={exercicioId}
            campoId="leads-quentes"
            label=""
            placeholder="Nome - Contato - Data do contato - Próxima ação..."
            rows={6}
          />
        </div>

        <div className="bg-yellow-50 rounded-xl p-6 shadow-md border-l-4 border-yellow-500">
          <h3 className="font-bold text-gray-900 mb-4">🌡️ Lista de Leads Mornos</h3>
          <p className="text-sm text-gray-600 mb-4">
            Pessoas que demonstraram interesse mas precisam de mais informações ou tempo para decidir
          </p>
          <ExercicioCampoTexto
            exercicioId={exercicioId}
            campoId="leads-mornos"
            label=""
            placeholder="Nome - Contato - Data do contato - Próxima ação..."
            rows={6}
          />
        </div>

        <div className="bg-blue-50 rounded-xl p-6 shadow-md border-l-4 border-blue-500">
          <h3 className="font-bold text-gray-900 mb-4">❄️ Lista de Leads Frios</h3>
          <p className="text-sm text-gray-600 mb-4">
            Pessoas que ainda não demonstraram interesse claro, mas podem ser aquecidas com acompanhamento estratégico
          </p>
          <ExercicioCampoTexto
            exercicioId={exercicioId}
            campoId="leads-frios"
            label=""
            placeholder="Nome - Contato - Data do contato - Próxima ação..."
            rows={6}
          />
        </div>

        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="prioridade"
          label="Campo para registrar prioridade"
          placeholder="Anote aqui quais leads devem ser priorizados hoje e por quê..."
          rows={4}
        />
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

