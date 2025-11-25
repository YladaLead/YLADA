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
  return date.toISOString();
}

async function populateCoachHistory() {
  try {
    console.log('🚀 Populando histórico dos clientes coach...');

    const clients = await getCoachClients();
    console.log(`✅ Encontrados ${clients.length} clientes`);

    for (const client of clients) {
      console.log(`📝 Populando histórico para ${client.name}...`);

      let activities = [];

      // Atividades específicas por cliente
      if (client.name === 'Fernanda Silva') {
        activities = [
          {
            activity_type: 'sessao',
            title: 'Sessão Inicial - Avaliação de Carreira',
            description: 'Primeira sessão para entender objetivos de transição de carreira. Fernanda demonstrou forte desejo de sair da advocacia e empreender no digital.',
            date: randomPastDate(120)
          },
          {
            activity_type: 'plano',
            title: 'Plano de Transição de Carreira',
            description: 'Elaborado plano estruturado: 1) Autoconhecimento profissional, 2) Desenvolvimento de habilidades digitais, 3) Networking estratégico, 4) Validação de ideia de negócio.',
            date: randomPastDate(110)
          },
          {
            activity_type: 'sessao',
            title: 'Sessão de Autoconhecimento',
            description: 'Trabalho profundo de identificação de valores, propósito e paixões. Fernanda descobriu forte conexão com educação online e marketing digital.',
            date: randomPastDate(100)
          },
          {
            activity_type: 'orientacao',
            title: 'Orientações para Networking',
            description: 'Estratégias para construir rede de contatos no mercado digital. Indicação de eventos, grupos e mentorias específicas.',
            date: randomPastDate(90)
          },
          {
            activity_type: 'sessao',
            title: 'Validação da Ideia de Negócio',
            description: 'Sessão focada em validar a ideia de consultoria jurídica online. Definição de nicho e proposta de valor única.',
            date: randomPastDate(80)
          },
          {
            activity_type: 'acompanhamento',
            title: 'Acompanhamento - Primeiros Clientes',
            description: 'Fernanda conseguiu seus primeiros 3 clientes! Trabalhamos estratégias de precificação e entrega de valor.',
            date: randomPastDate(60)
          },
          {
            activity_type: 'sessao',
            title: 'Gestão de Tempo e Produtividade',
            description: 'Com o negócio crescendo, trabalhamos organização pessoal e profissional. Implementação de metodologias ágeis.',
            date: randomPastDate(40)
          },
          {
            activity_type: 'avaliacao',
            title: 'Avaliação de Progresso - 3 meses',
            description: 'Resultados excepcionais: Renda aumentou 200%, satisfação profissional de 3/10 para 9/10. Cliente extremamente realizada.',
            date: randomPastDate(20)
          }
        ];
      } else if (client.name === 'Maria Santos') {
        activities = [
          {
            activity_type: 'sessao',
            title: 'Sessão Inicial - Avaliação Emocional',
            description: 'Primeira sessão focada em entender os gatilhos da ansiedade. Maria relatou crises frequentes e baixa autoestima.',
            date: randomPastDate(90)
          },
          {
            activity_type: 'plano',
            title: 'Plano de Desenvolvimento Emocional',
            description: 'Estruturado programa: 1) Técnicas de respiração e mindfulness, 2) Reestruturação cognitiva, 3) Fortalecimento da autoestima, 4) Gestão do estresse.',
            date: randomPastDate(85)
          },
          {
            activity_type: 'orientacao',
            title: 'Técnicas de Mindfulness',
            description: 'Ensino de práticas de meditação e atenção plena. Maria iniciou rotina diária de 10 minutos de meditação.',
            date: randomPastDate(75)
          },
          {
            activity_type: 'sessao',
            title: 'Trabalhando Crenças Limitantes',
            description: 'Identificação e reestruturação de pensamentos negativos automáticos. Desenvolvimento de diálogo interno mais compassivo.',
            date: randomPastDate(60)
          },
          {
            activity_type: 'acompanhamento',
            title: 'Progresso nas Práticas',
            description: 'Maria relatou redução significativa nas crises de ansiedade. Implementação bem-sucedida das técnicas aprendidas.',
            date: randomPastDate(45)
          },
          {
            activity_type: 'avaliacao',
            title: 'Avaliação Final - Transformação Completa',
            description: 'Resultados impressionantes: Ansiedade de 8/10 para 3/10, autoestima de 4/10 para 8/10. Maria está confiante e equilibrada.',
            date: randomPastDate(15)
          }
        ];
      } else if (client.name === 'Roberto Mendes') {
        activities = [
          {
            activity_type: 'sessao',
            title: 'Sessão Inicial - Avaliação de Liderança',
            description: 'Avaliação do estilo de liderança atual. Roberto trabalhava 60h/semana com equipe desmotivada e alta rotatividade.',
            date: randomPastDate(100)
          },
          {
            activity_type: 'plano',
            title: 'Plano de Desenvolvimento de Liderança',
            description: 'Programa estruturado: 1) Autoconhecimento como líder, 2) Comunicação eficaz, 3) Delegação estratégica, 4) Motivação de equipes.',
            date: randomPastDate(95)
          },
          {
            activity_type: 'orientacao',
            title: 'Técnicas de Delegação',
            description: 'Ensino de metodologias para delegar com eficiência. Roberto aprendeu a confiar mais na equipe e focar no estratégico.',
            date: randomPastDate(80)
          },
          {
            activity_type: 'sessao',
            title: 'Comunicação e Feedback',
            description: 'Desenvolvimento de habilidades de comunicação assertiva e feedback construtivo. Melhoria significativa no relacionamento com a equipe.',
            date: randomPastDate(65)
          },
          {
            activity_type: 'acompanhamento',
            title: 'Implementação das Mudanças',
            description: 'Roberto reduziu carga horária para 45h/semana. Equipe mais engajada e produtiva. Resultados já visíveis.',
            date: randomPastDate(40)
          },
          {
            activity_type: 'avaliacao',
            title: 'Avaliação de Resultados',
            description: 'Transformação completa: 40h/semana, produtividade +50%, satisfação da equipe +80%. Roberto se tornou um líder inspirador.',
            date: randomPastDate(10)
          }
        ];
      } else {
        // Atividades genéricas para outros clientes
        activities = [
          {
            activity_type: 'sessao',
            title: 'Sessão Inicial',
            description: 'Primeira sessão de coaching. Definição de objetivos e expectativas.',
            date: randomPastDate(30)
          },
          {
            activity_type: 'plano',
            title: 'Plano de Desenvolvimento',
            description: 'Elaboração de plano personalizado de desenvolvimento pessoal.',
            date: randomPastDate(25)
          },
          {
            activity_type: 'acompanhamento',
            title: 'Acompanhamento de Progresso',
            description: 'Revisão do progresso e ajustes no plano de ação.',
            date: randomPastDate(15)
          }
        ];
      }

      // Inserir atividades no banco
      for (const activity of activities) {
        const { error } = await supabase
          .from('client_history')
          .insert({
            client_id: client.id,
            activity_type: activity.activity_type,
            title: activity.title,
            description: activity.description,
            created_at: activity.date
          });

        if (error) {
          console.log(`❌ Erro ao criar atividade para ${client.name}:`, error.message);
        }
      }

      console.log(`✅ ${activities.length} atividades criadas para ${client.name}`);
    }

    console.log('\n🎉 HISTÓRICO COACH POPULADO COM SUCESSO!');

  } catch (error) {
    console.log('❌ Erro geral:', error.message);
  }
}

populateCoachHistory();
