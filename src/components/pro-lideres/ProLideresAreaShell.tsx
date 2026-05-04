'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import ProLideresSidebar from './ProLideresSidebar'
import { ProLideresPainelProvider, type ProLideresPainelContextValue } from './pro-lideres-painel-context'
import { useAuth } from '@/hooks/useAuth'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'
import { PRO_LIDERES_MEMBER_BASE_PATH } from '@/config/pro-lideres-menu'

const YLADA_LOGO = YLADA_OG_FALLBACK_LOGO_PATH

export default function ProLideresAreaShell({
  children,
  painelContext,
}: {
  children: React.ReactNode
  painelContext: ProLideresPainelContextValue
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, userProfile } = useAuth()
  const userName =
    userProfile?.nome_completo ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Líder'
  const initials =
    userName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'L'

  const { isLeaderWorkspace, operationLabel, devStubPanel, teamViewPreview, painelBasePath } = painelContext
  const base = painelBasePath.replace(/\/$/, '')
  const memberBase = PRO_LIDERES_MEMBER_BASE_PATH.replace(/\/$/, '')
  const isMemberAreaShell = base === memberBase

  return (
    <ProLideresPainelProvider value={painelContext}>
      <div className="flex min-h-screen min-h-[100dvh] bg-gray-50">
        <ProLideresSidebar isMobileOpen={mobileMenuOpen} onMobileClose={() => setMobileMenuOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col">
        {devStubPanel && (
          <div
            className="border-b border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-950 sm:px-4"
            role="status"
          >
            Modo desenvolvimento: painel sem tenant na base de dados. Convites, fluxos e dados reais não aplicam até
            criares o tenant ou desligares o bypass com <code className="rounded bg-amber-100/80 px-1">PRO_LIDERES_DEV_OPEN_PAINEL=false</code>.
          </div>
        )}
        {teamViewPreview && (
          <div
            className="border-b border-emerald-200 bg-emerald-50 px-3 py-2.5 text-center text-xs text-emerald-950 sm:px-4"
            role="status"
          >
            <strong className="font-semibold">A ver como a equipe</strong> — menu e ecrãs iguais ao que a tua equipe
            vê. As tuas permissões de líder mantêm-se nas APIs; usa o menu para{' '}
            <span className="font-medium">voltar ao ambiente do líder</span> quando terminares.
          </div>
        )}
        {/* Única barra de marca: mobile-first (44px mín. toque no menu) */}
        <header className="sticky top-0 z-30 flex min-h-14 items-center justify-between gap-2 border-b border-gray-200 bg-white px-3 sm:gap-3 sm:px-4 lg:px-6">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="touch-manipulation shrink-0 rounded-lg p-2.5 text-gray-700 hover:bg-gray-100 lg:hidden"
              aria-label="Abrir menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link
              href={base}
              title={
                operationLabel
                  ? `Pro Líderes — ${isMemberAreaShell ? 'Equipe' : isLeaderWorkspace ? 'Líder' : 'Equipe'} — ${operationLabel}`
                  : undefined
              }
              className="flex min-w-0 flex-col gap-0.5 touch-manipulation sm:flex-row sm:items-center sm:gap-2"
            >
              <Image
                src={YLADA_LOGO}
                alt="YLADA Pro Líderes"
                width={90}
                height={28}
                className="h-6 w-auto max-w-[min(40vw,7.5rem)] object-contain object-left sm:h-7 sm:max-w-none"
                priority
              />
              <div className="flex min-w-0 flex-col leading-tight sm:flex-row sm:items-baseline sm:gap-2">
                <span className="truncate text-sm font-medium text-gray-500">Pro Líderes</span>
                {isMemberAreaShell ? (
                  operationLabel ? (
                    <span className="truncate text-xs font-medium text-gray-600">{operationLabel}</span>
                  ) : null
                ) : (
                  <>
                    <span
                      className={`truncate text-xs font-semibold ${
                        isLeaderWorkspace ? 'text-blue-700' : 'text-emerald-700'
                      }`}
                    >
                      {isLeaderWorkspace ? 'Ambiente do líder' : 'Ambiente da equipe'}
                    </span>
                    {operationLabel ? (
                      <span className="hidden max-w-[10rem] truncate text-xs text-gray-400 lg:inline">
                        · {operationLabel}
                      </span>
                    ) : null}
                  </>
                )}
              </div>
            </Link>
          </div>
          <Link
            href={`${base}/perfil`}
            className="touch-manipulation flex shrink-0 items-center gap-2 rounded-lg p-1 text-gray-700 hover:bg-gray-50 sm:pr-2"
            aria-label={`Perfil: ${userName}`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800 sm:h-9 sm:w-9">
              {initials}
            </div>
            <span className="hidden max-w-[100px] truncate text-sm font-medium sm:inline md:max-w-[140px]">
              {userName.split(' ')[0]}
            </span>
          </Link>
        </header>
        <main className="flex-1 p-4 sm:p-5 lg:p-6">{children}</main>
        </div>
      </div>
    </ProLideresPainelProvider>
  )
}
