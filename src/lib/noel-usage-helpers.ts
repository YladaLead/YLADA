/**
 * Helpers para controle de uso mensal do Noel (freemium).
 * @see docs/SPEC-FREEMIUM-YLADA.md
 */
import { supabaseAdmin } from '@/lib/supabase'
import { FREEMIUM_LIMITS } from '@/config/freemium-limits'

function getMonthRef(): string {
  const d = new Date()
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

/**
 * Retorna quantas análises avançadas o usuário já usou este mês.
 */
export async function getNoelUsageCount(userId: string): Promise<number> {
  if (!supabaseAdmin) return 0
  const monthRef = getMonthRef()
  const { data, error } = await supabaseAdmin
    .from('ylada_noel_monthly_usage')
    .select('usage_count')
    .eq('user_id', userId)
    .eq('month_ref', monthRef)
    .maybeSingle()
  if (error || !data) return 0
  return (data.usage_count as number) ?? 0
}

/**
 * Incrementa a contagem de uso do Noel para o mês atual.
 */
export async function incrementNoelUsage(userId: string): Promise<void> {
  if (!supabaseAdmin) return
  const monthRef = getMonthRef()
  const now = new Date().toISOString()
  const { data: existing } = await supabaseAdmin
    .from('ylada_noel_monthly_usage')
    .select('usage_count')
    .eq('user_id', userId)
    .eq('month_ref', monthRef)
    .maybeSingle()
  if (existing) {
    await supabaseAdmin
      .from('ylada_noel_monthly_usage')
      .update({
        usage_count: ((existing.usage_count as number) ?? 0) + 1,
        updated_at: now,
      })
      .eq('user_id', userId)
      .eq('month_ref', monthRef)
  } else {
    await supabaseAdmin.from('ylada_noel_monthly_usage').insert({
      user_id: userId,
      month_ref: monthRef,
      usage_count: 1,
      updated_at: now,
    })
  }
}
