'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

/* ─────────────────────────────────────────────
   TIPOS
───────────────────────────────────────────── */
type Board = {
  id: string
  nome: string
  emoji: string
  ordem: number
  ylada_board_cards?: { count: number }[]
}

type Card = {
  id: string
  board_id: string
  titulo: string
  conteudo: string
  categoria: string
  canal: string
  variaveis: string[]
}

type Props = {
  /** Área do Ylada (ex: 'pro-lideres', 'geral', 'estética'). Padrão: 'geral' */
  area?: string
}

/* ─────────────────────────────────────────────
   UTILITÁRIOS
───────────────────────────────────────────── */
function cardCount(board: Board): number {
  return board.ylada_board_cards?.[0]?.count ?? 0
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // fallback para Safari/WebView
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  }
}

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
export default function YladaBoardsContent({ area = 'geral' }: Props) {
  const [boards, setBoards] = useState<Board[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [previewCard, setPreviewCard] = useState<Card | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingCards, setLoadingCards] = useState(false)
  const [search, setSearch] = useState('')

  // Mobile: 'boards' | 'cards'
  const [mobileView, setMobileView] = useState<'boards' | 'cards'>('boards')

  // Modais
  const [showNewBoard, setShowNewBoard] = useState(false)
  const [showNewCard, setShowNewCard] = useState(false)
  const [editBoard, setEditBoard] = useState<Board | null>(null)
  const [editCard, setEditCard] = useState<Card | null>(null)

  // Substituição de variáveis no preview
  const [varValues, setVarValues] = useState<Record<string, string>>({})

  /* ── Buscar boards ── */
  const fetchBoards = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/ylada-boards/boards?area=${area}`)
      const json = await res.json()
      setBoards(json.boards ?? [])
    } finally {
      setLoading(false)
    }
  }, [area])

  useEffect(() => { fetchBoards() }, [fetchBoards])

  /* ── Buscar cards ao selecionar board ── */
  const fetchCards = useCallback(async (boardId: string) => {
    setLoadingCards(true)
    try {
      const res = await fetch(`/api/ylada-boards/cards?board_id=${boardId}`)
      const json = await res.json()
      setCards(json.cards ?? [])
    } finally {
      setLoadingCards(false)
    }
  }, [])

  const selectBoard = (board: Board) => {
    setSelectedBoard(board)
    setSearch('')
    setMobileView('cards')
    fetchCards(board.id)
  }

  /* ── Copiar card ── */
  const handleCopy = async (card: Card) => {
    let text = card.conteudo
    // Substitui variáveis preenchidas
    card.variaveis.forEach((v) => {
      if (varValues[v]) {
        text = text.replace(new RegExp(`\\{\\{${v}\\}\\}`, 'g'), varValues[v])
      }
    })
    const ok = await copyText(text)
    if (ok) {
      setCopiedId(card.id)
      setTimeout(() => setCopiedId(null), 2500)
    }
  }

  /* ── Criar board ── */
  const handleCreateBoard = async (nome: string, emoji: string) => {
    await fetch('/api/ylada-boards/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, emoji, area }),
    })
    setShowNewBoard(false)
    fetchBoards()
  }

  /* ── Editar board ── */
  const handleUpdateBoard = async (id: string, nome: string, emoji: string) => {
    await fetch(`/api/ylada-boards/boards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, emoji }),
    })
    setEditBoard(null)
    fetchBoards()
    if (selectedBoard?.id === id) setSelectedBoard((b) => b ? { ...b, nome, emoji } : b)
  }

  /* ── Excluir board ── */
  const handleDeleteBoard = async (id: string) => {
    if (!confirm('Excluir pasta e todos os cards dentro dela?')) return
    await fetch(`/api/ylada-boards/boards/${id}`, { method: 'DELETE' })
    if (selectedBoard?.id === id) { setSelectedBoard(null); setCards([]) }
    fetchBoards()
  }

  /* ── Criar card ── */
  const handleCreateCard = async (titulo: string, conteudo: string) => {
    if (!selectedBoard) return
    await fetch('/api/ylada-boards/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        board_id: selectedBoard.id,
        tenant_id: selectedBoard.id, // preenchido pelo servidor via auth
        titulo,
        conteudo,
      }),
    })
    setShowNewCard(false)
    fetchCards(selectedBoard.id)
    fetchBoards()
  }

  /* ── Editar card ── */
  const handleUpdateCard = async (id: string, titulo: string, conteudo: string) => {
    await fetch(`/api/ylada-boards/cards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, conteudo }),
    })
    setEditCard(null)
    if (selectedBoard) fetchCards(selectedBoard.id)
  }

  /* ── Excluir card ── */
  const handleDeleteCard = async (id: string) => {
    if (!confirm('Excluir este card?')) return
    await fetch(`/api/ylada-boards/cards/${id}`, { method: 'DELETE' })
    setPreviewCard(null)
    if (selectedBoard) { fetchCards(selectedBoard.id); fetchBoards() }
  }

  /* ── Filtrar cards por busca ── */
  const filteredCards = cards.filter((c) =>
    search.length === 0 ||
    c.titulo.toLowerCase().includes(search.toLowerCase()) ||
    c.conteudo.toLowerCase().includes(search.toLowerCase())
  )

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <div className="flex h-full min-h-[calc(100vh-80px)] bg-gray-50">

      {/* ── SIDEBAR BOARDS ── */}
      <aside
        className={`
          ${mobileView === 'boards' ? 'flex' : 'hidden'}
          md:flex flex-col w-full md:w-72 bg-white border-r border-gray-100 shrink-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div>
            <h1 className="text-base font-bold text-gray-900">📲 Ylada Boards</h1>
            <p className="text-xs text-gray-400 mt-0.5">Mensagens prontas para copiar</p>
          </div>
          <button
            onClick={() => setShowNewBoard(true)}
            className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-lg leading-none hover:bg-green-600 transition-colors shadow"
            title="Nova pasta"
          >
            +
          </button>
        </div>

        {/* Lista de boards */}
        <div className="flex-1 overflow-y-auto py-2">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Carregando…</div>
          ) : boards.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400 text-sm">
              <div className="text-3xl mb-2">📂</div>
              <div>Nenhuma pasta ainda</div>
              <button
                onClick={() => setShowNewBoard(true)}
                className="mt-3 text-green-600 font-medium text-sm hover:underline"
              >
                Criar primeira pasta
              </button>
            </div>
          ) : (
            boards.map((board) => (
              <BoardRow
                key={board.id}
                board={board}
                selected={selectedBoard?.id === board.id}
                onSelect={() => selectBoard(board)}
                onEdit={() => setEditBoard(board)}
                onDelete={() => handleDeleteBoard(board.id)}
              />
            ))
          )}
        </div>
      </aside>

      {/* ── ÁREA DE CARDS ── */}
      <main
        className={`
          ${mobileView === 'cards' ? 'flex' : 'hidden'}
          md:flex flex-col flex-1 min-w-0
        `}
      >
        {!selectedBoard ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center px-6">
            <div className="text-5xl mb-3">👈</div>
            <h2 className="text-lg font-semibold text-gray-700">Selecione uma pasta</h2>
            <p className="text-sm text-gray-400 mt-1">Escolha uma pasta no menu lateral</p>
          </div>
        ) : (
          <>
            {/* Header da pasta */}
            <div className="flex items-center gap-3 px-4 py-4 bg-white border-b border-gray-100">
              {/* Voltar mobile */}
              <button
                onClick={() => setMobileView('boards')}
                className="md:hidden text-gray-400 hover:text-gray-700 mr-1"
              >
                ←
              </button>
              <span className="text-2xl">{selectedBoard.emoji}</span>
              <div className="flex-1 min-w-0">
                <h2 className="text-base font-bold text-gray-900 truncate">{selectedBoard.nome}</h2>
                <p className="text-xs text-gray-400">{cards.length} card{cards.length !== 1 ? 's' : ''}</p>
              </div>
              <button
                onClick={() => setShowNewCard(true)}
                className="shrink-0 px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
              >
                + Card
              </button>
            </div>

            {/* Busca */}
            <div className="px-4 py-3 bg-white border-b border-gray-100">
              <input
                type="text"
                placeholder="Buscar script…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-400"
              />
            </div>

            {/* Grid de cards */}
            <div className="flex-1 overflow-y-auto p-4">
              {loadingCards ? (
                <div className="flex items-center justify-center py-12 text-gray-400 text-sm">Carregando…</div>
              ) : filteredCards.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  <div className="text-3xl mb-2">📝</div>
                  <div>{search ? 'Nenhum card encontrado' : 'Nenhum card nesta pasta'}</div>
                  {!search && (
                    <button
                      onClick={() => setShowNewCard(true)}
                      className="mt-3 text-green-600 font-medium text-sm hover:underline"
                    >
                      Criar primeiro card
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredCards.map((card) => (
                    <CardItem
                      key={card.id}
                      card={card}
                      copied={copiedId === card.id}
                      onCopy={() => handleCopy(card)}
                      onPreview={() => {
                        setPreviewCard(card)
                        setVarValues({})
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* ────────────────────────────────────────
          MODAIS
      ──────────────────────────────────────── */}

      {/* Modal: Nova pasta */}
      {showNewBoard && (
        <BoardModal
          title="Nova pasta"
          onConfirm={handleCreateBoard}
          onClose={() => setShowNewBoard(false)}
        />
      )}

      {/* Modal: Editar pasta */}
      {editBoard && (
        <BoardModal
          title="Editar pasta"
          initial={editBoard}
          onConfirm={(nome, emoji) => handleUpdateBoard(editBoard.id, nome, emoji)}
          onClose={() => setEditBoard(null)}
        />
      )}

      {/* Modal: Novo card */}
      {showNewCard && (
        <CardModal
          title="Novo card"
          onConfirm={handleCreateCard}
          onClose={() => setShowNewCard(false)}
        />
      )}

      {/* Modal: Editar card */}
      {editCard && (
        <CardModal
          title="Editar card"
          initial={editCard}
          onConfirm={(titulo, conteudo) => handleUpdateCard(editCard.id, titulo, conteudo)}
          onClose={() => setEditCard(null)}
        />
      )}

      {/* Sheet: Preview do card */}
      {previewCard && (
        <PreviewSheet
          card={previewCard}
          varValues={varValues}
          setVarValues={setVarValues}
          copied={copiedId === previewCard.id}
          onCopy={() => handleCopy(previewCard)}
          onEdit={() => { setEditCard(previewCard); setPreviewCard(null) }}
          onDelete={() => handleDeleteCard(previewCard.id)}
          onClose={() => setPreviewCard(null)}
        />
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────
   SUB-COMPONENTES
───────────────────────────────────────────── */

function BoardRow({
  board, selected, onSelect, onEdit, onDelete,
}: {
  board: Board
  selected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const [menu, setMenu] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div
      className={`group flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
        selected ? 'bg-green-50 text-green-800' : 'hover:bg-gray-50 text-gray-700'
      }`}
      onClick={onSelect}
    >
      <span className="text-xl shrink-0">{board.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">{board.nome}</div>
        <div className="text-xs text-gray-400">{cardCount(board)} cards</div>
      </div>
      <div className="relative" ref={ref}>
        <button
          onClick={(e) => { e.stopPropagation(); setMenu(!menu) }}
          className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-700 p-1 rounded transition-opacity"
        >
          ···
        </button>
        {menu && (
          <div className="absolute right-0 top-7 bg-white border border-gray-100 rounded-lg shadow-lg z-20 py-1 min-w-[120px]">
            <button
              onClick={(e) => { e.stopPropagation(); setMenu(false); onEdit() }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              ✏️ Editar
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setMenu(false); onDelete() }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              🗑️ Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function CardItem({
  card, copied, onCopy, onPreview,
}: {
  card: Card
  copied: boolean
  onCopy: () => void
  onPreview: () => void
}) {
  const preview = card.conteudo.length > 120 ? card.conteudo.slice(0, 120) + '…' : card.conteudo

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-sm transition-shadow cursor-pointer"
      onClick={onPreview}
    >
      <div>
        <div className="text-sm font-semibold text-gray-800 mb-1">{card.titulo}</div>
        <div className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">{preview}</div>
      </div>
      {card.variaveis.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {card.variaveis.map((v) => (
            <span key={v} className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-mono">
              {`{{${v}}}`}
            </span>
          ))}
        </div>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onCopy() }}
        className={`mt-auto w-full py-2 rounded-lg text-sm font-medium transition-colors ${
          copied
            ? 'bg-green-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-green-500 hover:text-white'
        }`}
      >
        {copied ? '✓ Copiado!' : 'Copiar'}
      </button>
    </div>
  )
}

/* ── Modal genérico de board ── */
function BoardModal({
  title, initial, onConfirm, onClose,
}: {
  title: string
  initial?: { nome: string; emoji: string }
  onConfirm: (nome: string, emoji: string) => void
  onClose: () => void
}) {
  const [nome, setNome] = useState(initial?.nome ?? '')
  const [emoji, setEmoji] = useState(initial?.emoji ?? '📁')
  const emojiOptions = ['📁', '💬', '🎯', '🛒', '📋', '⭐', '💡', '🔥', '🧲', '📞', '🤝', '💰']

  return (
    <Overlay onClose={onClose}>
      <h3 className="text-base font-bold text-gray-900 mb-4">{title}</h3>
      <div className="mb-3">
        <label className="block text-xs text-gray-500 mb-1">Nome da pasta</label>
        <input
          autoFocus
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && nome.trim() && onConfirm(nome.trim(), emoji)}
          placeholder="Ex: Abordagem inicial"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-400"
        />
      </div>
      <div className="mb-5">
        <label className="block text-xs text-gray-500 mb-2">Ícone</label>
        <div className="flex flex-wrap gap-2">
          {emojiOptions.map((e) => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`w-9 h-9 rounded-lg text-xl flex items-center justify-center border-2 transition-colors ${
                emoji === e ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-300'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={() => nome.trim() && onConfirm(nome.trim(), emoji)}
          disabled={!nome.trim()}
          className="flex-1 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-40"
        >
          Salvar
        </button>
      </div>
    </Overlay>
  )
}

/* ── Modal genérico de card ── */
function CardModal({
  title, initial, onConfirm, onClose,
}: {
  title: string
  initial?: { titulo: string; conteudo: string }
  onConfirm: (titulo: string, conteudo: string) => void
  onClose: () => void
}) {
  const [titulo, setTitulo] = useState(initial?.titulo ?? '')
  const [conteudo, setConteudo] = useState(initial?.conteudo ?? '')

  return (
    <Overlay onClose={onClose} wide>
      <h3 className="text-base font-bold text-gray-900 mb-4">{title}</h3>
      <div className="mb-3">
        <label className="block text-xs text-gray-500 mb-1">Título do card</label>
        <input
          autoFocus
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Abertura — agenda oscila"
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-400"
        />
      </div>
      <div className="mb-3">
        <label className="block text-xs text-gray-500 mb-1">
          Mensagem{' '}
          <span className="text-amber-600">— use {'{{nome}}'} para variáveis</span>
        </label>
        <textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          rows={8}
          placeholder={`Oi {{nome}}! Tudo bem?\n\nVi que sua agenda oscila e queria entender melhor o seu caso...`}
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-400 resize-none font-mono"
        />
      </div>
      {/* Preview de variáveis detectadas */}
      {conteudo.match(/\{\{(\w+)\}\}/g) && (
        <div className="mb-4 px-3 py-2 bg-amber-50 rounded-lg text-xs text-amber-700">
          Variáveis detectadas:{' '}
          {[...conteudo.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).filter((v, i, a) => a.indexOf(v) === i).join(', ')}
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={() => titulo.trim() && conteudo.trim() && onConfirm(titulo.trim(), conteudo.trim())}
          disabled={!titulo.trim() || !conteudo.trim()}
          className="flex-1 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600 disabled:opacity-40"
        >
          Salvar
        </button>
      </div>
    </Overlay>
  )
}

/* ── Sheet de preview ── */
function PreviewSheet({
  card, varValues, setVarValues, copied, onCopy, onEdit, onDelete, onClose,
}: {
  card: Card
  varValues: Record<string, string>
  setVarValues: React.Dispatch<React.SetStateAction<Record<string, string>>>
  copied: boolean
  onCopy: () => void
  onEdit: () => void
  onDelete: () => void
  onClose: () => void
}) {
  // Texto com variáveis substituídas
  const rendered = card.variaveis.reduce((text, v) => {
    if (varValues[v]) return text.replace(new RegExp(`\\{\\{${v}\\}\\}`, 'g'), varValues[v])
    return text
  }, card.conteudo)

  return (
    <div
      className="fixed inset-0 bg-black/40 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900 truncate pr-2">{card.titulo}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Campos de variáveis */}
          {card.variaveis.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Personalizar</div>
              {card.variaveis.map((v) => (
                <div key={v}>
                  <label className="block text-xs text-gray-500 mb-1">{`{{${v}}}`}</label>
                  <input
                    type="text"
                    value={varValues[v] ?? ''}
                    onChange={(e) => setVarValues((prev) => ({ ...prev, [v]: e.target.value }))}
                    placeholder={`Valor para ${v}`}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-green-400"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Texto final */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Mensagem</div>
            <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-800 whitespace-pre-line leading-relaxed">
              {rendered}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-100 space-y-2">
          <button
            onClick={onCopy}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${
              copied ? 'bg-green-500 text-white' : 'bg-green-500 text-white hover:bg-green-600 active:scale-[0.98]'
            }`}
          >
            {copied ? '✓ Copiado! Cole no WhatsApp' : '📋 Copiar mensagem'}
          </button>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
            >
              ✏️ Editar
            </button>
            <button
              onClick={onDelete}
              className="flex-1 py-2 rounded-lg border border-red-100 text-sm text-red-600 hover:bg-red-50"
            >
              🗑️ Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Overlay genérico para modais ── */
function Overlay({
  children, onClose, wide,
}: {
  children: React.ReactNode
  onClose: () => void
  wide?: boolean
}) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl p-5 w-full ${wide ? 'max-w-lg' : 'max-w-sm'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
