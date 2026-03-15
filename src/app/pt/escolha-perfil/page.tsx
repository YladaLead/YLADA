'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Página descontinuada — redireciona para cadastro.
 * A área é definida ao preencher o perfil, não na escolha inicial.
 */
export default function EscolhaPerfilPage() {
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
