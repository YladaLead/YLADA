/**
 * GET /api/admin/ylada/links
 * Lista todos os links inteligentes (ylada_links) com dados do dono (quem emite o link).
 * Apenas admin.
 * Query: status?, perfil?, search?
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['admin'])
    if (auth instanceof NextResponse) return auth

    if (!supabaseAdmin) {
      return NextResponse.json({ success: false, error: 'Backend não configurado' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const statusFilter = searchParams.get('status') || '' // active | paused | archived | ''
    const perfilFilter = searchParams.get('perfil') || '' // wellness | nutri | coach | nutra | ''
    const search = (searchParams.get('search') || '').trim()

    let query = supabaseAdmin
      .from('ylada_links')
      .select('id, user_id, slug, title, template_id, status, cta_whatsapp, created_at, updated_at')
      .order('created_at', { ascending: false })

    if (statusFilter && ['active', 'paused', 'archived'].includes(statusFilter)) {
      query = query.eq('status', statusFilter)
    }

    const { data: links, error: linksError } = await query

    if (linksError) {
      console.error('[admin/ylada/links]', linksError)
      return NextResponse.json({ success: false, error: linksError.message }, { status: 500 })
    }

    const list = links ?? []
    if (list.length === 0) {
      return NextResponse.json({ success: true, data: [], profiles: {} })
    }

    const userIds = [...new Set(list.map((l) => l.user_id).filter(Boolean))]
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, nome_completo, email, perfil')
      .in('user_id', userIds)

    if (profilesError) {
      console.error('[admin/ylada/links] profiles', profilesError)
    }

    const profilesMap: Record<string, { nome_completo: string; email: string; perfil: string }> = {}
    for (const p of profiles ?? []) {
      profilesMap[p.user_id] = {
        nome_completo: p.nome_completo ?? '',
        email: p.email ?? '',
        perfil: p.perfil ?? '',
      }
    }

    const templateIds = [...new Set(list.map((l) => l.template_id).filter(Boolean))]
    let templatesMap: Record<string, string> = {}
    if (templateIds.length > 0) {
      const { data: templates } = await supabaseAdmin
        .from('ylada_link_templates')
        .select('id, name')
        .in('id', templateIds)
      for (const t of templates ?? []) {
        templatesMap[t.id] = t.name ?? ''
      }
    }

    let filtered = list
    if (perfilFilter) {
      filtered = filtered.filter((l) => (profilesMap[l.user_id]?.perfil ?? '') === perfilFilter)
    }
    if (search) {
      const s = search.toLowerCase()
      filtered = filtered.filter((l) => {
        const owner = profilesMap[l.user_id]
        const nome = (owner?.nome_completo ?? '').toLowerCase()
        const email = (owner?.email ?? '').toLowerCase()
        const slug = (l.slug ?? '').toLowerCase()
        const title = (l.title ?? '').toLowerCase()
        return nome.includes(s) || email.includes(s) || slug.includes(s) || title.includes(s)
      })
    }

    const host = request.headers.get('host') || ''
    const protocol = request.headers.get('x-forwarded-proto') || 'http'
    const baseUrl = host ? `${protocol}://${host}` : ''

    const data = filtered.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      slug: row.slug,
      title: row.title,
      template_id: row.template_id,
      template_name: row.template_id ? templatesMap[row.template_id] ?? null : null,
      status: row.status,
      cta_whatsapp: row.cta_whatsapp,
      created_at: row.created_at,
      updated_at: row.updated_at,
      url: baseUrl ? `${baseUrl}/l/${row.slug}` : `/l/${row.slug}`,
      owner: row.user_id
        ? {
            nome_completo: profilesMap[row.user_id]?.nome_completo ?? '—',
            email: profilesMap[row.user_id]?.email ?? '—',
            perfil: profilesMap[row.user_id]?.perfil ?? '—',
          }
        : null,
    }))

    return NextResponse.json({ success: true, data })
  } catch (e) {
    console.error('[admin/ylada/links]', e)
    return NextResponse.json({ success: false, error: 'Erro ao listar links' }, { status: 500 })
  }
}
