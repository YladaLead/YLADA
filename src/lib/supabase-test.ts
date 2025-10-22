// Teste de conexão com Supabase
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export async function testSupabaseConnection() {
  try {
    // Testar conexão básica
    const { data, error } = await supabase
      .from('templates_nutrition')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Erro na conexão:', error)
      return false
    }
    
    console.log('✅ Conexão com Supabase funcionando!')
    console.log('Templates disponíveis:', data)
    return true
  } catch (err) {
    console.error('Erro na conexão:', err)
    return false
  }
}

export async function getTemplatesByLanguage(language: string) {
  const { data, error } = await supabase
    .from('templates_nutrition')
    .select('*')
    .eq('language', language)
    .eq('is_active', true)
  
  if (error) {
    console.error('Erro ao buscar templates:', error)
    return []
  }
  
  return data || []
}

