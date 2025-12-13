/**
 * LYA Function: getNutriContext
 * 
 * Retorna contexto completo da nutricionista para personalização
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { NutriProfile, NutriState, LyaFlow, LyaCycle } from '@/types/nutri-lya'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id } = body

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'user_id é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar contexto LYA
    const { data: lyaContext } = await supabaseAdmin
      .from('lya_context')
      .select('*')
      .eq('user_id', user_id)
      .maybeSingle()

    // Buscar últimas interações para contexto
    const { data: recentInteractions } = await supabaseAdmin
      .from('lya_interactions')
      .select('message, response, created_at')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(5)

    // Construir contexto
    const context = {
      profile: (lyaContext?.profile as NutriProfile) || null,
      state: (lyaContext?.state as NutriState) || null,
      active_flow: (lyaContext?.active_flow as LyaFlow) || null,
      cycle: (lyaContext?.cycle as LyaCycle) || null,
      recent_interactions: recentInteractions || [],
      has_context: !!lyaContext,
    }

    return NextResponse.json({
      success: true,
      data: context
    })
  } catch (error: any) {
    console.error('Erro em getNutriContext:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao buscar contexto' },
      { status: 500 }
    )
  }
}
