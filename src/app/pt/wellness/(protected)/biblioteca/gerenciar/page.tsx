'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
// REMOVIDO: ProtectedRoute e RequireSubscription - layout server-side cuida disso
import ConditionalWellnessSidebar from '@/components/wellness/ConditionalWellnessSidebar'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'

interface Material {
  id: string
  codigo: string
  titulo: string
  descricao?: string
  tipo: 'pdf' | 'video' | 'link' | 'imagem' | 'documento'
  categoria: string
  url: string
  link_atalho?: string
  tags?: string[]
  ativo: boolean
  created_at: string
}

// Layout server-side já valida autenticação, perfil e assinatura
export default function GerenciarMateriaisPage() {
  return (
    <ConditionalWellnessSidebar>
      <GerenciarMateriaisContent />
    </ConditionalWellnessSidebar>
  )
}

function GerenciarMateriaisContent() {
  const router = useRouter()
  const { userProfile } = useAuth()
  const authenticatedFetch = useAuthenticatedFetch()
  const [materiais, setMateriais] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroCategoria, setFiltroCategoria] = useState<string>('')
  const [filtroTipo, setFiltroTipo] = useState<string>('')
  const [busca, setBusca] = useState('')
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [materialEditando, setMaterialEditando] = useState<Partial<Material> | null>(null)
  const [salvando, setSalvando] = useState(false)
  const [deletandoId, setDeletandoId] = useState<string | null>(null)

  // Verificar se é suporte ou admin
  const isAuthorized = userProfile && (userProfile.is_support || userProfile.is_admin)

  useEffect(() => {
    if (isAuthorized) {
      carregarMateriais()
    }
  }, [isAuthorized, filtroCategoria, filtroTipo, busca])

  const carregarMateriais = async () => {
    try {
      setLoading(true)
      let url = '/api/wellness/biblioteca/materiais'
      const params = new URLSearchParams()
      
      if (filtroCategoria) params.append('categoria', filtroCategoria)
      if (filtroTipo) params.append('tipo', filtroTipo)
      
      if (params.toString()) {
        url += '?' + params.toString()
      }
      
      const response = await authenticatedFetch(url, {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          let materiaisFiltrados = data.data || []
          
          // Filtrar por busca (título ou descrição)
          if (busca) {
            const buscaLower = busca.toLowerCase()
            materiaisFiltrados = materiaisFiltrados.filter((m: Material) =>
              m.titulo.toLowerCase().includes(buscaLower) ||
              (m.descricao && m.descricao.toLowerCase().includes(buscaLower))
            )
          }
          
          setMateriais(materiaisFiltrados)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar materiais:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEditar = (material: Material) => {
    setEditandoId(material.id)
    setMaterialEditando({
      titulo: material.titulo,
      descricao: material.descricao || '',
      categoria: material.categoria,
      link_atalho: material.link_atalho || ''
    })
  }

  const handleSalvarEdicao = async () => {
    if (!editandoId || !materialEditando) return

    try {
      setSalvando(true)
      const response = await authenticatedFetch('/api/wellness/biblioteca/materiais/' + editandoId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: materialEditando.titulo,
          descricao: materialEditando.descricao,
          categoria: materialEditando.categoria,
          link_atalho: materialEditando.link_atalho
        }),
        credentials: 'include'
      })

      if (response.ok) {
        await carregarMateriais()
        setEditandoId(null)
        setMaterialEditando(null)
      } else {
        const data = await response.json()
        alert('Erro ao salvar: ' + (data.error || 'Erro desconhecido'))
      }
    } catch (error: any) {
      alert('Erro ao salvar: ' + error.message)
    } finally {
      setSalvando(false)
    }
  }

  const handleDeletar = async (material: Material) => {
    if (!confirm(`Tem certeza que deseja deletar "${material.titulo}"?\n\nIsso irá remover o material da biblioteca e o arquivo do storage.`)) {
      return
    }

    try {
      setDeletandoId(material.id)
      const response = await authenticatedFetch('/api/wellness/biblioteca/materiais/' + material.id, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        await carregarMateriais()
      } else {
        const data = await response.json()
        alert('Erro ao deletar: ' + (data.error || 'Erro desconhecido'))
      }
    } catch (error: any) {
      alert('Erro ao deletar: ' + error.message)
    } finally {
      setDeletandoId(null)
    }
  }

  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, string> = {
      pdf: '📄',
      video: '🎥',
      link: '🔗',
      imagem: '🖼️',
      documento: '📝'
    }
    return icons[tipo] || '📎'
  }

  const renderPreview = (material: Material) => {
    if (material.tipo === 'imagem') {
      return (
        <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={material.url}
            alt={material.titulo}
            fill
            className="object-cover"
            sizes="80px"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              const parent = target.parentElement
              if (parent) {
                parent.innerHTML = `<div class="w-full h-full flex items-center justify-center"><span class="text-2xl">${getTipoIcon(material.tipo)}</span></div>`
              }
            }}
          />
        </div>
      )
    }
    
    if (material.tipo === 'video') {
      return (
        <div className="relative w-20 h-20 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
          <video
            src={material.url}
            className="w-full h-full object-cover"
            preload="metadata"
            muted
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <span className="text-white text-xl">▶️</span>
          </div>
        </div>
      )
    }
    
    return (
      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-3xl">{getTipoIcon(material.tipo)}</span>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Acesso Restrito</h1>
          <p className="text-gray-600 mb-6">
            Esta área é exclusiva para equipe de suporte e administradores.
          </p>
          <button
            onClick={() => router.push('/pt/wellness/biblioteca')}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
          >
            Voltar para Biblioteca
          </button>
        </div>
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
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/pt/wellness/biblioteca')}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2 text-sm"
          >
            ← Voltar para Biblioteca
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">📋 Gerenciar Materiais</h1>
              <p className="text-lg text-gray-600">
                Edite, delete ou visualize todos os materiais da biblioteca
              </p>
            </div>
            <button
              onClick={() => router.push('/pt/wellness/biblioteca/upload')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              + Adicionar Material
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Título ou descrição..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Filtro Categoria */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Todas</option>
                <option value="apresentacao">Apresentação</option>
                <option value="cartilha">Cartilha</option>
                <option value="produto">Produto</option>
                <option value="treinamento">Treinamento</option>
                <option value="script">Script</option>
                <option value="divulgacao">Divulgação</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            {/* Filtro Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Todos</option>
                <option value="pdf">PDF</option>
                <option value="video">Vídeo</option>
                <option value="imagem">Imagem</option>
                <option value="link">Link</option>
                <option value="documento">Documento</option>
              </select>
            </div>

            {/* Contador */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
              <div className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-center">
                <span className="text-2xl font-bold text-gray-900">{materiais.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Materiais */}
        {materiais.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
            <p className="text-gray-600 mb-4">Nenhum material encontrado.</p>
            <button
              onClick={() => router.push('/pt/wellness/biblioteca/upload')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              Adicionar Primeiro Material
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {materiais.map((material) => (
              <div
                key={material.id}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
              >
                {editandoId === material.id ? (
                  /* Modo Edição */
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      {renderPreview(material)}
                      <div className="flex-1 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                          <input
                            type="text"
                            value={materialEditando?.titulo || ''}
                            onChange={(e) => setMaterialEditando(prev => ({ ...prev, titulo: e.target.value }))}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                          <textarea
                            value={materialEditando?.descricao || ''}
                            onChange={(e) => setMaterialEditando(prev => ({ ...prev, descricao: e.target.value }))}
                            rows={2}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                            <select
                              value={materialEditando?.categoria || ''}
                              onChange={(e) => setMaterialEditando(prev => ({ ...prev, categoria: e.target.value }))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                              <option value="apresentacao">Apresentação</option>
                              <option value="cartilha">Cartilha</option>
                              <option value="produto">Produto</option>
                              <option value="treinamento">Treinamento</option>
                              <option value="script">Script</option>
                              <option value="divulgacao">Divulgação</option>
                              <option value="outro">Outro</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Link de Atalho</label>
                            <input
                              type="text"
                              value={materialEditando?.link_atalho || ''}
                              onChange={(e) => setMaterialEditando(prev => ({ ...prev, link_atalho: e.target.value }))}
                              placeholder="bebida-funcional"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            {materialEditando?.link_atalho && (
                              <p className="text-xs text-gray-500 mt-1">
                                Link: /m/{materialEditando.link_atalho}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setEditandoId(null)
                          setMaterialEditando(null)
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSalvarEdicao}
                        disabled={salvando}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {salvando ? 'Salvando...' : 'Salvar'}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Modo Visualização */
                  <div className="flex items-start gap-4">
                    {renderPreview(material)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{material.titulo}</h3>
                          {material.descricao && (
                            <p className="text-sm text-gray-600 mb-2">{material.descricao}</p>
                          )}
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className="inline-block px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700 capitalize">
                              {material.categoria}
                            </span>
                            <span className="inline-block px-2 py-1 bg-blue-100 rounded text-xs font-medium text-blue-700">
                              {material.tipo}
                            </span>
                            {material.link_atalho && (
                              <span className="inline-block px-2 py-1 bg-green-100 rounded text-xs font-medium text-green-700">
                                /m/{material.link_atalho}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            Criado em: {new Date(material.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <a
                          href={material.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Abrir →
                        </a>
                        <button
                          onClick={() => handleEditar(material)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDeletar(material)}
                          disabled={deletandoId === material.id}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletandoId === material.id ? 'Deletando...' : '🗑️ Deletar'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
