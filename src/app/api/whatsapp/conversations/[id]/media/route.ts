/**
 * Enviar mídia/anexo em uma conversa (admin)
 * POST /api/whatsapp/conversations/[id]/media
 *
 * Body: multipart/form-data
 * - file: File
 * - caption?: string
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createZApiClient } from '@/lib/z-api'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function getFileExtension(name: string) {
  const parts = name.split('.')
  if (parts.length < 2) return ''
  return (parts.pop() || '').toLowerCase()
}

function detectType(file: File): 'image' | 'video' | 'audio' | 'document' {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  if (file.type.startsWith('audio/')) return 'audio'
  return 'document'
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Autenticação
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    const roleAdmin = user.user_metadata?.role === 'admin'
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    const isAdmin = roleAdmin || profile?.is_admin === true
    if (!isAdmin) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    const conversationId = params.id

    const form = await request.formData()
    const file = form.get('file') as File | null
    const caption = (form.get('caption') as string | null) || ''

    if (!file) {
      return NextResponse.json({ error: 'Arquivo não fornecido' }, { status: 400 })
    }

    // Buscar conversa
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('*')
      .eq('id', conversationId)
      .single()

    if (convError || !conversation) {
      return NextResponse.json({ error: 'Conversa não encontrada' }, { status: 404 })
    }

    // Buscar instância Z-API
    const { data: instance, error: instanceError } = await supabaseAdmin
      .from('z_api_instances')
      .select('instance_id, token')
      .eq('id', conversation.instance_id)
      .single()

    if (instanceError || !instance) {
      return NextResponse.json({ error: 'Instância Z-API não encontrada' }, { status: 404 })
    }

    // Upload para Storage (reutiliza bucket já existente)
    const tipo = detectType(file)
    const ext = getFileExtension(file.name) || (tipo === 'image' ? 'jpg' : tipo === 'video' ? 'mp4' : tipo === 'audio' ? 'mp3' : 'pdf')
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 9)
    const path = `whatsapp/${conversationId}/${timestamp}-${random}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('community-images')
      .upload(path, buffer, { contentType: file.type, upsert: false })

    if (uploadError) {
      console.error('[WhatsApp Media] Erro upload:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: urlData } = supabaseAdmin.storage.from('community-images').getPublicUrl(uploadData.path)
    const url = urlData.publicUrl

    // Enviar via Z-API
    const client = createZApiClient(instance.instance_id, instance.token)
    let result: { success: boolean; id?: string; error?: string } = { success: false }

    if (tipo === 'image') {
      result = await client.sendImageMessage({ phone: conversation.phone, image: url, caption: caption || undefined })
    } else if (tipo === 'video') {
      result = await client.sendVideoMessage({ phone: conversation.phone, video: url, caption: caption || undefined })
    } else if (tipo === 'audio') {
      result = await client.sendAudioMessage({ phone: conversation.phone, audio: url })
    } else {
      result = await client.sendDocumentMessage({
        phone: conversation.phone,
        document: url,
        extension: ext,
        fileName: file.name,
      })
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Erro ao enviar mídia' }, { status: 500 })
    }

    // Salvar mensagem no banco
    const messageText =
      caption?.trim() ||
      (tipo === 'image' ? '📷 Foto' : tipo === 'video' ? '🎥 Vídeo' : tipo === 'audio' ? '🎤 Áudio' : '📎 Documento')

    const { data: savedMessage, error: msgError } = await supabaseAdmin
      .from('whatsapp_messages')
      .insert({
        conversation_id: conversationId,
        instance_id: conversation.instance_id,
        z_api_message_id: result.id || null,
        sender_type: 'agent',
        sender_id: user.id,
        sender_name: user.user_metadata?.name || user.email || 'Admin',
        message: messageText,
        message_type: tipo,
        media_url: url,
        status: 'sent',
        is_bot_response: false,
      })
      .select()
      .single()

    if (msgError) {
      console.error('[WhatsApp Media] Erro ao salvar mensagem:', msgError)
      // Não falhar o envio se salvamento falhar
    }

    return NextResponse.json({ success: true, message: savedMessage })
  } catch (error: any) {
    console.error('[WhatsApp Media] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao enviar mídia' },
      { status: 500 }
    )
  }
}

