/**
 * Cria conta de demonstração para revisores da Apple App Store
 * Rodar: node scripts/create-demo-account.mjs
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: resolve(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const DEMO_EMAIL = 'reviewer@ylada.com'
const DEMO_PASSWORD = 'Review2026!'

async function createDemoAccount() {
  console.log('🔧 Criando conta demo para revisor Apple...\n')

  // Verificar se já existe
  const { data: existing } = await supabase.auth.admin.listUsers()
  const alreadyExists = existing?.users?.find(u => u.email === DEMO_EMAIL)

  if (alreadyExists) {
    console.log('⚠️  Conta já existe. Atualizando senha...')
    const { error } = await supabase.auth.admin.updateUserById(alreadyExists.id, {
      password: DEMO_PASSWORD,
      email_confirm: true,
    })
    if (error) {
      console.error('❌ Erro ao atualizar senha:', error.message)
      process.exit(1)
    }
    console.log('✅ Senha atualizada com sucesso!\n')
  } else {
    // Criar nova conta confirmada (sem precisar de email de verificação)
    const { data, error } = await supabase.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
      user_metadata: {
        nome: 'App Reviewer',
        tipo_conta: 'demo',
        criado_por: 'script-apple-review'
      }
    })

    if (error) {
      console.error('❌ Erro ao criar conta:', error.message)
      process.exit(1)
    }

    console.log('✅ Conta criada com sucesso!')
    console.log('   ID:', data.user.id)
    console.log('   Email confirmado:', data.user.email_confirmed_at ? 'Sim' : 'Não')
    console.log()
  }

  // Testar login
  console.log('🔐 Testando login...')
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
  })

  if (loginError) {
    console.error('❌ Erro no login de teste:', loginError.message)
    process.exit(1)
  }

  console.log('✅ Login funcionando!\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  CREDENCIAIS PARA O APP STORE CONNECT:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`  Email:  ${DEMO_EMAIL}`)
  console.log(`  Senha:  ${DEMO_PASSWORD}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log()
  console.log('📋 PRÓXIMO PASSO:')
  console.log('   No App Store Connect → YLADA → Distribuição')
  console.log('   → Informações de revisão do app')
  console.log('   → Informações de login')
  console.log(`   → Nome de usuário: ${DEMO_EMAIL}`)
  console.log(`   → Senha: ${DEMO_PASSWORD}`)
  console.log()

  process.exit(0)
}

createDemoAccount()
