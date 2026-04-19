'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { ProLideresCatalogToolPicker } from '@/components/pro-lideres/ProLideresCatalogToolPicker'
import type { ProLideresCatalogItem } from '@/lib/pro-lideres-catalog-build'
import {
  PL_SCRIPT_GUIDED_AUDIENCES,
  PL_SCRIPT_GUIDED_CHANNELS,
  PL_SCRIPT_GUIDED_FOCUS,
  PL_SCRIPT_GUIDED_OBJECTIVES,
  PL_SCRIPT_GUIDED_SITUATIONS,
  PL_SCRIPT_GUIDED_TONES,
  anglesForFocus,
  defaultAngleForFocus,
  normalizeToolPresetForFocus,
  toolsForFocus,
  type PlScriptGuidedBriefing,
  composeGuidedScriptPurpose,
  suggestPillarFromBriefing,
} from '@/lib/pro-lideres-script-guided-briefing'
import { clipToolPresetKey } from '@/lib/pro-lideres-script-section-meta'
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

const GUIDED_STEPS = 8

const defaultGuided = (): PlScriptGuidedBriefing => ({
  focusMainId: 'vendas',
  angleId: 'sales_equilibrado',
  objectiveId: 'novos_contatos',
  toolPresetId: 'conversa_um_a_um',
  toolFreeform: '',
  catalogToolLabel: null,
  audienceId: 'interesse',
  toneId: 'leve',
  situationId: 'nenhum',
  channelId: 'whatsapp',
  leaderNotes: '',
})

