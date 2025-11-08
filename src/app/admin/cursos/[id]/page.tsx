'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import CursoForm from '@/components/admin/wellness-cursos/CursoForm'
import { createClient } from '@/lib/supabase-client'
import type { WellnessCurso } from '@/types/wellness-cursos'

const supabase = createClient()

export default function EditarCursoPage() {
  const params = useParams()
  const router = useRouter()
  const cursoId = params.id as string
  
  const [curso, setCurso] = useState<WellnessCurso | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    carregarCurso()
  }, [cursoId])

  const carregarCurso = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Não autenticado')
        return
      }

      const response = await fetch(`/api/wellness/cursos/${cursoId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar curso')
      }

      const data = await response.json()
      setCurso(data.curso)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSuccess = () => {
    router.push('/admin/cursos')
  }

  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin/cursos"
              className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block"
            >
              ← Voltar para cursos
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Editar Curso</h1>
            <p className="mt-2 text-gray-600">Edite as informações do curso</p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando curso...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Formulário */}
          {!loading && !error && curso && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <CursoForm curso={curso} onSuccess={handleSuccess} />
            </div>
          )}
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

