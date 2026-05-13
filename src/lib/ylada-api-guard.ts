import { NextResponse } from 'next/server'
import { proLideresContextUnlocksYladaMatrixApis } from '@/lib/pro-lideres-server'
import { supabaseAdmin } from '@/lib/supabase'

/** Perfil Herbalife (Wellness) — não usa /api/ylada/*. Coach de bem-estar usa matriz YLADA em /pt/coach-bem-estar. */
const WELLNESS_PRODUCT_PROFILES = new Set(['wellness'])

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
    if (await proLideresContextUnlocksYladaMatrixApis(userId)) return null
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
