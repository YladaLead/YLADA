import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/community/posts
 * Listar posts da comunidade
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { user, userProfile } = authResult
    const supabase = createClient()
    
    const { searchParams } = new URL(request.url)
    const area = searchParams.get('area') || userProfile?.perfil || 'wellness'
    const categoria = searchParams.get('categoria')
    const tag = searchParams.get('tag')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const sort = searchParams.get('sort') || 'recent' // 'recent', 'popular', 'trending'
    
    // Construir query base
    let query = supabase
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
    
    // Ordenação
    if (sort === 'popular') {
      query = query.order('curtidas_count', { ascending: false })
    } else if (sort === 'trending') {
      // Trending = curtidas + comentários nas últimas 24h
      query = query
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('curtidas_count', { ascending: false })
        .order('comentarios_count', { ascending: false })
    } else {
      // Recent (padrão)
      query = query
        .order('pinned', { ascending: false })
        .order('created_at', { ascending: false })
    }
    
    // Filtros
    if (categoria) {
      query = query.eq('categoria', categoria)
    }
    
    if (tag) {
      query = query.contains('tags', [tag])
    }
    
    // Paginação
    const from = (page - 1) * limit
    const to = from + limit - 1
    query = query.range(from, to)
    
    const { data: posts, error } = await query
    
    if (error) {
      console.error('❌ Erro ao buscar posts:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar posts', details: error.message },
        { status: 500 }
      )
    }
    
    // Buscar reações do usuário para cada post
    if (posts && posts.length > 0) {
      const postIds = posts.map(p => p.id)
      const { data: userReactions } = await supabase
        .from('community_reactions')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', postIds)
      
      const reactedPostIds = new Set(userReactions?.map(r => r.post_id) || [])
      
      // Adicionar flag se usuário curtiu
      posts.forEach((post: any) => {
        post.user_curtiu = reactedPostIds.has(post.id)
      })
    }
    
    return NextResponse.json({
      success: true,
      posts: posts || [],
      pagination: {
        page,
        limit,
        total: posts?.length || 0
      }
    })
  } catch (error: any) {
    console.error('❌ Erro no GET /api/community/posts:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/community/posts
 * Criar novo post
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { user, userProfile } = authResult
    const supabase = createClient()
    
    const body = await request.json()
    const {
      titulo,
      conteudo,
      categoria,
      tags,
      imagens,
      video_url,
      link_url,
      tipo = 'texto'
    } = body
    
    // Validação
    if (!titulo || !conteudo || !categoria) {
      return NextResponse.json(
        { error: 'Título, conteúdo e categoria são obrigatórios' },
        { status: 400 }
      )
    }
    
    // Validar categoria
    const categoriasValidas = ['duvidas', 'dicas', 'casos-sucesso', 'networking', 'anuncios']
    if (!categoriasValidas.includes(categoria)) {
      return NextResponse.json(
        { error: 'Categoria inválida' },
        { status: 400 }
      )
    }
    
    // Criar post
    const { data: post, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        area: userProfile?.perfil || 'wellness',
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        categoria,
        tags: tags || [],
        imagens: imagens || [],
        video_url: video_url || null,
        link_url: link_url || null,
        tipo
      })
      .select(`
        *,
        user:user_profiles!community_posts_user_id_fkey(
          id,
          nome_completo,
          email,
          perfil
        )
      `)
      .single()
    
    if (error) {
      console.error('❌ Erro ao criar post:', error)
      return NextResponse.json(
        { error: 'Erro ao criar post', details: error.message },
        { status: 500 }
      )
    }
    
    // TODO: Criar notificações para seguidores (assíncrono)
    // TODO: Enviar push notifications
    
    return NextResponse.json({
      success: true,
      post
    }, { status: 201 })
  } catch (error: any) {
    console.error('❌ Erro no POST /api/community/posts:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}
