import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/community/posts/[id]/react
 * Reagir a uma mensagem com emoji
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
    const { tipo } = body
    
    // Tipos válidos de reação
    const tiposValidos = ['curtir', 'amei', 'util', 'engracado', 'fogo', 'incrivel', 'parabens', 'apoio', 'duvida', 'surpreso']
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
        { error: 'Mensagem não encontrada' },
        { status: 404 }
      )
    }
    
    // Verificar se já reagiu com este tipo
    const { data: existingReaction } = await supabase
      .from('community_reactions')
      .select('id, tipo')
      .eq('user_id', user.id)
      .eq('post_id', postId)
      .eq('tipo', tipo)
      .maybeSingle()
    
    if (existingReaction) {
      // Remover reação
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
        action: 'removed'
      })
    } else {
      // Verificar se já reagiu com outro tipo (limitar a 1 reação por mensagem)
      const { data: otherReaction } = await supabase
        .from('community_reactions')
        .select('id, tipo')
        .eq('user_id', user.id)
        .eq('post_id', postId)
        .maybeSingle()
      
      if (otherReaction) {
        // Atualizar reação existente
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
          action: 'updated'
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
          action: 'created'
        })
      }
    }
  } catch (error: any) {
    console.error('❌ Erro no POST /api/community/posts/[id]/react:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

/**
 * GET /api/community/posts/[id]/react
 * Buscar reações de uma mensagem
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const supabase = await createServerSupabaseClient()
    const postId = params.id
    
    // Buscar todas as reações do post
    const { data: reactions, error } = await supabase
      .from('community_reactions')
      .select(`
        id,
        tipo,
        created_at,
        user:user_profiles!inner(
          user_id,
          nome_completo,
          email
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Erro ao buscar reações:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar reações', details: error.message },
        { status: 500 }
      )
    }
    
    // Agrupar por tipo de reação
    const grouped: Record<string, any[]> = {}
    reactions?.forEach((reaction: any) => {
      if (!grouped[reaction.tipo]) {
        grouped[reaction.tipo] = []
      }
      grouped[reaction.tipo].push(reaction)
    })
    
    return NextResponse.json({
      success: true,
      reactions: grouped,
      total: reactions?.length || 0
    })
  } catch (error: any) {
    console.error('❌ Erro no GET /api/community/posts/[id]/react:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}
