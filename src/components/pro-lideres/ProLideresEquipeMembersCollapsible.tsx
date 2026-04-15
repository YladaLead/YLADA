'use client'

import { useMemo, useState } from 'react'

import type { ProLideresMemberListItem } from '@/lib/pro-lideres-members-enriched'
import type { ProLideresTenantRole } from '@/types/leader-tenant'

function roleLabel(role: ProLideresTenantRole): string {
  return role === 'leader' ? 'Líder' : 'Equipe'
}

export function ProLideresEquipeMembersCollapsible({
  members,
  viewerRoleLabel,
}: {
  members: ProLideresMemberListItem[]
  viewerRoleLabel: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return members
    return members.filter((m) => {
      const name = (m.displayName ?? '').toLowerCase()
      const email = (m.email ?? '').toLowerCase()
      const id = m.userId.toLowerCase()
      return name.includes(q) || email.includes(q) || id.includes(q)
    })
  }, [members, query])

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-start justify-between gap-3 border-b border-gray-100 bg-gray-50 px-4 py-3 text-left transition hover:bg-gray-100/90"
        aria-expanded={open}
        id="pro-lideres-equipe-pessoas-heading"
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">Pessoas neste espaço</p>
          <p className="text-xs text-gray-500">O seu papel aqui: {viewerRoleLabel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-200">
            {members.length}
          </span>
          <span className="text-gray-500" aria-hidden>
            {open ? '▲' : '▼'}
          </span>
        </div>
      </button>

      {open ? (
        <div className="border-t border-gray-100">
          <div className="border-b border-gray-100 bg-white px-4 py-3">
            <label htmlFor="pro-lideres-equipe-busca" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Buscar por nome ou e-mail
            </label>
            <input
              id="pro-lideres-equipe-busca"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Comece a digitar…"
              autoComplete="off"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            {query.trim() ? (
              <p className="mt-2 text-xs text-gray-500">
                {filtered.length === 0
                  ? 'Nenhum resultado.'
                  : `${filtered.length} de ${members.length} pessoa(s)`}
              </p>
            ) : null}
          </div>
          <ul
            className="max-h-[min(60vh,28rem)] divide-y divide-gray-100 overflow-y-auto overscroll-contain"
            aria-labelledby="pro-lideres-equipe-pessoas-heading"
          >
            {members.length === 0 ? (
              <li className="px-4 py-6 text-sm text-gray-600">Nenhuma pessoa listada.</li>
            ) : filtered.length === 0 ? (
              <li className="px-4 py-6 text-sm text-gray-600">Nenhum resultado para esta pesquisa.</li>
            ) : (
              filtered.map((m) => {
                const title = m.displayName?.trim() || m.email?.trim() || 'Conta sem nome no perfil YLADA'
                const subtitle = m.email && m.displayName ? m.email : m.userId
                return (
                  <li
                    key={m.userId}
                    className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-gray-900">{title}</p>
                      <p className="truncate text-sm text-gray-500">{subtitle}</p>
                    </div>
                    <span
                      className={
                        m.role === 'leader'
                          ? 'mt-1 inline-flex w-fit shrink-0 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800 sm:mt-0'
                          : 'mt-1 inline-flex w-fit shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-700 sm:mt-0'
                      }
                    >
                      {roleLabel(m.role)}
                    </span>
                  </li>
                )
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
