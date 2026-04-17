'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import {
  getNoelLabBatteryById,
  getNoelLabFullSequenceFlat,
  getNoelLabPresetQuestionAt,
  getNoelLabPresetTotal,
  NOEL_LAB_FULL_SEQUENCE_ID,
  PRO_LIDERES_NOEL_LAB_BATTERIES,
} from '@/lib/pro-lideres-noel-lab-battery'
import {
  PRO_LIDERES_NOEL_LAB_SCENARIOS,
  type ProLideresNoelLabScenarioId,
} from '@/lib/pro-lideres-noel-lab-agent-prompt'

type TurnFrom = 'president' | 'leader' | 'noel'

type LabTurn = { id: string; from: TurnFrom; text: string }

type LastLinkCtx = {
  flow_id: string
  interpretacao: Record<string, unknown>
  questions: Array<{ id: string; label: string; type?: string; options?: string[] }>
  url?: string
  title?: string
  link_id?: string
}

function id() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

const NOEL_LAB_FULL_SEQUENCE_TOTAL = getNoelLabPresetTotal(NOEL_LAB_FULL_SEQUENCE_ID)

export default function ProLideresNoelLaboratorioPage() {
  const authenticatedFetch = useAuthenticatedFetch()
  const [scenarioId, setScenarioId] = useState<ProLideresNoelLabScenarioId>('geral')
  /** Vazio = modo livre (agente IA gera pergunta). Com valor = bateria fixa em sequência. */
  const [batteryId, setBatteryId] = useState<string>('')
  const [batteryStep, setBatteryStep] = useState(0)
  const [turns, setTurns] = useState<LabTurn[]>([])
  const [lastLinkContext, setLastLinkContext] = useState<LastLinkCtx | null>(null)
  const [autoNoel, setAutoNoel] = useState(true)
  const [loading, setLoading] = useState<'agent' | 'noel' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [autoRunning, setAutoRunning] = useState(false)
  const [autoProgress, setAutoProgress] = useState<string | null>(null)
  const autoRunCancelRef = useRef(false)

  const fullSequenceFlat =
    batteryId === NOEL_LAB_FULL_SEQUENCE_ID ? getNoelLabFullSequenceFlat() : null
  const activeBattery =
    batteryId && batteryId !== NOEL_LAB_FULL_SEQUENCE_ID ? getNoelLabBatteryById(batteryId) : undefined
  const presetActive = !!fullSequenceFlat || !!activeBattery
  const presetTotal = batteryId ? getNoelLabPresetTotal(batteryId) : 0
  const presetAtEnd = presetActive && batteryStep >= presetTotal
  const currentSequenceEntry =
    fullSequenceFlat && batteryStep < fullSequenceFlat.length ? fullSequenceFlat[batteryStep] : null

  useEffect(() => {
    setBatteryStep(0)
  }, [batteryId])

  useEffect(() => {
    if (batteryId) setAutoNoel(true)
  }, [batteryId])

  const toNoelHistory = useCallback((list: LabTurn[]) => {
    return list.map((t) => ({
      role: t.from === 'noel' ? ('assistant' as const) : ('user' as const),
      content: t.text,
    }))
  }, [])

  const [draftMessage, setDraftMessage] = useState('')
  const transcriptEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [turns, loading])

  const resetSession = useCallback(() => {
    setTurns([])
    setLastLinkContext(null)
    setError(null)
    setBatteryStep(0)
  }, [])

  const runNextPresetThenNoel = useCallback(async () => {
    const total = getNoelLabPresetTotal(batteryId)
    if (!batteryId || total === 0) {
      setError('Escolha «Sequência completa» ou uma bateria na lista.')
      return
    }
    if (batteryStep >= total) {
      setError('Fim das perguntas deste modo. Clique em «Repetir do início» ou «Limpar sessão».')
      return
    }
    const question = getNoelLabPresetQuestionAt(batteryId, batteryStep)
    if (!question) {
      setError('Pergunta inválida neste índice.')
      return
    }
    setError(null)
    setLoading('noel')
    try {
      const conversationHistory = toNoelHistory(turns)
      const noelRes = await authenticatedFetch('/api/pro-lideres/noel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          conversationHistory,
          locale: 'pt',
          lastLinkContext: lastLinkContext ?? undefined,
        }),
      })
      const noelData = (await noelRes.json().catch(() => ({}))) as {
        response?: string
        lastLinkContext?: LastLinkCtx | null
        error?: string
      }
      if (!noelRes.ok) throw new Error(noelData.error || 'Falha no Noel')
      if (noelData.lastLinkContext) setLastLinkContext(noelData.lastLinkContext)
      const response = (noelData.response || '').trim()
      setTurns((prev) => [
        ...prev,
        { id: id(), from: 'president', text: question },
        { id: id(), from: 'noel', text: response || '(sem texto)' },
      ])
      setBatteryStep((s) => s + 1)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setLoading(null)
    }
  }, [authenticatedFetch, batteryId, batteryStep, lastLinkContext, toNoelHistory, turns])

  const stopAutoSequence = useCallback(() => {
    autoRunCancelRef.current = true
  }, [])

  const runAllPresetsAutomatically = useCallback(async () => {
    const total = getNoelLabPresetTotal(batteryId)
    if (!batteryId || total === 0) {
      setError('Escolha «Sequência completa» ou uma bateria.')
      return
    }
    autoRunCancelRef.current = false
    setError(null)
    setAutoRunning(true)
    setBatteryStep(0)
    setAutoProgress(`0/${total}`)

    let localTurns = [...turns]
    let localLink: LastLinkCtx | null = lastLinkContext

    try {
      for (let step = 0; step < total; step++) {
        if (autoRunCancelRef.current) break
        const question = getNoelLabPresetQuestionAt(batteryId, step)
        if (!question) break

        setLoading('noel')
        const conversationHistory = toNoelHistory(localTurns)
        const noelRes = await authenticatedFetch('/api/pro-lideres/noel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: question,
            conversationHistory,
            locale: 'pt',
            lastLinkContext: localLink ?? undefined,
          }),
        })
        const noelData = (await noelRes.json().catch(() => ({}))) as {
          response?: string
          lastLinkContext?: LastLinkCtx | null
          error?: string
        }
        if (!noelRes.ok) throw new Error(noelData.error || 'Falha no Noel')
        const response = (noelData.response || '').trim()
        if (noelData.lastLinkContext) {
          localLink = noelData.lastLinkContext
        }
        localTurns = [
          ...localTurns,
          { id: id(), from: 'president' as const, text: question },
          { id: id(), from: 'noel' as const, text: response || '(sem texto)' },
        ]
        setTurns(localTurns)
        if (noelData.lastLinkContext) setLastLinkContext(noelData.lastLinkContext)
        setBatteryStep(step + 1)
        setAutoProgress(`${step + 1}/${total}`)
        await new Promise((r) => setTimeout(r, 450))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setAutoRunning(false)
      setLoading(null)
      setAutoProgress(null)
    }
  }, [authenticatedFetch, batteryId, lastLinkContext, toNoelHistory, turns])

  const sendLeaderChat = useCallback(async () => {
    const text = draftMessage.trim()
    if (!text || loading) return
    setError(null)
    setLoading('noel')
    try {
      const conversationHistory = toNoelHistory(turns)
      const noelRes = await authenticatedFetch('/api/pro-lideres/noel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory,
          locale: 'pt',
          lastLinkContext: lastLinkContext ?? undefined,
        }),
      })
      const noelData = (await noelRes.json().catch(() => ({}))) as {
        response?: string
        lastLinkContext?: LastLinkCtx | null
        error?: string
      }
      if (!noelRes.ok) throw new Error(noelData.error || 'Falha no Noel')
      if (noelData.lastLinkContext) setLastLinkContext(noelData.lastLinkContext)
      const response = (noelData.response || '').trim()
      setTurns((prev) => [
        ...prev,
        { id: id(), from: 'leader', text },
        { id: id(), from: 'noel', text: response || '(sem texto)' },
      ])
      setDraftMessage('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setLoading(null)
    }
  }, [authenticatedFetch, draftMessage, lastLinkContext, loading, toNoelHistory, turns])

  const runAgentThenNoel = useCallback(async () => {
    if (batteryId) {
      setError(
        'Com perguntas pré-definidas selecionadas, use o cartão laranja («Próxima pergunta» ou «Rodar todas»). Para o agente IA, escolha «Livre — agente IA».'
      )
      return
    }
    setError(null)
    setLoading('agent')
    try {
      const transcript = turns.map((t) => ({
        from: t.from === 'leader' ? 'leader' : t.from,
        text: t.text,
      }))
      const agentRes = await authenticatedFetch('/api/pro-lideres/noel-lab/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenarioId, transcript }),
      })
      const agentData = (await agentRes.json().catch(() => ({}))) as { question?: string; error?: string }
      if (!agentRes.ok) {
        throw new Error(agentData.error || 'Falha no agente de teste')
      }
      const question = (agentData.question || '').trim()
      if (!question) throw new Error('Pergunta vazia do agente')

      if (!autoNoel) {
        setTurns((prev) => [...prev, { id: id(), from: 'president', text: question }])
        setLoading(null)
        return
      }

      setLoading('noel')
      const conversationHistory = toNoelHistory(turns)
      const noelRes = await authenticatedFetch('/api/pro-lideres/noel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: question,
          conversationHistory,
          locale: 'pt',
          lastLinkContext: lastLinkContext ?? undefined,
        }),
      })
      const noelData = (await noelRes.json().catch(() => ({}))) as {
        response?: string
        lastLinkContext?: LastLinkCtx | null
        error?: string
      }
      if (!noelRes.ok) {
        throw new Error(noelData.error || 'Falha no Noel')
      }
      const response = (noelData.response || '').trim()
      if (noelData.lastLinkContext) {
        setLastLinkContext(noelData.lastLinkContext)
      }
      setTurns((prev) => [
        ...prev,
        { id: id(), from: 'president', text: question },
        { id: id(), from: 'noel', text: response || '(sem texto)' },
      ])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setLoading(null)
    }
  }, [authenticatedFetch, autoNoel, batteryId, lastLinkContext, scenarioId, toNoelHistory, turns])

  const runNoelOnly = useCallback(async () => {
    const last = turns[turns.length - 1]
    if (!last || (last.from !== 'president' && last.from !== 'leader')) {
      setError('Última mensagem tem de ser do presidente simulado ou sua mensagem, para pedir ao Noel.')
      return
    }
    setError(null)
    setLoading('noel')
    try {
      const prior = turns.slice(0, -1)
      const conversationHistory = toNoelHistory(prior)
      const noelRes = await authenticatedFetch('/api/pro-lideres/noel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: last.text,
          conversationHistory,
          locale: 'pt',
          lastLinkContext: lastLinkContext ?? undefined,
        }),
      })
      const noelData = (await noelRes.json().catch(() => ({}))) as {
        response?: string
        lastLinkContext?: LastLinkCtx | null
        error?: string
      }
      if (!noelRes.ok) throw new Error(noelData.error || 'Falha no Noel')
      if (noelData.lastLinkContext) setLastLinkContext(noelData.lastLinkContext)
      const response = (noelData.response || '').trim()
      setTurns((prev) => [...prev, { id: id(), from: 'noel', text: response || '(sem texto)' }])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setLoading(null)
    }
  }, [authenticatedFetch, lastLinkContext, toNoelHistory, turns])

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <p className="text-sm font-medium text-violet-600">Laboratório · Ambiente do líder</p>
        <h1 className="text-2xl font-bold text-gray-900">Testes ao Noel</h1>
        <p className="mt-2 text-sm text-gray-600">
          <strong>Chat manual:</strong> escreva na caixa abaixo da transcrição — conversa contínua com o Noel no mesmo
          histórico (responde à pergunta dele, aprofunda, testa outro ângulo).{' '}
          <strong>Modo livre:</strong> o agente de IA simula um presidente.{' '}
          <strong>Perguntas pré-definidas:</strong> escolha <strong>«Sequência completa»</strong> ou um tema — depois é
          só ir clicando em <strong>«Próxima pergunta + Noel»</strong> para ver todas as respostas e analisar.
          O <strong>Noel real</strong> usa as mesmas regras do painel. Nada disto grava no Noel de produção fora desta
          sessão no browser.
        </p>
        <p className="mt-2 text-xs text-amber-800">
          Aviso: mensagens passam pelas APIs reais (OpenAI + Noel). Use cenários responsáveis; o conteúdo deve
          respeitar políticas da marca.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-gray-700">Perguntas pré-definidas (só clicar em «Próxima»)</span>
          <select
            value={batteryId}
            disabled={autoRunning}
            onChange={(e) => setBatteryId(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100"
          >
            <option value="">Livre — agente IA gera a pergunta (cenário abaixo)</option>
            <option value={NOEL_LAB_FULL_SEQUENCE_ID}>
              Sequência completa — todas as perguntas ({NOEL_LAB_FULL_SEQUENCE_TOTAL})
            </option>
            {PRO_LIDERES_NOEL_LAB_BATTERIES.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label} ({b.questions.length} perguntas)
              </option>
            ))}
          </select>
          {fullSequenceFlat ? (
            <p className="text-xs text-gray-600">
              <span className="font-medium text-gray-700">Modo:</span> percorre todos os temas na ordem do laboratório.
              Global <strong>{Math.min(batteryStep + 1, presetTotal)}</strong> / <strong>{presetTotal}</strong>
              {currentSequenceEntry ? (
                <>
                  {' '}
                  · tema atual: <strong>{currentSequenceEntry.batteryLabel}</strong> (
                  {currentSequenceEntry.questionIndexInBattery + 1}/{currentSequenceEntry.batteryQuestionCount} neste
                  tema)
                </>
              ) : null}
              {presetAtEnd ? <span className="ml-1 font-medium text-amber-800"> (sequência concluída)</span> : null}
            </p>
          ) : activeBattery ? (
            <p className="text-xs text-gray-600">
              <span className="font-medium text-gray-700">Observar:</span> {activeBattery.checklistHint} — pergunta{' '}
              <strong>{Math.min(batteryStep + 1, activeBattery.questions.length)}</strong> de{' '}
              <strong>{activeBattery.questions.length}</strong>
              {presetAtEnd ? <span className="ml-1 font-medium text-amber-800"> (tema concluído)</span> : null}
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Para ir clicando só em «próxima», escolha acima <strong>Sequência completa</strong> ou um tema. Com
              «Livre», use o botão roxo.
            </p>
          )}
        </label>

        <div className="border-t border-gray-100 pt-3">
          <label className="flex min-w-[12rem] flex-col gap-1 text-sm">
            <span className="font-medium text-gray-700">Cenário do agente (só modo livre)</span>
            <select
              value={scenarioId}
              disabled={presetActive}
              onChange={(e) => setScenarioId(e.target.value as ProLideresNoelLabScenarioId)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              {PRO_LIDERES_NOEL_LAB_SCENARIOS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={autoNoel}
            onChange={(e) => setAutoNoel(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          Depois de cada pergunta do agente, pedir já resposta ao Noel
        </label>
      </div>

      {presetActive ? (
        <div className="rounded-xl border-2 border-amber-400 bg-gradient-to-b from-amber-50 to-white p-4 shadow-sm">
          <p className="text-center text-sm font-semibold text-amber-950">Teste rápido — mesma ação, várias vezes</p>
          <p className="mt-1 text-center text-xs text-amber-900/90">
            <strong>Um clique:</strong> próxima pergunta. <strong>Rodar todas:</strong> dispara o resto da sequência do
            início (com pausa curta entre chamadas). Depois analise a transcrição.
          </p>
          {autoProgress ? (
            <p className="mt-2 text-center text-sm font-semibold text-amber-900">
              Automático: {autoProgress}
              {autoRunning ? (
                <button
                  type="button"
                  onClick={stopAutoSequence}
                  className="ml-3 rounded-lg border border-red-300 bg-red-50 px-2 py-1 text-xs font-bold text-red-800 hover:bg-red-100"
                >
                  Parar
                </button>
              ) : null}
            </p>
          ) : null}
          {!presetAtEnd ? (
            <>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  disabled={!!loading || autoRunning}
                  onClick={() => void runNextPresetThenNoel()}
                  className="w-full flex-1 rounded-xl bg-amber-600 px-4 py-4 text-base font-bold text-white shadow-md hover:bg-amber-700 disabled:opacity-50 sm:text-lg"
                >
                  {loading === 'noel' && !autoRunning
                    ? 'Noel a responder…'
                    : `Próxima pergunta + Noel (${batteryStep + 1} / ${presetTotal})`}
                </button>
                <button
                  type="button"
                  disabled={!!loading || autoRunning}
                  onClick={() => void runAllPresetsAutomatically()}
                  className="w-full flex-1 rounded-xl border-2 border-amber-700 bg-white px-4 py-4 text-sm font-bold text-amber-950 shadow-sm hover:bg-amber-100 disabled:opacity-50 sm:text-base"
                >
                  Rodar todas automaticamente (do início)
                </button>
              </div>
              {turns.length > 0 ? (
                <p className="mt-2 text-center text-[11px] text-amber-900/80">
                  Se já tiver perguntas/respostas na transcrição e quiser evitar duplicar ao «rodar todas», use «Limpar
                  sessão» antes.
                </p>
              ) : null}
            </>
          ) : (
            <button
              type="button"
              disabled={!!loading || autoRunning}
              onClick={() => setBatteryStep(0)}
              className="mt-4 w-full rounded-xl border-2 border-amber-500 bg-amber-100 px-4 py-3 text-sm font-bold text-amber-950 hover:bg-amber-200 disabled:opacity-50"
              title="Volta à primeira pergunta deste modo. A transcrição mantém-se — use Limpar sessão para teste sem histórico."
            >
              Repetir do início (mesma sequência)
            </button>
          )}
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!!loading || !!batteryId || autoRunning}
          onClick={runAgentThenNoel}
          className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          {loading === 'agent'
            ? 'Agente a pensar…'
            : loading === 'noel'
              ? 'Noel a responder…'
              : autoNoel
                ? 'Próximo turno (agente + Noel)'
                : 'Próxima pergunta do agente'}
        </button>
        {!autoNoel ? (
          <button
            type="button"
            disabled={!!loading || autoRunning}
            onClick={runNoelOnly}
            className="rounded-lg border border-violet-300 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-900 hover:bg-violet-100 disabled:opacity-50"
          >
            Pedir resposta do Noel à última pergunta
          </button>
        ) : null}
        <button
          type="button"
          disabled={!!loading || autoRunning}
          onClick={resetSession}
          className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Limpar sessão
        </button>
        <Link
          href="/pro-lideres/painel/noel"
          className="inline-flex items-center rounded-lg px-4 py-2.5 text-sm font-medium text-violet-700 hover:underline"
        >
          ← Voltar ao Noel
        </Link>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>
      ) : null}

      {lastLinkContext?.url ? (
        <p className="text-xs text-gray-500">
          Contexto de link na sessão: <span className="font-mono">{lastLinkContext.title || lastLinkContext.url}</span>
        </p>
      ) : null}

      <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/80 p-4">
        <h2 className="text-sm font-semibold text-gray-800">Transcrição</h2>
        {turns.length === 0 ? (
          <p className="text-sm text-gray-500">
            Ainda vazio. Escolha «Sequência completa» ou um tema e use o botão grande laranja, ou «Livre» + roxo, ou o
            chat em baixo.
          </p>
        ) : (
          <ul className="max-h-[min(28rem,55vh)] space-y-4 overflow-y-auto pr-1">
            {turns.map((t) => (
              <li
                key={t.id}
                className={`rounded-lg border p-3 ${
                  t.from === 'noel'
                    ? 'border-violet-200 bg-white shadow-sm'
                    : t.from === 'leader'
                      ? 'border-emerald-200 bg-emerald-50/90'
                      : 'border-amber-200 bg-amber-50/90'
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {t.from === 'president'
                    ? 'Presidente (simulado)'
                    : t.from === 'leader'
                      ? 'Você (líder — teste)'
                      : 'Noel'}
                </p>
                <div className="prose prose-sm mt-1 max-w-none text-gray-900 prose-p:my-1">
                  <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
                    {t.text}
                  </ReactMarkdown>
                </div>
              </li>
            ))}
            <div ref={transcriptEndRef} aria-hidden />
          </ul>
        )}

        <div className="border-t border-gray-200 pt-4">
          <p className="mb-2 text-xs font-medium text-gray-600">Chat contínuo com o Noel</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <textarea
              value={draftMessage}
              onChange={(e) => setDraftMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault()
                  void sendLeaderChat()
                }
              }}
              rows={3}
              disabled={!!loading || autoRunning}
              placeholder="Responda ao Noel, aprofunde o tema, mude de assunto… (Ctrl+Enter ou ⌘+Enter para enviar)"
              className="min-h-[5rem] w-full flex-1 resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100"
            />
            <button
              type="button"
              disabled={!!loading || autoRunning || !draftMessage.trim()}
              onClick={() => void sendLeaderChat()}
              className="shrink-0 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading === 'noel' ? 'A enviar…' : 'Enviar ao Noel'}
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Enter quebra linha; <strong>Ctrl+Enter</strong> (Windows/Linux) ou <strong>⌘+Enter</strong> (Mac) envia.
          </p>
        </div>
      </div>
    </div>
  )
}
