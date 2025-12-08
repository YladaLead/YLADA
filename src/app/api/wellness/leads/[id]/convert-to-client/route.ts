import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST - Converter lead do NOEL em cliente
 * 
 * Body:
 * - status: string (padrão: 'ativo')
 * - additional_data: object (opcional) - dados adicionais para completar o cliente
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
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

    const { id: leadId } = await params
    const authenticatedUserId = user.id

    const body = await request.json()
    const { status: statusManual = 'ativo', additional_data } = body

    // Buscar o lead
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('noel_leads')
      .select('*')
      .eq('id', leadId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (leadError || !lead) {
      return NextResponse.json(
        { error: 'Lead não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se já existe cliente com este lead_id
    const { data: existingClient } = await supabaseAdmin
      .from('noel_clients')
      .select('id')
      .eq('lead_id', leadId)
      .eq('user_id', authenticatedUserId)
      .maybeSingle()

    if (existingClient) {
      return NextResponse.json(
        { error: 'Este lead já foi convertido em cliente', client_id: existingClient.id },
        { status: 400 }
      )
    }

    // Preparar dados do cliente
    const clientData: any = {
      user_id: authenticatedUserId,
      lead_id: leadId,
      client_name: lead.lead_name || 'Cliente sem nome',
      client_phone: lead.lead_phone || null,
      client_email: lead.lead_email || null,
      status: statusManual, // 'ativo', 'inativo', 'pausado'
      kits_vendidos: 0,
      upgrade_detox: false,
      rotina_mensal: false,
      last_follow_up_at: lead.last_contact_at || new Date().toISOString(),
      next_follow_up_at: null,
    }

    // Adicionar dados adicionais se fornecidos
    if (additional_data) {
      if (additional_data.kits_vendidos) {
        clientData.kits_vendidos = additional_data.kits_vendidos
      }
      if (additional_data.upgrade_detox !== undefined) {
        clientData.upgrade_detox = additional_data.upgrade_detox
      }
      if (additional_data.rotina_mensal !== undefined) {
        clientData.rotina_mensal = additional_data.rotina_mensal
      }
      if (additional_data.next_follow_up_at) {
        clientData.next_follow_up_at = additional_data.next_follow_up_at
      }
    }

    // Criar cliente
    const { data: client, error: clientError } = await supabaseAdmin
      .from('noel_clients')
      .insert(clientData)
      .select()
      .single()

    if (clientError) {
      console.error('❌ Erro ao criar cliente:', clientError)
      return NextResponse.json(
        { error: 'Erro ao converter lead em cliente' },
        { status: 500 }
      )
    }

    // Atualizar status do lead para 'cliente'
    await supabaseAdmin
      .from('noel_leads')
      .update({ status: 'cliente' })
      .eq('id', leadId)
      .eq('user_id', authenticatedUserId)

    return NextResponse.json({
      success: true,
      data: {
        client,
        message: 'Lead convertido em cliente com sucesso!'
      }
    })

  } catch (error: any) {
    console.error('❌ Erro ao converter lead em cliente:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
