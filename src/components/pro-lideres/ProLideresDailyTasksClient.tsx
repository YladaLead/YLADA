'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
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
    if (!isLeader || !data) return
    for (const row of taskRows) {
      if (row.title.trim().length < 2) {
        setError('Cada tarefa precisa de um título com pelo menos 2 caracteres.')
        return
      }
    }
    setSavingEdits(true)
    setError(null)
    try {
      for (const row of taskRows) {
        const orig = data.tasks.find((t) => t.id === row.id)
        if (!orig) continue
        const pts = Math.min(100000, Math.max(0, Math.floor(Number(row.points) || 0)))
        const tit = row.title.trim()
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

  const execucaoHref = '/pro-lideres/painel/tarefas/execucao'

  const navPill =
    'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors'
  const navPillActive = 'bg-blue-700 text-white shadow-sm'
  const navPillInactive =
    'border border-blue-200 bg-white text-blue-900 hover:bg-blue-50'

  function updateTaskRow(id: string, patch: Partial<TaskRowEdit>) {
    setTaskRows((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  return (
    <div className="max-w-4xl space-y-6">
      {isLeader ? (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tarefas diárias</h1>
            <p className="mt-1 max-w-xl text-sm text-gray-600">
              Preenche as linhas como o teu time vai ver: pontos, tarefa e texto extra opcional (aparece em destaque
              azul para eles). Para análises e quem executou, usa <strong className="font-semibold text-gray-800">Ver
              execução do time</strong>.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:shrink-0 sm:items-end">
            <div className="flex flex-wrap gap-2">
              <span className={`${navPill} ${navPillActive} cursor-default`} aria-current="page">
                Criar tarefas diárias
              </span>
              <Link href={execucaoHref} className={`${navPill} ${navPillInactive}`}>
                Ver execução do time
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tarefas diárias</h1>
          <p className="mt-1 max-w-xl text-sm text-gray-500">
            Marca o que fizeste hoje e guarda. Abaixo vês o teu relatório de pontos.
          </p>
        </div>
      )}

      {isLeader && (
        <details className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <summary className="cursor-pointer list-none text-sm font-semibold text-gray-900 marker:hidden [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Definições da equipe e bónus</span>
            <span className="hidden group-open:inline">Definições da equipe e bónus (fechar)</span>
          </summary>
          <div className="mt-4 space-y-4 border-t border-gray-100 pt-4">
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
                Pontos extra quando alguém marca todas as tarefas do dia (uma vez por dia civil).
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
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {savingBonus ? 'A guardar…' : 'Guardar bónus'}
                </button>
              </div>
            </div>
          </div>
        </details>
      )}

      {!isLeader && data && (
        <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-md">
          <div className="px-4 pb-2 pt-5 sm:px-5">
            <p className="text-[15px] leading-snug text-gray-900">
              Marque o que você fez (cada item vale os pontos ao lado).
            </p>
            <p className="mt-2 text-[15px] leading-snug text-gray-900">
              <span className="font-bold">Marcando tudo:</span>{' '}
              <span className="font-bold text-blue-800">+{data.fullDayBonusPoints ?? 0} pts</span> bônus de dia
              completo.
            </p>
            <p className="mt-3 text-xs text-gray-500">Hoje · {todayStr}</p>
          </div>
          <ul className="divide-y divide-gray-100 border-t border-gray-100">
            {applicableToday.length === 0 ? (
              <li className="px-4 py-10 text-center text-sm text-gray-500 sm:px-5">Sem tarefas para hoje.</li>
            ) : (
              applicableToday.map((t) => {
                const checked = todayDraft.has(t.id)
                return (
                  <li key={t.id} className="flex gap-3 px-4 py-4 sm:px-5">
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
                      className="mt-0.5 h-[18px] w-[18px] shrink-0 rounded border-gray-400 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex min-w-0 flex-1 gap-3">
                      <span className="shrink-0 text-[15px] font-bold text-blue-700">{t.points} pts</span>
                      <div className="min-w-0">
                        <p className="text-[15px] leading-snug text-gray-900">{t.title}</p>
                        {t.description ? (
                          <p className="mt-1.5 text-sm leading-relaxed text-blue-700">{t.description}</p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                )
              })
            )}
          </ul>
          <div className="border-t border-gray-100 p-4 sm:p-5">
            <button
              type="button"
              disabled={savingToday || applicableToday.length === 0}
              onClick={() => void saveTodayExecution()}
              className="w-full rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingToday ? 'A guardar…' : 'Salvar execução de hoje'}
            </button>
          </div>
        </div>
      )}

      {!isLeader && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <p className="mb-2 text-sm font-semibold text-gray-900">Relatório</p>
          <p className="mb-2 text-xs text-gray-500">
            Vê os teus pontos no dia, na semana ou no mês — usa os atalhos ou escolhe as datas.
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
      )}

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
            <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-md">
              <div className="border-b border-gray-100 px-4 py-4 sm:px-5">
                <p className="text-sm font-semibold text-gray-900">Criar tarefas diárias</p>
                <p className="mt-1 text-xs text-gray-500">
                  Cada linha é uma tarefa no cartão do membro. Edita à vontade e guarda as alterações; usa + para
                  acrescentar e ✕ para apagar.
                </p>
              </div>

              <ul className="divide-y divide-gray-100">
                {taskRows.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-gray-500 sm:px-5">
                    Ainda não há tarefas. Adiciona a primeira linha em baixo.
                  </li>
                ) : (
                  taskRows.map((row) => (
                    <li key={row.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:px-5">
                      <label className="block w-20 shrink-0">
                        <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-500">
                          Pontos
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={100000}
                          value={row.points}
                          onChange={(e) => updateTaskRow(row.id, { points: e.target.value })}
                          className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm font-semibold text-blue-800"
                        />
                      </label>
                      <div className="min-w-0 flex-1 space-y-2">
                        <label className="block">
                          <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-gray-500">
                            Tarefa
                          </span>
                          <input
                            value={row.title}
                            onChange={(e) => updateTaskRow(row.id, { title: e.target.value })}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
                          />
                        </label>
                        <label className="block">
                          <span className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-blue-800/80">
                            Texto extra (opcional, destaque para o membro)
                          </span>
                          <input
                            value={row.description}
                            onChange={(e) => updateTaskRow(row.id, { description: e.target.value })}
                            className="w-full rounded-lg border border-blue-200 bg-blue-50/60 px-3 py-2 text-sm text-blue-950 placeholder:text-blue-800/40"
                            placeholder="Ex.: frase ou roteiro de apoio"
                          />
                        </label>
                      </div>
                      <div className="flex shrink-0 justify-end sm:pt-6">
                        <button
                          type="button"
                          title="Remover tarefa"
                          onClick={() => void deleteTask(row.id)}
                          className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-lg font-medium text-red-600 hover:bg-red-50"
                        >
                          ✕
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>

              <div className="space-y-3 border-t border-gray-100 bg-gray-50/50 px-4 py-4 sm:px-5">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={savingEdits || taskRows.length === 0}
                    onClick={() => void flushTaskRowEdits()}
                    className="rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {savingEdits ? 'A guardar…' : 'Guardar alterações nas tarefas'}
                  </button>
                </div>

                <form
                  onSubmit={(e) => void createTask(e)}
                  className="rounded-xl border border-dashed border-blue-300/80 bg-white p-4"
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-900">Nova linha</p>
                  <div className="grid gap-3 sm:grid-cols-[5.5rem_1fr]">
                    <label className="block">
                      <span className="mb-1 block text-[11px] font-medium text-gray-500">Pontos</span>
                      <input
                        type="number"
                        min={0}
                        max={100000}
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-2 py-2 text-sm font-semibold text-blue-800"
                      />
                    </label>
                    <label className="block sm:col-span-1">
                      <span className="mb-1 block text-[11px] font-medium text-gray-500">Tarefa</span>
                      <input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                        placeholder="O que o membro deve fazer"
                      />
                    </label>
                    <label className="block sm:col-span-2">
                      <span className="mb-1 block text-[11px] font-medium text-blue-800/80">
                        Texto extra (opcional)
                      </span>
                      <input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-lg border border-blue-200 bg-blue-50/50 px-3 py-2 text-sm text-blue-950"
                        placeholder="Aparece em azul no cartão do membro"
                      />
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={saving}
                    className="mt-4 w-full rounded-xl border-2 border-blue-700 bg-white py-2.5 text-sm font-bold text-blue-900 hover:bg-blue-50 disabled:opacity-60 sm:w-auto sm:px-8"
                  >
                    {saving ? 'A adicionar…' : '+ Adicionar tarefa'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
