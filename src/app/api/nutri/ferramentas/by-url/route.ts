import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hasActiveSubscription, canBypassSubscription } from '@/lib/subscription-helpers'

// Buscar ferramenta por URL completa (user-slug/tool-slug)
// Ordem de busca:
// 1. Ferramentas personalizadas (user_templates)
// 2. Templates oficiais (templates_nutrition) - fallback
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userSlug = searchParams.get('user_slug')
    const toolSlug = searchParams.get('tool_slug')

    if (!userSlug || !toolSlug) {
      return NextResponse.json(
        { error: 'user_slug e tool_slug são obrigatórios' },
        { status: 400 }
      )
    }

    // Função para verificar assinatura
    const ensureActiveSubscription = async (ownerId: string | null, userSlug?: string | null) => {
      if (!ownerId) return true
      
      // ✅ BYPASS: Conta de demonstração "ana" na área Nutri
      if (userSlug === 'ana') {
        console.log(`✅ Usuário ${ownerId} (${userSlug}) é conta demo Nutri - bypassando verificação`)
        return true
      }
      
      // Verificar se é admin ou suporte (bypass)
      const bypass = await canBypassSubscription(ownerId)
      if (bypass) {
        console.log(`✅ Usuário ${ownerId} pode bypassar (admin/suporte)`)
        return true
      }
      
      // Verificar assinatura ativa
      return await hasActiveSubscription(ownerId, 'nutri')
    }

    // Buscar perfil do usuário primeiro
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, user_slug, nome_completo, email, country_code, whatsapp')
      .eq('user_slug', userSlug)
      .maybeSingle()

    if (profileError || !userProfile) {
      console.error('❌ Usuário não encontrado:', userSlug)
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar assinatura
    const subscriptionOk = await ensureActiveSubscription(userProfile.user_id, userSlug)
    if (!subscriptionOk) {
      return NextResponse.json(
        { error: 'link_indisponivel', message: 'Assinatura expirada' },
        { status: 403 }
      )
    }

    // 1️⃣ TENTAR BUSCAR FERRAMENTA PERSONALIZADA (user_templates)
    const { data: customTool, error: customError } = await supabaseAdmin
      .from('user_templates')
      .select('*')
      .eq('user_id', userProfile.user_id)
      .eq('slug', toolSlug)
      .eq('profession', 'nutri')
      .eq('status', 'active')
      .maybeSingle()

    if (customTool) {
      console.log('✅ Ferramenta personalizada encontrada:', {
        tool_id: customTool.id,
        slug: customTool.slug,
        user_slug: userSlug
      })

      const leaderDataCollection = customTool.content?.leader_data_collection || null

      return NextResponse.json({
        tool: {
          ...customTool,
          user_profiles: userProfile,
          leader_data_collection: leaderDataCollection,
          is_official_template: false
        }
      })
    }

    // 2️⃣ FALLBACK: BUSCAR TEMPLATE OFICIAL (templates_nutrition)
    // Os 28 templates oficiais funcionam para qualquer nutri
    const { data: officialTemplate, error: templateError } = await supabaseAdmin
      .from('templates_nutrition')
      .select('*')
      .eq('slug', toolSlug)
      .eq('profession', 'nutri')
      .eq('is_active', true)
      .eq('language', 'pt')
      .maybeSingle()

    if (officialTemplate) {
      console.log('✅ Template oficial encontrado:', {
        template_id: officialTemplate.id,
        slug: officialTemplate.slug,
        name: officialTemplate.name,
        user_slug: userSlug
      })

      // Montar objeto compatível com a estrutura esperada
      return NextResponse.json({
        tool: {
          id: officialTemplate.id,
          title: officialTemplate.name || officialTemplate.title,
          description: officialTemplate.description,
          slug: officialTemplate.slug,
          template_slug: officialTemplate.slug,
          type: officialTemplate.type,
          content: officialTemplate.content,
          custom_colors: {
            principal: '#0284c7', // sky-600
            secundaria: '#e0f2fe' // sky-100
          },
          cta_type: 'whatsapp',
          whatsapp_number: userProfile.whatsapp || null,
          cta_button_text: 'Falar com a Nutricionista',
          user_profiles: userProfile,
          is_official_template: true,
          leader_data_collection: officialTemplate.content?.leader_data_collection || null
        }
      })
    }

    // 3️⃣ NENHUMA FERRAMENTA ENCONTRADA
    console.error('❌ Ferramenta não encontrada:', {
      userSlug,
      toolSlug
    })

    return NextResponse.json(
      { error: 'Ferramenta não encontrada' },
      { status: 404 }
    )

  } catch (error: any) {
    console.error('Erro ao buscar ferramenta Nutri por URL:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar ferramenta' },
      { status: 500 }
    )
  }
}



