import { Suspense } from 'react'
import { ProLideresHomeBody } from '@/components/pro-lideres/ProLideresHomeBody'

export default function ProLideresHomePage() {
  return (
    <Suspense fallback={<div className="py-12 text-center text-sm text-gray-400">Carregando…</div>}>
      <ProLideresHomeBody />
    </Suspense>
  )
}
