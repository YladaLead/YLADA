'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function TestAuth() {
  const [user, setUser] = useState<{ id: string; email?: string; name?: string; last_sign_in_at?: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  )

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Teste: Verificando autenticação...')
        
        const { data: { user: authUser }, error } = await supabase.auth.getUser()
        
        if (error) {
          console.error('❌ Teste: Erro na autenticação:', error)
          setLoading(false)
          return
        }
        
        if (!authUser) {
          console.log('❌ Teste: Usuário não autenticado')
          setLoading(false)
          return
        }
        
        console.log('✅ Teste: Usuário autenticado:', authUser.id)
        setUser(authUser)
        
        // Buscar perfil
        const { data: profile } = await supabase
          .from('professionals')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle()
        
        if (profile) {
          console.log('✅ Teste: Perfil encontrado:', profile.name)
        } else {
          console.log('❌ Teste: Perfil não encontrado')
        }
        
      } catch (error) {
        console.error('❌ Teste: Erro:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()

    // Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Teste: Mudança de auth:', event, session?.user?.id)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Testando autenticação...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Teste de Autenticação</h1>
        
        {user ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-green-600 mb-4">✅ Usuário Autenticado</h2>
            <div className="space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Último Login:</strong> {user.last_sign_in_at}</p>
            </div>
            <div className="mt-6">
              <a 
                href="/user" 
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
              >
                Ir para Dashboard
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">❌ Usuário Não Autenticado</h2>
            <p className="text-gray-600 mb-4">Você precisa fazer login primeiro.</p>
            <a 
              href="/auth" 
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
            >
              Fazer Login
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

