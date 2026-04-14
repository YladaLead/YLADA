'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  YLADA_MENU_GROUPS,
  getYladaAreaPathPrefix,
  getYladaLeadsPath,
  getYladaSuportePath,
} from '@/config/ylada-areas'
import { buildYladaReferralWhatsappHref } from '@/lib/ylada-referral-whatsapp'
import { useAuth } from '@/hooks/useAuth'

const YLADA_LOGO = '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png'

interface YladaSidebarProps {
  areaCodigo: string
  areaLabel: string
  isMobileOpen?: boolean
  onMobileClose?: () => void
}

type YladaMenuItem = (typeof YLADA_MENU_GROUPS)[number]['items'][number]

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
  const [contaOpen, setContaOpen] = useState(false)
  const [locationHash, setLocationHash] = useState('')
  const contaRouteKeyRef = useRef<string | null>(null)

  /** Admin: + Lab + Planejamento. Links rápidos Wellness/Admin abaixo da navegação principal. */
  const visibleGroups = YLADA_MENU_GROUPS.filter((group) => {
    if (group.label === 'Lab' || group.label === 'Sistema') return isAdmin
    return true
  })
  const mainGroups = visibleGroups.filter((g) => g.label !== 'Conta')
  const contaGroup = visibleGroups.find((g) => g.label === 'Conta')

  const itemPath = useCallback(
    (item: YladaMenuItem) =>
      item.key === 'leads'
        ? getYladaLeadsPath(areaCodigo)
        : item.key === 'suporte'
          ? getYladaSuportePath(areaCodigo)
          : item.path,
    [areaCodigo]
  )

  const itemHref = useCallback(
    (item: YladaMenuItem) => {
      const path = itemPath(item)
      const hash = 'hash' in item && item.hash ? `#${item.hash}` : ''
      const query = item.key === 'home' ? '?chat=1' : ''
      return `${prefix}/${path}${query}${hash}`
    },
    [itemPath, prefix]
  )

  const itemIsActive = useCallback(
    (item: YladaMenuItem) => {
      const path = itemPath(item)
      const base = `${prefix}/${path}`
      if (item.key === 'assinatura') {
        return pathname === base && locationHash === '#assinatura'
      }
      if (item.key === 'configuracao') {
        return pathname === base && locationHash !== '#assinatura'
      }
      return pathname === base || pathname?.startsWith(`${base}/`)
    },
    [itemPath, pathname, prefix, locationHash]
  )

  useEffect(() => {
    setLocationHash(typeof window !== 'undefined' ? window.location.hash : '')
    const onHash = () => setLocationHash(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [pathname])

  useEffect(() => {
    if (!contaGroup) return
    const routeKey = `${pathname ?? ''}|${locationHash}`
    if (contaRouteKeyRef.current === routeKey) return
    contaRouteKeyRef.current = routeKey
    const matchesConta = contaGroup.items.some((item) => itemIsActive(item))
    setContaOpen(matchesConta)
  }, [contaGroup, pathname, locationHash, itemIsActive])

  const contaSectionActive = contaGroup?.items.some((item) => itemIsActive(item)) ?? false

  const renderItemLink = (item: YladaMenuItem) => {
    const href = itemHref(item)
    const isActive = itemIsActive(item)
    return (
      <Link
        key={item.key}
        href={href}
        onClick={onMobileClose}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        <span aria-hidden>{item.icon}</span>
        {item.label}
      </Link>
    )
  }

  const content = (
    <aside className="flex flex-col h-full min-h-0 bg-white border-r border-gray-200 w-56">
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
      <nav className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-4">
          {mainGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-xs font-medium text-gray-500 tracking-wide">
                {group.label}
              </p>
              <div className="space-y-0.5">{group.items.map((item) => renderItemLink(item))}</div>
            </div>
          ))}

          <div className="pt-3 mt-1 border-t border-gray-100">
            <a
              href={buildYladaReferralWhatsappHref(areaCodigo, areaLabel)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onMobileClose}
              className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-green-50 transition-colors"
              title="Indicar pelo WhatsApp com mensagem pronta"
            >
              <span aria-hidden>🤝</span>
              Indicar colega
            </a>
            <Link
              href="/pt/consultoria"
              onClick={onMobileClose}
              className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-emerald-50 transition-colors"
              title="Falar com especialista da equipe YLADA"
            >
              <span aria-hidden>🚀</span>
              Consultoria
            </Link>
          </div>
        </div>

        {contaGroup && (
          <div className="flex-shrink-0 border-t border-gray-200 p-3 pt-2">
            <button
              type="button"
              onClick={() => setContaOpen((o) => !o)}
              className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                contaSectionActive && !contaOpen
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-expanded={contaOpen}
            >
              <span className="text-xs font-medium text-gray-500 tracking-wide">Conta</span>
              <span className="text-gray-400" aria-hidden>
                {contaOpen ? '▾' : '▸'}
              </span>
            </button>
            {contaOpen && (
              <div className="mt-1 space-y-0.5">{contaGroup.items.map((item) => renderItemLink(item))}</div>
            )}
          </div>
        )}

        <div className="flex-shrink-0 border-t border-gray-200 p-3 pt-2 space-y-1">
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
            onClick={() => {
              signOut()
              onMobileClose?.()
            }}
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
      {/* Desktop: altura da viewport; não estica com o main; sticky mantém visível ao rolar */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:self-start lg:h-screen lg:max-h-[100dvh] lg:sticky lg:top-0 lg:z-20">
        {content}
      </div>
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
