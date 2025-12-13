'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import QRCode from '@/components/QRCode'
import NutriNavBar from '@/components/nutri/NutriNavBar'
import VideoPlayerYLADA from '@/components/formacao/VideoPlayerYLADA'
import { buildNutriToolUrl, buildNutriToolUrlFallback, buildShortUrl } from '@/lib/url-utils'

interface Ferramenta {
  id: string
  nome: string
  categoria: string
  tipo?: 'fluxos' | 'quizzes' | 'templates'
  url: string
  shortUrl?: string
  shortCode?: string
  isQuizPersonalizado: boolean
}

export default function FerramentasNutri() {
  const [quizzesPersonalizados, setQuizzesPersonalizados] = useState<Ferramenta[]>([])
  const [loading, setLoading] = useState(true)
  const [previewFerramentaId, setPreviewFerramentaId] = useState<string | null>(null)
  const [previewFerramenta, setPreviewFerramenta] = useState<Ferramenta | null>(null)

  useEffect(() => {
    carregarQuizzes()
  }, [])

  const carregarQuizzes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/nutri/ferramentas?profession=nutri', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar ferramentas')
      }

      const data = await response.json()
      
      // Filtrar apenas Quizzes Personalizados (que podem ser editados)
      const quizzes = (data.tools || [])
        .filter((tool: any) => tool.is_quiz || tool.template_slug === 'quiz-personalizado')
        .map((tool: any) => {
          const url = tool.user_profiles?.user_slug 
            ? buildNutriToolUrl(tool.user_profiles.user_slug, tool.slug)
            : buildNutriToolUrlFallback(tool.id)

          return {
            id: tool.id,
            nome: tool.title,
            categoria: 'Quiz Personalizado',
            tipo: 'quizzes' as const,
            url: url,
            shortUrl: tool.short_code ? buildShortUrl(tool.short_code) : undefined,
            shortCode: tool.short_code,
            isQuizPersonalizado: true
          }
        })

      setQuizzesPersonalizados(quizzes)
    } catch (error) {
      console.error('Erro ao carregar quizzes:', error)
      setQuizzesPersonalizados([])
    } finally {
      setLoading(false)
    }
  }

  const abrirPreview = async (ferramenta: Ferramenta) => {
    setPreviewFerramenta(ferramenta)
    setPreviewFerramentaId(ferramenta.id)
  }

  const copiarLink = (url: string) => {
    navigator.clipboard.writeText(url)
    alert('Link copiado!')
  }

  const copiarQRCode = (url: string) => {
    // QR code já está visível, apenas copiar o link
    copiarLink(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NutriNavBar showTitle={true} title="Ferramentas" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vídeo */}
        <div className="mb-8">
          <VideoPlayerYLADA
            videoUrl={process.env.NEXT_PUBLIC_VIDEO_FERRAMENTAS_YLADA}
            title="Ferramentas YLADA — Guia Completo"
            description="Aprenda a usar todas as ferramentas de captação e atendimento do YLADA."
          />
        </div>

        {/* Criar Quiz Personalizado */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Criar Nova Ferramenta</h2>
          <div className="max-w-md">
            <Link
              href="/pt/nutri/quiz-personalizado"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-lg transition-colors font-medium text-center shadow-sm w-full"
            >
              Criar Quiz Personalizado
            </Link>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700">
              💡 <strong>Nota:</strong> As ferramentas pré-definidas (calculadoras, templates) já estão prontas para uso com links fixos. 
              Você pode criar apenas Quizzes personalizados para customizar completamente.
            </p>
          </div>
        </div>

        {/* Quizzes Personalizados Criados */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Meus Quizzes Personalizados</h2>
          
          {loading ? (
            <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando...</p>
            </div>
          ) : quizzesPersonalizados.length === 0 ? (
            <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
              <span className="text-6xl mb-4 block">🎯</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhum quiz personalizado criado
              </h3>
              <p className="text-gray-600 mb-6">
                Crie seu primeiro quiz personalizado para começar a capturar leads
              </p>
              <Link
                href="/pt/nutri/quiz-personalizado"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Criar Quiz Personalizado
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {quizzesPersonalizados.map((ferramenta) => (
                <div
                  key={ferramenta.id}
                  className="bg-white rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-2xl">
                          🎯
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{ferramenta.nome}</h3>
                          <p className="text-sm text-gray-600">{ferramenta.categoria}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-gray-500">URL:</span>
                          <span className="text-xs text-gray-700 font-mono break-all">{ferramenta.url}</span>
                          <button
                            onClick={() => copiarLink(ferramenta.url)}
                            className="text-xs text-blue-600 hover:text-blue-700 underline"
                          >
                            Copiar
                          </button>
                        </div>
                        {ferramenta.shortCode && (
                          <>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-gray-500">Código Curto:</span>
                              <span className="text-xs text-purple-600 font-mono font-bold">
                                {ferramenta.shortCode}
                              </span>
                              <button
                                onClick={() => copiarLink(ferramenta.shortCode || '')}
                                className="text-xs text-blue-600 hover:text-blue-700 underline"
                              >
                                Copiar
                              </button>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs text-gray-500">URL Encurtada:</span>
                              <span className="text-xs text-purple-600 font-mono break-all">
                                {ferramenta.shortUrl}
                              </span>
                              <button
                                onClick={() => copiarLink(ferramenta.shortUrl || '')}
                                className="text-xs text-blue-600 hover:text-blue-700 underline"
                              >
                                Copiar
                              </button>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-gray-500 mb-1">QR Code:</p>
                              <QRCode 
                                url={ferramenta.shortUrl || ferramenta.url}
                                size={120}
                              />
                              <button
                                onClick={() => copiarQRCode(ferramenta.shortUrl || ferramenta.url)}
                                className="mt-2 text-xs text-blue-600 hover:text-blue-700 underline"
                              >
                                Copiar Link do QR Code
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex flex-col space-y-2 ml-4">
                        <button
                          onClick={() => abrirPreview(ferramenta)}
                          className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                        >
                          👁️ Pré-visualizar
                        </button>
                        <Link
                          href={ferramenta.url}
                          target="_blank"
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Ver Link →
                        </Link>
                        <Link
                          href={`/pt/nutri/ferramentas/${ferramenta.id}/editar`}
                          className="text-sm text-gray-600 hover:text-gray-800 font-medium"
                        >
                          Editar
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Link para Templates (Ferramentas Fixas) */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Ferramentas Pré-definidas</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-700 mb-4">
              As ferramentas pré-definidas (calculadoras, quizzes, templates) estão disponíveis na biblioteca de templates.
              Elas já têm links fixos e podem ser usadas diretamente.
            </p>
            <Link
              href="/pt/nutri/ferramentas/templates"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Ver Biblioteca de Templates →
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de Pré-visualização */}
      {previewFerramenta && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setPreviewFerramenta(null)
            setPreviewFerramentaId(null)
          }}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pré-visualização</h3>
                <p className="text-sm text-gray-600">{previewFerramenta.nome}</p>
              </div>
              <button
                onClick={() => {
                  setPreviewFerramenta(null)
                  setPreviewFerramentaId(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 rounded-lg bg-purple-100 mx-auto mb-4 flex items-center justify-center text-2xl">
                    🎯
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">{previewFerramenta.nome}</h4>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-4">
                    Esta é uma pré-visualização da estrutura. Para ver a ferramenta completa, use "Ver Link".
                  </p>
                  <Link
                    href={previewFerramenta.url}
                    target="_blank"
                    className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Ver Ferramenta Completa →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
