/**
 * Eventos do loop em ylada_behavioral_events (Spec_Loop_KFactor §5.4). Reusa a
 * infra de eventos existente (mesmo padrão de funnel-events). Dependência (db)
 * injetada — nunca importa o cliente global.
 */
import type { SupabaseClient } from '@supabase/supabase-js'

export type ReferralEventType =
  | 'referral_landing_view' // abriu a página /criar com ref
  | 'referral_signup' // cadastrou com ref atribuído
  | 'referral_activated' // criou o 1º link como usuário indicado

/**
 * Grava um evento de indicação. Falha de I/O é logada, nunca propagada — um
 * evento perdido não pode derrubar cadastro/criação de link.
 */
export async function recordReferralEvent(
  db: SupabaseClient,
  input: {
    eventType: ReferralEventType
    userId: string | null
    payload?: Record<string, unknown>
  },
): Promise<void> {
  const { error } = await db.from('ylada_behavioral_events').insert({
    event_type: input.eventType,
    user_id: input.userId,
    link_id: null,
    metrics_id: null,
    payload: input.payload ?? {},
  })
  if (error) {
    console.error('[referral-events]', input.eventType, error.message)
  }
}
