'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import type { WellnessCurso } from '@/types/wellness-cursos'
import { createClient } from '@/lib/supabase-client'

const supabase = createClient()

export default function AdminCursosPage() {
  const [cursos, setCursos] = useState<WellnessCurso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    carregarCursos()
  }, [])

  const carregarCursos = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }

      const response = await fetch('/api/wellness/cursos?incluirInativos=true', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar cursos')
      }

      const data = await response.json()
      setCursos(data.cursos || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleAtivo = async (curso: WellnessCurso) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`/api/wellness/cursos/${curso.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ativo: !curso.ativo })
      })

      if (!response.ok) {
        throw new Error('Erro ao atualizar curso')
      }

      await carregarCursos()
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
                <h1 className="text-3xl font-bold text-gray-900">Cursos Wellness</h1>
                <p className="mt-2 text-gray-600">Gerencie os cursos da área wellness</p>
              </div>
              <Link
                href="/admin/wellness/cursos/novo"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                + Novo Curso
              </Link>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando cursos...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Lista de Cursos */}
          {!loading && !error && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {cursos.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 mb-4">Nenhum curso cadastrado ainda.</p>
                  <Link
                    href="/admin/wellness/cursos/novo"
                    className="text-green-600 hover:text-green-700 font-semibold"
                  >
                    Criar primeiro curso →
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Curso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Slug
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ordem
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {cursos.map((curso) => (
                        <tr key={curso.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {curso.thumbnail_url && (
                                <img
                                  src={curso.thumbnail_url}
                                  alt={curso.titulo}
                                  className="h-10 w-10 rounded-lg object-cover mr-3"
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {curso.titulo}
                                </div>
                                {curso.descricao && (
                                  <div className="text-sm text-gray-500 truncate max-w-xs">
                                    {curso.descricao}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {curso.categoria}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {curso.slug}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {curso.ordem}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleAtivo(curso)}
                              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                curso.ativo
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {curso.ativo ? 'Ativo' : 'Inativo'}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              href={`/admin/wellness/cursos/${curso.id}`}
                              className="text-green-600 hover:text-green-900 mr-4"
                            >
                              Editar
                            </Link>
                            <Link
                              href={`/admin/wellness/cursos/${curso.id}/modulos`}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Módulos
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

