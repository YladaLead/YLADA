import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { slug, name, email, phone, additionalData } = await request.json()

    // Buscar o link pelo slug
    const { data: link, error: linkError } = await supabaseAdmin
      .from('generated_links')
      .select('id, title')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (linkError || !link) {
      return NextResponse.json(
        { success: false, error: 'Link não encontrado ou inativo' },
        { status: 404 }
      )
    }

    // Capturar IP e User Agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || ''

    // Inserir lead
    const { data: newLead, error: leadError } = await supabaseAdmin
      .from('leads')
      .insert({
        link_id: link.id,
        name,
        email,
        phone,
        additional_data: additionalData || {},
        ip_address: ip,
        user_agent: userAgent
      })
      .select()
      .single()

    if (leadError) {
      console.error('Erro ao salvar lead:', leadError)
      return NextResponse.json(
        { success: false, error: 'Erro ao salvar lead' },
        { status: 500 }
      )
    }

    // Atualizar contador de leads do link
    await supabaseAdmin
      .from('generated_links')
      .update({ leads_count: link.leads_count + 1 })
      .eq('id', link.id)

    return NextResponse.json({
      success: true,
      data: {
        leadId: newLead.id,
        message: 'Lead capturado com sucesso!'
      }
    })

  } catch (error) {
    console.error('Erro ao capturar lead:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

