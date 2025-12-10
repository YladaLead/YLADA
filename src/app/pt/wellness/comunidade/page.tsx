'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import Link from 'next/link'
import Image from 'next/image'

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

export default function ComunidadePage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [categoria, setCategoria] = useState<string>('')
  const [sort, setSort] = useState<'recent' | 'popular' | 'trending'>('recent')
  const [searchQuery, setSearchQuery] = useState('')

  const categorias = [
    { value: '', label: 'Todas' },
    { value: 'duvidas', label: '💬 Dúvidas' },
    { value: 'dicas', label: '💡 Dicas' },
    { value: 'casos-sucesso', label: '🏆 Casos de Sucesso' },
    { value: 'networking', label: '🤝 Networking' },
    { value: 'anuncios', label: '📢 Anúncios' }
  ]

  useEffect(() => {
    if (searchQuery.trim()) {
      // Se tem busca, usar API de busca
      buscarPosts()
    } else {
      // Senão, carregar feed normal
      carregarPosts()
    }
  }, [categoria, sort, searchQuery])

  const carregarPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (categoria) params.append('categoria', categoria)
      params.append('sort', sort)
      params.append('area', 'wellness')

      const response = await fetch(`/api/community/posts?${params.toString()}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar posts')
      }

      const data = await response.json()
      
      // Verificar se há erro de migração
      if (data.error && data.error.includes('migração')) {
        console.warn('⚠️ Migração não executada:', data.error)
        setPosts([])
      } else {
        setPosts(data.posts || [])
      }
    } catch (error: any) {
      console.error('Erro ao carregar posts:', error)
      // Se for erro de tabela não encontrada, não mostrar erro (tabela ainda não existe)
      if (error.message?.includes('migração') || error.message?.includes('does not exist')) {
        setPosts([])
      }
    } finally {
      setLoading(false)
    }
  }

  const buscarPosts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('q', searchQuery.trim())
      if (categoria) params.append('categoria', categoria)
      params.append('area', 'wellness')

      const response = await fetch(`/api/community/posts/search?${params.toString()}`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar posts')
      }

      const data = await response.json()
      
      // Verificar se há erro de migração
      if (data.error && data.error.includes('migração')) {
        console.warn('⚠️ Migração não executada:', data.error)
        setPosts([])
      } else {
        setPosts(data.posts || [])
      }
    } catch (error: any) {
      console.error('Erro ao buscar posts:', error)
      // Se for erro de tabela não encontrada, não mostrar erro (tabela ainda não existe)
      if (error.message?.includes('migração') || error.message?.includes('does not exist')) {
        setPosts([])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCurtir = async (postId: string) => {
    try {
      const response = await fetch(`/api/community/posts/${postId}/react`, {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        // Atualizar estado local
        setPosts(posts.map(post => {
          if (post.id === postId) {
            const novoCurtiu = !post.user_curtiu
            return {
              ...post,
              user_curtiu: novoCurtiu,
              curtidas_count: novoCurtiu
                ? post.curtidas_count + 1
                : Math.max(0, post.curtidas_count - 1)
            }
          }
          return post
        }))
      }
    } catch (error) {
      console.error('Erro ao curtir:', error)
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
    return date.toLocaleDateString('pt-BR')
  }

  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">🏘️ Comunidade Wellness</h1>
                    <p className="text-gray-600 mt-2">
                      Conecte-se, compartilhe experiências e aprenda com outros membros
                    </p>
                  </div>
                  <Link
                    href="/pt/wellness/comunidade/novo"
                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    + Novo Post
                  </Link>
                </div>

                {/* Busca */}
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="🔍 Buscar posts..."
                      className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Filtros */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1 min-w-[200px]">
                    <select
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      {categorias.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as any)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="recent">📅 Mais Recentes</option>
                      <option value="popular">🔥 Mais Populares</option>
                      <option value="trending">⚡ Em Alta</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Feed de Posts */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando posts...</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                  <div className="text-6xl mb-4">🏘️</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Nenhum post ainda
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Seja o primeiro a compartilhar algo com a comunidade!
                  </p>
                  <Link
                    href="/pt/wellness/comunidade/novo"
                    className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Criar Primeiro Post
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/pt/wellness/comunidade/${post.id}`)}
                    >
                      <div className="p-6">
                        {/* Header do Post */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-semibold">
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
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                          {post.titulo}
                        </h2>
                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {post.conteudo}
                        </p>

                        {/* Preview de Imagens */}
                        {post.imagens && post.imagens.length > 0 && (
                          <div className="mb-4">
                            <img
                              src={post.imagens[0]}
                              alt="Preview"
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            {post.imagens.length > 1 && (
                              <p className="text-sm text-gray-500 mt-2">
                                +{post.imagens.length - 1} imagem(ns)
                              </p>
                            )}
                          </div>
                        )}

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
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
                              onClick={(e) => {
                                e.stopPropagation()
                                handleCurtir(post.id)
                              }}
                              className={`flex items-center space-x-2 ${
                                post.user_curtiu
                                  ? 'text-green-600'
                                  : 'text-gray-600 hover:text-green-600'
                              } transition-colors`}
                            >
                              <span className="text-xl">
                                {post.user_curtiu ? '❤️' : '🤍'}
                              </span>
                              <span className="font-medium">{post.curtidas_count}</span>
                            </button>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <span className="text-xl">💬</span>
                              <span className="font-medium">{post.comentarios_count}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <span className="text-xl">👁️</span>
                              <span className="font-medium">{post.visualizacoes_count}</span>
                            </div>
                          </div>
                          <Link
                            href={`/pt/wellness/comunidade/${post.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-green-600 hover:text-green-700 font-medium"
                          >
                            Ver mais →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}
