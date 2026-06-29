'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import {
  getProLideresMemberNoelLabQuestion,
  PRO_LIDERES_MEMBER_NOEL_LAB_QUESTIONS,
  PRO_LIDERES_MEMBER_NOEL_LAB_TOTAL,
} from '@/lib/pro-lideres-member-noel-lab-battery'
import { polishProLideresMemberNoelForDisplay } from '@/lib/pro-lideres-member-noel-response'
import { ProLideresMemberNoelMessageBody } from '@/components/pro-lideres/ProLideresMemberNoelMessageBody'

export type ProLideresMemberNoelLabTurn = {
  id: string
  role: 'user' | 'assistant'
  text: string
}

function turnId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export default function ProLideresMemberNoelLabPanel({
  showQuestionList = true,
  showManualInput = true,
}: {
  showQuestionList?: boolean
  showManualInput?: boolean
}) {
  const authenticatedFetch = useAuthenticatedFetch()
  const [step, setStep] = useState(0)
  const [turns, setTurns] = useState<ProLideresMemberNoelLabTurn[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [turns, loading])

  const toHistory = useCallback((list: ProLideresMemberNoelLabTurn[]) => {
    return list.map((t) => ({ role: t.role, content: t.text }))
  }, [])

  const callNoel = useCallback(
    async (message: string, history: ProLideresMemberNoelLabTurn[]) => {
      const res = await authenticatedFetch('/api/pro-lideres/membro/noel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          conversationHistory: toHistory(history),
          locale: 'pt',
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        response?: string
        error?: string
      }
      if (!res.ok) throw new Error(data.error || `Erro ${res.status}`)
      const raw = (data.response || '').trim() || '(sem texto)'
      return { text: polishProLideresMemberNoelForDisplay(raw, message) || raw }
    },
    [authenticatedFetch, toHistory]
  )

  const appendExchange = useCallback((question: string, answer: string) => {
    setTurns((prev) => [
      ...prev,
      { id: turnId(), role: 'user', text: question },
      { id: turnId(), role: 'assistant', text: answer },
    ])
  }, [])

  const reset = useCallback(() => {
    setTurns([])
    setStep(0)
    setError(null)
  }, [])

  const runQuestion = useCallback(
    async (index: number, history: ProLideresMemberNoelLabTurn[]) => {
      const q = getProLideresMemberNoelLabQuestion(index)
      if (!q) return history
      const { text } = await callNoel(q.text, history)
      const next: ProLideresMemberNoelLabTurn[] = [
        ...history,
        { id: turnId(), role: 'user', text: q.text },
        { id: turnId(), role: 'assistant', text },
      ]
      setTurns(next)
      setStep(index + 1)
      return next
    },
    [callNoel]
  )

  const runNext = useCallback(async () => {
    if (step >= PRO_LIDERES_MEMBER_NOEL_LAB_TOTAL) {
      setError('Fim da bateria. Limpe a sessão ou repita do início.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await runQuestion(step, turns)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [runQuestion, step, turns])

  const sendManual = useCallback(async () => {
    const msg = draft.trim()
    if (!msg) return
    setDraft('')
    setError(null)
    setLoading(true)
    try {
      const { text } = await callNoel(msg, turns)
      appendExchange(msg, text)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }, [appendExchange, callNoel, draft, turns])

  const atEnd = step >= PRO_LIDERES_MEMBER_NOEL_LAB_TOTAL
  const currentQ = getProLideresMemberNoelLabQuestion(step)

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Mesma API do chat (
        <code className="rounded bg-gray-100 px-1 text-xs">/api/pro-lideres/membro/noel</code>) envia as{' '}
        {PRO_LIDERES_MEMBER_NOEL_LAB_TOTAL} perguntas oficiais, uma por vez, e mostra cada resposta abaixo.
      </p>

      {showQuestionList ? (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-800">
            Bateria ({PRO_LIDERES_MEMBER_NOEL_LAB_TOTAL} perguntas)
          </h2>
          <ol className="mt-3 max-h-40 list-decimal space-y-1 overflow-y-auto pl-5 text-xs text-gray-700">
            {PRO_LIDERES_MEMBER_NOEL_LAB_QUESTIONS.map((q, i) => (
              <li key={q.id}>
                <span className="font-medium text-gray-900">{q.label}</span>
                {i === step && !atEnd ? (
                  <span className="ml-1 rounded bg-amber-100 px-1 text-amber-900">← próxima</span>
                ) : null}
              </li>
            ))}
          </ol>
          {currentQ && !atEnd ? (
            <p className="mt-2 text-xs text-gray-500">
              <strong>Validar:</strong> {currentQ.expectHint}
            </p>
          ) : null}
        </div>
      ) : null}

      <div className="rounded-xl border-2 border-amber-400 bg-gradient-to-b from-amber-50 to-white p-4">
        <button
          type="button"
          disabled={loading || atEnd}
          onClick={() => void runNext()}
          className="w-full rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white hover:bg-amber-700 disabled:opacity-50"
        >
          {loading
            ? 'Noel a responder…'
            : `Próxima pergunta (${Math.min(step + 1, PRO_LIDERES_MEMBER_NOEL_LAB_TOTAL)} / ${PRO_LIDERES_MEMBER_NOEL_LAB_TOTAL})`}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setStep(0)
            setError(null)
          }}
          className="mt-2 w-full rounded-lg border border-amber-400 py-2 text-xs font-semibold text-amber-950 hover:bg-amber-100 disabled:opacity-50"
        >
          Repetir do início (mantém transcrição; use Limpar para zerar)
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={reset}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Limpar sessão
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div>
      ) : null}

      <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50/80 p-4 max-h-[min(55vh,520px)] overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-800 sticky top-0 bg-gray-50/95 py-1">Transcrição</h2>
        {turns.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma pergunta ainda. Toque em «Próxima pergunta».</p>
        ) : (
          <div className="space-y-4">
            {turns.map((t) => (
              <div
                key={t.id}
                className={
                  t.role === 'user'
                    ? 'ml-6 rounded-lg border border-gray-200 bg-white p-3 text-sm'
                    : 'mr-2 rounded-lg border border-sky-200 bg-sky-50/90 p-3 text-sm'
                }
              >
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-gray-500">
                  {t.role === 'user' ? 'Pergunta' : 'Noel'}
                </p>
                {t.role === 'assistant' ? (
                  <ProLideresMemberNoelMessageBody markdown={t.text} />
                ) : (
                  <p className="text-sm whitespace-pre-wrap text-gray-900">{t.text}</p>
                )}
              </div>
            ))}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {showManualInput ? (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700">Pergunta livre</label>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              value={draft}
              disabled={loading}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  void sendManual()
                }
              }}
              placeholder="Uma pergunta extra…"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
            />
            <button
              type="button"
              disabled={loading || !draft.trim()}
              onClick={() => void sendManual()}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              Enviar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
