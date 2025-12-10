import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireApiAuth } from '@/lib/api-auth'
import { notifyPostAuthorOnComment } from '@/lib/community-notifications'

/**
 * GET /api/community/posts/[id]/comments
 * Listar comentários de um post
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
    
    // Buscar comentários
    const { data: comments, error } = await supabase
      .from('community_comments')
      .select(`
        *,
        user:user_profiles!community_comments_user_id_fkey(
          id,
          nome_completo,
          email,
          perfil
        )
      `)
      .eq('post_id', postId)
      .eq('status', 'publico')
      .is('deleted_at', null)
      .order('created_at', { ascending: true })
    
    if (error) {
      console.error('❌ Erro ao buscar comentários:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar comentários', details: error.message },
        { status: 500 }
      )
    }
    
    // Buscar reações do usuário
    if (comments && comments.length > 0) {
      const commentIds = comments.map(c => c.id)
      const { data: userReactions } = await supabase
        .from('community_reactions')
        .select('comment_id')
        .eq('user_id', user.id)
        .in('comment_id', commentIds)
      
      const reactedCommentIds = new Set(userReactions?.map(r => r.comment_id) || [])
      
      comments.forEach((comment: any) => {
        comment.user_curtiu = reactedCommentIds.has(comment.id)
      })
    }
    
    // Organizar comentários em árvore (respostas aninhadas)
    const commentsMap = new Map()
    const rootComments: any[] = []
    
    comments?.forEach((comment: any) => {
      commentsMap.set(comment.id, { ...comment, replies: [] })
    })
    
    comments?.forEach((comment: any) => {
      if (comment.parent_id) {
        const parent = commentsMap.get(comment.parent_id)
        if (parent) {
          parent.replies.push(commentsMap.get(comment.id))
        }
      } else {
        rootComments.push(commentsMap.get(comment.id))
      }
    })
    
    return NextResponse.json({
      success: true,
      comments: rootComments
    })
  } catch (error: any) {
    console.error('❌ Erro no GET /api/community/posts/[id]/comments:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/community/posts/[id]/comments
 * Criar comentário
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { user } = authResult
    const supabase = await createServerSupabaseClient()
    const postId = params.id
    
    const body = await request.json()
    const { conteudo, parent_id } = body
    
    // Validação
    if (!conteudo || !conteudo.trim()) {
      return NextResponse.json(
        { error: 'Conteúdo do comentário é obrigatório' },
        { status: 400 }
      )
    }
    
    // Verificar se post existe
    const { data: post } = await supabase
      .from('community_posts')
      .select('id, user_id, titulo')
      .eq('id', postId)
      .eq('status', 'publico')
      .single()
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }
    
    // Buscar nome do autor do comentário
    const { data: commentAuthor } = await supabase
      .from('user_profiles')
      .select('nome_completo, email')
      .eq('user_id', user.id)
      .single()
    
    const commentAuthorName = commentAuthor?.nome_completo || commentAuthor?.email || 'Alguém'
    
    // Criar comentário
    const { data: comment, error } = await supabase
      .from('community_comments')
      .insert({
        post_id: postId,
        user_id: user.id,
        conteudo: conteudo.trim(),
        parent_id: parent_id || null
      })
      .select(`
        *,
        user:user_profiles!community_comments_user_id_fkey(
          id,
          nome_completo,
          email,
          perfil
        )
      `)
      .single()
    
    if (error) {
      console.error('❌ Erro ao criar comentário:', error)
      return NextResponse.json(
        { error: 'Erro ao criar comentário', details: error.message },
        { status: 500 }
      )
    }
    
    // Criar notificação para o autor do post (assíncrono - não bloqueia resposta)
    if (comment) {
      notifyPostAuthorOnComment({
        postId: postId,
        postTitle: post.titulo,
        commentId: comment.id,
        commentAuthorId: user.id,
        commentAuthorName: commentAuthorName,
        postAuthorId: post.user_id,
        commentContent: conteudo.trim()
      }).catch(err => {
        console.error('❌ Erro ao criar notificação (não crítico):', err)
      })
    }
    
    return NextResponse.json({
      success: true,
      comment
    }, { status: 201 })
  } catch (error: any) {
    console.error('❌ Erro no POST /api/community/posts/[id]/comments:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}
