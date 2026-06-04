'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PRO_LIDERES_MENU_GROUPS, proLideresItemHrefWithBase, type ProLideresMenuItem } from '@/config/pro-lideres-menu'
import { useAuth } from '@/hooks/useAuth'
import { useProLideresPainel } from '@/components/pro-lideres/pro-lideres-painel-context'
import { setProLideresTeamViewPreviewCookie } from '@/lib/pro-lideres-team-preview'

const NOEL_KEYS = ['noel', 'noel-membro', 'noel-equipe', 'noel-laboratorio', 'noel-membro-laboratorio']

interface ProLideresSidebarProps {
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

export default function ProLideresSidebar({ isMobileOpen = false, onMobileClose }: ProLideresSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const {
    canManageAsLeader,
    isLeaderWorkspace,
    teamViewPreview,
    dailyTasksVisibleToTeam,
    painelBasePath,
    noelMemberShowSidebarNav,
  } = useProLideresPainel()
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

  const filteredMenu = useMemo(() => {
    return PRO_LIDERES_MENU_GROUPS.map((g) => ({
      ...g,
      items: g.items.filter((item) => {
        if (item.key === 'tarefas' && !isLeaderWorkspace && !dailyTasksVisibleToTeam) {
          return false
        }
        if (item.requireNoelMemberNav && !noelMemberShowSidebarNav) {
          return false
        }
        return isLeaderWorkspace || !item.leaderOnly
      }),
    })).filter((g) => g.items.length > 0)
  }, [isLeaderWorkspace, dailyTasksVisibleToTeam, noelMemberShowSidebarNav])

  const itemHref = useCallback(
    (item: ProLideresMenuItem) => proLideresItemHrefWithBase(painelBasePath, item.path),
    [painelBasePath]
  )

  const itemIsActive = useCallback(
    (item: ProLideresMenuItem) => {
      const href = itemHref(item)
      const base = painelBasePath.replace(/\/$/, '')
      if (item.key === 'visao') {
        return pathname === base || pathname === `${base}/`
      }
      return pathname === href || pathname?.startsWith(`${href}/`)
    },
    [pathname, itemHref, painelBasePath]
  )

  // Toggle independente — cada seção abre/fecha sem depender das outras
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set(['Meu trabalho']))
  const didAutoExpand = useRef(false)

  // Na primeira renderização, auto-abre a seção que contém o item ativo
  useEffect(() => {
    if (didAutoExpand.current) return
    didAutoExpand.current = true
    filteredMenu.forEach((group) => {
      if (group.label && group.items.some((item) => itemIsActive(item))) {
        setOpenGroups((prev) => new Set([...prev, group.label]))
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggleGroup = useCallback((label: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }, [])

  const perfilPath = `${painelBasePath.replace(/\/$/, '')}/perfil`
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
        <span className="shrink-0 flex items-center justify-center" aria-hidden>
          {NOEL_KEYS.includes(item.key) ? (
            <Image
              src="/images/logo/noel/noel-icon-32.png"
              alt="Noel"
              width={22}
              height={22}
              className="rounded-full"
            />
          ) : (
            item.icon
          )}
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
          {filteredMenu.map((group) => {
            const isCollapsed = !!group.label && !openGroups.has(group.label)
            return (
              <div key={group.label || 'menu'}>
                {group.label ? (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.label)}
                    className="mb-1 flex w-full items-center justify-between px-2 text-[11px] font-medium uppercase tracking-wide text-gray-500 hover:text-gray-700"
                  >
                    <span>{group.label}</span>
                    <svg
                      className={`h-3 w-3 transition-transform duration-150 ${isCollapsed ? '-rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                ) : null}
                {!isCollapsed ? (
                  <div className="space-y-0.5">{group.items.map((item) => renderItemLink(item))}</div>
                ) : null}
              </div>
            )
          })}
        </div>

        <div className="shrink-0 space-y-1 border-t border-gray-200 p-2">
          {canManageAsLeader && (
            <>
              {!teamViewPreview ? (
                <button
                  type="button"
                  onClick={() => {
                    setProLideresTeamViewPreviewCookie(true)
                    onMobileClose?.()
                    router.push(painelBasePath)
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
                    router.push(painelBasePath)
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
      <div className="hidden lg:flex lg:h-screen lg:max-h-[100svh] lg:flex-shrink-0 lg:self-start lg:sticky lg:top-0 lg:z-20">
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
