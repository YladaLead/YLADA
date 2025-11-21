/**
 * Script para criar contas Coach com senhas provisórias
 * 
 * Executar: node scripts/criar-contas-coach-com-senha-provisoria.js
 * 
 * Requer: SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erro: NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY devem estar definidos no .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Emails e informações dos usuários
const usuarios = [
  {
    email: 'amandabonfogo01@gmail.com',
    nome: 'Amanda Bonfogo',
    senhaProvisoria: 'Coach2024!Amanda'
  },
  {
    email: 'naytenutri@gmail.com',
    nome: 'Nayte Nutri',
    senhaProvisoria: 'Coach2024!Nayte'
  },
  {
    email: 'deisefaula@gmail.com',
    nome: 'Deise Faula',
    senhaProvisoria: 'Coach2024!Deise'
  }
]

const AREA = 'coach'
const DIAS_VALIDADE = 365 // 1 ano

async function criarOuAtualizarUsuario(email, nome, senhaProvisoria) {
  console.log(`\n📧 Processando: ${email}`)
  
  try {
    // 1. Verificar se usuário já existe
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error(`❌ Erro ao listar usuários:`, listError)
      return { success: false, error: listError }
    }

    const existingUser = existingUsers.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    
    let userId
    let userCreated = false

    if (existingUser) {
      console.log(`   ✅ Usuário já existe: ${existingUser.id}`)
      userId = existingUser.id
      
      // Atualizar senha para a provisória
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        { password: senhaProvisoria }
      )
      
      if (updateError) {
        console.error(`   ⚠️  Erro ao atualizar senha:`, updateError)
      } else {
        console.log(`   ✅ Senha atualizada para provisória`)
      }
    } else {
      // Criar novo usuário
      console.log(`   🆕 Criando novo usuário...`)
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: email.toLowerCase(),
        password: senhaProvisoria,
        email_confirm: true, // Confirmar email automaticamente
        user_metadata: {
          nome_completo: nome,
          area: AREA
        }
      })

      if (createError) {
        console.error(`   ❌ Erro ao criar usuário:`, createError)
        return { success: false, error: createError }
      }

      userId = newUser.user.id
      userCreated = true
      console.log(`   ✅ Usuário criado: ${userId}`)

      // Criar perfil em user_profiles
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          email: email.toLowerCase(),
          nome_completo: nome,
          perfil: AREA,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })

      if (profileError) {
        console.error(`   ⚠️  Erro ao criar perfil:`, profileError)
      } else {
        console.log(`   ✅ Perfil criado/atualizado`)
      }
    }

    // 2. Verificar se já tem assinatura ativa
    const { data: existingSub, error: subCheckError } = await supabase
      .from('subscriptions')
      .select('id, current_period_end, status')
      .eq('user_id', userId)
      .eq('area', AREA)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle()

    if (subCheckError && subCheckError.code !== 'PGRST116') {
      console.error(`   ⚠️  Erro ao verificar assinatura:`, subCheckError)
    }

    if (existingSub) {
      console.log(`   ✅ Assinatura já existe e está ativa até ${existingSub.current_period_end}`)
      return { 
        success: true, 
        userId, 
        userCreated,
        subscriptionExists: true,
        email,
        senhaProvisoria
      }
    }

    // 3. Criar assinatura de 1 ano
    const now = new Date()
    const periodStart = now.toISOString()
    const periodEnd = new Date(now.getTime() + DIAS_VALIDADE * 24 * 60 * 60 * 1000).toISOString()

    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        area: AREA,
        plan_type: 'annual',
        stripe_account: 'br',
        stripe_subscription_id: `manual_${userId}_${AREA}_${Date.now()}`,
        stripe_customer_id: `manual_${userId}`,
        stripe_price_id: 'manual',
        amount: 0, // Gratuito
        currency: 'brl',
        status: 'active',
        current_period_start: periodStart,
        current_period_end: periodEnd,
        cancel_at_period_end: false
      })
      .select()
      .single()

    if (subError) {
      console.error(`   ❌ Erro ao criar assinatura:`, subError)
      return { success: false, error: subError }
    }

    console.log(`   ✅ Assinatura criada! Válida até ${periodEnd}`)

    return {
      success: true,
      userId,
      userCreated,
      subscriptionId: subscription.id,
      email,
      senhaProvisoria,
      periodEnd
    }

  } catch (error) {
    console.error(`   ❌ Erro inesperado:`, error)
    return { success: false, error }
  }
}

async function main() {
  console.log('🚀 Iniciando criação de contas Coach com senhas provisórias...\n')
  console.log(`📋 Total de usuários: ${usuarios.length}`)
  console.log(`📅 Validade: ${DIAS_VALIDADE} dias (1 ano)\n`)

  const resultados = []

  for (const usuario of usuarios) {
    const resultado = await criarOuAtualizarUsuario(
      usuario.email,
      usuario.nome,
      usuario.senhaProvisoria
    )
    resultados.push(resultado)
  }

  // Resumo
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMO')
  console.log('='.repeat(60))

  const sucessos = resultados.filter(r => r.success)
  const falhas = resultados.filter(r => !r.success)

  console.log(`\n✅ Sucessos: ${sucessos.length}`)
  sucessos.forEach(r => {
    console.log(`   • ${r.email}`)
    console.log(`     Senha: ${r.senhaProvisoria}`)
    if (r.userCreated) {
      console.log(`     🆕 Usuário criado`)
    } else {
      console.log(`     🔄 Usuário já existia`)
    }
    if (r.subscriptionExists) {
      console.log(`     ✅ Assinatura já existia`)
    } else {
      console.log(`     🆕 Assinatura criada`)
    }
  })

  if (falhas.length > 0) {
    console.log(`\n❌ Falhas: ${falhas.length}`)
    falhas.forEach(r => {
      console.log(`   • ${r.email || 'N/A'}`)
      console.log(`     Erro: ${r.error?.message || 'Erro desconhecido'}`)
    })
  }

  console.log('\n' + '='.repeat(60))
  console.log('📧 MENSAGEM PARA ENVIAR AOS USUÁRIOS:')
  console.log('='.repeat(60))
  console.log(`
Olá!

Sua conta na área Coach da YLADA foi criada/atualizada com sucesso!

📧 Email: [EMAIL]
🔑 Senha provisória: [SENHA]

⚠️ IMPORTANTE: Por favor, altere sua senha após o primeiro login.

🔗 Acesse: https://www.ylada.com/pt/coach/login

Sua assinatura está ativa por 1 ano a partir de hoje.

Qualquer dúvida, entre em contato!

Equipe YLADA
  `)

  console.log('\n✅ Processo concluído!')
}

main().catch(console.error)

