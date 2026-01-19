'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import CoachSidebar from '@/components/coach/CoachSidebar'
import { useAuth } from '@/contexts/AuthContext'

type ProtocoloBase = {
  id: string
  title: string
  description: string
  tags: string[]
}

type BibliotecaItem = {
  id: string
  title: string
  file_url: string
  file_name: string
  tags: string[] | null
  description: string | null
}

export default function NovoProtocoloCoachPage() {
  const { user, loading } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [templateId, setTemplateId] = useState<string>('reset-metabolico')
  const [bibliotecaProtocolos, setBibliotecaProtocolos] = useState<BibliotecaItem[]>([])
  const [bibliotecaReferencias, setBibliotecaReferencias] = useState<BibliotecaItem[]>([])
  const [carregandoBiblioteca, setCarregandoBiblioteca] = useState(false)
  const [buscaReferencia, setBuscaReferencia] = useState('')
  const [referenciasSelecionadas, setReferenciasSelecionadas] = useState<Record<string, boolean>>({})

  const [mostrarModalUploadReferencia, setMostrarModalUploadReferencia] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadTitulo, setUploadTitulo] = useState('')
  const [uploadTags, setUploadTags] = useState('')
  const [uploadDescricao, setUploadDescricao] = useState('')
  const [uploadando, setUploadando] = useState(false)

  const [contexto, setContexto] = useState<string>('')
  const [pedidoCoach, setPedidoCoach] = useState<string>('')
  const [excecoes, setExcecoes] = useState<Record<string, boolean>>({
    semLactose: false,
    vegetariana: false,
    semOvos: false,
    turnoNoturno: false,
    semSuplementos: false,
    naoFazCha: false,
  })

  const protocolosBase: ProtocoloBase[] = useMemo(
    () => [
      {
        id: 'reset-metabolico',
        title: 'Reset Metabólico',
        description: 'Organização de estímulos + refeições com função + repetição estratégica.',
        tags: ['reset', 'desinchar', 'energia', 'metabolismo'],
      },
      {
        id: 'detox',
        title: 'Detox (dia seguinte / festa / viagem)',
        description: 'Leveza, desinchaço e retomada do foco com estratégia.',
        tags: ['detox', 'desinchar', 'rotina'],
      },
      {
        id: 'proteico',
        title: 'Protocolo Proteico',
        description: 'Refeições proteicas práticas + saciedade + controle de apetite.',
        tags: ['proteína', 'saciedade', 'praticidade'],
      },
      {
        id: 'ganho-massa',
        title: 'Ganho de Massa',
        description: 'Rotina com foco em proteína, treino e recuperação.',
        tags: ['massa', 'treino', 'recuperação'],
      },
    ],
    []
  )

  useEffect(() => {
    if (!user) return
    const carregar = async () => {
      try {
        setCarregandoBiblioteca(true)
        const [respProtocolos, respReferencias] = await Promise.all([
          fetch('/api/coach/protocolos/biblioteca?item_type=protocolo', { credentials: 'include' }),
          fetch('/api/coach/protocolos/biblioteca?item_type=referencia', { credentials: 'include' }),
        ])

        const dataProtocolos = await respProtocolos.json().catch(() => ({}))
        const dataReferencias = await respReferencias.json().catch(() => ({}))

        setBibliotecaProtocolos(respProtocolos.ok && dataProtocolos.success ? (dataProtocolos.data?.items || []) : [])
        setBibliotecaReferencias(respReferencias.ok && dataReferencias.success ? (dataReferencias.data?.items || []) : [])
      } catch {
        setBibliotecaProtocolos([])
        setBibliotecaReferencias([])
      } finally {
        setCarregandoBiblioteca(false)
      }
    }
    carregar()
  }, [user])

  const templateSelecionado = useMemo(
    () => protocolosBase.find((p) => p.id === templateId) || protocolosBase[0],
    [protocolosBase, templateId]
  )

  const referenciasDisponiveis = useMemo(() => {
    const all = [...bibliotecaProtocolos, ...bibliotecaReferencias]
    const map = new Map<string, BibliotecaItem>()
    for (const item of all) map.set(item.id, item)
    const list = Array.from(map.values())

    const q = buscaReferencia.trim().toLowerCase()
    if (!q) return list

    return list.filter((it) => {
      const tags = (it.tags || []).join(' ').toLowerCase()
      return (
        it.title?.toLowerCase().includes(q) ||
        it.file_name?.toLowerCase().includes(q) ||
        tags.includes(q)
      )
    })
  }, [bibliotecaProtocolos, bibliotecaReferencias, buscaReferencia])

  const handleUploadReferencia = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) return

    try {
      setUploadando(true)

      const formData = new FormData()
      formData.append('file', uploadFile)
      formData.append('item_type', 'referencia')
      if (uploadTitulo.trim()) formData.append('title', uploadTitulo.trim())
      if (uploadTags.trim()) formData.append('tags', uploadTags.trim())
      if (uploadDescricao.trim()) formData.append('description', uploadDescricao.trim())

      const response = await fetch('/api/coach/protocolos/biblioteca', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erro ao fazer upload')
      }

      const newItemId = data.data?.item?.id as string | undefined
      if (newItemId) {
        setReferenciasSelecionadas((prev) => ({ ...prev, [newItemId]: true }))
      }

      setUploadFile(null)
      setUploadTitulo('')
      setUploadTags('')
      setUploadDescricao('')
      setMostrarModalUploadReferencia(false)

      // recarregar listas
      setCarregandoBiblioteca(true)
      try {
        const [respProtocolos, respReferencias] = await Promise.all([
          fetch('/api/coach/protocolos/biblioteca?item_type=protocolo', { credentials: 'include' }),
          fetch('/api/coach/protocolos/biblioteca?item_type=referencia', { credentials: 'include' }),
        ])
        const dataProtocolos = await respProtocolos.json().catch(() => ({}))
        const dataReferencias = await respReferencias.json().catch(() => ({}))
        setBibliotecaProtocolos(respProtocolos.ok && dataProtocolos.success ? (dataProtocolos.data?.items || []) : [])
        setBibliotecaReferencias(respReferencias.ok && dataReferencias.success ? (dataReferencias.data?.items || []) : [])
      } finally {
        setCarregandoBiblioteca(false)
      }
    } catch (err) {
      console.error(err)
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
          <h1 className="text-lg font-semibold text-gray-900">Novo Protocolo</h1>
          <div className="w-10"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4 sm:py-6 lg:py-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">➕ Novo Protocolo</h1>
              <p className="text-gray-600 mt-1">
                Escolha um protocolo base, informe o caso e marque exceções para gerar um texto pronto para colar no Gama.
              </p>
            </div>
            <Link href="/pt/coach/protocolos" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
              ← Voltar
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Entrada */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Protocolo base</label>
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  {protocolosBase.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  {templateSelecionado.description} • Tags: {templateSelecionado.tags.join(', ')}
                </p>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Referências (uploads)</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Suba ou selecione protocolos/referências para guiar o diagnóstico e as exceções.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setMostrarModalUploadReferencia(true)}
                      className="text-xs bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      📤 Upload
                    </button>
                    <Link href="/pt/coach/protocolos" className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                      Biblioteca →
                    </Link>
                  </div>
                </div>

                {carregandoBiblioteca ? (
                  <p className="text-xs text-gray-500 mt-3">Carregando biblioteca...</p>
                ) : referenciasDisponiveis.length === 0 ? (
                  <p className="text-xs text-gray-500 mt-3">
                    Nenhum protocolo enviado ainda. Vá em “Protocolos → Biblioteca (uploads)” e faça upload.
                  </p>
                ) : (
                  <>
                    <div className="mt-3">
                      <label className="text-xs font-medium text-gray-700">Buscar referência</label>
                      <input
                        value={buscaReferencia}
                        onChange={(e) => setBuscaReferencia(e.target.value)}
                        placeholder="Nome, arquivo ou tag..."
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm"
                      />
                    </div>

                    <div className="mt-3 space-y-2 max-h-56 overflow-auto">
                      {referenciasDisponiveis.map((item) => {
                        const checked = !!referenciasSelecionadas[item.id]
                        return (
                          <div
                            key={item.id}
                            className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg border transition-colors ${
                              checked ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <label className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  setReferenciasSelecionadas((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                                }
                                className="h-4 w-4"
                              />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{item.title}</p>
                                <p className="text-xs text-gray-500 truncate">{item.file_name}</p>
                                {item.tags && item.tags.length > 0 && (
                                  <p className="text-xs text-gray-500 truncate mt-0.5">
                                    Tags: {item.tags.slice(0, 6).join(', ')}
                                    {item.tags.length > 6 ? '…' : ''}
                                  </p>
                                )}
                              </div>
                            </label>
                            <a
                              href={item.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-purple-600 hover:text-purple-700 font-medium whitespace-nowrap"
                            >
                              Abrir
                            </a>
                          </div>
                        )
                      })}
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Selecionadas: {Object.values(referenciasSelecionadas).filter(Boolean).length}
                    </p>
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contexto da cliente</label>
                <textarea
                  value={contexto}
                  onChange={(e) => setContexto(e.target.value)}
                  rows={6}
                  placeholder="Cole a anamnese, escreva em bullets ou descreva o caso..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pedido da coach</label>
                <textarea
                  value={pedidoCoach}
                  onChange={(e) => setPedidoCoach(e.target.value)}
                  rows={3}
                  placeholder='Ex.: "Reset 7 dias, sem lactose, rotina noturna, sem café e sem suplementos".'
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Exceções (clique para marcar)</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: 'semLactose', label: 'Sem lactose' },
                    { key: 'vegetariana', label: 'Vegetariana' },
                    { key: 'semOvos', label: 'Sem ovos' },
                    { key: 'turnoNoturno', label: 'Turno noturno' },
                    { key: 'semSuplementos', label: 'Sem suplementos' },
                    { key: 'naoFazCha', label: 'Não faz chá' },
                  ].map((chip) => {
                    const checked = !!excecoes[chip.key]
                    return (
                      <button
                        key={chip.key}
                        type="button"
                        onClick={() => setExcecoes((prev) => ({ ...prev, [chip.key]: !prev[chip.key] }))}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          checked
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                        }`}
                      >
                        {checked ? '✓ ' : ''}
                        {chip.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                Esta tela é o esqueleto da funcionalidade. Em seguida, conectamos ao diagnóstico automático e ao “texto final”
                com validação de coerência.
              </div>
            </div>

            {/* Saída */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900">Texto final (para colar no Gama)</h2>
                <button
                  type="button"
                  onClick={async () => {
                    const refs = referenciasDisponiveis
                      .filter((r) => referenciasSelecionadas[r.id])
                      .map((r) => `- ${r.title}: ${r.file_url}`)
                      .join('\n')

                    const texto = `# ${templateSelecionado.title}\n\n` +
                      `## Protocolos / referências selecionadas\n${refs || '(nenhuma)'}\n\n` +
                      `## Contexto\n${contexto || '(preencha o contexto)'}\n\n` +
                      `## Pedido da coach\n${pedidoCoach || '(preencha o pedido)'}\n\n` +
                      `## Exceções marcadas\n- ${Object.entries(excecoes)
                        .filter(([, v]) => v)
                        .map(([k]) => k)
                        .join('\n- ') || '(nenhuma)'}\n\n` +
                      `## Texto do protocolo\n(Em breve: geração + ajustes automáticos por exceção, com validação de coerência.)\n`

                    try {
                      await navigator.clipboard.writeText(texto)
                    } catch {
                      // silencioso
                    }
                  }}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                  Copiar
                </button>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap">
                {`# ${templateSelecionado.title}

## Protocolos / referências selecionadas
${referenciasDisponiveis.some((r) => referenciasSelecionadas[r.id])
  ? referenciasDisponiveis
      .filter((r) => referenciasSelecionadas[r.id])
      .map((r) => `- ${r.title}: ${r.file_url}`)
      .join('\n')
  : '(nenhuma)'}

## Contexto
${contexto || '(preencha o contexto)'}

## Pedido da coach
${pedidoCoach || '(preencha o pedido)'}

## Exceções marcadas
${Object.entries(excecoes).some(([, v]) => v)
  ? Object.entries(excecoes)
      .filter(([, v]) => v)
      .map(([k]) => `- ${k}`)
      .join('\n')
  : '(nenhuma)'}

## Texto do protocolo
(Em breve: geração + ajustes automáticos por exceção, com validação de coerência.)
`}
              </div>

              <p className="text-xs text-gray-500 mt-3">
                Dica: depois de copiar, cole no Gama e use o editor visual para diagramar (sem precisar reescrever o conteúdo).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Upload Referência */}
      {mostrarModalUploadReferencia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">📤 Upload de referência</h3>
              <button
                onClick={() => setMostrarModalUploadReferencia(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUploadReferencia} className="space-y-4">
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
                  value={uploadTitulo}
                  onChange={(e) => setUploadTitulo(e.target.value)}
                  placeholder="Ex: Reset Metabólico (modelo AndeNutri)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (opcional)</label>
                <input
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="Ex: reset, sem lactose, EUA"
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
                  placeholder="Quando usar / observações..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setMostrarModalUploadReferencia(false)}
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

