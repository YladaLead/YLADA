import { Suspense } from 'react'
import ProEsteticaCorporalNoelClient from './ProEsteticaCorporalNoelClient'

export default function ProEsteticaCorporalNoelPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center p-6 text-sm text-gray-500">Carregando o Noel…</div>}>
      <ProEsteticaCorporalNoelClient />
    </Suspense>
  )
}
