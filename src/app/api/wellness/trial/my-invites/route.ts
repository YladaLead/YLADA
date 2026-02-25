import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/wellness/trial/my-invites
 * Lista convites criados pelo usuário logado (presidente).
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { data, error } = await supabaseAdmin
      .from('trial_invites')
      .select('id, token, email, nome_completo, status, expires_at, created_at, used_at')
      .eq('created_by_user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      invites: data || [],
    })
  } catch (error: any) {
    console.error('Erro ao listar convites:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao listar convites' },
      { status: 500 }
    )
  }
}
