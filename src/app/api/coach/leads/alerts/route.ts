import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar leads que precisam de atenção (parados há X dias)
 * 
 * Query params:
 * - days: número de dias (padrão: 3)
 */
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const daysThreshold = parseInt(searchParams.get('days') || '3')
    const authenticatedUserId = user.id

    // Calcular data limite (X dias atrás)
    const dateThreshold = new Date()
    dateThreshold.setDate(dateThreshold.getDate() - daysThreshold)
    const dateThresholdISO = dateThreshold.toISOString()

    // Buscar leads que não foram convertidos e estão parados há X dias ou mais
    const { data: leads, error } = await supabaseAdmin
      .from('coach_leads')
      .select('id, name, email, phone, created_at, additional_data, template_id')
      .eq('user_id', authenticatedUserId)
      .lt('created_at', dateThresholdISO)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Erro ao buscar leads para alertas:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar leads', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Verificar quais leads já foram convertidos
    const leadIds = (leads || []).map(l => l.id)
    const { data: convertedLeads } = await supabaseAdmin
      .from('coach_clients')
      .select('lead_id')
      .eq('user_id', authenticatedUserId)
      .in('lead_id', leadIds.length > 0 ? leadIds : ['00000000-0000-0000-0000-000000000000'])

    const convertedLeadIds = new Set((convertedLeads || []).map(c => c.lead_id))

    // Filtrar apenas leads não convertidos e calcular dias parados
    const leadsComAlerta = (leads || [])
      .filter(lead => !convertedLeadIds.has(lead.id))
      .map(lead => {
        const createdDate = new Date(lead.created_at)
        const now = new Date()
        const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
        
        return {
          ...lead,
          days_stale: daysDiff,
          needs_attention: daysDiff >= daysThreshold
        }
      })
      .filter(lead => lead.needs_attention)

    return NextResponse.json({
      success: true,
      data: {
        alerts: leadsComAlerta,
        total: leadsComAlerta.length,
        threshold_days: daysThreshold
      }
    })

  } catch (error: any) {
    console.error('Erro ao buscar alertas de leads:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

