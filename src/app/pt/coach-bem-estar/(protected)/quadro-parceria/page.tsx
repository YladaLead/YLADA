import { Suspense } from 'react'
import YladaAreaShell from '@/components/ylada/YladaAreaShell'
import { CoachBemEstarQuadroParceriaContent } from '@/components/coach-bem-estar/CoachBemEstarQuadroParceriaContent'

export const metadata = {
  title: 'Quadro parceria | Coach de bem-estar',
  description: 'Gere um quadro imprimível com QR codes dos seus links para compartilhar com parceiros.',
}

export default function CoachBemEstarQuadroParceriaPage() {
  return (
    <YladaAreaShell areaCodigo="coach-bem-estar" areaLabel="Coach de bem-estar">
      <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center"><p className="text-sm text-gray-500">Carregando...</p></div>}>
        <CoachBemEstarQuadroParceriaContent />
      </Suspense>
    </YladaAreaShell>
  )
}
