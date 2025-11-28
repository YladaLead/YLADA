import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * API Route para criar usuário de suporte
 * Cria o usuário no Supabase Auth e o perfil com is_support = true
 * 
 * IMPORTANTE: Esta rota deve ser protegida e usada apenas por admins
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { email, password, nome_completo } = await request.json()

    if (!email || !password || !nome_completo) {
      return NextResponse.json(
        { error: 'Email, senha e nome completo são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o usuário já existe
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(
      u => u.email?.toLowerCase() === email.toLowerCase()
    )

    if (existingUser) {
      // Usuário já existe, apenas criar/atualizar o perfil
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .upsert({
          user_id: existingUser.id,
          email: email,
          nome_completo: nome_completo,
          perfil: 'wellness',
          is_admin: false,
          is_support: true,
          bio: 'Suporte',
          country_code: 'BR',
          user_slug: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single()

      if (profileError) {
        console.error('Erro ao criar/atualizar perfil:', profileError)
        return NextResponse.json(
          { error: 'Erro ao criar perfil do usuário', details: profileError.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'Usuário já existia. Perfil atualizado para suporte.',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          nome_completo: nome_completo,
          is_support: true
        }
      })
    }

    // Criar novo usuário no Supabase Auth
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        full_name: nome_completo,
        name: nome_completo,
        perfil: 'wellness'
      }
    })

    if (createError) {
      console.error('Erro ao criar usuário:', createError)
      return NextResponse.json(
        { error: 'Erro ao criar usuário', details: createError.message },
        { status: 500 }
      )
    }

    if (!newUser.user) {
      return NextResponse.json(
        { error: 'Usuário não foi criado' },
        { status: 500 }
      )
    }

    // Criar perfil com is_support = true
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        user_id: newUser.user.id,
        email: email,
        nome_completo: nome_completo,
        perfil: 'wellness',
        is_admin: false,
        is_support: true,
        bio: 'Suporte',
        country_code: 'BR',
        user_slug: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
      })
      .select()
      .single()

    if (profileError) {
      console.error('Erro ao criar perfil:', profileError)
      // Tentar deletar o usuário criado se o perfil falhar
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id)
      return NextResponse.json(
        { error: 'Erro ao criar perfil do usuário', details: profileError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Usuário de suporte criado com sucesso!',
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        nome_completo: nome_completo,
        is_support: true
      }
    })
  } catch (error: any) {
    console.error('Erro ao criar usuário de suporte:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error.message },
      { status: 500 }
    )
  }
}

