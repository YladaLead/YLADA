require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function completeClientTabs() {
  console.log('🔄 Completando todas as abas dos clientes com dados realistas...');

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

    // Focar na Fernanda (caso de sucesso) e outros clientes ativos
    for (const client of clients) {
      console.log(`\n👤 Completando dados para: ${client.name}`);
      
      if (client.name === 'Fernanda Rodrigues') {
        await completeFernandaData(client.id, userId);
      } else if (client.name === 'Maria Silva Santos') {
        await completeMariaData(client.id, userId);
      } else if (client.name === 'Roberto Silva Mendes') {
        await completeRobertoData(client.id, userId);
      }
    }

    console.log('\n✅ Todas as abas foram completadas com sucesso!');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

async function completeFernandaData(clientId, userId) {
  console.log('  🎉 Fernanda - Caso de SUCESSO (-10kg)');
  
  // 1. EVOLUÇÃO FÍSICA - Jornada completa de 4 meses
  const evolutions = [
    {
      measurement_date: '2024-06-01',
      weight: 68.0,
      height: 162,
      waist_circumference: 85,
      hip_circumference: 105,
      neck_circumference: 36,
      arm_circumference: 30,
      thigh_circumference: 62,
      body_fat_percentage: 32.0,
      muscle_mass: 48.0,
      water_percentage: 52.0,
      visceral_fat: 9,
      notes: 'Medição inicial pós-parto. Meta: 58kg'
    },
    {
      measurement_date: '2024-06-15',
      weight: 66.5,
      height: 162,
      waist_circumference: 83,
      hip_circumference: 103,
      neck_circumference: 35.5,
      arm_circumference: 29.5,
      thigh_circumference: 61,
      body_fat_percentage: 31.2,
      muscle_mass: 48.2,
      water_percentage: 52.8,
      visceral_fat: 8,
      notes: 'Primeira quinzena: -1.5kg. Boa aderência!'
    },
    {
      measurement_date: '2024-07-01',
      weight: 64.8,
      height: 162,
      waist_circumference: 81,
      hip_circumference: 101,
      neck_circumference: 35,
      arm_circumference: 29,
      thigh_circumference: 60,
      body_fat_percentage: 30.1,
      muscle_mass: 48.5,
      water_percentage: 53.5,
      visceral_fat: 7,
      notes: 'Primeiro mês: -3.2kg total. Introduzindo exercícios.'
    },
    {
      measurement_date: '2024-08-01',
      weight: 63.0,
      height: 162,
      waist_circumference: 78,
      hip_circumference: 98,
      neck_circumference: 34.5,
      arm_circumference: 28.5,
      thigh_circumference: 58,
      body_fat_percentage: 28.5,
      muscle_mass: 49.0,
      water_percentage: 54.2,
      visceral_fat: 6,
      notes: 'Segundo mês: -5kg total. Excelente progresso!'
    },
    {
      measurement_date: '2024-09-01',
      weight: 60.5,
      height: 162,
      waist_circumference: 75,
      hip_circumference: 96,
      neck_circumference: 34,
      arm_circumference: 28,
      thigh_circumference: 57,
      body_fat_percentage: 26.2,
      muscle_mass: 49.2,
      water_percentage: 55.0,
      visceral_fat: 5,
      notes: 'Terceiro mês: -7.5kg total. Mantendo massa muscular.'
    },
    {
      measurement_date: '2024-10-01',
      weight: 58.0,
      height: 162,
      waist_circumference: 70,
      hip_circumference: 95,
      neck_circumference: 33.5,
      arm_circumference: 27.5,
      thigh_circumference: 56,
      body_fat_percentage: 22.0,
      muscle_mass: 49.5,
      water_percentage: 56.0,
      visceral_fat: 4,
      notes: '🎉 META ATINGIDA! -10kg em 4 meses!'
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
          measurement_date: evolution.measurement_date,
          weight: evolution.weight,
          height: evolution.height,
          waist_circumference: evolution.waist_circumference,
          hip_circumference: evolution.hip_circumference,
          neck_circumference: evolution.neck_circumference,
          arm_circumference: evolution.arm_circumference,
          thigh_circumference: evolution.thigh_circumference,
          body_fat_percentage: evolution.body_fat_percentage,
          muscle_mass: evolution.muscle_mass,
          water_percentage: evolution.water_percentage,
          visceral_fat: evolution.visceral_fat,
          bmi: parseFloat(bmi.toFixed(1)),
          notes: evolution.notes,
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

  // 2. REGISTROS EMOCIONAIS/COMPORTAMENTAIS
  const emotionalRecords = [
    {
      record_date: '2024-06-05',
      record_type: 'emocional',
      emotional_state: 'Determinada',
      stress_level: 6,
      mood_score: 7,
      sleep_quality: 'Regular',
      energy_level: 'Baixa',
      emotional_notes: 'Motivada para mudança pós-parto. Ansiedade sobre amamentação.',
      patterns_identified: ['Comer quando ansiosa', 'Pular refeições por falta de tempo'],
      triggers: ['Choro do bebê', 'Cansaço extremo'],
      notes: 'Primeira semana: adaptação ao novo plano'
    },
    {
      record_date: '2024-06-20',
      record_type: 'comportamental',
      adherence_score: 8,
      meal_following_percentage: 85.0,
      exercise_frequency: 'Caminhada 3x/semana',
      water_intake_liters: 2.2,
      behavioral_notes: 'Boa aderência! Organizou horários das refeições.',
      patterns_identified: ['Melhor planejamento das refeições'],
      triggers: ['Rotina estabelecida ajudou muito'],
      notes: 'Terceira semana: criando novos hábitos'
    },
    {
      record_date: '2024-07-10',
      record_type: 'emocional',
      emotional_state: 'Confiante',
      stress_level: 4,
      mood_score: 8,
      sleep_quality: 'Boa',
      energy_level: 'Moderada',
      emotional_notes: 'Vendo resultados! Autoestima melhorando significativamente.',
      patterns_identified: ['Menos episódios de ansiedade'],
      triggers: ['Feedback positivo dos resultados'],
      notes: 'Sexta semana: transformação emocional visível'
    },
    {
      record_date: '2024-08-15',
      record_type: 'comportamental',
      adherence_score: 9,
      meal_following_percentage: 92.0,
      exercise_frequency: 'Exercícios 4x/semana',
      water_intake_liters: 2.5,
      behavioral_notes: 'Excelente! Exercícios se tornaram prazerosos.',
      patterns_identified: ['Exercício como válvula de escape'],
      triggers: ['Endorfina pós-treino'],
      notes: 'Décima semana: hábitos consolidados'
    },
    {
      record_date: '2024-09-20',
      record_type: 'emocional',
      emotional_state: 'Radiante',
      stress_level: 3,
      mood_score: 9,
      sleep_quality: 'Excelente',
      energy_level: 'Alta',
      emotional_notes: 'Transformação completa! Confiança restaurada.',
      patterns_identified: ['Controle emocional total da alimentação'],
      triggers: ['Roupas antigas servindo novamente'],
      notes: 'Décima quinta semana: nova pessoa!'
    },
    {
      record_date: '2024-10-05',
      record_type: 'comportamental',
      adherence_score: 10,
      meal_following_percentage: 95.0,
      exercise_frequency: 'Rotina estabelecida 5x/semana',
      water_intake_liters: 3.0,
      behavioral_notes: 'PERFEITO! Hábitos completamente internalizados.',
      patterns_identified: ['Estilo de vida saudável consolidado'],
      triggers: ['Bem-estar geral como motivação'],
      notes: 'Meta atingida: transição para manutenção'
    }
  ];

  for (const record of emotionalRecords) {
    try {
      const { error } = await supabaseAdmin
        .from('emotional_behavioral_history')
        .insert({
          client_id: clientId,
          user_id: userId,
          record_date: record.record_date,
          record_type: record.record_type,
          emotional_state: record.emotional_state,
          stress_level: record.stress_level,
          mood_score: record.mood_score,
          sleep_quality: record.sleep_quality,
          energy_level: record.energy_level,
          emotional_notes: record.emotional_notes,
          adherence_score: record.adherence_score,
          meal_following_percentage: record.meal_following_percentage,
          exercise_frequency: record.exercise_frequency,
          water_intake_liters: record.water_intake_liters,
          behavioral_notes: record.behavioral_notes,
          patterns_identified: record.patterns_identified,
          triggers: record.triggers,
          notes: record.notes,
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

  console.log('  ✅ Fernanda: 6 evoluções físicas + 6 registros emocionais criados');
}

async function completeMariaData(clientId, userId) {
  console.log('  💊 Maria - Diabetes controlado');
  
  // Evolução física focada no controle do diabetes
  const evolutions = [
    {
      measurement_date: '2024-09-15',
      weight: 78.0,
      height: 165,
      waist_circumference: 88,
      hip_circumference: 102,
      body_fat_percentage: 30.5,
      muscle_mass: 47.5,
      notes: 'Primeira medição. Diabetes descontrolado.'
    },
    {
      measurement_date: '2024-10-01',
      weight: 76.8,
      height: 165,
      waist_circumference: 86,
      hip_circumference: 100,
      body_fat_percentage: 29.8,
      muscle_mass: 48.0,
      notes: 'Primeira quinzena: -1.2kg. Glicemia melhorando.'
    },
    {
      measurement_date: '2024-10-15',
      weight: 75.2,
      height: 165,
      waist_circumference: 85,
      hip_circumference: 98,
      body_fat_percentage: 28.5,
      muscle_mass: 48.2,
      notes: 'Primeiro mês: -2.8kg. HbA1c de 8.2% para 7.1%!'
    },
    {
      measurement_date: '2024-11-01',
      weight: 73.8,
      height: 165,
      waist_circumference: 83,
      hip_circumference: 96,
      body_fat_percentage: 27.2,
      muscle_mass: 49.1,
      notes: 'Excelente! Diabetes controlado, energia alta.'
    }
  ];

  for (const evolution of evolutions) {
    const bmi = evolution.weight / Math.pow(evolution.height / 100, 2);
    
    try {
      await supabaseAdmin
        .from('client_evolution')
        .insert({
          client_id: clientId,
          user_id: userId,
          measurement_date: evolution.measurement_date,
          weight: evolution.weight,
          height: evolution.height,
          waist_circumference: evolution.waist_circumference,
          hip_circumference: evolution.hip_circumference,
          body_fat_percentage: evolution.body_fat_percentage,
          muscle_mass: evolution.muscle_mass,
          bmi: parseFloat(bmi.toFixed(1)),
          notes: evolution.notes,
          created_by: userId,
          created_at: `${evolution.measurement_date}T10:00:00Z`
        });
    } catch (err) {
      // Ignorar erros de duplicata
    }
  }

  // Registros emocionais focados no diabetes
  const emotionalRecords = [
    {
      record_date: '2024-09-20',
      record_type: 'emocional',
      emotional_state: 'Preocupada',
      stress_level: 8,
      mood_score: 5,
      sleep_quality: 'Ruim',
      energy_level: 'Muito baixa',
      emotional_notes: 'Medo das complicações do diabetes. Ansiedade com mudanças.',
      patterns_identified: ['Come doce quando ansiosa'],
      triggers: ['Glicemia alta', 'Sintomas do diabetes']
    },
    {
      record_date: '2024-10-10',
      record_type: 'comportamental',
      adherence_score: 8,
      meal_following_percentage: 88.0,
      water_intake_liters: 2.0,
      behavioral_notes: 'Seguindo bem o plano. Monitorando glicemia religiosamente.',
      patterns_identified: ['Disciplina com horários das refeições'],
      triggers: ['Medo das complicações motiva aderência']
    },
    {
      record_date: '2024-11-05',
      record_type: 'emocional',
      emotional_state: 'Aliviada',
      stress_level: 4,
      mood_score: 8,
      sleep_quality: 'Boa',
      energy_level: 'Alta',
      emotional_notes: 'Resultados dos exames excelentes! Confiança restaurada.',
      patterns_identified: ['Controle emocional melhorou muito'],
      triggers: ['Feedback positivo dos exames']
    }
  ];

  for (const record of emotionalRecords) {
    try {
      await supabaseAdmin
        .from('emotional_behavioral_history')
        .insert({
          client_id: clientId,
          user_id: userId,
          record_date: record.record_date,
          record_type: record.record_type,
          emotional_state: record.emotional_state,
          stress_level: record.stress_level,
          mood_score: record.mood_score,
          sleep_quality: record.sleep_quality,
          energy_level: record.energy_level,
          emotional_notes: record.emotional_notes,
          adherence_score: record.adherence_score,
          meal_following_percentage: record.meal_following_percentage,
          water_intake_liters: record.water_intake_liters,
          behavioral_notes: record.behavioral_notes,
          patterns_identified: record.patterns_identified,
          triggers: record.triggers,
          created_by: userId,
          created_at: `${record.record_date}T16:00:00Z`
        });
    } catch (err) {
      // Ignorar erros de duplicata
    }
  }

  console.log('  ✅ Maria: 4 evoluções físicas + 3 registros emocionais criados');
}

async function completeRobertoData(clientId, userId) {
  console.log('  🫀 Roberto - Hipertensão e colesterol');
  
  // Evolução física focada na hipertensão
  const evolutions = [
    {
      measurement_date: '2024-10-01',
      weight: 85.0,
      height: 175,
      waist_circumference: 102,
      hip_circumference: 98,
      body_fat_percentage: 25.8,
      muscle_mass: 58.0,
      notes: 'Primeira medição. PA: 150/95, Colesterol: 280mg/dl'
    },
    {
      measurement_date: '2024-10-15',
      weight: 83.2,
      height: 175,
      waist_circumference: 99,
      hip_circumference: 96,
      body_fat_percentage: 24.5,
      muscle_mass: 58.5,
      notes: 'Quinze dias: -1.8kg. PA: 140/90. Melhora significativa!'
    },
    {
      measurement_date: '2024-11-01',
      weight: 81.8,
      height: 175,
      waist_circumference: 97,
      hip_circumference: 95,
      body_fat_percentage: 23.2,
      muscle_mass: 59.0,
      notes: 'Um mês: -3.2kg. PA: 135/88. Colesterol: 220mg/dl (-60mg/dl)!'
    }
  ];

  for (const evolution of evolutions) {
    const bmi = evolution.weight / Math.pow(evolution.height / 100, 2);
    
    try {
      await supabaseAdmin
        .from('client_evolution')
        .insert({
          client_id: clientId,
          user_id: userId,
          measurement_date: evolution.measurement_date,
          weight: evolution.weight,
          height: evolution.height,
          waist_circumference: evolution.waist_circumference,
          hip_circumference: evolution.hip_circumference,
          body_fat_percentage: evolution.body_fat_percentage,
          muscle_mass: evolution.muscle_mass,
          bmi: parseFloat(bmi.toFixed(1)),
          notes: evolution.notes,
          created_by: userId,
          created_at: `${evolution.measurement_date}T10:00:00Z`
        });
    } catch (err) {
      // Ignorar erros de duplicata
    }
  }

  console.log('  ✅ Roberto: 3 evoluções físicas criadas');
}

completeClientTabs();
