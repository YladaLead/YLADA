/**
 * NOEL Function: registerLead
 * 
 * Registra um novo cliente ou interessado no Supabase
 * 
 * Schema OpenAI:
 * {
 *   "name": "registerLead",
 *   "description": "Registra um novo cliente ou interessado no Supabase.",
 *   "parameters": {
 *     "type": "object",
 *     "properties": {
 *       "user_id": { "type": "string" },
 *       "lead_name": { "type": "string" },
 *       "lead_phone": { "type": "string" },
 *       "lead_source": { "type": "string" }
 *     },
 *     "required": ["user_id", "lead_name"]
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
    const { user_id, lead_name, lead_phone, lead_source } = body

    // Validação
    if (!user_id || typeof user_id !== 'string') {
      return NextResponse.json(
        { success: false, error: 'user_id é obrigatório e deve ser uma string' },
        { status: 400 }
      )
    }

    if (!lead_name || typeof lead_name !== 'string' || lead_name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'lead_name é obrigatório e deve ser uma string não vazia' },
        { status: 400 }
      )
    }

    // Validar lead_source se fornecido
    const validSources = ['indicacao', 'instagram', 'whatsapp', 'outro']
    const source = lead_source && validSources.includes(lead_source) ? lead_source : 'outro'

    // Registrar lead
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('noel_leads')
      .insert({
        user_id,
        lead_name: lead_name.trim(),
        lead_phone: lead_phone?.trim() || null,
        lead_email: null, // Pode ser adicionado depois
        lead_source: source,
        status: 'novo',
        first_contact_at: new Date().toISOString(),
        last_contact_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (leadError) {
      console.error('❌ Erro ao registrar lead:', leadError)
      return NextResponse.json(
        { success: false, error: 'Erro ao registrar lead' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        id: lead.id,
        lead_name: lead.lead_name,
        lead_phone: lead.lead_phone,
        lead_source: lead.lead_source,
        status: lead.status,
        created_at: lead.created_at,
      },
    })
  } catch (error: any) {
    console.error('❌ Erro em registerLead:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
