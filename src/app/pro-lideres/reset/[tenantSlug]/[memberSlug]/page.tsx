import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProLideresResetPublicClient from '@/components/pro-lideres/ProLideresResetPublicClient'
import { fetchResetPublicData } from '@/lib/pro-lideres-reset'
import { PRO_LIDERES_RESET_DEFAULT_VIDEO_URL } from '@/lib/pro-lideres-reset-content'
import { buildProLideresResetShareMetadata } from '@/lib/pro-lideres/pro-lideres-reset-og'
import { parseOpportunityVideoUrl, type ParsedOpportunityVideo } from '@/lib/pro-lideres-opportunity-video'
import { resolveYladaOgBaseUrlForMetadata } from '@/lib/ylada-public-link-base-url'

type Params = { tenantSlug: string; memberSlug: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { tenantSlug, memberSlug } = await params
  const data = await fetchResetPublicData(tenantSlug, memberSlug)
  const base = await resolveYladaOgBaseUrlForMetadata()
  const canonical = `${base}/pro-lideres/reset/${encodeURIComponent(tenantSlug)}/${encodeURIComponent(memberSlug)}`
  if (!data) return { title: 'Reset Metabólico | YLADA Pro Líderes' }

  const share = buildProLideresResetShareMetadata(base, canonical, data.headline)
  return {
    ...share,
    alternates: { canonical },
  }
}

export default async function ProLideresResetPublicPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { tenantSlug, memberSlug } = await params
  const data = await fetchResetPublicData(tenantSlug, memberSlug)
  if (!data) notFound()

  const raw = data.videoUrl?.trim() || PRO_LIDERES_RESET_DEFAULT_VIDEO_URL
  let parsedVideo: ParsedOpportunityVideo | null = null
  const p = parseOpportunityVideoUrl(raw)
  if (p.ok) parsedVideo = p.value

  return (
    <ProLideresResetPublicClient
      headline={data.headline}
      subheadline={data.subheadline}
      description={data.description}
      memberName={data.memberName}
      memberWhatsapp={data.memberWhatsapp}
      parsedVideo={parsedVideo}
    />
  )
}
