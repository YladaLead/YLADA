import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Capturar lead de ferramenta wellness
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, tool_slug, user_slug, ferramenta, resultado, template_id } = body

    // 🔍 DEBUG: Dados recebidos
    console.log('🔍 API /wellness/leads - Dados recebidos:', { name, phone, tool_slug, user_slug, ferramenta, template_id })

    // Validações básicas
    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Nome e telefone são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar user_id do profissional pelo user_slug
    let userId = null
    
    if (user_slug) {
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id')
        .eq('user_slug', user_slug)
        .maybeSingle()
      
      if (profileError) {
        console.error('🔍 Erro ao buscar user_profile:', profileError)
      }
      
      // Garantir que user_id é uma string
      if (profile && profile.user_id) {
        userId = typeof profile.user_id === 'string' ? profile.user_id : String(profile.user_id)
      }
    }

    // Se não encontrou pelo slug, tentar pelo template_id
    if (!userId && template_id) {
      const { data: template, error: templateError } = await supabaseAdmin
        .from('user_templates')
        .select('user_id')
        .eq('id', template_id)
        .maybeSingle()
      
      if (templateError) {
        console.error('🔍 Erro ao buscar user_templates:', templateError)
      }
      
      // Garantir que user_id é uma string
      if (template && template.user_id) {
        userId = typeof template.user_id === 'string' ? template.user_id : String(template.user_id)
      }
    }

    if (!userId) {
      console.error('🔍 user_id não encontrado! user_slug:', user_slug, 'template_id:', template_id)
      return NextResponse.json(
        { success: false, error: 'Profissional não encontrado' },
        { status: 404 }
      )
    }

    console.log('🔍 user_id encontrado:', userId)

    // Sanitizar dados
    const sanitizedData = {
      name: name.trim().substring(0, 255),
      phone: phone.replace(/\D/g, '').substring(0, 20),
    }

    // Capturar IP e User Agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || ''

    // Inserir lead na tabela leads
    const { data: newLead, error: leadError } = await supabaseAdmin
      .from('leads')
      .insert({
        user_id: userId,
        name: sanitizedData.name,
        phone: sanitizedData.phone,
        additional_data: {
          ferramenta,
          resultado,
          tool_slug,
          origem: 'captura_pos_resultado'
        },
        ip_address: ip,
        user_agent: userAgent.substring(0, 500),
        source: 'wellness_template',
        template_id: template_id || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (leadError) {
      console.error('🔍 Erro ao salvar lead wellness:', leadError)
      return NextResponse.json(
        { success: false, error: 'Erro ao salvar contato' },
        { status: 500 }
      )
    }

    console.log('🔍 Lead salvo com sucesso! ID:', newLead.id)

    return NextResponse.json({
      success: true,
      data: {
        leadId: newLead.id,
        message: 'Contato enviado com sucesso!'
      }
    })

  } catch (error: any) {
    console.error('Erro ao capturar lead wellness:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
