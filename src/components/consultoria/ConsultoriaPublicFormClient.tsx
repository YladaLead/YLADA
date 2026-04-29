'use client'

import { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
import type { ConsultoriaFormField, ConsultoriaFormUIHints } from '@/lib/pro-lideres-consultoria'
import { isConsultoriaFieldVisibleForAnswers } from '@/lib/pro-lideres-consultoria'
import {
  DEFAULT_WHATSAPP_DDI,
  flagEmojiForEsteticaWhatsappDdiOption,
} from '@/lib/estetica-consultoria-form-templates'
import {
  consultoriaAnswersToWhatsappLine,
  consultoriaWhatsappLineHasMinDigits,
} from '@/lib/pro-lideres-pre-diagnostico-whatsapp'

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
    thanksBody: 'A sua resposta foi registada.',
    nameLabel: 'O seu nome (opcional)',
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

function whatsappDdiLocalPairAt(chunk: ConsultoriaFormField[], idx: number): boolean {
  return chunk[idx]?.id === 'whatsapp_ddi' && chunk[idx + 1]?.id === 'whatsapp'
}

function skipWhatsappLocalAfterDdi(chunk: ConsultoriaFormField[], idx: number): boolean {
  return chunk[idx]?.id === 'whatsapp' && idx > 0 && chunk[idx - 1]?.id === 'whatsapp_ddi'
}

/** DDI + número na mesma linha — estética consultoria e Pro Líderes (pré-diagnóstico). */
function WhatsappDdiLocalRow({
  ddiField,
  localField,
  answers,
  setAnswers,
  variant = 'estetica',
}: {
  ddiField: ConsultoriaFormField
  localField: ConsultoriaFormField
  answers: Record<string, string>
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>
  variant?: 'estetica' | 'pro_lideres'
}) {
  const opts = ddiField.options ?? []
  const stored = (answers.whatsapp_ddi ?? '').trim()
  const ddiValue = stored && opts.includes(stored) ? stored : DEFAULT_WHATSAPP_DDI
  const flag = flagEmojiForEsteticaWhatsappDdiOption(ddiValue)
  const bothRequired = Boolean(ddiField.required && localField.required)

  const help =
    variant === 'pro_lideres'
      ? 'Escolha o país (DDI) à esquerda e digite só o número com DDD à direita — não repita o código do país no número.'
      : 'Para pré-diagnóstico e diagnóstico, estética corporal ou terapia capilar. País (DDI) e número com DDD na mesma linha — não repita o código do país no número.'

  return (
    <div className="block text-sm">
      <span className="font-medium text-gray-900">WhatsApp</span>
      {bothRequired ? <span className="text-red-600"> *</span> : null}
      <p className="mt-1 text-xs leading-snug text-gray-600">{help}</p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <div className="relative min-w-0 sm:w-[min(100%,220px)] sm:shrink-0">
          <span
            className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-xl leading-none"
            aria-hidden
          >
            {flag}
          </span>
          <select
            required={ddiField.required}
            className={`${FIELD_TOUCH_BASE} w-full appearance-none pl-11 pr-9`}
            value={ddiValue}
            onChange={(e) => setAnswers((prev) => ({ ...prev, whatsapp_ddi: e.target.value }))}
            aria-label={ddiField.label}
          >
            {opts.map((o) => {
              const tail = o.includes(' — ') ? o.split(' — ').slice(1).join(' — ') : o
              return (
                <option key={o} value={o}>
                  {tail}
                </option>
              )
            })}
          </select>
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400"
            aria-hidden
          >
            ▼
          </span>
        </div>
        <label className="min-w-0 flex-1">
          <span className="sr-only">{localField.label}</span>
          <input
            required={localField.required}
            className={`${FIELD_TOUCH_BASE} w-full`}
            value={answers.whatsapp ?? ''}
            onChange={(e) => setAnswers((prev) => ({ ...prev, whatsapp: e.target.value }))}
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="DDD + número (sem +55)"
            aria-label={localField.label}
          />
        </label>
      </div>
    </div>
  )
}

function renderConsultoriaFieldRow(
  chunk: ConsultoriaFormField[],
  idx: number,
  answers: Record<string, string>,
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>,
  area: Area
) {
  const f = chunk[idx]
  if (!f) return null
  if (!isConsultoriaFieldVisibleForAnswers(f, answers)) {
    return null
  }
  if (skipWhatsappLocalAfterDdi(chunk, idx)) {
    return null
  }
  if (whatsappDdiLocalPairAt(chunk, idx)) {
    const local = chunk[idx + 1]
    if (!local || !isConsultoriaFieldVisibleForAnswers(local, answers)) {
      return <FieldEditor key={f.id} f={f} answers={answers} setAnswers={setAnswers} />
    }
    return (
      <WhatsappDdiLocalRow
        key="whatsapp-ddi-local"
        ddiField={f}
        localField={local}
        answers={answers}
        setAnswers={setAnswers}
        variant={area === 'pro_lideres' ? 'pro_lideres' : 'estetica'}
      />
    )
  }
  return <FieldEditor key={f.id} f={f} answers={answers} setAnswers={setAnswers} />
}

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
  const [whatsapp, setWhatsapp] = useState('')
  const [uiHints, setUiHints] = useState<ConsultoriaFormUIHints | null>(null)
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
      setUiHints(null)
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
      setWhatsapp('')
      setUiHints(null)
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

    setUiHints(((data as { ui?: ConsultoriaFormUIHints | null }).ui ?? null) as ConsultoriaFormUIHints | null)
    const nextFields = ((data as { fields?: ConsultoriaFormField[] }).fields ?? []) as ConsultoriaFormField[]
    setFields(nextFields)
    const prefill = (data as {
      prefill?: { initialAnswers?: Record<string, string>; respondentName?: string; respondentEmail?: string }
    }).prefill
    if (prefill?.initialAnswers && typeof prefill.initialAnswers === 'object') {
      const merged = { ...(prefill.initialAnswers as Record<string, string>) }
      if (area === 'estetica' && !String(merged.whatsapp_ddi ?? '').trim()) {
        merged.whatsapp_ddi = DEFAULT_WHATSAPP_DDI
      }
      if (area === 'pro_lideres' && nextFields.some((x) => x.id === 'whatsapp_ddi') && !String(merged.whatsapp_ddi ?? '').trim()) {
        merged.whatsapp_ddi = DEFAULT_WHATSAPP_DDI
      }
      setAnswers(merged)
    } else {
      const init: Record<string, string> = {}
      if (area === 'estetica') init.whatsapp_ddi = DEFAULT_WHATSAPP_DDI
      if (area === 'pro_lideres' && nextFields.some((x) => x.id === 'whatsapp_ddi')) {
        init.whatsapp_ddi = DEFAULT_WHATSAPP_DDI
      }
      setAnswers(init)
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
    setWhatsapp('')
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
    if (area === 'pro_lideres' && uiHints?.contactBlockMode === 'required_name_email') {
      if (!name.trim()) {
        setSaving(false)
        setError('O nome completo é obrigatório.')
        return
      }
      const em = email.trim().toLowerCase()
      if (!em || !EMAIL_RE.test(em)) {
        setSaving(false)
        setError('Indique um e-mail válido.')
        return
      }
      const waLine = consultoriaAnswersToWhatsappLine(answers as unknown as Record<string, unknown>)
      if (!consultoriaWhatsappLineHasMinDigits(waLine)) {
        setSaving(false)
        setError('Preencha o WhatsApp: país (DDI) e número com DDD.')
        return
      }
    }
    if (area === 'pro_lideres' && uiHints?.contactBlockMode === 'required_with_whatsapp') {
      if (!name.trim()) {
        setSaving(false)
        setError('O nome completo é obrigatório.')
        return
      }
      const em = email.trim().toLowerCase()
      if (!em || !EMAIL_RE.test(em)) {
        setSaving(false)
        setError('Indique um e-mail válido.')
        return
      }
      const wa = whatsapp.trim()
      if (!wa || wa.replace(/\D/g, '').length < 8) {
        setSaving(false)
        setError('Indique um WhatsApp válido (com DDI ou DDD).')
        return
      }
    }
    const payload: Record<string, unknown> = {}
    for (const f of fields) {
      payload[f.id] = answers[f.id] ?? ''
    }
    const emailOut = email.trim().toLowerCase()
    const res = await fetch(submitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answers: payload,
        respondent_name: name.trim() || null,
        respondent_email: emailOut || null,
        respondent_whatsapp:
          area === 'pro_lideres' && uiHints?.contactBlockMode === 'required_with_whatsapp'
            ? whatsapp.trim() || null
            : null,
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
          {area === 'estetica' ? 'Pode fechar esta página.' : 'Pode fechar esta página ou voltar ao WhatsApp.'}
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

  const strictLegacyWhatsapp =
    area === 'pro_lideres' && uiHints?.contactBlockMode === 'required_with_whatsapp'
  const strictNameEmail = area === 'pro_lideres' && uiHints?.contactBlockMode === 'required_name_email'
  const strictProContact = strictLegacyWhatsapp || strictNameEmail
  const nameLabel = strictProContact && uiHints?.nameLabel ? uiHints.nameLabel : m.nameLabel
  const emailLabel = strictProContact && uiHints?.emailLabel ? uiHints.emailLabel : m.emailLabel
  const whatsappLabel = strictLegacyWhatsapp && uiHints?.whatsappLabel ? uiHints.whatsappLabel : 'WhatsApp'

  const contactGrid = strictLegacyWhatsapp ? (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="font-medium text-gray-800">
          {nameLabel}
          <span className="text-red-600"> *</span>
        </span>
        <input
          required
          className="mt-2 min-h-[44px] w-full touch-manipulation rounded-xl border border-gray-300 bg-white px-3 py-3 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-gray-800">
          {emailLabel}
          <span className="text-red-600"> *</span>
        </span>
        <input
          type="email"
          required
          className="mt-2 min-h-[44px] w-full touch-manipulation rounded-xl border border-gray-300 bg-white px-3 py-3 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-gray-800">
          {whatsappLabel}
          <span className="text-red-600"> *</span>
        </span>
        <input
          required
          inputMode="tel"
          autoComplete="tel"
          placeholder="+55 11 99999-9999"
          className="mt-2 min-h-[44px] w-full touch-manipulation rounded-xl border border-gray-300 bg-white px-3 py-3 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
      </label>
    </div>
  ) : strictNameEmail ? (
    <div className="space-y-4">
      <label className="block text-sm">
        <span className="font-medium text-gray-800">
          {nameLabel}
          <span className="text-red-600"> *</span>
        </span>
        <input
          required
          className="mt-2 min-h-[44px] w-full touch-manipulation rounded-xl border border-gray-300 bg-white px-3 py-3 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </label>
      <label className="block text-sm">
        <span className="font-medium text-gray-800">
          {emailLabel}
          <span className="text-red-600"> *</span>
        </span>
        <input
          type="email"
          required
          className="mt-2 min-h-[44px] w-full touch-manipulation rounded-xl border border-gray-300 bg-white px-3 py-3 text-base shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>
    </div>
  ) : (
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
            {fields.map((f, idx) => (
              <Fragment key={f.id}>{renderConsultoriaFieldRow(fields, idx, answers, setAnswers, area)}</Fragment>
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
          {(fieldChunks[wizardStep] ?? []).map((f, idx) => (
            <Fragment key={`${wizardStep}-${f.id}`}>
              {renderConsultoriaFieldRow(fieldChunks[wizardStep] ?? [], idx, answers, setAnswers, area)}
            </Fragment>
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
