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
import { proLideresTodayYmdBr, proLideresYesterdayYmdBr } from '@/lib/pro-lideres-dates-br'

type ApiGet = {
  tasks: ProLideresDailyTaskRow[]
  completions: ProLideresDailyTaskCompletionRow[]
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

type TaskRowEdit = {
  id: string
  points: string
  title: string
  description: string
}

function taskIdSetsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false
  for (const id of a) {
    if (!b.has(id)) return false
  }
  return true
}

function buildWhatsAppShareMessage(
  tasks: ProLideresDailyTaskRow[],
  completedIds: Set<string>,
  dateStr: string
): string {
  const completed = tasks.filter((t) => completedIds.has(t.id))
  const totalPts = completed.reduce((sum, t) => sum + t.points, 0)
  const lines = completed.map((t) => `✔️ ${t.title} (+${t.points} pt${t.points !== 1 ? 's' : ''})`)
  const d = new Date(`${dateStr}T12:00:00`)
  const dateBr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  return [
    `✅ *Tarefas de hoje — ${dateBr}*`,
    '',
    lines.join('\n'),
    '',
    `🏆 Total: *${totalPts} pontos*`,
  ].join('\n')
}

/** Polyfill para roundRect — compatível com todos os browsers. */
function canvasRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

/** Gera um PNG com o card de resultado do dia (tarefas feitas + não feitas). */
async function generateShareImage(
  tasks: ProLideresDailyTaskRow[],
  completedIds: Set<string>,
  dateStr: string
): Promise<Blob> {
  const SCALE = 2
  const W = 600
  const ROW_H = 56
  const LABEL_H = 32   // faixa de label "PRO LÍDERES · YLADA" no topo
  const HEADER_H = 110 // cabeçalho principal abaixo do label
  const FOOTER_H = 64
  const PADDING = 20
  const H = LABEL_H + HEADER_H + tasks.length * ROW_H + FOOTER_H + PADDING

  const canvas = document.createElement('canvas')
  canvas.width = W * SCALE
  canvas.height = H * SCALE
  const ctx = canvas.getContext('2d')!
  ctx.scale(SCALE, SCALE)

  const font = (size: number, weight: string = 'normal') =>
    `${weight} ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

  // Fundo branco
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  // Faixa de label topo — azul escuro
  ctx.fillStyle = '#1e3a5f'
  ctx.fillRect(0, 0, W, LABEL_H)
  ctx.fillStyle = '#ffffff'
  ctx.font = font(11, 'bold')
  ctx.textAlign = 'center'
  ctx.fillText('P R O  L Í D E R E S   ·   Y L A D A', W / 2, LABEL_H / 2 + 4)
  ctx.textAlign = 'left'

  // Header — azul suave (abaixo do label)
  const grad = ctx.createLinearGradient(0, LABEL_H, W, LABEL_H + HEADER_H)
  grad.addColorStop(0, '#60a5fa') // blue-400
  grad.addColorStop(1, '#3b82f6') // blue-500
  ctx.fillStyle = grad
  ctx.fillRect(0, LABEL_H, W, HEADER_H)

  // Título principal
  ctx.fillStyle = '#ffffff'
  ctx.font = font(22, 'bold')
  ctx.fillText('Minhas tarefas do dia', PADDING, LABEL_H + 40)

  const d = new Date(`${dateStr}T12:00:00`)
  const dateBr = d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
  ctx.font = font(13)
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.fillText(dateBr.charAt(0).toUpperCase() + dateBr.slice(1), PADDING, LABEL_H + 62)

  // Badge de pontos (canto direito do header)
  const completedTasks = tasks.filter((t) => completedIds.has(t.id))
  const totalPts = completedTasks.reduce((s, t) => s + t.points, 0)
  const maxPts = tasks.reduce((s, t) => s + t.points, 0)

  ctx.fillStyle = 'rgba(255,255,255,0.18)'
  canvasRoundRect(ctx, W - 104, LABEL_H + 12, 88, 76, 14)
  ctx.fill()

  ctx.fillStyle = '#ffffff'
  ctx.font = font(30, 'bold')
  ctx.textAlign = 'center'
  ctx.fillText(String(totalPts), W - 60, LABEL_H + 56)
  ctx.font = font(11)
  ctx.fillStyle = 'rgba(255,255,255,0.80)'
  ctx.fillText(`de ${maxPts} pts`, W - 60, LABEL_H + 74)
  ctx.textAlign = 'left'

  // Linha separadora leve
  ctx.strokeStyle = '#e5e7eb'
  ctx.lineWidth = 1

  // Linhas de tarefas
  let y = LABEL_H + HEADER_H
  for (const t of tasks) {
    const done = completedIds.has(t.id)

    // Fundo da linha
    ctx.fillStyle = done ? '#f0fdf4' : '#f9fafb'
    ctx.fillRect(0, y, W, ROW_H - 1)
    ctx.strokeStyle = '#f3f4f6'
    ctx.strokeRect(0, y + ROW_H - 1, W, 1)

    const cy = y + ROW_H / 2

    // Círculo indicador
    ctx.beginPath()
    ctx.arc(PADDING + 14, cy, 14, 0, Math.PI * 2)
    ctx.fillStyle = done ? '#22c55e' : '#d1d5db'
    ctx.fill()

    // Ícone dentro do círculo
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2.2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (done) {
      // checkmark
      ctx.beginPath()
      ctx.moveTo(PADDING + 7, cy)
      ctx.lineTo(PADDING + 13, cy + 6)
      ctx.lineTo(PADDING + 22, cy - 6)
      ctx.stroke()
    } else {
      // x
      ctx.beginPath()
      ctx.moveTo(PADDING + 7, cy - 6)
      ctx.lineTo(PADDING + 21, cy + 6)
      ctx.moveTo(PADDING + 21, cy - 6)
      ctx.lineTo(PADDING + 7, cy + 6)
      ctx.stroke()
    }

    // Título da tarefa
    ctx.fillStyle = done ? '#111827' : '#9ca3af'
    ctx.font = done ? font(15, '500') : font(15)
    ctx.fillText(t.title, PADDING + 36, cy + 5)

    // Pontos (direita)
    ctx.fillStyle = done ? '#16a34a' : '#d1d5db'
    ctx.font = font(13, 'bold')
    ctx.textAlign = 'right'
    ctx.fillText(`+${t.points} pts`, W - PADDING, cy + 5)
    ctx.textAlign = 'left'

    y += ROW_H
  }

  // Footer
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, y, W, FOOTER_H + PADDING)
  ctx.strokeStyle = '#e5e7eb'
  ctx.strokeRect(0, y, W, 1)

  ctx.fillStyle = '#6b7280'
  ctx.font = font(13)
  ctx.textAlign = 'center'
  ctx.fillText(
    `${completedTasks.length} de ${tasks.length} tarefas concluídas · ${totalPts} de ${maxPts} pontos`,
    W / 2,
    y + 28
  )
  ctx.fillStyle = '#93c5fd'
  ctx.font = font(11, 'bold')
  ctx.fillText('Pro Líderes · YLADA', W / 2, y + 48)
  ctx.textAlign = 'left'

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('canvas toBlob failed'))), 'image/png')
  })
}

export function ProLideresDailyTasksClient() {
  const router = useRouter()
  const { isLeaderWorkspace: isLeader, dailyTasksVisibleToTeam, painelBasePath } = useProLideresPainel()
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
  const [generatingShare, setGeneratingShare] = useState(false)
  const [todayDraft, setTodayDraft] = useState<Set<string>>(() => new Set())
  const [todaySaved, setTodaySaved] = useState<Set<string>>(() => new Set())
  const [todaySaveOk, setTodaySaveOk] = useState(true)

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

  const loadTodayChecklist = useCallback(async () => {
    if (!myUserId) return
    try {
      const res = await fetch(
        `/api/pro-lideres/daily-tasks?from=${encodeURIComponent(todayStr)}&to=${encodeURIComponent(todayStr)}`,
        { credentials: 'include' }
      )
      const json = await res.json().catch(() => ({}))
      if (!res.ok) return
      const completions = (json as ApiGet).completions ?? []
      const done = new Set(
        completions.filter((c) => c.member_user_id === myUserId).map((c) => c.task_id)
      )
      setTodayDraft(done)
      setTodaySaved(new Set(done))
      setTodaySaveOk(true)
    } catch {
      /* mantém rascunho local */
    }
  }, [myUserId, todayStr])

  useEffect(() => {
    void loadTodayChecklist()
  }, [loadTodayChecklist])

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

  async function saveTodayExecution(completedIds: Set<string>): Promise<boolean> {
    if (!myUserId) return false
    setSavingToday(true)
    setError(null)
    try {
      const res = await fetch('/api/pro-lideres/daily-tasks/today', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: todayStr,
          completed_task_ids: Array.from(completedIds),
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((json as { error?: string }).error || 'Erro ao salvar.')
        setTodaySaveOk(false)
        await loadTodayChecklist()
        return false
      }
      setTodaySaved(new Set(completedIds))
      setTodaySaveOk(true)
      void load()
      return true
    } catch {
      setError('Erro de rede.')
      setTodaySaveOk(false)
      await loadTodayChecklist()
      return false
    } finally {
      setSavingToday(false)
    }
  }

  function toggleTodayTask(taskId: string) {
    if (savingToday) return
    const next = new Set(todayDraft)
    if (next.has(taskId)) next.delete(taskId)
    else next.add(taskId)
    setTodayDraft(next)
    if (taskIdSetsEqual(next, todaySaved)) {
      setTodaySaveOk(true)
    }
  }

  async function saveTodayDraft() {
    await saveTodayExecution(todayDraft)
  }

  async function handleShare() {
    if (generatingShare || applicableToday.length === 0) return
    setGeneratingShare(true)
    try {
      const blob = await generateShareImage(applicableToday, todaySaved, todayStr)
      const file = new File([blob], 'tarefas-do-dia.png', { type: 'image/png' })
      if (
        typeof navigator !== 'undefined' &&
        navigator.share &&
        navigator.canShare?.({ files: [file] })
      ) {
        await navigator.share({ files: [file], title: 'Minhas tarefas do dia' })
      } else {
        // Fallback desktop: baixa a imagem + abre WhatsApp com texto
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'tarefas-do-dia.png'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        setTimeout(() => URL.revokeObjectURL(url), 10_000)
        // Abre WhatsApp com o resumo em texto
        const text = buildWhatsAppShareMessage(applicableToday, todaySaved, todayStr)
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('handleShare error', err)
        setError('Não foi possível gerar a imagem. Tente novamente.')
      }
    } finally {
      setGeneratingShare(false)
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
          setError((j as { error?: string }).error || 'Erro ao salvar uma tarefa.')
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

  const yesterdayYmd = proLideresYesterdayYmdBr()
  const maxDateYmd = proLideresTodayYmdBr()
  const activePeriodPreset = useMemo(
    () => detectPeriodPreset(from, to, yesterdayYmd),
    [from, to, yesterdayYmd]
  )

  const applicableToday =
    data?.tasks.filter((t) => (t.execution_weekdays ?? []).includes(todayDow)) ?? []

  const todayHasUnsavedChanges = useMemo(
    () => !taskIdSetsEqual(todayDraft, todaySaved),
    [todayDraft, todaySaved]
  )

  // Progresso ao vivo: pontos e contagem das tarefas marcadas no draft
  const todayDraftCount = applicableToday.filter((t) => todayDraft.has(t.id)).length
  const todayDraftPoints = applicableToday
    .filter((t) => todayDraft.has(t.id))
    .reduce((s, t) => s + t.points, 0)
  const todayMaxPoints = applicableToday.reduce((s, t) => s + t.points, 0)
  const todayProgressPct =
    applicableToday.length > 0 ? Math.round((todayDraftCount / applicableToday.length) * 100) : 0

  const execucaoHref = `${painelBasePath.replace(/\/$/, '')}/tarefas/execucao`

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
              Marque suas tarefas do dia e defina o que a equipe vê. Para análise da equipe, use{' '}
              <strong className="font-semibold text-gray-800">Ver execução do time</strong>.
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
            Marque o que você fez hoje e toque em Salvar. Abaixo você vê seu relatório de pontos.
          </p>
        </div>
      )}

      {isLeader && (
        <details className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <summary className="cursor-pointer list-none text-sm font-semibold text-gray-900 marker:hidden [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Definições da equipe</span>
            <span className="hidden group-open:inline">Definições da equipe (fechar)</span>
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
                  Quando você desliga, os membros deixam de ver esta área no menu e na visão geral do painel.
                </p>
              </div>
            </label>
          </div>
        </details>
      )}

      {data && myUserId && (
        <div className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-md">
          {/* Cabeçalho com progresso */}
          <div className="bg-gradient-to-br from-blue-400 to-blue-500 px-4 pb-4 pt-5 sm:px-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-base font-bold text-white">
                  {isLeader ? 'Minhas tarefas de hoje' : 'Tarefas de hoje'}
                </p>
                <p className="mt-0.5 text-sm text-blue-200">
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                </p>
              </div>
              {/* Placar ao vivo */}
              {applicableToday.length > 0 && (
                <div className="shrink-0 rounded-xl bg-white/15 px-3 py-2 text-center backdrop-blur-sm">
                  <p className="text-xl font-black tabular-nums leading-none text-white">
                    {todayDraftPoints}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-200">
                    de {todayMaxPoints} pts
                  </p>
                </div>
              )}
            </div>
            {/* Barra de progresso */}
            {applicableToday.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-blue-200 mb-1.5">
                  <span>{todayDraftCount} de {applicableToday.length} tarefas</span>
                  <span className="font-semibold">{todayProgressPct}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500 ease-out"
                    style={{ width: `${todayProgressPct}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Lista de tarefas */}
          <ul className="divide-y divide-gray-100">
            {applicableToday.length === 0 ? (
              <li className="px-4 py-10 text-center text-sm text-gray-500 sm:px-5">Sem tarefas para hoje.</li>
            ) : (
              applicableToday.map((t) => {
                const checked = todayDraft.has(t.id)
                return (
                  <li
                    key={t.id}
                    onClick={() => !savingToday && void toggleTodayTask(t.id)}
                    className={`flex cursor-pointer gap-3 px-4 py-4 transition-colors sm:px-5 ${
                      checked ? 'bg-green-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Checkbox custom */}
                    <div className={`mt-0.5 flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      checked
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300 bg-white'
                    }`}>
                      {checked && (
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                        </svg>
                      )}
                    </div>
                    <div className="flex min-w-0 flex-1 gap-3">
                      <span className={`shrink-0 text-[15px] font-bold transition-colors ${checked ? 'text-green-600' : 'text-blue-700'}`}>
                        {t.points} pts
                      </span>
                      <div className="min-w-0">
                        <p className={`text-[15px] leading-snug transition-colors ${checked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                          {t.title}
                        </p>
                        {t.description && !checked ? (
                          <p className="mt-1.5 text-sm leading-relaxed text-blue-600">{t.description}</p>
                        ) : null}
                      </div>
                    </div>
                  </li>
                )
              })
            )}
          </ul>

          {/* Rodapé: status + botões */}
          <div className="space-y-3 border-t border-gray-100 p-4 sm:p-5">
            {/* Status de salvamento */}
            <p className="text-center text-xs">
              {savingToday ? (
                <span className="text-blue-600 font-medium">Salvando…</span>
              ) : !todaySaveOk ? (
                <span className="text-red-600 font-medium">Não foi possível salvar. Tente novamente.</span>
              ) : todayHasUnsavedChanges ? (
                <span className="text-amber-600 font-medium">Alterações não salvas</span>
              ) : todaySaved.size > 0 ? (
                <span className="text-green-600 font-medium">✓ Salvo com sucesso</span>
              ) : (
                <span className="text-gray-400">Marque as tarefas e salve</span>
              )}
            </p>

            <button
              type="button"
              disabled={savingToday || applicableToday.length === 0 || !todayHasUnsavedChanges}
              onClick={() => void saveTodayDraft()}
              className="w-full min-h-[48px] rounded-xl bg-blue-500 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingToday ? 'Salvando…' : 'Salvar execução de hoje'}
            </button>

            {/* Botão compartilhar — gera imagem PNG e usa Web Share API / download */}
            {todaySaved.size > 0 && todaySaveOk && (
              <button
                type="button"
                disabled={generatingShare || applicableToday.length === 0}
                onClick={() => void handleShare()}
                className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generatingShare ? (
                  <>
                    <svg className="h-4 w-4 animate-spin shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Gerando imagem…
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                    </svg>
                    Compartilhar tarefas
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {data && (
        <div className="rounded-xl border border-gray-200 bg-white p-2.5 shadow-sm sm:p-3">
          <p className="mb-1.5 text-xs font-semibold text-gray-800">
            {isLeader ? 'Meus pontos no período' : 'Relatório de pontos'}
          </p>
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
      )}

      {data && myUserId && (
        <div className="rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total no período</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-gray-900">{data.myPointsInRange}</p>
          <p className="text-xs text-gray-500">pontos das tarefas marcadas</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{error}</div>
      )}

      {loading ? (
        <p className="text-gray-600">Carregando…</p>
      ) : (
        <>
          {isLeader && (
            <div className="overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-md">
              <div className="border-b border-gray-100 px-4 py-4 sm:px-5">
                <p className="text-sm font-semibold text-gray-900">Criar tarefas diárias</p>
                <p className="mt-1 text-xs text-gray-500">
                  Cada linha é uma tarefa no cartão do membro. Edite à vontade e salve as alterações; use + para
                  adicionar e ✕ para remover.
                </p>
              </div>

              <ul className="divide-y divide-gray-100">
                {taskRows.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-gray-500 sm:px-5">
                    Ainda não há tarefas. Adicione a primeira linha abaixo.
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
                    {savingEdits ? 'Salvando…' : 'Salvar alterações nas tarefas'}
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
