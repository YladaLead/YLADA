/**
 * NOEL Function: getPlanDay
 * 
 * Retorna o dia atual do plano de 90 dias em que o consultor está
 * 
 * Schema OpenAI:
 * {
 *   "name": "getPlanDay",
 *   "description": "Retorna o dia atual do plano de 90 dias em que o consultor está.",
 *   "parameters": {
 *     "type": "object",
 *     "properties": {
 *       "user_id": { "type": "string" }
 *     },
 *     "required": ["user_id"]
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
    const { user_id } = body

    // Validação
    if (!user_id || typeof user_id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'user_id é obrigatório e deve ser uma string' },
        { status: 400 }
      )
    }

    // Buscar progresso do plano
    const { data: progress, error: progressError } = await supabaseAdmin
      .from('noel_plan_progress')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (progressError && progressError.code !== 'PGRST116') {
      console.error('❌ Erro ao buscar progresso do plano:', progressError)
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar progresso do plano' },
        { status: 500 }
      )
    }

    // Se não encontrou, retornar dia 1 (início)
    if (!progress) {
      return NextResponse.json({
        success: true,
        data: {
          current_day: 1,
          plan_id: null,
          started_at: null,
        },
      })
    }

    return NextResponse.json({
      success: true,
      data: {
        current_day: progress.current_day || 1,
        plan_id: progress.plan_id,
        started_at: progress.started_at,
        last_updated_at: progress.last_updated_at,
      },
    })
  } catch (error: any) {
    console.error('❌ Erro em getPlanDay:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
