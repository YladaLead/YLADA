#!/usr/bin/env node

/**
 * Script para completar os dados das contas demo
 * Execute após criar as contas com create-demo-accounts.js
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

const DEMO_EMAILS = {
  nutri: 'demo.nutri@ylada.com',
  coach: 'demo.coach@ylada.com'
}

// Buscar usuários demo
async function findDemoUsers() {
  console.log('🔍 Buscando usuários demo...')
  
  const users = {}
  
  for (const [area, email] of Object.entries(DEMO_EMAILS)) {
    const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers()
    const user = authUsers.users.find(u => u.email === email)
    
    if (user) {
      console.log(`✅ Usuário ${area} encontrado: ${user.id}`)
      users[area] = user
    } else {
      console.log(`❌ Usuário ${area} não encontrado`)
    }
  }
  
  return users
}

// Completar perfis
async function completeProfiles(users) {
  console.log('👤 Completando perfis...')
  
  for (const [area, user] of Object.entries(users)) {
    const profileData = {
      perfil: area,
      nome_completo: area === 'nutri' ? 'Dra. Ana Nutricionista' : 'Carlos Coach Wellness',
      telefone: area === 'nutri' ? '(11) 99999-1234' : '(11) 99999-5678',
      is_demo: true
    }
    
    // Verificar se perfil já existe
    const { data: existingProfile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    
    if (existingProfile) {
      console.log(`⚠️ Perfil ${area} já existe, atualizando...`)
      const { error } = await supabaseAdmin
        .from('user_profiles')
        .update(profileData)
        .eq('user_id', user.id)
      
      if (error) {
        console.error(`❌ Erro ao atualizar perfil ${area}:`, error.message)
      } else {
        console.log(`✅ Perfil ${area} atualizado`)
      }
    } else {
      console.log(`📝 Criando perfil ${area}...`)
      const { error } = await supabaseAdmin
        .from('user_profiles')
        .insert({
          user_id: user.id,
          email: user.email,
          ...profileData
        })
      
      if (error) {
        console.error(`❌ Erro ao criar perfil ${area}:`, error.message)
      } else {
        console.log(`✅ Perfil ${area} criado`)
      }
    }
  }
}

// Criar formulários
async function createForms(users) {
  console.log('📝 Criando formulários...')
  
  const NUTRI_FORMS = [
    {
      name: 'Anamnese Nutricional Completa',
      description: 'Avaliação completa do histórico alimentar e de saúde do paciente',
      form_type: 'anamnese',
      structure: {
        fields: [
          { id: 'nome', type: 'text', label: 'Nome Completo', required: true },
          { id: 'email', type: 'email', label: 'E-mail', required: true },
          { id: 'telefone', type: 'tel', label: 'Telefone/WhatsApp', required: true },
          { id: 'idade', type: 'number', label: 'Idade', required: true },
          { id: 'peso', type: 'number', label: 'Peso Atual (kg)', required: true },
          { id: 'altura', type: 'number', label: 'Altura (cm)', required: true },
          {
            id: 'objetivo',
            type: 'select',
            label: 'Qual seu principal objetivo?',
            required: true,
            options: ['Perder peso', 'Ganhar massa muscular', 'Melhorar saúde geral', 'Controlar diabetes']
          },
          {
            id: 'atividade_fisica',
            type: 'select',
            label: 'Frequência de atividade física',
            required: true,
            options: ['Sedentário', '1-2x por semana', '3-4x por semana', '5-6x por semana']
          },
          {
            id: 'restricoes',
            type: 'textarea',
            label: 'Possui alguma restrição alimentar ou alergia?',
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
          { id: 'nome', type: 'text', label: 'Nome', required: true },
          { id: 'email', type: 'email', label: 'E-mail', required: true },
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

  const COACH_FORMS = [
    {
      name: 'Avaliação de Bem-Estar Inicial',
      description: 'Questionário para entender o estado atual de bem-estar do cliente',
      form_type: 'avaliacao',
      structure: {
        fields: [
          { id: 'nome', type: 'text', label: 'Nome Completo', required: true },
          { id: 'email', type: 'email', label: 'E-mail', required: true },
          { id: 'telefone', type: 'tel', label: 'WhatsApp', required: true },
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
            options: ['Reduzir estresse', 'Melhorar qualidade do sono', 'Aumentar energia', 'Melhorar relacionamentos']
          }
        ]
      },
      is_active: true
    }
  ]

  // Criar formulários para Nutri
  if (users.nutri) {
    for (const form of NUTRI_FORMS) {
      const { data, error } = await supabaseAdmin
        .from('custom_forms')
        .insert({
          user_id: users.nutri.id,
          ...form
        })
        .select()
        .single()

      if (error) {
        console.error(`❌ Erro ao criar formulário nutri "${form.name}":`, error.message)
      } else {
        console.log(`✅ Formulário nutri criado: "${form.name}"`)
        
        // Criar algumas respostas fictícias
        await createSampleResponses(data.id, [
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
          }
        ])
      }
    }
  }

  // Criar formulários para Coach
  if (users.coach) {
    for (const form of COACH_FORMS) {
      const { data, error } = await supabaseAdmin
        .from('custom_forms')
        .insert({
          user_id: users.coach.id,
          ...form
        })
        .select()
        .single()

      if (error) {
        console.error(`❌ Erro ao criar formulário coach "${form.name}":`, error.message)
      } else {
        console.log(`✅ Formulário coach criado: "${form.name}"`)
        
        // Criar algumas respostas fictícias
        await createSampleResponses(data.id, [
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
            objetivos_principais: ['Equilibrar vida pessoal e profissional']
          }
        ])
      }
    }
  }
}

// Criar respostas fictícias
async function createSampleResponses(formId, responses) {
  for (const response of responses) {
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
    }
  }
  
  console.log(`💬 ${responses.length} respostas criadas para formulário ${formId}`)
}

// Função principal
async function main() {
  console.log('🚀 Completando dados de demonstração...\n')

  try {
    const users = await findDemoUsers()
    
    if (Object.keys(users).length === 0) {
      console.log('❌ Nenhum usuário demo encontrado. Execute primeiro: node create-demo-accounts.js')
      return
    }

    await completeProfiles(users)
    await createForms(users)

    console.log('\n🎉 DADOS COMPLETADOS COM SUCESSO!')
    console.log('\n📋 CREDENCIAIS DE ACESSO:')
    console.log('=================================')
    console.log('🥗 CONTA DEMO NUTRI:')
    console.log(`   Email: ${DEMO_EMAILS.nutri}`)
    console.log(`   Senha: DemoYlada2024!`)
    console.log(`   URL: http://localhost:3000/pt/nutri`)
    console.log('')
    console.log('🏃 CONTA DEMO COACH:')
    console.log(`   Email: ${DEMO_EMAILS.coach}`)
    console.log(`   Senha: DemoYlada2024!`)
    console.log(`   URL: http://localhost:3000/pt/coach`)
    console.log('=================================')
    console.log('\n✨ Agora você pode fazer login e gravar seus vídeos!')

  } catch (error) {
    console.error('❌ Erro:', error)
  }
}

main()
