/**
 * NOEL Function: getClientData
 * 
 * Retorna dados completos de um cliente específico
 * 
 * Schema OpenAI:
 * {
 *   "name": "getClientData",
 *   "description": "Retorna dados completos de um cliente específico.",
 *   "parameters": {
 *     "type": "object",
 *     "properties": {
 *       "client_id": { "type": "string" }
 *     },
 *     "required": ["client_id"]
 *   }
 * }
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { validateNoelFunctionAuth } from '@/lib/noel-functions-auth'

export async function POST(request: NextRequest) {
  try {
    // Validar autenticação
    const authError = validateNoelFunctionAuth(request)
    if (authError) {
      return authError
    }

    const body = await request.json()
    const { client_id } = body

    // Validação
    if (!client_id || typeof client_id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'client_id é obrigatório e deve ser uma string' },
        { status: 400 }
      )
    }

    // Buscar dados do cliente
    const { data: client, error: clientError } = await supabaseAdmin
      .from('noel_clients')
      .select('*')
      .eq('id', client_id)
      .single()

    if (clientError) {
      if (clientError.code === 'PGRST116') {
        // Cliente não encontrado
        return NextResponse.json(
          { success: false, error: 'Cliente não encontrado' },
          { status: 404 }
        )
      }

      console.error('❌ Erro ao buscar cliente:', clientError)
      return NextResponse.json(
        { success: false, error: 'Erro ao buscar dados do cliente' },
        { status: 500 }
      )
    }

    // Se não encontrou em noel_clients, tentar buscar em noel_leads
    if (!client) {
      const { data: lead, error: leadError } = await supabaseAdmin
        .from('noel_leads')
        .select('*')
        .eq('id', client_id)
        .single()

      if (leadError) {
        if (leadError.code === 'PGRST116') {
          return NextResponse.json(
            { success: false, error: 'Cliente não encontrado' },
            { status: 404 }
          )
        }

        console.error('❌ Erro ao buscar lead:', leadError)
        return NextResponse.json(
          { success: false, error: 'Erro ao buscar dados do cliente' },
          { status: 500 }
        )
      }

      // Retornar dados do lead como cliente
      return NextResponse.json({
        success: true,
        data: {
          id: lead.id,
          client_name: lead.lead_name,
          client_phone: lead.lead_phone,
          client_email: lead.lead_email,
          status: lead.status,
          kits_vendidos: 0,
          upgrade_detox: false,
          rotina_mensal: false,
          last_follow_up_at: lead.last_contact_at,
          next_follow_up_at: null,
          created_at: lead.created_at,
        },
      })
    }

    // Retornar dados do cliente
    return NextResponse.json({
      success: true,
      data: {
        id: client.id,
        client_name: client.client_name,
        client_phone: client.client_phone,
        client_email: client.client_email,
        status: client.status,
        kits_vendidos: client.kits_vendidos || 0,
        upgrade_detox: client.upgrade_detox || false,
        rotina_mensal: client.rotina_mensal || false,
        last_follow_up_at: client.last_follow_up_at,
        next_follow_up_at: client.next_follow_up_at,
        created_at: client.created_at,
        updated_at: client.updated_at,
      },
    })
  } catch (error: any) {
    console.error('❌ Erro em getClientData:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
