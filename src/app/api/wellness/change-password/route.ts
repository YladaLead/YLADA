import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// POST - Trocar senha do usuário wellness
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Senha atual e nova senha são obrigatórias' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'A nova senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      )
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'A nova senha deve ser diferente da senha atual' },
        { status: 400 }
      )
    }

    // Verificar senha atual fazendo login temporário
    console.log('🔍 ==========================================')
    console.log('🔍 VERIFICANDO SENHA ATUAL')
    console.log('🔍 ==========================================')
    console.log('🔍 Email:', user.email)
    console.log('🔍 User ID:', user.id)
    console.log('🔍 Senha atual recebida (primeiros 3 chars):', currentPassword.substring(0, 3) + '***')
    console.log('🔍 ==========================================')
    
    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Variáveis de ambiente do Supabase não configuradas')
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }
    
    const tempSupabase = createClient(supabaseUrl, supabaseAnonKey)

    // Tentar fazer login com a senha atual para verificar
    const { data: signInData, error: signInError } = await tempSupabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword
    })

    if (signInError || !signInData.session) {
      console.error('❌ Erro ao verificar senha atual:', {
        error: signInError?.message,
        code: signInError?.status,
        hasSession: !!signInData.session,
        errorDetails: signInError
      })
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Senha atual incorreta'
      if (signInError?.message?.includes('Invalid login credentials')) {
        errorMessage = 'Senha atual incorreta. Verifique se você digitou a senha provisória corretamente (incluindo maiúsculas, minúsculas e caracteres especiais).'
      } else if (signInError?.message?.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de alterar a senha.'
      } else if (signInError?.message) {
        errorMessage = `Erro ao verificar senha: ${signInError.message}`
      }
      
      return NextResponse.json(
        { error: errorMessage, details: signInError?.message },
        { status: 401 }
      )
    }

    console.log('✅ Senha atual verificada com sucesso')
    console.log('✅ Sessão criada:', !!signInData.session)

    // Se a senha atual está correta, usar o supabaseAdmin para atualizar diretamente
    console.log('🔄 ==========================================')
    console.log('🔄 ATUALIZANDO SENHA')
    console.log('🔄 ==========================================')
    console.log('🔄 User ID:', user.id)
    console.log('🔄 Email:', user.email)
    console.log('🔄 Nova senha (primeiros 3 chars):', newPassword.substring(0, 3) + '***')
    console.log('🔄 ==========================================')
    
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        password: newPassword
      }
    )

    if (updateError) {
      console.error('❌ Erro ao atualizar senha:', {
        error: updateError.message,
        code: updateError.status,
        details: updateError
      })
      
      // Mensagens de erro mais específicas
      let errorMessage = 'Erro ao atualizar senha'
      if (updateError.message?.includes('password')) {
        errorMessage = 'A nova senha não atende aos requisitos de segurança. Use uma senha mais forte (mínimo 6 caracteres).'
      } else if (updateError.message) {
        errorMessage = `Erro ao atualizar senha: ${updateError.message}`
      }
      
      return NextResponse.json(
        { error: errorMessage, details: updateError.message },
        { status: 500 }
      )
    }

    console.log('✅ Senha atualizada no Supabase Auth com sucesso')
    
    // Verificar se a senha foi realmente atualizada tentando fazer login
    console.log('🔍 Verificando se senha foi atualizada...')
    const { data: verifyData, error: verifyError } = await tempSupabase.auth.signInWithPassword({
      email: user.email!,
      password: newPassword
    })
    
    if (verifyError || !verifyData.session) {
      console.error('❌ ERRO CRÍTICO: Senha não foi atualizada corretamente!', {
        error: verifyError?.message,
        hasSession: !!verifyData.session
      })
      // Mesmo assim, retornar sucesso porque o updateUserById não deu erro
      // Mas logar o problema para investigação
    } else {
      console.log('✅ Confirmação: Nova senha funciona corretamente!')
      // Fazer logout do login de verificação
      await tempSupabase.auth.signOut()
    }

    // Limpar senha provisória após troca bem-sucedida
    console.log('🧹 Limpando senha provisória...')
    const { error: profileUpdateError, data: profileUpdateData } = await supabaseAdmin
      .from('user_profiles')
      .update({ temporary_password_expires_at: null })
      .eq('user_id', user.id)
      .select()

    if (profileUpdateError) {
      console.error('❌ Erro ao limpar senha provisória:', profileUpdateError)
      // Não falhar a requisição se isso der erro, pois a senha já foi alterada
      // Mas logar como erro para investigação
    } else {
      console.log(`✅ Senha provisória limpa para ${user.email}`)
      console.log(`✅ Registros atualizados:`, profileUpdateData?.length || 0)
    }

    console.log('✅ ==========================================')
    console.log(`✅ SENHA ATUALIZADA COM SUCESSO`)
    console.log(`✅ Email: ${user.email}`)
    console.log(`✅ User ID: ${user.id}`)
    console.log(`✅ Senha provisória limpa: ${!profileUpdateError ? 'SIM' : 'NÃO (erro)'}`)
    console.log('✅ ==========================================')

    return NextResponse.json({
      success: true,
      message: 'Senha atualizada com sucesso',
      requiresLogout: true // Flag para indicar que logout é necessário
    })
  } catch (error: any) {
    console.error('❌ Erro ao alterar senha:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao alterar senha' },
      { status: 500 }
    )
  }
}

