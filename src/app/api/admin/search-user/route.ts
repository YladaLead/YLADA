import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

// GET - Buscar usuário por email
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) {
      console.error('Erro ao buscar usuários:', authError)
      return NextResponse.json(
        { error: 'Erro ao buscar usuários' },
        { status: 500 }
      )
    }

    // Filtrar por email (case insensitive)
    const emailLower = email.toLowerCase()
    const matchingUsers = (authData?.users || []).filter(
      (user) => user.email?.toLowerCase().includes(emailLower)
    )

    // Buscar perfis dos usuários
    const usersWithProfiles = await Promise.all(
      matchingUsers.map(async (user) => {
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        return {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
          profile: profile,
        }
      })
    )

    return NextResponse.json({
      success: true,
      users: usersWithProfiles,
      count: usersWithProfiles.length,
    })
  } catch (error: any) {
    console.error('Erro ao buscar usuário:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar usuário' },
      { status: 500 }
    )
  }
}

