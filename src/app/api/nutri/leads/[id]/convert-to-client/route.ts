import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST - Converter lead diretamente em cliente (cria o cliente)
 * 
 * Body:
 * - status: string (padrão: 'pre_consulta')
 * - create_initial_assessment: boolean (padrão: false) - Se deve criar avaliação inicial
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

    const { id: leadId } = await params
    const authenticatedUserId = user.id

    const body = await request.json()
    const { status: statusManual, create_initial_assessment = false, additional_data } = body

    // Buscar o lead
    const { data: lead, error: leadError } = await supabaseAdmin
      .from('leads')
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

    // Função para determinar status baseado na origem do lead
    const determinarStatusInicial = async (lead: any, statusManual?: string): Promise<string> => {
      // Se o usuário especificou manualmente, usar o que ele escolheu
      if (statusManual && ['lead', 'pre_consulta', 'ativa', 'pausa', 'finalizada'].includes(statusManual)) {
        return statusManual
      }

      // Buscar informações do template se disponível
      let templateType = null
      let leadSource = lead.additional_data?.source || lead.template_id || 'unknown'

      if (lead.template_id) {
        try {
          const { data: template } = await supabaseAdmin
            .from('user_templates')
            .select('title, content')
            .eq('id', lead.template_id)
            .single()

          if (template) {
            // Tentar identificar o tipo pelo título ou conteúdo
            const titleLower = (template.title || '').toLowerCase()
            const contentStr = JSON.stringify(template.content || {}).toLowerCase()

            if (titleLower.includes('quiz') || contentStr.includes('quiz')) {
              templateType = 'quiz'
            } else if (titleLower.includes('calculadora') || titleLower.includes('calculadora') || contentStr.includes('imc') || contentStr.includes('calculo')) {
              templateType = 'calculadora'
            } else if (titleLower.includes('checklist') || contentStr.includes('checklist')) {
              templateType = 'checklist'
            } else if (titleLower.includes('ebook') || contentStr.includes('ebook')) {
              templateType = 'ebook'
            }
          }
        } catch (e) {
          // Ignorar erro ao buscar template
        }
      }

      // Mapear origem para status
      // Quizzes e calculadoras → 'lead' (Contato) - precisa de acolhimento inicial
      if (templateType === 'quiz' || templateType === 'calculadora') {
        return 'lead'
      }

      // Checklists e ebooks (mais engajados) → 'pre_consulta' (já demonstrou interesse)
      if (templateType === 'checklist' || templateType === 'ebook') {
        return 'pre_consulta'
      }

      // Se o lead_source indica quiz ou calculadora
      const sourceLower = String(leadSource).toLowerCase()
      if (sourceLower.includes('quiz') || sourceLower.includes('calculadora') || sourceLower.includes('imc')) {
        return 'lead'
      }

      // Padrão: 'lead' (Contato) - mais seguro, nutricionista pode mover depois
      return 'lead'
    }

    const status = await determinarStatusInicial(lead, statusManual)

    // Verificar se já existe cliente com este lead_id
    const { data: existingClient } = await supabaseAdmin
      .from('clients')
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
      name: lead.name || 'Cliente sem nome',
      email: lead.email || null,
      phone: lead.phone || null,
      converted_from_lead: true,
      lead_source: lead.additional_data?.source || lead.template_id || 'unknown',
      lead_template_id: lead.template_id || null,
      status: status, // Status determinado automaticamente baseado na origem
      client_since: new Date().toISOString()
    }

    // Adicionar dados do additional_data do lead
    if (lead.additional_data) {
      if (lead.additional_data.idade) {
        // Calcular data de nascimento aproximada (idade atual)
        const anoAtual = new Date().getFullYear()
        const anoNascimento = anoAtual - lead.additional_data.idade
        clientData.birth_date = `${anoNascimento}-01-01`
      }
      if (lead.additional_data.cidade) {
        clientData.address_city = lead.additional_data.cidade
      }
      if (lead.additional_data.estado) {
        clientData.address_state = lead.additional_data.estado
      }
      if (lead.additional_data.goal) {
        clientData.goal = lead.additional_data.goal
      }
    }

    // Adicionar dados adicionais se fornecidos
    if (additional_data) {
      if (additional_data.birth_date) clientData.birth_date = additional_data.birth_date
      if (additional_data.gender) clientData.gender = additional_data.gender
      if (additional_data.cpf) clientData.cpf = additional_data.cpf
      if (additional_data.goal) clientData.goal = additional_data.goal
      if (additional_data.instagram) clientData.instagram = additional_data.instagram
      if (additional_data.address) {
        clientData.address_street = additional_data.address.street || null
        clientData.address_number = additional_data.address.number || null
        clientData.address_complement = additional_data.address.complement || null
        clientData.address_neighborhood = additional_data.address.neighborhood || null
        clientData.address_city = additional_data.address.city || null
        clientData.address_state = additional_data.address.state || null
        clientData.address_zipcode = additional_data.address.zipcode || null
      }
    }

    // Criar cliente
    const { data: newClient, error: createError } = await supabaseAdmin
      .from('clients')
      .insert(clientData)
      .select()
      .single()

    if (createError) {
      console.error('Erro ao criar cliente:', createError)
      return NextResponse.json(
        { error: 'Erro ao criar cliente', technical: process.env.NODE_ENV === 'development' ? createError.message : undefined },
        { status: 500 }
      )
    }

    // Criar evento no histórico
    try {
      await supabaseAdmin
        .from('client_history')
        .insert({
          client_id: newClient.id,
          user_id: authenticatedUserId,
          activity_type: 'lead_convertido',
          title: 'Lead convertido em cliente',
          description: `Lead "${lead.name}" foi convertido em cliente`,
          metadata: {
            lead_id: lead.id,
            lead_name: lead.name,
            lead_source: lead.template_id || lead.additional_data?.source,
            status_inicial: status,
            status_automatico: !statusManual, // Indica se foi determinado automaticamente
            origem_mapeada: lead.additional_data?.source || lead.template_id || 'unknown'
          }
        })
    } catch (historyError) {
      console.warn('Aviso: Não foi possível criar evento no histórico:', historyError)
    }

    // Criar avaliação inicial se solicitado
    let assessment = null
    if (create_initial_assessment) {
      try {
        const assessmentData = {
          client_id: newClient.id,
          user_id: authenticatedUserId,
          assessment_type: 'antropometrica',
          assessment_name: 'Avaliação Inicial',
          is_reevaluation: false,
          status: 'rascunho',
          data: {
            origem: 'conversao_lead',
            lead_id: lead.id,
            observacoes: 'Avaliação criada automaticamente na conversão do lead'
          }
        }

        const { data: newAssessment, error: assessmentError } = await supabaseAdmin
          .from('assessments')
          .insert(assessmentData)
          .select()
          .single()

        if (!assessmentError && newAssessment) {
          assessment = newAssessment

          // Criar evento no histórico
          await supabaseAdmin
            .from('client_history')
            .insert({
              client_id: newClient.id,
              user_id: authenticatedUserId,
              activity_type: 'avaliacao',
              title: 'Avaliação inicial criada',
              description: 'Avaliação inicial criada automaticamente na conversão do lead',
              metadata: {
                assessment_id: newAssessment.id
              }
            })
        }
      } catch (assessmentError) {
        console.warn('Aviso: Não foi possível criar avaliação inicial:', assessmentError)
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        client: newClient,
        assessment: assessment
      },
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

