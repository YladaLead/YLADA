#!/usr/bin/env node

/**
 * Script para atualizar o perfil da conta demo nutri
 * Alterar para "Dra. Ana" para ficar mais intuitivo
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Carregar variáveis de ambiente
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  const envLines = envContent.split('\n')
  
  envLines.forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim()
      process.env[key.trim()] = value
    }
  })
}

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function updateDemoProfile() {
  console.log('🔄 Atualizando perfil da Dra. Ana...')
  
  try {
    // Buscar usuário demo nutri
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
    const nutriUser = authUsers.users.find(u => u.email === 'demo.nutri@ylada.com')
    
    if (!nutriUser) {
      console.log('❌ Usuário demo.nutri@ylada.com não encontrado')
      return
    }
    
    console.log(`✅ Usuário encontrado: ${nutriUser.id}`)
    
    // Atualizar perfil
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .update({
        nome_completo: 'Dra. Ana'
      })
      .eq('user_id', nutriUser.id)
      .select()
    
    if (error) {
      console.error('❌ Erro ao atualizar perfil:', error.message)
      return
    }
    
    console.log('✅ Perfil atualizado com sucesso!')
    console.log('📋 Dados atualizados:')
    console.log('   Nome: Dra. Ana')
    console.log('   Email: demo.nutri@ylada.com')
    console.log('   Telefone: (11) 99999-1234')
    console.log('')
    console.log('🔑 Para trocar a senha:')
    console.log('   1. Acesse: http://localhost:3000/pt/nutri')
    console.log('   2. Faça login com: demo.nutri@ylada.com')
    console.log('   3. Vá em Configurações → Alterar Senha')
    console.log('   4. Ou use a senha atual: DemoYlada2024!')
    
  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

updateDemoProfile()
