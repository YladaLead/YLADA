import { notFound } from 'next/navigation'
import PublicLinkView from '@/components/ylada/PublicLinkView'
import { fetchPublicLinkPayload } from './public-link-utils'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function pickPlM(sp: Record<string, string | string[] | undefined>): string | null {
  const v = sp.pl_m
  const s = Array.isArray(v) ? v[0] : v
  return typeof s === 'string' && s.trim() ? s.trim() : null
}

/**
 * Página pública do link inteligente. Busca por slug; 404 se inativo ou inexistente.
 * @see docs/PROGRAMACAO-SENSATA-PROXIMOS-PASSOS.md
 */
export default async function PublicLinkPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  if (!slug) notFound()

  const sp = searchParams ? await searchParams : {}
  const plM = pickPlM(sp)

  const payload = await fetchPublicLinkPayload(slug, plM ? { memberShareSegment: plM } : undefined)
  const shareTok = payload.proLideresAttributionToken ?? plM
  return <PublicLinkView payload={payload} shareAttributionToken={shareTok} />
}
