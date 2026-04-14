'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'
import type { ProLideresCatalogItem } from '@/lib/pro-lideres-catalog-build'
import type { ProLideresScriptSectionWithEntries } from '@/types/leader-tenant'

type ScriptsPayload = {
  sections?: ProLideresScriptSectionWithEntries[]
  canEdit?: boolean
  error?: string
  /** Só em desenvolvimento (API): dica para .env.local / tenant */
  devHint?: string
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

function formatScriptBlock(s: ProLideresScriptSectionWithEntries['entries'][0]): string {
  const lines: string[] = [s.title]
  if (s.subtitle?.trim()) lines.push('', s.subtitle.trim())
  if (s.body?.trim()) lines.push('', s.body.trim())
  if (s.how_to_use?.trim()) lines.push('', 'Como usar:', s.how_to_use.trim())
  return lines.join('\n')
}

export function ProLideresScriptsClient() {
  const { teamViewPreview, devStubPanel } = useProLideresPainel()
  const [sections, setSections] = useState<ProLideresScriptSectionWithEntries[]>([])
  const [catalog, setCatalog] = useState<ProLideresCatalogItem[]>([])
  const [canEdit, setCanEdit] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [devHint, setDevHint] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const toolLabelByLinkId = useMemo(() => {
    const m = new Map<string, string>()
    for (const item of catalog) {
      if (item.yladaLinkId) m.set(item.yladaLinkId, item.label)
    }
    return m
  }, [catalog])

  const canEditUi = canEdit && !teamViewPreview

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setDevHint(null)
    try {
      const [scriptsRes, flowsRes] = await Promise.all([
        fetch('/api/pro-lideres/scripts', { credentials: 'include' }),
        fetch('/api/pro-lideres/flows', { credentials: 'include' }),
      ])
      const scriptsData = (await scriptsRes.json().catch(() => ({}))) as ScriptsPayload
      const flowsData = (await flowsRes.json().catch(() => ({}))) as {
        catalog?: ProLideresCatalogItem[]
        error?: string
        devHint?: string
      }

      if (!scriptsRes.ok) {
        setError(scriptsData.error || 'Não foi possível carregar os scripts.')
        setDevHint(scriptsData.devHint ?? null)
        setSections([])
        setCanEdit(false)
        return
      }
      if (!flowsRes.ok) {
        setError(flowsData.error || 'Não foi possível carregar o catálogo (fluxos).')
        setDevHint(flowsData.devHint ?? null)
        setSections(scriptsData.sections ?? [])
        setCanEdit(scriptsData.canEdit !== false)
        setCatalog([])
        return
      }
      setSections(scriptsData.sections ?? [])
      setCanEdit(scriptsData.canEdit !== false)
      setCatalog(Array.isArray(flowsData.catalog) ? flowsData.catalog : [])
    } catch {
      setError('Erro de rede.')
      setSections([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function moveSection(index: number, dir: -1 | 1) {
    const next = index + dir
    if (next < 0 || next >= sections.length) return
    const a = sections[index]
    const b = sections[next]
    setSaving(true)
    setError(null)
    try {
      const [r1, r2] = await Promise.all([
        fetch(`/api/pro-lideres/scripts/sections/${a.id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: b.sort_order }),
        }),
        fetch(`/api/pro-lideres/scripts/sections/${b.id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: a.sort_order }),
        }),
      ])
      const j1 = await r1.json().catch(() => ({}))
      const j2 = await r2.json().catch(() => ({}))
      if (!r1.ok || !r2.ok) {
        setError(
          (j1 as { error?: string }).error ||
            (j2 as { error?: string }).error ||
            'Não foi possível reordenar as situações.'
        )
        return
      }
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function moveEntry(sectionId: string, index: number, dir: -1 | 1) {
    const sec = sections.find((s) => s.id === sectionId)
    if (!sec) return
    const list = sec.entries
    const next = index + dir
    if (next < 0 || next >= list.length) return
    const a = list[index]
    const b = list[next]
    setSaving(true)
    setError(null)
    try {
      const [r1, r2] = await Promise.all([
        fetch(`/api/pro-lideres/scripts/entries/${a.id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: b.sort_order }),
        }),
        fetch(`/api/pro-lideres/scripts/entries/${b.id}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sort_order: a.sort_order }),
        }),
      ])
      const j1 = await r1.json().catch(() => ({}))
      const j2 = await r2.json().catch(() => ({}))
      if (!r1.ok || !r2.ok) {
        setError(
          (j1 as { error?: string }).error ||
            (j2 as { error?: string }).error ||
            'Não foi possível reordenar os scripts.'
        )
        return
      }
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function onCopyEntry(id: string, text: string) {
    const ok = await copyText(text)
    if (ok) {
      setCopiedId(id)
      window.setTimeout(() => setCopiedId(null), 2000)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-sm font-medium text-blue-600">Conteúdo</p>
        <h1 className="text-2xl font-bold text-gray-900">Scripts</h1>
        <p className="mt-1 max-w-2xl text-gray-600">
          Roteiros por <strong className="text-gray-800">situação</strong> (assunto / ferramenta): em cada uma defines a
          ordem, o <strong className="text-gray-800">título</strong>, <strong className="text-gray-800">subtítulo</strong>{' '}
          (ex.: postagens, antes de enviar o link), o <strong className="text-gray-800">texto</strong> e opcionalmente{' '}
          <strong className="text-gray-800">como usar</strong>. A tua equipe vê o mesmo painel, em leitura.
        </p>
      </div>

      {devStubPanel && (
        <p className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          Modo dev sem tenant na base: gravação pode falhar até existir tenant e a migration{' '}
          <code className="rounded bg-amber-100/80 px-1">312-pro-lideres-tenant-scripts-sections.sql</code> estar aplicada.
        </p>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p>{error}</p>
          {devHint ? <p className="mt-2 border-t border-red-200/80 pt-2 text-xs text-red-900/90">{devHint}</p> : null}
        </div>
      )}

      {canEditUi && (
        <NewSectionForm
          saving={saving}
          catalog={catalog}
          onCreated={async () => {
            setSaving(true)
            try {
              await load()
            } finally {
              setSaving(false)
            }
          }}
          onError={setError}
          onSaving={setSaving}
        />
      )}

      {loading ? (
        <p className="text-gray-600">A carregar…</p>
      ) : sections.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-600">
          {canEditUi
            ? 'Ainda não há situações. Cria a primeira acima (ex.: uma ferramenta do catálogo ou uma fase da conversa).'
            : 'O líder ainda não publicou scripts aqui.'}
        </p>
      ) : (
        <ul className="space-y-6">
          {sections.map((sec, secIdx) => (
            <li key={sec.id} className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <SectionBlock
                section={sec}
                secIdx={secIdx}
                secCount={sections.length}
                toolLabel={sec.ylada_link_id ? toolLabelByLinkId.get(sec.ylada_link_id) ?? null : null}
                canEditUi={canEditUi}
                saving={saving}
                copiedId={copiedId}
                catalog={catalog}
                onReload={load}
                onError={setError}
                onSaving={setSaving}
                onCopyEntry={onCopyEntry}
                onMoveSection={moveSection}
                onMoveEntry={moveEntry}
              />
            </li>
          ))}
        </ul>
      )}

      <p className="text-sm text-gray-500">
        Dica: usa o{' '}
        <Link href="/pro-lideres/painel/noel" className="font-medium text-blue-600 hover:text-blue-800">
          Noel
        </Link>{' '}
        para gerar variantes e depois organiza aqui por situação.
      </p>
    </div>
  )
}

function NewSectionForm({
  catalog,
  saving,
  onCreated,
  onError,
  onSaving,
}: {
  catalog: ProLideresCatalogItem[]
  saving: boolean
  onCreated: () => Promise<void>
  onError: (e: string | null) => void
  onSaving: (v: boolean) => void
}) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [yladaLinkId, setYladaLinkId] = useState('')

  const toolOptions = useMemo(() => {
    const withId = catalog.filter((c): c is ProLideresCatalogItem & { yladaLinkId: string } => Boolean(c.yladaLinkId))
    return withId
  }, [catalog])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    onError(null)
    onSaving(true)
    try {
      const res = await fetch('/api/pro-lideres/scripts/sections', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: t,
          subtitle: subtitle.trim() || null,
          ylada_link_id: yladaLinkId || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        onError((data as { error?: string }).error || 'Não foi possível criar.')
        return
      }
      setTitle('')
      setSubtitle('')
      setYladaLinkId('')
      await onCreated()
    } catch {
      onError('Erro de rede.')
    } finally {
      onSaving(false)
    }
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-gray-900">Nova situação</h2>
      <p className="mt-1 text-sm text-gray-600">
        Assunto do bloco (ex.: &quot;Quiz metabolismo&quot; ou &quot;Antes de mandar o link&quot;). Opcionalmente associa
        uma ferramenta do catálogo.
      </p>
      <form onSubmit={(e) => void onSubmit(e)} className="mt-4 space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Assunto (título da situação)</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
            maxLength={200}
            required
            placeholder="Ex.: Ferramenta X — explicar e pedir permissão"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Subtítulo (opcional)</span>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
            maxLength={300}
            placeholder="Ex.: sequência sugerida para esta ferramenta"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Ferramenta do catálogo (opcional)</span>
          <select
            value={yladaLinkId}
            onChange={(e) => setYladaLinkId(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
          >
            <option value="">Nenhuma — só texto / fase da conversa</option>
            {toolOptions.map((c) => (
              <option key={c.yladaLinkId} value={c.yladaLinkId}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={saving}
          className="min-h-[44px] rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'A guardar…' : 'Criar situação'}
        </button>
      </form>
    </section>
  )
}

function SectionBlock({
  section,
  secIdx,
  secCount,
  toolLabel,
  canEditUi,
  saving,
  copiedId,
  catalog,
  onReload,
  onError,
  onSaving,
  onCopyEntry,
  onMoveSection,
  onMoveEntry,
}: {
  section: ProLideresScriptSectionWithEntries
  secIdx: number
  secCount: number
  toolLabel: string | null
  canEditUi: boolean
  saving: boolean
  copiedId: string | null
  catalog: ProLideresCatalogItem[]
  onReload: () => Promise<void>
  onError: (e: string | null) => void
  onSaving: (v: boolean) => void
  onCopyEntry: (id: string, text: string) => void
  onMoveSection: (index: number, dir: -1 | 1) => void
  onMoveEntry: (sectionId: string, index: number, dir: -1 | 1) => void
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(section.title)
  const [subtitle, setSubtitle] = useState(section.subtitle ?? '')
  const [yladaLinkId, setYladaLinkId] = useState(section.ylada_link_id ?? '')

  useEffect(() => {
    setTitle(section.title)
    setSubtitle(section.subtitle ?? '')
    setYladaLinkId(section.ylada_link_id ?? '')
  }, [section.title, section.subtitle, section.ylada_link_id])

  const toolOptions = useMemo(() => {
    return catalog.filter((c): c is ProLideresCatalogItem & { yladaLinkId: string } => Boolean(c.yladaLinkId))
  }, [catalog])

  async function saveSection() {
    onError(null)
    onSaving(true)
    try {
      const res = await fetch(`/api/pro-lideres/scripts/sections/${section.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          subtitle: subtitle.trim() || null,
          ylada_link_id: yladaLinkId || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        onError((data as { error?: string }).error || 'Não foi possível guardar.')
        return
      }
      setEditing(false)
      await onReload()
    } catch {
      onError('Erro de rede.')
    } finally {
      onSaving(false)
    }
  }

  async function removeSection() {
    if (!confirm('Apagar esta situação e todos os scripts dentro dela?')) return
    onError(null)
    onSaving(true)
    try {
      const res = await fetch(`/api/pro-lideres/scripts/sections/${section.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        onError((data as { error?: string }).error || 'Não foi possível apagar.')
        return
      }
      await onReload()
    } catch {
      onError('Erro de rede.')
    } finally {
      onSaving(false)
    }
  }

  return (
    <div>
      <div className="border-b border-gray-100 p-4 sm:p-5">
        {editing ? (
          <div className="space-y-3">
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700">Assunto</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                maxLength={200}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700">Subtítulo</span>
              <input
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                maxLength={300}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1 block font-medium text-gray-700">Ferramenta</span>
              <select
                value={yladaLinkId}
                onChange={(e) => setYladaLinkId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="">Nenhuma</option>
                {toolOptions.map((c) => (
                  <option key={c.yladaLinkId} value={c.yladaLinkId}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void saveSection()}
                disabled={saving}
                className="min-h-[44px] rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="min-h-[44px] rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-gray-900">{section.title}</h2>
              {section.subtitle?.trim() && <p className="mt-1 text-sm text-gray-600">{section.subtitle}</p>}
              {toolLabel && (
                <p className="mt-2 text-xs text-gray-500">
                  Ferramenta: <span className="font-medium text-gray-700">{toolLabel}</span>
                </p>
              )}
              {section.ylada_link_id && !toolLabel && (
                <p className="mt-2 text-xs text-amber-700">Ferramenta ligada (detalhe no catálogo).</p>
              )}
            </div>
            {canEditUi && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void onMoveSection(secIdx, -1)}
                  disabled={saving || secIdx <= 0}
                  className="min-h-[44px] rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                  aria-label="Mover situação para cima"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => void onMoveSection(secIdx, 1)}
                  disabled={saving || secIdx >= secCount - 1}
                  className="min-h-[44px] rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                  aria-label="Mover situação para baixo"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="min-h-[44px] rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Editar situação
                </button>
                <button
                  type="button"
                  onClick={() => void removeSection()}
                  className="min-h-[44px] rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700 hover:bg-red-50"
                >
                  Apagar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3 p-4 sm:p-5 sm:pt-4">
        {canEditUi && !editing && (
          <NewEntryForm
            sectionId={section.id}
            saving={saving}
            onCreated={onReload}
            onError={onError}
            onSaving={onSaving}
          />
        )}

        {section.entries.length === 0 ? (
          <p className="text-sm text-gray-500">
            {canEditUi && !editing ? 'Ainda não há scripts nesta situação.' : 'Sem scripts nesta situação.'}
          </p>
        ) : (
          <ol className="list-decimal space-y-4 pl-5 marker:font-semibold marker:text-blue-700">
            {section.entries.map((ent, entIdx) => (
              <li key={ent.id} className="pl-1">
                <EntryCard
                  entry={ent}
                  entIdx={entIdx}
                  entCount={section.entries.length}
                  sectionId={section.id}
                  canEditUi={canEditUi}
                  editingSection={editing}
                  saving={saving}
                  copiedId={copiedId}
                  onReload={onReload}
                  onError={onError}
                  onSaving={onSaving}
                  onCopyEntry={onCopyEntry}
                  onMoveEntry={onMoveEntry}
                />
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

function NewEntryForm({
  sectionId,
  saving,
  onCreated,
  onError,
  onSaving,
}: {
  sectionId: string
  saving: boolean
  onCreated: () => Promise<void>
  onError: (e: string | null) => void
  onSaving: (v: boolean) => void
}) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [body, setBody] = useState('')
  const [how, setHow] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const t = title.trim()
    if (!t) return
    onError(null)
    onSaving(true)
    try {
      const res = await fetch('/api/pro-lideres/scripts/entries', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section_id: sectionId,
          title: t,
          subtitle: subtitle.trim() || null,
          body,
          how_to_use: how.trim() || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        onError((data as { error?: string }).error || 'Não foi possível criar.')
        return
      }
      setTitle('')
      setSubtitle('')
      setBody('')
      setHow('')
      await onCreated()
    } catch {
      onError('Erro de rede.')
    } finally {
      onSaving(false)
    }
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="rounded-lg border border-dashed border-blue-200 bg-blue-50/40 p-4"
    >
      <p className="text-sm font-semibold text-gray-900">Novo script nesta situação</p>
      <div className="mt-3 space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Título</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            maxLength={200}
            required
            placeholder="Ex.: Mensagem de postagem"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Subtítulo</span>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            maxLength={300}
            placeholder="Ex.: texto curto · WhatsApp"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Texto do script</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            placeholder="Mensagem pronta a copiar…"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Como usar (opcional)</span>
          <textarea
            value={how}
            onChange={(e) => setHow(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            placeholder="Quando enviar, tom de voz, objeção…"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="min-h-[44px] rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'A guardar…' : 'Adicionar à sequência'}
        </button>
      </div>
    </form>
  )
}

function EntryCard({
  entry,
  entIdx,
  entCount,
  sectionId,
  canEditUi,
  editingSection,
  saving,
  copiedId,
  onReload,
  onError,
  onSaving,
  onCopyEntry,
  onMoveEntry,
}: {
  entry: ProLideresScriptSectionWithEntries['entries'][0]
  entIdx: number
  entCount: number
  sectionId: string
  canEditUi: boolean
  editingSection: boolean
  saving: boolean
  copiedId: string | null
  onReload: () => Promise<void>
  onError: (e: string | null) => void
  onSaving: (v: boolean) => void
  onCopyEntry: (id: string, text: string) => void
  onMoveEntry: (sectionId: string, index: number, dir: -1 | 1) => void
}) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(entry.title)
  const [subtitle, setSubtitle] = useState(entry.subtitle ?? '')
  const [body, setBody] = useState(entry.body)
  const [how, setHow] = useState(entry.how_to_use ?? '')

  useEffect(() => {
    setTitle(entry.title)
    setSubtitle(entry.subtitle ?? '')
    setBody(entry.body)
    setHow(entry.how_to_use ?? '')
  }, [entry.title, entry.subtitle, entry.body, entry.how_to_use])

  async function save() {
    onError(null)
    onSaving(true)
    try {
      const res = await fetch(`/api/pro-lideres/scripts/entries/${entry.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          subtitle: subtitle.trim() || null,
          body,
          how_to_use: how.trim() || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        onError((data as { error?: string }).error || 'Não foi possível guardar.')
        return
      }
      setEditing(false)
      await onReload()
    } catch {
      onError('Erro de rede.')
    } finally {
      onSaving(false)
    }
  }

  async function remove() {
    if (!confirm('Apagar este script?')) return
    onError(null)
    onSaving(true)
    try {
      const res = await fetch(`/api/pro-lideres/scripts/entries/${entry.id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        onError((data as { error?: string }).error || 'Não foi possível apagar.')
        return
      }
      await onReload()
    } catch {
      onError('Erro de rede.')
    } finally {
      onSaving(false)
    }
  }

  const block = formatScriptBlock(entry)

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/80 p-4">
      {editing ? (
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold"
            maxLength={200}
          />
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            maxLength={300}
            placeholder="Subtítulo"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={5}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          />
          <textarea
            value={how}
            onChange={(e) => setHow(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            placeholder="Como usar"
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => void save()}
              disabled={saving}
              className="min-h-[44px] rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="min-h-[44px] rounded-lg border border-gray-300 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900">{entry.title}</h3>
              {entry.subtitle?.trim() && <p className="mt-0.5 text-sm text-gray-600">{entry.subtitle}</p>}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void onCopyEntry(entry.id, block)}
                className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                {copiedId === entry.id ? '✓ Copiado' : 'Copiar bloco'}
              </button>
              {canEditUi && !editingSection && (
                <>
                  <button
                    type="button"
                    onClick={() => void onMoveEntry(sectionId, entIdx, -1)}
                    disabled={saving || entIdx <= 0}
                    className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                    aria-label="Mover script para cima"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => void onMoveEntry(sectionId, entIdx, 1)}
                    disabled={saving || entIdx >= entCount - 1}
                    className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                    aria-label="Mover script para baixo"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove()}
                    className="min-h-[44px] rounded-lg border border-red-200 bg-white px-3 text-xs font-semibold text-red-700 hover:bg-red-50"
                  >
                    Apagar
                  </button>
                </>
              )}
            </div>
          </div>
          {entry.body?.trim() && (
            <pre className="mt-3 max-h-64 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 font-sans text-sm text-gray-800 ring-1 ring-gray-100">
              {entry.body}
            </pre>
          )}
          {entry.how_to_use?.trim() && (
            <div className="mt-3 rounded-lg border border-sky-100 bg-sky-50/90 px-3 py-2 text-sm text-sky-950">
              <span className="font-semibold">Como usar: </span>
              {entry.how_to_use}
            </div>
          )}
        </>
      )}
    </div>
  )
}
