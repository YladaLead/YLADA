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

async function fixCoachClientsStatus() {
  try {
    console.log('🔧 Corrigindo status dos clientes coach...');

    const userId = await getCoachUserId();
    if (!userId) {
      console.log('❌ Usuário coach não encontrado');
      return;
    }

    console.log('✅ Usuário coach encontrado:', userId);

    // Mapeamento de status antigos para novos
    const statusMapping = {
      'ativo': 'ativa',
      'pausado': 'pausa',
      'agendado': 'pre_consulta',
      'lead': 'lead' // já está correto
    };

    // Buscar todos os clientes do coach
    const { data: clients, error: fetchError } = await supabase
      .from('clients')
      .select('id, name, status')
      .eq('user_id', userId);

    if (fetchError) {
      console.log('❌ Erro ao buscar clientes:', fetchError.message);
      return;
    }

    console.log(`✅ Encontrados ${clients.length} clientes`);

    // Atualizar status de cada cliente
    for (const client of clients) {
      const newStatus = statusMapping[client.status] || client.status;
      
      if (newStatus !== client.status) {
        const { error: updateError } = await supabase
          .from('clients')
          .update({ status: newStatus })
          .eq('id', client.id);

        if (updateError) {
          console.log(`❌ Erro ao atualizar ${client.name}:`, updateError.message);
        } else {
          console.log(`✅ ${client.name}: ${client.status} → ${newStatus}`);
        }
      } else {
        console.log(`✓ ${client.name}: status já correto (${client.status})`);
      }
    }

    console.log('\n🎉 STATUS DOS CLIENTES CORRIGIDOS!');
    console.log('📊 Status atualizados para corresponder ao Kanban:');
    console.log('   • ativo → ativa');
    console.log('   • pausado → pausa');
    console.log('   • agendado → pre_consulta');
    console.log('   • lead → lead (já estava correto)');

  } catch (error) {
    console.log('❌ Erro geral:', error.message);
  }
}

fixCoachClientsStatus();
