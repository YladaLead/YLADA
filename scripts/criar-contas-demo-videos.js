#!/usr/bin/env node

/**
 * Script para criar contas demo para vídeos de demonstração da plataforma.
 * Cria: demo.med, demo.psi, demo.vendedor (vendas em gerais), demo.nutra, demo.nutri, demo.coach, demo.estetica, demo.capilar, demo.perfumaria, demo.joias
 * Para cada conta: perfil + Noel + assinatura **trial** na área do segmento (evita limite freemium de 1 link ativo nas demos).
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
      prioridade_atual: 'Crescer demanda em estética e emagrecimento com agenda organizada',
      fase_negocio: 'em_crescimento',
      metas_principais: 'Aumentar consultas e procedimentos em medicina estética e acompanhamento de emagrecimento',
      objetivos_curto_prazo: 'Links de diagnóstico para qualificar interesse em estética e emagrecimento',
      modelo_atuacao: ['consultorio', 'online'],
      capacidade_semana: 25,
      ticket_medio: 450,
      modelo_pagamento: 'particular',
      canais_principais: ['instagram', 'indicacao'],
      rotina_atual_resumo: 'Atendo estética e linha de emagrecimento; 3–4 dias por semana, pouco tempo para divulgar',
      area_specific: {
        nome: 'Dr. Demo Medicina',
        whatsapp: '19997230912',
        countryCode: 'BR',
        publico_principal: ['particular', 'feminino'],
        especialidades: ['dermatologia'],
        foco_principal: 'procedimentos',
        modelo_receita: 'procedimentos_alto_ticket',
        temas_atuacao: ['emagrecimento', 'pele'],
        equipe_operacional: 'secretaria'
      }
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
      area_specific: {
        nome: 'Dra. Demo Psicologia',
        whatsapp: '19997230912',
        countryCode: 'BR',
        temas_atuacao: ['ansiedade', 'sono', 'autoconhecimento']
      }
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
      area_specific: {
        nome: 'Demo Vendedor (vendas em gerais)',
        whatsapp: '19997230912',
        countryCode: 'BR',
        canal_principal_vendas: 'whatsapp',
        temas_atuacao: ['vendas_gerais']
      }
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
      area_specific: {
        nome: 'Demo Nutra',
        whatsapp: '19997230912',
        countryCode: 'BR',
        canal_principal_vendas: 'whatsapp',
        temas_atuacao: ['b12_vitaminas', 'energia', 'emagrecimento']
      }
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
      area_specific: {
        nome: 'Demo Esteticista',
        whatsapp: '19997230912',
        countryCode: 'BR',
        temas_atuacao: ['pele', 'skincare', 'autocuidado', 'retencao']
      }
    }
  },
  {
    email: 'demo.capilar@ylada.app',
    nome: 'Demo Pro Estética Capilar',
    perfil: 'estetica',
    noelProfile: {
      segment: 'estetica',
      profile_type: 'liberal',
      profession: 'estetica',
      category: 'estetica',
      tempo_atuacao_anos: 4,
      dor_principal: 'agenda_vazia',
      prioridade_atual: 'Recorrência e conversão no nicho capilar',
      fase_negocio: 'em_crescimento',
      metas_principais: 'Preencher agenda com protocolos e fidelizar',
      objetivos_curto_prazo: 'Padronizar triagem e acompanhamento pós-serviço',
      modelo_atuacao: ['consultorio'],
      capacidade_semana: 20,
      ticket_medio: 160,
      modelo_pagamento: 'particular',
      canais_principais: ['instagram', 'whatsapp'],
      rotina_atual_resumo: 'Foco em estética capilar, quero fluxos e links alinhados ao Pro Estética',
      area_specific: {
        nome: 'Demo Pro Estética Capilar',
        whatsapp: '19997230912',
        countryCode: 'BR',
        temas_atuacao: ['couro_cabeludo', 'cronograma_capilar', 'queda', 'recorrencia'],
      }
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
      area_specific: {
        nome: 'Dra. Demo Nutricionista',
        whatsapp: '19997230912',
        countryCode: 'BR',
        area_nutri: 'emagrecimento',
        temas_atuacao: ['emagrecimento', 'intestino', 'energia']
      }
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
      area_specific: {
        nome: 'Demo Coach',
        whatsapp: '19997230912',
        countryCode: 'BR',
        modelo_entrega_coach: 'programa_online',
        temas_atuacao: ['carreira', 'produtividade', 'autoconhecimento']
      }
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
      area_specific: {
        nome: 'Demo Vendedor Perfumaria',
        whatsapp: '19997230912',
        countryCode: 'BR',
        temas_atuacao: ['perfil_olfativo', 'familia_olfativa', 'ocasiao_uso']
      }
    }
  },
  {
    email: 'demo.joias@ylada.app',
    nome: 'Demo Joias e bijuterias',
    perfil: 'joias',
    noelProfile: {
      segment: 'joias',
      profile_type: 'vendas',
      profession: 'vendedor',
      category: 'joias',
      tempo_atuacao_anos: 3,
      dor_principal: 'nao_converte',
      prioridade_atual: 'Qualificar antes do preço e usar links com contexto no WhatsApp',
      fase_negocio: 'em_crescimento',
      metas_principais: 'Aumentar conversão e reduzir conversa só em valor',
      objetivos_curto_prazo: 'Diagnóstico rápido para semijoias e marca própria',
      modelo_atuacao: ['loja', 'online'],
      capacidade_semana: 18,
      ticket_medio: 120,
      modelo_pagamento: 'avulso',
      canais_principais: ['instagram', 'whatsapp'],
      rotina_atual_resumo: 'Vendo por redes e WhatsApp; quero padronizar qualificação',
      area_specific: {
        nome: 'Demo Joias e bijuterias',
        whatsapp: '19997230912',
        countryCode: 'BR',
        jewelry_line: 'semijoia',
        joias_funil_foco: 'marca_propria',
        temas_atuacao: ['semijoia', 'whatsapp', 'qualificacao']
      }
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

/** Áreas da matriz YLADA válidas em `subscriptions.area` (alinhado a `hasYladaProPlan` / perfil). */
const DEMO_MATRIX_SUBSCRIPTION_AREAS = new Set([
  'med',
  'psi',
  'seller',
  'nutra',
  'estetica',
  'nutri',
  'coach',
  'perfumaria',
  'joias',
])

