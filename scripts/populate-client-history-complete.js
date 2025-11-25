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

async function populateCompleteHistory() {
  console.log('🔄 Populando histórico completo dos clientes...');

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

    // Dados específicos para cada cliente
    const clientsData = {
      'Maria Silva Santos': {
        status: 'ativa',
        goal: 'Perda de peso e controle do diabetes',
        activities: [
          { type: 'consulta', title: 'Consulta Inicial', desc: 'Anamnese completa, definição de metas', date: '2024-09-15T09:00:00Z' },
          { type: 'avaliacao', title: 'Avaliação Física Inicial', desc: 'Bioimpedância, medidas antropométricas', date: '2024-09-15T10:30:00Z' },
          { type: 'programa_criado', title: 'Plano Alimentar Criado', desc: 'Dieta hipocalórica para diabéticos', date: '2024-09-15T14:00:00Z' },
          { type: 'evolucao_registrada', title: 'Primeira Pesagem', desc: 'Peso inicial: 78kg, IMC: 28.5', date: '2024-09-15T15:00:00Z' },
          { type: 'nota_adicionada', title: 'Orientações Enviadas', desc: 'Lista de compras e receitas adaptadas', date: '2024-09-18T16:00:00Z' },
          { type: 'consulta', title: 'Retorno Semanal', desc: 'Ajustes na dieta, dúvidas esclarecidas', date: '2024-09-22T14:00:00Z' },
          { type: 'evolucao_registrada', title: 'Pesagem Semanal', desc: 'Peso: 76.8kg (-1.2kg), ótima evolução!', date: '2024-09-22T14:30:00Z' },
          { type: 'registro_emocional', title: 'Registro Emocional', desc: 'Paciente motivada, sem episódios de compulsão', date: '2024-09-25T10:00:00Z' },
          { type: 'consulta', title: 'Consulta Mensal', desc: 'Reavaliação completa, novos objetivos', date: '2024-10-15T09:00:00Z' },
          { type: 'evolucao_registrada', title: 'Pesagem Mensal', desc: 'Peso: 75.2kg (-2.8kg total), excelente!', date: '2024-10-15T09:30:00Z' },
          { type: 'programa_atualizado', title: 'Plano Atualizado', desc: 'Aumentada variedade, incluídos exercícios', date: '2024-10-15T15:00:00Z' },
          { type: 'reavaliacao', title: 'Reavaliação Completa', desc: 'Bioimpedância: redução de 3% gordura corporal', date: '2024-11-15T10:00:00Z' }
        ]
      },
      'João Pedro Oliveira': {
        status: 'lead',
        goal: 'Interessado em consultoria nutricional',
        activities: [
          { type: 'cliente_criado', title: 'Lead Capturado', desc: 'Interesse via formulário do site', date: '2024-11-20T14:30:00Z' },
          { type: 'nota_adicionada', title: 'Primeiro Contato', desc: 'WhatsApp enviado, aguardando resposta', date: '2024-11-20T15:00:00Z' },
          { type: 'nota_adicionada', title: 'Follow-up', desc: 'Segunda tentativa de contato por email', date: '2024-11-22T10:00:00Z' }
        ]
      },
      'Carlos Eduardo Costa': {
        status: 'pausa',
        goal: 'Ganho de massa muscular',
        activities: [
          { type: 'consulta', title: 'Consulta Inicial', desc: 'Objetivo: hipertrofia muscular', date: '2024-08-10T16:00:00Z' },
          { type: 'programa_criado', title: 'Plano Hipercalórico', desc: 'Dieta para ganho de massa magra', date: '2024-08-10T17:00:00Z' },
          { type: 'evolucao_registrada', title: 'Peso Inicial', desc: 'Peso: 70kg, BF: 12%', date: '2024-08-10T17:30:00Z' },
          { type: 'consulta', title: 'Retorno 15 dias', desc: 'Boa aderência, peso estável', date: '2024-08-25T16:00:00Z' },
          { type: 'evolucao_registrada', title: 'Evolução 15 dias', desc: 'Peso: 71.2kg (+1.2kg)', date: '2024-08-25T16:30:00Z' },
          { type: 'consulta', title: 'Consulta Mensal', desc: 'Excelente progresso, ajustes no treino', date: '2024-09-10T16:00:00Z' },
          { type: 'status_alterado', title: 'Pausa no Acompanhamento', desc: 'Viagem de trabalho por 2 meses', date: '2024-10-01T10:00:00Z' },
          { type: 'nota_adicionada', title: 'Orientações para Viagem', desc: 'Dicas para manter dieta durante viagem', date: '2024-10-01T11:00:00Z' }
        ]
      },
      'Fernanda Rodrigues': {
        status: 'finalizada',
        goal: 'Reeducação alimentar pós-gestação',
        activities: [
          { type: 'consulta', title: 'Consulta Inicial', desc: 'Pós-parto, amamentação, perda de peso', date: '2024-06-01T10:00:00Z' },
          { type: 'programa_criado', title: 'Plano para Lactantes', desc: 'Dieta balanceada para amamentação', date: '2024-06-01T11:00:00Z' },
          { type: 'evolucao_registrada', title: 'Peso Pós-Parto', desc: 'Peso: 68kg (meta: 58kg)', date: '2024-06-01T11:30:00Z' },
          { type: 'consulta', title: 'Retorno Quinzenal', desc: 'Adaptação boa, energia melhorou', date: '2024-06-15T10:00:00Z' },
          { type: 'evolucao_registrada', title: 'Primeira Perda', desc: 'Peso: 66.5kg (-1.5kg)', date: '2024-06-15T10:30:00Z' },
          { type: 'consulta', title: 'Consulta Mensal', desc: 'Introdução de exercícios leves', date: '2024-07-01T10:00:00Z' },
          { type: 'programa_atualizado', title: 'Plano Atualizado', desc: 'Redução calórica gradual', date: '2024-07-01T11:00:00Z' },
          { type: 'evolucao_registrada', title: 'Meio do Processo', desc: 'Peso: 63kg (-5kg total)', date: '2024-08-01T10:00:00Z' },
          { type: 'reavaliacao', title: 'Reavaliação Completa', desc: 'Excelente composição corporal', date: '2024-09-01T10:00:00Z' },
          { type: 'evolucao_registrada', title: 'Meta Atingida', desc: 'Peso: 58kg (-10kg total) 🎉', date: '2024-10-01T10:00:00Z' },
          { type: 'programa_concluido', title: 'Acompanhamento Finalizado', desc: 'Objetivos alcançados com sucesso!', date: '2024-10-15T10:00:00Z' }
        ]
      },
      'Roberto Silva Mendes': {
        status: 'ativa',
        goal: 'Controle do colesterol e pressão arterial',
        activities: [
          { type: 'consulta', title: 'Consulta Inicial', desc: 'Hipertensão e colesterol alto', date: '2024-10-01T14:00:00Z' },
          { type: 'avaliacao', title: 'Avaliação Clínica', desc: 'PA: 150/95, Colesterol: 280mg/dl', date: '2024-10-01T14:30:00Z' },
          { type: 'programa_criado', title: 'Dieta DASH', desc: 'Plano para hipertensão e dislipidemia', date: '2024-10-01T16:00:00Z' },
          { type: 'evolucao_registrada', title: 'Medidas Iniciais', desc: 'Peso: 85kg, Cintura: 102cm', date: '2024-10-01T16:30:00Z' },
          { type: 'consulta', title: 'Retorno Semanal', desc: 'Boa aderência, PA melhorando', date: '2024-10-08T14:00:00Z' },
          { type: 'registro_comportamental', title: 'Mudança de Hábitos', desc: 'Reduziu sal, aumentou vegetais', date: '2024-10-10T09:00:00Z' },
          { type: 'consulta', title: 'Consulta Quinzenal', desc: 'PA: 140/90, melhora significativa', date: '2024-10-15T14:00:00Z' },
          { type: 'evolucao_registrada', title: 'Primeira Pesagem', desc: 'Peso: 83.2kg (-1.8kg)', date: '2024-10-15T14:30:00Z' },
          { type: 'consulta', title: 'Consulta Mensal', desc: 'Exames de controle solicitados', date: '2024-11-01T14:00:00Z' },
          { type: 'nota_adicionada', title: 'Resultados dos Exames', desc: 'Colesterol: 220mg/dl (-60mg/dl) 📈', date: '2024-11-10T10:00:00Z' }
        ]
      },
      'Ana Carolina Lima': {
        status: 'pre_consulta',
        goal: 'Controlar diabetes e melhorar qualidade de vida',
        activities: [
          { type: 'cliente_criado', title: 'Cadastro Realizado', desc: 'Agendamento da primeira consulta', date: '2024-11-18T16:00:00Z' },
          { type: 'nota_adicionada', title: 'Anamnese Prévia', desc: 'Formulário preenchido: diabetes tipo 2', date: '2024-11-19T09:00:00Z' },
          { type: 'nota_adicionada', title: 'Orientações Iniciais', desc: 'Material educativo sobre diabetes enviado', date: '2024-11-19T10:00:00Z' },
          { type: 'nota_adicionada', title: 'Confirmação da Consulta', desc: 'Primeira consulta agendada para 25/11', date: '2024-11-20T14:00:00Z' }
        ]
      }
    };

    // Popular dados para cada cliente
    for (const client of clients) {
      const clientData = clientsData[client.name];
      if (!clientData) continue;

      console.log(`\n👤 Populando histórico para: ${client.name} (${clientData.status})`);
      
      // Atualizar status e objetivo do cliente se necessário
      if (client.status !== clientData.status || client.goal !== clientData.goal) {
        await supabaseAdmin
          .from('clients')
          .update({ 
            status: clientData.status,
            goal: clientData.goal 
          })
          .eq('id', client.id);
        console.log(`  ✅ Status atualizado para: ${clientData.status}`);
      }

      // Adicionar atividades do histórico
      for (const activity of clientData.activities) {
        try {
          const { error } = await supabaseAdmin
            .from('client_history')
            .insert({
              client_id: client.id,
              user_id: userId,
              activity_type: activity.type,
              title: activity.title,
              description: activity.desc,
              created_by: userId,
              created_at: activity.date
            });

          if (error && !error.message.includes('duplicate key')) {
            console.error(`    ❌ Erro ao criar atividade "${activity.title}":`, error.message);
          }
        } catch (err) {
          // Ignorar erros de duplicata
        }
      }
      
      console.log(`  📋 ${clientData.activities.length} atividades adicionadas`);
    }

    console.log('\n✅ Histórico completo populado com sucesso!');
    console.log('\n📊 Resumo dos clientes:');
    console.log('   • Maria Silva Santos: Ativa - Diabetes controlado, -2.8kg');
    console.log('   • João Pedro Oliveira: Lead - Aguardando primeiro contato');
    console.log('   • Carlos Eduardo Costa: Pausa - Viagem de trabalho');
    console.log('   • Fernanda Rodrigues: Finalizada - Meta atingida (-10kg)');
    console.log('   • Roberto Silva Mendes: Ativo - Colesterol melhorando');
    console.log('   • Ana Carolina Lima: Pré-consulta - Primeira consulta agendada');

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

populateCompleteHistory();
