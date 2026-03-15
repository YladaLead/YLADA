#!/usr/bin/env node

/**
 * Script para criar contas demo para vídeos de demonstração da plataforma.
 * Cria: demo.med, demo.psi, demo.vendedor (vendas em gerais), demo.nutra, demo.nutri, demo.coach, demo.estetica, demo.perfumaria
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
    nome: 'Demo Vendedor (vendas em gerais)',
    perfil: 'seller',
    noelProfile: {
      segment: 'seller',
      profile_type: 'vendas',
      profession: 'vendedor',
      category: 'vendas',
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
      area_specific: { canal_principal_vendas: 'whatsapp', temas_atuacao: ['vendas_gerais'] }
    }
  },
  {
    email: 'demo.nutra@ylada.app',
    nome: 'Demo Nutra',
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
  },
  {
    email: 'demo.estetica@ylada.app',
    nome: 'Demo Esteticista',
    perfil: 'estetica',
    noelProfile: {
      segment: 'estetica',
      profile_type: 'liberal',
      profession: 'estetica',
      category: 'estetica',
      tempo_atuacao_anos: 4,
      dor_principal: 'agenda_vazia',
      prioridade_atual: 'Captar clientes e divulgar tratamentos',
      fase_negocio: 'em_crescimento',
      metas_principais: 'Preencher agenda e qualificar leads',
      objetivos_curto_prazo: 'Link com diagnóstico de pele ou autocuidado para engajar',
      modelo_atuacao: ['consultorio'],
      capacidade_semana: 25,
      ticket_medio: 180,
      modelo_pagamento: 'particular',
      canais_principais: ['instagram', 'whatsapp'],
      rotina_atual_resumo: 'Clínica de estética, quero ferramentas para captar e qualificar',
      area_specific: { temas_atuacao: ['pele', 'skincare', 'autocuidado', 'retencao'] }
    }
  },
  {
    email: 'demo.nutri@ylada.app',
    nome: 'Dra. Demo Nutricionista',
    perfil: 'nutri',
    noelProfile: {
      segment: 'ylada',
      profile_type: 'liberal',
      profession: 'nutricionista',
      category: 'nutricao',
      tempo_atuacao_anos: 5,
      dor_principal: 'agenda_vazia',
      prioridade_atual: 'Captar mais pacientes e usar quiz/calculadora',
      fase_negocio: 'em_crescimento',
      metas_principais: 'Preencher agenda e ter diagnóstico para entregar valor',
      objetivos_curto_prazo: 'Link com diagnóstico para engajar no Instagram',
      modelo_atuacao: ['consultorio', 'online'],
      capacidade_semana: 20,
      ticket_medio: 220,
      modelo_pagamento: 'particular',
      canais_principais: ['instagram', 'whatsapp'],
      rotina_atual_resumo: 'Atendo presencial e online, quero ferramentas para captar',
      area_specific: { area_nutri: 'emagrecimento', temas_atuacao: ['emagrecimento', 'intestino', 'energia'] }
    }
  },
  {
    email: 'demo.coach@ylada.app',
    nome: 'Demo Coach',
    perfil: 'coach',
    noelProfile: {
      segment: 'coach',
      profile_type: 'liberal',
      profession: 'coach',
      category: 'coaching',
      tempo_atuacao_anos: 4,
      dor_principal: 'sem_indicacao',
      prioridade_atual: 'Aumentar autoridade e captar leads qualificados',
      fase_negocio: 'estabilizado',
      metas_principais: 'Escalar com programas e link que qualifica',
      objetivos_curto_prazo: 'Quiz para quem quer saber mais sobre o método',
      modelo_atuacao: ['online'],
      capacidade_semana: 12,
      ticket_medio: 500,
      modelo_pagamento: 'recorrencia',
      canais_principais: ['instagram', 'indicacao'],
      rotina_atual_resumo: 'Trabalho com programas online, pouca divulgação estruturada',
      area_specific: { modelo_entrega_coach: 'programa_online', temas_atuacao: ['carreira', 'produtividade', 'autoconhecimento'] }
    }
  },
  {
    email: 'demo.perfumaria@ylada.app',
    nome: 'Demo Vendedor Perfumaria',
    perfil: 'perfumaria',
    noelProfile: {
      segment: 'perfumaria',
      profile_type: 'vendas',
      profession: 'vendedor_perfumes',
      category: 'perfumaria',
      tempo_atuacao_anos: 3,
      dor_principal: 'nao_converte',
      prioridade_atual: 'Qualificar leads e indicar perfumes certos para cada perfil',
      fase_negocio: 'em_crescimento',
      metas_principais: 'Usar quiz de perfil olfativo para captar e recomendar fragrâncias',
      objetivos_curto_prazo: 'Link com diagnóstico de perfil de fragrância para engajar no Instagram',
      modelo_atuacao: ['loja', 'online'],
      capacidade_semana: 20,
      ticket_medio: 250,
      modelo_pagamento: 'avulso',
      canais_principais: ['instagram', 'whatsapp'],
      rotina_atual_resumo: 'Vendo perfumes por loja e redes, quero ferramentas para qualificar e indicar',
      area_specific: { temas_atuacao: ['perfil_olfativo', 'familia_olfativa', 'ocasiao_uso'] }
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
  console.log('   demo.med@ylada.app       → Médico (liberal)')
  console.log('   demo.psi@ylada.app       → Psicólogo (liberal)')
  console.log('   demo.vendedor@ylada.app   → Vendas em gerais (seller)')
  console.log('   demo.nutra@ylada.app      → Nutra')
  console.log('   demo.estetica@ylada.app   → Esteticista (liberal)')
  console.log('   demo.perfumaria@ylada.app → Vendedor Perfumaria')
  console.log('   demo.nutri@ylada.app      → Nutricionista')
  console.log('   demo.coach@ylada.app      → Coach')
  console.log('\n🔐 Senha para todas: Demo@2025!\n')
}

main().catch(err => {
  console.error('❌ Erro:', err)
  process.exit(1)
})
