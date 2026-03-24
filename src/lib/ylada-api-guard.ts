import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/** Perfis do produto Wellness (Herbalife / coach bem-estar) — não usam /api/ylada/*. */
const WELLNESS_PRODUCT_PROFILES = new Set(['wellness', 'coach-bem-estar'])

/**
 * Retorna 403 se o usuário for só Wellness/coach-bem-estar (produto separado da matriz YLADA).
 * Admin e suporte seguem liberados para operação interna.
 */
export async function yladaApiRejectWellnessProductUser(userId: string): Promise<NextResponse | null> {
  if (!supabaseAdmin) return null
  const { data: up } = await supabaseAdmin
    .from('user_profiles')
    .select('perfil, is_admin, is_support')
    .eq('user_id', userId)
    .maybeSingle()
  if (!up) return null
  if (up.is_admin || up.is_support) return null
  const p = typeof up.perfil === 'string' ? up.perfil.toLowerCase().trim() : ''
  if (WELLNESS_PRODUCT_PROFILES.has(p)) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Contas Wellness usam apenas /api/wellness/*. A matriz YLADA não está disponível para este perfil.',
      },
      { status: 403 }
    )
  }
  return null
}
