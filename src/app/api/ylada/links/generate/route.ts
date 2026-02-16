/**
 * POST /api/ylada/links/generate — gera uma instância de link a partir de um template.
 * Body: { template_id, segment?, category?, sub_category?, title?, cta_whatsapp? }
 * Retorna: { success, data: { id, slug, url, title, ... } }
 * @see docs/PROGRAMACAO-ESTRUTURAL-YLADA.md (Etapa 1.4)
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { randomBytes } from 'crypto'

function generateSlug(): string {
  return randomBytes(6).toString('base64url').toLowerCase().replace(/[^a-z0-9]/g, '') || 'link'
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['ylada', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'nutri', 'wellness', 'admin'])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const body = await request.json().catch(() => ({}))
    const templateId = typeof body.template_id === 'string' ? body.template_id.trim() : ''
    if (!templateId) {
      return NextResponse.json({ success: false, error: 'template_id é obrigatório' }, { status: 400 })
    }

    const segment = typeof body.segment === 'string' ? body.segment.trim() || null : null
    const category = typeof body.category === 'string' ? body.category.trim() || null : null
    const subCategory = typeof body.sub_category === 'string' ? body.sub_category.trim() || null : null
    const title = typeof body.title === 'string' ? body.title.trim() || null : null
    const ctaWhatsapp = typeof body.cta_whatsapp === 'string' ? body.cta_whatsapp.trim() || null : null

    const { data: template, error: templateError } = await supabaseAdmin
      .from('ylada_link_templates')
      .select('id, name, type, schema_json')
      .eq('id', templateId)
      .eq('active', true)
      .single()

    if (templateError || !template) {
      return NextResponse.json({ success: false, error: 'Template não encontrado ou inativo' }, { status: 404 })
    }

    const schema = (template.schema_json as Record<string, unknown>) || {}
    const configJson: Record<string, unknown> = {
      title: title ?? schema.title ?? template.name,
      ctaText: ctaWhatsapp ?? schema.ctaDefault ?? 'Falar no WhatsApp',
      ...schema,
    }

    let slug = generateSlug()
    const maxRetries = 5
    for (let i = 0; i < maxRetries; i++) {
      const { data: existing } = await supabaseAdmin.from('ylada_links').select('id').eq('slug', slug).maybeSingle()
      if (!existing) break
      slug = generateSlug()
    }

    const { data: link, error: insertError } = await supabaseAdmin
      .from('ylada_links')
      .insert({
        user_id: user.id,
        template_id: template.id,
        segment,
        category,
        sub_category: subCategory,
        slug,
        title: configJson.title as string,
        config_json: configJson,
        cta_whatsapp: ctaWhatsapp,
        status: 'active',
      })
      .select('id, slug, title, config_json, cta_whatsapp, status, created_at')
      .single()

    if (insertError) {
      console.error('[ylada/links/generate]', insertError)
      return NextResponse.json({ success: false, error: insertError.message }, { status: 500 })
    }

    const host = request.headers.get('host') || ''
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const baseUrl = host ? `${protocol}://${host}` : ''
    const url = baseUrl ? `${baseUrl}/l/${link.slug}` : `/l/${link.slug}`

    return NextResponse.json({
      success: true,
      data: {
        ...link,
        url,
      },
    })
  } catch (e) {
    console.error('[ylada/links/generate]', e)
    return NextResponse.json({ success: false, error: 'Erro ao gerar link' }, { status: 500 })
  }
}
