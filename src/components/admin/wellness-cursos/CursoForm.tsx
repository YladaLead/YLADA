'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import type { WellnessCurso, CreateWellnessCursoDTO, UpdateWellnessCursoDTO } from '@/types/wellness-cursos'

const supabase = createClient()

interface CursoFormProps {
  curso?: WellnessCurso | null
  onSuccess?: () => void
}

export default function CursoForm({ curso, onSuccess }: CursoFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<CreateWellnessCursoDTO>({
    titulo: curso?.titulo || '',
    descricao: curso?.descricao || '',
    categoria: curso?.categoria || 'tutorial',
    thumbnail_url: curso?.thumbnail_url || '',
    slug: curso?.slug || '',
    ordem: curso?.ordem || 0,
    ativo: curso?.ativo !== undefined ? curso.ativo : true
  })

  // Gerar slug automaticamente do título
  useEffect(() => {
    if (!curso && formData.titulo) {
      const slugGerado = formData.titulo
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9]+/g, '-') // Substitui espaços e caracteres especiais por hífen
        .replace(/^-+|-+$/g, '') // Remove hífens do início e fim
      
      setFormData(prev => ({ ...prev, slug: slugGerado }))
    }
  }, [formData.titulo, curso])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Não autenticado')
      }

      const url = curso 
        ? `/api/wellness/cursos/${curso.id}`
        : '/api/wellness/cursos'
      
      const method = curso ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar curso')
      }

      setSuccess(true)
      
      if (onSuccess) {
        onSuccess()
      } else {
        // Se criou um novo curso, redirecionar para página de módulos
        if (!curso && data.curso?.id) {
          setTimeout(() => {
            router.push(`/admin/cursos/${data.curso.id}/modulos`)
          }, 1500)
        } else {
          // Se editou, voltar para lista
          setTimeout(() => {
            router.push('/admin/cursos')
          }, 1500)
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!tiposPermitidos.includes(file.type)) {
      setError('Tipo de arquivo inválido. Use JPG, PNG ou WEBP.')
      return
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Tamanho máximo: 5MB.')
      return
    }

    try {
      setUploadingThumbnail(true)
      setError(null)

      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('Não autenticado')
      }

      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      formDataUpload.append('tipo', 'thumbnail')

      const response = await fetch('/api/wellness/cursos/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formDataUpload
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer upload')
      }

      setFormData(prev => ({ ...prev, thumbnail_url: data.url }))
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploadingThumbnail(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mensagens */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">
            {curso ? 'Curso atualizado com sucesso!' : 'Curso criado com sucesso!'}
          </p>
        </div>
      )}

      {/* Título */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Título do Curso *
        </label>
        <input
          type="text"
          value={formData.titulo}
          onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Ex: Filosofia do Bem-Estar"
        />
      </div>

      {/* Descrição */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Descrição
        </label>
        <textarea
          value={formData.descricao || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Descreva o curso..."
        />
      </div>

      {/* Categoria e Área */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria *
          </label>
          <select
            value={formData.categoria}
            onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value as 'tutorial' | 'filosofia' }))}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="tutorial">🎓 Tutorial</option>
            <option value="filosofia">🧘 Filosofia</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Área
          </label>
          <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600">
            Wellness (por enquanto apenas Wellness disponível)
          </div>
        </div>
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slug (URL) *
        </label>
        <div className="flex items-center space-x-2">
          <span className="text-gray-500">ylada.app/pt/wellness/cursos/</span>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => {
              const slug = e.target.value
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9-]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '')
              setFormData(prev => ({ ...prev, slug }))
            }}
            required
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="filosofia-bem-estar"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          URL amigável. Será gerado automaticamente do título, mas pode ser editado.
        </p>
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thumbnail (Imagem de Capa)
        </label>
        <div className="space-y-4">
          {formData.thumbnail_url && (
            <div className="relative w-48 h-32 border border-gray-300 rounded-lg overflow-hidden">
              <img
                src={formData.thumbnail_url}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, thumbnail_url: '' }))}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
              >
                ×
              </button>
            </div>
          )}
          <div>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleThumbnailUpload}
              disabled={uploadingThumbnail}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            {uploadingThumbnail && (
              <p className="mt-2 text-sm text-gray-600">Fazendo upload...</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              JPG, PNG ou WEBP. Tamanho máximo: 5MB
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.ativo}
              onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="ml-2 text-sm text-gray-700">Curso ativo</span>
          </label>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          💡 A ordem de exibição pode ser ajustada arrastando os cursos na lista principal
        </p>
      </div>

      {/* Botões */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={() => router.push('/admin/cursos')}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Salvando...' : curso ? 'Atualizar Curso' : 'Criar Curso'}
        </button>
      </div>
    </form>
  )
}

