'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'
import {
  emptyLeaderOnboardingFormValues,
  ProLideresLeaderOnboardingForm,
  type LeaderOnboardingFormValues,
} from '@/components/pro-lideres/ProLideresLeaderOnboardingForm'

type ValidateData = {
  ok: true
  leaderName: string
  invitedEmail: string
  segmentCode: string
  expiresAt: string
}

export default function ProLideresLeaderOnboardingPage() {
  const params = useParams()
  const token = typeof params.token === 'string' ? params.token : ''

  const [loading, setLoading] = useState(true)
  const [validData, setValidData] = useState<ValidateData | null>(null)
  const [invalidMessage, setInvalidMessage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<LeaderOnboardingFormValues>(() => emptyLeaderOnboardingFormValues())

  const onFormChange = useCallback((field: keyof LeaderOnboardingFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const validate = useCallback(async () => {
    if (!token) {
      setInvalidMessage('Link inválido.')
      setLoading(false)
      return
    }
    setLoading(true)
    const res = await fetch(`/api/pro-lideres/leader-onboarding/validate?token=${encodeURIComponent(token)}`)
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !(data as { ok?: boolean }).ok) {
      const reason = (data as { reason?: string }).reason
      const msg =
        reason === 'expired'
          ? 'Este link expirou.'
          : reason === 'completed'
            ? 'Este questionário já foi respondido.'
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
    setForm((prev) => ({ ...prev, displayName: payload.leaderName ?? '' }))
    setLoading(false)
  }, [token])

  useEffect(() => {
    void validate()
  }, [validate])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const res = await fetch('/api/pro-lideres/leader-onboarding/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        display_name: form.displayName,
        team_name: form.teamName,
        whatsapp: form.whatsapp,
        leader_age: form.leaderAge,
        herbalife_years: form.herbalifeYears,
        career_before_herbalife: form.careerBeforeHerbalife,
        team_total_people: form.teamTotalPeople,
        team_leaders_count: form.teamLeadersCount,
        team_distinct_lines: form.teamDistinctLines,
        team_activity_level: form.teamActivityLevel,
        follow_up_frequency: form.followupFrequency,
        tools_used: form.toolsUsedCsv.split(',').map((s) => s.trim()).filter(Boolean),
        primary_goal: form.primaryGoal,
        primary_goal_measure: form.primaryGoalMeasure,
        main_challenge_preset: form.mainChallengePreset,
        main_challenge_other: form.mainChallengeOther,
        team_bottleneck: form.teamBottleneck,
        team_bottleneck_other: form.teamBottleneckOther,
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
            <h1 className="text-xl font-bold text-gray-900">Recebido com sucesso</h1>
            <p className="text-sm text-gray-600">
              Obrigado! Já recebemos os dados do teu onboarding. Agora vamos preparar o teu ambiente Pro Líderes.
            </p>
          </div>
        ) : validData ? (
          <div className="space-y-4">
            <h1 className="text-center text-xl font-bold text-gray-900">Onboarding do líder</h1>
            <p className="text-center text-sm text-gray-600">
              E-mail vinculado: <strong>{validData.invitedEmail}</strong>
            </p>
            <p className="text-center text-xs text-gray-500">
              Prazo: {new Date(validData.expiresAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
            </p>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <ProLideresLeaderOnboardingForm values={form} onChange={onFormChange} onSubmit={onSubmit} saving={saving} />
          </div>
        ) : null}
      </div>
    </div>
  )
}
