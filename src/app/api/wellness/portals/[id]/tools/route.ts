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
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
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

// POST - Adicionar ferramenta ao portal
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 🔒 Verificar autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    const portalId = params.id
    const body = await request.json()
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
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
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

