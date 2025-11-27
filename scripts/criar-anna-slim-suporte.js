/**
 * Script para criar usuário de suporte: Anna Slim
 * Email: portalmagra@gmail.com
 * Nome: Anna Slim
 * Senha: 123456
 * Área: Coach (mas com acesso a todas as áreas via is_support = true)
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

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

async function criarAnnaSlim() {
  try {
    const email = 'portalmagra@gmail.com'
    const password = '123456'
    const nomeCompleto = 'Anna Slim'
    const perfil = 'coach' // Área Coach

    console.log('🔧 Criando usuário de suporte: Anna Slim...')
    console.log(`📧 Email: ${email}`)
    console.log(`👤 Nome: ${nomeCompleto}`)
    console.log(`🎯 Área: ${perfil}`)
    console.log(`🔐 Senha: ${password}`)
    console.log('')

    // Verificar se o usuário já existe
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(
      u => u.email?.toLowerCase() === email.toLowerCase()
    )

    if (existingUser) {
      console.log('⚠️ Usuário já existe! Atualizando perfil...')
      
      // Atualizar perfil para suporte
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: existingUser.id,
          email: email,
          nome_completo: nomeCompleto,
          perfil: perfil,
          is_admin: false,
          is_support: true, // Acesso a todas as áreas
          bio: 'Suporte',
          country_code: 'BR',
          user_slug: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single()

      if (profileError) {
        console.error('❌ Erro ao atualizar perfil:', profileError)
        return
      }

      console.log('✅ Perfil atualizado com sucesso!')
      console.log('')
      console.log('📋 INFORMAÇÕES DO USUÁRIO:')
      console.log(`   ID: ${existingUser.id}`)
      console.log(`   Email: ${existingUser.email}`)
      console.log(`   Nome: ${nomeCompleto}`)
      console.log(`   Área: ${perfil}`)
      console.log(`   Suporte: ✅ Sim (acesso a todas as áreas)`)
      console.log(`   Admin: ❌ Não`)
      console.log('')
      console.log('🔗 Links de acesso:')
      console.log(`   Coach: https://www.ylada.com/pt/coach/login`)
      console.log(`   Nutri: https://www.ylada.com/pt/nutri/login`)
      console.log(`   Wellness: https://www.ylada.com/pt/wellness/login`)
      return
    }

    // Criar novo usuário
    console.log('🆕 Criando novo usuário...')
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Confirmar email automaticamente
      user_metadata: {
        full_name: nomeCompleto,
        name: nomeCompleto,
        perfil: perfil
      }
    })

    if (createError) {
      console.error('❌ Erro ao criar usuário:', createError.message)
      return
    }

    if (!newUser.user) {
      console.error('❌ Usuário não foi criado')
      return
    }

    console.log('✅ Usuário criado no Supabase Auth!')

    // Criar perfil com is_support = true
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: newUser.user.id,
        email: email,
        nome_completo: nomeCompleto,
        perfil: perfil,
        is_admin: false,
        is_support: true, // Acesso a todas as áreas
        bio: 'Suporte',
        country_code: 'BR',
        user_slug: email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
      })
      .select()
      .single()

    if (profileError) {
      console.error('❌ Erro ao criar perfil:', profileError)
      // Tentar deletar o usuário criado
      await supabase.auth.admin.deleteUser(newUser.user.id)
      return
    }

    console.log('✅ Perfil criado com sucesso!')
    console.log('')
    console.log('🎉 USUÁRIO DE SUPORTE CRIADO COM SUCESSO!')
    console.log('')
    console.log('📋 INFORMAÇÕES DO USUÁRIO:')
    console.log(`   ID: ${newUser.user.id}`)
    console.log(`   Email: ${newUser.user.email}`)
    console.log(`   Nome: ${nomeCompleto}`)
    console.log(`   Área: ${perfil}`)
    console.log(`   Senha: ${password}`)
    console.log(`   Suporte: ✅ Sim (acesso a todas as áreas)`)
    console.log(`   Admin: ❌ Não`)
    console.log('')
    console.log('🔗 Links de acesso:')
    console.log(`   Coach: https://www.ylada.com/pt/coach/login`)
    console.log(`   Nutri: https://www.ylada.com/pt/nutri/login`)
    console.log(`   Wellness: https://www.ylada.com/pt/wellness/login`)
    console.log('')
    console.log('⚠️ IMPORTANTE: A senha deve ser alterada após o primeiro login!')

  } catch (error) {
    console.error('❌ Erro geral:', error.message)
  }
}

criarAnnaSlim()


