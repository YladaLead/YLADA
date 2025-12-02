'use client'

import { useState } from 'react'
import ExercicioLayout from '@/components/formacao/ExercicioLayout'
import ExercicioChecklist from '@/components/formacao/ExercicioChecklist'
import ExercicioCampoTexto from '@/components/formacao/ExercicioCampoTexto'

export default function Distribuicao101010Page() {
  const exercicioId = 'distribuicao-101010'
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
      title="📤 Exercício — Distribuição 10–10–10"
      subtitle="O método YLADA para aumentar seu alcance diário."
    >
      {/* Explicação */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
        <p className="text-gray-700 leading-relaxed">
          A distribuição cria movimento e atrai oportunidades. A fórmula é simples e duplicável:
          <strong> 10 mensagens, 10 grupos, 10 perfis novos.</strong>
        </p>
      </div>

      {/* Passos */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-4">Passos</h3>
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="font-semibold text-gray-900 mb-2">1. 10 mensagens diretas para contatos estratégicos</p>
            <p className="text-gray-700 text-sm">
              Escolha 10 pessoas que podem se beneficiar da sua ferramenta e envie mensagens personalizadas.
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-gray-900 mb-2">2. 10 grupos onde a Nutri pode compartilhar conteúdo</p>
            <p className="text-gray-700 text-sm">
              Identifique 10 grupos (WhatsApp, Facebook, Telegram) onde você pode compartilhar sua ferramenta.
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <p className="font-semibold text-gray-900 mb-2">3. 10 perfis novos para interagir</p>
            <p className="text-gray-700 text-sm">
              Encontre 10 perfis novos no Instagram ou outras redes para seguir, comentar e interagir.
            </p>
          </div>
        </div>
      </div>

      {/* Campos de Lista */}
      <div className="space-y-6 mb-6">
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="contatos-estrategicos"
          label="Liste os 10 contatos estratégicos"
          placeholder="1. Nome - Motivo...&#10;2. Nome - Motivo...&#10;..."
          rows={6}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="grupos"
          label="Liste os 10 grupos"
          placeholder="1. Nome do grupo - Plataforma...&#10;2. Nome do grupo - Plataforma...&#10;..."
          rows={6}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="perfis-novos"
          label="Liste os 10 perfis novos"
          placeholder="1. @perfil - Motivo...&#10;2. @perfil - Motivo...&#10;..."
          rows={6}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="resultados"
          label="Registre os resultados"
          placeholder="Anote aqui os resultados obtidos com a distribuição..."
          rows={4}
        />
      </div>

      {/* Checklist */}
      <ExercicioChecklist
        exercicioId={exercicioId}
        items={[
          'Liste os 10 contatos estratégicos',
          'Liste os 10 grupos',
          'Liste os 10 perfis novos',
          'Registre os resultados'
        ]}
      />

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

