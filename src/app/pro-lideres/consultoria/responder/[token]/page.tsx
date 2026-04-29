import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'
import {
  PRO_LIDERES_PRE_DIAGNOSTICO_CARD_IMAGE_PATH,
} from '@/lib/pro-lideres-pre-diagnostico'
import ProLideresConsultoriaFormResponderClient from '@/components/pro-lideres/ProLideresConsultoriaFormResponderClient'

function resolvePublicOrigin(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ||
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION?.replace(/\/$/, '') ||
    'https://www.ylada.com'
  )
}

/** Textos para pré-visualização do link (WhatsApp, redes, etc.) — curtos e coerentes com o material Pro Líderes. */
const OG_TITLE = 'Pré-diagnóstico estratégico para líderes · YLADA Pro Líderes'
const OG_DESCRIPTION = 'Convite confidencial: responda com calma. Leva poucos minutos.'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>
}): Promise<Metadata> {
  const { token } = await params
  const raw = typeof token === 'string' ? token : ''
  const base = resolvePublicOrigin()
  const pagePath = `/pro-lideres/consultoria/responder/${encodeURIComponent(raw)}`
  const pageUrl = `${base}${pagePath}`
  const imageUrl = `${base}${PRO_LIDERES_PRE_DIAGNOSTICO_CARD_IMAGE_PATH}`

  return {
    title: OG_TITLE,
    description: OG_DESCRIPTION,
    openGraph: {
      title: OG_TITLE,
      description: OG_DESCRIPTION,
      url: pageUrl,
      siteName: 'YLADA',
      locale: 'pt_BR',
      type: 'website',
      images: [{ url: imageUrl, alt: OG_TITLE, type: 'image/png' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: OG_TITLE,
      description: OG_DESCRIPTION,
      images: [imageUrl],
    },
  }
}

export default async function ProLideresConsultoriaResponderPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const safe = typeof token === 'string' ? token : ''

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 to-white px-4 py-10">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Link href="/pro-lideres" className="inline-flex flex-col items-center gap-2">
            <Image src={YLADA_OG_FALLBACK_LOGO_PATH} alt="YLADA" width={100} height={32} className="h-8 w-auto" />
            <span className="text-xs font-medium text-gray-500">Pro Líderes · Consultoria</span>
          </Link>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <ProLideresConsultoriaFormResponderClient token={safe} />
        </div>
      </div>
    </div>
  )
}
