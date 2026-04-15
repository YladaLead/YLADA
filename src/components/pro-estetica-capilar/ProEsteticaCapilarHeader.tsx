'use client'

import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import { useAuth } from '@/hooks/useAuth'

export function ProEsteticaCapilarHeader() {
  const { user, loading, signOut } = useAuth()

  return (
    <header className="shrink-0 border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3">
        <Link href="/pt" className="inline-flex shrink-0 touch-manipulation items-center" aria-label="YLADA inicio">
          <YLADALogo size="md" responsive className="bg-transparent" />
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <span className="hidden text-sm text-blue-600/80 sm:inline">Pro Estetica Capilar</span>
          <Link
            href="/pro-estetica-capilar/painel"
            className="rounded-lg px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 sm:px-3"
          >
            Painel
          </Link>
          {loading ? (
            <span className="rounded-lg px-3 py-2 text-sm text-gray-400" aria-hidden>
              ...
            </span>
          ) : user ? (
            <button
              type="button"
              onClick={() => void signOut()}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Sair
            </button>
          ) : (
            <Link
              href="/pro-estetica-capilar/entrar"
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
