/**
 * Persistência da coleta de contato na ação (item 3 Fase 2). Separado da lib pura
 * (`coleta-contato-na-acao.ts`) porque toca I/O. Grava o WhatsApp colhido pelo Noel
 * em `user_profiles` — a mesma fonte que a guarda do Noel lê
 * (`loadNoelProfileGateContext`), então no turno seguinte o gate já passa.
 *
 * Defensivo: só UPDATE (a linha `user_profiles` já nasce no Plano A, via o ensure do
 * `NoelDiretoComecar`); se não houver linha, não cria nada (silencioso).
 * @see blueprint-plataforma/Ticket_Metodo_Noel_Coleta_Contato_Na_Acao.md
 */
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Grava o WhatsApp (dígitos limpos) em `user_profiles.whatsapp`. Espera o número já
 * validado por `extrairWhatsappDaMensagem` (10–13 dígitos). Não lança: erro vira log.
 */
export async function gravarWhatsappNoUserProfile(
  supabase: SupabaseClient,
  userId: string,
  whatsappDigits: string
): Promise<void> {
  if (whatsappDigits.length < 10) return
  const { error } = await supabase
    .from('user_profiles')
    .update({ whatsapp: whatsappDigits, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
  if (error) {
    console.warn('[coleta-contato-store] gravarWhatsappNoUserProfile:', error.message)
  }
}
