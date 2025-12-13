'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface LyaAnalise {
  foco_principal: string
  acao_pratica: string
  link_interno: string
  metrica_simples: string
  mensagem_completa: string
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
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-blue-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!analise) {
    return null // Não mostrar se não houver análise
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
            LYA
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            💡 Análise da LYA para você hoje:
          </h3>
          <div className="text-gray-700 whitespace-pre-line mb-4">
            {analise.mensagem_completa}
          </div>
          {analise.link_interno && (
            <Link
              href={analise.link_interno}
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Ir para ação →
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

