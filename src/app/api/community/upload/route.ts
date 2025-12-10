import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/community/upload
 * Upload de imagens para posts da comunidade
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request)
    if (authResult instanceof NextResponse) return authResult
    
    const { user } = authResult
    
    // Verificar se é FormData
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Arquivo não fornecido' },
        { status: 400 }
      )
    }
    
    // Validar tipo de arquivo (apenas imagens)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Apenas imagens são permitidas (JPEG, PNG, GIF, WebP)' },
        { status: 400 }
      )
    }
    
    // Validar tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Imagem muito grande. Tamanho máximo: 5MB' },
        { status: 400 }
      )
    }
    
    // Gerar nome único para o arquivo
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const nomeBase = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-z0-9]/gi, '-')
      .toLowerCase()
      .slice(0, 50)
    const nomeArquivo = `community/${user.id}/${timestamp}-${random}-${nomeBase}.${fileExtension}`
    
    // Converter File para Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Bucket para imagens da comunidade
    const bucketName = 'community-images'
    
    // Fazer upload
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
      
      console.error('❌ Erro no upload:', uploadError)
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
      url: urlData.publicUrl,
      path: uploadData.path,
      nome: file.name,
      tamanho: file.size,
      tipo: file.type
    })
  } catch (error: any) {
    console.error('❌ Erro no POST /api/community/upload:', error)
    return NextResponse.json(
      { error: `Erro interno: ${error.message}` },
      { status: 500 }
    )
  }
}
