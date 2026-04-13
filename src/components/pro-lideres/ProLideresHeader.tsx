'use client'

import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'

export function ProLideresHeader() {
  return (
    <header className="shrink-0 border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3">
        <Link href="/pt" className="inline-flex shrink-0 touch-manipulation items-center" aria-label="YLADA início">
          <YLADALogo size="md" responsive className="bg-transparent" />
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <span className="hidden text-sm text-gray-400 sm:inline">Pro Líderes</span>
          <Link
            href="/pro-lideres/acompanhar"
            className="hidden rounded-lg px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 md:inline md:px-3"
          >
            Acompanhar
          </Link>
          <Link
            href="/pro-lideres/acompanhar"
            className="rounded-lg px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 md:hidden"
            aria-label="Acompanhar estado do produto"
          >
            📋
          </Link>
          <Link
            href="/pro-lideres/painel"
            className="rounded-lg px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 sm:px-3"
          >
            Painel
          </Link>
          <Link
            href="/pro-lideres/entrar"
            className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Entrar
          </Link>
        </div>
      </div>
    </header>
  )
}
