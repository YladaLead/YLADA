'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { TrilhaStep } from '@/types/trilha'

interface TrilhaStepViewProps {
  stepId: string
  /** Base path para "Voltar" (ex.: /pt/med/trilha) */
  basePath: string
}

const REFLECTION_QUESTIONS = {
  answer_perceived: 'O que você percebeu?',
  answer_stuck: 'O que está travando?',
  answer_next: 'Qual seu próximo passo?',
  situation_text: 'Escreva em 5 linhas sua situação atual'
}

export default function TrilhaStepView({ stepId, basePath }: TrilhaStepViewProps) {
  const [step, setStep] = useState<TrilhaStep | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [reflection, setReflection] = useState({
    answer_perceived: '',
    answer_stuck: '',
    answer_next: '',
    situation_text: ''
  })
  const [status, setStatus] = useState<string>('')
  const [confidence, setConfidence] = useState<number | ''>('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/trilha/steps/${stepId}`, { credentials: 'include' })
        const data = await res.json()
        if (data.success && data.data?.step) {
          const s = data.data.step
          setStep(s)
        } else {
          setError(data.error || 'Step não encontrado')
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro ao carregar')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [stepId])

  useEffect(() => {
    const loadReflections = async () => {
      const res = await fetch('/api/trilha/me/reflections', { credentials: 'include' })
      const data = await res.json()
      if (data.success && data.data?.reflections) {
        const r = data.data.reflections.find((x: { step_id: string }) => x.step_id === stepId)
        if (r) {
          setReflection({
            answer_perceived: r.answer_perceived || '',
            answer_stuck: r.answer_stuck || '',
            answer_next: r.answer_next || '',
            situation_text: r.situation_text || ''
          })
        }
      }
    }
    const loadProgress = async () => {
      const res = await fetch('/api/trilha/me/progress', { credentials: 'include' })
      const data = await res.json()
      if (data.success && data.data?.progress) {
        const p = data.data.progress.find((x: { step_id: string }) => x.step_id === stepId)
        if (p) {
          setStatus(p.status)
          setConfidence(p.confidence ?? '')
        }
      }
    }
    if (stepId) {
      loadReflections()
      loadProgress()
    }
  }, [stepId])

  const handleSave = async () => {
    if (!stepId) return
    setSaving(true)
    setSaved(false)
    try {
      await fetch('/api/trilha/me/reflections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          step_id: stepId,
          ...reflection
        })
      })
      if (status) {
        await fetch('/api/trilha/me/progress', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            step_id: stepId,
            status: status || undefined,
            confidence: confidence === '' ? undefined : Number(confidence)
          })
        })
      }
      setSaved(true)
    } catch {
      setError('Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
        <p className="mt-4 text-gray-600">Carregando etapa...</p>
      </div>
    )
  }

  if (error || !step) {
    return (
      <div className="rounded-xl bg-red-50 border border-red-200 p-6 text-center">
        <p className="text-red-800">{error || 'Etapa não encontrada'}</p>
        <Link href={basePath} className="mt-4 inline-block text-blue-600 hover:underline">
          ← Voltar à trilha
        </Link>
      </div>
    )
  }

  const checklist = Array.isArray(step.checklist_items) ? step.checklist_items : []

  return (
    <div className="max-w-2xl space-y-6">
      <Link href={basePath} className="text-sm text-blue-600 hover:underline">
        ← Voltar à trilha
      </Link>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-gray-500">{step.code}</p>
        <h1 className="text-xl font-bold text-gray-900 mt-1">{step.title}</h1>
        <h2 className="text-sm font-semibold text-gray-700 mt-4">Objetivo</h2>
        <p className="text-gray-700 mt-1">{step.objective}</p>
        <h2 className="text-sm font-semibold text-gray-700 mt-4">Orientação</h2>
        <p className="text-gray-700 mt-1">{step.guidance}</p>
        {step.motivational_phrase && (
          <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 italic">
            {step.motivational_phrase}
          </p>
        )}
        {checklist.length > 0 && (
          <>
            <h2 className="text-sm font-semibold text-gray-700 mt-4">Checklist</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-gray-700">
              {checklist.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900">Reflexão</h2>
        <p className="text-sm text-gray-600 mt-1">
          Suas respostas são usadas pelo Noel para personalizar seu acompanhamento.
        </p>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">{REFLECTION_QUESTIONS.answer_perceived}</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              rows={2}
              value={reflection.answer_perceived}
              onChange={(e) => setReflection((r) => ({ ...r, answer_perceived: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{REFLECTION_QUESTIONS.answer_stuck}</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              rows={2}
              value={reflection.answer_stuck}
              onChange={(e) => setReflection((r) => ({ ...r, answer_stuck: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{REFLECTION_QUESTIONS.answer_next}</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              rows={2}
              value={reflection.answer_next}
              onChange={(e) => setReflection((r) => ({ ...r, answer_next: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">{REFLECTION_QUESTIONS.situation_text}</label>
            <textarea
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              rows={4}
              value={reflection.situation_text}
              onChange={(e) => setReflection((r) => ({ ...r, situation_text: e.target.value }))}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">—</option>
              <option value="not_started">Não iniciado</option>
              <option value="in_progress">Em progresso</option>
              <option value="stuck">Travado</option>
              <option value="done">Concluído</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confiança (1–5)</label>
            <select
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              value={confidence}
              onChange={(e) => setConfidence(e.target.value === '' ? '' : Number(e.target.value))}
            >
              <option value="">—</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar reflexão e progresso'}
          </button>
          {saved && <span className="text-sm text-green-600">Salvo.</span>}
        </div>
      </div>
    </div>
  )
}
