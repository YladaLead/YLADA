import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/community/posts/[id]/reactions
 * Listar quem curtiu/reactou no post
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
        user:user_profiles!community_reactions_user_id_fkey(
          id,
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
    reactions?.forEach(reaction => {
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
    console.error('❌ Erro no GET /api/community/posts/[id]/reactions:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}
