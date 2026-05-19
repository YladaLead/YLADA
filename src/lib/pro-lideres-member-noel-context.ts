import type { SupabaseClient } from '@supabase/supabase-js'
import { weekdayFromYmd } from '@/lib/pro-lideres-daily-tasks-points'
import { proLideresDailyTasksBlockedForMember } from '@/lib/pro-lideres-daily-tasks-access'
import type { LeaderTenantRow } from '@/types/leader-tenant'
import type { ProLideresDailyTaskRow } from '@/types/pro-lideres-daily-tasks'
import type { ProLideresTenantRole } from '@/types/leader-tenant'
import type { WellnessObjeção } from '@/types/wellness-system'
import { buscarObjeçãoPorTexto } from '@/lib/wellness-system/noel-engine/objections/objection-matcher'

const MAX_TASKS_CHARS = 3500
const MAX_OBJECTION_CHARS = 2200

/** Data civil em America/Sao_Paulo (YYYY-MM-DD). */
export function proLideresMemberNoelTodayYmdBr(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date())
}

/**
 * Tarefas diárias do líder aplicáveis a hoje (para o membro executar no campo).
 */
export async function buildProLideresMemberNoelDailyTasksExcerpt(
  supabase: SupabaseClient,
  params: {
    tenant: Pick<LeaderTenantRow, 'id' | 'daily_tasks_visible_to_team'>
    role: ProLideresTenantRole
    ymd?: string
  }
): Promise<string | null> {
  if (proLideresDailyTasksBlockedForMember(params.tenant, params.role)) {
    return null
  }

  const ymd = params.ymd ?? proLideresMemberNoelTodayYmdBr()
  const dow = weekdayFromYmd(ymd)

  const { data: taskRows, error } = await supabase
    .from('pro_lideres_daily_tasks')
    .select('title, description, points, execution_weekdays, sort_order')
    .eq('leader_tenant_id', params.tenant.id)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.warn('[pro-lideres-member-noel-context] daily tasks', error.message)
    return null
  }

  const tasks = (taskRows ?? []) as Pick<
    ProLideresDailyTaskRow,
    'title' | 'description' | 'points' | 'execution_weekdays'
  >[]

  const todayTasks = tasks.filter((t) => (t.execution_weekdays ?? []).includes(dow))
  if (!todayTasks.length) {
    return `Nenhuma tarefa cadastrada para ${ymd} (dia da semana sem checklist do líder).`
  }

  const lines: string[] = [`Checklist do líder para hoje (${ymd}):`]
  for (const t of todayTasks) {
    const title = (t.title || '').trim()
    if (!title) continue
    const pts = typeof t.points === 'number' ? t.points : 0
    const desc = (t.description || '').trim()
    lines.push(`- **${title}** (${pts} pts)${desc ? ` — ${desc}` : ''}`)
    if (lines.join('\n').length > MAX_TASKS_CHARS) break
  }

  return lines.join('\n').slice(0, MAX_TASKS_CHARS)
}

/** Busca objeção Wellness por texto do membro (keyword + DB). */
export async function fetchProLideresMemberNoelObjection(
  userMessage: string
): Promise<WellnessObjeção | null> {
  try {
    return await buscarObjeçãoPorTexto(userMessage)
  } catch (e) {
    console.warn('[pro-lideres-member-noel-context] objection', e)
    return null
  }
}

/** Trecho para o system prompt a partir de objeção detectada. */
export function buildProLideresMemberNoelObjectionExcerpt(obj: WellnessObjeção | null): string | null {
  if (!obj) return null

  const base =
    (obj.versao_curta || '').trim() ||
    (obj.versao_media || '').trim() ||
    (obj.resposta_se_some || '').trim() ||
    (obj.gatilho_retomada || '').trim()

  if (!base) return null

  const label = (obj.objeção || obj.codigo || 'objeção').trim()
  const block = [
    `Código: **${obj.codigo}** · Categoria: ${obj.categoria}`,
    `Frase típica: «${label}»`,
    `Referência aprovada (adapte ao tom do membro; não copie robótico):`,
    base.slice(0, MAX_OBJECTION_CHARS),
  ].join('\n')

  return block.slice(0, MAX_OBJECTION_CHARS + 200)
}

export const PRO_LIDERES_NOEL_MEMBER_MODEL =
  process.env.PRO_LIDERES_NOEL_MEMBER_MODEL?.trim() ||
  process.env.OPENAI_MODEL?.trim() ||
  'gpt-4.1-mini-2025-04-14'
