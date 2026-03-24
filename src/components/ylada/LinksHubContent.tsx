'use client'

import { useState, useEffect } from 'react'
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

export default function LinksHubContent({ areaCodigo, areaLabel }: LinksHubContentProps) {
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
      <div className="space-y-6">
        {/* Escolha principal: dois blocos evidentes */}
        <div className="space-y-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Links</h1>
          <p className="text-gray-600 text-sm">O que você quer fazer?</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => switchTab('prontos')}
              className={`rounded-xl border-2 p-6 text-left transition-all ${
                tab === 'prontos'
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-gray-200 bg-white hover:border-sky-200 hover:bg-sky-50/30'
              }`}
            >
              <span className="text-3xl block mb-3" aria-hidden>📚</span>
              <span className="block font-semibold text-gray-900">Usar modelo pronto</span>
              <span className="block text-sm text-gray-600 mt-1">Escolher na biblioteca da YLADA</span>
            </button>
            <button
              type="button"
              onClick={() => switchTab('meus')}
              className={`rounded-xl border-2 p-6 text-left transition-all ${
                tab === 'meus'
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-gray-200 bg-white hover:border-sky-200 hover:bg-sky-50/30'
              }`}
            >
              <span className="text-3xl block mb-3" aria-hidden>🔗</span>
              <span className="block font-semibold text-gray-900">Ver meus links</span>
              <span className="block text-sm text-gray-600 mt-1">Criar, editar e acompanhar</span>
            </button>
          </div>

          {tab && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">Você está em:</span>
              <span className="font-medium text-gray-900">
                {tab === 'prontos' ? 'Biblioteca' : 'Meus links'}
              </span>
            </div>
          )}
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
