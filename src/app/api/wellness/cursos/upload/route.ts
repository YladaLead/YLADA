import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verificarAdmin } from '@/lib/api-admin-check'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

/**
 * POST /api/wellness/cursos/upload
 * Faz upload de arquivo (PDF, vídeo ou thumbnail)
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação e permissões de admin
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const adminCheck = await verificarAdmin(token)

    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.error },
        { status: 401 }
      )
    }

    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: 'Acesso negado. Apenas admins podem fazer upload.' },
        { status: 403 }
      )
    }

    // Obter dados do FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    const tipo = formData.get('tipo') as string // 'pdf', 'video', 'thumbnail'

    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não fornecido' },
        { status: 400 }
      )
    }

    if (!tipo || !['pdf', 'video', 'thumbnail'].includes(tipo)) {
      return NextResponse.json(
        { error: 'Tipo deve ser "pdf", "video" ou "thumbnail"' },
        { status: 400 }
      )
    }

    // Validar tipo de arquivo
    const extensao = file.name.split('.').pop()?.toLowerCase()
    
    const tiposPermitidos = {
      pdf: {
        mimeTypes: ['application/pdf', 'application/x-pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/jpeg'],
        extensoes: ['pdf', 'jpg', 'jpeg', 'png']
      },
      video: {
        mimeTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'],
        extensoes: ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv']
      },
      thumbnail: {
        mimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        extensoes: ['jpg', 'jpeg', 'png', 'webp']
      }
    }

    const tiposValidos = tiposPermitidos[tipo as keyof typeof tiposPermitidos]
    
    // Verificar por MIME type ou extensão
    const mimeValido = tiposValidos.mimeTypes.includes(file.type)
    const extensaoValida = extensao ? tiposValidos.extensoes.includes(extensao) : false
    
    // Log para debug
    console.log('Upload - Tipo:', tipo, 'File type:', file.type, 'Extensão:', extensao, 'MIME válido:', mimeValido, 'Extensão válida:', extensaoValida)
    
    if (!mimeValido && !extensaoValida) {
      return NextResponse.json(
        { 
          error: `Tipo de arquivo inválido. Tipo recebido: ${file.type || 'vazio'}, Extensão: ${extensao || 'não detectada'}. Tipos aceitos para ${tipo}: ${tiposValidos.mimeTypes.join(', ')} ou extensões: ${tiposValidos.extensoes.join(', ')}` 
        },
        { status: 400 }
      )
    }

    // Validar tamanho
    const tamanhosMaximos = {
      pdf: 50 * 1024 * 1024, // 50MB em bytes (inclui PDFs e imagens)
      video: 100 * 1024 * 1024, // 100MB em bytes
      thumbnail: 5 * 1024 * 1024 // 5MB em bytes
    }

    const tamanhoMaximo = tamanhosMaximos[tipo as keyof typeof tamanhosMaximos]
    if (file.size > tamanhoMaximo) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Tamanho máximo: ${tamanhoMaximo / (1024 * 1024)}MB` },
        { status: 400 }
      )
    }

    // Determinar bucket
    const buckets = {
      pdf: 'wellness-cursos-pdfs',
      video: 'wellness-cursos-videos',
      thumbnail: 'wellness-cursos-thumbnails'
    }

    const bucket = buckets[tipo as keyof typeof buckets] as 'wellness-cursos-pdfs' | 'wellness-cursos-videos' | 'wellness-cursos-thumbnails'

    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    const extensaoArquivo = file.name.split('.').pop()?.toLowerCase() || 'file'
    const nomeBase = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const nomeArquivo = `${tipo}/${timestamp}-${random}-${nomeBase}.${extensaoArquivo}`

    // Converter File para ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Fazer upload
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(nomeArquivo, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Erro no upload:', uploadError)
      return NextResponse.json(
        { 
          error: `Erro ao fazer upload: ${uploadError.message}`,
          details: uploadError,
          bucket: bucket,
          fileName: nomeArquivo,
          fileType: file.type,
          fileSize: file.size
        },
        { status: 500 }
      )
    }

    // Obter URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(uploadData.path)

    return NextResponse.json({
      success: true,
      path: uploadData.path,
      url: urlData.publicUrl,
      nome: file.name,
      tamanho: file.size,
      tipo: file.type
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}

