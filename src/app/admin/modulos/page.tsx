'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import SortableList from '@/components/admin/wellness-cursos/SortableList'
import { createClient } from '@/lib/supabase-client'
import type { WellnessCursoModulo, WellnessModuloTopico, WellnessCursoMaterial } from '@/types/wellness-cursos'

const supabase = createClient()

export default function BibliotecaModulosPage() {
  const [modulos, setModulos] = useState<(WellnessCursoModulo & {
    topicos?: (WellnessModuloTopico & {
      cursos?: WellnessCursoMaterial[]
    })[]
  })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados para expansão
  const [modulosExpandidos, setModulosExpandidos] = useState<Set<string>>(new Set())
  const [topicosExpandidos, setTopicosExpandidos] = useState<Set<string>>(new Set())
  
  // Estados para formulários
  const [mostrarFormModulo, setMostrarFormModulo] = useState(false)
  const [moduloEditando, setModuloEditando] = useState<WellnessCursoModulo | null>(null)
  const [topicoEditando, setTopicoEditando] = useState<{ moduloId: string; topico?: WellnessModuloTopico } | null>(null)
  const [cursoEditando, setCursoEditando] = useState<{ topicoId: string; curso?: WellnessCursoMaterial } | null>(null)

  const [formModulo, setFormModulo] = useState({ titulo: '', descricao: '' })
  const [formTopico, setFormTopico] = useState({ titulo: '', descricao: '' })
  const [formCurso, setFormCurso] = useState({
    tipo: 'video' as 'pdf' | 'video',
    titulo: '',
    descricao: '',
    arquivo_url: '',
    duracao: '',
    gratuito: false
  })

  useEffect(() => {
    carregarModulos()
  }, [])

  const carregarModulos = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }

      // Carregar módulos
      const modulosResponse = await fetch('/api/wellness/modulos', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!modulosResponse.ok) {
        throw new Error('Erro ao carregar módulos')
      }

      const modulosData = await modulosResponse.json()
      const modulosList = modulosData.modulos || []

      // Para cada módulo, carregar tópicos e cursos
      const modulosCompletos = await Promise.all(
        modulosList.map(async (modulo: WellnessCursoModulo) => {
          // Carregar tópicos
          const topicosResponse = await fetch(`/api/wellness/modulos/${modulo.id}/topicos`, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`
            }
          })

          let topicos: (WellnessModuloTopico & { cursos?: WellnessCursoMaterial[] })[] = []
          
          if (topicosResponse.ok) {
            const topicosData = await topicosResponse.json()
            topicos = await Promise.all(
              (topicosData.topicos || []).map(async (topico: WellnessModuloTopico) => {
                // Carregar cursos do tópico
                const cursosResponse = await fetch(`/api/wellness/modulos/${modulo.id}/topicos/${topico.id}/cursos`, {
                  headers: {
                    'Authorization': `Bearer ${session.access_token}`
                  }
                })

                let cursos: WellnessCursoMaterial[] = []
                if (cursosResponse.ok) {
                  const cursosData = await cursosResponse.json()
                  cursos = cursosData.cursos || []
                }

                return { ...topico, cursos }
              })
            )
          }

          return { ...modulo, topicos }
        })
      )

      setModulos(modulosCompletos)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleModulo = (moduloId: string) => {
    const novos = new Set(modulosExpandidos)
    if (novos.has(moduloId)) {
      novos.delete(moduloId)
    } else {
      novos.add(moduloId)
    }
    setModulosExpandidos(novos)
  }

  const toggleTopico = (topicoId: string) => {
    const novos = new Set(topicosExpandidos)
    if (novos.has(topicoId)) {
      novos.delete(topicoId)
    } else {
      novos.add(topicoId)
    }
    setTopicosExpandidos(novos)
  }

  const handleNovoModulo = () => {
    setModuloEditando(null)
    setFormModulo({ titulo: '', descricao: '' })
    setMostrarFormModulo(true)
  }

  const handleSalvarModulo = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const url = moduloEditando
        ? `/api/wellness/modulos/${moduloEditando.id}`
        : '/api/wellness/modulos'
      
      const method = moduloEditando ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formModulo)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar módulo')
      }

      await carregarModulos()
      setMostrarFormModulo(false)
      setModuloEditando(null)
      setFormModulo({ titulo: '', descricao: '' })
    } catch (err: any) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleNovoTopico = (moduloId: string) => {
    setTopicoEditando({ moduloId })
    setFormTopico({ titulo: '', descricao: '' })
  }

  const handleSalvarTopico = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!topicoEditando) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const url = topicoEditando.topico
        ? `/api/wellness/modulos/${topicoEditando.moduloId}/topicos/${topicoEditando.topico.id}`
        : `/api/wellness/modulos/${topicoEditando.moduloId}/topicos`
      
      const method = topicoEditando.topico ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formTopico)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar tópico')
      }

      await carregarModulos()
      setTopicoEditando(null)
      setFormTopico({ titulo: '', descricao: '' })
    } catch (err: any) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleNovoCurso = (topicoId: string) => {
    setCursoEditando({ topicoId })
    setFormCurso({
      tipo: 'video',
      titulo: '',
      descricao: '',
      arquivo_url: '',
      duracao: '',
      gratuito: false
    })
  }

  const handleSalvarCurso = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cursoEditando) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Encontrar módulo e tópico
      const moduloEncontrado = modulos.find(m => 
        m.topicos?.some(t => t.id === cursoEditando.topicoId)
      )
      if (!moduloEncontrado) return

      const topicoEncontrado = moduloEncontrado.topicos?.find(t => t.id === cursoEditando.topicoId)
      if (!topicoEncontrado) return

      const url = cursoEditando.curso
        ? `/api/wellness/modulos/${moduloEncontrado.id}/topicos/${cursoEditando.topicoId}/cursos/${cursoEditando.curso.id}`
        : `/api/wellness/modulos/${moduloEncontrado.id}/topicos/${cursoEditando.topicoId}/cursos`
      
      const method = cursoEditando.curso ? 'PUT' : 'POST'

      const body: any = {
        ...formCurso,
        duracao: formCurso.duracao ? parseInt(formCurso.duracao) : null
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao salvar curso')
      }

      await carregarModulos()
      setCursoEditando(null)
      setFormCurso({
        tipo: 'video',
        titulo: '',
        descricao: '',
        arquivo_url: '',
        duracao: '',
        gratuito: false
      })
    } catch (err: any) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipo: 'pdf' | 'video') => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('tipo', tipo)

      const response = await fetch('/api/wellness/cursos/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: uploadFormData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer upload')
      }

      setFormCurso(prev => ({ ...prev, arquivo_url: data.url }))
      alert('Upload realizado com sucesso!')
    } catch (err: any) {
      alert(`Erro no upload: ${err.message}`)
    }
  }

  const handleDeletarModulo = async (moduloId: string) => {
    if (!confirm('Tem certeza que deseja deletar este módulo? Todos os tópicos e cursos serão deletados.')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/wellness/modulos/${moduloId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao deletar módulo')
      }

      await carregarModulos()
    } catch (err: any) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleDeletarTopico = async (moduloId: string, topicoId: string) => {
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

      await carregarModulos()
    } catch (err: any) {
      alert(`Erro: ${err.message}`)
    }
  }

  const handleDeletarCurso = async (moduloId: string, topicoId: string, cursoId: string) => {
    if (!confirm('Tem certeza que deseja deletar este curso?')) {
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/wellness/modulos/${moduloId}/topicos/${topicoId}/cursos/${cursoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao deletar curso')
      }

      await carregarModulos()
    } catch (err: any) {
      alert(`Erro: ${err.message}`)
    }
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href="/admin"
                  className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block"
                >
                  ← Dashboard Admin
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">📚 Módulos</h1>
                <p className="mt-2 text-gray-600">Gerencie módulos, tópicos e cursos</p>
              </div>
              <button
                onClick={handleNovoModulo}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                + Novo Módulo
              </button>
            </div>
          </div>

          {/* Formulário de Módulo */}
          {mostrarFormModulo && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                {moduloEditando ? 'Editar Módulo' : 'Novo Módulo'}
              </h3>
              <form onSubmit={handleSalvarModulo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formModulo.titulo}
                    onChange={(e) => setFormModulo(prev => ({ ...prev, titulo: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Bem-Estar e Saúde"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formModulo.descricao}
                    onChange={(e) => setFormModulo(prev => ({ ...prev, descricao: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Descreva o módulo..."
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    {moduloEditando ? 'Salvar' : 'Criar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMostrarFormModulo(false)
                      setModuloEditando(null)
                      setFormModulo({ titulo: '', descricao: '' })
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

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

          {/* Lista de Módulos */}
          {!loading && !error && (
            <div className="space-y-4">
              {modulos.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-500 mb-4">Nenhum módulo criado ainda.</p>
                  <button
                    onClick={handleNovoModulo}
                    className="text-green-600 hover:text-green-700 font-semibold"
                  >
                    Criar primeiro módulo →
                  </button>
                </div>
              ) : (
                modulos.map((modulo) => (
                  <div key={modulo.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    {/* Header do Módulo */}
                    <div className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1">
                          <button
                            onClick={() => toggleModulo(modulo.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {modulosExpandidos.has(modulo.id) ? '▼' : '▶'}
                          </button>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {modulo.titulo}
                            </h3>
                            {modulo.descricao && (
                              <p className="text-sm text-gray-600 mt-1">
                                {modulo.descricao}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setModuloEditando(modulo)
                              setFormModulo({
                                titulo: modulo.titulo,
                                descricao: modulo.descricao || ''
                              })
                              setMostrarFormModulo(true)
                            }}
                            className="text-gray-600 hover:text-gray-900 p-2"
                            title="Editar"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeletarModulo(modulo.id)}
                            className="text-red-600 hover:text-red-700 p-2"
                            title="Deletar"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Tópicos (expandido) */}
                    {modulosExpandidos.has(modulo.id) && (
                      <div className="border-t border-gray-200 bg-gray-50">
                        <div className="p-4">
                          <button
                            onClick={() => handleNovoTopico(modulo.id)}
                            className="mb-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            + Novo Tópico
                          </button>

                          {/* Formulário de Tópico */}
                          {topicoEditando?.moduloId === modulo.id && (
                            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
                              <h4 className="text-md font-bold text-gray-900 mb-3">
                                {topicoEditando.topico ? 'Editar Tópico' : 'Novo Tópico'}
                              </h4>
                              <form onSubmit={handleSalvarTopico} className="space-y-3">
                                <input
                                  type="text"
                                  value={formTopico.titulo}
                                  onChange={(e) => setFormTopico(prev => ({ ...prev, titulo: e.target.value }))}
                                  required
                                  placeholder="Título do tópico *"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                                <textarea
                                  value={formTopico.descricao}
                                  onChange={(e) => setFormTopico(prev => ({ ...prev, descricao: e.target.value }))}
                                  placeholder="Descrição"
                                  rows={2}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                                />
                                <div className="flex space-x-2">
                                  <button
                                    type="submit"
                                    className="bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-green-700"
                                  >
                                    Salvar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setTopicoEditando(null)}
                                    className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    Cancelar
                                  </button>
                                </div>
                              </form>
                            </div>
                          )}

                          {/* Lista de Tópicos */}
                          <div className="space-y-3">
                            {modulo.topicos?.map((topico) => (
                              <div key={topico.id} className="bg-white rounded-lg border border-gray-200">
                                <div className="p-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 flex-1">
                                      <button
                                        onClick={() => toggleTopico(topico.id)}
                                        className="text-gray-400 hover:text-gray-600 text-sm"
                                      >
                                        {topicosExpandidos.has(topico.id) ? '▼' : '▶'}
                                      </button>
                                      <span className="text-sm font-semibold text-gray-700">
                                        {topico.titulo}
                                      </span>
                                      {topico.descricao && (
                                        <span className="text-xs text-gray-500">
                                          - {topico.descricao}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => {
                                          setTopicoEditando({ moduloId: modulo.id, topico })
                                          setFormTopico({
                                            titulo: topico.titulo,
                                            descricao: topico.descricao || ''
                                          })
                                        }}
                                        className="text-gray-600 hover:text-gray-900 text-xs p-1"
                                      >
                                        ✏️
                                      </button>
                                      <button
                                        onClick={() => handleDeletarTopico(modulo.id, topico.id)}
                                        className="text-red-600 hover:text-red-700 text-xs p-1"
                                      >
                                        🗑️
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                {/* Cursos (expandido) */}
                                {topicosExpandidos.has(topico.id) && (
                                  <div className="border-t border-gray-200 bg-gray-50 p-3">
                                    <button
                                      onClick={() => handleNovoCurso(topico.id)}
                                      className="mb-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                      + Novo Curso (Material)
                                    </button>

                                    {/* Formulário de Curso */}
                                    {cursoEditando?.topicoId === topico.id && (
                                      <div className="bg-white rounded-lg border border-gray-200 p-3 mb-3">
                                        <h5 className="text-sm font-bold text-gray-900 mb-2">
                                          {cursoEditando.curso ? 'Editar Curso' : 'Novo Curso'}
                                        </h5>
                                        <form onSubmit={handleSalvarCurso} className="space-y-2">
                                          <select
                                            value={formCurso.tipo}
                                            onChange={(e) => setFormCurso(prev => ({ ...prev, tipo: e.target.value as 'pdf' | 'video' }))}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                                          >
                                            <option value="video">Vídeo</option>
                                            <option value="pdf">PDF</option>
                                          </select>
                                          <input
                                            type="text"
                                            value={formCurso.titulo}
                                            onChange={(e) => setFormCurso(prev => ({ ...prev, titulo: e.target.value }))}
                                            required
                                            placeholder="Título do curso *"
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                                          />
                                          <input
                                            type="file"
                                            accept={formCurso.tipo === 'video' ? 'video/*' : 'application/pdf'}
                                            onChange={(e) => handleFileUpload(e, formCurso.tipo)}
                                            className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                                          />
                                          {formCurso.tipo === 'video' && (
                                            <input
                                              type="number"
                                              value={formCurso.duracao}
                                              onChange={(e) => setFormCurso(prev => ({ ...prev, duracao: e.target.value }))}
                                              placeholder="Duração (segundos)"
                                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                                            />
                                          )}
                                          <div className="flex items-center space-x-2">
                                            <button
                                              type="submit"
                                              className="bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold hover:bg-green-700"
                                            >
                                              Salvar
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() => setCursoEditando(null)}
                                              className="px-2 py-1 border border-gray-300 rounded text-xs text-gray-700 hover:bg-gray-50"
                                            >
                                              Cancelar
                                            </button>
                                          </div>
                                        </form>
                                      </div>
                                    )}

                                    {/* Lista de Cursos */}
                                    <div className="space-y-2">
                                      {topico.cursos?.map((curso) => (
                                        <div key={curso.id} className="bg-white rounded border border-gray-200 p-2 flex items-center justify-between">
                                          <div className="flex items-center space-x-2">
                                            <span className="text-lg">
                                              {curso.tipo === 'video' ? '▶️' : '📄'}
                                            </span>
                                            <span className="text-sm font-medium text-gray-900">
                                              {curso.titulo}
                                            </span>
                                          </div>
                                          <div className="flex items-center space-x-2">
                                            <button
                                              onClick={() => {
                                                setCursoEditando({ topicoId: topico.id, curso })
                                                setFormCurso({
                                                  tipo: curso.tipo,
                                                  titulo: curso.titulo,
                                                  descricao: curso.descricao || '',
                                                  arquivo_url: curso.arquivo_url,
                                                  duracao: curso.duracao ? curso.duracao.toString() : '',
                                                  gratuito: curso.gratuito
                                                })
                                              }}
                                              className="text-gray-600 hover:text-gray-900 text-xs p-1"
                                            >
                                              ✏️
                                            </button>
                                            <button
                                              onClick={() => handleDeletarCurso(modulo.id, topico.id, curso.id)}
                                              className="text-red-600 hover:text-red-700 text-xs p-1"
                                            >
                                              🗑️
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                      {(!topico.cursos || topico.cursos.length === 0) && (
                                        <p className="text-xs text-gray-500 text-center py-2">
                                          Nenhum curso ainda
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                            {(!modulo.topicos || modulo.topicos.length === 0) && (
                              <p className="text-sm text-gray-500 text-center py-4">
                                Nenhum tópico ainda
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </AdminProtectedRoute>
  )
}
