#!/usr/bin/env node

/**
 * Cria as 13 contas de teste da parte interna (docs/TESTE-CREDENCIAIS-LOCALHOST.md).
 * Senha (todas): TesteYlada2025!
 * Telefone (perfil/onboarding, todas): 5519997230912 — +55 19 99723-0912 (para ver mensagens no WhatsApp do profissional)
 *
 * Também preenche ylada_noel_profile (perfil Noel) por área com características comuns a cada profissão,
 * para o board e o Noel já terem contexto (ylada, nutri, coach, seller, nutra, med, psi, psicanalise, odonto, fitness, estética, perfumaria).
 *
 * Execute: node scripts/criar-contas-teste-interno.js
 *
 * Requer: .env.local com NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

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

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
})

const SENHA = 'TesteYlada2025!'
const TELEFONE_TESTE = '5519997230912' // +55 19 99723-0912 — usar em todas as contas; mensagens chegam no WhatsApp do profissional

/**
 * Perfis Noel (ylada_noel_profile) por área — características comuns à maioria dos profissionais.
 * Usado para preencher o board e dar contexto ao Noel nos testes.
 */
const TELEFONE_NOEL = TELEFONE_TESTE

const PERFIL_NOEL_POR_AREA = {
  ylada: {
    segment: 'ylada',
    profile_type: 'liberal',
    profession: 'consultor',
    category: 'ylada',
    tempo_atuacao_anos: 3,
    dor_principal: 'agenda_vazia',
    prioridade_atual: 'Preencher agenda e ter mais visibilidade',
    fase_negocio: 'em_crescimento',
    metas_principais: 'Captar mais clientes e organizar divulgação',
    objetivos_curto_prazo: 'Usar diagnóstico e link para engajar',
    modelo_atuacao: ['consultorio', 'online'],
    capacidade_semana: 20,
    ticket_medio: 200,
    modelo_pagamento: 'particular',
    canais_principais: ['instagram', 'whatsapp'],
    rotina_atual_resumo: 'Atendimentos alguns dias por semana, quero ferramentas para captar',
    area_specific: { nome: 'Teste Ylada Matriz', modalidade_atendimento: 'ambos', whatsapp: TELEFONE_NOEL }
  },
  nutri: {
    segment: 'ylada',
    profile_type: 'liberal',
    profession: 'nutricionista',
    category: 'nutricao',
    tempo_atuacao_anos: 5,
    dor_principal: 'agenda_vazia',
    prioridade_atual: 'Preencher agenda com pacientes que já chegam interessados em emagrecimento e saúde intestinal — hoje dependo só de indicação e stories',
    fase_negocio: 'em_crescimento',
    metas_principais: 'Ter um link no bio que qualifica quem me segue: quiz ou calculadora que gera lead quente e mostra que sei do assunto',
    objetivos_curto_prazo: 'Sair do "só postar e torcer" — usar diagnóstico/calculadora no Instagram e WhatsApp para atrair e converter',
    modelo_atuacao: ['consultorio', 'online'],
    capacidade_semana: 20,
    ticket_medio: 220,
    modelo_pagamento: 'particular',
    canais_principais: ['instagram', 'whatsapp'],
    rotina_atual_resumo: 'Atendo presencial e online; Instagram é meu principal canal mas não tenho ferramenta que transforme seguidor em lead qualificado',
    area_specific: { area_nutri: 'emagrecimento', modalidade_atendimento: 'ambos', whatsapp: TELEFONE_NOEL, temas_atuacao: ['emagrecimento', 'intestino', 'energia'] }
  },
  coach: {
    segment: 'coach',
    profile_type: 'liberal',
    profession: 'coach',
    category: 'coaching',
    tempo_atuacao_anos: 4,
    dor_principal: 'sem_indicacao',
    prioridade_atual: 'Ser encontrado por quem precisa de carreira e produtividade — hoje muita gente curte mas pouca converte em sessão ou programa',
    fase_negocio: 'estabilizado',
    metas_principais: 'Escalar com programa online e um link que mostra meu método antes da venda; reduzir dependência de indicação',
    objetivos_curto_prazo: 'Quiz ou diagnóstico que qualifica lead no LinkedIn e Instagram e gera conversa no WhatsApp',
    modelo_atuacao: ['online', 'consultorio'],
    capacidade_semana: 15,
    ticket_medio: 350,
    modelo_pagamento: 'particular',
    canais_principais: ['instagram', 'linkedin'],
    rotina_atual_resumo: 'Sessões e programas online; quero ferramenta que demonstre valor antes do "quanto custa" e traga leads alinhados',
    area_specific: { modelo_entrega_coach: 'programa_online', modalidade_atendimento: 'ambos', whatsapp: TELEFONE_NOEL, temas_atuacao: ['carreira', 'produtividade'] }
  },
  seller: {
    segment: 'seller',
    profile_type: 'vendas',
    profession: 'vendedor',
    category: 'vendas',
    tempo_atuacao_anos: 2,
    dor_principal: 'nao_converte',
    prioridade_atual: 'Reconectar leads frios e fechar mais pelo WhatsApp sem parecer só "vendedor de mensagem" — preciso qualificar antes',
    fase_negocio: 'iniciante',
    metas_principais: 'Aumentar conversão com calculadora ou quiz que gera assunto na conversa e mostra que entendo a necessidade do cliente',
    objetivos_curto_prazo: 'Ter um link para mandar no primeiro contato que engaja e filtra quem está pronto para comprar',
    modelo_atuacao: null,
    capacidade_semana: 15,
    ticket_medio: 180,
    modelo_pagamento: 'comissao',
    canais_principais: ['whatsapp', 'instagram'],
    rotina_atual_resumo: 'Vendo por WhatsApp e redes; leads somem ou não respondem — quero algo que reaqueça e qualifique antes do pitch',
    area_specific: { canal_principal_vendas: 'whatsapp', modalidade_atendimento: 'ambos', whatsapp: TELEFONE_NOEL }
  },
  nutra: {
    segment: 'nutra',
    profile_type: 'vendas',
    profession: 'vendedor_suplementos',
    category: 'nutra',
    tempo_atuacao_anos: 2,
    dor_principal: 'nao_converte',
    prioridade_atual: 'Diferencial no digital: quem toma B12, busca energia ou emagrecimento quer se ver no resultado — quiz/calculadora gera isso',
    fase_negocio: 'iniciante',
    metas_principais: 'Aumentar recorrência e ticket com indicação certa; usar ferramenta que mostra necessidade antes de falar de produto',
    objetivos_curto_prazo: 'Link no Instagram/WhatsApp que qualifica (deficiência, perfil de energia) e abre conversa com lead quente',
    modelo_atuacao: null,
    capacidade_semana: 15,
    ticket_medio: 180,
    modelo_pagamento: 'comissao',
    canais_principais: ['whatsapp', 'instagram'],
    rotina_atual_resumo: 'Vendo suplementos por redes; concorrência é grande — quero destacar com diagnóstico ou calculadora que gera confiança',
    area_specific: { canal_principal_vendas: 'whatsapp', modalidade_atendimento: 'ambos', whatsapp: TELEFONE_NOEL, temas_atuacao: ['b12_vitaminas', 'energia', 'emagrecimento'] }
  },
  med: {
    segment: 'med',
    profile_type: 'liberal',
    profession: 'medico',
    category: 'medicina',
    tempo_atuacao_anos: 8,
    dor_principal: 'agenda_instavel',
    prioridade_atual: 'Consultório com convênio e particular: preciso preencher horários e ter presença digital que gere agendamentos sem depender só de indicação',
    fase_negocio: 'em_crescimento',
    metas_principais: 'Aumentar consultas e ter um link (triagem, tema de saúde) que qualifica quem acessa e facilita o primeiro contato',
    objetivos_curto_prazo: 'Rotina de conteúdo e um recurso no bio que mostra seriedade e atrai quem já busca o que eu atendo',
    modelo_atuacao: ['consultorio', 'online'],
    capacidade_semana: 25,
    ticket_medio: 350,
    modelo_pagamento: 'convenio',
    canais_principais: ['instagram', 'indicacao'],
    rotina_atual_resumo: 'Atendo 3–4 dias por semana; pouco tempo para divulgar — preciso de ferramenta que trabalhe por mim (qualificar e trazer agendamento)',
    area_specific: { especialidades: ['clinica_geral'], modalidade_atendimento: 'ambos', whatsapp: TELEFONE_NOEL, temas_atuacao: ['emagrecimento', 'intestino'] }
  },
  psi: {
    segment: 'psi',
    profile_type: 'liberal',
    profession: 'psi',
    category: 'psicologia',
    tempo_atuacao_anos: 5,
    dor_principal: 'sem_indicacao',
    prioridade_atual: 'Demanda por ansiedade e sono é alta; quero ser encontrada por quem já se identifica e reduzir tabu do "preciso de terapia"',
    fase_negocio: 'estabilizado',
    metas_principais: 'Manter agenda estável e captar pacientes que chegam com alguma reflexão feita (quiz/diagnóstico) em vez de só "quero conversar"',
    objetivos_curto_prazo: 'Link no Instagram que engaja e qualifica — ferramenta leve que aproxima quem segue e gera primeiro contato pelo WhatsApp',
    modelo_atuacao: ['consultorio', 'online'],
    capacidade_semana: 18,
    ticket_medio: 200,
    modelo_pagamento: 'particular',
    canais_principais: ['instagram', 'indicacao'],
    rotina_atual_resumo: 'Atendo presencial e online; quero recurso que mostre meu jeito de trabalhar e traga quem se identifica com ansiedade e sono',
    area_specific: { publico_psi: ['adultos'], modalidade_atendimento: 'ambos', whatsapp: TELEFONE_NOEL, temas_atuacao: ['ansiedade', 'sono'] }
  },
  psicanalise: {
    segment: 'psicanalise',
    profile_type: 'liberal',
    profession: 'psicanalise',
    category: 'psicanalise',
    tempo_atuacao_anos: 6,
    dor_principal: 'sem_indicacao',
    prioridade_atual:
      'Quero primeiro contatos mais organizados: quem chega já refletiu um pouco sobre o que sente e entende que o processo tem tempo — menos curiosos e mais analisandos alinhados ao setting',
    fase_negocio: 'estabilizado',
    metas_principais:
      'Divulgar com ética e clareza: um link leve (diagnóstico) que ajuda a pessoa a nomear a demanda antes da conversa, sem prometer cura rápida',
    objetivos_curto_prazo:
      'Instagram e indicação com ferramenta que qualifica e respeita o ritmo analítico; WhatsApp só depois de algum contexto',
    modelo_atuacao: ['consultorio', 'online'],
    capacidade_semana: 12,
    ticket_medio: 220,
    modelo_pagamento: 'particular',
    canais_principais: ['instagram', 'indicacao'],
    rotina_atual_resumo:
      'Atendo presencial e online; busco analisandos que já entendem um pouco do processo — diagnóstico no bio ajuda a filtrar e abrir conversa com mais maturidade',
    area_specific: {
      publico_psi: ['adultos'],
      modalidade_atendimento: 'ambos',
      whatsapp: TELEFONE_NOEL,
      temas_atuacao: ['sintoma', 'repetição', 'luto', 'relacionamentos']
    }
  },
  odonto: {
    segment: 'odonto',
    profile_type: 'liberal',
    profession: 'odonto',
    category: 'odontologia',
    tempo_atuacao_anos: 6,
    dor_principal: 'agenda_vazia',
    prioridade_atual: 'Consultório particular: agenda com buracos e concorrência de redes e planos — preciso divulgar tratamentos e qualificar quem entra em contato',
    fase_negocio: 'em_crescimento',
    metas_principais: 'Mais pacientes que valorizam tratamento personalizado; um link que explica procedimentos e gera agendamento ou dúvida qualificada',
    objetivos_curto_prazo: 'Instagram e WhatsApp com ferramenta (quiz ou diagnóstico) que engaja e traz lead que quer agendar ou saber mais',
    modelo_atuacao: ['consultorio'],
    capacidade_semana: 30,
    ticket_medio: 280,
    modelo_pagamento: 'particular',
    canais_principais: ['instagram', 'whatsapp'],
    rotina_atual_resumo: 'Consultório próprio; quero captar e qualificar sem depender só de indicação — conteúdo e um link que convertem',
    area_specific: { odonto_voce_atende: 'particular', modalidade_atendimento: 'ambos', whatsapp: TELEFONE_NOEL }
  },
  fitness: {
    segment: 'fitness',
    profile_type: 'liberal',
    profession: 'fitness',
    category: 'fitness',
    tempo_atuacao_anos: 4,
    dor_principal: 'agenda_vazia',
    prioridade_atual: 'Personal e turmas: vagas sobram em alguns horários; quero divulgar e preencher com alunos que já se veem treinando',
    fase_negocio: 'em_crescimento',
    metas_principais: 'Aumentar turmas e aderência; link com diagnóstico ou calculadora que mostra benefício do treino e gera lead no Instagram/WhatsApp',
    objetivos_curto_prazo: 'Ferramenta no bio que engaja seguidores e traz contato qualificado para avaliação ou primeira aula',
    modelo_atuacao: ['consultorio', 'online'],
    capacidade_semana: 25,
    ticket_medio: 180,
    modelo_pagamento: 'particular',
    canais_principais: ['instagram', 'whatsapp'],
    rotina_atual_resumo: 'Personal e turmas; redes são o canal mas falta algo que transforme like em lead — quero diagnóstico ou calculadora que motive e converta',
    area_specific: { fitness_tipo_atuacao: 'personal_turmas', modalidade_atendimento: 'ambos', whatsapp: TELEFONE_NOEL }
  },
  estetica: {
    segment: 'estetica',
    profile_type: 'liberal',
    profession: 'estetica',
    category: 'estetica',
    sub_category: 'Limpeza de pele e facial',
    tempo_atuacao_anos: 3,
    dor_principal: 'agenda_vazia',
    prioridade_atual: 'Agenda irregular e muita concorrência no Instagram — quero me destacar com conteúdo e um link que qualifica e gera agendamento',
    fase_negocio: 'em_crescimento',
    metas_principais: 'Preencher agenda e qualificar leads; quem já se identifica com skincare e autocuidado é cliente ideal',
    objetivos_curto_prazo: 'Link no bio (diagnóstico de pele ou perfil) que engaja e traz contato pelo WhatsApp para agendar ou pacotes',
    modelo_atuacao: ['consultorio'],
    capacidade_semana: 15,
    ticket_medio: 180,
    modelo_pagamento: 'avulso',
    canais_principais: ['instagram', 'whatsapp', 'indicacao'],
    rotina_atual_resumo: 'Atendo facial e limpeza de pele; alguns dias por semana. Preciso de ferramenta que transforme seguidora em cliente sem depender só de stories',
    area_specific: { area_estetica: 'facial', estetica_tipo_atuacao: 'autonoma', modalidade_atendimento: 'ambos', whatsapp: TELEFONE_NOEL, temas_atuacao: ['pele', 'skincare', 'autocuidado'] }
  },
  perfumaria: {
    segment: 'perfumaria',
    profile_type: 'vendas',
    profession: 'vendedor_perfumes',
    category: 'perfumaria',
    tempo_atuacao_anos: 3,
    dor_principal: 'nao_converte',
    prioridade_atual: 'Quem compra perfume quer acertar — quiz de perfil olfativo reduz dúvida e aumenta conversão no Instagram e WhatsApp',
    fase_negocio: 'em_crescimento',
    metas_principais: 'Captar e recomendar com critério: link de diagnóstico de fragrância que engaja e traz lead que já sabe o que busca',
    objetivos_curto_prazo: 'Link no bio que indica o perfume certo por perfil; menos "qual você indica?" e mais venda com confiança',
    modelo_atuacao: ['loja', 'online'],
    capacidade_semana: 20,
    ticket_medio: 250,
    modelo_pagamento: 'avulso',
    canais_principais: ['instagram', 'whatsapp'],
    rotina_atual_resumo: 'Vendo perfumes na loja e online; quero ferramenta que qualifique e indique fragrância — experiência antes da compra',
    area_specific: { modalidade_atendimento: 'ambos', whatsapp: TELEFONE_NOEL, temas_atuacao: ['perfil_olfativo', 'familia_olfativa', 'ocasiao_uso'] }
  }
}

