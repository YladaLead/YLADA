/**
 * Script para verificar se o usuário oanfaol@gmail.com existe
 * e diagnosticar problemas de recuperação de senha
 * 
 * Uso: node scripts/verificar-usuario-oanfaol.js
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  console.error('Precisa de:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const EMAIL_BUSCADO = 'oanfaol@gmail.com'

async function verificarUsuario() {
  console.log('🔍 Verificando usuário:', EMAIL_BUSCADO)
  console.log('=' .repeat(60))

  try {
    // 1. Buscar em auth.users usando listUsers
    console.log('\n1️⃣ Buscando em auth.users (método atual do código)...')
    const { data: authUsers, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError)
    } else {
      console.log(`   Total de usuários retornados: ${authUsers?.users?.length || 0}`)
      
      const user = authUsers?.users?.find(u => 
        u.email?.toLowerCase() === EMAIL_BUSCADO.toLowerCase()
      )
      
      if (user) {
        console.log('   ✅ USUÁRIO ENCONTRADO (método atual):')
        console.log('      ID:', user.id)
        console.log('      Email:', user.email)
        console.log('      Email confirmado:', user.email_confirmed_at ? 'Sim' : 'Não')
        console.log('      Criado em:', user.created_at)
        console.log('      Último login:', user.last_sign_in_at || 'Nunca')
        console.log('      Deletado:', user.deleted_at ? `Sim (${user.deleted_at})` : 'Não')
      } else {
        console.log('   ❌ USUÁRIO NÃO ENCONTRADO (método atual)')
        console.log('   ⚠️  Isso explica por que a recuperação de senha não funciona!')
      }
    }

    // 2. Tentar buscar usando getUserByEmail (método recomendado)
    console.log('\n2️⃣ Buscando usando getUserByEmail (método recomendado)...')
    try {
      const { data: userData, error: getUserError } = await supabaseAdmin.auth.admin.getUserByEmail(
        EMAIL_BUSCADO.toLowerCase().trim()
      )
      
      if (getUserError) {
        console.log('   ❌ Erro:', getUserError.message)
        if (getUserError.message.includes('not found') || getUserError.message.includes('User not found')) {
          console.log('   ⚠️  Usuário não encontrado com este método também')
        }
      } else if (userData?.user) {
        console.log('   ✅ USUÁRIO ENCONTRADO (método recomendado):')
        console.log('      ID:', userData.user.id)
        console.log('      Email:', userData.user.email)
        console.log('      Email confirmado:', userData.user.email_confirmed_at ? 'Sim' : 'Não')
        console.log('      Criado em:', userData.user.created_at)
        console.log('      Deletado:', userData.user.deleted_at ? `Sim (${userData.user.deleted_at})` : 'Não')
      } else {
        console.log('   ❌ Usuário não encontrado')
      }
    } catch (err) {
      console.log('   ⚠️  Método getUserByEmail não disponível ou erro:', err.message)
    }

    // 3. Buscar em user_profiles
    console.log('\n3️⃣ Buscando em user_profiles...')
    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .ilike('email', EMAIL_BUSCADO)
    
    if (profileError) {
      console.error('   ❌ Erro:', profileError.message)
    } else if (profiles && profiles.length > 0) {
      console.log(`   ✅ Encontrado ${profiles.length} perfil(is):`)
      profiles.forEach((profile, index) => {
        console.log(`\n   Perfil ${index + 1}:`)
        console.log('      User ID:', profile.user_id)
        console.log('      Email:', profile.email)
        console.log('      Nome:', profile.nome_completo)
        console.log('      Perfil:', profile.perfil)
        console.log('      Criado em:', profile.created_at)
      })
    } else {
      console.log('   ❌ Nenhum perfil encontrado')
    }

    // 4. Verificar assinaturas
    console.log('\n4️⃣ Verificando assinaturas...')
    if (authUsers?.users) {
      for (const user of authUsers.users) {
        if (user.email?.toLowerCase() === EMAIL_BUSCADO.toLowerCase()) {
          const { data: subscriptions, error: subError } = await supabaseAdmin
            .from('subscriptions')
            .select('*')
            .eq('user_id', user.id)
          
          if (subError) {
            console.error('   ❌ Erro:', subError.message)
          } else if (subscriptions && subscriptions.length > 0) {
            console.log(`   ✅ Encontrada(s) ${subscriptions.length} assinatura(s):`)
            subscriptions.forEach((sub, index) => {
              console.log(`\n   Assinatura ${index + 1}:`)
              console.log('      ID:', sub.id)
              console.log('      Área:', sub.area)
              console.log('      Status:', sub.status)
              console.log('      Criada em:', sub.created_at)
            })
          } else {
            console.log('   ⚠️  Nenhuma assinatura encontrada')
          }
          break
        }
      }
    }

    // 5. Buscar emails similares
    console.log('\n5️⃣ Buscando emails similares (pode ter typo)...')
    const { data: similarUsers, error: similarError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (!similarError && similarUsers?.users) {
      const similares = similarUsers.users.filter(u => 
        u.email && (
          u.email.toLowerCase().includes('oan') ||
          u.email.toLowerCase().includes('faol')
        )
      )
      
      if (similares.length > 0) {
        console.log(`   ✅ Encontrado(s) ${similares.length} email(s) similar(es):`)
        similares.forEach(user => {
          console.log(`      - ${user.email} (ID: ${user.id})`)
        })
      } else {
        console.log('   ❌ Nenhum email similar encontrado')
      }
    }

    // 6. Resumo e diagnóstico
    console.log('\n' + '='.repeat(60))
    console.log('📊 RESUMO E DIAGNÓSTICO:')
    console.log('='.repeat(60))
    
    const userEncontrado = authUsers?.users?.find(u => 
      u.email?.toLowerCase() === EMAIL_BUSCADO.toLowerCase()
    )
    
    if (!userEncontrado) {
      console.log('❌ PROBLEMA IDENTIFICADO:')
      console.log('   O usuário NÃO foi encontrado em auth.users')
      console.log('   Isso explica por que a recuperação de senha não funciona.')
      console.log('\n💡 POSSÍVEIS CAUSAS:')
      console.log('   1. Usuário nunca foi criado')
      console.log('   2. Usuário foi deletado (soft delete)')
      console.log('   3. Email está diferente (typo, maiúsculas, espaços)')
      console.log('   4. listUsers() tem limite de paginação e não retornou todos os usuários')
      console.log('\n🔧 SOLUÇÃO RECOMENDADA:')
      console.log('   - Usar getUserByEmail() em vez de listUsers()')
      console.log('   - Verificar se o email está correto')
      console.log('   - Verificar se o usuário foi deletado')
    } else {
      console.log('✅ Usuário encontrado!')
      if (userEncontrado.deleted_at) {
        console.log('⚠️  MAS o usuário foi DELETADO em:', userEncontrado.deleted_at)
        console.log('   Isso pode impedir a recuperação de senha.')
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

verificarUsuario()
  .then(() => {
    console.log('\n✅ Verificação concluída!')
    process.exit(0)
  })
  .catch(error => {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  })
