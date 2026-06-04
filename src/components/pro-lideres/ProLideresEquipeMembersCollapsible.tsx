'use client'

import { BadgeCheck, Eye, MessageCircle, MousePointerClick } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import { copyTextToClipboard } from '@/lib/clipboard'
import type { ProLideresMemberListItem } from '@/lib/pro-lideres-members-enriched'
import type { ProLideresTenantRole } from '@/types/leader-tenant'

function roleLabel(role: ProLideresTenantRole): string {
  return role === 'leader' ? 'Líder' : 'Equipe'
}

type MemberDiagRow = {
  linkId: string
  title: string
  slug: string
  views: number
  starts: number
  completions: number
  whatsappClicks: number
}

type MemberDiagRowScored = MemberDiagRow & { score: number }

function rowInsight(r: MemberDiagRow): string | null {
  if (r.views === 0) return null
  if (r.views >= 2 && r.whatsappClicks === 0 && r.completions > 0) {
    return 'Chegou ao resultado, mas ainda sem WhatsApp'
  }
  if (r.views >= 2 && r.starts === 0) {
    return 'Muitas vistas, poucos inícios de fluxo'
  }
  if (r.starts > 0 && r.completions === 0) {
    return 'Início sem conclusão / resultado'
  }
  return null
}

/** Métricas por ferramenta: só números + rótulos (sem gráfico de barras). */
function ToolMetricsNumbers({ row }: { row: MemberDiagRow }) {
  const items: { n: number; label: string }[] = [
    { n: row.views, label: 'Ver link' },
    { n: row.starts, label: 'Clicou' },
    { n: row.completions, label: 'Resultado' },
    { n: row.whatsappClicks, label: 'WhatsApp' },
  ]
  return (
    <div className="mt-2 grid grid-cols-4 gap-1 rounded-lg bg-gray-50/95 px-1 py-2 sm:gap-2 sm:px-2">
      {items.map((it) => (
        <div key={it.label} className="min-w-0 text-center">
          <p className="text-base font-bold tabular-nums leading-none text-gray-900 sm:text-lg">{it.n}</p>
          <p className="mt-1 text-[9px] font-medium uppercase leading-tight tracking-wide text-gray-500 sm:text-[10px]">
            {it.label}
          </p>
        </div>
      ))}
    </div>
  )
}

