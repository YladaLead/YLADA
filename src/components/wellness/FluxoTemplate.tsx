'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Script {
  texto: string
}

interface Passo {
  numero: number
  titulo: string
  descricao: string
  scripts?: string[]
  dicas?: string[]
}

interface Variacao {
  titulo: string
  scripts: string[]
}

interface Fluxo {
  id: string
  titulo: string
  descricao: string
  objetivo: string
  quandoUsar: string
  passos: Passo[]
  variacoes?: Variacao[]
  comandosNoel?: string[]
}

interface FluxoTemplateProps {
  fluxo: Fluxo
}

export default function FluxoTemplate({ fluxo }: FluxoTemplateProps) {
  const router = useRouter()
  const [passoExpandido, setPassoExpandido] = useState<number | null>(null)
  const [scriptCopiado, setScriptCopiado] = useState<string | null>(null)

  const copiarScript = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto)
      setScriptCopiado(texto)
      setTimeout(() => setScriptCopiado(null), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  const enviarWhatsApp = (texto: string) => {
    const textoEncoded = encodeURIComponent(texto)
    window.open(`https://wa.me/?text=${textoEncoded}`, '_blank')
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/pt/wellness/fluxos')}
          className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 text-sm"
        >
          ← Voltar para Fluxos
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{fluxo.titulo}</h1>
        <p className="text-lg text-gray-600 mb-6">{fluxo.descricao}</p>
      </div>

      {/* Objetivo e Quando Usar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <span>🎯</span>
            <span>Objetivo</span>
          </h3>
          <p className="text-sm text-blue-800">{fluxo.objetivo}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-5 border border-green-200">
          <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
            <span>⏰</span>
            <span>Quando Usar</span>
          </h3>
          <p className="text-sm text-green-800">{fluxo.quandoUsar}</p>
        </div>
      </div>

      {/* Passos */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Passo a Passo</h2>
        {fluxo.passos.map((passo) => (
          <div
            key={passo.numero}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
          >
            <button
              onClick={() => setPassoExpandido(passoExpandido === passo.numero ? null : passo.numero)}
              className="w-full p-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  {passo.numero}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{passo.titulo}</h3>
                  <p className="text-sm text-gray-600">{passo.descricao}</p>
                </div>
              </div>
              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  passoExpandido === passo.numero ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {passoExpandido === passo.numero && (
              <div className="px-5 pb-5 space-y-4 border-t border-gray-200 pt-5">
                {/* Scripts */}
                {passo.scripts && passo.scripts.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span>💬</span>
                      <span>Scripts Sugeridos</span>
                    </h4>
                    <div className="space-y-3">
                      {passo.scripts.map((script, index) => (
                        <div
                          key={index}
                          className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative"
                        >
                          <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                            {script}
                          </pre>
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => copiarScript(script)}
                              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              {scriptCopiado === script ? '✓ Copiado!' : '📋 Copiar'}
                            </button>
                            <button
                              onClick={() => enviarWhatsApp(script)}
                              className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              📱 WhatsApp
                            </button>
                            <button
                              onClick={() => router.push(`/pt/wellness/noel?personalizar=${encodeURIComponent(script)}`)}
                              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              🤖 NOEL
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dicas */}
                {passo.dicas && passo.dicas.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <span>💡</span>
                      <span>Dicas Importantes</span>
                    </h4>
                    <ul className="space-y-2">
                      {passo.dicas.map((dica, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <span className="text-green-600 mt-0.5">•</span>
                          <span>{dica}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Variações */}
      {fluxo.variacoes && fluxo.variacoes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🎨 Variações de Linguagem</h2>
          <div className="space-y-4">
            {fluxo.variacoes.map((variacao, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h3 className="font-semibold text-gray-900 mb-3">{variacao.titulo}</h3>
                <div className="space-y-3">
                  {variacao.scripts.map((script, scriptIndex) => (
                    <div key={scriptIndex} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans mb-3">
                        {script}
                      </pre>
                      <div className="flex gap-2">
                        <button
                          onClick={() => copiarScript(script)}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          📋 Copiar
                        </button>
                        <button
                          onClick={() => enviarWhatsApp(script)}
                          className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          📱 WhatsApp
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comandos NOEL */}
      {fluxo.comandosNoel && fluxo.comandosNoel.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>🤖</span>
            <span>Comandos para o NOEL</span>
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Use estes comandos no chat do NOEL para personalizar este fluxo:
          </p>
          <div className="space-y-2">
            {fluxo.comandosNoel.map((comando, index) => (
              <button
                key={index}
                onClick={() => router.push(`/pt/wellness/noel?mensagem=${encodeURIComponent(comando)}`)}
                className="w-full text-left bg-white rounded-lg p-3 border border-blue-200 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <code className="text-sm text-gray-800">{comando}</code>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Botão NOEL */}
      <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
        <p className="text-gray-700 mb-4">
          Precisa de ajuda para personalizar este fluxo?
        </p>
        <button
          onClick={() => router.push('/pt/wellness/noel')}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          Falar com o NOEL →
        </button>
      </div>
    </div>
  )
}