/**
 * E-mails antigos (teste-interno-NN) → novos (teste-{segmento}).
 * Rodamos no início do main para bases que ainda têm o padrão numerado.
 */
const EMAIL_LEGACY_PARA_NOVO = [
  ['teste-interno-13@teste.ylada.com', 'teste-psicanalise@teste.ylada.com'],
  ['teste-interno-12@teste.ylada.com', 'teste-perfumaria@teste.ylada.com'],
  ['teste-interno-11@teste.ylada.com', 'teste-estetica@teste.ylada.com'],
  ['teste-interno-10@teste.ylada.com', 'teste-fitness@teste.ylada.com'],
  ['teste-interno-09@teste.ylada.com', 'teste-odonto@teste.ylada.com'],
  ['teste-interno-08@teste.ylada.com', 'teste-psi@teste.ylada.com'],
  ['teste-interno-07@teste.ylada.com', 'teste-med@teste.ylada.com'],
  ['teste-interno-06@teste.ylada.com', 'teste-nutra@teste.ylada.com'],
  ['teste-interno-05@teste.ylada.com', 'teste-seller@teste.ylada.com'],
  ['teste-interno-04@teste.ylada.com', 'teste-coach@teste.ylada.com'],
  ['teste-interno-03@teste.ylada.com', 'teste-nutri@teste.ylada.com'],
  ['teste-interno-02@teste.ylada.com', 'teste-ylada-2@teste.ylada.com'],
  ['teste-interno-01@teste.ylada.com', 'teste-ylada@teste.ylada.com']
]