function MemberToolsDiagBlock({
  memberUserId,
  memberLabel,
  tabulatorName,
  alwaysOpen = false,
}: {
  memberUserId: string
  memberLabel: string
  tabulatorName: string | null
  alwaysOpen?: boolean
}) {
  const [open, setOpen] = useState(alwaysOpen)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rows, setRows] = useState<MemberDiagRow[]>([])
  const [truncated, setTruncated] = useState(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/pro-lideres/equipe/links-diagnostics?days=30&member_user_id=${encodeURIComponent(memberUserId)}`,
          { credentials: 'include' }
        )
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          if (!cancelled) {
            setError((data as { error?: string }).error || 'Não foi possível carregar.')
            setRows([])
            setTruncated(false)
          }
          return
        }
        if (!cancelled) {
          setRows((data as { rows?: MemberDiagRow[] }).rows ?? [])
          setTruncated(Boolean((data as { truncated?: boolean }).truncated))
        }
      } catch {
        if (!cancelled) {
          setError('Erro de rede.')
          setRows([])
          setTruncated(false)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [open, memberUserId])

  const ranked = useMemo((): MemberDiagRowScored[] => {
    const withScore = rows.map((r) => ({
      ...r,
      score: r.views + r.starts * 2 + r.completions * 3 + r.whatsappClicks * 4,
    }))
    withScore.sort((a, b) => b.score - a.score)
    return withScore
  }, [rows])

  const used = ranked.filter((r) => r.score > 0)
  const unused = ranked.filter((r) => r.score === 0)

  const totals = useMemo(() => {
    return used.reduce(
      (acc, r) => ({
        views: acc.views + r.views,
        starts: acc.starts + r.starts,
        completions: acc.completions + r.completions,
        whatsapp: acc.whatsapp + r.whatsappClicks,
      }),
      { views: 0, starts: 0, completions: 0, whatsapp: 0 }
    )
  }, [used])

  return (
    <div className={alwaysOpen ? '' : 'mt-3 border-t border-gray-100 pt-3'}>
      {!alwaysOpen && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="text-left text-xs font-semibold text-blue-700 underline-offset-2 hover:underline"
          aria-expanded={open}
        >
          {open ? 'Ocultar' : 'Ver'} uso das ferramentas (30 dias) — {memberLabel}
        </button>
      )}
      {open ? (
        <div className="mt-2 rounded-xl border border-gray-200/90 bg-gradient-to-b from-white to-gray-50/80 p-3 shadow-sm">
          {tabulatorName ? (
            <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-800">
              <span className="text-gray-500">Tabulador</span>
              <span className="max-w-[12rem] truncate text-gray-900">{tabulatorName}</span>
            </p>
          ) : null}
          <div className="rounded-lg border border-blue-100 bg-blue-50/90 px-2.5 py-2 text-[11px] leading-relaxed text-blue-950">
            <strong className="font-semibold">Como isto é contado:</strong> só entra tráfego feito com o{' '}
            <strong>link rastreado</strong> desta pessoa (código na partilha). Se ela ainda não partilhou o link
            pessoal, os números ficam em zero mesmo que use ferramentas por dentro da conta.
          </div>
          {error ? (
            <p className="mt-2 text-xs font-medium text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          {loading ? (
            <p className="mt-2 text-xs text-gray-500">Carregando…</p>
          ) : ranked.length === 0 ? (
            <p className="mt-2 text-xs text-gray-600">Nenhuma ferramenta catalogada para este espaço.</p>
          ) : (
            <div className="mt-3 space-y-3">
              {truncated ? (
                <p className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1.5 text-[11px] text-amber-950">
                  A amostra de eventos atingiu o limite do servidor neste período — os totais podem estar subestimados.
                  Se precisar de números mais completos, use um período mais curto ou exporte pelo painel (Excel).
                </p>
              ) : null}
              {used.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div className="rounded-lg border border-gray-200 bg-white px-2 py-2 text-center shadow-sm">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        <Eye className="h-3.5 w-3.5 text-sky-600" aria-hidden />
                        Ver link
                      </div>
                      <p className="mt-0.5 text-lg font-bold tabular-nums text-gray-900">{totals.views}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white px-2 py-2 text-center shadow-sm">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        <MousePointerClick className="h-3.5 w-3.5 text-indigo-600" aria-hidden />
                        Início
                      </div>
                      <p className="mt-0.5 text-lg font-bold tabular-nums text-gray-900">{totals.starts}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white px-2 py-2 text-center shadow-sm">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        <BadgeCheck className="h-3.5 w-3.5 text-violet-600" aria-hidden />
                        Resultado
                      </div>
                      <p className="mt-0.5 text-lg font-bold tabular-nums text-gray-900">{totals.completions}</p>
                    </div>
                    <div className="rounded-lg border border-gray-200 bg-white px-2 py-2 text-center shadow-sm">
                      <div className="flex items-center justify-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                        <MessageCircle className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
                        WhatsApp
                      </div>
                      <p className="mt-0.5 text-lg font-bold tabular-nums text-gray-900">{totals.whatsapp}</p>
                    </div>
                  </div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-500">
                    Resumo no período · {used.length} ferramenta(s) com atividade rastreada
                  </p>
                </>
              ) : null}

              {used.length > 0 ? (
                <div>
                  <p className="text-[11px] font-semibold text-gray-600">
                    Ranking: mais uso → menos uso (link rastreado)
                  </p>
                  <ul className="mt-2 space-y-3">
                    {used.map((r) => {
                      const insight = rowInsight(r)
                      const primary =
                        r.whatsappClicks > 0
                          ? `${r.whatsappClicks} contato(s) WhatsApp`
                          : r.completions > 0
                            ? `${r.completions} resultado(s)`
                            : r.starts > 0
                              ? `${r.starts} início(s) de fluxo`
                              : `${r.views} visualização(ões) do link`
                      return (
                        <li
                          key={r.linkId}
                          className="rounded-lg border border-gray-200/90 bg-white p-3 shadow-sm ring-1 ring-gray-100/80"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold leading-snug text-gray-900">{r.title}</p>
                              <p className="mt-0.5 text-[11px] text-gray-500">Slug: {r.slug}</p>
                            </div>
                            <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-900 ring-1 ring-emerald-100">
                              {primary}
                            </span>
                          </div>
                          {insight ? (
                            <p className="mt-2 text-[11px] font-medium text-amber-800">{insight}</p>
                          ) : null}
                          <ToolMetricsNumbers row={r} />
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ) : (
                <div className="rounded-lg border border-gray-200 bg-white px-3 py-3 text-xs text-gray-700">
                  <p className="font-semibold text-gray-900">Nenhum uso rastreado nestes 30 dias</p>
                  <ul className="mt-2 list-inside list-disc space-y-1.5 text-[11px] leading-relaxed text-gray-600">
                    <li>Confirme se a pessoa já está a partilhar o link com o código pessoal (área do membro).</li>
                    <li>Peça um teste: abrir o link partilhado noutro celular e ver se as métricas sobem no dia seguinte.</li>
                    <li>Compare com outro membro da equipe que já tenha números — ajuda a ver se é hábito ou configuração.</li>
                  </ul>
                </div>
              )}
              {unused.length > 0 ? (
                <p className="text-[11px] leading-relaxed text-gray-500">
                  {used.length > 0 ? 'Outras ' : ''}
                  <strong>{unused.length}</strong> ferramenta(s) no catálogo sem cliques rastreados neste período.
                </p>
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  )
}

// ─── WhatsApp helpers ────────────────────────────────────────────────────────

function buildWaUrl(rawPhone: string | null | undefined, text: string): string | null {
  if (!rawPhone) return null
  const digits = rawPhone.replace(/\D/g, '')
  if (digits.length < 10) return null
  const e164 = digits.startsWith('55') && digits.length >= 12 ? digits : `55${digits}`
  return `https://wa.me/${e164}?text=${encodeURIComponent(text)}`
}

