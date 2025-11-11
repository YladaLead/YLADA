import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * Verificar perfil por email antes do login/cadastro
 * Retorna o perfil atual do email (se existir)
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar usuário diretamente pelo email (mais eficiente que listUsers)
    // Usar getUserByEmail se disponível, senão tentar listUsers com limite
    let authUser = null
    
    try {
      // Tentar buscar usuário diretamente (método mais eficiente)
      // Nota: Supabase Admin API não tem getUserByEmail, então vamos usar listUsers com filtro
      const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000 // Limitar para melhor performance
      })
      
      if (authError) {
        console.error('Erro ao buscar usuários:', authError)
        // Se falhar, retornar como se não existisse (não bloquear login)
        return NextResponse.json({
          exists: false,
          hasProfile: false,
          canCreate: true
        })
      }

      // Encontrar usuário pelo email (case-insensitive)
      authUser = authUsers.users.find(u => 
        u.email?.toLowerCase() === email.toLowerCase()
      )
    } catch (error: any) {
      console.error('Erro ao verificar email:', error)
      // Se der erro, retornar como se não existisse (não bloquear login)
      return NextResponse.json({
        exists: false,
        hasProfile: false,
        canCreate: true
      })
    }

    if (!authUser) {
      // Email não existe - pode criar conta
      return NextResponse.json({
        exists: false,
        canCreate: true
      })
    }

    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('perfil, email, is_admin, is_support')
      .eq('user_id', authUser.id)
      .maybeSingle()

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Erro ao buscar perfil:', profileError)
      return NextResponse.json(
        { error: 'Erro ao verificar perfil' },
        { status: 500 }
      )
    }

    if (!profile) {
      // Usuário existe mas não tem perfil - pode criar perfil na área atual
      return NextResponse.json({
        exists: true,
        hasProfile: false,
        canCreate: true
      })
    }

    // Usuário existe e tem perfil
    return NextResponse.json({
      exists: true,
      hasProfile: true,
      perfil: profile.perfil,
      is_admin: profile.is_admin || false,
      is_support: profile.is_support || false,
      canCreate: false
    })

  } catch (error: any) {
    console.error('Erro ao verificar perfil:', error)
    return NextResponse.json(
      { error: 'Erro interno ao verificar perfil' },
      { status: 500 }
    )
  }
}

