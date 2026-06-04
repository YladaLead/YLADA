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
  const totalPts = tasks.filter((t) => completedIds.has(t.id)).reduce((s, t) => s + t.points, 0)
  const maxPts  = tasks.reduce((s, t) => s + t.points, 0)
  const d = new Date(`${dateStr}T12:00:00`)
  const dateBr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  const lines = tasks.map((t) =>
    completedIds.has(t.id)
      ? `✅ ${t.title} (+${t.points} pts)`
      : `⬜ ${t.title} (+${t.points} pts)`
  )
  return [
    `📋 *Tarefas do dia — ${dateBr}*`,
    '',
    lines.join('\n'),
    '',
    `🏆 *${totalPts} / ${maxPts} pts*`,
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


/** Classifica o desempenho por % de pontos atingidos. */
function diplomaLabel(pct: number): string {
  if (pct >= 100) return 'Dia perfeito!'
  if (pct >= 80)  return 'Excelente!'
  if (pct >= 60)  return 'Muito bem!'
  if (pct >= 40)  return 'Em progresso'
  return 'Começando'
}

/** Converte dataUrl → Blob sem usar fetch (funciona em todos os browsers). */
function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',')
  const mime  = parts[0].match(/:(.*?);/)?.[1] ?? 'image/png'
  const bstr  = atob(parts[1])
  const u8    = new Uint8Array(bstr.length)
  for (let i = 0; i < bstr.length; i++) u8[i] = bstr.charCodeAt(i)
  return new Blob([u8], { type: mime })
}

