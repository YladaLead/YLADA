import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Buscar perfil público por user_slug (sem autenticação necessária)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userSlug = searchParams.get('user_slug')

    if (!userSlug) {
      return NextResponse.json(
        { error: 'user_slug é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar perfil pelo user_slug
    const { data: profile, error } = await supabaseAdmin
      .from('user_profiles')
      .select('whatsapp, country_code, nome_completo, user_slug')
      .eq('user_slug', userSlug)
      .eq('profession', 'wellness')
      .maybeSingle()

    if (error) {
      console.error('Erro ao buscar perfil:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar perfil' },
        { status: 500 }
      )
    }

    if (!profile) {
      return NextResponse.json(
        { error: 'Perfil não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      profile: {
        whatsapp: profile.whatsapp || '',
        countryCode: profile.country_code || 'BR',
        nomeCompleto: profile.nome_completo || '',
        userSlug: profile.user_slug || ''
      }
    })
  } catch (error: any) {
    console.error('Erro técnico ao buscar perfil:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar perfil' },
      { status: 500 }
    )
  }
}

