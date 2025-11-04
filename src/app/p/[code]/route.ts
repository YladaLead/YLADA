import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Redirecionar código curto para URL completa
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const code = params.code

    if (!code || code.length === 0) {
      return NextResponse.json(
        { error: 'Código inválido' },
        { status: 400 }
      )
    }

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    // Buscar ferramenta pelo código curto
    const { data: tool, error } = await supabaseAdmin
      .from('user_templates')
      .select(`
        id,
        slug,
        status,
        user_profiles!inner(user_slug),
        profession
      `)
      .eq('short_code', code)
      .eq('status', 'active')
      .single()

    if (error || !tool) {
      return NextResponse.json(
        { error: 'Link não encontrado ou inativo' },
        { status: 404 }
      )
    }

    // Construir URL completa baseada na profissão
    let redirectUrl = ''
    
    if (tool.profession === 'wellness' && tool.user_profiles?.user_slug) {
      redirectUrl = `/pt/wellness/${tool.user_profiles.user_slug}/${tool.slug}`
    } else {
      // Fallback para URL genérica se não tiver user_slug
      redirectUrl = `/pt/wellness/ferramenta/${tool.id}`
    }

    // Redirecionar para URL completa
    return NextResponse.redirect(new URL(redirectUrl, request.url), 302)

  } catch (error: any) {
    console.error('Erro ao redirecionar código curto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

