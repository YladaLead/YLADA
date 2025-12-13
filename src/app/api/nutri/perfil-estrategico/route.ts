import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Buscar perfil estratégico
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { data: perfil, error } = await supabaseAdmin
      .from('nutri_perfil_estrategico')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (error && error.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar perfil estratégico:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar perfil estratégico' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      perfil: perfil || null
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar perfil estratégico:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar perfil estratégico' },
      { status: 500 }
    )
  }
}

