import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth, getAuthenticatedUserId } from '@/lib/api-auth'
import { translateError } from '@/lib/error-messages'

// GET - Listar ferramentas do usuário ou buscar por ID
export async function GET(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação e perfil wellness
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult // Retorna erro de autenticação
    }
    const { user, profile: authProfile } = authResult

    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('id')
    const profession = searchParams.get('profession') || 'wellness'

    // 🔒 Usar user_id do token (seguro), não do parâmetro
    const authenticatedUserId = user.id

    if (toolId) {
      // Buscar ferramenta específica (só se pertencer ao usuário ou for admin)
      const { data: toolData, error } = await supabaseAdmin
        .from('user_templates')
        .select('*')
        .eq('id', toolId)
        .eq('profession', profession)
        .eq('user_id', authenticatedUserId) // 🔒 Garantir que pertence ao usuário
        .single()

      if (error) throw error

      if (!toolData) {
        return NextResponse.json(
          { error: 'Ferramenta não encontrada ou você não tem permissão para acessá-la' },
          { status: 404 }
        )
      }

      // Buscar user_slug separadamente (pode não existir)
      const { data: userProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('user_slug')
        .eq('user_id', authenticatedUserId)
        .maybeSingle()

      // Buscar dados do usuário
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(authenticatedUserId)

      // Montar resposta completa
      const data = {
        ...toolData,
        user_profiles: userProfile ? { user_slug: userProfile.user_slug } : null,
        users: userData?.user ? {
          name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || '',
          email: userData.user.email || ''
        } : null
      }

      return NextResponse.json({ tool: data })
    }

    // Listar ferramentas do usuário autenticado
    const { data: toolsData, error } = await supabaseAdmin
      .from('user_templates')
      .select('*')
      .eq('user_id', authenticatedUserId) // 🔒 Sempre usar user_id do token
      .eq('profession', profession)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Buscar user_slug uma vez para todas as ferramentas (pode não existir)
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('user_slug')
      .eq('user_id', authenticatedUserId)
      .maybeSingle()

    // Buscar dados do usuário
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(authenticatedUserId)

    // Montar resposta completa para cada ferramenta
    const data = (toolsData || []).map(tool => ({
      ...tool,
      user_profiles: userProfile ? { user_slug: userProfile.user_slug } : null,
      users: userData?.user ? {
        name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || '',
        email: userData.user.email || ''
      } : null
    }))

    return NextResponse.json({ tools: data })
  } catch (error: any) {
    console.error('❌ Erro técnico ao buscar ferramentas:', {
      error,
      message: error?.message,
      code: error?.code
    })
    
    const mensagemAmigavel = translateError(error)
    return NextResponse.json(
      { error: mensagemAmigavel },
      { status: 500 }
    )
  }
}

