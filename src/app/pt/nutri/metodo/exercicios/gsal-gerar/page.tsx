'use client'

import { useState } from 'react'
import ExercicioLayout from '@/components/formacao/ExercicioLayout'
import ExercicioChecklist from '@/components/formacao/ExercicioChecklist'
import ExercicioCampoTexto from '@/components/formacao/ExercicioCampoTexto'

export default function GSALGerarPage() {
  const exercicioId = 'gsal-gerar'
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
      title="🚀 Exercício — G de Gerar"
      subtitle="Criando movimento todos os dias."
    >
      {/* Conteúdo */}
      <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <p className="font-semibold text-gray-900 mb-2">Escolher 1 ferramenta para gerar leads</p>
            <p className="text-gray-700 text-sm">
              Selecione uma ferramenta (quiz, calculadora, checklist) que você vai usar hoje para atrair novos leads.
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
            <p className="font-semibold text-gray-900 mb-2">Iniciar 5 conversas hoje</p>
            <p className="text-gray-700 text-sm">
              Comece 5 novas conversas com pessoas que demonstraram interesse ou que você quer alcançar.
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
            <p className="font-semibold text-gray-900 mb-2">Publicar 1 conteúdo de captação</p>
            <p className="text-gray-700 text-sm">
              Publique 1 conteúdo (story, post, vídeo) que direcione para sua ferramenta ou convide para conversa.
            </p>
          </div>
        </div>
      </div>

      {/* Campos */}
      <div className="space-y-6 mb-6">
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="ferramenta-escolhida"
          label="Ferramenta escolhida"
          placeholder="Qual ferramenta você escolheu para gerar leads hoje?"
          rows={3}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="conversas-iniciadas"
          label="5 conversas iniciadas"
          placeholder="Liste as 5 conversas que você iniciou hoje..."
          rows={5}
        />
        <ExercicioCampoTexto
          exercicioId={exercicioId}
          campoId="conteudo-publicado"
          label="1 conteúdo publicado"
          placeholder="Descreva o conteúdo que você publicou e onde..."
          rows={3}
        />
      </div>

      {/* Checklist */}
      <ExercicioChecklist
        exercicioId={exercicioId}
        items={[
          'Ferramenta escolhida',
          '5 conversas iniciadas',
          '1 conteúdo publicado'
        ]}
      />

      {/* Mensagem */}
      <div className="mt-6 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
        <p className="text-gray-800 italic">
          "Quem gera movimento, cria oportunidades."
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

