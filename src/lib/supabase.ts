import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Funções de autenticação
export async function signUp(email: string, password: string, userType: string, profileData: Record<string, unknown>) {
  try {
    console.log('🔐 Iniciando cadastro...', { email, userType })
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: userType,
          ...profileData
        }
      }
    })

    if (authError) {
      console.error('❌ Erro no auth:', authError)
      throw authError
    }

    console.log('✅ Usuário criado no auth:', authData.user?.id)
    
    // Criar perfil profissional após cadastro
    if (authData.user && userType === 'professional') {
      console.log('🔧 Criando perfil profissional...', { 
        userId: authData.user.id, 
        email, 
        profileData 
      })
      
      try {
        const { error: profileError } = await supabase
          .from('professionals')
          .insert({
            id: authData.user.id,
            email: email,
            name: profileData.name as string,
            phone: profileData.phone as string,
            specialty: profileData.specialty as string,
            company: profileData.company as string
          })

        if (profileError) {
          console.error('❌ Erro ao criar perfil profissional:', profileError)
          console.error('❌ Detalhes do erro:', {
            code: profileError.code,
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint
          })
          // Não falhar o cadastro se o perfil não for criado
        } else {
          console.log('✅ Perfil profissional criado com sucesso')
        }
      } catch (profileError) {
        console.error('❌ Erro ao criar perfil profissional:', profileError)
        // Não falhar o cadastro se o perfil não for criado
      }
    } else {
      console.log('⚠️ Não criando perfil profissional:', { 
        hasUser: !!authData.user, 
        userType 
      })
    }
    
    return authData
  } catch (error) {
    console.error('❌ Erro completo no signUp:', error)
    throw error
  }
}

export async function signIn(email: string, password: string) {
  try {
    console.log('🔑 Iniciando login...', { email })
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('❌ Erro no login:', error)
      throw error
    }

    console.log('✅ Login realizado:', data.user?.id)
    
    // Verificar se o usuário existe na tabela professionals
    if (data.user) {
      const { error: profError } = await supabase
        .from('professionals')
        .select('id')
        .eq('email', email)
        .single()

      if (profError && profError.code === 'PGRST116') {
        // Usuário não existe na tabela professionals - criar perfil básico
        console.log('⚠️ Usuário não encontrado na tabela professionals, criando perfil básico...')
        
        try {
          const { error: createError } = await supabase
            .from('professionals')
            .insert({
              id: data.user.id,
              email: email,
              name: data.user.user_metadata?.name || 'Usuário',
              phone: data.user.user_metadata?.phone || '',
              specialty: data.user.user_metadata?.specialty || '',
              company: data.user.user_metadata?.company || ''
            })

          if (createError) {
            console.error('❌ Erro ao criar perfil básico:', createError)
          } else {
            console.log('✅ Perfil básico criado com sucesso')
          }
        } catch (createError) {
          console.error('❌ Erro ao criar perfil básico:', createError)
        }
      } else if (profError) {
        console.error('❌ Erro ao verificar perfil profissional:', profError)
      } else {
        console.log('✅ Perfil profissional encontrado')
      }
    }
    
    return data
  } catch (error) {
    console.error('❌ Erro completo no signIn:', error)
    throw error
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Função para criar perfil profissional para usuários existentes
export async function createProfessionalProfile(userId: string, email: string, profileData: Record<string, unknown>) {
  try {
    console.log('👤 Criando perfil profissional para usuário existente...', { userId, email })
    
    const { error } = await supabase
      .from('professionals')
      .insert({
        id: userId,
        email: email,
        name: profileData.name as string || 'Usuário',
        phone: profileData.phone as string,
        specialty: profileData.specialty as string,
        company: profileData.company as string
      })

    if (error) {
      console.error('❌ Erro ao criar perfil profissional:', error)
      throw error
    }

    console.log('✅ Perfil profissional criado com sucesso')
    return true
  } catch (error) {
    console.error('❌ Erro completo ao criar perfil profissional:', error)
    throw error
  }
}

// Função para limpar usuários "fantasma" (existem no auth mas não na tabela professionals)
export async function cleanupGhostUsers() {
  try {
    console.log('🧹 Limpando usuários fantasma...')
    
    // Buscar todos os usuários do auth
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ Erro ao buscar usuários do auth:', authError)
      return
    }

    // Buscar todos os profissionais
    const { data: professionals, error: profError } = await supabase
      .from('professionals')
      .select('id, email')

    if (profError) {
      console.error('❌ Erro ao buscar profissionais:', profError)
      return
    }

    const professionalIds = new Set(professionals?.map(p => p.id) || [])
    
    // Identificar usuários fantasma
    const ghostUsers = users?.filter(user => !professionalIds.has(user.id)) || []
    
    console.log(`🔍 Encontrados ${ghostUsers.length} usuários fantasma`)
    
    // Deletar usuários fantasma do auth
    for (const user of ghostUsers) {
      try {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
        if (deleteError) {
          console.error(`❌ Erro ao deletar usuário fantasma ${user.email}:`, deleteError)
        } else {
          console.log(`✅ Usuário fantasma deletado: ${user.email}`)
        }
      } catch (deleteError) {
        console.error(`❌ Erro ao deletar usuário fantasma ${user.email}:`, deleteError)
      }
    }
    
    console.log('✅ Limpeza de usuários fantasma concluída')
  } catch (error) {
    console.error('❌ Erro na limpeza de usuários fantasma:', error)
  }
}

