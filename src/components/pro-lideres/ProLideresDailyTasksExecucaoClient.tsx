'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  type ProLideresDailyTaskCompletionRow,
  type ProLideresDailyTaskRow,
} from '@/types/pro-lideres-daily-tasks'
import type { ProLideresMemberListItem } from '@/lib/pro-lideres-members-enriched'

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

  const memberName = useCallback(
    (userId: string) => {
      const m = data?.members.find((x) => x.userId === userId)
      return m?.displayName?.trim() || m?.email || userId.slice(0, 8)
    },
    [data?.members]
  )

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
          <p className="text-sm font-medium text-emerald-800">Análise</p>
          <h1 className="text-2xl font-bold text-gray-900">Execução do time</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            Vê quem está a marcar tarefas, os pontos no período e o detalhe das conclusões.
          </p>
        </div>
        <Link
          href="/pro-lideres/painel/tarefas"
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-900 shadow-sm hover:bg-emerald-50"
        >
          Criar tarefas diárias
        </Link>
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
            className="rounded-lg bg-emerald-800 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-900"
          >
            Atualizar
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{error}</div>
      )}

      {loading ? (
        <p className="text-gray-600">A carregar…</p>
      ) : (
        data && (
          <>
            {data.members.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">Pontos por pessoa</p>
                  <p className="text-xs text-gray-500">No período selecionado (inclui bónus de dia completo)</p>
                </div>
                <ul className="divide-y divide-gray-100">
                  {data.members.map((m) => (
                    <li key={m.userId} className="flex items-center justify-between px-4 py-2 text-sm">
                      <span className="text-gray-900">{m.displayName || m.email || m.userId}</span>
                      <span className="font-semibold text-emerald-700">{data.pointsByUserId[m.userId] ?? 0} pts</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.tasks.length > 0 && (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-100 px-4 py-3">
                  <p className="text-sm font-semibold text-gray-900">Conclusões no período</p>
                  <p className="text-xs text-gray-500">
                    {data.from} → {data.to}
                  </p>
                </div>
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
                      {(data.completions ?? []).map((c) => {
                        const task = data.tasks.find((tk) => tk.id === c.task_id)
                        if (!task) return null
                        return (
                          <tr key={c.id} className="border-b border-gray-50">
                            <td className="px-4 py-2 text-gray-700">{c.completed_on}</td>
                            <td className="px-4 py-2 text-gray-900">{task.title}</td>
                            <td className="px-4 py-2">{memberName(c.member_user_id)}</td>
                            <td className="px-4 py-2 font-medium text-emerald-700">{task.points}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {(data.completions ?? []).length === 0 && (
                    <p className="px-4 py-4 text-sm text-gray-600">Nenhuma conclusão neste período.</p>
                  )}
                </div>
              </div>
            )}

            {data.tasks.length === 0 && (
              <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                Ainda não há tarefas definidas.{' '}
                <button
                  type="button"
                  className="font-medium text-emerald-800 underline hover:text-emerald-900"
                  onClick={() => router.push('/pro-lideres/painel/tarefas')}
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
