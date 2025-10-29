import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Buscar ferramenta por URL completa (user-slug/tool-slug)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userSlug = searchParams.get('user_slug')
    const toolSlug = searchParams.get('tool_slug')

    if (!userSlug || !toolSlug) {
      return NextResponse.json(
        { error: 'user_slug e tool_slug são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar ferramenta pela combinação user_slug + tool_slug
    const { data, error } = await supabaseAdmin
      .from('user_templates')
      .select(`
        *,
        user_profiles!inner(user_slug, user_id),
        users!inner(name, email)
      `)
      .eq('user_profiles.user_slug', userSlug)
      .eq('slug', toolSlug)
      .eq('profession', 'wellness')
      .eq('status', 'active')
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Ferramenta não encontrada' },
          { status: 404 }
        )
      }
      throw error
    }

    return NextResponse.json({ tool: data })
  } catch (error: any) {
    console.error('Erro ao buscar ferramenta por URL:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar ferramenta' },
      { status: 500 }
    )
  }
}

