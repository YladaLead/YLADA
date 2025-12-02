import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/admin/subscriptions/free
 * Cria assinatura gratuita para um usuário
 * Apenas admin pode criar
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { user_id, email, name, area, expires_in_days } = body

    // Validar campos obrigatórios
    if (!area) {
      return NextResponse.json(
        { error: 'Área é obrigatória' },
        { status: 400 }
      )
    }

    // Deve ter user_id OU email
    if (!user_id && !email) {
      return NextResponse.json(
        { error: 'Forneça user_id (se usuário existe) ou email (para criar novo usuário)' },
        { status: 400 }
      )
    }

    // Validar área
    if (!['wellness', 'nutri', 'coach', 'nutra'].includes(area)) {
      return NextResponse.json(
        { error: 'Área inválida. Use: wellness, nutri, coach ou nutra' },
        { status: 400 }
      )
    }

    let user: any = null

    // Se forneceu user_id, buscar usuário existente
    if (user_id) {
      const { data: existingUser, error: userError } = await supabaseAdmin.auth.admin.getUserById(user_id)
      if (userError || !existingUser) {
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        )
      }
      user = existingUser
    } 
    // Se forneceu email, buscar ou criar usuário
    else if (email) {
      // Buscar usuário existente por email
      const { data: usersList } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = usersList?.users.find(
        u => u.email?.toLowerCase() === email.toLowerCase()
      )

      if (existingUser) {
        user = existingUser
      } else {
        // Criar novo usuário
        // Gerar senha temporária aleatória
        const tempPassword = Math.random().toString(36).slice(-12) + 
                            Math.random().toString(36).slice(-12).toUpperCase() + 
                            '!@#'
        
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: email.toLowerCase(),
          email_confirm: true,
          password: tempPassword,
          user_metadata: {
            full_name: name || email.split('@')[0]
          }
        })

        if (createError || !newUser.user) {
          return NextResponse.json(
            { error: `Erro ao criar usuário: ${createError?.message || 'Erro desconhecido'}` },
            { status: 500 }
          )
        }

        user = newUser.user

        // Criar perfil do usuário
        const { error: profileError } = await supabaseAdmin
          .from('user_profiles')
          .insert({
            user_id: user.id,
            nome_completo: name || email.split('@')[0],
            email: email.toLowerCase(),
            perfil: area,
            created_at: new Date().toISOString()
          })

        if (profileError) {
          console.error(`Erro ao criar perfil para ${email}:`, profileError)
          // Não falhar se o perfil não for criado, mas logar o erro
        }
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Não foi possível identificar ou criar o usuário' },
        { status: 500 }
      )
    }

    const finalUserId = user.id

    // Verificar se já tem assinatura ativa para esta área
    const { data: existing } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('user_id', finalUserId)
      .eq('area', area)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle()

    if (existing) {
      return NextResponse.json(
        { error: 'Usuário já tem assinatura ativa para esta área' },
        { status: 400 }
      )
    }

    // Calcular datas
    const now = new Date()
    const periodStart = now.toISOString()
    
    // Se expires_in_days não for fornecido, usar 365 dias (1 ano)
    const days = expires_in_days || 365
    
    // 🛡️ VALIDAÇÃO: Verificar que expires_in_days é razoável
    if (days > 400) {
      return NextResponse.json(
        { error: 'Plano gratuito não pode ter mais de 400 dias de validade. Use um valor menor.' },
        { status: 400 }
      )
    }
    
    if (days < 1) {
      return NextResponse.json(
        { error: 'Plano gratuito deve ter pelo menos 1 dia de validade.' },
        { status: 400 }
      )
    }
    
    const periodEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString()

    // Criar assinatura gratuita
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: finalUserId,
        area,
        plan_type: 'free',
        status: 'active',
        current_period_start: periodStart,
        current_period_end: periodEnd,
        // Campos Stripe vazios para plano gratuito
        stripe_account: 'br',
        stripe_subscription_id: `free_${finalUserId}_${area}_${Date.now()}`,
        stripe_customer_id: `free_${finalUserId}`,
        stripe_price_id: 'free',
        amount: 0,
        currency: 'brl',
        requires_manual_renewal: false, // Plano gratuito não precisa renovação manual
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao criar plano gratuito:', error)
      return NextResponse.json(
        { error: 'Erro ao criar plano gratuito', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: data,
      message: `Plano gratuito criado com sucesso. Válido por ${days} dias.`
    })
  } catch (error: any) {
    console.error('❌ Erro ao criar plano gratuito:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao criar plano gratuito' },
      { status: 500 }
    )
  }
}

