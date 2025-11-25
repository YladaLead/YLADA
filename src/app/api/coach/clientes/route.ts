import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/auth'

/**
 * GET - Listar clientes do usuário autenticado
 * 
 * Query params:
 * - id: UUID do cliente específico (opcional)
 * - search: Busca por nome, email ou telefone (opcional)
 * - status: Filtrar por status (opcional)
 * - origin: Filtrar por origem do lead (opcional)
 * - converted_from_lead: Filtrar apenas convertidos de leads (true/false) (opcional)
 * - limit: Limite de resultados (padrão: 50)
 * - offset: Offset para paginação (padrão: 0)
 * - order_by: Campo para ordenação (padrão: created_at)
 * - order: Direção da ordenação (asc/desc, padrão: desc)
 */
export async function GET(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação
    const authResult = await requireApiAuth(request)
    if (!authResult.success) {
      return NextResponse.json(
        { error: authResult.error },
        { status: authResult.status }
      )
    }

    // Verificar se supabaseAdmin está configurado
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const clientId = searchParams.get('id')
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    const origin = searchParams.get('origin')
    const convertedFromLead = searchParams.get('converted_from_lead')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')
    const orderBy = searchParams.get('order_by') || 'created_at'
    const order = searchParams.get('order') || 'desc'

    // 🔒 Sempre usar user_id do token (seguro)
    const authenticatedUserId = authResult.userId

    // Se ID foi fornecido, retornar cliente específico
    if (clientId) {
      const { data: client, error } = await supabaseAdmin
        .from('coach_clients')
        .select('id, name, email, phone, status, goal, converted_from_lead, lead_source, created_at, updated_at, next_appointment, last_appointment, tags')
        .eq('id', clientId)
        .eq('user_id', authenticatedUserId)
        .single()

      if (error || !client) {
        return NextResponse.json(
          { error: 'Cliente não encontrado' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: { client }
      })
    }

    // Construir query base
    // 🚀 OTIMIZAÇÃO: Selecionar apenas campos necessários
    let query = supabaseAdmin
      .from('coach_clients')
      .select('id, name, email, phone, status, goal, converted_from_lead, lead_source, created_at, updated_at, next_appointment, last_appointment, tags', { count: 'exact' })
      .eq('user_id', authenticatedUserId)
      .order(orderBy, { ascending: order === 'asc' })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (status) {
      query = query.eq('status', status)
    }

    if (origin) {
      query = query.eq('origin', origin)
    }

    if (convertedFromLead === 'true') {
      query = query.eq('converted_from_lead', true)
    } else if (convertedFromLead === 'false') {
      query = query.eq('converted_from_lead', false)
    }

    // Busca por nome, email ou telefone
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    const { data: clients, error, count } = await query

    if (error) {
      console.error('Erro ao buscar clientes:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar clientes', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        clients: clients || [],
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit
      }
    })

  } catch (error: any) {
    console.error('Erro ao listar clientes:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * POST - Criar novo cliente
 * 
 * Body:
 * - name: string (obrigatório)
 * - email: string (opcional)
 * - phone: string (opcional)
 * - birth_date: date (opcional)
 * - gender: string (opcional)
 * - cpf: string (opcional)
 * - address: object (opcional)
 * - status: string (padrão: 'lead')
 * - goal: string (opcional)
 * - instagram: string (opcional)
 * - origin: string (opcional) - origem do lead
 * - origin_id: UUID (opcional) - ID do lead ou template
 * - converted_from_lead: boolean (padrão: false)
 * - lead_source: string (opcional)
 * - lead_template_id: UUID (opcional)
 * - custom_fields: JSONB (opcional)
 */
export async function POST(request: NextRequest) {
  try {
    // 🔒 Verificar autenticação e perfil nutri
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

    const body = await request.json()
    const {
      name,
      email,
      phone,
      birth_date,
      gender,
      cpf,
      address,
      status = 'lead',
      goal,
      instagram,
      converted_from_lead = false,
      lead_source,
      lead_template_id,
      custom_fields
    } = body

    // Validações
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      )
    }

    // Validar status
    const validStatuses = ['lead', 'pre_consulta', 'ativa', 'pausa', 'finalizada']
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Status inválido. Use um dos seguintes: ${validStatuses.join(', ')}` },
        { status: 400 }
      )
    }

    // 🔒 Usar user_id do token (seguro)
    const authenticatedUserId = user.id

    // Preparar dados para inserção
    const clientData: any = {
      user_id: authenticatedUserId,
      name: name.trim(),
      email: email?.trim() || null,
      phone: phone?.trim() || null,
      birth_date: birth_date || null,
      gender: gender || null,
      cpf: cpf?.trim() || null,
      status: status,
      goal: goal || null,
      instagram: instagram?.trim() || null,
      converted_from_lead: converted_from_lead,
      lead_source: lead_source || null,
      lead_template_id: lead_template_id || null,
      custom_fields: custom_fields || null
    }

    // Adicionar endereço se fornecido
    if (address) {
      clientData.address_street = address.street || null
      clientData.address_number = address.number || null
      clientData.address_complement = address.complement || null
      clientData.address_neighborhood = address.neighborhood || null
      clientData.address_city = address.city || null
      clientData.address_state = address.state || null
      clientData.address_zipcode = address.zipcode || null
    }

    // Inserir cliente
    const { data: newClient, error } = await supabaseAdmin
      .from('coach_clients')
      .insert(clientData)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar cliente:', error)
      return NextResponse.json(
        { error: 'Erro ao criar cliente', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Criar evento no histórico
    try {
      await supabaseAdmin
        .from('coach_client_history')
        .insert({
          client_id: newClient.id,
          user_id: authenticatedUserId,
          activity_type: 'cliente_criado',
          metadata: {
            name: newClient.name,
            status: newClient.status
          }
        })
    } catch (historyError) {
      // Não falhar se o histórico falhar (pode ser que a tabela ainda não exista)
      console.warn('Aviso: Não foi possível criar evento no histórico:', historyError)
    }

    return NextResponse.json({
      success: true,
      data: { client: newClient }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao criar cliente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}


