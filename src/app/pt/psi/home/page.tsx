import { Suspense } from 'react'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelChatWithParams from '@/components/ylada/NoelChatWithParams'

export default function PsiHomePage() {
  return (
    <YladaAreaShell areaCodigo="psi" areaLabel="Psicologia">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Noel</h1>
        <p className="text-gray-600 mb-4">
          Seu mentor para psicologia. Tire dúvidas, organize a rotina e use melhor seus links inteligentes para captação de clientes.
        </p>
        <Suspense fallback={<div className="mt-4 h-32 rounded-lg bg-gray-100 animate-pulse" />}>
          <NoelChatWithParams area="psi" className="mt-2" />
        </Suspense>
      </div>
    </YladaAreaShell>
  )
}
