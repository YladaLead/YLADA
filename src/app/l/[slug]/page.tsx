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

  const config = (link.config_json as Record<string, unknown>) ?? {}
  const meta = config.meta as Record<string, unknown> | undefined
  const isFlowLink = !!(meta?.flow_id || meta?.architecture)

  let type: 'diagnostico' | 'calculator' = 'diagnostico'
  if (!isFlowLink) {
    const { data: template } = await supabaseAdmin
      .from('ylada_link_templates')
      .select('type')
      .eq('id', link.template_id)
      .maybeSingle()
    const t = template?.type
    if (!t || !['diagnostico', 'calculator'].includes(t)) notFound()
    type = t as 'diagnostico' | 'calculator'
  }

  const payload = {
    slug: link.slug,
    type,
    title: (config.page as Record<string, unknown>)?.title as string ?? (config.title as string) ?? link.title ?? 'Link',
    config,
    ctaWhatsapp: link.cta_whatsapp ?? null,
  }

  return <PublicLinkView payload={payload} />
}
