#!/usr/bin/env ts-node

/**
 * Script para criar contas de demonstração com dados fictícios
 * Para gravar vídeos de divulgação do YLADA
 */

import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

// Configuração do Supabase Admin
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

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
      cidade: 'São Paulo',
      estado: 'SP',
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
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      is_demo: true
    }
  }
}

// Dados fictícios para formulários
const SAMPLE_FORMS = {
  nutri: [
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
          },
          {
            id: 'medicamentos',
            type: 'textarea',
            label: 'Faz uso de algum medicamento?',
            placeholder: 'Liste os medicamentos que utiliza...',
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
          },
          {
            id: 'doces_frequencia',
            type: 'select',
            label: 'Com que frequência consome doces?',
            required: true,
            options: ['Nunca', 'Raramente', '2-3x por semana', 'Diariamente']
          }
        ]
      },
      is_active: true
    },
    {
      name: 'Avaliação de Composição Corporal',
      description: 'Formulário para coleta de dados antropométricos',
      form_type: 'avaliacao',
      structure: {
        fields: [
          {
            id: 'nome',
            type: 'text',
            label: 'Nome do Paciente',
            required: true
          },
          {
            id: 'data_nascimento',
            type: 'date',
            label: 'Data de Nascimento',
            required: true
          },
          {
            id: 'peso_atual',
            type: 'number',
            label: 'Peso Atual (kg)',
            required: true
          },
          {
            id: 'altura',
            type: 'number',
            label: 'Altura (cm)',
            required: true
          },
          {
            id: 'circunferencia_cintura',
            type: 'number',
            label: 'Circunferência da Cintura (cm)',
            required: false
          },
          {
            id: 'circunferencia_quadril',
            type: 'number',
            label: 'Circunferência do Quadril (cm)',
            required: false
          },
          {
            id: 'percentual_gordura',
            type: 'number',
            label: 'Percentual de Gordura (%)',
            required: false
          }
        ]
      },
      is_active: true
    }
  ],
  coach: [
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
            id: 'idade',
            type: 'number',
            label: 'Idade',
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
            id: 'energia_diaria',
            type: 'select',
            label: 'Como você se sente em relação à sua energia durante o dia?',
            required: true,
            options: ['Muito energizado', 'Energizado', 'Normal', 'Cansado', 'Exausto']
          },
          {
            id: 'objetivos_principais',
            type: 'checkbox',
            label: 'Quais são seus principais objetivos? (pode marcar mais de um)',
            required: true,
            options: [
              'Reduzir estresse',
              'Melhorar qualidade do sono',
              'Aumentar energia',
              'Melhorar relacionamentos',
              'Encontrar propósito',
              'Equilibrar vida pessoal e profissional'
            ]
          },
          {
            id: 'desafios_atuais',
            type: 'textarea',
            label: 'Quais são os principais desafios que você enfrenta atualmente?',
            placeholder: 'Descreva os desafios que gostaria de superar...',
            required: false
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
              'Desenvolvimento pessoal',
              'Família'
            ]
          },
          {
            id: 'meta_principal',
            type: 'textarea',
            label: 'Descreva sua meta principal para os próximos 3 meses',
            required: true
          },
          {
            id: 'motivacao',
            type: 'textarea',
            label: 'O que te motiva a alcançar essa meta?',
            required: true
          },
          {
            id: 'obstaculos',
            type: 'textarea',
            label: 'Quais obstáculos você identifica que podem dificultar o alcance dessa meta?',
            required: false
          }
        ]
      },
      is_active: true
    },
    {
      name: 'Avaliação de Equilíbrio Vida-Trabalho',
      description: 'Questionário sobre equilíbrio entre vida pessoal e profissional',
      form_type: 'avaliacao',
      structure: {
        fields: [
          {
            id: 'nome',
            type: 'text',
            label: 'Nome',
            required: true
          },
          {
            id: 'profissao',
            type: 'text',
            label: 'Profissão/Área de Atuação',
            required: true
          },
          {
            id: 'horas_trabalho',
            type: 'select',
            label: 'Quantas horas por dia você dedica ao trabalho?',
            required: true,
            options: ['Menos de 6h', '6-8h', '8-10h', '10-12h', 'Mais de 12h']
          },
          {
            id: 'satisfacao_trabalho',
            type: 'select',
            label: 'Qual seu nível de satisfação com o trabalho atual?',
            required: true,
            options: ['Muito insatisfeito', 'Insatisfeito', 'Neutro', 'Satisfeito', 'Muito satisfeito']
          },
          {
            id: 'tempo_familia',
            type: 'select',
            label: 'Quanto tempo consegue dedicar à família/vida pessoal?',
            required: true,
            options: ['Muito pouco', 'Pouco', 'Suficiente', 'Bastante', 'Muito']
          },
          {
            id: 'nivel_equilibrio',
            type: 'select',
            label: 'Como avalia o equilíbrio atual entre vida pessoal e profissional?',
            required: true,
            options: ['Muito desequilibrado', 'Desequilibrado', 'Neutro', 'Equilibrado', 'Muito equilibrado']
          }
        ]
      },
      is_active: true
    }
  ]
}