// POST - Criar nova ferramenta
export async function POST(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação e perfil wellness
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult // Retorna erro de autenticação
    }
    const { user } = authResult

    const body = await request.json()
    const {
      template_id,
      template_slug,
      title,
      description,
      slug,
      emoji,
      custom_colors,
      cta_type,
      whatsapp_number, // Ignorado - sempre usar do perfil
      external_url,
      cta_button_text,
      custom_whatsapp_message,
      profession = 'wellness',
      generate_short_url = false
    } = body

    // 🔒 Usar user_id do token (seguro), não do body
    const authenticatedUserId = user.id

    // Validações
    if (!slug) {
      return NextResponse.json(
        { error: 'slug é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar WhatsApp do perfil (sempre usar do perfil, não do body)
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('whatsapp')
      .eq('user_id', authenticatedUserId)
      .maybeSingle()

    const whatsappDoPerfil = profile?.whatsapp || null

    // Se CTA é WhatsApp mas não tem número no perfil, retornar erro
    if (cta_type === 'whatsapp' && !whatsappDoPerfil) {
      return NextResponse.json(
        { error: 'Configure seu WhatsApp no perfil antes de criar ferramentas com CTA WhatsApp' },
        { status: 400 }
      )
    }

    // Validar se URL externa não é do WhatsApp (segurança)
    if (external_url) {
      const urlLower = external_url.toLowerCase()
      const isWhatsappUrl = urlLower.includes('wa.me') || 
                            urlLower.includes('whatsapp.com') || 
                            urlLower.includes('web.whatsapp.com') ||
                            urlLower.includes('api.whatsapp.com')
      
      if (isWhatsappUrl) {
        return NextResponse.json(
          { error: 'URLs do WhatsApp não são permitidas em URLs externas. Para usar WhatsApp, escolha a opção "WhatsApp" no tipo de CTA.' },
          { status: 400 }
        )
      }
    }

    // Verificar se o slug já existe
    const { data: existing } = await supabaseAdmin
      .from('user_templates')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Este nome de URL já está em uso. Escolha outro.' },
        { status: 409 }
      )
    }

    // Buscar conteúdo do template base se template_id fornecido
    let content = {}
    if (template_id) {
      const { data: template } = await supabaseAdmin
        .from('templates_nutrition')
        .select('content')
        .eq('id', template_id)
        .single()

      if (template) {
        content = template.content
      }
    }

    // Gerar código curto se solicitado
    let shortCode = null
    if (generate_short_url) {
      const { data: codeData, error: codeError } = await supabaseAdmin.rpc('generate_unique_short_code')
      if (!codeError && codeData) {
        shortCode = codeData
      } else {
        console.error('Erro ao gerar código curto:', codeError)
      }
    }

    // Inserir nova ferramenta
    const { data: insertedTool, error: insertError } = await supabaseAdmin
      .from('user_templates')
      .insert({
        user_id: authenticatedUserId, // 🔒 Sempre usar user_id do token
        template_id: template_id || null,
        template_slug,
        slug,
        title,
        description,
        emoji,
        custom_colors: custom_colors || { principal: '#10B981', secundaria: '#059669' },
        cta_type: cta_type || 'whatsapp',
        whatsapp_number: cta_type === 'whatsapp' ? whatsappDoPerfil : null, // Sempre usar do perfil
        external_url,
        cta_button_text: cta_button_text || 'Conversar com Especialista',
        custom_whatsapp_message,
        profession,
        content,
        status: 'active',
        views: 0,
        leads_count: 0,
        short_code: shortCode
      })
      .select('*')
      .single()

    if (insertError) throw insertError

    // Buscar user_slug separadamente (pode não existir)
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('user_slug')
      .eq('user_id', authenticatedUserId)
      .maybeSingle()

    // Buscar dados do usuário
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(authenticatedUserId)

    // Montar resposta completa
    const data = {
      ...insertedTool,
      user_profiles: userProfile ? { user_slug: userProfile.user_slug } : null,
      users: userData?.user ? {
        name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || '',
        email: userData.user.email || ''
      } : null
    }

    return NextResponse.json(
      { 
        tool: data,
        message: 'Ferramenta criada com sucesso!'
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('❌ Erro técnico ao criar ferramenta:', {
      error,
      message: error?.message,
      code: error?.code,
      details: error?.details
    })
    
    // Usar translateError para mensagem amigável em português
    const mensagemAmigavel = translateError(error)
    
    // Se for erro de coluna não encontrada, dar mensagem específica
    if (error?.message?.includes('column') || error?.message?.includes('schema cache') || error?.code === '42703') {
      return NextResponse.json(
        { 
          error: 'Estamos atualizando o sistema. Por favor, atualize a página (F5) e tente novamente.',
          technical: error?.message // Para debug
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: mensagemAmigavel },
      { status: 500 }
    )
  }
}

// PUT - Atualizar ferramenta
export async function PUT(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação e perfil wellness
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const body = await request.json()
    const {
      id,
      title,
      description,
      slug,
      emoji,
      custom_colors,
      cta_type,
      whatsapp_number, // Ignorado - sempre usar do perfil
      external_url,
      cta_button_text,
      custom_whatsapp_message,
      status,
      generate_short_url = false
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'id é obrigatório' },
        { status: 400 }
      )
    }

    const authenticatedUserId = user.id

    // Buscar WhatsApp do perfil (sempre usar do perfil, não do body)
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('whatsapp')
      .eq('user_id', authenticatedUserId)
      .maybeSingle()

    const whatsappDoPerfil = profile?.whatsapp || null

    // Se CTA é WhatsApp mas não tem número no perfil, retornar erro
    if (cta_type === 'whatsapp' && !whatsappDoPerfil) {
      return NextResponse.json(
        { error: 'Configure seu WhatsApp no perfil antes de atualizar ferramentas com CTA WhatsApp' },
        { status: 400 }
      )
    }

    // Validar se URL externa não é do WhatsApp (segurança)
    if (external_url) {
      const urlLower = external_url.toLowerCase()
      const isWhatsappUrl = urlLower.includes('wa.me') || 
                            urlLower.includes('whatsapp.com') || 
                            urlLower.includes('web.whatsapp.com') ||
                            urlLower.includes('api.whatsapp.com')
      
      if (isWhatsappUrl) {
        return NextResponse.json(
          { error: 'URLs do WhatsApp não são permitidas em URLs externas. Para usar WhatsApp, escolha a opção "WhatsApp" no tipo de CTA.' },
          { status: 400 }
        )
      }
    }

    // Verificar se o slug mudou e se já existe
    if (slug) {
      const { data: existing } = await supabaseAdmin
        .from('user_templates')
        .select('id')
        .eq('slug', slug)
        .neq('id', id)
        .single()

      if (existing) {
        return NextResponse.json(
          { error: 'Este nome de URL já está em uso. Escolha outro.' },
          { status: 409 }
        )
      }
    }

    // Preparar objeto de atualização
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (slug !== undefined) updateData.slug = slug
    if (emoji !== undefined) updateData.emoji = emoji
    if (custom_colors !== undefined) updateData.custom_colors = custom_colors
    if (cta_type !== undefined) updateData.cta_type = cta_type
    if (whatsapp_number !== undefined) {
      // Ignorar whatsapp_number do body - sempre usar do perfil se CTA for whatsapp
      if (cta_type === 'whatsapp') {
        updateData.whatsapp_number = whatsappDoPerfil
      } else {
        updateData.whatsapp_number = null
      }
    }
    if (external_url !== undefined) updateData.external_url = external_url
    if (cta_button_text !== undefined) updateData.cta_button_text = cta_button_text
    if (custom_whatsapp_message !== undefined) updateData.custom_whatsapp_message = custom_whatsapp_message
    if (status !== undefined) updateData.status = status

    // Gerar código curto se solicitado e ainda não existir
    if (generate_short_url) {
      const { data: existingTool } = await supabaseAdmin
        .from('user_templates')
        .select('short_code')
        .eq('id', id)
        .single()

      if (!existingTool?.short_code) {
        const { data: codeData, error: codeError } = await supabaseAdmin.rpc('generate_unique_short_code')
        if (!codeError && codeData) {
          updateData.short_code = codeData
        } else {
          console.error('Erro ao gerar código curto:', codeError)
        }
      }
    }

    // 🔒 Atualizar (só se pertencer ao usuário autenticado)
    const { data: updatedTool, error } = await supabaseAdmin
      .from('user_templates')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', authenticatedUserId) // 🔒 Sempre usar user_id do token
      .select('*')
      .single()

    if (error) throw error

    if (!updatedTool) {
      return NextResponse.json(
        { error: 'Ferramenta não encontrada ou não pertence ao usuário' },
        { status: 404 }
      )
    }

    // Buscar user_slug separadamente (pode não existir)
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('user_slug')
      .eq('user_id', authenticatedUserId)
      .maybeSingle()

    // Buscar dados do usuário
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(authenticatedUserId)

    // Montar resposta completa
    const data = {
      ...updatedTool,
      user_profiles: userProfile ? { user_slug: userProfile.user_slug } : null,
      users: userData?.user ? {
        name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || '',
        email: userData.user.email || ''
      } : null
    }

    return NextResponse.json({
      tool: data,
      message: 'Ferramenta atualizada com sucesso!'
    })
  } catch (error: any) {
    console.error('❌ Erro técnico ao atualizar ferramenta:', {
      error,
      message: error?.message,
      code: error?.code,
      details: error?.details
    })
    
    // Usar translateError para mensagem amigável em português
    const mensagemAmigavel = translateError(error)
    
    // Se for erro de coluna não encontrada, dar mensagem específica
    if (error?.message?.includes('column') || error?.message?.includes('schema cache') || error?.code === '42703') {
      return NextResponse.json(
        { 
          error: 'Estamos atualizando o sistema. Por favor, atualize a página (F5) e tente novamente.',
          technical: error?.message // Para debug
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: mensagemAmigavel },
      { status: 500 }
    )
  }
}

// DELETE - Deletar ferramenta
export async function DELETE(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação e perfil wellness
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'id é obrigatório' },
        { status: 400 }
      )
    }

    // 🔒 Deletar (só se pertencer ao usuário autenticado)
    const authenticatedUserId = user.id
    const { error } = await supabaseAdmin
      .from('user_templates')
      .delete()
      .eq('id', id)
      .eq('user_id', authenticatedUserId) // 🔒 Sempre usar user_id do token

    if (error) throw error

    return NextResponse.json({
      message: 'Ferramenta deletada com sucesso!'
    })
  } catch (error: any) {
    console.error('❌ Erro técnico ao deletar ferramenta:', {
      error,
      message: error?.message,
      code: error?.code
    })
    
    const mensagemAmigavel = translateError(error)
    return NextResponse.json(
      { error: mensagemAmigavel },
      { status: 500 }
    )
  }
}


