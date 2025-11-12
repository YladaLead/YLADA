import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/admin/usuarios/definir-senha-individual
 * Define senha para um usuário específico
 * Apenas admin pode executar
 * 
 * Body:
 * {
 *   email: string,
 *   password?: string (opcional, padrão: 'Ylada2025!')
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
    const { email, password = 'Ylada2025!' } = body

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

    // Atualizar senha
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        password: password
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
  } catch (error: any) {
    console.error('❌ Erro ao definir senha:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao definir senha' },
      { status: 500 }
    )
  }
}