// Dados fictícios para respostas de formulários
const SAMPLE_RESPONSES = {
  nutri: [
    {
      nome: 'Maria Silva Santos',
      email: 'maria.silva@email.com',
      telefone: '(11) 98765-4321',
      idade: 32,
      peso: 68,
      altura: 165,
      objetivo: 'Perder peso',
      atividade_fisica: '3-4x por semana',
      restricoes: 'Intolerância à lactose',
      medicamentos: 'Não faço uso de medicamentos'
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
      restricoes: 'Nenhuma restrição',
      medicamentos: 'Whey protein e creatina'
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
      restricoes: 'Diabética tipo 2',
      medicamentos: 'Metformina 850mg'
    },
    {
      nome: 'Carlos Eduardo Costa',
      email: 'carlos.costa@email.com',
      telefone: '(11) 96543-2109',
      idade: 38,
      peso: 95,
      altura: 175,
      objetivo: 'Reduzir colesterol',
      atividade_fisica: 'Sedentário',
      restricoes: 'Colesterol alto',
      medicamentos: 'Sinvastatina 20mg'
    },
    {
      nome: 'Fernanda Rodrigues',
      email: 'fernanda.rodrigues@email.com',
      telefone: '(11) 95432-1098',
      idade: 29,
      peso: 58,
      altura: 162,
      objetivo: 'Melhorar saúde geral',
      atividade_fisica: '3-4x por semana',
      restricoes: 'Vegetariana',
      medicamentos: 'Complexo B e Vitamina D'
    }
  ],
  coach: [
    {
      nome: 'Roberto Silva Mendes',
      email: 'roberto.mendes@email.com',
      telefone: '(11) 94321-0987',
      idade: 35,
      nivel_estresse: 'Alto',
      qualidade_sono: 'Ruim',
      energia_diaria: 'Cansado',
      objetivos_principais: ['Reduzir estresse', 'Melhorar qualidade do sono'],
      desafios_atuais: 'Excesso de trabalho e dificuldade para relaxar'
    },
    {
      nome: 'Juliana Pereira Santos',
      email: 'juliana.santos@email.com',
      telefone: '(11) 93210-9876',
      idade: 31,
      nivel_estresse: 'Moderado',
      qualidade_sono: 'Regular',
      energia_diaria: 'Normal',
      objetivos_principais: ['Equilibrar vida pessoal e profissional', 'Encontrar propósito'],
      desafios_atuais: 'Dificuldade em conciliar carreira e maternidade'
    },
    {
      nome: 'Marcos Antonio Lima',
      email: 'marcos.lima@email.com',
      telefone: '(11) 92109-8765',
      idade: 42,
      nivel_estresse: 'Muito alto',
      qualidade_sono: 'Péssima',
      energia_diaria: 'Exausto',
      objetivos_principais: ['Reduzir estresse', 'Aumentar energia'],
      desafios_atuais: 'Pressão no trabalho e problemas familiares'
    },
    {
      nome: 'Patricia Oliveira Costa',
      email: 'patricia.costa@email.com',
      telefone: '(11) 91098-7654',
      idade: 27,
      nivel_estresse: 'Baixo',
      qualidade_sono: 'Boa',
      energia_diaria: 'Energizado',
      objetivos_principais: ['Melhorar relacionamentos', 'Desenvolvimento pessoal'],
      desafios_atuais: 'Timidez e dificuldade para se expressar'
    },
    {
      nome: 'Leonardo Ferreira Souza',
      email: 'leonardo.souza@email.com',
      telefone: '(11) 90987-6543',
      idade: 39,
      nivel_estresse: 'Moderado',
      qualidade_sono: 'Regular',
      energia_diaria: 'Normal',
      objetivos_principais: ['Encontrar propósito', 'Equilibrar vida pessoal e profissional'],
      desafios_atuais: 'Insatisfação profissional e busca por novos rumos'
    }
  ]
}

// Função para criar usuário no Supabase Auth
async function createDemoUser(email: string, password: string) {
  console.log(`🔐 Criando usuário: ${email}`)
  
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  })

  if (error) {
    console.error(`❌ Erro ao criar usuário ${email}:`, error)
    return null
  }

  console.log(`✅ Usuário criado: ${email}`)
  return data.user
}

