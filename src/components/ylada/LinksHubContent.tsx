'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import YladaAreaShell from './YladaAreaShell'
import BibliotecaPageContent from './BibliotecaPageContent'
import { LinksPageContent } from '@/app/pt/(matrix)/links/page'
import type { OnboardingAreaCodigo } from '@/components/ylada/OnboardingPageContent'

type TabId = 'prontos' | 'meus'

const TAB_PARAM = 'tab'

/** Tooltip (desktop): separador Biblioteca no hub Pro Estética (PT-BR). */
const TITLE_TAB_BIBLIOTECA_PRO =
  'Vitrine de modelos: você escolhe um e gera um link novo. Só aparece em “Seus links” depois de criado.'
/** Tooltip (desktop): separador Seus links no hub Pro Estética (PT-BR). */
const TITLE_TAB_MEUS_LINKS_PRO =
  'Lista dos links já na sua conta (Biblioteca, Noel, etc.) — URL, QR e análise: aberturas, respostas, WhatsApp.'

interface LinksHubContentProps {
  areaCodigo: OnboardingAreaCodigo | string
  areaLabel: string
  /** Dentro de outro shell (ex.: painel Pro Estética): omite YladaAreaShell para não duplicar navegação. */
  noAreaShell?: boolean
  /** Biblioteca “Usar modelo pronto” só com conteúdo de estética corporal (sem fluxos faciais/capilar genéricos). */
  bibliotecaEsteticaCorporalScope?: boolean
  /** Pro Estética Capilar: lista fechada capilar (subscope `estetica_capilar`). */
  bibliotecaEsteticaCapilarScope?: boolean
}

function LinksHubContentInner({
  areaCodigo,
  areaLabel,
  noAreaShell,
  bibliotecaEsteticaCorporalScope,
  bibliotecaEsteticaCapilarScope,
}: LinksHubContentProps) {
  const proEsteticaProBiblioteca =
    Boolean(bibliotecaEsteticaCorporalScope) || Boolean(bibliotecaEsteticaCapilarScope)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const tabFromUrl = searchParams.get(TAB_PARAM) as TabId | null
  const isValidTab = tabFromUrl === 'prontos' || tabFromUrl === 'meus'
  const defaultTab: TabId = 'prontos'
  const initialTab: TabId = isValidTab && tabFromUrl ? tabFromUrl : defaultTab
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

  const core = (
    <div className="space-y-3">
        {/* Dois blocos lado a lado desde o mobile — menos altura, sugestões aparecem antes no scroll */}
        <div className="space-y-2">
          {!proEsteticaProBiblioteca ? (
            <>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">Links</h1>
              <p className="text-gray-600 text-xs sm:text-sm">O que você quer fazer?</p>
              <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                <button
                  type="button"
                  onClick={() => switchTab('prontos')}
                  className={`rounded-lg border-2 p-2 sm:p-2.5 text-left transition-all min-h-0 ${
                    tab === 'prontos'
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-gray-200 bg-white hover:border-sky-200 hover:bg-sky-50/30'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base sm:text-lg shrink-0 leading-none" aria-hidden>
                      📚
                    </span>
                    <span className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight min-w-0">
                      Usar modelo pronto
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-600 mt-1 leading-snug line-clamp-2 pl-[calc(1.25rem+0.5rem)]">
                    Biblioteca YLADA
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => switchTab('meus')}
                  className={`rounded-lg border-2 p-2 sm:p-2.5 text-left transition-all min-h-0 ${
                    tab === 'meus'
                      ? 'border-sky-500 bg-sky-50'
                      : 'border-gray-200 bg-white hover:border-sky-200 hover:bg-sky-50/30'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base sm:text-lg shrink-0 leading-none" aria-hidden>
                      🔗
                    </span>
                    <span className="font-semibold text-gray-900 text-xs sm:text-sm leading-tight min-w-0">Meus links</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-gray-600 mt-1 leading-snug line-clamp-2 pl-[calc(1.25rem+0.5rem)]">
                    Criar e acompanhar
                  </p>
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-1 border-b border-gray-200 pb-0.5" role="tablist" aria-label="Biblioteca e seus links">
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'prontos'}
                title={TITLE_TAB_BIBLIOTECA_PRO}
                onClick={() => switchTab('prontos')}
                className={`rounded-t-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === 'prontos' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Biblioteca
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === 'meus'}
                title={TITLE_TAB_MEUS_LINKS_PRO}
                onClick={() => switchTab('meus')}
                className={`rounded-t-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === 'meus' ? 'bg-white text-gray-900 shadow-sm ring-1 ring-gray-200' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Seus links
              </button>
            </div>
          )}
          {proEsteticaProBiblioteca ? (
            <div
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[11px] leading-snug text-slate-800 sm:text-xs"
              role="note"
            >
              <p>
                <span className="font-semibold text-slate-900">Biblioteca</span> — modelos para gerar um{' '}
                <span className="font-medium">link novo</span> (ex.: “Usar esse”).
              </p>
              <p className="mt-1 border-t border-slate-200/80 pt-1.5">
                <span className="font-semibold text-slate-900">Seus links</span> — os links que{' '}
                <span className="font-medium">já estão na sua conta</span> (Biblioteca, Noel ou outro), com URL, QR e{' '}
                <span className="font-medium">análise</span> (aberturas, respostas, WhatsApp).
              </p>
            </div>
          ) : null}
        </div>

        {tab === 'prontos' && (
          <BibliotecaPageContent
            areaCodigo={areaCodigo as OnboardingAreaCodigo}
            areaLabel={areaLabel}
            embedded
            esteticaCorporalScope={bibliotecaEsteticaCorporalScope}
            esteticaCapilarScope={bibliotecaEsteticaCapilarScope}
          />
        )}
        {tab === 'meus' && (
          <LinksPageContent
            areaCodigo={areaCodigo as OnboardingAreaCodigo}
            areaLabel={areaLabel}
            embedded
            proEsteticaCorporalEmbedded={proEsteticaProBiblioteca}
          />
        )}
    </div>
  )

  if (noAreaShell) return core
  return <YladaAreaShell areaCodigo={areaCodigo} areaLabel={areaLabel}>{core}</YladaAreaShell>
}

export default function LinksHubContent(props: LinksHubContentProps) {
  const fallback = props.noAreaShell ? (
    <div className="flex min-h-[40vh] items-center justify-center py-12">
      <p className="text-sm text-gray-500">Carregando...</p>
    </div>
  ) : (
    <YladaAreaShell areaCodigo={props.areaCodigo} areaLabel={props.areaLabel}>
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-sm">Carregando...</p>
      </div>
    </YladaAreaShell>
  )
  return (
    <Suspense fallback={fallback}>
      <LinksHubContentInner {...props} />
    </Suspense>
  )
}
