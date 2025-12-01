import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar documento específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { id, documentId } = await params
    const authenticatedUserId = user.id

    // Buscar documento
    const { data: document, error } = await supabaseAdmin
      .from('client_documents')
      .select('*')
      .eq('id', documentId)
      .eq('client_id', id)
      .eq('user_id', authenticatedUserId)
      .is('deleted_at', null)
      .single()

    if (error || !document) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { document }
    })

  } catch (error: any) {
    console.error('Erro ao buscar documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * PUT - Atualizar documento (metadados)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { id, documentId } = await params
    const authenticatedUserId = user.id

    const body = await request.json()
    const { document_type, category, description } = body

    // Verificar se o documento existe e pertence ao usuário
    const { data: existingDoc, error: fetchError } = await supabaseAdmin
      .from('client_documents')
      .select('id')
      .eq('id', documentId)
      .eq('client_id', id)
      .eq('user_id', authenticatedUserId)
      .is('deleted_at', null)
      .single()

    if (fetchError || !existingDoc) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // Preparar dados para atualização
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (document_type !== undefined) updateData.document_type = document_type
    if (category !== undefined) updateData.category = category
    if (description !== undefined) updateData.description = description

    // Atualizar documento
    const { data: updatedDoc, error } = await supabaseAdmin
      .from('client_documents')
      .update(updateData)
      .eq('id', documentId)
      .eq('client_id', id)
      .eq('user_id', authenticatedUserId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar documento:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar documento', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { document: updatedDoc }
    })

  } catch (error: any) {
    console.error('Erro ao atualizar documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Deletar documento (soft delete)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { id, documentId } = await params
    const authenticatedUserId = user.id

    // Buscar documento para obter o caminho do arquivo
    const { data: document, error: fetchError } = await supabaseAdmin
      .from('client_documents')
      .select('id, file_url')
      .eq('id', documentId)
      .eq('client_id', id)
      .eq('user_id', authenticatedUserId)
      .is('deleted_at', null)
      .single()

    if (fetchError || !document) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // Soft delete: marcar como deletado
    const { error } = await supabaseAdmin
      .from('client_documents')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', documentId)
      .eq('client_id', id)
      .eq('user_id', authenticatedUserId)

    if (error) {
      console.error('Erro ao deletar documento:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar documento', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    // Opcional: deletar arquivo do storage também
    // (comentado para manter histórico, mas pode ser habilitado se necessário)
    // const filePath = document.file_url.split('/').pop()
    // await supabaseAdmin.storage
    //   .from('nutri-documents')
    //   .remove([`${id}/${filePath}`])

    return NextResponse.json({
      success: true,
      message: 'Documento deletado com sucesso'
    })

  } catch (error: any) {
    console.error('Erro ao deletar documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

