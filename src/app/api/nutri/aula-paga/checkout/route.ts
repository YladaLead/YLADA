import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createPreference } from '@/lib/mercado-pago'

const AULA_PAGA_VALOR = 37
const AULA_PAGA_DESCRICAO = 'Aula YLADA - Público certo, posicionamento e agenda'

/**
 * POST /api/nutri/aula-paga/checkout
 * Cria inscrição (pending) e Preference no Mercado Pago por R$ 37.
 * Após pagamento aprovado, o webhook atualiza para pago e envia confirmação.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, email, telefone } = body

    if (!nome?.trim() || !email?.trim() || !telefone?.trim()) {
      return NextResponse.json(
        { error: 'Nome, e-mail e telefone são obrigatórios' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: 'E-mail inválido' },
        { status: 400 }
      )
    }

    const sanitized = {
      nome: nome.trim().substring(0, 255),
      email: email.trim().toLowerCase().substring(0, 255),
      telefone: String(telefone).trim().replace(/\D/g, '').substring(0, 20),
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || process.env.NEXT_PUBLIC_APP_URL || ''
    const cleanBaseUrl = baseUrl.replace(/\/$/, '')
    if (!cleanBaseUrl) {
      console.error('NEXT_PUBLIC_APP_URL não configurado')
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Tente novamente em instantes.' },
        { status: 500 }
      )
    }

    const successUrl = `${cleanBaseUrl}/pt/nutri/agenda-cheia/sucesso?gateway=mercadopago`
    const failureUrl = `${cleanBaseUrl}/pt/nutri/agenda-cheia?canceled=true`
    const pendingUrl = `${cleanBaseUrl}/pt/nutri/agenda-cheia/sucesso?gateway=mercadopago&status=pending`

    // Salvar inscrição com status pending (webhook atualiza para pago)
    try {
      const { error: dbError } = await supabaseAdmin
        .from('workshop_inscricoes')
        .insert({
          nome: sanitized.nome,
          email: sanitized.email,
          telefone: sanitized.telefone,
          crn: null,
          source: 'aula_paga_landing_page',
          workshop_type: 'aula_paga',
          status: 'inscrito', // após pagamento o webhook atualiza para 'confirmado'
        })

      if (dbError) {
        console.error('Erro ao salvar inscrição aula paga:', dbError)
        return NextResponse.json(
          { error: 'Erro ao registrar inscrição. Tente novamente.' },
          { status: 500 }
        )
      }
    } catch (e) {
      console.error('Erro ao salvar inscrição:', e)
      return NextResponse.json(
        { error: 'Erro ao registrar inscrição. Tente novamente.' },
        { status: 500 }
      )
    }

    // userId usado no external_reference para o webhook identificar aula_paga e email
    const userIdRef = `aula_paga_${sanitized.email}`

    const isTest = process.env.NODE_ENV !== 'production'
    const preference = await createPreference(
      {
        area: 'nutri',
        planType: 'annual',
        productType: 'aula_paga',
        userId: userIdRef,
        userEmail: sanitized.email,
        amount: AULA_PAGA_VALOR,
        description: AULA_PAGA_DESCRICAO,
        successUrl,
        failureUrl,
        pendingUrl,
        maxInstallments: 1,
        payerFirstName: sanitized.nome.split(' ')[0] || sanitized.nome,
        payerLastName: sanitized.nome.split(' ').slice(1).join(' ') || undefined,
      },
      isTest
    )

    return NextResponse.json({
      success: true,
      checkoutUrl: preference.initPoint,
      sessionId: preference.id,
    })
  } catch (error: any) {
    console.error('Erro checkout aula paga:', error)
    return NextResponse.json(
      { error: error?.message || 'Erro ao gerar pagamento. Tente novamente.' },
      { status: 500 }
    )
  }
}
