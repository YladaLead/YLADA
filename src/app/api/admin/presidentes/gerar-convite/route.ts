import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { createTrialInvite } from '@/lib/trial-helpers'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/admin/presidentes/gerar-convite
 * Gera link de convite para trial em nome de um presidente (uso manual pelo suporte).
 * Só admin. Body: presidente_id (UUID), email, nome_completo?, whatsapp?
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    if (!profile?.is_admin) {
      return NextResponse.json(
        { error: 'Apenas administradores podem gerar convites em nome de presidentes' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { presidente_id, email, nome_completo, whatsapp } = body

    if (!presidente_id) {
      return NextResponse.json(
        { error: 'Selecione o presidente que autorizou' },
        { status: 400 }
      )
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email é obrigatório e deve ser válido' },
        { status: 400 }
      )
    }

    const emailNorm = email.toLowerCase().trim()
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 })
    const userExists = existingUsers?.users?.some(
      (u) => u.email?.toLowerCase() === emailNorm
    )
    if (userExists) {
      return NextResponse.json(
        { error: 'Este e-mail já possui uma conta. Use outro e-mail ou peça para a pessoa fazer login.' },
        { status: 400 }
      )
    }

    const { data: presidente, error: presError } = await supabaseAdmin
      .from('presidentes_autorizados')
      .select('id, nome_completo, status')
      .eq('id', presidente_id)
      .single()

    if (presError || !presidente) {
      return NextResponse.json(
        { error: 'Presidente não encontrado' },
        { status: 404 }
      )
    }

    if (presidente.status !== 'ativo') {
      return NextResponse.json(
        { error: 'Este presidente está inativo. Ative-o antes de gerar convites.' },
        { status: 400 }
      )
    }

    const baseUrl =
      (typeof request.url === 'string' ? new URL(request.url).origin : null) ||
      (request as any).nextUrl?.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://www.ylada.com'

    const { token, invite_url } = await createTrialInvite({
      email: email.toLowerCase().trim(),
      nome_completo: nome_completo?.trim() || undefined,
      whatsapp: whatsapp?.trim() || undefined,
      created_by_user_id: user.id,
      created_by_email: user.email,
      nome_presidente: presidente.nome_completo,
      expires_in_days: 7,
      baseUrl,
    })

    return NextResponse.json({
      success: true,
      token,
      invite_url,
      nome_presidente: presidente.nome_completo,
      message: `Link gerado para ${presidente.nome_completo}. Envie ao contato.`,
    })
  } catch (error: any) {
    console.error('❌ Erro ao gerar convite (admin):', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar convite' },
      { status: 500 }
    )
  }
}
