import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await requireApiAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { data: tutoriais, error } = await supabaseAdmin
      .from('tutorials')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Erro ao buscar tutoriais:', error)
      return NextResponse.json({ error: 'Erro ao buscar tutoriais' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: tutoriais || []
    })
  } catch (error: any) {
    console.error('Erro na API de tutoriais:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

