import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/admin/reset-password
 * Reseta a senha de um usuário (apenas admin pode executar)
 * 
 * Body:
 * {
 *   email: string,
 *   newPassword?: string (opcional, se não fornecido, envia email de reset)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { email, newPassword } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar usuário pelo email
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Erro ao buscar usuários:', usersError)
      return NextResponse.json(
        { error: 'Erro ao buscar usuários', details: usersError.message },
        { status: 500 }
      )
    }

    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Se forneceu nova senha, atualizar diretamente
    if (newPassword) {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        {
          password: newPassword
        }
      )

      if (updateError) {
        console.error(`❌ Erro ao atualizar senha para ${email}:`, updateError)
        return NextResponse.json(
          { error: 'Erro ao atualizar senha', details: updateError.message },
          { status: 500 }
        )
      }

      console.log(`✅ Senha atualizada para ${email}`)

      return NextResponse.json({
        success: true,
        message: `Senha atualizada com sucesso para ${email}`,
        user: {
          id: user.id,
          email: user.email
        }
      })
    } else {
      // Se não forneceu senha, enviar email de reset
      const { error: resetError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: email
      })

      if (resetError) {
        console.error(`❌ Erro ao gerar link de reset para ${email}:`, resetError)
        return NextResponse.json(
          { error: 'Erro ao gerar link de reset', details: resetError.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `Email de reset de senha enviado para ${email}`,
        user: {
          id: user.id,
          email: user.email
        }
      })
    }
  } catch (error: any) {
    console.error('❌ Erro ao resetar senha:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao resetar senha' },
      { status: 500 }
    )
  }
}

