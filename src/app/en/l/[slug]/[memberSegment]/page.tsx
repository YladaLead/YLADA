import { notFound } from 'next/navigation'
import PublicLinkView from '@/components/ylada/PublicLinkView'
import { fetchPublicLinkPayload } from '@/app/l/[slug]/public-link-utils'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ slug: string; memberSegment: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function pickPlM(sp: Record<string, string | string[] | undefined>): string | null {
  const v = sp.pl_m
  const s = Array.isArray(v) ? v[0] : v
  return typeof s === 'string' && s.trim() ? s.trim() : null
}

export default async function PublicLinkMemberSegmentPageEn({ params, searchParams }: PageProps) {
  const { slug, memberSegment } = await params
  if (!slug || !memberSegment?.trim()) notFound()

  const sp = searchParams ? await searchParams : {}
  const plMFromQuery = pickPlM(sp)

  const payload = await fetchPublicLinkPayload(slug, { memberShareSegment: memberSegment })
  const shareToken = plMFromQuery ?? payload.proLideresAttributionToken ?? null

  return <PublicLinkView payload={payload} locale="en" shareAttributionToken={shareToken} />
}
