import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
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
    const supabase = await createServerSupabaseClient()
    
    // Teste simples para verificar se a tabela existe
    const { error: testError } = await supabase
      .from('community_posts')
      .select('id')
      .limit(1)
    
    if (testError) {
      // Verificar se é erro de tabela não encontrada
      if (testError.code === '42P01' || 
          testError.message?.toLowerCase().includes('relation') && testError.message?.toLowerCase().includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Tabelas da comunidade não foram criadas. Execute a migração SQL primeiro.',
            details: 'Execute migrations/021-create-community-tables.sql no Supabase SQL Editor',
            posts: []
          },
          { status: 500 }
        )
      }
    }
    
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
      console.error('❌ Código do erro:', error.code)
      console.error('❌ Mensagem completa:', error.message)
      console.error('❌ Detalhes:', error.details)
      console.error('❌ Hint:', error.hint)
      
      // Verificar se é erro de tabela não encontrada (código específico do PostgreSQL)
      const isTableNotFound = 
        error.code === '42P01' || // relation does not exist
        error.message?.toLowerCase().includes('relation') && error.message?.toLowerCase().includes('does not exist') ||
        error.message?.toLowerCase().includes('table') && error.message?.toLowerCase().includes('does not exist')
      
      if (isTableNotFound) {
        return NextResponse.json(
          { 
            error: 'Tabelas da comunidade não foram criadas. Execute a migração SQL primeiro.',
            details: 'Execute migrations/021-create-community-tables.sql no Supabase SQL Editor',
            posts: []
          },
          { status: 500 }
        )
      }
      
      // Verificar se é erro de permissão/RLS
      if (error.code === '42501' || error.message?.includes('permission denied') || error.message?.includes('row-level security')) {
        return NextResponse.json(
          { 
            error: 'Erro de permissão. Execute migrations/023-limpar-e-recriar-politicas-comunidade.sql',
            details: error.message || 'Políticas RLS podem estar conflitando com versão antiga',
            posts: []
          },
          { status: 500 }
        )
      }
      
      // Se não for erro de tabela não encontrada, retornar posts vazios (pode ser que não há posts ainda)
      // Mas logar o erro para debug
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ Erro ao buscar posts (mas não é erro de tabela):', error.message)
      }
      
      // Retornar posts vazios ao invés de erro, para não bloquear a interface
      return NextResponse.json({
        success: true,
        posts: [],
        pagination: {
          page,
          limit,
          total: 0
        },
        warning: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
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
    const supabase = await createServerSupabaseClient()
    
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
    
    // Validação - conteúdo é obrigatório, título e categoria são opcionais
    if (!conteudo || !conteudo.trim()) {
      return NextResponse.json(
        { error: 'Conteúdo é obrigatório' },
        { status: 400 }
      )
    }
    
    // Se não tiver categoria, usar 'chat' (modo chat simples)
    const categoriaFinal = categoria || 'chat'
    
    // Validar categoria
    const categoriasValidas = ['duvidas', 'dicas', 'casos-sucesso', 'networking', 'anuncios', 'chat']
    if (categoriaFinal && !categoriasValidas.includes(categoriaFinal)) {
      return NextResponse.json(
        { error: 'Categoria inválida' },
        { status: 400 }
      )
    }
    
    // Se não tiver título, usar primeiras palavras do conteúdo como título
    const tituloFinal = titulo?.trim() || conteudo.trim().substring(0, 100).split('\n')[0] || 'Mensagem'
    
    // Criar post
    const { data: post, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        area: userProfile?.perfil || 'wellness',
        titulo: tituloFinal,
        conteudo: conteudo.trim(),
        categoria: categoriaFinal,
        tags: tags || [],
        imagens: imagens || [],
        video_url: video_url || null,
        link_url: link_url || null,
        tipo: tipo || 'texto'
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
      
      // Verificar se é erro de tabela não encontrada
      if (error.message?.includes('does not exist') || error.message?.includes('relation') || error.code === '42P01') {
        return NextResponse.json(
          { 
            error: 'Tabelas da comunidade não foram criadas. Execute a migração SQL primeiro.',
            details: 'Execute migrations/021-create-community-tables.sql no Supabase SQL Editor'
          },
          { status: 500 }
        )
      }
      
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
    console.error('❌ Stack:', error.stack)
    
    // Verificar se é erro de tabela não encontrada
    if (error.message?.includes('does not exist') || error.message?.includes('relation') || error.code === '42P01') {
      return NextResponse.json(
        { 
          error: 'Tabelas da comunidade não foram criadas. Execute a migração SQL primeiro.',
          details: 'Execute migrations/021-create-community-tables.sql no Supabase SQL Editor'
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Erro ao processar requisição', 
        details: error.message || 'Erro desconhecido',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
