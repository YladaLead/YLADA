import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hasActiveSubscription, canBypassSubscription } from '@/lib/subscription-helpers'

// Buscar ferramenta por URL completa (user-slug/tool-slug)
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

    const ensureActiveSubscription = async (ownerId: string | null) => {
      if (!ownerId) return true
      
      // Verificar se é admin ou suporte (bypass)
      const bypass = await canBypassSubscription(ownerId)
      if (bypass) {
        console.log(`✅ Usuário ${ownerId} pode bypassar (admin/suporte)`)
        return true
      }
      
      // Verificar assinatura ativa
      return await hasActiveSubscription(ownerId, 'coach')
    }

    // Buscar ferramenta pela combinação user_slug + tool_slug
    console.log('🔍 API Coach - Buscando ferramenta:', { userSlug, toolSlug })
    
    const { data, error } = await supabaseAdmin
      .from('coach_user_templates')
      .select(`
        *,
        user_profiles!inner(user_slug, user_id, nome_completo, email, country_code)
      `)
      .eq('user_profiles.user_slug', userSlug)
      .eq('slug', toolSlug)
      .eq('profession', 'coach')
      .eq('status', 'active')
      .single()

    if (error) {
      console.error('❌ Erro ao buscar ferramenta Coach por URL:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        userSlug,
        toolSlug
      })
      
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Ferramenta não encontrada' },
          { status: 404 }
        )
      }
      
      // Se for erro de relação/join, tentar buscar sem join primeiro
      if (error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.warn('⚠️ Erro de relação detectado, tentando busca alternativa...')
        
        // Buscar primeiro o user_id pelo user_slug
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .select('user_id')
          .eq('user_slug', userSlug)
          .maybeSingle()
        
        if (profileError || !profile) {
          return NextResponse.json(
            { error: 'Usuário não encontrado' },
            { status: 404 }
          )
        }
        
        // Buscar ferramenta diretamente pelo user_id e slug
        const { data: toolData, error: toolError } = await supabaseAdmin
          .from('coach_user_templates')
          .select('*')
          .eq('user_id', profile.user_id)
          .eq('slug', toolSlug)
          .eq('profession', 'coach')
          .eq('status', 'active')
          .single()
        
        if (toolError) {
          if (toolError.code === 'PGRST116') {
            return NextResponse.json(
              { error: 'Ferramenta não encontrada' },
              { status: 404 }
            )
          }
          throw toolError
        }
        
        // Bloquear se assinatura venceu
        const ownerId = toolData?.user_id || profile.user_id
        console.log('🔍 API Coach - Verificando assinatura (fallback):', { ownerId, tool_id: toolData?.id })
        
        const subscriptionOk = await ensureActiveSubscription(ownerId)
        console.log('🔍 API Coach - Resultado verificação assinatura (fallback):', { subscriptionOk, ownerId })
        
        if (!subscriptionOk) {
          console.warn('⚠️ API Coach - Assinatura não ativa ou expirada (fallback):', { ownerId, tool_id: toolData?.id })
          return NextResponse.json(
            { error: 'link_indisponivel', message: 'Assinatura expirada' },
            { status: 403 }
          )
        }

        // Buscar perfil separadamente e adicionar aos dados
        const { data: userProfile } = await supabaseAdmin
          .from('user_profiles')
          .select('user_slug, user_id, nome_completo, email, country_code')
          .eq('user_id', profile.user_id)
          .maybeSingle()
        
        // Debug: verificar se country_code está sendo retornado
        console.log('🔍 API Coach - Ferramenta retornada (fallback):', {
          tool_id: toolData.id,
          whatsapp_number: toolData.whatsapp_number,
          country_code: userProfile?.country_code,
          user_profiles: userProfile
        })
        
        return NextResponse.json({ 
          tool: {
            ...toolData,
            user_profiles: userProfile
          }
        })
      }
      
      throw error
    }

    const ownerId = data.user_profiles?.user_id || data.user_id
    console.log('🔍 API Coach - Verificando assinatura:', { ownerId, tool_id: data.id })
    
    const subscriptionOk = await ensureActiveSubscription(ownerId)
    console.log('🔍 API Coach - Resultado verificação assinatura:', { subscriptionOk, ownerId })

    if (!subscriptionOk) {
      console.warn('⚠️ API Coach - Assinatura não ativa ou expirada:', { ownerId, tool_id: data.id })
      return NextResponse.json(
        { error: 'link_indisponivel', message: 'Assinatura expirada' },
        { status: 403 }
      )
    }

    // Debug: verificar se country_code está sendo retornado
    console.log('🔍 API Coach - Ferramenta retornada:', {
      tool_id: data.id,
      whatsapp_number: data.whatsapp_number,
      country_code: data.user_profiles?.country_code,
      user_profiles: data.user_profiles
    })

    return NextResponse.json({ tool: data })
  } catch (error: any) {
    console.error('Erro ao buscar ferramenta Nutri por URL:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao buscar ferramenta' },
      { status: 500 }
    )
  }
}



