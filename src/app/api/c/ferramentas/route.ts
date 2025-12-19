import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { translateError } from '@/lib/error-messages'

// GET - Listar ferramentas do usuário ou buscar por ID (rota unificada /api/c/ferramentas)
// Esta é a rota correta que usa apenas "c" em vez de "coach"
export async function GET(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação e perfil coach
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult // Retorna erro de autenticação
    }
    const { user, profile: authProfile } = authResult

    const { searchParams } = new URL(request.url)
    const toolId = searchParams.get('id')
    const profession = searchParams.get('profession') || 'coach'

    // 🔒 Usar user_id do token (seguro), não do parâmetro
    const authenticatedUserId = user.id

    if (toolId) {
      // Buscar ferramenta específica (só se pertencer ao usuário ou for admin)
      const { data: toolData, error } = await supabaseAdmin
        .from('coach_user_templates')
        .select('id, title, template_slug, slug, status, views, leads_count, conversions_count, created_at, updated_at, user_id, profession, content, short_code, description, emoji, custom_colors, cta_type, whatsapp_number, external_url, cta_button_text, custom_whatsapp_message, show_whatsapp_button')
        .eq('id', toolId)
        .eq('profession', profession)
        .eq('user_id', authenticatedUserId) // 🔒 Garantir que pertence ao usuário
        .single()

      if (error) throw error

      if (!toolData) {
        return NextResponse.json(
          { error: 'Ferramenta não encontrada ou você não tem permissão para acessá-la' },
          { status: 404 }
        )
      }

      // Buscar user_slug separadamente (pode não existir)
      const { data: userProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('user_slug')
        .eq('user_id', authenticatedUserId)
        .maybeSingle()

      // Buscar dados do usuário
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(authenticatedUserId)

      // Montar resposta completa
      const data = {
        ...toolData,
        user_profiles: userProfile ? { user_slug: userProfile.user_slug } : null,
        users: userData?.user ? {
          name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || '',
          email: userData.user.email || ''
        } : null
      }

      return NextResponse.json({ tool: data })
    }

    // Listar ferramentas do usuário autenticado
    const { data: toolsData, error } = await supabaseAdmin
      .from('coach_user_templates')
      .select('id, title, template_slug, slug, status, views, leads_count, conversions_count, created_at, updated_at, user_id, profession, short_code, description, emoji, custom_colors, cta_type, whatsapp_number, external_url, cta_button_text, custom_whatsapp_message, show_whatsapp_button')
      .eq('user_id', authenticatedUserId) // 🔒 Sempre usar user_id do token
      .eq('profession', profession)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Buscar quizzes personalizados do usuário
    const { data: quizzesData, error: quizzesError } = await supabaseAdmin
      .from('quizzes')
      .select('id, titulo, descricao, emoji, slug, status, views, leads_count, cores, created_at, updated_at, user_id')
      .eq('user_id', authenticatedUserId)
      .eq('profession', profession) // Filtrar por profession
      .eq('status', 'active') // Apenas quizzes ativos
      .order('created_at', { ascending: false })

    if (quizzesError) {
      console.error('Erro ao buscar quizzes:', quizzesError)
      // Não falhar se houver erro, apenas logar
    }

    // Buscar user_slug uma vez para todas as ferramentas (pode não existir)
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('user_slug')
      .eq('user_id', authenticatedUserId)
      .maybeSingle()

    // Buscar dados do usuário
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(authenticatedUserId)

    // Montar resposta completa para cada ferramenta
    const toolsFormatted = (toolsData || []).map(tool => ({
      ...tool,
      user_profiles: userProfile ? { user_slug: userProfile.user_slug } : null,
      users: userData?.user ? {
        name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || '',
        email: userData.user.email || ''
      } : null
    }))

    // Formatar quizzes como ferramentas para exibição
    const quizzesFormatted = (quizzesData || []).map(quiz => ({
      id: quiz.id,
      title: quiz.titulo,
      description: quiz.descricao,
      emoji: quiz.emoji,
      slug: quiz.slug,
      status: quiz.status,
      views: quiz.views || 0,
      leads_count: quiz.leads_count || 0,
      created_at: quiz.created_at,
      updated_at: quiz.updated_at,
      custom_colors: quiz.cores || { primaria: '#3B82F6', secundaria: '#1E40AF' },
      template_slug: 'quiz-personalizado', // Identificador para quizzes personalizados
      profession: profession,
      user_profiles: userProfile ? { user_slug: userProfile.user_slug } : null,
      users: userData?.user ? {
        name: userData.user.user_metadata?.full_name || userData.user.email?.split('@')[0] || '',
        email: userData.user.email || ''
      } : null,
      is_quiz: true // Flag para identificar que é um quiz personalizado
    }))

    // Combinar ferramentas e quizzes, ordenando por data de criação
    const allTools = [...toolsFormatted, ...quizzesFormatted].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return dateB - dateA // Mais recentes primeiro
    })

    return NextResponse.json({ tools: allTools })
  } catch (error: any) {
    console.error('❌ Erro técnico ao buscar ferramentas:', {
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











