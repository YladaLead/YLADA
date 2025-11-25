#!/usr/bin/env node

/**
 * Script simples para criar contas de demonstração
 * Execute: node scripts/create-demo-accounts.js
 */

const { createClient } = require('@supabase/supabase-js')
const { randomUUID } = require('crypto')
const fs = require('fs')
const path = require('path')

// Carregar variáveis de ambiente do arquivo .env.local
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

// Configuração do Supabase Admin
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente não configuradas!')
  console.error('Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Dados das contas demo
const DEMO_ACCOUNTS = {
  nutri: {
    email: 'demo.nutri@ylada.com',
    password: 'DemoYlada2024!',
    profile: {
      perfil: 'nutri',
      nome_completo: 'Dra. Ana Nutricionista',
      telefone: '(11) 99999-1234',
      is_demo: true
    }
  },
  coach: {
    email: 'demo.coach@ylada.com', 
    password: 'DemoYlada2024!',
    profile: {
      perfil: 'coach',
      nome_completo: 'Carlos Coach Wellness',
      telefone: '(11) 99999-5678',
      is_demo: true
    }
  }
}

// Formulários de exemplo para Nutri
const NUTRI_FORMS = [
  {
    name: 'Anamnese Nutricional Completa',
    description: 'Avaliação completa do histórico alimentar e de saúde do paciente',
    form_type: 'anamnese',
    structure: {
      fields: [
        {
          id: 'nome',
          type: 'text',
          label: 'Nome Completo',
          placeholder: 'Digite seu nome completo',
          required: true
        },
        {
          id: 'email',
          type: 'email', 
          label: 'E-mail',
          placeholder: 'seu@email.com',
          required: true
        },
        {
          id: 'telefone',
          type: 'tel',
          label: 'Telefone/WhatsApp',
          placeholder: '(11) 99999-9999',
          required: true
        },
        {
          id: 'idade',
          type: 'number',
          label: 'Idade',
          placeholder: 'Digite sua idade',
          required: true
        },
        {
          id: 'peso',
          type: 'number',
          label: 'Peso Atual (kg)',
          placeholder: 'Ex: 70',
          required: true
        },
        {
          id: 'altura',
          type: 'number',
          label: 'Altura (cm)',
          placeholder: 'Ex: 170',
          required: true
        },
        {
          id: 'objetivo',
          type: 'select',
          label: 'Qual seu principal objetivo?',
          required: true,
          options: [
            'Perder peso',
            'Ganhar massa muscular',
            'Melhorar saúde geral',
            'Controlar diabetes',
            'Reduzir colesterol',
            'Outro'
          ]
        },
        {
          id: 'atividade_fisica',
          type: 'select',
          label: 'Frequência de atividade física',
          required: true,
          options: [
            'Sedentário',
            '1-2x por semana',
            '3-4x por semana',
            '5-6x por semana',
            'Todos os dias'
          ]
        },
        {
          id: 'restricoes',
          type: 'textarea',
          label: 'Possui alguma restrição alimentar ou alergia?',
          placeholder: 'Descreva suas restrições, alergias ou intolerâncias...',
          required: false
        }
      ]
    },
    is_active: true
  },
  {
    name: 'Questionário de Hábitos Alimentares',
    description: 'Avaliação rápida dos hábitos alimentares atuais',
    form_type: 'questionario',
    structure: {
      fields: [
        {
          id: 'nome',
          type: 'text',
          label: 'Nome',
          required: true
        },
        {
          id: 'email',
          type: 'email',
          label: 'E-mail',
          required: true
        },
        {
          id: 'refeicoes_dia',
          type: 'select',
          label: 'Quantas refeições você faz por dia?',
          required: true,
          options: ['1-2 refeições', '3 refeições', '4-5 refeições', '6+ refeições']
        },
        {
          id: 'agua_diaria',
          type: 'select',
          label: 'Quantos copos de água você bebe por dia?',
          required: true,
          options: ['Menos de 4 copos', '4-6 copos', '7-8 copos', 'Mais de 8 copos']
        }
      ]
    },
    is_active: true
  }
]

// Formulários de exemplo para Coach
const COACH_FORMS = [
  {
    name: 'Avaliação de Bem-Estar Inicial',
    description: 'Questionário para entender o estado atual de bem-estar do cliente',
    form_type: 'avaliacao',
    structure: {
      fields: [
        {
          id: 'nome',
          type: 'text',
          label: 'Nome Completo',
          required: true
        },
        {
          id: 'email',
          type: 'email',
          label: 'E-mail',
          required: true
        },
        {
          id: 'telefone',
          type: 'tel',
          label: 'WhatsApp',
          required: true
        },
        {
          id: 'nivel_estresse',
          type: 'select',
          label: 'Como você avalia seu nível de estresse atual?',
          required: true,
          options: ['Muito baixo', 'Baixo', 'Moderado', 'Alto', 'Muito alto']
        },
        {
          id: 'qualidade_sono',
          type: 'select',
          label: 'Como está a qualidade do seu sono?',
          required: true,
          options: ['Excelente', 'Boa', 'Regular', 'Ruim', 'Péssima']
        },
        {
          id: 'objetivos_principais',
          type: 'checkbox',
          label: 'Quais são seus principais objetivos?',
          required: true,
          options: [
            'Reduzir estresse',
            'Melhorar qualidade do sono',
            'Aumentar energia',
            'Melhorar relacionamentos',
            'Encontrar propósito'
          ]
        }
      ]
    },
    is_active: true
  },
  {
    name: 'Questionário de Metas e Objetivos',
    description: 'Definição de metas pessoais e profissionais',
    form_type: 'questionario',
    structure: {
      fields: [
        {
          id: 'nome',
          type: 'text',
          label: 'Nome',
          required: true
        },
        {
          id: 'email',
          type: 'email',
          label: 'E-mail',
          required: true
        },
        {
          id: 'area_foco',
          type: 'select',
          label: 'Qual área da sua vida você gostaria de focar primeiro?',
          required: true,
          options: [
            'Carreira e trabalho',
            'Relacionamentos',
            'Saúde e bem-estar',
            'Finanças',
            'Desenvolvimento pessoal'
          ]
        },
        {
          id: 'meta_principal',
          type: 'textarea',
          label: 'Descreva sua meta principal para os próximos 3 meses',
          required: true
        }
      ]
    },
    is_active: true
  }
]

// Respostas fictícias para Nutri
const NUTRI_RESPONSES = [
  {
    nome: 'Maria Silva Santos',
    email: 'maria.silva@email.com',
    telefone: '(11) 98765-4321',
    idade: 32,
    peso: 68,
    altura: 165,
    objetivo: 'Perder peso',
    atividade_fisica: '3-4x por semana',
    restricoes: 'Intolerância à lactose'
  },
  {
    nome: 'João Pedro Oliveira',
    email: 'joao.pedro@email.com',
    telefone: '(11) 99876-5432',
    idade: 28,
    peso: 85,
    altura: 180,
    objetivo: 'Ganhar massa muscular',
    atividade_fisica: '5-6x por semana',
    restricoes: 'Nenhuma restrição'
  },
  {
    nome: 'Ana Carolina Lima',
    email: 'ana.lima@email.com',
    telefone: '(11) 97654-3210',
    idade: 45,
    peso: 72,
    altura: 158,
    objetivo: 'Controlar diabetes',
    atividade_fisica: '1-2x por semana',
    restricoes: 'Diabética tipo 2'
  }
]

// Respostas fictícias para Coach
const COACH_RESPONSES = [
  {
    nome: 'Roberto Silva Mendes',
    email: 'roberto.mendes@email.com',
    telefone: '(11) 94321-0987',
    nivel_estresse: 'Alto',
    qualidade_sono: 'Ruim',
    objetivos_principais: ['Reduzir estresse', 'Melhorar qualidade do sono']
  },
  {
    nome: 'Juliana Pereira Santos',
    email: 'juliana.santos@email.com',
    telefone: '(11) 93210-9876',
    nivel_estresse: 'Moderado',
    qualidade_sono: 'Regular',
    objetivos_principais: ['Equilibrar vida pessoal e profissional', 'Encontrar propósito']
  },
  {
    nome: 'Marcos Antonio Lima',
    email: 'marcos.lima@email.com',
    telefone: '(11) 92109-8765',
    nivel_estresse: 'Muito alto',
    qualidade_sono: 'Péssima',
    objetivos_principais: ['Reduzir estresse', 'Aumentar energia']
  }
]

// Função para criar usuário
async function createDemoUser(email, password) {
  console.log(`🔐 Criando usuário: ${email}`)
  
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (error) {
    console.error(`❌ Erro ao criar usuário ${email}:`, error.message)
    return null
  }

  console.log(`✅ Usuário criado: ${email}`)
  return data.user
}

// Função para criar perfil
async function createUserProfile(userId, profileData, email) {
  console.log(`👤 Criando perfil para usuário: ${userId}`)
  
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .insert({
      user_id: userId,
      ...profileData,
      email: email
    })
    .select()
    .single()

  if (error) {
    console.error(`❌ Erro ao criar perfil:`, error.message)
    return null
  }

  console.log(`✅ Perfil criado para: ${profileData.nome_completo}`)
  return data
}

// Função para criar formulários
async function createForms(userId, forms) {
  console.log(`📝 Criando ${forms.length} formulários para usuário: ${userId}`)
  
  const createdForms = []
  
  for (const form of forms) {
    const { data, error } = await supabaseAdmin
      .from('custom_forms')
      .insert({
        user_id: userId,
        ...form
      })
      .select()
      .single()

    if (error) {
      console.error(`❌ Erro ao criar formulário "${form.name}":`, error.message)
      continue
    }

    console.log(`✅ Formulário criado: "${form.name}"`)
    createdForms.push(data)
  }

  return createdForms
}

// Função para criar respostas
async function createFormResponses(formId, responses) {
  console.log(`💬 Criando ${responses.length} respostas para formulário: ${formId}`)
  
  for (const response of responses) {
    // Criar data aleatória nos últimos 30 dias
    const randomDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    
    const { error } = await supabaseAdmin
      .from('form_responses')
      .insert({
        form_id: formId,
        response_data: response,
        submitted_at: randomDate.toISOString()
      })

    if (error) {
      console.error(`❌ Erro ao criar resposta:`, error.message)
      continue
    }
  }

  console.log(`✅ Respostas criadas para formulário: ${formId}`)
}

// Função para criar quizzes
async function createSampleQuizzes(userId, area) {
  console.log(`🎯 Criando quizzes de exemplo para: ${area}`)
  
  const quizzes = area === 'nutri' ? [
    {
      titulo: 'Descubra seu Tipo de Metabolismo',
      descricao: 'Quiz para identificar se você tem metabolismo rápido, normal ou lento',
      emoji: '⚡',
      cores: {
        primaria: '#3B82F6',
        secundaria: '#EFF6FF',
        texto: '#1F2937',
        fundo: '#FFFFFF'
      },
      configuracoes: {
        mostrarProgresso: true,
        permitirVoltar: false
      },
      entrega: {
        tipoEntrega: 'pagina',
        ctaPersonalizado: 'Ver meu resultado',
        urlRedirecionamento: '',
        coletarDados: true,
        camposColeta: {
          nome: true,
          email: true,
          telefone: true,
          mensagemPersonalizada: 'Receba dicas personalizadas para seu metabolismo!'
        },
        customizacao: {
          tamanhoFonte: 'medio',
          corFundo: '#FFFFFF',
          corTexto: '#1F2937',
          corBotao: '#3B82F6',
          espacamento: 'normal',
          estilo: 'moderno'
        },
        blocosConteudo: [
          {
            id: randomUUID(),
            tipo: 'titulo',
            conteudo: 'Seu Resultado Personalizado',
            tamanho: 'grande'
          },
          {
            id: randomUUID(),
            tipo: 'paragrafo',
            conteudo: 'Com base nas suas respostas, identificamos seu perfil metabólico e preparamos dicas exclusivas para você!',
            tamanho: 'medio'
          }
        ],
        acaoAposCaptura: 'redirecionar'
      },
      slug: `metabolismo-${randomUUID().slice(0, 8)}`,
      views: Math.floor(Math.random() * 500) + 50,
      leads_count: Math.floor(Math.random() * 100) + 10,
      status: 'active'
    },
    {
      titulo: 'Qual seu Perfil Alimentar?',
      descricao: 'Descubra qual tipo de alimentação combina mais com você',
      emoji: '🥗',
      cores: {
        primaria: '#10B981',
        secundaria: '#ECFDF5',
        texto: '#1F2937',
        fundo: '#FFFFFF'
      },
      configuracoes: {
        mostrarProgresso: true,
        permitirVoltar: false
      },
      entrega: {
        tipoEntrega: 'pagina',
        ctaPersonalizado: 'Descobrir meu perfil',
        urlRedirecionamento: '',
        coletarDados: true,
        camposColeta: {
          nome: true,
          email: true,
          telefone: false,
          mensagemPersonalizada: 'Receba seu plano alimentar personalizado!'
        },
        customizacao: {
          tamanhoFonte: 'medio',
          corFundo: '#FFFFFF',
          corTexto: '#1F2937',
          corBotao: '#10B981',
          espacamento: 'normal',
          estilo: 'elegante'
        },
        blocosConteudo: [
          {
            id: randomUUID(),
            tipo: 'titulo',
            conteudo: 'Seu Perfil Alimentar',
            tamanho: 'grande'
          }
        ],
        acaoAposCaptura: 'manter_pagina'
      },
      slug: `perfil-alimentar-${randomUUID().slice(0, 8)}`,
      views: Math.floor(Math.random() * 300) + 30,
      leads_count: Math.floor(Math.random() * 80) + 5,
      status: 'active'
    }
  ] : [
    {
      titulo: 'Descubra seu Nível de Bem-Estar',
      descricao: 'Avalie seu estado atual de bem-estar físico e mental',
      emoji: '🌟',
      cores: {
        primaria: '#8B5CF6',
        secundaria: '#F3E8FF',
        texto: '#1F2937',
        fundo: '#FFFFFF'
      },
      configuracoes: {
        mostrarProgresso: true,
        permitirVoltar: true
      },
      entrega: {
        tipoEntrega: 'pagina',
        ctaPersonalizado: 'Ver meu nível',
        urlRedirecionamento: '',
        coletarDados: true,
        camposColeta: {
          nome: true,
          email: true,
          telefone: true,
          mensagemPersonalizada: 'Receba dicas para melhorar seu bem-estar!'
        },
        customizacao: {
          tamanhoFonte: 'medio',
          corFundo: '#FFFFFF',
          corTexto: '#1F2937',
          corBotao: '#8B5CF6',
          espacamento: 'amplo',
          estilo: 'moderno'
        },
        blocosConteudo: [
          {
            id: randomUUID(),
            tipo: 'titulo',
            conteudo: 'Seu Nível de Bem-Estar',
            tamanho: 'grande'
          }
        ],
        acaoAposCaptura: 'redirecionar'
      },
      slug: `bem-estar-${randomUUID().slice(0, 8)}`,
      views: Math.floor(Math.random() * 400) + 40,
      leads_count: Math.floor(Math.random() * 90) + 8,
      status: 'active'
    }
  ]

  for (const quiz of quizzes) {
    const { data, error } = await supabaseAdmin
      .from('quizzes')
      .insert({
        user_id: userId,
        ...quiz
      })
      .select()
      .single()

    if (error) {
      console.error(`❌ Erro ao criar quiz "${quiz.titulo}":`, error.message)
      continue
    }

    console.log(`✅ Quiz criado: "${quiz.titulo}"`)
  }
}

// Função principal
async function main() {
  console.log('🚀 Iniciando criação de dados de demonstração...\n')

  try {
    // Criar conta demo Nutri
    console.log('=== CRIANDO CONTA DEMO NUTRI ===')
    const nutriUser = await createDemoUser(DEMO_ACCOUNTS.nutri.email, DEMO_ACCOUNTS.nutri.password)
    
    if (nutriUser) {
      const nutriProfile = await createUserProfile(
        nutriUser.id, 
        DEMO_ACCOUNTS.nutri.profile,
        DEMO_ACCOUNTS.nutri.email
      )
      
      if (nutriProfile) {
        const nutriForms = await createForms(nutriUser.id, NUTRI_FORMS)
        
        // Criar respostas para o primeiro formulário
        if (nutriForms.length > 0) {
          await createFormResponses(nutriForms[0].id, NUTRI_RESPONSES)
        }
        
        await createSampleQuizzes(nutriUser.id, 'nutri')
      }
    }

    console.log('\n=== CRIANDO CONTA DEMO COACH ===')
    // Criar conta demo Coach
    const coachUser = await createDemoUser(DEMO_ACCOUNTS.coach.email, DEMO_ACCOUNTS.coach.password)
    
    if (coachUser) {
      const coachProfile = await createUserProfile(
        coachUser.id, 
        DEMO_ACCOUNTS.coach.profile,
        DEMO_ACCOUNTS.coach.email
      )
      
      if (coachProfile) {
        const coachForms = await createForms(coachUser.id, COACH_FORMS)
        
        // Criar respostas para o primeiro formulário
        if (coachForms.length > 0) {
          await createFormResponses(coachForms[0].id, COACH_RESPONSES)
        }
        
        await createSampleQuizzes(coachUser.id, 'coach')
      }
    }

    console.log('\n🎉 DADOS DE DEMONSTRAÇÃO CRIADOS COM SUCESSO!')
    console.log('\n📋 CREDENCIAIS DE ACESSO:')
    console.log('=================================')
    console.log('🥗 CONTA DEMO NUTRI:')
    console.log(`   Email: ${DEMO_ACCOUNTS.nutri.email}`)
    console.log(`   Senha: ${DEMO_ACCOUNTS.nutri.password}`)
    console.log(`   URL: http://localhost:3000/pt/nutri`)
    console.log('')
    console.log('🏃 CONTA DEMO COACH:')
    console.log(`   Email: ${DEMO_ACCOUNTS.coach.email}`)
    console.log(`   Senha: ${DEMO_ACCOUNTS.coach.password}`)
    console.log(`   URL: http://localhost:3000/pt/coach`)
    console.log('=================================')
    console.log('\n✨ Agora você pode fazer login e gravar seus vídeos de demonstração!')
    console.log('\n🎬 O que foi criado:')
    console.log('   • Contas de usuário com perfis completos')
    console.log('   • Formulários de exemplo com campos realistas')
    console.log('   • Respostas fictícias para simular uso real')
    console.log('   • Quizzes interativos com configurações')
    console.log('   • Dados de visualizações e leads')

  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar script
main()
