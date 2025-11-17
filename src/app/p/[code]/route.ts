import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Redirecionar código curto para URL completa
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

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

    // Normalizar código para lowercase (case-insensitive)
    const normalizedCode = code.toLowerCase().trim()
    console.log('🔍 Buscando código curto:', normalizedCode)

    // Buscar ferramenta pelo código curto (case-insensitive)
    // Primeiro buscar sem join para verificar se existe
    const { data: tool, error } = await supabaseAdmin
      .from('user_templates')
      .select(`
        id,
        slug,
        status,
        user_id,
        profession
      `)
      .ilike('short_code', normalizedCode)
      .eq('status', 'active')
      .single()

    if (error) {
      console.error('❌ Erro ao buscar código curto:', error)
      console.error('Código buscado:', normalizedCode)
      return NextResponse.json(
        { error: 'Link não encontrado ou inativo' },
        { status: 404 }
      )
    }

    if (!tool) {
      console.error('❌ Ferramenta não encontrada para código:', normalizedCode)
      return NextResponse.json(
        { error: 'Link não encontrado ou inativo' },
        { status: 404 }
      )
    }

    console.log('✅ Ferramenta encontrada:', { id: tool.id, slug: tool.slug, profession: tool.profession })

    // Buscar user_slug separadamente
    let userSlug = null
    if (tool.user_id) {
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('user_slug')
        .eq('user_id', tool.user_id)
        .maybeSingle()
      
      userSlug = profile?.user_slug || null
      console.log('👤 User slug encontrado:', userSlug)
    }

    // Construir URL completa baseada na profissão
    let redirectUrl = ''
    
    if (tool.profession === 'wellness' && userSlug) {
      redirectUrl = `/pt/wellness/${userSlug}/${tool.slug}`
    } else {
      // Fallback para URL genérica se não tiver user_slug
      redirectUrl = `/pt/wellness/ferramenta/${tool.id}`
    }

    console.log('🔄 Redirecionando para:', redirectUrl)

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

