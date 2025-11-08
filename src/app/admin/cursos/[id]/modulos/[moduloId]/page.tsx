'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import SortableList from '@/components/admin/wellness-cursos/SortableList'
import { createClient } from '@/lib/supabase-client'
import type { WellnessCurso, WellnessCursoModulo, WellnessCursoMaterial } from '@/types/wellness-cursos'

const supabase = createClient()

export default function GerenciarMateriaisPage() {
  const params = useParams()
  const router = useRouter()
  const cursoId = params.id as string
  const moduloId = params.moduloId as string
  
  const [curso, setCurso] = useState<WellnessCurso | null>(null)
  const [modulo, setModulo] = useState<WellnessCursoModulo | null>(null)
  const [materiais, setMateriais] = useState<WellnessCursoMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [materialEditando, setMaterialEditando] = useState<WellnessCursoMaterial | null>(null)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    tipo: 'video' as 'pdf' | 'video',
    titulo: '',
    descricao: '',
    arquivo_url: '',
    duracao: '',
    ordem: 0,
    gratuito: false
  })

  useEffect(() => {
    carregarDados()
  }, [cursoId, moduloId])

  const carregarDados = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }

      // Carregar curso
      const cursoResponse = await fetch(`/api/wellness/cursos/${cursoId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (cursoResponse.ok) {
        const cursoData = await cursoResponse.json()
        setCurso(cursoData.curso)
      }

      // Carregar módulo
      const moduloResponse = await fetch(`/api/wellness/cursos/${cursoId}/modulos/${moduloId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!moduloResponse.ok) {
        throw new Error('Erro ao carregar módulo')
      }

      const moduloData = await moduloResponse.json()
      setModulo(moduloData.modulo)

      // Carregar materiais
      const materiaisResponse = await fetch(`/api/wellness/cursos/${cursoId}/modulos/${moduloId}/materiais`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!materiaisResponse.ok) {
        throw new Error('Erro ao carregar materiais')
      }

      const materiaisData = await materiaisResponse.json()
      setMateriais(materiaisData.materiais || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (file: File, tipo: 'pdf' | 'video') => {
    try {
      setUploading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Não autenticado')
      }

      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('tipo', tipo)

      const response = await fetch('/api/wellness/cursos/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formDataUpload
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer upload')
      }

      setFormData(prev => ({ ...prev, arquivo_url: data.url }))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      if (!formData.arquivo_url) {
        alert('Por favor, faça upload do arquivo primeiro')
        return
      }

      const url = materialEditando
        ? `/api/wellness/cursos/${cursoId}/modulos/${moduloId}/materiais/${materialEditando.id}`
        : `/api/wellness/cursos/${cursoId}/modulos/${moduloId}/materiais`
      
      const method = materialEditando ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          duracao: formData.duracao ? parseInt(formData.duracao) : null,
          ordem: formData.ordem || materiais.length
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar material')
      }

      // Limpar formulário e recarregar
      setFormData({
        tipo: 'video',
        titulo: '',
        descricao: '',
        arquivo_url: '',
        duracao: '',
        ordem: 0,
        gratuito: false
      })
      setMostrarForm(false)
      setMaterialEditando(null)
      await carregarDados()
    } catch (err: any) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleEditar = (material: WellnessCursoMaterial) => {
    setMaterialEditando(material)
    setFormData({
      tipo: material.tipo,
      titulo: material.titulo,
      descricao: material.descricao || '',
      arquivo_url: material.arquivo_url,
      duracao: material.duracao?.toString() || '',
      ordem: material.ordem,
      gratuito: material.gratuito
    })
    setMostrarForm(true)
  }

  const handleDeletar = async (materialId: string) => {
    if (!confirm('Tem certeza que deseja deletar este material?')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/wellness/cursos/${cursoId}/modulos/${moduloId}/materiais/${materialId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar material')
      }

      await carregarDados()
    } catch (err: any) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleNovo = () => {
    setMaterialEditando(null)
    setFormData({
      tipo: 'video',
      titulo: '',
      descricao: '',
      arquivo_url: '',
      duracao: '',
      ordem: materiais.length,
      gratuito: false
    })
    setMostrarForm(true)
  }

  const handleReorder = async (newOrder: WellnessCursoMaterial[]) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Atualizar ordem de cada material
      const updates = newOrder.map((material, index) => 
        fetch(`/api/wellness/cursos/${cursoId}/modulos/${moduloId}/materiais/${material.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ ordem: index })
        })
      )

      await Promise.all(updates)
      setMateriais(newOrder)
    } catch (err: any) {
      console.error('Erro ao reordenar:', err)
      // Recarregar em caso de erro
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
              href={`/admin/cursos/${cursoId}/modulos`}
              className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"
            >
              ← Voltar para módulos
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">
              Materiais: {modulo?.titulo || 'Carregando...'}
            </h1>
            <p className="mt-2 text-gray-600">Gerencie os materiais deste módulo</p>
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
              {/* Lista de Materiais */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Materiais ({materiais.length})</h2>
                    <button
                      onClick={handleNovo}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      + Novo Material
                    </button>
                  </div>

                  {materiais.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">Nenhum material criado ainda.</p>
                      <button
                        onClick={handleNovo}
                        className="text-green-600 hover:text-green-700 font-semibold"
                      >
                        Criar primeiro material →
                      </button>
                    </div>
                  ) : (
                    <SortableList
                      items={materiais}
                      onReorder={handleReorder}
                    >
                      {(material, index, listeners, attributes, isDragging) => (
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
                                  <span className="text-2xl">
                                    {material.tipo === 'video' ? '▶️' : '📄'}
                                  </span>
                                  <div>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-semibold text-gray-500">
                                        #{index + 1}
                                      </span>
                                      <h3 className="text-lg font-semibold text-gray-900">
                                        {material.titulo}
                                      </h3>
                                    </div>
                                    {material.duracao && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Duração: {Math.floor(material.duracao / 60)}:{(material.duracao % 60).toString().padStart(2, '0')}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {material.descricao && (
                                  <p className="text-sm text-gray-600 mb-2">
                                    {material.descricao}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleEditar(material)
                                }}
                                className="text-gray-600 hover:text-gray-900 p-2"
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeletar(material.id)
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
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      {materialEditando ? 'Editar Material' : 'Novo Material'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo *
                        </label>
                        <select
                          value={formData.tipo}
                          onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value as 'pdf' | 'video' }))}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="video">▶️ Vídeo</option>
                          <option value="pdf">📄 PDF</option>
                        </select>
                      </div>

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
                          placeholder="Ex: Introdução ao Bem-Estar"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Descrição
                        </label>
                        <textarea
                          value={formData.descricao}
                          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Descreva o material..."
                        />
                      </div>

                      {/* Upload de Arquivo */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Arquivo {formData.arquivo_url ? '(Upload concluído)' : '*'}
                        </label>
                        {formData.arquivo_url ? (
                          <div className="space-y-2">
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm text-green-800">✓ Arquivo carregado</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, arquivo_url: '' }))}
                              className="text-sm text-red-600 hover:text-red-700"
                            >
                              Remover arquivo
                            </button>
                          </div>
                        ) : (
                          <input
                            type="file"
                            accept={formData.tipo === 'video' ? 'video/*' : 'application/pdf'}
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(file, formData.tipo)
                              }
                            }}
                            disabled={uploading}
                            required={!materialEditando}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50"
                          />
                        )}
                        {uploading && (
                          <p className="mt-2 text-sm text-gray-600">Fazendo upload...</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          {formData.tipo === 'video' 
                            ? 'Vídeo (MP4, WebM). Máx: 100MB'
                            : 'PDF. Máx: 10MB'}
                        </p>
                      </div>

                      {formData.tipo === 'video' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Duração (segundos)
                          </label>
                          <input
                            type="number"
                            value={formData.duracao}
                            onChange={(e) => setFormData(prev => ({ ...prev, duracao: e.target.value }))}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Ex: 300 (5 minutos)"
                          />
                        </div>
                      )}

                      <p className="text-xs text-gray-500">
                        💡 A ordem pode ser ajustada arrastando os materiais na lista
                      </p>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.gratuito}
                          onChange={(e) => setFormData(prev => ({ ...prev, gratuito: e.target.checked }))}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Material gratuito (sempre true para SaaS)
                        </label>
                      </div>

                      <div className="flex space-x-3 pt-4">
                        <button
                          type="submit"
                          disabled={uploading || !formData.arquivo_url}
                          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {materialEditando ? 'Atualizar' : 'Criar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setMostrarForm(false)
                            setMaterialEditando(null)
                            setFormData({
                              tipo: 'video',
                              titulo: '',
                              descricao: '',
                              arquivo_url: '',
                              duracao: '',
                              ordem: 0,
                              gratuito: false
                            })
                          }}
                          className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
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

