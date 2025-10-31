import { supabase } from './supabase'
import { redirect } from 'next/navigation'

// Helper para obter sessão atual
export async function getSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      console.error('Erro ao obter sessão:', error)
      return null
    }
    return session
  } catch (error) {
    console.error('Erro ao obter sessão:', error)
    return null
  }
}

// Helper para obter usuário atual
export async function getUser() {
  const session = await getSession()
  return session?.user || null
}

// Helper para verificar se usuário está autenticado
export async function isAuthenticated() {
  const session = await getSession()
  return !!session
}

// Helper para obter perfil do usuário
export async function getUserProfile() {
  const user = await getUser()
  if (!user) return null

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Erro ao obter perfil:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Erro ao obter perfil:', error)
    return null
  }
}

// Helper para fazer logout
export async function logout() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return true
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    return false
  }
}

// Helper para proteger rotas (Server Component)
export async function requireAuth(redirectTo?: string) {
  const session = await getSession()
  
  if (!session) {
    redirect(redirectTo || '/pt/nutri/login')
  }
  
  return session
}

// Helper para verificar perfil específico
export async function requireProfile(perfil: 'nutri' | 'wellness' | 'coach' | 'nutra') {
  const profile = await getUserProfile()
  
  if (!profile || profile.perfil !== perfil) {
    redirect(`/pt/${perfil}/login`)
  }
  
  return profile
}

