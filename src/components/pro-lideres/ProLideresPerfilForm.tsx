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
      'Os dados desta operação são geridos pela conta principal do espaço. A sua conta entra como equipe.',
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
  /** Área `/pro-lideres/membro/perfil`: formulário simplificado + guardar via API do membro. */
  memberTeamProfile = false,
}: {
  /** ex.: `/api/pro-estetica-corporal/tenant` */
  tenantApiPath?: string
  /** Textos alinhados ao contexto: rede (Pro Líderes) vs clínica (Pro Estética). */
  copyProfile?: ProLideresPerfilCopyProfile
  memberTeamProfile?: boolean
} = {}) {
  const c = PERFIL_COPY[copyProfile]
  const isMemberTeamProfile = Boolean(memberTeamProfile) && copyProfile === 'pro_lideres'
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
  const [teamBankPaymentUrl, setTeamBankPaymentUrl] = useState('')
  const [teamBankPixPaymentUrl, setTeamBankPixPaymentUrl] = useState('')
  const [canEditTenantProfile, setCanEditTenantProfile] = useState(true)
  const [memberShareSlug, setMemberShareSlug] = useState('')

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
      const d = data as {
        tenant: LeaderTenantRow
        canEditTenantProfile?: boolean
        viewerDisplayName?: string
        viewerContactEmail?: string
        viewerWhatsapp?: string
        memberShareSlug?: string
      }
      const t = d.tenant
      setCanEditTenantProfile(d.canEditTenantProfile !== false)
      setTenant(t)
      const nameForField = (d.viewerDisplayName ?? t.display_name ?? '').trim()
      setDisplayName(nameForField)
      setTeamName(t.team_name ?? '')
      const wa = (d.viewerWhatsapp ?? t.whatsapp ?? '').trim()
      setWhatsapp(wa)
      setWhatsappCountryCode(inferCountryIsoFromLeadingDigits(wa, 'BR'))
      setContactEmail((d.viewerContactEmail ?? t.contact_email ?? '').trim())
      setFocusNotes(t.focus_notes ?? '')
      setMessageTone(isEsteticaMessageToneId(t.message_tone) ? t.message_tone : 'profissional')
      setMessageToneNotes(t.message_tone_notes ?? '')
      setTeamBankPaymentUrl(
        copyProfile === 'pro_lideres' && typeof t.team_bank_payment_url === 'string'
          ? t.team_bank_payment_url.trim()
          : ''
      )
      setTeamBankPixPaymentUrl(
        copyProfile === 'pro_lideres' && typeof t.team_bank_pix_payment_url === 'string'
          ? t.team_bank_pix_payment_url.trim()
          : ''
      )
      setMemberShareSlug(typeof d.memberShareSlug === 'string' ? d.memberShareSlug.trim() : '')
    } catch {
      setError('Erro de rede ao carregar.')
    } finally {
      setLoading(false)
    }
  }, [tenantApiPath, copyProfile, memberTeamProfile])

  useEffect(() => {
    load()
  }, [load])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canEditTenantProfile && !isMemberTeamProfile) return
    setSaving(true)
    setError(null)
    setSavedAt(null)
    try {
      if (isMemberTeamProfile) {
        const res = await fetch('/api/pro-lideres/membro/profile', {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome_completo: displayName.trim(),
            contact_email: contactEmail.trim(),
            whatsapp,
            pro_lideres_share_slug: memberShareSlug.trim(),
          }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError((data as { error?: string }).error || 'Não foi possível guardar.')
          return
        }
        const d = data as {
          viewerDisplayName?: string
          viewerContactEmail?: string
          viewerWhatsapp?: string
          memberShareSlug?: string
        }
        setDisplayName((d.viewerDisplayName ?? displayName).trim())
        setContactEmail((d.viewerContactEmail ?? contactEmail).trim())
        const wa = (d.viewerWhatsapp ?? whatsapp).trim()
        setWhatsapp(wa)
        setWhatsappCountryCode(inferCountryIsoFromLeadingDigits(wa, 'BR'))
        setMemberShareSlug(typeof d.memberShareSlug === 'string' ? d.memberShareSlug.trim() : memberShareSlug.trim())
        setSavedAt(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
        return
      }

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
          ...(copyProfile === 'pro_lideres'
            ? {
                team_bank_payment_url: teamBankPaymentUrl.trim() === '' ? null : teamBankPaymentUrl.trim(),
                team_bank_pix_payment_url: teamBankPixPaymentUrl.trim() === '' ? null : teamBankPixPaymentUrl.trim(),
              }
            : {}),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível guardar.')
        return
      }
      const d = data as {
        tenant: LeaderTenantRow
        viewerDisplayName?: string
        viewerContactEmail?: string
        viewerWhatsapp?: string
      }
      const t = d.tenant
      setTenant(t)
      setDisplayName((d.viewerDisplayName ?? t.display_name ?? '').trim())
      const wa = (d.viewerWhatsapp ?? t.whatsapp ?? '').trim()
      setWhatsapp(wa)
      setWhatsappCountryCode(inferCountryIsoFromLeadingDigits(wa, 'BR'))
      setContactEmail((d.viewerContactEmail ?? t.contact_email ?? '').trim())
      if (copyProfile === 'pro_lideres') {
        setTeamBankPaymentUrl(
          typeof t.team_bank_payment_url === 'string' ? t.team_bank_payment_url.trim() : ''
        )
        setTeamBankPixPaymentUrl(
          typeof t.team_bank_pix_payment_url === 'string' ? t.team_bank_pix_payment_url.trim() : ''
        )
      }
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

  const personalFieldsEditable = canEditTenantProfile || isMemberTeamProfile

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{error}</div>
      )}
      {savedAt && <p className="text-sm font-medium text-green-700">Guardado às {savedAt}.</p>}
      {isMemberTeamProfile ? (
        <p className="rounded-lg border border-sky-100 bg-sky-50/90 px-3 py-2.5 text-sm text-gray-800">
          <span className="font-medium text-sky-900">Editar o teu perfil</span>
          <span className="mt-1.5 block text-xs text-gray-700">
            Nome, e-mail, WhatsApp e slug de divulgação podem ser alterados aqui. O nome da operação é definido pelo
            líder (só leitura).
          </span>
        </p>
      ) : !canEditTenantProfile ? (
        <p className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
          {c.readOnlyMessage}
          <span className="mt-2 block text-xs text-gray-600">
            {copyProfile === 'pro_lideres'
              ? 'Nome, e-mail e WhatsApp são os da tua conta (cadastro no convite). Os outros campos são da operação do líder.'
              : 'Nome, e-mail e WhatsApp são os da tua conta. Os outros campos são da clínica.'}
          </span>
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-sm font-medium text-gray-700">Nome para exibição</span>
          <input
            disabled={!personalFieldsEditable}
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
            disabled={!personalFieldsEditable}
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
            disabled={!personalFieldsEditable}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder={isMemberTeamProfile ? 'email@exemplo.com' : 'opcional'}
            maxLength={320}
            autoComplete="email"
          />
        </label>
        {!isMemberTeamProfile ? (
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
        ) : null}

        {copyProfile === 'estetica_clinica' && !isMemberTeamProfile ? (
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

        {copyProfile === 'pro_lideres' && !isMemberTeamProfile ? (
          <>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Cartão ou Mercado Pago — link da equipa (opcional)
              </span>
              <span className="mb-1.5 block text-xs text-gray-500">
                Quem aceitar o convite pode ver este link na app. Se também indicares Pix abaixo, a pessoa escolhe a
                forma antes de abrir o link. Podes gerir em Convites equipe.
              </span>
              <input
                type="url"
                disabled={!canEditTenantProfile}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"
                value={teamBankPaymentUrl}
                onChange={(e) => setTeamBankPaymentUrl(e.target.value)}
                placeholder="https://…"
                maxLength={2000}
                autoComplete="off"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">Pix — link da equipa (opcional)</span>
              <span className="mb-1.5 block text-xs text-gray-500">
                Página ou checkout onde a equipa paga por Pix. Só é usado no fluxo do convite quando ambos os links
                estão preenchidos ou sozinho se não houver link de cartão.
              </span>
              <input
                type="url"
                disabled={!canEditTenantProfile}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-600"
                value={teamBankPixPaymentUrl}
                onChange={(e) => setTeamBankPixPaymentUrl(e.target.value)}
                placeholder="https://…"
                maxLength={2000}
                autoComplete="off"
              />
            </label>
          </>
        ) : null}

        {isMemberTeamProfile ? (
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-gray-700">Slug de divulgação (nos teus links)</span>
            <span className="mb-1.5 block text-xs text-gray-500">
              Só letras minúsculas, números e hífens (ex.: maria-silva). Usado na URL quando partilhas um link da equipa.
            </span>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={memberShareSlug}
              onChange={(e) => setMemberShareSlug(e.target.value)}
              placeholder="o-teu-slug"
              maxLength={40}
              autoComplete="off"
              spellCheck={false}
            />
          </label>
        ) : null}
      </div>

      {!isMemberTeamProfile ? (
        <p className="text-xs text-gray-500">
          Slug interno: <code className="rounded bg-gray-100 px-1">{tenant?.slug}</code>
        </p>
      ) : null}

      {(canEditTenantProfile || isMemberTeamProfile) && (
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
