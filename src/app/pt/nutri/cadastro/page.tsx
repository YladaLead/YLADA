'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

/**
 * Componente interno que usa useSearchParams
 */
function NutriCadastroContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Pegar parâmetro de plano se existir
    // Nutri vende apenas plano anual (sem trial de 3 dias)
    const plan = searchParams.get('plan') || 'annual'
    
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

/**
 * Página de cadastro Nutri
 * Redireciona automaticamente para a página de checkout
 * Mantém compatibilidade com links antigos que apontam para /pt/nutri/cadastro
 */
export default function NutriCadastroPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    }>
      <NutriCadastroContent />
    </Suspense>
  )
}
