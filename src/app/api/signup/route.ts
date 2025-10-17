import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone, specialty, company } = await request.json()
    
    console.log('🔐 API: Iniciando cadastro...', { email })
    
    // Criar usuário no auth
    const { data: authData, error: authError } = await createClient(supabaseUrl, supabaseAnonKey)
      .auth.signUp({
        email,
        password,
        options: {
          data: {
            user_type: 'professional',
            name,
            phone,
            specialty,
            company
          }
        }
      })

    if (authError) {
      console.error('❌ API: Erro no auth:', authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    console.log('✅ API: Usuário criado no auth:', authData.user?.id)
    
    // Criar perfil profissional
    if (authData.user) {
      console.log('🔧 API: Criando perfil profissional...', { 
        userId: authData.user.id, 
        email 
      })
      
      const { error: profileError } = await createClient(supabaseUrl, supabaseAnonKey)
        .from('professionals')
        .insert({
          id: authData.user.id,
          email: email,
          name: name,
          phone: phone,
          specialty: specialty,
          company: company
        })

      if (profileError) {
        console.error('❌ API: Erro ao criar perfil profissional:', profileError)
        return NextResponse.json({ 
          error: 'Erro ao criar perfil profissional', 
          details: profileError.message 
        }, { status: 500 })
      }

      console.log('✅ API: Perfil profissional criado com sucesso')
    }
    
    return NextResponse.json({ 
      success: true, 
      user: authData.user,
      message: 'Cadastro realizado com sucesso!' 
    })
    
  } catch (error) {
    console.error('❌ API: Erro completo:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
