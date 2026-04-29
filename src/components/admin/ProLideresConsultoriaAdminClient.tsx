'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ConsultoriaKindEditor } from '@/components/admin/consultoria/ConsultoriaKindEditor'
import { ConsultoriaAdminResponseCard } from '@/components/admin/consultoria/ConsultoriaAdminResponseCard'
import { consultoriaCsvFilenameBase, consultoriaFormResponsesToCsv } from '@/lib/consultoria-form-csv'
import { consultoriaAnswersToDisplayRows } from '@/lib/consultoria-form-display'
import {
  buildProLideresConsultoriaResponderUrl,
  consultoriaKindLabel,
  defaultContentForKind,
  getConsultoriaFormFields,
  type ProLideresConsultoriaMaterialKind,
  type ProLideresConsultoriaMaterialRow,
  type ProLideresConsultoriaFormResponseRow,
  type ProLideresConsultoriaShareLinkRow,
} from '@/lib/pro-lideres-consultoria'

type TabKey = 'editar' | 'execucao' | 'links' | 'respostas'

/** Rótulo na lista à esquerda (admin respostas). */
function adminRespondentListLabel(r: ProLideresConsultoriaFormResponseRow): string {
  const n = r.respondent_name?.trim()
  if (n) return n
  const e = r.respondent_email?.trim()
  if (e) return e
  return 'Sem nome no envio'
}

