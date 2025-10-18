import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Buscar dados do link
    const { data: link, error } = await supabaseAdmin
      .from('generated_links')
      .select('*')
      .eq('slug', params.slug)
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

    return NextResponse.json({
      success: true,
      data: {
        id: link.id,
        title: link.title,
        description: link.description,
        content: link.content,
        views: link.views + 1,
        leadsCount: link.leads_count
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

