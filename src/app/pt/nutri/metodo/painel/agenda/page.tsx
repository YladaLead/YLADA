'use client'

import { useState } from 'react'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'

export default function AgendaEstrategicaPage() {
  const [horariosAtendimento, setHorariosAtendimento] = useState('')
  const [horariosCaptacao, setHorariosCaptacao] = useState('')
  const [rotinaMinima, setRotinaMinima] = useState('')
  const [salvando, setSalvando] = useState(false)

  const salvarAgenda = async () => {
    try {
      setSalvando(true)
      // TODO: Implementar salvamento no Supabase
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Agenda salva com sucesso!')
    } catch (error) {
      console.error('Erro ao salvar agenda:', error)
      alert('Erro ao salvar agenda')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/pt/nutri/metodo/jornada"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← Voltar para Jornada
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📅 Agenda Estratégica YLADA
          </h1>
          <p className="text-gray-600">
            Configure seus horários fixos de atendimento, captação e rotina mínima
          </p>
        </div>

        {/* Formulário de Agenda */}
        <div className="space-y-6">
          {/* Horários de Atendimento */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">🕐 Horários Fixos de Atendimento</h3>
            <textarea
              value={horariosAtendimento}
              onChange={(e) => setHorariosAtendimento(e.target.value)}
              placeholder="Ex: Segunda a Sexta, 9h às 12h e 14h às 18h"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
            />
            <p className="text-sm text-gray-500 mt-2">
              Defina os horários fixos em que você estará disponível para atendimentos
            </p>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-gray-700">
                <strong>💡 Dica:</strong> Seja específico! Ex: "Segunda e Quarta, 14h-17h" é melhor que "alguns dias da semana"
              </p>
            </div>
          </div>

          {/* Horários de Captação */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">📢 Horários de Captação</h3>
            <textarea
              value={horariosCaptacao}
              onChange={(e) => setHorariosCaptacao(e.target.value)}
              placeholder="Ex: Todos os dias, 8h às 9h (distribuição de ferramentas)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
            />
            <p className="text-sm text-gray-500 mt-2">
              Defina os horários dedicados à captação e distribuição de ferramentas
            </p>
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-gray-700">
                <strong>💡 Dica:</strong> Captação não precisa ser longa! 15-30 minutos por dia já faz diferença. Ex: "Todo dia, 8h-8h30 (postar ferramenta nas redes)"
              </p>
            </div>
          </div>

          {/* Rotina Mínima */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-4">⚡ Rotina Mínima Semanal</h3>
            <textarea
              value={rotinaMinima}
              onChange={(e) => setRotinaMinima(e.target.value)}
              placeholder="Ex: Segunda - Revisar leads, Terça - Distribuir ferramenta, Quarta - Acompanhamento..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={6}
            />
            <p className="text-sm text-gray-500 mt-2">
              Defina sua rotina mínima semanal para manter consistência
            </p>
            
            {/* Dicas Educacionais */}
            <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <span>📚</span> Dicas para sua Rotina Mínima
              </h4>
              <ul className="text-xs text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span><strong>Seja realista:</strong> Defina apenas o que você consegue fazer consistentemente, não o ideal</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span><strong>Comece pequeno:</strong> É melhor fazer pouco todo dia do que muito uma vez</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span><strong>3 blocos essenciais:</strong> Um momento para atrair, um para atender, um para organizar</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span><strong>Revise semanalmente:</strong> Ajuste sua rotina conforme sua realidade muda</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span><strong>Use o checklist diário:</strong> Marque suas tarefas no Painel Diário para manter consistência</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
            <button
              onClick={salvarAgenda}
              disabled={salvando}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {salvando ? 'Salvando...' : 'Salvar Agenda Estratégica'}
            </button>
          </div>
        </div>

        {/* Navegação */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-md border border-gray-200">
          <div className="flex flex-wrap gap-3 justify-between items-center">
            <Link
              href="/pt/nutri/metodo/jornada"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              ← Voltar para Jornada
            </Link>
            <Link
              href="/pt/nutri/metodo/painel/diario"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ver Painel Diário →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

