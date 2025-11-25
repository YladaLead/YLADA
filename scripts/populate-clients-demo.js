#!/usr/bin/env node

/**
 * Script para popular a área de clientes com dados completos e realistas
 * Inclui histórico de consultas, evolução, anotações e acompanhamento
 */

const { createClient } = require('@supabase/supabase-js')
const { randomUUID } = require('crypto')
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

// Dados realistas de clientes
const CLIENTES_DEMO = [
  {
    name: 'Maria Silva Santos',
    email: 'maria.silva@email.com',
    phone: '(11) 98765-4321',
    birth_date: '1991-03-15',
    gender: 'feminino',
    cpf: '123.456.789-01',
    status: 'ativa',
    goal: 'Perder 8kg e melhorar disposição',
    instagram: '@maria_silva',
    address: {
      street: 'Rua das Flores',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Vila Madalena',
      city: 'São Paulo',
      state: 'SP',
      zipcode: '05433-000'
    },
    converted_from_lead: true,
    lead_source: 'Instagram',
    // Dados de evolução
    peso_inicial: 75,
    peso_atual: 68,
    altura: 165,
    // Histórico de consultas (últimos 4 meses)
    consultas: [
      { data: '2024-08-15', tipo: 'Primeira consulta', observacoes: 'Paciente motivada, histórico de dietas restritivas. Objetivo: emagrecimento saudável.' },
      { data: '2024-09-01', tipo: 'Retorno', observacoes: 'Perdeu 2kg. Relatou mais disposição. Ajustes no plano alimentar.' },
      { data: '2024-09-15', tipo: 'Retorno', observacoes: 'Manteve o peso. Dificuldades no fim de semana. Estratégias para eventos sociais.' },
      { data: '2024-10-01', tipo: 'Retorno', observacoes: 'Perdeu mais 1,5kg. Muito satisfeita com resultados. Incluir exercícios.' },
      { data: '2024-10-15', tipo: 'Retorno', observacoes: 'Peso estável. Iniciou musculação. Ajustar macronutrientes.' },
      { data: '2024-11-01', tipo: 'Retorno', observacoes: 'Perdeu mais 2kg. Excelente aderência. Manutenção do plano.' },
      { data: '2024-11-15', tipo: 'Retorno', observacoes: 'Atingiu meta parcial. Muito feliz com resultados. Próxima meta: tonificar.' }
    ],
    // Evolução de medidas
    evolucao: [
      { data: '2024-08-15', peso: 75, cintura: 85, quadril: 105, braço: 32, coxa: 58 },
      { data: '2024-09-01', peso: 73, cintura: 83, quadril: 103, braço: 31, coxa: 57 },
      { data: '2024-09-15', peso: 73, cintura: 82, quadril: 102, braço: 31, coxa: 56 },
      { data: '2024-10-01', peso: 71.5, cintura: 80, quadril: 100, braço: 30, coxa: 55 },
      { data: '2024-10-15', peso: 71, cintura: 79, quadril: 99, braço: 30, coxa: 54 },
      { data: '2024-11-01', peso: 69, cintura: 77, quadril: 97, braço: 29, coxa: 53 },
      { data: '2024-11-15', peso: 68, cintura: 76, quadril: 96, braço: 29, coxa: 52 }
    ]
  },
  {
    name: 'João Pedro Oliveira',
    email: 'joao.pedro@email.com',
    phone: '(11) 99876-5432',
    birth_date: '1995-07-22',
    gender: 'masculino',
    cpf: '987.654.321-02',
    status: 'ativa',
    goal: 'Ganhar massa muscular e definir abdômen',
    instagram: '@joao_fit',
    address: {
      street: 'Av. Paulista',
      number: '1500',
      complement: 'Conj 801',
      neighborhood: 'Bela Vista',
      city: 'São Paulo',
      state: 'SP',
      zipcode: '01310-100'
    },
    converted_from_lead: true,
    lead_source: 'Quiz Metabolismo',
    peso_inicial: 78,
    peso_atual: 85,
    altura: 180,
    consultas: [
      { data: '2024-07-10', tipo: 'Primeira consulta', observacoes: 'Praticante de musculação há 2 anos. Quer ganhar massa magra.' },
      { data: '2024-07-25', tipo: 'Retorno', observacoes: 'Ganhou 1kg. Boa aderência ao plano. Aumentar calorias.' },
      { data: '2024-08-10', tipo: 'Retorno', observacoes: 'Mais 1,5kg. Força aumentou. Ajustar timing dos carboidratos.' },
      { data: '2024-08-25', tipo: 'Retorno', observacoes: 'Peso estável. Melhor definição muscular. Manter protocolo.' },
      { data: '2024-09-10', tipo: 'Retorno', observacoes: 'Ganhou 2kg de massa magra. Excelente evolução.' },
      { data: '2024-09-25', tipo: 'Retorno', observacoes: 'Manteve ganhos. Incluir suplementação específica.' },
      { data: '2024-10-10', tipo: 'Retorno', observacoes: 'Mais 1,5kg. Definição abdominal melhorando.' },
      { data: '2024-11-10', tipo: 'Retorno', observacoes: 'Meta atingida. Muito satisfeito com resultados.' }
    ],
    evolucao: [
      { data: '2024-07-10', peso: 78, cintura: 82, quadril: 95, braço: 38, coxa: 60 },
      { data: '2024-07-25', peso: 79, cintura: 81, quadril: 95, braço: 39, coxa: 61 },
      { data: '2024-08-10', peso: 80.5, cintura: 80, quadril: 96, braço: 40, coxa: 62 },
      { data: '2024-08-25', peso: 81, cintura: 79, quadril: 96, braço: 41, coxa: 63 },
      { data: '2024-09-10', peso: 83, cintura: 78, quadril: 97, braço: 42, coxa: 64 },
      { data: '2024-09-25', peso: 83.5, cintura: 77, quadril: 97, braço: 43, coxa: 65 },
      { data: '2024-10-10', peso: 85, cintura: 76, quadril: 98, braço: 44, coxa: 66 },
      { data: '2024-11-10', peso: 85, cintura: 75, quadril: 98, braço: 45, coxa: 67 }
    ]
  },
  {
    name: 'Ana Carolina Lima',
    email: 'ana.lima@email.com',
    phone: '(11) 97654-3210',
    birth_date: '1978-11-08',
    gender: 'feminino',
    cpf: '456.789.123-03',
    status: 'ativa',
    goal: 'Controlar diabetes e melhorar qualidade de vida',
    instagram: '@ana_saudavel',
    address: {
      street: 'Rua Augusta',
      number: '2500',
      complement: '',
      neighborhood: 'Consolação',
      city: 'São Paulo',
      state: 'SP',
      zipcode: '01412-100'
    },
    converted_from_lead: false,
    lead_source: 'Indicação médica',
    peso_inicial: 78,
    peso_atual: 72,
    altura: 158,
    consultas: [
      { data: '2024-06-01', tipo: 'Primeira consulta', observacoes: 'Diabética tipo 2. HbA1c: 8.2%. Precisa controle glicêmico.' },
      { data: '2024-06-15', tipo: 'Retorno', observacoes: 'Glicemias melhorando. Perdeu 1kg. Ótima aderência.' },
      { data: '2024-07-01', tipo: 'Retorno', observacoes: 'HbA1c: 7.8%. Mais 2kg perdidos. Médico satisfeito.' },
      { data: '2024-07-15', tipo: 'Retorno', observacoes: 'Energia melhor. Glicemias estáveis. Manter plano.' },
      { data: '2024-08-01', tipo: 'Retorno', observacoes: 'Perdeu mais 1,5kg. Pressão arterial normalizada.' },
      { data: '2024-08-15', tipo: 'Retorno', observacoes: 'Exames excelentes. HbA1c: 7.2%. Muito motivada.' },
      { data: '2024-09-01', tipo: 'Retorno', observacoes: 'Peso estável. Foco na manutenção dos hábitos.' },
      { data: '2024-09-15', tipo: 'Retorno', observacoes: 'Mais 1kg perdido. Qualidade de vida excelente.' },
      { data: '2024-10-01', tipo: 'Retorno', observacoes: 'HbA1c: 6.8%. Meta glicêmica atingida!' },
      { data: '2024-11-01', tipo: 'Retorno', observacoes: 'Mantendo todos os ganhos. Caso de sucesso.' }
    ],
    evolucao: [
      { data: '2024-06-01', peso: 78, cintura: 92, quadril: 108, braço: 34, coxa: 62 },
      { data: '2024-06-15', peso: 77, cintura: 91, quadril: 107, braço: 33, coxa: 61 },
      { data: '2024-07-01', peso: 75, cintura: 89, quadril: 105, braço: 33, coxa: 60 },
      { data: '2024-07-15', peso: 74.5, cintura: 88, quadril: 104, braço: 32, coxa: 59 },
      { data: '2024-08-01', peso: 73, cintura: 86, quadril: 102, braço: 32, coxa: 58 },
      { data: '2024-08-15', peso: 72.5, cintura: 85, quadril: 101, braço: 31, coxa: 57 },
      { data: '2024-09-01', peso: 72, cintura: 84, quadril: 100, braço: 31, coxa: 56 },
      { data: '2024-09-15', peso: 71, cintura: 83, quadril: 99, braço: 30, coxa: 55 },
      { data: '2024-10-01', peso: 71, cintura: 82, quadril: 98, braço: 30, coxa: 54 },
      { data: '2024-11-01', peso: 72, cintura: 82, quadril: 98, braço: 30, coxa: 54 }
    ]
  },
  {
    name: 'Carlos Eduardo Costa',
    email: 'carlos.costa@email.com',
    phone: '(11) 96543-2109',
    birth_date: '1985-04-12',
    gender: 'masculino',
    cpf: '789.123.456-04',
    status: 'pausa',
    goal: 'Reduzir colesterol e perder barriga',
    instagram: '@carlos_saude',
    address: {
      street: 'Rua Oscar Freire',
      number: '800',
      complement: 'Casa',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      state: 'SP',
      zipcode: '01426-000'
    },
    converted_from_lead: true,
    lead_source: 'Google Ads',
    peso_inicial: 95,
    peso_atual: 88,
    altura: 175,
    consultas: [
      { data: '2024-05-01', tipo: 'Primeira consulta', observacoes: 'Colesterol alto (280mg/dl). Sedentário. Estresse no trabalho.' },
      { data: '2024-05-15', tipo: 'Retorno', observacoes: 'Perdeu 2kg. Iniciou caminhadas. Colesterol: 260mg/dl.' },
      { data: '2024-06-01', tipo: 'Retorno', observacoes: 'Mais 2kg perdidos. Energia melhor. Manter protocolo.' },
      { data: '2024-06-15', tipo: 'Retorno', observacoes: 'Peso estável. Colesterol: 240mg/dl. Boa evolução.' },
      { data: '2024-07-01', tipo: 'Retorno', observacoes: 'Perdeu mais 1,5kg. Exames melhorando gradualmente.' },
      { data: '2024-07-15', tipo: 'Retorno', observacoes: 'Mais 1kg. Colesterol: 220mg/dl. Muito motivado.' },
      { data: '2024-08-01', tipo: 'Retorno', observacoes: 'Perdeu 1,5kg. Cintura diminuindo. Ótimos resultados.' },
      { data: '2024-09-01', tipo: 'Retorno', observacoes: 'Viagem de trabalho. Ganhou 1kg. Retomar rotina.' },
      { data: '2024-10-01', tipo: 'Retorno', observacoes: 'Voltou ao peso anterior. Colesterol: 200mg/dl!' },
      { data: '2024-10-15', tipo: 'Última consulta', observacoes: 'Solicitou pausa por mudança de cidade. Excelente evolução.' }
    ],
    evolucao: [
      { data: '2024-05-01', peso: 95, cintura: 105, quadril: 102, braço: 40, coxa: 65 },
      { data: '2024-05-15', peso: 93, cintura: 103, quadril: 101, braço: 39, coxa: 64 },
      { data: '2024-06-01', peso: 91, cintura: 101, quadril: 100, braço: 38, coxa: 63 },
      { data: '2024-06-15', peso: 90, cintura: 100, quadril: 99, braço: 38, coxa: 62 },
      { data: '2024-07-01', peso: 88.5, cintura: 98, quadril: 98, braço: 37, coxa: 61 },
      { data: '2024-07-15', peso: 87.5, cintura: 96, quadril: 97, braço: 37, coxa: 60 },
      { data: '2024-08-01', peso: 86, cintura: 94, quadril: 96, braço: 36, coxa: 59 },
      { data: '2024-09-01', peso: 87, cintura: 95, quadril: 97, braço: 36, coxa: 60 },
      { data: '2024-10-01', peso: 86, cintura: 94, quadril: 96, braço: 36, coxa: 59 },
      { data: '2024-10-15', peso: 88, cintura: 95, quadril: 97, braço: 36, coxa: 60 }
    ]
  },
  {
    name: 'Fernanda Rodrigues',
    email: 'fernanda.rodrigues@email.com',
    phone: '(11) 95432-1098',
    birth_date: '1994-09-30',
    gender: 'feminino',
    cpf: '321.654.987-05',
    status: 'pre_consulta',
    goal: 'Alimentação vegetariana equilibrada',
    instagram: '@fer_veggie',
    address: {
      street: 'Rua Haddock Lobo',
      number: '595',
      complement: 'Apto 102',
      neighborhood: 'Cerqueira César',
      city: 'São Paulo',
      state: 'SP',
      zipcode: '01414-001'
    },
    converted_from_lead: true,
    lead_source: 'Formulário site',
    peso_inicial: 58,
    peso_atual: 58,
    altura: 162,
    consultas: [
      { data: '2024-11-20', tipo: 'Primeira consulta agendada', observacoes: 'Vegetariana há 3 anos. Quer otimizar nutrição e ganhar energia.' }
    ],
    evolucao: []
  },
  {
    name: 'Roberto Silva Mendes',
    email: 'roberto.mendes@email.com',
    phone: '(11) 94321-0987',
    birth_date: '1988-01-25',
    gender: 'masculino',
    cpf: '654.321.987-06',
    status: 'finalizada',
    goal: 'Preparação para maratona',
    instagram: '@roberto_runner',
    address: {
      street: 'Av. Faria Lima',
      number: '3000',
      complement: 'Torre A - 15º andar',
      neighborhood: 'Itaim Bibi',
      city: 'São Paulo',
      state: 'SP',
      zipcode: '01451-000'
    },
    converted_from_lead: false,
    lead_source: 'Indicação de amigo',
    peso_inicial: 72,
    peso_atual: 70,
    altura: 178,
    consultas: [
      { data: '2024-01-15', tipo: 'Primeira consulta', observacoes: 'Corredor amador. Meta: completar primeira maratona em 6 meses.' },
      { data: '2024-02-01', tipo: 'Retorno', observacoes: 'Adaptação ao plano nutricional. Energia boa nos treinos.' },
      { data: '2024-02-15', tipo: 'Retorno', observacoes: 'Perdeu 1kg. Ajustar carboidratos para treinos longos.' },
      { data: '2024-03-01', tipo: 'Retorno', observacoes: 'Performance melhorando. Hidratação otimizada.' },
      { data: '2024-03-15', tipo: 'Retorno', observacoes: 'Peso ideal atingido. Foco na manutenção.' },
      { data: '2024-04-01', tipo: 'Retorno', observacoes: 'Treinos intensos. Estratégia para prova.' },
      { data: '2024-04-15', tipo: 'Retorno', observacoes: 'Última consulta antes da maratona. Protocolo de prova.' },
      { data: '2024-05-01', tipo: 'Retorno pós-prova', observacoes: 'Maratona concluída em 3h45min! Objetivo alcançado.' },
      { data: '2024-05-15', tipo: 'Encerramento', observacoes: 'Acompanhamento finalizado. Cliente muito satisfeito.' }
    ],
    evolucao: [
      { data: '2024-01-15', peso: 72, cintura: 78, quadril: 92, braço: 35, coxa: 58 },
      { data: '2024-02-01', peso: 71.5, cintura: 77, quadril: 91, braço: 35, coxa: 57 },
      { data: '2024-02-15', peso: 71, cintura: 76, quadril: 90, braço: 34, coxa: 56 },
      { data: '2024-03-01', peso: 70.5, cintura: 75, quadril: 89, braço: 34, coxa: 55 },
      { data: '2024-03-15', peso: 70, cintura: 74, quadril: 88, braço: 33, coxa: 54 },
      { data: '2024-04-01', peso: 70, cintura: 74, quadril: 88, braço: 33, coxa: 54 },
      { data: '2024-04-15', peso: 70, cintura: 73, quadril: 87, braço: 33, coxa: 53 },
      { data: '2024-05-01', peso: 70, cintura: 73, quadril: 87, braço: 33, coxa: 53 },
      { data: '2024-05-15', peso: 70, cintura: 73, quadril: 87, braço: 33, coxa: 53 }
    ]
  }
]

