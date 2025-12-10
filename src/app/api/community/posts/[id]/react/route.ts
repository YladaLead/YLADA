import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/community/posts/[id]/react
 * Curtir/descurtir post
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { user } = authResult
    const supabase = createClient()
    const postId = params.id
    
    // Verificar se post existe
    const { data: post } = await supabase
      .from('community_posts')
      .select('id')
      .eq('id', postId)
      .eq('status', 'publico')
      .single()
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post não encontrado' },
        { status: 404 }
      )
    }
    
    // Verificar se já curtiu
    const { data: existingReaction } = await supabase
      .from('community_reactions')
      .select('id')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .single()
    
    if (existingReaction) {
      // Descurtir
      const { error } = await supabase
        .from('community_reactions')
        .delete()
        .eq('id', existingReaction.id)
      
      if (error) {
        console.error('❌ Erro ao descurtir:', error)
        return NextResponse.json(
          { error: 'Erro ao descurtir post' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        success: true,
        action: 'unliked',
        message: 'Post descurtido'
      })
    } else {
      // Curtir
      const { error } = await supabase
        .from('community_reactions')
        .insert({
          user_id: user.id,
          post_id: postId,
          tipo: 'curtir'
        })
      
      if (error) {
        console.error('❌ Erro ao curtir:', error)
        return NextResponse.json(
          { error: 'Erro ao curtir post' },
          { status: 500 }
        )
      }
      
      // TODO: Criar notificação para o autor do post
      
      return NextResponse.json({
        success: true,
        action: 'liked',
        message: 'Post curtido'
      })
    }
  } catch (error: any) {
    console.error('❌ Erro no POST /api/community/posts/[id]/react:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}
