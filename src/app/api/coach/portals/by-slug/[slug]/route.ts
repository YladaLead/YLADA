import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// GET - Buscar portal público por slug (sem autenticação necessária)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    // Buscar portal ativo (público) com profession='coach'
    const { data: portal, error: portalError } = await supabaseAdmin
      .from('coach_portals')
      .select('*')
      .eq('slug', slug)
      .eq('profession', 'coach')
      .eq('status', 'active')
      .single()

    if (portalError || !portal) {
      return NextResponse.json(
        { error: 'Portal não encontrado ou inativo' },
        { status: 404 }
      )
    }

    // Buscar ferramentas do portal ordenadas por posição
    // Primeiro buscar portal_tools sem join complexo
    const { data: portalTools, error: toolsError } = await supabaseAdmin
      .from('coach_portal_tools')
      .select('*')
      .eq('portal_id', portal.id)
      .order('position', { ascending: true })

    if (toolsError) {
      console.error('Erro ao buscar ferramentas do portal Nutri:', toolsError)
      return NextResponse.json(
        { error: 'Erro ao buscar ferramentas do portal' },
        { status: 500 }
      )
    }

    // Buscar detalhes das ferramentas e perfis separadamente
    const toolsWithDetails = await Promise.all(
      (portalTools || []).map(async (pt: any) => {
        // Buscar template da ferramenta
        const { data: tool, error: toolError } = await supabaseAdmin
          .from('coach_user_templates')
          .select('id, title, slug, description, emoji, template_slug, custom_colors, user_id, status')
          .eq('id', pt.tool_id)
          .maybeSingle()

        // 🚀 CORREÇÃO: Log quando ferramenta não é encontrada
        if (toolError || !tool) {
          console.warn(`⚠️ Ferramenta não encontrada no portal Nutri:`, {
            portal_id: portal.id,
            portal_slug: portal.slug,
            tool_id: pt.tool_id,
            portal_tool_id: pt.id,
            error: toolError?.message
          })
          return {
            ...pt,
            user_templates: null // coach_user_templates
          }
        }

        // 🚀 CORREÇÃO: Verificar se ferramenta está ativa (não mostrar inativas)
        if (tool.status && tool.status !== 'active' && tool.status !== 'published') {
          console.warn(`⚠️ Ferramenta inativa no portal Nutri:`, {
            portal_id: portal.id,
            tool_id: pt.tool_id,
            tool_title: tool.title,
            tool_status: tool.status
          })
          // Retornar null para que seja filtrada depois
          return {
            ...pt,
            user_templates: null // coach_user_templates
          }
        }

        // Buscar perfil do usuário para obter user_slug
        let userSlug = null
        if (tool?.user_id) {
          const { data: profile } = await supabaseAdmin
            .from('user_profiles')
            .select('user_slug')
            .eq('user_id', tool.user_id)
            .maybeSingle()
          userSlug = profile?.user_slug || null
        }

        return {
          ...pt,
          user_templates: tool ? {
            ...tool,
            user_profiles: userSlug ? { user_slug: userSlug } : null
          } : null
        }
      })
    )

    // Incrementar views do portal
    await supabaseAdmin
      .from('coach_portals')
      .update({ views: (portal.views || 0) + 1 })
      .eq('id', portal.id)

    // Preparar dados do portal com ferramentas
    const portalData = {
      ...portal,
      tools: toolsWithDetails.map((pt: any) => ({
        id: pt.id,
        tool_id: pt.tool_id,
        position: pt.position,
        is_required: pt.is_required,
        redirect_to_tool_id: pt.redirect_to_tool_id,
        tool: pt.user_templates ? {
          id: pt.user_templates.id,
          title: pt.user_templates.title,
          slug: pt.user_templates.slug,
          template_slug: pt.user_templates.template_slug,
          emoji: pt.user_templates.emoji || '🔧',
          description: pt.user_templates.description || '',
          custom_colors: pt.user_templates.custom_colors,
          user_profiles: pt.user_templates.user_profiles ? {
            user_slug: pt.user_templates.user_profiles.user_slug
          } : null
        } : null
      })).filter((t: any) => t.tool !== null) // Remover ferramentas que não foram encontradas
    }

    return NextResponse.json({
      success: true,
      data: { portal: portalData }
    })

  } catch (error: any) {
    console.error('Erro ao buscar portal Nutri por slug:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}



