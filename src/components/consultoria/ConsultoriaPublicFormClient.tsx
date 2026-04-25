'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ConsultoriaFormField } from '@/lib/pro-lideres-consultoria'
import { isConsultoriaFieldVisibleForAnswers } from '@/lib/pro-lideres-consultoria'
import { flagEmojiForEsteticaWhatsappDdiOption } from '@/lib/estetica-consultoria-form-templates'

type Area = 'pro_lideres' | 'estetica'

const MSGS: Record<
  Area,
  {
    loading: string
    thanksTitle: string
    thanksBody: string
    nameLabel: string
    emailLabel: string
    submit: string
    submitting: string
    back: string
    next: string
    stepOf: (a: number, b: number) => string
  }
> = {
  pro_lideres: {
    loading: 'A carregar…',
    thanksTitle: 'Obrigado.',
    thanksBody: 'A tua resposta foi registada.',
    nameLabel: 'O teu nome (opcional)',
    emailLabel: 'E-mail (opcional)',
    submit: 'Enviar respostas',
    submitting: 'A enviar…',
    back: 'Voltar',
    next: 'Continuar',
    stepOf: (a, b) => `Passo ${a} de ${b}`,
  },
  estetica: {
    loading: 'Carregando…',
    thanksTitle: 'Obrigada!',
    thanksBody: 'Recebemos suas respostas.',
    nameLabel: 'Nome (opcional)',
    emailLabel: 'E-mail (opcional)',
    submit: 'Enviar',
    submitting: 'Enviando…',
    back: 'Voltar',
    next: 'Continuar',
    stepOf: (a, b) => `${a}/${b}`,
  },
}

const FIELDS_PER_STEP = 5
const WIZARD_MIN_FIELDS = 5

function chunkFields<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function apiUrls(area: Area, token: string) {
  const enc = encodeURIComponent(token)
  if (area === 'pro_lideres') {
    return {
      load: `/api/pro-lideres/consultoria/forms/by-token/${enc}`,
      submit: `/api/pro-lideres/consultoria/forms/by-token/${enc}/submit`,
    }
  }
  return {
    load: `/api/estetica-consultoria/forms/by-token/${enc}`,
    submit: `/api/estetica-consultoria/forms/by-token/${enc}/submit`,
  }
}

