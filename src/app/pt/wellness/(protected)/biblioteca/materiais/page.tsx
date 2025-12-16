'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
// REMOVIDO: ProtectedRoute e RequireSubscription - layout server-side cuida disso
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

// Layout server-side já valida autenticação, perfil e assinatura
export default function BibliotecaMateriaisPage() {
  return (
    <ConditionalWellnessSidebar>
      <BibliotecaMateriaisContent />
    </ConditionalWellnessSidebar>
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

  const handleDownload = async (material: Material) => {
    try {
      const response = await fetch(material.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      // Extrair extensão do arquivo ou usar baseado no tipo
      const extension = material.url.split('.').pop()?.split('?')[0] || 
        (material.tipo === 'pdf' ? 'pdf' : 
         material.tipo === 'video' ? 'mp4' : 
         material.tipo === 'imagem' ? 'jpg' : 'file')
      
      a.download = `${material.titulo}.${extension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error)
      // Fallback: abrir em nova aba
      window.open(material.url, '_blank')
    }
  }

  const podeBaixar = (tipo: string) => {
    return ['imagem', 'video', 'pdf', 'documento'].includes(tipo)
  }

  const getBotaoTexto = (tipo: string) => {
    if (tipo === 'video') return 'Assistir'
    return 'Abrir'
  }

  const renderPreview = (material: Material) => {
    // Para imagens: mostrar preview
    if (material.tipo === 'imagem') {
      return (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-4">
          <Image
            src={material.url}
            alt={material.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              // Fallback para ícone se imagem não carregar
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `<div class="w-full h-48 flex items-center justify-center"><span class="text-6xl">${getTipoIcon(material.tipo)}</span></div>`
              }
            }}
          />
        </div>
      )
    }
    
    // Para vídeos: mostrar preview com primeiro frame
    if (material.tipo === 'video') {
      return (
        <div className="relative w-full h-48 bg-gray-900 rounded-lg overflow-hidden mb-4 group">
          <video
            src={material.url}
            className="w-full h-full object-cover"
            preload="metadata"
            muted
            playsInline
            onMouseEnter={(e) => {
              const video = e.currentTarget
              video.currentTime = 1 // Mostrar frame 1 segundo
              video.play().catch(() => {}) // Tentar play no hover
            }}
            onMouseLeave={(e) => {
              const video = e.currentTarget
              video.pause()
              video.currentTime = 0
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all">
            <div className="bg-white bg-opacity-90 rounded-full p-3 group-hover:scale-110 transition-transform">
              <span className="text-2xl">▶️</span>
            </div>
          </div>
        </div>
      )
    }
    
    // Para outros tipos: mostrar ícone grande
    return (
      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
        <span className="text-6xl">{getTipoIcon(material.tipo)}</span>
      </div>
    )
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
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                {/* Preview/Thumbnail */}
                {renderPreview(material)}
                
                {/* Conteúdo */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{material.titulo}</h3>
                  {material.descricao && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{material.descricao}</p>
                  )}
                  <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700 capitalize mb-4">
                    {material.categoria}
                  </span>
                  <div className={`flex gap-2 ${podeBaixar(material.tipo) ? '' : 'flex-col'}`}>
                    <a
                      href={material.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors text-center ${
                        podeBaixar(material.tipo) ? 'flex-1' : 'w-full'
                      }`}
                    >
                      {getBotaoTexto(material.tipo)} →
                    </a>
                    {podeBaixar(material.tipo) && (
                      <button
                        onClick={() => handleDownload(material)}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                        title="Baixar arquivo"
                      >
                        ⬇️ Baixar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
