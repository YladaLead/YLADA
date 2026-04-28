'use client'

import { useCallback, useEffect, useState } from 'react'
import type { LeaderTenantRow } from '@/types/leader-tenant'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'
import { inferCountryIsoFromLeadingDigits } from '@/components/CountrySelector'
import {
  ESTETICA_MESSAGE_TONE_OPTIONS,
  isEsteticaMessageToneId,
  type EsteticaMessageToneId,
} from '@/config/estetica-message-tone'

export type ProLideresPerfilCopyProfile = 'pro_lideres' | 'estetica_clinica'

const PERFIL_COPY: Record<
  ProLideresPerfilCopyProfile,
  {
    readOnlyMessage: string
    teamNameLabel: string
    teamNamePlaceholder: string
    displayNamePlaceholder: string
    focusPlaceholder: string
    focusSectionLabel: string
    focusSectionHint?: string
  }
> = {
  pro_lideres: {
    readOnlyMessage:
      'Só o líder responsável altera os dados desta operação. A sua conta entra como equipe neste espaço.',
    teamNameLabel: 'Nome da operação/equipe',
    teamNamePlaceholder: 'Ex.: Equipe Sul',
    displayNamePlaceholder: 'Como a equipe vê o teu nome',
    focusPlaceholder: 'Objetivos da operação, tom de mensagens, prioridades…',
    focusSectionLabel: 'Foco e tom',
  },
  estetica_clinica: {
    readOnlyMessage:
      'Só o dono ou a gestão da clínica altera estes dados. A tua conta entra como equipe neste espaço.',
    teamNameLabel: 'Nome da clínica ou equipe',
    teamNamePlaceholder: 'Ex.: Clínica Nome + cidade',
    displayNamePlaceholder: 'Como a equipe e os clientes veem o teu nome',
    focusPlaceholder:
      'Ex.: abri há 8 meses; quero ocupar as tardes; prioridade fichas de avaliação; concorrência forte na zona com preço menor…',
    focusSectionLabel: 'Situação, objetivos e prioridades',
    focusSectionHint:
      'Resume onde o negócio está, metas próximas e o que mais importa comercialmente — o Noel usa isto como contexto, não só “estilo de escrita”.',
  },
}

