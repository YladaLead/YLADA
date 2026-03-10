import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

// GET - Listar portais do usuário autenticado
export async function GET(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação e perfil wellness
    const authResult = await requireApiAuth(request, ['wellness', 'coach-bem-estar', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const status = searchParams.get('status') || 'all'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // 🔒 Sempre usar user_id do token (seguro)
    const authenticatedUserId = user.id

    // Se ID foi fornecido, retornar portal específico
    if (id) {
      const { data: portal, error } = await supabaseAdmin
        .from('wellness_portals')
        .select('*')
        .eq('id', id)
        .eq('user_id', authenticatedUserId)
        .single()

      if (error || !portal) {
        return NextResponse.json(
          { error: 'Portal não encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: { portal }
      })
    }

    // Primeiro buscar portais
    let query = supabaseAdmin
      .from('wellness_portals')
      .select('*', { count: 'exact' })
      .eq('user_id', authenticatedUserId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filtrar por status se fornecido
    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: portals, error, count } = await query

    if (error) {
      console.error('Erro ao buscar portais:', error)
      
      // Verificar se é erro de tabela não encontrada
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Tabelas de portais não encontradas. Execute o script SQL schema-wellness-portals.sql no Supabase.',
            code: 'TABLE_NOT_FOUND'
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: error.message || 'Erro ao buscar portais',
          code: error.code || 'UNKNOWN_ERROR'
        },
        { status: 500 }
      )
    }

    // Buscar ferramentas de cada portal separadamente para evitar problemas de relacionamento
    const portalsWithTools = await Promise.all(
      (portals || []).map(async (portal: any) => {
        const { data: tools } = await supabaseAdmin
          .from('portal_tools')
          .select(`
            id,
            position,
            is_required,
            display_name,
            tool_id,
            redirect_to_tool_id,
            user_templates:tool_id (
              id,
              title,
              slug,
              emoji,
              template_slug
            )
          `)
          .eq('portal_id', portal.id)
          .order('position', { ascending: true })

        return {
          ...portal,
          portal_tools: tools || []
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        portals: portalsWithTools,
        total: count || 0,
        limit,
        offset
      }
    })

  } catch (error: any) {
    console.error('Erro ao listar portais:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar novo portal
export async function POST(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação e perfil wellness
    const authResult = await requireApiAuth(request, ['wellness', 'coach-bem-estar', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      navigation_type = 'menu',
      custom_colors,
      header_text,
      footer_text,
      tools_order = []
    } = body

    // Validações
    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Nome e slug são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se o slug já existe PARA ESTE USUÁRIO
    const { data: existing } = await supabaseAdmin
      .from('wellness_portals')
      .select('id')
      .eq('slug', slug)
      .eq('user_id', user.id) // ✅ Verificar apenas para o usuário atual
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Este nome de URL já está em uso por você. Escolha outro.' },
        { status: 409 }
      )
    }

    // 🔒 Usar user_id do token (seguro)
    const authenticatedUserId = user.id

    // Processar short_code se fornecido
    let shortCode = null
    if (body.generate_short_url) {
      if (body.custom_short_code) {
        const customCode = body.custom_short_code.toLowerCase().trim()
        
        // Validar formato
        if (!/^[a-z0-9-]{3,10}$/.test(customCode)) {
          return NextResponse.json(
            { error: 'Código personalizado inválido. Deve ter entre 3 e 10 caracteres e conter apenas letras, números e hífens.' },
            { status: 400 }
          )
        }

        // Verificar disponibilidade (em todas as tabelas que usam short_code)
        const [existingInPortals, existingInQuizzes, existingInTemplates] = await Promise.all([
          supabaseAdmin.from('wellness_portals').select('id').eq('short_code', customCode).limit(1),
          supabaseAdmin.from('quizzes').select('id').eq('short_code', customCode).limit(1),
          supabaseAdmin.from('user_templates').select('id').eq('short_code', customCode).limit(1),
        ])

        if ((existingInPortals.data && existingInPortals.data.length > 0) ||
            (existingInQuizzes.data && existingInQuizzes.data.length > 0) ||
            (existingInTemplates.data && existingInTemplates.data.length > 0)) {
          return NextResponse.json(
            { error: 'Este código personalizado já está em uso' },
            { status: 409 }
          )
        }

        shortCode = customCode
      } else {
        // Gerar código aleatório (verificando em todas as tabelas)
        let codeData = null
        let attempts = 0
        while (!codeData && attempts < 10) {
          const { data: generatedCode, error: codeError } = await supabaseAdmin.rpc('generate_unique_short_code')
          if (!codeError && generatedCode) {
            // Verificar se não existe em nenhuma tabela
            const [checkPortals, checkQuizzes, checkTemplates] = await Promise.all([
              supabaseAdmin.from('wellness_portals').select('id').eq('short_code', generatedCode).limit(1),
              supabaseAdmin.from('quizzes').select('id').eq('short_code', generatedCode).limit(1),
              supabaseAdmin.from('user_templates').select('id').eq('short_code', generatedCode).limit(1),
            ])
            
            if (!checkPortals.data?.length && !checkQuizzes.data?.length && !checkTemplates.data?.length) {
              codeData = generatedCode
            }
          }
          attempts++
        }
        if (codeData) {
          shortCode = codeData
        } else {
          console.error('Erro ao gerar código curto único após 10 tentativas')
        }
      }
    }

    // Inserir novo portal
    const insertData: any = {
      user_id: authenticatedUserId,
      name,
      slug,
      description,
      navigation_type,
      custom_colors: custom_colors || { primary: '#10B981', secondary: '#059669' },
      header_text,
      footer_text,
      tools_order,
      profession: 'wellness', // Área do portal
      status: 'active'
    }

    if (shortCode) {
      insertData.short_code = shortCode
    }

    const { data, error } = await supabaseAdmin
      .from('wellness_portals')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar portal:', error)
      return NextResponse.json(
        { error: 'Erro ao criar portal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { portal: data }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao criar portal:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar portal
export async function PUT(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação e perfil wellness
    const authResult = await requireApiAuth(request, ['wellness', 'coach-bem-estar', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID do portal é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o portal pertence ao usuário
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('wellness_portals')
      .select('id, user_id, slug')
      .eq('id', id)
      .single()

    if (checkError || !existing) {
      return NextResponse.json(
        { error: 'Portal não encontrado' },
        { status: 404 }
      )
    }

    // 🔒 Verificar se pertence ao usuário autenticado (ou é admin)
    if (existing.user_id !== user.id && !profile?.is_admin) {
      return NextResponse.json(
        { error: 'Você não tem permissão para editar este portal' },
        { status: 403 }
      )
    }

    // Se slug mudou, verificar disponibilidade PARA ESTE USUÁRIO
    // 🚀 CORREÇÃO: Excluir o próprio portal da verificação (para permitir editar sem mudar slug)
    if (updates.slug && updates.slug !== existing.slug) {
      const { data: slugExists } = await supabaseAdmin
        .from('wellness_portals')
        .select('id')
        .eq('slug', updates.slug)
        .eq('user_id', user.id) // ✅ Verificar apenas para o usuário atual
        .neq('id', id) // 🚀 CORREÇÃO: Excluir o próprio portal da verificação
        .maybeSingle()

      if (slugExists) {
        return NextResponse.json(
          { error: 'Este nome de URL já está em uso por você. Escolha outro.' },
          { status: 409 }
        )
      }
    }

    // Processar short_code se fornecido
    const updateData: any = { ...updates }

    // Remover short_code se solicitado
    if (body.remove_short_code === true) {
      updateData.short_code = null
    } else if (body.generate_short_url || body.custom_short_code) {
      // Buscar portal atual para verificar se já tem short_code
      const { data: existingPortal } = await supabaseAdmin
        .from('wellness_portals')
        .select('short_code')
        .eq('id', id)
        .single()

      if (!existingPortal?.short_code) {
        // Só gerar se não tiver
        if (body.custom_short_code) {
          const customCode = body.custom_short_code.toLowerCase().trim()
          
          // Validar formato
          if (!/^[a-z0-9-]{3,10}$/.test(customCode)) {
            return NextResponse.json(
              { error: 'Código personalizado inválido. Deve ter entre 3 e 10 caracteres e conter apenas letras, números e hífens.' },
              { status: 400 }
            )
          }

          // Verificar disponibilidade (em todas as tabelas)
          const [existingInPortals, existingInQuizzes, existingInTemplates] = await Promise.all([
            supabaseAdmin.from('wellness_portals').select('id').eq('short_code', customCode).neq('id', id).limit(1),
            supabaseAdmin.from('quizzes').select('id').eq('short_code', customCode).limit(1),
            supabaseAdmin.from('user_templates').select('id').eq('short_code', customCode).limit(1),
          ])

          if ((existingInPortals.data && existingInPortals.data.length > 0) ||
              (existingInQuizzes.data && existingInQuizzes.data.length > 0) ||
              (existingInTemplates.data && existingInTemplates.data.length > 0)) {
            return NextResponse.json(
              { error: 'Este código personalizado já está em uso' },
              { status: 409 }
            )
          }

          updateData.short_code = customCode
        } else if (body.generate_short_url) {
          // Gerar código aleatório (verificando em todas as tabelas)
          let codeData = null
          let attempts = 0
          while (!codeData && attempts < 10) {
            const { data: generatedCode, error: codeError } = await supabaseAdmin.rpc('generate_unique_short_code')
            if (!codeError && generatedCode) {
              // Verificar se não existe em nenhuma tabela
              const [checkPortals, checkQuizzes, checkTemplates] = await Promise.all([
                supabaseAdmin.from('wellness_portals').select('id').eq('short_code', generatedCode).limit(1),
                supabaseAdmin.from('quizzes').select('id').eq('short_code', generatedCode).limit(1),
                supabaseAdmin.from('user_templates').select('id').eq('short_code', generatedCode).limit(1),
              ])
              
              if (!checkPortals.data?.length && !checkQuizzes.data?.length && !checkTemplates.data?.length) {
                codeData = generatedCode
              }
            }
            attempts++
          }
          if (codeData) {
            updateData.short_code = codeData
          } else {
            console.error('Erro ao gerar código curto único após 10 tentativas')
          }
        }
      }
    }

    // Atualizar portal
    const { data, error } = await supabaseAdmin
      .from('wellness_portals')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar portal:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar portal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { portal: data }
    })

  } catch (error: any) {
    console.error('Erro ao atualizar portal:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Deletar portal
export async function DELETE(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação e perfil wellness
    const authResult = await requireApiAuth(request, ['wellness', 'coach-bem-estar', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID do portal é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o portal pertence ao usuário
    const { data: existing, error: checkError } = await supabaseAdmin
      .from('wellness_portals')
      .select('id, user_id')
      .eq('id', id)
      .single()

    if (checkError || !existing) {
      return NextResponse.json(
        { error: 'Portal não encontrado' },
        { status: 404 }
      )
    }

    // 🔒 Verificar se pertence ao usuário autenticado (ou é admin)
    if (existing.user_id !== user.id && !profile?.is_admin) {
      return NextResponse.json(
        { error: 'Você não tem permissão para deletar este portal' },
        { status: 403 }
      )
    }

    // Deletar portal (CASCADE vai deletar portal_tools automaticamente)
    const { error } = await supabaseAdmin
      .from('wellness_portals')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar portal:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar portal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Portal deletado com sucesso'
    })

  } catch (error: any) {
    console.error('Erro ao deletar portal:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

