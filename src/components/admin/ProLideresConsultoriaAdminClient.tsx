'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  buildProLideresConsultoriaResponderUrl,
  consultoriaKindLabel,
  defaultContentForKind,
  type ProLideresConsultoriaMaterialKind,
  type ProLideresConsultoriaMaterialRow,
  type ProLideresConsultoriaFormResponseRow,
  type ProLideresConsultoriaShareLinkRow,
} from '@/lib/pro-lideres-consultoria'

type TabKey = 'editar' | 'execucao' | 'links' | 'respostas'

function emptyRow(kind: ProLideresConsultoriaMaterialKind): ProLideresConsultoriaMaterialRow {
  const now = new Date().toISOString()
  return {
    id: '',
    created_at: now,
    updated_at: now,
    title: '',
    material_kind: kind,
    description: null,
    content: defaultContentForKind(kind),
    sort_order: 0,
    is_published: false,
    created_by_user_id: null,
  }
}

export default function ProLideresConsultoriaAdminClient() {
  const [items, setItems] = useState<ProLideresConsultoriaMaterialRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<ProLideresConsultoriaMaterialRow | null>(null)
  const [tab, setTab] = useState<TabKey>('editar')
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)
  const [kindFilter, setKindFilter] = useState<string>('all')

  const [shareLinks, setShareLinks] = useState<ProLideresConsultoriaShareLinkRow[]>([])
  const [responses, setResponses] = useState<ProLideresConsultoriaFormResponseRow[]>([])
  const [auxLoading, setAuxLoading] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const qs = kindFilter !== 'all' ? `?kind=${encodeURIComponent(kindFilter)}` : ''
    const res = await fetch(`/api/admin/pro-lideres/consultoria/materials${qs}`, { credentials: 'include' })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError((data as { error?: string }).error || 'Erro ao carregar.')
      setItems([])
      setLoading(false)
      return
    }
    setItems(((data as { items?: ProLideresConsultoriaMaterialRow[] }).items ?? []) as ProLideresConsultoriaMaterialRow[])
    setLoading(false)
  }, [kindFilter])

  useEffect(() => {
    void load()
  }, [load])

  const loadAuxForForm = useCallback(async (materialId: string) => {
    setAuxLoading(true)
    try {
      const [r1, r2] = await Promise.all([
        fetch(`/api/admin/pro-lideres/consultoria/materials/${materialId}/share-links`, { credentials: 'include' }),
        fetch(`/api/admin/pro-lideres/consultoria/materials/${materialId}/responses`, { credentials: 'include' }),
      ])
      const d1 = await r1.json().catch(() => ({}))
      const d2 = await r2.json().catch(() => ({}))
      setShareLinks(
        r1.ok ? ((d1 as { items?: ProLideresConsultoriaShareLinkRow[] }).items ?? []) : []
      )
      setResponses(
        r2.ok ? ((d2 as { items?: ProLideresConsultoriaFormResponseRow[] }).items ?? []) : []
      )
    } finally {
      setAuxLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!selected?.id || selected.material_kind !== 'formulario') {
      setShareLinks([])
      setResponses([])
      return
    }
    if (tab === 'links' || tab === 'respostas') {
      void loadAuxForForm(selected.id)
    }
  }, [selected?.id, selected?.material_kind, tab, loadAuxForForm])

  const openNew = (kind: ProLideresConsultoriaMaterialKind) => {
    setSelected(emptyRow(kind))
    setTab('editar')
    setCreating(true)
  }

  const patchSelected = (patch: Partial<ProLideresConsultoriaMaterialRow>) => {
    setSelected((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  const patchContent = (next: Record<string, unknown>) => {
    setSelected((prev) => (prev ? { ...prev, content: next } : prev))
  }

  const save = async () => {
    if (!selected) return
    setSaving(true)
    setError(null)
    try {
      if (!selected.id) {
        const res = await fetch('/api/admin/pro-lideres/consultoria/materials', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: selected.title,
            material_kind: selected.material_kind,
            description: selected.description,
            content: selected.content,
            sort_order: selected.sort_order,
            is_published: selected.is_published,
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError((data as { error?: string }).error || 'Erro ao criar.')
          return
        }
        const item = (data as { item?: ProLideresConsultoriaMaterialRow }).item
        if (item) {
          setSelected(item)
          setCreating(false)
          await load()
        }
        return
      }

      const res = await fetch(`/api/admin/pro-lideres/consultoria/materials/${selected.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selected.title,
          material_kind: selected.material_kind,
          description: selected.description,
          content: selected.content,
          sort_order: selected.sort_order,
          is_published: selected.is_published,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao guardar.')
        return
      }
      const item = (data as { item?: ProLideresConsultoriaMaterialRow }).item
      if (item) setSelected(item)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id: string) => {
    if (!confirm('Eliminar este material e respostas associadas?')) return
    const res = await fetch(`/api/admin/pro-lideres/consultoria/materials/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError((data as { error?: string }).error || 'Erro ao eliminar.')
      return
    }
    if (selected?.id === id) setSelected(null)
    await load()
  }

  const createShareLink = async () => {
    if (!selected?.id) return
    setAuxLoading(true)
    setError(null)
    const res = await fetch(`/api/admin/pro-lideres/consultoria/materials/${selected.id}/share-links`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const data = await res.json().catch(() => ({}))
    setAuxLoading(false)
    if (!res.ok) {
      setError((data as { error?: string }).error || 'Erro ao criar link.')
      return
    }
    await loadAuxForForm(selected.id)
  }

  const copyResponderUrl = (token: string) => {
    const url = buildProLideresConsultoriaResponderUrl(typeof window !== 'undefined' ? window.location.origin : '', token)
    void navigator.clipboard.writeText(url)
  }

  const content = selected?.content as Record<string, unknown>

  const execBlock = useMemo(() => {
    if (!selected) return null
    const k = selected.material_kind
    if (k === 'roteiro') {
      const steps = Array.isArray(content?.steps) ? content.steps : []
      return (
        <ol className="list-decimal space-y-4 pl-5 text-sm text-gray-800">
          {steps.map((s: unknown, i: number) => {
            const step = s as { title?: string; detail?: string; links?: { label: string; url: string }[] }
            return (
              <li key={i} className="pl-1">
                <p className="font-semibold text-gray-900">{step.title || `Passo ${i + 1}`}</p>
                {step.detail ? <p className="mt-1 whitespace-pre-wrap text-gray-700">{step.detail}</p> : null}
                {Array.isArray(step.links) && step.links.length ? (
                  <ul className="mt-2 space-y-1">
                    {step.links.map((l, j) => (
                      <li key={j}>
                        <a href={l.url} className="text-blue-700 underline" target="_blank" rel="noreferrer">
                          {l.label || l.url}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ol>
      )
    }
    if (k === 'checklist') {
      const itemsList = Array.isArray(content?.items) ? content.items : []
      return (
        <ul className="space-y-2">
          {itemsList.map((it: unknown, i: number) => (
            <li key={i} className="flex gap-2 text-sm text-gray-800">
              <span className="text-gray-400">☐</span>
              <span>{String((it as { text?: string })?.text ?? '')}</span>
            </li>
          ))}
        </ul>
      )
    }
    if (k === 'dicas') {
      const tips = Array.isArray(content?.tips) ? content.tips : []
      return (
        <ul className="list-disc space-y-2 pl-5 text-sm text-gray-800">
          {tips.map((t: unknown, i: number) => (
            <li key={i}>{String(t)}</li>
          ))}
        </ul>
      )
    }
    if (k === 'documento') {
      const md = String(content?.markdown ?? '')
      return (
        <pre className="whitespace-pre-wrap rounded-lg border border-gray-200 bg-white p-4 text-sm text-gray-800">
          {md || '—'}
        </pre>
      )
    }
    if (k === 'formulario') {
      return (
        <p className="text-sm text-gray-600">
          Em consultoria, abre o separador <strong>Links</strong> e envia o URL ao líder. As respostas aparecem em{' '}
          <strong>Respostas</strong>.
        </p>
      )
    }
    return null
  }, [selected, content])

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-medium text-emerald-700">Pro Líderes · YLADA</p>
        <h1 className="text-2xl font-bold text-gray-900">Consultoria</h1>
        <p className="text-gray-600 text-sm max-w-2xl">
          Materiais para orientar cada consultoria: passo a passo, documentos, dicas, checklists e formulários com link
          público para o líder preencher — as respostas ficam guardadas aqui.
        </p>
      </header>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">{error}</div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm text-gray-600">
          Filtrar:
          <select
            className="ml-2 rounded-lg border border-gray-300 px-2 py-1.5 text-sm"
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value)}
          >
            <option value="all">Todos</option>
            <option value="roteiro">Passo a passo</option>
            <option value="formulario">Formulários</option>
            <option value="checklist">Checklists</option>
            <option value="dicas">Dicas</option>
            <option value="documento">Documentos</option>
          </select>
        </label>
        <span className="text-gray-300">|</span>
        <span className="text-xs text-gray-500">Novo:</span>
        {(['roteiro', 'formulario', 'checklist', 'dicas', 'documento'] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => openNew(k)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-50"
          >
            + {consultoriaKindLabel(k)}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Materiais</h2>
          {loading ? (
            <p className="text-sm text-gray-500">A carregar…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-gray-500">Ainda não há materiais. Cria um com os botões acima.</p>
          ) : (
            <ul className="space-y-2">
              {items.map((it) => (
                <li key={it.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelected(it)
                      setCreating(false)
                      setTab('editar')
                    }}
                    className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${
                      selected?.id === it.id
                        ? 'border-emerald-500 bg-emerald-50/80'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className="font-medium text-gray-900 line-clamp-2">{it.title}</span>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5">{consultoriaKindLabel(it.material_kind)}</span>
                      {it.is_published ? (
                        <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-900">Publicado</span>
                      ) : (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-900">Rascunho</span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm min-h-[320px]">
          {!selected ? (
            <p className="text-sm text-gray-500">Seleciona um material à esquerda ou cria um novo.</p>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 border-b border-gray-100 pb-3">
                {(['editar', 'execucao'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                      tab === t ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t === 'editar' ? 'Editar' : 'Modo consultoria'}
                  </button>
                ))}
                {selected.material_kind === 'formulario' && selected.id ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setTab('links')}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                        tab === 'links' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Links
                    </button>
                    <button
                      type="button"
                      onClick={() => setTab('respostas')}
                      className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                        tab === 'respostas' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Respostas
                    </button>
                  </>
                ) : null}
              </div>

              {tab === 'execucao' ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900">{selected.title || 'Sem título'}</h3>
                  {selected.description ? (
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{selected.description}</p>
                  ) : null}
                  {execBlock}
                </div>
              ) : null}

              {tab === 'links' && selected.material_kind === 'formulario' ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">Links para o líder</h3>
                    <button
                      type="button"
                      disabled={!selected.is_published || auxLoading}
                      onClick={() => void createShareLink()}
                      className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      Gerar novo link
                    </button>
                  </div>
                  {!selected.is_published ? (
                    <p className="text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                      Publica o formulário no separador Editar para os links funcionarem.
                    </p>
                  ) : null}
                  {auxLoading ? <p className="text-xs text-gray-500">A carregar…</p> : null}
                  <ul className="space-y-2 text-sm">
                    {shareLinks.map((lk) => (
                      <li key={lk.id} className="flex flex-col gap-1 rounded-lg border border-gray-100 bg-gray-50 p-3">
                        <code className="text-xs break-all text-gray-800">
                          {buildProLideresConsultoriaResponderUrl(
                            typeof window !== 'undefined' ? window.location.origin : '',
                            lk.token
                          )}
                        </code>
                        <button
                          type="button"
                          onClick={() => copyResponderUrl(lk.token)}
                          className="self-start text-xs font-medium text-blue-700 hover:underline"
                        >
                          Copiar URL
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {tab === 'respostas' && selected.material_kind === 'formulario' ? (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-900">Respostas recebidas</h3>
                  {auxLoading ? <p className="text-xs text-gray-500">A carregar…</p> : null}
                  {responses.length === 0 ? (
                    <p className="text-sm text-gray-500">Ainda não há respostas.</p>
                  ) : (
                    <div className="max-h-[420px] overflow-auto space-y-3">
                      {responses.map((r) => (
                        <div key={r.id} className="rounded-lg border border-gray-100 p-3 text-xs">
                          <p className="text-gray-500">
                            {new Date(r.submitted_at).toLocaleString('pt-BR')}
                            {r.respondent_name ? ` · ${r.respondent_name}` : ''}
                            {r.respondent_email ? ` · ${r.respondent_email}` : ''}
                          </p>
                          <pre className="mt-2 whitespace-pre-wrap break-words text-gray-800">
                            {JSON.stringify(r.answers, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}

              {tab === 'editar' ? (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block text-sm">
                      <span className="text-gray-600">Título</span>
                      <input
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        value={selected.title}
                        onChange={(e) => patchSelected({ title: e.target.value })}
                      />
                    </label>
                    <label className="block text-sm">
                      <span className="text-gray-600">Tipo</span>
                      <select
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        value={selected.material_kind}
                        onChange={(e) => {
                          const k = e.target.value as ProLideresConsultoriaMaterialKind
                          patchSelected({
                            material_kind: k,
                            content: defaultContentForKind(k),
                          })
                        }}
                      >
                        <option value="roteiro">{consultoriaKindLabel('roteiro')}</option>
                        <option value="formulario">{consultoriaKindLabel('formulario')}</option>
                        <option value="checklist">{consultoriaKindLabel('checklist')}</option>
                        <option value="dicas">{consultoriaKindLabel('dicas')}</option>
                        <option value="documento">{consultoriaKindLabel('documento')}</option>
                      </select>
                    </label>
                  </div>
                  <label className="block text-sm">
                    <span className="text-gray-600">Descrição (opcional)</span>
                    <textarea
                      className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[72px]"
                      value={selected.description ?? ''}
                      onChange={(e) => patchSelected({ description: e.target.value || null })}
                    />
                  </label>
                  <div className="grid gap-3 sm:grid-cols-2 items-end">
                    <label className="block text-sm">
                      <span className="text-gray-600">Ordem (lista)</span>
                      <input
                        type="number"
                        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        value={selected.sort_order}
                        onChange={(e) => patchSelected({ sort_order: Number(e.target.value) || 0 })}
                      />
                    </label>
                    <label className="flex items-center gap-2 text-sm pb-2">
                      <input
                        type="checkbox"
                        checked={selected.is_published}
                        onChange={(e) => patchSelected({ is_published: e.target.checked })}
                      />
                      <span className="text-gray-800">Publicado</span>
                    </label>
                  </div>

                  <KindEditor kind={selected.material_kind} content={content} onChange={patchContent} />

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => void save()}
                      disabled={saving}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {saving ? 'A guardar…' : creating ? 'Criar material' : 'Guardar alterações'}
                    </button>
                    {selected.id ? (
                      <button
                        type="button"
                        onClick={() => void remove(selected.id)}
                        className="rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-50"
                      >
                        Eliminar
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(null)
                          setCreating(false)
                        }}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function KindEditor({
  kind,
  content,
  onChange,
}: {
  kind: ProLideresConsultoriaMaterialKind
  content: Record<string, unknown>
  onChange: (c: Record<string, unknown>) => void
}) {
  if (kind === 'roteiro') {
    const steps = Array.isArray(content.steps) ? [...content.steps] : []
    return (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">Define o passo a passo da consultoria. Em “Modo consultoria” vês só isto.</p>
        {steps.map((raw, i) => {
          const s = (raw && typeof raw === 'object' ? raw : {}) as {
            title?: string
            detail?: string
            links?: { label: string; url: string }[]
          }
          const links = Array.isArray(s.links) ? s.links : []
          return (
            <div key={i} className="rounded-xl border border-gray-200 p-3 space-y-2">
              <div className="flex justify-between gap-2">
                <span className="text-xs font-semibold text-gray-500">Passo {i + 1}</span>
                <button
                  type="button"
                  className="text-xs text-red-700 hover:underline"
                  onClick={() => {
                    const next = steps.filter((_, j) => j !== i)
                    onChange({ ...content, steps: next })
                  }}
                >
                  Remover
                </button>
              </div>
              <input
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm"
                placeholder="Título do passo"
                value={s.title ?? ''}
                onChange={(e) => {
                  const next = [...steps]
                  next[i] = { ...s, title: e.target.value }
                  onChange({ ...content, steps: next })
                }}
              />
              <textarea
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm min-h-[80px]"
                placeholder="O que dizes / observas neste passo"
                value={s.detail ?? ''}
                onChange={(e) => {
                  const next = [...steps]
                  next[i] = { ...s, detail: e.target.value, links }
                  onChange({ ...content, steps: next })
                }}
              />
              <p className="text-xs text-gray-500">Links (rótulo e URL)</p>
              {links.map((l, li) => (
                <div key={li} className="flex gap-2">
                  <input
                    className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
                    placeholder="Texto do link"
                    value={l.label}
                    onChange={(e) => {
                      const nextL = links.map((x, j) => (j === li ? { ...x, label: e.target.value } : x))
                      const next = [...steps]
                      next[i] = { ...s, links: nextL }
                      onChange({ ...content, steps: next })
                    }}
                  />
                  <input
                    className="flex-[2] rounded border border-gray-300 px-2 py-1 text-xs"
                    placeholder="https://…"
                    value={l.url}
                    onChange={(e) => {
                      const nextL = links.map((x, j) => (j === li ? { ...x, url: e.target.value } : x))
                      const next = [...steps]
                      next[i] = { ...s, links: nextL }
                      onChange({ ...content, steps: next })
                    }}
                  />
                  <button
                    type="button"
                    className="text-xs text-red-600"
                    onClick={() => {
                      const nextL = links.filter((_, j) => j !== li)
                      const next = [...steps]
                      next[i] = { ...s, links: nextL }
                      onChange({ ...content, steps: next })
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-xs font-medium text-blue-700 hover:underline"
                onClick={() => {
                  const nextL = [...links, { label: '', url: '' }]
                  const next = [...steps]
                  next[i] = { ...s, links: nextL }
                  onChange({ ...content, steps: next })
                }}
              >
                + Link
              </button>
            </div>
          )
        })}
        <button
          type="button"
          className="text-sm font-medium text-emerald-700 hover:underline"
          onClick={() => onChange({ ...content, steps: [...steps, { title: '', detail: '', links: [] }] })}
        >
          + Adicionar passo
        </button>
      </div>
    )
  }

  if (kind === 'formulario') {
    const fields = Array.isArray(content.fields) ? [...content.fields] : []
    return (
      <div className="space-y-3">
        <p className="text-xs text-gray-500">
          Cada campo tem um identificador técnico (id) usado nas respostas. Depois de publicar, gera links no separador
          Links.
        </p>
        {fields.map((raw, i) => {
          const f = (raw && typeof raw === 'object' ? raw : {}) as {
            id?: string
            label?: string
            type?: string
            required?: boolean
            options?: string[]
          }
          return (
            <div key={i} className="rounded-xl border border-gray-200 p-3 grid gap-2 sm:grid-cols-2">
              <input
                className="rounded border border-gray-300 px-2 py-1.5 text-sm"
                placeholder="id (ex.: faturacao_media)"
                value={f.id ?? ''}
                onChange={(e) => {
                  const next = [...fields]
                  next[i] = { ...f, id: e.target.value }
                  onChange({ ...content, fields: next })
                }}
              />
              <input
                className="rounded border border-gray-300 px-2 py-1.5 text-sm"
                placeholder="Pergunta / rótulo"
                value={f.label ?? ''}
                onChange={(e) => {
                  const next = [...fields]
                  next[i] = { ...f, label: e.target.value }
                  onChange({ ...content, fields: next })
                }}
              />
              <select
                className="rounded border border-gray-300 px-2 py-1.5 text-sm"
                value={f.type === 'textarea' ? 'textarea' : f.type === 'select' ? 'select' : 'text'}
                onChange={(e) => {
                  const next = [...fields]
                  next[i] = { ...f, type: e.target.value }
                  onChange({ ...content, fields: next })
                }}
              >
                <option value="text">Texto curto</option>
                <option value="textarea">Texto longo</option>
                <option value="select">Escolha (lista)</option>
              </select>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={Boolean(f.required)}
                  onChange={(e) => {
                    const next = [...fields]
                    next[i] = { ...f, required: e.target.checked }
                    onChange({ ...content, fields: next })
                  }}
                />
                Obrigatório
              </label>
              {f.type === 'select' ? (
                <textarea
                  className="sm:col-span-2 rounded border border-gray-300 px-2 py-1.5 text-sm min-h-[64px]"
                  placeholder="Opções (uma por linha)"
                  value={(f.options ?? []).join('\n')}
                  onChange={(e) => {
                    const opts = e.target.value
                      .split('\n')
                      .map((x) => x.trim())
                      .filter(Boolean)
                    const next = [...fields]
                    next[i] = { ...f, options: opts }
                    onChange({ ...content, fields: next })
                  }}
                />
              ) : null}
              <div className="sm:col-span-2 flex justify-end">
                <button
                  type="button"
                  className="text-xs text-red-700 hover:underline"
                  onClick={() => onChange({ ...content, fields: fields.filter((_, j) => j !== i) })}
                >
                  Remover campo
                </button>
              </div>
            </div>
          )
        })}
        <button
          type="button"
          className="text-sm font-medium text-emerald-700 hover:underline"
          onClick={() =>
            onChange({
              ...content,
              fields: [...fields, { id: `campo_${fields.length + 1}`, label: '', type: 'text', required: false }],
            })
          }
        >
          + Campo
        </button>
      </div>
    )
  }

  if (kind === 'checklist') {
    const items = Array.isArray(content.items) ? [...content.items] : []
    return (
      <div className="space-y-2">
        {items.map((raw, i) => {
          const it = (raw && typeof raw === 'object' ? raw : {}) as { text?: string }
          return (
            <div key={i} className="flex gap-2">
              <input
                className="flex-1 rounded border border-gray-300 px-2 py-1.5 text-sm"
                value={it.text ?? ''}
                onChange={(e) => {
                  const next = [...items]
                  next[i] = { text: e.target.value }
                  onChange({ ...content, items: next })
                }}
              />
              <button
                type="button"
                className="text-xs text-red-600 px-1"
                onClick={() => onChange({ ...content, items: items.filter((_, j) => j !== i) })}
              >
                ✕
              </button>
            </div>
          )
        })}
        <button
          type="button"
          className="text-sm font-medium text-emerald-700 hover:underline"
          onClick={() => onChange({ ...content, items: [...items, { text: '' }] })}
        >
          + Item
        </button>
      </div>
    )
  }

  if (kind === 'dicas') {
    const tips = Array.isArray(content.tips) ? content.tips.map(String) : []
    return (
      <label className="block text-sm">
        <span className="text-gray-600">Uma dica por linha</span>
        <textarea
          className="mt-1 w-full min-h-[160px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
          value={tips.join('\n')}
          onChange={(e) =>
            onChange({
              ...content,
              tips: e.target.value
                .split('\n')
                .map((x) => x.trim())
                .filter(Boolean),
            })
          }
        />
      </label>
    )
  }

  if (kind === 'documento') {
    return (
      <label className="block text-sm">
        <span className="text-gray-600">Markdown</span>
        <textarea
          className="mt-1 w-full min-h-[220px] rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
          value={String(content.markdown ?? '')}
          onChange={(e) => onChange({ ...content, markdown: e.target.value })}
        />
      </label>
    )
  }

  return null
}
