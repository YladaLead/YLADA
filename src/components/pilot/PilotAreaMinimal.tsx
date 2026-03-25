'use client'

import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'

export interface PilotAreaMinimalProps {
  /** Ex.: Medicina, Nutrição */
  segmentBadge: string
  headline: string
  subline: string
  primaryHref: string
  primaryLabel?: string
  fullPageHref: string
  fullPageLabel?: string
  /** Prova social breve (ex.: "+3.000 profissionais já usam") */
  proofLine?: string
}

export default function PilotAreaMinimal({
  segmentBadge,
  headline,
  subline,
  primaryHref,
  primaryLabel = 'Entrar',
  fullPageHref,
  fullPageLabel = 'Ver página completa',
  proofLine,
}: PilotAreaMinimalProps) {
  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="shrink-0 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3">
          <Link
            href="/pt/segmentos"
            className="inline-flex touch-manipulation shrink-0 items-center"
            aria-label="YLADA início"
          >
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link
            href={primaryHref}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 py-2 shrink-0"
          >
            {primaryLabel}
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 pt-8 pb-10 sm:pt-10 flex flex-col">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">{segmentBadge}</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 leading-snug">
          {headline}
        </h1>
        <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">{subline}</p>

        {proofLine && (
          <p className="mt-6 text-xs text-gray-500 text-center">{proofLine}</p>
        )}
        <div className="mt-6 sm:mt-10 space-y-4">
          <Link
            href={primaryHref}
            className="flex w-full min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700 active:bg-blue-800 sm:min-h-[48px]"
          >
            {primaryLabel}
          </Link>
          <Link
            href={fullPageHref}
            className="block text-center text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            {fullPageLabel}
          </Link>
        </div>

        <p className="mt-auto pt-10 text-center">
          <Link href="/pt/segmentos" className="text-sm text-gray-500 hover:text-gray-800">
            ← Outros segmentos
          </Link>
        </p>
      </main>
    </div>
  )
}
