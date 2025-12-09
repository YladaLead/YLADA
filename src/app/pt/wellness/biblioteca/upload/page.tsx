'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

type CategoriaSelecionada = 'recrutamento' | 'vendas' | 'treinamento' | 'produtos' | 'scripts' | 'apresentacoes'

interface Categoria {
  id: CategoriaSelecionada
  label: string
  descricao: string
  icone: string
  cor: string
}

const categorias: Categoria[] = [
  {
    id: 'recrutamento',
    label: 'Recrutamento',
    descricao: 'Vídeos e materiais para recrutar novos distribuidores',
    icone: '👥',
    cor: 'blue'
  },
  {
    id: 'vendas',
    label: 'Vendas',
    descricao: 'Materiais para apresentações e fechamento de vendas',
    icone: '💰',
    cor: 'green'
  },
  {
    id: 'treinamento',
    label: 'Treinamento',
    descricao: 'Cartilhas e guias de treinamento',
    icone: '📚',
    cor: 'purple'
  },
  {
    id: 'produtos',
    label: 'Produtos & Bebidas',
    descricao: 'Materiais sobre produtos e preparo de bebidas',
    icone: '🥤',
    cor: 'emerald'
  },
  {
    id: 'scripts',
    label: 'Scripts',
    descricao: 'Scripts prontos para diferentes situações',
    icone: '💬',
    cor: 'orange'
  },
  {
    id: 'apresentacoes',
    label: 'Apresentações',
    descricao: 'Materiais de apresentação e pitch',
    icone: '📊',
    cor: 'red'
  }
]

const getCorClasses = (cor: string) => {
  const cores: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-300 text-blue-700',
    green: 'bg-green-50 border-green-300 text-green-700',
    purple: 'bg-purple-50 border-purple-300 text-purple-700',
    emerald: 'bg-emerald-50 border-emerald-300 text-emerald-700',
    orange: 'bg-orange-50 border-orange-300 text-orange-700',
    red: 'bg-red-50 border-red-300 text-red-700'
  }
  return cores[cor] || 'bg-gray-50 border-gray-300 text-gray-700'
}

