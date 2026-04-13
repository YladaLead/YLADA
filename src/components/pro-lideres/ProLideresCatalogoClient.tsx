'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import { PRO_LIDERES_VERTICAL_BRAND_LABEL } from '@/config/pro-lideres-vertical'
import type { ProLideresCatalogCategory, ProLideresCatalogItem } from '@/lib/pro-lideres-catalog-build'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'

type CatalogPayload = {
  catalog?: ProLideresCatalogItem[]
  error?: string
}

type TabKey = ProLideresCatalogCategory

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

async function copyQrImage(url: string): Promise<boolean> {
  try {
    const QRCodeLib = (await import('qrcode')).default
    const dataUrl = await QRCodeLib.toDataURL(url, {
      width: 280,
      margin: 2,
      color: { dark: '#2563eb', light: '#ffffff' },
    })
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    if (typeof ClipboardItem !== 'undefined' && navigator.clipboard?.write) {
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      return true
    }
  } catch {
    /* continua */
  }
  try {
    const QRCodeLib = (await import('qrcode')).default
    const dataUrl = await QRCodeLib.toDataURL(url, { width: 280, margin: 2 })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'ylada-qr.png'
    a.click()
    return true
  } catch {
    return false
  }
}

function CatalogRowCard({
  item,
  showRemove,
  onRemove,
  copied,
  onCopied,
}: {
  item: ProLideresCatalogItem
  showRemove: boolean
  onRemove: (id: string) => void
  copied: 'link' | 'qr' | null
  onCopied: (mode: 'link' | 'qr') => void
}) {
  const [whenOpen, setWhenOpen] = useState(false)
  const scriptsHref = item.yladaLinkId ? `/pt/links/editar/${item.yladaLinkId}` : '/pt/links'

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h3 className="text-base font-bold leading-snug text-gray-900">{item.label}</h3>
            <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
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

          {item.description ? (
            <p className="mt-2 line-clamp-3 text-sm text-gray-600">{item.description}</p>
          ) : (
            <p className="mt-2 text-sm text-gray-500">
              Diagnóstico entregue pelo motor YLADA no link público — detalhes completos no editor em Meus links.
            </p>
          )}

          {item.metaLine && <p className="mt-2 text-xs text-gray-400">{item.metaLine}</p>}

          <button
            type="button"
            onClick={() => setWhenOpen((v) => !v)}
            className="mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-800"
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
            href={item.publicUrl}
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
          href={item.publicUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[36px] items-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          Preview
        </a>
        <button
          type="button"
          onClick={async () => {
            const ok = await copyText(item.publicUrl)
            if (ok) onCopied('link')
          }}
          className="inline-flex min-h-[36px] items-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          {copied === 'link' ? '✓ Link' : 'Copiar link'}
        </button>
        <button
          type="button"
          onClick={async () => {
            const ok = await copyQrImage(item.publicUrl)
            if (ok) onCopied('qr')
          }}
          className="inline-flex min-h-[36px] items-center rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          {copied === 'qr' ? '✓ QR' : 'Copiar QR'}
        </button>
        <Link
          href={scriptsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[36px] items-center rounded-lg bg-gray-800 px-3 text-xs font-semibold text-white hover:bg-gray-900"
        >
          Scripts
        </Link>
        {showRemove && item.source === 'custom' && (
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="ml-auto text-xs font-medium text-red-600 underline-offset-2 hover:underline"
          >
            Remover extra
          </button>
        )}
      </div>

      <p className="mt-2 truncate font-mono text-[10px] text-gray-400" title={item.publicUrl}>
        {item.publicUrl}
      </p>
    </article>
  )
}

export function ProLideresCatalogoClient() {
  const { isLeaderWorkspace, verticalCode } = useProLideresPainel()
  const brandDisplay = verticalCode === 'h-lider' ? PRO_LIDERES_VERTICAL_BRAND_LABEL : verticalCode
  const [catalog, setCatalog] = useState<ProLideresCatalogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [label, setLabel] = useState('')
  const [href, setHref] = useState('')
  const [saving, setSaving] = useState(false)
  const [copyState, setCopyState] = useState<Record<string, 'link' | 'qr'>>({})
  const [tab, setTab] = useState<TabKey>('sales')
  const [search, setSearch] = useState('')
  const [addCategory, setAddCategory] = useState<TabKey>('sales')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/flows', { credentials: 'include' })
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
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return catalog.filter((item) => {
      if (item.catalogCategory !== tab) return false
      if (!q) return true
      const name = item.label.toLowerCase()
      const desc = (item.description ?? '').toLowerCase()
      return name.includes(q) || desc.includes(q)
    })
  }, [catalog, tab, search])

  async function onAdd(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/flows', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: addCategory, label, href }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível adicionar.')
        return
      }
      setLabel('')
      setHref('')
      await load()
    } catch {
      setError('Erro de rede ao adicionar.')
    } finally {
      setSaving(false)
    }
  }

  async function removeCustom(id: string) {
    if (!confirm('Remover esta entrada extra do catálogo?')) return
    setError(null)
    try {
      const res = await fetch(`/api/pro-lideres/flows/${id}`, {
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
      <header className="space-y-1">
        <p className="text-sm font-medium text-blue-600">Conteúdo</p>
        <h1 className="text-2xl font-bold text-gray-900">Catálogo de ferramentas</h1>
        <p className="text-sm text-gray-600">
          Lista única por ferramenta (mesmo link ou mesmo nome no separador). Em Recrutamento, o sistema completa
          automaticamente os presets (3 quizzes + dois fluxos) em /l/… — funcionam como os teus outros links YLADA,
          com perguntas e diagnóstico. Edita em Meus links se precisares.
        </p>
      </header>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-3">
          <div className="flex flex-1 rounded-xl bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setTab('sales')}
              title="Fluxos e links de venda de produtos"
              className={`min-h-[44px] flex-1 rounded-lg px-3 text-sm font-semibold transition ${
                tab === 'sales' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Vendas
            </button>
            <button
              type="button"
              onClick={() => setTab('recruitment')}
              title="Fluxos e links para recrutar pessoas"
              className={`min-h-[44px] flex-1 rounded-lg px-3 text-sm font-semibold transition ${
                tab === 'recruitment' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Recrutamento
            </button>
          </div>
          <label className="block min-w-0 flex-1 sm:max-w-md">
            <span className="sr-only">Buscar por nome</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome…"
              autoComplete="off"
              className="h-full min-h-[44px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div>
      )}

      {loading ? (
        <p className="text-gray-600">A carregar…</p>
      ) : catalog.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center">
          <p className="text-lg font-semibold text-gray-900">Nenhuma ferramenta listada</p>
          <p className="mt-2 text-sm text-gray-600">
            As entradas vêm de <strong>Meus links</strong> (motor YLADA, /l/…). Cria e gere ferramentas interativas aí;
            duplicados no painel são mostrados uma vez só.
          </p>
          {isLeaderWorkspace && (
            <Link
              href="/pt/links"
              className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-blue-600 px-6 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Abrir Meus links
            </Link>
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-600">
          <p className="font-medium text-gray-900">Nada neste separador</p>
          <p className="mt-1 text-sm">
            {search.trim()
              ? 'Nenhum resultado para a pesquisa — experimenta outro termo ou o outro separador (Vendas / Recrutamento).'
              : 'Não há itens em Vendas ou Recrutamento nesta vista. Adiciona um link extra (categoria recrutamento) ou cria ferramentas em Meus links.'}
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
            />
          ))}
        </div>
      )}

      <div className="rounded-lg border border-amber-100 bg-amber-50/80 px-3 py-2 text-xs text-amber-950">
        Duplicados: mesmo URL ou mesmo nome dentro de <strong>Vendas</strong> / <strong>Recrutamento</strong> ficam num
        só cartão (fica a versão com mais utilização). Tipos como em Meus links. Extras:{' '}
        <code className="rounded bg-amber-100 px-1">leader_tenant_flow_entries</code> (304).
      </div>

      {isLeaderWorkspace && (
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm" aria-labelledby="add-catalog-extra">
          <h2 id="add-catalog-extra" className="text-base font-semibold text-gray-900">
            Link extra no painel
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Opcional. Os teus links YLADA já entram automaticamente; usa isto só para fixar mais um URL à equipa.
          </p>
          <form onSubmit={onAdd} className="mt-4 grid gap-3 sm:grid-cols-2">
            <fieldset className="sm:col-span-2">
              <legend className="mb-2 text-sm font-medium text-gray-700">Categoria</legend>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setAddCategory('sales')}
                  className={`min-h-[40px] rounded-lg px-4 text-sm font-semibold transition ${
                    addCategory === 'sales'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Vendas
                </button>
                <button
                  type="button"
                  onClick={() => setAddCategory('recruitment')}
                  title="Guardar como fluxo de recrutamento"
                  className={`min-h-[40px] rounded-lg px-4 text-sm font-semibold transition ${
                    addCategory === 'recruitment'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Recrutamento
                </button>
              </div>
            </fieldset>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-medium text-gray-700">Nome</span>
              <input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                maxLength={200}
                required
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1 block font-medium text-gray-700">URL ou caminho</span>
              <input
                value={href}
                onChange={(e) => setHref(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="/l/meu-slug"
                required
              />
            </label>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="min-h-[44px] rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'A guardar…' : 'Adicionar'}
              </button>
            </div>
          </form>
        </section>
      )}

      <p className="text-sm text-gray-500">
        <Link href="/pro-lideres/painel" className="font-medium text-blue-700 hover:text-blue-900">
          ← Visão geral
        </Link>
      </p>
    </div>
  )
}
