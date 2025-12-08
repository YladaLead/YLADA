/**
 * NOEL Function: updatePlanDay
 * 
 * Atualiza o dia do plano de 90 dias do consultor
 * 
 * Schema OpenAI:
 * {
 *   "name": "updatePlanDay",
 *   "description": "Atualiza o dia do plano de 90 dias do consultor.",
 *   "parameters": {
 *     "type": "object",
 *     "properties": {
 *       "user_id": { "type": "string" },
 *       "new_day": { "type": "number" }
 *     },
 *     "required": ["user_id", "new_day"]
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
    const { user_id, new_day } = body

    // Validação
    if (!user_id || typeof user_id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'user_id é obrigatório e deve ser uma string' },
        { status: 400 }
      )
    }

    if (typeof new_day !== 'number' || new_day < 1 || new_day > 90) {
      return NextResponse.json(
        { success: false, error: 'new_day deve ser um número entre 1 e 90' },
        { status: 400 }
      )
    }

    // Buscar progresso existente
    const { data: existingProgress } = await supabaseAdmin
      .from('noel_plan_progress')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    let result

    if (existingProgress) {
      // Atualizar progresso existente
      const { data: updatedProgress, error: updateError } = await supabaseAdmin
        .from('noel_plan_progress')
        .update({
          current_day: new_day,
          last_updated_at: new Date().toISOString(),
        })
        .eq('id', existingProgress.id)
        .select()
        .single()

      if (updateError) {
        console.error('❌ Erro ao atualizar progresso:', updateError)
        return NextResponse.json(
          { success: false, error: 'Erro ao atualizar progresso do plano' },
          { status: 500 }
        )
      }

      result = updatedProgress
    } else {
      // Criar novo progresso
      const { data: newProgress, error: insertError } = await supabaseAdmin
        .from('noel_plan_progress')
        .insert({
          user_id,
          current_day: new_day,
          plan_id: null, // Pode ser preenchido depois
          started_at: new Date().toISOString(),
          last_updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (insertError) {
        console.error('❌ Erro ao criar progresso:', insertError)
        return NextResponse.json(
          { success: false, error: 'Erro ao criar progresso do plano' },
          { status: 500 }
        )
      }

      result = newProgress
    }

    return NextResponse.json({
      success: true,
      data: {
        current_day: result.current_day,
        plan_id: result.plan_id,
        last_updated_at: result.last_updated_at,
      },
    })
  } catch (error: any) {
    console.error('❌ Erro em updatePlanDay:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
