import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/admin/subscriptions/import
 * Importa múltiplas assinaturas de uma vez (migração em massa)
 * Apenas admin pode importar
 * 
 * Body:
 * {
 *   subscriptions: [
 *     {
 *       email: string,
 *       name: string (nome completo - opcional, será usado para criar perfil),
 *       area: 'wellness' | 'nutri' | 'coach' | 'nutra',
 *       plan_type: 'monthly' | 'annual' | 'free',
 *       expires_at: string (ISO date),
 *       migrated_from: string
 *     }
 *   ]
 * }
 * 
 * Nota: Se o usuário não existir, será criado automaticamente com senha temporária.
 * O perfil também será criado automaticamente.
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { subscriptions } = body

    if (!subscriptions || !Array.isArray(subscriptions) || subscriptions.length === 0) {
      return NextResponse.json(
        { error: 'Array de subscriptions é obrigatório' },
        { status: 400 }
      )
    }

    const results = {
      success: [] as any[],
      errors: [] as any[],
      total: subscriptions.length
    }

    // Processar cada assinatura
    for (const sub of subscriptions) {
      try {
        const { email, area, plan_type, expires_at, migrated_from } = sub

        // Validar campos
        if (!email || !area || !expires_at || !migrated_from) {
          results.errors.push({
            email: email || 'N/A',
            error: 'Campos obrigatórios faltando: email, area, expires_at, migrated_from'
          })
          continue
        }

        // Validar área
        if (!['wellness', 'nutri', 'coach', 'nutra'].includes(area)) {
          results.errors.push({
            email,
            error: 'Área inválida'
          })
          continue
        }

        // Validar plan_type (agora inclui 'free')
        if (!plan_type || !['monthly', 'annual', 'free'].includes(plan_type)) {
          results.errors.push({
            email,
            error: 'plan_type deve ser monthly, annual ou free'
          })
          continue
        }

        // Buscar usuário pelo email
        const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers()
        if (userError) {
          results.errors.push({
            email,
            error: 'Erro ao buscar usuários'
          })
          continue
        }

        let user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
        
        // Se usuário não existe, criar automaticamente
        if (!user) {
          // Gerar senha temporária aleatória
          const tempPassword = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12).toUpperCase() + '!@#'
          
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: email.toLowerCase(),
            email_confirm: true,
            password: tempPassword,
            user_metadata: {
              full_name: sub.name || email.split('@')[0]
            }
          })

          if (createError || !newUser.user) {
            results.errors.push({
              email,
              error: `Erro ao criar usuário: ${createError?.message || 'Erro desconhecido'}`
            })
            continue
          }

          user = newUser.user

          // Criar perfil do usuário
          const { error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .insert({
              user_id: user.id,
              nome_completo: sub.name || email.split('@')[0],
              email: email.toLowerCase(),
              perfil: area,
              created_at: new Date().toISOString()
            })

          if (profileError) {
            console.error(`Erro ao criar perfil para ${email}:`, profileError)
            // Não falhar a importação se o perfil não for criado, mas logar o erro
          }

          // TODO: Enviar e-mail de boas-vindas com senha temporária
          // Isso será implementado depois com a função de e-mail
        }

        // Verificar se já tem assinatura ativa
        const { data: existing } = await supabaseAdmin
          .from('subscriptions')
          .select('id')
          .eq('user_id', user.id)
          .eq('area', area)
          .eq('status', 'active')
          .gt('current_period_end', new Date().toISOString())
          .maybeSingle()

        if (existing) {
          results.errors.push({
            email,
            error: 'Usuário já tem assinatura ativa para esta área'
          })
          continue
        }

        // Validar data
        const expiryDate = new Date(expires_at)
        if (isNaN(expiryDate.getTime())) {
          results.errors.push({
            email,
            error: 'Data de vencimento inválida'
          })
          continue
        }

        const now = new Date()
        const periodStart = now.toISOString()
        const periodEnd = expiryDate.toISOString()

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
            original_expiry_date: periodEnd,
            is_migrated: true,
            migrated_from,
            migrated_at: now.toISOString(),
            requires_manual_renewal: true,
            stripe_account: 'br',
            stripe_subscription_id: `migrated_${user.id}_${area}_${Date.now()}`,
            stripe_customer_id: `migrated_${user.id}`,
            stripe_price_id: 'migrated',
            amount: 0,
            currency: 'brl',
          })
          .select()
          .single()

        if (error) {
          results.errors.push({
            email,
            error: error.message
          })
          continue
        }

        results.success.push({
          email,
          subscription_id: data.id,
          expires_at: periodEnd
        })

      } catch (error: any) {
        results.errors.push({
          email: sub.email || 'N/A',
          error: error.message || 'Erro desconhecido'
        })
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: results.total,
        success: results.success.length,
        errors: results.errors.length
      },
      results
    })

  } catch (error: any) {
    console.error('❌ Erro ao importar assinaturas:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao importar assinaturas' },
      { status: 500 }
    )
  }
}

