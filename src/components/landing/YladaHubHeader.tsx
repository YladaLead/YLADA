'use client'

import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'

interface YladaHubHeaderProps {
  ctaLabel?: string
  ctaHref?: string
  showLanguageSelector?: boolean
}

export default function YladaHubHeader({ ctaLabel = 'Começar', ctaHref = '/pt', showLanguageSelector = true }: YladaHubHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/pt" className="shrink-0">
          <YLADALogo size="md" responsive className="bg-transparent" />
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden sm:inline">
              Filosofia
            </Link>
            <Link href="/pt/sobre" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden sm:inline">
              Sobre
            </Link>
            <Link
              href={ctaHref}
              className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all shrink-0"
            >
              {ctaLabel}
            </Link>
          </nav>
          {showLanguageSelector && <LanguageSelector />}
        </div>
      </div>
    </header>
  )
}