function normalizeSearchText(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

function responseMatchesQuery(
  r: ProLideresConsultoriaFormResponseRow,
  rawQuery: string
): boolean {
  const q = rawQuery.trim()
  if (!q) return true
  const nq = normalizeSearchText(q)
  const head = [r.respondent_name, r.respondent_email].filter(Boolean).join(' ')
  if (normalizeSearchText(head).includes(nq)) return true
  try {
    const answersBlob = normalizeSearchText(JSON.stringify(r.answers ?? {}))
    return answersBlob.includes(nq)
  } catch {
    return false
  }
}

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
  const [deleteLinkBusy, setDeleteLinkBusy] = useState<string | null>(null)
  const [adminFichaResponseId, setAdminFichaResponseId] = useState<string | null>(null)
  const [deleteResponseBusy, setDeleteResponseBusy] = useState<string | null>(null)
  const [buscaRespostas, setBuscaRespostas] = useState('')

  const respostasFiltradas = useMemo(
    () => responses.filter((r) => responseMatchesQuery(r, buscaRespostas)),
    [responses, buscaRespostas]
  )

  const respostasPorNome = useMemo(() => {
    return [...respostasFiltradas].sort((a, b) => {
      const la = adminRespondentListLabel(a).toLocaleLowerCase('pt')
      const lb = adminRespondentListLabel(b).toLocaleLowerCase('pt')
      if (la !== lb) return la.localeCompare(lb, 'pt')
      return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    })
  }, [respostasFiltradas])

  const fichaResponse = useMemo(
    () => (adminFichaResponseId ? respostasFiltradas.find((r) => r.id === adminFichaResponseId) ?? null : null),
    [respostasFiltradas, adminFichaResponseId]
  )

  useEffect(() => {
    setAdminFichaResponseId(null)
  }, [selected?.id])

  useEffect(() => {
    if (!adminFichaResponseId) return
    if (!respostasFiltradas.some((r) => r.id === adminFichaResponseId)) {
      setAdminFichaResponseId(null)
    }
  }, [respostasFiltradas, adminFichaResponseId])

  const formFieldsForResponses = useMemo(() => {
    if (!selected || selected.material_kind !== 'formulario') return []
    const c = selected.content && typeof selected.content === 'object' ? selected.content : {}
    return getConsultoriaFormFields(c as Record<string, unknown>)
  }, [selected])

  const triggerCsvDownload = useCallback((filename: string, csv: string) => {
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.rel = 'noopener'
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const downloadResponsesCsv = useCallback(() => {
    if (!selected?.title || respostasFiltradas.length === 0) return
    const slug = (selected.title || 'formulario').replace(/\s+/g, '-').slice(0, 32)
    const csv = consultoriaFormResponsesToCsv(formFieldsForResponses, respostasFiltradas)
    const fn = consultoriaCsvFilenameBase('pro-lideres-admin', `${slug}-respostas`)
    triggerCsvDownload(fn, csv)
  }, [selected?.title, respostasFiltradas, formFieldsForResponses, triggerCsvDownload])

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

  useEffect(() => {
    setBuscaRespostas('')
  }, [selected?.id])

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
    if (shareLinks.length >= 1) {
      const ok = window.confirm(
        'Isto cria mais um URL público. Só use se precisar de um link extra. Pode apagar links a mais na lista. Continuar?'
      )
      if (!ok) return
    }
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

  const deleteFormResponse = async (responseId: string) => {
    if (!selected?.id) return
    if (!confirm('Eliminar definitivamente esta ficha de resposta? Não é possível desfazer.')) return
    setDeleteResponseBusy(responseId)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/pro-lideres/consultoria/materials/${selected.id}/responses/${encodeURIComponent(responseId)}`,
        { method: 'DELETE', credentials: 'include' }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao eliminar a resposta.')
        return
      }
      setAdminFichaResponseId(null)
      await loadAuxForForm(selected.id)
    } finally {
      setDeleteResponseBusy(null)
    }
  }

  const deleteShareLink = async (linkId: string) => {
    if (!selected?.id) return
    if (
      !confirm(
        'Eliminar este link? Quem já o tiver deixa de abrir o formulário por este endereço. Respostas já enviadas mantêm-se.'
      )
    ) {
      return
    }
    setDeleteLinkBusy(linkId)
    setError(null)
    try {
      const res = await fetch(
        `/api/admin/pro-lideres/consultoria/materials/${selected.id}/share-links/${encodeURIComponent(linkId)}`,
        { method: 'DELETE', credentials: 'include' }
      )
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Erro ao eliminar o link.')
        return
      }
      await loadAuxForForm(selected.id)
    } finally {
      setDeleteLinkBusy(null)
    }
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
        <p className="text-sm">
          <Link href="/admin/consultorias" className="font-semibold text-blue-600 underline hover:text-blue-800">
            Todas as consultorias
          </Link>
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
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">Links para o líder</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Cada URL é um convite. Evite duplicar sem necessidade — pode apagar os que sobrem.
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={!selected.is_published || auxLoading}
                      onClick={() => void createShareLink()}
                      className="shrink-0 rounded-lg border border-emerald-600 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-900 hover:bg-emerald-100 disabled:opacity-50"
                    >
                      Gerar link adicional
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
                      <li
                        key={lk.id}
                        className="flex flex-col gap-2 rounded-lg border border-gray-100 bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <code className="min-w-0 flex-1 text-xs break-all text-gray-800">
                          {buildProLideresConsultoriaResponderUrl(
                            typeof window !== 'undefined' ? window.location.origin : '',
                            lk.token
                          )}
                        </code>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => copyResponderUrl(lk.token)}
                            className="rounded-md px-2 py-1 text-xs font-medium text-blue-700 hover:bg-white hover:underline"
                          >
                            Copiar URL
                          </button>
                          <button
                            type="button"
                            disabled={deleteLinkBusy === lk.id || auxLoading}
                            onClick={() => void deleteShareLink(lk.id)}
                            className="rounded-md border border-red-200 bg-white px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-50 disabled:opacity-50"
                          >
                            {deleteLinkBusy === lk.id ? 'A eliminar…' : 'Eliminar'}
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {tab === 'respostas' && selected.material_kind === 'formulario' ? (
                <div className="space-y-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm font-semibold text-gray-900">Respostas recebidas</h3>
                    <button
                      type="button"
                      disabled={respostasFiltradas.length === 0 || auxLoading}
                      onClick={() => downloadResponsesCsv()}
                      className="inline-flex min-h-[40px] items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900 hover:bg-emerald-100 disabled:opacity-50"
                    >
                      Descarregar CSV
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Lista por nome à esquerda — <strong>Abrir</strong> para ver a ficha completa ou{' '}
                    <strong>Eliminar</strong> para apagar só esse envio (irreversível). O CSV usa o filtro de busca
                    atual. Separador ponto e vírgula no Excel (PT).
                  </p>
                  {auxLoading ? <p className="text-xs text-gray-500">A carregar…</p> : null}
                  {responses.length === 0 ? (
                    <p className="text-sm text-gray-500">Ainda não há respostas.</p>
                  ) : (
                    <>
                      <label className="block max-w-md">
                        <span className="sr-only">Buscar respostas</span>
                        <input
                          type="search"
                          value={buscaRespostas}
                          onChange={(e) => setBuscaRespostas(e.target.value)}
                          placeholder="Buscar por nome, e-mail ou texto das respostas…"
                          autoComplete="off"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                      </label>
                      {respostasFiltradas.length === 0 ? (
                        <p className="text-sm text-gray-500">Nenhum resultado para esta busca.</p>
                      ) : (
                        <div className="grid gap-4 lg:grid-cols-[minmax(220px,280px)_1fr] lg:items-start">
                          <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-2">
                            <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
                              Respostas por nome
                            </p>
                            <ul className="max-h-[min(60vh,560px)] space-y-1.5 overflow-y-auto pr-1">
                              {respostasPorNome.map((r) => {
                                const active = adminFichaResponseId === r.id
                                return (
                                  <li key={r.id} className="flex gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setAdminFichaResponseId(r.id)}
                                      className={`min-w-0 flex-1 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                                        active
                                          ? 'bg-emerald-600 text-white shadow-sm'
                                          : 'bg-white text-gray-900 hover:bg-emerald-50/80 border border-transparent hover:border-emerald-100'
                                      }`}
                                    >
                                      <span className="block font-semibold leading-snug">
                                        {adminRespondentListLabel(r)}
                                      </span>
                                      <span
                                        className={`mt-0.5 block text-xs ${active ? 'text-emerald-100' : 'text-gray-500'}`}
                                      >
                                        {new Date(r.submitted_at).toLocaleString('pt-BR', {
                                          dateStyle: 'short',
                                          timeStyle: 'short',
                                        })}
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      title="Eliminar esta resposta"
                                      aria-label={`Eliminar resposta de ${adminRespondentListLabel(r)}`}
                                      disabled={deleteResponseBusy === r.id || auxLoading}
                                      onClick={() => void deleteFormResponse(r.id)}
                                      className="shrink-0 self-stretch rounded-lg border border-red-200 bg-white px-2 py-1 text-[11px] font-semibold leading-tight text-red-800 hover:bg-red-50 disabled:opacity-50 sm:min-w-[4.5rem]"
                                    >
                                      {deleteResponseBusy === r.id ? '…' : 'Eliminar'}
                                    </button>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                          <div className="min-w-0">
                            {!fichaResponse ? (
                              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 px-4 py-12 text-center text-sm text-gray-500">
                                Clique num nome à esquerda para ver a ficha completa aqui, ou use <strong>Eliminar</strong>{' '}
                                na lista para apagar sem abrir.
                              </div>
                            ) : (
                              <ConsultoriaAdminResponseCard
                                tone="gray"
                                submittedAt={fichaResponse.submitted_at}
                                respondentName={fichaResponse.respondent_name}
                                respondentEmail={fichaResponse.respondent_email}
                                respondentWhatsapp={fichaResponse.respondent_whatsapp}
                                rows={consultoriaAnswersToDisplayRows(
                                  formFieldsForResponses,
                                  (fichaResponse.answers &&
                                  typeof fichaResponse.answers === 'object' &&
                                  !Array.isArray(fichaResponse.answers)
                                    ? fichaResponse.answers
                                    : {}) as Record<string, unknown>
                                )}
                                rawAnswers={fichaResponse.answers}
                                footer={
                                  <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-xs text-gray-600">
                                      Elimina só este envio; o formulário e os links mantêm-se.
                                    </p>
                                    <button
                                      type="button"
                                      disabled={deleteResponseBusy === fichaResponse.id || auxLoading}
                                      onClick={() => void deleteFormResponse(fichaResponse.id)}
                                      className="rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-800 hover:bg-red-50 disabled:opacity-50"
                                    >
                                      {deleteResponseBusy === fichaResponse.id ? 'A eliminar…' : 'Eliminar ficha'}
                                    </button>
                                  </div>
                                }
                              />
                            )}
                          </div>
                        </div>
                      )}
                    </>
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

                  <ConsultoriaKindEditor kind={selected.material_kind} content={content} onChange={patchContent} />

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
