import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import PublicLinkView from '@/components/ylada/PublicLinkView'

export const dynamic = 'force-dynamic'

type PageProps = { params: Promise<{ slug: string }> }

/**
 * Página pública do link inteligente. Busca por slug; 404 se inativo ou inexistente.
 * @see docs/PROGRAMACAO-SENSATA-PROXIMOS-PASSOS.md
 */
export default async function PublicLinkPage({ params }: PageProps) {
  const { slug } = await params
  if (!slug) notFound()

  if (!supabaseAdmin) {
    console.error('[l/[slug]] Supabase admin não disponível')
    notFound()
  }

  const { data: link, error } = await supabaseAdmin
    .from('ylada_links')
    .select('id, slug, title, config_json, cta_whatsapp, status, template_id')
    .eq('slug', slug)
    .eq('status', 'active')
    .maybeSingle()

  if (error || !link) notFound()

  const templateId = link.template_id
  const { data: template } = await supabaseAdmin
    .from('ylada_link_templates')
    .select('type')
    .eq('id', templateId)
    .maybeSingle()

  const type = template?.type
  if (!type || !['diagnostico', 'calculator'].includes(type)) notFound()

  const payload = {
    slug: link.slug,
    type,
    title: (link.config_json as Record<string, unknown>)?.title ?? link.title ?? 'Link',
    config: (link.config_json as Record<string, unknown>) ?? {},
    ctaWhatsapp: link.cta_whatsapp ?? null,
  }

  return <PublicLinkView payload={payload} />
}
