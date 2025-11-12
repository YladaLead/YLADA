import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/admin/check
 * Verifica se o usuário autenticado é admin
 * Usa service role key para evitar problemas de RLS
 */
export async function GET(request: NextRequest) {
  try {
    // Obter token do header Authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { isAdmin: false, error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // Verificar token e obter usuário
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { isAdmin: false, error: 'Token inválido' },
        { status: 401 }
      )
    }

    // Verificar se é admin usando service role (bypass RLS)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      console.error('Erro ao buscar perfil:', profileError)
      return NextResponse.json(
        { isAdmin: false, error: 'Erro ao verificar perfil' },
        { status: 500 }
      )
    }

    const isAdmin = profile?.is_admin === true

    return NextResponse.json({
      isAdmin,
      userId: user.id,
      email: user.email
    })
  } catch (error: any) {
    console.error('Erro ao verificar admin:', error)
    return NextResponse.json(
      { isAdmin: false, error: error.message },
      { status: 500 }
    )
  }
}

