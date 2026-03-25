'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import YladaAreaShell from './YladaAreaShell'
import BibliotecaPageContent from './BibliotecaPageContent'
import { LinksPageContent } from '@/app/pt/(matrix)/links/page'
import type { OnboardingAreaCodigo } from '@/components/ylada/OnboardingPageContent'

type TabId = 'prontos' | 'meus'

const TAB_PARAM = 'tab'

interface LinksHubContentProps {
  areaCodigo: OnboardingAreaCodigo | string
  areaLabel: string
}

function LinksHubContentInner({ areaCodigo, areaLabel }: LinksHubContentProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const tabFromUrl = searchParams.get(TAB_PARAM) as TabId | null
  const isValidTab = tabFromUrl === 'prontos' || tabFromUrl === 'meus'
  const initialTab: TabId = isValidTab ? tabFromUrl : 'prontos'
  const [tab, setTab] = useState<TabId>(initialTab)

  useEffect(() => {
    if (isValidTab && tabFromUrl && tab !== tabFromUrl) setTab(tabFromUrl)
  }, [tabFromUrl, isValidTab, tab])

  const switchTab = (newTab: TabId) => {
    setTab(newTab)
    const params = new URLSearchParams(searchParams.toString())
    params.set(TAB_PARAM, newTab)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>
      <div className="space-y-3">
        {/* Dois blocos lado a lado desde o mobile — menos altura, sugestões aparecem antes no scroll */}
        <div className="space-y-2">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Links</h1>
          <p className="text-gray-600 text-xs sm:text-sm">O que você quer fazer?</p>

          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => switchTab('prontos')}
              className={`rounded-lg sm:rounded-xl border-2 p-2.5 sm:p-4 text-left transition-all min-h-0 ${
                tab === 'prontos'
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-gray-200 bg-white hover:border-sky-200 hover:bg-sky-50/30'
              }`}
            >
              <span className="text-lg sm:text-2xl block mb-1 sm:mb-2" aria-hidden>📚</span>
              <span className="block font-semibold text-gray-900 text-xs sm:text-sm leading-snug">Usar modelo pronto</span>
              <span className="block text-[11px] sm:text-sm text-gray-600 mt-0.5 sm:mt-1 leading-snug line-clamp-2">
                Biblioteca YLADA
              </span>
            </button>
            <button
              type="button"
              onClick={() => switchTab('meus')}
              className={`rounded-lg sm:rounded-xl border-2 p-2.5 sm:p-4 text-left transition-all min-h-0 ${
                tab === 'meus'
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-gray-200 bg-white hover:border-sky-200 hover:bg-sky-50/30'
              }`}
            >
              <span className="text-lg sm:text-2xl block mb-1 sm:mb-2" aria-hidden>🔗</span>
              <span className="block font-semibold text-gray-900 text-xs sm:text-sm leading-snug">Meus links</span>
              <span className="block text-[11px] sm:text-sm text-gray-600 mt-0.5 sm:mt-1 leading-snug line-clamp-2">
                Criar e acompanhar
              </span>
            </button>
          </div>
        </div>

        {tab === 'prontos' && (
          <BibliotecaPageContent
            areaCodigo={areaCodigo as OnboardingAreaCodigo}
            areaLabel={areaLabel}
            embedded
          />
        )}
        {tab === 'meus' && (
          <LinksPageContent
            areaCodigo={areaCodigo as OnboardingAreaCodigo}
            areaLabel={areaLabel}
            embedded
          />
        )}
      </div>
    </YladaAreaShell>
  )
}

export default function LinksHubContent(props: LinksHubContentProps) {
  return (
    <Suspense fallback={
      <YladaAreaShell areaCodigo={props.areaCodigo} areaLabel={props.areaLabel}>
        <div className="flex items-center justify-center py-12">
          <p className="text-gray-500 text-sm">Carregando...</p>
        </div>
      </YladaAreaShell>
    }>
      <LinksHubContentInner {...props} />
    </Suspense>
  )
}
