/**
 * LYA Function: saveInteraction
 * 
 * Salva interação da LYA para histórico e aprendizado
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, user_message, lya_response } = body

    if (!user_id || !user_message || !lya_response) {
      return NextResponse.json(
        { success: false, error: 'user_id, user_message e lya_response são obrigatórios' },
        { status: 400 }
      )
    }

    // Salvar interação
    const { data, error } = await supabaseAdmin
      .from('lya_interactions')
      .insert({
        user_id,
        message: user_message,
        response: lya_response,
        user_message: user_message, // compatibilidade
        lya_response: lya_response, // compatibilidade
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar interação:', error)
      return NextResponse.json(
        { success: false, error: 'Erro ao salvar interação' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { interaction_id: data.id }
    })
  } catch (error: any) {
    console.error('Erro em saveInteraction:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao salvar interação' },
      { status: 500 }
    )
  }
}