function chatId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`
}

function Chip({
  selected,
  onSelect,
  children,
  disabled,
}: {
  selected: boolean
  onSelect: () => void
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={`min-h-[44px] rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition ${
        selected
          ? 'border-indigo-500 bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300/60'
          : 'border-gray-200 bg-white text-gray-800 hover:border-indigo-300 hover:bg-indigo-50/50'
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      {children}
    </button>
  )
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
  const [inputMode, setInputMode] = useState<'guided' | 'free'>('guided')
  const [guidedStep, setGuidedStep] = useState(1)
  const [guided, setGuided] = useState<PlScriptGuidedBriefing>(defaultGuided)

  const [pillar, setPillar] = useState<ProLideresScriptPillarId>('whatsapp')
  const [pillarLocked, setPillarLocked] = useState(false)
  const [purpose, setPurpose] = useState('')
  const [yladaLinkId, setYladaLinkId] = useState('')
  const [generating, setGenerating] = useState(false)
  const [draft, setDraft] = useState<NoelScriptDraft | null>(null)
  const [draftMeta, setDraftMeta] = useState<{ ylada_link_id: string | null } | null>(null)

  const [refineLines, setRefineLines] = useState<ChatLine[]>([])
  const [refineInput, setRefineInput] = useState('')
  const [refining, setRefining] = useState(false)
  const refineEndRef = useRef<HTMLDivElement>(null)

  const toolLabelFromCatalog = useMemo(() => {
    if (!yladaLinkId) return null
    return catalog.find((c) => c.yladaLinkId === yladaLinkId)?.label?.trim() ?? null
  }, [catalog, yladaLinkId])

  useEffect(() => {
    setGuided((g) => ({ ...g, catalogToolLabel: toolLabelFromCatalog }))
  }, [toolLabelFromCatalog])

  useEffect(() => {
    if (!pillarLocked) {
      setPillar(suggestPillarFromBriefing(guided))
    }
  }, [guided, pillarLocked])

  useEffect(() => {
    refineEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [refineLines.length, refining])

  const guidedPurpose = useMemo(() => composeGuidedScriptPurpose(guided), [guided])

  const resetFlow = useCallback(() => {
    setDraft(null)
    setDraftMeta(null)
    setRefineLines([])
    setRefineInput('')
  }, [])

  async function onGenerate(opts?: { purposeText?: string; guidedRequest?: boolean }) {
    const p = (opts?.purposeText ?? purpose).trim()
    const guidedReq = opts?.guidedRequest ?? (inputMode === 'guided')
    if (p.length < 8) {
      onError('Precisamos de um pouco mais de contexto (mínimo 8 caracteres).')
      return
    }
    if (inputMode === 'guided' || guidedReq) {
      if (guided.toolPresetId === 'outra' && !guided.toolFreeform.trim() && !yladaLinkId) {
        onError('Em «Outra ferramenta», escreve uma linha ou escolhe uma ferramenta do catálogo YLADA.')
        return
      }
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
          guided: guidedReq,
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
          text: 'Rascunho pronto. Você pode pedir ajustes abaixo ou salvar para a equipe.',
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
      onError('Escreva o que quer alterar (mínimo 3 caracteres).')
      return
    }
    const purposeForRefine =
      inputMode === 'guided' ? guidedPurpose.trim() || purpose.trim() : purpose.trim() || undefined
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
          purpose: purposeForRefine,
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
            text: 'Não consegui aplicar este pedido. Tente reformular ou veja a mensagem de erro acima.',
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
          text: 'Atualizei o rascunho. Pode pedir outra alteração ou salvar.',
        },
      ])
    } catch {
      onError('Erro de rede ao refinar.')
      setRefineLines((prev) => [
        ...prev,
        {
          id: chatId(),
          role: 'assistant',
          text: 'Erro de rede. Tente de novo.',
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
          focus_main: inputMode === 'guided' ? guided.focusMainId : 'vendas',
          intention_key: inputMode === 'guided' ? guided.objectiveId : 'geral',
          tool_preset_key: inputMode === 'guided' ? clipToolPresetKey(guided.toolPresetId) : null,
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
              'A sequência foi criada, mas falhou ao guardar um dos textos. Complete manualmente.'
          )
          await onApplied()
          resetFlow()
          setPurpose('')
          setGuided(defaultGuided())
          setGuidedStep(1)
          return
        }
      }

      resetFlow()
      setPurpose('')
      setGuided(defaultGuided())
      setGuidedStep(1)
      setPillarLocked(false)
      await onApplied()
    } catch {
      onError('Erro de rede ao salvar.')
    } finally {
      onSaving(false)
    }
  }

  const busy = generating || saving || refining

  const stepTitle = useMemo(() => {
    switch (guidedStep) {
      case 1:
        return 'Esse script é para qual foco principal?'
      case 2:
        return 'Qual ângulo puxar primeiro?'
      case 3:
        return 'O que esse script precisa gerar?'
      case 4:
        return 'Está ligado a alguma ferramenta ou situação?'
      case 5:
        return 'Para quem é a mensagem?'
      case 6:
        return 'Como você quer soar?'
      case 7:
        return 'Algum detalhe do momento?'
      case 8:
        return 'Canal e tipo de texto'
      default:
        return ''
    }
  }, [guidedStep])

  return (
    <div className="space-y-5">
      <p className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/90 via-white to-violet-50/40 px-4 py-3 text-sm leading-relaxed text-indigo-950 sm:px-5 sm:py-3.5">
        Depois você pode <strong className="text-indigo-950">ajustar com o Noel</strong> e{' '}
        <strong className="text-indigo-950">salvar para a equipe</strong>.
      </p>

      <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-gray-50/80 p-1.5">
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setInputMode('guided')
            onError(null)
          }}
          className={`min-h-[44px] flex-1 rounded-lg px-3 text-sm font-semibold transition sm:flex-none sm:px-5 ${
            inputMode === 'guided'
              ? 'bg-white text-indigo-900 shadow-sm ring-1 ring-indigo-200'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Guiado
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setInputMode('free')
            onError(null)
          }}
          className={`min-h-[44px] flex-1 rounded-lg px-3 text-sm font-semibold transition sm:flex-none sm:px-5 ${
            inputMode === 'free'
              ? 'bg-white text-indigo-900 shadow-sm ring-1 ring-indigo-200'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Livre
        </button>
      </div>

      {inputMode === 'guided' && !draft ? (
        <div className="space-y-4 rounded-2xl border border-indigo-200/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Passo {guidedStep} de {GUIDED_STEPS}
            </p>
            <div className="flex gap-1" aria-hidden>
              {Array.from({ length: GUIDED_STEPS }, (_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-6 rounded-full ${i < guidedStep ? 'bg-indigo-600' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
          <h3 className="text-base font-bold text-gray-900">{stepTitle}</h3>

          {guidedStep === 1 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {PL_SCRIPT_GUIDED_FOCUS.map((f) => (
                <Chip
                  key={f.id}
                  selected={guided.focusMainId === f.id}
                  disabled={busy}
                  onSelect={() =>
                    setGuided((g) => ({
                      ...g,
                      focusMainId: f.id,
                      angleId: defaultAngleForFocus(f.id),
                      toolPresetId: normalizeToolPresetForFocus(g.toolPresetId, f.id),
                    }))
                  }
                >
                  {f.label}
                </Chip>
              ))}
            </div>
          )}

          {guidedStep === 2 && (
            <div className="grid gap-2 sm:grid-cols-1 sm:grid-cols-2">
              {anglesForFocus(guided.focusMainId).map((a) => (
                <Chip
                  key={a.id}
                  selected={guided.angleId === a.id}
                  disabled={busy}
                  onSelect={() => setGuided((g) => ({ ...g, angleId: a.id }))}
                >
                  {a.label}
                </Chip>
              ))}
            </div>
          )}

          {guidedStep === 3 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {PL_SCRIPT_GUIDED_OBJECTIVES.map((o) => (
                <Chip
                  key={o.id}
                  selected={guided.objectiveId === o.id}
                  disabled={busy}
                  onSelect={() => setGuided((g) => ({ ...g, objectiveId: o.id }))}
                >
                  {o.label}
                </Chip>
              ))}
            </div>
          )}

          {guidedStep === 4 && (
            <div className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                {toolsForFocus(guided.focusMainId).map((t) => (
                  <Chip
                    key={t.id}
                    selected={guided.toolPresetId === t.id}
                    disabled={busy}
                    onSelect={() => setGuided((g) => ({ ...g, toolPresetId: t.id }))}
                  >
                    {t.label}
                  </Chip>
                ))}
              </div>
              <ProLideresCatalogToolPicker
                catalog={catalog}
                value={yladaLinkId}
                onChange={setYladaLinkId}
                disabled={busy}
                accent="indigo"
              />
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-800">
                  {guided.toolPresetId === 'outra'
                    ? 'Descreva a ferramenta ou campanha (uma ou duas frases)'
                    : 'Complemento opcional (nome do desafio, datas, etc.)'}
                </span>
                <textarea
                  value={guided.toolFreeform}
                  onChange={(e) => setGuided((g) => ({ ...g, toolFreeform: e.target.value }))}
                  rows={2}
                  maxLength={800}
                  disabled={busy}
                  className="w-full rounded-xl border border-indigo-100 bg-indigo-50/20 px-3 py-2.5 text-sm"
                  placeholder="Ex.: segunda semana do desafio, foco em hidratação…"
                />
              </label>
            </div>
          )}

          {guidedStep === 5 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {PL_SCRIPT_GUIDED_AUDIENCES.map((a) => (
                <Chip
                  key={a.id}
                  selected={guided.audienceId === a.id}
                  disabled={busy}
                  onSelect={() => setGuided((g) => ({ ...g, audienceId: a.id }))}
                >
                  {a.label}
                </Chip>
              ))}
            </div>
          )}

          {guidedStep === 6 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {PL_SCRIPT_GUIDED_TONES.map((t) => (
                <Chip
                  key={t.id}
                  selected={guided.toneId === t.id}
                  disabled={busy}
                  onSelect={() => setGuided((g) => ({ ...g, toneId: t.id }))}
                >
                  {t.label}
                </Chip>
              ))}
            </div>
          )}

          {guidedStep === 7 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {PL_SCRIPT_GUIDED_SITUATIONS.map((s) => (
                <Chip
                  key={s.id}
                  selected={guided.situationId === s.id}
                  disabled={busy}
                  onSelect={() => setGuided((g) => ({ ...g, situationId: s.id }))}
                >
                  {s.label}
                </Chip>
              ))}
            </div>
          )}

          {guidedStep === 8 && (
            <div className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                {PL_SCRIPT_GUIDED_CHANNELS.map((c) => (
                  <Chip
                    key={c.id}
                    selected={guided.channelId === c.id}
                    disabled={busy}
                    onSelect={() => setGuided((g) => ({ ...g, channelId: c.id }))}
                  >
                    {c.label}
                  </Chip>
                ))}
              </div>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-800">Tipo de texto (formato Noel)</span>
                <select
                  value={pillar}
                  onChange={(e) => {
                    setPillarLocked(true)
                    setPillar(e.target.value as ProLideresScriptPillarId)
                  }}
                  className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2.5 text-sm"
                >
                  {PRO_LIDERES_SCRIPT_PILLARS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <span className="mt-1 block text-xs text-gray-500">
                  Sugestão pelo briefing:{' '}
                  {PRO_LIDERES_SCRIPT_PILLARS.find((p) => p.id === suggestPillarFromBriefing(guided))?.label}. Você pode
                  mudar acima.
                </span>
              </label>
              <label className="block text-sm">
                <span className="mb-1 block font-medium text-gray-800">Algo mais que o Noel deve saber? (opcional)</span>
                <textarea
                  value={guided.leaderNotes}
                  onChange={(e) => setGuided((g) => ({ ...g, leaderNotes: e.target.value }))}
                  rows={2}
                  maxLength={1200}
                  disabled={busy}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                  placeholder="Ex.: não mencionar preço; time muito novo…"
                />
              </label>
              <details className="rounded-xl border border-gray-100 bg-gray-50/80 px-3 py-2 text-sm text-gray-700">
                <summary className="cursor-pointer font-medium text-gray-800">Ver resumo enviado ao Noel</summary>
                <pre className="mt-2 max-h-36 overflow-auto whitespace-pre-wrap rounded-lg bg-white p-2 text-xs text-gray-600 ring-1 ring-gray-100">
                  {guidedPurpose}
                </pre>
              </details>
            </div>
          )}

          <div className="flex flex-wrap gap-2 border-t border-indigo-100 pt-4">
            <button
              type="button"
              disabled={busy || guidedStep <= 1}
              onClick={() => setGuidedStep((s) => Math.max(1, s - 1))}
              className="min-h-[44px] rounded-xl border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Voltar
            </button>
            {guidedStep < GUIDED_STEPS ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => setGuidedStep((s) => Math.min(GUIDED_STEPS, s + 1))}
                className="min-h-[44px] rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Próximo
              </button>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => void onGenerate({ purposeText: guidedPurpose, guidedRequest: true })}
                className="min-h-[44px] rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {generating ? 'Gerando…' : 'Gerar rascunho com o Noel'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-800">Tipo de texto</span>
            <select
              value={pillar}
              onChange={(e) => setPillar(e.target.value as ProLideresScriptPillarId)}
              className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2.5 text-sm"
            >
              {PRO_LIDERES_SCRIPT_PILLARS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-gray-800">O que você quer que o Noel escreva</span>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2.5 text-sm"
              placeholder="Ex.: sequência no WhatsApp para enviar o link do espaço saudável, com permissão e ideia de indicar alguém da família…"
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
              onClick={() => void onGenerate({ purposeText: purpose, guidedRequest: false })}
              className="min-h-[44px] rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {generating ? 'Gerando…' : 'Gerar rascunho'}
            </button>
          </div>
        </div>
      )}

      {draft ? (
        <div className="mt-2 space-y-4 border-t border-indigo-200/80 pt-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-gray-900">Pré-visualização</p>
            <div className="flex flex-wrap gap-2">
              {inputMode === 'guided' ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => {
                    resetFlow()
                    setGuidedStep(8)
                  }}
                  className="min-h-[40px] rounded-xl border border-indigo-200 bg-indigo-50 px-3 text-xs font-semibold text-indigo-900 hover:bg-indigo-100 disabled:opacity-50"
                >
                  Ajustar briefing
                </button>
              ) : null}
              <button
                type="button"
                disabled={busy}
                onClick={() => {
                  resetFlow()
                  setRefineInput('')
                }}
                className="min-h-[40px] rounded-xl border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Descartar rascunho
              </button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-gray-100">
            <div className="border-b border-gray-100 bg-gradient-to-r from-slate-50 to-white px-4 py-3 sm:px-5">
              <h3 className="text-lg font-bold text-gray-900">{draft.section_title}</h3>
              {draft.section_subtitle?.trim() ? (
                <p className="mt-1 text-sm text-gray-600">{draft.section_subtitle}</p>
              ) : null}
            </div>
            <ol className="list-decimal space-y-4 p-4 pl-8 text-sm marker:font-semibold marker:text-indigo-600 sm:p-5 sm:pl-9">
              {draft.entries.map((e, i) => (
                <li key={i} className="pl-1 text-gray-800">
                  <span className="font-semibold text-gray-900">{e.title}</span>
                  {e.subtitle?.trim() ? (
                    <span className="mt-0.5 block text-xs font-medium text-gray-500">{e.subtitle}</span>
                  ) : null}
                  {e.body?.trim() ? (
                    <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap rounded-xl bg-gray-50 p-3 font-sans text-sm leading-relaxed text-gray-800 ring-1 ring-gray-100/80">
                      {e.body}
                    </pre>
                  ) : null}
                  {e.how_to_use?.trim() ? (
                    <p className="mt-2 rounded-lg border border-sky-100 bg-sky-50/90 px-3 py-2 text-xs text-sky-950">
                      <span className="font-semibold">Como usar:</span> {e.how_to_use}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-violet-200 bg-gradient-to-b from-violet-50/50 to-white p-4 sm:p-5">
            <p className="text-sm font-semibold text-violet-950">Pedir ajustes ao Noel</p>
            <p className="mt-1 text-xs text-violet-900/85">
              Escreva em português o que quer mudar; o rascunho acima atualiza quando o Noel responder.
            </p>
            <div
              className="mt-3 max-h-44 overflow-y-auto rounded-xl border border-violet-100 bg-white/95 px-3 py-2 text-xs text-gray-800"
              aria-live="polite"
            >
              {refineLines.map((line) => (
                <p
                  key={line.id}
                  className={`mb-2 last:mb-0 ${line.role === 'user' ? 'text-right' : 'text-left'}`}
                >
                  <span
                    className={`inline-block max-w-[95%] rounded-xl px-2.5 py-1.5 text-left ${
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
                <span className="mb-1 block text-xs font-medium text-violet-950">Sua mensagem ao Noel</span>
                <textarea
                  value={refineInput}
                  onChange={(e) => setRefineInput(e.target.value)}
                  rows={2}
                  maxLength={2000}
                  disabled={busy}
                  placeholder="Ex.: deixe a mensagem 2 mais curta e direta"
                  className="w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400"
                />
              </label>
              <button
                type="button"
                disabled={busy || refineInput.trim().length < 3}
                onClick={() => void onRefine()}
                className="min-h-[44px] shrink-0 rounded-xl bg-violet-700 px-4 text-sm font-semibold text-white hover:bg-violet-800 disabled:opacity-50"
              >
                {refining ? 'Aplicando…' : 'Enviar pedido'}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              disabled={busy}
              onClick={() => void onApply(true)}
              className="min-h-[48px] flex-1 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? 'Salvando…' : 'Salvar para a equipe'}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void onApply(false)}
              className="min-h-[48px] flex-1 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50 sm:max-w-xs"
            >
              {saving ? 'Salvando…' : 'Guardar só para mim'}
            </button>
          </div>
          <p className="text-xs text-gray-500">
            <strong className="font-medium text-gray-700">Salvar para a equipe</strong> — a sequência aparece no painel
            para copiar. <strong className="font-medium text-gray-700">Só para mim</strong> — rascunho; depois você pode
            marcar «Equipe vê no painel» na lista.
          </p>
        </div>
      ) : null}
    </div>
  )
}
