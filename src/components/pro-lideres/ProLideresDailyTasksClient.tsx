'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'
import {
  PL_WEEKDAY_ORDER,
  type ProLideresDailyTaskCompletionRow,
  type ProLideresDailyTaskCountRow,
  type ProLideresDailyTaskRow,
} from '@/types/pro-lideres-daily-tasks'
import type { ProLideresMemberListItem } from '@/lib/pro-lideres-members-enriched'
import { proLideresTodayYmdBr, proLideresYesterdayYmdBr } from '@/lib/pro-lideres-dates-br'

type ApiGet = {
  tasks: ProLideresDailyTaskRow[]
  completions: ProLideresDailyTaskCompletionRow[]
  counts: ProLideresDailyTaskCountRow[]
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
  countEnabled: boolean
  countGoal: string
  countLabel: string
}

function taskIdSetsEqual(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false
  for (const id of a) {
    if (!b.has(id)) return false
  }
  return true
}

function todaySubmitStorageKey(userId: string, date: string): string {
  return `pl-daily-tasks-submitted:${userId}:${date}`
}

function readTodaySubmitted(userId: string, date: string): boolean {
  if (typeof window === 'undefined' || !userId) return false
  return localStorage.getItem(todaySubmitStorageKey(userId, date)) === '1'
}

function writeTodaySubmitted(userId: string, date: string): void {
  if (typeof window === 'undefined' || !userId) return
  localStorage.setItem(todaySubmitStorageKey(userId, date), '1')
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
  if (pct >= 33)  return 'Em progresso'
  if (pct > 0)    return 'Começando'
  return 'Amanhã recomeça'
}

/** Classe CSS do badge de pontos conforme valor — escala visual de valor. */
function ptsBadgeClass(points: number, done: boolean): string {
  if (done) return 'bg-emerald-100 text-emerald-700'
  if (points >= 20) return 'bg-amber-100 text-amber-700'   // dourado — alta pontuação
  if (points >= 15) return 'bg-indigo-100 text-indigo-700' // índigo — média-alta
  if (points >= 10) return 'bg-sky-100 text-sky-700'       // azul claro — padrão
  return 'bg-gray-100 text-gray-500'                       // cinza — baixo valor
}

/** Cor hex do badge de pontos para o canvas. */
function ptsCanvasColor(points: number, done: boolean): string {
  if (done) return '#22c55e'
  if (points >= 20) return '#d97706'  // âmbar
  if (points >= 15) return '#6366f1'  // índigo
  if (points >= 10) return '#0ea5e9'  // sky
  return '#9ca3af'                    // cinza
}

/** Título do certificado baseado no progresso. */
function certTitle(pct: number): string {
  return pct === 0 ? 'Registro do Dia' : 'Certificado do Dia'
}

/** Cor principal do certificado (hex) baseada no progresso. */
function certColor(pct: number): string {
  if (pct >= 100) return '#92400e'   // dourado — dia perfeito
  if (pct >= 60)  return '#0e7490'   // teal
  if (pct >= 33)  return '#c2410c'   // laranja
  if (pct > 0)    return '#6d28d9'   // roxo
  return '#6b7280'                    // cinza — zero
}

