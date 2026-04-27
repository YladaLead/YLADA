'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import {
  PRO_ESTETICA_CORPORAL_BASE_PATH,
  PRO_ESTETICA_CORPORAL_MENU_GROUPS,
  proEsteticaCorporalItemHref,
  type ProEsteticaCorporalMenuItem,
} from '@/config/pro-estetica-corporal-menu'
import { useAuth } from '@/hooks/useAuth'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'

const PAINEL_PREFIX = '/pro-estetica-corporal/painel'
const PERFIL_PATH = `${PAINEL_PREFIX}/perfil`

interface ProEsteticaCorporalSidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export default function ProEsteticaCorporalSidebar({
  isMobileOpen = false,
  onMobileClose,
}: ProEsteticaCorporalSidebarProps) {
  const pathname = usePathname()
  const { isLeaderWorkspace, previewWithoutLogin } = useProLideresPainel()
  const { signOut, user, userProfile } = useAuth()

  const userName = previewWithoutLogin
    ? 'Pré-visualização'
    : userProfile?.nome_completo ||
      user?.user_metadata?.full_name ||
      user?.user_metadata?.name ||
      user?.email?.split('@')[0] ||
      'Conta'

  const initials = previewWithoutLogin
    ? 'PV'
    : userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'P'

  const filteredMenu = useMemo(() => {
    return PRO_ESTETICA_CORPORAL_MENU_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((item) => isLeaderWorkspace || !item.leaderOnly),
    })).filter((g) => g.items.length > 0)
  }, [isLeaderWorkspace])

  const mainGroups = filteredMenu

  const itemHref = useCallback((item: ProEsteticaCorporalMenuItem) => proEsteticaCorporalItemHref(item.path), [])

  const itemIsActive = useCallback(
    (item: ProEsteticaCorporalMenuItem) => {
      const href = itemHref(item)
      if (item.key === 'inicio') {
        return pathname === PRO_ESTETICA_CORPORAL_BASE_PATH || pathname === `${PRO_ESTETICA_CORPORAL_BASE_PATH}/`
      }
      if (item.key === 'noel') {
        return pathname === href || pathname?.startsWith(`${href}/`)
      }
      return pathname === href || pathname?.startsWith(`${href}/`)
    },
    [pathname, itemHref]
  )
  const perfilActive = pathname === PERFIL_PATH || pathname?.startsWith(`${PERFIL_PATH}/`)

  const renderItemLink = (item: ProEsteticaCorporalMenuItem) => {
    const href = itemHref(item)
    const isActive = itemIsActive(item)
    return (
      <Link
        key={item.key}
        href={href}
        onClick={onMobileClose}
        className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors touch-manipulation ${
          isActive ? 'bg-blue-50 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span aria-hidden>{item.icon}</span>
        <div className="min-w-0">
          <p className="truncate">{item.label}</p>
          {item.hint ? <p className="truncate text-[11px] font-medium text-gray-500">{item.hint}</p> : null}
        </div>
      </Link>
    )
  }

  const content = (
    <aside className="flex h-full min-h-0 w-[min(100vw-2rem,14rem)] flex-col border-r border-gray-200 bg-white lg:w-56">
      <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2 lg:hidden">
        <span className="text-sm font-semibold text-gray-900">Menu</span>
        <button
          type="button"
          onClick={onMobileClose}
          className="touch-manipulation flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100"
          aria-label="Fechar menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="border-b border-gray-200 p-3">
        <Link
          href={PERFIL_PATH}
          onClick={onMobileClose}
          className={`flex min-h-[44px] items-center gap-3 rounded-lg p-2 transition-colors touch-manipulation ${
            perfilActive ? 'bg-blue-50' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-900">
            {initials}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className={`truncate text-sm font-semibold ${perfilActive ? 'text-blue-900' : 'text-gray-900'}`}>
              {userName}
            </p>
            <p className="text-xs font-medium text-blue-700">Meu perfil</p>
          </div>
        </Link>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-3">
          {mainGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-3 text-xs font-medium tracking-wide text-gray-500">{group.label}</p>
              <div className="space-y-0.5">{group.items.map((item) => renderItemLink(item))}</div>
            </div>
          ))}
        </div>

        <div className="shrink-0 border-t border-gray-200">
          <div className="px-3 pb-3 pt-2">
            {previewWithoutLogin ? (
              <Link
                href={`/pro-estetica-corporal/entrar?next=${encodeURIComponent(pathname || PRO_ESTETICA_CORPORAL_BASE_PATH)}`}
                onClick={onMobileClose}
                className="flex min-h-[44px] w-full items-center gap-3 rounded-lg bg-blue-600 px-3 py-2.5 text-left text-sm font-semibold text-white transition-colors touch-manipulation hover:bg-blue-700"
              >
                <span aria-hidden>🔐</span>
                Iniciar sessão
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  signOut()
                  onMobileClose?.()
                }}
                className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 transition-colors touch-manipulation hover:bg-red-50 hover:text-red-600"
              >
                <span aria-hidden>🚪</span>
                Sair
              </button>
            )}
          </div>
        </div>
      </nav>
    </aside>
  )

  return (
    <>
      <div className="hidden lg:flex lg:h-screen lg:max-h-[100dvh] lg:flex-shrink-0 lg:self-start lg:sticky lg:top-0 lg:z-20">
        {content}
      </div>
      {isMobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onMobileClose} aria-hidden />
          <div className="fixed inset-y-0 left-0 z-50 max-w-[calc(100vw-1rem)] shadow-xl lg:hidden">{content}</div>
        </>
      )}
    </>
  )
}
