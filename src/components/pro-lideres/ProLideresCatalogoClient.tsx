'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import { PRO_LIDERES_VERTICAL_BRAND_LABEL } from '@/config/pro-lideres-vertical'
import ProLideresHOMSettings from '@/components/pro-lideres/ProLideresHOMSettings'
import ProLideresHOMMembroClient from '@/components/pro-lideres/ProLideresHOMMembroClient'
import ProLideresResetSettings from '@/components/pro-lideres/ProLideresResetSettings'
import ProLideresResetMembroClient from '@/components/pro-lideres/ProLideresResetMembroClient'
import ProLideresResetCompletaLinksPanel from '@/components/pro-lideres/ProLideresResetCompletaLinksPanel'
import ProLideresVideoShareSettings from '@/components/pro-lideres/ProLideresVideoShareSettings'
import ProLideresVideoShareMembroClient from '@/components/pro-lideres/ProLideresVideoShareMembroClient'
import type { ProLideresCatalogCategory, ProLideresCatalogItem } from '@/lib/pro-lideres-catalog-build'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'
import { copyTextToClipboard } from '@/lib/clipboard'
import { resolveAbsoluteProLideresCatalogPublicUrl } from '@/lib/pro-lideres-catalog-public-url'
import { copyYladaLinkQrAsPng } from '@/lib/ylada-link-share-actions'

type CatalogPayload = {
  catalog?: ProLideresCatalogItem[]
  error?: string
}

type TabKey = ProLideresCatalogCategory

