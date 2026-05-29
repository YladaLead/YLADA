'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'
import { yScriptCategoryFromStage } from '@/lib/pro-lideres-y-scripts-meta'
import {
  PROLIDER_SCRIPT_CANAIS,
  PROLIDER_SCRIPT_PUBLICOS,
  PROLIDER_SCRIPT_STAGES,
  proLiderScriptCanalInfo,
  proLiderScriptMatchesFilters,
  proLiderScriptPublicoInfo,
  type ProliderScriptCanalFilter,
  type ProliderScriptPublicoFilter,
  type ProliderScriptStageFilter,
  type ProliderScriptStage,
} from '@/lib/pro-lideres-y-scripts-filters'
import { copyTextToClipboard } from '@/lib/clipboard'
import { sanitizeNoelScriptBrazilianCopy } from '@/lib/pro-lideres-scripts-noel'
import type { ProliderScriptRow, ProliderToolRow, YScriptsFolderPayload } from '@/app/api/pro-lideres/y-scripts/route'

const COPY_FEEDBACK_MS = 2500

type MobileScreen = 'pastas' | 'conteudo'

async function fetchYScripts(): Promise<YScriptsFolderPayload[]> {
  const res = await fetch('/api/pro-lideres/y-scripts', { credentials: 'include' })
  const json = (await res.json().catch(() => ({}))) as { folders?: YScriptsFolderPayload[]; error?: string }
  if (!res.ok) throw new Error(json.error ?? 'Erro ao carregar Y-Scripts')
  return json.folders ?? []
}

function scriptDisplayTitle(script: ProliderScriptRow): string {
  const t = sanitizeNoelScriptBrazilianCopy(script.title ?? '')
  return t ? t.toUpperCase() : 'SCRIPT'
}

function scriptBody(script: ProliderScriptRow): string {
  return sanitizeNoelScriptBrazilianCopy(script.content)
}

