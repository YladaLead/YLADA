import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST - Upload de arquivo para formulário (público, sem autenticação)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { formId } = await params
    const formData = await request.formData()
    const file = formData.get('file') as File
    const fieldId = formData.get('fieldId') as string

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não fornecido' },
        { status: 400 }
      )
    }

    // Validar tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Tamanho máximo: 10MB` },
        { status: 400 }
      )
    }

    // Validar tipo de arquivo (MIME types permitidos)
    const tiposPermitidos = [
      'application/pdf',
      'application/x-pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'text/plain',
      'text/csv',
      'application/zip',
      'application/x-zip-compressed'
    ]

    if (!tiposPermitidos.includes(file.type)) {
      return NextResponse.json(
        { 
          error: `Tipo de arquivo não permitido. Tipos aceitos: PDF, Word, Excel, Imagens (JPG, PNG, GIF, WebP), Texto, CSV, ZIP`,
          tipoRecebido: file.type
        },
        { status: 400 }
      )
    }

    // Verificar se o formulário existe e está ativo
    const { data: form, error: formError } = await supabaseAdmin
      .from('custom_forms')
      .select('id, user_id, is_active')
      .eq('id', formId)
      .eq('is_active', true)
      .single()

    if (formError || !form) {
      return NextResponse.json(
        { error: 'Formulário não encontrado ou não está mais disponível' },
        { status: 404 }
      )
    }

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    const extensaoArquivo = file.name.split('.').pop()?.toLowerCase() || 'file'
    const nomeBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 50)
    const nomeArquivo = `formularios/${formId}/${fieldId}/${timestamp}-${random}-${nomeBase}.${extensaoArquivo}`

    // Converter File para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Verificar se o bucket existe, se não criar
    const bucketName = 'formularios-uploads'
    
    // Tentar fazer upload
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(nomeArquivo, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      // Se o bucket não existir, retornar erro informativo
      if (uploadError.message.includes('Bucket not found')) {
        return NextResponse.json(
          { error: 'Bucket de storage não configurado. Contate o suporte.' },
          { status: 500 }
        )
      }
      
      console.error('Erro no upload:', uploadError)
      return NextResponse.json(
        { 
          error: `Erro ao fazer upload: ${uploadError.message}`,
          details: uploadError
        },
        { status: 500 }
      )
    }

    // Obter URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(uploadData.path)

    return NextResponse.json({
      success: true,
      data: {
        path: uploadData.path,
        url: urlData.publicUrl,
        nome: file.name,
        tamanho: file.size,
        tipo: file.type
      }
    })

  } catch (error: any) {
    console.error('Erro ao fazer upload de arquivo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}


