'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import RequireSubscription from '@/components/auth/RequireSubscription'
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

interface Material {
  id: string
  codigo: string
  titulo: string
  descricao?: string
  tipo: 'pdf' | 'video' | 'link' | 'imagem' | 'documento'
  categoria: string
  url: string
  tags?: string[]
}

export default function BibliotecaMateriaisPage() {
  return (
    <ProtectedRoute perfil="wellness" allowAdmin={true}>
      <RequireSubscription area="wellness">
        <ConditionalWellnessSidebar>
          <BibliotecaMateriaisContent />
        </ConditionalWellnessSidebar>
      </RequireSubscription>
    </ProtectedRoute>
  )
}

function BibliotecaMateriaisContent() {
  const router = useRouter()
  const authenticatedFetch = useAuthenticatedFetch()
  const [materiais, setMateriais] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroCategoria, setFiltroCategoria] = useState<string>('')

  useEffect(() => {
    const carregarMateriais = async () => {
      try {
        setLoading(true)
        const url = filtroCategoria 
          ? `/api/wellness/biblioteca/materiais?categoria=${filtroCategoria}`
          : '/api/wellness/biblioteca/materiais'
        
        const response = await authenticatedFetch(url, {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setMateriais(data.data || [])
          }
        }
      } catch (error) {
        console.error('Erro ao carregar materiais:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarMateriais()
  }, [authenticatedFetch, filtroCategoria])

  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      video: '🎥',
      link: '🔗',
      imagem: '🖼️',
      documento: '📝'
    }
    return icons[tipo] || '📄'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Carregando materiais...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.push('/pt/wellness/biblioteca')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 text-sm"
          >
            ← Voltar para Biblioteca
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">📄 Materiais de Apresentação</h1>
          <p className="text-lg text-gray-600">
            PDFs, vídeos e links para apresentações e materiais oficiais
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFiltroCategoria('')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filtroCategoria === ''
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            Todos
          </button>
          {['apresentacao', 'cartilha', 'produto', 'treinamento'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFiltroCategoria(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                filtroCategoria === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Lista de Materiais */}
        {materiais.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
            <p className="text-gray-600 mb-4">Nenhum material encontrado.</p>
            <p className="text-sm text-gray-500">
              Os materiais serão adicionados em breve. Em caso de dúvidas, fale com o NOEL.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materiais.map((material) => (
              <div
                key={material.id}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl flex-shrink-0">{getTipoIcon(material.tipo)}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{material.titulo}</h3>
                    {material.descricao && (
                      <p className="text-sm text-gray-600 mb-2">{material.descricao}</p>
                    )}
                    <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700 capitalize">
                      {material.categoria}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors text-center"
                  >
                    Abrir →
                  </a>
                  <button
                    onClick={() => router.push(`/pt/wellness/noel?buscar=${encodeURIComponent(material.titulo)}`)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    👤 NOEL
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
