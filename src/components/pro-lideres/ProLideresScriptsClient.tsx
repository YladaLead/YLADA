'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'

import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'
import { ProLideresCatalogToolPicker } from '@/components/pro-lideres/ProLideresCatalogToolPicker'
import { ProLideresScriptsNoelGenerator } from '@/components/pro-lideres/ProLideresScriptsNoelGenerator'
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
          Montas <strong className="text-gray-800">grupos de textos</strong> para a equipe copiar no contacto com
          clientes (WhatsApp, redes, etc.). Cada grupo tem vários textos por ordem. A equipe só vê e copia — não edita.
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
        <section className="space-y-3" aria-labelledby="scripts-adicionar-heading">
          <h2 id="scripts-adicionar-heading" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Criar
          </h2>

          <details className="rounded-xl border border-indigo-200 bg-gradient-to-b from-indigo-50/90 to-white shadow-sm">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-indigo-950 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                <span>1. Com o Noel — gera textos para a equipe</span>
                <span className="text-xs font-normal text-indigo-700">abrir</span>
              </span>
              <span className="mt-1 block text-xs font-normal text-indigo-900/80">
                Escolhes o tipo, descreves o que queres; o Noel monta um grupo que podes guardar
              </span>
            </summary>
            <div className="border-t border-indigo-100 px-4 pb-4 pt-3">
              <ProLideresScriptsNoelGenerator
                catalog={catalog}
                saving={saving}
                onSaving={setSaving}
                onError={setError}
                onApplied={async () => {
                  setSaving(true)
                  try {
                    await load()
                  } finally {
                    setSaving(false)
                  }
                }}
              />
            </div>
          </details>

          <details className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                <span>2. Grupo novo (à mão, sem Noel)</span>
                <span className="text-xs font-normal text-gray-500">abrir</span>
              </span>
              <span className="mt-1 block text-xs font-normal text-gray-600">
                Só o nome do grupo; depois adicionas textos um a um
              </span>
            </summary>
            <div className="border-t border-gray-100 px-4 pb-4 pt-3">
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
            </div>
          </details>
        </section>
      )}

      {loading ? (
        <p className="text-gray-600">A carregar…</p>
      ) : sections.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-8 text-center text-sm text-gray-600">
          {canEditUi
            ? 'Ainda não há grupos. Usa «Criar» acima (Noel ou grupo vazio).'
            : 'O líder ainda não publicou scripts aqui.'}
        </p>
      ) : (
        <div className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Grupos guardados</h2>
          <ul className="space-y-3">
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
        </div>
      )}

      <p className="text-sm text-gray-500">
        <strong className="font-medium text-gray-700">Scripts</strong> = o que a equipe manda a{' '}
        <strong className="font-medium text-gray-700">clientes</strong>. Para falar com a equipe, use o{' '}
        <Link href="/pro-lideres/painel/noel" className="font-medium text-violet-700 hover:text-violet-900">
          Noel
        </Link>{' '}
        (inclui mensagens internas e conversa livre).
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
    <div>
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Nome do grupo</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
            maxLength={200}
            required
            placeholder="Ex.: IMC — antes do link"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Nota curta (opcional)</span>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm"
            maxLength={300}
            placeholder="Ex.: WhatsApp em 3 passos"
          />
        </label>
        <ProLideresCatalogToolPicker
          catalog={catalog}
          value={yladaLinkId}
          onChange={setYladaLinkId}
          disabled={saving}
          accent="gray"
        />
        <button
          type="submit"
          disabled={saving}
          className="min-h-[44px] rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'A guardar…' : 'Criar grupo'}
        </button>
      </form>
    </div>
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
    if (!confirm('Apagar este grupo e todos os textos dentro dele?')) return
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

  const entriesBlock = (
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
          {canEditUi && !editing ? 'Ainda não há textos neste grupo.' : 'Sem textos neste grupo.'}
        </p>
      ) : (
        <ol className="list-decimal space-y-3 pl-5 marker:font-semibold marker:text-blue-700">
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
  )

  const editHeader = (
    <div className="space-y-3 border-b border-gray-100 p-4 sm:p-5">
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-gray-700">Nome do grupo</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          maxLength={200}
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-gray-700">Nota curta (opcional)</span>
        <input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          maxLength={300}
        />
      </label>
      <ProLideresCatalogToolPicker
        catalog={catalog}
        value={yladaLinkId}
        onChange={setYladaLinkId}
        disabled={saving}
        accent="gray"
      />
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
  )

  const toolbar = canEditUi ? (
    <div className="flex flex-wrap gap-2 border-b border-gray-50 px-4 py-2">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          void onMoveSection(secIdx, -1)
        }}
        disabled={saving || secIdx <= 0}
        className="min-h-[40px] rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        aria-label="Mover grupo para cima"
      >
        ↑
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          void onMoveSection(secIdx, 1)
        }}
        disabled={saving || secIdx >= secCount - 1}
        className="min-h-[40px] rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        aria-label="Mover grupo para baixo"
      >
        ↓
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setEditing(true)
        }}
        className="min-h-[40px] rounded-lg border border-gray-200 px-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Editar grupo
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          void removeSection()
        }}
        className="min-h-[40px] rounded-lg border border-red-200 px-3 text-sm font-semibold text-red-700 hover:bg-red-50"
      >
        Apagar
      </button>
    </div>
  ) : null

  if (editing) {
    return (
      <div className="rounded-xl border border-blue-200 bg-white shadow-sm">
        {editHeader}
        {entriesBlock}
      </div>
    )
  }

  return (
    <details className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <summary className="cursor-pointer list-none px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0 flex-1">
            <span className="block text-base font-bold text-gray-900">{section.title}</span>
            {section.subtitle?.trim() ? (
              <span className="mt-0.5 block text-sm text-gray-600">{section.subtitle}</span>
            ) : null}
            <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500">
              <span>{section.entries.length} texto(s)</span>
              {toolLabel ? (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700">{toolLabel}</span>
              ) : null}
              {section.ylada_link_id && !toolLabel ? (
                <span className="text-amber-700">Ferramenta ligada</span>
              ) : null}
            </span>
          </span>
          <span className="shrink-0 text-xs text-gray-400">ver</span>
        </span>
      </summary>
      <div className="border-t border-gray-100">
        {toolbar}
        {entriesBlock}
      </div>
    </details>
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
  const detailsRef = useRef<HTMLDetailsElement>(null)
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
      detailsRef.current?.removeAttribute('open')
      await onCreated()
    } catch {
      onError('Erro de rede.')
    } finally {
      onSaving(false)
    }
  }

  return (
    <details ref={detailsRef} className="rounded-lg border border-dashed border-blue-200 bg-blue-50/30">
      <summary className="cursor-pointer list-none px-3 py-2 text-sm font-semibold text-blue-900 [&::-webkit-details-marker]:hidden">
        + Adicionar texto a este grupo
      </summary>
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-2 border-t border-blue-100/80 px-3 pb-3 pt-2">
        <label className="block text-sm">
          <span className="mb-0.5 block text-xs font-medium text-gray-700">Título do texto</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm"
            maxLength={200}
            required
            placeholder="Ex.: 1.ª mensagem"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-0.5 block text-xs font-medium text-gray-700">Detalhe (opcional)</span>
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm"
            maxLength={300}
            placeholder="Ex.: WhatsApp"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-0.5 block text-xs font-medium text-gray-700">Texto (copiar e colar)</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm"
            placeholder="Mensagem para o cliente…"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-0.5 block text-xs font-medium text-gray-700">Quando usar (opcional)</span>
          <textarea
            value={how}
            onChange={(e) => setHow(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm"
            placeholder="Para a equipe saber o momento…"
          />
        </label>
        <button
          type="submit"
          disabled={saving}
          className="min-h-[40px] rounded-lg bg-blue-600 px-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'A guardar…' : 'Guardar texto'}
        </button>
      </form>
    </details>
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
                    Editar texto
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
            <pre className="mt-3 max-h-44 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-3 font-sans text-sm text-gray-800 ring-1 ring-gray-100">
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
