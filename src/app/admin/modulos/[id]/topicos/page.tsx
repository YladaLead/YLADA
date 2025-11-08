'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import SortableList from '@/components/admin/wellness-cursos/SortableList'
import { createClient } from '@/lib/supabase-client'
import type { WellnessCursoModulo, WellnessModuloTopico } from '@/types/wellness-cursos'

const supabase = createClient()

export default function GerenciarTopicosPage() {
  const params = useParams()
  const router = useRouter()
  const moduloId = params.id as string
  
  const [modulo, setModulo] = useState<WellnessCursoModulo | null>(null)
  const [topicos, setTopicos] = useState<WellnessModuloTopico[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [topicoEditando, setTopicoEditando] = useState<WellnessModuloTopico | null>(null)

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: ''
  })

  useEffect(() => {
    carregarDados()
  }, [moduloId])

  const carregarDados = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }

      // Carregar módulo
      const moduloResponse = await fetch(`/api/wellness/modulos/${moduloId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!moduloResponse.ok) {
        throw new Error('Erro ao carregar módulo')
      }

      const moduloData = await moduloResponse.json()
      setModulo(moduloData.modulo)

      // Carregar tópicos
      const topicosResponse = await fetch(`/api/wellness/modulos/${moduloId}/topicos`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!topicosResponse.ok) {
        throw new Error('Erro ao carregar tópicos')
      }

      const topicosData = await topicosResponse.json()
      setTopicos(topicosData.topicos || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const url = topicoEditando
        ? `/api/wellness/modulos/${moduloId}/topicos/${topicoEditando.id}`
        : `/api/wellness/modulos/${moduloId}/topicos`
      
      const method = topicoEditando ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar tópico')
      }

      await carregarDados()
      handleCancelar()
    } catch (err: any) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleEditar = (topico: WellnessModuloTopico) => {
    setTopicoEditando(topico)
    setFormData({
      titulo: topico.titulo,
      descricao: topico.descricao || ''
    })
    setMostrarForm(true)
  }

  const handleDeletar = async (topicoId: string) => {
    if (!confirm('Tem certeza que deseja deletar este tópico? Todos os cursos serão deletados.')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/wellness/modulos/${moduloId}/topicos/${topicoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao deletar tópico')
      }

      await carregarDados()
    } catch (err: any) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleNovo = () => {
    setTopicoEditando(null)
    setFormData({ titulo: '', descricao: '' })
    setMostrarForm(true)
  }

  const handleCancelar = () => {
    setMostrarForm(false)
    setTopicoEditando(null)
    setFormData({ titulo: '', descricao: '' })
  }

  const handleReorder = async (newOrder: WellnessModuloTopico[]) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const updates = newOrder.map((topico, index) => 
        fetch(`/api/wellness/modulos/${moduloId}/topicos/${topico.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ordem: index })
        })
      )

      await Promise.all(updates)
      setTopicos(newOrder)
    } catch (err: any) {
      console.error('Erro ao reordenar:', err)
      await carregarDados()
    }
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/modulos"
              className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"
            >
              ← Voltar para biblioteca de módulos
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Tópicos: {modulo?.titulo || 'Carregando...'}
            </h1>
            <p className="mt-2 text-gray-600">Gerencie os tópicos deste módulo</p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lista de Tópicos */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Tópicos ({topicos.length})
                    </h2>
                    <button
                      onClick={handleNovo}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      + Novo Tópico
                    </button>
                  </div>

                  {topicos.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">Nenhum tópico criado ainda.</p>
                      <button
                        onClick={handleNovo}
                        className="text-green-600 hover:text-green-700 font-semibold"
                      >
                        Criar primeiro tópico →
                      </button>
                    </div>
                  ) : (
                    <SortableList
                      items={topicos}
                      onReorder={handleReorder}
                    >
                      {(topico, index, listeners, attributes, isDragging) => (
                        <div className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors mb-4 ${isDragging ? 'shadow-lg' : ''}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3 flex-1">
                              <div
                                {...listeners}
                                {...attributes}
                                className="mt-1 text-gray-400 cursor-grab active:cursor-grabbing hover:text-gray-600"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <span className="text-sm font-semibold text-gray-500">
                                    #{index + 1}
                                  </span>
                                  <h3 className="text-lg font-semibold text-gray-900">
                                    {topico.titulo}
                                  </h3>
                                </div>
                                {topico.descricao && (
                                  <p className="text-sm text-gray-600 mb-3">
                                    {topico.descricao}
                                  </p>
                                )}
                                <Link
                                  href={`/admin/modulos/${moduloId}/topicos/${topico.id}/cursos`}
                                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Gerenciar Cursos →
                                </Link>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditar(topico)
                                }}
                                className="text-gray-600 hover:text-gray-900 p-2"
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeletar(topico.id)
                                }}
                                className="text-red-600 hover:text-red-700 p-2"
                                title="Deletar"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </SortableList>
                  )}
                </div>
              </div>

              {/* Formulário */}
              {mostrarForm && (
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {topicoEditando ? 'Editar Tópico' : 'Novo Tópico'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Título *
                        </label>
                        <input
                          type="text"
                          value={formData.titulo}
                          onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Ex: Alimentação Saudável"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descrição
                        </label>
                        <textarea
                          value={formData.descricao}
                          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Descreva o tópico..."
                        />
                      </div>

                      <p className="text-xs text-gray-500">
                        💡 A ordem pode ser ajustada arrastando os tópicos na lista
                      </p>

                      <div className="flex space-x-3 pt-4">
                        <button
                          type="submit"
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          {topicoEditando ? 'Salvar' : 'Criar'}
                        </button>
                        <button
                          type="button"
                          onClick={handleCancelar}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

