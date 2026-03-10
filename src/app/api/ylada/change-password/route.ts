/**
 * POST /api/ylada/change-password — trocar senha para áreas YLADA.
 * Aceita: psi, psicanalise, odonto, fitness, estetica, med, ylada, nutra, coach, perfumaria, seller, admin.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

const YLADA_PROFILES = [
  'psi', 'psicanalise', 'odonto', 'fitness', 'estetica', 'med', 'ylada',
  'nutra', 'coach', 'perfumaria', 'seller', 'admin',
] as const

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, [...YLADA_PROFILES])
    if (authResult instanceof NextResponse) return authResult
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

    const { createClient } = await import('@supabase/supabase-js')
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const tempSupabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: signInData, error: signInError } = await tempSupabase.auth.signInWithPassword({
      email: user.email!,
      password: currentPassword,
    })

    if (signInError || !signInData.session) {
      let errorMessage = 'Senha atual incorreta'
      if (signInError?.message?.includes('Invalid login credentials')) {
        errorMessage = 'Senha atual incorreta. Verifique se digitou corretamente.'
      } else if (signInError?.message?.includes('Email not confirmed')) {
        errorMessage = 'Por favor, confirme seu email antes de alterar a senha.'
      } else if (signInError?.message) {
        errorMessage = signInError.message
      }
      return NextResponse.json({ error: errorMessage }, { status: 401 })
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: newPassword,
    })

    if (updateError) {
      let errorMessage = 'Erro ao atualizar senha'
      if (updateError.message?.includes('password')) {
        errorMessage = 'A nova senha não atende aos requisitos de segurança (mínimo 6 caracteres).'
      } else if (updateError.message) {
        errorMessage = updateError.message
      }
      return NextResponse.json({ error: errorMessage }, { status: 500 })
    }

    await supabaseAdmin
      .from('user_profiles')
      .update({ temporary_password_expires_at: null })
      .eq('user_id', user.id)

    return NextResponse.json({
      success: true,
      message: 'Senha atualizada com sucesso',
      requiresLogout: true,
    })
  } catch (error: any) {
    console.error('[ylada/change-password]', error)
    return NextResponse.json(
      { error: error?.message || 'Erro ao alterar senha' },
      { status: 500 }
    )
  }
}
