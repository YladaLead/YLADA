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

    // Debug: log do body recebido
    console.log('📥 Body recebido na API:', JSON.stringify(body, null, 2))
    console.log('📥 user_id recebido:', user_id, 'tipo:', typeof user_id)
    console.log('📥 email recebido:', email)

    // Validar campos obrigatórios
    if (!area) {
      return NextResponse.json(
        { error: 'Área é obrigatória' },
        { status: 400 }
      )
    }

    // Normalizar user_id e email para validação
    const normalizedUserId = user_id?.trim() || ''
    const normalizedEmail = email?.trim() || ''
    const hasValidUserId = normalizedUserId && normalizedUserId.length > 0
    const hasValidEmail = normalizedEmail && normalizedEmail.length > 0
    
    // Deve ter user_id OU email válido
    if (!hasValidUserId && !hasValidEmail) {
      return NextResponse.json(
        { error: 'Forneça user_id (se usuário existe) ou email (para criar novo usuário)' },
        { status: 400 }
      )
    }

    // Validar área (ylada = plano free da matriz /pt, independente do segmento do perfil)
    const AREAS_VALIDAS = ['wellness', 'nutri', 'coach', 'nutra', 'ylada'] as const
    if (!(AREAS_VALIDAS as readonly string[]).includes(area)) {
      return NextResponse.json(
        { error: 'Área inválida. Use: wellness, nutri, coach, nutra ou ylada' },
        { status: 400 }
      )
    }

    let user: any = null

    // Se forneceu user_id válido, buscar usuário existente
    if (hasValidUserId) {
      console.log('🔍 Buscando usuário por ID:', normalizedUserId)
      const { data: existingUser, error: userError } = await supabaseAdmin.auth.admin.getUserById(normalizedUserId)
      
      if (userError) {
        console.error('❌ Erro ao buscar usuário:', userError)
        return NextResponse.json(
          { error: `Erro ao buscar usuário: ${userError.message || 'Usuário não encontrado'}` },
          { status: 404 }
        )
      }
      
      if (!existingUser || !existingUser.user) {
        console.error('❌ Usuário não encontrado para ID:', normalizedUserId)
        return NextResponse.json(
          { error: 'Usuário não encontrado' },
          { status: 404 }
        )
      }
      
      user = existingUser.user
      console.log('✅ Usuário encontrado:', user.email)
    } 
    // Se forneceu email válido, buscar ou criar usuário
    else if (hasValidEmail) {
      console.log('🔍 Buscando ou criando usuário por email:', normalizedEmail)
      // Buscar usuário existente por email
      const { data: usersList } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = usersList?.users.find(
        u => u.email?.toLowerCase() === normalizedEmail.toLowerCase()
      )

      if (existingUser) {
        user = existingUser
        console.log('✅ Usuário existente encontrado por email:', user.email)
      } else {
        // Criar novo usuário
        console.log('📝 Criando novo usuário com email:', normalizedEmail)
        // Gerar senha temporária aleatória
        const tempPassword = Math.random().toString(36).slice(-12) + 
                            Math.random().toString(36).slice(-12).toUpperCase() + 
                            '!@#'
        
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: normalizedEmail.toLowerCase(),
          email_confirm: true,
          password: tempPassword,
          user_metadata: {
            full_name: name || normalizedEmail.split('@')[0]
          }
        })

        if (createError || !newUser.user) {
          console.error('❌ Erro ao criar usuário:', createError)
          return NextResponse.json(
            { error: `Erro ao criar usuário: ${createError?.message || 'Erro desconhecido'}` },
            { status: 500 }
          )
        }

        user = newUser.user
        console.log('✅ Novo usuário criado:', user.email)

        // Criar perfil do usuário (apenas se não existir)
        const { data: existingProfile } = await supabaseAdmin
          .from('user_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()

        if (!existingProfile) {
          // Apenas criar perfil se não existir
          const { error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .insert({
              user_id: user.id,
              nome_completo: name || normalizedEmail.split('@')[0],
              email: normalizedEmail.toLowerCase(),
              perfil: area,
              created_at: new Date().toISOString()
            })

          if (profileError) {
            console.error(`Erro ao criar perfil para ${normalizedEmail}:`, profileError)
            // Não falhar se o perfil não for criado, mas logar o erro
          } else {
            console.log('✅ Perfil criado para novo usuário')
          }
        } else {
          // Perfil já existe - não alterar, apenas criar a assinatura
          console.log(`✅ Perfil já existe para ${normalizedEmail}, mantendo área original do perfil`)
        }
      }
    }

    if (!user || !user.id) {
      console.error('❌ Erro: user ou user.id está vazio após busca/criação')
      return NextResponse.json(
        { error: 'Não foi possível identificar ou criar o usuário. Verifique os logs do servidor.' },
        { status: 500 }
      )
    }

    const finalUserId = user.id
    console.log('✅ Final user_id que será usado:', finalUserId, 'tipo:', typeof finalUserId)
    
    // Validação final de segurança
    if (!finalUserId || (typeof finalUserId === 'string' && finalUserId.trim() === '')) {
      console.error('❌ Erro crítico: finalUserId está vazio!')
      console.error('❌ user object:', JSON.stringify(user, null, 2))
      return NextResponse.json(
        { error: 'Erro interno: user_id inválido após processamento' },
        { status: 500 }
      )
    }
    
    // Validar formato UUID (básico)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(finalUserId)) {
      console.error('❌ Erro: finalUserId não é um UUID válido:', finalUserId)
      return NextResponse.json(
        { error: 'Erro interno: user_id não é um UUID válido' },
        { status: 500 }
      )
    }
    
    // Verificar se o usuário realmente existe no auth.users (validação de foreign key)
    console.log('🔍 Verificando se usuário existe no auth.users...')
    const { data: verifyUser, error: verifyError } = await supabaseAdmin.auth.admin.getUserById(finalUserId)
    if (verifyError || !verifyUser || !verifyUser.user) {
      console.error('❌ Erro: Usuário não existe no auth.users:', verifyError)
      return NextResponse.json(
        { error: 'Usuário não encontrado no sistema de autenticação' },
        { status: 404 }
      )
    }
    console.log('✅ Usuário confirmado no auth.users:', verifyUser.user.email)

    // Verificar se já tem assinatura ativa para esta área
    const { data: existing } = await supabaseAdmin
      .from('subscriptions')
      .select('id, current_period_end')
      .eq('user_id', finalUserId)
      .eq('area', area)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle()

    // Se já tem assinatura ativa, cancelar a antiga antes de criar a nova
    if (existing) {
      await supabaseAdmin
        .from('subscriptions')
        .update({
          status: 'canceled',
          canceled_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
      
      console.log(`✅ Assinatura antiga cancelada (ID: ${existing.id}) antes de criar nova para área ${area}`)
    }

    // Calcular datas
    const now = new Date()
    const periodStart = now.toISOString()

    // Wellness: trial é sempre 3 dias. YLADA (matriz): prazo longo permitido para free /pt.
    const isWellness = area === 'wellness'
    const isYladaArea = area === 'ylada'
    const defaultDays = isWellness ? 3 : isYladaArea ? 365 : 365
    let days = expires_in_days ?? defaultDays
    if (isWellness && days > 3) {
      days = 3
      console.log('⚠️ Wellness: trial limitado a 3 dias (valor solicitado foi ajustado).')
    }

    const maxDays = isWellness ? 3 : isYladaArea ? 3650 : 400
    if (days > maxDays) {
      return NextResponse.json(
        {
          error: isYladaArea
            ? 'Plano gratuito matriz (ylada) não pode ultrapassar 3650 dias (~10 anos).'
            : 'Plano gratuito não pode ter mais de 400 dias de validade. Use um valor menor.',
        },
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

    // Gerar ID único para stripe_subscription_id
    // Usa timestamp + random para garantir unicidade mesmo em requisições simultâneas
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 15)
    const stripeSubscriptionId = `free_${finalUserId}_${area}_${timestamp}_${randomSuffix}`

    // Criar assinatura gratuita
    const subscriptionData: any = {
      user_id: finalUserId, // Garantir que é string válida
      area,
      plan_type: 'free',
      status: 'active',
      current_period_start: periodStart,
      current_period_end: periodEnd,
      // Campos Stripe vazios para plano gratuito
      stripe_account: 'br',
      stripe_subscription_id: stripeSubscriptionId,
      stripe_customer_id: `free_${finalUserId}`,
      stripe_price_id: 'free',
      amount: 0,
      currency: 'brl',
      // Timestamps explícitos para garantir que não falte
      created_at: periodStart,
      updated_at: periodStart,
    }
    
    // Validação final antes de inserir
    if (!subscriptionData.user_id || subscriptionData.user_id.trim() === '') {
      console.error('❌ Erro crítico: subscriptionData.user_id está vazio antes de inserir!')
      console.error('❌ subscriptionData completo:', JSON.stringify(subscriptionData, null, 2))
      return NextResponse.json(
        { error: 'Erro interno: user_id inválido antes de inserir no banco' },
        { status: 500 }
      )
    }

    // Log dos dados antes de inserir (sempre logar para debug)
    console.log('📝 Dados da subscription a ser criada:', JSON.stringify(subscriptionData, null, 2))
    console.log('📝 Tipo do user_id:', typeof subscriptionData.user_id)
    console.log('📝 user_id valor:', subscriptionData.user_id)

    // Adicionar requires_manual_renewal apenas se a coluna existir
    // (evita erro se a migração não foi executada)
    try {
      console.log('🔄 Tentando inserir subscription no banco...')
      console.log('🔄 subscriptionData.user_id:', subscriptionData.user_id)
      console.log('🔄 subscriptionData.area:', subscriptionData.area)
      console.log('🔄 subscriptionData.plan_type:', subscriptionData.plan_type)
      
      const { data, error } = await supabaseAdmin
        .from('subscriptions')
        .insert(subscriptionData)
        .select()
        .single()

      if (error) {
        console.error('❌ Erro ao criar plano gratuito:', error)
        console.error('❌ Detalhes do erro:', JSON.stringify(error, null, 2))
        console.error('❌ Código do erro:', error.code)
        console.error('❌ Mensagem completa:', error.message)
        console.error('❌ Hint:', error.hint)
        console.error('❌ Details:', error.details)
        console.error('❌ subscriptionData enviado:', JSON.stringify(subscriptionData, null, 2))

        const msg = error.message || ''
        if (error.code === '23514' && msg.includes('subscriptions_area_check')) {
          return NextResponse.json(
            {
              error:
                'O Supabase ainda não aceita area "ylada" (e alguns segmentos) na tabela subscriptions. Abra o SQL Editor e execute o arquivo migrations/278-subscriptions-area-ylada-matriz.sql. Depois tente criar de novo os 90 dias.',
              details: msg,
              migration_required: true,
              migration_file: '278-subscriptions-area-ylada-matriz.sql',
            },
            { status: 500 }
          )
        }

        // Verificar se é erro de constraint plan_type
        if (msg.includes('subscriptions_plan_type_check') || (msg.includes('plan_type') && msg.includes('check constraint'))) {
          return NextResponse.json(
            { 
              error: 'Erro: O banco de dados não permite plan_type "free". Execute a migração add-free-to-plan-type.sql no Supabase primeiro.',
              details: msg,
              migration_required: true
            },
            { status: 500 }
          )
        }
        
        // Verificar se é erro de UNIQUE constraint (stripe_subscription_id duplicado)
        if (error.code === '23505' || error.message?.includes('unique') || error.message?.includes('duplicate')) {
          return NextResponse.json(
            { 
              error: 'Erro: Já existe uma assinatura com este ID. Tente novamente.',
              details: error.message,
              code: error.code
            },
            { status: 409 }
          )
        }
        
        // Verificar se é erro de NOT NULL constraint
        if (error.code === '23502' || error.message?.includes('null value')) {
          // Extrair nome do campo que está faltando da mensagem de erro
          const fieldMatch = error.message?.match(/column "([^"]+)"|column ([a-z_]+)/i)
          const missingField = fieldMatch ? fieldMatch[1] || fieldMatch[2] : 'desconhecido'
          
          // Log detalhado para debug
          console.error('❌ Erro NOT NULL constraint:', {
            missingField,
            errorMessage: error.message,
            errorCode: error.code,
            subscriptionData: JSON.stringify(subscriptionData, null, 2)
          })
          
          return NextResponse.json(
            { 
              error: `Erro: Campo obrigatório faltando: "${missingField}". Verifique os logs do servidor.`,
              details: error.message,
              code: error.code,
              missing_field: missingField,
              hint: error.hint,
              debug_info: process.env.NODE_ENV === 'development' ? {
                subscriptionData,
                finalUserId
              } : undefined
            },
            { status: 500 }
          )
        }
        
        return NextResponse.json(
          { 
            error: 'Erro ao criar plano gratuito', 
            details: error.message,
            code: error.code,
            hint: error.hint
          },
          { status: 500 }
        )
      }

        console.log('✅ Subscription criada com sucesso:', data)
        return NextResponse.json({
          success: true,
          subscription: data,
          message: `Plano gratuito criado com sucesso. Válido por ${days} dias.`
        })
    } catch (insertError: any) {
      console.error('❌ Erro ao inserir assinatura (catch):', insertError)
      console.error('❌ Tipo do erro:', typeof insertError)
      console.error('❌ Mensagem:', insertError?.message)
      console.error('❌ Stack:', insertError?.stack)
      console.error('❌ subscriptionData que causou o erro:', JSON.stringify(subscriptionData, null, 2))
      
      // Se o erro tem código, tratar como erro do Supabase
      if (insertError?.code) {
        return NextResponse.json(
          { 
            error: 'Erro ao criar plano gratuito', 
            details: insertError.message || 'Erro desconhecido',
            code: insertError.code,
            hint: insertError.hint
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Erro ao criar plano gratuito', 
          details: insertError?.message || 'Erro desconhecido',
          stack: process.env.NODE_ENV === 'development' ? insertError?.stack : undefined
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('❌ Erro geral ao criar plano gratuito (catch principal):', error)
    console.error('❌ Tipo do erro:', typeof error)
    console.error('❌ Mensagem:', error?.message)
    console.error('❌ Stack:', error?.stack)
    console.error('❌ Nome:', error?.name)
    console.error('❌ Código:', error?.code)
    
    // Se for erro de JSON parsing
    if (error instanceof SyntaxError || error.message?.includes('JSON')) {
      return NextResponse.json(
        { error: 'Erro ao processar dados da requisição. Verifique o formato JSON.' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        error: error?.message || 'Erro ao criar plano gratuito',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}

