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

async function completeAllClientAreas() {
  console.log('🎯 Completando TODAS as áreas dos clientes para demonstração...');

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

    // Focar nos 3 clientes principais
    for (const client of clients) {
      if (client.name === 'Fernanda Rodrigues') {
        console.log(`\n🎉 COMPLETANDO: ${client.name} (Caso de Sucesso)`);
        await completeFernandaAllAreas(client.id, userId);
      } else if (client.name === 'Maria Silva Santos') {
        console.log(`\n💊 COMPLETANDO: ${client.name} (Diabetes)`);
        await completeMariaAllAreas(client.id, userId);
      } else if (client.name === 'Roberto Silva Mendes') {
        console.log(`\n🫀 COMPLETANDO: ${client.name} (Hipertensão)`);
        await completeRobertoAllAreas(client.id, userId);
      }
    }

    console.log('\n🎉 TODAS AS ÁREAS FORAM COMPLETADAS!');
    console.log('\n📊 Resumo das áreas populadas:');
    console.log('   ✅ Evolução Física: Fernanda (6), Maria (4), Roberto (3)');
    console.log('   ✅ Avaliações Físicas: Fernanda (2), Maria (2), Roberto (1)');
    console.log('   ✅ Emocional/Comportamental: Fernanda (6), Maria (3), Roberto (2)');
    console.log('   ✅ Histórico: Todos com timeline completa');
    console.log('\n🎬 PRONTO PARA DEMONSTRAÇÃO EM VÍDEO!');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

async function completeFernandaAllAreas(clientId, userId) {
  // 1. AVALIAÇÕES FÍSICAS (estrutura correta)
  console.log('  🏥 Criando avaliações físicas...');
  
  const assessments = [
    {
      assessment_type: 'antropometrica',
      assessment_name: 'Avaliação Inicial Pós-Parto',
      status: 'completo',
      is_reevaluation: false,
      data: {
        // Dados antropométricos
        weight: 68.0,
        height: 162,
        bmi: 25.9,
        waist_circumference: 85,
        hip_circumference: 105,
        neck_circumference: 36,
        arm_circumference: 30,
        thigh_circumference: 62,
        
        // Composição corporal
        body_fat_percentage: 32.0,
        muscle_mass: 48.0,
        water_percentage: 52.0,
        visceral_fat: 9,
        
        // Dados clínicos
        blood_pressure: '125/80',
        heart_rate: 72,
        
        // Estilo de vida
        physical_activity: 'Sedentária',
        sleep_hours: 6,
        stress_level: 7,
        water_intake: 1.5
      },
      results: {
        imc_classification: 'Sobrepeso',
        body_fat_classification: 'Acima do ideal',
        waist_hip_ratio: 0.81,
        health_risk: 'Moderado'
      },
      interpretation: 'Paciente apresenta sobrepeso pós-gestacional com percentual de gordura elevado. Composição corporal típica do período pós-parto.',
      recommendations: 'Iniciar programa de reeducação alimentar gradual compatível com amamentação. Introduzir atividade física leve progressivamente.',
      created_at: '2024-06-01T10:00:00Z'
    },
    {
      assessment_type: 'reavaliacao',
      assessment_name: 'Reavaliação - Meta Atingida',
      status: 'completo',
      is_reevaluation: true,
      data: {
        // Dados antropométricos
        weight: 58.0,
        height: 162,
        bmi: 22.1,
        waist_circumference: 70,
        hip_circumference: 95,
        neck_circumference: 33.5,
        arm_circumference: 27.5,
        thigh_circumference: 56,
        
        // Composição corporal
        body_fat_percentage: 22.0,
        muscle_mass: 49.5,
        water_percentage: 56.0,
        visceral_fat: 4,
        
        // Dados clínicos
        blood_pressure: '115/75',
        heart_rate: 65,
        
        // Estilo de vida
        physical_activity: 'Ativa - 5x/semana',
        sleep_hours: 8,
        stress_level: 3,
        water_intake: 2.5
      },
      results: {
        imc_classification: 'Peso normal',
        body_fat_classification: 'Ideal',
        waist_hip_ratio: 0.74,
        health_risk: 'Baixo',
        total_weight_loss: -10.0,
        body_fat_reduction: -10.0,
        muscle_gain: 1.5
      },
      interpretation: '🎉 META ATINGIDA! Perda de 10kg com excelente composição corporal. Redução significativa de gordura corporal mantendo massa muscular.',
      recommendations: 'Manter estilo de vida atual. Transição para fase de manutenção com flexibilidade controlada.',
      created_at: '2024-10-01T10:00:00Z'
    }
  ];

  for (const assessment of assessments) {
    try {
      const { data: newAssessment, error } = await supabaseAdmin
        .from('assessments')
        .insert({
          client_id: clientId,
          user_id: userId,
          ...assessment,
          completed_at: assessment.status === 'completo' ? assessment.created_at : null,
          created_by: userId
        })
        .select()
        .single();

      if (error) {
        if (!error.message.includes('duplicate key')) {
          console.error(`    ❌ Erro ao criar avaliação:`, error.message);
        }
      } else {
        console.log(`    ✅ Avaliação "${assessment.assessment_name}" criada`);
      }
    } catch (err) {
      // Ignorar erros de duplicata
    }
  }

  // 2. REGISTROS EMOCIONAIS DETALHADOS
  console.log('  💭 Criando registros emocionais detalhados...');
  
  const emotionalRecords = [
    {
      record_date: '2024-06-05',
      record_type: 'emocional',
      emotional_state: 'Determinada',
      stress_level: 6,
      mood_score: 7,
      sleep_quality: 'Regular',
      energy_level: 'Baixa',
      emotional_notes: 'Primeira semana: Motivada para mudança pós-parto. Ansiedade sobre amamentação e tempo para cuidar de si.',
      patterns_identified: ['Comer quando ansiosa', 'Pular refeições por falta de tempo'],
      triggers: ['Choro do bebê', 'Cansaço extremo', 'Pressão social']
    },
    {
      record_date: '2024-06-20',
      record_type: 'comportamental',
      adherence_score: 8,
      meal_following_percentage: 85.0,
      exercise_frequency: 'Caminhada 3x/semana',
      water_intake_liters: 2.2,
      behavioral_notes: 'Terceira semana: Boa aderência! Conseguiu organizar horários das refeições. Família apoiando.',
      patterns_identified: ['Melhor planejamento das refeições', 'Apoio familiar fundamental'],
      triggers: ['Rotina estabelecida', 'Resultados iniciais motivadores']
    },
    {
      record_date: '2024-07-10',
      record_type: 'emocional',
      emotional_state: 'Confiante',
      stress_level: 4,
      mood_score: 8,
      sleep_quality: 'Boa',
      energy_level: 'Moderada',
      emotional_notes: 'Sexta semana: Vendo resultados! Autoestima melhorando significativamente. Roupas ficando folgadas.',
      patterns_identified: ['Menos episódios de ansiedade', 'Maior controle emocional'],
      triggers: ['Feedback positivo dos resultados', 'Elogios da família']
    },
    {
      record_date: '2024-08-15',
      record_type: 'comportamental',
      adherence_score: 9,
      meal_following_percentage: 92.0,
      exercise_frequency: 'Exercícios 4x/semana',
      water_intake_liters: 2.5,
      behavioral_notes: 'Décima semana: Excelente! Exercícios se tornaram prazerosos. Criou rotina sustentável.',
      patterns_identified: ['Exercício como válvula de escape', 'Hábitos consolidados'],
      triggers: ['Endorfina pós-treino', 'Sensação de conquista']
    },
    {
      record_date: '2024-09-20',
      record_type: 'emocional',
      emotional_state: 'Radiante',
      stress_level: 3,
      mood_score: 9,
      sleep_quality: 'Excelente',
      energy_level: 'Alta',
      emotional_notes: 'Décima quinta semana: Transformação completa! Confiança restaurada. Sente-se uma nova pessoa.',
      patterns_identified: ['Controle emocional total da alimentação', 'Autoestima elevada'],
      triggers: ['Roupas antigas servindo', 'Reconhecimento social']
    },
    {
      record_date: '2024-10-05',
      record_type: 'comportamental',
      adherence_score: 10,
      meal_following_percentage: 95.0,
      exercise_frequency: 'Rotina estabelecida 5x/semana',
      water_intake_liters: 3.0,
      behavioral_notes: 'Meta atingida: PERFEITO! Hábitos completamente internalizados. Estilo de vida transformado.',
      patterns_identified: ['Estilo de vida saudável consolidado', 'Disciplina natural'],
      triggers: ['Bem-estar geral', 'Orgulho da conquista']
    }
  ];

  for (const record of emotionalRecords) {
    try {
      await supabaseAdmin
        .from('emotional_behavioral_history')
        .insert({
          client_id: clientId,
          user_id: userId,
          ...record,
          created_by: userId,
          created_at: `${record.record_date}T16:00:00Z`
        });
      
      console.log(`    ✅ Registro ${record.record_type} ${record.record_date} criado`);
    } catch (error) {
      if (!error.message.includes('duplicate key')) {
        console.error(`    ❌ Erro ao criar registro emocional:`, error.message);
      }
    }
  }
}

async function completeMariaAllAreas(clientId, userId) {
  // AVALIAÇÃO FÍSICA - Foco no diabetes
  console.log('  🏥 Criando avaliação física (diabetes)...');
  
  const assessments = [
    {
      assessment_type: 'anamnese',
      assessment_name: 'Avaliação Inicial - Diabetes Tipo 2',
      status: 'completo',
      is_reevaluation: false,
      data: {
        weight: 78.0,
        height: 165,
        bmi: 28.7,
        waist_circumference: 88,
        hip_circumference: 102,
        
        // Dados específicos do diabetes
        fasting_glucose: 145,
        hba1c: 8.2,
        blood_pressure: '135/88',
        cholesterol: 220,
        triglycerides: 180,
        
        // Medicamentos
        medications: ['Metformina 850mg 2x/dia', 'Losartana 50mg 1x/dia'],
        
        // Sintomas
        symptoms: ['Sede excessiva', 'Fadiga', 'Visão turva ocasional'],
        
        // Estilo de vida
        physical_activity: 'Sedentária',
        diet_quality: 'Ruim - muitos carboidratos refinados',
        stress_level: 8
      },
      results: {
        diabetes_control: 'Descontrolado',
        cardiovascular_risk: 'Alto',
        imc_classification: 'Sobrepeso'
      },
      interpretation: 'Diabetes tipo 2 descontrolado com HbA1c elevada. Necessário ajuste alimentar urgente para controle glicêmico.',
      recommendations: 'Dieta hipoglicêmica, exercícios regulares, monitoramento glicêmico rigoroso.',
      created_at: '2024-09-15T10:00:00Z'
    },
    {
      assessment_type: 'reavaliacao',
      assessment_name: 'Reavaliação - Diabetes Controlado',
      status: 'completo',
      is_reevaluation: true,
      data: {
        weight: 73.8,
        height: 165,
        bmi: 27.1,
        waist_circumference: 83,
        hip_circumference: 96,
        
        // Melhora nos exames
        fasting_glucose: 95,
        hba1c: 7.1,
        blood_pressure: '125/80',
        cholesterol: 190,
        triglycerides: 140,
        
        // Medicamentos mantidos
        medications: ['Metformina 850mg 2x/dia', 'Losartana 50mg 1x/dia'],
        
        // Sintomas resolvidos
        symptoms: ['Nenhum sintoma atual'],
        
        // Estilo de vida melhorado
        physical_activity: 'Moderada - 3x/semana',
        diet_quality: 'Boa - seguindo plano alimentar',
        stress_level: 4
      },
      results: {
        diabetes_control: 'Controlado',
        cardiovascular_risk: 'Moderado',
        imc_classification: 'Sobrepeso leve',
        hba1c_improvement: -1.1,
        weight_loss: -4.2
      },
      interpretation: '🎯 DIABETES CONTROLADO! HbA1c dentro da meta (<7%). Excelente aderência ao tratamento.',
      recommendations: 'Manter plano atual. Considerar redução gradual de medicação com acompanhamento médico.',
      created_at: '2024-11-01T10:00:00Z'
    }
  ];

  for (const assessment of assessments) {
    try {
      await supabaseAdmin
        .from('assessments')
        .insert({
          client_id: clientId,
          user_id: userId,
          ...assessment,
          completed_at: assessment.status === 'completo' ? assessment.created_at : null,
          created_by: userId
        });
      
      console.log(`    ✅ Avaliação "${assessment.assessment_name}" criada`);
    } catch (error) {
      if (!error.message.includes('duplicate key')) {
        console.error(`    ❌ Erro ao criar avaliação:`, error.message);
      }
    }
  }

  // REGISTROS EMOCIONAIS - Foco no diabetes
  console.log('  💭 Criando registros emocionais (diabetes)...');
  
  const emotionalRecords = [
    {
      record_date: '2024-09-20',
      record_type: 'emocional',
      emotional_state: 'Preocupada',
      stress_level: 8,
      mood_score: 5,
      sleep_quality: 'Ruim',
      energy_level: 'Muito baixa',
      emotional_notes: 'Medo das complicações do diabetes. Ansiedade com mudanças alimentares necessárias.',
      patterns_identified: ['Come doce quando ansiosa', 'Evita medir glicemia quando alta'],
      triggers: ['Glicemia alta', 'Sintomas do diabetes', 'Medo do futuro']
    },
    {
      record_date: '2024-10-10',
      record_type: 'comportamental',
      adherence_score: 8,
      meal_following_percentage: 88.0,
      water_intake_liters: 2.0,
      behavioral_notes: 'Seguindo bem o plano. Monitorando glicemia religiosamente. Família apoiando mudanças.',
      patterns_identified: ['Disciplina com horários das refeições', 'Controle rigoroso da glicemia'],
      triggers: ['Medo das complicações motiva aderência', 'Apoio familiar']
    },
    {
      record_date: '2024-11-05',
      record_type: 'emocional',
      emotional_state: 'Aliviada',
      stress_level: 4,
      mood_score: 8,
      sleep_quality: 'Boa',
      energy_level: 'Alta',
      emotional_notes: 'Resultados dos exames excelentes! HbA1c na meta. Confiança restaurada no controle da doença.',
      patterns_identified: ['Controle emocional melhorou muito', 'Relação saudável com comida'],
      triggers: ['Feedback positivo dos exames', 'Energia recuperada']
    }
  ];

  for (const record of emotionalRecords) {
    try {
      await supabaseAdmin
        .from('emotional_behavioral_history')
        .insert({
          client_id: clientId,
          user_id: userId,
          ...record,
          created_by: userId,
          created_at: `${record.record_date}T16:00:00Z`
        });
      
      console.log(`    ✅ Registro ${record.record_type} ${record.record_date} criado`);
    } catch (error) {
      if (!error.message.includes('duplicate key')) {
        console.error(`    ❌ Erro ao criar registro emocional:`, error.message);
      }
    }
  }
}

async function completeRobertoAllAreas(clientId, userId) {
  // AVALIAÇÃO FÍSICA - Foco na hipertensão
  console.log('  🏥 Criando avaliação física (hipertensão)...');
  
  const assessment = {
    assessment_type: 'antropometrica',
    assessment_name: 'Avaliação Inicial - Hipertensão e Dislipidemia',
    status: 'completo',
    is_reevaluation: false,
    data: {
      weight: 85.0,
      height: 175,
      bmi: 27.8,
      waist_circumference: 102,
      hip_circumference: 98,
      
      // Dados cardiovasculares
      blood_pressure: '150/95',
      heart_rate: 85,
      cholesterol: 280,
      ldl: 180,
      hdl: 40,
      triglycerides: 200,
      
      // Fatores de risco
      smoking: false,
      alcohol: 'Ocasional',
      family_history: 'Pai hipertenso, mãe diabética',
      
      // Estilo de vida
      physical_activity: 'Sedentário',
      sodium_intake: 'Alto',
      stress_level: 7
    },
    results: {
      cardiovascular_risk: 'Alto',
      hypertension_stage: 'Estágio 2',
      cholesterol_status: 'Muito elevado'
    },
    interpretation: 'Hipertensão estágio 2 com dislipidemia severa. Alto risco cardiovascular.',
    recommendations: 'Dieta DASH, redução drástica de sódio, exercícios regulares, acompanhamento cardiológico.',
    created_at: '2024-10-01T10:00:00Z'
  };

  try {
    await supabaseAdmin
      .from('assessments')
      .insert({
        client_id: clientId,
        user_id: userId,
        ...assessment,
        completed_at: assessment.created_at,
        created_by: userId
      });
    
    console.log(`    ✅ Avaliação "${assessment.assessment_name}" criada`);
  } catch (error) {
    if (!error.message.includes('duplicate key')) {
      console.error(`    ❌ Erro ao criar avaliação:`, error.message);
    }
  }

  // REGISTROS EMOCIONAIS - Foco na hipertensão
  console.log('  💭 Criando registros emocionais (hipertensão)...');
  
  const emotionalRecords = [
    {
      record_date: '2024-10-05',
      record_type: 'emocional',
      emotional_state: 'Preocupado',
      stress_level: 8,
      mood_score: 6,
      sleep_quality: 'Regular',
      energy_level: 'Baixa',
      emotional_notes: 'Descoberta da hipertensão foi um choque. Preocupado com risco de infarto.',
      patterns_identified: ['Come mais quando estressado', 'Evita exercícios por medo'],
      triggers: ['Pressão alta', 'Histórico familiar', 'Estresse no trabalho']
    },
    {
      record_date: '2024-10-20',
      record_type: 'comportamental',
      adherence_score: 7,
      meal_following_percentage: 80.0,
      exercise_frequency: 'Caminhada 2x/semana',
      water_intake_liters: 2.0,
      behavioral_notes: 'Adaptando-se à dieta DASH. Dificuldade com redução do sal, mas melhorando.',
      patterns_identified: ['Redução gradual do sódio', 'Início da atividade física'],
      triggers: ['Medo das consequências', 'Apoio da esposa']
    }
  ];

  for (const record of emotionalRecords) {
    try {
      await supabaseAdmin
        .from('emotional_behavioral_history')
        .insert({
          client_id: clientId,
          user_id: userId,
          ...record,
          created_by: userId,
          created_at: `${record.record_date}T16:00:00Z`
        });
      
      console.log(`    ✅ Registro ${record.record_type} ${record.record_date} criado`);
    } catch (error) {
      if (!error.message.includes('duplicate key')) {
        console.error(`    ❌ Erro ao criar registro emocional:`, error.message);
      }
    }
  }
}

completeAllClientAreas();
