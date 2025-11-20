import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST - Converter lead em cliente
 * 
 * Body:
 * - lead_id: UUID do lead a ser convertido (obrigatório)
 * - status: string (padrão: 'pre_consulta')
 * - additional_data: object (opcional) - dados adicionais para completar o cliente
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
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

    const { id: clientId } = await params
    const authenticatedUserId = user.id

    const body = await request.json()
    const { lead_id, status = 'pre_consulta', additional_data } = body

    if (!lead_id) {
      return NextResponse.json(
        { error: 'lead_id é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar o lead
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('id', lead_id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se o cliente existe e pertence ao usuário
    const { data: existingClient, error: clientError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (clientError || !existingClient) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar cliente com dados do lead
    const updateData: any = {
      converted_from_lead: true,
      lead_source: lead.additional_data?.source || lead.template_id || 'unknown',
      lead_template_id: lead.template_id || null,
      origin: lead.additional_data?.source || 'lead',
      origin_id: lead.id,
      status: status
    }

    // Se o cliente não tem nome/email/telefone, usar do lead
    if (!existingClient.name && lead.name) {
      updateData.name = lead.name
    }
    if (!existingClient.email && lead.email) {
      updateData.email = lead.email
    }
    if (!existingClient.phone && lead.phone) {
      updateData.phone = lead.phone
    }

    // Adicionar dados adicionais se fornecidos
    if (additional_data) {
      if (additional_data.birth_date) updateData.birth_date = additional_data.birth_date
      if (additional_data.gender) updateData.gender = additional_data.gender
      if (additional_data.cpf) updateData.cpf = additional_data.cpf
      if (additional_data.goal) updateData.goal = additional_data.goal
      if (additional_data.instagram) updateData.instagram = additional_data.instagram
      if (additional_data.address) {
        updateData.address_street = additional_data.address.street || null
        updateData.address_number = additional_data.address.number || null
        updateData.address_complement = additional_data.address.complement || null
        updateData.address_neighborhood = additional_data.address.neighborhood || null
        updateData.address_city = additional_data.address.city || null
        updateData.address_state = additional_data.address.state || null
        updateData.address_zipcode = additional_data.address.zipcode || null
      }
    }

    // Atualizar cliente
    const { data: updatedClient, error: updateError } = await supabaseAdmin
      .from('clients')
      .update(updateData)
      .eq('id', clientId)
      .eq('user_id', authenticatedUserId)
      .select()
      .single()

    if (updateError) {
      console.error('Erro ao converter lead:', updateError)
      return NextResponse.json(
        { error: 'Erro ao converter lead em cliente', technical: process.env.NODE_ENV === 'development' ? updateError.message : undefined },
        { status: 500 }
      )
    }

    // Criar evento no histórico
    try {
      await supabaseAdmin
        .from('client_history')
        .insert({
          client_id: clientId,
          user_id: authenticatedUserId,
          activity_type: 'lead_convertido',
          metadata: {
            lead_id: lead.id,
            lead_name: lead.name,
            lead_source: lead.template_id
          }
        })
    } catch (historyError) {
      console.warn('Aviso: Não foi possível criar evento no histórico:', historyError)
    }

    return NextResponse.json({
      success: true,
      data: { client: updatedClient },
      message: 'Lead convertido em cliente com sucesso'
    })

  } catch (error: any) {
    console.error('Erro ao converter lead:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}


