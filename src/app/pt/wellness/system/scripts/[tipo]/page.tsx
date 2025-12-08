'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { getScriptsByTipo, TipoScript } from '@/lib/wellness-system/scripts'

const tiposScripts: Record<TipoScript, { nome: string; emoji: string }> = {
  abertura: { nome: 'Abertura', emoji: '👋' },
  'pos-link': { nome: 'Pós-Link', emoji: '🔗' },
  'pos-diagnostico': { nome: 'Pós-Diagnóstico', emoji: '📊' },
  oferta: { nome: 'Oferta', emoji: '💚' },
  fechamento: { nome: 'Fechamento', emoji: '✅' },
  objecoes: { nome: 'Objeções', emoji: '🤔' },
  recuperacao: { nome: 'Recuperação', emoji: '🔄' },
  indicacoes: { nome: 'Indicações', emoji: '👥' },
  'pos-venda': { nome: 'Pós-venda', emoji: '📦' },
  recompra: { nome: 'Recompra', emoji: '🔄' }
}

function ScriptsTipoPageContent() {
  const params = useParams()
  const tipo = params.tipo as TipoScript
  const [scriptCopiado, setScriptCopiado] = useState<string | null>(null)

  const scripts = getScriptsByTipo(tipo)
  const tipoInfo = tiposScripts[tipo]

  if (!tipoInfo || scripts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <WellnessNavBar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Tipo de script não encontrado
            </h1>
            <Link
              href="/pt/wellness/system/scripts"
              className="text-green-600 hover:text-green-700"
            >
              Voltar para Scripts
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const copiarScript = (conteudo: string, id: string) => {
    navigator.clipboard.writeText(conteudo)
    setScriptCopiado(id)
    setTimeout(() => setScriptCopiado(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <WellnessNavBar showTitle title={`Scripts - ${tipoInfo.nome}`} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Botão Voltar ao Sistema - Bem visível no topo */}
        <div className="mb-6">
          <Link
            href="/pt/wellness/home"
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
          <div className="text-5xl mb-4">{tipoInfo.emoji}</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Scripts de {tipoInfo.nome}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Scripts prontos para usar na etapa de {tipoInfo.nome.toLowerCase()}
          </p>
        </div>

        {/* Lista de Scripts */}
        <div className="space-y-4 max-w-4xl mx-auto">
          {scripts.map((script) => (
            <div
              key={script.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {script.titulo}
                  </h3>
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

      </main>
    </div>
  )
}

export default function ScriptsTipoPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <ScriptsTipoPageContent />
    </ProtectedRoute>
  )
}

