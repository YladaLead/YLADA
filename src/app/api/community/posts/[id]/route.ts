import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/community/posts/[id]
 * Buscar detalhes de um post
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { user } = authResult
    const supabase = await createServerSupabaseClient()
    const postId = params.id
    
    // Buscar post
    const { data: post, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        user:user_profiles!inner(
          id,
          nome_completo,
          email,
          perfil
        )
      `)
      .eq('id', postId)
      .eq('status', 'publico')
      .is('deleted_at', null)
      .single()
    
    if (error || !post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }
    
    // Incrementar visualizações
    await supabase
      .from('community_posts')
      .update({ visualizacoes_count: (post.visualizacoes_count || 0) + 1 })
      .eq('id', postId)
    
    // Verificar se usuário curtiu
    const { data: reaction } = await supabase
      .from('community_reactions')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .single()
    
    post.user_curtiu = !!reaction
    
    return NextResponse.json({
      success: true,
      post
    })
  } catch (error: any) {
    console.error('❌ Erro no GET /api/community/posts/[id]:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/community/posts/[id]
 * Editar post
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { user } = authResult
    const supabase = await createServerSupabaseClient()
    const postId = params.id
    
    // Verificar se post existe e pertence ao usuário
    const { data: existingPost } = await supabase
      .from('community_posts')
      .select('user_id')
      .eq('id', postId)
      .single()
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }
    
    if (existingPost.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Você não tem permissão para editar este post' },
        { status: 403 }
      )
    }
    
    const body = await request.json()
    const {
      titulo,
      conteudo,
      categoria,
      tags,
      imagens,
      video_url,
      link_url
    } = body
    
    // Atualizar post
    const { data: post, error } = await supabase
      .from('community_posts')
      .update({
        titulo: titulo?.trim(),
        conteudo: conteudo?.trim(),
        categoria,
        tags: tags || [],
        imagens: imagens || [],
        video_url: video_url || null,
        link_url: link_url || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', postId)
      .select(`
        *,
        user:user_profiles!inner(
          id,
          nome_completo,
          email,
          perfil
        )
      `)
      .single()
    
    if (error) {
      console.error('❌ Erro ao atualizar post:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar post', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      post
    })
  } catch (error: any) {
    console.error('❌ Erro no PUT /api/community/posts/[id]:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/community/posts/[id]
 * Deletar post (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { user, userProfile } = authResult
    const supabase = await createServerSupabaseClient()
    const postId = params.id
    
    // Verificar se post existe
    const { data: existingPost } = await supabase
      .from('community_posts')
      .select('user_id')
      .eq('id', postId)
      .single()
    
    if (!existingPost) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }
    
    // Verificar permissão (usuário ou admin)
    const isOwner = existingPost.user_id === user.id
    const isAdmin = userProfile?.is_admin === true
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Você não tem permissão para deletar este post' },
        { status: 403 }
      )
    }
    
    // Soft delete
    const { error } = await supabase
      .from('community_posts')
      .update({
        status: 'removido',
        deleted_at: new Date().toISOString()
      })
      .eq('id', postId)
    
    if (error) {
      console.error('❌ Erro ao deletar post:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar post', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Post deletado com sucesso'
    })
  } catch (error: any) {
    console.error('❌ Erro no DELETE /api/community/posts/[id]:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}
