'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Documento {
  id: string
  file_url: string
  file_name: string
  file_size: number
  file_type: string
  file_extension: string
  document_type: string
  category: string | null
  description: string | null
  uploaded_at: string
}

interface DocumentosTabProps {
  clientId: string
}

export default function DocumentosTab({ clientId }: DocumentosTabProps) {
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [uploadando, setUploadando] = useState(false)
  const [mostrarModalUpload, setMostrarModalUpload] = useState(false)
  const [filtroTipo, setFiltroTipo] = useState<string>('todos')

  // Formulário de upload
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [tipoDocumento, setTipoDocumento] = useState('outro')
  const [categoria, setCategoria] = useState('')
  const [descricao, setDescricao] = useState('')

  useEffect(() => {
    carregarDocumentos()
  }, [clientId])

  const carregarDocumentos = async () => {
    try {
      setCarregando(true)
      setErro(null)
      const response = await fetch(`/api/nutri/clientes/${clientId}/documentos`, {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar documentos')
      }

      const data = await response.json()
      if (data.success) {
        setDocumentos(data.data.documents || [])
      }
    } catch (error: any) {
      console.error('Erro ao carregar documentos:', error)
      setErro(error.message || 'Erro ao carregar documentos')
    } finally {
      setCarregando(false)
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!arquivo) return

    try {
      setUploadando(true)
      setErro(null)

      const formData = new FormData()
      formData.append('file', arquivo)
      formData.append('document_type', tipoDocumento)
      if (categoria) formData.append('category', categoria)
      if (descricao) formData.append('description', descricao)

      const response = await fetch(`/api/nutri/clientes/${clientId}/documentos`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao fazer upload')
      }

      // Limpar formulário
      setArquivo(null)
      setTipoDocumento('outro')
      setCategoria('')
      setDescricao('')
      setMostrarModalUpload(false)

      // Recarregar documentos
      await carregarDocumentos()
    } catch (error: any) {
      console.error('Erro ao fazer upload:', error)
      setErro(error.message || 'Erro ao fazer upload')
    } finally {
      setUploadando(false)
    }
  }

  const handleDeletar = async (documentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este documento?')) return

    try {
      const response = await fetch(`/api/nutri/clientes/${clientId}/documentos/${documentId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir documento')
      }

      await carregarDocumentos()
    } catch (error: any) {
      console.error('Erro ao excluir documento:', error)
      setErro(error.message || 'Erro ao excluir documento')
    }
  }

  const formatarTamanho = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatarData = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getTipoLabel = (tipo: string) => {
    const labels: Record<string, string> = {
      exame: 'Exame',
      documento: 'Documento',
      receita: 'Receita',
      atestado: 'Atestado',
      imagem: 'Imagem',
      outro: 'Outro'
    }
    return labels[tipo] || tipo
  }

  const getTipoIcon = (tipo: string) => {
    const icons: Record<string, string> = {
      exame: '🔬',
      documento: '📄',
      receita: '💊',
      atestado: '🏥',
      imagem: '🖼️',
      outro: '📎'
    }
    return icons[tipo] || '📎'
  }

  const documentosFiltrados = filtroTipo === 'todos' 
    ? documentos 
    : documentos.filter(doc => doc.document_type === filtroTipo)

  const isImagem = (fileType: string) => {
    return fileType?.startsWith('image/')
  }

  if (carregando) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600 text-sm">Carregando documentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header com botão de upload */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Documentos e Exames</h2>
          <p className="text-sm text-gray-600 mt-1">
            Armazene exames, documentos e imagens enviados pelo cliente
          </p>
        </div>
        <button
          onClick={() => setMostrarModalUpload(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <span>📤</span>
          <span>Adicionar Documento</span>
        </button>
      </div>

      {/* Filtro por tipo */}
      {documentos.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Filtrar:</span>
          <button
            onClick={() => setFiltroTipo('todos')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              filtroTipo === 'todos'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {['exame', 'documento', 'receita', 'atestado', 'imagem', 'outro'].map((tipo) => (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(tipo)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === tipo
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {getTipoLabel(tipo)}
            </button>
          ))}
        </div>
      )}

      {/* Erro */}
      {erro && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{erro}</p>
        </div>
      )}

      {/* Lista de documentos */}
      {documentosFiltrados.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4">📁</div>
          <p className="text-gray-600 mb-2">
            {documentos.length === 0 
              ? 'Nenhum documento cadastrado ainda'
              : 'Nenhum documento encontrado com este filtro'}
          </p>
          <p className="text-sm text-gray-500">
            Clique em "Adicionar Documento" para começar
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentosFiltrados.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              {/* Preview de imagem ou ícone */}
              <div className="mb-3">
                {isImagem(doc.file_type) ? (
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={doc.file_url}
                      alt={doc.file_name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-6xl">{getTipoIcon(doc.document_type)}</span>
                  </div>
                )}
              </div>

              {/* Informações */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {getTipoLabel(doc.document_type)}
                  </span>
                  {doc.category && (
                    <span className="text-xs text-gray-500">{doc.category}</span>
                  )}
                </div>

                <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                  {doc.file_name}
                </h3>

                {doc.description && (
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {doc.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatarTamanho(doc.file_size)}</span>
                  <span>{formatarData(doc.uploaded_at)}</span>
                </div>

                {/* Ações */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    Ver
                  </a>
                  <button
                    onClick={() => handleDeletar(doc.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Upload */}
      {mostrarModalUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Adicionar Documento</h3>
              <button
                onClick={() => setMostrarModalUpload(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              {/* Arquivo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Arquivo *
                </label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Imagens (JPG, PNG, WEBP) ou PDF. Máximo 10MB.
                </p>
              </div>

              {/* Tipo de documento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Documento *
                </label>
                <select
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="exame">Exame</option>
                  <option value="documento">Documento</option>
                  <option value="receita">Receita</option>
                  <option value="atestado">Atestado</option>
                  <option value="imagem">Imagem</option>
                  <option value="outro">Outro</option>
                </select>
              </div>

              {/* Categoria */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria (opcional)
                </label>
                <input
                  type="text"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Ex: Sangue, Urina, Raio-X"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Adicione uma descrição ou observação sobre este documento"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Botões */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setMostrarModalUpload(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={uploadando}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploadando || !arquivo}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadando ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

