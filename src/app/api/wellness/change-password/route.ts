import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth-helper'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Trocar senha do usuário wellness
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

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

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'A nova senha deve ser diferente da senha atual' },
        { status: 400 }
      )
    }

    // Verificar senha atual fazendo login temporário
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    const tempSupabase = createClient(supabaseUrl, supabaseAnonKey)

    // Tentar fazer login com a senha atual para verificar
    const { data: signInData, error: signInError } = await tempSupabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    })

    if (signInError || !signInData.session) {
      console.error('❌ Erro ao verificar senha atual:', signInError)
      return NextResponse.json(
        { error: 'Senha atual incorreta' },
        { status: 401 }
      )
    }

    // Se a senha atual está correta, usar o supabaseAdmin para atualizar diretamente
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        password: newPassword
      }
    )

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

