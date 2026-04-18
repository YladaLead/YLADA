import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/auth/post-password-reset-cleanup
 * Após redefinir senha com sessão do token (verifyOtp), limpa flag de senha provisória.
 * Não exige perfil específico — qualquer utilizador autenticado só altera a própria linha.
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) return authResult

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuração do servidor incompleta' }, { status: 500 })
    }

    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({ temporary_password_expires_at: null })
      .eq('user_id', authResult.user.id)

    if (error) {
      console.warn('[post-password-reset-cleanup]', error)
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    console.error('[post-password-reset-cleanup]', e)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
