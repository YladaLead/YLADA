'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import Link from 'next/link'

export default function NovoPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    conteudo: '',
    categoria: 'duvidas',
    tags: '', // Separado por vírgula
    imagens: [] as string[] // URLs das imagens
  })
  const [uploading, setUploading] = useState(false)

  const categorias = [
    { value: 'duvidas', label: '💬 Dúvidas' },
    { value: 'dicas', label: '💡 Dicas' },
    { value: 'casos-sucesso', label: '🏆 Casos de Sucesso' },
    { value: 'networking', label: '🤝 Networking' },
    { value: 'anuncios', label: '📢 Anúncios' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Processar tags
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const response = await fetch('/api/community/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          titulo: formData.titulo,
          conteudo: formData.conteudo,
          categoria: formData.categoria,
          tags: tagsArray,
          imagens: formData.imagens
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Erro ao criar post. Verifique se preencheu todos os campos obrigatórios.')
      }

      const data = await response.json()
      router.push(`/pt/wellness/comunidade/${data.post.id}`)
    } catch (err: any) {
      console.error('Erro ao criar post:', err)
      const errorMessage = err.message || 'Erro ao criar post. Tente novamente.'
      
      // Verificar se é erro de migração não executada
      if (errorMessage.includes('migração') || errorMessage.includes('Tabelas da comunidade')) {
        setError('⚠️ As tabelas da comunidade ainda não foram criadas. Execute a migração SQL no Supabase primeiro: migrations/021-create-community-tables.sql')
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <div className="min-h-screen bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header */}
              <div className="mb-8">
                <Link
                  href="/pt/wellness/comunidade"
                  className="text-green-600 hover:text-green-700 mb-4 inline-block"
                >
                  ← Voltar para Comunidade
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Criar Novo Post</h1>
                <p className="text-gray-600 mt-2">
                  Compartilhe suas experiências, dúvidas ou dicas com a comunidade
                </p>
              </div>

              {/* Formulário */}
              <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                {/* Título */}
                <div className="mb-6">
                  <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    required
                    maxLength={255}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: Como aumentar minhas vendas em 50%?"
                  />
                </div>

                {/* Categoria */}
                <div className="mb-6">
                  <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    id="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {categorias.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Conteúdo */}
                <div className="mb-6">
                  <label htmlFor="conteudo" className="block text-sm font-medium text-gray-700 mb-2">
                    Conteúdo *
                  </label>
                  <textarea
                    id="conteudo"
                    value={formData.conteudo}
                    onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
                    required
                    rows={10}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Compartilhe sua experiência, dúvida ou dica aqui..."
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    {formData.conteudo.length} caracteres
                  </p>
                </div>

                {/* Upload de Imagens */}
                <div className="mb-6">
                  <label htmlFor="imagens" className="block text-sm font-medium text-gray-700 mb-2">
                    Imagens (opcional)
                  </label>
                  <input
                    type="file"
                    id="imagens"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = Array.from(e.target.files || [])
                      if (files.length === 0) return
                      
                      setUploading(true)
                      const uploadedUrls: string[] = []
                      
                      for (const file of files) {
                        try {
                          // Validar tamanho (5MB)
                          if (file.size > 5 * 1024 * 1024) {
                            setError(`Imagem "${file.name}" é muito grande. Máximo: 5MB`)
                            continue
                          }
                          
                          const uploadFormData = new FormData()
                          uploadFormData.append('file', file)
                          
                          const uploadResponse = await fetch('/api/community/upload', {
                            method: 'POST',
                            credentials: 'include',
                            body: uploadFormData
                          })
                          
                          if (uploadResponse.ok) {
                            const uploadData = await uploadResponse.json()
                            uploadedUrls.push(uploadData.url)
                          } else {
                            const errorData = await uploadResponse.json()
                            setError(`Erro ao fazer upload de "${file.name}": ${errorData.error || 'Erro desconhecido'}`)
                          }
                        } catch (err: any) {
                          console.error('Erro ao fazer upload:', err)
                          setError(`Erro ao fazer upload de "${file.name}": ${err.message || 'Erro desconhecido'}`)
                        }
                      }
                      
                      setFormData({
                        ...formData,
                        imagens: [...formData.imagens, ...uploadedUrls]
                      })
                      setUploading(false)
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={uploading}
                  />
                  {uploading && (
                    <p className="text-sm text-green-600 mt-2">Fazendo upload...</p>
                  )}
                  
                  {/* Preview das imagens */}
                  {formData.imagens.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-4">
                      {formData.imagens.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                imagens: formData.imagens.filter((_, i) => i !== index)
                              })
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Você pode adicionar até 5 imagens por post (máx 5MB cada)
                  </p>
                </div>

                {/* Tags */}
                <div className="mb-6">
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (opcional)
                  </label>
                  <input
                    type="text"
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ex: vendas, marketing, dicas (separadas por vírgula)"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Separe as tags por vírgula. Ex: vendas, marketing, dicas
                  </p>
                </div>

                {/* Botões */}
                <div className="flex items-center justify-end space-x-4">
                  <Link
                    href="/pt/wellness/comunidade"
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Publicando...' : 'Publicar Post'}
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
