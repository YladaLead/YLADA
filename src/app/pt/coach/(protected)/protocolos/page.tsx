'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import CoachSidebar from '@/components/coach/CoachSidebar'
import { useAuth } from '@/contexts/AuthContext'

type BibliotecaItem = {
  id: string
  item_type: 'protocolo' | 'referencia' | 'bloco'
  title: string
  description: string | null
  tags: string[] | null
  file_url: string
  file_name: string
  file_size: number | null
  file_type: string | null
  uploaded_at: string
}

export default function ProtocolosCoachPage() {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [aba, setAba] = useState<'base' | 'biblioteca' | 'blocos'>('biblioteca')

  const [carregandoBiblioteca, setCarregandoBiblioteca] = useState(false)
  const [erroBiblioteca, setErroBiblioteca] = useState<string | null>(null)
  const [biblioteca, setBiblioteca] = useState<BibliotecaItem[]>([])
  const [busca, setBusca] = useState('')

  const [mostrarModalUpload, setMostrarModalUpload] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadTitulo, setUploadTitulo] = useState('')
  const [uploadDescricao, setUploadDescricao] = useState('')
  const [uploadTags, setUploadTags] = useState('')
  const [uploadTipo, setUploadTipo] = useState<'protocolo' | 'referencia' | 'bloco'>('protocolo')
  const [uploadando, setUploadando] = useState(false)

  const protocolosBase = useMemo(
    () => [
      {
        id: 'reset-metabolico',
        title: 'Reset Metabólico',
        subtitle: 'Organização de estímulos + refeições com função + repetição estratégica.',
        tags: ['reset', 'desinchar', 'energia', 'metabolismo'],
      },
      {
        id: 'detox',
        title: 'Detox (dia seguinte / festa / viagem)',
        subtitle: 'Leveza, desinchaço e retomada do foco com estratégia.',
        tags: ['detox', 'desinchar', 'rotina'],
      },
      {
        id: 'proteico',
        title: 'Protocolo Proteico',
        subtitle: 'Refeições proteicas práticas + saciedade + controle de apetite.',
        tags: ['proteína', 'saciedade', 'praticidade'],
      },
      {
        id: 'ganho-massa',
        title: 'Ganho de Massa',
        subtitle: 'Rotina com foco em proteína, treino e recuperação.',
        tags: ['massa', 'treino', 'recuperação'],
      },
    ],
    []
  )

  const carregarBiblioteca = async () => {
    try {
      setCarregandoBiblioteca(true)
      setErroBiblioteca(null)

      const response = await fetch(`/api/coach/protocolos/biblioteca?item_type=${aba === 'blocos' ? 'bloco' : 'protocolo'}`, {
        credentials: 'include',
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao carregar biblioteca')
      }

      setBiblioteca(data.data?.items || [])
    } catch (e: any) {
      setErroBiblioteca(e?.message || 'Erro ao carregar biblioteca')
      setBiblioteca([])
    } finally {
      setCarregandoBiblioteca(false)
    }
  }

  useEffect(() => {
    if (!user) return
    if (aba === 'biblioteca' || aba === 'blocos') {
      carregarBiblioteca()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, aba])

  const bibliotecaFiltrada = useMemo(() => {
    const q = busca.trim().toLowerCase()
    if (!q) return biblioteca
    return biblioteca.filter((item) => {
      const tags = (item.tags || []).join(' ').toLowerCase()
      return (
        item.title?.toLowerCase().includes(q) ||
        item.file_name?.toLowerCase().includes(q) ||
        tags.includes(q)
      )
    })
  }, [biblioteca, busca])

  const formatarTamanho = (bytes: number | null) => {
    if (!bytes || bytes <= 0) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) return

    try {
      setUploadando(true)
      setErroBiblioteca(null)

      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('item_type', uploadTipo)
      if (uploadTitulo.trim()) formData.append('title', uploadTitulo.trim())
      if (uploadDescricao.trim()) formData.append('description', uploadDescricao.trim())
      if (uploadTags.trim()) formData.append('tags', uploadTags.trim())

      const response = await fetch('/api/coach/protocolos/biblioteca', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao fazer upload')
      }

      // Reset e recarregar
      setUploadFile(null)
      setUploadTitulo('')
      setUploadDescricao('')
      setUploadTags('')
      setUploadTipo('protocolo')
      setMostrarModalUpload(false)
      await carregarBiblioteca()
    } catch (e: any) {
      setErroBiblioteca(e?.message || 'Erro ao fazer upload')
    } finally {
      setUploadando(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CoachSidebar isMobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />

      <div className="flex-1 lg:ml-56">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setMobileMenuOpen(true)} className="p-2 text-gray-600 hover:text-gray-900">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Protocolos</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">📑 Protocolos</h1>
              <p className="text-gray-600 mt-1">
                Crie e ajuste textos de protocolos a partir de modelos, exceções e referências — prontos para colar no Gama.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {(aba === 'biblioteca' || aba === 'blocos') && (
                <button
                  onClick={() => setMostrarModalUpload(true)}
                  className="inline-flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:border-purple-300 hover:bg-purple-50 transition-colors text-sm font-medium"
                >
                  <span>📤</span>
                  Upload
                </button>
              )}
              <Link
                href="/pt/coach/protocolos/novo"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
              >
                <span>➕</span>
                Novo Protocolo
              </Link>
            </div>
          </div>

          {/* Abas */}
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAba('biblioteca')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                aba === 'biblioteca' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              📚 Biblioteca (uploads)
            </button>
            <button
              type="button"
              onClick={() => setAba('base')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                aba === 'base' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              🧱 Protocolos base
            </button>
            <button
              type="button"
              onClick={() => setAba('blocos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                aba === 'blocos' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              🧩 Blocos / lembretes
            </button>
          </div>

          {/* Conteúdo */}
          {aba === 'base' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Menu de protocolos (referência para exceções)</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Esses protocolos base servem como “ponto de partida” e referência. Depois, o diagnóstico aplica as exceções e gera o texto final.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {protocolosBase.map((p) => (
                  <div key={p.id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{p.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{p.subtitle}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {p.tags.map((t) => (
                            <span key={t} className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-1 rounded">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Link
                        href="/pt/coach/protocolos/novo"
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium whitespace-nowrap"
                      >
                        Usar →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(aba === 'biblioteca' || aba === 'blocos') && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Buscar</label>
                  <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Nome, arquivo ou tag..."
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  {carregandoBiblioteca ? 'Carregando...' : `${bibliotecaFiltrada.length} item(ns)`}
                </div>
              </div>

              {erroBiblioteca && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{erroBiblioteca}</p>
                  <p className="text-red-700 text-xs mt-1">
                    Se for a primeira vez usando esta funcionalidade, lembre de rodar a migration da tabela `coach_protocol_library` no Supabase.
                  </p>
                </div>
              )}

              {carregandoBiblioteca ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mx-auto mb-3"></div>
                  <p className="text-gray-600">Carregando biblioteca...</p>
                </div>
              ) : bibliotecaFiltrada.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 text-center">
                  <div className="text-6xl mb-4">{aba === 'blocos' ? '🧩' : '📚'}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {aba === 'blocos' ? 'Nenhum bloco cadastrado ainda' : 'Nenhum protocolo enviado ainda'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {aba === 'blocos'
                      ? 'Suba lembretes/tópicos prontos para reutilizar em vários protocolos.'
                      : 'Suba PDFs, imagens, vídeos ou textos como referência para diagnóstico e exceções.'}
                  </p>
                  <button
                    onClick={() => setMostrarModalUpload(true)}
                    className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                  >
                    <span>📤</span>
                    Fazer upload
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {bibliotecaFiltrada.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {item.file_name} {formatarTamanho(item.file_size) ? `• ${formatarTamanho(item.file_size)}` : ''}
                          </p>
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded whitespace-nowrap">
                          {item.file_type?.startsWith('image/')
                            ? 'imagem'
                            : item.file_type?.startsWith('video/')
                              ? 'vídeo'
                              : item.file_type === 'application/pdf'
                                ? 'pdf'
                                : 'texto'}
                        </span>
                      </div>

                      {item.description && <p className="text-sm text-gray-600 mt-3 line-clamp-2">{item.description}</p>}

                      {item.tags && item.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.tags.slice(0, 6).map((t) => (
                            <span key={t} className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-1 rounded">
                              {t}
                            </span>
                          ))}
                          {item.tags.length > 6 && <span className="text-xs text-gray-500">+{item.tags.length - 6}</span>}
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-2">
                        <a
                          href={item.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors text-center"
                        >
                          Ver
                        </a>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              await navigator.clipboard.writeText(item.file_url)
                            } catch {
                              // silencioso
                            }
                          }}
                          className="px-3 py-2 bg-purple-100 text-purple-700 text-sm rounded-lg hover:bg-purple-200 transition-colors"
                        >
                          Copiar link
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            if (!confirm('Tem certeza que deseja remover este item da biblioteca?')) return
                            try {
                              await fetch(`/api/coach/protocolos/biblioteca/${item.id}`, {
                                method: 'DELETE',
                                credentials: 'include',
                              })
                              await carregarBiblioteca()
                            } catch {
                              // silencioso
                            }
                          }}
                          className="px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Upload */}
      {mostrarModalUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">📤 Upload para Biblioteca</h3>
              <button onClick={() => setMostrarModalUpload(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                <select
                  value={uploadTipo}
                  onChange={(e) => setUploadTipo(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="protocolo">Protocolo (PDF/texto)</option>
                  <option value="referencia">Referência (imagem/vídeo/PDF)</option>
                  <option value="bloco">Bloco / lembrete (texto)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Arquivo *</label>
                <input
                  type="file"
                  accept="image/*,application/pdf,video/*,text/plain,text/markdown"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">PDF, imagem, vídeo ou texto. Máximo 25MB.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Título (opcional)</label>
                <input
                  type="text"
                  value={uploadTitulo}
                  onChange={(e) => setUploadTitulo(e.target.value)}
                  placeholder="Ex: Reset Metabólico - Modelo oficial"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (opcional)</label>
                <input
                  type="text"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="Ex: reset, desinchar, sem lactose, EUA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Separe por vírgula.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição (opcional)</label>
                <textarea
                  value={uploadDescricao}
                  onChange={(e) => setUploadDescricao(e.target.value)}
                  rows={3}
                  placeholder="Para que serve, quando usar, observações..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
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
                  disabled={uploadando || !uploadFile}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