// Buscar usuário demo nutri
async function findNutriUser() {
  console.log('🔍 Buscando usuário demo nutri...')
  
  const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
  const nutriUser = authUsers.users.find(u => u.email === 'demo.nutri@ylada.com')
  
  if (!nutriUser) {
    console.log('❌ Usuário demo.nutri@ylada.com não encontrado')
    return null
  }
  
  console.log(`✅ Usuário encontrado: ${nutriUser.id}`)
  return nutriUser
}

// Criar cliente
async function createDemoClient(userId, clientData) {
  console.log(`👤 Criando cliente: ${clientData.name}`)
  
  const { data, error } = await supabaseAdmin
    .from('clients')
    .insert({
      user_id: userId,
      name: clientData.name,
      email: clientData.email,
      phone: clientData.phone,
      birth_date: clientData.birth_date,
      gender: clientData.gender,
      cpf: clientData.cpf,
      status: clientData.status,
      goal: clientData.goal,
      instagram: clientData.instagram,
      address_street: clientData.address.street,
      address_number: clientData.address.number,
      address_complement: clientData.address.complement,
      address_neighborhood: clientData.address.neighborhood,
      address_city: clientData.address.city,
      address_state: clientData.address.state,
      address_zipcode: clientData.address.zipcode,
      converted_from_lead: clientData.converted_from_lead,
      lead_source: clientData.lead_source,
      // Definir data de criação baseada no histórico
      created_at: clientData.consultas[0] ? new Date(clientData.consultas[0].data).toISOString() : new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    console.error(`❌ Erro ao criar cliente ${clientData.name}:`, error.message)
    return null
  }

  console.log(`✅ Cliente criado: ${clientData.name}`)
  return data
}

// Criar histórico de consultas
async function createAppointmentHistory(clientId, consultas) {
  if (!consultas || consultas.length === 0) return
  
  console.log(`📅 Criando ${consultas.length} consultas para cliente ${clientId}`)
  
  for (const consulta of consultas) {
    const { error } = await supabaseAdmin
      .from('client_appointments')
      .insert({
        client_id: clientId,
        appointment_date: new Date(consulta.data).toISOString(),
        appointment_type: consulta.tipo,
        notes: consulta.observacoes,
        status: consulta.tipo.includes('agendada') ? 'scheduled' : 'completed',
        created_at: new Date(consulta.data).toISOString()
      })

    if (error) {
      console.error(`❌ Erro ao criar consulta:`, error.message)
    }
  }
  
  console.log(`✅ Histórico de consultas criado`)
}

// Criar evolução de medidas
async function createEvolutionData(clientId, evolucao) {
  if (!evolucao || evolucao.length === 0) return
  
  console.log(`📊 Criando ${evolucao.length} registros de evolução para cliente ${clientId}`)
  
  for (const registro of evolucao) {
    const { error } = await supabaseAdmin
      .from('client_evolution')
      .insert({
        client_id: clientId,
        measurement_date: new Date(registro.data).toISOString(),
        weight: registro.peso,
        waist: registro.cintura,
        hip: registro.quadril,
        arm: registro.braço,
        thigh: registro.coxa,
        created_at: new Date(registro.data).toISOString()
      })

    if (error) {
      console.error(`❌ Erro ao criar registro de evolução:`, error.message)
    }
  }
  
  console.log(`✅ Dados de evolução criados`)
}

// Criar anotações adicionais
async function createClientNotes(clientId, clientData) {
  const notas = [
    {
      title: 'Preferências Alimentares',
      content: `Gosta: ${clientData.name.includes('João') ? 'Frango, batata doce, aveia' : clientData.name.includes('Ana') && clientData.goal.includes('diabetes') ? 'Vegetais, peixes, grãos integrais' : 'Saladas, frutas, proteínas magras'}\n\nNão gosta: ${clientData.name.includes('Maria') ? 'Brócolis, fígado' : 'Peixe, couve-flor'}\n\nRestrições: ${clientData.goal.includes('diabetes') ? 'Diabética - evitar açúcares simples' : clientData.name.includes('Fernanda') ? 'Vegetariana - sem carnes' : 'Nenhuma restrição específica'}`,
      type: 'preference'
    },
    {
      title: 'Rotina e Estilo de Vida',
      content: `Trabalho: ${clientData.name.includes('Carlos') ? 'Executivo - muito estresse, viagens frequentes' : clientData.name.includes('Roberto') ? 'Analista - horário flexível para treinos' : 'Rotina regular de trabalho'}\n\nExercícios: ${clientData.goal.includes('massa muscular') ? 'Musculação 5x/semana' : clientData.goal.includes('maratona') ? 'Corrida 6x/semana' : clientData.goal.includes('diabetes') ? 'Caminhada 3x/semana' : 'Atividade física moderada'}\n\nSono: ${clientData.name.includes('Carlos') ? 'Dificuldade para dormir - estresse' : 'Sono regular, 7-8h por noite'}`,
      type: 'lifestyle'
    }
  ]

  for (const nota of notas) {
    const { error } = await supabaseAdmin
      .from('client_notes')
      .insert({
        client_id: clientId,
        title: nota.title,
        content: nota.content,
        note_type: nota.type,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error(`❌ Erro ao criar nota:`, error.message)
    }
  }
  
  console.log(`📝 Anotações criadas`)
}

// Função principal
async function main() {
  console.log('🚀 Populando área de clientes com dados completos...\n')

  try {
    const nutriUser = await findNutriUser()
    if (!nutriUser) return

    console.log('👥 Criando clientes demo...\n')

    for (const clientData of CLIENTES_DEMO) {
      console.log(`\n=== CRIANDO: ${clientData.name} ===`)
      
      // Criar cliente
      const client = await createDemoClient(nutriUser.id, clientData)
      if (!client) continue

      // Criar histórico de consultas
      await createAppointmentHistory(client.id, clientData.consultas)

      // Criar evolução de medidas
      await createEvolutionData(client.id, clientData.evolucao)

      // Criar anotações
      await createClientNotes(client.id, clientData)

      console.log(`✅ Cliente ${clientData.name} criado com dados completos`)
    }

    console.log('\n🎉 ÁREA DE CLIENTES POPULADA COM SUCESSO!')
    console.log('\n📊 RESUMO DOS DADOS CRIADOS:')
    console.log('=================================')
    console.log(`👥 ${CLIENTES_DEMO.length} clientes criados`)
    console.log('📅 Histórico completo de consultas (4-10 meses)')
    console.log('📊 Evolução de peso e medidas')
    console.log('📝 Anotações e preferências')
    console.log('🎯 Diferentes status: ativa, pausa, pré-consulta, finalizada')
    console.log('📈 Casos de sucesso realistas')
    console.log('')
    console.log('🎬 PERFEITO PARA DEMONSTRAÇÃO:')
    console.log('   • Gestão completa de clientes')
    console.log('   • Histórico de acompanhamento')
    console.log('   • Evolução visual com gráficos')
    console.log('   • Diferentes perfis e objetivos')
    console.log('   • Casos reais de sucesso')
    console.log('')
    console.log('🔗 Acesse: http://localhost:3000/pt/nutri/clientes')

  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

main()
