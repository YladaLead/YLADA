'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'
import {
  emptyCorporalOnboardingFormValues,
  ProEsteticaCorporalOnboardingForm,
  type CorporalOnboardingFormValues,
} from '@/components/pro-estetica-corporal/ProEsteticaCorporalOnboardingForm'

type ValidateData = {
  ok: true
  professionalName: string
  invitedEmail: string
  expiresAt: string
}

export default function ProEsteticaCorporalOnboardingPage() {
  const params = useParams()
  const token = typeof params.token === 'string' ? params.token : ''

  const [loading, setLoading] = useState(true)
  const [validData, setValidData] = useState<ValidateData | null>(null)
  const [invalidMessage, setInvalidMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<CorporalOnboardingFormValues>(() => emptyCorporalOnboardingFormValues())

  const onFormChange = useCallback((field: keyof CorporalOnboardingFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const validate = useCallback(async () => {
    if (!token) {
      setInvalidMessage('Link inválido.')
      setLoading(false)
      return
    }
    setLoading(true)
    const res = await fetch(
      `/api/pro-estetica-corporal/leader-onboarding/validate?token=${encodeURIComponent(token)}`
    )
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !(data as { ok?: boolean }).ok) {
      const reason = (data as { reason?: string }).reason
      const msg =
        reason === 'expired'
          ? 'Este link expirou.'
          : reason === 'completed'
            ? 'Este diagnóstico inicial já foi concluído.'
            : reason === 'cancelled'
              ? 'Este link foi cancelado.'
              : 'Link indisponível.'
      setInvalidMessage(msg)
      setValidData(null)
      setLoading(false)
      return
    }
    const payload = data as ValidateData
    setValidData(payload)
    setForm((prev) => ({ ...prev, displayName: payload.professionalName ?? '' }))
    setLoading(false)
  }, [token])

  useEffect(() => {
    void validate()
  }, [validate])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const res = await fetch('/api/pro-estetica-corporal/leader-onboarding/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        display_name: form.displayName,
        team_name: form.teamName,
        city_region: form.cityRegion,
        market_context: form.marketContext,
        service_to_grow: form.serviceToGrow,
        main_lead_channel: form.mainLeadChannel,
        whatsapp: form.whatsapp,
        years_in_aesthetics: form.yearsInAesthetics,
        primary_goal: form.primaryGoal,
        main_challenge: form.mainChallenge,
        focus_notes: form.focusNotes,
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError((data as { error?: string }).error || 'Erro ao enviar respostas.')
      setSaving(false)
      return
    }
    setSaved(true)
    setSaving(false)
  }

  return (
    <div className="flex min-h-[100dvh] min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-5 flex justify-center">
          <Image
            src={YLADA_OG_FALLBACK_LOGO_PATH}
            alt="YLADA"
            width={190}
            height={54}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-600">A carregar...</p>
        ) : invalidMessage ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-center text-sm text-red-700">{invalidMessage}</p>
        ) : saved ? (
          <div className="space-y-3 text-center">
            <h1 className="text-xl font-bold text-gray-900">Recebido — obrigada</h1>
            <p className="text-sm text-gray-600">
              O teu micro-diagnóstico inicial já está connosco. Quando entrares no YLADA Pro — Estética corporal com este
              e-mail,
              aplicamos estes dados ao teu espaço e o Noel pode usar este contexto desde o primeiro contacto.
            </p>
          </div>
        ) : validData ? (
          <div className="space-y-4">
            <div className="space-y-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">Estética corporal</p>
              <h1 className="text-xl font-bold text-gray-900">Micro-diagnóstico inicial</h1>
              <p className="text-sm text-gray-600">
                Em poucos minutos clarificamos o teu contexto — não é um formulário anónimo: é a{' '}
                <strong className="font-semibold text-gray-800">entrada para o mentor inteligente</strong> (Noel) e para o
                teu painel. Respostas honestas geram sugestões mais certeiras.
              </p>
            </div>
            <p className="text-center text-sm text-gray-600">
              E-mail: <strong>{validData.invitedEmail}</strong>
            </p>
            <p className="text-center text-xs text-gray-500">
              Este link vale até{' '}
              {new Date(validData.expiresAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
            </p>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <ProEsteticaCorporalOnboardingForm values={form} onChange={onFormChange} onSubmit={onSubmit} saving={saving} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
