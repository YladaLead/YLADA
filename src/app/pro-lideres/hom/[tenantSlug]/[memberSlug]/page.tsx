import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProLideresHOMClient from '@/components/pro-lideres/ProLideresHOMClient'
import { fetchHOMPublicData } from '@/lib/pro-lideres-hom'
import { PRO_LIDERES_HOM_DEFAULT_VIDEO_URL } from '@/lib/pro-lideres-reset-content'
import { parseOpportunityVideoUrl, type ParsedOpportunityVideo } from '@/lib/pro-lideres-opportunity-video'
import { buildProLideresVideoShareMetadata } from '@/lib/pro-lideres/pro-lideres-video-share-og'
import { resolveYladaOgBaseUrlForMetadata } from '@/lib/ylada-public-link-base-url'

type Params = { tenantSlug: string; memberSlug: string }

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { tenantSlug, memberSlug } = await params
  const data = await fetchHOMPublicData(tenantSlug, memberSlug)
  const base = await resolveYladaOgBaseUrlForMetadata()
  const canonical = `${base}/pro-lideres/hom/${encodeURIComponent(tenantSlug)}/${encodeURIComponent(memberSlug)}`
  if (!data) return { title: 'Apresentação | YLADA Pro Líderes' }

  const share = buildProLideresVideoShareMetadata(base, canonical, {
    title: 'Oportunidade Bebidas Funcionais',
    description: 'Conheça a oportunidade: renda extra com a multinacional Herbalife.',
    imagePath: '/images/pro-lideres/capa-hom-reset.jpg',
  })
  return {
    ...share,
    alternates: { canonical },
  }
}

export default async function ProLideresHOMPage({
  params,
}: {
  params: Promise<Params>
}) {
  const { tenantSlug, memberSlug } = await params
  const data = await fetchHOMPublicData(tenantSlug, memberSlug)
  if (!data) notFound()

  const raw = data.videoUrl?.trim() || PRO_LIDERES_HOM_DEFAULT_VIDEO_URL
  let parsedVideo: ParsedOpportunityVideo | null = null
  let videoUrlInvalid = false
  const p = parseOpportunityVideoUrl(raw)
  if (p.ok) {
    parsedVideo = p.value
  } else {
    videoUrlInvalid = true
  }

  return (
    <ProLideresHOMClient
      headline={data.headline}
      subheadline={data.subheadline}
      memberName={data.memberName}
      memberWhatsapp={data.memberWhatsapp}
      parsedVideo={parsedVideo}
      videoUrlInvalid={videoUrlInvalid}
    />
  )
}
