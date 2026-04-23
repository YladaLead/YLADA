'use client'

import { useCallback, useEffect, useState } from 'react'
import type { LeaderTenantRow } from '@/types/leader-tenant'
import PhoneInputWithCountry from '@/components/PhoneInputWithCountry'
import { inferCountryIsoFromLeadingDigits } from '@/components/CountrySelector'

export function ProLideresPerfilForm({
  tenantApiPath = '/api/pro-lideres/tenant',
}: {
  /** ex.: `/api/pro-estetica-corporal/tenant` */
  tenantApiPath?: string
} = {}) {
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
          Só o líder responsável altera os dados desta operação. A sua conta entra como equipe neste espaço.
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
            placeholder="Como a equipe vê o teu nome"
            maxLength={500}
            autoComplete="name"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-gray-700">Nome da operação/equipe</span>
          <input
            disabled={!canEditTenantProfile}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Ex.: Equipe Sul"
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
          <span className="mb-1 block text-sm font-medium text-gray-700">Foco e tom</span>
          <textarea
            disabled={!canEditTenantProfile}
            className="min-h-[120px] w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"
            value={focusNotes}
            onChange={(e) => setFocusNotes(e.target.value)}
            placeholder="Objetivos da operação, tom de mensagens, prioridades…"
            maxLength={2000}
          />
        </label>
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
