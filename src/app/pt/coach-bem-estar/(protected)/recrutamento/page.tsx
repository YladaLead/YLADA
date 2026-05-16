import { Suspense } from 'react'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import CoachBemEstarRecrutamentoLinks from '@/components/coach-bem-estar/CoachBemEstarRecrutamentoLinks'

export default function CoachBemEstarRecrutamentoPage() {
  return (
    <YladaAreaShell areaCodigo="coach-bem-estar" areaLabel="Coach de bem-estar">
      <div className="mx-auto max-w-4xl">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">Opcional</p>
        <h1 className="mt-1 text-xl font-semibold text-gray-800">Recrutamento</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Fluxos de recrutamento prontos para compartilhar. Copie o link e envie para quem pode ter interesse
          em trabalhar com saúde e bem-estar.
        </p>

        <Suspense
          fallback={
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
            </div>
          }
        >
          <CoachBemEstarRecrutamentoLinks />
        </Suspense>
      </div>
    </YladaAreaShell>
  )
}
