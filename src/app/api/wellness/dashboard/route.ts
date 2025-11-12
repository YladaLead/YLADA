import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { translateError } from '@/lib/error-messages'

// GET - Buscar dados do dashboard (perfil + ferramentas + estatísticas)
// Otimizado para reduzir chamadas de API e melhorar performance
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const authenticatedUserId = user.id
    const startTime = Date.now()

    // Buscar perfil e ferramentas em paralelo (otimização)
    const [profileResult, toolsResult] = await Promise.all([
      // Buscar perfil
      supabaseAdmin
        .from('user_profiles')
        .select('nome_completo, email, whatsapp, bio, user_slug, country_code')
        .eq('user_id', authenticatedUserId)
        .maybeSingle(),
      
      // Buscar ferramentas (limitado a 5 para dashboard + todas para estatísticas)
      supabaseAdmin
        .from('user_templates')
        .select('id, title, template_slug, status, views, leads_count, conversions_count, created_at')
        .eq('user_id', authenticatedUserId)
        .eq('profession', 'wellness')
        .order('created_at', { ascending: false })
    ])

    const profile = profileResult.data
    const tools = toolsResult.data || []

    // Buscar email do auth apenas se necessário (evitar query pesada quando possível)
    let email = profile?.email || ''
    if (!email) {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(authenticatedUserId)
      email = authUser?.user?.email || ''
    }

    // Processar ferramentas no backend (evitar processamento pesado no frontend)
    const ferramentasAtivas = tools
      .filter((tool: any) => tool.status === 'active')
      .slice(0, 5) // Limitar a 5 para o dashboard
      .map((tool: any) => {
        // Determinar ícone e categoria baseado no tipo
        let icon = '🔗'
        let categoria = 'Outro'
        
        if (tool.template_slug?.startsWith('calc-')) {
          icon = '📊'
          categoria = 'Calculadora'
        } else if (tool.template_slug?.startsWith('quiz-')) {
          icon = '🧬'
          categoria = 'Quiz'
        } else if (tool.template_slug?.startsWith('planilha-') || tool.template_slug?.startsWith('tabela-')) {
          icon = '📋'
          categoria = 'Planilha'
        }
        
        return {
          id: tool.id,
          nome: tool.title,
          categoria,
          leads: tool.leads_count || 0,
          conversoes: tool.conversions_count || 0, // Conversões reais (quando botão CTA é clicado)
          status: tool.status === 'active' ? 'ativo' : 'inativo',
          icon
        }
      })

    // Calcular estatísticas no backend (evitar reduce no frontend)
    const activeTools = tools.filter((t: any) => t.status === 'active')
    const totalLeads = tools.reduce((acc: number, t: any) => acc + (t.leads_count || 0), 0)
    const totalViews = tools.reduce((acc: number, t: any) => acc + (t.views || 0), 0)
    const totalConversoes = tools.reduce((acc: number, t: any) => acc + (t.conversions_count || 0), 0)
    
    const stats = {
      ferramentasAtivas: activeTools.length,
      leadsGerados: totalLeads,
      conversoes: totalConversoes, // Conversões reais (quando botão CTA é clicado)
      clientesAtivos: totalConversoes // Mesmo valor (conversões = clientes que clicaram no CTA)
    }

    // Montar resposta completa
    const response = {
      success: true,
      profile: {
        nome: profile?.nome_completo || user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
        email: email,
        telefone: profile?.whatsapp || '',
        whatsapp: profile?.whatsapp || '',
        countryCode: profile?.country_code || 'BR',
        bio: profile?.bio || '',
        userSlug: profile?.user_slug || ''
      },
      ferramentas: ferramentasAtivas,
      stats
    }

    const duration = Date.now() - startTime
    console.log(`⚡ Dashboard API: ${duration}ms`)

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('❌ Erro técnico ao buscar dados do dashboard:', {
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

