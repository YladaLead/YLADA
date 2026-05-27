'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import {
  PRO_JOIAS_BASE_PATH,
  PRO_JOIAS_MENU_GROUPS,
  proJoiasItemHref,
  type ProJoiasMenuItem,
} from '@/config/pro-joias-menu'
import { useAuth } from '@/hooks/useAuth'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'

const PERFIL_PATH = `${PRO_JOIAS_BASE_PATH}/perfil`

interface ProJoiasSidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export default function ProJoiasSidebar({ isMobileOpen = false, onMobileClose }: ProJoiasSidebarProps) {
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
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'P'

  const filteredMenu = useMemo(() => {
    return PRO_JOIAS_MENU_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((item) => isLeaderWorkspace || !item.leaderOnly),
    })).filter((g) => g.items.length > 0)
  }, [isLeaderWorkspace])

  const itemHref = useCallback((item: ProJoiasMenuItem) => proJoiasItemHref(item.path), [])

  const itemIsActive = useCallback(
    (item: ProJoiasMenuItem) => {
      const href = itemHref(item)
      if (item.key === 'inicio') {
        return pathname === PRO_JOIAS_BASE_PATH || pathname === `${PRO_JOIAS_BASE_PATH}/`
      }
      return pathname === href || pathname?.startsWith(`${href}/`)
    },
    [pathname, itemHref]
  )

  const perfilActive = pathname === PERFIL_PATH || pathname?.startsWith(`${PERFIL_PATH}/`)

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
            perfilActive ? 'bg-amber-50' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-900">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">{userName.split(' ')[0]}</p>
            <p className="truncate text-xs text-gray-500">
              {isLeaderWorkspace ? 'Líder da rede' : 'Distribuidora'}
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 pb-6">
        {filteredMenu.map((group) => (
          <div key={group.label} className="mb-4">
            <p className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const href = itemHref(item)
                const isActive = itemIsActive(item)
                return (
                  <li key={item.key}>
                    <Link
                      href={href}
                      onClick={onMobileClose}
                      className={`flex min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors touch-manipulation ${
                        isActive ? 'bg-amber-50 text-amber-900' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span aria-hidden>{item.icon}</span>
                      <div className="min-w-0">
                        <p className="truncate">{item.label}</p>
                        {item.hint && (
                          <p className="truncate text-[11px] font-medium text-gray-400">{item.hint}</p>
                        )}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-3">
        <button
          type="button"
          onClick={() => signOut()}
          className="flex w-full min-h-[44px] items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 touch-manipulation"
        >
          <span aria-hidden>↩</span>
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex lg:shrink-0 lg:flex-col">{content}</div>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onMobileClose} />
          <div className="absolute inset-y-0 left-0 flex">{content}</div>
        </div>
      )}
    </>
  )
}
