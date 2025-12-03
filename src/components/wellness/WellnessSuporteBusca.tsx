'use client'

import { useState } from 'react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import OrientacaoTecnica from './OrientacaoTecnica'
import type { OrientacaoResposta } from '@/types/orientation'

export default function WellnessSuporteBusca() {
  const [pergunta, setPergunta] = useState('')
  const [buscando, setBuscando] = useState(false)
  const [resultado, setResultado] = useState<OrientacaoResposta | null>(null)
  const [erro, setErro] = useState<string | null>(null)
  const authenticatedFetch = useAuthenticatedFetch()

  const buscarOrientacao = async () => {
    if (!pergunta.trim()) {
      setErro('Digite sua pergunta')
      return
    }

    setBuscando(true)
    setErro(null)
    setResultado(null)

    try {
      const response = await authenticatedFetch(
        `/api/wellness/orientation?pergunta=${encodeURIComponent(pergunta)}`
      )

      if (!response.ok) {
        throw new Error('Erro ao buscar orientação')
      }

      const data: OrientacaoResposta = await response.json()
      setResultado(data)
    } catch (error: any) {
      setErro(error.message || 'Erro ao buscar orientação. Tente novamente.')
    } finally {
      setBuscando(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !buscando) {
      buscarOrientacao()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        🔍 Busca Inteligente de Ajuda
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        Digite sua dúvida e encontre orientações passo a passo
      </p>

      {/* Campo de Busca */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={pergunta}
          onChange={(e) => setPergunta(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ex: onde estão os scripts, como criar quiz, editar perfil..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          disabled={buscando}
        />
        <button
          onClick={buscarOrientacao}
          disabled={buscando || !pergunta.trim()}
          className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buscando ? '🔍 Buscando...' : '🔍 Buscar'}
        </button>
      </div>

      {/* Erro */}
      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800 text-sm">{erro}</p>
        </div>
      )}

      {/* Resultado */}
      {resultado && (
        <div className="mt-4">
          {resultado.tipo === 'tecnica' && resultado.item ? (
            <OrientacaoTecnica
              item={resultado.item}
              mentor={resultado.mentor}
              sugestaoMentor={resultado.sugestaoMentor}
            />
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <span className="text-4xl mb-4 block">💡</span>
              <p className="text-blue-800 mb-4">
                Não encontrei uma orientação técnica específica para sua pergunta.
              </p>
              <p className="text-blue-700 text-sm">
                Tente reformular ou entre em contato com nosso suporte para ajuda personalizada.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Sugestões Rápidas */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-3">
          💡 Perguntas frequentes:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            'onde estão os scripts',
            'como criar quiz',
            'editar perfil',
            'ver templates',
            'criar portal'
          ].map((sugestao) => (
            <button
              key={sugestao}
              onClick={() => {
                setPergunta(sugestao)
                setTimeout(() => buscarOrientacao(), 100)
              }}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
            >
              {sugestao}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

