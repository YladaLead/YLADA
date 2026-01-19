import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

type ItemType = 'protocolo' | 'referencia' | 'bloco'

function parseTags(tagsRaw: string | null): string[] {
  if (!tagsRaw) return []
  return tagsRaw
    .split(',')
    .map(t => t.trim())
    .filter(Boolean)
    .slice(0, 25)
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) return authResult
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const url = new URL(request.url)
    const itemType = (url.searchParams.get('item_type') || 'protocolo') as ItemType

    const { data, error } = await supabaseAdmin
      .from('coach_protocol_library')
      .select('*')
      .eq('user_id', user.id)
      .eq('item_type', itemType)
      .is('deleted_at', null)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Erro ao listar biblioteca de protocolos:', error)
      return NextResponse.json(
        { error: 'Erro ao listar biblioteca', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: { items: data || [] } })
  } catch (error: any) {
    console.error('Erro ao listar biblioteca de protocolos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) return authResult
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = (formData.get('title') as string) || ''
    const description = (formData.get('description') as string) || null
    const itemTypeRaw = (formData.get('item_type') as string) || 'protocolo'
    const tagsRaw = (formData.get('tags') as string) || ''

    const item_type: ItemType =
      itemTypeRaw === 'referencia' || itemTypeRaw === 'bloco' || itemTypeRaw === 'protocolo'
        ? (itemTypeRaw as ItemType)
        : 'protocolo'

    if (!file) {
      return NextResponse.json({ error: 'Arquivo é obrigatório' }, { status: 400 })
    }

    // Tipos aceitos para biblioteca (PDF, imagens, vídeos e texto)
    const isPdf = file.type === 'application/pdf'
    const isImage = file.type?.startsWith('image/')
    const isVideo = file.type?.startsWith('video/')
    const isText = file.type === 'text/plain' || file.type === 'text/markdown'

    if (!isPdf && !isImage && !isVideo && !isText) {
      return NextResponse.json(
        { error: 'Tipo de arquivo não permitido. Use PDF, imagem, vídeo ou texto.' },
        { status: 400 }
      )
    }

    // Limite de tamanho (25MB)
    const maxSize = 25 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Arquivo muito grande. Tamanho máximo: 25MB.' }, { status: 400 })
    }

    const fileExtension = file.name.split('.').pop()?.toLowerCase() || ''
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const safeExt = fileExtension || (isPdf ? 'pdf' : isImage ? 'png' : isVideo ? 'mp4' : 'txt')

    const fileName = `${timestamp}-${randomString}.${safeExt}`
    const storagePath = `coach/protocol-library/${user.id}/${fileName}`

    const fileBuffer = await file.arrayBuffer()
    const { error: uploadError } = await supabaseAdmin.storage
      .from('coach-documents')
      .upload(storagePath, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (uploadError) {
      console.error('Erro ao fazer upload (biblioteca):', uploadError)
      return NextResponse.json(
        { error: 'Erro ao fazer upload do arquivo', technical: process.env.NODE_ENV === 'development' ? uploadError.message : undefined },
        { status: 500 }
      )
    }

    const { data: urlData } = supabaseAdmin.storage.from('coach-documents').getPublicUrl(storagePath)
    const publicUrl = urlData.publicUrl

    const finalTitle = title.trim() || file.name
    const tags = parseTags(tagsRaw)

    const { data: item, error: dbError } = await supabaseAdmin
      .from('coach_protocol_library')
      .insert({
        user_id: user.id,
        item_type,
        title: finalTitle,
        description,
        tags,
        file_url: publicUrl,
        file_path: storagePath,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        file_extension: safeExt,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Erro ao salvar item da biblioteca:', dbError)
      await supabaseAdmin.storage.from('coach-documents').remove([storagePath])
      return NextResponse.json(
        { error: 'Erro ao salvar item', technical: process.env.NODE_ENV === 'development' ? dbError.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: { item } }, { status: 201 })
  } catch (error: any) {
    console.error('Erro ao fazer upload (biblioteca):', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

