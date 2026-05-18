'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  type ProLideresDailyTaskCompletionRow,
  type ProLideresDailyTaskRow,
} from '@/types/pro-lideres-daily-tasks'
import type { ProLideresMemberListItem } from '@/lib/pro-lideres-members-enriched'

const TAREFAS_HREF = '/pro-lideres/painel/tarefas'
const navPill =
  'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors'
const navPillActive = 'bg-blue-700 text-white shadow-sm'
const navPillInactive = 'border border-blue-200 bg-white text-blue-900 hover:bg-blue-50'

type MemberSortMode = 'points_desc' | 'points_asc' | 'name_asc' | 'name_desc' | 'executed_first'

type ApiGet = {
  tasks: ProLideresDailyTaskRow[]
  completions: ProLideresDailyTaskCompletionRow[]
  fullDayBonusPoints: number
  pointsByUserId: Record<string, number>
  myPointsInRange: number
  members: ProLideresMemberListItem[]
  from: string
  to: string
}

type MemberRow = {
  userId: string
  display: string
  points: number
  completionCount: number
}

function localIsoDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function startOfWeek(d: Date): Date {
  const x = new Date(d)
  const day = x.getDay()
  const diff = (day + 6) % 7
  x.setDate(x.getDate() - diff)
  return x
}

function endOfWeek(d: Date): Date {
  const s = startOfWeek(d)
  const e = new Date(s)
  e.setDate(e.getDate() + 6)
  return e
}

function memberDisplayName(m: ProLideresMemberListItem): string {
  return m.displayName?.trim() || m.email?.trim() || m.userId.slice(0, 8)
}

function buildMemberRows(data: ApiGet): MemberRow[] {
  const completions = data.completions ?? []
  return data.members.map((m) => {
    const userId = m.userId
    return {
      userId,
      display: memberDisplayName(m),
      points: data.pointsByUserId[userId] ?? 0,
      completionCount: completions.filter((c) => c.member_user_id === userId).length,
    }
  })
}

function sortMemberRows(rows: MemberRow[], mode: MemberSortMode): MemberRow[] {
  const copy = [...rows]
  copy.sort((a, b) => {
    if (mode === 'points_desc') return b.points - a.points || a.display.localeCompare(b.display, 'pt-BR')
    if (mode === 'points_asc') return a.points - b.points || a.display.localeCompare(b.display, 'pt-BR')
    if (mode === 'name_desc') return b.display.localeCompare(a.display, 'pt-BR')
    if (mode === 'executed_first') {
      const ae = a.completionCount > 0 ? 1 : 0
      const be = b.completionCount > 0 ? 1 : 0
      if (be !== ae) return be - ae
      return b.points - a.points || a.display.localeCompare(b.display, 'pt-BR')
    }
    return a.display.localeCompare(b.display, 'pt-BR')
  })
  return copy
}

