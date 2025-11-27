import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hasActiveSubscription } from '@/lib/subscription-helpers'
import { normalizeSlug } from '@/lib/slug-utils'

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

    // Normalizar slug automaticamente
    const normalizedSlug = normalizeSlug(slug)
    console.log('🔍 Buscando portal Coach por slug:', { original: slug, normalized: normalizedSlug })

    // Buscar portal ativo (público) com profession='coach'
    // Usar ILIKE para busca case-insensitive e tentar tanto slug original quanto normalizado
    let { data: portal, error: portalError } = await supabaseAdmin
      .from('coach_portals')
      .select('*')
      .or(`slug.ilike.${slug},slug.ilike.${normalizedSlug}`)
      .maybeSingle()
    
    // Se não encontrou, tentar busca exata também
    if (!portal && !portalError) {
      const { data: portalExact } = await supabaseAdmin
        .from('coach_portals')
        .select('*')
        .eq('slug', normalizedSlug)
        .maybeSingle()
      
      if (portalExact) {
        portal = portalExact
      }
    }

    console.log('📊 Resultado da busca:', { 
      encontrado: !!portal, 
      error: portalError?.message,
      status: portal?.status,
      profession: portal?.profession
    })

    // Se encontrou mas não está ativo ou não tem profession='coach'
    if (portal) {
      if (portal.status !== 'active') {
        console.warn('⚠️ Portal encontrado mas inativo:', { slug, status: portal.status })
        return NextResponse.json(
          { error: 'Portal não encontrado ou inativo' },
          { status: 404 }
        )
      }
      
      if (portal.profession !== 'coach') {
        console.warn('⚠️ Portal encontrado mas profession incorreto:', { 
          slug, 
          profession: portal.profession,
          esperado: 'coach'
        })
        // Continuar mesmo assim, pode ser um portal antigo
      }
    } else if (!portalError) {
      // Se não encontrou em coach_portals, tentar em wellness_portals (caso tenha sido criado na área errada)
      const { data: wellnessPortal, error: wellnessError } = await supabaseAdmin
        .from('wellness_portals')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'active')
        .maybeSingle()
      
      if (wellnessPortal) {
        console.warn('⚠️ Portal encontrado em wellness_portals mas acessado via rota Coach:', {
          slug,
          portal_id: wellnessPortal.id,
          user_id: wellnessPortal.user_id
        })
        
        return NextResponse.json(
          { 
            error: 'Portal não encontrado na área Coach. Este portal está na área Wellness.',
            suggestion: `Acesse via: /pt/wellness/portal/${slug} ou /pt/wellness/[user-slug]/portal/${slug}`
          },
          { status: 404 }
        )
      }
    }

    if (portalError) {
      console.error('❌ Erro ao buscar portal:', { slug, error: portalError })
      return NextResponse.json(
        { error: 'Erro ao buscar portal' },
        { status: 500 }
      )
    }

    if (!portal) {
      console.error('❌ Portal não encontrado:', { slug })
      return NextResponse.json(
        { error: 'Portal não encontrado ou inativo' },
        { status: 404 }
      )
    }

    const subscriptionActive = await hasActiveSubscription(portal.user_id, 'coach')
    if (!subscriptionActive) {
      return NextResponse.json(
        { error: 'link_indisponivel', message: 'Assinatura expirada' },
        { status: 403 }
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



