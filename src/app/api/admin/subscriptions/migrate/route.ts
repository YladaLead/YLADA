import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/admin/subscriptions/migrate
 * Migra assinatura de outro app para YLADA
 * Apenas admin pode migrar
 * 
 * Body:
 * {
 *   user_id?: string (UUID - opcional, se não fornecido, usa email),
 *   email?: string (opcional, se não fornecido, usa user_id),
 *   name?: string (nome completo - usado apenas se criar novo usuário),
 *   area: 'wellness' | 'nutri' | 'coach' | 'nutra',
 *   plan_type: 'monthly' | 'annual' | 'free',
 *   expires_at: string (ISO date),
 *   migrated_from: string (nome do app anterior)
 * }
 * 
 * Nota: Se fornecer email e o usuário não existir, será criado automaticamente.
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { 
      user_id,
      email,
      name,
      area, 
      plan_type,
      expires_at,
      migrated_from
    } = body

    // Validar campos obrigatórios
    if ((!user_id && !email) || !area || !expires_at || !migrated_from) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: (user_id OU email), area, expires_at, migrated_from' },
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

    // Validar plan_type (agora inclui 'free')
    if (!plan_type || !['monthly', 'annual', 'free'].includes(plan_type)) {
      return NextResponse.json(
        { error: 'plan_type deve ser monthly, annual ou free' },
        { status: 400 }
      )
    }

    let user: any = null

    // Se forneceu user_id, buscar por ID
    if (user_id) {
      const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(user_id)
      if (userError || !userData) {
        return NextResponse.json(
          { error: 'Usuário não encontrado com este user_id' },
          { status: 404 }
        )
      }
      user = userData.user
    } 
    // Se forneceu email, buscar por email
    else if (email) {
      const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers()
      if (userError) {
        return NextResponse.json(
          { error: 'Erro ao buscar usuários' },
          { status: 500 }
        )
      }

      user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

      // Se usuário não existe, criar automaticamente
      if (!user) {
        // Gerar senha temporária aleatória
        const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12).toUpperCase() + '!@#'
        
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
          // Não falhar a migração se o perfil não for criado, mas logar o erro
        }

        // TODO: Enviar e-mail de boas-vindas com senha temporária
      }
    } else {
      return NextResponse.json(
        { error: 'Forneça user_id ou email' },
        { status: 400 }
      )
    }

    // Verificar se já existe assinatura ativa para esta área
    const { data: existing } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .eq('user_id', user.id)
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

    // Validar e formatar data de vencimento
    const expiryDate = new Date(expires_at)
    if (isNaN(expiryDate.getTime())) {
      return NextResponse.json(
        { error: 'Data de vencimento inválida. Use formato ISO (ex: 2025-12-31T23:59:59Z)' },
        { status: 400 }
      )
    }

    const now = new Date()
    const periodStart = now.toISOString()
    const periodEnd = expiryDate.toISOString()

    // 🛡️ VALIDAÇÃO: Verificar que data de vencimento é razoável para o tipo de plano
    const daysUntilExpiry = Math.floor((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (plan_type === 'monthly' && daysUntilExpiry > 60) {
      return NextResponse.json(
        { error: `Data de vencimento inválida para plano mensal. Máximo 60 dias, mas foi calculado ${daysUntilExpiry} dias. Use uma data mais próxima.` },
        { status: 400 }
      )
    }
    
    if (plan_type === 'annual' && daysUntilExpiry > 400) {
      return NextResponse.json(
        { error: `Data de vencimento inválida para plano anual. Máximo 400 dias, mas foi calculado ${daysUntilExpiry} dias. Use uma data mais próxima.` },
        { status: 400 }
      )
    }
    
    if (plan_type === 'free' && daysUntilExpiry > 400) {
      return NextResponse.json(
        { error: `Data de vencimento inválida para plano gratuito. Máximo 400 dias, mas foi calculado ${daysUntilExpiry} dias. Use uma data mais próxima.` },
        { status: 400 }
      )
    }

    // Criar assinatura migrada
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: user.id,
        area,
        plan_type,
        status: 'active',
        current_period_start: periodStart,
        current_period_end: periodEnd,
        original_expiry_date: periodEnd, // Guardar data original
        is_migrated: true,
        migrated_from,
        migrated_at: now.toISOString(),
        requires_manual_renewal: true, // Migradas precisam renovação manual (usuário refaz checkout)
        // Campos Stripe vazios (não tem gateway ainda)
        stripe_account: 'br',
        stripe_subscription_id: `migrated_${user.id}_${area}_${Date.now()}`,
        stripe_customer_id: `migrated_${user.id}`,
        stripe_price_id: 'migrated',
        amount: 0, // Valor não aplicável para migrados
        currency: 'brl',
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao migrar assinatura:', error)
      return NextResponse.json(
        { error: 'Erro ao migrar assinatura', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      subscription: data,
      message: `Assinatura migrada com sucesso. Usuário receberá notificações antes do vencimento (${expires_at}) para refazer checkout.`
    })
  } catch (error: any) {
    console.error('❌ Erro ao migrar assinatura:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao migrar assinatura' },
      { status: 500 }
    )
  }
}

