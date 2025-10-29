import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Verificar disponibilidade de slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json(
        { error: 'slug é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se já existe
    const { data, error } = await supabaseAdmin
      .from('user_templates')
      .select('id, slug')
      .eq('slug', slug)
      .single()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned (é o que queremos)
      throw error
    }

    const available = !data

    return NextResponse.json({
      slug,
      available,
      message: available 
        ? 'URL disponível!' 
        : 'Esta URL já está em uso. Escolha outra.'
    })
  } catch (error: any) {
    console.error('Erro ao verificar slug:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao verificar slug' },
      { status: 500 }
    )
  }
}