export default function UploadBibliotecaPage() {
  const router = useRouter()
  const { user, userProfile, loading, isAuthenticated } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [categoria, setCategoria] = useState<CategoriaSelecionada | null>(null)
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [uploading, setUploading] = useState(false)
  const [sucesso, setSucesso] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Verificação simplificada de autorização
  useEffect(() => {
    // Timeout de segurança: após 2 segundos, parar de verificar
    const timeout = setTimeout(() => {
      setCheckingAuth(false)
    }, 2000)

    // Se não está mais carregando, parar verificação
    if (!loading) {
      setCheckingAuth(false)
      clearTimeout(timeout)
    }

    return () => clearTimeout(timeout)
  }, [loading])

  // Redirecionar se não autenticado (após timeout)
  useEffect(() => {
    if (!checkingAuth && !loading && (!isAuthenticated || !user)) {
      router.push('/pt/wellness/login')
    }
  }, [checkingAuth, loading, isAuthenticated, user, router])

  // Verificar se é suporte ou admin (apenas após perfil carregar)
  const isAuthorized = !loading && !checkingAuth && userProfile && (userProfile.is_support || userProfile.is_admin)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setArquivo(file)
      // Preencher título automaticamente se vazio
      if (!titulo) {
        setTitulo(file.name.replace(/\.[^/.]+$/, ''))
      }
      setErro(null)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setArquivo(file)
      if (!titulo) {
        setTitulo(file.name.replace(/\.[^/.]+$/, ''))
      }
      setErro(null)
    }
  }

  const handleUpload = async () => {
    if (!arquivo) {
      setErro('Por favor, selecione um arquivo')
      return
    }

    if (!categoria) {
      setErro('Por favor, selecione uma categoria')
      return
    }

    setUploading(true)
    setErro(null)
    setSucesso(false)

    try {
      const formData = new FormData()
      formData.append('file', arquivo)
      formData.append('categoria', categoria)
      if (titulo) formData.append('titulo', titulo)
      if (descricao) formData.append('descricao', descricao)

      const response = await fetch('/api/wellness/biblioteca/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer upload')
      }

      setSucesso(true)
      setArquivo(null)
      setTitulo('')
      setDescricao('')
      setCategoria(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Limpar sucesso após 3 segundos
      setTimeout(() => {
        setSucesso(false)
      }, 3000)
    } catch (err: any) {
      console.error('Erro ao fazer upload:', err)
      setErro(err.message || 'Erro ao fazer upload. Tente novamente.')
    } finally {
      setUploading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileTypeIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (['mp4', 'mpeg', 'mov', 'avi', 'webm'].includes(ext || '')) return '🎥'
    if (ext === 'pdf') return '📄'
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return '🖼️'
    return '📎'
  }

  // Loading state simplificado
  if (loading || checkingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Verificar autorização
  if (!isAuthorized) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Acesso Restrito
            </h1>
            <p className="text-gray-600 mb-6">
              Esta área é exclusiva para a equipe de suporte. Se você precisa fazer upload de materiais, entre em contato com o administrador.
            </p>
            <button
              onClick={() => router.push('/pt/wellness/home')}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              Voltar para Home
            </button>
          </div>
        </div>
    )
  }

  // Conteúdo principal (apenas se autorizado)
  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/pt/wellness/home')}
              className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
            >
              ← Voltar para Home
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              📚 Adicionar Material à Biblioteca
            </h1>
            <p className="text-lg text-gray-600">
              Faça upload de vídeos, PDFs e imagens para a biblioteca Wellness
            </p>
          </div>

          {/* Card Principal */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
            {/* Área de Upload */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arquivo <span className="text-red-500">*</span>
              </label>
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.mp4,.mpeg,.mov,.avi,.webm,.jpg,.jpeg,.png,.gif,.webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                {arquivo ? (
                  <div className="space-y-2">
                    <div className="text-4xl">{getFileTypeIcon(arquivo.name)}</div>
                    <p className="font-medium text-gray-900">{arquivo.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(arquivo.size)}</p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setArquivo(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remover arquivo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-4xl">📁</div>
                    <p className="text-gray-600">
                      Arraste arquivos aqui ou <span className="text-green-600 font-medium">clique para selecionar</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      PDFs, Vídeos (MP4, MOV, AVI) e Imagens (JPG, PNG)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Seleção de Categoria */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Categoria <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categorias.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setCategoria(cat.id)
                      setErro(null)
                    }}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      categoria === cat.id
                        ? `${getCorClasses(cat.cor)} border-2`
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{cat.icone}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{cat.label}</p>
                        <p className="text-xs text-gray-600 mt-1">{cat.descricao}</p>
                      </div>
                      {categoria === cat.id && (
                        <span className="text-green-600">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Título */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título (opcional)
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Vídeo de Recrutamento - Como Apresentar o Negócio"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Se deixar vazio, será usado o nome do arquivo
              </p>
            </div>

            {/* Descrição */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o conteúdo do material..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Mensagens */}
            {erro && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                <p className="font-medium">❌ Erro</p>
                <p className="text-sm">{erro}</p>
              </div>
            )}

            {sucesso && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                <p className="font-medium">✅ Material adicionado com sucesso!</p>
                <p className="text-sm">O material foi organizado automaticamente na biblioteca.</p>
              </div>
            )}

            {/* Botão Upload */}
            <div className="flex gap-3">
              <button
                onClick={handleUpload}
                disabled={uploading || !arquivo || !categoria}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
                  uploading || !arquivo || !categoria
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
                }`}
              >
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Enviando...
                  </span>
                ) : (
                  '✅ Adicionar à Biblioteca'
                )}
              </button>
              <button
                onClick={() => router.push('/pt/wellness/home')}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>

          {/* Informações */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>💡 Dica:</strong> O material será automaticamente organizado na seção correta da biblioteca baseado na categoria selecionada.
            </p>
          </div>
        </div>
      </div>
  )
}
