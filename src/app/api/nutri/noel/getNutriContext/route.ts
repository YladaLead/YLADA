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

    // 🆕 BUSCAR INFORMAÇÕES DE FORMULÁRIOS
    // 1. Total de formulários criados
    const { data: forms, count: formsCount } = await supabaseAdmin
      .from('custom_forms')
      .select('id, name, form_type, created_at', { count: 'exact' })
      .eq('user_id', user_id)
      .eq('is_template', false)
      .order('created_at', { ascending: false })
      .limit(10)

    // 2. Respostas não visualizadas
    const { count: unreadCount } = await supabaseAdmin
      .from('form_responses')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .eq('viewed', false)

    // 3. Total de respostas recebidas nos últimos 30 dias
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const { count: recentResponsesCount } = await supabaseAdmin
      .from('form_responses')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user_id)
      .gte('created_at', thirtyDaysAgo.toISOString())

    // 4. Últimas respostas recebidas
    const { data: recentResponses } = await supabaseAdmin
      .from('form_responses')
      .select(`
        id,
        created_at,
        viewed,
        custom_forms!inner (
          id,
          name,
          form_type
        ),
        clients (
          id,
          name
        )
      `)
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
      
      // 🆕 Informações de formulários
      formularios: {
        total: formsCount || 0,
        recent_forms: forms?.map(f => ({
          id: f.id,
          name: f.name,
          type: f.form_type,
          created_at: f.created_at
        })) || [],
        respostas_nao_visualizadas: unreadCount || 0,
        respostas_ultimos_30_dias: recentResponsesCount || 0,
        ultimas_respostas: recentResponses?.map(r => ({
          id: r.id,
          form_name: (r.custom_forms as any).name,
          form_type: (r.custom_forms as any).form_type,
          client_name: r.clients?.name || 'Sem cliente',
          created_at: r.created_at,
          viewed: r.viewed
        })) || []
      }
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
