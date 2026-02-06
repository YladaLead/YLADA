import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/admin/subscriptions/manual
 * Cria assinatura manual (ex.: plano mensal Wellness) para um usuário.
 * Usado quando o pagamento foi aprovado no MP mas o webhook não criou a assinatura.
 * Apenas admin pode criar.
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { user_id, email, name, area = 'wellness', plan_type = 'monthly' } = body

    if (!['monthly', 'annual'].includes(plan_type)) {
      return NextResponse.json(
        { error: 'plan_type deve ser monthly ou annual' },
        { status: 400 }
      )
    }
    if (!['wellness', 'nutri', 'coach', 'nutra'].includes(area)) {
      return NextResponse.json(
        { error: 'Área inválida. Use: wellness, nutri, coach ou nutra' },
        { status: 400 }
      )
    }

    const normalizedUserId = (user_id && String(user_id).trim()) || ''
    const normalizedEmail = (email && String(email).trim()) || ''
    const hasValidUserId = normalizedUserId.length > 0
    const hasValidEmail = normalizedEmail.length > 0 && normalizedEmail.includes('@')

    if (!hasValidUserId && !hasValidEmail) {
      return NextResponse.json(
        { error: 'Forneça user_id (usuário já cadastrado) ou email e name (para criar novo)' },
        { status: 400 }
      )
    }
    if (!hasValidUserId && hasValidEmail && (!name || !String(name).trim())) {
      return NextResponse.json(
        { error: 'Para criar novo usuário, informe name junto com email' },
        { status: 400 }
      )
    }

    let user: { id: string; email?: string } | null = null

    if (hasValidUserId) {
      const { data: existingUser, error: userError } = await supabaseAdmin.auth.admin.getUserById(normalizedUserId)
      if (userError || !existingUser?.user) {
        return NextResponse.json(
          { error: userError?.message || 'Usuário não encontrado' },
          { status: 404 }
        )
      }
      user = existingUser.user
    } else {
      const { data: usersList } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = usersList?.users?.find(
        (u) => u.email?.toLowerCase() === normalizedEmail.toLowerCase()
      )
      if (existingUser) {
        user = existingUser
      } else {
        const tempPassword =
          Math.random().toString(36).slice(-12) +
          Math.random().toString(36).slice(-12).toUpperCase() +
          '!@#'
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: normalizedEmail.toLowerCase(),
          email_confirm: true,
          password: tempPassword,
          user_metadata: { full_name: (name && String(name).trim()) || normalizedEmail.split('@')[0] },
        })
        if (createError || !newUser?.user) {
          return NextResponse.json(
            { error: createError?.message || 'Erro ao criar usuário' },
            { status: 500 }
          )
        }
        user = newUser.user
        const { data: existingProfile } = await supabaseAdmin
          .from('user_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()
        if (!existingProfile) {
          await supabaseAdmin.from('user_profiles').insert({
            user_id: user.id,
            nome_completo: (name && String(name).trim()) || normalizedEmail.split('@')[0],
            email: normalizedEmail.toLowerCase(),
            perfil: area,
          })
        }
      }
    }

    if (!user?.id) {
      return NextResponse.json(
        { error: 'Não foi possível identificar ou criar o usuário' },
        { status: 500 }
      )
    }

    const finalUserId = user.id

    const { data: existing } = await supabaseAdmin
      .from('subscriptions')
      .select('id, current_period_end')
      .eq('user_id', finalUserId)
      .eq('area', area)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle()

    if (existing) {
      await supabaseAdmin
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
    }

    const now = new Date()
    const periodStart = now.toISOString()
    const days = plan_type === 'monthly' ? 30 : 365
    const periodEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString()

    const amount =
      area === 'wellness' && plan_type === 'monthly'
        ? 9700
        : area === 'wellness' && plan_type === 'annual'
          ? 97000
          : 0
    const features = plan_type === 'annual' ? ['completo'] : ['gestao', 'ferramentas']

    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 15)
    const stripeSubscriptionId = `manual_${area}_${plan_type}_${finalUserId}_${timestamp}_${randomSuffix}`

    const subscriptionData = {
      user_id: finalUserId,
      area,
      plan_type,
      features,
      status: 'active',
      current_period_start: periodStart,
      current_period_end: periodEnd,
      stripe_account: 'br',
      stripe_subscription_id: stripeSubscriptionId,
      stripe_customer_id: `manual_${finalUserId}`,
      stripe_price_id: `manual_${plan_type}`,
      amount,
      currency: 'brl',
      created_at: periodStart,
      updated_at: periodStart,
    }

    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .insert(subscriptionData)
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar assinatura manual:', error)
      return NextResponse.json(
        { error: error.message || 'Erro ao criar assinatura' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: data,
      message: `Assinatura ${plan_type === 'monthly' ? 'mensal' : 'anual'} (${area}) criada. Válida por ${days} dias.`,
    })
  } catch (err: any) {
    console.error('Erro em POST /api/admin/subscriptions/manual:', err)
    return NextResponse.json(
      { error: err?.message || 'Erro interno' },
      { status: 500 }
    )
  }
}