function CheckboxGroupField({
  f,
  answers,
  setAnswers,
}: {
  f: ConsultoriaFormField
  answers: Record<string, string>
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) {
  const opts = f.options ?? []
  const selected = new Set(
    (answers[f.id] ?? '')
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean)
  )
  return (
    <fieldset className="block">
      <div className="mt-2 space-y-1 rounded-xl border border-gray-200 bg-white p-3">
        {opts.map((opt) => (
          <label key={opt} className="flex min-h-[44px] cursor-pointer items-start gap-3 touch-manipulation py-2 sm:min-h-0 sm:py-1.5">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={selected.has(opt)}
              onChange={() => {
                const next = new Set(selected)
                if (next.has(opt)) next.delete(opt)
                else next.add(opt)
                setAnswers((prev) => ({ ...prev, [f.id]: Array.from(next).join('\n') }))
              }}
            />
            <span className="text-base leading-snug text-gray-900">{opt}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function validateFieldsChunk(fields: ConsultoriaFormField[], answers: Record<string, string>): string | null {
  for (const f of fields) {
    if (!isConsultoriaFieldVisibleForAnswers(f, answers)) {
      continue
    }
    const s = (answers[f.id] ?? '').trim()
    if (f.required && !s) {
      return `O campo «${f.label}» é obrigatório.`
    }
    if (f.type === 'select' && f.options?.length) {
      if (s && !f.options.includes(s)) {
        return `Valor inválido em «${f.label}».`
      }
    }
    if (f.type === 'checkbox_group' && f.options?.length) {
      const lines = s
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean)
      if (f.required && lines.length === 0) {
        return `Marque pelo menos uma opção em «${f.label}».`
      }
      for (const line of lines) {
        if (!f.options.includes(line)) {
          return `Opção inválida em «${f.label}».`
        }
      }
    }
  }
  return null
}

const FIELD_TOUCH_BASE =
  'w-full min-h-[44px] touch-manipulation rounded-xl border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

function FieldEditor({
  f,
  answers,
  setAnswers,
}: {
  f: ConsultoriaFormField
  answers: Record<string, string>
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) {
  const inputClass = `mt-2 ${FIELD_TOUCH_BASE}`
  const ddiSelect = f.id === 'whatsapp_ddi' && f.type === 'select'
  const storedDdi = (answers[f.id] ?? '').trim()

  if (!isConsultoriaFieldVisibleForAnswers(f, answers)) {
    return null
  }

  return (
    <label className="block text-sm">
      <span className="font-medium text-gray-900">
        {f.label}
        {f.required ? <span className="text-red-600"> *</span> : null}
      </span>
      {f.type === 'textarea' ? (
        <textarea
          required={f.required}
          className={`${inputClass} !min-h-[11rem] max-h-[55vh] resize-y sm:!min-h-[120px]`}
          value={answers[f.id] ?? ''}
          onChange={(e) => setAnswers((prev) => ({ ...prev, [f.id]: e.target.value }))}
          rows={4}
        />
      ) : f.type === 'select' ? (
        ddiSelect ? (
          <div className="relative mt-2">
            <select
              required={f.required}
              className={`${FIELD_TOUCH_BASE} appearance-none pl-11 pr-9`}
              value={answers[f.id] ?? ''}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [f.id]: e.target.value }))}
              title="DDI do país"
            >
              <option value="">Escolher…</option>
              {(f.options ?? []).map((o) => {
                const tail = o.includes(' — ') ? o.split(' — ').slice(1).join(' — ') : o
                return (
                  <option key={o} value={o}>
                    {flagEmojiForEsteticaWhatsappDdiOption(o)} {tail}
                  </option>
                )
              })}
            </select>
            <span
              className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-xl leading-none"
              aria-hidden
            >
              {storedDdi ? flagEmojiForEsteticaWhatsappDdiOption(storedDdi) : '🌍'}
            </span>
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              aria-hidden
            >
              ▼
            </span>
          </div>
        ) : (
          <select
            required={f.required}
            className={inputClass}
            value={answers[f.id] ?? ''}
            onChange={(e) => setAnswers((prev) => ({ ...prev, [f.id]: e.target.value }))}
          >
            <option value="">Escolher…</option>
            {(f.options ?? []).map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        )
      ) : f.type === 'checkbox_group' ? (
        <CheckboxGroupField f={f} answers={answers} setAnswers={setAnswers} />
      ) : (
        <input
          required={f.required}
          className={inputClass}
          value={answers[f.id] ?? ''}
          onChange={(e) => setAnswers((prev) => ({ ...prev, [f.id]: e.target.value }))}
          inputMode="text"
          autoComplete="on"
        />
      )}
    </label>
  )
}

export default function ConsultoriaPublicFormClient({
  token,
  area,
  initialConfirmCode = null,
}: {
  token: string
  area: Area
  initialConfirmCode?: string | null
}) {
  const m = MSGS[area]
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
  const [wizardStep, setWizardStep] = useState(0)
  const [needsEmailGate, setNeedsEmailGate] = useState(false)
  const [recipientMasked, setRecipientMasked] = useState('')
  const [sendBusy, setSendBusy] = useState(false)
  const [sendHint, setSendHint] = useState<string | null>(null)

  const { load: loadUrl, submit: submitUrl } = apiUrls(area, token)

  const useWizard = area === 'estetica' && fields.length >= WIZARD_MIN_FIELDS
  const fieldChunks = useMemo(() => chunkFields(fields, FIELDS_PER_STEP), [fields])
  /** Estética: só blocos de perguntas (sem etapa inicial só de nome/e-mail). */
  const totalWizardSteps = fieldChunks.length

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setWizardStep(0)
    setSendHint(null)
    const confirmQ =
      area === 'estetica' && initialConfirmCode?.trim()
        ? `?confirm=${encodeURIComponent(initialConfirmCode.trim())}`
        : ''
    const res = await fetch(`${loadUrl}${confirmQ}`)
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError((data as { error?: string }).error || 'Não foi possível abrir o formulário.')
      setNeedsEmailGate(false)
      setLoading(false)
      return
    }
    setTitle(String((data as { title?: string }).title ?? ''))
    setDescription((data as { description?: string | null }).description ?? null)

    if ((data as { needsEmailConfirmation?: boolean }).needsEmailConfirmation) {
      setNeedsEmailGate(true)
      setRecipientMasked(String((data as { recipientMasked?: string }).recipientMasked ?? ''))
      setFields([])
      setAnswers({})
      setName('')
      setEmail('')
      setLoading(false)
      return
    }

    setNeedsEmailGate(false)

    if (
      area === 'estetica' &&
      initialConfirmCode?.trim() &&
      typeof window !== 'undefined' &&
      window.location.search.includes('confirm=')
    ) {
      const u = new URL(window.location.href)
      u.searchParams.delete('confirm')
      window.history.replaceState({}, '', `${u.pathname}${u.search}`)
    }

    setFields(((data as { fields?: ConsultoriaFormField[] }).fields ?? []) as ConsultoriaFormField[])
    const prefill = (data as {
      prefill?: { initialAnswers?: Record<string, string>; respondentName?: string; respondentEmail?: string }
    }).prefill
    if (prefill?.initialAnswers && typeof prefill.initialAnswers === 'object') {
      setAnswers({ ...prefill.initialAnswers })
    } else {
      setAnswers({})
    }
    if (prefill?.respondentName != null && String(prefill.respondentName).trim()) {
      setName(String(prefill.respondentName).trim())
    } else {
      setName('')
    }
    if (prefill?.respondentEmail != null && String(prefill.respondentEmail).trim()) {
      setEmail(String(prefill.respondentEmail).trim())
    } else {
      setEmail('')
    }
    setLoading(false)
  }, [loadUrl, area, initialConfirmCode])

  const sendConfirmationEmail = useCallback(async () => {
    if (area !== 'estetica') return
    setSendBusy(true)
    setError(null)
    const enc = encodeURIComponent(token)
    const res = await fetch(`/api/estetica-consultoria/forms/by-token/${enc}/send-confirmation`, {
      method: 'POST',
    })
    const data = await res.json().catch(() => ({}))
    setSendBusy(false)
    if (!res.ok) {
      setError((data as { error?: string }).error || 'Não foi possível enviar o e-mail.')
      return
    }
    if ((data as { alreadyConfirmed?: boolean }).alreadyConfirmed) {
      void load()
      return
    }
    setSendHint('E-mail enviado. Verifique a caixa de entrada e o spam.')
  }, [area, token, load])

  useEffect(() => {
    void load()
  }, [load])

  const submitPayload = async () => {
    setSaving(true)
    setError(null)
    const payload: Record<string, unknown> = {}
    for (const f of fields) {
      payload[f.id] = answers[f.id] ?? ''
    }
    const res = await fetch(submitUrl, {
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

  const onSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (useWizard) return
    const err = validateFieldsChunk(fields, answers)
    if (err) {
      setError(err)
      return
    }
    await submitPayload()
  }

  const goNextWizard = () => {
    setError(null)
    const chunk = fieldChunks[wizardStep]
    if (!chunk) return
    const err = validateFieldsChunk(chunk, answers)
    if (err) {
      setError(err)
      return
    }
    if (wizardStep >= totalWizardSteps - 1) {
      const fullErr = validateFieldsChunk(fields, answers)
      if (fullErr) {
        setError(fullErr)
        return
      }
      void submitPayload()
      return
    }
    setWizardStep((s) => s + 1)
  }

  const goBackWizard = () => {
    setError(null)
    setWizardStep((s) => Math.max(0, s - 1))
  }

  if (loading) {
    return (
      <p
        className={`text-center text-base py-12 ${area === 'estetica' ? 'text-blue-900/55' : 'text-gray-600'}`}
      >
        {m.loading}
      </p>
    )
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
      <div
        className={
          area === 'estetica'
            ? 'rounded-xl border border-blue-100 bg-blue-50/80 px-4 py-6 text-center text-blue-950'
            : 'rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-6 text-center text-emerald-900'
        }
      >
        <p className="font-semibold text-lg">{m.thanksTitle}</p>
        <p className="mt-2 text-sm">{m.thanksBody}</p>
        <p className={`mt-3 text-xs ${area === 'estetica' ? 'text-blue-800/90' : 'text-emerald-800'}`}>
          {area === 'estetica' ? 'Pode fechar esta página.' : 'Podes fechar esta página ou voltar ao WhatsApp.'}
        </p>
      </div>
    )
  }

  if (needsEmailGate && area === 'estetica') {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <h1 className="text-xl font-bold leading-snug text-blue-950 sm:text-2xl">{title}</h1>
        </div>
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{error}</div>
        ) : null}
        <div className="rounded-xl border border-blue-100 bg-blue-50/90 p-5 text-center space-y-4">
          <p className="text-sm font-semibold text-blue-950">Confirme o e-mail para continuar</p>
          <p className="text-sm text-gray-800">
            O diagnóstico só abre depois da confirmação. O convite vai para{' '}
            <span className="font-semibold text-gray-900">{recipientMasked || 'o e-mail da clínica'}</span>.
          </p>
          <button
            type="button"
            disabled={sendBusy}
            onClick={() => void sendConfirmationEmail()}
            className="min-h-[44px] w-full touch-manipulation rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 sm:w-auto sm:min-w-[240px]"
          >
            {sendBusy ? 'A enviar…' : 'Enviar e-mail de confirmação'}
          </button>
          {sendHint ? <p className="text-xs text-gray-700">{sendHint}</p> : null}
          <p className="text-xs text-gray-600">
            No e-mail, toque em <strong>Confirmar e abrir o formulário</strong>. Depois preencha com calma — pode
            voltar a este mesmo link do WhatsApp.
          </p>
        </div>
      </div>
    )
  }

  const contactGrid = (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="block text-sm sm:col-span-1">
        <span className="font-medium text-gray-800">{m.nameLabel}</span>
        <input
          className="mt-2 min-h-[44px] w-full touch-manipulation rounded-xl border border-gray-300 bg-white px-3 py-3 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </label>
      <label className="block text-sm sm:col-span-1">
        <span className="font-medium text-gray-800">{m.emailLabel}</span>
        <input
          type="email"
          className="mt-2 min-h-[44px] w-full touch-manipulation rounded-xl border border-gray-300 bg-white px-3 py-3 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>
    </div>
  )

  const progressPct = useWizard ? ((wizardStep + 1) / totalWizardSteps) * 100 : 100

  return (
    <form onSubmit={(e) => void onSubmitForm(e)} className="space-y-6 pb-8">
      <div>
        <h1
          className={`text-xl font-bold leading-snug sm:text-2xl ${
            area === 'estetica' ? 'text-blue-950' : 'text-gray-900'
          }`}
        >
          {title}
        </h1>
        {area !== 'estetica' && description ? (
          <p className="mt-2 text-sm leading-snug text-gray-600 whitespace-pre-wrap">{description}</p>
        ) : null}
      </div>

      {useWizard ? (
        <div className="space-y-1">
          <div
            className={`flex justify-between text-xs font-medium ${
              area === 'estetica' ? 'text-blue-900/60' : 'text-gray-600'
            }`}
          >
            <span>{m.stepOf(wizardStep + 1, totalWizardSteps)}</span>
            <span>{Math.round(progressPct)}%</span>
          </div>
          <div
            className={`h-2 w-full overflow-hidden rounded-full ${
              area === 'estetica' ? 'bg-blue-100' : 'bg-gray-200'
            }`}
          >
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-300 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      ) : null}

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">{error}</div> : null}

      {!useWizard ? (
        <>
          {contactGrid}
          <div className="space-y-5">
            {fields.map((f) => (
              <FieldEditor key={f.id} f={f} answers={answers} setAnswers={setAnswers} />
            ))}
          </div>
          <button
            type="submit"
            disabled={saving || fields.length === 0}
            className={`min-h-[44px] w-full touch-manipulation rounded-xl px-4 py-3 text-base font-semibold text-white shadow-sm active:opacity-90 disabled:opacity-50 ${
              area === 'estetica'
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-700 hover:bg-blue-800'
            }`}
          >
            {saving ? m.submitting : m.submit}
          </button>
        </>
      ) : (
        <div className="space-y-5">
          {(fieldChunks[wizardStep] ?? []).map((f) => (
            <FieldEditor key={f.id} f={f} answers={answers} setAnswers={setAnswers} />
          ))}
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-between">
            {wizardStep > 0 ? (
              <button
                type="button"
                onClick={() => goBackWizard()}
                className={`min-h-[44px] w-full touch-manipulation rounded-xl border bg-white px-4 py-3 text-base font-semibold shadow-sm sm:w-auto sm:min-w-[120px] ${
                  area === 'estetica'
                    ? 'border-blue-200/90 text-blue-950 hover:bg-blue-50/80'
                    : 'border-gray-300 text-gray-800 hover:bg-gray-50'
                }`}
              >
                {m.back}
              </button>
            ) : (
              <span className="hidden sm:block sm:min-w-[120px]" aria-hidden />
            )}
            <button
              type="button"
              disabled={saving}
              onClick={() => void goNextWizard()}
              className="min-h-[44px] w-full touch-manipulation rounded-xl bg-blue-600 px-4 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 sm:w-auto sm:min-w-[200px]"
            >
              {saving
                ? m.submitting
                : wizardStep >= totalWizardSteps - 1
                  ? m.submit
                  : m.next}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
