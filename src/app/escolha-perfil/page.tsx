'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Página descontinuada — redireciona para cadastro.
 */
export default function EscolhaPerfilRootPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/pt/cadastro')
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-gray-500">Redirecionando...</p>
    </div>
  )
}
