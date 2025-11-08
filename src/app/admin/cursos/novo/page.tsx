'use client'

import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import CursoForm from '@/components/admin/wellness-cursos/CursoForm'

export default function NovoCursoPage() {
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Novo Curso</h1>
            <p className="mt-2 text-gray-600">Crie um novo curso para a área wellness</p>
          </div>

          {/* Formulário */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <CursoForm />
          </div>
        </div>
      </div>
    </AdminProtectedRoute>
  )
}

