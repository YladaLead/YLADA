import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Listar respostas de um formulário
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { id: formId } = await params
    const authenticatedUserId = user.id

    // Verificar se o formulário existe e pertence ao usuário
    const { data: form, error: formError } = await supabaseAdmin
      .from('custom_forms')
      .select('id, name, user_id')
      .eq('id', formId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (formError || !form) {
      return NextResponse.json(
        { error: 'Formulário não encontrado' },
        { status: 404 }
      )
    }

    // Buscar parâmetros de filtro
    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('client_id')
    const startDate = searchParams.get('start_date')
    const endDate = searchParams.get('end_date')

    // Buscar parâmetro para marcar como visualizada
    const { searchParams } = new URL(request.url)
    const markAsViewed = searchParams.get('mark_as_viewed') !== 'false' // Por padrão, marca como visualizada

    // Construir query
    let query = supabaseAdmin
      .from('form_responses')
      .select(`
        id,
        form_id,
        client_id,
        responses,
        completed_at,
        created_at,
        viewed,
        ip_address,
        user_agent,
        clients (
          id,
          name,
          email,
          phone
        )
      `)
      .eq('form_id', formId)
      .eq('user_id', authenticatedUserId)
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (clientId) {
      query = query.eq('client_id', clientId)
    }
    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data: responses, error } = await query

    if (error) {
      console.error('Erro ao buscar respostas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar respostas', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Marcar respostas como visualizadas se solicitado
    if (markAsViewed && responses && responses.length > 0) {
      const responseIds = responses.map((r: any) => r.id)
      await supabaseAdmin
        .from('form_responses')
        .update({ viewed: true })
        .eq('form_id', formId)
        .eq('user_id', authenticatedUserId)
        .in('id', responseIds)
    }

    // Buscar estatísticas
    const { count: totalCount } = await supabaseAdmin
      .from('form_responses')
      .select('*', { count: 'exact', head: true })
      .eq('form_id', formId)
      .eq('user_id', authenticatedUserId)

    const { count: withClientCount } = await supabaseAdmin
      .from('form_responses')
      .select('*', { count: 'exact', head: true })
      .eq('form_id', formId)
      .eq('user_id', authenticatedUserId)
      .not('client_id', 'is', null)

    const { count: withoutClientCount } = await supabaseAdmin
      .from('form_responses')
      .select('*', { count: 'exact', head: true })
      .eq('form_id', formId)
      .eq('user_id', authenticatedUserId)
      .is('client_id', null)

    return NextResponse.json({
      success: true,
      data: {
        responses: responses || [],
        statistics: {
          total: totalCount || 0,
          with_client: withClientCount || 0,
          without_client: withoutClientCount || 0
        }
      }
    })

  } catch (error: any) {
    console.error('Erro ao listar respostas:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