/**
 * Garante assinatura ativa equivalente a Pro (trial) no segmento do perfil, para vídeos/demo não baterem no freemium (1 link ativo).
 * Idempotente: se já existir mensal/anual/trial ou free cortesia (`free_cor_`), não altera.
 */
async function ensureDemoMatrixTrialSubscription(userId, perfil) {
  const area = String(perfil || '')
    .toLowerCase()
    .trim()
  if (!DEMO_MATRIX_SUBSCRIPTION_AREAS.has(area)) {
    console.log(`   ⏭️ Sem assinatura matriz automática para perfil: ${perfil}`)
    return
  }

  const now = new Date()
  const periodStart = now.toISOString()
  const periodEnd = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString()

  const { data: row, error: fetchErr } = await supabaseAdmin
    .from('subscriptions')
    .select('id, plan_type, stripe_subscription_id')
    .eq('user_id', userId)
    .eq('area', area)
    .eq('status', 'active')
    .gt('current_period_end', now.toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (fetchErr && fetchErr.code !== 'PGRST116') {
    console.error(`   ⚠️ Erro ao ler assinatura (${area}):`, fetchErr.message)
    return
  }

  const rowUnlimited = (sub) => {
    if (!sub) return false
    const pt = String(sub.plan_type || '').toLowerCase()
    if (pt === 'monthly' || pt === 'annual' || pt === 'trial') return true
    if (pt === 'free' && String(sub.stripe_subscription_id || '').startsWith('free_cor_')) return true
    return false
  }

  if (row && rowUnlimited(row)) {
    console.log(`   ✅ Assinatura já cobre Pro na área ${area}`)
    return
  }

  const trialFields = {
    plan_type: 'trial',
    stripe_account: 'br',
    stripe_subscription_id: `demo_videos_trial_${userId}_${area}_${Date.now()}`,
    stripe_customer_id: `demo_videos_${userId}`,
    stripe_price_id: 'demo_videos',
    amount: 0,
    currency: 'brl',
    status: 'active',
    current_period_start: periodStart,
    current_period_end: periodEnd,
    cancel_at_period_end: false,
  }

  if (row) {
    const { error: upErr } = await supabaseAdmin.from('subscriptions').update(trialFields).eq('id', row.id)
    if (upErr) {
      console.error(`   ❌ Erro ao atualizar assinatura (${area}):`, upErr.message)
      return
    }
    console.log(`   ✅ Assinatura atualizada para trial (demo vídeos) — área ${area}`)
    return
  }

  const { error: insErr } = await supabaseAdmin
    .from('subscriptions')
    .insert({ user_id: userId, area, ...trialFields })
  if (insErr) {
    console.error(`   ❌ Erro ao criar assinatura (${area}):`, insErr.message)
    return
  }
  console.log(`   ✅ Assinatura trial criada (demo vídeos) — área ${area}`)
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
    await ensureDemoMatrixTrialSubscription(userId, account.perfil)
  }

  console.log('\n✅ Concluído!\n')
  console.log('📧 Contas criadas:')
  console.log('   demo.med@ylada.app       → Médico (liberal)')
  console.log('   demo.psi@ylada.app       → Psicólogo (liberal)')
  console.log('   demo.vendedor@ylada.app   → Vendas em gerais (seller)')
  console.log('   demo.nutra@ylada.app      → Nutra')
  console.log('   demo.estetica@ylada.app   → Esteticista (liberal) — /pt/estetica')
  console.log('   demo.capilar@ylada.app     → Pro Estética capilar (perfil) — /pro-estetica-capilar/entrar')
  console.log('   demo.perfumaria@ylada.app → Vendedor Perfumaria')
  console.log('   demo.joias@ylada.app      → Joias e bijuterias')
  console.log('   demo.nutri@ylada.app      → Nutricionista')
  console.log('   demo.coach@ylada.app      → Coach')
  console.log('\n🔐 Senha para todas: Demo@2025!\n')
}

main().catch(err => {
  console.error('❌ Erro:', err)
  process.exit(1)
})
