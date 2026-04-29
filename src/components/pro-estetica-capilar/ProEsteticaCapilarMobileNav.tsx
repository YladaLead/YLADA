'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  PRO_ESTETICA_CAPILAR_BASE_PATH,
  PRO_ESTETICA_CAPILAR_MENU_GROUPS,
  proEsteticaCapilarItemHref,
  type ProEsteticaCapilarMenuItem,
} from '@/config/pro-estetica-capilar-menu'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'

function itemActive(pathname: string | null, item: ProEsteticaCapilarMenuItem): boolean {
  const href = proEsteticaCapilarItemHref(item.path)
  if (item.key === 'inicio') {
    return pathname === PRO_ESTETICA_CAPILAR_BASE_PATH || pathname === `${PRO_ESTETICA_CAPILAR_BASE_PATH}/`
  }
  if (item.key === 'noel') {
    return pathname === href || pathname?.startsWith(`${href}/`)
  }
  return pathname === href || pathname?.startsWith(`${href}/`)
}

export default function ProEsteticaCapilarMobileNav() {
  const pathname = usePathname()
  const { isLeaderWorkspace } = useProLideresPainel()

  const items = PRO_ESTETICA_CAPILAR_MENU_GROUPS.flatMap((g) =>
    g.items.filter((item) => isLeaderWorkspace || !item.leaderOnly)
  )

  const gridClass = items.length >= 5 ? 'grid-cols-5' : 'grid-cols-4'

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden"
      aria-label="Navegação principal"
    >
      <ul className={`mx-auto grid max-w-xl gap-0 ${gridClass}`}>
        {items.map((item) => {
          const href = proEsteticaCapilarItemHref(item.path)
          const active = itemActive(pathname, item)
          return (
            <li key={item.key}>
              <Link
                href={href}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 px-0.5 py-2 text-[9px] font-semibold leading-tight touch-manipulation sm:px-1 sm:text-[10px] ${
                  active ? 'text-blue-700' : 'text-gray-600'
                }`}
              >
                <span className="text-lg leading-none" aria-hidden>
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
