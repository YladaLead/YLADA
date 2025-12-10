import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/community/posts/search
 * Buscar posts por texto
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { user, userProfile } = authResult
    const supabase = createClient()
    
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const area = searchParams.get('area') || userProfile?.perfil || 'wellness'
    const categoria = searchParams.get('categoria')
    const tag = searchParams.get('tag')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    
    if (!query.trim()) {
      return NextResponse.json(
        { error: 'Query de busca é obrigatória' },
        { status: 400 }
      )
    }
    
    // Construir query de busca
    let supabaseQuery = supabase
      .from('community_posts')
      .select(`
        *,
        user:user_profiles!community_posts_user_id_fkey(
          id,
          nome_completo,
          email,
          perfil
        )
      `)
      .eq('area', area)
      .eq('status', 'publico')
      .is('deleted_at', null)
    
    // Busca por texto (título ou conteúdo)
    const searchTerm = query.trim().toLowerCase()
    supabaseQuery = supabaseQuery.or(
      `titulo.ilike.%${searchTerm}%,conteudo.ilike.%${searchTerm}%`
    )
    
    // Filtros
    if (categoria) {
      supabaseQuery = supabaseQuery.eq('categoria', categoria)
    }
    
    if (tag) {
      supabaseQuery = supabaseQuery.contains('tags', [tag])
    }
    
    // Ordenação (posts fixados primeiro, depois por relevância)
    supabaseQuery = supabaseQuery
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
    
    // Paginação
    const from = (page - 1) * limit
    const to = from + limit - 1
    supabaseQuery = supabaseQuery.range(from, to)
    
    const { data: posts, error } = await supabaseQuery
    
    if (error) {
      console.error('❌ Erro ao buscar posts:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar posts', details: error.message },
        { status: 500 }
      )
    }
    
    // Buscar reações do usuário
    if (posts && posts.length > 0) {
      const postIds = posts.map(p => p.id)
      const { data: userReactions } = await supabase
        .from('community_reactions')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', postIds)
      
      const reactedPostIds = new Set(userReactions?.map(r => r.post_id) || [])
      
      posts.forEach((post: any) => {
        post.user_curtiu = reactedPostIds.has(post.id)
      })
    }
    
    return NextResponse.json({
      success: true,
      posts: posts || [],
      query: searchTerm,
      pagination: {
        page,
        limit,
        total: posts?.length || 0
      }
    })
  } catch (error: any) {
    console.error('❌ Erro no GET /api/community/posts/search:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}
