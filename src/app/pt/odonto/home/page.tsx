import { Suspense } from 'react'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import NoelChatWithParams from '@/components/ylada/NoelChatWithParams'

export default function OdontoHomePage() {
  return (
    <YladaAreaShell areaCodigo="odonto" areaLabel="Odontologia">
      <div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Noel</h1>
        <p className="text-gray-600 mb-4">
          Seu mentor para odontologia. Tire dúvidas, organize a rotina e use melhor seus links inteligentes para captação de pacientes.
        </p>
        <Suspense fallback={<div className="mt-4 h-32 rounded-lg bg-gray-100 animate-pulse" />}>
          <NoelChatWithParams area="odonto" className="mt-2" />
        </Suspense>
      </div>
    </YladaAreaShell>
  )
}
