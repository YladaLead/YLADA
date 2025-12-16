import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Buscar dados do link
    const { data: link, error } = await supabaseAdmin
      .from('generated_links')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (error || !link) {
      return NextResponse.json(
        { success: false, error: 'Link não encontrado ou inativo' },
        { status: 404 }
      )
    }

    // Verificar se o link expirou
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'Link expirado' },
        { status: 410 }
      )
    }

    // Incrementar contador de visualizações
    await supabaseAdmin
      .from('generated_links')
      .update({ views: link.views + 1 })
      .eq('id', link.id)

    // Tentar buscar área através de user_templates usando o slug
    let area: string | null = null
    
    // Primeiro, tentar buscar através de user_templates pelo slug
    const { data: userTemplate } = await supabaseAdmin
      .from('user_templates')
      .select('profession, user_id')
      .eq('slug', slug)
      .single()
    
    if (userTemplate?.profession) {
      area = userTemplate.profession
    } else if (userTemplate?.user_id) {
      // Se não encontrar profession, tentar buscar do perfil do usuário
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('perfil')
        .eq('user_id', userTemplate.user_id)
        .single()
      
      if (profile?.perfil) {
        area = profile.perfil
      }
    } else if (link.user_id) {
      // Se o link tiver user_id diretamente, buscar do perfil
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('perfil')
        .eq('user_id', link.user_id)
        .single()
      
      if (profile?.perfil) {
        area = profile.perfil
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: link.id,
        title: link.title,
        description: link.description,
        content: link.content,
        views: link.views + 1,
        leadsCount: link.leads_count,
        area: area || 'wellness' // Default para wellness se não encontrar
      }
    })

  } catch (error) {
    console.error('Erro ao buscar link:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

