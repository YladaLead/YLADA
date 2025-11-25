require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Buscar ID do usuário coach demo
async function getCoachUserId() {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('user_id')
    .eq('email', 'demo.coach@ylada.com')
    .single();
  
  if (error) {
    console.log('❌ Erro ao buscar usuário coach:', error.message);
    return null;
  }
  
  return data.user_id;
}

const coachClients = [
  {
    name: 'Fernanda Silva',
    email: 'fernanda.silva@email.com',
    phone: '(11) 98765-4321',
    status: 'ativa',
    goal: 'Transição de carreira - de advogada para empreendedora digital',
    converted_from_lead: true,
    lead_source: 'Quiz: Descubra seu Perfil de Liderança',
    tags: ['transição-carreira', 'empreendedorismo', 'sucesso', 'transformação']
  },
  {
    name: 'Maria Santos',
    email: 'maria.santos@email.com', 
    phone: '(11) 97654-3210',
    status: 'ativa',
    goal: 'Superação da ansiedade e desenvolvimento da autoestima',
    converted_from_lead: true,
    lead_source: 'Roda da Vida Personalizada',
    tags: ['ansiedade', 'autoestima', 'equilíbrio', 'mindfulness']
  },
  {
    name: 'Roberto Mendes',
    email: 'roberto.mendes@email.com',
    phone: '(11) 96543-2109', 
    status: 'ativa',
    goal: 'Desenvolvimento de liderança e aumento de produtividade',
    converted_from_lead: true,
    lead_source: 'Teste de Satisfação Profissional',
    tags: ['liderança', 'produtividade', 'gestão', 'eficiência']
  },
  {
    name: 'João Carlos',
    email: 'joao.carlos@email.com',
    phone: '(11) 95432-1098',
    status: 'lead',
    goal: 'Interessado em coaching para mudança de vida',
    converted_from_lead: false,
    lead_source: 'Você está pronto para mudar de vida?',
    tags: ['lead-quente', 'mudança', 'potencial-alto']
  },
  {
    name: 'Carlos Eduardo',
    email: 'carlos.eduardo@email.com',
    phone: '(11) 94321-0987',
    status: 'pausa',
    goal: 'Pausa temporária - retomará em janeiro',
    converted_from_lead: true,
    lead_source: 'Indicação',
    tags: ['pausado', 'retorno-programado', 'satisfeito']
  },
  {
    name: 'Ana Carolina',
    email: 'ana.carolina@email.com',
    phone: '(11) 93210-9876',
    status: 'pre_consulta',
    goal: 'Primeira sessão agendada - desenvolvimento pessoal',
    converted_from_lead: true,
    lead_source: 'Calculadora de Produtividade',
    tags: ['novo-cliente', 'primeira-sessão', 'desenvolvimento']
  }
];

async function createDemoCoachClient(clientData, userId) {
  try {
    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        user_id: userId,
        name: clientData.name,
        email: clientData.email,
        phone: clientData.phone,
        status: clientData.status,
        goal: clientData.goal,
        converted_from_lead: clientData.converted_from_lead,
        lead_source: clientData.lead_source,
        tags: clientData.tags,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.log(`❌ Erro ao criar cliente ${clientData.name}:`, error.message);
      return null;
    }

    console.log(`✅ Cliente criado: ${clientData.name}`);
    return client;

  } catch (error) {
    console.log(`❌ Erro geral ao criar ${clientData.name}:`, error.message);
    return null;
  }
}

async function populateCoachClients() {
  try {
    console.log('🚀 Populando clientes para Coach demo...');

    const userId = await getCoachUserId();
    if (!userId) {
      console.log('❌ Usuário coach não encontrado');
      return;
    }

    console.log('✅ Usuário coach encontrado:', userId);

    // Criar todos os clientes
    for (const clientData of coachClients) {
      await createDemoCoachClient(clientData, userId);
      // Pequena pausa entre criações
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n🎉 CLIENTES COACH CRIADOS COM SUCESSO!');
    console.log(`📊 Total: ${coachClients.length} clientes`);
    console.log('🎯 Status: 3 ativos, 1 lead, 1 pausado, 1 agendado');

  } catch (error) {
    console.log('❌ Erro geral:', error.message);
  }
}

populateCoachClients();
