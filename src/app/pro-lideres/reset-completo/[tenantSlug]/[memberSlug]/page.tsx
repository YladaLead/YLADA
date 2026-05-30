import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProLideresResetPublicClient from '@/components/pro-lideres/ProLideresResetPublicClient'
import { fetchHOMPublicData } from '@/lib/pro-lideres-hom'
import { fetchResetPublicData } from '@/lib/pro-lideres-reset'
import { PRO_LIDERES_HOM_DEFAULT_VIDEO_URL, PRO_LIDERES_RESET_DEFAULT_VIDEO_URL } from '@/lib/pro-lideres-reset-content'
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
  const canonical = `${base}/pro-lideres/reset-completo/${encodeURIComponent(tenantSlug)}/${encodeURIComponent(memberSlug)}`
  if (!data) return { title: 'Reset Metabólico completo | YLADA Pro Líderes' }

  const share = buildProLideresResetShareMetadata(base, canonical, `${data.headline} — completo`)
  return {
    ...share,
    title: `${data.headline} — completo | YLADA Pro Líderes`,
    alternates: { canonical },
  }
}

function parseVideo(raw: string | null | undefined): ParsedOpportunityVideo | null {
  const trimmed = raw?.trim()
  if (!trimmed) return null
  const p = parseOpportunityVideoUrl(trimmed)
  return p.ok ? p.value : null
}

export default async function ProLideresResetCompletoPublicPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { tenantSlug, memberSlug } = await params
  const [resetData, homData] = await Promise.all([
    fetchResetPublicData(tenantSlug, memberSlug),
    fetchHOMPublicData(tenantSlug, memberSlug),
  ])
  if (!resetData || !homData) notFound()

  const parsedVideo =
    parseVideo(resetData.videoUrl) ?? parseVideo(PRO_LIDERES_RESET_DEFAULT_VIDEO_URL)
  const parsedHomVideo =
    parseVideo(homData.videoUrl) ?? parseVideo(PRO_LIDERES_HOM_DEFAULT_VIDEO_URL)

  return (
    <ProLideresResetPublicClient
      headline={resetData.headline}
      subheadline={resetData.subheadline}
      description={resetData.description}
      memberName={resetData.memberName}
      memberWhatsapp={resetData.memberWhatsapp}
      parsedVideo={parsedVideo}
      variant="completa"
      homHeadline={homData.headline}
      homSubheadline={homData.subheadline}
      parsedHomVideo={parsedHomVideo}
    />
  )
}
