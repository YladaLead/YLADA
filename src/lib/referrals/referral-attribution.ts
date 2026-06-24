/**
 * Atribuição do loop (Spec_Loop_KFactor §5.1). Resolve QUEM leva o crédito por um
 * link e devolve o código curto desse indicador (get-or-create). Dependência (db)
 * injetada. Preferir o sharer real (membro Pró-Líderes via pl_m) ao dono do link.
 */
import type { SupabaseClient } from '@supabase/supabase-js'
import { generateReferralCode } from './referral-code'

/** Tenta o membro Pró-Líderes (pl_m) primeiro; senão o dono do link (ylada_links.user_id). */
export async function resolveReferrerForLink(
  db: SupabaseClient,
  input: { slug: string; plToken?: string | null },
): Promise<string | null> {
  if (input.plToken) {
    const { data: member } = await db
      .from('pro_lideres_member_link_tokens')
      .select('member_user_id')
      .eq('token', input.plToken)
      .maybeSingle()
    const memberId = (member as { member_user_id?: string } | null)?.member_user_id
    if (memberId) return memberId
  }
  const { data: link } = await db
    .from('ylada_links')
    .select('user_id')
    .eq('slug', input.slug)
    .maybeSingle()
  return (link as { user_id?: string } | null)?.user_id ?? null
}

/** Lê o código do usuário; se não existe, cria (com poucas tentativas em caso de colisão). */
export async function getOrCreateReferralCode(
  db: SupabaseClient,
  userId: string,
): Promise<string | null> {
  const { data: existing } = await db
    .from('referral_codes')
    .select('code')
    .eq('user_id', userId)
    .maybeSingle()
  const found = (existing as { code?: string } | null)?.code
  if (found) return found

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = generateReferralCode()
    const { error } = await db.from('referral_codes').insert({ user_id: userId, code })
    if (!error) return code
    // Conflito de user_id (corrida) → relê; conflito de code → tenta outro.
    const { data: raced } = await db
      .from('referral_codes')
      .select('code')
      .eq('user_id', userId)
      .maybeSingle()
    const racedCode = (raced as { code?: string } | null)?.code
    if (racedCode) return racedCode
  }
  console.error('[referral-attribution] falha ao criar code para', userId)
  return null
}

/** Atalho usado pelo selo: resolve o indicador do link e devolve o código a pôr na URL. */
export async function resolveReferralCodeForLink(
  db: SupabaseClient,
  input: { slug: string; plToken?: string | null },
): Promise<string | null> {
  const referrerId = await resolveReferrerForLink(db, input)
  if (!referrerId) return null
  return getOrCreateReferralCode(db, referrerId)
}
