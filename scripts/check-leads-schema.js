require('dotenv').config({ path: '../.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkLeadsSchema() {
  try {
    console.log('🔍 Verificando schema da tabela leads...');

    // Tentar inserir um registro simples para ver quais campos existem
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .limit(1);

    if (error) {
      console.log('❌ Erro ao consultar leads:', error.message);
      
      // Tentar outras tabelas relacionadas
      const { data: forms, error: formsError } = await supabase
        .from('custom_forms')
        .select('*')
        .limit(1);
        
      console.log('📋 Tabela custom_forms:', formsError ? 'ERRO: ' + formsError.message : 'OK');
      
      const { data: responses, error: responsesError } = await supabase
        .from('form_responses')
        .select('*')
        .limit(1);
        
      console.log('📝 Tabela form_responses:', responsesError ? 'ERRO: ' + responsesError.message : 'OK');
      
    } else {
      console.log('✅ Tabela leads existe');
      console.log('📊 Exemplo de registro:', data[0] || 'Nenhum registro encontrado');
    }

  } catch (error) {
    console.log('❌ Erro geral:', error.message);
  }
}

checkLeadsSchema();
