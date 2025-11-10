import { NextRequest, NextResponse } from 'next/server'
import { validateAndUseAccessToken } from '@/lib/email-tokens'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/auth/access-token
 * Valida token de acesso e retorna sessão do usuário
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 400 }
      )
    }

    // Validar token
    const tokenData = await validateAndUseAccessToken(token)

    if (!tokenData) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado' },
        { status: 401 }
      )
    }

    // Criar sessão para o usuário
    const { data: session, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: '', // Não precisa de e-mail para magic link
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || process.env.NEXT_PUBLIC_APP_URL || 'https://www.ylada.com'}/pt/wellness/dashboard`,
      },
    })

    // Alternativa: criar cookie de sessão diretamente
    // Por enquanto, retornar o userId e deixar o frontend fazer login
    return NextResponse.json({
      success: true,
      userId: tokenData.userId,
      message: 'Token válido. Redirecionando...',
    })
  } catch (error: any) {
    console.error('❌ Erro ao validar token:', error)
    return NextResponse.json(
      { error: 'Erro ao processar token' },
      { status: 500 }
    )
  }
}

