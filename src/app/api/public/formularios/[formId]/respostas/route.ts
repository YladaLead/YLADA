import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isCarolAutomationDisabled, isWhatsAppAutoInviteEnabled } from '@/config/whatsapp-automation'

/**
 * Extrai dados do cliente das respostas do formulário
 */
function extractClientDataFromResponses(responses: any, structure: any): {
  name?: string
  email?: string
  phone?: string
} {
  const result: { name?: string; email?: string; phone?: string } = {}

  if (!responses || !structure?.fields) {
    return result
  }

  // Mapear campos comuns
  const nameFields = ['nome', 'nome_completo', 'name', 'nome completo', 'nomecompleto']
  const emailFields = ['email', 'e-mail', 'email_address', 'e_mail']
  const phoneFields = ['telefone', 'phone', 'celular', 'whatsapp', 'telefone_celular', 'cel']

  // Buscar por ID do campo (mais preciso)
  structure.fields.forEach((field: any) => {
    const fieldId = field.id
    const fieldLabel = (field.label || '').toLowerCase()
    const fieldType = field.type
    const value = responses[fieldId]

    if (!value) return

    // Nome
    if (!result.name && (
      nameFields.some(nf => fieldId.toLowerCase().includes(nf)) ||
      nameFields.some(nf => fieldLabel.includes(nf)) ||
      (fieldType === 'text' && fieldLabel.includes('nome'))
    )) {
      result.name = String(value).trim()
    }

    // Email
    if (!result.email && (
      emailFields.some(ef => fieldId.toLowerCase().includes(ef)) ||
      emailFields.some(ef => fieldLabel.includes(ef)) ||
      fieldType === 'email'
    )) {
      result.email = String(value).trim().toLowerCase()
    }

    // Telefone
    if (!result.phone && (
      phoneFields.some(pf => fieldId.toLowerCase().includes(pf)) ||
      phoneFields.some(pf => fieldLabel.includes(pf)) ||
      fieldType === 'tel'
    )) {
      result.phone = String(value).trim()
    }
  })

  return result
}

