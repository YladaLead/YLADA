require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Buscar clientes do coach
async function getCoachClients() {
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('email', 'demo.coach@ylada.com')
    .single();

  const { data: clients, error } = await supabase
    .from('clients')
    .select('id, name')
    .eq('user_id', profile.user_id);

  return clients || [];
}

// Função para criar datas aleatórias no passado
function randomPastDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString().split('T')[0]; // Apenas a data
}

async function populateCoachEvolution() {
  try {
    console.log('📈 Populando evolução dos clientes coach...');

    const clients = await getCoachClients();
    
    // Fernanda - Transição de carreira (6 registros)
    const fernanda = clients.find(c => c.name === 'Fernanda Silva');
    if (fernanda) {
      const fernandaEvolution = [
        { measurement_date: randomPastDate(120), weight: 3, height: 7, notes: 'Satisfação profissional: 3/10, Renda mensal: R$ 7.000' },
        { measurement_date: randomPastDate(100), weight: 4, height: 8, notes: 'Satisfação profissional: 4/10, Renda mensal: R$ 8.000' },
        { measurement_date: randomPastDate(80), weight: 6, height: 10, notes: 'Satisfação profissional: 6/10, Renda mensal: R$ 10.000' },
        { measurement_date: randomPastDate(60), weight: 7, height: 12, notes: 'Satisfação profissional: 7/10, Renda mensal: R$ 12.000' },
        { measurement_date: randomPastDate(40), weight: 8, height: 14, notes: 'Satisfação profissional: 8/10, Renda mensal: R$ 14.000' },
        { measurement_date: randomPastDate(20), weight: 9, height: 15, notes: 'Satisfação profissional: 9/10, Renda mensal: R$ 15.000' }
      ];

      for (const evolution of fernandaEvolution) {
        await supabase.from('client_evolution').insert({
          client_id: fernanda.id,
          measurement_date: evolution.measurement_date,
          weight: evolution.weight,
          height: evolution.height,
          notes: evolution.notes
        });
      }
      console.log('✅ Evolução criada para Fernanda (6 registros)');
    }

    // Maria - Superação da ansiedade (4 registros)
    const maria = clients.find(c => c.name === 'Maria Santos');
    if (maria) {
      const mariaEvolution = [
        { measurement_date: randomPastDate(90), weight: 8, height: 4, notes: 'Nível de ansiedade: 8/10, Autoestima: 4/10' },
        { measurement_date: randomPastDate(60), weight: 6, height: 6, notes: 'Nível de ansiedade: 6/10, Autoestima: 6/10' },
        { measurement_date: randomPastDate(30), weight: 4, height: 7, notes: 'Nível de ansiedade: 4/10, Autoestima: 7/10' },
        { measurement_date: randomPastDate(15), weight: 3, height: 8, notes: 'Nível de ansiedade: 3/10, Autoestima: 8/10' }
      ];

      for (const evolution of mariaEvolution) {
        await supabase.from('client_evolution').insert({
          client_id: maria.id,
          measurement_date: evolution.measurement_date,
          weight: evolution.weight,
          height: evolution.height,
          notes: evolution.notes
        });
      }
      console.log('✅ Evolução criada para Maria (4 registros)');
    }

    // Roberto - Liderança e produtividade (4 registros)
    const roberto = clients.find(c => c.name === 'Roberto Mendes');
    if (roberto) {
      const robertoEvolution = [
        { measurement_date: randomPastDate(100), weight: 60, height: 3, notes: 'Horas trabalhadas/semana: 60, Satisfação equipe: 3/10' },
        { measurement_date: randomPastDate(70), weight: 50, height: 5, notes: 'Horas trabalhadas/semana: 50, Satisfação equipe: 5/10' },
        { measurement_date: randomPastDate(40), weight: 45, height: 7, notes: 'Horas trabalhadas/semana: 45, Satisfação equipe: 7/10' },
        { measurement_date: randomPastDate(10), weight: 40, height: 8, notes: 'Horas trabalhadas/semana: 40, Satisfação equipe: 8/10' }
      ];

      for (const evolution of robertoEvolution) {
        await supabase.from('client_evolution').insert({
          client_id: roberto.id,
          measurement_date: evolution.measurement_date,
          weight: evolution.weight,
          height: evolution.height,
          notes: evolution.notes
        });
      }
      console.log('✅ Evolução criada para Roberto (4 registros)');
    }

  } catch (error) {
    console.log('❌ Erro na evolução:', error.message);
  }
}