/** Cor de fundo do certificado. */
function certBg(pct: number): string {
  if (pct >= 100) return '#fffbeb'
  if (pct >= 60)  return '#ecfeff'
  if (pct >= 33)  return '#fff7ed'
  if (pct > 0)    return '#f5f3ff'
  return '#f9fafb'
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

/** Gera PNG no estilo do popup: header colorido + logo + emoji + score + lista de tarefas. */
function generateShareImage(
  tasks: ProLideresDailyTaskRow[],
  completedIds: Set<string>,
  dateStr: string
): string {
  const SCALE    = 2
  const W        = 480
  const PAD      = 20
  const HEADER_H = 220  // cabeçalho colorido (logo + emoji + título + pontos)
  const ROW_H    = 48
  const FOOTER_H = 36
  const H = HEADER_H + tasks.length * ROW_H + FOOTER_H

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

  // Cor do cabeçalho igual ao popup
  const hColor = pct >= 100 ? '#059669' : pct >= 81 ? '#16a34a' : pct >= 61 ? '#0891b2' : pct >= 41 ? '#d97706' : pct >= 21 ? '#4f46e5' : pct > 0 ? '#7c3aed' : '#6b7280'
  const emoji  = pct >= 100 ? '🏆' : pct >= 81 ? '🎯' : pct >= 61 ? '💥' : pct >= 41 ? '🔥' : pct >= 21 ? '⚡' : pct > 0 ? '🚀' : '🌱'
  const titleText = pct >= 100 ? 'Dia lendário!' : pct >= 81 ? 'Um passo para o dia perfeito!' : pct >= 61 ? 'Dia forte! Continue assim!' : pct >= 41 ? 'Passou da metade!' : pct >= 21 ? 'Você está em movimento!' : pct > 0 ? 'O primeiro passo está dado!' : 'Amanhã é uma nova chance!'
  const subText   = pct >= 100 ? 'Isso é consistência. É assim que líderes são feitos.' : pct >= 81 ? 'Finaliza forte — você chegou até aqui.' : pct >= 61 ? 'Você está construindo algo real. Falta pouco.' : pct >= 41 ? 'A segunda metade é onde os líderes se revelam.' : pct >= 21 ? 'Quem começa já está na frente. Não para.' : pct > 0 ? 'Cada ação planta uma semente. Continue.' : 'Reflita o que travou hoje. Amanhã você recomeça.'

  // Fundo geral branco
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, W, H)

  // ── Header colorido ───────────────────────────────────────────────────────
  ctx.fillStyle = hColor
  ctx.fillRect(0, 0, W, HEADER_H)

  // Círculos decorativos de fundo (como no app)
  ctx.beginPath(); ctx.arc(W + 20, -20, 90, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.fill()
  ctx.beginPath(); ctx.arc(-10, HEADER_H + 10, 70, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fill()

  // ── Logo YLADA (dois círculos sobrepostos + texto) ────────────────────────
  const logoY = 26
  const r = 11
  ctx.beginPath(); ctx.arc(PAD + r, logoY, r, 0, Math.PI * 2)
  ctx.fillStyle = '#93c5fd'; ctx.fill()
  ctx.beginPath(); ctx.arc(PAD + r + r * 1.1, logoY, r, 0, Math.PI * 2)
  ctx.fillStyle = '#1d4ed8'; ctx.fill()
  ctx.fillStyle = '#fff'
  ctx.font = f(16, 'bold')
  ctx.textAlign = 'left'
  ctx.fillText('YLADA', PAD + r * 2.3 + 10, logoY + 6)

  // Badge "Pro Líderes"
  canvasRoundRect(ctx, W - 106, logoY - 12, 90, 24, 6)
  ctx.fillStyle = 'rgba(255,255,255,0.20)'; ctx.fill()
  ctx.fillStyle = '#fff'; ctx.font = f(10, 'bold')
  ctx.textAlign = 'right'
  ctx.fillText('Pro Líderes', W - PAD, logoY + 5)

  // ── Emoji ─────────────────────────────────────────────────────────────────
  ctx.font = f(44)
  ctx.textAlign = 'center'
  ctx.fillText(emoji, W / 2, 100)

  // ── Título ────────────────────────────────────────────────────────────────
  ctx.fillStyle = '#fff'
  ctx.font = f(26, 'bold')
  ctx.fillText(titleText, W / 2, 136)

  // ── Subtítulo ─────────────────────────────────────────────────────────────
  ctx.fillStyle = 'rgba(255,255,255,0.80)'
  ctx.font = f(13)
  ctx.fillText(subText, W / 2, 158)

  // ── Score pill (fundo branco, número colorido) ────────────────────────────
  const pillW = 130, pillH = 52
  const pillX = (W - pillW) / 2
  const pillY = 168
  canvasRoundRect(ctx, pillX, pillY, pillW, pillH, 14)
  ctx.fillStyle = '#fff'; ctx.fill()
  ctx.fillStyle = hColor
  ctx.font = f(28, 'bold')
  ctx.fillText(String(totalPts), W / 2, pillY + 34)
  ctx.fillStyle = '#9ca3af'
  ctx.font = f(10, 'bold')
  ctx.fillText(`DE ${maxPts} PTS`, W / 2, pillY + 48)

  // ── Lista de tarefas ──────────────────────────────────────────────────────
  let y = HEADER_H
  ctx.textAlign = 'left'
  for (const t of tasks) {
    const done = completedIds.has(t.id)
    ctx.fillStyle = done ? '#f0fdf4' : '#fff'
    ctx.fillRect(0, y, W, ROW_H)
    ctx.strokeStyle = '#f3f4f6'; ctx.lineWidth = 0.5
    ctx.beginPath(); ctx.moveTo(0, y + ROW_H); ctx.lineTo(W, y + ROW_H); ctx.stroke()

    const cy = y + ROW_H / 2

    // Círculo check
    ctx.beginPath(); ctx.arc(PAD + 11, cy, 11, 0, Math.PI * 2)
    ctx.fillStyle = done ? '#22c55e' : '#e5e7eb'; ctx.fill()

    // Checkmark
    if (done) {
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(PAD + 5.5, cy); ctx.lineTo(PAD + 10, cy + 4.5); ctx.lineTo(PAD + 17, cy - 4.5)
      ctx.stroke()
    }

    // Texto
    ctx.fillStyle = done ? '#6b7280' : '#374151'
    ctx.font = f(13, done ? '500' : 'normal')
    ctx.fillText(t.title, PAD + 28, cy + 5)

    // Risco no texto (done)
    if (done) {
      const tw = ctx.measureText(t.title).width
      ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1
      ctx.lineCap = 'butt'
      ctx.beginPath(); ctx.moveTo(PAD + 28, cy + 1); ctx.lineTo(PAD + 28 + tw, cy + 1); ctx.stroke()
    }

    // Pontos — cor reflete o valor
    ctx.fillStyle = ptsCanvasColor(t.points, done)
    ctx.font = f(12, 'bold')
    ctx.textAlign = 'right'
    ctx.fillText(`+${t.points}`, W - PAD, cy + 5)
    ctx.textAlign = 'left'

    y += ROW_H
  }

  // ── Footer ────────────────────────────────────────────────────────────────
  ctx.fillStyle = '#f9fafb'
  ctx.fillRect(0, y, W, FOOTER_H)
  ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 0.5
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
  ctx.fillStyle = '#9ca3af'; ctx.font = f(10)
  ctx.textAlign = 'center'
  const dl = dateFull.charAt(0).toUpperCase() + dateFull.slice(1)
  ctx.fillText(`${dl}  ·  ylada.com`, W / 2, y + FOOTER_H / 2 + 4)
  ctx.textAlign = 'left'

  const dataUrl = canvas.toDataURL('image/png')
  if (!dataUrl || dataUrl === 'data:,') throw new Error('Canvas retornou vazio')
  return dataUrl
}

/** Linha de tarefa COM contador: o membro digita quantos fez; bate a meta → ponto. */
function CounterTaskRow({
  task,
  quantity,
  saving,
  onSave,
}: {
  task: ProLideresDailyTaskRow
  quantity: number
  saving: boolean
  onSave: (qty: number) => void
}) {
  const [draft, setDraft] = useState<string>(String(quantity))

  // Mantém o input em sincronia quando a quantidade salva muda por fora.
  useEffect(() => {
    setDraft(String(quantity))
  }, [quantity])

  const goal = task.count_goal
  const unit = task.count_label?.trim() || ''
  const met = goal != null && quantity >= goal

  function commit(next: number) {
    const q = Math.max(0, Math.min(100000, Math.floor(next) || 0))
    setDraft(String(q))
    if (q !== quantity) onSave(q)
  }

  return (
    <li
      className={`relative flex min-h-[64px] select-none flex-col gap-3 overflow-hidden rounded-xl border p-4 shadow-sm ${
        met ? 'border-emerald-200 bg-emerald-50/70' : 'border-gray-200 bg-white'
      }`}
    >
      <div className={`absolute inset-y-0 left-0 w-1 ${met ? 'bg-emerald-400' : 'bg-blue-300'}`} />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className={`text-[15px] font-medium leading-snug ${met ? 'text-emerald-900' : 'text-gray-900'}`}>
            {task.title}
          </p>
          {task.description && (
            <p className="mt-1.5 text-sm leading-relaxed text-blue-600">{task.description}</p>
          )}
        </div>
        <span className={`shrink-0 self-start rounded-full px-2.5 py-1 text-xs font-bold ${ptsBadgeClass(task.points, met)}`}>
          +{task.points} pts
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center overflow-hidden rounded-xl border border-gray-300 bg-white">
          <button
            type="button"
            aria-label="Diminuir"
            onClick={() => commit(quantity - 1)}
            className="flex h-11 w-11 items-center justify-center text-xl font-bold text-gray-600 hover:bg-gray-50 active:scale-95"
          >
            −
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={100000}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => commit(Number(draft))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                ;(e.target as HTMLInputElement).blur()
              }
            }}
            className="h-11 w-16 border-x border-gray-200 text-center text-lg font-bold tabular-nums text-gray-900 focus:outline-none"
          />
          <button
            type="button"
            aria-label="Aumentar"
            onClick={() => commit(quantity + 1)}
            className="flex h-11 w-11 items-center justify-center text-xl font-bold text-blue-700 hover:bg-blue-50 active:scale-95"
          >
            +
          </button>
        </div>

        <div className="min-w-0 flex-1">
          {goal != null ? (
            <span className={`text-sm font-bold ${met ? 'text-emerald-700' : 'text-gray-700'}`}>
              {quantity} / {goal}
              {unit ? ` ${unit}` : ''}
              {met && <span className="ml-1.5 font-semibold">✓ meta batida</span>}
            </span>
          ) : (
            <span className="text-sm font-bold text-gray-700">
              {quantity}
              {unit ? ` ${unit}` : ''}
            </span>
          )}
          {saving && <span className="ml-2 text-xs font-medium text-blue-600">salvando…</span>}
        </div>
      </div>
    </li>
  )
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
  const [newCountEnabled, setNewCountEnabled] = useState(false)
  const [newCountGoal, setNewCountGoal] = useState('10')
  const [newCountLabel, setNewCountLabel] = useState('')
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
  const [todaySubmitted, setTodaySubmitted] = useState(false)
  const [todaySaveOk, setTodaySaveOk] = useState(true)
  // Contadores de hoje (tarefas com count_enabled): taskId -> quantidade registrada.
  const [todayCounts, setTodayCounts] = useState<Record<string, number>>({})
  const [countSaving, setCountSaving] = useState<Record<string, boolean>>({})

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
      const payload = json as ApiGet
      const counterTaskIds = new Set(
        (payload.tasks ?? []).filter((t) => t.count_enabled).map((t) => t.id)
      )
      const completions = payload.completions ?? []
      // O checklist (draft/saved) só guarda tarefas SEM contador; as com contador
      // são refletidas por todayCounts e a conclusão delas vem da meta.
      const done = new Set(
        completions
          .filter((c) => c.member_user_id === myUserId && !counterTaskIds.has(c.task_id))
          .map((c) => c.task_id)
      )
      setTodayDraft(done)
      setTodaySaved(new Set(done))

      const counts: Record<string, number> = {}
      for (const c of payload.counts ?? []) {
        if (c.member_user_id === myUserId) counts[c.task_id] = c.quantity
      }
      setTodayCounts(counts)

      const anyCount = Object.values(counts).some((q) => q > 0)
      setTodaySubmitted(done.size > 0 || anyCount || readTodaySubmitted(myUserId, todayStr))
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
    return list
      .map(
        (t) =>
          `${t.id}:${t.points}:${t.title}:${t.description ?? ''}:${t.count_enabled ? 1 : 0}:${t.count_goal ?? ''}:${t.count_label ?? ''}`
      )
      .join('|')
  }, [data?.tasks])

  useEffect(() => {
    if (!isLeader || !data?.tasks) return
    setTaskRows(
      data.tasks.map((t) => ({
        id: t.id,
        points: String(t.points),
        title: t.title,
        description: t.description ?? '',
        countEnabled: t.count_enabled,
        countGoal: t.count_goal != null ? String(t.count_goal) : '',
        countLabel: t.count_label ?? '',
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
      setTodaySubmitted(true)
      writeTodaySubmitted(myUserId, todayStr)
      setTodaySaveOk(true)
      void load()
      // Popup aparece sempre que salva (com ou sem tarefas)
      if (applicableToday.length > 0) {
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

  async function saveCount(taskId: string, quantity: number) {
    if (!myUserId) return
    const qty = Math.max(0, Math.min(100000, Math.floor(quantity) || 0))
    const prev = todayCounts[taskId] ?? 0
    setTodayCounts((m) => ({ ...m, [taskId]: qty })) // otimista
    setCountSaving((m) => ({ ...m, [taskId]: true }))
    setError(null)
    try {
      const res = await fetch(`/api/pro-lideres/daily-tasks/${encodeURIComponent(taskId)}/count`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: todayStr, quantity: qty }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError((json as { error?: string }).error || 'Erro ao salvar a quantidade.')
        setTodayCounts((m) => ({ ...m, [taskId]: prev })) // reverte
        return
      }
      setTodaySubmitted(true)
      writeTodaySubmitted(myUserId, todayStr)
      void load() // atualiza os pontos do período
    } catch {
      setError('Erro de rede.')
      setTodayCounts((m) => ({ ...m, [taskId]: prev }))
    } finally {
      setCountSaving((m) => ({ ...m, [taskId]: false }))
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
      const dataUrl = generateShareImage(applicableToday, savedDoneIds, todayStr)
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
          count_enabled: newCountEnabled,
          count_goal: newCountEnabled ? Number(newCountGoal) || null : null,
          count_label: newCountEnabled ? newCountLabel.trim() || null : null,
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
      setNewCountEnabled(false)
      setNewCountGoal('10')
      setNewCountLabel('')
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
        const cEnabled = row.countEnabled
        const cGoal = cEnabled ? (Math.floor(Number(row.countGoal)) >= 1 ? Math.min(100000, Math.floor(Number(row.countGoal))) : null) : null
        const cLabel = cEnabled ? (row.countLabel.trim().slice(0, 40) || null) : null
        const same =
          orig.points === pts &&
          orig.title === tit &&
          (orig.description ?? '') === (descNorm ?? '') &&
          orig.count_enabled === cEnabled &&
          (orig.count_goal ?? null) === cGoal &&
          (orig.count_label ?? null) === cLabel
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
            count_enabled: cEnabled,
            count_goal: cGoal,
            count_label: cLabel,
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

  // Tarefa com contador conta como feita quando bate a meta (count_goal).
  const counterMet = useCallback(
    (t: ProLideresDailyTaskRow): boolean =>
      t.count_enabled && t.count_goal != null && (todayCounts[t.id] ?? 0) >= t.count_goal,
    [todayCounts]
  )

  // "Feito" combinando o check (tarefa normal) com a meta batida (tarefa com contador).
  const isDoneDraft = useCallback(
    (t: ProLideresDailyTaskRow): boolean => (t.count_enabled ? counterMet(t) : todayDraft.has(t.id)),
    [counterMet, todayDraft]
  )
  const isDoneSaved = useCallback(
    (t: ProLideresDailyTaskRow): boolean => (t.count_enabled ? counterMet(t) : todaySaved.has(t.id)),
    [counterMet, todaySaved]
  )

  // Apenas tarefas SEM contador participam do botão "Salvar execução".
  const applicableNonCounter = applicableToday.filter((t) => !t.count_enabled)

  const todayHasUnsavedChanges = useMemo(
    () => !taskIdSetsEqual(todayDraft, todaySaved),
    [todayDraft, todaySaved]
  )

  const canSaveToday =
    applicableNonCounter.length > 0 && !savingToday && (!todaySubmitted || todayHasUnsavedChanges)

  // Progresso ao vivo: conta tarefas feitas (check + metas batidas) e seus pontos.
  const todayDraftCount = applicableToday.filter((t) => isDoneDraft(t)).length
  const todayDraftPoints = applicableToday
    .filter((t) => isDoneDraft(t))
    .reduce((s, t) => s + t.points, 0)
  const todayMaxPoints = applicableToday.reduce((s, t) => s + t.points, 0)
  const todayProgressPct =
    applicableToday.length > 0 ? Math.round((todayDraftCount / applicableToday.length) * 100) : 0

  function headerGradient(pct: number): string {
    if (pct >= 100) return 'linear-gradient(135deg,#059669 0%,#047857 55%,#065f46 100%)'
    if (pct >= 81)  return 'linear-gradient(135deg,#16a34a 0%,#15803d 55%,#14532d 100%)'
    if (pct >= 61)  return 'linear-gradient(135deg,#0891b2 0%,#0e7490 55%,#164e63 100%)'
    if (pct >= 41)  return 'linear-gradient(135deg,#d97706 0%,#b45309 55%,#92400e 100%)'
    if (pct >= 21)  return 'linear-gradient(135deg,#4f46e5 0%,#4338ca 55%,#3730a3 100%)'
    if (pct > 0)    return 'linear-gradient(135deg,#7c3aed 0%,#6d28d9 55%,#5b21b6 100%)'
    return 'linear-gradient(135deg,#6b7280 0%,#4b5563 55%,#374151 100%)'
  }

  function barGradient(pct: number): string {
    if (pct >= 100) return 'linear-gradient(90deg,#6ee7b7,#fff)'
    if (pct >= 81)  return 'linear-gradient(90deg,#86efac,#fff)'
    if (pct >= 61)  return 'linear-gradient(90deg,#67e8f9,#fff)'
    if (pct >= 41)  return 'linear-gradient(90deg,#fed7aa,#fff)'
    if (pct >= 21)  return 'linear-gradient(90deg,#c4b5fd,#fff)'
    if (pct > 0)    return 'linear-gradient(90deg,#ddd6fe,#fff)'
    return 'none'
  }

  function scoreColor(pct: number): string {
    if (pct >= 100) return '#059669'
    if (pct >= 81)  return '#16a34a'
    if (pct >= 61)  return '#0891b2'
    if (pct >= 41)  return '#d97706'
    if (pct >= 21)  return '#4f46e5'
    if (pct > 0)    return '#7c3aed'
    return '#6b7280'
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

  const savedDoneIds = new Set<string>(applicableToday.filter((t) => isDoneSaved(t)).map((t) => t.id))
  const celebrationPoints = applicableToday.filter((t) => savedDoneIds.has(t.id)).reduce((s, t) => s + t.points, 0)
  const celebrationMax = applicableToday.reduce((s, t) => s + t.points, 0)
  const celebrationPct = celebrationMax > 0 ? Math.round((celebrationPoints / celebrationMax) * 100) : 0
  const celebrationEmoji = celebrationPct >= 100 ? '🏆' : celebrationPct >= 81 ? '🎯' : celebrationPct >= 61 ? '💥' : celebrationPct >= 41 ? '🔥' : celebrationPct >= 21 ? '⚡' : celebrationPct > 0 ? '🚀' : '🌱'
  const celebrationTitle = celebrationPct >= 100 ? 'Dia lendário!' : celebrationPct >= 81 ? 'Um passo para o dia perfeito!' : celebrationPct >= 61 ? 'Dia forte! Continue assim!' : celebrationPct >= 41 ? 'Passou da metade!' : celebrationPct >= 21 ? 'Você está em movimento!' : celebrationPct > 0 ? 'O primeiro passo está dado!' : 'Amanhã é uma nova chance!'
  const celebrationSub = celebrationPct >= 100 ? 'Isso é consistência. É assim que líderes são feitos.' : celebrationPct >= 81 ? 'Finaliza forte — você chegou até aqui.' : celebrationPct >= 61 ? 'Você está construindo algo real. Falta pouco.' : celebrationPct >= 41 ? 'A segunda metade é onde os líderes se revelam.' : celebrationPct >= 21 ? 'Quem começa já está na frente. Não para.' : celebrationPct > 0 ? 'Cada ação planta uma semente. Continue.' : 'Reflita o que travou hoje. Amanhã você recomeça.'

  return (
    <div className="max-w-4xl space-y-6">
      {/* Popup de conquista — 100% salvo */}
      {showCelebration && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setShowCelebration(false) }}
        >
          <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Cabeçalho — cor muda conforme progresso */}
            <div className="flex flex-col items-center px-6 pt-8 pb-6" style={{ background: headerGradient(celebrationPct) }}>
              <span className="text-5xl leading-none mb-2">{celebrationEmoji}</span>
              <p className="text-2xl font-black text-white">{celebrationTitle}</p>
              <p className="mt-1 text-sm font-semibold text-white/80">{celebrationSub}</p>
              <div className="mt-4 rounded-2xl bg-white px-6 py-3 text-center shadow-lg">
                <p className="text-4xl font-black leading-none" style={{ color: scoreColor(celebrationPct) }}>{celebrationPoints}</p>
                <p className="mt-1 text-xs font-bold uppercase tracking-wide text-gray-400">de {celebrationMax} pts</p>
              </div>
            </div>
            {/* Lista de tarefas — feitas e não feitas */}
            <div className="divide-y divide-gray-100 bg-gray-50">
              {applicableToday.map(t => {
                const done = savedDoneIds.has(t.id)
                return (
                <div key={t.id} className={`flex items-center gap-3 px-4 py-2.5 ${done ? 'bg-emerald-50/50' : ''}`}>
                  {done ? (
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                      </svg>
                    </div>
                  ) : (
                    <div className="h-5 w-5 shrink-0 rounded-full border-2 border-gray-200 bg-white" />
                  )}
                  <span className={`flex-1 text-sm font-medium ${done ? 'text-gray-700 line-through decoration-emerald-400' : 'text-gray-400'}`}>
                    {t.title}
                    {t.count_enabled && (
                      <span className="ml-1 font-bold text-emerald-700">
                        — {todayCounts[t.id] ?? 0}{t.count_goal != null ? `/${t.count_goal}` : ''}
                      </span>
                    )}
                  </span>
                  <span className={`text-xs font-bold ${done ? 'text-emerald-600' : 'text-gray-300'}`}>+{t.points}</span>
                </div>
                )
              })}
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
                    {todayProgressPct > 0 && todayProgressPct < 21 && '🚀 O primeiro passo está dado!'}
                    {todayProgressPct >= 21 && todayProgressPct < 41 && '⚡ Você está em movimento!'}
                    {todayProgressPct >= 41 && todayProgressPct < 61 && '🔥 Passou da metade — não para agora!'}
                    {todayProgressPct >= 61 && todayProgressPct < 81 && '💥 Dia forte! Continue assim!'}
                    {todayProgressPct >= 81 && todayProgressPct < 100 && '🎯 Um passo para o dia perfeito!'}
                    {todayProgressPct === 100 && '🏆 Dia lendário! Parabéns!'}
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
                if (t.count_enabled) {
                  return (
                    <CounterTaskRow
                      key={t.id}
                      task={t}
                      quantity={todayCounts[t.id] ?? 0}
                      saving={!!countSaving[t.id]}
                      onSave={(qty) => void saveCount(t.id, qty)}
                    />
                  )
                }
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

                    {/* Badge de pontos — cor reflete o valor */}
                    <span className={`shrink-0 self-start rounded-full px-2.5 py-1 text-xs font-bold transition-colors ${ptsBadgeClass(t.points, checked)}`}>
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
            {(savingToday || !todaySaveOk || todayHasUnsavedChanges || todaySubmitted) && (
              <p className="text-center text-xs font-medium">
                {savingToday ? (
                  <span className="text-blue-600">Salvando…</span>
                ) : !todaySaveOk ? (
                  <span className="text-red-600">Não foi possível salvar. Tente novamente.</span>
                ) : todayHasUnsavedChanges ? (
                  <span className="text-amber-600">⚠️ Alterações não salvas</span>
                ) : savedDoneIds.size > 0 ? (
                  <span className="text-emerald-600">✅ Salvo com sucesso</span>
                ) : (
                  <span className="text-emerald-600">✅ Salvo — 0 pontos hoje</span>
                )}
              </p>
            )}

            {applicableNonCounter.length > 0 && (
              <button
                type="button"
                disabled={!canSaveToday}
                onClick={() => void saveTodayDraft()}
                className={`w-full min-h-[52px] rounded-xl px-4 py-3 text-sm font-bold text-white shadow-md transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                  canSaveToday
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                    : 'bg-gray-400'
                }`}
              >
                {savingToday
                  ? 'Salvando…'
                  : todayProgressPct === 100
                    ? '🏆 Salvar — dia lendário!'
                    : todayDraftCount === 0 && !todaySubmitted
                      ? 'Salvar — 0 pontos hoje'
                      : 'Salvar execução de hoje'}
              </button>
            )}

            {/* Botão compartilhar — gera imagem PNG e usa Web Share API / download */}
            {savedDoneIds.size > 0 && todaySaveOk && (
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
                        <div className="rounded-lg border border-gray-200 bg-gray-50/70 p-2.5">
                          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-gray-700">
                            <input
                              type="checkbox"
                              checked={row.countEnabled}
                              onChange={(e) => updateTaskRow(row.id, { countEnabled: e.target.checked })}
                              className="h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            Pedir quantidade (ex.: &quot;falei com X pessoas&quot;)
                          </label>
                          {row.countEnabled && (
                            <>
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                <label className="block">
                                  <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-gray-500">
                                    Meta
                                  </span>
                                  <input
                                    type="number"
                                    min={1}
                                    max={100000}
                                    value={row.countGoal}
                                    onChange={(e) => updateTaskRow(row.id, { countGoal: e.target.value })}
                                    placeholder="10"
                                    className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm font-semibold text-gray-900"
                                  />
                                </label>
                                <label className="block">
                                  <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-gray-500">
                                    Unidade (opcional)
                                  </span>
                                  <input
                                    value={row.countLabel}
                                    onChange={(e) => updateTaskRow(row.id, { countLabel: e.target.value })}
                                    placeholder="pessoas"
                                    className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-900"
                                  />
                                </label>
                              </div>
                              <p className="mt-1.5 text-[10px] leading-snug text-gray-500">
                                Ao bater a meta, o ponto é dado automático. Abaixo da meta, o número fica
                                registrado para você ver no painel.
                              </p>
                            </>
                          )}
                        </div>
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
                    <div className="sm:col-span-2 rounded-lg border border-gray-200 bg-gray-50/70 p-2.5">
                      <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-gray-700">
                        <input
                          type="checkbox"
                          checked={newCountEnabled}
                          onChange={(e) => setNewCountEnabled(e.target.checked)}
                          className="h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Pedir quantidade (ex.: &quot;falei com X pessoas&quot;)
                      </label>
                      {newCountEnabled && (
                        <>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <label className="block">
                              <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-gray-500">
                                Meta
                              </span>
                              <input
                                type="number"
                                min={1}
                                max={100000}
                                value={newCountGoal}
                                onChange={(e) => setNewCountGoal(e.target.value)}
                                placeholder="10"
                                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm font-semibold text-gray-900"
                              />
                            </label>
                            <label className="block">
                              <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-gray-500">
                                Unidade (opcional)
                              </span>
                              <input
                                value={newCountLabel}
                                onChange={(e) => setNewCountLabel(e.target.value)}
                                placeholder="pessoas"
                                className="w-full rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-gray-900"
                              />
                            </label>
                          </div>
                          <p className="mt-1.5 text-[10px] leading-snug text-gray-500">
                            Ao bater a meta, o ponto é dado automático. Abaixo da meta, o número fica
                            registrado para você ver no painel.
                          </p>
                        </>
                      )}
                    </div>
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
