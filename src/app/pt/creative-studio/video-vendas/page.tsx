'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function VideoVendasPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirecionar para o editor - o assistente tem botões de ação rápida
    router.push('/pt/creative-studio/editor')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando para o editor...</p>
      </div>
    </div>
  )
}

