/**
 * Script para preencher dados completos dos usuários migrados
 * Combina dados do CSV (nome, telefone) com JSON (expiração, plano)
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Ler CSV
const csvPath = path.join(process.cwd(), '..', 'Desktop', 'migrados.csv')
let csvContent: string
try {
  csvContent = fs.readFileSync(csvPath, 'utf-8')
} catch (error) {
  console.error('❌ Erro ao ler CSV. Verifique se o arquivo está em ~/Desktop/migrados.csv')
  process.exit(1)
}

// Parse CSV
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  delimiter: ';',
  trim: true,
  bom: true // Suportar BOM do Excel
})

// Ler JSON com dados de assinatura
const jsonPath = path.join(process.cwd(), 'scripts', 'import-users-migration.json')
const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))

// Função para limpar telefone (remover formatação científica e caracteres não numéricos)
function limparTelefone(telefone: string | null | undefined): string | null {
  if (!telefone || telefone === 'null' || telefone === '' || telefone === 'undefined') {
    return null
  }

  // Se está em notação científica (ex: 5,51998E+12 ou 5.51998E+12)
  if (telefone.includes('E+') || telefone.includes('e+') || telefone.includes('E-') || telefone.includes('e-')) {
    try {
      // Substituir vírgula por ponto para parseFloat
      const numStr = telefone.replace(',', '.')
      const num = parseFloat(numStr)
      if (!isNaN(num) && isFinite(num)) {
        // Converter para inteiro e depois string
        const telefoneLimpo = Math.round(num).toString()
        // Se o número está muito grande (notação científica), pode estar truncado
        // Tentar reconstruir o número completo
        if (telefoneLimpo.length < 10) {
          // Se o número parece incompleto, retornar null
          return null
        }
        return telefoneLimpo
      }
    } catch (e) {
      // Se falhar, continuar com limpeza normal
    }
  }

  // Remover tudo que não é número
  const limpo = telefone.replace(/\D/g, '')
  return limpo.length > 0 ? limpo : null
}

// Mapeamento de emails que podem estar diferentes entre CSV e JSON
const emailMapping: Record<string, string> = {
  'vidasaudavelaracy@gmail.com': 'aracy.vidasaudavelaracy@gmail.com',
  'cbatis@terra.com.br': 'cbatista@terra.com.br'
}

// Função para normalizar email
function normalizarEmail(email: string): string {
  return email.toLowerCase().trim()
}

async function preencherDados() {
  console.log('🚀 Iniciando preenchimento de dados dos usuários migrados...\n')

  let sucesso = 0
  let erros = 0
  const errosDetalhados: Array<{ email: string; erro: string }> = []

  for (const record of records) {
    // Mapear campos do CSV (pode ter espaços ou variações)
    let email = normalizarEmail(record['E-mail'] || record['email'] || record['E-mail '] || '')
    const nomeCompleto = (record['Nome completo'] || record['Nome completo '] || record['name'] || '').trim()
    const telefoneRaw = record['Telefone'] || record['Telefone '] || record['telefone'] || null
    const telefone = limparTelefone(telefoneRaw)

    if (!email || !email.includes('@')) {
      console.warn(`⚠️ Email inválido: ${email}`)
      erros++
      continue
    }

    // Aplicar mapeamento de emails se necessário
    if (emailMapping[email]) {
      email = emailMapping[email]
    }

    // Buscar dados de assinatura no JSON (tentar email original e mapeado)
    let dadosAssinatura = jsonData.find((u: any) => 
      normalizarEmail(u.email) === email
    )

    // Se não encontrou, tentar com email original do CSV
    if (!dadosAssinatura) {
      const emailOriginal = normalizarEmail(record['E-mail'] || record['email'] || record['E-mail '] || '')
      dadosAssinatura = jsonData.find((u: any) => 
        normalizarEmail(u.email) === emailOriginal
      )
    }

    if (!dadosAssinatura) {
      console.warn(`⚠️ Dados de assinatura não encontrados para: ${email}`)
      erros++
      errosDetalhados.push({ email, erro: 'Dados de assinatura não encontrados no JSON' })
      continue
    }

    try {
      // 1. Buscar usuário no auth.users
      const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers()
      if (userError) {
        throw new Error(`Erro ao listar usuários: ${userError.message}`)
      }

      const user = users.users.find(u => 
        u.email && normalizarEmail(u.email) === email
      )

      if (!user) {
        console.warn(`⚠️ Usuário não encontrado no auth.users: ${email}`)
        erros++
        errosDetalhados.push({ email, erro: 'Usuário não encontrado no auth.users' })
        continue
      }

      console.log(`\n📝 Processando: ${email}`)
      console.log(`   Nome: ${nomeCompleto}`)
      console.log(`   Telefone: ${telefone || 'não informado'}`)
      console.log(`   Plano: ${dadosAssinatura.plan_type}`)
      console.log(`   Expira: ${dadosAssinatura.expires_at}`)

      // 2. Atualizar/Criar user_profiles
      const profileData: any = {
        user_id: user.id,
        email: email,
        nome_completo: nomeCompleto || dadosAssinatura.name || email.split('@')[0],
        whatsapp: telefone,
        perfil: 'wellness',
        profession: 'coach herbalife',
        country_code: telefone ? (telefone.startsWith('55') ? 'BR' : telefone.startsWith('1') ? 'US' : 'BR') : 'BR',
        updated_at: new Date().toISOString()
      }

      const { data: profile, error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .upsert(profileData, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        })
        .select()
        .single()

      if (profileError) {
        throw new Error(`Erro ao salvar perfil: ${profileError.message}`)
      }

      console.log(`   ✅ Perfil atualizado`)

      // 3. Atualizar/Criar assinatura
      const subscriptionData = {
        user_id: user.id,
        area: 'wellness',
        plan_type: dadosAssinatura.plan_type,
        status: new Date(dadosAssinatura.expires_at) > new Date() ? 'active' : 'expired',
        current_period_end: dadosAssinatura.expires_at,
        is_migrated: true,
        migrated_from: dadosAssinatura.migrated_from || 'herbalead',
        requires_manual_renewal: true,
        updated_at: new Date().toISOString()
      }

      // Verificar se já existe assinatura
      const { data: existingSub } = await supabaseAdmin
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle()

      let subscription
      if (existingSub) {
        const { data: updatedSub, error: subError } = await supabaseAdmin
          .from('subscriptions')
          .update(subscriptionData)
          .eq('user_id', user.id)
          .select()
          .single()

        if (subError) {
          throw new Error(`Erro ao atualizar assinatura: ${subError.message}`)
        }
        subscription = updatedSub
        console.log(`   ✅ Assinatura atualizada`)
      } else {
        const { data: newSub, error: subError } = await supabaseAdmin
          .from('subscriptions')
          .insert(subscriptionData)
          .select()
          .single()

        if (subError) {
          throw new Error(`Erro ao criar assinatura: ${subError.message}`)
        }
        subscription = newSub
        console.log(`   ✅ Assinatura criada`)
      }

      sucesso++
      console.log(`   ✅ Completo!\n`)

    } catch (error: any) {
      console.error(`   ❌ Erro: ${error.message}\n`)
      erros++
      errosDetalhados.push({ email, erro: error.message })
    }
  }

  // Resumo
  console.log('\n' + '='.repeat(60))
  console.log('📊 RESUMO')
  console.log('='.repeat(60))
  console.log(`✅ Sucesso: ${sucesso}`)
  console.log(`❌ Erros: ${erros}`)
  console.log(`📝 Total processado: ${records.length}`)

  if (errosDetalhados.length > 0) {
    console.log('\n❌ ERROS DETALHADOS:')
    errosDetalhados.forEach(({ email, erro }) => {
      console.log(`   - ${email}: ${erro}`)
    })
  }

  console.log('\n✅ Processo concluído!')
}

// Executar
preencherDados()
  .then(() => {
    console.log('\n🎉 Script finalizado com sucesso!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error)
    process.exit(1)
  })

