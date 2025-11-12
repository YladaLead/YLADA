import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * PUT /api/admin/usuarios/[id]
 * Atualiza dados do usuário (área, nome, etc)
 * Apenas admin pode atualizar
 * 
 * Body:
 * {
 *   area?: 'wellness' | 'nutri' | 'coach' | 'nutra',
 *   nome_completo?: string,
 *   email?: string (não pode ser alterado, apenas para referência)
 * }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const userId = params.id
    const body = await request.json()
    const { area, nome_completo } = body

    // Validar área se fornecida
    if (area && !['wellness', 'nutri', 'coach', 'nutra'].includes(area)) {
      return NextResponse.json(
        { error: 'Área inválida. Use: wellness, nutri, coach ou nutra' },
        { status: 400 }
      )
    }

    // Preparar dados para atualização
    const updateData: any = {}
    if (area) updateData.perfil = area
    if (nome_completo !== undefined) updateData.nome_completo = nome_completo
    updateData.updated_at = new Date().toISOString()

    // Atualizar perfil
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao atualizar usuário:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar usuário', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      usuario: data,
      message: 'Usuário atualizado com sucesso'
    })
  } catch (error: any) {
    console.error('❌ Erro ao atualizar usuário:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao atualizar usuário' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/usuarios/[id]
 * Deleta usuário e todos os dados relacionados
 * Apenas admin pode deletar
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const userId = params.id

    // Deletar usuário do Supabase Auth (isso vai deletar automaticamente o perfil por CASCADE)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteError) {
      console.error('❌ Erro ao deletar usuário:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao deletar usuário', details: deleteError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Usuário deletado com sucesso'
    })
  } catch (error: any) {
    console.error('❌ Erro ao deletar usuário:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao deletar usuário' },
      { status: 500 }
    )
  }
}

