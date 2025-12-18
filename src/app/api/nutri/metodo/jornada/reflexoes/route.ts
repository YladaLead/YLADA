import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Verificar autenticação
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Buscar todas as reflexões da jornada do usuário
    const { data: reflexoes, error } = await supabase
      .from('journey_checklist_notes')
      .select('day_number, item_index, nota, created_at, updated_at')
      .eq('user_id', user.id)
      .not('nota', 'is', null)
      .neq('nota', '')
      .order('day_number', { ascending: true })
      .order('item_index', { ascending: true })

    if (error) {
      console.error('Erro ao buscar reflexões:', error)
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar reflexões' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: reflexoes || []
    })

  } catch (error) {
    console.error('Erro na API de reflexões:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
