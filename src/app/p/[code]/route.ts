import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { hasActiveSubscription } from '@/lib/subscription-helpers'

const redirectToLinkUnavailable = (request: NextRequest) => {
  return NextResponse.redirect(new URL('/link-indisponivel', request.url), 307)
}

// GET - Redirecionar código curto para URL completa
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params

    if (!code || code.length === 0) {
      return NextResponse.json(
        { error: 'Código inválido' },
        { status: 400 }
      )
    }

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    // Normalizar código para lowercase (case-insensitive)
    const normalizedCode = code.toLowerCase().trim()
    console.log('🔍 Buscando código curto:', normalizedCode)

    const ensureSubscription = async (userId: string | null, area: 'wellness' | 'nutri' | 'coach' | 'nutra' | null) => {
      if (!userId || !area) return true
      return await hasActiveSubscription(userId, area)
    }

    // Buscar em todas as tabelas: user_templates, quizzes, wellness_portals, coach_user_templates, coach_portals
    const [toolResult, quizResult, portalResult, coachToolResult, coachPortalResult] = await Promise.all([
      supabaseAdmin
        .from('user_templates')
        .select('id, slug, status, user_id, profession')
        .ilike('short_code', normalizedCode)
        .eq('status', 'active')
        .maybeSingle(),
      supabaseAdmin
        .from('quizzes')
        .select('id, slug, status, user_id, profession')
        .ilike('short_code', normalizedCode)
        .eq('status', 'active')
        .maybeSingle(),
      supabaseAdmin
        .from('wellness_portals')
        .select('id, slug, status, user_id, area')
        .ilike('short_code', normalizedCode)
        .eq('status', 'active')
        .maybeSingle(),
      supabaseAdmin
        .from('coach_user_templates')
        .select('id, slug, status, user_id, profession')
        .ilike('short_code', normalizedCode)
        .eq('status', 'active')
        .maybeSingle(),
      supabaseAdmin
        .from('coach_portals')
        .select('id, slug, status, user_id, profession')
        .ilike('short_code', normalizedCode)
        .eq('status', 'active')
        .maybeSingle(),
    ])

    let redirectUrl = ''
    let userSlug = null

    // Verificar qual tipo foi encontrado
    if (toolResult.data) {
      const tool = toolResult.data
      console.log('✅ Ferramenta encontrada:', { id: tool.id, slug: tool.slug, profession: tool.profession })

      const toolArea = (tool.profession as 'wellness' | 'nutri' | 'coach' | 'nutra' | null) || 'wellness'
      const subscriptionOk = await ensureSubscription(tool.user_id, toolArea)
      if (!subscriptionOk) {
        console.warn('🚫 Assinatura inativa para ferramenta', { toolId: tool.id })
        return redirectToLinkUnavailable(request)
      }

      // Buscar user_slug
      if (tool.user_id) {
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('user_slug')
          .eq('user_id', tool.user_id)
          .maybeSingle()
        
        userSlug = profile?.user_slug || null
        console.log('👤 User slug encontrado:', userSlug)
      }

      // Construir URL completa baseada na profissão
      if (tool.profession === 'wellness' && userSlug) {
        redirectUrl = `/pt/wellness/${userSlug}/${tool.slug}`
      } else if (tool.profession === 'nutri' && userSlug) {
        redirectUrl = `/pt/nutri/${userSlug}/${tool.slug}`
      } else if (tool.profession === 'coach' && userSlug) {
        redirectUrl = `/pt/c/${userSlug}/${tool.slug}`
      } else {
        redirectUrl = `/pt/wellness/ferramenta/${tool.id}`
      }
    } else if (quizResult.data) {
      const quiz = quizResult.data
      console.log('✅ Quiz encontrado:', { id: quiz.id, slug: quiz.slug })

      // Buscar user_slug
      if (quiz.user_id) {
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('user_slug')
          .eq('user_id', quiz.user_id)
          .maybeSingle()
        
        userSlug = profile?.user_slug || null
        console.log('👤 User slug encontrado:', userSlug)
      }

      const quizArea = (quiz.profession as 'wellness' | 'nutri' | 'coach' | 'nutra' | null) || 'wellness'
      const subscriptionOk = await ensureSubscription(quiz.user_id, quizArea)
      if (!subscriptionOk) {
        console.warn('🚫 Assinatura inativa para quiz', { quizId: quiz.id })
        return redirectToLinkUnavailable(request)
      }

      // Construir URL do quiz baseada na profissão
      if (quiz.profession === 'wellness' && userSlug) {
        redirectUrl = `/pt/wellness/${userSlug}/quiz/${quiz.slug}`
      } else if (quiz.profession === 'nutri' && userSlug) {
        redirectUrl = `/pt/nutri/${userSlug}/quiz/${quiz.slug}`
      } else if (quiz.profession === 'coach' && userSlug) {
        redirectUrl = `/pt/c/${userSlug}/quiz/${quiz.slug}`
      } else if (userSlug) {
        redirectUrl = `/pt/wellness/${userSlug}/quiz/${quiz.slug}`
      } else {
        redirectUrl = `/pt/wellness/quiz/${quiz.slug}`
      }
    } else if (portalResult.data) {
      const portal = portalResult.data
      console.log('✅ Portal encontrado:', { id: portal.id, slug: portal.slug })

      // Buscar user_slug
      if (portal.user_id) {
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('user_slug')
          .eq('user_id', portal.user_id)
          .maybeSingle()
        
        userSlug = profile?.user_slug || null
        console.log('👤 User slug encontrado:', userSlug)
      }

      const portalArea = (portal.area as 'wellness' | 'nutri' | 'coach' | 'nutra' | null) || 'wellness'
      const subscriptionOk = await ensureSubscription(portal.user_id, portalArea)
      if (!subscriptionOk) {
        console.warn('🚫 Assinatura inativa para portal', { portalId: portal.id })
        return redirectToLinkUnavailable(request)
      }

      // Construir URL do portal baseada na área
      if (portal.area === 'wellness' && userSlug) {
        redirectUrl = `/pt/wellness/${userSlug}/portal/${portal.slug}`
      } else if (portal.area === 'nutri' && userSlug) {
        redirectUrl = `/pt/nutri/portal/${portal.slug}`
      } else if (portal.area === 'coach' && userSlug) {
        redirectUrl = `/pt/c/portal/${portal.slug}`
      } else if (userSlug) {
        redirectUrl = `/pt/wellness/${userSlug}/portal/${portal.slug}`
      } else {
        redirectUrl = `/pt/wellness/portal/${portal.slug}`
      }
    } else if (coachToolResult.data) {
      const tool = coachToolResult.data
      console.log('✅ Ferramenta Coach encontrada:', { id: tool.id, slug: tool.slug, profession: tool.profession })

      const toolArea = (tool.profession as 'wellness' | 'nutri' | 'coach' | 'nutra' | null) || 'coach'
      const subscriptionOk = await ensureSubscription(tool.user_id, toolArea)
      if (!subscriptionOk) {
        console.warn('🚫 Assinatura inativa para ferramenta Coach', { toolId: tool.id })
        return redirectToLinkUnavailable(request)
      }

      // Buscar user_slug
      if (tool.user_id) {
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('user_slug')
          .eq('user_id', tool.user_id)
          .maybeSingle()
        
        userSlug = profile?.user_slug || null
        console.log('👤 User slug encontrado:', userSlug)
      }

      // Construir URL completa para Coach
      if (userSlug) {
        redirectUrl = `/pt/c/${userSlug}/${tool.slug}`
      } else {
        redirectUrl = `/pt/c/ferramenta/${tool.id}`
      }
    } else if (coachPortalResult.data) {
      const portal = coachPortalResult.data
      console.log('✅ Portal Coach encontrado:', { id: portal.id, slug: portal.slug })

      // Buscar user_slug
      if (portal.user_id) {
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('user_slug')
          .eq('user_id', portal.user_id)
          .maybeSingle()
        
        userSlug = profile?.user_slug || null
        console.log('👤 User slug encontrado:', userSlug)
      }

      const portalArea = (portal.profession as 'wellness' | 'nutri' | 'coach' | 'nutra' | null) || 'coach'
      const subscriptionOk = await ensureSubscription(portal.user_id, portalArea)
      if (!subscriptionOk) {
        console.warn('🚫 Assinatura inativa para portal Coach', { portalId: portal.id })
        return redirectToLinkUnavailable(request)
      }

      // Construir URL do portal Coach
      redirectUrl = `/pt/c/portal/${portal.slug}`
    } else {
      console.error('❌ Nenhum item encontrado para código:', normalizedCode)
      return NextResponse.json(
        { error: 'Link não encontrado ou inativo' },
        { status: 404 }
      )
    }

    console.log('🔄 Redirecionando para:', redirectUrl)

    // Redirecionar para URL completa
    return NextResponse.redirect(new URL(redirectUrl, request.url), 302)

  } catch (error: any) {
    console.error('Erro ao redirecionar código curto:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

