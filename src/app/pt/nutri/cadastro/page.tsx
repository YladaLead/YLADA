'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * Página de cadastro Nutri
 * Redireciona automaticamente para a página de checkout
 * Mantém compatibilidade com links antigos que apontam para /pt/nutri/cadastro
 */
export default function NutriCadastroPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Pegar parâmetro de plano se existir
    const plan = searchParams.get('plan') || 'monthly'
    
    // Redirecionar para checkout mantendo parâmetros
    const checkoutUrl = `/pt/nutri/checkout?plan=${plan}`
    router.replace(checkoutUrl)
  }, [router, searchParams])

  // Mostrar loading enquanto redireciona
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando para o checkout...</p>
      </div>
    </div>
  )
}
