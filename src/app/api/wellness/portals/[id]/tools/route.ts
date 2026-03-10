import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

// GET - Listar ferramentas de um portal
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 🔒 Verificar autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'coach-bem-estar', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    const portalId = params.id

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    // Verificar se portal pertence ao usuário
    const { data: portal, error: portalError } = await supabaseAdmin
      .from('wellness_portals')
      .select('id, user_id')
      .eq('id', portalId)
      .single()

    if (portalError || !portal) {
      return NextResponse.json(
        { error: 'Portal não encontrado' },
        { status: 404 }
      )
    }

    // 🔒 Verificar permissão
    if (portal.user_id !== user.id && !profile?.is_admin) {
      return NextResponse.json(
        { error: 'Você não tem permissão para acessar este portal' },
        { status: 403 }
      )
    }

    // Buscar ferramentas do portal
    const { data: tools, error } = await supabaseAdmin
      .from('portal_tools')
      .select(`
        *,
        user_templates (
          id,
          title,
          slug,
          emoji,
          template_slug,
          description,
          custom_colors
        )
      `)
      .eq('portal_id', portalId)
      .order('position', { ascending: true })

    if (error) {
      console.error('Erro ao buscar ferramentas do portal:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar ferramentas' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { tools: tools || [] }
    })

  } catch (error: any) {
    console.error('Erro ao listar ferramentas do portal:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Adicionar ferramenta(s) ao portal ou substituir todas
// Aceita tanto uma ferramenta única quanto um array de ferramentas
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 🔒 Verificar autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'coach-bem-estar', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    const portalId = params.id
    const body = await request.json()
    
    // 🚀 CORREÇÃO: Verificar se é array de ferramentas (atualização em lote)
    if (body.tools && Array.isArray(body.tools)) {
      // Modo: substituir todas as ferramentas do portal
      return await replaceAllPortalTools(portalId, body.tools, user, profile)
    }
    
    // Modo antigo: adicionar uma ferramenta única
    const {
      tool_id,
      position,
      is_required = false,
      redirect_to_tool_id,
      display_name
    } = body

    // Validações
    if (!tool_id || position === undefined) {
      return NextResponse.json(
        { error: 'tool_id e position são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    // Verificar se portal pertence ao usuário
    const { data: portal, error: portalError } = await supabaseAdmin
      .from('wellness_portals')
      .select('id, user_id')
      .eq('id', portalId)
      .single()

    if (portalError || !portal) {
      return NextResponse.json(
        { error: 'Portal não encontrado' },
        { status: 404 }
      )
    }

    // 🔒 Verificar permissão
    if (portal.user_id !== user.id && !profile?.is_admin) {
      return NextResponse.json(
        { error: 'Você não tem permissão para modificar este portal' },
        { status: 403 }
      )
    }

    // Verificar se ferramenta pertence ao mesmo usuário
    const { data: tool, error: toolError } = await supabaseAdmin
      .from('user_templates')
      .select('id, user_id')
      .eq('id', tool_id)
      .single()

    if (toolError || !tool) {
      return NextResponse.json(
        { error: 'Ferramenta não encontrada' },
        { status: 404 }
      )
    }

    if (tool.user_id !== portal.user_id) {
      return NextResponse.json(
        { error: 'A ferramenta deve pertencer ao mesmo usuário do portal' },
        { status: 403 }
      )
    }

    // Verificar se já existe no portal
    const { data: existing } = await supabaseAdmin
      .from('portal_tools')
      .select('id')
      .eq('portal_id', portalId)
      .eq('tool_id', tool_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Esta ferramenta já está no portal' },
        { status: 409 }
      )
    }

    // Inserir ferramenta no portal
    const { data, error } = await supabaseAdmin
      .from('portal_tools')
      .insert({
        portal_id: portalId,
        tool_id,
        position,
        is_required,
        redirect_to_tool_id,
        display_name
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao adicionar ferramenta ao portal:', error)
      return NextResponse.json(
        { error: 'Erro ao adicionar ferramenta ao portal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { portalTool: data }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao adicionar ferramenta ao portal:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Remover ferramenta do portal
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 🔒 Verificar autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'coach-bem-estar', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    const portalId = params.id
    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('tool_id')

    if (!toolId) {
      return NextResponse.json(
        { error: 'tool_id é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    // Verificar se portal pertence ao usuário
    const { data: portal, error: portalError } = await supabaseAdmin
      .from('wellness_portals')
      .select('id, user_id')
      .eq('id', portalId)
      .single()

    if (portalError || !portal) {
      return NextResponse.json(
        { error: 'Portal não encontrado' },
        { status: 404 }
      )
    }

    // 🔒 Verificar permissão
    if (portal.user_id !== user.id && !profile?.is_admin) {
      return NextResponse.json(
        { error: 'Você não tem permissão para modificar este portal' },
        { status: 403 }
      )
    }

    // Remover ferramenta do portal
    const { error } = await supabaseAdmin
      .from('portal_tools')
      .delete()
      .eq('portal_id', portalId)
      .eq('tool_id', toolId)

    if (error) {
      console.error('Erro ao remover ferramenta do portal:', error)
      return NextResponse.json(
        { error: 'Erro ao remover ferramenta do portal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Ferramenta removida do portal com sucesso'
    })

  } catch (error: any) {
    console.error('Erro ao remover ferramenta do portal:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

/**
 * Substitui todas as ferramentas do portal por um novo conjunto
 */
async function replaceAllPortalTools(
  portalId: string,
  tools: Array<{ tool_id: string; position: number; is_required?: boolean }>,
  user: any,
  profile: any
) {
  // Verificar se supabaseAdmin está configurado
  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Configuração do servidor incompleta. Contate o suporte.' },
      { status: 500 }
    )
  }

  // Verificar se portal pertence ao usuário
  const { data: portal, error: portalError } = await supabaseAdmin
    .from('wellness_portals')
    .select('id, user_id')
    .eq('id', portalId)
    .single()

  if (portalError || !portal) {
    return NextResponse.json(
      { error: 'Portal não encontrado' },
      { status: 404 }
    )
  }

  // 🔒 Verificar permissão
  if (portal.user_id !== user.id && !profile?.is_admin) {
    return NextResponse.json(
      { error: 'Você não tem permissão para modificar este portal' },
      { status: 403 }
    )
  }

  // Validar todas as ferramentas antes de fazer qualquer alteração
  const toolIds = tools.map(t => t.tool_id)
  const { data: existingTools, error: toolsError } = await supabaseAdmin
    .from('user_templates')
    .select('id, user_id, status')
    .in('id', toolIds)

  if (toolsError) {
    console.error('Erro ao validar ferramentas:', toolsError)
    return NextResponse.json(
      { error: 'Erro ao validar ferramentas' },
      { status: 500 }
    )
  }

  // Verificar se todas as ferramentas existem e pertencem ao usuário
  const existingToolIds = new Set(existingTools?.map((t: any) => t.id) || [])
  const missingTools = toolIds.filter(id => !existingToolIds.has(id))
  
  if (missingTools.length > 0) {
    console.error('Ferramentas não encontradas:', missingTools)
    return NextResponse.json(
      { error: `Ferramentas não encontradas: ${missingTools.join(', ')}` },
      { status: 404 }
    )
  }

  // Verificar se todas pertencem ao mesmo usuário
  const invalidTools = existingTools?.filter((t: any) => t.user_id !== portal.user_id) || []
  if (invalidTools.length > 0) {
    return NextResponse.json(
      { error: 'Algumas ferramentas não pertencem ao mesmo usuário do portal' },
      { status: 403 }
    )
  }

  // 🚀 Substituir todas as ferramentas: deletar antigas e inserir novas
  // Usar transação para garantir consistência
  try {
    // 1. Deletar todas as ferramentas antigas do portal
    const { error: deleteError } = await supabaseAdmin
      .from('portal_tools')
      .delete()
      .eq('portal_id', portalId)

    if (deleteError) {
      console.error('Erro ao remover ferramentas antigas:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao remover ferramentas antigas' },
        { status: 500 }
      )
    }

    // 2. Inserir novas ferramentas
    if (tools.length > 0) {
      const toolsToInsert = tools.map(t => ({
        portal_id: portalId,
        tool_id: t.tool_id,
        position: t.position,
        is_required: t.is_required || false
      }))

      const { data: insertedTools, error: insertError } = await supabaseAdmin
        .from('portal_tools')
        .insert(toolsToInsert)
        .select()

      if (insertError) {
        console.error('Erro ao inserir novas ferramentas:', insertError)
        return NextResponse.json(
          { error: 'Erro ao inserir novas ferramentas', details: insertError.message },
          { status: 500 }
        )
      }

      console.log(`✅ Portal ${portalId}: ${insertedTools?.length || 0} ferramentas substituídas com sucesso`)
      
      return NextResponse.json({
        success: true,
        data: { 
          portalTools: insertedTools,
          replaced: insertedTools?.length || 0
        }
      })
    } else {
      // Se array vazio, apenas removeu todas (portal sem ferramentas)
      return NextResponse.json({
        success: true,
        data: { 
          portalTools: [],
          replaced: 0,
          message: 'Todas as ferramentas foram removidas do portal'
        }
      })
    }
  } catch (error: any) {
    console.error('Erro ao substituir ferramentas do portal:', error)
    return NextResponse.json(
      { error: 'Erro ao substituir ferramentas do portal', details: error.message },
      { status: 500 }
    )
  }
}

