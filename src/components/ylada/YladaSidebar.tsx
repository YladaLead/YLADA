'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { YLADA_MENU_ITEMS, getYladaAreaPathPrefix } from '@/config/ylada-areas'

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

  const content = (
    <aside className="flex flex-col h-full bg-white border-r border-gray-200 w-56">
      <div className="p-4 border-b border-gray-200">
        <Link href={`${prefix}/home`} className="font-semibold text-gray-900">
          YLADA · {areaLabel}
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {YLADA_MENU_ITEMS.map((item) => {
          const href = `${prefix}/${item.path}`
          const isActive = pathname === href || pathname?.startsWith(href + '/')
          return (
            <Link
              key={item.key}
              href={href}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
