'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_GROUPS: { title: string; items: { href: string; label: string; emoji: string }[] }[] = [
  {
    title: 'Decisão & dados',
    items: [
      { href: '/admin/minha-orientacao', label: 'Minha orientação', emoji: '📋' },
      { href: '/admin/inteligencia-ylada', label: 'Inteligência YLADA', emoji: '🧠' },
      { href: '/admin/tracking', label: 'Funil (Tracking)', emoji: '📍' },
      { href: '/admin/ylada/behavioral-data', label: 'Dados comportamentais', emoji: '📈' },
    ],
  },
  {
    title: 'Operação',
    items: [
      { href: '/admin/suporte', label: 'Suporte', emoji: '💬' },
      { href: '/admin/motor-crescimento', label: 'Motor crescimento', emoji: '📚' },
      { href: '/admin/minhas-acoes', label: 'Minhas ações', emoji: '✅' },
      { href: '/admin/diagnosticos-links', label: 'Marketing', emoji: '📣' },
    ],
  },
  {
    title: 'Pessoas & acesso',
    items: [
      { href: '/admin/usuarios', label: 'Usuários', emoji: '👥' },
      { href: '/admin/presidentes', label: 'Presidentes', emoji: '🏆' },
    ],
  },
]

export function AdminNavClient() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    close()
  }, [pathname, close])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-between gap-2 min-h-[52px]">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <Link
            href="/admin"
            className="text-sm font-semibold text-gray-900 hover:text-blue-700 shrink-0 py-2"
          >
            Início
          </Link>
          <span className="text-gray-300 shrink-0" aria-hidden>
            |
          </span>
          <Link
            href="/admin/usuarios"
            className="text-xs sm:text-sm font-semibold text-indigo-800 bg-indigo-50 px-2.5 py-1.5 rounded-lg border border-indigo-200/90 hover:bg-indigo-100 shrink-0 min-h-[40px] inline-flex items-center gap-1"
          >
            <span aria-hidden>👥</span>
            Usuários
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="min-h-[44px] min-w-[44px] sm:min-w-0 sm:px-4 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 active:bg-gray-950 flex items-center justify-center gap-2 shrink-0"
          aria-expanded={open}
          aria-controls="admin-menu-panel"
        >
          <span className="hidden sm:inline">Área administrativa</span>
          <span className="sm:hidden">Menu</span>
          <span className="text-xs opacity-90" aria-hidden>
            {open ? '▲' : '▼'}
          </span>
        </button>
      </div>

      {open && (
        <nav
          id="admin-menu-panel"
          className="border-t border-gray-100 bg-gray-50 max-h-[min(72vh,480px)] overflow-y-auto overscroll-contain"
        >
          <div className="max-w-7xl mx-auto px-3 py-4 pb-6">
            <p className="text-xs text-gray-500 mb-3 px-1">
              Tecla Esc fecha o menu · ao navegar, o menu fecha sozinho
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {NAV_GROUPS.map((group) => (
                <div key={group.title}>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2 px-1">
                    {group.title}
                  </h3>
                  <ul className="space-y-1">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={close}
                          className="flex items-center gap-3 min-h-[48px] px-3 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-900 hover:border-blue-400 hover:bg-blue-50/50 active:bg-blue-50"
                        >
                          <span className="text-lg" aria-hidden>
                            {item.emoji}
                          </span>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </nav>
      )}
    </div>
  )
}
