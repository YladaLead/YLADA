import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

// Verificar disponibilidade de slug
export async function GET(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação para obter user_id
    const authResult = await requireApiAuth(request, ['wellness', 'coach-bem-estar', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const excludeId = searchParams.get('excludeId') // Para edição

    if (!slug) {
      return NextResponse.json(
        { error: 'slug é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o slug conflita com o user_slug do próprio usuário
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('user_slug')
      .eq('user_id', user.id)
      .maybeSingle()

    if (userProfile?.user_slug && userProfile.user_slug.toLowerCase() === slug.toLowerCase()) {
      return NextResponse.json({
        slug,
        available: false,
        message: 'Este nome não pode ser usado porque é igual ao seu nome de usuário na URL. Escolha outro nome.'
      })
    }

    // Verificar se já existe PARA ESTE USUÁRIO (slugs podem ser repetidos entre usuários diferentes)
    let query = supabaseAdmin
      .from('user_templates')
      .select('id, slug')
      .eq('slug', slug)
      .eq('user_id', user.id) // ✅ Verificar apenas para o usuário atual
    
    // Se excludeId foi fornecido, excluir esse ID da verificação (útil para edição)
    if (excludeId) {
      query = query.neq('id', excludeId)
    }
    
    const { data, error } = await query.maybeSingle()

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned (é o que queremos)
      throw error
    }

    const available = !data

    // 🚀 MELHORIA: Mensagem mais clara explicando que a URL final inclui o user_slug
    return NextResponse.json({
      slug,
      available,
      message: available 
        ? 'Nome disponível! A URL final será única com seu nome de usuário.' 
        : 'Este nome já está em uso por você. Escolha outro. (Outras pessoas podem usar o mesmo nome porque a URL final inclui o nome único de cada usuário)'
    })
  } catch (error: any) {
    console.error('Erro ao verificar slug:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao verificar slug' },
      { status: 500 }
    )
  }
}


