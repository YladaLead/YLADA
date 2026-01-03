import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireApiAuth } from '@/lib/api-auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * API Route para salvar imagem/vídeo no banco próprio (media_library)
 * Quando usuário baixa do Envato e usa no vídeo, salva automaticamente
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { 
      url, // URL da imagem/vídeo (de Pexels, Unsplash, etc)
      thumbnail,
      source, // 'pexels', 'unsplash', 'envato', etc
      sourceId, // ID original na fonte
      type, // 'image' | 'video' | 'audio'
      area, // 'nutri' | 'coach' | 'wellness' | 'nutra'
      purpose, // 'hook' | 'dor' | 'solucao' | 'cta'
      title,
      tags, // Array de tags
    } = body

    if (!url || !type) {
      return NextResponse.json(
        { error: 'URL e tipo são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se já existe (evitar duplicatas)
    const { data: existing } = await supabase
      .from('media_library')
      .select('id')
      .eq('file_url', url)
      .eq('source', source)
      .maybeSingle()

    if (existing) {
      // Já existe, retornar o existente
      return NextResponse.json({
        id: existing.id,
        message: 'Já existe no banco',
        existing: true,
      })
    }

    // Extrair nome do arquivo da URL
    const urlParts = url.split('/')
    const fileName = urlParts[urlParts.length - 1].split('?')[0] || `media-${Date.now()}.${type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'mp3'}`

    // Baixar a imagem/vídeo da URL externa
    let fileBuffer: Buffer
    let mimeType: string
    let fileSize: number

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Erro ao baixar: ${response.statusText}`)
      }

      fileBuffer = Buffer.from(await response.arrayBuffer())
      mimeType = response.headers.get('content-type') || (type === 'image' ? 'image/jpeg' : type === 'video' ? 'video/mp4' : 'audio/mpeg')
      fileSize = fileBuffer.length
    } catch (error: any) {
      console.error('Erro ao baixar arquivo:', error)
      return NextResponse.json(
        { error: 'Erro ao baixar arquivo da URL', details: error.message },
        { status: 500 }
      )
    }

    // Criar caminho no storage
    const storagePath = `media-library/${area || 'all'}/${type}/${fileName}`

    // Upload para Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('media-library')
      .upload(storagePath, fileBuffer, {
        contentType: mimeType,
        upsert: true,
      })

    if (uploadError) {
      console.error('Erro ao fazer upload:', uploadError)
      return NextResponse.json(
        { error: 'Erro ao fazer upload para storage', details: uploadError.message },
        { status: 500 }
      )
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from('media-library')
      .getPublicUrl(storagePath)

    const publicUrl = urlData.publicUrl

    // Inserir na tabela media_library
    const { data: dbData, error: dbError } = await supabase
      .from('media_library')
      .insert({
        file_name: fileName,
        file_path: storagePath,
        file_url: publicUrl,
        file_size: fileSize,
        mime_type: mimeType,
        media_type: type,
        area: area || 'all',
        purpose: purpose || 'all',
        tags: tags || [],
        title: title || fileName.replace(/\.[^/.]+$/, ''),
        relevance_score: 60, // Score médio para itens salvos manualmente
        source: source || 'external',
        source_id: sourceId,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Erro ao inserir no banco:', dbError)
      return NextResponse.json(
        { error: 'Erro ao salvar no banco', details: dbError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      id: dbData.id,
      url: publicUrl,
      message: 'Salvo no banco próprio com sucesso',
      existing: false,
    })
  } catch (error: any) {
    console.error('Erro ao salvar no banco:', error)
    return NextResponse.json(
      { error: 'Erro ao processar', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}


