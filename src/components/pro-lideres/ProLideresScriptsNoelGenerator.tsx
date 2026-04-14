'use client'

import { useState } from 'react'

import { ProLideresCatalogToolPicker } from '@/components/pro-lideres/ProLideresCatalogToolPicker'
import type { ProLideresCatalogItem } from '@/lib/pro-lideres-catalog-build'
import {
  PRO_LIDERES_SCRIPT_PILLARS,
  type NoelScriptDraft,
  type ProLideresScriptPillarId,
} from '@/lib/pro-lideres-scripts-noel'

type GenerateResponse = {
  draft?: NoelScriptDraft
  error?: string
  pillar?: ProLideresScriptPillarId
  ylada_link_id?: string | null
}

export function ProLideresScriptsNoelGenerator({
  catalog,
  saving,
  onSaving,
  onError,
  onApplied,
}: {
  catalog: ProLideresCatalogItem[]
  saving: boolean
  onSaving: (v: boolean) => void
  onError: (e: string | null) => void
  onApplied: () => Promise<void>
}) {
  const [pillar, setPillar] = useState<ProLideresScriptPillarId>('geral')
  const [purpose, setPurpose] = useState('')
  const [yladaLinkId, setYladaLinkId] = useState('')
  const [generating, setGenerating] = useState(false)
  const [draft, setDraft] = useState<NoelScriptDraft | null>(null)
  const [draftMeta, setDraftMeta] = useState<{ ylada_link_id: string | null } | null>(null)

  async function onGenerate() {
    const p = purpose.trim()
    if (p.length < 8) {
      onError('Descreve o objetivo (mínimo 8 caracteres).')
      return
    }
    onError(null)
    setGenerating(true)
    try {
      const res = await fetch('/api/pro-lideres/scripts/generate-noel', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          purpose: p,
          pillar,
          ylada_link_id: yladaLinkId || null,
          locale: 'pt',
        }),
      })
      const data = (await res.json().catch(() => ({}))) as GenerateResponse
      if (!res.ok) {
        setDraft(null)
        setDraftMeta(null)
        onError(data.error || 'Não foi possível gerar o rascunho.')
        return
      }
      if (!data.draft) {
        onError('Resposta inválida do servidor.')
        return
      }
      setDraft(data.draft)
      setDraftMeta({ ylada_link_id: data.ylada_link_id ?? (yladaLinkId || null) })
    } catch {
      onError('Erro de rede ao gerar.')
      setDraft(null)
      setDraftMeta(null)
    } finally {
      setGenerating(false)
    }
  }

  async function onApply() {
    if (!draft) return
    onError(null)
    onSaving(true)
    try {
      const res = await fetch('/api/pro-lideres/scripts/sections', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: draft.section_title,
          subtitle: draft.section_subtitle,
          ylada_link_id: draftMeta?.ylada_link_id || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        onError((data as { error?: string }).error || 'Não foi possível criar o grupo.')
        return
      }
      const sectionId = (data as { section?: { id?: string } }).section?.id
      if (!sectionId) {
        onError('Resposta sem ID do grupo.')
        return
      }

      for (const ent of draft.entries) {
        const er = await fetch('/api/pro-lideres/scripts/entries', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section_id: sectionId,
            title: ent.title,
            subtitle: ent.subtitle,
            body: ent.body,
            how_to_use: ent.how_to_use,
          }),
        })
        const ej = await er.json().catch(() => ({}))
        if (!er.ok) {
          onError(
            (ej as { error?: string }).error ||
              'O grupo foi criado, mas falhou ao guardar um dos textos. Completa manualmente.'
          )
          await onApplied()
          setDraft(null)
          setDraftMeta(null)
          setPurpose('')
          return
        }
      }

      setDraft(null)
      setDraftMeta(null)
      setPurpose('')
      await onApplied()
    } catch {
      onError('Erro de rede ao aplicar.')
    } finally {
      onSaving(false)
    }
  }

  const busy = generating || saving

  return (
    <div className="space-y-4">
      <p className="text-xs text-indigo-900/90">
        Textos para a <strong className="text-indigo-950">equipe mandar a clientes</strong>. Para falar com a equipe, use o{' '}
        <a href="/pro-lideres/painel/noel" className="font-medium underline-offset-2 hover:underline">
          Noel
        </a>
        .
      </p>

      <div className="space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-800">Tipo de texto</span>
          <select
            value={pillar}
            onChange={(e) => setPillar(e.target.value as ProLideresScriptPillarId)}
            className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2.5 text-sm"
          >
            {PRO_LIDERES_SCRIPT_PILLARS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-gray-800">O que queres que o Noel escreva</span>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-indigo-200 bg-white px-3 py-2.5 text-sm"
            placeholder="Ex.: 3 mensagens WhatsApp antes do link do IMC; legenda de post…"
            maxLength={4000}
          />
        </label>

        <ProLideresCatalogToolPicker
          catalog={catalog}
          value={yladaLinkId}
          onChange={setYladaLinkId}
          disabled={busy}
          accent="indigo"
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => void onGenerate()}
            className="min-h-[44px] rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {generating ? 'A gerar…' : 'Gerar rascunho'}
          </button>
          {draft ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setDraft(null)
                setDraftMeta(null)
              }}
              className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Descartar pré-visualização
            </button>
          ) : null}
        </div>
      </div>

      {draft ? (
        <div className="mt-5 space-y-3 border-t border-indigo-200/80 pt-4">
          <p className="text-sm font-semibold text-gray-900">Pré-visualização</p>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h3 className="text-lg font-bold text-gray-900">{draft.section_title}</h3>
            {draft.section_subtitle?.trim() ? (
              <p className="mt-1 text-sm text-gray-600">{draft.section_subtitle}</p>
            ) : null}
            <ol className="mt-4 list-decimal space-y-4 pl-5 text-sm">
              {draft.entries.map((e, i) => (
                <li key={i} className="pl-1 text-gray-800">
                  <span className="font-semibold text-gray-900">{e.title}</span>
                  {e.subtitle?.trim() ? (
                    <span className="block text-xs font-medium text-gray-500">{e.subtitle}</span>
                  ) : null}
                  {e.body?.trim() ? (
                    <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded bg-gray-50 p-2 font-sans text-xs text-gray-800">
                      {e.body}
                    </pre>
                  ) : null}
                  {e.how_to_use?.trim() ? (
                    <p className="mt-1 text-xs text-sky-800">
                      <span className="font-semibold">Como usar:</span> {e.how_to_use}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={() => void onApply()}
            className="min-h-[44px] w-full rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 sm:w-auto"
          >
            {saving ? 'A guardar…' : 'Guardar este grupo no painel'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
