'use client'

import { useState } from 'react'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { followUpTemplates, FollowUpTemplate } from '@/lib/wellness-system/follow-up'

const momentosInfo: Record<FollowUpTemplate['momento'], { nome: string; emoji: string }> = {
  'pos-link': { nome: 'Pós-Link', emoji: '🔗' },
  'pos-diagnostico': { nome: 'Pós-Diagnóstico', emoji: '📊' },
  'pos-venda-1dia': { nome: 'Pós-Venda (1 dia)', emoji: '📦' },
  'pos-venda-3dias': { nome: 'Pós-Venda (3 dias)', emoji: '📦' },
  'pos-venda-7dias': { nome: 'Pós-Venda (7 dias)', emoji: '📦' },
  'recompra': { nome: 'Recompra', emoji: '🔄' }
}

function FollowUpPageContent() {
  const [filtroMomento, setFiltroMomento] = useState<FollowUpTemplate['momento'] | 'todos'>('todos')
  const [scriptCopiado, setScriptCopiado] = useState<string | null>(null)

  const templatesFiltrados = filtroMomento === 'todos'
    ? followUpTemplates
    : followUpTemplates.filter(template => template.momento === filtroMomento)

  const copiarScript = (conteudo: string, id: string) => {
    navigator.clipboard.writeText(conteudo)
    setScriptCopiado(id)
    setTimeout(() => setScriptCopiado(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar showTitle title="Follow-up Automático" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Voltar ao Sistema - Bem visível no topo */}
        <div className="mb-6">
          <Link
            href="/pt/wellness/system"
            className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Voltar ao Sistema</span>
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Follow-up Automático
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mensagens prontas para enviar em diferentes momentos do processo
          </p>
        </div>

        {/* Filtro */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 max-w-4xl mx-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Momento
          </label>
          <select
            value={filtroMomento}
            onChange={(e) => setFiltroMomento(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="todos">Todos os Momentos</option>
            {Object.entries(momentosInfo).map(([momento, info]) => (
              <option key={momento} value={momento}>
                {info.emoji} {info.nome}
              </option>
            ))}
          </select>
        </div>

        {/* Lista de Templates */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {templatesFiltrados.map((template) => {
            const momentoInfo = momentosInfo[template.momento]
            return (
              <div
                key={template.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{momentoInfo.emoji}</span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {template.nome}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                        {momentoInfo.nome}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                        {template.delayHoras}h após
                      </span>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                        {template.conteudo}
                      </pre>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-700">
                        💡 <strong>Placeholders disponíveis:</strong> [PERFIL_IDENTIFICADO], [KIT_RECOMENDADO], [PRODUTO]
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => copiarScript(template.conteudo, template.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      scriptCopiado === template.id
                        ? 'bg-green-600 text-white'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {scriptCopiado === template.id ? '✓ Copiado!' : '📋 Copiar Mensagem'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Informação sobre Automação */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8 max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-blue-900 mb-2">
            💡 Sobre o Follow-up Automático
          </h3>
          <p className="text-blue-800 text-sm mb-2">
            Por enquanto, essas são mensagens prontas para você copiar e enviar manualmente.
          </p>
          <p className="text-blue-800 text-sm">
            Em breve, implementaremos a automação completa para enviar essas mensagens automaticamente nos momentos certos!
          </p>
        </div>

        {/* Voltar */}
        <div className="text-center mt-8">
          <Link
            href="/pt/wellness/system"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Voltar ao Sistema
          </Link>
        </div>
      </main>
    </div>
  )
}

export default function FollowUpPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <FollowUpPageContent />
    </ProtectedRoute>
  )
}

