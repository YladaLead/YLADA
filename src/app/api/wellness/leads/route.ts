import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { notifyNewLead } from '@/lib/lead-notifications'

// POST - Capturar lead de ferramenta wellness
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, phone_country_code, tool_slug, user_slug, ferramenta, resultado, template_id } = body

    // 🔍 DEBUG: Dados recebidos
    console.log('🔍 API /wellness/leads - Dados recebidos:', { name, phone, phone_country_code, tool_slug, user_slug, ferramenta, template_id })

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
      console.log('🔍 Buscando user_id pelo user_slug:', user_slug)
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id, user_slug')
        .eq('user_slug', user_slug)
        .maybeSingle()
      
      if (profileError) {
        console.error('🔍 Erro ao buscar user_profile:', profileError)
        console.error('🔍 Detalhes do erro:', JSON.stringify(profileError, null, 2))
      }
      
      if (profile) {
        console.log('🔍 Profile encontrado:', { user_id: profile.user_id, user_slug: profile.user_slug })
        // Garantir que user_id é uma string
        if (profile.user_id) {
          userId = typeof profile.user_id === 'string' ? profile.user_id : String(profile.user_id)
          console.log('🔍 user_id definido pelo profile:', userId)
        } else {
          console.warn('🔍 Profile encontrado mas sem user_id!')
        }
      } else {
        console.warn('🔍 Nenhum profile encontrado para user_slug:', user_slug)
      }
    }

    // Se não encontrou pelo slug, tentar pelo template_id
    if (!userId && template_id) {
      console.log('🔍 Buscando user_id pelo template_id:', template_id)
      const { data: template, error: templateError } = await supabaseAdmin
        .from('user_templates')
        .select('user_id, id')
        .eq('id', template_id)
        .maybeSingle()
      
      if (templateError) {
        console.error('🔍 Erro ao buscar user_templates:', templateError)
        console.error('🔍 Detalhes do erro:', JSON.stringify(templateError, null, 2))
      }
      
      if (template) {
        console.log('🔍 Template encontrado:', { user_id: template.user_id, template_id: template.id })
        // Garantir que user_id é uma string
        if (template.user_id) {
          userId = typeof template.user_id === 'string' ? template.user_id : String(template.user_id)
          console.log('🔍 user_id definido pelo template:', userId)
        } else {
          console.warn('🔍 Template encontrado mas sem user_id!')
        }
      } else {
        console.warn('🔍 Nenhum template encontrado para template_id:', template_id)
      }
    }

    if (!userId) {
      console.error('❌ ERRO: user_id não encontrado!')
      console.error('❌ Parâmetros recebidos:', { user_slug, template_id })
      console.error('❌ Dados completos do body:', JSON.stringify(body, null, 2))
      return NextResponse.json(
        { 
          success: false, 
          error: 'Profissional não encontrado',
          debug: {
            user_slug,
            template_id,
            message: 'Não foi possível encontrar o user_id nem pelo user_slug nem pelo template_id'
          }
        },
        { status: 404 }
      )
    }

    console.log('🔍 user_id encontrado:', userId)

    // Sanitizar dados
    const sanitizedData = {
      name: name.trim().substring(0, 255),
      phone: phone.replace(/\D/g, '').substring(0, 20),
      phone_country_code: phone_country_code || 'BR', // Padrão: Brasil se não informado
    }

    // Capturar IP e User Agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || ''

    // Determinar source baseado na URL ou tool_slug
    // Se tool_slug contém 'calculadora-agua' ou está em /pt/nutri/, é nutri
    const isNutri = tool_slug?.includes('calculadora') || tool_slug?.includes('nutri')
    const source = isNutri ? 'nutri_template' : 'wellness_template'

    console.log('🔍 Inserindo lead com:', {
      user_id: userId,
      name: sanitizedData.name,
      phone: sanitizedData.phone,
      phone_country_code: sanitizedData.phone_country_code,
      source,
      tool_slug,
      template_id
    })

    // Inserir lead na tabela leads
    const { data: newLead, error: leadError } = await supabaseAdmin
      .from('leads')
      .insert({
        user_id: userId,
        name: sanitizedData.name,
        phone: sanitizedData.phone,
        phone_country_code: sanitizedData.phone_country_code,
        additional_data: {
          ferramenta,
          resultado,
          tool_slug,
          origem: 'captura_pos_resultado',
          user_slug
        },
        ip_address: ip,
        user_agent: userAgent.substring(0, 500),
        source: source,
        template_id: template_id || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (leadError) {
      console.error('❌ Erro ao salvar lead:', leadError)
      console.error('❌ Detalhes do erro:', JSON.stringify(leadError, null, 2))
      console.error('❌ Código do erro:', leadError.code)
      console.error('❌ Mensagem do erro:', leadError.message)
      console.error('❌ Dados que tentaram ser inseridos:', {
        user_id: userId,
        name: sanitizedData.name,
        phone: sanitizedData.phone,
        phone_country_code: sanitizedData.phone_country_code,
        source,
        template_id
      })
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erro ao salvar contato',
          debug: {
            code: leadError.code,
            message: leadError.message,
            details: leadError.details
          }
        },
        { status: 500 }
      )
    }

    console.log('🔍 Lead salvo com sucesso! ID:', newLead.id)

    // Enviar notificação por email (não bloqueia a resposta)
    notifyNewLead({
      leadId: newLead.id,
      leadName: sanitizedData.name,
      leadPhone: sanitizedData.phone,
      leadEmail: null, // Wellness leads não capturam email
      toolName: ferramenta || 'Ferramenta',
      result: resultado || undefined,
      userId: userId,
      createdAt: new Date().toISOString()
    }).catch((error) => {
      // Não falhar a requisição se a notificação falhar
      console.error('❌ Erro ao enviar notificação de lead (não crítico):', error)
    })

    return NextResponse.json({
      success: true,
      data: {
        leadId: newLead.id,
        message: 'Contato enviado com sucesso!'
      }
    })

  } catch (error: any) {
    console.error('❌ Erro ao capturar lead wellness:', error)
    console.error('❌ Stack trace:', error.stack)
    console.error('❌ Tipo do erro:', error.name)
    console.error('❌ Mensagem:', error.message)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        debug: {
          message: error.message,
          name: error.name,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      },
      { status: 500 }
    )
  }
}