function buildContactText(
  m: ProLideresMemberListItem,
  paymentUrl: string | null,
  pixUrl: string | null,
  type: 'renovar' | 'orientar' | 'parabenizar'
): string {
  const primeiroNome = (m.displayName ?? '').split(' ')[0].trim() || 'tudo bem'

  if (type === 'orientar') {
    return `Oi ${primeiroNome}! Queria te dar um retorno rápido sobre seus números esta semana. Você tem 5 minutinhos?`
  }
  if (type === 'parabenizar') {
    return `Oi ${primeiroNome}! 🔥 Vi seus números e queria te parabenizar! Continue assim!`
  }

  // renovar (vencido ou pausado)
  const expired = isMemberAccessExpired(m)
  const intro = expired
    ? `Oi ${primeiroNome}! 👋 Sua assinatura do Pró Líderes venceu. Clique no link e renove agora para continuar com todos os benefícios:`
    : `Oi ${primeiroNome}, sua assinatura está pausada. Clique no link e renove agora para ter todos os benefícios:`
  const parts = [intro]
  if (paymentUrl) parts.push(`💳 Cartão/assinatura: ${paymentUrl}`)
  if (pixUrl) parts.push(`📱 Pix: ${pixUrl}`)
  return parts.join('\n')
}

function WaButton({
  phone,
  text,
  label,
  variant,
  onCopy,
}: {
  phone: string | null | undefined
  text: string
  label: string
  variant: 'renovar' | 'orientar' | 'parabenizar'
  onCopy: (msg: string) => void
}) {
  const url = buildWaUrl(phone, text)
  const colorClass =
    variant === 'renovar'
      ? 'border-green-500 bg-green-50 text-green-900 hover:bg-green-100'
      : variant === 'parabenizar'
        ? 'border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100'
        : 'border-sky-400 bg-sky-50 text-sky-900 hover:bg-sky-100'

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex min-h-[28px] items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold transition ${colorClass}`}
      >
        {label}
      </a>
    )
  }
  // Fallback: sem telefone → copia mensagem
  return (
    <button
      type="button"
      title="WhatsApp não cadastrado — clique para copiar a mensagem"
      onClick={() => onCopy(text)}
      className={`inline-flex min-h-[28px] items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold transition border-gray-300 bg-gray-50 text-gray-700 hover:bg-gray-100`}
    >
      📋 {label}
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

type StatusFilter = 'todos' | 'ativo' | 'pausado' | 'vencido'

const STATUS_FILTER_LABELS: Record<StatusFilter, string> = {
  todos: 'Todos',
  ativo: 'Ativo',
  pausado: 'Pausado',
  vencido: 'Vencido',
}

/** Validade expirada (pagamento/plano) — independente de pausa manual. */
function isMemberAccessExpired(m: ProLideresMemberListItem): boolean {
  if (m.role !== 'member') return false
  if (m.teamAccessState === 'pending_activation') return false
  const exp = m.teamAccessExpiresAt
  if (!exp) return false
  const ms = new Date(exp).getTime()
  return !Number.isNaN(ms) && ms <= Date.now()
}

function memberMatchesStatusFilter(m: ProLideresMemberListItem, filter: StatusFilter): boolean {
  if (filter === 'todos') return true
  if (m.role === 'leader') return false
  if (filter === 'vencido') return isMemberAccessExpired(m)
  if (filter === 'ativo') {
    return m.teamAccessState === 'active' && !isMemberAccessExpired(m)
  }
  if (filter === 'pausado') {
    return m.teamAccessState === 'paused' && !isMemberAccessExpired(m)
  }
  return true
}

function formatExpiryPt(iso: string | null): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}

/** Texto da coluna «Validade» para o líder. */
function validadeResumo(m: ProLideresMemberListItem): string {
  if (m.role === 'leader') return '—'
  const exp = m.teamAccessExpiresAt
  const expLabel = formatExpiryPt(exp)
  if (isMemberAccessExpired(m) && expLabel) {
    return `Venceu em ${expLabel}`
  }
  if (m.teamAccessState === 'pending_activation') {
    return expLabel ? `Após ativar (${expLabel})` : 'Após ativar'
  }
  if (!expLabel) {
    return m.teamAccessState === 'active' ? 'Sem data de fim' : '—'
  }
  if (m.teamAccessState === 'active') {
    return expLabel
  }
  if (m.teamAccessState === 'paused') {
    return `Última validade: ${expLabel}`
  }
  return expLabel
}

function MemberAccessStatusBadge({ m }: { m: ProLideresMemberListItem }) {
  if (m.role === 'leader') {
    return (
      <span className="inline-flex w-fit rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
        {roleLabel(m.role)}
      </span>
    )
  }
  if (isMemberAccessExpired(m)) {
    return (
      <span className="inline-flex w-fit rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-900">
        Vencido
      </span>
    )
  }
  if (m.teamAccessState === 'paused') {
    return (
      <span className="inline-flex w-fit rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900">
        Pausado
      </span>
    )
  }
  if (m.teamAccessState === 'pending_activation') {
    return (
      <span className="inline-flex w-fit rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-900">
        Aguarda ativação
      </span>
    )
  }
  if (m.teamAccessState === 'active') {
    return (
      <span className="inline-flex w-fit rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-900">
        Ativo
      </span>
    )
  }
  return null
}

function isoToDateInputValue(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function ProLideresEquipeMembersCollapsible({
  members,
  canManageMembers = false,
  currentUserId,
  paymentUrl = null,
  pixUrl = null,
}: {
  members: ProLideresMemberListItem[]
  /** Só o líder no painel real (não preview) altera pausa / remoção. */
  canManageMembers?: boolean
  /** ID do utilizador logado — mostra badge "Você" e métricas próprias do líder. */
  currentUserId?: string
  /** Link de pagamento por cartão/assinatura configurado pelo líder. */
  paymentUrl?: string | null
  /** Link de pagamento Pix configurado pelo líder. */
  pixUrl?: string | null
}) {
  const router = useRouter()
  const [open, setOpen] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todos')
  const [busyUserId, setBusyUserId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const [activateUserId, setActivateUserId] = useState<string | null>(null)
  /** `pending` = primeira ativação; `paused` = retomar; `expiry` = ajustar data (já ativo). */
  const [activateFlow, setActivateFlow] = useState<'pending' | 'paused' | 'expiry' | null>(null)
  const [activateMode, setActivateMode] = useState<'days' | 'date'>('days')
  const [activateDays, setActivateDays] = useState('30')
  const [activateEndDate, setActivateEndDate] = useState('')
  const [activateNoEnd, setActivateNoEnd] = useState(false)
  const [copyMessage, setCopyMessage] = useState<string | null>(null)
  const [copyCopied, setCopyCopied] = useState(false)
  const [copyError, setCopyError] = useState<string | null>(null)
  const [toolsModal, setToolsModal] = useState<{
    userId: string
    label: string
    tabulatorName: string | null
  } | null>(null)

  const statusCounts = useMemo(() => {
    const teamMembers = members.filter((m) => m.role === 'member')
    return {
      todos: members.length,
      ativo: teamMembers.filter((m) => m.teamAccessState === 'active' && !isMemberAccessExpired(m)).length,
      pausado: teamMembers.filter((m) => m.teamAccessState === 'paused' && !isMemberAccessExpired(m)).length,
      vencido: teamMembers.filter((m) => isMemberAccessExpired(m)).length,
    }
  }, [members])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return members.filter((m) => {
      if (!memberMatchesStatusFilter(m, statusFilter)) return false
      if (!q) return true
      const name = (m.displayName ?? '').toLowerCase()
      const email = (m.email ?? '').toLowerCase()
      const id = m.userId.toLowerCase()
      return name.includes(q) || email.includes(q) || id.includes(q)
    })
  }, [members, query, statusFilter])

  const hasActiveFilters = statusFilter !== 'todos' || query.trim().length > 0

  async function callAccessApi(targetUserId: string, action: 'pause' | 'resume' | 'remove') {
    setActionError(null)
    setBusyUserId(targetUserId)
    try {
      const res = await fetch('/api/pro-lideres/equipe/members/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId, action }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setActionError(data.error || 'Não foi possível concluir a ação.')
        return
      }
      router.refresh()
    } catch {
      setActionError('Erro de rede.')
    } finally {
      setBusyUserId(null)
    }
  }

  async function submitActivate() {
    if (!activateUserId || !activateFlow) return
    setActionError(null)
    const payload: {
      targetUserId: string
      action: string
      accessDays?: number | null
      accessExpiresAt?: string | null
    } = { targetUserId: activateUserId, action: '' }

    if (activateFlow === 'expiry') {
      payload.action = 'set_expiry'
    } else {
      payload.action = activateFlow === 'pending' ? 'activate' : 'resume'
    }

    if (activateNoEnd) {
      payload.accessDays = null
      payload.accessExpiresAt = null
    } else if (activateMode === 'date') {
      if (!activateEndDate.trim()) {
        setActionError('Escolhe a data de validade ou marca «sem data de fim».')
        return
      }
      payload.accessExpiresAt = activateEndDate.trim()
    } else {
      const n = parseInt(activateDays, 10)
      if (!Number.isFinite(n) || n < 1) {
        setActionError('Indica um número válido de dias (ex.: 30) ou escolhe «até data».')
        return
      }
      payload.accessDays = n
    }

    setBusyUserId(activateUserId)
    try {
      const res = await fetch('/api/pro-lideres/equipe/members/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string; copyMessage?: string }
      if (!res.ok) {
        setActionError(data.error || 'Não foi possível concluir.')
        return
      }
      if (activateFlow === 'pending') {
        setCopyCopied(false)
        setCopyError(null)
        setCopyMessage(typeof data.copyMessage === 'string' ? data.copyMessage : null)
      }
      setActivateUserId(null)
      setActivateFlow(null)
      setActivateMode('days')
      setActivateDays('30')
      setActivateEndDate('')
      setActivateNoEnd(false)
      router.refresh()
    } catch {
      setActionError('Erro de rede.')
    } finally {
      setBusyUserId(null)
    }
  }

  async function copyMemberMessage(text: string) {
    setCopyError(null)
    const ok = await copyTextToClipboard(text)
    if (ok) {
      setCopyCopied(true)
      setTimeout(() => setCopyCopied(false), 2500)
      return
    }
    setCopyError('Não foi possível copiar. Seleciona o texto na caixa acima e copia manualmente.')
  }

  function closeCopyModal() {
    setCopyMessage(null)
    setCopyCopied(false)
    setCopyError(null)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-emerald-200/80 bg-white shadow-sm ring-1 ring-emerald-100/60">
      {toolsModal ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={`Ferramentas de ${toolsModal.label}`}
          onClick={(e) => { if (e.target === e.currentTarget) setToolsModal(null) }}
        >
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Uso das ferramentas · 30 dias</p>
                <p className="text-base font-bold text-gray-900">{toolsModal.label}</p>
              </div>
              <button
                type="button"
                onClick={() => setToolsModal(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
                aria-label="Fechar"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <MemberToolsDiagBlock
                memberUserId={toolsModal.userId}
                memberLabel={toolsModal.label}
                tabulatorName={toolsModal.tabulatorName}
                alwaysOpen
              />
            </div>
          </div>
        </div>
      ) : null}

      {activateUserId && activateFlow ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pro-lideres-ativar-titulo"
        >
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
            <h2 id="pro-lideres-ativar-titulo" className="text-lg font-bold text-gray-900">
              {activateFlow === 'pending'
                ? 'Ativar acesso'
                : activateFlow === 'paused'
                  ? 'Retomar acesso'
                  : 'Ajustar validade'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {activateFlow === 'pending'
                ? 'Define o prazo do acesso Pro Líderes. Para alinhar ao plano anual Wellness, use a mesma data de vencimento da assinatura.'
                : activateFlow === 'paused'
                  ? 'Ao retomar, escolhe de novo o prazo. A data aparece na coluna «Validade».'
                  : 'Altera só a data de fim (ex.: 10/01/2027). Não precisa pausar e ativar de novo.'}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                disabled={activateNoEnd}
                onClick={() => setActivateMode('days')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  activateMode === 'days'
                    ? 'bg-emerald-700 text-white'
                    : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                } disabled:opacity-40`}
              >
                Por dias
              </button>
              <button
                type="button"
                disabled={activateNoEnd}
                onClick={() => setActivateMode('date')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  activateMode === 'date'
                    ? 'bg-emerald-700 text-white'
                    : 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50'
                } disabled:opacity-40`}
              >
                Até data
              </button>
            </div>
            {activateMode === 'days' ? (
              <>
            <p className="mt-3 text-xs text-gray-500">Atalhos comuns (mês ~30/31 dias):</p>
            <div className="mt-1 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={activateNoEnd}
                onClick={() => {
                  setActivateDays('30')
                  setActivateNoEnd(false)
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-40"
              >
                30 dias
              </button>
              <button
                type="button"
                disabled={activateNoEnd}
                onClick={() => {
                  setActivateDays('31')
                  setActivateNoEnd(false)
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 disabled:opacity-40"
              >
                31 dias
              </button>
            </div>
            <label className="mt-4 block text-sm font-medium text-gray-800">
              Dias de validade
              <input
                type="number"
                min={1}
                max={3660}
                disabled={activateNoEnd}
                value={activateDays}
                onChange={(e) => setActivateDays(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 disabled:bg-gray-100"
              />
            </label>
              </>
            ) : (
              <label className="mt-4 block text-sm font-medium text-gray-800">
                Válido até (inclusive)
                <input
                  type="date"
                  disabled={activateNoEnd}
                  value={activateEndDate}
                  onChange={(e) => setActivateEndDate(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 disabled:bg-gray-100"
                />
              </label>
            )}
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                checked={activateNoEnd}
                onChange={(e) => setActivateNoEnd(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              Sem data de fim (renovar manualmente)
            </label>
            {actionError ? (
              <p className="mt-3 text-sm font-medium text-red-600" role="alert">
                {actionError}
              </p>
            ) : null}
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                onClick={() => {
                  setActivateUserId(null)
                  setActivateFlow(null)
                  setActionError(null)
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={busyUserId !== null}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                onClick={() => void submitActivate()}
              >
                {busyUserId
                  ? 'A gravar…'
                  : activateFlow === 'pending'
                    ? 'Confirmar ativação'
                    : activateFlow === 'paused'
                      ? 'Confirmar retomação'
                      : 'Guardar validade'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {copyMessage ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pro-lideres-copy-titulo"
        >
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
            <h2 id="pro-lideres-copy-titulo" className="text-lg font-bold text-gray-900">
              Mensagem para a pessoa
            </h2>
            <p className="mt-2 text-sm text-gray-600">Copia e envia por WhatsApp ou e-mail.</p>
            <textarea
              readOnly
              value={copyMessage}
              rows={8}
              className="mt-3 w-full resize-y rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 font-sans text-sm text-gray-900"
            />
            {copyError ? (
              <p className="mt-3 text-sm font-medium text-red-600" role="alert">
                {copyError}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                onClick={() => void copyMemberMessage(copyMessage)}
              >
                {copyCopied ? 'Copiado!' : 'Copiar texto'}
              </button>
              <button
                type="button"
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
                onClick={closeCopyModal}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 border-b border-emerald-200/70 bg-gradient-to-br from-emerald-50 via-green-50/90 to-teal-50/40 px-4 py-3 text-left transition hover:from-emerald-100/80 hover:via-green-50 hover:to-teal-50/50"
        aria-expanded={open}
        id="pro-lideres-equipe-analise-heading"
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-emerald-950">Análise da sua equipe</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="rounded-full bg-white/95 px-2 py-0.5 text-xs font-semibold text-emerald-900 shadow-sm ring-1 ring-emerald-200/80">
            {members.length}
          </span>
          <span className="text-emerald-700/80" aria-hidden>
            {open ? '▲' : '▼'}
          </span>
        </div>
      </button>

      {open ? (
        <div className="border-t border-emerald-100/90">
          <div className="border-b border-gray-100 bg-white px-4 py-2">
            <input
              id="pro-lideres-equipe-busca"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nome ou e-mail…"
              aria-label="Buscar por nome ou e-mail"
              autoComplete="off"
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-900 shadow-sm placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <div
              className="mt-2 flex flex-wrap gap-1.5"
              role="group"
              aria-label="Filtrar por status de acesso"
            >
              {(['todos', 'ativo', 'pausado', 'vencido'] as const).map((key) => {
                const selected = statusFilter === key
                const count = statusCounts[key]
                return (
                  <button
                    key={key}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setStatusFilter(key)}
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold transition ${
                      selected
                        ? key === 'vencido'
                          ? 'bg-red-600 text-white shadow-sm'
                          : key === 'pausado'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : key === 'ativo'
                              ? 'bg-green-600 text-white shadow-sm'
                              : 'bg-emerald-700 text-white shadow-sm'
                        : key === 'vencido'
                          ? 'border border-red-200 bg-red-50 text-red-900 hover:bg-red-100'
                          : key === 'pausado'
                            ? 'border border-amber-200 bg-amber-50 text-amber-950 hover:bg-amber-100'
                            : key === 'ativo'
                              ? 'border border-green-200 bg-green-50 text-green-900 hover:bg-green-100'
                              : 'border border-gray-200 bg-gray-50 text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {STATUS_FILTER_LABELS[key]} ({count})
                  </button>
                )
              })}
            </div>
            {hasActiveFilters ? (
              <p className="mt-1 text-[11px] text-gray-500">
                {filtered.length === 0
                  ? 'Nenhum resultado.'
                  : `${filtered.length} de ${members.length}`}
              </p>
            ) : null}
            {canManageMembers && actionError && !activateUserId ? (
              <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">
                {actionError}
              </p>
            ) : null}
          </div>
          <ul
            className="max-h-[min(72vh,40rem)] divide-y divide-gray-100 overflow-y-auto overscroll-contain"
            aria-labelledby="pro-lideres-equipe-analise-heading"
          >
            {canManageMembers ? (
              <li className="hidden px-4 py-1.5 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,8.5rem)_auto] sm:gap-2 sm:bg-gray-50/80">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Pessoa</span>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">Validade</span>
                <span className="text-right text-[11px] font-semibold uppercase tracking-wide text-gray-500">Ações</span>
              </li>
            ) : null}
            {members.length === 0 ? (
              <li className="px-4 py-6 text-sm text-gray-600">Nenhuma pessoa listada.</li>
            ) : filtered.length === 0 ? (
              <li className="px-4 py-6 text-sm text-gray-600">
                {statusFilter !== 'todos'
                  ? `Nenhum membro com status «${STATUS_FILTER_LABELS[statusFilter]}».`
                  : 'Nenhum resultado para esta pesquisa.'}
              </li>
            ) : (
              filtered.map((m) => {
                const title = m.displayName?.trim() || m.email?.trim() || 'Conta sem nome no perfil YLADA'
                const subtitle = m.email && m.displayName ? m.email : m.userId
                const isCurrentUser = currentUserId != null && m.userId === currentUserId
                const showActions = canManageMembers && m.role === 'member'
                const isBusy = busyUserId === m.userId
                const expired = isMemberAccessExpired(m)
                const vText = validadeResumo(m)
                const canPause = m.teamAccessState === 'active' && !expired
                const canEditExpiry = m.teamAccessState === 'active' && !expired
                const canAtivar =
                  m.teamAccessState === 'pending_activation' ||
                  m.teamAccessState === 'paused' ||
                  expired

                return (
                  <li key={m.userId} className="px-4 py-2.5">
                    <div className="flex flex-col gap-2 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,8.5rem)_auto] sm:items-center sm:gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-900">{title}</p>
                        <p className="truncate text-xs text-gray-500">{subtitle}</p>
                        <div className="mt-1 flex flex-wrap gap-1 sm:hidden">
                          <MemberAccessStatusBadge m={m} />
                          {isCurrentUser ? (
                            <span className="inline-flex w-fit rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800">
                              Você
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="text-xs sm:border-l sm:border-gray-100 sm:pl-2">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500 sm:hidden">Validade</p>
                        <p
                          className={`font-medium leading-tight ${
                            expired ? 'text-red-700' : 'text-gray-900'
                          }`}
                        >
                          {vText}
                        </p>
                      </div>

                      <div className="flex flex-col items-stretch gap-1.5 sm:items-end">
                        <div className="hidden flex-wrap justify-end gap-1.5 sm:flex">
                          <MemberAccessStatusBadge m={m} />
                          {isCurrentUser ? (
                            <span className="inline-flex w-fit rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-800">
                              Você
                            </span>
                          ) : null}
                        </div>

                        {showActions ? (
                          <div className="flex flex-wrap justify-stretch gap-1.5 sm:justify-end">
                            {canEditExpiry ? (
                              <button
                                type="button"
                                title="Alterar data de validade (ex.: alinhar ao plano anual)"
                                disabled={isBusy}
                                onClick={() => {
                                  setActionError(null)
                                  setActivateMode('date')
                                  setActivateEndDate(isoToDateInputValue(m.teamAccessExpiresAt))
                                  setActivateNoEnd(false)
                                  setActivateFlow('expiry')
                                  setActivateUserId(m.userId)
                                }}
                                className="min-h-[30px] flex-1 rounded-md border border-violet-400 bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-950 hover:bg-violet-100 disabled:opacity-50 sm:flex-none sm:min-w-[4.75rem]"
                              >
                                Validade
                              </button>
                            ) : null}
                            <button
                              type="button"
                              title={canPause ? 'Suspender o acesso ao painel' : 'Só com acesso ativo'}
                              disabled={isBusy || !canPause}
                              onClick={() => void callAccessApi(m.userId, 'pause')}
                              className="min-h-[30px] flex-1 rounded-md border border-amber-300 bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-950 hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:min-w-[4.75rem]"
                            >
                              {isBusy && canPause ? '…' : 'Pausar'}
                            </button>
                            <button
                              type="button"
                              title={
                                m.teamAccessState === 'pending_activation'
                                  ? 'Primeira liberação e validade'
                                  : expired || m.teamAccessState === 'paused'
                                    ? 'Renovar validade e voltar a dar acesso'
                                    : 'Já ativo'
                              }
                              disabled={isBusy || !canAtivar}
                              onClick={() => {
                                if (m.teamAccessState === 'pending_activation') {
                                  setActionError(null)
                                  setActivateDays('30')
                                  setActivateNoEnd(false)
                                  setActivateFlow('pending')
                                  setActivateUserId(m.userId)
                                  return
                                }
                                if (m.teamAccessState === 'paused' || expired) {
                                  setActionError(null)
                                  setActivateDays('30')
                                  setActivateNoEnd(false)
                                  setActivateFlow('paused')
                                  setActivateUserId(m.userId)
                                }
                              }}
                              className="min-h-[30px] flex-1 rounded-md border border-green-600 bg-green-50 px-2 py-1 text-xs font-semibold text-green-950 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none sm:min-w-[4.75rem]"
                            >
                              {isBusy && canAtivar ? '…' : 'Ativar'}
                            </button>
                            <button
                              type="button"
                              disabled={isBusy}
                              title="Retirar da equipe deste espaço"
                              onClick={() => {
                                if (
                                  !window.confirm(
                                    'Remover esta pessoa da equipe? Ela deixa de ver o espaço Pro Líderes; links e ferramentas YLADA criados na conta dela não são apagados.'
                                  )
                                ) {
                                  return
                                }
                                void callAccessApi(m.userId, 'remove')
                              }}
                              className="min-h-[30px] flex-1 rounded-md border border-red-300 bg-red-50 px-2 py-1 text-xs font-semibold text-red-900 hover:bg-red-100 disabled:opacity-50 sm:flex-none sm:min-w-[4.75rem]"
                            >
                              {isBusy ? '…' : 'Remover'}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {canManageMembers && m.role === 'member' && (
                      <div className="mt-2 flex flex-wrap gap-1.5 border-t border-gray-100 pt-2">
                        {(expired || m.teamAccessState === 'paused') ? (
                          <WaButton
                            phone={m.whatsapp}
                            text={buildContactText(m, paymentUrl, pixUrl, 'renovar')}
                            label="📲 Renovar via WA"
                            variant="renovar"
                            onCopy={(msg) => { setCopyCopied(false); setCopyError(null); setCopyMessage(msg) }}
                          />
                        ) : (
                          <>
                            <WaButton
                              phone={m.whatsapp}
                              text={buildContactText(m, paymentUrl, pixUrl, 'orientar')}
                              label="💬 Orientar"
                              variant="orientar"
                              onCopy={(msg) => { setCopyCopied(false); setCopyError(null); setCopyMessage(msg) }}
                            />
                            <WaButton
                              phone={m.whatsapp}
                              text={buildContactText(m, paymentUrl, pixUrl, 'parabenizar')}
                              label="⭐ Parabenizar"
                              variant="parabenizar"
                              onCopy={(msg) => { setCopyCopied(false); setCopyError(null); setCopyMessage(msg) }}
                            />
                          </>
                        )}
                        {(m.teamAccessState === 'active' || isCurrentUser) && (
                          <button
                            type="button"
                            onClick={() => setToolsModal({
                              userId: m.userId,
                              label: isCurrentUser ? `${title} (você)` : title,
                              tabulatorName: m.tabulatorName,
                            })}
                            className="inline-flex min-h-[28px] items-center gap-1 rounded-md border border-indigo-300 bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-900 transition hover:bg-indigo-100"
                          >
                            📊 Ver ferramentas
                          </button>
                        )}
                        {!m.whatsapp && (
                          <span className="self-center text-[10px] text-gray-400">
                            (sem WA — clique para copiar)
                          </span>
                        )}
                      </div>
                    )}
                  </li>
                )
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}
