import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'

/**
 * POST /api/auth/forgot-password
 * Envia email de recuperação de senha
 * 
 * Body:
 * {
 *   email: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Criar cliente Supabase para usar resetPasswordForEmail
    const supabase = createClient()

    // Enviar email de recuperação de senha
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ylada.com'}/auth/v1/verify`,
    })

    if (error) {
      console.error('❌ Erro ao enviar email de recuperação:', error)
      
      // Não expor se o email existe ou não por segurança
      // Sempre retornar sucesso para não permitir enumeração de emails
      return NextResponse.json({
        success: true,
        message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.'
    })
  } catch (error: any) {
    console.error('❌ Erro ao processar recuperação de senha:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}

