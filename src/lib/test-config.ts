// Teste de configuração das variáveis de ambiente
export function testEnvironmentVariables() {
  const requiredVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_ASSISTANT_ID: process.env.OPENAI_ASSISTANT_ID,
  }

  const missingVars = Object.entries(requiredVars)
    .filter(([key, value]) => !value || value.includes('your_') || value.includes('SUA_'))
    .map(([key]) => key)

  if (missingVars.length > 0) {
    console.error('❌ Variáveis de ambiente faltando ou com valores placeholder:', missingVars)
    return false
  }

  console.log('✅ Todas as variáveis de ambiente estão configuradas')
  return true
}

// Teste de conexão Supabase
export async function testSupabaseConnection() {
  try {
    const { supabaseAdmin } = await import('./supabase-fixed')
    
    const { data, error } = await supabaseAdmin
      .from('templates_base')
      .select('count')
      .limit(1)

    if (error) {
      console.error('❌ Erro na conexão Supabase:', error.message)
      return false
    }

    console.log('✅ Conexão Supabase funcionando')
    return true
  } catch (error) {
    console.error('❌ Erro ao testar Supabase:', error)
    return false
  }
}

// Teste de configuração OpenAI
export function testOpenAIConfiguration() {
  try {
    const apiKey = process.env.OPENAI_API_KEY
    const assistantId = process.env.OPENAI_ASSISTANT_ID

    if (!apiKey || apiKey.includes('your_')) {
      console.error('❌ OPENAI_API_KEY não configurada')
      return false
    }

    if (!assistantId || assistantId.includes('your_')) {
      console.error('❌ OPENAI_ASSISTANT_ID não configurada')
      return false
    }

    console.log('✅ Configuração OpenAI OK')
    return true
  } catch (error) {
    console.error('❌ Erro ao testar OpenAI:', error)
    return false
  }
}