export function ProLideresPerfilForm({
  tenantApiPath = '/api/pro-lideres/tenant',
  copyProfile = 'pro_lideres',
}: {
  /** ex.: `/api/pro-estetica-corporal/tenant` */
  tenantApiPath?: string
  /** Textos alinhados ao contexto: rede (Pro Líderes) vs clínica (Pro Estética). */
  copyProfile?: ProLideresPerfilCopyProfile
} = {}) {
  const c = PERFIL_COPY[copyProfile]
  const [tenant, setTenant] = useState<LeaderTenantRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<string | null>(null)

  const [displayName, setDisplayName] = useState('')
  const [teamName, setTeamName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [whatsappCountryCode, setWhatsappCountryCode] = useState('BR')
  const [contactEmail, setContactEmail] = useState('')
  const [focusNotes, setFocusNotes] = useState('')
  const [messageTone, setMessageTone] = useState<EsteticaMessageToneId>('profissional')
  const [messageToneNotes, setMessageToneNotes] = useState('')
  const [canEditTenantProfile, setCanEditTenantProfile] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(tenantApiPath, { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível carregar o perfil.')
        setTenant(null)
        return
      }
      const d = data as { tenant: LeaderTenantRow; canEditTenantProfile?: boolean }
      const t = d.tenant
      setCanEditTenantProfile(d.canEditTenantProfile !== false)
      setTenant(t)
      setDisplayName(t.display_name ?? '')
      setTeamName(t.team_name ?? '')
      const wa = t.whatsapp ?? ''
      setWhatsapp(wa)
      setWhatsappCountryCode(inferCountryIsoFromLeadingDigits(wa, 'BR'))
      setContactEmail(t.contact_email ?? '')
      setFocusNotes(t.focus_notes ?? '')
      setMessageTone(isEsteticaMessageToneId(t.message_tone) ? t.message_tone : 'profissional')
      setMessageToneNotes(t.message_tone_notes ?? '')
    } catch {
      setError('Erro de rede ao carregar.')
    } finally {
      setLoading(false)
    }
  }, [tenantApiPath])

  useEffect(() => {
    load()
  }, [load])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canEditTenantProfile) return
    setSaving(true)
    setError(null)
    setSavedAt(null)
    try {
      const res = await fetch(tenantApiPath, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          display_name: displayName,
          team_name: teamName,
          whatsapp,
          contact_email: contactEmail,
          focus_notes: focusNotes,
          ...(copyProfile === 'estetica_clinica'
            ? {
                message_tone: messageTone,
                message_tone_notes: messageToneNotes.trim() ? messageToneNotes.trim() : null,
              }
            : {}),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível guardar.')
        return
      }
      const t = (data as { tenant: LeaderTenantRow }).tenant
      setTenant(t)
      setSavedAt(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    } catch {
      setError('Erro de rede ao guardar.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-gray-600">A carregar perfil…</p>
  }

  if (!tenant && error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
        {error}{' '}
        <button type="button" className="ml-2 font-semibold underline" onClick={() => load()}>
          Tentar de novo
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{error}</div>
      )}
      {savedAt && <p className="text-sm font-medium text-green-700">Guardado às {savedAt}.</p>}
      {!canEditTenantProfile && (
        <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
          {c.readOnlyMessage}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-gray-700">Nome para exibição</span>
          <input
            disabled={!canEditTenantProfile}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={c.displayNamePlaceholder}
            maxLength={500}
            autoComplete="name"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-gray-700">{c.teamNameLabel}</span>
          <input
            disabled={!canEditTenantProfile}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder={c.teamNamePlaceholder}
            maxLength={500}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">WhatsApp</span>
          <PhoneInputWithCountry
            disabled={!canEditTenantProfile}
            className="w-full disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"
            value={whatsapp}
            defaultCountryCode={whatsappCountryCode || 'BR'}
            onChange={(phone, countryCode) => {
              setWhatsapp(phone)
              setWhatsappCountryCode(countryCode || 'BR')
            }}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">E-mail de contacto</span>
          <input
            type="email"
            disabled={!canEditTenantProfile}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="opcional"
            maxLength={320}
            autoComplete="email"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-gray-700">{c.focusSectionLabel}</span>
          {copyProfile === 'estetica_clinica' && c.focusSectionHint ? (
            <span className="mb-2 block text-xs text-gray-500">{c.focusSectionHint}</span>
          ) : null}
          <textarea
            disabled={!canEditTenantProfile}
            className="min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"
            value={focusNotes}
            onChange={(e) => setFocusNotes(e.target.value)}
            placeholder={c.focusPlaceholder}
            maxLength={2000}
          />
        </label>

        {copyProfile === 'estetica_clinica' ? (
          <>
            <div className="sm:col-span-2">
              <span className="mb-2 block text-sm font-medium text-gray-700">Tom das mensagens</span>
              <p className="mb-3 text-xs text-gray-500">
                Escolhe como o Noel deve soar nos scripts para WhatsApp e redes — refina abaixo se precisares.
              </p>
              <fieldset disabled={!canEditTenantProfile} className="grid gap-2 sm:grid-cols-2">
                {ESTETICA_MESSAGE_TONE_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex cursor-pointer gap-2 rounded-lg border p-3 text-sm shadow-sm transition-colors touch-manipulation ${
                      messageTone === opt.id
                        ? 'border-blue-400 bg-blue-50/90'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    } ${!canEditTenantProfile ? 'cursor-not-allowed opacity-75' : ''}`}
                  >
                    <input
                      type="radio"
                      name="message_tone"
                      value={opt.id}
                      checked={messageTone === opt.id}
                      onChange={() => setMessageTone(opt.id)}
                      className="mt-0.5 h-4 w-4 shrink-0 border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>
                      <span className="block font-medium text-gray-900">{opt.label}</span>
                      <span className="mt-0.5 block text-xs text-gray-500">{opt.hint}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
            </div>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">Refino do tom (opcional)</span>
              <span className="mb-1.5 block text-xs text-gray-500">
                Ex.: evitar gírias, não usar exclamações, assinar sempre com o primeiro nome…
              </span>
              <textarea
                disabled={!canEditTenantProfile}
                className="min-h-[72px] w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"
                value={messageToneNotes}
                onChange={(e) => setMessageToneNotes(e.target.value)}
                placeholder="Deixa em branco se a opção acima já basta."
                maxLength={400}
              />
            </label>
          </>
        ) : null}
      </div>

      <p className="text-xs text-gray-500">
        Slug interno: <code className="rounded bg-gray-100 px-1">{tenant?.slug}</code>
      </p>

      {canEditTenantProfile && (
        <button
          type="submit"
          disabled={saving}
          className="min-h-[44px] rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'A guardar…' : 'Guardar alterações'}
        </button>
      )}
    </form>
  )
}
