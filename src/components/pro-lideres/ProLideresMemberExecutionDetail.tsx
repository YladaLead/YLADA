'use client'

import { useMemo, useRef, useEffect } from 'react'
import type { MemberDayReport, MemberExecutionReport, MemberTaskItem } from '@/lib/pro-lideres-daily-tasks-member-report'
import type {
  ProLideresDailyTaskCompletionRow,
  ProLideresDailyTaskCountRow,
  ProLideresDailyTaskRow,
} from '@/types/pro-lideres-daily-tasks'
import { buildMemberExecutionReport } from '@/lib/pro-lideres-daily-tasks-member-report'
import { formatYmdPtBrShort } from '@/lib/pro-lideres-dates-br'

type Props = {
  memberName: string
  userId: string
  from: string
  to: string
  tasks: ProLideresDailyTaskRow[]
  completions: ProLideresDailyTaskCompletionRow[]
  counts: ProLideresDailyTaskCountRow[]
  onClose: () => void
}

/** "8 / 10 pessoas" para tarefas com contador. */
function countLabelFor(item: MemberTaskItem): string | null {
  if (!item.task.count_enabled) return null
  const qty = item.quantity ?? 0
  const unit = item.task.count_label?.trim()
  const goal = item.task.count_goal
  const base = goal != null ? `${qty} / ${goal}` : `${qty}`
  return unit ? `${base} ${unit}` : base
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
            {day.fullDayComplete ? ' · tudo feito' : ''}
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
              {day.done.map((item) => {
                const { task } = item
                const countText = countLabelFor(item)
                return (
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
                    <p className="text-[11px] font-medium text-emerald-800">
                      {task.points} pts{countText ? ` · ${countText}` : ''}
                    </p>
                  </div>
                </li>
                )
              })}
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
            <>
              <ul className="space-y-1">
                {day.pending.map((item) => {
                  const { task } = item
                  const countText = countLabelFor(item)
                  return (
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
                      <p className="text-[11px] text-amber-800/80">
                        {task.points} pts{countText ? ` · ${countText}` : ''}
                      </p>
                    </div>
                  </li>
                  )
                })}
              </ul>
              {/* Dica quando não fez nada no dia */}
              {day.doneCount === 0 && day.applicableCount > 0 && (
                <p className="mt-2 rounded-lg bg-red-50 px-2 py-1.5 text-[11px] leading-snug text-red-700">
                  💡 Dia sem nenhuma execução — verifique se houve motivo específico antes de abordar.
                </p>
              )}
              {/* Dica quando fez pouco */}
              {day.doneCount > 0 && pct < 50 && (
                <p className="mt-2 rounded-lg bg-amber-50 px-2 py-1.5 text-[11px] leading-snug text-amber-800">
                  💡 Menos da metade feita neste dia — pergunte o que impediu completar as demais.
                </p>
              )}
            </>
          )}
        </section>
      </div>
    </article>
  )
}

type OrientLevel = 'alert' | 'warn' | 'ok'
type OrientCard = { level: OrientLevel; title: string; text: string }

function memberOrientation(pct: number, totalDone: number, totalPossible: number, name: string): OrientCard {
  const n = name.split(' ')[0]
  if (totalPossible === 0) return { level: 'ok', title: 'Sem tarefas previstas', text: 'Nenhuma tarefa estava programada para este período.' }
  if (pct === 0) return {
    level: 'alert', title: 'Nenhuma tarefa executada',
    text: `${n} não marcou nenhuma tarefa. Antes de cobrar, entenda o que está travando — pode ser dificuldade técnica, falta de hábito ou algo pessoal. Um contato empático abre mais portas que uma cobrança direta.`
  }
  if (pct < 40) return {
    level: 'alert', title: 'Baixo engajamento',
    text: `${n} completou menos de 40% das tarefas. Identifique qual tarefa específica está travando e ofereça ajuda prática só para aquela — não para todas de uma vez.`
  }
  if (pct < 70) return {
    level: 'warn', title: 'Engajamento moderado',
    text: `${n} está tentando mas não completa o ciclo. Pergunte o que ficou de fora e por quê — muitas vezes é uma tarefa que ela não sabe como fazer, não falta de vontade.`
  }
  if (pct < 100) return {
    level: 'warn', title: 'Quase lá!',
    text: `${n} tem ótimo engajamento. Um incentivo direto pode fechar o ciclo. Pergunte o que faltou fazer e se precisa de apoio para aquela tarefa específica.`
  }
  return {
    level: 'ok', title: 'Execução perfeita!',
    text: `${n} completou 100% das tarefas. Parabenize ela diretamente e use como exemplo para a equipe — reconhecimento público acelera a cultura de execução.`
  }
}

function OrientationCard({ card }: { card: OrientCard }) {
  const styles = {
    alert: 'border-red-200 bg-red-50 text-red-900',
    warn: 'border-amber-200 bg-amber-50 text-amber-900',
    ok: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  }
  const icon = { alert: '🔴', warn: '⚠️', ok: '✅' }
  return (
    <div className={`rounded-xl border px-3 py-3 ${styles[card.level]}`}>
      <p className="text-xs font-bold uppercase tracking-wide opacity-70 mb-1">Orientação para o líder</p>
      <p className="font-semibold text-sm leading-snug mb-1">{icon[card.level]} {card.title}</p>
      <p className="text-sm leading-relaxed">{card.text}</p>
    </div>
  )
}

function SummaryBar({ report, memberName }: { report: MemberExecutionReport; memberName: string }) {
  const total = report.totalDone + report.totalPending
  const pct = total > 0 ? Math.round((report.totalDone / total) * 100) : 0
  const card = memberOrientation(pct, report.totalDone, total, memberName)

  return (
    <div className="space-y-2">
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
            className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] text-gray-500">{pct}% das tarefas do período concluídas</p>
      </div>
      <OrientationCard card={card} />
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
  counts,
  onClose,
}: Props) {
  const panelRef = useRef<HTMLDivElement>(null)

  const report = useMemo(
    () => buildMemberExecutionReport(userId, tasks, completions, from, to, counts),
    [userId, tasks, completions, from, to, counts]
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
        <SummaryBar report={report} memberName={memberName} />

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