/** Gera PNG: logo YLADA + certificado de pontos + lista de tarefas (feitas e pendentes). */
function generateShareImage(
  tasks: ProLideresDailyTaskRow[],
  completedIds: Set<string>,
  dateStr: string
): string {
  const SCALE    = 2
  const W        = 480
  const PAD      = 16
  const LOGO_H   = 52
  const CERT_H   = 88          // certificado compacto (era 112)
  const ROW_H    = 40
  const FOOTER_H = 28
  const H = LOGO_H + CERT_H + tasks.length * ROW_H + FOOTER_H

  const canvas = document.createElement('canvas')
  canvas.width  = W * SCALE
  canvas.height = H * SCALE
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas não disponível')
  ctx.scale(SCALE, SCALE)

  const f = (size: number, weight = 'normal') =>
    `${weight} ${size}px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

  const completedCount = tasks.filter((t) => completedIds.has(t.id)).length
  const totalPts = tasks.filter((t) => completedIds.has(t.id)).reduce((s, t) => s + t.points, 0)
  const maxPts   = tasks.reduce((s, t) => s + t.points, 0)
  const pct      = maxPts > 0 ? Math.round((totalPts / maxPts) * 100) : 0
  const d        = new Date(`${dateStr}T12:00:00`)
  const dateFull = d.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
  const dateShort = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  // ── Logo ──────────────────────────────────────────────────────────────────
  const lY = LOGO_H / 2
  const r  = 10
  ctx.beginPath(); ctx.arc(PAD + r, lY, r, 0, Math.PI * 2)
  ctx.fillStyle = '#60a5fa'; ctx.fill()
  ctx.beginPath(); ctx.arc(PAD + r + r * 1.15, lY, r, 0, Math.PI * 2)
  ctx.fillStyle = '#1d4ed8'; ctx.fill()
  ctx.fillStyle = '#1e3a5f'; ctx.font = f(16, 'bold')
  ctx.fillText('YLADA', PAD + r * 2.3 + 10, lY + 6)
  canvasRoundRect(ctx, W - 96, lY - 11, 80, 22, 6)
  ctx.fillStyle = '#eff6ff'; ctx.fill()
  ctx.fillStyle = '#1d4ed8'; ctx.font = f(9, 'bold')
  ctx.textAlign = 'right'
  ctx.fillText('Pro Líderes', W - PAD, lY + 4)
  ctx.textAlign = 'left'
  ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(0, LOGO_H); ctx.lineTo(W, LOGO_H); ctx.stroke()

  // ── Certificado ──────────────────────────────────────────────────────────
  const CY = LOGO_H
  ctx.fillStyle = '#fffbeb'
  ctx.fillRect(0, CY, W, CERT_H)
  // Borda dupla
  ctx.strokeStyle = '#d97706'; ctx.lineWidth = 1.5
  ctx.strokeRect(8, CY + 8, W - 16, CERT_H - 16)
  ctx.strokeStyle = '#fde68a'; ctx.lineWidth = 0.75
  ctx.strokeRect(13, CY + 13, W - 26, CERT_H - 26)
  // Título
  ctx.fillStyle = '#92400e'; ctx.font = f(8, 'bold')
  ctx.textAlign = 'center'
  ctx.fillText('C E R T I F I C A D O  D O  D I A', W / 2, CY + 26)
  // Score grande
  ctx.font = f(32, 'bold')
  ctx.fillStyle = '#92400e'
  const sw = ctx.measureText(String(totalPts)).width
  ctx.fillText(String(totalPts), W / 2 - sw / 2, CY + 64)
  ctx.font = f(12)
  ctx.fillStyle = '#b45309'
  ctx.fillText(' pts', W / 2 + sw / 2, CY + 60)
  // Classificação
  ctx.font = f(9)
  ctx.fillText(`de ${maxPts} pts  ·  ${diplomaLabel(pct)}`, W / 2, CY + CERT_H - 14)
  ctx.textAlign = 'left'

  // ── Tarefas ───────────────────────────────────────────────────────────────
  let y = CY + CERT_H
  for (const t of tasks) {
    const done = completedIds.has(t.id)
    ctx.fillStyle = done ? '#eff6ff' : '#f9fafb'
    ctx.fillRect(0, y, W, ROW_H)
    ctx.strokeStyle = '#f3f4f6'; ctx.lineWidth = 1
    ctx.beginPath(); ctx.moveTo(0, y + ROW_H - 1); ctx.lineTo(W, y + ROW_H - 1); ctx.stroke()

    const cy = y + ROW_H / 2
    ctx.beginPath(); ctx.arc(PAD + 10, cy, 10, 0, Math.PI * 2)
    ctx.fillStyle = done ? '#3b82f6' : '#e5e7eb'; ctx.fill()

    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    if (done) {
      ctx.beginPath()
      ctx.moveTo(PAD + 5, cy); ctx.lineTo(PAD + 9, cy + 4); ctx.lineTo(PAD + 16, cy - 4)
      ctx.stroke()
    } else {
      ctx.beginPath()
      ctx.moveTo(PAD + 5, cy - 3); ctx.lineTo(PAD + 15, cy + 3)
      ctx.moveTo(PAD + 15, cy - 3); ctx.lineTo(PAD + 5, cy + 3)
      ctx.stroke()
    }

    ctx.fillStyle = done ? '#1e40af' : '#9ca3af'
    ctx.font = done ? f(12, '600') : f(12)
    ctx.fillText(t.title, PAD + 26, cy + 5)

    ctx.fillStyle = done ? '#2563eb' : '#d1d5db'
    ctx.font = f(10, 'bold')
    ctx.textAlign = 'right'
    ctx.fillText(`+${t.points}pts`, W - PAD, cy + 5)
    ctx.textAlign = 'left'
    y += ROW_H
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  ctx.fillStyle = '#f8fafc'
  ctx.fillRect(0, y, W, FOOTER_H)
  ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 1
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  ctx.fillStyle = '#9ca3af'; ctx.font = f(9)
  ctx.textAlign = 'center'
  ctx.fillText(
    `${completedCount}/${tasks.length} tarefas · ${dateFull.charAt(0).toUpperCase() + dateFull.slice(1)} · ${dateShort} · ylada.com`,
    W / 2, y + FOOTER_H / 2 + 4
  )
  ctx.textAlign = 'left'

  const dataUrl = canvas.toDataURL('image/png')
  if (!dataUrl || dataUrl === 'data:,') throw new Error('Canvas retornou vazio')
  return dataUrl
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
  const [showCelebration, setShowCelebration] = useState(false)
  const [generatingShare, setGeneratingShare] = useState(false)
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null)
  const [shareError, setShareError] = useState<string | null>(null)
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
      // Popup de conquista quando completa 100%
      const maxPts = applicableToday.reduce((s, t) => s + t.points, 0)
      const earnedPts = applicableToday.filter(t => completedIds.has(t.id)).reduce((s, t) => s + t.points, 0)
      if (maxPts > 0 && earnedPts === maxPts) {
        setTimeout(() => setShowCelebration(true), 400)
      }
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
    setShareImageUrl(null)
    setShareError(null)
    setGeneratingShare(true)
    try {
      const dataUrl = generateShareImage(applicableToday, todaySaved, todayStr)
      const blob = dataUrlToBlob(dataUrl)
      const file = new File([blob], 'tarefas-do-dia.png', { type: 'image/png' })

      // Mobile / browsers com Web Share API de arquivos → abre painel nativo (WhatsApp etc)
      if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Minhas tarefas do dia' })
        return
      }

      // Fallback desktop: baixa a imagem automaticamente
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'tarefas-do-dia.png'
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      setShareImageUrl(dataUrl) // mostra preview só no desktop como confirmação
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return // usuário cancelou o share
      const msg = err instanceof Error ? err.message : String(err)
      console.error('handleShare error', err)
      setShareError(msg || 'Não foi possível gerar a imagem.')
    } finally {
      setGeneratingShare(false)
    }
  }

  function dismissSharePreview() {
    setShareImageUrl(null)
    setShareError(null)
  }

  function downloadShareImage() {
    if (!shareImageUrl) return
    const a = document.createElement('a')
    a.href = shareImageUrl
    a.download = 'tarefas-do-dia.png'
    a.style.display = 'none'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
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

  function headerGradient(pct: number): string {
    if (pct === 100) return 'linear-gradient(135deg,#059669 0%,#047857 55%,#065f46 100%)'
    if (pct >= 67)   return 'linear-gradient(135deg,#16a34a 0%,#15803d 40%,#14532d 100%)'
    if (pct >= 34)   return 'linear-gradient(135deg,#0891b2 0%,#0e7490 40%,#164e63 100%)'
    if (pct > 0)     return 'linear-gradient(135deg,#2563eb 0%,#7c3aed 55%,#4c1d95 100%)'
    return 'linear-gradient(135deg,#1d4ed8 0%,#1e40af 55%,#312e81 100%)'
  }

  function barGradient(pct: number): string {
    if (pct === 100) return 'linear-gradient(90deg,#6ee7b7,#fff)'
    if (pct >= 67)   return 'linear-gradient(90deg,#86efac,#fff)'
    if (pct >= 34)   return 'linear-gradient(90deg,#67e8f9,#fff)'
    if (pct > 0)     return 'linear-gradient(90deg,#c4b5fd,#fff)'
    return 'none'
  }

  function scoreColor(pct: number): string {
    if (pct === 100) return '#059669'
    if (pct >= 67)   return '#15803d'
    if (pct >= 34)   return '#0e7490'
    if (pct > 0)     return '#7c3aed'
    return '#1e40af'
  }

  const execucaoHref = `${painelBasePath.replace(/\/$/, '')}/tarefas/execucao`

  const navPill =
    'inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors'
  const navPillActive = 'bg-blue-700 text-white shadow-sm'
  const navPillInactive =
    'border border-blue-200 bg-white text-blue-900 hover:bg-blue-50'

  function updateTaskRow(id: string, patch: Partial<TaskRowEdit>) {
    setTaskRows((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)))
  }

  const celebrationPoints = applicableToday.filter(t => todaySaved.has(t.id)).reduce((s, t) => s + t.points, 0)

  return (
    <div className="max-w-4xl space-y-6">
      {/* Popup de conquista — 100% salvo */}
      {showCelebration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCelebration(false) }}
        >
          <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Cabeçalho verde */}
            <div className="flex flex-col items-center px-6 pt-8 pb-6" style={{ background: headerGradient(100) }}>
              <span className="text-5xl leading-none mb-2">🏆</span>
              <p className="text-2xl font-black text-white">Dia completo!</p>
              <p className="mt-1 text-sm font-semibold text-white/80">Você concluiu todas as tarefas</p>
              <div className="mt-4 rounded-2xl bg-white px-6 py-3 text-center shadow-lg">
                <p className="text-4xl font-black leading-none" style={{ color: scoreColor(100) }}>{celebrationPoints}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-400">pontos hoje</p>
              </div>
            </div>
            {/* Lista de tarefas concluídas */}
            <div className="divide-y divide-gray-100 bg-gray-50">
              {applicableToday.filter(t => todaySaved.has(t.id)).map(t => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  </div>
                  <span className="flex-1 text-sm font-medium text-gray-700">{t.title}</span>
                  <span className="text-xs font-bold text-emerald-600">+{t.points} pts</span>
                </div>
              ))}
            </div>
            {/* Botões */}
            <div className="space-y-2 p-4">
              <button
                type="button"
                disabled={generatingShare}
                onClick={() => { void handleShare() }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 py-3.5 text-sm font-bold text-white hover:bg-green-600 disabled:opacity-50"
              >
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                </svg>
                {generatingShare ? 'Gerando…' : 'Compartilhar no WhatsApp'}
              </button>
              <button
                type="button"
                onClick={() => setShowCelebration(false)}
                className="w-full rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
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
        <div className="overflow-hidden rounded-2xl shadow-xl shadow-blue-100">
          {/* Cabeçalho com progresso — cor muda conforme progresso */}
          <div
            className="relative overflow-hidden px-4 pb-6 pt-5 sm:px-5"
            style={{ background: headerGradient(todayProgressPct) }}
          >
            {/* Círculos decorativos de fundo */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-10"
              style={{ background: 'white' }} />
            <div className="pointer-events-none absolute -bottom-10 -left-4 h-32 w-32 rounded-full opacity-10"
              style={{ background: 'white' }} />

            <div className="relative flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                </p>
                <p className="mt-1 text-xl font-extrabold text-white drop-shadow-sm">
                  {isLeader ? 'Minhas tarefas de hoje' : 'Tarefas de hoje'}
                </p>
                {applicableToday.length > 0 && (
                  <p className="mt-1 text-sm font-semibold text-white">
                    {todayProgressPct === 0 && '👆 Toque para marcar cada tarefa'}
                    {todayProgressPct > 0 && todayProgressPct < 34 && '💪 Bom início! Continue!'}
                    {todayProgressPct >= 34 && todayProgressPct < 67 && '🔥 Na metade — não para agora!'}
                    {todayProgressPct >= 67 && todayProgressPct < 100 && '⚡ Quase lá! Falta pouco!'}
                    {todayProgressPct === 100 && '🏆 Dia completo! Parabéns!'}
                  </p>
                )}
              </div>

              {/* Placar — fundo branco com texto colorido */}
              {applicableToday.length > 0 && (
                <div className="shrink-0 rounded-2xl bg-white px-3 py-2.5 text-center shadow-lg">
                  <p className="text-2xl font-black tabular-nums leading-none" style={{ color: scoreColor(todayProgressPct) }}>
                    {todayDraftPoints}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    de {todayMaxPoints} pts
                  </p>
                </div>
              )}
            </div>

            {/* Barra de progresso */}
            {applicableToday.length > 0 && (
              <div className="relative mt-5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-white/80">{todayDraftCount} de {applicableToday.length} tarefas</span>
                  <span className="text-xs font-extrabold text-white">{todayProgressPct}%</span>
                </div>
                {/* Track */}
                <div className="h-3 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.18)' }}>
                  {/* Fill */}
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.max(todayProgressPct, todayProgressPct > 0 ? 4 : 0)}%`,
                      background: barGradient(todayProgressPct),
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Lista de tarefas */}
          <ul className="space-y-2 bg-gray-50/80 p-3 sm:p-4">
            {applicableToday.length === 0 ? (
              <li className="rounded-xl border border-dashed border-gray-200 px-4 py-10 text-center text-sm text-gray-400">
                Sem tarefas para hoje.
              </li>
            ) : (
              applicableToday.map((t) => {
                const checked = todayDraft.has(t.id)
                return (
                  <li
                    key={t.id}
                    onClick={() => !savingToday && void toggleTodayTask(t.id)}
                    className={`relative flex min-h-[64px] cursor-pointer select-none items-start gap-3 overflow-hidden rounded-xl border p-4 transition-all active:scale-[0.985] ${
                      checked
                        ? 'border-emerald-200 bg-emerald-50/70 shadow-sm'
                        : 'border-gray-200 bg-white shadow-sm hover:border-blue-200 hover:shadow-md'
                    }`}
                  >
                    {/* Barra esquerda de status */}
                    <div className={`absolute inset-y-0 left-0 w-1 transition-all ${
                      checked ? 'bg-emerald-400' : 'bg-transparent'
                    }`} />

                    {/* Checkbox */}
                    <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                      checked
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-gray-300 bg-white'
                    }`}>
                      {checked && (
                        <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                        </svg>
                      )}
                    </div>

                    {/* Texto */}
                    <div className="min-w-0 flex-1">
                      <p className={`text-[15px] font-medium leading-snug transition-colors ${
                        checked ? 'text-gray-400 line-through decoration-emerald-400' : 'text-gray-900'
                      }`}>
                        {t.title}
                      </p>
                      {t.description && !checked && (
                        <p className="mt-1.5 text-sm leading-relaxed text-blue-600">{t.description}</p>
                      )}
                    </div>

                    {/* Badge de pontos */}
                    <span className={`shrink-0 self-start rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${
                      checked
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      +{t.points} pts
                    </span>
                  </li>
                )
              })
            )}
          </ul>

          {/* Rodapé: status + botões */}
          <div className="space-y-3 border-t border-gray-100 bg-gray-50/60 p-4 sm:p-5">
            {/* Status de salvamento */}
            {(savingToday || !todaySaveOk || todayHasUnsavedChanges || todaySaved.size > 0) && (
              <p className="text-center text-xs font-medium">
                {savingToday ? (
                  <span className="text-blue-600">Salvando…</span>
                ) : !todaySaveOk ? (
                  <span className="text-red-600">Não foi possível salvar. Tente novamente.</span>
                ) : todayHasUnsavedChanges ? (
                  <span className="text-amber-600">⚠️ Alterações não salvas</span>
                ) : (
                  <span className="text-emerald-600">✅ Salvo com sucesso</span>
                )}
              </p>
            )}

            <button
              type="button"
              disabled={savingToday || applicableToday.length === 0 || !todayHasUnsavedChanges}
              onClick={() => void saveTodayDraft()}
              className={`w-full min-h-[52px] rounded-xl px-4 py-3 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                todayHasUnsavedChanges && !savingToday
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                  : 'bg-gray-400'
              }`}
            >
              {savingToday ? 'Salvando…' : todayProgressPct === 100 ? '🏆 Salvar — dia completo!' : 'Salvar execução de hoje'}
            </button>

            {/* Botão compartilhar — gera imagem PNG e usa Web Share API / download */}
            {todaySaved.size > 0 && todaySaveOk && (
              <button
                type="button"
                disabled={generatingShare || applicableToday.length === 0}
                onClick={handleShare}
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

            {/* Erro ao gerar imagem — mostrado inline, não no rodapé */}
            {shareError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-800">
                ❌ {shareError}
                <button type="button" onClick={() => setShareError(null)} className="ml-2 underline text-red-600">Fechar</button>
              </div>
            )}

            {/* Preview desktop — só aparece quando Web Share não está disponível */}
            {shareImageUrl && (
              <div className="mt-1 overflow-hidden rounded-xl border border-blue-200 bg-blue-50">
                <div className="flex items-center justify-between px-3 py-2">
                  <p className="text-xs font-semibold text-blue-800">✅ Imagem baixada! Envie pelo WhatsApp.</p>
                  <button type="button" onClick={dismissSharePreview} className="text-blue-400 hover:text-blue-700 text-lg leading-none" aria-label="Fechar">×</button>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={shareImageUrl} alt="Tarefas do dia" className="w-full" />
              </div>
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
