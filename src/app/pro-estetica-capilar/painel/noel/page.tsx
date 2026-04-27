import { Suspense } from 'react'
import ProEsteticaCapilarNoelClient from './ProEsteticaCapilarNoelClient'

export default function ProEsteticaCapilarNoelPage() {
  return (
    <Suspense
      fallback={<div className="flex min-h-[40vh] items-center justify-center p-6 text-sm text-gray-500">A carregar o Noel...</div>}
    >
      <ProEsteticaCapilarNoelClient />
    </Suspense>
  )
}