function CatalogRowCard({
  item,
  showRemove,
  onRemove,
  copied,
  onCopied,
  showTeamVisibilityControls,
  teamVisibilityBusy,
  onTeamVisibilityChange,
  rowHighlight,
  showScriptsLink = false,
  showOriginKindChips = true,
}: {
  item: ProLideresCatalogItem
  showRemove: boolean
  onRemove: (id: string) => void
  copied: 'link' | 'qr' | null
  onCopied: (mode: 'link' | 'qr') => void
  showTeamVisibilityControls: boolean
  teamVisibilityBusy: boolean
  onTeamVisibilityChange: (item: ProLideresCatalogItem, visible: boolean) => void
  /** Destaque vindo do Noel (query highlightYladaLink). */
  rowHighlight?: boolean
  /** Ambiente do líder: atalho para scripts no editor de links. */
  showScriptsLink?: boolean
  /** Líder: mostra se veio da biblioteca base, Meus links ou extra. Equipe: omitir (só vê o que foi liberado). */
  showOriginKindChips?: boolean
}) {
  const [whenOpen, setWhenOpen] = useState(false)
  const scriptsHref = item.yladaLinkId ? `/pt/links/editar/${item.yladaLinkId}` : '/pt/links'
  const shareUrl = resolveAbsoluteProLideresCatalogPublicUrl(item.publicUrl)

  const cardId = item.yladaLinkId ? `pro-lideres-catalog-yd-${item.yladaLinkId}` : undefined

  return (
    <article
      id={cardId}
      className={`rounded-xl border border-slate-200/90 bg-white p-4 shadow-md ring-1 ring-slate-900/5 ${
        rowHighlight ? 'ring-4 ring-blue-400 ring-offset-2' : ''
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-base font-bold leading-snug text-gray-900">{item.label}</h3>
            <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
              {showOriginKindChips ? (
                item.origin === 'library' ? (
                  <span className="inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-900 ring-1 ring-violet-100">
                    Biblioteca
                  </span>
                ) : item.source === 'custom' ? (
                  <>
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900 ring-1 ring-amber-100">
                      Extra
                    </span>
                    {item.customCatalogKind === 'ylada_diagnosis' ? (
                      <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-900 ring-1 ring-indigo-100">
                        Diagnóstico 3 níveis
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
                        Link / atalho
                      </span>
                    )}
                  </>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-800 ring-1 ring-slate-200">
                    Criado por você
                  </span>
                )
              ) : null}
              {item.badge === 'most_used' && (
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100">
                  🔥 Mais usado
                </span>
              )}
              {item.badge === 'most_shared' && (
                <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-900 ring-1 ring-sky-100">
                  📈 Mais compartilhado
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setWhenOpen((v) => !v)}
            className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
            aria-expanded={whenOpen}
          >
            Quando usar {whenOpen ? '▲' : '▼'}
          </button>
          {whenOpen && item.whenToUse && (
            <p className="mt-2 rounded-lg bg-gray-50 p-3 text-sm leading-relaxed text-gray-700">{item.whenToUse}</p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:flex-row sm:items-center lg:flex-col">
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] min-w-[140px] items-center justify-center rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Usar esse
          </a>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] items-center rounded-lg border border-sky-200/90 bg-sky-50/90 px-3 text-xs font-semibold text-sky-900 shadow-sm ring-1 ring-sky-100/80 transition hover:bg-sky-100/90"
        >
          Preview
        </a>
        <button
          type="button"
          onClick={async () => {
            const ok = await copyTextToClipboard(shareUrl)
            if (ok) onCopied('link')
          }}
          className="inline-flex min-h-[44px] items-center rounded-lg border border-violet-200/90 bg-violet-50/90 px-3 text-xs font-semibold text-violet-900 shadow-sm ring-1 ring-violet-100/80 transition hover:bg-violet-100/90"
        >
          {copied === 'link' ? '✓ Link' : 'Copiar link'}
        </button>
        <button
          type="button"
          onClick={async () => {
            const ok = await copyYladaLinkQrAsPng(shareUrl)
            if (ok) onCopied('qr')
          }}
          className="inline-flex min-h-[44px] items-center rounded-lg border border-teal-200/90 bg-teal-50/90 px-3 text-xs font-semibold text-teal-900 shadow-sm ring-1 ring-teal-100/80 transition hover:bg-teal-100/90"
        >
          {copied === 'qr' ? '✓ QR' : 'Copiar QR'}
        </button>
        {showScriptsLink ? (
          <Link
            href={scriptsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center rounded-lg bg-gray-800 px-3 text-xs font-semibold text-white hover:bg-gray-900"
          >
            Scripts
          </Link>
        ) : null}
        {showRemove && item.source === 'custom' && (
          <span className="ml-auto flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="text-xs font-medium text-red-600 underline-offset-2 hover:underline"
            >
              Remover
            </button>
          </span>
        )}
      </div>

      <p className="mt-2 truncate font-mono text-[10px] text-gray-400" title={shareUrl}>
        {shareUrl}
      </p>

      {showTeamVisibilityControls ? (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <p className="text-xs font-semibold text-slate-800">Equipe no painel</p>
          <p className="mt-0.5 text-[11px] leading-snug text-slate-600">
            Defina se esta ferramenta aparece em Meus links no painel de cada membro da equipe.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {item.visibleToTeam ? (
              <>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-900 ring-1 ring-emerald-100">
                  Visível para a equipe
                </span>
                <button
                  type="button"
                  disabled={teamVisibilityBusy}
                  onClick={() => onTeamVisibilityChange(item, false)}
                  className="text-xs font-semibold text-amber-800 underline-offset-2 hover:underline disabled:opacity-50"
                >
                  Ocultar da equipe
                </button>
              </>
            ) : (
              <>
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-950 ring-1 ring-amber-100">
                  Oculta para a equipe
                </span>
                <button
                  type="button"
                  disabled={teamVisibilityBusy}
                  onClick={() => onTeamVisibilityChange(item, true)}
                  className="text-xs font-semibold text-blue-700 underline-offset-2 hover:underline disabled:opacity-50"
                >
                  Mostrar à equipe
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}
    </article>
  )
}

export function ProLideresCatalogoClient({
  flowsApiBase = '/api/pro-lideres',
  /** Se omitido, usa `painelBasePath` do contexto (painel do líder vs `/membro`). */
  painelHomeHref: painelHomeHrefProp,
  /** Pro Estética: só o separador de vendas/fluxos — sem recrutamento MMN. */
  hideRecruitmentTab = false,
  salesTabLabel = 'Vendas',
  catalogTitle = 'Meus links',
  catalogIntro,
  /** Atalho preto "Scripts" nos cards (editor de link). Por defeito desligado. */
  showScriptsLink = false,
}: {
  /** Base da API de fluxos (ex.: `/api/pro-estetica-corporal`). */
  flowsApiBase?: string
  /** Link "Visão geral" no rodapé. */
  painelHomeHref?: string
  hideRecruitmentTab?: boolean
  /** Rótulo do separador principal (ex.: "Fluxos e links"). */
  salesTabLabel?: string
  catalogTitle?: string
  /** Parágrafo introdutório abaixo do título. */
  catalogIntro?: string
  showScriptsLink?: boolean
} = {}) {
  const { isLeaderWorkspace, verticalCode, painelBasePath } = useProLideresPainel()
  const painelHomeHref = painelHomeHrefProp ?? painelBasePath
  const brandDisplay = verticalCode === 'h-lider' ? PRO_LIDERES_VERTICAL_BRAND_LABEL : verticalCode
  const [catalog, setCatalog] = useState<ProLideresCatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copyState, setCopyState] = useState<Record<string, 'link' | 'qr'>>({})
  const [tab, setTab] = useState<TabKey>('sales')
  const [search, setSearch] = useState('')
  const [teamVisibilityBusyId, setTeamVisibilityBusyId] = useState<string | null>(null)
  const [highlightYladaLinkId, setHighlightYladaLinkId] = useState<string | null>(null)
  const [linkPanel, setLinkPanel] = useState<'reset' | 'hom' | 'completa' | 'herbalife' | 'inicio' | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${flowsApiBase}/flows`, { credentials: 'include' })
      const data = (await res.json().catch(() => ({}))) as CatalogPayload & { error?: string }
      if (!res.ok) {
        setError(data.error || 'Não foi possível carregar o catálogo.')
        setCatalog([])
        return
      }
      setCatalog(data.catalog ?? [])
    } catch {
      setError('Erro de rede.')
      setCatalog([])
    } finally {
      setLoading(false)
    }
  }, [flowsApiBase])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = new URLSearchParams(window.location.search).get('highlightYladaLink')?.trim() ?? ''
    if (raw && /^[0-9a-f-]{36}$/i.test(raw)) setHighlightYladaLinkId(raw)
  }, [])

  useEffect(() => {
    if (!highlightYladaLinkId || loading || catalog.length === 0) return
    const match = catalog.find((i) => i.yladaLinkId === highlightYladaLinkId)
    if (match) {
      setTab(match.catalogCategory)
    }
    const tid = window.setTimeout(() => {
      document.getElementById(`pro-lideres-catalog-yd-${highlightYladaLinkId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 200)
    return () => window.clearTimeout(tid)
  }, [highlightYladaLinkId, loading, catalog])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return catalog.filter((item) => {
      if (item.catalogCategory !== tab) return false
      if (!q) return true
      const name = item.label.toLowerCase()
      const desc = (item.description ?? '').toLowerCase()
      const when = (item.whenToUse ?? '').toLowerCase()
      const meta = (item.metaLine ?? '').toLowerCase()
      return name.includes(q) || desc.includes(q) || when.includes(q) || meta.includes(q)
    })
  }, [catalog, tab, search])

  async function removeCustom(id: string) {
    if (!confirm('Remover esta entrada extra do catálogo?')) return
    setError(null)
    try {
      const res = await fetch(`${flowsApiBase}/flows/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível remover.')
        return
      }
      await load()
    } catch {
      setError('Erro de rede ao remover.')
    }
  }

  async function setItemTeamVisible(item: ProLideresCatalogItem, visible: boolean) {
    setTeamVisibilityBusyId(item.id)
    setError(null)
    try {
      if (item.yladaLinkId) {
        const res = await fetch(`${flowsApiBase}/flows/visibility`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ yladaLinkId: item.yladaLinkId, visibleToTeam: visible }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError((data as { error?: string }).error || 'Não foi possível atualizar a visibilidade.')
          return
        }
      } else if (item.source === 'custom') {
        const res = await fetch(`${flowsApiBase}/flows/${item.id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ visible_to_team: visible }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError((data as { error?: string }).error || 'Não foi possível atualizar a visibilidade.')
          return
        }
      } else {
        setError('Este item não suporta visibilidade por equipe.')
        return
      }
      await load()
    } catch {
      setError('Erro de rede ao atualizar a visibilidade.')
    } finally {
      setTeamVisibilityBusyId(null)
    }
  }

  const setCopiedFor = (itemId: string, mode: 'link' | 'qr') => {
    setCopyState((s) => ({ ...s, [itemId]: mode }))
    window.setTimeout(() => {
      setCopyState((s) => {
        const n = { ...s }
        delete n[itemId]
        return n
      })
    }, 2000)
  }

  return (
    <div
      className="max-w-5xl space-y-8"
      data-pro-lideres-vertical={verticalCode}
      data-pro-lideres-brand={brandDisplay}
    >
      {isLeaderWorkspace ? (
        <header>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{catalogTitle}</h1>
          {catalogIntro ? (
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-slate-700">{catalogIntro}</p>
          ) : null}
        </header>
      ) : null}

      {/* Atalhos — Bebida · HOM Reset · Reset completo · HOM Herbalife · Início rápido */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-slate-800">Links de divulgação</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => setLinkPanel((p) => (p === 'reset' ? null : 'reset'))}
            className={`flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-bold transition ${
              linkPanel === 'reset'
                ? 'border-[#5A8D2A] bg-[#A0D150]/20 text-[#1E4620] shadow-sm'
                : 'border-[#A0D150]/50 bg-white text-[#1E4620] hover:bg-[#A0D150]/10'
            }`}
          >
            <span aria-hidden>🥤</span>
            Bebida
          </button>
          <button
            type="button"
            onClick={() => setLinkPanel((p) => (p === 'hom' ? null : 'hom'))}
            className={`flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-bold transition ${
              linkPanel === 'hom'
                ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                : 'border-emerald-200 bg-white text-emerald-900 hover:bg-emerald-50/80'
            }`}
          >
            <span aria-hidden>📈</span>
            HOM Reset
          </button>
          <button
            type="button"
            onClick={() => setLinkPanel((p) => (p === 'completa' ? null : 'completa'))}
            className={`flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-bold transition ${
              linkPanel === 'completa'
                ? 'border-[#1E4620] bg-[#1E4620]/10 text-[#1E4620] shadow-sm'
                : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span aria-hidden>📋</span>
            Reset completo
          </button>
          <button
            type="button"
            onClick={() => setLinkPanel((p) => (p === 'herbalife' ? null : 'herbalife'))}
            className={`flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-bold transition ${
              linkPanel === 'herbalife'
                ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-sm'
                : 'border-teal-200 bg-white text-teal-900 hover:bg-teal-50/80'
            }`}
          >
            <span aria-hidden>🌿</span>
            HOM Herbalife
          </button>
          <button
            type="button"
            onClick={() => setLinkPanel((p) => (p === 'inicio' ? null : 'inicio'))}
            className={`flex min-h-[52px] items-center justify-center gap-2 rounded-xl border-2 px-3 py-3 text-sm font-bold transition ${
              linkPanel === 'inicio'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                : 'border-indigo-200 bg-white text-indigo-900 hover:bg-indigo-50/80'
            }`}
          >
            <span aria-hidden>🚀</span>
            Início rápido
          </button>
        </div>

        {linkPanel ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {linkPanel === 'reset' ? (
              isLeaderWorkspace ? <ProLideresResetSettings /> : <ProLideresResetMembroClient />
            ) : null}
            {linkPanel === 'hom' ? (
              isLeaderWorkspace ? <ProLideresHOMSettings /> : <ProLideresHOMMembroClient />
            ) : null}
            {linkPanel === 'completa' ? (
              <ProLideresResetCompletaLinksPanel isLeaderWorkspace={isLeaderWorkspace} />
            ) : null}
            {linkPanel === 'herbalife' ? (
              isLeaderWorkspace ? (
                <ProLideresVideoShareSettings
                  kind="hom-herbalife"
                  videoLabel="HOM Herbalife"
                  placeholderHeadline="Oportunidade Herbalife"
                  placeholderSubheadline="Assista à apresentação e descubra como começar"
                />
              ) : (
                <ProLideresVideoShareMembroClient kind="hom-herbalife" pageLabel="HOM Herbalife" />
              )
            ) : null}
            {linkPanel === 'inicio' ? (
              isLeaderWorkspace ? (
                <ProLideresVideoShareSettings
                  kind="inicio-rapido"
                  videoLabel="Início Rápido"
                  placeholderHeadline="Início Rápido"
                  placeholderSubheadline="Seu primeiro passo para começar com o pé direito"
                />
              ) : (
                <ProLideresVideoShareMembroClient kind="inicio-rapido" pageLabel="Início Rápido" />
              )
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-2xl border-2 border-slate-200 bg-gradient-to-b from-slate-50/90 to-white p-5 shadow-md ring-1 ring-slate-900/5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-4">
            <div className="min-w-0 flex-1 space-y-2 rounded-xl border border-sky-200/80 bg-sky-50/50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Vendas ou recrutamento</p>
              {isLeaderWorkspace ? (
                <p className="text-xs text-slate-600">Escolha o tipo de ferramenta que quer ver</p>
              ) : null}
              <div className={`${isLeaderWorkspace ? 'mt-2' : 'mt-0'} flex rounded-xl bg-slate-300/35 p-1.5 shadow-inner ${hideRecruitmentTab ? 'max-w-md' : ''}`}>
                <button
                  type="button"
                  onClick={() => setTab('sales')}
                  title="Ferramentas para vender"
                  className={`min-h-[46px] flex-1 rounded-lg px-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                    tab === 'sales'
                      ? 'bg-white text-blue-800 shadow-md ring-2 ring-blue-400/80'
                      : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                  }`}
                >
                  {salesTabLabel}
                </button>
                {!hideRecruitmentTab && (
                  <button
                    type="button"
                    onClick={() => setTab('recruitment')}
                    title="Ferramentas para recrutar"
                    className={`min-h-[46px] flex-1 rounded-lg px-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                      tab === 'recruitment'
                        ? 'bg-white text-blue-800 shadow-md ring-2 ring-blue-400/80'
                        : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                    }`}
                  >
                    Recrutamento
                  </button>
                )}
              </div>
            </div>
            <label className="block min-w-0 flex-1 sm:max-w-sm">
              <span className="mb-1.5 block text-sm font-semibold text-slate-900">Buscar</span>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nome da ferramenta…"
                autoComplete="off"
                className="h-full min-h-[46px] w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
              />
            </label>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      {loading ? (
        <p className="font-medium text-slate-600">Carregando…</p>
      ) : catalog.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
          <p className="text-lg font-semibold text-slate-900">Nenhuma ferramenta listada</p>
          {isLeaderWorkspace ? (
            <Link
              href="/pt/links"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Abrir Meus links
            </Link>
          ) : (
            <p className="mx-auto mt-4 max-w-md text-sm text-slate-600">
              Quando houver ferramentas disponíveis para a equipe neste catálogo, elas aparecem aqui por funil (vendas ou
              recrutamento).
            </p>
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border-2 border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          <p className="font-semibold text-slate-900">Nada nesta combinação</p>
          <p className="mt-1 text-sm">
            {isLeaderWorkspace
              ? search.trim()
                ? hideRecruitmentTab
                  ? 'Nenhum resultado — tente outro nome.'
                  : 'Nenhum resultado — tente outro nome ou troque entre Vendas e Recrutamento.'
                : hideRecruitmentTab
                  ? 'Crie ferramentas em Meus links ou ajuste a busca.'
                  : 'Troque entre Vendas e Recrutamento, ou crie algo novo em Meus links.'
              : search.trim()
                ? hideRecruitmentTab
                  ? 'Nenhum resultado — tente outro nome.'
                  : 'Nenhum resultado — tente outro nome ou troque entre Vendas e Recrutamento.'
                : hideRecruitmentTab
                  ? 'Ainda não há ferramentas liberadas para si neste funil.'
                  : 'Ainda não há ferramentas liberadas para si neste funil — experimente Vendas ou Recrutamento.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item) => (
            <CatalogRowCard
              key={item.id}
              item={item}
              showRemove={isLeaderWorkspace}
              onRemove={(id) => void removeCustom(id)}
              copied={copyState[item.id] ?? null}
              onCopied={(mode) => setCopiedFor(item.id, mode)}
              showTeamVisibilityControls={isLeaderWorkspace}
              teamVisibilityBusy={teamVisibilityBusyId === item.id}
              onTeamVisibilityChange={(i, vis) => void setItemTeamVisible(i, vis)}
              showScriptsLink={showScriptsLink}
              showOriginKindChips={isLeaderWorkspace}
              rowHighlight={Boolean(highlightYladaLinkId && item.yladaLinkId === highlightYladaLinkId)}
            />
          ))}
        </div>
      )}

      <p className="text-sm text-gray-500">
        <Link href={painelHomeHref} className="font-medium text-blue-700 hover:text-blue-900">
          ← Visão geral
        </Link>
      </p>
    </div>
  )
}
