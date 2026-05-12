import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProLideresOpportunityLandingClient from '@/components/pro-lideres/ProLideresOpportunityLandingClient'
import { fetchProLideresOpportunityTenantBySlug } from '@/lib/pro-lideres-opportunity-public'
import { parseOpportunityVideoUrl, type ParsedOpportunityVideo } from '@/lib/pro-lideres-opportunity-video'
import { resolveYladaOgBaseUrlForMetadata } from '@/lib/ylada-public-link-base-url'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const row = await fetchProLideresOpportunityTenantBySlug(slug)
  if (!row) {
    return { title: 'Oportunidade | YLADA Pro Líderes' }
  }
  const name = (row.display_name ?? '').trim() || 'Pro Líderes'
  const base = await resolveYladaOgBaseUrlForMetadata()
  const pathSlug = encodeURIComponent(row.slug)
  return {
    title: `Oportunidade de negócio — ${name} | YLADA`,
    description: `Vídeo da oportunidade e contacto com ${name}.`,
    alternates: { canonical: `${base}/pro-lideres/o/${pathSlug}/oportunidade` },
  }
}

export default async function ProLideresOpportunityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const row = await fetchProLideresOpportunityTenantBySlug(slug)
  if (!row) notFound()

  const raw = typeof row.opportunity_video_url === 'string' ? row.opportunity_video_url.trim() : ''
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
    <ProLideresOpportunityLandingClient
      displayName={(row.display_name ?? '').trim()}
      whatsapp={typeof row.whatsapp === 'string' ? row.whatsapp.trim() : null}
      parsedVideo={parsedVideo}
      videoUrlInvalid={videoUrlInvalid}
    />
  )
}
