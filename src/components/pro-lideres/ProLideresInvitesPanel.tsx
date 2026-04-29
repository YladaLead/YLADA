'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { LeaderTenantInviteListItem } from '@/types/leader-tenant'

function statusLabel(s: string): string {
  switch (s) {
    case 'pending':
      return 'Pendente'
    case 'used':
      return 'Cadastro feito'
    case 'expired':
      return 'Expirado'
    case 'revoked':
      return 'Revogado'
    default:
      return s
  }
}

type QuotaInfo = { pendingLimit: number; pendingUsed: number; totalListed: number }

type YladaTeamSubHint = { monthlyAmountBrl: number; pendingInviteQuota: number }

export function ProLideresInvitesPanel() {
  const [email, setEmail] = useState('')
  const [invites, setInvites] = useState<LeaderTenantInviteListItem[]>([])
  const [quota, setQuota] = useState<QuotaInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastCreatedUrl, setLastCreatedUrl] = useState<string | null>(null)
  const [lastCreatedInviteId, setLastCreatedInviteId] = useState<string | null>(null)
  const lastCreatedInviteIdRef = useRef<string | null>(null)
  const [copiedInvite, setCopiedInvite] = useState(false)
  const [copiedBank, setCopiedBank] = useState(false)
  const [subscriptionAccessOk, setSubscriptionAccessOk] = useState<boolean | null>(null)
  const [yladaSubHint, setYladaSubHint] = useState<YladaTeamSubHint | null>(null)
  const [teamBankPaymentUrlDraft, setTeamBankPaymentUrlDraft] = useState('')
  const [teamBankUrlSaving, setTeamBankUrlSaving] = useState(false)
  const [teamBankUrlSavedMsg, setTeamBankUrlSavedMsg] = useState<string | null>(null)
  const [lastCreatedBankUrl, setLastCreatedBankUrl] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 320)
    return () => clearTimeout(t)
  }, [search])

  const queryString = useMemo(() => {
    const p = new URLSearchParams()
    if (debouncedSearch) p.set('q', debouncedSearch)
    if (statusFilter !== 'all') p.set('status', statusFilter)
    const s = p.toString()
    return s ? `?${s}` : ''
  }, [debouncedSearch, statusFilter])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [subRes, tenantRes] = await Promise.all([
        fetch('/api/pro-lideres/subscription', { credentials: 'include' }),
        fetch('/api/pro-lideres/tenant', { credentials: 'include' }),
      ])
      const tenantData = await tenantRes.json().catch(() => ({}))
      if (tenantRes.ok) {
        const t = (tenantData as { tenant?: { team_bank_payment_url?: string | null } }).tenant
        setTeamBankPaymentUrlDraft(
          typeof t?.team_bank_payment_url === 'string' ? t.team_bank_payment_url.trim() : ''
        )
      }

      const subData = await subRes.json().catch(() => ({}))
      const accessOk = Boolean((subData as { accessOk?: boolean }).accessOk)
      const accessBlocked = subRes.ok && !accessOk
      const monthlyAmountBrl = Number((subData as { monthlyAmountBrl?: number }).monthlyAmountBrl) || 750
      const pendingInviteQuota =
        Number((subData as { pendingInviteQuota?: number }).pendingInviteQuota) || 50

      if (accessBlocked) {
        setSubscriptionAccessOk(false)
        setYladaSubHint(null)
        setInvites([])
        setQuota(null)
        return
      }

      if (subRes.ok && accessOk) {
        setYladaSubHint({ monthlyAmountBrl, pendingInviteQuota })
      } else {
        setYladaSubHint(null)
      }

      const res = await fetch(`/api/pro-lideres/invites${queryString}`, { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 402) {
          setSubscriptionAccessOk(false)
          setYladaSubHint(null)
          setInvites([])
          setQuota(null)
          return
        }
        setError((data as { error?: string }).error || 'Não foi possível carregar convites.')
        setInvites([])
        setQuota(null)
        return
      }
      setSubscriptionAccessOk(true)
      setInvites((data as { invites: LeaderTenantInviteListItem[] }).invites ?? [])
      setQuota((data as { quota?: QuotaInfo }).quota ?? null)
    } catch {
      setError('Erro de rede.')
      setInvites([])
      setQuota(null)
    } finally {
      setLoading(false)
    }
  }, [queryString])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    lastCreatedInviteIdRef.current = lastCreatedInviteId
  }, [lastCreatedInviteId])

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    if (subscriptionAccessOk === false) return
    setCreating(true)
    setError(null)
    setLastCreatedUrl(null)
    setLastCreatedInviteId(null)
    setLastCreatedBankUrl(null)
    try {
      const res = await fetch('/api/pro-lideres/invites', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 402) {
          setSubscriptionAccessOk(false)
          setError((data as { error?: string }).error || 'Ative a assinatura YLADA deste espaço para gerar convites.')
          return
        }
        setError((data as { error?: string }).error || 'Não foi possível criar o convite.')
        return
      }
      const url = (data as { invite_url?: string }).invite_url
      const inv = (data as { invite?: { id?: string } }).invite
      const bank = (data as { team_bank_payment_url?: string | null }).team_bank_payment_url
      setLastCreatedBankUrl(typeof bank === 'string' && bank.trim() ? bank.trim() : null)
      if (url) setLastCreatedUrl(url)
      if (inv?.id) {
        setLastCreatedInviteId(inv.id)
        lastCreatedInviteIdRef.current = inv.id
      }
      setEmail('')
      await load()
    } catch {
      setError('Erro de rede ao criar convite.')
    } finally {
      setCreating(false)
    }
  }

  async function revoke(id: string) {
    if (!confirm('Revogar este convite? O link deixa de funcionar.')) return
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/invites/revoke', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível revogar.')
        return
      }
      if (lastCreatedInviteIdRef.current === id) {
        setLastCreatedUrl(null)
        setLastCreatedInviteId(null)
        lastCreatedInviteIdRef.current = null
      }
      await load()
    } catch {
      setError('Erro de rede ao revogar.')
    }
  }

  function copyInviteUrl(url: string) {
    void navigator.clipboard.writeText(url).then(() => {
      setCopiedInvite(true)
      setTimeout(() => setCopiedInvite(false), 2000)
    })
  }

  function copyBankUrl(url: string) {
    void navigator.clipboard.writeText(url).then(() => {
      setCopiedBank(true)
      setTimeout(() => setCopiedBank(false), 2000)
    })
  }

  async function saveTeamBankPaymentUrl(e: React.FormEvent) {
    e.preventDefault()
    setTeamBankUrlSaving(true)
    setTeamBankUrlSavedMsg(null)
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/tenant', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_bank_payment_url: teamBankPaymentUrlDraft.trim() === '' ? null : teamBankPaymentUrlDraft.trim(),
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error || 'Não foi possível guardar o link.')
        return
      }
      const t = (data as { tenant?: { team_bank_payment_url?: string | null } }).tenant
      setTeamBankPaymentUrlDraft(
        typeof t?.team_bank_payment_url === 'string' ? t.team_bank_payment_url.trim() : ''
      )
      setTeamBankUrlSavedMsg('Link de cobrança guardado.')
      setTimeout(() => setTeamBankUrlSavedMsg(null), 4000)
    } catch {
      setError('Erro de rede ao guardar o link.')
    } finally {
      setTeamBankUrlSaving(false)
    }
  }

  const origin = typeof window !== 'undefined' ? window.location.origin : ''

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{error}</div>
      )}

      <form
        onSubmit={(e) => void saveTeamBankPaymentUrl(e)}
        className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
      >
        <p className="text-sm font-semibold text-gray-900">Link de cobrança (banco / boleto)</p>
        <p className="text-sm leading-relaxed text-gray-600">
          Cola aqui o endereço que o teu banco ou gateway te dá (https…).{' '}
          <strong className="text-gray-800">Não é o Mercado Pago da YLADA</strong> — é o teu link para a equipa pagar
          a operação. Depois de guardar, <strong className="text-gray-800">cada convite</strong> continua a ser só o
          link de cadastro; a pessoa <strong className="text-gray-800">vê este link de pagamento a seguir</strong> ao
          concluir o registo ou ao aceitar com conta existente.
        </p>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-gray-600">URL (https ou http)</span>
          <input
            type="url"
            value={teamBankPaymentUrlDraft}
            onChange={(e) => setTeamBankPaymentUrlDraft(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 font-mono text-sm text-gray-900"
            placeholder="https://…"
            maxLength={2000}
            autoComplete="off"
          />
        </label>
        {teamBankUrlSavedMsg && (
          <p className="text-sm font-medium text-green-700">{teamBankUrlSavedMsg}</p>
        )}
        <button
          type="submit"
          disabled={teamBankUrlSaving}
          className="min-h-[44px] rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:opacity-60"
        >
          {teamBankUrlSaving ? 'A guardar…' : 'Guardar link de cobrança'}
        </button>
      </form>

      {subscriptionAccessOk === false && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-amber-950 shadow-sm">
          <p className="text-base font-semibold text-amber-950">Assinatura YLADA — necessária para convidar</p>
          <p className="mt-2 text-sm leading-relaxed text-amber-900/95">
            Sem o plano equipe ativo na YLADA não é possível gerar novos convites nem concluir cadastros pelo link.
            Ative o pagamento seguro; em seguida volte aqui para criar os links.
          </p>
          <Link
            href="/pro-lideres/painel/assinatura-equipe"
            className="mt-4 inline-flex min-h-[44px] items-center justify-center rounded-xl bg-amber-800 px-6 text-sm font-semibold text-white hover:bg-amber-900"
          >
            Ativar assinatura YLADA
          </Link>
        </div>
      )}

      {yladaSubHint && subscriptionAccessOk === true && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-950 shadow-sm">
          <p className="font-semibold text-emerald-950">Assinatura YLADA (equipe)</p>
          <p className="mt-1 leading-relaxed text-emerald-900/95">
            <strong className="text-emerald-950">Ativa.</strong> Referência do plano: até{' '}
            <strong>{yladaSubHint.pendingInviteQuota} convites pendentes</strong> no ciclo ·{' '}
            <strong>R$ {yladaSubHint.monthlyAmountBrl.toLocaleString('pt-BR')}/mês</strong> na YLADA. Se o plano expirar,
            o aviso laranja volta acima com o botão para regularizar no Mercado Pago.
          </p>
        </div>
      )}

      {quota && subscriptionAccessOk !== false && (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">
          <span className="font-semibold text-gray-900">Cota de convites pendentes:</span>{' '}
          <span>
            {quota.pendingUsed} / {quota.pendingLimit} ativos
          </span>
          <span className="text-gray-500"> · {quota.totalListed} linhas no histórico (todos os estados)</span>
        </div>
      )}

      <form onSubmit={onCreate} className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-gray-900">Novo convite</p>
        <p className="text-sm text-gray-600">
          Indique o e-mail da pessoa. No link, ela pode <strong className="text-gray-800">criar conta</strong> (nome,
          WhatsApp e senha) ou, se já tiver conta YLADA, <strong className="text-gray-800">entrar</strong> com o mesmo
          e-mail para aceitar.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="block min-w-0 flex-1">
            <span className="mb-1 block text-xs font-medium text-gray-600">E-mail da equipe</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900"
              placeholder="nome@empresa.com"
              autoComplete="off"
            />
          </label>
          <button
            type="submit"
            disabled={creating || subscriptionAccessOk === false || subscriptionAccessOk === null}
            className="min-h-[44px] shrink-0 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {creating ? 'A gerar…' : 'Gerar link'}
          </button>
        </div>
      </form>

      {lastCreatedUrl && lastCreatedInviteId && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm">
          <p className="font-semibold text-green-900">Link gerado — copie e envie à pessoa</p>
          <p className="mt-1 text-xs text-green-800/90">
            Os convites pendentes expiram na data indicada na lista abaixo. Podes revogar a qualquer momento.
          </p>
          <p className="mt-2 break-all font-mono text-xs text-green-800">{lastCreatedUrl}</p>
          {lastCreatedBankUrl ? (
            <div className="mt-3 rounded-lg border border-green-300/80 bg-white/90 px-3 py-2.5 text-xs text-green-950">
              <p className="font-semibold text-green-900">Cobrança da operação (também na app após o cadastro)</p>
              <p className="mt-1 break-all font-mono text-[11px] text-green-900/90">{lastCreatedBankUrl}</p>
              <button
                type="button"
                onClick={() => copyBankUrl(lastCreatedBankUrl)}
                className="mt-2 min-h-[36px] rounded-md border border-green-600 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-900 hover:bg-green-100"
              >
                {copiedBank ? 'Copiado!' : 'Copiar link de cobrança'}
              </button>
            </div>
          ) : (
            <p className="mt-2 text-xs text-green-800/85">
              Sem link de cobrança configurado acima — a pessoa só entra pelo convite; podes enviar o pagamento por
              fora se quiseres.
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => copyInviteUrl(lastCreatedUrl)}
              className="min-h-[40px] rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
            >
              {copiedInvite ? 'Copiado!' : 'Copiar link'}
            </button>
            <button
              type="button"
              onClick={() => lastCreatedInviteId && revoke(lastCreatedInviteId)}
              className="min-h-[40px] rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-800 hover:bg-red-50"
            >
              Excluir convite
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
        <label className="block min-w-0 flex-1">
          <span className="mb-1 block text-xs font-medium text-gray-600">Buscar</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="E-mail, nome ou WhatsApp"
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900"
          />
        </label>
        <label className="block shrink-0 sm:w-44">
          <span className="mb-1 block text-xs font-medium text-gray-600">Estado</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900"
          >
            <option value="all">Todos</option>
            <option value="pending">Pendente</option>
            <option value="used">Cadastro feito</option>
            <option value="expired">Expirado</option>
            <option value="revoked">Revogado</option>
          </select>
        </label>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="text-sm font-semibold text-gray-900">Convites</p>
        </div>
        {loading ? (
          <p className="p-4 text-sm text-gray-600">A carregar…</p>
        ) : invites.length === 0 ? (
          <p className="p-4 text-sm text-gray-600">
            {!debouncedSearch && statusFilter === 'all' && quota && quota.totalListed === 0
              ? 'Ainda não há convites. Crie o primeiro acima.'
              : 'Nenhum convite corresponde à busca ou ao filtro.'}
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {invites.map((inv) => {
              const eff = inv.effectiveStatus
              const linkActive = inv.status === 'pending' && eff === 'pending'
              const link = linkActive ? `${origin}/pro-lideres/convite/${encodeURIComponent(inv.token)}` : null
              return (
                <li key={inv.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 space-y-1">
                    <p className="truncate font-medium text-gray-900">{inv.invited_email}</p>
                    {(inv.memberNome || inv.memberWhatsapp) && (
                      <p className="text-sm text-gray-700">
                        {inv.memberNome && <span>{inv.memberNome}</span>}
                        {inv.memberNome && inv.memberWhatsapp && <span> · </span>}
                        {inv.memberWhatsapp && <span className="tabular-nums">{inv.memberWhatsapp}</span>}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      {statusLabel(eff)} · expira {new Date(inv.expires_at).toLocaleDateString('pt-BR')}
                      {eff === 'used' && (
                        <>
                          {' '}
                          · Links{' '}
                          {inv.linksEngaged ? (
                            <span className="font-medium text-green-700">com atividade</span>
                          ) : (
                            <span>sem atividade ainda</span>
                          )}
                        </>
                      )}
                    </p>
                    {link && <p className="break-all font-mono text-[11px] text-gray-500">{link}</p>}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    {link && (
                      <button
                        type="button"
                        onClick={() => copyInviteUrl(link)}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50"
                      >
                        Copiar
                      </button>
                    )}
                    {inv.status === 'pending' && (
                      <button
                        type="button"
                        onClick={() => revoke(inv.id)}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                      >
                        Revogar
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
