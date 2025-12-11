/**
 * NOEL Function: getUserProfile
 * 
 * Retorna o perfil completo do consultor do Supabase
 * 
 * Schema OpenAI:
 * {
 *   "name": "getUserProfile",
 *   "description": "Retorna o perfil completo do consultor do Supabase.",
 *   "parameters": {
 *     "type": "object",
 *     "properties": {
 *       "user_id": {
 *         "type": "string",
 *         "description": "ID único do consultor"
 *       }
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

    console.log('🔍 [getUserProfile] Buscando perfil para user_id:', user_id)
    
    // Buscar perfil do usuário
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('noel_users_profile')
      .select('*')
      .eq('user_id', user_id)
      .single()

    console.log('📊 [getUserProfile] Resultado:', {
      encontrado: !!profile,
      error: profileError?.message,
      errorCode: profileError?.code
    })

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = não encontrado
      console.error('❌ [getUserProfile] Erro ao buscar perfil:', profileError)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao buscar perfil do consultor',
          message: 'Não foi possível buscar seu perfil no momento. Tente novamente em alguns instantes.'
        },
        { status: 500 }
      )
    }

    // Se não encontrou perfil, buscar dados básicos do wellness_noel_profile
    if (!profile) {
      const { data: wellnessProfile } = await supabaseAdmin
        .from('wellness_noel_profile')
        .select('*')
        .eq('user_id', user_id)
        .single()

      if (wellnessProfile) {
        // Criar perfil básico a partir do wellness_noel_profile
        const basicProfile = {
          user_id,
          nivel: wellnessProfile.experiencia_vendas || null,
          tempo_disponivel: wellnessProfile.tempo_disponivel || null,
          objetivo: wellnessProfile.objetivo_principal || null,
          plano_ativo_id: null,
          intensidade: null,
        }

        return NextResponse.json({
          success: true,
          data: basicProfile,
        })
      }

      // Retornar perfil vazio se não encontrou nada
      return NextResponse.json({
        success: true,
        data: {
          user_id,
          nivel: null,
          tempo_disponivel: null,
          estilo: null,
          objetivo: null,
          plano_ativo_id: null,
          intensidade: null,
        },
      })
    }

    // Retornar perfil encontrado
    console.log('✅ [getUserProfile] Perfil encontrado, retornando dados')
    return NextResponse.json({
      success: true,
      data: profile,
    })
  } catch (error: any) {
    console.error('❌ [getUserProfile] Erro geral:', error)
    console.error('❌ [getUserProfile] Stack:', error?.stack)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        message: 'Desculpe, tive um problema técnico ao buscar seu perfil. Tente novamente em alguns instantes.'
      },
      { status: 500 }
    )
  }
}
