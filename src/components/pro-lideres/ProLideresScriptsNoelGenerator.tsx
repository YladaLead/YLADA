'use client'

import { useEffect, useRef, useState } from 'react'

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

type ChatLine = { id: string; role: 'user' | 'assistant'; text: string }

function chatId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
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

  const [refineLines, setRefineLines] = useState<ChatLine[]>([])
  const [refineInput, setRefineInput] = useState('')
  const [refining, setRefining] = useState(false)
  const refineEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    refineEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [refineLines.length, refining])

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
        setRefineLines([])
        onError(data.error || 'Não foi possível gerar o rascunho.')
        return
      }
      if (!data.draft) {
        onError('Resposta inválida do servidor.')
        return
      }
      setDraft(data.draft)
      setDraftMeta({ ylada_link_id: data.ylada_link_id ?? (yladaLinkId || null) })
      setRefineLines([
        {
          id: chatId(),
          role: 'assistant',
          text: 'Rascunho pronto. Podes pedir ajustes abaixo (ex.: «mensagem 2 mais curta») ou guardar para a equipe.',
        },
      ])
      setRefineInput('')
    } catch {
      onError('Erro de rede ao gerar.')
      setDraft(null)
      setDraftMeta(null)
      setRefineLines([])
    } finally {
      setGenerating(false)
    }
  }

  async function onRefine() {
    if (!draft) return
    const instruction = refineInput.trim()
    if (instruction.length < 3) {
      onError('Escreve o que queres alterar (mínimo 3 caracteres).')
      return
    }
    onError(null)
    setRefining(true)
    const userLine: ChatLine = { id: chatId(), role: 'user', text: instruction }
    setRefineLines((prev) => [...prev, userLine])
    setRefineInput('')
    try {
      const res = await fetch('/api/pro-lideres/scripts/refine-noel', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft,
          instruction,
          pillar,
          purpose: purpose.trim() || undefined,
          ylada_link_id: (draftMeta?.ylada_link_id ?? yladaLinkId) || null,
          locale: 'pt',
        }),
      })
      const data = (await res.json().catch(() => ({}))) as GenerateResponse
      if (!res.ok) {
        onError(data.error || 'Não foi possível aplicar o pedido.')
        setRefineLines((prev) => [
          ...prev,
          {
            id: chatId(),
            role: 'assistant',
            text: 'Não consegui aplicar este pedido. Tenta reformular ou verifica a mensagem de erro em cima.',
          },
        ])
        return
      }
      if (!data.draft) {
        onError('Resposta inválida do servidor.')
        return
      }
      setDraft(data.draft)
      if (data.ylada_link_id !== undefined && data.ylada_link_id !== null) {
        setDraftMeta((m) => ({ ...(m ?? { ylada_link_id: null }), ylada_link_id: data.ylada_link_id ?? null }))
      }
      setRefineLines((prev) => [
        ...prev,
        {
          id: chatId(),
          role: 'assistant',
          text: 'Atualizei o rascunho em cima. Podes pedir outra alteração ou escolher como guardar (equipe ou só tu).',
        },
      ])
    } catch {
      onError('Erro de rede ao refinar.')
      setRefineLines((prev) => [
        ...prev,
        {
          id: chatId(),
          role: 'assistant',
          text: 'Erro de rede. Tenta de novo.',
        },
      ])
    } finally {
      setRefining(false)
    }
  }

  async function onApply(visibleToTeam: boolean) {
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
          visible_to_team: visibleToTeam,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        onError((data as { error?: string }).error || 'Não foi possível criar a sequência.')
        return
      }
      const sectionId = (data as { section?: { id?: string } }).section?.id
      if (!sectionId) {
        onError('Resposta sem ID da sequência.')
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
              'A sequência foi criada, mas falhou ao guardar um dos textos. Completa manualmente.'
          )
          await onApplied()
          setDraft(null)
          setDraftMeta(null)
          setRefineLines([])
          setPurpose('')
          return
        }
      }

      setDraft(null)
      setDraftMeta(null)
      setRefineLines([])
      setPurpose('')
      await onApplied()
    } catch {
      onError('Erro de rede ao guardar.')
    } finally {
      onSaving(false)
    }
  }

  const busy = generating || saving || refining

  return (
    <div className="space-y-4">
      <p className="text-xs text-indigo-900/90">
        Textos para a <strong className="text-indigo-950">equipe mandar a clientes</strong> (permissão antes do link, indicação,
        ângulo família e convite a partilhar o link, em português do Brasil — usa acompanhamento, não follow-up). Depois de gerar,
        podes <strong className="text-indigo-950">pedir ajustes ao Noel</strong> num chat curto e{' '}
        <strong className="text-indigo-950">guardar para a equipe</strong> ou só para ti. Para falar com a equipe no geral, use o{' '}
        <a href="/pro-lideres/painel/noel" className="font-medium underline-offset-2 hover:underline">
          Noel
        </a>{' '}
        do painel.
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
            placeholder="Ex.: sequência WhatsApp para mandar o link do IMC com permissão, indicação e ideia de partilhar em família…"
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
                setRefineLines([])
                setRefineInput('')
              }}
              className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Descartar pré-visualização
            </button>
          ) : null}
        </div>
      </div>

      {draft ? (
        <div className="mt-5 space-y-4 border-t border-indigo-200/80 pt-4">
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

          <div className="rounded-xl border border-violet-200 bg-violet-50/40 p-3 sm:p-4">
            <p className="text-sm font-semibold text-violet-950">Pedir ajustes ao Noel</p>
            <p className="mt-1 text-xs text-violet-900/85">
              Escreve em português o que queres mudar; o rascunho em cima atualiza quando responderes.
            </p>
            <div
              className="mt-3 max-h-40 overflow-y-auto rounded-lg border border-violet-100 bg-white/90 px-3 py-2 text-xs text-gray-800"
              aria-live="polite"
            >
              {refineLines.map((line) => (
                <p
                  key={line.id}
                  className={`mb-2 last:mb-0 ${line.role === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <span
                    className={`inline-block max-w-[95%] rounded-lg px-2.5 py-1.5 text-left ${
                      line.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {line.text}
                  </span>
                </p>
              ))}
              <div ref={refineEndRef} />
            </div>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
              <label className="block min-w-0 flex-1 text-sm">
                <span className="mb-1 block text-xs font-medium text-violet-950">A tua mensagem ao Noel</span>
                <textarea
                  value={refineInput}
                  onChange={(e) => setRefineInput(e.target.value)}
                  rows={2}
                  maxLength={2000}
                  disabled={busy}
                  placeholder="Ex.: deixa a mensagem 2 com menos linhas e mais direta"
                  className="w-full rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
                />
              </label>
              <button
                type="button"
                disabled={busy || refineInput.trim().length < 3}
                onClick={() => void onRefine()}
                className="min-h-[44px] shrink-0 rounded-lg bg-violet-700 px-4 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-50"
              >
                {refining ? 'A aplicar…' : 'Enviar pedido'}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              disabled={busy}
              onClick={() => void onApply(true)}
              className="min-h-[48px] flex-1 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? 'A guardar…' : 'Salvar para a equipe'}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void onApply(false)}
              className="min-h-[48px] flex-1 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 sm:max-w-xs"
            >
              {saving ? 'A guardar…' : 'Guardar só para mim'}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            <strong className="font-medium text-gray-700">Salvar para a equipe</strong> — a sequência aparece no painel da equipe
            para copiar. <strong className="font-medium text-gray-700">Só para mim</strong> — rascunho ou uso interno; depois podes
            editar na lista e marcar «Equipe vê no painel».
          </p>
        </div>
      ) : null}
    </div>
  )
}
