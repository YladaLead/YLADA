require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function populateClientTabs() {
  console.log('🔄 Populando todas as abas dos clientes demo...');

  try {
    // Buscar usuário nutri demo
    const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
    if (userError) {
      console.error('❌ Erro ao buscar usuários:', userError.message);
      return;
    }

    const nutriUser = users.users.find(u => u.email === 'demo.nutri@ylada.com');
    if (!nutriUser) {
      console.error('❌ Usuário demo nutri não encontrado');
      return;
    }

    const userId = nutriUser.id;
    console.log(`✅ Usuário encontrado: ${userId}`);

    // Buscar clientes
    const { data: clients, error: clientsError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .eq('user_id', userId);

    if (clientsError) {
      console.error('❌ Erro ao buscar clientes:', clientsError.message);
      return;
    }

    console.log(`📋 Encontrados ${clients.length} clientes`);

    // Popular dados para cada cliente
    for (const client of clients) {
      console.log(`\n👤 Populando dados para: ${client.name}`);
      
      await populateClientEvolution(client.id, userId);
      await populateClientAssessments(client.id, userId);
      await populateClientEmotional(client.id, userId);
      await populateClientHistory(client.id, userId);
      await populateClientPrograms(client.id, userId);
    }

    console.log('\n✅ Todas as abas foram populadas com sucesso!');
    console.log('\n📋 Dados criados:');
    console.log('   • Evolução Física: Medidas e peso com histórico');
    console.log('   • Avaliações: Avaliações físicas completas');
    console.log('   • Emocional: Registros emocionais e comportamentais');
    console.log('   • Histórico: Timeline completa de atividades');
    console.log('   • Programas: Planos alimentares e orientações');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

async function populateClientEvolution(clientId, userId) {
  console.log('  📈 Criando evolução física...');
  
  const evolutions = [
    {
      measurement_date: '2024-10-15',
      weight: 75.2,
      height: 165,
      waist_circumference: 85,
      hip_circumference: 98,
      neck_circumference: 35,
      arm_circumference: 28,
      thigh_circumference: 58,
      body_fat_percentage: 28.5,
      muscle_mass: 48.2,
      water_percentage: 55.8,
      visceral_fat: 8,
      notes: 'Primeira medição. Cliente motivada para mudanças.',
    },
    {
      measurement_date: '2024-11-01',
      weight: 73.8,
      height: 165,
      waist_circumference: 83,
      hip_circumference: 96,
      neck_circumference: 34.5,
      arm_circumference: 27.5,
      thigh_circumference: 57,
      body_fat_percentage: 27.2,
      muscle_mass: 49.1,
      water_percentage: 56.2,
      visceral_fat: 7,
      notes: 'Boa evolução! Perdeu 1.4kg e reduziu medidas.',
    },
    {
      measurement_date: '2024-11-15',
      weight: 72.5,
      height: 165,
      waist_circumference: 81,
      hip_circumference: 94,
      neck_circumference: 34,
      arm_circumference: 27,
      thigh_circumference: 56,
      body_fat_percentage: 26.1,
      muscle_mass: 49.8,
      water_percentage: 56.8,
      visceral_fat: 6,
      notes: 'Excelente progresso! Mantendo massa muscular.',
    }
  ];

  for (const evolution of evolutions) {
    const bmi = evolution.weight / Math.pow(evolution.height / 100, 2);
    
    try {
      const { error } = await supabaseAdmin
        .from('client_evolution')
        .insert({
          client_id: clientId,
          user_id: userId,
          ...evolution,
          bmi: parseFloat(bmi.toFixed(1)),
          created_by: userId,
          created_at: `${evolution.measurement_date}T10:00:00Z`
        });

      if (error && !error.message.includes('duplicate key')) {
        console.error(`    ❌ Erro ao criar evolução ${evolution.measurement_date}:`, error.message);
      }
    } catch (err) {
      // Ignorar erros de duplicata
    }
  }
}

async function populateClientAssessments(clientId, userId) {
  console.log('  🏥 Criando avaliações físicas...');
  
  const assessments = [
    {
      assessment_date: '2024-10-15',
      assessment_type: 'inicial',
      status: 'completo',
      anthropometric_data: {
        weight: 75.2,
        height: 165,
        bmi: 27.6,
        waist: 85,
        hip: 98,
        neck: 35
      },
      clinical_data: {
        blood_pressure: '130/85',
        heart_rate: 78,
        glucose: 95,
        cholesterol: 210,
        triglycerides: 150
      },
      lifestyle_data: {
        physical_activity: 'Sedentária',
        sleep_hours: 6,
        stress_level: 7,
        water_intake: 1.2,
        alcohol_consumption: 'Ocasional'
      },
      medical_history: {
        allergies: 'Lactose',
        medications: 'Anticoncepcional',
        diseases: 'Diabetes tipo 2 controlada',
        surgeries: 'Nenhuma'
      },
      notes: 'Paciente com diabetes tipo 2 bem controlada. Objetivo: perda de peso e melhora da composição corporal.',
      recommendations: 'Dieta hipocalórica, exercícios regulares, monitoramento glicêmico.'
    },
    {
      assessment_date: '2024-11-15',
      assessment_type: 'reavaliacao',
      status: 'completo',
      is_reevaluation: true,
      anthropometric_data: {
        weight: 72.5,
        height: 165,
        bmi: 26.6,
        waist: 81,
        hip: 94,
        neck: 34
      },
      clinical_data: {
        blood_pressure: '125/80',
        heart_rate: 72,
        glucose: 88,
        cholesterol: 195,
        triglycerides: 130
      },
      lifestyle_data: {
        physical_activity: 'Moderada - 3x/semana',
        sleep_hours: 7,
        stress_level: 5,
        water_intake: 2.0,
        alcohol_consumption: 'Raro'
      },
      notes: 'Excelente evolução! Perda de 2.7kg, melhora nos exames laboratoriais.',
      recommendations: 'Manter plano atual, aumentar atividade física gradualmente.'
    }
  ];

  for (const assessment of assessments) {
    try {
      const { error } = await supabaseAdmin
        .from('assessments')
        .insert({
          client_id: clientId,
          user_id: userId,
          ...assessment,
          completed_at: assessment.status === 'completo' ? `${assessment.assessment_date}T14:00:00Z` : null,
          created_by: userId,
          created_at: `${assessment.assessment_date}T10:00:00Z`
        });

      if (error && !error.message.includes('duplicate key')) {
        console.error(`    ❌ Erro ao criar avaliação ${assessment.assessment_date}:`, error.message);
      }
    } catch (err) {
      // Ignorar erros de duplicata
    }
  }
}

async function populateClientEmotional(clientId, userId) {
  console.log('  💭 Criando registros emocionais...');
  
  const emotionalRecords = [
    {
      record_date: '2024-10-20',
      record_type: 'emocional',
      emotional_state: 'Ansiosa',
      stress_level: 8,
      mood_score: 6,
      sleep_quality: 5,
      energy_level: 4,
      emotional_notes: 'Semana difícil no trabalho, comeu mais doces que o normal.',
      triggers: 'Estresse no trabalho, reuniões importantes'
    },
    {
      record_date: '2024-10-25',
      record_type: 'comportamental',
      adherence_score: 7,
      patterns_identified: 'Come mais quando está ansiosa',
      behavioral_notes: 'Seguiu bem a dieta durante a semana, deslizou no fim de semana.',
      triggers: 'Eventos sociais, ansiedade'
    },
    {
      record_date: '2024-11-05',
      record_type: 'emocional',
      emotional_state: 'Motivada',
      stress_level: 5,
      mood_score: 8,
      sleep_quality: 7,
      energy_level: 7,
      emotional_notes: 'Sentindo-se mais confiante com os resultados obtidos.',
      triggers: 'Feedback positivo dos resultados'
    },
    {
      record_date: '2024-11-10',
      record_type: 'comportamental',
      adherence_score: 9,
      patterns_identified: 'Melhor controle emocional da alimentação',
      behavioral_notes: 'Excelente aderência ao plano. Conseguiu resistir às tentações.',
      triggers: 'Motivação pelos resultados'
    }
  ];

  for (const record of emotionalRecords) {
    try {
      const { error } = await supabaseAdmin
        .from('emotional_behavioral_history')
        .insert({
          client_id: clientId,
          user_id: userId,
          ...record,
          created_by: userId,
          created_at: `${record.record_date}T16:00:00Z`
        });

      if (error && !error.message.includes('duplicate key')) {
        console.error(`    ❌ Erro ao criar registro emocional ${record.record_date}:`, error.message);
      }
    } catch (err) {
      // Ignorar erros de duplicata
    }
  }
}

async function populateClientHistory(clientId, userId) {
  console.log('  📜 Criando histórico de atividades...');
  
  const historyEvents = [
    {
      activity_type: 'consulta',
      title: 'Consulta Inicial',
      description: 'Primeira consulta - anamnese completa e definição de objetivos.',
      created_at: '2024-10-15T09:00:00Z'
    },
    {
      activity_type: 'programa_criado',
      title: 'Plano Alimentar Criado',
      description: 'Criado plano alimentar personalizado para perda de peso.',
      created_at: '2024-10-15T15:00:00Z'
    },
    {
      activity_type: 'nota_adicionada',
      title: 'Orientações Adicionais',
      description: 'Enviadas orientações sobre hidratação e suplementação.',
      created_at: '2024-10-18T10:30:00Z'
    },
    {
      activity_type: 'consulta',
      title: 'Consulta de Retorno',
      description: 'Avaliação do progresso e ajustes no plano alimentar.',
      created_at: '2024-11-01T14:00:00Z'
    },
    {
      activity_type: 'programa_atualizado',
      title: 'Plano Atualizado',
      description: 'Ajustes no plano alimentar baseados na evolução.',
      created_at: '2024-11-01T15:30:00Z'
    },
    {
      activity_type: 'reavaliacao',
      title: 'Reavaliação Completa',
      description: 'Reavaliação antropométrica e laboratorial.',
      created_at: '2024-11-15T10:00:00Z'
    }
  ];

  for (const event of historyEvents) {
    try {
      const { error } = await supabaseAdmin
        .from('client_history')
        .insert({
          client_id: clientId,
          user_id: userId,
          ...event,
          created_by: userId
        });

      if (error && !error.message.includes('duplicate key')) {
        console.error(`    ❌ Erro ao criar evento histórico:`, error.message);
      }
    } catch (err) {
      // Ignorar erros de duplicata
    }
  }
}

async function populateClientPrograms(clientId, userId) {
  console.log('  📋 Criando programas alimentares...');
  
  const programs = [
    {
      program_name: 'Plano Alimentar Inicial',
      program_type: 'nutricional',
      status: 'ativo',
      start_date: '2024-10-15',
      description: 'Plano hipocalórico personalizado para controle do diabetes e perda de peso.',
      goals: 'Perda de 5kg em 2 meses, controle glicêmico, melhora da composição corporal.',
      meal_plan: {
        cafe_manha: {
          opcao1: '1 fatia de pão integral + 1 ovo mexido + 1 xíc. café s/ açúcar',
          opcao2: '1 iogurte natural + 2 col. sopa aveia + frutas vermelhas',
          opcao3: '1 tapioca pequena + 1 col. sopa cottage + 1 fruta'
        },
        lanche_manha: {
          opcao1: '1 fruta + 10 castanhas',
          opcao2: '1 iogurte natural + canela',
          opcao3: '1 xíc. chá verde + 2 biscoitos integrais'
        },
        almoco: {
          opcao1: '100g frango grelhado + 3 col. sopa arroz integral + salada verde',
          opcao2: '100g peixe assado + 1 batata doce média + legumes refogados',
          opcao3: '100g carne magra + 3 col. sopa quinoa + salada colorida'
        },
        lanche_tarde: {
          opcao1: '1 fruta + 1 col. sopa pasta amendoim',
          opcao2: '1 vitamina (leite vegetal + fruta + aveia)',
          opcao3: '1 fatia queijo branco + tomate cereja'
        },
        jantar: {
          opcao1: '100g peixe + salada grande + 2 col. sopa batata doce',
          opcao2: 'Omelete (2 ovos + legumes) + salada verde',
          opcao3: '100g frango + sopa de legumes + 1 fatia pão integral'
        }
      },
      supplements: [
        'Ômega 3 - 1 cápsula/dia',
        'Vitamina D - 2000UI/dia',
        'Magnésio - 1 cápsula antes de dormir'
      ],
      guidelines: [
        'Beber 2L de água por dia',
        'Fazer 5-6 refeições pequenas',
        'Evitar açúcar refinado e doces',
        'Priorizar alimentos integrais',
        'Monitorar glicemia 2x/dia'
      ],
      created_at: '2024-10-15T15:00:00Z'
    }
  ];

  for (const program of programs) {
    try {
      const { error } = await supabaseAdmin
        .from('nutrition_programs')
        .insert({
          client_id: clientId,
          user_id: userId,
          ...program,
          created_by: userId
        });

      if (error && !error.message.includes('duplicate key')) {
        console.error(`    ❌ Erro ao criar programa:`, error.message);
      }
    } catch (err) {
      // Ignorar erros de duplicata ou tabela inexistente
      console.log(`    ⚠️ Tabela nutrition_programs pode não existir ainda`);
    }
  }
}

populateClientTabs();
