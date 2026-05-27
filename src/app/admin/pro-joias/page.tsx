'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

type TenantRow = {
  id: string
  slug: string
  display_name: string | null
  team_name: string | null
  owner_user_id: string
  contact_email: string | null
  whatsapp: string | null
  vertical_code: string
  created_at: string
}

type SeedResult = {
  tool: string
  scripts: number
}

function fmt(d: string | null | undefined): string {
  if (!d) return '—'
  return new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
}

function AdminProJoiasContent() {
  const [tenants, setTenants] = useState<TenantRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Seed por tenant
  const [seedingId, setSeedingId] = useState<string | null>(null)
  const [seedResult, setSeedResult] = useState<{ id: string; message: string; results?: SeedResult[] } | null>(null)
  const [seedError, setSeedError] = useState<string | null>(null)

  async function loadTenants() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/pro-lideres/tenants?vertical=joias', { credentials: 'include' })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((data as { error?: string }).error ?? 'Erro ao carregar tenants.')
        setTenants([])
      } else {
        setTenants(((data as { tenants?: TenantRow[] }).tenants ?? []) as TenantRow[])
      }
    } catch {
      setError('Erro de rede.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadTenants()
  }, [])

  async function applySeed(tenantId: string) {
    setSeedingId(tenantId)
    setSeedResult(null)
    setSeedError(null)
    try {
      const res = await fetch('/api/pro-joias/ferramentas/seed', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setSeedError((data as { error?: string }).error ?? 'Erro ao aplicar seed.')
      } else {
        setSeedResult({
          id: tenantId,
          message: (data as { message?: string }).message ?? 'Seed aplicado.',
          results: (data as { results?: SeedResult[] }).results,
        })
      }
    } catch {
      setSeedError('Erro de rede ao aplicar seed.')
    } finally {
      setSeedingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto max-w-5xl space-y-6">

        {/* Header */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">💍 Admin — Pro Joias</h1>
            <p className="text-sm text-gray-500 mt-1">
              Controle de tenants, seed de scripts e acesso rápido ao cadastro manual.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/pro-lideres/manual-leader?segment=joias"
              className="inline-flex items-center rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 transition-colors"
            >
              + Cadastrar líder
            </Link>
            <Link
              href="/pro-joias/painel"
              target="_blank"
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Abrir painel ↗
            </Link>
          </div>
        </div>

        {/* Resumo */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Tenants ativos</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">{loading ? '—' : tenants.length}</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Vertical</p>
            <p className="mt-1 text-lg font-bold text-amber-900">joias</p>
            <p className="text-xs text-amber-700 mt-0.5">leader_tenants.vertical_code</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Seed de scripts</p>
            <p className="mt-1 text-sm font-semibold text-gray-700">3 ferramentas · 30 scripts</p>
            <p className="text-xs text-gray-400 mt-0.5">Recrutamento · Venda · Equipe</p>
          </div>
        </div>

        {/* Feedback seed */}
        {seedResult && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900">
            <p className="font-semibold mb-1">✅ {seedResult.message}</p>
            {seedResult.results && (
              <ul className="list-disc list-inside space-y-0.5 text-green-800">
                {seedResult.results.map((r) => (
                  <li key={r.tool}>{r.tool} — {r.scripts} scripts</li>
                ))}
              </ul>
            )}
          </div>
        )}
        {seedError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            ❌ {seedError}
          </div>
        )}

        {/* Tabela de tenants */}
        <section className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Tenants Pro Joias</h2>
            <button
              type="button"
              onClick={() => void loadTenants()}
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
            >
              Atualizar
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500 py-4 text-center">Carregando...</p>
          ) : error ? (
            <p className="text-sm text-red-700 py-4 text-center">{error}</p>
          ) : tenants.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm mb-3">Nenhum tenant Pro Joias ainda.</p>
              <Link
                href="/admin/pro-lideres/manual-leader?segment=joias"
                className="inline-flex items-center rounded-lg bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800"
              >
                Cadastrar primeiro líder
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    <th className="px-2 py-2">Nome / Rede</th>
                    <th className="px-2 py-2">E-mail</th>
                    <th className="px-2 py-2">WhatsApp</th>
                    <th className="px-2 py-2">Criado</th>
                    <th className="px-2 py-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tenants.map((t) => (
                    <tr key={t.id} className="border-b border-gray-100 align-top hover:bg-gray-50">
                      <td className="px-2 py-3">
                        <p className="font-semibold text-gray-900">
                          {t.display_name || t.team_name || '—'}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">{t.slug}</p>
                      </td>
                      <td className="px-2 py-3 text-gray-700">{t.contact_email ?? '—'}</td>
                      <td className="px-2 py-3 text-gray-700">{t.whatsapp ?? '—'}</td>
                      <td className="px-2 py-3 text-gray-500">{fmt(t.created_at)}</td>
                      <td className="px-2 py-3">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            disabled={seedingId === t.id}
                            onClick={() => void applySeed(t.id)}
                            className="inline-flex items-center rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-100 disabled:opacity-50 transition-colors"
                          >
                            {seedingId === t.id ? 'Aplicando...' : '🌱 Aplicar seed'}
                          </button>
                          <Link
                            href={`/admin/pro-lideres/manual-leader?email=${t.contact_email ?? ''}&segment=joias`}
                            className="inline-flex items-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50"
                          >
                            ✏️ Editar acesso
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Links úteis */}
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Links rápidos</h2>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/admin/pro-lideres/manual-leader?segment=joias" className="text-amber-700 hover:underline">
              Cadastro manual de líder →
            </Link>
            <Link href="/pro-joias/entrar" target="_blank" className="text-amber-700 hover:underline">
              Tela de login Pro Joias ↗
            </Link>
            <Link href="/pro-joias/painel" target="_blank" className="text-amber-700 hover:underline">
              Painel (sua conta) ↗
            </Link>
            <Link href="/admin/pro-lideres" className="text-gray-500 hover:underline">
              ← Admin Pro Líderes
            </Link>
          </div>
        </section>

      </div>
    </main>
  )
}

export default function AdminProJoiasPage() {
  return (
    <AdminProtectedRoute>
      <AdminProJoiasContent />
    </AdminProtectedRoute>
  )
}
