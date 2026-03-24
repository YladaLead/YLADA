'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  YLADA_MENU_GROUPS,
  getYladaAreaPathPrefix,
  getYladaLeadsPath,
  getYladaSuportePath,
} from '@/config/ylada-areas'
import { useAuth } from '@/hooks/useAuth'

const YLADA_LOGO = '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png'

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

  /** Admin: + Lab + Planejamento. Links rápidos Wellness/Admin abaixo da navegação principal. */
  const visibleGroups = YLADA_MENU_GROUPS.filter((group) => {
    if (group.label === 'Lab' || group.label === 'Sistema') return isAdmin
    return true
  })

  const content = (
    <aside className="flex flex-col h-full bg-white border-r border-gray-200 w-56">
      <div className="p-4 border-b border-gray-200">
        <Link href={`${prefix}/home`} className="flex flex-col gap-0.5">
          {/* Desktop: mostra logo oficial */}
          <div className="hidden lg:block">
            <Image
              src={YLADA_LOGO}
              alt="YLADA"
              width={90}
              height={28}
              className="h-7 w-auto object-contain"
              priority
            />
          </div>
          {/* Mobile: mantém texto simples (já está bom) */}
          <span className="lg:hidden font-bold text-gray-900 text-lg tracking-tight">YLADA</span>
          {areaLabel !== 'YLADA' && (
            <span className="text-sm text-gray-500 font-medium">{areaLabel}</span>
          )}
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-xs font-medium text-gray-500 tracking-wide">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const path =
                  item.key === 'leads'
                    ? getYladaLeadsPath(areaCodigo)
                    : item.key === 'suporte'
                      ? getYladaSuportePath(areaCodigo)
                      : item.path
                const hash = 'hash' in item && item.hash ? `#${item.hash}` : ''
                const href = `${prefix}/${path}${hash}`
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
              <p className="px-3 mb-1.5 text-xs font-medium text-gray-500 tracking-wide">Equipe</p>
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
