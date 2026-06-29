'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import { proLideresItemHref } from '@/config/pro-lideres-menu'

type TenantPayload = {
  tenant?: {
    noel_member_offer_enabled?: boolean
    noel_member_offer_scope?: string
  }
  canEditTenantProfile?: boolean
  teamSubscriptionActive?: boolean
}

export default function ProLideresNoelMemberOfferSettings() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [canEdit, setCanEdit] = useState(true)
  const [teamSubscriptionActive, setTeamSubscriptionActive] = useState(true)
  const [enabled, setEnabled] = useState(false)
  const [scope, setScope] = useState<'all_members' | 'tabulators_only'>('all_members')

  const tabuladoresHref = proLideresItemHref('tabuladores')

  const load = useCallback(async () => {
    setErr(null)
    setLoading(true)
    try {
      const res = await fetch('/api/pro-lideres/tenant', { credentials: 'include' })
      const data = (await res.json().catch(() => ({}))) as TenantPayload & { error?: string }
      if (!res.ok) {
        setErr(data.error || 'Não foi possível carregar.')
        return
      }
      setCanEdit(data.canEditTenantProfile !== false)
      setTeamSubscriptionActive(data.teamSubscriptionActive !== false)
      const t = data.tenant
      if (t) {
        setEnabled(Boolean(t.noel_member_offer_enabled))
        setScope(t.noel_member_offer_scope === 'tabulators_only' ? 'tabulators_only' : 'all_members')
      }
      setSaved(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const save = useCallback(async () => {
    if (!canEdit) return
    setErr(null)
    setSaved(false)
    setSaving(true)
    try {
      const res = await fetch('/api/pro-lideres/tenant', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          noel_member_offer_enabled: enabled,
          noel_member_offer_scope: scope,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as TenantPayload & { error?: string }
      if (!res.ok) {
        setErr(data.error || 'Não foi possível salvar.')
        return
      }
      if (data.tenant) {
        setEnabled(Boolean(data.tenant.noel_member_offer_enabled))
        setScope(data.tenant.noel_member_offer_scope === 'tabulators_only' ? 'tabulators_only' : 'all_members')
      }
      setSaved(true)
      router.refresh()
    } finally {
      setSaving(false)
    }
  }, [canEdit, enabled, scope, router])

  if (loading) {
    return <p className="text-sm text-gray-500">Carregando…</p>
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900">Noel para sua equipe</h2>
      <p className="mt-1 text-sm text-gray-600">
        Quando você disponibiliza, cada membro elegível passa a ver <strong>Noel de campo</strong> no menu (lista,
        mensagens e rotina). A <strong>adesão é paga à YLADA</strong> por membro; você só escolhe se aparece a opção e
        para quem.
      </p>

      {!canEdit ? (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          Só o líder responsável pela conta pode alterar esta configuração.
        </p>
      ) : null}

      {!teamSubscriptionActive ? (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          A assinatura <strong>Pro Líderes equipe</strong> deste espaço não está ativa. Você pode salvar a oferta
          abaixo, mas o Noel de campo só funciona para você e para a equipe depois de renovar o plano em{' '}
          <Link href="/pro-lideres/painel/assinatura-equipe" className="font-semibold text-blue-700 underline">
            Assinatura equipe
          </Link>
          .
        </p>
      ) : null}

      {err ? <p className="mt-2 text-sm text-red-600">{err}</p> : null}

      {saved ? (
        <p className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-950">
          <strong>Salvo.</strong>{' '}
          {enabled
            ? 'O item Noel (campo) aparece no menu lateral. Cada membro elegível ainda precisa aderir ao add-on na própria conta (pagamento à YLADA).'
            : 'A oferta foi desligada. A equipe deixa de ver a opção no menu.'}
        </p>
      ) : null}

      <label className="mt-4 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
          checked={enabled}
          disabled={!canEdit}
          onChange={(e) => {
            setEnabled(e.target.checked)
            setSaved(false)
          }}
        />
        <span className="text-sm text-gray-800">Disponibilizar</span>
      </label>

      <div className="mt-4">
        <span className="mb-1 block text-xs font-medium text-gray-600">Pra quem</span>
        <select
          className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm"
          value={scope}
          onChange={(e) => {
            setScope(e.target.value as 'all_members' | 'tabulators_only')
            setSaved(false)
          }}
          disabled={!canEdit || !enabled}
        >
          <option value="all_members">Toda a equipe</option>
          <option value="tabulators_only">Tabuladores</option>
        </select>
        {enabled && scope === 'tabulators_only' ? (
          <p className="mt-2 max-w-md text-xs text-gray-600">
            Os tabuladores precisam estar cadastrados e vinculados ao convite: configure a lista em{' '}
            <Link href={tabuladoresHref} className="font-medium text-blue-700 underline hover:text-blue-800">
              Tabuladores
            </Link>{' '}
            para o nome bater com o que a equipe escolhe ao entrar.
          </p>
        ) : null}
      </div>

      <button
        type="button"
        disabled={saving || !canEdit}
        onClick={() => void save()}
        className="mt-4 touch-manipulation rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {saving ? 'Salvando…' : 'Salvar'}
      </button>
    </section>
  )
}
