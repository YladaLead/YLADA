'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { getAllScripts, getScriptsByTipo, TipoScript } from '@/lib/wellness-system/scripts'

const tiposScripts: { id: TipoScript; nome: string; emoji: string }[] = [
  { id: 'abertura', nome: 'Abertura', emoji: '👋' },
  { id: 'pos-link', nome: 'Pós-Link', emoji: '🔗' },
  { id: 'pos-diagnostico', nome: 'Pós-Diagnóstico', emoji: '📊' },
  { id: 'oferta', nome: 'Oferta', emoji: '💚' },
  { id: 'fechamento', nome: 'Fechamento', emoji: '✅' },
  { id: 'objecoes', nome: 'Objeções', emoji: '🤔' },
  { id: 'recuperacao', nome: 'Recuperação', emoji: '🔄' },
  { id: 'indicacoes', nome: 'Indicações', emoji: '👥' },
  { id: 'pos-venda', nome: 'Pós-venda', emoji: '📦' },
  { id: 'recompra', nome: 'Recompra', emoji: '🔄' }
]

function ScriptsPageContent() {
  const router = useRouter()
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoScript | 'todos'>('todos')
  const [busca, setBusca] = useState('')
  const [scriptCopiado, setScriptCopiado] = useState<string | null>(null)

  const scriptsFiltrados = tipoSelecionado === 'todos' 
    ? getAllScripts()
    : getScriptsByTipo(tipoSelecionado)

  const scriptsBusca = busca === ''
    ? scriptsFiltrados
    : scriptsFiltrados.filter(script => 
        script.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        script.conteudo.toLowerCase().includes(busca.toLowerCase())
      )

  const copiarScript = (conteudo: string, id: string) => {
    navigator.clipboard.writeText(conteudo)
    setScriptCopiado(id)
    setTimeout(() => setScriptCopiado(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar showTitle title="Biblioteca de Scripts" />
      
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
            Biblioteca de Scripts
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scripts prontos para usar em cada etapa do seu processo de vendas e recrutamento
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Busca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Script
              </label>
              <input
                type="text"
                placeholder="Digite para buscar..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Script
              </label>
              <select
                value={tipoSelecionado}
                onChange={(e) => setTipoSelecionado(e.target.value as TipoScript | 'todos')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="todos">Todos os Tipos</option>
                {tiposScripts.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.emoji} {tipo.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Scripts */}
        {scriptsBusca.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">
              Nenhum script encontrado com os filtros selecionados.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {scriptsBusca.map((script) => (
              <div
                key={script.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">
                        {tiposScripts.find(t => t.id === script.tipo)?.emoji || '📝'}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {script.titulo}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-300">
                        {tiposScripts.find(t => t.id === script.tipo)?.nome || script.tipo}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      {script.contexto}
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 font-sans">
                        {script.conteudo}
                      </pre>
                    </div>
                    {script.variacoes && script.variacoes.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Variações:
                        </p>
                        <ul className="space-y-2">
                          {script.variacoes.map((variacao, index) => (
                            <li key={index} className="text-sm text-gray-600 bg-blue-50 rounded p-2">
                              {variacao}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => copiarScript(script.conteudo, script.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      scriptCopiado === script.id
                        ? 'bg-green-600 text-white'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {scriptCopiado === script.id ? '✓ Copiado!' : '📋 Copiar Script'}
                  </button>
                  {script.variacoes && script.variacoes.length > 0 && (
                    <button
                      onClick={() => {
                        const todasVariacoes = [script.conteudo, ...script.variacoes].join('\n\n---\n\n')
                        copiarScript(todasVariacoes, script.id + '-variacoes')
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      📋 Copiar com Variações
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  )
}

export default function ScriptsPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <ScriptsPageContent />
    </ProtectedRoute>
  )
}

