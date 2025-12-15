import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Listar documentos de um cliente
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
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

    const { id } = await params
    const authenticatedUserId = user.id

    // Verificar se o cliente existe e pertence ao usuário
    const { data: client, error: clientError } = await supabaseAdmin
      .from('coach_clients')
      .select('id, name')
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Buscar documentos do cliente (apenas não deletados)
    const { data: documents, error } = await supabaseAdmin
      .from('client_documents')
      .select('*')
      .eq('client_id', id)
      .eq('user_id', authenticatedUserId)
      .is('deleted_at', null)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar documentos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar documentos', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { documents: documents || [] }
    })

  } catch (error: any) {
    console.error('Erro ao buscar documentos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * POST - Upload de documento
 * 
 * Body: FormData com:
 * - file: arquivo
 * - document_type: tipo do documento
 * - category: categoria (opcional)
 * - description: descrição (opcional)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
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

    const { id } = await params
    const authenticatedUserId = user.id

    // Verificar se o cliente existe e pertence ao usuário
    const { data: client, error: clientError } = await supabaseAdmin
      .from('coach_clients')
      .select('id, name')
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (clientError || !client) {
      return NextResponse.json(
        { error: 'Cliente não encontrado' },
        { status: 404 }
      )
    }

    // Obter FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('document_type') as string || 'outro'
    const category = formData.get('category') as string || null
    const description = formData.get('description') as string || null

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo é obrigatório' },
        { status: 400 }
      )
    }

    // Validar tipo de arquivo (apenas imagens e PDFs)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use imagens (JPG, PNG, WEBP) ou PDF.' },
        { status: 400 }
      )
    }

    // Validar tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Tamanho máximo: 10MB.' },
        { status: 400 }
      )
    }

    // Gerar nome único para o arquivo
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileName = `${id}/${timestamp}-${randomString}.${fileExtension}`
    const storagePath = `coach/client-documents/${fileName}`

    // Upload para Supabase Storage
    const fileBuffer = await file.arrayBuffer()
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('coach-documents')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Erro ao fazer upload:', uploadError)
      return NextResponse.json(
        { error: 'Erro ao fazer upload do arquivo', technical: process.env.NODE_ENV === 'development' ? uploadError.message : undefined },
        { status: 500 }
      )
    }

    // Obter URL pública do arquivo
    const { data: urlData } = supabaseAdmin.storage
      .from('coach-documents')
      .getPublicUrl(storagePath)

    const publicUrl = urlData.publicUrl

    // Salvar referência no banco de dados
    const { data: document, error: dbError } = await supabaseAdmin
      .from('client_documents')
      .insert({
        client_id: id,
        user_id: authenticatedUserId,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_extension: fileExtension,
        document_type: documentType,
        category: category,
        description: description,
        created_by: authenticatedUserId
      })
      .select()
      .single()

    if (dbError) {
      console.error('Erro ao salvar documento:', dbError)
      // Tentar deletar o arquivo do storage se falhar ao salvar no banco
      await supabaseAdmin.storage
        .from('coach-documents')
        .remove([storagePath])
      
      return NextResponse.json(
        { error: 'Erro ao salvar documento', technical: process.env.NODE_ENV === 'development' ? dbError.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { document }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Erro ao fazer upload de documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

