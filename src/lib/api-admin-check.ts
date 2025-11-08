import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * Verifica se o token pertence a um usuário admin
 * @param token Token de autenticação do usuário
 * @returns { isAdmin: boolean, userId: string | null, error?: string }
 */
export async function verificarAdmin(token: string): Promise<{ isAdmin: boolean; userId: string | null; error?: string }> {
  try {
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    
    if (authError || !user) {
      return { isAdmin: false, userId: null, error: 'Token inválido' }
    }

    // Verificar se é admin na tabela user_profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile?.is_admin) {
      return { isAdmin: false, userId: user.id }
    }

    return { isAdmin: true, userId: user.id }
  } catch (error: any) {
    return { isAdmin: false, userId: null, error: error.message }
  }
}

