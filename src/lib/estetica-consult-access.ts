import type { SupabaseClient } from '@supabase/supabase-js'

/** Compara só o calendário (YYYY-MM-DD). Válido inclusive no dia access_valid_until. */
export function isEsteticaConsultAccessExpired(accessValidUntil: string | null | undefined): boolean {
  if (!accessValidUntil) return false
  const end = accessValidUntil.slice(0, 10)
  const today = new Date().toISOString().slice(0, 10)
  return today > end
}

/** Dias até ao fim do período (0 = último dia válido). Negativo = já caducado. */
export function daysUntilEsteticaConsultAccessEnds(accessValidUntil: string | null | undefined): number | null {
  if (!accessValidUntil) return null
  const end = accessValidUntil.slice(0, 10)
  const today = new Date().toISOString().slice(0, 10)
  const a = new Date(`${end}T12:00:00.000Z`).getTime()
  const b = new Date(`${today}T12:00:00.000Z`).getTime()
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null
  return Math.round((a - b) / 86400000)
}

export async function isEsteticaConsultPainelAccessExpiredForTenant(
  admin: SupabaseClient,
  tenantId: string
): Promise<boolean> {
  const { data } = await admin
    .from('ylada_estetica_consult_clients')
    .select('access_valid_until')
    .eq('leader_tenant_id', tenantId)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const until = (data as { access_valid_until?: string | null } | null)?.access_valid_until
  return isEsteticaConsultAccessExpired(until)
}
