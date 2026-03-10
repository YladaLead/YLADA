import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth, getAuthenticatedUserId } from '@/lib/api-auth'
import { translateError } from '@/lib/error-messages'
import { 
  validateTemplateBeforeCreate,
  handleDatabaseInsertError 
} from '@/lib/template-helpers'
import { normalizeTemplateSlug } from '@/lib/template-slug-map'

// GET - Listar ferramentas do usuário ou buscar por ID
export async function GET(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação e perfil wellness
    const authResult = await requireApiAuth(request, ['wellness', 'coach-bem-estar', 'admin'])
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
      // 🚀 OTIMIZAÇÃO: Selecionar apenas campos necessários em vez de select('*')
      // CORRIGIDO: Incluir todos os campos usados no frontend (emoji, custom_colors, cta_type, etc)
      const { data: toolData, error } = await supabaseAdmin
        .from('user_templates')
        .select('id, title, template_slug, slug, status, views, leads_count, conversions_count, created_at, updated_at, user_id, profession, content, short_code, description, emoji, custom_colors, cta_type, whatsapp_number, external_url, cta_button_text, custom_whatsapp_message')
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
    // 🚀 OTIMIZAÇÃO: Selecionar apenas campos necessários em vez de select('*')
    // CORRIGIDO: Incluir todos os campos usados no frontend (emoji, custom_colors, cta_type, etc)
    const { data: toolsData, error } = await supabaseAdmin
      .from('user_templates')
      .select('id, title, template_slug, slug, status, views, leads_count, conversions_count, created_at, updated_at, user_id, profession, short_code, description, emoji, custom_colors, cta_type, whatsapp_number, external_url, cta_button_text, custom_whatsapp_message')
      .eq('user_id', authenticatedUserId) // 🔒 Sempre usar user_id do token
      .eq('profession', profession)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Buscar quizzes personalizados do usuário
    // 🚀 OTIMIZAÇÃO: Selecionar apenas campos necessários em vez de select('*')
    // CORRIGIDO: Incluir todos os campos usados no código (titulo, descricao, emoji, views, leads_count, cores)
    const { data: quizzesData, error: quizzesError } = await supabaseAdmin
      .from('quizzes')
      .select('id, titulo, descricao, emoji, slug, status, views, leads_count, cores, created_at, updated_at, user_id')
      .eq('user_id', authenticatedUserId)
      .eq('status', 'active') // Apenas quizzes ativos
      .order('created_at', { ascending: false })

    if (quizzesError) {
      console.error('Erro ao buscar quizzes:', quizzesError)
      // Não falhar se houver erro, apenas logar
    }

    // Buscar user_slug uma vez para todas as ferramentas (pode não existir)
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('user_slug')
      .eq('user_id', authenticatedUserId)
      .maybeSingle()

    // Buscar dados do usuário
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(authenticatedUserId)

    // Montar resposta completa para cada ferramenta
    const toolsFormatted = (toolsData || []).map(tool => ({
      ...tool,
      user_profiles: userProfile ? { user_slug: userProfile.user_slug } : null,
      users: userData?.user ? {
        name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || '',
        email: userData.user.email || ''
      } : null
    }))

    // Formatar quizzes como ferramentas para exibição
    const quizzesFormatted = (quizzesData || []).map(quiz => ({
      id: quiz.id,
      title: quiz.titulo,
      description: quiz.descricao,
      emoji: quiz.emoji,
      slug: quiz.slug,
      status: quiz.status,
      views: quiz.views || 0,
      leads_count: quiz.leads_count || 0,
      created_at: quiz.created_at,
      updated_at: quiz.updated_at,
      custom_colors: quiz.cores || { primaria: '#8B5CF6', secundaria: '#7C3AED' },
      template_slug: 'quiz-personalizado', // Identificador para quizzes personalizados
      profession: profession,
      user_profiles: userProfile ? { user_slug: userProfile.user_slug } : null,
      users: userData?.user ? {
        name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || '',
        email: userData.user.email || ''
      } : null,
      is_quiz: true // Flag para identificar que é um quiz personalizado
    }))

    // Combinar ferramentas e quizzes, ordenando por data de criação
    const allTools = [...toolsFormatted, ...quizzesFormatted].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA // Mais recentes primeiro
    })

    return NextResponse.json({ tools: allTools })
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
    const authResult = await requireApiAuth(request, ['wellness', 'coach-bem-estar', 'admin'])
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
      show_whatsapp_button = true, // Mostrar botão WhatsApp pequeno (padrão: true)
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

    // Verificar se o slug conflita com o user_slug do próprio usuário
    // Buscar userProfile uma vez e reutilizar depois
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('user_slug')
      .eq('user_id', authenticatedUserId)
      .maybeSingle()

    if (userProfile?.user_slug && userProfile.user_slug.toLowerCase() === slug.toLowerCase()) {
      return NextResponse.json(
        { error: 'Este nome não pode ser usado porque é igual ao seu nome de usuário na URL. Escolha outro nome.' },
        { status: 409 }
      )
    }

    // Verificar se o slug já existe PARA ESTE USUÁRIO (slugs podem ser repetidos entre usuários diferentes)
    const { data: existing } = await supabaseAdmin
      .from('user_templates')
      .select('id')
      .eq('slug', slug)
      .eq('user_id', authenticatedUserId) // ✅ Verificar apenas para o usuário atual
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Este nome já está em uso por você. Escolha outro. (Outras pessoas podem usar o mesmo nome porque a URL final inclui o nome único de cada usuário na composição)' },
        { status: 409 }
      )
    }

    // ✅ Validar template antes de criar (usando helper reutilizável)
    const { templateId: templateIdToUse, templateSlug: templateSlugCanonico, error: templateError } = await validateTemplateBeforeCreate(
      template_slug,
      template_id,
      profession, // 'wellness'
      'pt'
    )

    if (templateError) {
      return NextResponse.json(
        { error: templateError },
        { status: 400 }
      )
    }

    // Buscar conteúdo do template base se template_id fornecido
    let content: any = null // Inicializar como null
    
    if (templateIdToUse) {
      let templateQuery = supabaseAdmin
        .from('templates_nutrition')
        .select('content, profession')
        .eq('id', templateIdToUse)
      
      // ✅ CORRIGIDO: Filtrar por profession para garantir que é o template correto
      if (profession) {
        templateQuery = templateQuery.eq('profession', profession)
      }
      
      const { data: template, error: templateError } = await templateQuery.single()

      if (templateError) {
        console.warn('⚠️ Erro ao buscar template:', templateError)
      }

      if (template?.content) {
        content = template.content
      }
    }
    
    // Se não tem content, usar objeto vazio válido para JSONB
    // Mas garantir que seja um objeto JSON válido
    if (!content) {
      content = {} // Objeto vazio válido para JSONB
    }
    
    // Garantir que content seja sempre um objeto válido
    if (typeof content !== 'object' || Array.isArray(content)) {
      content = {}
    }

    // Gerar código curto se solicitado
    let shortCode = null
    if (generate_short_url) {
      // Se foi fornecido código personalizado, usar ele (após validação)
      if (body.custom_short_code) {
        const customCode = body.custom_short_code.toLowerCase().trim()
        
        // Validar formato
        if (!/^[a-z0-9-]{3,10}$/.test(customCode)) {
          return NextResponse.json(
            { error: 'Código personalizado inválido. Deve ter entre 3 e 10 caracteres e conter apenas letras, números e hífens.' },
            { status: 400 }
          )
        }

        // Verificar disponibilidade
        const { data: existingCode } = await supabaseAdmin
          .from('user_templates')
          .select('id')
          .eq('short_code', customCode)
          .limit(1)

        if (existingCode && existingCode.length > 0) {
          return NextResponse.json(
            { error: 'Este código personalizado já está em uso' },
            { status: 409 }
          )
        }

        shortCode = customCode
      } else {
        // Gerar código aleatório
        const { data: codeData, error: codeError } = await supabaseAdmin.rpc('generate_unique_short_code')
        if (!codeError && codeData) {
          shortCode = codeData
        } else {
          console.error('Erro ao gerar código curto:', codeError)
        }
      }
    }

    // Inserir nova ferramenta
    const insertData: any = {
      user_id: authenticatedUserId, // 🔒 Sempre usar user_id do token
      template_id: templateIdToUse || null,
      template_slug: templateSlugCanonico, // ✅ Slug canônico do banco ou normalizado
      slug,
      title,
      description: description || null,
      emoji: emoji || null,
      custom_colors: custom_colors || { principal: '#10B981', secundaria: '#059669' },
      cta_type: cta_type || 'whatsapp',
      whatsapp_number: cta_type === 'whatsapp' ? whatsappDoPerfil : null, // Sempre usar do perfil
      external_url: external_url || null,
      cta_button_text: cta_button_text || 'Conversar com Especialista',
      custom_whatsapp_message: custom_whatsapp_message || null,
      show_whatsapp_button: show_whatsapp_button !== false, // Mostrar botão WhatsApp pequeno (padrão: true)
      profession: profession || 'wellness',
      status: 'active',
      views: 0,
      leads_count: 0
    }
    
    // Adicionar content sempre (objeto vazio se não tiver)
    // JSONB aceita objetos vazios {}
    insertData.content = content || {}
    
    // Adicionar short_code apenas se foi gerado
    if (shortCode) {
      insertData.short_code = shortCode
    }
    
    // Log detalhado antes de inserir (sem dados sensíveis)
    console.log('📝 Tentando inserir ferramenta:', {
      user_id: authenticatedUserId,
      slug,
      template_slug,
      profession,
      has_content: !!content,
      content_keys: content ? Object.keys(content).length : 0,
      has_short_code: !!shortCode
    })
    
    // 🚀 OTIMIZAÇÃO: Selecionar apenas campos necessários em vez de select('*')
    // CORRIGIDO: Incluir todos os campos usados no frontend
    const { data: insertedTool, error: insertError } = await supabaseAdmin
      .from('user_templates')
      .insert(insertData)
      .select('id, title, template_slug, slug, status, views, leads_count, conversions_count, created_at, updated_at, user_id, profession, content, short_code, description, emoji, custom_colors, cta_type, whatsapp_number, external_url, cta_button_text, custom_whatsapp_message')
      .single()

    if (insertError) {
      console.error('❌ Erro ao inserir ferramenta:', {
        error: insertError,
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
        insertData: {
          ...insertData,
          content: content ? `{${Object.keys(content).length} keys}` : 'empty'
        }
      })
      
      // ✅ Usar helper para tratar erros de inserção
      const errorResponse = handleDatabaseInsertError(insertError)
      return NextResponse.json(
        { 
          error: errorResponse.error,
          technical: errorResponse.technical,
          code: errorResponse.code,
          hint: errorResponse.hint
        },
        { status: errorResponse.status }
      )
    }

    // userProfile já foi buscado anteriormente (linha 233), reutilizar aqui
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
      details: error?.details,
      hint: error?.hint
    })
    
    // Se for erro de coluna não encontrada, dar mensagem específica
    if (error?.code === '42703' || error?.message?.includes('column') || error?.message?.includes('does not exist') || error?.message?.includes('schema cache')) {
      return NextResponse.json(
        { 
          error: 'Estamos atualizando o sistema. Por favor, execute o script SQL de atualização do banco de dados e tente novamente.',
          technical: error?.message,
          code: error?.code,
          hint: error?.hint
        },
        { status: 500 }
      )
    }
    
    // Usar translateError para mensagem amigável em português
    const mensagemAmigavel = translateError(error)
    
    return NextResponse.json(
      { 
        error: mensagemAmigavel,
        technical: process.env.NODE_ENV === 'development' ? error?.message : undefined,
        code: error?.code
      },
      { status: 500 }
    )
  }
}

