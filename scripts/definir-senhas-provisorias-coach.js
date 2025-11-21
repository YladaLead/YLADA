/**
 * Script para definir senhas provisórias para os três usuários Coach
 * 
 * Executar: node scripts/definir-senhas-provisorias-coach.js
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

// Emails e senhas provisórias
const usuarios = [
  {
    email: 'amandabonfogo01@gmail.com',
    nome: 'Amanda Bonfogo',
    senhaProvisoria: 'Coach2024!Amanda'
  },
  {
    email: 'naytenutri@gmail.com',
    nome: 'Nayara Fernandes',
    senhaProvisoria: 'Coach2024!Nayte'
  },
  {
    email: 'deisefaula@gmail.com',
    nome: 'Deise Faula',
    senhaProvisoria: 'Coach2024!Deise'
  }
]

async function definirSenhaProvisoria(email, nome, senhaProvisoria) {
  console.log(`\n📧 Processando: ${email}`)
  
  try {
    // 1. Buscar usuário pelo email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error(`❌ Erro ao listar usuários:`, listError)
      return { success: false, error: listError }
    }

    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    
    if (!user) {
      console.error(`❌ Usuário não encontrado: ${email}`)
      return { success: false, error: 'Usuário não encontrado' }
    }

    console.log(`   ✅ Usuário encontrado: ${user.id}`)

    // 2. Atualizar senha
    const { data: updatedUser, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password: senhaProvisoria }
    )

    if (updateError) {
      console.error(`   ❌ Erro ao atualizar senha:`, updateError)
      return { success: false, error: updateError }
    }

    console.log(`   ✅ Senha atualizada com sucesso!`)

    // 3. Verificar assinatura
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('id, status, current_period_end')
      .eq('user_id', user.id)
      .eq('area', 'coach')
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .maybeSingle()

    if (subError) {
      console.error(`   ⚠️  Erro ao verificar assinatura:`, subError)
    } else if (subscription) {
      console.log(`   ✅ Assinatura ativa até ${subscription.current_period_end}`)
    } else {
      console.log(`   ⚠️  Nenhuma assinatura ativa encontrada`)
    }

    return {
      success: true,
      userId: user.id,
      email,
      nome,
      senhaProvisoria,
      subscription: subscription ? {
        id: subscription.id,
        periodEnd: subscription.current_period_end
      } : null
    }

  } catch (error) {
    console.error(`   ❌ Erro inesperado:`, error)
    return { success: false, error }
  }
}

async function main() {
  console.log('🔑 Definindo senhas provisórias para contas Coach...\n')
  console.log(`📋 Total de usuários: ${usuarios.length}\n`)

  const resultados = []

  for (const usuario of usuarios) {
    const resultado = await definirSenhaProvisoria(
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

  console.log(`\n✅ Senhas atualizadas: ${sucessos.length}`)
  sucessos.forEach(r => {
    console.log(`\n   📧 ${r.email}`)
    console.log(`   👤 ${r.nome}`)
    console.log(`   🔑 Senha: ${r.senhaProvisoria}`)
    if (r.subscription) {
      console.log(`   ✅ Assinatura ativa até ${r.subscription.periodEnd}`)
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
  console.log('📧 MENSAGENS PARA ENVIAR:')
  console.log('='.repeat(60))

  sucessos.forEach(r => {
    console.log(`\n--- Mensagem para ${r.nome} ---`)
    console.log(`
Olá ${r.nome}!

Sua conta na área Coach da YLADA está pronta!

📧 Email: ${r.email}
🔑 Senha provisória: ${r.senhaProvisoria}

⚠️ IMPORTANTE: Por favor, altere sua senha após o primeiro login.

🔗 Acesse: https://www.ylada.com/pt/coach/login

Sua assinatura está ativa por 1 ano a partir de hoje.

Qualquer dúvida, entre em contato!

Equipe YLADA
    `)
  })

  console.log('\n✅ Processo concluído!')
  console.log('\n💡 Próximos passos:')
  console.log('   1. Envie as mensagens acima para cada pessoa')
  console.log('   2. Elas podem fazer login com as senhas provisórias')
  console.log('   3. Elas devem alterar a senha no primeiro acesso')
}

main().catch(console.error)