// Função para verificar se email já existe e limpar se necessário
export async function checkAndCleanEmail(email: string) {
  try {
    console.log('🔍 Verificando email:', email)
    
    // Verificar se existe na tabela professionals
    const { error: profError } = await supabase
      .from('professionals')
      .select('id, email')
      .eq('email', email)
      .single()

    if (profError && profError.code === 'PGRST116') {
      // Não existe na tabela professionals - verificar se existe no auth
      console.log('⚠️ Email não encontrado na tabela professionals')
      
      // Tentar fazer login para ver se existe no auth
      try {
        await supabase.auth.signInWithPassword({
          email,
          password: 'dummy_password_to_check_existence'
        })
        
        // Se chegou aqui, o usuário existe no auth mas com senha errada
        console.log('⚠️ Email existe no auth mas não na tabela professionals')
        return { exists: true, needsCleanup: true }
      } catch (authError: unknown) {
        const errorMessage = authError instanceof Error ? authError.message : String(authError)
        if (errorMessage.includes('Invalid login credentials')) {
          // Usuário existe no auth mas senha está errada
          console.log('⚠️ Email existe no auth mas senha está errada')
          return { exists: true, needsCleanup: true }
        } else {
          // Usuário não existe no auth
          console.log('✅ Email não existe - pode cadastrar')
          return { exists: false, needsCleanup: false }
        }
      }
    } else if (profError) {
      console.error('❌ Erro ao verificar profissional:', profError)
      return { exists: false, needsCleanup: false }
    } else {
      // Existe na tabela professionals
      console.log('⚠️ Email já existe na tabela professionals')
      return { exists: true, needsCleanup: false }
    }
  } catch (error) {
    console.error('❌ Erro ao verificar email:', error)
    return { exists: false, needsCleanup: false }
  }
}

// Tipos para o banco de dados
export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  age?: number
  gender?: string
  weight?: number
  height?: number
  activity?: string
  calculatorType: string
  results?: Record<string, unknown>
  recommendations?: Record<string, unknown>
  quizType?: string
  quizResults?: Record<string, unknown>
  status: string
  priority: string
  source?: string
  ipAddress?: string
  userAgent?: string
  professionalId?: string
  createdAt: string
  updatedAt: string
}

export interface Professional {
  id: string
  name: string
  email: string
  phone?: string
  specialty?: string
  company?: string
  license?: string
  isActive: boolean
  maxLeads: number
  createdAt: string
  updatedAt: string
}

export interface LeadNote {
  id: string
  leadId: string
  content: string
  author: string
  createdAt: string
}
