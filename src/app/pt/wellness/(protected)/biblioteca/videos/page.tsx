'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
// REMOVIDO: ProtectedRoute e RequireSubscription - layout server-side cuida disso
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

interface Material {
  id: string
  codigo: string
  titulo: string
  descricao: string | null
  tipo: string
  categoria: string
  url: string
  tags: string[] | null
  created_at: string
}

export default function BibliotecaVideosPage() {
  const router = useRouter()
  const authenticatedFetch = useAuthenticatedFetch()
  const [videos, setVideos] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroTag, setFiltroTag] = useState<string>('')

  useEffect(() => {
    const carregarVideos = async () => {
      try {
        setLoading(true)
        const url = filtroTag
          ? `/api/wellness/biblioteca/materiais?tipo=video&tag=${filtroTag}`
          : '/api/wellness/biblioteca/materiais?tipo=video'
        
        const response = await authenticatedFetch(url, {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setVideos(data.data || [])
          }
        }
      } catch (error) {
        console.error('Erro ao carregar vídeos:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarVideos()
  }, [authenticatedFetch, filtroTag])

  // Extrair tags únicas para filtro
  const tagsDisponiveis = Array.from(
    new Set(
      videos.flatMap(v => v.tags || [])
    )
  ).sort()

  // Layout server-side já valida autenticação, perfil e assinatura
  if (loading) {
    return (
      <ConditionalWellnessSidebar>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando vídeos...</p>
              </div>
            </div>
          </div>
        </div>
      </ConditionalWellnessSidebar>
    )
  }

  return (
    <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="mb-6">
                <button
                  onClick={() => router.push('/pt/wellness/biblioteca')}
                  className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
                >
                  ← Voltar para Biblioteca
                </button>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  🎥 Vídeos de Treinamento
                </h1>
                <p className="text-lg text-gray-600">
                  Vídeos sobre preparo, vendas, convites e apresentações
                </p>
              </div>

              {/* Filtros */}
              {tagsDisponiveis.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => setFiltroTag('')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filtroTag === ''
                        ? 'bg-green-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Todos
                  </button>
                  {tagsDisponiveis.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setFiltroTag(tag)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        filtroTag === tag
                          ? 'bg-green-600 text-white'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {tag.charAt(0).toUpperCase() + tag.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {/* Lista de Vídeos */}
              {videos.length === 0 ? (
                <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
                  <p className="text-gray-600 mb-4">
                    Nenhum vídeo encontrado ainda.
                  </p>
                  <p className="text-sm text-gray-500">
                    Os vídeos serão adicionados em breve. Em caso de dúvidas, fale com o NOEL.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                    >
                      {/* Thumbnail/Preview */}
                      <div className="aspect-video bg-gray-100 flex items-center justify-center relative">
                        <video
                          src={video.url}
                          className="w-full h-full object-cover"
                          controls={false}
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                          <button
                            onClick={() => window.open(video.url, '_blank')}
                            className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all transform hover:scale-110"
                          >
                            <span className="text-3xl">▶️</span>
                          </button>
                        </div>
                      </div>

                      {/* Conteúdo */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {video.titulo}
                        </h3>
                        {video.descricao && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {video.descricao}
                          </p>
                        )}
                        
                        {/* Tags */}
                        {video.tags && video.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {video.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Botão Assistir */}
                        <button
                          onClick={() => window.open(video.url, '_blank')}
                          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                        >
                          ▶️ Assistir Vídeo
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
    </ConditionalWellnessSidebar>
  )
}
