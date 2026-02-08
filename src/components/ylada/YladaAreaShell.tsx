'use client'

import { useState } from 'react'
import Link from 'next/link'
import YladaSidebar from './YladaSidebar'

interface YladaAreaShellProps {
  areaCodigo: string
  areaLabel: string
  children: React.ReactNode
}

export default function YladaAreaShell({ areaCodigo, areaLabel, children }: YladaAreaShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <YladaSidebar
        areaCodigo={areaCodigo}
        areaLabel={areaLabel}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center gap-3 h-14 px-4 bg-white border-b border-gray-200 lg:px-6">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            aria-label="Abrir menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/pt" className="text-sm text-gray-500 hover:text-gray-700">
            Voltar ao YLADA
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
