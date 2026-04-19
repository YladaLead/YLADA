'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'
import {
  PL_WEEKDAY_ORDER,
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

type TaskRowEdit = {
  id: string
  points: string
  title: string
  description: string
}

export function ProLideresDailyTasksClient() {
  const router = useRouter()
  const pathname = usePathname()
  const { isLeaderWorkspace: isLeader, dailyTasksVisibleToTeam } = useProLideresPainel()
  const { user } = useAuth()
  const myUserId = user?.id ?? ''

  const [teamVisible, setTeamVisible] = useState(dailyTasksVisibleToTeam)
  const [savingTeamVisible, setSavingTeamVisible] = useState(false)

  useEffect(() => {
    setTeamVisible(dailyTasksVisibleToTeam)
  }, [dailyTasksVisibleToTeam])

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
  const [saving, setSaving] = useState(false)
  const [taskRows, setTaskRows] = useState<TaskRowEdit[]>([])
  const [savingEdits, setSavingEdits] = useState(false)
  const [savingToday, setSavingToday] = useState(false)
  const [todayDraft, setTodayDraft] = useState<Set<string>>(() => new Set())
  const [bonusPts, setBonusPts] = useState('10')
  const [savingBonus, setSavingBonus] = useState(false)

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
      setBonusPts(String(payload.fullDayBonusPoints ?? 10))
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
    if (!data || !myUserId || isLeader) return
    const done = new Set(
      data.completions
        .filter((c) => c.completed_on === todayStr && c.member_user_id === myUserId)
        .map((c) => c.task_id)
    )
    setTodayDraft(done)
  }, [data, todayStr, myUserId, isLeader])

  const tasksSnapshot = useMemo(() => {
    const list = data?.tasks ?? []
    return list.map((t) => `${t.id}:${t.points}:${t.title}:${t.description ?? ''}`).join('|')
  }, [data?.tasks])

  useEffect(() => {
    if (!isLeader || !data?.tasks) return
    setTaskRows(
      data.tasks.map((t) => ({
        id: t.id,
        points: String(t.points),
        title: t.title,
        description: t.description ?? '',
      }))
    )
  }, [isLeader, tasksSnapshot, data?.tasks])

  async function updateTeamVisible(next: boolean) {
    if (!isLeader) return
    setSavingTeamVisible(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/tenant', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daily_tasks_visible_to_team: next }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((json as { error?: string }).error || 'Erro ao atualizar visibilidade.')
        return
      }
      setTeamVisible(next)
      router.refresh()
    } catch {
      setError('Erro de rede.')
    } finally {
      setSavingTeamVisible(false)
    }
  }

  async function saveFullDayBonus() {
    if (!isLeader) return
    setSavingBonus(true)
    setError(null)
    try {
      const n = Math.min(100000, Math.max(0, Math.floor(Number(bonusPts) || 0)))
      const res = await fetch('/api/pro-lideres/tenant', {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ daily_tasks_full_day_bonus_points: n }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((json as { error?: string }).error || 'Erro ao guardar bónus.')
        return
      }
      setBonusPts(String(n))
      router.refresh()
      await load()
    } catch {
      setError('Erro de rede.')
    } finally {
      setSavingBonus(false)
    }
  }

  async function saveTodayExecution() {
    if (isLeader || !myUserId) return
    setSavingToday(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/daily-tasks/today', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: todayStr,
          completed_task_ids: Array.from(todayDraft),
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((json as { error?: string }).error || 'Erro ao guardar.')
        return
      }
      await load()
    } catch {
      setError('Erro de rede.')
    } finally {
      setSavingToday(false)
    }
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault()
    if (!isLeader) return
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
          execution_weekdays: [...PL_WEEKDAY_ORDER],
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
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function flushTaskRowEdits() {
    if (!isLeader || !data?.tasks.length) return
    setSavingEdits(true)
    setError(null)
    try {
      for (const row of taskRows) {
        const orig = data.tasks.find((t) => t.id === row.id)
        if (!orig) continue
        const pts = Math.min(100000, Math.max(0, Math.floor(Number(row.points) || 0)))
        const tit = row.title.trim()
        if (tit.length < 2) {
          setError('Cada tarefa precisa de um título com pelo menos 2 caracteres.')
          return
        }
        const desc = row.description.trim()
        const descNorm = desc || null
        const same =
          orig.points === pts && orig.title === tit && (orig.description ?? '') === (descNorm ?? '')
        if (same) continue
        const res = await fetch(`/api/pro-lideres/daily-tasks/${encodeURIComponent(row.id)}`, {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: tit,
            description: descNorm,
            points: pts,
            execution_weekdays: [...PL_WEEKDAY_ORDER],
          }),
        })
        const j = await res.json().catch(() => ({}))
        if (!res.ok) {
          setError((j as { error?: string }).error || 'Erro ao guardar uma tarefa.')
          return
        }
      }
      await load()
    } catch {
      setError('Erro de rede.')
    } finally {
      setSavingEdits(false)
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

  const applicableToday =
    data?.tasks.filter((t) => (t.execution_weekdays ?? []).includes(todayDow)) ?? []

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        {isLeader ? (
          <p className="text-sm font-medium text-blue-600">Principal</p>
        ) : null}
        <h1 className="text-2xl font-bold text-gray-900">Tarefas diárias</h1>
        {isLeader ? (
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            Define as <strong className="text-gray-800">tarefas do dia</strong> (e em que dias da semana contam),
            pontos por tarefa e o <strong className="text-gray-800">bónus</strong> quando alguém marca tudo. A equipe
            usa uma checklist simples: marca, guarda uma vez por dia e pontua.
          </p>
        ) : (
          <p className="mt-1 max-w-xl text-sm text-gray-500">
            Marca o que fizeste hoje e guarda. Abaixo podes ver o relatório por dia, semana ou mês.
          </p>
        )}
      </div>

      {isLeader && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={teamVisible}
              disabled={savingTeamVisible}
              onChange={(e) => void updateTeamVisible(e.target.checked)}
            />
            <div>
              <p className="text-sm font-semibold text-gray-900">Mostrar Tarefas diárias à equipe</p>
              <p className="mt-1 text-xs text-gray-600">
                Quando desligas, os membros deixam de ver esta área no menu e na visão geral do painel.
              </p>
            </div>
          </label>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm font-semibold text-gray-900">Bónus de dia completo</p>
            <p className="mt-0.5 text-xs text-gray-600">
              Pontos extra quando alguém marca todas as tarefas que aplicam àquele dia da semana (uma vez por dia).
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-600">Pontos do bónus</span>
                <input
                  type="number"
                  min={0}
                  max={100000}
                  value={bonusPts}
                  onChange={(e) => setBonusPts(e.target.value)}
                  className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </label>
              <button
                type="button"
                disabled={savingBonus}
                onClick={() => void saveFullDayBonus()}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {savingBonus ? 'A guardar…' : 'Guardar bónus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {!isLeader && data && (
        <div className="overflow-hidden rounded-2xl border border-emerald-200/70 bg-white shadow-sm">
          <div className="border-b border-emerald-100/80 px-4 py-4">
            <p className="text-lg font-semibold capitalize leading-snug text-gray-900">
              {formatCivilDateLongPt(todayStr)}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Marca o que fizeste. Se completares tudo o que aplica a hoje:{' '}
              <span className="font-medium text-emerald-800">+{data.fullDayBonusPoints ?? 0} pts</span> extra.
            </p>
          </div>
          <ul className="divide-y divide-gray-100">
            {applicableToday.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-gray-500">Sem tarefas para hoje.</li>
            ) : (
              applicableToday.map((t) => {
                const checked = todayDraft.has(t.id)
                return (
                  <li key={t.id} className="flex gap-3 px-4 py-3.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => {
                        setTodayDraft((prev) => {
                          const n = new Set(prev)
                          if (n.has(t.id)) n.delete(t.id)
                          else n.add(t.id)
                          return n
                        })
                      }}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-medium leading-snug text-gray-900">
                        <span className="text-emerald-700">{t.points} pts</span>
                        <span className="mx-2 text-gray-200">·</span>
                        {t.title}
                      </p>
                      {t.description ? (
                        <p className="mt-1.5 text-sm leading-relaxed text-emerald-800/90">{t.description}</p>
                      ) : null}
                    </div>
                  </li>
                )
              })
            )}
          </ul>
          <div className="border-t border-gray-100 p-4">
            <button
              type="button"
              disabled={savingToday || applicableToday.length === 0}
              onClick={() => void saveTodayExecution()}
              className="w-full rounded-xl bg-emerald-700 px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingToday ? 'A guardar…' : 'Salvar execução de hoje'}
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-gray-900">
          {isLeader ? 'Período do relatório' : 'Relatório'}
        </p>
        <p className="mb-2 text-xs text-gray-500">
          {isLeader
            ? 'Ajusta o intervalo para ver pontos e conclusões registadas nesses dias (as tarefas em si não têm data).'
            : 'Vê os teus pontos no dia, na semana ou no mês — usa os atalhos ou escolhe as datas.'}
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
        <div className="rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total no período</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-gray-900">{data.myPointsInRange}</p>
          <p className="text-xs text-gray-500">pontos · inclui bónus quando completas tudo num dia</p>
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

          {isLeader && (
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
                    return (
                      <li
                        key={t.id}
                        className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900">
                            {t.title} <span className="text-emerald-700">(+{t.points} pts)</span>
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            Executar: {formatExecutionWeekdays(days)}
                          </p>
                          {t.description ? <p className="mt-1 text-sm text-gray-600">{t.description}</p> : null}
                        </div>
                        <button
                          type="button"
                          onClick={() => void deleteTask(t.id)}
                          className="shrink-0 text-sm font-medium text-red-600 hover:underline"
                        >
                          Remover
                        </button>
                      </li>
                    )
                  })
                )}
              </ul>
            </div>
          )}

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
