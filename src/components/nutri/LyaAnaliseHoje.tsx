'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LyaAnalise {
  foco_prioritario: string
  acoes_recomendadas: string[]
  onde_aplicar: string
  metrica_sucesso: string
  link_interno: string
  mensagem_completa?: string
}

export default function LyaAnaliseHoje() {
  const [analise, setAnalise] = useState<LyaAnalise | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarAnalise = async () => {
      try {
        const response = await fetch('/api/nutri/lya/analise', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.analise) {
            setAnalise(data.analise)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar análise da LYA:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarAnalise()
  }, [])

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-blue-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!analise) {
    return null // Não mostrar se não houver análise
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8 shadow-sm">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold">
          LYA
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            LYA Mentora
          </h3>
          <p className="text-sm text-gray-600">
            Análise da LYA — Hoje
          </p>
        </div>
      </div>

      {/* Bloco 1: Foco Prioritário */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🎯</span>
          <h4 className="font-semibold text-gray-900">FOCO PRIORITÁRIO</h4>
        </div>
        <p className="text-gray-700 pl-8">
          {analise.foco_prioritario}
        </p>
      </div>

      {/* Bloco 2: Ação Recomendada */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">✅</span>
          <h4 className="font-semibold text-gray-900">AÇÃO DE HOJE</h4>
        </div>
        <ul className="space-y-2 pl-8">
          {analise.acoes_recomendadas.map((acao, index) => (
            <li key={index} className="flex items-start gap-2 text-gray-700">
              <span className="text-gray-400 mt-1">☐</span>
              <span>{acao}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bloco 3: Onde Aplicar */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">📍</span>
          <h4 className="font-semibold text-gray-900">ONDE APLICAR</h4>
        </div>
        <p className="text-gray-700 pl-8">
          {analise.onde_aplicar}
        </p>
      </div>

      {/* Bloco 4: Métrica de Sucesso */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">📊</span>
          <h4 className="font-semibold text-gray-900">MÉTRICA DE SUCESSO</h4>
        </div>
        <p className="text-gray-700 pl-8">
          {analise.metrica_sucesso}
        </p>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-blue-200">
        <Link
          href={analise.link_interno}
          className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center flex items-center justify-center gap-2"
        >
          Ir para ação →
        </Link>
        <button
          className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          onClick={() => {
            // TODO: Abrir modal de chat da LYA
            console.log('Abrir chat da LYA')
          }}
        >
          Falar com a LYA
        </button>
      </div>

      {/* Microcopy */}
      <p className="text-xs text-gray-500 mt-4 text-center">
        A LYA usa seu progresso e seus dados para te orientar com precisão.
      </p>
    </div>
  )
}
