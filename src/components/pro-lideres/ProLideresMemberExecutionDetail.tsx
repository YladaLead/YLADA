'use client'

import { useMemo, useRef, useEffect } from 'react'
import type { MemberDayReport, MemberExecutionReport } from '@/lib/pro-lideres-daily-tasks-member-report'
import type { ProLideresDailyTaskCompletionRow, ProLideresDailyTaskRow } from '@/types/pro-lideres-daily-tasks'
import { buildMemberExecutionReport } from '@/lib/pro-lideres-daily-tasks-member-report'
import { formatYmdPtBrShort } from '@/lib/pro-lideres-dates-br'

type Props = {
  memberName: string
  userId: string
  from: string
  to: string
  tasks: ProLideresDailyTaskRow[]
  completions: ProLideresDailyTaskCompletionRow[]
  fullDayBonusPoints: number
  onClose: () => void
}

function DayCard({ day }: { day: MemberDayReport }) {
  const pct =
    day.applicableCount > 0 ? Math.round((day.doneCount / day.applicableCount) * 100) : 0

  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="flex items-center gap-3 border-b border-gray-100 bg-gray-50/90 px-3 py-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900">{day.label}</p>
          <p className="text-[11px] text-gray-500">
            {day.doneCount} de {day.applicableCount} tarefas
            {day.fullDayComplete ? ' · dia completo' : ''}
          </p>
        </div>
        <div className="flex w-20 shrink-0 flex-col items-end gap-1">
          <span className="text-xs font-semibold tabular-nums text-gray-700">{pct}%</span>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-emerald-500' : pct > 0 ? 'bg-blue-500' : 'bg-gray-300'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </header>

      <div className="grid gap-0 sm:grid-cols-2">
        <section className="border-b border-gray-100 p-2 sm:border-b-0 sm:border-r">
          <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
            Fez
          </p>
          {day.done.length === 0 ? (
            <p className="px-1 py-2 text-xs text-gray-400">Nenhuma tarefa neste dia.</p>
          ) : (
            <ul className="space-y-1">
              {day.done.map(({ task }) => (
                <li
                  key={task.id}
                  className="flex items-start gap-2 rounded-lg bg-emerald-50/90 px-2 py-1.5"
                >
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white"
                    aria-hidden
                  >
                    ✓
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug text-gray-900">{task.title}</p>
                    <p className="text-[11px] font-medium text-emerald-800">{task.points} pts</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="p-2">
          <p className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wide text-amber-800">
            Não fez
          </p>
          {day.pending.length === 0 ? (
            <p className="px-1 py-2 text-xs text-gray-400">Tudo certo neste dia.</p>
          ) : (
            <ul className="space-y-1">
              {day.pending.map(({ task }) => (
                <li
                  key={task.id}
                  className="flex items-start gap-2 rounded-lg border border-dashed border-amber-200/90 bg-amber-50/50 px-2 py-1.5"
                >
                  <span
                    className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-amber-300 bg-white text-[10px] text-amber-700"
                    aria-hidden
                  >
                    ·
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug text-gray-700">{task.title}</p>
                    <p className="text-[11px] text-amber-800/80">{task.points} pts</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </article>
  )
}

function SummaryBar({ report }: { report: MemberExecutionReport }) {
  const total = report.totalDone + report.totalPending
  const pct = total > 0 ? Math.round((report.totalDone / total) * 100) : 0

  return (
    <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50/90 to-white p-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium text-blue-800/80">No período</p>
          <p className="mt-0.5 text-sm text-gray-800">
            <span className="font-semibold text-emerald-700">{report.totalDone}</span> feitas
            <span className="text-gray-400"> · </span>
            <span className="font-semibold text-amber-800">{report.totalPending}</span> pendentes
          </p>
        </div>
        <p className="text-2xl font-bold tabular-nums text-blue-700">{report.points} pts</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-blue-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] text-gray-500">{pct}% das tarefas do período concluídas</p>
    </div>
  )
}

export function ProLideresMemberExecutionDetail({
  memberName,
  userId,
  from,
  to,
  tasks,
  completions,
  fullDayBonusPoints,
  onClose,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  const report = useMemo(
    () => buildMemberExecutionReport(userId, tasks, completions, from, to, fullDayBonusPoints),
    [userId, tasks, completions, from, to, fullDayBonusPoints]
  )

  const periodLabel =
    from === to
      ? formatYmdPtBrShort(from)
      : `${formatYmdPtBrShort(from)} – ${formatYmdPtBrShort(to)}`

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [userId, from, to])

  return (
    <div ref={panelRef} className="border-t border-blue-100 bg-blue-50/30">
      <div className="flex items-start justify-between gap-2 px-3 py-3 sm:px-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-blue-700">Análise do membro</p>
          <h2 className="truncate text-lg font-bold text-gray-900">{memberName}</h2>
          <p className="text-xs text-gray-500">{periodLabel}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50"
        >
          Voltar à equipe
        </button>
      </div>

      <div className="space-y-3 px-3 pb-4 sm:px-4">
        <SummaryBar report={report} />

        {report.days.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-6 text-center text-sm text-gray-600">
            Nenhum dia com tarefas previstas neste período.
          </p>
        ) : (
          report.days.map((day) => <DayCard key={day.ymd} day={day} />)
        )}
      </div>
    </div>
  )
}
