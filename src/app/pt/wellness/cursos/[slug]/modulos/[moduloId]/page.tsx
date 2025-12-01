'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import WellnessNavBar from '@/components/wellness/WellnessNavBar'

interface Aula {
  id: string
  titulo: string
  conteudo: string
  tipo: string
  ordem: number
  duracao_minutos: number | null
  concluido: boolean
}

interface Checklist {
  id: string
  item: string
  ordem: number
  concluido: boolean
}

interface Script {
  id: string
  titulo: string
  conteudo: string
  categoria: string | null
  ordem: number
}

interface Modulo {
  id: string
  nome: string
  descricao: string | null
  icone: string | null
  progresso: number
  concluido: boolean
}

export default function WellnessModuloPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const moduloId = params.moduloId as string

  const [modulo, setModulo] = useState<Modulo | null>(null)
  const [aulas, setAulas] = useState<Aula[]>([])
  const [checklists, setChecklists] = useState<Checklist[]>([])
  const [scripts, setScripts] = useState<Script[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [salvando, setSalvando] = useState<string | null>(null) // ID do item sendo salvo

  useEffect(() => {
    if (slug && moduloId) {
      carregarModulo()
    }
  }, [slug, moduloId])

  const carregarModulo = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(
        `/api/wellness/trilhas/${slug}/modulos/${moduloId}`,
        {
          credentials: 'include'
        }
      )

      if (!response.ok) {
        if (response.status === 404) {
          setError('Módulo não encontrado')
        } else {
          throw new Error('Erro ao carregar módulo')
        }
        return
      }

      const data = await response.json()
      if (data.success) {
        setModulo(data.data.modulo)
        setAulas(data.data.aulas || [])
        setChecklists(data.data.checklists || [])
        setScripts(data.data.scripts || [])
      }
    } catch (err: any) {
      console.error('Erro ao carregar módulo:', err)
      setError(err.message || 'Erro ao carregar módulo')
    } finally {
      setLoading(false)
    }
  }

  const marcarComoConcluido = async (
    tipo: 'aula' | 'checklist',
    id: string,
    concluido: boolean
  ) => {
    try {
      setSalvando(id)

      const response = await fetch('/api/wellness/trilhas/progresso', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          tipo,
          [tipo === 'aula' ? 'aula_id' : 'checklist_item_id']: id,
          modulo_id: moduloId,
          concluido: !concluido // Toggle
        })
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar progresso')
      }

      // Recarregar módulo para atualizar progresso
      await carregarModulo()
    } catch (err: any) {
      console.error('Erro ao salvar progresso:', err)
      alert('Erro ao salvar progresso. Tente novamente.')
    } finally {
      setSalvando(null)
    }
  }

  const copiarScript = (conteudo: string) => {
    navigator.clipboard.writeText(conteudo)
    alert('Script copiado para a área de transferência!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Trilha de Aprendizado" />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando módulo...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !modulo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <WellnessNavBar showTitle={true} title="Trilha de Aprendizado" />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-800">{error || 'Módulo não encontrado'}</p>
          </div>
          <Link
            href={`/pt/wellness/cursos/${slug}`}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Voltar para trilha
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
          href={`/pt/wellness/cursos/${slug}`}
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
          Voltar para trilha
        </Link>

        {/* Header do Módulo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
          <div className="flex items-start gap-4 mb-4">
            {modulo.icone && (
              <div className="text-4xl">{modulo.icone}</div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                {modulo.nome}
              </h1>
              {modulo.descricao && (
                <p className="text-lg text-gray-600 mb-4">{modulo.descricao}</p>
              )}

              {/* Barra de Progresso */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progresso do Módulo
                  </span>
                  <span className="text-sm font-semibold text-blue-600">
                    {modulo.progresso}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      modulo.concluido ? 'bg-green-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${modulo.progresso}%` }}
                  ></div>
                </div>
                {modulo.concluido && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium mt-2">
                    <span>✓</span>
                    <span>Módulo concluído!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Aulas */}
        {aulas.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Aulas</h2>
            <div className="space-y-4">
              {aulas.map((aula) => (
                <div
                  key={aula.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {aula.titulo}
                      </h3>
                      {aula.duracao_minutos && (
                        <p className="text-sm text-gray-500 mb-3">
                          ⏱️ {aula.duracao_minutos} minutos
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() =>
                        marcarComoConcluido('aula', aula.id, aula.concluido)
                      }
                      disabled={salvando === aula.id}
                      className={`flex-shrink-0 ml-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                        aula.concluido
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      } disabled:opacity-50`}
                    >
                      {salvando === aula.id
                        ? 'Salvando...'
                        : aula.concluido
                        ? '✓ Concluído'
                        : 'Marcar como concluído'}
                    </button>
                  </div>

                  {/* Conteúdo da Aula */}
                  <div className="prose max-w-none">
                    <div
                      className="text-gray-700 whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: aula.conteudo.replace(/\n/g, '<br />')
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checklists */}
        {checklists.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Checklist</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="space-y-3">
                {checklists.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={item.concluido}
                      onChange={() =>
                        marcarComoConcluido('checklist', item.id, item.concluido)
                      }
                      disabled={salvando === item.id}
                      className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                    />
                    <span
                      className={`flex-1 ${
                        item.concluido
                          ? 'text-gray-500 line-through'
                          : 'text-gray-900'
                      }`}
                    >
                      {item.item}
                    </span>
                    {salvando === item.id && (
                      <span className="text-sm text-gray-400">Salvando...</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scripts */}
        {scripts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Scripts Prontos</h2>
            <div className="space-y-4">
              {scripts.map((script) => (
                <div
                  key={script.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {script.titulo}
                      </h3>
                      {script.categoria && (
                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          {script.categoria}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => copiarScript(script.conteudo)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                      📋 Copiar
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                      {script.conteudo}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mensagem se não houver conteúdo */}
        {aulas.length === 0 &&
          checklists.length === 0 &&
          scripts.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <p className="text-gray-600">
                Este módulo ainda não possui conteúdo disponível.
              </p>
            </div>
          )}
      </main>
    </div>
  )
}

