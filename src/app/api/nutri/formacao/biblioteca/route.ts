import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await requireApiAuth(request)
    if (authError || !user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { data: biblioteca, error } = await supabaseAdmin
      .from('library_files')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Erro ao buscar biblioteca:', error)
      return NextResponse.json({ error: 'Erro ao buscar biblioteca' }, { status: 500 })
    }

    // Buscar favoritos do usuário
    const { data: favoritos } = await supabaseAdmin
      .from('library_favorites')
      .select('library_file_id')
      .eq('user_id', user.id)

    const favoritosIds = new Set(favoritos?.map(f => f.library_file_id) || [])

    const bibliotecaComFavoritos = (biblioteca || []).map(item => ({
      ...item,
      is_favorited: favoritosIds.has(item.id)
    }))

    return NextResponse.json({
      success: true,
      data: bibliotecaComFavoritos
    })
  } catch (error: any) {
    console.error('Erro na API de biblioteca:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