export function ProLideresDailyTasksExecucaoClient() {
  const router = useRouter()

  const [from, setFrom] = useState(() => {
    const n = new Date()
    return localIsoDate(new Date(n.getFullYear(), n.getMonth(), 1))
  })
  const [to, setTo] = useState(() => localIsoDate(new Date()))

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ApiGet | null>(null)

  const [nameFilter, setNameFilter] = useState('')
  const [memberSort, setMemberSort] = useState<MemberSortMode>('points_desc')
  const [focusUserId, setFocusUserId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/pro-lideres/daily-tasks?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
        { credentials: 'include' }
      )
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((json as { error?: string }).error || 'Erro ao carregar.')
        setData(null)
        return
      }
      setData(json as ApiGet)
    } catch {
      setError('Erro de rede.')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [from, to])

  useEffect(() => {
    void load()
  }, [load])

  useEffect(() => {
    setFocusUserId(null)
  }, [from, to])

  const memberName = useCallback(
    (userId: string) => {
      const m = data?.members.find((x) => x.userId === userId)
      return m ? memberDisplayName(m) : userId.slice(0, 8)
    },
    [data?.members]
  )

  const rankedMembers = useMemo(() => {
    if (!data) return []
    const q = nameFilter.trim().toLowerCase()
    const rows = buildMemberRows(data).filter((r) => !q || r.display.toLowerCase().includes(q))
    return sortMemberRows(rows, memberSort)
  }, [data, nameFilter, memberSort])

  const showRankNumbers = memberSort === 'points_desc' || memberSort === 'executed_first'

  const filteredCompletions = useMemo(() => {
    if (!data) return []
    let list = data.completions ?? []
    if (focusUserId) {
      list = list.filter((c) => c.member_user_id === focusUserId)
    } else if (nameFilter.trim()) {
      const q = nameFilter.trim().toLowerCase()
      list = list.filter((c) => memberName(c.member_user_id).toLowerCase().includes(q))
    }
    return [...list].sort((a, b) => {
      const day = b.completed_on.localeCompare(a.completed_on)
      if (day !== 0) return day
      return memberName(a.member_user_id).localeCompare(memberName(b.member_user_id), 'pt-BR')
    })
  }, [data, focusUserId, nameFilter, memberName])

  const presets = (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        onClick={() => {
          const t = localIsoDate(new Date())
          setFrom(t)
          setTo(t)
        }}
      >
        Hoje
      </button>
      <button
        type="button"
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        onClick={() => {
          const n = new Date()
          setFrom(localIsoDate(startOfWeek(n)))
          setTo(localIsoDate(endOfWeek(n)))
        }}
      >
        Esta semana
      </button>
      <button
        type="button"
        className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
        onClick={() => {
          const n = new Date()
          setFrom(localIsoDate(new Date(n.getFullYear(), n.getMonth(), 1)))
          setTo(localIsoDate(new Date(n.getFullYear(), n.getMonth() + 1, 0)))
        }}
      >
        Este mês
      </button>
    </div>
  )

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium text-blue-700">Análise</p>
          <h1 className="text-2xl font-bold text-gray-900">Execução do time</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            Veja quem está marcando tarefas, os pontos no período e o detalhe das conclusões.
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link href={TAREFAS_HREF} className={`${navPill} ${navPillInactive}`}>
            Criar tarefas diárias
          </Link>
          <span className={`${navPill} ${navPillActive} cursor-default`} aria-current="page">
            Ver execução do time
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-gray-900">Período</p>
        <p className="mb-2 text-xs text-gray-500">Ajusta o intervalo e carrega os dados.</p>
        {presets}
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">De</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-gray-600">Até</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </label>
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Atualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Carregando…</p>
      ) : (
        data && (
          <>
            {data.tasks.length > 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">Conclusões no período</p>
                  <p className="text-xs text-gray-500">
                    {data.from} → {data.to}
                  </p>
                </div>

                {data.members.length > 0 ? (
                  <div className="border-b border-gray-100 bg-gray-50/80 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Quem está executando
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Ranking e filtros do período (inclui bônus de dia completo). Toque em um nome para ver só as
                      conclusões dessa pessoa.
                    </p>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                      <label className="block min-w-[12rem] flex-1">
                        <span className="mb-1 block text-xs font-medium text-gray-600">Buscar por nome</span>
                        <input
                          type="search"
                          value={nameFilter}
                          onChange={(e) => {
                            setNameFilter(e.target.value)
                            setFocusUserId(null)
                          }}
                          placeholder="Ex.: Joice, Roselaine…"
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                        />
                      </label>
                      <label className="block min-w-[14rem] sm:flex-1">
                        <span className="mb-1 block text-xs font-medium text-gray-600">Ordenar</span>
                        <select
                          value={memberSort}
                          onChange={(e) => setMemberSort(e.target.value as MemberSortMode)}
                          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                        >
                          <option value="points_desc">Pontos no período (maior → menor)</option>
                          <option value="points_asc">Pontos no período (menor → maior)</option>
                          <option value="executed_first">Quem executou primeiro</option>
                          <option value="name_asc">Nome (A → Z)</option>
                          <option value="name_desc">Nome (Z → A)</option>
                        </select>
                      </label>
                      {focusUserId ? (
                        <button
                          type="button"
                          onClick={() => setFocusUserId(null)}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-gray-100"
                        >
                          Ver toda a equipe
                        </button>
                      ) : null}
                    </div>
                    <ol className="mt-3 max-h-64 divide-y divide-gray-200/80 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                      {rankedMembers.length === 0 ? (
                        <li className="px-3 py-3 text-sm text-gray-500">Nenhum nome corresponde à busca.</li>
                      ) : (
                        rankedMembers.map((row, index) => {
                          const active = focusUserId === row.userId
                          const rank = showRankNumbers ? index + 1 : null
                          return (
                            <li key={row.userId}>
                              <button
                                type="button"
                                onClick={() => setFocusUserId(active ? null : row.userId)}
                                className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
                                  active ? 'bg-blue-50' : 'hover:bg-gray-50'
                                }`}
                              >
                                {rank != null ? (
                                  <span
                                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                      rank === 1
                                        ? 'bg-amber-100 text-amber-900'
                                        : rank === 2
                                          ? 'bg-gray-200 text-gray-800'
                                          : rank === 3
                                            ? 'bg-orange-100 text-orange-900'
                                            : 'bg-gray-100 text-gray-600'
                                    }`}
                                  >
                                    {rank}
                                  </span>
                                ) : (
                                  <span className="w-7 shrink-0" aria-hidden />
                                )}
                                <span className="min-w-0 flex-1 truncate font-medium text-gray-900">{row.display}</span>
                                <span className="shrink-0 text-xs text-gray-500">
                                  {row.completionCount === 0
                                    ? 'sem conclusões'
                                    : `${row.completionCount} conclusão${row.completionCount === 1 ? '' : 'ões'}`}
                                </span>
                                <span className="shrink-0 font-semibold tabular-nums text-blue-700">{row.points} pts</span>
                              </button>
                            </li>
                          )
                        })
                      )}
                    </ol>
                  </div>
                ) : null}

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-left text-gray-500">
                        <th className="px-4 py-2">Dia</th>
                        <th className="px-4 py-2">Tarefa</th>
                        <th className="px-4 py-2">Membro</th>
                        <th className="px-4 py-2">Pts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCompletions.map((c) => {
                        const task = data.tasks.find((tk) => tk.id === c.task_id)
                        if (!task) return null
                        return (
                          <tr key={c.id} className="border-b border-gray-50">
                            <td className="px-4 py-2 text-gray-700">{c.completed_on}</td>
                            <td className="px-4 py-2 text-gray-900">{task.title}</td>
                            <td className="px-4 py-2">{memberName(c.member_user_id)}</td>
                            <td className="px-4 py-2 font-medium text-blue-700">{task.points}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {filteredCompletions.length === 0 && (
                    <p className="px-4 py-4 text-sm text-gray-600">
                      {focusUserId
                        ? 'Nenhuma conclusão desta pessoa neste período.'
                        : nameFilter.trim()
                          ? 'Nenhuma conclusão para esse nome neste período.'
                          : 'Nenhuma conclusão neste período.'}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                Ainda não há tarefas definidas.{' '}
                <button
                  type="button"
                  className="font-medium text-blue-700 underline hover:text-blue-800"
                  onClick={() => router.push(TAREFAS_HREF)}
                >
                  Criar tarefas diárias
                </button>
              </p>
            )}
          </>
        )
      )}
    </div>
  )
}
