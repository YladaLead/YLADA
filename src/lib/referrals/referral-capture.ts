/**
 * Captura do loop (Spec_Loop_KFactor §5.3/§6). Grava a indicação no cadastro
 * (signup atribuído) e marca a ativação no 1º link (k honesto). Dependência (db)
 * injetada. Ignora auto-indicação (§8). Idempotente por referred_user_id (UNIQUE).
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import { recordReferralEvent } from './referral-events'
import type { ReferralSource } from './referral-url'

async function resolveReferrerByCode(db: SupabaseClient, code: string): Promise<string | null> {
  const { data } = await db
    .from('referral_codes')
    .select('user_id')
    .eq('code', code)
    .maybeSingle()
  return (data as { user_id?: string } | null)?.user_id ?? null
}

export type CaptureResult = 'recorded' | 'self_referral' | 'unknown_code' | 'duplicate' | 'error'

/**
 * Liga o novo usuário ao indicador. Chamada no fim do cadastro/login (com sessão).
 * Nunca lança — devolve um resultado pro chamador logar, sem travar o fluxo de auth.
 */
export async function captureReferralSignup(
  db: SupabaseClient,
  input: {
    referredUserId: string
    code: string
    source?: ReferralSource
    originSlug?: string | null
  },
): Promise<CaptureResult> {
  try {
    const referrerId = await resolveReferrerByCode(db, input.code)
    if (!referrerId) return 'unknown_code'
    if (referrerId === input.referredUserId) return 'self_referral'

    const { data: already } = await db
      .from('user_referrals')
      .select('id')
      .eq('referred_user_id', input.referredUserId)
      .maybeSingle()
    if (already) return 'duplicate'

    const { error } = await db.from('user_referrals').insert({
      referrer_user_id: referrerId,
      referred_user_id: input.referredUserId,
      referral_code: input.code,
      source: input.source ?? 'diagnostico',
      origin_slug: input.originSlug ?? null,
      signed_up_at: new Date().toISOString(),
    })
    if (error) {
      // UNIQUE (corrida de duplo submit) não é erro real.
      if (error.code === '23505') return 'duplicate'
      console.error('[referral-capture] insert', error.message)
      return 'error'
    }

    await recordReferralEvent(db, {
      eventType: 'referral_signup',
      userId: input.referredUserId,
      payload: { referrer_user_id: referrerId, code: input.code, source: input.source ?? 'diagnostico' },
    })
    return 'recorded'
  } catch (e) {
    console.error('[referral-capture] inesperado', e)
    return 'error'
  }
}

/**
 * Marca activated_at quando o usuário indicado cria o 1º link. Só atualiza linhas
 * ainda não ativadas → naturalmente "só o primeiro". No-op se o usuário não foi indicado.
 */
export async function markReferralActivationIfFirst(
  db: SupabaseClient,
  input: { referredUserId: string; originSlug?: string | null },
): Promise<boolean> {
  try {
    const { data, error } = await db
      .from('user_referrals')
      .update({ activated_at: new Date().toISOString() })
      .eq('referred_user_id', input.referredUserId)
      .is('activated_at', null)
      .select('id')
    if (error) {
      console.error('[referral-capture] activation', error.message)
      return false
    }
    if (!data || data.length === 0) return false

    await recordReferralEvent(db, {
      eventType: 'referral_activated',
      userId: input.referredUserId,
      payload: { origin_slug: input.originSlug ?? null },
    })
    return true
  } catch (e) {
    console.error('[referral-capture] activation inesperado', e)
    return false
  }
}
