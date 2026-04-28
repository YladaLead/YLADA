'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  PRO_ESTETICA_CORPORAL_BASE_PATH,
  PRO_ESTETICA_CORPORAL_MENU_GROUPS,
  proEsteticaCorporalItemHref,
  type ProEsteticaCorporalMenuItem,
} from '@/config/pro-estetica-corporal-menu'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'

function itemActive(pathname: string | null, item: ProEsteticaCorporalMenuItem): boolean {
  const href = proEsteticaCorporalItemHref(item.path)
  if (item.key === 'inicio') {
    return pathname === PRO_ESTETICA_CORPORAL_BASE_PATH || pathname === `${PRO_ESTETICA_CORPORAL_BASE_PATH}/`
  }
  if (item.key === 'noel') {
    return pathname === href || pathname?.startsWith(`${href}/`)
  }
  return pathname === href || pathname?.startsWith(`${href}/`)
}

export default function ProEsteticaCorporalMobileNav() {
  const pathname = usePathname()
  const { isLeaderWorkspace } = useProLideresPainel()

  const items = PRO_ESTETICA_CORPORAL_MENU_GROUPS.flatMap((g) =>
    g.items.filter((item) => isLeaderWorkspace || !item.leaderOnly)
  )

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden"
      aria-label="Navegação principal"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-4 gap-0">
        {items.map((item) => {
          const href = proEsteticaCorporalItemHref(item.path)
          const active = itemActive(pathname, item)
          return (
            <li key={item.key}>
              <Link
                href={href}
                className={`flex min-h-[52px] flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-semibold touch-manipulation ${
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
