import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET - Buscar formulário público por user_slug e slug
 */
export async function GET(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userSlug = searchParams.get('user_slug')
    const slug = searchParams.get('slug')

    if (!userSlug || !slug) {
      return NextResponse.json(
        { error: 'user_slug e slug são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar user_id pelo user_slug
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id')
      .eq('user_slug', userSlug)
      .maybeSingle()

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: 'Formulário não encontrado' },
        { status: 404 }
      )
    }

    // Buscar formulário por user_id e slug
    const { data: form, error } = await supabaseAdmin
      .from('custom_forms')
      .select('*')
      .eq('user_id', userProfile.user_id)
      .eq('slug', slug)
      .eq('is_active', true)
      .single()

    if (error || !form) {
      return NextResponse.json(
        { error: 'Formulário não encontrado ou não está mais disponível' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { form }
    })

  } catch (error: any) {
    console.error('Erro ao buscar formulário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

