import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await requireApiAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { data: microcursos, error } = await supabaseAdmin
      .from('microcourses')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Erro ao buscar microcursos:', error)
      return NextResponse.json({ error: 'Erro ao buscar microcursos' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: microcursos || []
    })
  } catch (error: any) {
    console.error('Erro na API de microcursos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

