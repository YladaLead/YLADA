'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'
import {
  formatExecutionWeekdays,
  PL_WEEKDAY_LABEL,
  PL_WEEKDAY_ORDER,
  type ProLideresDailyTaskCompletionRow,
  type ProLideresDailyTaskRow,
} from '@/types/pro-lideres-daily-tasks'
import type { ProLideresMemberListItem } from '@/lib/pro-lideres-members-enriched'

type ApiGet = {
  tasks: ProLideresDailyTaskRow[]
  completions: ProLideresDailyTaskCompletionRow[]
  reminders: Record<string, string>
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

export function ProLideresDailyTasksClient() {
  const { isLeaderWorkspace: isLeader } = useProLideresPainel()
  const { user } = useAuth()
  const myUserId = user?.id ?? ''

  const [from, setFrom] = useState(() => {
    const n = new Date()
    return localIsoDate(new Date(n.getFullYear(), n.getMonth(), 1))
  })
  const [to, setTo] = useState(() => localIsoDate(new Date()))

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<ApiGet | null>(null)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [points, setPoints] = useState('1')
  const [executionWeekdays, setExecutionWeekdays] = useState<Set<number>>(
    () => new Set([1, 2, 3, 4, 5, 6, 0])
  )
  const [saving, setSaving] = useState(false)
  const [savingReminders, setSavingReminders] = useState(false)

  const [reminderDrafts, setReminderDrafts] = useState<Record<number, string>>({})

  const now = new Date()
  const todayStr = localIsoDate(now)
  const todayDow = now.getDay()

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
      const payload = json as ApiGet
      setData(payload)
      const next: Record<number, string> = {}
      for (const d of PL_WEEKDAY_ORDER) {
        next[d] = (payload.reminders?.[String(d)] ?? '').trim()
      }
      setReminderDrafts(next)
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

  function toggleExecutionDay(day: number) {
    setExecutionWeekdays((prev) => {
      const n = new Set(prev)
      if (n.has(day)) {
        if (n.size <= 1) return prev
        n.delete(day)
      } else {
        n.add(day)
      }
      return n
    })
  }

  async function saveReminders() {
    if (!isLeader) return
    setSavingReminders(true)
    setError(null)
    try {
      const reminders = PL_WEEKDAY_ORDER.map((weekday) => ({
        weekday,
        body: (reminderDrafts[weekday] ?? '').trim(),
      }))
      const res = await fetch('/api/pro-lideres/daily-tasks/reminders', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reminders }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((json as { error?: string }).error || 'Erro ao guardar lembretes.')
        return
      }
      await load()
    } finally {
      setSavingReminders(false)
    }
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault()
    if (!isLeader) return
    if (executionWeekdays.size === 0) {
      setError('Escolhe pelo menos um dia da semana.')
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/daily-tasks', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          points: Number(points) || 1,
          execution_weekdays: PL_WEEKDAY_ORDER.filter((d) => executionWeekdays.has(d)),
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((json as { error?: string }).error || 'Erro ao criar.')
        return
      }
      setTitle('')
      setDescription('')
      setPoints('1')
      setExecutionWeekdays(new Set([1, 2, 3, 4, 5, 6, 0]))
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function deleteTask(id: string) {
    if (!isLeader || !confirm('Remover esta tarefa?')) return
    const res = await fetch(`/api/pro-lideres/daily-tasks/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    if (res.ok) await load()
    else {
      const j = await res.json().catch(() => ({}))
      setError((j as { error?: string }).error || 'Erro ao remover.')
    }
  }

  async function toggleComplete(taskId: string, done: boolean, dateStr: string) {
    const method = done ? 'POST' : 'DELETE'
    const url =
      method === 'DELETE'
        ? `/api/pro-lideres/daily-tasks/${encodeURIComponent(taskId)}/complete?date=${encodeURIComponent(dateStr)}`
        : `/api/pro-lideres/daily-tasks/${encodeURIComponent(taskId)}/complete`
    const init: RequestInit = { method, credentials: 'include' }
    if (method === 'POST') {
      init.headers = { 'Content-Type': 'application/json' }
      init.body = JSON.stringify({ date: dateStr })
    }
    const res = await fetch(url, init)
    if (res.ok) await load()
    else {
      const j = await res.json().catch(() => ({}))
      setError((j as { error?: string }).error || 'Erro ao atualizar.')
    }
  }

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

  const reminderToday = (data?.reminders?.[String(todayDow)] ?? '').trim()

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">Principal</p>
        <h1 className="text-2xl font-bold text-gray-900">Tarefas diárias</h1>
        <p className="mt-1 max-w-2xl text-sm text-gray-600">
          {isLeader ? (
            <>
              <strong className="text-gray-800">Lembretes</strong> são só orientações por dia da semana (ex.: o que
              reforçar à segunda ou ao sábado). <strong className="text-gray-800">Tarefas de construção</strong> são o
              que o distribuidor executa nos dias que definires (segunda a sexta, só fins de semana, todos os dias, etc.)
              — sem data fixa no calendário; o registo de conclusão é por dia civil.
            </>
          ) : (
            <>
              Vê o lembrete de hoje, as tarefas que o líder definiu para o teu dia da semana e marca o que cumpriste
              hoje para acumular pontos.
            </>
          )}
        </p>
      </div>

      {!isLeader && data && (
        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
          <p className="text-sm font-semibold text-slate-900">
            Hoje ({PL_WEEKDAY_LABEL[todayDow]} · {todayStr})
          </p>
          {reminderToday ? (
            <p className="text-sm text-slate-800">
              <span className="font-medium text-slate-700">Lembrete do líder:</span> {reminderToday}
            </p>
          ) : (
            <p className="text-sm text-slate-500">Sem lembrete de texto para este dia da semana.</p>
          )}
        </div>
      )}

      {isLeader && (
        <div className="space-y-3 rounded-xl border border-indigo-100 bg-indigo-50/40 p-4">
          <div>
            <p className="text-sm font-semibold text-indigo-950">Lembretes por dia da semana</p>
            <p className="mt-0.5 text-xs text-indigo-900/80">
              Uma orientação por dia (opcional). Isto não conta como tarefa nem pontos — serve para alinhar o discurso
              da equipa.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {PL_WEEKDAY_ORDER.map((d) => (
              <label key={d} className="block">
                <span className="mb-1 block text-xs font-medium text-indigo-900">{PL_WEEKDAY_LABEL[d]}</span>
                <textarea
                  value={reminderDrafts[d] ?? ''}
                  onChange={(e) => setReminderDrafts((prev) => ({ ...prev, [d]: e.target.value }))}
                  className="min-h-[56px] w-full rounded-lg border border-indigo-200/80 bg-white px-3 py-2 text-sm text-gray-900"
                  placeholder="Opcional"
                  maxLength={4000}
                />
              </label>
            ))}
          </div>
          <button
            type="button"
            disabled={savingReminders}
            onClick={() => void saveReminders()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {savingReminders ? 'A guardar…' : 'Guardar lembretes'}
          </button>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-gray-900">Período do relatório</p>
        <p className="mb-2 text-xs text-gray-500">
          Ajusta o intervalo para ver pontos e conclusões registadas nesses dias (as tarefas em si não têm data).
        </p>
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

      {!isLeader && data && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-950">
          <strong>Pontos no período do relatório:</strong> {data.myPointsInRange}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{error}</div>
      )}

      {loading ? (
        <p className="text-gray-600">A carregar…</p>
      ) : (
        <>
          {isLeader && (
            <form onSubmit={(e) => void createTask(e)} className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div>
                <p className="text-sm font-semibold text-gray-900">Nova tarefa de construção</p>
                <p className="mt-0.5 text-xs text-gray-500">
                  Escolhe em que dias da semana esta ação deve ser executada (ex.: segunda a sexta, ou só sábado e
                  domingo).
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-xs font-medium text-gray-600">Título</span>
                  <input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Ex.: Contactar 3 pessoas sobre o plano"
                  />
                </label>
                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-xs font-medium text-gray-600">Detalhe (opcional)</span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[72px] w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-medium text-gray-600">Pontos por conclusão</span>
                  <input
                    type="number"
                    min={0}
                    max={100000}
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </label>
                <div className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-medium text-gray-600">Dias em que se executa</span>
                  <div className="flex flex-wrap gap-2">
                    {PL_WEEKDAY_ORDER.map((d) => (
                      <label
                        key={d}
                        className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium ${
                          executionWeekdays.has(d)
                            ? 'border-blue-400 bg-blue-50 text-blue-900'
                            : 'border-gray-200 bg-white text-gray-600'
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={executionWeekdays.has(d)}
                          onChange={() => toggleExecutionDay(d)}
                        />
                        {PL_WEEKDAY_LABEL[d]}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? 'A guardar…' : 'Adicionar tarefa'}
              </button>
            </form>
          )}

          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-4 py-3">
              <p className="text-sm font-semibold text-gray-900">Tarefas de construção</p>
              <p className="text-xs text-gray-500">Definição atual (não depende do período do relatório)</p>
            </div>
            <ul className="divide-y divide-gray-100">
              {(data?.tasks ?? []).length === 0 ? (
                <li className="px-4 py-6 text-sm text-gray-600">Nenhuma tarefa definida ainda.</li>
              ) : (
                (data?.tasks ?? []).map((t) => {
                  const days = t.execution_weekdays ?? []
                  const appliesToday = days.includes(todayDow)
                  const selfDone =
                    !isLeader &&
                    myUserId &&
                    appliesToday &&
                    (data?.completions ?? []).some(
                      (c) =>
                        c.task_id === t.id &&
                        c.member_user_id === myUserId &&
                        c.completed_on === todayStr
                    )
                  return (
                    <li key={t.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900">
                          {t.title} <span className="text-emerald-700">(+{t.points} pts)</span>
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500">
                          Executar: {formatExecutionWeekdays(days)}
                        </p>
                        {t.description ? <p className="mt-1 text-sm text-gray-600">{t.description}</p> : null}
                        {!isLeader && (
                          <div className="mt-2">
                            {!appliesToday ? (
                              <p className="text-sm text-gray-500">Esta tarefa não aplica ao dia de hoje.</p>
                            ) : (
                              <label className="flex cursor-pointer items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={selfDone}
                                  onChange={(e) => void toggleComplete(t.id, e.target.checked, todayStr)}
                                  className="h-4 w-4 rounded border-gray-300"
                                />
                                <span>Marcar como feita hoje ({todayStr})</span>
                              </label>
                            )}
                          </div>
                        )}
                      </div>
                      {isLeader && (
                        <button
                          type="button"
                          onClick={() => void deleteTask(t.id)}
                          className="shrink-0 text-sm font-medium text-red-600 hover:underline"
                        >
                          Remover
                        </button>
                      )}
                    </li>
                  )
                })
              )}
            </ul>
          </div>

          {isLeader && data && data.members.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">Pontos por pessoa (no período do relatório)</p>
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

          {isLeader && data && (data?.tasks ?? []).length > 0 && (
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
        </>
      )}
    </div>
  )
}