// Função para criar perfil do usuário
async function createUserProfile(userId: string, profileData: any) {
  console.log(`👤 Criando perfil para usuário: ${userId}`)
  
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .insert({
      user_id: userId,
      ...profileData,
      email: profileData.email || ''
    })
    .select()
    .single()

  if (error) {
    console.error(`❌ Erro ao criar perfil:`, error)
    return null
  }

  console.log(`✅ Perfil criado para: ${profileData.nome_completo}`)
  return data
}

// Função para criar formulários
async function createForms(userId: string, forms: any[]) {
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
      console.error(`❌ Erro ao criar formulário "${form.name}":`, error)
      continue
    }

    console.log(`✅ Formulário criado: "${form.name}"`)
    createdForms.push(data)
  }

  return createdForms
}

// Função para criar respostas fictícias
async function createFormResponses(formId: string, responses: any[]) {
  console.log(`💬 Criando ${responses.length} respostas para formulário: ${formId}`)
  
  for (const response of responses) {
    const { error } = await supabaseAdmin
      .from('form_responses')
      .insert({
        form_id: formId,
        response_data: response,
        submitted_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Últimos 30 dias
      })

    if (error) {
      console.error(`❌ Erro ao criar resposta:`, error)
      continue
    }
  }

  console.log(`✅ Respostas criadas para formulário: ${formId}`)
}

// Função para criar quizzes de exemplo
async function createSampleQuizzes(userId: string, area: 'nutri' | 'coach') {
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
      slug: `metabolismo-${randomUUID().slice(0, 8)}`,
      status: 'active' as const
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
      slug: `perfil-alimentar-${randomUUID().slice(0, 8)}`,
      status: 'active' as const
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
      slug: `bem-estar-${randomUUID().slice(0, 8)}`,
      status: 'active' as const
    },
    {
      titulo: 'Qual seu Estilo de Liderança?',
      descricao: 'Identifique seu perfil de liderança e como desenvolvê-lo',
      emoji: '👑',
      cores: {
        primaria: '#F59E0B',
        secundaria: '#FEF3C7',
        texto: '#1F2937',
        fundo: '#FFFFFF'
      },
      slug: `lideranca-${randomUUID().slice(0, 8)}`,
      status: 'active' as const
    }
  ]

  for (const quiz of quizzes) {
    const { data, error } = await supabaseAdmin
      .from('quizzes')
      .insert({
        user_id: userId,
        ...quiz,
        views: Math.floor(Math.random() * 500) + 50,
        leads_count: Math.floor(Math.random() * 100) + 10
      })
      .select()
      .single()

    if (error) {
      console.error(`❌ Erro ao criar quiz "${quiz.titulo}":`, error)
      continue
    }

    console.log(`✅ Quiz criado: "${quiz.titulo}"`)
  }
}

// Função principal
async function seedDemoData() {
  console.log('🚀 Iniciando criação de dados de demonstração...\n')

  try {
    // Criar conta demo Nutri
    console.log('=== CRIANDO CONTA DEMO NUTRI ===')
    const nutriUser = await createDemoUser(DEMO_ACCOUNTS.nutri.email, DEMO_ACCOUNTS.nutri.password)
    
    if (nutriUser) {
      const nutriProfile = await createUserProfile(nutriUser.id, {
        ...DEMO_ACCOUNTS.nutri.profile,
        email: DEMO_ACCOUNTS.nutri.email
      })
      
      if (nutriProfile) {
        const nutriForms = await createForms(nutriUser.id, SAMPLE_FORMS.nutri)
        
        // Criar respostas para o primeiro formulário
        if (nutriForms.length > 0) {
          await createFormResponses(nutriForms[0].id, SAMPLE_RESPONSES.nutri)
        }
        
        await createSampleQuizzes(nutriUser.id, 'nutri')
      }
    }

    console.log('\n=== CRIANDO CONTA DEMO COACH ===')
    // Criar conta demo Coach
    const coachUser = await createDemoUser(DEMO_ACCOUNTS.coach.email, DEMO_ACCOUNTS.coach.password)
    
    if (coachUser) {
      const coachProfile = await createUserProfile(coachUser.id, {
        ...DEMO_ACCOUNTS.coach.profile,
        email: DEMO_ACCOUNTS.coach.email
      })
      
      if (coachProfile) {
        const coachForms = await createForms(coachUser.id, SAMPLE_FORMS.coach)
        
        // Criar respostas para o primeiro formulário
        if (coachForms.length > 0) {
          await createFormResponses(coachForms[0].id, SAMPLE_RESPONSES.coach)
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

  } catch (error) {
    console.error('❌ Erro geral:', error)
  }
}

// Executar script
if (require.main === module) {
  seedDemoData()
}

export { seedDemoData }
