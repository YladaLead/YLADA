import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { createClient } from '@/lib/supabase-client'

/**
 * POST /api/admin/change-password
 * Permite que o admin altere sua própria senha
 * Requer autenticação
 * 
 * Body:
 * {
 *   currentPassword: string,
 *   newPassword: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { user } = authResult
    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Senha atual e nova senha são obrigatórias' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'A nova senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Verificar senha atual fazendo login
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    // Criar cliente temporário para verificar senha
    const { createClient: createSupabaseClient } = await import('@supabase/supabase-js')
    const tempSupabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

    // Tentar fazer login com a senha atual
    const { error: signInError } = await tempSupabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    })

    if (signInError) {
      return NextResponse.json(
        { error: 'Senha atual incorreta' },
        { status: 401 }
      )
    }

    // Se a senha atual está correta, atualizar para a nova senha
    const { error: updateError } = await tempSupabase.auth.updateUser({
      password: newPassword
    })

    if (updateError) {
      console.error('❌ Erro ao atualizar senha:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar senha', details: updateError.message },
        { status: 500 }
      )
    }

    console.log(`✅ Senha atualizada com sucesso para ${user.email}`)

    return NextResponse.json({
      success: true,
      message: 'Senha atualizada com sucesso'
    })
  } catch (error: any) {
    console.error('❌ Erro ao alterar senha:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao alterar senha' },
      { status: 500 }
    )
  }
}

