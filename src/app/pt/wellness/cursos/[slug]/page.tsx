'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'

interface Modulo {
  id: string
  nome: string
  descricao: string | null
  icone: string | null
  ordem: number
  progresso: number
  concluido: boolean
  totalAulas: number
  aulasConcluidas: number
}

interface Trilha {
  id: string
  nome: string
  descricao: string | null
  slug: string
  progresso: number
  concluido: boolean
}

export default function WellnessTrilhaPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [trilha, setTrilha] = useState<Trilha | null>(null)
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      carregarTrilha()
    }
  }, [slug])

  const carregarTrilha = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/wellness/trilhas/${slug}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        if (response.status === 404) {
          setError('Trilha não encontrada')
        } else {
          throw new Error('Erro ao carregar trilha')
        }
        return
      }

      const data = await response.json()
      if (data.success) {
        setTrilha(data.data.trilha)
        setModulos(data.data.modulos || [])
      }
    } catch (err: any) {
      console.error('Erro ao carregar trilha:', err)
      setError(err.message || 'Erro ao carregar trilha')
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
            <p className="text-gray-600">Carregando trilha...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !trilha) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Trilha de Aprendizado" />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error || 'Trilha não encontrada'}</p>
          </div>
          <Link
            href="/pt/wellness/cursos"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Voltar para trilhas
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <WellnessNavBar showTitle={true} title="Trilha de Aprendizado" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Botão Voltar */}
        <Link
          href="/pt/wellness/cursos"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar para trilhas
        </Link>

        {/* Header da Trilha */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            {trilha.nome}
          </h1>
          {trilha.descricao && (
            <p className="text-lg text-gray-600 mb-6">{trilha.descricao}</p>
          )}

          {/* Barra de Progresso Geral */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progresso Geral
              </span>
              <span className="text-sm font-semibold text-blue-600">
                {trilha.progresso}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  trilha.concluido ? 'bg-green-600' : 'bg-blue-600'
                }`}
                style={{ width: `${trilha.progresso}%` }}
              ></div>
            </div>
            {trilha.concluido && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium mt-2">
                <span>✓</span>
                <span>Trilha concluída!</span>
              </div>
            )}
          </div>
        </div>

        {/* Lista de Módulos */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Módulos ({modulos.length})
          </h2>

          {modulos.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">
                Nenhum módulo disponível nesta trilha.
              </p>
            </div>
          ) : (
            modulos.map((modulo, index) => (
              <Link
                key={modulo.id}
                href={`/pt/wellness/cursos/${slug}/modulos/${modulo.id}`}
                className="block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start gap-4">
                  {/* Ícone/Número */}
                  <div className="flex-shrink-0">
                    {modulo.icone ? (
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                        {modulo.icone}
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl font-bold text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Conteúdo */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {modulo.nome}
                    </h3>
                    {modulo.descricao && (
                      <p className="text-gray-600 mb-4">{modulo.descricao}</p>
                    )}

                    {/* Info de Aulas */}
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <span>
                        {modulo.aulasConcluidas} de {modulo.totalAulas} aulas
                      </span>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500">
                          Progresso do módulo
                        </span>
                        <span className="text-xs font-semibold text-blue-600">
                          {modulo.progresso}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            modulo.concluido ? 'bg-green-600' : 'bg-blue-600'
                          }`}
                          style={{ width: `${modulo.progresso}%` }}
                        ></div>
                      </div>
                    </div>

                    {modulo.concluido && (
                      <div className="flex items-center gap-2 text-green-600 text-sm font-medium mt-2">
                        <span>✓</span>
                        <span>Módulo concluído</span>
                      </div>
                    )}
                  </div>

                  {/* Seta */}
                  <div className="flex-shrink-0">
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
            ))
          )}
        </div>
      </main>
    </div>
  )
}
