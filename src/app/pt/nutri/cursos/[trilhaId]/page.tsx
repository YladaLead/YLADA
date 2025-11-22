'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireFeature from '@/components/auth/RequireFeature'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import ModuleCard from '@/components/cursos/ModuleCard'
import ProgressBar from '@/components/cursos/ProgressBar'
import UpgradePrompt from '@/components/cursos/UpgradePrompt'

export default function TrilhaDetalhes() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <RequireFeature area="nutri" feature={['cursos', 'completo']}>
        <TrilhaDetalhesContent />
      </RequireFeature>
    </ProtectedRoute>
  )
}

function TrilhaDetalhesContent() {
  const params = useParams()
  const router = useRouter()
  const trilhaId = params.trilhaId as string

  const [trilha, setTrilha] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!trilhaId) return

    const carregarTrilha = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/nutri/cursos/${trilhaId}`, {
          credentials: 'include',
        })

        if (response.status === 403) {
          setError('Acesso negado')
          return
        }

        if (!response.ok) {
          throw new Error('Erro ao carregar trilha')
        }

        const data = await response.json()
        if (data.success) {
          setTrilha(data.data.trilha)
        }
      } catch (err: any) {
        console.error('Erro ao carregar trilha:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    carregarTrilha()
  }, [trilhaId])

  if (error === 'Acesso negado') {
    return <UpgradePrompt area="nutri" feature="cursos" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando trilha...</p>
        </div>
      </div>
    )
  }

  if (!trilha) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Trilha não encontrada</p>
          <button
            onClick={() => router.push('/pt/nutri/cursos')}
            className="mt-4 text-blue-600 hover:underline"
          >
            Voltar para Cursos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NutriSidebar
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 lg:ml-56">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{trilha.title}</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/pt/nutri/cursos')}
              className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center"
            >
              ← Voltar para Cursos
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{trilha.title}</h1>
            {trilha.description && (
              <p className="text-gray-600">{trilha.description}</p>
            )}

            {/* Progresso Geral */}
            {trilha.progress_percentage > 0 && (
              <div className="mt-4">
                <ProgressBar
                  progress={trilha.progress_percentage}
                  label="Progresso Geral da Trilha"
                  size="lg"
                />
              </div>
            )}
          </div>

          {/* Módulos */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Módulos</h2>
            {trilha.modulos && trilha.modulos.length > 0 ? (
              <div className="space-y-3">
                {trilha.modulos.map((modulo: any) => (
                  <ModuleCard
                    key={modulo.id}
                    id={modulo.id}
                    title={modulo.title}
                    description={modulo.description}
                    progress={modulo.progress_percentage || 0}
                    unlocked={true} // Será verificado na página do módulo
                    trilhaId={trilhaId}
                    ordem={modulo.ordem}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-6 text-center text-gray-500">
                <p>Nenhum módulo disponível ainda.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