async function populateCoachAssessments() {
  try {
    console.log('📋 Populando avaliações dos clientes coach...');

    const clients = await getCoachClients();
    
    // Fernanda - Avaliações de carreira
    const fernanda = clients.find(c => c.name === 'Fernanda Silva');
    if (fernanda) {
      const assessments = [
        {
          assessment_type: 'Avaliação Inicial de Carreira',
          data: {
            career_satisfaction: { current: 3, desired: 9, gap_analysis: 'Grande insatisfação com advocacia tradicional' },
            skills_assessment: { legal: 9, digital: 4, entrepreneurship: 3, leadership: 5 },
            values_alignment: { current: 2, desired: 9, key_values: ['autonomia', 'propósito', 'flexibilidade'] },
            financial_goals: { current_income: 7000, desired_income: 15000, timeline: '6 meses' }
          },
          results: {
            readiness_score: 8,
            risk_tolerance: 7,
            success_probability: 85,
            recommended_path: 'Transição gradual com validação de mercado'
          },
          interpretation: 'Fernanda apresenta alto potencial para transição de carreira. Possui sólida base técnica e forte motivação para mudança.',
          recommendations: 'Iniciar com consultoria jurídica online, desenvolver presença digital, construir rede de contatos no mercado digital.',
          status: 'concluida',
          created_at: randomPastDate(120)
        },
        {
          assessment_type: 'Reavaliação - 3 meses',
          data: {
            career_satisfaction: { current: 9, improvement: '+200%', achievements: 'Empresa própria estabelecida' },
            skills_development: { digital: 8, entrepreneurship: 8, leadership: 7, networking: 9 },
            financial_progress: { current_income: 15000, growth: '+114%', stability: 'Excelente' },
            life_balance: { work_hours: 35, stress_level: 3, satisfaction: 9 }
          },
          results: {
            transformation_score: 95,
            goal_achievement: 100,
            sustainability: 90,
            next_phase: 'Escalabilidade e expansão'
          },
          interpretation: 'Transformação excepcional. Fernanda superou todas as expectativas e estabeleceu negócio próspero.',
          recommendations: 'Focar em escalabilidade, automatização de processos, desenvolvimento de equipe.',
          status: 'concluida',
          created_at: randomPastDate(30)
        }
      ];

      for (const assessment of assessments) {
        await supabase.from('assessments').insert({
          client_id: fernanda.id,
          assessment_type: assessment.assessment_type,
          data: assessment.data,
          results: assessment.results,
          interpretation: assessment.interpretation,
          recommendations: assessment.recommendations,
          status: assessment.status,
          created_at: assessment.created_at
        });
      }
      console.log('✅ Avaliações criadas para Fernanda (2 registros)');
    }

    // Maria - Avaliações emocionais
    const maria = clients.find(c => c.name === 'Maria Santos');
    if (maria) {
      const assessments = [
        {
          assessment_type: 'Avaliação Emocional Inicial',
          data: {
            anxiety_levels: { general: 8, social: 9, work: 7, triggers: ['apresentações', 'conflitos', 'mudanças'] },
            self_esteem: { score: 4, areas: { appearance: 3, competence: 5, social: 3, overall: 4 } },
            coping_mechanisms: { current: ['evitação', 'isolamento'], desired: ['mindfulness', 'assertividade'] },
            support_system: { family: 7, friends: 5, professional: 2 }
          },
          results: {
            severity_level: 'Moderado a Alto',
            intervention_priority: 'Alta',
            prognosis: 'Excelente com intervenção adequada',
            timeline: '3-4 meses'
          },
          interpretation: 'Maria apresenta ansiedade generalizada com impacto significativo na qualidade de vida.',
          recommendations: 'Técnicas de mindfulness, reestruturação cognitiva, fortalecimento da autoestima.',
          status: 'concluida',
          created_at: randomPastDate(90)
        },
        {
          assessment_type: 'Reavaliação Final',
          data: {
            anxiety_levels: { general: 3, social: 4, work: 3, improvement: '62% redução' },
            self_esteem: { score: 8, improvement: '+100%', confidence: 'Significativamente melhorada' },
            new_skills: ['meditação diária', 'respiração consciente', 'autocompaixão', 'assertividade'],
            life_quality: { sleep: 8, relationships: 8, work_performance: 9, overall: 8 }
          },
          results: {
            transformation_score: 90,
            anxiety_reduction: 62,
            self_esteem_increase: 100,
            maintenance_plan: 'Práticas diárias estabelecidas'
          },
          interpretation: 'Transformação emocional completa. Maria desenvolveu ferramentas sólidas para gestão emocional.',
          recommendations: 'Manter práticas diárias, sessões de manutenção mensais, continuar desenvolvimento pessoal.',
          status: 'concluida',
          created_at: randomPastDate(15)
        }
      ];

      for (const assessment of assessments) {
        await supabase.from('assessments').insert({
          client_id: maria.id,
          assessment_type: assessment.assessment_type,
          data: assessment.data,
          results: assessment.results,
          interpretation: assessment.interpretation,
          recommendations: assessment.recommendations,
          status: assessment.status,
          created_at: assessment.created_at
        });
      }
      console.log('✅ Avaliações criadas para Maria (2 registros)');
    }

    // Roberto - Avaliação de liderança
    const roberto = clients.find(c => c.name === 'Roberto Mendes');
    if (roberto) {
      const assessment = {
        assessment_type: 'Avaliação de Liderança 360°',
        data: {
          leadership_style: { current: 'Autoritário', desired: 'Transformacional', flexibility: 6 },
          team_feedback: { communication: 5, motivation: 4, delegation: 3, support: 5 },
          productivity_metrics: { team_output: 70, engagement: 45, retention: 60, efficiency: 65 },
          personal_metrics: { work_hours: 60, stress: 8, satisfaction: 5, work_life_balance: 3 }
        },
        results: {
          leadership_score: 55,
          improvement_areas: ['Delegação', 'Comunicação', 'Work-life balance'],
          strengths: ['Conhecimento técnico', 'Dedicação', 'Resultados'],
          potential: 'Alto potencial para transformação'
        },
        interpretation: 'Roberto é um líder dedicado mas sobrecarregado. Precisa desenvolver habilidades de delegação e equilíbrio.',
        recommendations: 'Treinamento em delegação, comunicação assertiva, gestão do tempo, desenvolvimento de equipe.',
        status: 'concluida',
        created_at: randomPastDate(100)
      };

      await supabase.from('assessments').insert({
        client_id: roberto.id,
        assessment_type: assessment.assessment_type,
        data: assessment.data,
        results: assessment.results,
        interpretation: assessment.interpretation,
        recommendations: assessment.recommendations,
        status: assessment.status,
        created_at: assessment.created_at
      });
      console.log('✅ Avaliação criada para Roberto (1 registro)');
    }

  } catch (error) {
    console.log('❌ Erro nas avaliações:', error.message);
  }
}

