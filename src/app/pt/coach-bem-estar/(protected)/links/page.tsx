import { Suspense } from 'react'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import { WellnessLinksUnificadosContent } from '@/components/wellness/WellnessLinksUnificadosContent'

export default function CoachBemEstarLinksPage() {
  return (
    <YladaAreaShell areaCodigo="coach-bem-estar" areaLabel="Coach de bem-estar">
      <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center"><p className="text-sm text-gray-500">Carregando...</p></div>}>
        <WellnessLinksUnificadosContent
          showWellnessNav={false}
          settingsHref="/pt/coach-bem-estar/configuracao"
          navTitle="Links"
          coachBemEstarEmbed
        />
      </Suspense>
    </YladaAreaShell>
  )
}
