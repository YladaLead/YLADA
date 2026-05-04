'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { PRO_LIDERES_MENU_GROUPS, proLideresItemHref, type ProLideresMenuItem } from '@/config/pro-lideres-menu'
import { useAuth } from '@/hooks/useAuth'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'
import { setProLideresTeamViewPreviewCookie } from '@/lib/pro-lideres-team-preview'

interface ProLideresSidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export default function ProLideresSidebar({ isMobileOpen = false, onMobileClose }: ProLideresSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { role, teamViewPreview, dailyTasksVisibleToTeam } = useProLideresPainel()
  const { signOut, user, userProfile } = useAuth()
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

  /** Só utilizadores com papel líder (sem «ver como equipe») vêem entradas leaderOnly — regra explícita por `role`. */
  const showLeaderOnlyNav = role === 'leader' && !teamViewPreview

  const filteredMenu = useMemo(() => {
    return PRO_LIDERES_MENU_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((item) => {
        if (item.key === 'tarefas' && !showLeaderOnlyNav && !dailyTasksVisibleToTeam) {
          return false
        }
        return showLeaderOnlyNav || !item.leaderOnly
      }),
    })).filter((g) => g.items.length > 0)
  }, [showLeaderOnlyNav, dailyTasksVisibleToTeam, role, teamViewPreview])

  const itemHref = useCallback((item: ProLideresMenuItem) => proLideresItemHref(item.path), [])

  const itemIsActive = useCallback(
    (item: ProLideresMenuItem) => {
      const href = itemHref(item)
      if (item.key === 'visao') {
        return pathname === '/pro-lideres/painel' || pathname === '/pro-lideres/painel/'
      }
      return pathname === href || pathname?.startsWith(`${href}/`)
    },
    [pathname, itemHref]
  )

  const perfilPath = '/pro-lideres/painel/perfil'
  const perfilActive = pathname === perfilPath || pathname?.startsWith(`${perfilPath}/`)

  const renderItemLink = (item: ProLideresMenuItem) => {
    const href = itemHref(item)
    const isActive = itemIsActive(item)
    return (
      <Link
        key={item.key}
        href={href}
        onClick={onMobileClose}
        className={`flex min-h-[44px] items-center gap-3 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors touch-manipulation ${
          isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span className="shrink-0" aria-hidden>
          {item.icon}
        </span>
        <span className="flex min-w-0 flex-col gap-0 leading-snug">
          <span>{item.label}</span>
          {item.subtitle ? (
            <span className="text-[11px] font-normal text-gray-500">{item.subtitle}</span>
          ) : null}
        </span>
      </Link>
    )
  }

  const content = (
    <aside className="flex h-full min-h-0 w-[min(100vw-2rem,14rem)] flex-col border-r border-gray-200 bg-white lg:w-56">
      {/* Drawer mobile: fechar (marca única fica no header da página) */}
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
          href={perfilPath}
          onClick={onMobileClose}
          className={`flex min-h-[44px] items-center gap-3 rounded-lg p-2 transition-colors touch-manipulation ${
            perfilActive ? 'bg-blue-50' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800">
            {initials}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className={`truncate text-sm font-semibold ${perfilActive ? 'text-blue-800' : 'text-gray-900'}`}>
              {userName}
            </p>
            <p className="text-xs font-medium text-blue-600">Meu perfil</p>
          </div>
        </Link>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-2">
          {filteredMenu.map((group) => (
            <div key={group.label || 'menu'}>
              {group.label ? (
                <p className="mb-1 px-2 text-[11px] font-medium uppercase tracking-wide text-gray-500">
                  {group.label}
                </p>
              ) : null}
              <div className="space-y-0.5">{group.items.map((item) => renderItemLink(item))}</div>
            </div>
          ))}
        </div>

        <div className="shrink-0 space-y-1 border-t border-gray-200 p-2">
          {role === 'leader' && (
            <>
              {!teamViewPreview ? (
                <button
                  type="button"
                  onClick={() => {
                    setProLideresTeamViewPreviewCookie(true)
                    onMobileClose?.()
                    router.push('/pro-lideres/painel')
                    router.refresh()
                  }}
                  className="flex min-h-[40px] w-full items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/80 px-2 py-2 text-left text-sm font-semibold text-emerald-900 transition-colors touch-manipulation hover:bg-emerald-100"
                >
                  <span aria-hidden>👀</span>
                  Ver como equipe
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setProLideresTeamViewPreviewCookie(false)
                    onMobileClose?.()
                    router.push('/pro-lideres/painel')
                    router.refresh()
                  }}
                  className="flex min-h-[40px] w-full items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/90 px-2 py-2 text-left text-sm font-semibold text-blue-900 transition-colors touch-manipulation hover:bg-blue-100"
                >
                  <span aria-hidden>↩</span>
                  Voltar ao ambiente do líder
                </button>
              )}
            </>
          )}
          <button
            type="button"
            onClick={() => {
              setProLideresTeamViewPreviewCookie(false)
              signOut()
              onMobileClose?.()
            }}
            className="flex min-h-[40px] w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium text-gray-700 transition-colors touch-manipulation hover:bg-red-50 hover:text-red-600"
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
      <div className="hidden lg:flex lg:h-screen lg:max-h-[100dvh] lg:flex-shrink-0 lg:self-start lg:sticky lg:top-0 lg:z-20">
        {content}
      </div>
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={onMobileClose}
            aria-hidden
          />
          <div className="fixed inset-y-0 left-0 z-50 max-w-[calc(100vw-1rem)] shadow-xl lg:hidden">
            {content}
          </div>
        </>
      )}
    </>
  )
}
