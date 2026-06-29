/**
 * POST /api/ylada/perfil/avatar — sobe a foto do profissional pra página /[perfil].
 * Guarda no bucket público `perfil-avatares` (criar uma vez no Supabase) e
 * devolve a URL pública; o cliente salva via PUT /api/wellness/profile.
 * @see blueprint-plataforma/Perfil_Nu_Porta3_Build.md
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { YLADA_API_ALLOWED_PROFILES } from '@/config/ylada-areas'

const AVATAR_BUCKET = 'perfil-avatares'
const MAX_BYTES = 5 * 1024 * 1024
const TIPOS_OK = ['image/jpeg', 'image/png', 'image/webp'] as const

function extensaoDoTipo(contentType: string): string {
  if (contentType === 'image/png') return 'png'
  if (contentType === 'image/webp') return 'webp'
  return 'jpg'
}

function validarImagem(file: File): string | null {
  if (!TIPOS_OK.includes(file.type as (typeof TIPOS_OK)[number])) {
    return `Formato inválido (${file.type || 'desconhecido'}). Use JPG, PNG ou WEBP.`
  }
  if (file.size > MAX_BYTES) {
    return `Imagem muito grande (${Math.round(file.size / 1024)} KB). Máximo 5 MB.`
  }
  return null
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, [...YLADA_API_ALLOWED_PROFILES])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const form = await request.formData()
    const file = form.get('file')
    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'Arquivo "file" é obrigatório' }, { status: 400 })
    }

    const erro = validarImagem(file)
    if (erro) return NextResponse.json({ success: false, error: erro }, { status: 400 })

    const path = `${user.id}/avatar-${Date.now()}.${extensaoDoTipo(file.type)}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { error: upErr } = await supabaseAdmin.storage
      .from(AVATAR_BUCKET)
      .upload(path, buffer, { contentType: file.type, cacheControl: '3600', upsert: true })

    if (upErr) {
      console.error('[ylada/perfil/avatar] upload', upErr)
      return NextResponse.json({ success: false, error: upErr.message }, { status: 500 })
    }

    const { data } = supabaseAdmin.storage.from(AVATAR_BUCKET).getPublicUrl(path)
    return NextResponse.json({ success: true, url: data.publicUrl })
  } catch (e) {
    console.error('[ylada/perfil/avatar] POST', e)
    return NextResponse.json({ success: false, error: 'Erro ao subir a foto' }, { status: 500 })
  }
}
