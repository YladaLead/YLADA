'use client'

import { useState } from 'react'
import ExercicioLayout from '@/components/formacao/ExercicioLayout'
import ExercicioChecklist from '@/components/formacao/ExercicioChecklist'

export default function ChecklistCrescimentoPage() {
  const exercicioId = 'checklist-crescimento'
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
        alert('Checklist concluído com sucesso!')
      }
    } catch (error) {
      console.error('Erro ao concluir exercício:', error)
    } finally {
      setConcluindo(false)
    }
  }

  return (
    <ExercicioLayout
      title="✅ Exercício — Checklist Geral de Crescimento YLADA"
      subtitle="Conferindo se toda sua base está pronta."
    >
      {/* Explicação */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
        <p className="text-gray-700 leading-relaxed">
          Hoje você verifica se sua base está pronta para crescer continuamente.
        </p>
      </div>

      {/* Checklist */}
      <ExercicioChecklist
        exercicioId={exercicioId}
        items={[
          'GSAL estruturado',
          'Agenda definida',
          'Ferramentas de captação prontas',
          'Rotina mínima funcionando',
          'Padrão de atendimento definido'
        ]}
      />

      {/* Mensagem */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
        <p className="text-gray-800 italic">
          "Crescimento é preparado — nunca improvisado."
        </p>
      </div>

      {/* Botão Concluir */}
      <div className="mt-6 bg-white rounded-xl p-6 shadow-md border border-gray-200">
        <button
          onClick={concluirExercicio}
          disabled={concluindo}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {concluindo ? 'Concluindo...' : '✓ Concluir Checklist'}
        </button>
      </div>
    </ExercicioLayout>
  )
}

