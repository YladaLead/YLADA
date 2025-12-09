'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import Link from 'next/link'

interface Material {
  id: string
  codigo: string
  titulo: string
  descricao: string | null
  tipo: 'pdf' | 'video' | 'link' | 'imagem' | 'documento'
  categoria: string
  url: string
  link_atalho: string | null
}

interface User {
  id: string
  email: string
  nome: string
  area?: string
}

function AdminNotificacoesPushContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [materiais, setMateriais] = useState<Material[]>([])
  const [usuarios, setUsuarios] = useState<User[]>([])
  const [carregandoMateriais, setCarregandoMateriais] = useState(true)
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(true)
  
  // Formulário
  const [titulo, setTitulo] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [urlDestino, setUrlDestino] = useState('')
  const [materialSelecionado, setMaterialSelecionado] = useState<string>('')
  const [tipoEnvio, setTipoEnvio] = useState<'all' | 'specific'>('all')
  const [usuariosSelecionados, setUsuariosSelecionados] = useState<string[]>([])
  const [filtroTipo, setFiltroTipo] = useState<string>('')
  const [filtroCategoria, setFiltroCategoria] = useState<string>('')
  
  // Resultado
  const [resultado, setResultado] = useState<{
    success: boolean
    sent: number
    failed: number
    total: number
    message: string
  } | null>(null)

  // Carregar materiais
  useEffect(() => {
    const carregarMateriais = async () => {
      try {
        setCarregandoMateriais(true)
        const url = filtroTipo || filtroCategoria
          ? `/api/wellness/biblioteca/materiais?${filtroTipo ? `tipo=${filtroTipo}` : ''}${filtroCategoria ? `&categoria=${filtroCategoria}` : ''}`
          : '/api/wellness/biblioteca/materiais'
        
        const response = await fetch(url, {
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
        setCarregandoMateriais(false)
      }
    }

    carregarMateriais()
  }, [filtroTipo, filtroCategoria])

  // Carregar usuários (apenas wellness)
  useEffect(() => {
    const carregarUsuarios = async () => {
      try {
        setCarregandoUsuarios(true)
        const response = await fetch('/api/admin/usuarios?area=wellness', {
          credentials: 'include'
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.usuarios) {
            setUsuarios(data.usuarios)
          }
        }
      } catch (error) {
        console.error('Erro ao carregar usuários:', error)
      } finally {
        setCarregandoUsuarios(false)
      }
    }

    if (tipoEnvio === 'specific') {
      carregarUsuarios()
    }
  }, [tipoEnvio])

  // Quando selecionar material, preencher automaticamente
  useEffect(() => {
    if (materialSelecionado) {
      const material = materiais.find(m => m.id === materialSelecionado)
      if (material) {
        // Preencher título e mensagem
        if (!titulo) {
          setTitulo(`📚 ${material.titulo}`)
        }
        if (!mensagem) {
          setMensagem(material.descricao || `Confira este material: ${material.titulo}`)
        }
        
        // Preencher URL baseado no tipo
        if (!urlDestino) {
          if (material.link_atalho) {
            setUrlDestino(`/m/${material.link_atalho}`)
          } else if (material.tipo === 'video') {
            setUrlDestino(`/pt/wellness/biblioteca/videos`)
          } else if (material.tipo === 'pdf') {
            setUrlDestino(`/pt/wellness/biblioteca/materiais`)
          } else {
            setUrlDestino(material.url)
          }
        }
      }
    }
  }, [materialSelecionado, materiais])

  const handleToggleUsuario = (userId: string) => {
    setUsuariosSelecionados(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelecionarTodosUsuarios = () => {
    if (usuariosSelecionados.length === usuarios.length) {
      setUsuariosSelecionados([])
    } else {
      setUsuariosSelecionados(usuarios.map(u => u.id))
    }
  }

  const handleEnviar = async () => {
    if (!titulo || !mensagem) {
      alert('Preencha título e mensagem!')
      return
    }

    if (tipoEnvio === 'specific' && usuariosSelecionados.length === 0) {
      alert('Selecione pelo menos um usuário!')
      return
    }

    setEnviando(true)
    setResultado(null)

    try {
      const response = await fetch('/api/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          user_ids: tipoEnvio === 'all' ? 'all' : usuariosSelecionados,
          title: titulo,
          body: mensagem,
          url: urlDestino || '/pt/wellness/home',
          tag: 'admin-notification'
        })
      })

      const data = await response.json()

      if (data.success) {
        setResultado({
          success: true,
          sent: data.sent || 0,
          failed: data.failed || 0,
          total: data.total || 0,
          message: data.message || 'Notificações enviadas!'
        })
        
        // Limpar formulário
        setTitulo('')
        setMensagem('')
        setUrlDestino('')
        setMaterialSelecionado('')
        setUsuariosSelecionados([])
      } else {
        setResultado({
          success: false,
          sent: 0,
          failed: 0,
          total: 0,
          message: data.error || 'Erro ao enviar notificações'
        })
      }
    } catch (error: any) {
      console.error('Erro ao enviar:', error)
      setResultado({
        success: false,
        sent: 0,
        failed: 0,
        total: 0,
        message: error.message || 'Erro ao enviar notificações'
      })
    } finally {
      setEnviando(false)
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
    return icons[tipo] || '📄'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">🔔 Enviar Notificações Push</h1>
              <p className="mt-2 text-gray-600">
                Envie notificações para usuários Wellness com links para materiais, vídeos e PDFs
              </p>
            </div>
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Voltar
            </Link>
          </div>
        </div>

        {/* Resultado */}
        {resultado && (
          <div className={`mb-6 p-4 rounded-lg ${
            resultado.success 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <p className="font-semibold">{resultado.message}</p>
            {resultado.success && (
              <p className="text-sm mt-1">
                ✅ {resultado.sent} enviadas | ❌ {resultado.failed} falhas | 📊 {resultado.total} total
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda: Seleção de Material */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📚 Selecionar Material</h2>
              
              {/* Filtros */}
              <div className="mb-4 space-y-2">
                <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Todos os tipos</option>
                  <option value="video">🎥 Vídeos</option>
                  <option value="pdf">📄 PDFs</option>
                  <option value="link">🔗 Links</option>
                  <option value="imagem">🖼️ Imagens</option>
                </select>
                
                <select
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="">Todas as categorias</option>
                  <option value="apresentacao">Apresentação</option>
                  <option value="cartilha">Cartilha</option>
                  <option value="produto">Produto</option>
                  <option value="treinamento">Treinamento</option>
                  <option value="script">Script</option>
                  <option value="divulgacao">Divulgação</option>
                </select>
              </div>

              {/* Lista de Materiais */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {carregandoMateriais ? (
                  <p className="text-sm text-gray-500 text-center py-4">Carregando materiais...</p>
                ) : materiais.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">Nenhum material encontrado</p>
                ) : (
                  materiais.map((material) => (
                    <button
                      key={material.id}
                      onClick={() => setMaterialSelecionado(material.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        materialSelecionado === material.id
                          ? 'bg-green-50 border-green-300'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{getTipoIcon(material.tipo)}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900 truncate">
                            {material.titulo}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {material.categoria} • {material.tipo}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Coluna Direita: Formulário */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              <h2 className="text-xl font-bold text-gray-900">✏️ Criar Notificação</h2>

              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título da Notificação *
                </label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Novo vídeo disponível!"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  maxLength={100}
                />
                <p className="text-xs text-gray-500 mt-1">{titulo.length}/100 caracteres</p>
              </div>

              {/* Mensagem */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem *
                </label>
                <textarea
                  value={mensagem}
                  onChange={(e) => setMensagem(e.target.value)}
                  placeholder="Ex: Confira o novo material de treinamento na biblioteca!"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{mensagem.length}/500 caracteres</p>
              </div>

              {/* URL de Destino */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de Destino (opcional)
                </label>
                <input
                  type="text"
                  value={urlDestino}
                  onChange={(e) => setUrlDestino(e.target.value)}
                  placeholder="/pt/wellness/biblioteca/videos"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Onde o usuário será redirecionado ao clicar na notificação
                </p>
              </div>

              {/* Tipo de Envio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enviar para
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="tipoEnvio"
                      value="all"
                      checked={tipoEnvio === 'all'}
                      onChange={(e) => setTipoEnvio(e.target.value as 'all' | 'specific')}
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="text-gray-700">📢 Todos os usuários Wellness</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="tipoEnvio"
                      value="specific"
                      checked={tipoEnvio === 'specific'}
                      onChange={(e) => setTipoEnvio(e.target.value as 'all' | 'specific')}
                      className="w-4 h-4 text-green-600"
                    />
                    <span className="text-gray-700">👥 Usuários específicos</span>
                  </label>
                </div>
              </div>

              {/* Seleção de Usuários */}
              {tipoEnvio === 'specific' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Selecionar Usuários ({usuariosSelecionados.length} selecionados)
                    </label>
                    <button
                      onClick={handleSelecionarTodosUsuarios}
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      {usuariosSelecionados.length === usuarios.length ? 'Desmarcar todos' : 'Selecionar todos'}
                    </button>
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3 space-y-2">
                    {carregandoUsuarios ? (
                      <p className="text-sm text-gray-500 text-center py-4">Carregando usuários...</p>
                    ) : usuarios.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">Nenhum usuário encontrado</p>
                    ) : (
                      usuarios.map((usuario) => (
                        <label
                          key={usuario.id}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={usuariosSelecionados.includes(usuario.id)}
                            onChange={() => handleToggleUsuario(usuario.id)}
                            className="w-4 h-4 text-green-600 rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {usuario.nome || 'Sem nome'}
                            </p>
                            <p className="text-xs text-gray-500">{usuario.email}</p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Botão Enviar */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleEnviar}
                  disabled={enviando || !titulo || !mensagem}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  {enviando ? (
                    <>
                      <span className="animate-spin">⏳</span>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <span>🔔</span>
                      <span>Enviar Notificação</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  {tipoEnvio === 'all' 
                    ? 'A notificação será enviada para todos os usuários Wellness que ativaram notificações push'
                    : `${usuariosSelecionados.length} usuário(s) selecionado(s)`
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminNotificacoesPushPage() {
  return (
    <AdminProtectedRoute>
      <AdminNotificacoesPushContent />
    </AdminProtectedRoute>
  )
}
