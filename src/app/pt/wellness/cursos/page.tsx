'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'

interface Trilha {
  id: string
  nome: string
  descricao: string | null
  slug: string
  progresso: number
  concluido: boolean
}

export default function WellnessCursosPage() {
  const [trilhas, setTrilhas] = useState<Trilha[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    carregarTrilhas()
  }, [])

  const carregarTrilhas = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/wellness/trilhas', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar trilhas')
      }

      const data = await response.json()
      if (data.success) {
        setTrilhas(data.data.trilhas || [])
      }
    } catch (err: any) {
      console.error('Erro ao carregar trilhas:', err)
      setError(err.message || 'Erro ao carregar trilhas')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Trilha de Aprendizado" />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando trilhas...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Trilha de Aprendizado" />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="Trilha de Aprendizado" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Trilha de Aprendizado
          </h1>
          <p className="text-lg text-gray-600">
            Aprenda passo a passo como vender ENERGY + ACELERA e gerar 50 PV por cliente
          </p>
        </div>

        {/* Lista de Trilhas */}
        {trilhas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhuma trilha disponível
            </h2>
            <p className="text-gray-600">
              As trilhas de aprendizado estarão disponíveis em breve.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {trilhas.map((trilha) => (
              <Link
                key={trilha.id}
                href={`/pt/wellness/cursos/${trilha.slug}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {trilha.nome}
                    </h2>
                    {trilha.descricao && (
                      <p className="text-gray-600 mb-4">{trilha.descricao}</p>
                    )}
                    
                    {/* Barra de Progresso */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Progresso
                        </span>
                        <span className="text-sm font-semibold text-blue-600">
                          {trilha.progresso}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            trilha.concluido
                              ? 'bg-green-600'
                              : 'bg-blue-600'
                          }`}
                          style={{ width: `${trilha.progresso}%` }}
                        ></div>
                      </div>
                    </div>

                    {trilha.concluido && (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                        <span>✓</span>
                        <span>Concluído</span>
                      </div>
                    )}
                  </div>

                  <div className="ml-4">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
