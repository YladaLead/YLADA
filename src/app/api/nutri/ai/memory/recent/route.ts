import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Buscar memória recente
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')

    const { data, error } = await supabaseAdmin
      .from('ai_memory_events')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('❌ Erro ao buscar memória:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar memória' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      events: data || []
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar memória:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar memória' },
      { status: 500 }
    )
  }
}

