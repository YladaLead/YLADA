'use client'

import Link from 'next/link'
import Image from 'next/image'
import ProEsteticaCapilarSidebar from './ProEsteticaCapilarSidebar'
import { ProLideresPainelProvider, type ProLideresPainelContextValue } from '@/components/pro-lideres/pro-lideres-painel-context'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

const YLADA_LOGO = YLADA_OG_FALLBACK_LOGO_PATH

export default function ProEsteticaCapilarAreaShell({
  children,
  painelContext,
}: {
  children: React.ReactNode
  painelContext: ProLideresPainelContextValue
}) {
  const operationLabel = painelContext.operationLabel ?? 'Operacao capilar'
  const { previewWithoutLogin, devStubPanel } = painelContext

  return (
    <ProLideresPainelProvider value={painelContext}>
      <div className="flex min-h-screen bg-gray-50">
        <ProEsteticaCapilarSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          {previewWithoutLogin && (
            <div className="border-b border-sky-200 bg-sky-50 px-3 py-2 text-center text-xs text-sky-950">
              <strong className="font-semibold">Pre-visualizacao sem login</strong> ativa para construir o front.
              Para exigir login novamente, defina <code className="rounded bg-sky-100/90 px-1">PRO_ESTETICA_CAPILAR_PUBLIC_PREVIEW=false</code>.
            </div>
          )}
          {devStubPanel && !previewWithoutLogin && (
            <div className="border-b border-amber-200 bg-amber-50 px-3 py-2 text-center text-xs text-amber-950">
              Modo desenvolvimento: painel capilar sem tenant real na base.
            </div>
          )}
          <header className="sticky top-0 z-20 flex min-h-14 items-center justify-between gap-3 border-b border-gray-200 bg-white px-4 lg:px-6">
            <Link href="/pro-estetica-capilar/painel" className="flex min-w-0 items-center gap-2">
              <Image src={YLADA_LOGO} alt="YLADA Pro Estetica Capilar" width={90} height={28} className="h-6 w-auto" priority />
              <span className="truncate text-sm text-gray-700">Pro Estetica Capilar · {operationLabel}</span>
            </Link>
          </header>
          <main className="flex-1 p-4 sm:p-5 lg:p-6">{children}</main>
        </div>
      </div>
    </ProLideresPainelProvider>
  )
}
