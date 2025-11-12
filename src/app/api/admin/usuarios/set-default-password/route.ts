import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/admin/usuarios/set-default-password
 * Define senha padrão para usuários migrados
 * Apenas admin pode executar
 * 
 * Body:
 * {
 *   defaultPassword?: string (opcional, padrão: 'Ylada2025!'),
 *   area?: 'wellness' | 'nutri' | 'coach' | 'nutra' (opcional, filtrar por área)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const defaultPassword = body.defaultPassword || 'Ylada2025!'
    const area = body.area

    // Buscar usuários migrados
    let subscriptionsQuery = supabaseAdmin
      .from('subscriptions')
      .select('user_id, area, is_migrated')
      .eq('is_migrated', true)
      .eq('status', 'active')

    if (area) {
      subscriptionsQuery = subscriptionsQuery.eq('area', area)
    }

    const { data: subscriptions, error: subsError } = await subscriptionsQuery

    if (subsError) {
      console.error('❌ Erro ao buscar assinaturas migradas:', subsError)
      return NextResponse.json(
        { error: 'Erro ao buscar usuários migrados', details: subsError.message },
        { status: 500 }
      )
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        updated: 0,
        message: 'Nenhum usuário migrado encontrado'
      })
    }

    // Buscar perfis dos usuários
    const userIds = subscriptions.map(s => s.user_id)
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, email')
      .in('user_id', userIds)

    if (profilesError) {
      console.error('❌ Erro ao buscar perfis:', profilesError)
      return NextResponse.json(
        { error: 'Erro ao buscar perfis de usuários', details: profilesError.message },
        { status: 500 }
      )
    }

    const results = {
      updated: 0,
      failed: 0,
      errors: [] as any[]
    }

    // Atualizar senha de cada usuário
    for (const profile of profiles || []) {
      try {
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          profile.user_id,
          {
            password: defaultPassword
          }
        )

        if (updateError) {
          console.error(`❌ Erro ao atualizar senha para ${profile.email}:`, updateError)
          results.failed++
          results.errors.push({
            email: profile.email,
            error: updateError.message
          })
        } else {
          results.updated++
          console.log(`✅ Senha atualizada para ${profile.email}`)
        }
      } catch (error: any) {
        console.error(`❌ Erro ao processar usuário ${profile.email}:`, error)
        results.failed++
        results.errors.push({
          email: profile.email,
          error: error.message || 'Erro desconhecido'
        })
      }
    }

    return NextResponse.json({
      success: true,
      updated: results.updated,
      failed: results.failed,
      total: (profiles || []).length,
      errors: results.errors,
      message: `${results.updated} senha(s) atualizada(s) com sucesso, ${results.failed} falharam`
    })
  } catch (error: any) {
    console.error('❌ Erro ao definir senhas padrão:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao definir senhas padrão' },
      { status: 500 }
    )
  }
}

