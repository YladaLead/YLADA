import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { createTrialInvite } from '@/lib/trial-helpers'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/wellness/trial/generate-invite
 * Gera link de convite para trial de 3 dias
 * 
 * Body:
 * {
 *   email: string (obrigatório)
 *   nome_completo?: string
 *   whatsapp?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação (usuário logado que está compartilhando)
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    const body = await request.json()
    const { email, nome_completo, whatsapp } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email é obrigatório e deve ser válido' },
        { status: 400 }
      )
    }

    // Verificar se email já tem conta
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUser?.users?.find(
      u => u.email?.toLowerCase() === email.toLowerCase()
    )

    if (userExists) {
      return NextResponse.json(
        { error: 'Este email já possui uma conta. Use outro email ou peça para a pessoa fazer login.' },
        { status: 400 }
      )
    }

    // Nome do presidente (para exibir na página do trial e documentar quem enviou)
    let nomePresidente: string | null = null
    const { data: presidente } = await supabaseAdmin
      .from('presidentes_autorizados')
      .select('nome_completo')
      .eq('user_id', user.id)
      .eq('status', 'ativo')
      .maybeSingle()
    if (presidente?.nome_completo) nomePresidente = presidente.nome_completo

    // Base URL do link: em dev usar a origem da requisição para o link abrir no localhost
    const baseUrl =
      (typeof request.url === 'string' ? new URL(request.url).origin : null) ||
      (request as any).nextUrl?.origin ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://www.ylada.com'

    // Criar convite
    const { token, invite_url } = await createTrialInvite({
      email: email.toLowerCase().trim(),
      nome_completo,
      whatsapp,
      created_by_user_id: user.id,
      created_by_email: user.email,
      nome_presidente: nomePresidente ?? undefined,
      expires_in_days: 7,
      baseUrl,
    })

    return NextResponse.json({
      success: true,
      token,
      invite_url,
      message: 'Link de convite gerado com sucesso! Compartilhe este link.',
    })
  } catch (error: any) {
    console.error('❌ Erro ao gerar convite de trial:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao gerar convite de trial' },
      { status: 500 }
    )
  }
}
