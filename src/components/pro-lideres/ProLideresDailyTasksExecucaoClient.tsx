'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  type ProLideresDailyTaskCompletionRow,
  type ProLideresDailyTaskRow,
} from '@/types/pro-lideres-daily-tasks'
import type { ProLideresMemberListItem } from '@/lib/pro-lideres-members-enriched'
import { proLideresTodayYmdBr, proLideresYesterdayYmdBr } from '@/lib/pro-lideres-dates-br'
import { ProLideresMemberExecutionDetail } from '@/components/pro-lideres/ProLideresMemberExecutionDetail'

const TAREFAS_HREF = '/pro-lideres/painel/tarefas'
const navPill =
  'inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:rounded-xl sm:px-4 sm:py-2.5 sm:text-sm'
const navPillActive = 'bg-blue-700 text-white shadow-sm'
const navPillInactive = 'border border-blue-200 bg-white text-blue-900 hover:bg-blue-50'

type MemberSortMode = 'points_desc' | 'points_asc' | 'name_asc' | 'name_desc' | 'executed_first'

type ApiGet = {
  tasks: ProLideresDailyTaskRow[]
  completions: ProLideresDailyTaskCompletionRow[]
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

type PeriodPreset = 'yesterday' | 'week' | 'month' | 'custom'

function detectPeriodPreset(from: string, to: string, yesterdayYmd: string): PeriodPreset {
  if (from === yesterdayYmd && to === yesterdayYmd) return 'yesterday'
  const n = new Date()
  const weekStart = localIsoDate(startOfWeek(n))
  const weekEnd = localIsoDate(endOfWeek(n))
  if (from === weekStart && to === weekEnd) return 'week'
  const monthStart = localIsoDate(new Date(n.getFullYear(), n.getMonth(), 1))
  const monthEnd = localIsoDate(new Date(n.getFullYear(), n.getMonth() + 1, 0))
  if (from === monthStart && to === monthEnd) return 'month'
  return 'custom'
}

function periodPresetClass(active: boolean): string {
  const base = 'min-h-[2.125rem] flex-1 rounded-lg border px-2 py-1.5 text-sm transition-colors'
  return active
    ? `${base} border-blue-600 bg-blue-100 font-semibold text-blue-900 shadow-sm`
    : `${base} border-blue-200 bg-blue-50/80 font-medium text-blue-900 hover:bg-blue-100`
}

function memberDisplayName(m: ProLideresMemberListItem): string {
  const base = m.displayName?.trim() || m.email?.trim() || m.userId.slice(0, 8)
  return m.role === 'leader' ? `${base} · líder` : base
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
  const yesterdayYmd = proLideresYesterdayYmdBr()
  const maxDateYmd = proLideresTodayYmdBr()

  const [from, setFrom] = useState(() => yesterdayYmd)
  const [to, setTo] = useState(() => yesterdayYmd)

  const activePeriodPreset = useMemo(
    () => detectPeriodPreset(from, to, yesterdayYmd),
    [from, to, yesterdayYmd]
  )

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

  const focusedMemberName = focusUserId ? memberName(focusUserId) : null

  return (
    <div className="max-w-4xl space-y-3 sm:space-y-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium text-blue-700">Análise</p>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Execução do time</h1>
          <p className="mt-0.5 hidden max-w-2xl text-sm text-gray-600 sm:block">
            Veja quem marcou tarefas, os pontos no período e o detalhe das conclusões.
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5 sm:gap-2">
          <Link href={TAREFAS_HREF} className={`${navPill} ${navPillInactive}`}>
            Criar tarefas
          </Link>
          <span className={`${navPill} ${navPillActive} cursor-default`} aria-current="page">
            Execução
          </span>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm sm:p-3">
        <p className="mb-1.5 text-xs font-semibold text-gray-800">Período</p>
        <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Atalhos de período">
          <button
            type="button"
            className={periodPresetClass(activePeriodPreset === 'yesterday')}
            onClick={() => {
              setFrom(yesterdayYmd)
              setTo(yesterdayYmd)
            }}
          >
            Ontem
          </button>
          <button
            type="button"
            className={periodPresetClass(activePeriodPreset === 'week')}
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
            className={periodPresetClass(activePeriodPreset === 'month')}
            onClick={() => {
              const n = new Date()
              setFrom(localIsoDate(new Date(n.getFullYear(), n.getMonth(), 1)))
              setTo(localIsoDate(new Date(n.getFullYear(), n.getMonth() + 1, 0)))
            }}
          >
            Este mês
          </button>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-1.5">
          <label className="flex min-w-0 flex-1 items-center gap-1 sm:flex-none sm:gap-1.5">
            <span className="shrink-0 text-[10px] font-medium text-gray-400">De</span>
            <input
              type="date"
              value={from}
              max={to || maxDateYmd}
              onChange={(e) => setFrom(e.target.value)}
              className="min-w-0 flex-1 rounded-md border border-gray-200 bg-gray-50/80 px-1.5 py-1 text-xs text-gray-700 sm:w-[7.25rem] sm:flex-none"
            />
          </label>
          <label className="flex min-w-0 flex-1 items-center gap-1 sm:flex-none sm:gap-1.5">
            <span className="shrink-0 text-[10px] font-medium text-gray-400">Até</span>
            <input
              type="date"
              value={to}
              min={from}
              max={maxDateYmd}
              onChange={(e) => setTo(e.target.value)}
              className="min-w-0 flex-1 rounded-md border border-gray-200 bg-gray-50/80 px-1.5 py-1 text-xs text-gray-700 sm:w-[7.25rem] sm:flex-none"
            />
          </label>
          <button
            type="button"
            onClick={() => void load()}
            className="shrink-0 rounded-md border border-gray-300 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50 sm:ml-auto"
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
                {data.members.length > 0 ? (
                  <div className="border-b border-gray-100 bg-gray-50/80 px-3 py-2 sm:px-4">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-900">Ranking</p>
                      <p className="shrink-0 text-[11px] tabular-nums text-gray-500 sm:text-xs">
                        {data.from === data.to ? data.from : `${data.from} → ${data.to}`}
                      </p>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
                      <label className="sr-only" htmlFor="execucao-busca-nome">
                        Buscar por nome
                      </label>
                      <input
                        id="execucao-busca-nome"
                        type="search"
                        value={nameFilter}
                        onChange={(e) => {
                          setNameFilter(e.target.value)
                          setFocusUserId(null)
                        }}
                        placeholder="Buscar nome…"
                        className="min-w-0 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm sm:min-w-[10rem] sm:flex-1"
                      />
                      <label className="sr-only" htmlFor="execucao-ordenar">
                        Ordenar
                      </label>
                      <select
                        id="execucao-ordenar"
                        value={memberSort}
                        onChange={(e) => setMemberSort(e.target.value as MemberSortMode)}
                        className="min-w-0 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-sm sm:min-w-[12rem] sm:flex-1"
                      >
                        <option value="points_desc">Pontos (maior → menor)</option>
                        <option value="points_asc">Pontos (menor → maior)</option>
                        <option value="executed_first">Quem executou primeiro</option>
                        <option value="name_asc">Nome (A → Z)</option>
                        <option value="name_desc">Nome (Z → A)</option>
                      </select>
                      {focusUserId ? (
                        <button
                          type="button"
                          onClick={() => setFocusUserId(null)}
                          className="rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-100 sm:self-end"
                        >
                          Ver equipe toda
                        </button>
                      ) : null}
                    </div>
                    <ol
                      className={`mt-2 divide-y divide-gray-200/80 overflow-y-auto rounded-lg border border-gray-200 bg-white ${
                        focusUserId ? 'max-h-36' : 'sm:max-h-72'
                      }`}
                    >
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
                                onClick={() => setFocusUserId(row.userId)}
                                className={`flex w-full items-center gap-2 px-2.5 py-2 text-left text-sm transition-colors sm:gap-3 sm:px-3 sm:py-2.5 ${
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
                                    ? 'sem tarefas'
                                    : `${row.completionCount} ${row.completionCount === 1 ? 'tarefa' : 'tarefas'}`}
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

                {focusUserId && focusedMemberName ? (
                  <ProLideresMemberExecutionDetail
                    memberName={focusedMemberName}
                    userId={focusUserId}
                    from={data.from}
                    to={data.to}
                    tasks={data.tasks}
                    completions={data.completions ?? []}
                    onClose={() => setFocusUserId(null)}
                  />
                ) : (
                  <p className="border-t border-gray-100 px-3 py-4 text-center text-sm text-gray-500 sm:px-4">
                    Toque em um nome no ranking para ver o que fez e o que deixou de fazer, dia a dia.
                  </p>
                )}
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
