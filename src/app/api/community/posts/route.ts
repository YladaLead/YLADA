import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/community/posts
 * Listar mensagens do chat
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { userProfile } = authResult
    const supabase = await createServerSupabaseClient()
    
    const { searchParams } = new URL(request.url)
    const area = searchParams.get('area') || userProfile?.perfil || 'wellness'
    
    // Query simples: buscar posts da área, ordenados por data
    const { data: posts, error } = await supabase
      .from('community_posts')
      .select('id, conteudo, created_at, user_id, imagens, video_url, audio_url, tipo')
      .eq('area', area)
      .eq('status', 'publico')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(50)
    
    if (error) {
      console.error('❌ Erro ao buscar posts:', error)
      return NextResponse.json(
        { 
          error: 'Erro ao buscar mensagens',
          details: error.message,
          code: error.code,
          posts: []
        },
        { status: 500 }
      )
    }
    
    // Buscar dados dos usuários separadamente (mais confiável)
    if (posts && posts.length > 0) {
      const userIds = [...new Set(posts.map((p: any) => p.user_id))]
      const { data: profiles } = await supabase
        .from('user_profiles')
        .select('user_id, nome_completo, email, perfil')
        .in('user_id', userIds)
      
      const profilesMap = new Map(profiles?.map((p: any) => [p.user_id, p]) || [])
      
      // Combinar posts com perfis
      const postsComPerfis = posts.map((post: any) => ({
        ...post,
        user: profilesMap.get(post.user_id) || {
          id: post.user_id,
          nome_completo: 'Usuário',
          email: '',
          perfil: ''
        }
      }))
      
      return NextResponse.json({
        success: true,
        posts: postsComPerfis
      })
    }
    
    return NextResponse.json({
      success: true,
      posts: []
    })
  } catch (error: any) {
    console.error('❌ Erro no GET /api/community/posts:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao processar requisição',
        details: error.message,
        posts: []
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/community/posts
 * Criar nova mensagem no chat
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { user, userProfile } = authResult
    const supabase = await createServerSupabaseClient()
    
    const body = await request.json()
    const { conteudo, imagens, video_url, audio_url } = body
    
    if (!conteudo || !conteudo.trim()) {
      return NextResponse.json(
        { error: 'Mensagem não pode estar vazia' },
        { status: 400 }
      )
    }
    
    // Determinar tipo baseado no conteúdo
    let tipo = 'texto'
    if (audio_url) tipo = 'audio'
    else if (video_url) tipo = 'video'
    else if (imagens && imagens.length > 0) tipo = 'imagem'
    
    // Criar post simples
    const { data: post, error } = await supabase
      .from('community_posts')
      .insert({
        user_id: user.id,
        area: userProfile?.perfil || 'wellness',
        titulo: conteudo.trim().substring(0, 100) || 'Mensagem',
        conteudo: conteudo.trim(),
        categoria: 'chat',
        tipo: tipo,
        imagens: imagens || [],
        video_url: video_url || null,
        audio_url: audio_url || null
      })
      .select()
      .single()
    
    if (error) {
      console.error('❌ Erro ao criar post:', error)
      return NextResponse.json(
        { 
          error: 'Erro ao enviar mensagem',
          details: error.message,
          code: error.code
        },
        { status: 500 }
      )
    }
    
    // Buscar perfil do usuário
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('user_id, nome_completo, email, perfil')
      .eq('user_id', user.id)
      .single()
    
    return NextResponse.json({
      success: true,
      post: {
        ...post,
        user: profile || {
          id: user.id,
          nome_completo: 'Usuário',
          email: user.email || '',
          perfil: userProfile?.perfil || 'wellness'
        }
      }
    }, { status: 201 })
  } catch (error: any) {
    console.error('❌ Erro no POST /api/community/posts:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao processar requisição',
        details: error.message
      },
      { status: 500 }
    )
  }
}
