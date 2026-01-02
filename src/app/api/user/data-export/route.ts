import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/user/data-export
 * Exporta todos os dados pessoais do usuário autenticado (LGPD/GDPR)
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, [])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    const userId = user.id
    const exportDate = new Date().toISOString()

    // Coletar todos os dados do usuário
    const data: any = {
      export_info: {
        user_id: userId,
        email: user.email,
        export_date: exportDate,
        format_version: '1.0',
      },
      profile: null,
      leads: [],
      clients: [],
      templates: [],
      wellness_profile: null,
      subscriptions: [],
      conversions: [],
      consents: [],
      push_subscriptions: [],
    }

    // 1. Perfil do usuário
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!profileError && profile) {
      data.profile = profile
    }

    // 2. Leads (nutri e coach)
    const { data: leads } = await supabaseAdmin
      .from('leads')
      .select('*')
      .eq('user_id', userId)

    if (leads) {
      data.leads = leads
    }

    // 3. Clientes (nutri)
    const { data: clients } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('user_id', userId)

    if (clients) {
      data.clients = clients
    }

    // 4. Clientes Coach
    const { data: coachClients } = await supabaseAdmin
      .from('coach_clients')
      .select('*')
      .eq('user_id', userId)

    if (coachClients) {
      data.coach_clients = coachClients
    }

    // 5. Templates (nutri)
    const { data: templates } = await supabaseAdmin
      .from('user_templates')
      .select('*')
      .eq('user_id', userId)

    if (templates) {
      data.templates = templates
    }

    // 6. Templates Coach
    const { data: coachTemplates } = await supabaseAdmin
      .from('coach_user_templates')
      .select('*')
      .eq('user_id', userId)

    if (coachTemplates) {
      data.coach_templates = coachTemplates
    }

    // 7. Perfil Wellness/NOEL
    const { data: wellnessProfile } = await supabaseAdmin
      .from('wellness_noel_profile')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (wellnessProfile) {
      data.wellness_profile = wellnessProfile
    }

    // 8. Assinaturas
    const { data: subscriptions } = await supabaseAdmin
      .from('wellness_subscriptions')
      .select('*')
      .eq('user_id', userId)

    if (subscriptions) {
      data.subscriptions = subscriptions
    }

    // 9. Conversões Wellness
    const { data: conversions } = await supabaseAdmin
      .from('wellness_conversions')
      .select('*')
      .eq('user_id', userId)

    if (conversions) {
      data.conversions = conversions
    }

    // 10. Consentimentos
    const { data: consents } = await supabaseAdmin
      .from('user_consents')
      .select('*')
      .eq('user_id', userId)

    if (consents) {
      data.consents = consents
    }

    // 11. Push Subscriptions (se a tabela existir)
    try {
      const { data: pushSubs } = await supabaseAdmin
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', userId)

      if (pushSubs) {
        data.push_subscriptions = pushSubs
      }
    } catch (e) {
      // Tabela pode não existir, ignorar
    }

    // Retornar dados em formato JSON
    return NextResponse.json(data, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="ylada-data-export-${userId}-${exportDate.split('T')[0]}.json"`,
      },
    })
  } catch (error: any) {
    console.error('Erro ao exportar dados:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao exportar dados' },
      { status: 500 }
    )
  }
}
































