import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-client'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/community/posts/[id]/react-emoji
 * Reagir com emoji (curtir, amei, útil, etc)
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
    
    const body = await request.json()
    const { tipo } = body // 'curtir', 'amei', 'util', 'engracado', 'fogo'
    
    // Tipos válidos
    const tiposValidos = ['curtir', 'amei', 'util', 'engracado', 'fogo']
    if (!tiposValidos.includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo de reação inválido' },
        { status: 400 }
      )
    }
    
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
    
    // Verificar se já reagiu com este tipo específico
    const { data: existingReaction } = await supabase
      .from('community_reactions')
      .select('id, tipo')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .eq('tipo', tipo)
      .maybeSingle()
    
    if (existingReaction) {
      // Se já reagiu com este tipo, remover reação
      const { error } = await supabase
        .from('community_reactions')
        .delete()
        .eq('id', existingReaction.id)
      
      if (error) {
        return NextResponse.json(
          { error: 'Erro ao remover reação' },
          { status: 500 }
        )
      }
      
      return NextResponse.json({
        success: true,
        action: 'removed',
        message: 'Reação removida'
      })
    } else {
      // Verificar se já reagiu com outro tipo (limitar a 1 reação por post)
      const { data: otherReaction } = await supabase
        .from('community_reactions')
        .select('id, tipo')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .maybeSingle()
      
      if (otherReaction) {
        // Atualizar reação existente para o novo tipo
        const { error } = await supabase
          .from('community_reactions')
          .update({ tipo })
          .eq('id', otherReaction.id)
        
        if (error) {
          return NextResponse.json(
            { error: 'Erro ao atualizar reação' },
            { status: 500 }
          )
        }
        
        return NextResponse.json({
          success: true,
          action: 'updated',
          message: 'Reação atualizada'
        })
      } else {
        // Criar nova reação
        const { error } = await supabase
          .from('community_reactions')
          .insert({
            user_id: user.id,
            post_id: postId,
            tipo
          })
        
        if (error) {
          console.error('❌ Erro ao criar reação:', error)
          return NextResponse.json(
            { error: 'Erro ao criar reação' },
            { status: 500 }
          )
        }
        
        return NextResponse.json({
          success: true,
          action: 'created',
          message: 'Reação criada'
        })
      }
    }
  } catch (error: any) {
    console.error('❌ Erro no POST /api/community/posts/[id]/react-emoji:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}
