import { Suspense } from 'react'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelChatWithParams from '@/components/ylada/NoelChatWithParams'

export default function MatrixHomePage() {
  return (
    <YladaAreaShell areaCodigo="ylada" areaLabel="YLADA">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Noel</h1>
        <p className="text-gray-600 mb-4">
          Seu mentor. Tire dúvidas, organize a rotina e use melhor seus links inteligentes.
        </p>
        <Suspense fallback={<div className="mt-4 h-32 rounded-lg bg-gray-100 animate-pulse" />}>
          <NoelChatWithParams area="ylada" className="mt-2" />
        </Suspense>
      </div>
    </YladaAreaShell>
  )
}