async function populateCoachEmotional() {
  try {
    console.log('🧠 Populando registros emocionais dos clientes coach...');

    const clients = await getCoachClients();
    
    // Fernanda - Registros emocionais da transição
    const fernanda = clients.find(c => c.name === 'Fernanda Silva');
    if (fernanda) {
      const emotionalRecords = [
        {
          record_type: 'sessao',
          emotional_state: 'ansioso',
          stress_level: 8,
          mood_score: 4,
          sleep_quality: 5,
          energy_level: 4,
          adherence_score: 7,
          notes: 'Fernanda muito ansiosa com a transição de carreira. Medos sobre segurança financeira e julgamento dos outros.',
          patterns_identified: ['perfeccionismo', 'medo do fracasso', 'necessidade de aprovação'],
          triggers: ['incerteza financeira', 'opinião da família', 'comparação com outros'],
          created_at: randomPastDate(110)
        },
        {
          record_type: 'progresso',
          emotional_state: 'esperancoso',
          stress_level: 6,
          mood_score: 6,
          sleep_quality: 6,
          energy_level: 6,
          adherence_score: 8,
          notes: 'Progresso significativo. Fernanda mais confiante após primeiros sucessos no negócio digital.',
          patterns_identified: ['maior autoconfiança', 'foco em soluções', 'resiliência crescente'],
          triggers: ['feedback positivo', 'resultados concretos', 'apoio da rede'],
          created_at: randomPastDate(80)
        },
        {
          record_type: 'conquista',
          emotional_state: 'realizado',
          stress_level: 3,
          mood_score: 9,
          sleep_quality: 8,
          energy_level: 9,
          adherence_score: 9,
          notes: 'Fernanda completamente transformada. Confiante, realizada e inspirando outros profissionais.',
          patterns_identified: ['liderança natural', 'mentalidade de crescimento', 'gratidão'],
          triggers: ['impacto positivo', 'reconhecimento', 'propósito alinhado'],
          created_at: randomPastDate(30)
        }
      ];

      for (const record of emotionalRecords) {
        await supabase.from('emotional_behavioral_history').insert({
          client_id: fernanda.id,
          record_type: record.record_type,
          emotional_state: record.emotional_state,
          stress_level: record.stress_level,
          mood_score: record.mood_score,
          sleep_quality: record.sleep_quality,
          energy_level: record.energy_level,
          adherence_score: record.adherence_score,
          notes: record.notes,
          patterns_identified: record.patterns_identified,
          triggers: record.triggers,
          created_at: record.created_at
        });
      }
      console.log('✅ Registros emocionais criados para Fernanda (3 registros)');
    }

    // Maria - Registros emocionais da superação da ansiedade
    const maria = clients.find(c => c.name === 'Maria Santos');
    if (maria) {
      const emotionalRecords = [
        {
          record_type: 'avaliacao',
          emotional_state: 'ansioso',
          stress_level: 9,
          mood_score: 3,
          sleep_quality: 4,
          energy_level: 3,
          adherence_score: 6,
          notes: 'Maria com crises de ansiedade frequentes. Dificuldade para dormir e baixa autoestima.',
          patterns_identified: ['catastrofização', 'evitação social', 'autocrítica excessiva'],
          triggers: ['situações sociais', 'apresentações', 'conflitos'],
          created_at: randomPastDate(85)
        },
        {
          record_type: 'progresso',
          emotional_state: 'calmo',
          stress_level: 5,
          mood_score: 7,
          sleep_quality: 7,
          energy_level: 7,
          adherence_score: 9,
          notes: 'Excelente progresso com técnicas de mindfulness. Maria praticando meditação diariamente.',
          patterns_identified: ['maior autoconsciência', 'respiração consciente', 'aceitação'],
          triggers: ['práticas de mindfulness', 'autocompaixão', 'apoio terapêutico'],
          created_at: randomPastDate(50)
        },
        {
          record_type: 'transformacao',
          emotional_state: 'confiante',
          stress_level: 3,
          mood_score: 8,
          sleep_quality: 8,
          energy_level: 8,
          adherence_score: 9,
          notes: 'Maria completamente transformada. Confiante, equilibrada e com ferramentas sólidas para gestão emocional.',
          patterns_identified: ['resiliência emocional', 'assertividade', 'equilíbrio'],
          triggers: ['práticas estabelecidas', 'autoconfiança', 'relacionamentos saudáveis'],
          created_at: randomPastDate(15)
        }
      ];

      for (const record of emotionalRecords) {
        await supabase.from('emotional_behavioral_history').insert({
          client_id: maria.id,
          record_type: record.record_type,
          emotional_state: record.emotional_state,
          stress_level: record.stress_level,
          mood_score: record.mood_score,
          sleep_quality: record.sleep_quality,
          energy_level: record.energy_level,
          adherence_score: record.adherence_score,
          notes: record.notes,
          patterns_identified: record.patterns_identified,
          triggers: record.triggers,
          created_at: record.created_at
        });
      }
      console.log('✅ Registros emocionais criados para Maria (3 registros)');
    }

    // Roberto - Registros emocionais do desenvolvimento de liderança
    const roberto = clients.find(c => c.name === 'Roberto Mendes');
    if (roberto) {
      const emotionalRecords = [
        {
          record_type: 'avaliacao',
          emotional_state: 'estressado',
          stress_level: 9,
          mood_score: 4,
          sleep_quality: 4,
          energy_level: 5,
          adherence_score: 7,
          notes: 'Roberto extremamente sobrecarregado. Trabalhando 60h/semana com equipe desmotivada.',
          patterns_identified: ['microgerenciamento', 'dificuldade de delegação', 'perfeccionismo'],
          triggers: ['prazos apertados', 'baixa performance da equipe', 'pressão por resultados'],
          created_at: randomPastDate(95)
        },
        {
          record_type: 'transformacao',
          emotional_state: 'equilibrado',
          stress_level: 4,
          mood_score: 8,
          sleep_quality: 8,
          energy_level: 8,
          adherence_score: 9,
          notes: 'Roberto transformado em líder inspirador. Equipe engajada e produtividade aumentada em 50%.',
          patterns_identified: ['liderança transformacional', 'delegação eficaz', 'comunicação clara'],
          triggers: ['feedback positivo da equipe', 'resultados superiores', 'equilíbrio vida-trabalho'],
          created_at: randomPastDate(20)
        }
      ];

      for (const record of emotionalRecords) {
        await supabase.from('emotional_behavioral_history').insert({
          client_id: roberto.id,
          record_type: record.record_type,
          emotional_state: record.emotional_state,
          stress_level: record.stress_level,
          mood_score: record.mood_score,
          sleep_quality: record.sleep_quality,
          energy_level: record.energy_level,
          adherence_score: record.adherence_score,
          notes: record.notes,
          patterns_identified: record.patterns_identified,
          triggers: record.triggers,
          created_at: record.created_at
        });
      }
      console.log('✅ Registros emocionais criados para Roberto (2 registros)');
    }

  } catch (error) {
    console.log('❌ Erro nos registros emocionais:', error.message);
  }
}

async function completeCoachClientTabs() {
  console.log('🚀 Completando todas as abas dos clientes coach...\n');
  
  await populateCoachEvolution();
  await populateCoachAssessments();
  await populateCoachEmotional();
  
  console.log('\n🎉 TODAS AS ABAS DOS CLIENTES COACH COMPLETADAS!');
  console.log('📊 Dados criados:');
  console.log('   • Fernanda: 6 evoluções + 2 avaliações + 3 registros emocionais');
  console.log('   • Maria: 4 evoluções + 2 avaliações + 3 registros emocionais');
  console.log('   • Roberto: 4 evoluções + 1 avaliação + 2 registros emocionais');
  console.log('\n🎬 PRONTO PARA GRAVAÇÃO DE VÍDEOS!');
}

completeCoachClientTabs();
