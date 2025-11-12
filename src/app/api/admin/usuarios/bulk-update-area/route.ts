import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/admin/usuarios/bulk-update-area
 * Atualiza área de múltiplos usuários de uma vez
 * Apenas admin pode executar
 * 
 * Body:
 * {
 *   from_area: 'nutri' | 'coach' | 'nutra' | 'wellness',
 *   to_area: 'nutri' | 'coach' | 'nutra' | 'wellness'
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
    const { from_area, to_area } = body

    // Validar áreas
    if (!from_area || !to_area) {
      return NextResponse.json(
        { error: 'from_area e to_area são obrigatórios' },
        { status: 400 }
      )
    }

    if (!['wellness', 'nutri', 'coach', 'nutra'].includes(from_area) || 
        !['wellness', 'nutri', 'coach', 'nutra'].includes(to_area)) {
      return NextResponse.json(
        { error: 'Áreas inválidas. Use: wellness, nutri, coach ou nutra' },
        { status: 400 }
      )
    }

    if (from_area === to_area) {
      return NextResponse.json(
        { error: 'from_area e to_area não podem ser iguais' },
        { status: 400 }
      )
    }

    // Buscar todos os usuários com a área de origem
    const { data: profiles, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, nome_completo, email')
      .eq('perfil', from_area)

    if (fetchError) {
      console.error('❌ Erro ao buscar usuários:', fetchError)
      return NextResponse.json(
        { error: 'Erro ao buscar usuários', details: fetchError.message },
        { status: 500 }
      )
    }

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({
        success: true,
        updated: 0,
        message: `Nenhum usuário encontrado com área ${from_area}`
      })
    }

    // Atualizar todos os usuários
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({ 
        perfil: to_area,
        updated_at: new Date().toISOString()
      })
      .eq('perfil', from_area)
      .select('user_id')

    if (updateError) {
      console.error('❌ Erro ao atualizar usuários:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar usuários', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      updated: updated?.length || 0,
      message: `${updated?.length || 0} usuário(s) atualizado(s) de ${from_area} para ${to_area}`
    })
  } catch (error: any) {
    console.error('❌ Erro ao atualizar áreas em massa:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar áreas em massa' },
      { status: 500 }
    )
  }
}

