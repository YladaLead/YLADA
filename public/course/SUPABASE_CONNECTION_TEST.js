// Script para testar conexão com Supabase
// Execute este código no console do navegador (F12)

console.log('🔍 Testando conexão com Supabase...');

// Verificar se o Supabase está disponível
if (typeof window !== 'undefined' && window.supabase) {
  console.log('✅ Supabase client encontrado');
} else {
  console.log('❌ Supabase client não encontrado');
}

// Testar conexão básica
async function testSupabaseConnection() {
  try {
    console.log('🔗 Testando conexão básica...');
    
    // Importar o cliente Supabase
    const { createClient } = await import('https://cdn.skypack.dev/@supabase/supabase-js@2');
    
    // Usar as variáveis de ambiente (você precisa substituir pelos valores reais)
    const supabaseUrl = 'SUA_SUPABASE_URL_AQUI';
    const supabaseKey = 'SUA_SUPABASE_ANON_KEY_AQUI';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Testar consulta simples
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Erro na consulta:', error);
      return false;
    }
    
    console.log('✅ Conexão funcionando! Dados:', data);
    return true;
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
    return false;
  }
}

// Testar se as variáveis de ambiente estão definidas
function checkEnvironmentVariables() {
  console.log('🔧 Verificando variáveis de ambiente...');
  
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ];
  
  let allDefined = true;
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (value) {
      console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
    } else {
      console.log(`❌ ${varName}: NÃO DEFINIDA`);
      allDefined = false;
    }
  });
  
  return allDefined;
}

// Executar testes
console.log('🚀 Iniciando testes...');
checkEnvironmentVariables();
// testSupabaseConnection(); // Descomente quando tiver as credenciais












