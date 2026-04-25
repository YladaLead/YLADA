import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ConsultoriaPublicFormClient from '@/components/consultoria/ConsultoriaPublicFormClient'
import {
  buildEsteticaConsultoriaResponderShareMetadata,
  resolveEsteticaConsultoriaResponderOgBand,
  responderOgBandLabel,
} from '@/lib/estetica-consultoria-responder-og'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>
}): Promise<Metadata> {
  const { token } = await params
  const safe = typeof token === 'string' ? decodeURIComponent(token).trim() : ''
  const band = safe ? await resolveEsteticaConsultoriaResponderOgBand(safe) : 'unknown'
  return buildEsteticaConsultoriaResponderShareMetadata(band)
}

export default async function EsteticaConsultoriaResponderPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const { token } = await params
  const safe = typeof token === 'string' ? token : ''
  const band = safe ? await resolveEsteticaConsultoriaResponderOgBand(safe) : 'unknown'
  const bandLine = responderOgBandLabel(band)
  const sp = searchParams ? await searchParams : {}
  const confirmRaw = sp?.confirm
  const initialConfirmCode =
    typeof confirmRaw === 'string' ? confirmRaw : Array.isArray(confirmRaw) ? confirmRaw[0] : null

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-slate-50 via-blue-50/40 to-white px-4 pt-[max(2.5rem,env(safe-area-inset-top,0px))] pb-[max(2.5rem,env(safe-area-inset-bottom,0px))]">
      <div className="mx-auto w-full max-w-lg sm:max-w-xl">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Link
            href="/pro-estetica"
            className="inline-flex min-h-[44px] min-w-[44px] touch-manipulation flex-col items-center justify-center gap-2 rounded-xl px-2 py-1"
          >
            <Image src={YLADA_OG_FALLBACK_LOGO_PATH} alt="YLADA" width={100} height={32} className="h-8 w-auto" />
            <span className="text-xs font-medium text-blue-900/55 tracking-wide">
              {bandLine} · Confidencial
            </span>
          </Link>
        </div>
        <div className="rounded-2xl border border-blue-100/80 bg-white p-4 shadow-sm shadow-blue-900/5 sm:p-6">
          <ConsultoriaPublicFormClient
            token={safe}
            area="estetica"
            initialConfirmCode={initialConfirmCode?.trim() || null}
          />
        </div>
      </div>
    </div>
  )
}
