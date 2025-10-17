import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET - Dashboard administrativo (estatísticas gerais)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'dashboard') {
      // Estatísticas gerais
      const [
        { data: totalUsers },
        { data: activeSubscriptions },
        { data: totalRevenue },
        { data: recentUsers }
      ] = await Promise.all([
        // Total de usuários
        supabase
          .from('professionals')
          .select('id', { count: 'exact' }),
        
        // Assinaturas ativas
        supabase
          .from('subscriptions')
          .select('id', { count: 'exact' })
          .eq('status', 'active'),
        
        // Receita total (últimos 30 dias)
        supabase
          .from('payments')
          .select('amount')
          .eq('status', 'succeeded')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        
        // Usuários recentes (últimos 7 dias)
        supabase
          .from('professionals')
          .select('id', { count: 'exact' })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      ])

      const revenue = totalRevenue?.reduce((sum, payment) => sum + payment.amount, 0) || 0

      return NextResponse.json({
        totalUsers: totalUsers?.length || 0,
        activeSubscriptions: activeSubscriptions?.length || 0,
        monthlyRevenue: revenue,
        recentUsers: recentUsers?.length || 0,
        conversionRate: totalUsers?.length ? (activeSubscriptions?.length / totalUsers.length * 100).toFixed(1) : 0
      })

    } else if (action === 'users') {
      // Lista de usuários com assinaturas
      const { data: users, error } = await supabase
        .from('professionals')
        .select(`
          id,
          name,
          email,
          phone,
          subscription_status,
          subscription_plan,
          stripe_customer_id,
          grace_period_end,
          created_at,
          subscriptions (
            id,
            status,
            plan_type,
            current_period_end,
            cancel_at_period_end
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar usuários:', error)
        return NextResponse.json({ error: 'Erro ao buscar usuários' }, { status: 500 })
      }

      return NextResponse.json({ users })

    } else if (action === 'payments') {
      // Histórico de pagamentos
      const { data: payments, error } = await supabase
        .from('payments')
        .select(`
          id,
          amount,
          currency,
          status,
          description,
          created_at,
          subscriptions (
            user_id,
            professionals (
              name,
              email
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        console.error('Erro ao buscar pagamentos:', error)
        return NextResponse.json({ error: 'Erro ao buscar pagamentos' }, { status: 500 })
      }

      return NextResponse.json({ payments })

    } else if (action === 'revenue') {
      // Relatório de receita por período
      const { searchParams } = new URL(request.url)
      const period = searchParams.get('period') || '30' // dias
      
      const startDate = new Date(Date.now() - parseInt(period) * 24 * 60 * 60 * 1000).toISOString()
      
      const { data: payments, error } = await supabase
        .from('payments')
        .select('amount, currency, created_at')
        .eq('status', 'succeeded')
        .gte('created_at', startDate)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erro ao buscar receita:', error)
        return NextResponse.json({ error: 'Erro ao buscar receita' }, { status: 500 })
      }

      // Agrupar por dia
      const dailyRevenue = payments?.reduce((acc, payment) => {
        const date = payment.created_at.split('T')[0]
        if (!acc[date]) {
          acc[date] = 0
        }
        acc[date] += payment.amount
        return acc
      }, {} as Record<string, number>) || {}

      return NextResponse.json({ 
        dailyRevenue,
        totalRevenue: payments?.reduce((sum, p) => sum + p.amount, 0) || 0,
        period: parseInt(period)
      })

    } else {
      return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 })
    }

  } catch (error) {
    console.error('Erro na API administrativa:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

// POST - Ações administrativas (ativar, desativar, alterar plano)
export async function POST(request: NextRequest) {
  try {
    // Ler o body uma única vez no início
    const requestData = await request.json()
    const { action, userId, subscriptionId, newPlan, days } = requestData
    
    // Validação específica para create_user (não precisa de userId)
    if (action === 'create_user') {
      // Lógica específica para create_user será tratada abaixo
    } else if (!action || !userId) {
      return NextResponse.json({ error: 'Ação e ID do usuário são obrigatórios' }, { status: 400 })
    }

    if (action === 'activate_user') {
      // Ativar usuário
      const { error } = await supabase
        .from('professionals')
        .update({ subscription_status: 'active' })
        .eq('id', userId)

      if (error) {
        console.error('Erro ao ativar usuário:', error)
        return NextResponse.json({ error: 'Erro ao ativar usuário' }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Usuário ativado com sucesso' })

    } else if (action === 'deactivate_user') {
      // Desativar usuário
      const { error } = await supabase
        .from('professionals')
        .update({ subscription_status: 'inactive' })
        .eq('id', userId)

      if (error) {
        console.error('Erro ao desativar usuário:', error)
        return NextResponse.json({ error: 'Erro ao desativar usuário' }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Usuário desativado com sucesso' })

    } else if (action === 'change_plan') {
      if (!subscriptionId || !newPlan) {
        return NextResponse.json({ error: 'ID da assinatura e novo plano são obrigatórios' }, { status: 400 })
      }

      // Alterar plano
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          plan_type: newPlan,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)

      if (error) {
        console.error('Erro ao alterar plano:', error)
        return NextResponse.json({ error: 'Erro ao alterar plano' }, { status: 500 })
      }

      // Atualizar também na tabela professionals
      await supabase
        .from('professionals')
        .update({ subscription_plan: newPlan })
        .eq('id', userId)

      return NextResponse.json({ success: true, message: 'Plano alterado com sucesso' })

    } else if (action === 'create_user') {
      // Criar usuário manualmente
      const { name, email, phone, username, tempPassword } = requestData
      
      console.log('Dados recebidos para criação:', { name, email, phone, username, tempPassword: !!tempPassword })
      
      if (!name || !email || !username || !tempPassword) {
        console.log('Campos obrigatórios faltando:', { name: !!name, email: !!email, username: !!username, tempPassword: !!tempPassword })
        return NextResponse.json({ error: 'Nome, email, username e senha temporária são obrigatórios' }, { status: 400 })
      }
      
      console.log('Usando senha fornecida pelo admin:', tempPassword)
      
      // Criar usuário no Supabase Auth
      console.log('Criando usuário no Supabase Auth...')
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: email,
        password: tempPassword,
        email_confirm: true
      })
      
      if (authError) {
        console.error('Erro ao criar usuário no auth:', authError)
        return NextResponse.json({ error: 'Erro ao criar usuário: ' + authError.message }, { status: 500 })
      }
      
      console.log('Usuário criado no auth com sucesso:', authData.user.id)
      
      // Criar perfil na tabela professionals
      const graceEndDate = new Date()
      graceEndDate.setDate(graceEndDate.getDate() + 7) // 7 dias de período de graça
      
      // Tentar inserir com grace_period_end, se falhar, inserir sem
      let insertData: Record<string, unknown> = {
        id: authData.user.id,
        name: name,
        email: email,
        phone: phone || null,
        username: username,
        subscription_status: 'active',
        grace_period_end: graceEndDate.toISOString(),
        created_at: new Date().toISOString()
      }
      
      let { error: profileError } = await supabase
        .from('professionals')
        .insert(insertData)
      
      // Se erro por coluna não existir, tentar sem grace_period_end
      if (profileError && profileError.message?.includes('grace_period_end')) {
        console.log('Coluna grace_period_end não existe, inserindo sem ela')
        insertData = {
          id: authData.user.id,
          name: name,
          email: email,
          phone: phone || null,
          username: username,
          subscription_status: 'active',
          created_at: new Date().toISOString()
        }
        
        const { error: retryError } = await supabase
          .from('professionals')
          .insert(insertData)
        
        profileError = retryError
      }
      
      if (profileError) {
        console.error('Erro ao criar perfil:', profileError)
        // Tentar remover usuário do auth se falhou
        await supabase.auth.admin.deleteUser(authData.user.id)
        return NextResponse.json({ error: 'Erro ao criar perfil: ' + profileError.message }, { status: 500 })
      }
      
      return NextResponse.json({ 
        success: true, 
        message: `Usuário criado com sucesso! Email: ${email}, Senha temporária: ${tempPassword}`,
        user: {
          id: authData.user.id,
          email: email,
          tempPassword: tempPassword
        }
      })

    } else if (action === 'delete_user') {
      // Excluir usuário completamente
      const { error: profileError } = await supabase
        .from('professionals')
        .delete()
        .eq('id', userId)

      if (profileError) {
        console.error('Erro ao excluir perfil:', profileError)
        return NextResponse.json({ error: 'Erro ao excluir usuário: ' + profileError.message }, { status: 500 })
      }

      // Tentar excluir do auth também
      try {
        await supabase.auth.admin.deleteUser(userId)
      } catch (authError) {
        console.log('Usuário já removido do auth ou erro:', authError)
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Usuário excluído com sucesso' 
      })

    } else if (action === 'suspend_user') {
      // Suspender usuário
      const { error } = await supabase
        .from('professionals')
        .update({ subscription_status: 'inactive' })
        .eq('id', userId)

      if (error) {
        console.error('Erro ao suspender usuário:', error)
        return NextResponse.json({ error: 'Erro ao suspender usuário' }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Usuário suspenso com sucesso' })

    } else if (action === 'reactivate_user') {
      // Reativar usuário
      const { error } = await supabase
        .from('professionals')
        .update({ subscription_status: 'active' })
        .eq('id', userId)

      if (error) {
        console.error('Erro ao reativar usuário:', error)
        return NextResponse.json({ error: 'Erro ao reativar usuário' }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Usuário reativado com sucesso' })

    } else if (action === 'cancel_subscription') {
      // Cancelar assinatura
      const { error } = await supabase
        .from('professionals')
        .update({ subscription_status: 'canceled' })
        .eq('id', userId)

      if (error) {
        console.error('Erro ao cancelar assinatura:', error)
        return NextResponse.json({ error: 'Erro ao cancelar assinatura' }, { status: 500 })
      }

      return NextResponse.json({ success: true, message: 'Assinatura cancelada com sucesso' })

    } else if (action === 'give_free_subscription') {
      // Dar assinatura gratuita (mensal ou anual)
      const { userId: requestUserId, planType, months } = requestData
      
      const targetUserId = requestUserId || userId
      
      if (!targetUserId || !planType || !months) {
        return NextResponse.json({ error: 'ID do usuário, tipo de plano e duração são obrigatórios' }, { status: 400 })
      }
      
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + months)
      
      console.log('Dando assinatura gratuita:', { targetUserId, planType, months, endDate: endDate.toISOString() })
      
      // Tentar com grace_period_end, se falhar, tentar sem
      let updateData: Record<string, unknown> = { 
        subscription_status: 'active',
        subscription_plan: planType,
        grace_period_end: endDate.toISOString()
      }
      
      let { error } = await supabase
        .from('professionals')
        .update(updateData)
        .eq('id', targetUserId)

      // Se erro por coluna não existir, tentar sem grace_period_end
      if (error && error.message?.includes('grace_period_end')) {
        console.log('Coluna grace_period_end não existe, usando apenas subscription_status e subscription_plan')
        updateData = { 
          subscription_status: 'active',
          subscription_plan: planType
        }
        
        const { error: retryError } = await supabase
          .from('professionals')
          .update(updateData)
          .eq('id', targetUserId)
        
        error = retryError
      }

      if (error) {
        console.error('Erro ao dar assinatura gratuita:', error)
        return NextResponse.json({ error: 'Erro ao dar assinatura gratuita: ' + error.message }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: `Assinatura ${planType} gratuita de ${months} meses concedida até ${endDate.toLocaleDateString('pt-BR')}` 
      })

    } else if (action === 'give_grace_period') {
      // Conceder período de graça
      const graceDays = days || 7
      const graceEndDate = new Date()
      graceEndDate.setDate(graceEndDate.getDate() + graceDays)
      
      console.log('Concedendo período de graça:', { userId, graceDays, graceEndDate: graceEndDate.toISOString() })
      
      // Primeiro tentar com grace_period_end, se falhar, tentar sem
      let updateData: Record<string, unknown> = { 
        subscription_status: 'active',
        grace_period_end: graceEndDate.toISOString()
      }
      
      let { error } = await supabase
        .from('professionals')
        .update(updateData)
        .eq('id', userId)

      // Se erro por coluna não existir, tentar sem grace_period_end
      if (error && error.message?.includes('grace_period_end')) {
        console.log('Coluna grace_period_end não existe, usando apenas subscription_status')
        updateData = { subscription_status: 'active' }
        
        const { error: retryError } = await supabase
          .from('professionals')
          .update(updateData)
          .eq('id', userId)
        
        error = retryError
      }

      if (error) {
        console.error('Erro ao conceder período de graça:', error)
        return NextResponse.json({ error: 'Erro ao conceder período de graça: ' + error.message }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: `Período de graça de ${graceDays} dias concedido com sucesso até ${graceEndDate.toLocaleDateString('pt-BR')}` 
      })

    } else if (action === 'reset_password') {
      // Resetar senha do usuário
      if (!userId) {
        return NextResponse.json({ error: 'ID do usuário é obrigatório' }, { status: 400 })
      }

      // Gerar nova senha temporária
      const newPassword = 'HerbaLead2024!'
      
      console.log('Resetando senha para usuário:', userId)
      
      // Resetar senha usando Supabase Admin
      const { data, error } = await supabase.auth.admin.updateUserById(
        userId,
        { password: newPassword }
      )

      if (error) {
        console.error('Erro ao resetar senha:', error)
        return NextResponse.json({ error: 'Erro ao resetar senha: ' + error.message }, { status: 500 })
      }

      return NextResponse.json({ 
        success: true, 
        message: `Senha resetada com sucesso! Nova senha: ${newPassword}` 
      })

    } else {
      return NextResponse.json({ error: 'Ação não reconhecida' }, { status: 400 })
    }

  } catch (error) {
    console.error('Erro na API administrativa:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