async function renomearEmailsLegados () {
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error || !data?.users?.length) return
  const users = data.users
  for (const [de, para] of EMAIL_LEGACY_PARA_NOVO) {
    const deL = de.toLowerCase()
    const paraL = para.toLowerCase()
    if (users.some((u) => u.email?.toLowerCase() === paraL)) continue
    const u = users.find((x) => x.email?.toLowerCase() === deL)
    if (!u) continue
    const { error: upErr } = await supabase.auth.admin.updateUserById(u.id, {
      email: paraL
    })
    if (upErr) {
      console.warn(`   ⚠️ Renomear ${de} → ${para}:`, upErr.message)
      continue
    }
    await supabase.from('user_profiles').update({ email: paraL }).eq('user_id', u.id)
    u.email = paraL
    console.log(`   📧 Legado: ${de} → ${para}`)
  }
}

const CONTAS = [
  { email: 'teste-ylada@teste.ylada.com', nome: 'Teste Interno 01', perfil: 'ylada' },
  { email: 'teste-ylada-2@teste.ylada.com', nome: 'Teste Interno 02', perfil: 'ylada' },
  { email: 'teste-nutri@teste.ylada.com', nome: 'Marina Silva', perfil: 'nutri' },
  { email: 'teste-coach@teste.ylada.com', nome: 'Ricardo Costa', perfil: 'coach' },
  { email: 'teste-seller@teste.ylada.com', nome: 'Fernanda Lima', perfil: 'seller' },
  { email: 'teste-nutra@teste.ylada.com', nome: 'Bruno Oliveira', perfil: 'nutra' },
  { email: 'teste-med@teste.ylada.com', nome: 'Dra. Camila Rocha', perfil: 'med' },
  { email: 'teste-psi@teste.ylada.com', nome: 'Patrícia Alves', perfil: 'psi' },
  { email: 'teste-odonto@teste.ylada.com', nome: 'Dr. André Souza', perfil: 'odonto' },
  { email: 'teste-fitness@teste.ylada.com', nome: 'Lucas Ferreira', perfil: 'fitness' },
  { email: 'teste-estetica@teste.ylada.com', nome: 'Juliana Martins', perfil: 'estetica' },
  { email: 'teste-perfumaria@teste.ylada.com', nome: 'Amanda Ribeiro', perfil: 'perfumaria' },
  { email: 'teste-psicanalise@teste.ylada.com', nome: 'Dra. Helena Vasconcelos', perfil: 'psicanalise' }
]

