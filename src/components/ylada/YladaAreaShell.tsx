'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import YladaSidebar from './YladaSidebar'
import { useAuth } from '@/hooks/useAuth'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

const YLADA_LOGO = YLADA_OG_FALLBACK_LOGO_PATH

interface YladaAreaShellProps {
  areaCodigo: string
  areaLabel: string
  children: React.ReactNode
}

export default function YladaAreaShell({ areaCodigo, areaLabel, children }: YladaAreaShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, userProfile } = useAuth()
  const userName = userProfile?.nome_completo || user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário'

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <YladaSidebar
        areaCodigo={areaCodigo}
        areaLabel={areaLabel}
        isMobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 h-14 px-4 bg-white border-b border-gray-200 lg:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 shrink-0"
              aria-label="Abrir menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href={areaCodigo === 'ylada' ? '/pt' : `/pt/${areaCodigo}/home`} className="flex items-center gap-2 min-w-0">
              <Image
                src={YLADA_LOGO}
                alt="YLADA"
                width={90}
                height={28}
                className="h-7 w-auto object-contain"
                priority
              />
              {areaLabel !== 'YLADA' && (
                <span className="text-gray-500 text-sm font-medium hidden sm:inline">· {areaLabel}</span>
              )}
            </Link>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/pt/perfil-empresarial" className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                {userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
              </div>
              <span className="text-sm font-medium truncate max-w-[120px]">{userName.split(' ')[0]}</span>
            </Link>
            <Link href="/pt" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700">
              Voltar ao YLADA
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
