/**
 * Controle da Carol pelo admin (banco de dados).
 * Permite ligar/desligar a Carol em /admin/whatsapp sem mexer em .env ou Vercel.
 */
import { supabaseAdmin } from '@/lib/supabase'

const KEY = 'carol_automation_disabled'

/**
 * Lê do banco se a Carol está desligada.
 * Se não houver valor no banco, usa o env (compatibilidade).
 */
export async function getCarolAutomationDisabled(): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from('app_settings')
      .select('value')
      .eq('key', KEY)
      .maybeSingle()

    if (error || !data?.value) {
      return process.env.CAROL_AUTOMATION_DISABLED !== 'false'
    }
    const v = data.value
    if (typeof v === 'boolean') return v
    if (v === true || v === 'true') return true
    return false
  } catch {
    return process.env.CAROL_AUTOMATION_DISABLED !== 'false'
  }
}

/**
 * Define no banco se a Carol está desligada (apenas admin).
 */
export async function setCarolAutomationDisabled(disabled: boolean): Promise<{ error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('app_settings')
      .upsert(
        { key: KEY, value: disabled, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )
    if (error) return { error: error.message }
    return {}
  } catch (e: any) {
    return { error: e?.message || 'Erro ao salvar' }
  }
}