function slug (email) {
  return email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
}

async function criarOuAtualizar (conta) {
  const { email, nome, perfil } = conta
  const existing = (await supabase.auth.admin.listUsers()).data?.users?.find(
    u => u.email?.toLowerCase() === email.toLowerCase()
  )

  if (existing) {
    const { error: upErr } = await supabase.auth.admin.updateUserById(existing.id, { password: SENHA })
    if (upErr) console.warn(`   ⚠️ Senha não atualizada para ${email}:`, upErr.message)
    const { error: profErr } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: existing.id,
        email: email.toLowerCase(),
        nome_completo: nome,
        perfil,
        country_code: 'BR',
        user_slug: slug(email),
        whatsapp: TELEFONE_TESTE
      }, { onConflict: 'user_id' })
    if (profErr) {
      console.error(`   ❌ Perfil ${email}:`, profErr.message)
      return { ok: false }
    }
    console.log(`   ✅ Atualizado: ${email} (${perfil})`)
    return { ok: true, userId: existing.id }
  }

  const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
    email: email.toLowerCase(),
    password: SENHA,
    email_confirm: true,
    user_metadata: { full_name: nome, name: nome, perfil }
  })

  if (createErr) {
    console.error(`   ❌ Criar ${email}:`, createErr.message)
    return { ok: false }
  }

  const { error: profErr } = await supabase
    .from('user_profiles')
    .upsert({
      user_id: newUser.user.id,
      email: email.toLowerCase(),
      nome_completo: nome,
      perfil,
      country_code: 'BR',
      user_slug: slug(email),
      whatsapp: TELEFONE_TESTE
    }, { onConflict: 'user_id' })

  if (profErr) {
    console.error(`   ❌ Perfil ${email}:`, profErr.message)
    await supabase.auth.admin.deleteUser(newUser.user.id).catch(() => {})
    return { ok: false }
  }
  console.log(`   ✅ Criado: ${email} (${perfil})`)
  return { ok: true, userId: newUser.user.id }
}

