'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'

import { proLideresItemHref } from '@/config/pro-lideres-menu'

type TenantPayload = {
  tenant?: {
    noel_member_offer_enabled?: boolean
    noel_member_offer_scope?: string
  }
}

export default function ProLideresNoelMemberOfferSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
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
      const t = data.tenant
      if (t) {
        setEnabled(Boolean(t.noel_member_offer_enabled))
        setScope(t.noel_member_offer_scope === 'tabulators_only' ? 'tabulators_only' : 'all_members')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const save = useCallback(async () => {
    setErr(null)
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
    } finally {
      setSaving(false)
    }
  }, [enabled, scope])

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

      {err ? <p className="mt-2 text-sm text-red-600">{err}</p> : null}

      <label className="mt-4 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
        />
        <span className="text-sm text-gray-800">Disponibilizar</span>
      </label>

      <div className="mt-4">
        <span className="mb-1 block text-xs font-medium text-gray-600">Pra quem</span>
        <select
          className="w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm"
          value={scope}
          onChange={(e) => setScope(e.target.value as 'all_members' | 'tabulators_only')}
          disabled={!enabled}
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
        disabled={saving}
        onClick={() => void save()}
        className="mt-4 touch-manipulation rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {saving ? 'Salvando…' : 'Salvar'}
      </button>
    </section>
  )
}
