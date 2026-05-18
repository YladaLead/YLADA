import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProLideresHOMClient from '@/components/pro-lideres/ProLideresHOMClient'
import { fetchHOMPublicData } from '@/lib/pro-lideres-hom'
import { parseOpportunityVideoUrl, type ParsedOpportunityVideo } from '@/lib/pro-lideres-opportunity-video'
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
  if (!data) return { title: 'Apresentação | YLADA Pro Líderes' }
  const memberLabel = data.memberName?.trim() || 'Distribuidor'
  return {
    title: `${data.headline} | YLADA`,
    description: `Assista à apresentação de ${memberLabel} e dê o próximo passo.`,
    alternates: {
      canonical: `${base}/pro-lideres/hom/${encodeURIComponent(tenantSlug)}/${encodeURIComponent(memberSlug)}`,
    },
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

  const raw = data.videoUrl?.trim() ?? ''
  let parsedVideo: ParsedOpportunityVideo | null = null
  let videoUrlInvalid = false
  if (raw) {
    const p = parseOpportunityVideoUrl(raw)
    if (p.ok) {
      parsedVideo = p.value
    } else {
      videoUrlInvalid = true
    }
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
