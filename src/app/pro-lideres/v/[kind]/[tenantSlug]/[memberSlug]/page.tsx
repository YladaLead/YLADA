import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProLideresVideoSharePublicClient from '@/components/pro-lideres/ProLideresVideoSharePublicClient'
import {
  fetchVideoSharePublicData,
  getVideoShareDescriptor,
  isVideoShareKind,
} from '@/lib/pro-lideres-video-share'
import { buildProLideresVideoShareMetadata } from '@/lib/pro-lideres/pro-lideres-video-share-og'
import { parseOpportunityVideoUrl, type ParsedOpportunityVideo } from '@/lib/pro-lideres-opportunity-video'
import { resolveYladaOgBaseUrlForMetadata } from '@/lib/ylada-public-link-base-url'

type Params = { kind: string; tenantSlug: string; memberSlug: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { kind, tenantSlug, memberSlug } = await params
  if (!isVideoShareKind(kind)) return { title: 'YLADA Pro Líderes' }

  const d = getVideoShareDescriptor(kind)
  const data = await fetchVideoSharePublicData(kind, tenantSlug, memberSlug)
  const base = await resolveYladaOgBaseUrlForMetadata()
  const canonical = `${base}/pro-lideres/v/${kind}/${encodeURIComponent(tenantSlug)}/${encodeURIComponent(memberSlug)}`
  if (!data) return { title: `${d.pageTitle} | YLADA Pro Líderes` }

  const share = buildProLideresVideoShareMetadata(base, canonical, {
    title: d.ogTitle,
    description: d.ogDescription,
    imagePath: d.ogImage,
  })
  return {
    ...share,
    alternates: { canonical },
  }
}

export default async function ProLideresVideoSharePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { kind, tenantSlug, memberSlug } = await params
  if (!isVideoShareKind(kind)) notFound()

  const d = getVideoShareDescriptor(kind)
  const data = await fetchVideoSharePublicData(kind, tenantSlug, memberSlug)
  if (!data) notFound()

  const raw = data.videoUrl?.trim() || d.defaultVideoUrl
  let parsedVideo: ParsedOpportunityVideo | null = null
  const p = parseOpportunityVideoUrl(raw)
  if (p.ok) parsedVideo = p.value

  return (
    <ProLideresVideoSharePublicClient
      headline={data.headline}
      subheadline={data.subheadline}
      memberName={data.memberName}
      memberWhatsapp={data.memberWhatsapp}
      parsedVideo={parsedVideo}
      poster={d.poster}
      videoTitle={d.pageTitle}
      ctaPrimaryLabel={d.ctaPrimaryLabel}
      ctaPrimaryMessage={d.ctaPrimaryMessage}
      ctaSecondaryLabel={d.ctaSecondaryLabel}
      ctaSecondaryMessage={d.ctaSecondaryMessage}
    />
  )
}
