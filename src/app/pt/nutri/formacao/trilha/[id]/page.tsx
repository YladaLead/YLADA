'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import FormacaoHeader from '@/components/formacao/FormacaoHeader'
import AulaPlayer from '@/components/formacao/AulaPlayer'
import type { Trilha, Modulo, Aula } from '@/types/formacao'

export default function TrilhaPage() {
  const params = useParams()
  const router = useRouter()
  const trilhaId = params.id as string

  const [trilha, setTrilha] = useState<Trilha | null>(null)
  const [modulos, setModulos] = useState<Modulo[]>([])
  const [aulaAtual, setAulaAtual] = useState<Aula | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    const carregarTrilha = async () => {
      try {
        setCarregando(true)
        setErro(null)

        const res = await fetch(`/api/nutri/formacao/trilhas/${trilhaId}`, {
          credentials: 'include'
        })

        if (!res.ok) {
          throw new Error('Erro ao carregar trilha')
        }

        const data = await res.json()
        setTrilha(data.data.trilha)
        setModulos(data.data.modulos || [])
        
        // Se há progresso, carregar última aula assistida
        if (data.data.ultima_aula) {
          setAulaAtual(data.data.ultima_aula)
        } else if (modulos[0]?.aulas?.[0]) {
          setAulaAtual(modulos[0].aulas[0])
        }
      } catch (error: any) {
        console.error('Erro ao carregar trilha:', error)
        setErro('Erro ao carregar trilha')
      } finally {
        setCarregando(false)
      }
    }

    if (trilhaId) {
      carregarTrilha()
    }
  }, [trilhaId])

  const selecionarAula = (aula: Aula) => {
    setAulaAtual(aula)
  }

  const marcarComoConcluida = async (aulaId: string) => {
    try {
      const res = await fetch(`/api/nutri/formacao/aulas/${aulaId}/concluir`, {
        method: 'POST',
        credentials: 'include'
      })

      if (res.ok) {
        // Recarregar trilha para atualizar progresso
        const trilhaRes = await fetch(`/api/nutri/formacao/trilhas/${trilhaId}`, {
          credentials: 'include'
        })
        if (trilhaRes.ok) {
          const data = await trilhaRes.json()
          setTrilha(data.data.trilha)
          setModulos(data.data.modulos || [])
        }
      }
    } catch (error) {
      console.error('Erro ao marcar aula como concluída:', error)
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <FormacaoHeader />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando trilha...</p>
          </div>
        </div>
      </div>
    )
  }

  if (erro || !trilha) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <FormacaoHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <p className="text-red-800">{erro || 'Trilha não encontrada'}</p>
            <Link
              href="/pt/nutri/formacao"
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              ← Voltar para trilhas
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <FormacaoHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/pt/nutri/formacao"
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← Voltar para trilhas
          </Link>
        </div>

        {/* Header da Trilha */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{trilha.title}</h1>
          <p className="text-gray-600 mb-4">{trilha.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{trilha.estimated_hours}h</span>
            <span>•</span>
            <span>{trilha.level}</span>
            <span>•</span>
            <span>{modulos.length} módulos</span>
            {trilha.progress_percentage > 0 && (
              <>
                <span>•</span>
                <span>{Math.round(trilha.progress_percentage)}% concluído</span>
              </>
            )}
          </div>
          {trilha.progress_percentage > 0 && (
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${trilha.progress_percentage}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Player e Lista de Aulas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Player de Vídeo */}
          <div className="lg:col-span-2">
            {aulaAtual ? (
              <AulaPlayer
                aula={aulaAtual}
                trilhaId={trilhaId}
                onConcluir={() => marcarComoConcluida(aulaAtual.id)}
                onProximaAula={(proximaAula) => {
                  if (proximaAula) {
                    selecionarAula(proximaAula)
                  }
                }}
                modulos={modulos}
              />
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                {modulos.length === 0 || modulos.every(m => m.aulas.length === 0) ? (
                  <>
                    <div className="text-6xl mb-4">📚</div>
                    <p className="text-lg text-gray-700 mb-2 font-medium">As aulas desta trilha estão sendo liberadas.</p>
                    <p className="text-gray-500">Em breve você poderá iniciar seu aprendizado.</p>
                  </>
                ) : (
                  <p className="text-gray-600">Selecione uma aula para começar</p>
                )}
              </div>
            )}
          </div>

          {/* Lista de Aulas */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-24">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-bold text-gray-900">Aulas da Trilha</h2>
              </div>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                {modulos.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-600 mb-2">As aulas desta trilha estão sendo liberadas.</p>
                    <p className="text-sm text-gray-500">Em breve você poderá iniciar seu aprendizado.</p>
                    {/* Placeholders para módulos */}
                    <div className="mt-6 space-y-4">
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
                            <p className="text-sm text-gray-500 font-medium">Módulo {num} – Em breve</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  modulos.map((modulo, moduloIndex) => (
                    <div key={modulo.id} className="border-b border-gray-200 last:border-b-0">
                      <div className="p-3 bg-gray-50">
                        <h3 className="font-semibold text-sm text-gray-900">
                          Módulo {moduloIndex + 1}: {modulo.title}
                        </h3>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {modulo.aulas.length === 0 ? (
                          <div className="p-3 text-sm text-gray-500 italic">
                            Aulas em breve
                          </div>
                        ) : (
                          modulo.aulas.map((aula, aulaIndex) => (
                            <button
                              key={aula.id}
                              onClick={() => selecionarAula(aula)}
                              disabled={!aulaAtual && aulaIndex > 0 && !modulo.aulas[aulaIndex - 1]?.is_completed}
                              className={`w-full text-left p-3 hover:bg-blue-50 transition-colors ${
                                aulaAtual?.id === aula.id
                                  ? 'bg-blue-100 border-l-4 border-blue-600'
                                  : ''
                              } ${
                                !aulaAtual && aulaIndex > 0 && !modulo.aulas[aulaIndex - 1]?.is_completed
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'cursor-pointer'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <div className="flex-shrink-0 mt-1">
                                  {aula.is_completed ? (
                                    <span className="text-green-600">✓</span>
                                  ) : (
                                    <span className="text-gray-400">{aulaIndex + 1}</span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                    {aula.title}
                                  </p>
                                  {aula.video_duration_minutes && (
                                    <p className="text-xs text-gray-500 mt-1">
                                      {aula.video_duration_minutes} min
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

