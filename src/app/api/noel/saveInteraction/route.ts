/**
 * NOEL Function: saveInteraction
 * 
 * Salva no Supabase a mensagem enviada pelo usuário e a resposta do Noel
 * 
 * Schema OpenAI:
 * {
 *   "name": "saveInteraction",
 *   "description": "Salva no Supabase a mensagem enviada pelo usuário e a resposta do Noel.",
 *   "parameters": {
 *     "type": "object",
 *     "properties": {
 *       "user_id": { "type": "string" },
 *       "user_message": { "type": "string" },
 *       "noel_response": { "type": "string" }
 *     },
 *     "required": ["user_id", "user_message", "noel_response"]
 *   }
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateNoelFunctionAuth } from '@/lib/noel-functions-auth'

export async function POST(request: NextRequest) {
  try {
    // Validar autenticação
    const authError = validateNoelFunctionAuth(request)
    if (authError) {
      return authError
    }

    const body = await request.json()
    const { user_id, user_message, noel_response } = body

    // Validação
    if (!user_id || typeof user_id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'user_id é obrigatório e deve ser uma string' },
        { status: 400 }
      )
    }

    if (!user_message || typeof user_message !== 'string') {
      return NextResponse.json(
        { success: false, error: 'user_message é obrigatório e deve ser uma string' },
        { status: 400 }
      )
    }

    if (!noel_response || typeof noel_response !== 'string') {
      return NextResponse.json(
        { success: false, error: 'noel_response é obrigatório e deve ser uma string' },
        { status: 400 }
      )
    }

    // Salvar interação
    const { data: interaction, error: interactionError } = await supabaseAdmin
      .from('noel_interactions')
      .insert({
        user_id,
        user_message: user_message.substring(0, 5000), // Limitar tamanho
        noel_response: noel_response.substring(0, 10000), // Limitar tamanho
        module: null, // Pode ser preenchido depois se necessário
        source: null, // Pode ser preenchido depois se necessário
        similarity_score: null,
      })
      .select()
      .single()

    if (interactionError) {
      console.error('❌ Erro ao salvar interação:', interactionError)
      return NextResponse.json(
        { success: false, error: 'Erro ao salvar interação' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: interaction.id,
        created_at: interaction.created_at,
      },
    })
  } catch (error: any) {
    console.error('❌ Erro em saveInteraction:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
