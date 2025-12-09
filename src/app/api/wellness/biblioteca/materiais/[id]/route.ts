/**
 * PATCH /api/wellness/biblioteca/materiais/[id]
 * DELETE /api/wellness/biblioteca/materiais/[id]
 * 
 * Editar ou deletar material da biblioteca (apenas suporte/admin)
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

// PATCH - Editar material
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    // Apenas suporte ou admin pode editar
    if (!profile.is_support && !profile.is_admin) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas equipe de suporte pode editar materiais.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { titulo, descricao, categoria, link_atalho } = body

    // Validar link_atalho se fornecido
    if (link_atalho) {
      // Normalizar link_atalho
      const linkAtalhoNormalizado = link_atalho
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .substring(0, 50) || 'material'

      // Verificar se já existe (exceto o próprio material)
      const { data: existing } = await supabaseAdmin
        .from('wellness_materiais')
        .select('id')
        .eq('link_atalho', linkAtalhoNormalizado)
        .neq('id', params.id)
        .maybeSingle()

      if (existing) {
        return NextResponse.json(
          { error: 'Link de atalho já existe. Escolha outro nome.' },
          { status: 400 }
        )
      }

      body.link_atalho = linkAtalhoNormalizado
    }

    // Atualizar material
    const { data: material, error } = await supabaseAdmin
      .from('wellness_materiais')
      .update({
        ...(titulo && { titulo }),
        ...(descricao !== undefined && { descricao: descricao || null }),
        ...(categoria && { categoria }),
        ...(link_atalho && { link_atalho }),
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('❌ Erro ao editar material:', error)
      return NextResponse.json(
        { error: `Erro ao editar material: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      material
    })
  } catch (error: any) {
    console.error('❌ Erro ao editar material:', error)
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

// DELETE - Deletar material
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user, profile } = authResult

    // Suporte ou admin pode deletar
    if (!profile.is_support && !profile.is_admin) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas equipe de suporte e administradores podem deletar materiais.' },
        { status: 403 }
      )
    }

    // Buscar material para pegar o arquivo_path
    const { data: material, error: fetchError } = await supabaseAdmin
      .from('wellness_materiais')
      .select('arquivo_path')
      .eq('id', params.id)
      .single()

    if (fetchError || !material) {
      return NextResponse.json(
        { error: 'Material não encontrado' },
        { status: 404 }
      )
    }

    // Deletar arquivo do storage se existir
    if (material.arquivo_path) {
      const { error: storageError } = await supabaseAdmin.storage
        .from('wellness-biblioteca')
        .remove([material.arquivo_path])

      if (storageError) {
        console.warn('⚠️ Erro ao deletar arquivo do storage:', storageError)
        // Continuar mesmo se não conseguir deletar do storage
      }
    }

    // Deletar registro do banco
    const { error: deleteError } = await supabaseAdmin
      .from('wellness_materiais')
      .delete()
      .eq('id', params.id)

    if (deleteError) {
      console.error('❌ Erro ao deletar material:', deleteError)
      return NextResponse.json(
        { error: `Erro ao deletar material: ${deleteError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Material deletado com sucesso'
    })
  } catch (error: any) {
    console.error('❌ Erro ao deletar material:', error)
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}
