'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PRO_ESTETICA_CAPILAR_MENU_GROUPS, proEsteticaCapilarItemHref } from '@/config/pro-estetica-capilar-menu'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'

export default function ProEsteticaCapilarSidebar() {
  const pathname = usePathname()
  const { isLeaderWorkspace } = useProLideresPainel()

  const groups = PRO_ESTETICA_CAPILAR_MENU_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter((item) => isLeaderWorkspace || !item.leaderOnly),
  })).filter((g) => g.items.length > 0)

  return (
    <aside className="hidden w-56 shrink-0 border-r border-gray-200 bg-white lg:block">
      <nav className="space-y-4 p-3">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-xs font-medium tracking-wide text-gray-500">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const href = proEsteticaCapilarItemHref(item.path)
                const active = item.path
                  ? pathname === href || pathname?.startsWith(`${href}/`)
                  : pathname === '/pro-estetica-capilar/painel' || pathname === '/pro-estetica-capilar/painel/'
                return (
                  <Link
                    key={item.key}
                    href={href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                      active ? 'bg-blue-50 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
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
      </nav>
    </aside>
  )
}
