'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'
import {
  buildEsteticaLinksRedirectWithTerapia,
  rawEsteticaBibliotecaLinhaFromSearchParams,
} from '@/config/estetica-terapia-biblioteca'

function EsteticaLoginInner() {
  const searchParams = useSearchParams()
  const linhaRaw = rawEsteticaBibliotecaLinhaFromSearchParams(searchParams)
  const redirectPath = buildEsteticaLinksRedirectWithTerapia(linhaRaw)
  return <LoginForm perfil="estetica" redirectPath={redirectPath} />
}

export default function EsteticaLoginClient() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center p-8">
          <p className="text-sm text-gray-500">Carregando…</p>
        </div>
      }
    >
      <EsteticaLoginInner />
    </Suspense>
  )
}
