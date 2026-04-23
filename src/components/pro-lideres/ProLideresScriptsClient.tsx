'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'

import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'
import { ProLideresCatalogToolPicker } from '@/components/pro-lideres/ProLideresCatalogToolPicker'
import { ProLideresScriptsLibraryFilters } from '@/components/pro-lideres/ProLideresScriptsLibraryFilters'
import { ProLideresScriptsNoelGenerator } from '@/components/pro-lideres/ProLideresScriptsNoelGenerator'
import { ALL_SCRIPT_TOOL_ROWS } from '@/lib/pro-lideres-script-guided-briefing'
import {
  DEFAULT_SCRIPT_LIBRARY_FILTERS,
  PL_SCRIPT_CONVERSATION_STAGE_OPTIONS,
  PL_SCRIPT_SECTION_FOCUS_OPTIONS,
  PL_SCRIPT_SECTION_INTENTION_OPTIONS,
  conversationStageLabel,
  focusLabel,
  intentionLabel,
  sectionMatchesLibraryFilters,
  toolPresetLabelFromKey,
  type PlScriptSectionFocusId,
  type ScriptLibraryFilters,
} from '@/lib/pro-lideres-script-section-meta'
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

function ScriptsEmptyStateLeader() {
  return (
    <div className="rounded-2xl border border-dashed border-indigo-200/90 bg-gradient-to-b from-indigo-50/50 via-white to-white px-5 py-10 text-center shadow-sm sm:px-8">
      <p className="text-base font-semibold text-gray-900">Ainda sem scripts — faça nesta ordem</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
        O caminho mais rápido é o <strong className="text-gray-800">Guiado</strong>: o Noel pergunta; você escolhe e
        avança até guardar.
      </p>
      <ol className="mx-auto mt-8 max-w-lg space-y-4 text-left text-sm text-gray-800">
        <li className="flex gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            1
          </span>
          <span>
            Aí em cima: <strong className="text-gray-900">Guiado</strong> → responda até o fim → <strong className="text-gray-900">Gerar</strong> →{' '}
            <strong className="text-gray-900">Salvar</strong>.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            2
          </span>
          <span>
            Quando o fluxo pedir <strong className="text-gray-900">ferramenta</strong>, escolha uma — o link aparece no
            cartão (abrir / copiar). Se saltou esse passo, abra <strong className="text-gray-900">Editar grupo</strong> e
            ligue lá.
          </span>
        </li>
        <li className="flex gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            3
          </span>
          <span>
            Para a rede usar: marque <strong className="text-gray-900">Equipe vê no painel</strong>.
          </span>
        </li>
      </ol>
    </div>
  )
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
  const [scriptFilters, setScriptFilters] = useState<ScriptLibraryFilters>(DEFAULT_SCRIPT_LIBRARY_FILTERS)

  const toolLabelByLinkId = useMemo(() => {
    const m = new Map<string, string>()
    for (const item of catalog) {
      if (item.yladaLinkId) m.set(item.yladaLinkId, item.label)
    }
    return m
  }, [catalog])

  const canEditUi = canEdit && !teamViewPreview

  const filteredSections = useMemo(() => {
    return sections.filter((s) => sectionMatchesLibraryFilters(s, scriptFilters))
  }, [sections, scriptFilters])

  const scriptFiltersSummaryLine = useMemo(() => {
    const parts: string[] = []
    if (scriptFilters.stage !== 'todos') {
      const lbl = conversationStageLabel(scriptFilters.stage)
      if (lbl) parts.push(`Situação: ${lbl}`)
    }
    if (scriptFilters.intention !== 'todos') {
      parts.push(`Objetivo: ${intentionLabel(scriptFilters.intention)}`)
    }
    if (scriptFilters.tool !== 'todos') {
      if (scriptFilters.tool === '__ylada__') parts.push('Ferramenta: com link ligado (painel)')
      else parts.push(`Ferramenta: ${toolPresetLabelFromKey(scriptFilters.tool) ?? scriptFilters.tool}`)
    }
    if (scriptFilters.focus !== 'todos') {
      parts.push(`Linha: ${focusLabel(scriptFilters.focus)}`)
    }
    return parts.length ? parts.join(' · ') : null
  }, [scriptFilters])

  const scriptFiltersDirty =
    scriptFilters.stage !== 'todos' ||
    scriptFilters.intention !== 'todos' ||
    scriptFilters.tool !== 'todos' ||
    scriptFilters.focus !== 'todos'

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
        setError(scriptsData.error || 'Não foi possível buscar os scripts.')
        setDevHint(scriptsData.devHint ?? null)
        setSections([])
        setCanEdit(false)
        return
      }
      if (!flowsRes.ok) {
        setError(flowsData.error || 'Não foi possível buscar o catálogo (fluxos).')
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
            'Não foi possível reordenar os grupos.'
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
            'Não foi possível reordenar as mensagens.'
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

  const teamExperience = !canEditUi

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div
        className={`overflow-hidden rounded-2xl border px-5 py-6 sm:px-8 sm:py-7 ${
          teamExperience
            ? 'border-blue-200/90 bg-gradient-to-br from-blue-50/90 via-white to-sky-50/35'
            : 'border-gray-200/80 bg-gradient-to-br from-slate-50/80 via-white to-indigo-50/20'
        }`}
      >
        <p className={`text-sm font-semibold ${teamExperience ? 'text-blue-700' : 'text-blue-600'}`}>
          {teamExperience ? 'Biblioteca da equipe' : 'Conteúdo'}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Scripts</h1>
        <p className="mt-2 max-w-2xl text-pretty text-gray-600">
          {teamExperience ? (
            <>
              <strong className="text-gray-800">Grupos de textos</strong> para usar com clientes. A equipe{' '}
              <strong className="text-gray-800">só vê e copia</strong>.
            </>
          ) : (
            <>
              Use o <strong className="text-gray-800">Guiado</strong> embaixo: o Noel leva passo a passo (incluindo
              ferramenta quando fizer sentido). A equipe <strong className="text-gray-800">só vê e copia</strong> o que
              você deixar visível.
            </>
          )}
        </p>
      </div>

      {devStubPanel && (
        <p className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          Modo dev sem tenant na base: salvar pode falhar até existir tenant e as migrations de scripts (ex.{' '}
          <code className="rounded bg-amber-100/80 px-1">312</code>,{' '}
          <code className="rounded bg-amber-100/80 px-1">316</code>) estarem aplicadas.
        </p>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p>{error}</p>
          {devHint ? <p className="mt-2 border-t border-red-200/80 pt-2 text-xs text-red-900/90">{devHint}</p> : null}
        </div>
      )}

      {canEditUi ? (
        <section className="space-y-4" aria-labelledby="scripts-construir-heading">
          <h2 id="scripts-construir-heading" className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Construir biblioteca
          </h2>
          <p className="text-sm text-gray-600">
            Ordem rápida: <strong className="text-gray-800">Guiado</strong> → gerar → salvar → (se quiser) equipe vê.
          </p>

          <div className="overflow-hidden rounded-2xl border border-indigo-200/90 bg-gradient-to-b from-indigo-50/95 via-white to-white shadow-md ring-1 ring-indigo-100/50">
            <div className="border-b border-indigo-100/90 bg-indigo-50/50 px-4 py-4 sm:px-6 sm:py-5">
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-700">Noel de Scripts</p>
              <h3 className="mt-1 text-base font-bold text-indigo-950 sm:text-lg">Montar sequência com o Noel</h3>
              <p className="mt-2 max-w-2xl text-sm leading-snug text-indigo-950/90">
                <strong className="text-indigo-950">Comece por «Guiado».</strong> São poucos cliques por pergunta. No
                passo da ferramenta, escolha o link se o script falar de uma página sua — o Noel já encaixa o texto; a
                equipe vê o URL no cartão. Nos textos para vários distribuidores, o Noel pode usar marcadores tipo «(teu
                link da ferramenta)».
              </p>
            </div>
            <div className="px-4 pb-6 pt-4 sm:px-6 sm:pb-7 sm:pt-5">
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
          </div>

          <details className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-semibold text-gray-900 sm:px-5 [&::-webkit-details-marker]:hidden">
              <span className="flex items-center justify-between gap-2">
                <span>Grupo novo (manual)</span>
                <span className="text-xs font-normal text-gray-500">expandir</span>
              </span>
              <span className="mt-1 block text-xs font-normal text-gray-600">
                Só se não for usar o Noel: nome do grupo e mensagens à mão.
              </span>
            </summary>
            <div className="border-t border-gray-100 px-4 pb-5 pt-4 sm:px-5">
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
      ) : null}

      {loading ? (
        <p className="text-gray-600">Carregando…</p>
      ) : (
        <div className="space-y-5">
          <ProLideresScriptsLibraryFilters
            value={scriptFilters}
            onChange={setScriptFilters}
            disabled={saving}
            showYladaLinkFilter
            hideFieldOrderHint={!canEditUi}
          />

          {scriptFiltersDirty && scriptFiltersSummaryLine ? (
            <div className="flex flex-col gap-2 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-blue-950 sm:flex-row sm:items-center sm:justify-between">
              <p className="min-w-0 pr-2">
                <span className="font-semibold text-blue-900">Filtros ativos:</span>{' '}
                <span className="text-blue-950/95">{scriptFiltersSummaryLine}</span>
              </p>
              <button
                type="button"
                disabled={saving}
                className="shrink-0 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-900 hover:bg-blue-50 disabled:opacity-50"
                onClick={() => setScriptFilters(DEFAULT_SCRIPT_LIBRARY_FILTERS)}
              >
                Limpar filtros
              </button>
            </div>
          ) : null}

          {filteredSections.length === 0 && sections.length > 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
              <p>Nenhum grupo corresponde a estes filtros.</p>
              <button
                type="button"
                className="mt-2 text-sm font-semibold text-amber-900 underline"
                onClick={() => setScriptFilters(DEFAULT_SCRIPT_LIBRARY_FILTERS)}
              >
                Limpar filtros
              </button>
            </div>
          ) : null}

          {sections.length === 0 ? (
            <div className="space-y-4">
              {canEditUi && !error ? <ScriptsEmptyStateLeader /> : null}
              {teamExperience && !error ? (
                <p className="rounded-2xl border border-dashed border-blue-200/80 bg-blue-50/40 px-4 py-10 text-center text-sm text-blue-950/90">
                  O líder ainda não partilhou grupos visíveis para a equipe aqui.
                </p>
              ) : null}
              {error && canEditUi ? (
                <p className="rounded-2xl border border-dashed border-gray-300 bg-gray-50/90 px-4 py-8 text-center text-sm text-gray-600">
                  Corrija o erro acima para carregar os seus grupos.
                </p>
              ) : null}
            </div>
          ) : filteredSections.length > 0 ? (
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {canEditUi ? 'Os seus grupos' : 'Grupos para copiar'}
              </h2>
              <ul className="space-y-3">
                {filteredSections.map((sec) => {
                  const secIdx = sections.findIndex((s) => s.id === sec.id)
                  const linkedCatalogItem =
                    sec.ylada_link_id != null
                      ? catalog.find((c) => c.yladaLinkId === sec.ylada_link_id) ?? null
                      : null
                  return (
                    <li
                      key={sec.id}
                      id={`pl-script-section-${sec.id}`}
                      className="scroll-mt-4 rounded-xl border border-gray-200 bg-white shadow-sm"
                    >
                      <SectionBlock
                        section={sec}
                        secIdx={secIdx >= 0 ? secIdx : 0}
                        secCount={sections.length}
                        toolLabel={sec.ylada_link_id ? toolLabelByLinkId.get(sec.ylada_link_id) ?? null : null}
                        linkedCatalogItem={linkedCatalogItem}
                        canEditUi={canEditUi}
                        teamExperience={teamExperience}
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
                  )
                })}
              </ul>
            </div>
          ) : null}
        </div>
      )}

      <p className="text-sm text-gray-500">
        <strong className="font-medium text-gray-700">Scripts</strong> = textos para{' '}
        <strong className="font-medium text-gray-700">clientes</strong> que o líder publica com visibilidade para a
        equipe. Para falar <strong className="font-medium text-gray-700">com a equipe</strong>, use o{' '}
        <Link href="/pro-lideres/painel/noel" className="font-medium text-violet-700 hover:text-violet-900">
          Noel
        </Link>
        .
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
  const [visibleToTeam, setVisibleToTeam] = useState(true)
  const [focusMain, setFocusMain] = useState<PlScriptSectionFocusId>('vendas')
  const [intentionKey, setIntentionKey] = useState('geral')
  const [toolPresetKey, setToolPresetKey] = useState('')

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
          visible_to_team: visibleToTeam,
          focus_main: focusMain,
          intention_key: intentionKey,
          tool_preset_key: toolPresetKey || null,
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
      setVisibleToTeam(true)
      setFocusMain('vendas')
      setIntentionKey('geral')
      setToolPresetKey('')
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
        <div className="grid gap-3 sm:grid-cols-3">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">Foco</span>
            <select
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
              value={focusMain}
              disabled={saving}
              onChange={(e) => setFocusMain(e.target.value as PlScriptSectionFocusId)}
            >
              {PL_SCRIPT_SECTION_FOCUS_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">Intenção</span>
            <select
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
              value={intentionKey}
              disabled={saving}
              onChange={(e) => setIntentionKey(e.target.value)}
            >
              {PL_SCRIPT_SECTION_INTENTION_OPTIONS.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-700">Preset (guiado)</span>
            <select
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm"
              value={toolPresetKey}
              disabled={saving}
              onChange={(e) => setToolPresetKey(e.target.value)}
            >
              <option value="">Não especificar</option>
              {ALL_SCRIPT_TOOL_ROWS.filter((r) => r.id !== 'outra').map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <ProLideresCatalogToolPicker
          catalog={catalog}
          value={yladaLinkId}
          onChange={setYladaLinkId}
          disabled={saving}
          accent="gray"
        />
        <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2.5 text-sm text-gray-800">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={visibleToTeam}
            onChange={(e) => setVisibleToTeam(e.target.checked)}
          />
          <span>
            <span className="font-medium text-gray-900">Mostrar à equipe</span>
            <span className="mt-0.5 block text-xs font-normal text-gray-600">
              Se desmarcar, só você vê esta sequência no painel; pode apagar quando quiser.
            </span>
          </span>
        </label>
        <button
          type="submit"
          disabled={saving}
          className="min-h-[44px] rounded-lg bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Salvando…' : 'Criar grupo'}
        </button>
      </form>
    </div>
  )
}

function LinkedCatalogStrip({
  item,
  teamExperience,
}: {
  item: ProLideresCatalogItem
  teamExperience: boolean
}) {
  const [copied, setCopied] = useState(false)
  const url = (item.publicUrl || item.href || '').trim()

  async function copyUrl() {
    if (!url) return
    const ok = await copyText(url)
    if (ok) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div
      className={`mt-3 rounded-xl border px-3 py-3 shadow-sm sm:px-4 ${
        teamExperience
          ? 'border-blue-200/90 bg-gradient-to-r from-blue-50 to-white'
          : 'border-indigo-200/90 bg-gradient-to-r from-indigo-50/80 to-white'
      }`}
      onClick={(e) => e.stopPropagation()}
      role="group"
      aria-label="Ferramenta ligada ao script"
    >
      <p
        className={`text-[10px] font-bold uppercase tracking-wide ${
          teamExperience ? 'text-blue-800' : 'text-indigo-800'
        }`}
      >
        {teamExperience ? 'Link da ferramenta' : 'Ferramenta ligada a este grupo'}
      </p>
      <p className="mt-1 text-sm font-semibold leading-snug text-gray-900">{item.label}</p>
      {url ? (
        <p className="mt-1.5 break-all font-mono text-[11px] leading-relaxed text-gray-600">{url}</p>
      ) : (
        <p className="mt-2 text-xs text-gray-500">URL não disponível no catálogo.</p>
      )}
      {url ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-[40px] items-center justify-center rounded-lg border px-3 text-sm font-semibold transition ${
              teamExperience
                ? 'border-blue-300 bg-white text-blue-900 hover:bg-blue-50'
                : 'border-indigo-200 bg-white text-indigo-900 hover:bg-indigo-50/80'
            }`}
          >
            Abrir link
          </a>
          <button
            type="button"
            onClick={() => void copyUrl()}
            className={`inline-flex min-h-[40px] items-center justify-center rounded-lg px-3 text-sm font-semibold text-white transition ${
              teamExperience ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {copied ? 'Copiado' : 'Copiar URL'}
          </button>
        </div>
      ) : null}
    </div>
  )
}

function SectionBlock({
  section,
  secIdx,
  secCount,
  toolLabel,
  linkedCatalogItem,
  canEditUi,
  teamExperience,
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
  linkedCatalogItem: ProLideresCatalogItem | null
  canEditUi: boolean
  teamExperience: boolean
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
  const [visibleToTeam, setVisibleToTeam] = useState(section.visible_to_team !== false)
  const [focusMain, setFocusMain] = useState<PlScriptSectionFocusId>(section.focus_main ?? 'vendas')
  const [intentionKey, setIntentionKey] = useState(section.intention_key ?? 'geral')
  const [toolPresetKey, setToolPresetKey] = useState(section.tool_preset_key ?? '')
  const [usageHint, setUsageHint] = useState(section.usage_hint ?? '')
  const [sequenceLabel, setSequenceLabel] = useState(section.sequence_label ?? '')
  const [conversationStage, setConversationStage] = useState(section.conversation_stage ?? '')

  useEffect(() => {
    setTitle(section.title)
    setSubtitle(section.subtitle ?? '')
    setYladaLinkId(section.ylada_link_id ?? '')
    setVisibleToTeam(section.visible_to_team !== false)
    setFocusMain(section.focus_main ?? 'vendas')
    setIntentionKey(section.intention_key ?? 'geral')
    setToolPresetKey(section.tool_preset_key ?? '')
    setUsageHint(section.usage_hint ?? '')
    setSequenceLabel(section.sequence_label ?? '')
    setConversationStage(section.conversation_stage ?? '')
  }, [
    section.title,
    section.subtitle,
    section.ylada_link_id,
    section.visible_to_team,
    section.focus_main,
    section.intention_key,
    section.tool_preset_key,
    section.usage_hint,
    section.sequence_label,
    section.conversation_stage,
  ])

  async function patchTeamVisible(next: boolean) {
    onError(null)
    onSaving(true)
    try {
      const res = await fetch(`/api/pro-lideres/scripts/sections/${section.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible_to_team: next }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        onError((data as { error?: string }).error || 'Não foi possível atualizar a visibilidade.')
        return
      }
      setVisibleToTeam(next)
      await onReload()
    } catch {
      onError('Erro de rede.')
    } finally {
      onSaving(false)
    }
  }

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
          visible_to_team: visibleToTeam,
          focus_main: focusMain,
          intention_key: intentionKey,
          tool_preset_key: toolPresetKey || null,
          usage_hint: usageHint.trim() || null,
          sequence_label: sequenceLabel.trim() || null,
          conversation_stage: conversationStage.trim() || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        onError((data as { error?: string }).error || 'Não foi possível salvar.')
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
                teamExperience={teamExperience}
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
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-gray-700">Quando usar (opcional)</span>
        <textarea
          value={usageHint}
          onChange={(e) => setUsageHint(e.target.value)}
          rows={2}
          maxLength={8000}
          placeholder="Uma frase para você ou para a equipe: em que situação usar este grupo."
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-gray-700">Sequência resumida (opcional)</span>
        <input
          value={sequenceLabel}
          onChange={(e) => setSequenceLabel(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
          maxLength={300}
          placeholder="Ex.: Permissão → Pergunta → Convite"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium text-gray-700">Momento da conversa (opcional)</span>
        <select
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
          value={conversationStage}
          disabled={saving}
          onChange={(e) => setConversationStage(e.target.value)}
        >
          <option value="">—</option>
          {PL_SCRIPT_CONVERSATION_STAGE_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Foco</span>
          <select
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            value={focusMain}
            disabled={saving}
            onChange={(e) => setFocusMain(e.target.value as PlScriptSectionFocusId)}
          >
            {PL_SCRIPT_SECTION_FOCUS_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Intenção</span>
          <select
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            value={intentionKey}
            disabled={saving}
            onChange={(e) => setIntentionKey(e.target.value)}
          >
            {PL_SCRIPT_SECTION_INTENTION_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-700">Preset (guiado)</span>
          <select
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            value={toolPresetKey}
            disabled={saving}
            onChange={(e) => setToolPresetKey(e.target.value)}
          >
            <option value="">Não especificar</option>
            {ALL_SCRIPT_TOOL_ROWS.filter((r) => r.id !== 'outra').map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <ProLideresCatalogToolPicker
        catalog={catalog}
        value={yladaLinkId}
        onChange={setYladaLinkId}
        disabled={saving}
        accent="gray"
      />
      <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-gray-100 bg-gray-50/80 px-3 py-2.5 text-sm text-gray-800">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={visibleToTeam}
          onChange={(e) => setVisibleToTeam(e.target.checked)}
        />
        <span>
          <span className="font-medium text-gray-900">Mostrar à equipe</span>
          <span className="mt-0.5 block text-xs font-normal text-gray-600">
            A equipe vê e copia no painel dela. Desmarcado = só você vê (rascunho ou uso interno).
          </span>
        </span>
      </label>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void saveSection()}
          disabled={saving}
          className="min-h-[44px] rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Salvar
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

  const metaBadges = (
    <span className="mt-1 flex flex-wrap gap-1.5">
      <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-violet-900">
        {focusLabel(section.focus_main ?? 'vendas')}
      </span>
      <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-900">
        {intentionLabel(section.intention_key ?? 'geral')}
      </span>
      {toolPresetLabelFromKey(section.tool_preset_key) ? (
        <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-950">
          {toolPresetLabelFromKey(section.tool_preset_key)}
        </span>
      ) : null}
      {conversationStageLabel(section.conversation_stage) ? (
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-900">
          {conversationStageLabel(section.conversation_stage)}
        </span>
      ) : null}
    </span>
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
      <label
        className="inline-flex min-h-[40px] max-w-full cursor-pointer items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/60 px-3 text-sm font-medium text-blue-950"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          className="h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={visibleToTeam}
          disabled={saving}
          onChange={(e) => void patchTeamVisible(e.target.checked)}
        />
        <span className="whitespace-normal">Equipe vê no painel</span>
      </label>
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
    <details className="w-full overflow-hidden rounded-xl">
      <summary className="cursor-pointer list-none px-4 py-4 sm:px-5 [&::-webkit-details-marker]:hidden">
        <span className="flex items-start justify-between gap-3">
          <span className="min-w-0 flex-1">
            <span className="flex flex-wrap items-center gap-2">
              <span className="block text-base font-bold text-gray-900">{section.title}</span>
              {teamExperience ? (
                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-900">
                  Campo
                </span>
              ) : null}
            </span>
            {section.subtitle?.trim() ? (
              <span className="mt-0.5 block text-sm text-gray-600">{section.subtitle}</span>
            ) : null}
            {section.usage_hint?.trim() ? (
              <span className="mt-1 block text-sm text-gray-700">
                <span className="font-semibold text-gray-800">Quando usar: </span>
                {section.usage_hint.trim()}
              </span>
            ) : null}
            {section.sequence_label?.trim() ? (
              <span className="mt-0.5 block text-xs text-gray-500">
                <span className="font-semibold text-gray-600">Sequência: </span>
                {section.sequence_label.trim()}
              </span>
            ) : null}
            {metaBadges}
            {linkedCatalogItem ? (
              <LinkedCatalogStrip item={linkedCatalogItem} teamExperience={teamExperience} />
            ) : null}
            <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-gray-500">
              <span>{section.entries.length} texto(s)</span>
              {canEditUi && section.visible_to_team === false ? (
                <span className="rounded-full bg-slate-200 px-2 py-0.5 font-medium text-slate-800">Só o líder</span>
              ) : null}
              {!linkedCatalogItem && toolLabel ? (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 font-medium text-gray-700">{toolLabel}</span>
              ) : null}
              {section.ylada_link_id && !linkedCatalogItem && !toolLabel ? (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 font-medium text-amber-900">
                  Ferramenta sem entrada no catálogo — edite o grupo para reassociar
                </span>
              ) : null}
            </span>
          </span>
          <span className="shrink-0 text-xs font-medium text-gray-400">{teamExperience ? 'abrir' : 'ver'}</span>
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
            placeholder="Ex.: 1ª mensagem"
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
          {saving ? 'Salvando…' : 'Salvar texto'}
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
  teamExperience,
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
  teamExperience: boolean
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
        onError((data as { error?: string }).error || 'Não foi possível salvar.')
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
    <div
      className={`rounded-xl border p-4 sm:p-5 ${
        teamExperience
          ? 'border-blue-100/90 bg-gradient-to-b from-white to-blue-50/25 shadow-sm'
          : 'border-gray-200/80 bg-gray-50/90 shadow-sm'
      }`}
    >
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
              Salvar
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
                className={`min-h-[44px] rounded-xl px-4 text-sm font-semibold shadow-sm transition ${
                  teamExperience
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'border border-gray-200 bg-white text-xs text-gray-700 hover:bg-gray-50'
                }`}
              >
                {copiedId === entry.id ? '✓ Copiado' : teamExperience ? 'Copiar mensagem' : 'Copiar bloco'}
              </button>
              {canEditUi && !editingSection && (
                <>
                  <button
                    type="button"
                    onClick={() => void onMoveEntry(sectionId, entIdx, -1)}
                    disabled={saving || entIdx <= 0}
                    className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                    aria-label="Mover mensagem para cima"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => void onMoveEntry(sectionId, entIdx, 1)}
                    disabled={saving || entIdx >= entCount - 1}
                    className="min-h-[44px] rounded-lg border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                    aria-label="Mover mensagem para baixo"
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
            <pre
              className={`mt-3 max-h-[min(22rem,55vh)] overflow-auto whitespace-pre-wrap rounded-xl border p-3 font-sans text-gray-800 sm:p-4 ${
                teamExperience
                  ? 'border-blue-100/80 bg-white text-[15px] leading-relaxed sm:text-base'
                  : 'border-gray-100 bg-white text-sm'
              }`}
            >
              {entry.body}
            </pre>
          )}
          {entry.how_to_use?.trim() && (
            <div
              className={`mt-3 rounded-xl border px-3 py-2.5 text-sm ${
                teamExperience
                  ? 'border-blue-200/80 bg-blue-50/90 text-blue-950'
                  : 'border-sky-100 bg-sky-50/90 text-sky-950'
              }`}
            >
              <span className="font-semibold">Quando usar: </span>
              {entry.how_to_use}
            </div>
          )}
        </>
      )}
    </div>
  )
}
