'use client'

import { useState } from 'react'
import ExercicioLayout from '@/components/formacao/ExercicioLayout'
import ExercicioCampoTexto from '@/components/formacao/ExercicioCampoTexto'

export default function ObjeçõesPage() {
  const exercicioId = 'objeções'
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
      title="💬 Exercício — Objeções Inteligentes"
      subtitle="Transformando objeções em conexão."
    >
      {/* Explicação */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
        <p className="text-gray-700 leading-relaxed">
          Objeções não são barreiras — são janelas de oportunidade.
        </p>
      </div>

      {/* Objeções Comuns */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">Objeções Mais Comuns</h3>
        <div className="space-y-4">
          <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
            <p className="font-semibold text-gray-900 mb-2">💰 Preço</p>
            <p className="text-gray-700 text-sm">
              "Está muito caro" / "Não tenho esse dinheiro agora"
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
            <p className="font-semibold text-gray-900 mb-2">⏰ Tempo</p>
            <p className="text-gray-700 text-sm">
              "Não tenho tempo" / "Minha rotina é muito corrida"
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="font-semibold text-gray-900 mb-2">❓ Dúvida no Método</p>
            <p className="text-gray-700 text-sm">
              "Será que funciona?" / "Não sei se é para mim"
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-gray-900 mb-2">😰 Insegurança</p>
            <p className="text-gray-700 text-sm">
              "Preciso pensar" / "Vou ver depois"
            </p>
          </div>
        </div>
      </div>

      {/* Campos */}
      <div className="space-y-6 mb-6">
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="respostas-curinga"
          label="Crie 3 respostas-curinga"
          placeholder="1. Para objeção de preço: ...&#10;2. Para objeção de tempo: ...&#10;3. Para objeção de dúvida: ..."
          rows={8}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="objeções-recebidas"
          label="Registre objeções recebidas hoje"
          placeholder="Anote aqui as objeções que você recebeu hoje e como respondeu..."
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

