import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PublicLinkView from '@/components/ylada/PublicLinkView'
import NativeAppBackButton from '@/components/ylada/NativeAppBackButton'
import { fetchPublicLinkPayload } from '@/app/l/[slug]/public-link-utils'

function pickPlM(sp: Record<string, string | string[] | undefined>): string | null {
  const v = sp.pl_m
  const s = Array.isArray(v) ? v[0] : v
  return typeof s === 'string' && s.trim() ? s.trim() : null
}
import { supabaseAdmin } from '@/lib/supabase'
import { resolvePerfilFluxoToLinkSlug } from '@/lib/ylada-flow/resolve-perfil-fluxo'
import { normalizeSlug } from '@/lib/slug-utils'

type PageProps = {
  params: Promise<{ perfil: string; fluxo: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

/**
 * Camada fina `/[perfil]/[fluxo]` → mesmo renderer de `/l/[slug]` (URL bonita; canônico interno).
 */
export default async function PerfilFluxoPublicPage({ params, searchParams }: PageProps) {
  const { perfil, fluxo } = await params
  if (!perfil?.trim() || !fluxo?.trim()) notFound()

  if (!supabaseAdmin) notFound()

  const linkSlug = await resolvePerfilFluxoToLinkSlug(supabaseAdmin, perfil, fluxo)
  if (!linkSlug) notFound()

  const sp = searchParams ? await searchParams : {}
  const plM = pickPlM(sp)

  const payload = await fetchPublicLinkPayload(linkSlug, plM ? { memberShareSegment: plM } : undefined)
  const shareTok = payload.proLideresAttributionToken ?? plM

  return (
    <>
      <NativeAppBackButton />
      <PublicLinkView payload={payload} shareAttributionToken={shareTok} />
    </>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { perfil, fluxo } = await params
  if (!supabaseAdmin) return { title: 'YLADA' }

  const linkSlug = await resolvePerfilFluxoToLinkSlug(supabaseAdmin, perfil, fluxo)
  if (!linkSlug) return { title: 'Não encontrado | YLADA' }

  const { data: link } = await supabaseAdmin
    .from('ylada_links')
    .select('title, config_json')
    .eq('slug', linkSlug)
    .eq('status', 'active')
    .maybeSingle()

  const cfg = (link?.config_json as Record<string, unknown>) ?? {}
  const page = (cfg.page as Record<string, unknown>) ?? {}
  const title =
    (typeof page.title === 'string' && page.title) ||
    (typeof link?.title === 'string' && link.title) ||
    'YLADA'

  return {
    title: `${title} | YLADA`,
    alternates: {
      canonical: `/${normalizeSlug(perfil)}/${normalizeSlug(fluxo)}`,
    },
  }
}
