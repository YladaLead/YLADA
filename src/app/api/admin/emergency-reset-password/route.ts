import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/admin/emergency-reset-password
 * Reset de senha de emergência para admin
 * Não requer autenticação, mas usa service role key
 * 
 * Body:
 * {
 *   email: string (opcional, padrão: faulaandre@gmail.com),
 *   newPassword?: string (opcional, se não fornecido, gera senha padrão)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se tem chave de emergência (opcional, para segurança extra)
    const emergencyKey = process.env.EMERGENCY_RESET_KEY || 'ylada-emergency-2025'
    const body = await request.json()
    const providedKey = body.key
    const email = body.email || 'faulaandre@gmail.com'
    
    // Gerar senha aleatória segura se não fornecida
    const generateSecurePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
      let password = ''
      for (let i = 0; i < 16; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      return password
    }
    
    const newPassword = body.newPassword || generateSecurePassword()

    // Se forneceu chave, verificar
    if (providedKey && providedKey !== emergencyKey) {
      return NextResponse.json(
        { error: 'Chave de emergência inválida' },
        { status: 401 }
      )
    }

    console.log(`🚨 RESET DE SENHA DE EMERGÊNCIA para ${email}`)

    // Buscar usuário pelo email
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (usersError) {
      console.error('❌ Erro ao buscar usuários:', usersError)
      return NextResponse.json(
        { error: 'Erro ao buscar usuários', details: usersError.message },
        { status: 500 }
      )
    }

    const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (!user) {
      return NextResponse.json(
        { error: `Usuário ${email} não encontrado` },
        { status: 404 }
      )
    }

    // Atualizar senha diretamente
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        password: newPassword
      }
    )

    if (updateError) {
      console.error(`❌ Erro ao atualizar senha para ${email}:`, updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar senha', details: updateError.message },
        { status: 500 }
      )
    }

    console.log(`✅ Senha atualizada com sucesso para ${email}`)

    // Garantir que o usuário é admin
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!profile || !profile.is_admin) {
      console.log('⚠️ Usuário não é admin, corrigindo...')
      await supabaseAdmin
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          email: email,
          nome_completo: 'ANDRE FAULA',
          perfil: 'wellness',
          is_admin: true,
          is_support: false,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
    }

    return NextResponse.json({
      success: true,
      message: `Senha resetada com sucesso para ${email}`,
      email: email,
      password: newPassword,
      loginUrl: 'https://www.ylada.com/admin/login',
      instructions: [
        '1. Acesse: https://www.ylada.com/admin/login',
        `2. Email: ${email}`,
        `3. Senha: ${newPassword}`,
        '4. Após fazer login, altere a senha para uma mais segura'
      ]
    })
  } catch (error: any) {
    console.error('❌ Erro no reset de emergência:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao resetar senha' },
      { status: 500 }
    )
  }
}

