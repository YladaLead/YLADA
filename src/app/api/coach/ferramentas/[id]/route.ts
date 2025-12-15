import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { translateError } from '@/lib/error-messages'

// GET - Buscar ferramenta por ID (rota dinâmica para compatibilidade)
// Esta rota aceita /api/coach/ferramentas/{id} em vez de /api/coach/ferramentas?id={id}
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 🔒 Verificar autenticação e perfil coach
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult // Retorna erro de autenticação
    }
    const { user } = authResult

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const profession = searchParams.get('profession') || 'coach'

    // 🔒 Usar user_id do token (seguro), não do parâmetro
    const authenticatedUserId = user.id

    // Buscar ferramenta específica (só se pertencer ao usuário ou for admin)
    const { data: toolData, error } = await supabaseAdmin
      .from('coach_user_templates')
      .select('id, title, template_slug, slug, status, views, leads_count, conversions_count, created_at, updated_at, user_id, profession, content, short_code, description, emoji, custom_colors, cta_type, whatsapp_number, external_url, cta_button_text, custom_whatsapp_message, show_whatsapp_button')
      .eq('id', id)
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
  } catch (error: any) {
    console.error('❌ Erro técnico ao buscar ferramenta por ID:', {
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
