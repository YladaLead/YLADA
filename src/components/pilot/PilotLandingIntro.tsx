'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'

/**
 * Primeira tela pública PT: só o gancho + CTA. Segmentos em /pt/segmentos.
 */
export default function PilotLandingIntro() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <header className="shrink-0 border-b border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-2.5 sm:px-6 sm:py-3">
          <Link href="/pt" className="inline-flex touch-manipulation shrink-0 items-center" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <Link href="/pt/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 py-2 shrink-0">
            Entrar
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-10 sm:pb-12">
        <div className="flex flex-col flex-1 min-h-[55vh] sm:min-h-[62vh] justify-center items-center text-center max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-snug">
            Explique menos.
            <br />
            Venda mais.
          </h1>
          <button
            type="button"
            onClick={() => router.push('/pt/segmentos')}
            className="mt-10 w-full max-w-sm min-h-[44px] rounded-xl bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-700 sm:min-h-[48px]"
          >
            Comece agora
          </button>
        </div>
      </main>
    </div>
  )
}
