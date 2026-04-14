'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

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

  const [displayName, setDisplayName] = useState('')
  const [teamName, setTeamName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [primaryGoal, setPrimaryGoal] = useState('')
  const [mainChallenge, setMainChallenge] = useState('')
  const [focusNotes, setFocusNotes] = useState('')

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
    setDisplayName(payload.leaderName ?? '')
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
        display_name: displayName,
        team_name: teamName,
        whatsapp,
        primary_goal: primaryGoal,
        main_challenge: mainChallenge,
        focus_notes: focusNotes,
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

            <form className="grid gap-3" onSubmit={(e) => void onSubmit(e)}>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Nome para exibição</span>
                <input
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Nome da operação/equipe</span>
                <input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Ex.: Equipe Sul"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">WhatsApp</span>
                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Com DDI, ex.: 5511999999999"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Objetivo principal (30 dias)</span>
                <input
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  placeholder="Ex.: aumentar recrutas ativos na equipe"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Maior desafio hoje</span>
                <input
                  value={mainChallenge}
                  onChange={(e) => setMainChallenge(e.target.value)}
                  placeholder="Ex.: consistência de acompanhamento da equipe"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-gray-700">Foco e tom de comunicação</span>
                <textarea
                  value={focusNotes}
                  onChange={(e) => setFocusNotes(e.target.value)}
                  placeholder="Como deseja conduzir sua comunicação com equipe e prospects."
                  className="min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2.5"
                />
              </label>

              <button
                type="submit"
                disabled={saving}
                className="mt-2 min-h-[46px] rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? 'Enviando...' : 'Enviar respostas'}
              </button>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  )
}
