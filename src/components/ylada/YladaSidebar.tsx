'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { YLADA_MENU_GROUPS, getYladaAreaPathPrefix, getYladaLeadsPath } from '@/config/ylada-areas'
import { useAuth } from '@/hooks/useAuth'

interface YladaSidebarProps {
  areaCodigo: string
  areaLabel: string
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export default function YladaSidebar({
  areaCodigo,
  areaLabel,
  isMobileOpen = false,
  onMobileClose,
}: YladaSidebarProps) {
  const pathname = usePathname()
  const prefix = getYladaAreaPathPrefix(areaCodigo)
  const { signOut, userProfile } = useAuth()
  const isAdmin = userProfile?.is_admin === true

  const content = (
    <aside className="flex flex-col h-full bg-white border-r border-gray-200 w-56">
      <div className="p-4 border-b border-gray-200">
        <Link href={`${prefix}/home`} className="font-semibold text-gray-900">
          YLADA · {areaLabel}
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {YLADA_MENU_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const path = item.key === 'leads' ? getYladaLeadsPath(areaCodigo) : item.path
                const href = `${prefix}/${path}`
                const isActive = pathname === href || pathname?.startsWith(href + '/')
                return (
                  <Link
                    key={item.key}
                    href={href}
                    onClick={onMobileClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span aria-hidden>{item.icon}</span>
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
        <div className="pt-3 mt-3 border-t border-gray-200 space-y-1">
          {isAdmin && (
            <>
              <Link
                href="/pt/wellness"
                onClick={onMobileClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                <span aria-hidden>🌿</span>
                Wellness
              </Link>
              <Link
                href="/admin"
                onClick={onMobileClose}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                <span aria-hidden>⚙️</span>
                Admin
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => { signOut(); onMobileClose?.() }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span aria-hidden>🚪</span>
            Sair
          </button>
        </div>
      </nav>
    </aside>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">{content}</div>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onMobileClose}
            aria-hidden
          />
          <div className="fixed inset-y-0 left-0 z-50 w-56 lg:hidden">{content}</div>
        </>
      )}
    </>
  )
}
