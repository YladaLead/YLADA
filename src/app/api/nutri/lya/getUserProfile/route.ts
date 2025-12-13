/**
 * LYA Function: getUserProfile
 * 
 * Retorna o perfil da nutricionista para personalização da LYA
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { NutriProfile, NutriState } from '@/types/nutri-lya'

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

    // Buscar perfil da nutricionista
    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', user_id)
      .maybeSingle()

    if (error) {
      console.error('Erro ao buscar perfil:', error)
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar perfil' },
        { status: 500 }
      )
    }

    // Buscar contexto LYA específico (se existir)
    const { data: lyaContext } = await supabaseAdmin
      .from('lya_context')
      .select('*')
      .eq('user_id', user_id)
      .maybeSingle()

    // Construir resposta
    const profileData = {
      user_id,
      name: profile?.name || profile?.full_name || 'Nutricionista',
      email: profile?.email || null,
      profile_detected: (lyaContext?.profile as NutriProfile) || null,
      state_detected: (lyaContext?.state as NutriState) || null,
      has_profile: !!profile,
    }

    return NextResponse.json({
      success: true,
      data: profileData
    })
  } catch (error: any) {
    console.error('Erro em getUserProfile:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Erro ao buscar perfil' },
      { status: 500 }
    )
  }
}