// PUT - Atualizar ferramenta
export async function PUT(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação e perfil wellness
    const authResult = await requireApiAuth(request, ['wellness', 'coach-bem-estar', 'admin'])
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
      show_whatsapp_button = true, // Mostrar botão WhatsApp pequeno (padrão: true)
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

    // Verificar se o slug mudou e se já existe PARA ESTE USUÁRIO
    if (slug) {
      // Verificar se o slug conflita com o user_slug do próprio usuário
      const { data: userProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('user_slug')
        .eq('user_id', authenticatedUserId)
        .maybeSingle()

      if (userProfile?.user_slug && userProfile.user_slug.toLowerCase() === slug.toLowerCase()) {
        return NextResponse.json(
          { error: 'Este nome não pode ser usado porque é igual ao seu nome de usuário na URL. Escolha outro nome.' },
          { status: 409 }
        )
      }

      const { data: existing } = await supabaseAdmin
        .from('user_templates')
        .select('id')
        .eq('slug', slug)
        .eq('user_id', authenticatedUserId) // ✅ Verificar apenas para o usuário atual
        .neq('id', id)
        .maybeSingle()

      if (existing) {
        return NextResponse.json(
          { error: 'Este nome de URL já está em uso por você. Escolha outro.' },
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
    if (show_whatsapp_button !== undefined) updateData.show_whatsapp_button = show_whatsapp_button
    if (status !== undefined) updateData.status = status

    // Remover código curto se solicitado
    if (body.remove_short_code === true) {
      updateData.short_code = null
    }

    // Gerar código curto se solicitado e ainda não existir
    if (generate_short_url) {
      const { data: existingTool } = await supabaseAdmin
        .from('user_templates')
        .select('short_code')
        .eq('id', id)
        .single()

      if (!existingTool?.short_code) {
        // Se foi fornecido código personalizado, usar ele (após validação)
        if (body.custom_short_code) {
          const customCode = body.custom_short_code.toLowerCase().trim()
          
          // Validar formato
          if (!/^[a-z0-9-]{3,10}$/.test(customCode)) {
            return NextResponse.json(
              { error: 'Código personalizado inválido. Deve ter entre 3 e 10 caracteres e conter apenas letras, números e hífens.' },
              { status: 400 }
            )
          }

          // Verificar disponibilidade
          const { data: existingCode } = await supabaseAdmin
            .from('user_templates')
            .select('id')
            .eq('short_code', customCode)
            .neq('id', id)
            .limit(1)

          if (existingCode && existingCode.length > 0) {
            return NextResponse.json(
              { error: 'Este código personalizado já está em uso' },
              { status: 409 }
            )
          }

          updateData.short_code = customCode
        } else {
          // Gerar código aleatório
          const { data: codeData, error: codeError } = await supabaseAdmin.rpc('generate_unique_short_code')
          if (!codeError && codeData) {
            updateData.short_code = codeData
          } else {
            console.error('Erro ao gerar código curto:', codeError)
          }
        }
      }
    }

    // 🔒 Atualizar (só se pertencer ao usuário autenticado)
    const { data: updatedTool, error } = await supabaseAdmin
      .from('user_templates')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', authenticatedUserId) // 🔒 Sempre usar user_id do token
      .select('id, title, template_slug, slug, status, views, leads_count, conversions_count, created_at, updated_at, user_id, profession, content, short_code, description, emoji, custom_colors, cta_type, whatsapp_number, external_url, cta_button_text, custom_whatsapp_message')
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
    const authResult = await requireApiAuth(request, ['wellness', 'coach-bem-estar', 'admin'])
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


