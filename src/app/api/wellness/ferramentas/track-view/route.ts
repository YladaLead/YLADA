import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Incrementar contador de visualizações
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { tool_id } = body

    if (!tool_id) {
      return NextResponse.json(
        { error: 'tool_id é obrigatório' },
        { status: 400 }
      )
    }

    // Incrementar views usando RPC ou UPDATE
    const { error } = await supabaseAdmin.rpc('increment_tool_views', {
      tool_id_param: tool_id
    })

    // Se RPC não existir, usar UPDATE direto
    if (error && error.message?.includes('function') || error?.code === '42883') {
      const { data: tool } = await supabaseAdmin
        .from('user_templates')
        .select('views')
        .eq('id', tool_id)
        .single()

      if (tool) {
        const { error: updateError } = await supabaseAdmin
          .from('user_templates')
          .update({ views: (tool.views || 0) + 1 })
          .eq('id', tool_id)

        if (updateError) throw updateError
      }
    } else if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao registrar visualização:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao registrar visualização' },
      { status: 500 }
    )
  }
}











