'use client'

import { useState } from 'react'
import ExercicioLayout from '@/components/formacao/ExercicioLayout'
import ExercicioCampoTexto from '@/components/formacao/ExercicioCampoTexto'

export default function AtendimentoPage() {
  const exercicioId = 'atendimento'
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
      title="💬 Exercício — Roteiro de Atendimento YLADA"
      subtitle="Atendimento leve, claro e orientado para resultado."
    >
      {/* 4 Etapas */}
      <div className="space-y-6 mb-6">
        <div className="bg-blue-50 rounded-xl p-6 shadow-md border-l-4 border-blue-500">
          <h3 className="font-bold text-gray-900 mb-4">1. Acolhimento</h3>
          <p className="text-gray-700 text-sm mb-4">
            Receba a pessoa com calor e interesse genuíno. Mostre que você está presente e disponível.
          </p>
          <ExercicioCampoTexto
            exercicioId={exercicioId}
            campoId="pergunta-acolhimento"
            label="Crie 1 pergunta poderosa para esta etapa"
            placeholder="Ex: Como você está se sentindo hoje em relação à sua alimentação?"
            rows={3}
          />
        </div>

        <div className="bg-purple-50 rounded-xl p-6 shadow-md border-l-4 border-purple-500">
          <h3 className="font-bold text-gray-900 mb-4">2. Entendimento Real</h3>
          <p className="text-gray-700 text-sm mb-4">
            Identifique a dor principal da pessoa. Use perguntas estratégicas para entender o que ela realmente precisa.
          </p>
          <ExercicioCampoTexto
            exercicioId={exercicioId}
            campoId="pergunta-entendimento"
            label="Crie 1 pergunta poderosa para esta etapa"
            placeholder="Ex: O que mais te incomoda na sua relação com a comida?"
            rows={3}
          />
        </div>

        <div className="bg-green-50 rounded-xl p-6 shadow-md border-l-4 border-green-500">
          <h3 className="font-bold text-gray-900 mb-4">3. Direcionamento</h3>
          <p className="text-gray-700 text-sm mb-4">
            Conduza sem pressionar. Use perguntas-poder para criar desejo genuíno pelo atendimento.
          </p>
          <ExercicioCampoTexto
            exercicioId={exercicioId}
            campoId="pergunta-direcionamento"
            label="Crie 1 pergunta poderosa para esta etapa"
            placeholder="Ex: O que seria diferente na sua vida se você tivesse mais energia?"
            rows={3}
          />
        </div>

        <div className="bg-amber-50 rounded-xl p-6 shadow-md border-l-4 border-amber-500">
          <h3 className="font-bold text-gray-900 mb-4">4. Encerramento Estratégico</h3>
          <p className="text-gray-700 text-sm mb-4">
            Feche a conversa criando expectativa positiva. Faça o convite natural quando o lead estiver pronto.
          </p>
          <ExercicioCampoTexto
            exercicioId={exercicioId}
            campoId="pergunta-encerramento"
            label="Crie 1 pergunta poderosa para esta etapa"
            placeholder="Ex: Que tal agendarmos uma conversa para eu entender melhor sua situação?"
            rows={3}
          />
        </div>

        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="roteiro-proprio"
          label="Crie seu roteiro próprio"
          placeholder="Escreva aqui seu roteiro completo de atendimento, usando as perguntas que você criou..."
          rows={8}
        />

        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="pos-atendimento"
          label="Registrar pós-atendimento"
          placeholder="Anote aqui o modelo de pós-atendimento que você vai usar (mensagem de cuidado, lembrete estratégico, etc.)..."
          rows={6}
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

