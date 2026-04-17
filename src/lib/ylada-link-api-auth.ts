/**
 * Autenticação para pipeline de links (interpret + generate):
 * perfil da matriz em `YLADA_API_ALLOWED_PROFILES` **ou** líder Pro Líderes.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { YLADA_API_ALLOWED_PROFILES } from '@/config/ylada-areas'
import { supabaseAdmin } from '@/lib/supabase'
import { isProLideresLeaderForYladaLinkApis } from '@/lib/pro-lideres-server'

export type YladaLinkAuthProfile = {
  perfil?: string | null
  is_admin?: boolean | null
  is_support?: boolean | null
} | null

export async function requireAuthForYladaLinkCreation(
  request: NextRequest
): Promise<{ user: { id: string; email?: string | null }; profile: YladaLinkAuthProfile } | NextResponse> {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth

  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json(
      { success: false, error: 'Backend não configurado' },
      { status: 503 }
    )
  }

  const { data: profileRow } = await supabaseAdmin
    .from('user_profiles')
    .select('perfil, is_admin, is_support')
    .eq('user_id', user.id)
    .maybeSingle()

  const profile = profileRow as YladaLinkAuthProfile

  if (profile?.is_admin || profile?.is_support) {
    return { user, profile }
  }

  const perfil = profile?.perfil?.trim()
  if (perfil && (YLADA_API_ALLOWED_PROFILES as readonly string[]).includes(perfil)) {
    return { user, profile }
  }

  if (await isProLideresLeaderForYladaLinkApis(user.id)) {
    return { user, profile }
  }

  return NextResponse.json(
    {
      success: false,
      error: 'Acesso negado. Este recurso é para utilizadores da matriz YLADA ou líderes Pro Líderes.',
      required_profiles: [...YLADA_API_ALLOWED_PROFILES],
      your_profile: perfil || 'não definido',
    },
    { status: 403 }
  )
}
