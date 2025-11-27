import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

// GET - Listar ferramentas de um portal Coach
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔒 Verificar autenticação
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    const { id: portalId } = await params

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    // Verificar se portal pertence ao usuário
    const { data: portal, error: portalError } = await supabaseAdmin
      .from('coach_portals')
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
      .from('coach_portal_tools')
      .select(`
        *,
        tool:coach_user_templates!tool_id (
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
      console.error('Erro ao buscar ferramentas do portal Coach:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar ferramentas do portal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        tools: (tools || []).map((pt: any) => ({
          id: pt.id,
          tool_id: pt.tool_id,
          position: pt.position,
          is_required: pt.is_required,
          display_name: pt.display_name,
          redirect_to_tool_id: pt.redirect_to_tool_id,
          tool: pt.tool || null
        }))
      }
    })

  } catch (error: any) {
    console.error('Erro ao listar ferramentas do portal Coach:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Adicionar/Atualizar ferramentas do portal (aceita array ou objeto único)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔒 Verificar autenticação
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    const { id: portalId } = await params
    const body = await request.json()

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    // Verificar se portal pertence ao usuário
    const { data: portal, error: portalError } = await supabaseAdmin
      .from('coach_portals')
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
        { error: 'Você não tem permissão para editar este portal' },
        { status: 403 }
      )
    }

    // Se body.tools existe, é um array de ferramentas (atualização em lote)
    if (body.tools && Array.isArray(body.tools)) {
      // Primeiro, remover todas as ferramentas existentes
      await supabaseAdmin
        .from('coach_portal_tools')
        .delete()
        .eq('portal_id', portalId)

      // Depois, inserir as novas ferramentas
      if (body.tools.length > 0) {
        const toolsToInsert = body.tools.map((tool: any, index: number) => ({
          portal_id: portalId,
          tool_id: tool.tool_id || tool.id,
          position: tool.position || index + 1,
          is_required: tool.is_required || false,
          display_name: tool.display_name || null,
          redirect_to_tool_id: tool.redirect_to_tool_id || null
        }))

        const { data, error } = await supabaseAdmin
          .from('coach_portal_tools')
          .insert(toolsToInsert)
          .select()

        if (error) {
          console.error('Erro ao atualizar ferramentas do portal Coach:', error)
          return NextResponse.json(
            { error: 'Erro ao atualizar ferramentas do portal' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          data: { tools: data }
        })
      } else {
        return NextResponse.json({
          success: true,
          data: { tools: [] }
        })
      }
    } else {
      // Comportamento antigo: inserir uma única ferramenta
      const { tool_id, position, is_required, display_name, redirect_to_tool_id } = body

      const { data, error } = await supabaseAdmin
        .from('coach_portal_tools')
        .insert({
          portal_id: portalId,
          tool_id,
          position: position || 0,
          is_required: is_required || false,
          display_name: display_name || null,
          redirect_to_tool_id: redirect_to_tool_id || null
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao adicionar ferramenta ao portal Coach:', error)
        return NextResponse.json(
          { error: 'Erro ao adicionar ferramenta ao portal' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: { tool: data }
      }, { status: 201 })
    }

  } catch (error: any) {
    console.error('Erro ao adicionar ferramenta ao portal Coach:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE - Remover ferramenta do portal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔒 Verificar autenticação
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    const { id: portalId } = await params
    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('toolId')

    if (!toolId) {
      return NextResponse.json(
        { error: 'ID da ferramenta não fornecido' },
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
      .from('coach_portals')
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
        { error: 'Você não tem permissão para editar este portal' },
        { status: 403 }
      )
    }

    // Remover ferramenta do portal
    const { error } = await supabaseAdmin
      .from('coach_portal_tools')
      .delete()
      .eq('portal_id', portalId)
      .eq('tool_id', toolId)

    if (error) {
      console.error('Erro ao remover ferramenta do portal Coach:', error)
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
    console.error('Erro ao remover ferramenta do portal Coach:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

