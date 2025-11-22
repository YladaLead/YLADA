'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireFeature from '@/components/auth/RequireFeature'
import NutriSidebar from '@/components/nutri/NutriSidebar'
import VideoPlayer from '@/components/cursos/VideoPlayer'
import Checklist from '@/components/cursos/Checklist'
import TarefaCard from '@/components/cursos/TarefaCard'
import PDFViewer from '@/components/cursos/PDFViewer'
import ProgressBar from '@/components/cursos/ProgressBar'
import UpgradePrompt from '@/components/cursos/UpgradePrompt'

export default function ModuloDetalhes() {
  return (
    <ProtectedRoute perfil="nutri" allowAdmin={true}>
      <RequireFeature area="nutri" feature={['cursos', 'completo']}>
        <ModuloDetalhesContent />
      </RequireFeature>
    </ProtectedRoute>
  )
}

function ModuloDetalhesContent() {
  const params = useParams()
  const router = useRouter()
  const trilhaId = params.trilhaId as string
  const moduloId = params.moduloId as string

  const [modulo, setModulo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [checklistProgress, setChecklistProgress] = useState(0)
  const [aulaAtual, setAulaAtual] = useState<any>(null)

  useEffect(() => {
    if (!trilhaId || !moduloId) return

    const carregarModulo = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `/api/nutri/cursos/${trilhaId}/modulos/${moduloId}`,
          {
            credentials: 'include',
          }
        )

        if (response.status === 403) {
          const data = await response.json()
          if (data.error === 'Módulo bloqueado') {
            setError('Módulo bloqueado')
            return
          }
          setError('Acesso negado')
          return
        }

        if (!response.ok) {
          throw new Error('Erro ao carregar módulo')
        }

        const data = await response.json()
        if (data.success) {
          setModulo(data.data.modulo)
          // Definir primeira aula como atual
          if (data.data.modulo.aulas && data.data.modulo.aulas.length > 0) {
            setAulaAtual(data.data.modulo.aulas[0])
          }
        }
      } catch (err: any) {
        console.error('Erro ao carregar módulo:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    carregarModulo()
  }, [trilhaId, moduloId])

  const handleVideoCompleted = () => {
    // Recarregar módulo para atualizar progresso
    if (trilhaId && moduloId) {
      const response = fetch(
        `/api/nutri/cursos/${trilhaId}/modulos/${moduloId}`,
        {
          credentials: 'include',
        }
      )
    }
  }

  if (error === 'Acesso negado') {
    return <UpgradePrompt area="nutri" feature="cursos" />
  }

  if (error === 'Módulo bloqueado') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Módulo Bloqueado
          </h2>
          <p className="text-gray-600 mb-6">
            Complete o módulo anterior para desbloquear este módulo.
          </p>
          <button
            onClick={() => router.push(`/pt/nutri/cursos/${trilhaId}`)}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Voltar para Trilha
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando módulo...</p>
        </div>
      </div>
    )
  }

  if (!modulo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Módulo não encontrado</p>
          <button
            onClick={() => router.push(`/pt/nutri/cursos/${trilhaId}`)}
            className="mt-4 text-blue-600 hover:underline"
          >
            Voltar para Trilha
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
          <h1 className="text-lg font-semibold text-gray-900">{modulo.title}</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => router.push(`/pt/nutri/cursos/${trilhaId}`)}
              className="text-blue-600 hover:text-blue-700 mb-4 inline-flex items-center"
            >
              ← Voltar para Trilha
            </button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{modulo.title}</h1>
            {modulo.description && (
              <p className="text-gray-600 mb-4">{modulo.description}</p>
            )}

            {/* Progresso do Módulo */}
            <ProgressBar
              progress={modulo.progress_percentage || 0}
              label="Progresso do Módulo"
              size="lg"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Conteúdo Principal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Player de Vídeo */}
              {aulaAtual && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {aulaAtual.title}
                  </h2>
                  <VideoPlayer
                    videoUrl={aulaAtual.video_url || ''}
                    moduloId={moduloId}
                    aulaId={aulaAtual.id}
                    onCompleted={handleVideoCompleted}
                  />
                </div>
              )}

              {/* Materiais PDF */}
              {aulaAtual && aulaAtual.materiais && aulaAtual.materiais.length > 0 && (
                <div>
                  {aulaAtual.materiais.map((material: any) => (
                    <PDFViewer
                      key={material.id}
                      pdfUrl={material.file_url}
                      title={material.title}
                    />
                  ))}
                </div>
              )}

              {/* Tarefas */}
              {aulaAtual && aulaAtual.tarefas && aulaAtual.tarefas.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Tarefas Práticas
                  </h2>
                  <div className="space-y-4">
                    {aulaAtual.tarefas.map((tarefa: any) => (
                      <TarefaCard
                        key={tarefa.id}
                        tarefa={tarefa}
                        onCompleted={handleVideoCompleted}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Lista de Aulas */}
              {modulo.aulas && modulo.aulas.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Aulas do Módulo</h3>
                  <div className="space-y-2">
                    {modulo.aulas.map((aula: any) => (
                      <button
                        key={aula.id}
                        onClick={() => setAulaAtual(aula)}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          aulaAtual?.id === aula.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">
                            {aula.title}
                          </span>
                          {aula.tarefas?.some((t: any) => t.completed) && (
                            <span className="text-green-600">✓</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Checklist */}
              {modulo.checklist && modulo.checklist.length > 0 && (
                <Checklist
                  moduloId={moduloId}
                  items={modulo.checklist}
                  onProgressChange={setChecklistProgress}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

