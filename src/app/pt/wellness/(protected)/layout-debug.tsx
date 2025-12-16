import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

interface ProtectedLayoutProps {
  children: ReactNode
}

/**
 * VERSÃO DEBUG - Layout simplificado para isolar problema
 * Apenas verifica sessão e perfil, SEM assinatura
 */
export default async function ProtectedWellnessLayout({ children }: ProtectedLayoutProps) {
  try {
    console.log('🔍 DEBUG: Iniciando validação...')
    
    // 1. Criar cliente Supabase
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll() {
            // Cookies serão setados automaticamente
          },
        },
      }
    )

    console.log('🔍 DEBUG: Cliente Supabase criado')

    // 2. Verificar sessão
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    console.log('🔍 DEBUG: Sessão verificada', { 
      hasSession: !!session, 
      hasError: !!sessionError,
      error: sessionError?.message 
    })

    if (sessionError || !session || !session.user) {
      console.log('❌ DEBUG: Sem sessão, redirecionando')
      redirect('/pt/wellness/login')
    }

    // 3. Buscar perfil (simplificado)
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('id, perfil, is_admin, is_support')
      .eq('user_id', session.user.id)
      .maybeSingle()

    console.log('🔍 DEBUG: Perfil buscado', { 
      hasProfile: !!profile, 
      hasError: !!profileError,
      error: profileError?.message,
      perfil: profile?.perfil 
    })

    if (profileError) {
      console.error('❌ DEBUG: Erro ao buscar perfil:', profileError)
      redirect('/pt/wellness/login')
    }

    if (!profile) {
      console.log('❌ DEBUG: Perfil não encontrado')
      redirect('/pt/wellness/login')
    }

    // 4. Verificar perfil (admin pode bypassar)
    const canBypass = profile.is_admin || profile.is_support
    
    if (profile.perfil !== 'wellness' && !canBypass) {
      console.log('❌ DEBUG: Perfil incorreto', { perfil: profile.perfil })
      redirect('/pt/wellness/login')
    }

    console.log('✅ DEBUG: Validação OK, renderizando children')
    
    // Tudo OK - renderizar
    return <>{children}</>
    
  } catch (error: any) {
    // Next.js redirect() lança exceção especial
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error
    }
    
    console.error('❌ DEBUG: Erro inesperado:', error)
    console.error('❌ DEBUG: Stack:', error?.stack)
    redirect('/pt/wellness/login')
  }
}

