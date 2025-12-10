'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import { useAuth } from '@/contexts/AuthContext'

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
  reactions?: Record<string, any[]>
  user: {
    id: string
    nome_completo: string
    email: string
    perfil: string
  }
}

export default function ComunidadePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const [replyingTo, setReplyingTo] = useState<Post | null>(null)
  const [showReactions, setShowReactions] = useState<string | null>(null)
  const [showWhoLiked, setShowWhoLiked] = useState<string | null>(null)
  const [tablesMissing, setTablesMissing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const emojiReactions = [
    { tipo: 'curtir', emoji: '❤️', label: 'Curtir' },
    { tipo: 'amei', emoji: '😍', label: 'Amei' },
    { tipo: 'util', emoji: '👍', label: 'Útil' },
    { tipo: 'engracado', emoji: '😂', label: 'Engraçado' },
    { tipo: 'fogo', emoji: '🔥', label: 'Fogo' }
  ]

  useEffect(() => {
    carregarPosts()
    
    // Atualizar automaticamente a cada 3 segundos
    intervalRef.current = setInterval(() => {
      carregarPosts()
    }, 3000)
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Scroll automático para última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [posts])

  const carregarPosts = async () => {
    // Se as tabelas não existem, não tentar carregar
    if (tablesMissing) {
      return
    }

    try {
      const params = new URLSearchParams()
      params.append('categoria', 'chat')
      params.append('sort', 'recent')
      params.append('area', 'wellness')

      const response = await fetch(`/api/community/posts?${params.toString()}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        
        // Verificar se é erro de tabelas não encontradas
        if (data.error && (data.error.includes('migração') || data.error.includes('Tabelas da comunidade'))) {
          setTablesMissing(true)
          // Parar o polling
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
          setPosts([])
          return
        }
        
        if (data.posts && data.posts.length > 0) {
          // Buscar reações apenas se houver posts
          const postsComReacoes = await Promise.all(
            data.posts.map(async (post: Post) => {
              try {
                const reactionsResponse = await fetch(`/api/community/posts/${post.id}/reactions`, {
                  credentials: 'include'
                })
                if (reactionsResponse.ok) {
                  const reactionsData = await reactionsResponse.json()
                  return { ...post, reactions: reactionsData.reactions }
                }
              } catch (reactionError) {
                // Ignorar erros de reações silenciosamente
              }
              return post
            })
          )
          setPosts(postsComReacoes)
        } else {
          setPosts([])
        }
      } else {
        // Se a resposta não foi OK, verificar se é erro de tabelas
        const errorData = await response.json().catch(() => ({}))
        if (errorData.error && (errorData.error.includes('migração') || errorData.error.includes('Tabelas da comunidade'))) {
          setTablesMissing(true)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }
        }
      }
    } catch (error: any) {
      // Verificar se é erro de tabelas não encontradas
      if (error.message?.includes('does not exist') || error.message?.includes('relation')) {
        setTablesMissing(true)
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
          intervalRef.current = null
        }
      }
      // Não logar erros no console para não poluir
    } finally {
      setLoading(false)
    }
  }

  const enviarMensagem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || sending) return

    setSending(true)
    try {
      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          conteudo: message.trim(),
          categoria: 'chat',
          tipo: 'texto'
        })
      })

      if (response.ok) {
        setMessage('')
        setReplyingTo(null)
        // Recarregar posts imediatamente
        await carregarPosts()
      } else {
        const data = await response.json()
        console.error('❌ Erro na resposta:', data)
        const errorMsg = data.details 
          ? `${data.error}\n\n${data.details}` 
          : data.error || 'Erro ao enviar mensagem'
        alert(errorMsg)
      }
    } catch (error: any) {
      console.error('❌ Erro ao enviar:', error)
      alert(`Erro ao enviar mensagem: ${error.message || 'Erro desconhecido'}`)
    } finally {
      setSending(false)
    }
  }

  const responderMensagem = async (post: Post) => {
    if (!message.trim() || sending) return

    setSending(true)
    try {
      const response = await fetch(`/api/community/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          conteudo: message.trim()
        })
      })

      if (response.ok) {
        setMessage('')
        setReplyingTo(null)
        await carregarPosts()
      }
    } catch (error) {
      console.error('Erro ao responder:', error)
    } finally {
      setSending(false)
    }
  }

  const reagir = async (postId: string, tipo: string) => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/react-emoji`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ tipo })
      })

      if (response.ok) {
        await carregarPosts()
      }
    } catch (error) {
      console.error('Erro ao reagir:', error)
    }
  }

  const verQuemCurtiu = async (postId: string) => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/reactions`, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        // Atualizar post com reações
        setPosts(posts.map(p => 
          p.id === postId ? { ...p, reactions: data.reactions } : p
        ))
        setShowWhoLiked(postId)
      }
    } catch (error) {
      console.error('Erro ao buscar reações:', error)
    }
  }

  const compartilhar = async (postId: string) => {
    const url = `${window.location.origin}/pt/wellness/comunidade/${postId}`
    try {
      await navigator.share({
        title: 'Comunidade YLADA Wellness',
        text: 'Veja esta mensagem na comunidade!',
        url: url
      })
    } catch (error) {
      // Fallback: copiar para clipboard
      await navigator.clipboard.writeText(url)
      alert('Link copiado para a área de transferência!')
    }
  }

  const detectarMencao = (texto: string): string[] => {
    const mentions = texto.match(/@(\w+)/g) || []
    return mentions.map(m => m.substring(1))
  }

  const formatarData = (data: string) => {
    const date = new Date(data)
    const agora = new Date()
    const diff = agora.getTime() - date.getTime()
    const minutos = Math.floor(diff / 60000)
    const horas = Math.floor(minutos / 60)
    const dias = Math.floor(horas / 24)

    if (minutos < 1) return 'Agora'
    if (minutos < 60) return `${minutos}min`
    if (horas < 24) return `${horas}h`
    if (dias < 7) return `${dias}d`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  }

  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">🏘️ Comunidade Wellness</h1>
                <p className="text-gray-600 mt-2">
                  Chat em tempo real - Converse com a comunidade
                </p>
              </div>

              {/* Área de Mensagens */}
              <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-gray-200 shadow-sm mb-4 p-4 space-y-4">
                {tablesMissing ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Tabelas da comunidade não foram criadas
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Execute a migração SQL primeiro para usar o chat.
                    </p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left max-w-2xl mx-auto">
                      <p className="text-sm font-medium text-yellow-800 mb-2">
                        📋 Instruções:
                      </p>
                      <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                        <li>Abra o Supabase SQL Editor</li>
                        <li>Execute: <code className="bg-yellow-100 px-2 py-1 rounded">migrations/021-create-community-tables.sql</code></li>
                        <li>Execute: <code className="bg-yellow-100 px-2 py-1 rounded">migrations/022-criar-bucket-community-images.sql</code></li>
                        <li>Recarregue esta página</li>
                      </ol>
                    </div>
                  </div>
                ) : loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando mensagens...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Nenhuma mensagem ainda
                    </h3>
                    <p className="text-gray-600">
                      Seja o primeiro a enviar uma mensagem!
                    </p>
                  </div>
                ) : (
                  <>
                    {posts.map((post) => {
                      const mentions = detectarMencao(post.conteudo)
                      const isReplying = replyingTo?.id === post.id
                      
                      return (
                        <div key={post.id} className="flex items-start space-x-3 group">
                          {/* Avatar */}
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-green-600 font-semibold">
                              {post.user.nome_completo?.charAt(0) || post.user.email?.charAt(0) || 'U'}
                            </span>
                          </div>

                          {/* Mensagem */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-semibold text-gray-900">
                                {post.user.nome_completo || post.user.email}
                              </p>
                              <span className="text-sm text-gray-500">
                                {formatarData(post.created_at)}
                              </span>
                            </div>

                            {/* Conteúdo */}
                            <div className="bg-gray-50 rounded-lg p-3 mb-2">
                              <p className="text-gray-800 whitespace-pre-wrap break-words">
                                {post.conteudo.split(' ').map((word, i) => {
                                  if (word.startsWith('@')) {
                                    const username = word.substring(1)
                                    return (
                                      <span key={i} className="text-green-600 font-semibold">
                                        @{username}{' '}
                                      </span>
                                    )
                                  }
                                  return <span key={i}>{word} </span>
                                })}
                              </p>

                              {/* Imagens */}
                              {post.imagens && post.imagens.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 mt-3">
                                  {post.imagens.map((url, idx) => (
                                    <img
                                      key={idx}
                                      src={url}
                                      alt={`Imagem ${idx + 1}`}
                                      className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90"
                                      onClick={() => window.open(url, '_blank')}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Ações */}
                            <div className="flex items-center space-x-4 text-sm">
                              {/* Reações */}
                              <div className="flex items-center space-x-2 relative">
                                {/* Mostrar reações existentes */}
                                {post.reactions && Object.keys(post.reactions).length > 0 && (
                                  <div className="flex items-center space-x-1">
                                    {Object.entries(post.reactions).map(([tipo, reactions]: [string, any]) => {
                                      const reactionEmoji = emojiReactions.find(r => r.tipo === tipo)
                                      const userReacted = reactions.some((r: any) => r.user?.id === user?.id)
                                      
                                      return (
                                        <button
                                          key={tipo}
                                          onClick={() => reagir(post.id, tipo)}
                                          className={`px-2 py-1 rounded-full text-xs flex items-center space-x-1 ${
                                            userReacted ? 'bg-green-100 border border-green-300' : 'bg-gray-100 hover:bg-gray-200'
                                          }`}
                                          title={`${reactionEmoji?.label || tipo}: ${reactions.length}`}
                                        >
                                          <span>{reactionEmoji?.emoji || '👍'}</span>
                                          <span>{reactions.length}</span>
                                        </button>
                                      )
                                    })}
                                  </div>
                                )}
                                
                                {/* Botão de reagir */}
                                <button
                                  onClick={() => setShowReactions(showReactions === post.id ? null : post.id)}
                                  className="px-2 py-1 text-gray-600 hover:text-green-600 hover:bg-gray-100 rounded-full transition-colors text-sm"
                                  title="Adicionar reação"
                                >
                                  😊
                                </button>
                              </div>

                              {/* Menu de Reações (popup) */}
                              {showReactions === post.id && (
                                <div className="absolute left-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg p-3 flex space-x-2 z-20">
                                  {emojiReactions.map((reaction) => {
                                    const userReacted = post.reactions?.[reaction.tipo]?.some(
                                      (r: any) => r.user?.id === user?.id
                                    )
                                    return (
                                      <button
                                        key={reaction.tipo}
                                        onClick={() => {
                                          reagir(post.id, reaction.tipo)
                                          setShowReactions(null)
                                        }}
                                        className={`text-2xl hover:scale-125 transition-transform p-2 rounded-lg ${
                                          userReacted ? 'bg-green-50' : 'hover:bg-gray-50'
                                        }`}
                                        title={reaction.label}
                                      >
                                        {reaction.emoji}
                                      </button>
                                    )
                                  })}
                                </div>
                              )}

                              {/* Responder */}
                              <button
                                onClick={() => {
                                  setReplyingTo(isReplying ? null : post)
                                  if (!isReplying) {
                                    setMessage(`@${post.user.nome_completo || post.user.email} `)
                                  }
                                }}
                                className="text-gray-600 hover:text-green-600 transition-colors"
                              >
                                💬 Responder
                              </button>

                              {/* Ver quem curtiu */}
                              {post.reactions && Object.keys(post.reactions).length > 0 && (
                                <button
                                  onClick={() => verQuemCurtiu(post.id)}
                                  className="text-gray-600 hover:text-green-600 transition-colors text-sm"
                                >
                                  👥 Ver quem reagiu
                                </button>
                              )}

                              {/* Compartilhar */}
                              <button
                                onClick={() => compartilhar(post.id)}
                                className="text-gray-600 hover:text-green-600 transition-colors"
                              >
                                📤 Compartilhar
                              </button>
                            </div>

                            {/* Modal: Quem curtiu */}
                            {showWhoLiked === post.id && post.reactions && (
                              <div className="mt-3 bg-white border border-gray-200 rounded-lg p-4 shadow-lg z-10">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold">Quem reagiu:</h4>
                                  <button
                                    onClick={() => setShowWhoLiked(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                  >
                                    ✕
                                  </button>
                                </div>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                  {Object.entries(post.reactions).map(([tipo, reactions]: [string, any]) => {
                                    const reactionEmoji = emojiReactions.find(r => r.tipo === tipo)
                                    return (
                                      <div key={tipo} className="border-b border-gray-100 pb-2 last:border-0">
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                          {reactionEmoji?.emoji} {reactionEmoji?.label} ({reactions.length})
                                        </p>
                                        <div className="space-y-1">
                                          {reactions.map((reaction: any) => (
                                            <p key={reaction.id} className="text-sm text-gray-600">
                                              {reaction.user?.nome_completo || reaction.user?.email}
                                            </p>
                                          ))}
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Respostas (comentários) */}
                            {post.comentarios_count > 0 && (
                              <button
                                onClick={() => router.push(`/pt/wellness/comunidade/${post.id}`)}
                                className="mt-2 text-sm text-green-600 hover:text-green-700"
                              >
                                Ver {post.comentarios_count} resposta(s) →
                              </button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Caixa de Mensagem */}
              <form onSubmit={replyingTo ? (e) => { e.preventDefault(); responderMensagem(replyingTo) } : enviarMensagem} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                {replyingTo && (
                  <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Respondendo para:</p>
                      <p className="text-sm font-medium text-gray-900">
                        {replyingTo.user.nome_completo || replyingTo.user.email}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {replyingTo.conteudo}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(null)
                        setMessage('')
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          if (replyingTo) {
                            responderMensagem(replyingTo)
                          } else {
                            enviarMensagem(e)
                          }
                        }
                      }}
                      placeholder={replyingTo ? "Digite sua resposta..." : "Digite sua mensagem... (Enter para enviar, Shift+Enter para nova linha)"}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      💡 Dica: Use @nome para mencionar alguém
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={!message.trim() || sending}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sending ? '⏳' : '📤'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}