async function criarOuAtualizarPerfilNoel (userId, perfil, nome) {
  const noelProfile = PERFIL_NOEL_POR_AREA[perfil]
  if (!noelProfile) return true
  // Perfil completo exige area_specific.nome e area_specific.whatsapp (auth-server)
  // Garantir que nome e whatsapp estão presentes e válidos
  const nomeFinal = nome && nome.trim().length >= 2 ? nome.trim() : 'Profissional'
  const whatsappFinal = noelProfile.area_specific?.whatsapp ?? TELEFONE_NOEL
  const areaSpecific = {
    ...noelProfile.area_specific,
    nome: nomeFinal,
    whatsapp: whatsappFinal
  }
  // Log para debug
  console.log(`   📝 Perfil ${perfil}: nome="${nomeFinal}", whatsapp="${whatsappFinal.substring(0, 5)}..."`)
  const row = {
    user_id: userId,
    segment: noelProfile.segment,
    profile_type: noelProfile.profile_type,
    profession: noelProfile.profession,
    category: noelProfile.category,
    sub_category: noelProfile.sub_category ?? null,
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
    area_specific: areaSpecific
  }
  const { error } = await supabase
    .from('ylada_noel_profile')
    .upsert(row, { onConflict: 'user_id,segment' })
  if (error) {
    console.error(`   ❌ Perfil Noel (${perfil}):`, error.message)
    return false
  }
  console.log(`   ✅ Perfil Noel preenchido: ${perfil}`)
  return true
}

async function main () {
  console.log('\n🔐 Criando/atualizando contas de teste da parte interna\n')
  console.log('   Senha (todas):', SENHA)
  console.log('   Padrão de e-mail: teste-{segmento}@teste.ylada.com\n')

  await renomearEmailsLegados()

  let ok = 0
  let noelOk = 0
  for (const c of CONTAS) {
    const result = await criarOuAtualizar(c)
    if (result.ok) {
      ok++
      if (result.userId && (await criarOuAtualizarPerfilNoel(result.userId, c.perfil, c.nome))) noelOk++
    }
  }

  console.log('')
  console.log(`✅ ${ok}/${CONTAS.length} contas prontas.`)
  console.log(`✅ ${noelOk}/${CONTAS.length} perfis Noel (ylada_noel_profile) preenchidos por área.`)
  console.log('   Login: http://localhost:3000/pt/login (ou a URL que você usar)')
  console.log('')
}

main().catch(e => {
  console.error('❌ Erro:', e.message)
  process.exit(1)
})
