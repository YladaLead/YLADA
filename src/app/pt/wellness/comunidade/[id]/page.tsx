'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import Link from 'next/link'

interface Post {
  id: string
  titulo: string
  conteudo: string
  categoria: string
  tags: string[]
  imagens?: string[]
  curtidas_count: number
  comentarios_count: number
  visualizacoes_count: number
  created_at: string
  user_curtiu?: boolean
  user: {
    id: string
    nome_completo: string
    email: string
    perfil: string
  }
}

interface Comment {
  id: string
  conteudo: string
  curtidas_count: number
  created_at: string
  user_curtiu?: boolean
  user: {
    id: string
    nome_completo: string
    email: string
    perfil: string
  }
  replies?: Comment[]
}

export default function PostDetailPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    if (postId) {
      carregarPost()
      carregarComentarios()
    }
  }, [postId])

  const carregarPost = async () => {
    try {
      const response = await fetch(`/api/community/posts/${postId}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Post não encontrado')
      }

      const data = await response.json()
      setPost(data.post)
    } catch (error) {
      console.error('Erro ao carregar post:', error)
      router.push('/pt/wellness/comunidade')
    } finally {
      setLoading(false)
    }
  }

  const carregarComentarios = async () => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Erro ao carregar comentários:', error)
    }
  }

  const handleCurtir = async () => {
    if (!post) return

    try {
      const response = await fetch(`/api/community/posts/${post.id}/react`, {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        setPost({
          ...post,
          user_curtiu: !post.user_curtiu,
          curtidas_count: post.user_curtiu
            ? post.curtidas_count - 1
            : post.curtidas_count + 1
        })
      }
    } catch (error) {
      console.error('Erro ao curtir:', error)
    }
  }

  const handleComentar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setSubmittingComment(true)
    try {
      const response = await fetch(`/api/community/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          conteudo: commentText.trim()
        })
      })

      if (response.ok) {
        setCommentText('')
        carregarComentarios()
        if (post) {
          setPost({
            ...post,
            comentarios_count: post.comentarios_count + 1
          })
        }
      }
    } catch (error) {
      console.error('Erro ao comentar:', error)
    } finally {
      setSubmittingComment(false)
    }
  }

  const formatarData = (data: string) => {
    const date = new Date(data)
    const agora = new Date()
    const diff = agora.getTime() - date.getTime()
    const minutos = Math.floor(diff / 60000)
    const horas = Math.floor(minutos / 60)
    const dias = Math.floor(horas / 24)

    if (minutos < 1) return 'Agora'
    if (minutos < 60) return `${minutos}min atrás`
    if (horas < 24) return `${horas}h atrás`
    if (dias < 7) return `${dias}d atrás`
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const categorias = [
    { value: 'duvidas', label: '💬 Dúvidas' },
    { value: 'dicas', label: '💡 Dicas' },
    { value: 'casos-sucesso', label: '🏆 Casos de Sucesso' },
    { value: 'networking', label: '🤝 Networking' },
    { value: 'anuncios', label: '📢 Anúncios' }
  ]

  if (loading) {
    return (
      <ProtectedRoute perfil="wellness" allowAdmin={true}>
        <RequireSubscription area="wellness">
          <ConditionalWellnessSidebar>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Carregando post...</p>
              </div>
            </div>
          </ConditionalWellnessSidebar>
        </RequireSubscription>
      </ProtectedRoute>
    )
  }

  if (!post) {
    return null
  }

  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header */}
              <div className="mb-6">
                <Link
                  href="/pt/wellness/comunidade"
                  className="text-green-600 hover:text-green-700 mb-4 inline-block"
                >
                  ← Voltar para Comunidade
                </Link>
              </div>

              {/* Post */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="p-6">
                  {/* Header do Post */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-lg">
                          {post.user.nome_completo?.charAt(0) || post.user.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {post.user.nome_completo || post.user.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatarData(post.created_at)}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {categorias.find(c => c.value === post.categoria)?.label || post.categoria}
                    </span>
                  </div>

                  {/* Conteúdo */}
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {post.titulo}
                  </h1>
                  <div className="prose max-w-none mb-6">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {post.conteudo}
                    </p>
                  </div>

                  {/* Imagens */}
                  {post.imagens && post.imagens.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {post.imagens.map((url: string, index: number) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Imagem ${index + 1}`}
                          className="w-full h-auto rounded-lg object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => window.open(url, '_blank')}
                        />
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Ações */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-6">
                      <button
                        onClick={handleCurtir}
                        className={`flex items-center space-x-2 ${
                          post.user_curtiu
                            ? 'text-green-600'
                            : 'text-gray-600 hover:text-green-600'
                        } transition-colors`}
                      >
                        <span className="text-2xl">
                          {post.user_curtiu ? '❤️' : '🤍'}
                        </span>
                        <span className="font-medium">{post.curtidas_count}</span>
                      </button>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="text-2xl">💬</span>
                        <span className="font-medium">{post.comentarios_count}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <span className="text-2xl">👁️</span>
                        <span className="font-medium">{post.visualizacoes_count}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comentários */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">
                    Comentários ({post.comentarios_count})
                  </h2>

                  {/* Formulário de Comentário */}
                  <form onSubmit={handleComentar} className="mb-6">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Escreva um comentário..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-3"
                    />
                    <button
                      type="submit"
                      disabled={submittingComment || !commentText.trim()}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submittingComment ? 'Enviando...' : 'Comentar'}
                    </button>
                  </form>

                  {/* Lista de Comentários */}
                  {comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>Nenhum comentário ainda. Seja o primeiro a comentar!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {comments.map((comment) => (
                        <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-0">
                          <div className="flex items-start space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-green-600 font-semibold">
                                {comment.user.nome_completo?.charAt(0) || comment.user.email?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <p className="font-semibold text-gray-900">
                                  {comment.user.nome_completo || comment.user.email}
                                </p>
                                <span className="text-sm text-gray-500">
                                  {formatarData(comment.created_at)}
                                </span>
                              </div>
                              <p className="text-gray-700 whitespace-pre-wrap">
                                {comment.conteudo}
                              </p>
                              <div className="flex items-center space-x-4 mt-3">
                                <button className="flex items-center space-x-1 text-gray-600 hover:text-green-600 transition-colors">
                                  <span>🤍</span>
                                  <span className="text-sm">{comment.curtidas_count}</span>
                                </button>
                                <button className="text-sm text-gray-600 hover:text-green-600 transition-colors">
                                  Responder
                                </button>
                              </div>
                            </div>
                          </div>

                          {/* Respostas (se houver) */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="ml-13 mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start space-x-3">
                                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-gray-600 font-semibold text-sm">
                                      {reply.user.nome_completo?.charAt(0) || reply.user.email?.charAt(0) || 'U'}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <p className="font-semibold text-gray-900 text-sm">
                                        {reply.user.nome_completo || reply.user.email}
                                      </p>
                                      <span className="text-xs text-gray-500">
                                        {formatarData(reply.created_at)}
                                      </span>
                                    </div>
                                    <p className="text-gray-700 text-sm whitespace-pre-wrap">
                                      {reply.conteudo}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}