/**
 * POST - Salvar respostas do formulário (público, sem autenticação)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { formId } = await params
    const body = await request.json()
    const { responses } = body

    if (!responses || typeof responses !== 'object') {
      return NextResponse.json(
        { error: 'Respostas inválidas' },
        { status: 400 }
      )
    }

    // Verificar se o formulário existe e está ativo
    // Templates também podem receber respostas
    const { data: form, error: formError } = await supabaseAdmin
      .from('custom_forms')
      .select('id, user_id, is_active, is_template')
      .eq('id', formId)
      .eq('is_active', true)
      .single()

    if (formError || !form) {
      console.error('❌ Erro ao buscar formulário:', {
        formId,
        error: formError?.message
      })
      return NextResponse.json(
        { error: 'Formulário não encontrado ou não está mais disponível' },
        { status: 404 }
      )
    }

    // Buscar perfil do usuário para determinar qual tabela usar
    const { data: userProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('perfil')
      .eq('user_id', form.user_id)
      .maybeSingle()

    const userPerfil = userProfile?.perfil || 'nutri' // Padrão para nutri se não encontrar

    console.log('✅ Formulário encontrado para salvar resposta:', {
      formId: form.id,
      userId: form.user_id,
      perfil: userPerfil,
      isTemplate: form.is_template
    })

    // Capturar IP e User Agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1'
    const userAgent = request.headers.get('user-agent') || ''

    // 🔄 INTEGRAÇÃO AUTOMÁTICA: Extrair dados e criar LEAD (não cliente diretamente)
    let leadId: string | null = null
    let leadCreated = false

    try {
      // Buscar estrutura do formulário para mapear campos
      const { data: formWithStructure } = await supabaseAdmin
        .from('custom_forms')
        .select('structure')
        .eq('id', formId)
        .single()

      // Extrair dados do formulário (nome, email, telefone)
      const extractedData = extractClientDataFromResponses(responses, formWithStructure?.structure)

      if (extractedData.name || extractedData.email || extractedData.phone) {
        // Verificar se lead já existe (por email ou telefone)
        let existingLead = null

        // Determinar qual tabela usar baseado no perfil
        const leadsTable = userPerfil === 'coach' ? 'coach_leads' : 'nutri_leads'

        if (extractedData.email) {
          const { data: leadByEmail } = await supabaseAdmin
            .from(leadsTable)
            .select('id')
            .eq('user_id', form.user_id)
            .eq('email', extractedData.email.toLowerCase().trim())
            .maybeSingle()
          
          if (leadByEmail) {
            existingLead = leadByEmail
          }
        }

        if (!existingLead && extractedData.phone) {
          const phoneClean = extractedData.phone.replace(/\D/g, '')
          const { data: leadByPhone } = await supabaseAdmin
            .from(leadsTable)
            .select('id')
            .eq('user_id', form.user_id)
            .eq('phone', phoneClean)
            .maybeSingle()
          
          if (leadByPhone) {
            existingLead = leadByPhone
          }
        }

        if (existingLead) {
          // Lead já existe - vincular resposta
          leadId = existingLead.id
          console.log(`✅ Lead existente encontrado em ${leadsTable}, vinculando resposta:`, leadId)
        } else if (extractedData.name) {
          // Criar novo LEAD (não cliente)
          const leadData: any = {
            user_id: form.user_id,
            name: extractedData.name.trim(),
            source: 'formulario',
            form_id: formId // Vincular ao formulário que gerou o lead
          }

          if (extractedData.email) {
            leadData.email = extractedData.email.toLowerCase().trim()
          }

          if (extractedData.phone) {
            const phoneClean = extractedData.phone.replace(/\D/g, '')
            leadData.phone = phoneClean
          }

          // Adicionar dados adicionais das respostas do formulário
          leadData.additional_data = {
            form_id: formId,
            form_responses: responses,
            extracted_at: new Date().toISOString()
          }

          const { data: newLead, error: leadError } = await supabaseAdmin
            .from(leadsTable)
            .insert(leadData)
            .select()
            .single()

          if (leadError) {
            console.error(`⚠️ Erro ao criar lead automaticamente em ${leadsTable}:`, leadError)
            // Continuar mesmo se falhar - salvar resposta sem lead
          } else {
            leadId = newLead.id
            leadCreated = true
            console.log(`✅ Lead criado automaticamente em ${leadsTable}:`, leadId)

            // 🚫 DISPARO PROATIVO (AUTO-INVITE) — opcional e por padrão DESLIGADO.
            // Se quiser reativar no futuro: WHATSAPP_AUTO_INVITE=true no .env
            if (userPerfil === 'nutri' && extractedData.phone && !isCarolAutomationDisabled() && isWhatsAppAutoInviteEnabled()) {
              try {
                const { sendWorkshopInviteToFormLead } = await import('@/lib/whatsapp-form-automation')
                const phoneClean = extractedData.phone.replace(/\D/g, '')
                const automationResult = await sendWorkshopInviteToFormLead(
                  phoneClean,
                  extractedData.name?.trim() || '',
                  'nutri',
                  form.user_id
                )
                if (automationResult.success) {
                  console.log('✅ Mensagem WhatsApp automática enviada para:', phoneClean)
                } else {
                  console.warn('⚠️ Falha ao enviar mensagem automática:', automationResult.error)
                }
              } catch (automationError: any) {
                console.error('⚠️ Erro ao executar automação WhatsApp:', automationError)
              }
            }
          }
        }
      }
    } catch (integrationError) {
      console.error('⚠️ Erro na integração automática lead-formulário:', integrationError)
      // Continuar mesmo se falhar - salvar resposta sem lead
    }

    // Salvar resposta
    // Nota: client_id será preenchido quando o lead for convertido em cliente
    // O lead_id será armazenado no additional_data do lead para referência
    const { data: newResponse, error } = await supabaseAdmin
      .from('form_responses')
      .insert({
        form_id: formId,
        user_id: form.user_id, // user_id do criador do formulário
        client_id: null, // Será preenchido quando lead for convertido em cliente
        responses: responses,
        ip_address: ip,
        user_agent: userAgent,
        viewed: false // Nova resposta não visualizada
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao salvar resposta:', error)
      return NextResponse.json(
        { error: 'Erro ao salvar resposta', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { 
        response: newResponse,
        lead_id: leadId,
        lead_created: leadCreated
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao salvar resposta do formulário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

