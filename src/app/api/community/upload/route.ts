import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/community/upload
 * Upload de imagem/vídeo para mensagem
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { user } = authResult
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não fornecido' },
        { status: 400 }
      )
    }
    
    // Validar tipo
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    const isAudio = file.type.startsWith('audio/')
    
    if (!isImage && !isVideo && !isAudio) {
      return NextResponse.json(
        { error: 'Apenas imagens, vídeos e áudios são permitidos' },
        { status: 400 }
      )
    }
    
    // Validar tamanho (10MB para vídeo, 5MB para imagem, 5MB para áudio)
    const maxSize = isVideo ? 10 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Máximo: ${isVideo ? '10MB' : '5MB'}` },
        { status: 400 }
      )
    }
    
    // Gerar nome único
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    const extensao = file.name.split('.').pop()?.toLowerCase() || 'file'
    const nomeArquivo = `community/${user.id}/${timestamp}-${random}.${extensao}`
    
    // Converter para Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('community-images')
      .upload(nomeArquivo, buffer, {
        contentType: file.type,
        upsert: false
      })
    
    if (uploadError) {
      console.error('❌ Erro no upload:', uploadError)
      return NextResponse.json(
        { 
          error: 'Erro ao fazer upload',
          details: uploadError.message
        },
        { status: 500 }
      )
    }
    
    // Obter URL pública
    const { data: urlData } = supabaseAdmin.storage
      .from('community-images')
      .getPublicUrl(uploadData.path)
    
    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      tipo: isVideo ? 'video' : isAudio ? 'audio' : 'imagem'
    })
  } catch (error: any) {
    console.error('❌ Erro no POST /api/community/upload:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao processar upload',
        details: error.message
      },
      { status: 500 }
    )
  }
}