function FilterChipRow<T extends string>({
  label,
  options,
  active,
  onToggle,
  countFor,
}: {
  label: string
  options: { key: T; label: string }[]
  active: T | 'todos'
  onToggle: (key: T) => void
  countFor?: (key: T) => number
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-1.5 w-12 shrink-0 text-[10px] font-bold uppercase tracking-wide text-gray-400 sm:w-14">
        {label}
      </span>
      <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
        {options.map((opt) => {
          const selected = active === opt.key
          const count = countFor?.(opt.key)
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onToggle(opt.key)}
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition touch-manipulation sm:px-3 sm:text-xs ${
                selected
                  ? 'border-[#7F77DD] bg-[#7F77DD] text-white'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
            >
              {opt.label}
              {count != null ? <span className={`ml-1 ${selected ? 'opacity-80' : 'opacity-50'}`}>{count}</span> : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function matchesSearch(script: ProliderScriptRow, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const title = (script.title ?? '').toLowerCase()
  const body = script.content.toLowerCase()
  return title.includes(q) || body.includes(q)
}

function FolderRow({
  tool,
  count,
  active,
  onClick,
}: {
  tool: ProliderToolRow
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full min-h-[52px] items-start gap-3 rounded-lg border-l-4 py-2.5 pl-2 pr-3 text-left transition touch-manipulation ${
        active
          ? 'border-[#7F77DD] bg-[#7F77DD]/12 text-gray-900'
          : 'border-transparent text-gray-700 hover:bg-gray-100/90'
      }`}
    >
      <span className="mt-0.5 text-lg leading-none" aria-hidden>
        {tool.emoji || '📋'}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-bold uppercase tracking-wide">{tool.name}</span>
        <span className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
          <span aria-hidden>📝</span>
          {count} {count === 1 ? 'mensagem' : 'mensagens'}
        </span>
      </span>
    </button>
  )
}

function ScriptGridCard({
  script,
  copied,
  onCopy,
  onPreview,
}: {
  script: ProliderScriptRow
  copied: boolean
  onCopy: () => void
  onPreview: () => void
}) {
  const category = yScriptCategoryFromStage(script.stage)
  const preview = scriptBody(script)
  const pub = proLiderScriptPublicoInfo(script.contexto)
  const canal = proLiderScriptCanalInfo(script.canal)

  return (
    <article
      className={`group relative flex min-h-[6.75rem] flex-col rounded-xl bg-[#f4f4f6] p-2.5 transition active:scale-[0.98] touch-manipulation sm:min-h-[9rem] sm:rounded-2xl sm:p-3.5 lg:min-h-[9.5rem] lg:p-4 ${
        copied ? 'ring-2 ring-emerald-500 ring-offset-1 sm:ring-offset-2' : 'hover:bg-[#ececef]'
      }`}
    >
      <button
        type="button"
        className="absolute inset-0 z-0 rounded-xl sm:rounded-2xl"
        aria-label={`Copiar: ${script.title ?? 'script'}`}
        onClick={onCopy}
      />
      <div className="relative z-10 pointer-events-none flex min-h-0 flex-1 flex-col">
        <div className="mb-1 flex items-start justify-between gap-1 sm:mb-1.5 sm:gap-2">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
            <span
              className={`inline-flex max-w-full truncate rounded px-1.5 py-px text-[8px] font-bold uppercase leading-tight tracking-wide sm:rounded-md sm:px-2 sm:py-0.5 sm:text-[10px] ${category.bg} ${category.text}`}
            >
              {category.label}
            </span>
            {pub && script.contexto && script.contexto !== 'geral' ? (
              <span
                className={`inline-flex truncate rounded px-1.5 py-px text-[8px] font-bold uppercase leading-tight sm:text-[10px] ${pub.badge}`}
              >
                {pub.label.replace(/^[^\s]+\s/, '')}
              </span>
            ) : null}
            {canal && script.canal && script.canal !== 'geral' ? (
              <span
                className={`inline-flex truncate rounded px-1.5 py-px text-[8px] font-bold uppercase leading-tight sm:text-[10px] ${canal.badge}`}
              >
                {canal.label.replace(/^[^\s]+\s/, '')}
              </span>
            ) : null}
          </div>
          {copied ? (
            <span className="shrink-0 text-[9px] font-bold text-emerald-600 sm:text-xs">✓</span>
          ) : null}
        </div>
        <h3 className="line-clamp-3 text-[10px] font-bold leading-tight tracking-wide text-gray-900 sm:line-clamp-2 sm:text-[12px] lg:text-[13px]">
          {scriptDisplayTitle(script)}
        </h3>
        <p className="mt-1 line-clamp-2 flex-1 text-[10px] leading-snug text-gray-500 sm:mt-1.5 sm:text-xs lg:line-clamp-3 lg:text-sm lg:leading-relaxed">
          {preview}
        </p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onPreview()
        }}
        className="relative z-10 mt-1 self-end rounded px-1 py-0.5 text-[9px] font-semibold text-[#534AB7] hover:bg-white/80 touch-manipulation pointer-events-auto sm:mt-2 sm:rounded-lg sm:px-2 sm:py-1 sm:text-xs"
      >
        Ver texto
      </button>
    </article>
  )
}

function ScriptPreviewSheet({
  script,
  copied,
  onClose,
  onCopy,
}: {
  script: ProliderScriptRow
  copied: boolean
  onClose: () => void
  onCopy: () => void
}) {
  const category = yScriptCategoryFromStage(script.stage)

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:items-center sm:justify-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        aria-label="Fechar"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex max-h-[min(88svh,32rem)] w-full flex-col rounded-t-2xl bg-white shadow-2xl sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${category.bg} ${category.text}`}>
            {category.label}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 touch-manipulation"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-900">
            {scriptDisplayTitle(script)}
          </h3>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">{scriptBody(script)}</p>
        </div>
        <div className="border-t border-gray-100 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onCopy}
            className={`w-full min-h-[48px] rounded-xl text-sm font-bold touch-manipulation ${
              copied ? 'bg-emerald-600 text-white' : 'bg-[#7F77DD] text-white hover:bg-[#6d65d4]'
            }`}
          >
            {copied ? 'Copiado! Cole no WhatsApp' : 'Copiar mensagem'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function YScriptsContent() {
  const { canManageAsLeader, isLeaderWorkspace, painelBasePath } = useProLideresPainel()
  const isMemberCopyOnly = !isLeaderWorkspace
  const scriptsEditorHref = `${painelBasePath.replace(/\/$/, '')}/scripts`

  const howToUseCopy = isMemberCopyOnly
    ? 'Mensagens publicadas pelo seu líder. Escolha a pasta → toque no card → cole no WhatsApp. Você não edita aqui.'
    : 'Escolha a pasta da ferramenta → toque no card → cole no WhatsApp. Para criar ou alterar textos, use Scripts no menu.'

  const emptyFoldersCopy = isMemberCopyOnly
    ? 'Seu líder ainda não publicou mensagens aqui. Avise quando as ferramentas estiverem ativas.'
    : 'Nenhuma pasta ativa. Crie e publique em Scripts → Ferramentas.'

  const [folders, setFolders] = useState<YScriptsFolderPayload[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterStage, setFilterStage] = useState<ProliderScriptStageFilter>('todos')
  const [filterPublico, setFilterPublico] = useState<ProliderScriptPublicoFilter>('todos')
  const [filterCanal, setFilterCanal] = useState<ProliderScriptCanalFilter>('todos')
  const [mobileScreen, setMobileScreen] = useState<MobileScreen>('pastas')
  const [previewScript, setPreviewScript] = useState<ProliderScriptRow | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [toastVisible, setToastVisible] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchYScripts()
      setFolders(data)
      setSelectedToolId((prev) => {
        if (prev && data.some((f) => f.tool.id === prev)) return prev
        const firstWithScripts = data.find((f) => f.scripts.length > 0)
        return firstWithScripts?.tool.id ?? data[0]?.tool.id ?? null
      })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const selectedFolder = useMemo(
    () => folders.find((f) => f.tool.id === selectedToolId) ?? null,
    [folders, selectedToolId]
  )

  const filteredScripts = useMemo(() => {
    if (!selectedFolder) return []
    return selectedFolder.scripts.filter(
      (s) =>
        matchesSearch(s, search) &&
        proLiderScriptMatchesFilters(s, {
          stage: filterStage,
          publico: filterPublico,
          canal: filterCanal,
        })
    )
  }, [selectedFolder, search, filterStage, filterPublico, filterCanal])

  const hasActiveFilters =
    filterStage !== 'todos' || filterPublico !== 'todos' || filterCanal !== 'todos'

  const countScriptsForStage = useCallback(
    (stage: ProliderScriptStage) => {
      if (!selectedFolder) return 0
      return selectedFolder.scripts.filter((s) => s.stage === stage).length
    },
    [selectedFolder]
  )

  const countScriptsForPublico = useCallback(
    (publico: Exclude<ProliderScriptPublicoFilter, 'todos'>) => {
      if (!selectedFolder) return 0
      return selectedFolder.scripts.filter((s) => (s.contexto ?? 'geral') === publico).length
    },
    [selectedFolder]
  )

  const countScriptsForCanal = useCallback(
    (canal: Exclude<ProliderScriptCanalFilter, 'todos'>) => {
      if (!selectedFolder) return 0
      return selectedFolder.scripts.filter((s) => (s.canal ?? 'geral') === canal).length
    },
    [selectedFolder]
  )

  const totalScripts = useMemo(
    () => folders.reduce((n, f) => n + f.scripts.length, 0),
    [folders]
  )

  const showCopyToast = useCallback(() => {
    setToastVisible(true)
    window.setTimeout(() => setToastVisible(false), COPY_FEEDBACK_MS)
  }, [])

  const copyScript = useCallback(
    async (script: ProliderScriptRow) => {
      const text = scriptBody(script)
      if (!text) return
      await copyTextToClipboard(text)
      setCopiedId(script.id)
      showCopyToast()
      window.setTimeout(() => setCopiedId(null), COPY_FEEDBACK_MS)
    },
    [showCopyToast]
  )

  const openFolder = (toolId: string) => {
    setSelectedToolId(toolId)
    setSearch('')
    setFilterStage('todos')
    setFilterPublico('todos')
    setFilterCanal('todos')
    setMobileScreen('conteudo')
  }

  const backToPastas = () => setMobileScreen('pastas')

  if (loading) {
    return (
      <div className="flex min-h-[50svh] items-center justify-center">
        <p className="text-sm text-gray-500">Carregando pastas…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
        <button type="button" onClick={() => void load()} className="ml-3 font-semibold underline">
          Tentar de novo
        </button>
      </div>
    )
  }

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col">
      <div className="hidden shrink-0 border-b border-gray-100 px-4 py-4 lg:block">
        <p className="text-xs font-bold uppercase tracking-wider text-[#7F77DD]">Ylada Boards</p>
        <p className="mt-1 text-sm text-gray-600">
          {isMemberCopyOnly ? 'Só copiar. Quem edita é o líder.' : 'Toque na mensagem para copiar.'}
        </p>
      </div>

      <div className="shrink-0 p-3 lg:p-4">
        <div className="rounded-xl border border-[#7F77DD]/20 bg-gradient-to-br from-[#EEEDFE] to-white p-3">
          <p className="text-xs font-semibold text-[#534AB7]">Como usar</p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600">{howToUseCopy}</p>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="flex shrink-0 items-center justify-between px-4 pb-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Pastas</p>
          <span className="text-[11px] text-gray-400">{totalScripts} no total</span>
        </div>
        <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-3 lg:pb-4" aria-label="Pastas de scripts">
          {folders.length === 0 ? (
            <p className="px-2 py-6 text-center text-xs text-gray-500">{emptyFoldersCopy}</p>
          ) : (
            folders.map(({ tool, scripts }) => (
              <FolderRow
                key={tool.id}
                tool={tool}
                count={scripts.length}
                active={selectedToolId === tool.id}
                onClick={() => openFolder(tool.id)}
              />
            ))
          )}
        </nav>
      </div>

      {canManageAsLeader ? (
        <div className="shrink-0 border-t border-gray-100 p-3 lg:p-4">
          <Link
            href={scriptsEditorHref}
            className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-800 hover:bg-gray-50 touch-manipulation"
          >
            Gerenciar scripts →
          </Link>
        </div>
      ) : null}
    </div>
  )

  const contentHeader = selectedFolder ? (
    <header className="sticky top-0 z-10 shrink-0 border-b border-gray-100 bg-white">
      <div className="flex min-h-[52px] items-center gap-2 px-3 py-2 lg:px-5 lg:py-3">
        <button
          type="button"
          onClick={backToPastas}
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full text-[#7F77DD] hover:bg-[#EEEDFE] lg:hidden touch-manipulation"
          aria-label="Voltar às pastas"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold uppercase tracking-wide text-gray-900">
            <span className="mr-1" aria-hidden>
              {selectedFolder.tool.emoji}
            </span>
            {selectedFolder.tool.name}
          </p>
          <p className="text-xs text-gray-500">
            {filteredScripts.length} de {selectedFolder.scripts.length} mensagens
          </p>
        </div>
      </div>
      <div className="px-3 pb-3 lg:px-5">
        <label className="sr-only" htmlFor="y-scripts-search">
          Buscar mensagens
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden>
            🔍
          </span>
          <input
            id="y-scripts-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nesta pasta…"
            className="w-full rounded-xl border-0 bg-[#f4f4f6] py-3 pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#7F77DD]/35"
            autoComplete="off"
          />
        </div>
        <div className="mt-3 space-y-2 rounded-xl bg-[#fafafa] p-3">
          <FilterChipRow
            label="Etapa"
            options={PROLIDER_SCRIPT_STAGES.map((s) => ({ key: s.key, label: s.shortLabel }))}
            active={filterStage}
            onToggle={(key) => setFilterStage((prev) => (prev === key ? 'todos' : key))}
            countFor={countScriptsForStage}
          />
          <FilterChipRow
            label="Quem"
            options={PROLIDER_SCRIPT_PUBLICOS.map((p) => ({ key: p.key, label: p.label }))}
            active={filterPublico}
            onToggle={(key) => setFilterPublico((prev) => (prev === key ? 'todos' : key))}
            countFor={countScriptsForPublico}
          />
          <FilterChipRow
            label="Como"
            options={PROLIDER_SCRIPT_CANAIS.map((c) => ({ key: c.key, label: c.label }))}
            active={filterCanal}
            onToggle={(key) => setFilterCanal((prev) => (prev === key ? 'todos' : key))}
            countFor={countScriptsForCanal}
          />
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={() => {
                setFilterStage('todos')
                setFilterPublico('todos')
                setFilterCanal('todos')
              }}
              className="text-[11px] font-semibold text-[#534AB7] hover:underline"
            >
              Limpar filtros
            </button>
          ) : null}
        </div>
      </div>
    </header>
  ) : null

  const scriptGrid = (
    <div className="min-h-0 flex-1 overflow-y-auto px-2 py-3 sm:px-3 sm:py-4 lg:px-5">
      {!selectedFolder ? (
        <p className="py-12 text-center text-sm text-gray-500">Selecione uma pasta ao lado.</p>
      ) : filteredScripts.length === 0 ? (
        <p className="rounded-2xl bg-[#f4f4f6] px-4 py-12 text-center text-sm text-gray-500">
          {search.trim() || hasActiveFilters
            ? 'Nenhuma mensagem com essa busca ou filtro.'
            : 'Esta pasta ainda não tem mensagens.'}
        </p>
      ) : (
        <ul className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
          {filteredScripts.map((script) => (
            <li key={script.id}>
              <ScriptGridCard
                script={script}
                copied={copiedId === script.id}
                onCopy={() => void copyScript(script)}
                onPreview={() => setPreviewScript(script)}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <div className="relative -mx-4 flex min-h-[calc(100svh-7.5rem)] flex-col sm:-mx-5 lg:mx-0 lg:min-h-[calc(100svh-9rem)]">
      {/* Mobile: tela cheia de pastas */}
      <div
        className={`flex min-h-0 flex-1 flex-col bg-white lg:hidden ${
          mobileScreen === 'pastas' ? 'flex' : 'hidden'
        }`}
      >
        <div className="shrink-0 border-b border-gray-100 px-4 py-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7F77DD]">Ylada Boards</p>
          <h1 className="mt-1 text-xl font-bold text-gray-900">Suas pastas</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isMemberCopyOnly
              ? 'Mensagens do líder. Toque na pasta e copie para o WhatsApp.'
              : 'Toque na pasta para ver as mensagens prontas.'}
          </p>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{sidebar}</div>
      </div>

      {/* Mobile: grid de scripts | Desktop: split */}
      <div
        className={`flex min-h-0 flex-1 overflow-hidden rounded-none border-0 bg-white lg:rounded-2xl lg:border lg:border-gray-200/90 lg:shadow-sm ${
          mobileScreen === 'conteudo' ? 'flex' : 'hidden lg:flex'
        }`}
      >
        <aside className="hidden w-[15.5rem] shrink-0 flex-col border-r border-gray-100 bg-[#fafafa] xl:w-[17rem] lg:flex">
          {sidebar}
        </aside>

        <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-white">
          {contentHeader}
          {scriptGrid}
        </section>
      </div>

      {previewScript ? (
        <ScriptPreviewSheet
          script={previewScript}
          copied={copiedId === previewScript.id}
          onClose={() => setPreviewScript(null)}
          onCopy={() => void copyScript(previewScript)}
        />
      ) : null}

      {toastVisible ? (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none fixed inset-x-4 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 mx-auto max-w-sm rounded-full bg-gray-900 px-5 py-3 text-center text-sm font-medium text-white shadow-lg"
        >
          Copiado — cole no WhatsApp
        </div>
      ) : null}
    </div>
  )
}
