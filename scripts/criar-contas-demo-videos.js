#!/usr/bin/env node

/**
 * Script para criar contas demo para vídeos de demonstração da plataforma.
 * Cria: demo.med@ylada.app, demo.psi@ylada.app, demo.vendedor@ylada.app
 * Senha: Demo@2025!
 *
 * Execute: node scripts/criar-contas-demo-videos.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Carregar variáveis de ambiente do .env.local
const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=')
    if (key && valueParts.length > 0) {
      process.env[key.trim()] = valueParts.join('=').trim()
    }
  })
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no .env.local')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const PASSWORD = 'Demo@2025!'

const DEMO_ACCOUNTS = [
  {
    email: 'demo.med@ylada.app',
    nome: 'Dr. Demo Medicina',
    perfil: 'med',
    noelProfile: {
      segment: 'med',
      profile_type: 'liberal',
      profession: 'medico',
      category: 'medicina',
      tempo_atuacao_anos: 8,
      dor_principal: 'agenda_instavel',
      prioridade_atual: 'Preencher agenda e organizar divulgação',
      fase_negocio: 'em_crescimento',
      metas_principais: 'Aumentar número de consultas e ter mais indicações',
      objetivos_curto_prazo: 'Criar rotina de posts e usar um link para qualificar quem quer agendar',
      modelo_atuacao: ['consultorio', 'online'],
      capacidade_semana: 25,
      ticket_medio: 350,
      modelo_pagamento: 'convenio',
      canais_principais: ['instagram', 'indicacao'],
      rotina_atual_resumo: 'Atendo 3–4 dias por semana, pouco tempo para divulgar',
      area_specific: { especialidades: ['clinica_geral'], temas_atuacao: ['emagrecimento', 'intestino', 'alimentacao'] }
    }
  },
  {
    email: 'demo.psi@ylada.app',
    nome: 'Dra. Demo Psicologia',
    perfil: 'psi',
    noelProfile: {
      segment: 'psi',
      profile_type: 'liberal',
      profession: 'psi',
      category: 'psicologia',
      tempo_atuacao_anos: 5,
      dor_principal: 'sem_indicacao',
      prioridade_atual: 'Aumentar indicações e visibilidade',
      fase_negocio: 'estabilizado',
      metas_principais: 'Manter agenda estável e captar pacientes qualificados',
      objetivos_curto_prazo: 'Ferramenta com diagnóstico para engajar no Instagram',
      modelo_atuacao: ['consultorio', 'online'],
      capacidade_semana: 18,
      ticket_medio: 200,
      modelo_pagamento: 'particular',
      canais_principais: ['instagram', 'indicacao'],
      rotina_atual_resumo: 'Atendo presencial e online, quero link para quem busca terapia',
      area_specific: { temas_atuacao: ['ansiedade', 'sono', 'autoconhecimento'] }
    }
  },
  {
    email: 'demo.vendedor@ylada.app',
    nome: 'Demo Vendedor Nutra',
    perfil: 'nutra',
    noelProfile: {
      segment: 'nutra',
      profile_type: 'vendas',
      profession: 'vendedor_suplementos',
      category: 'nutra',
      tempo_atuacao_anos: 2,
      dor_principal: 'nao_converte',
      prioridade_atual: 'Fechar mais vendas e reconectar leads',
      fase_negocio: 'iniciante',
      metas_principais: 'Aumentar recorrência e ticket médio',
      objetivos_curto_prazo: 'Usar calculadora e quiz para engajar leads',
      modelo_atuacao: null,
      capacidade_semana: 15,
      ticket_medio: 180,
      modelo_pagamento: 'comissao',
      canais_principais: ['whatsapp', 'instagram'],
      rotina_atual_resumo: 'Vendo por WhatsApp e redes, quero ferramentas para qualificar',
      area_specific: { canal_principal_vendas: 'whatsapp', temas_atuacao: ['b12_vitaminas', 'energia', 'emagrecimento'] }
    }
  }
]

async function createDemoUser(email, password) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: email.split('@')[0] }
  })
  if (error) {
    console.error(`❌ Erro ao criar usuário ${email}:`, error.message)
    return null
  }
  console.log(`✅ Usuário criado: ${email}`)
  return data.user
}

async function createOrUpdateUserProfile(userId, email, nome, perfil) {
  const { data: existing } = await supabaseAdmin
    .from('user_profiles')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle()

  const payload = {
    user_id: userId,
    email,
    nome_completo: nome,
    perfil
  }

  if (existing) {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .update(payload)
      .eq('user_id', userId)
      .select()
      .single()
    if (error) {
      console.error(`❌ Erro ao atualizar perfil ${email}:`, error.message)
      return null
    }
    console.log(`✅ Perfil atualizado: ${nome}`)
    return data
  }

  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .insert(payload)
    .select()
    .single()
  if (error) {
    console.error(`❌ Erro ao criar perfil ${email}:`, error.message)
    return null
  }
  console.log(`✅ Perfil criado: ${nome}`)
  return data
}

async function createOrUpdateNoelProfile(userId, noelProfile) {
  const row = {
    user_id: userId,
    segment: noelProfile.segment,
    profile_type: noelProfile.profile_type,
    profession: noelProfile.profession,
    category: noelProfile.category,
    tempo_atuacao_anos: noelProfile.tempo_atuacao_anos,
    dor_principal: noelProfile.dor_principal,
    prioridade_atual: noelProfile.prioridade_atual,
    fase_negocio: noelProfile.fase_negocio,
    metas_principais: noelProfile.metas_principais,
    objetivos_curto_prazo: noelProfile.objetivos_curto_prazo,
    modelo_atuacao: noelProfile.modelo_atuacao,
    capacidade_semana: noelProfile.capacidade_semana,
    ticket_medio: noelProfile.ticket_medio,
    modelo_pagamento: noelProfile.modelo_pagamento,
    canais_principais: noelProfile.canais_principais,
    rotina_atual_resumo: noelProfile.rotina_atual_resumo,
    area_specific: noelProfile.area_specific
  }

  const { data, error } = await supabaseAdmin
    .from('ylada_noel_profile')
    .upsert(row, { onConflict: 'user_id,segment' })
    .select()
    .single()

  if (error) {
    console.error(`❌ Erro ao criar perfil Noel (${noelProfile.segment}):`, error.message)
    return null
  }
  console.log(`✅ Perfil Noel criado/atualizado: ${noelProfile.segment}`)
  return data
}

async function main() {
  console.log('\n🎬 Criando contas demo para vídeos...\n')

  for (const account of DEMO_ACCOUNTS) {
    console.log(`\n--- ${account.email} (${account.perfil}) ---`)

    // Verificar se usuário já existe
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existing = existingUsers?.users?.find(u => u.email?.toLowerCase() === account.email.toLowerCase())

    let userId
    if (existing) {
      console.log(`⚠️ Usuário já existe, atualizando perfil...`)
      userId = existing.id
    } else {
      const user = await createDemoUser(account.email, PASSWORD)
      if (!user) continue
      userId = user.id
    }

    await createOrUpdateUserProfile(userId, account.email, account.nome, account.perfil)
    await createOrUpdateNoelProfile(userId, account.noelProfile)
  }

  console.log('\n✅ Concluído!\n')
  console.log('📧 Contas criadas:')
  console.log('   demo.med@ylada.app      → Médico (liberal)')
  console.log('   demo.psi@ylada.app      → Psicólogo (liberal)')
  console.log('   demo.vendedor@ylada.app → Vendedor Nutra')
  console.log('\n🔐 Senha para todas: Demo@2025!\n')
}

main().catch(err => {
  console.error('❌ Erro:', err)
  process.exit(1)
})
