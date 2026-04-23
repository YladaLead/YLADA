'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ConsultoriaFormField } from '@/lib/pro-lideres-consultoria'

export default function ProLideresConsultoriaFormResponderClient({ token }: { token: string }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState<string | null>(null)
  const [fields, setFields] = useState<ConsultoriaFormField[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const res = await fetch(`/api/pro-lideres/consultoria/forms/by-token/${encodeURIComponent(token)}`)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError((data as { error?: string }).error || 'Não foi possível abrir o formulário.')
      setLoading(false)
      return
    }
    setTitle(String((data as { title?: string }).title ?? ''))
    setDescription((data as { description?: string | null }).description ?? null)
    setFields(((data as { fields?: ConsultoriaFormField[] }).fields ?? []) as ConsultoriaFormField[])
    setLoading(false)
  }, [token])

  useEffect(() => {
    void load()
  }, [load])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload: Record<string, unknown> = {}
    for (const f of fields) {
      payload[f.id] = answers[f.id] ?? ''
    }
    const res = await fetch(`/api/pro-lideres/consultoria/forms/by-token/${encodeURIComponent(token)}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: payload,
        respondent_name: name.trim() || null,
        respondent_email: email.trim() || null,
      }),
    })
    const data = await res.json().catch(() => ({}))
    setSaving(false)
    if (!res.ok) {
      setError((data as { error?: string }).error || 'Erro ao enviar.')
      return
    }
    setDone(true)
  }

  if (loading) {
    return <p className="text-center text-sm text-gray-600 py-12">A carregar…</p>
  }
  if (error && !title) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 text-center">
        {error}
      </div>
    )
  }
  if (done) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-6 text-center text-emerald-900">
        <p className="font-semibold">Obrigado.</p>
        <p className="mt-1 text-sm">A tua resposta foi registada.</p>
      </div>
    )
  }

  return (
    <form onSubmit={(e) => void submit(e)} className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {description ? <p className="mt-2 text-sm text-gray-600 whitespace-pre-wrap">{description}</p> : null}
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{error}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm sm:col-span-1">
          <span className="text-gray-600">O teu nome (opcional)</span>
          <input
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="block text-sm sm:col-span-1">
          <span className="text-gray-600">E-mail (opcional)</span>
          <input
            type="email"
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>

      <div className="space-y-4">
        {fields.map((f) => (
          <label key={f.id} className="block text-sm">
            <span className="text-gray-800">
              {f.label}
              {f.required ? <span className="text-red-600"> *</span> : null}
            </span>
            {f.type === 'textarea' ? (
              <textarea
                required={f.required}
                className="mt-1 w-full min-h-[100px] rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={answers[f.id] ?? ''}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [f.id]: e.target.value }))}
              />
            ) : f.type === 'select' ? (
              <select
                required={f.required}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={answers[f.id] ?? ''}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [f.id]: e.target.value }))}
              >
                <option value="">—</option>
                {(f.options ?? []).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                required={f.required}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                value={answers[f.id] ?? ''}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [f.id]: e.target.value }))}
              />
            )}
          </label>
        ))}
      </div>

      <button
        type="submit"
        disabled={saving || fields.length === 0}
        className="w-full rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-50"
      >
        {saving ? 'A enviar…' : 'Enviar respostas'}
      </button>
    </form>
  )
}
