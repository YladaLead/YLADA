'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ComecarPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/pt/escolha-perfil')
  }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecionando...</p>
    </div>
  )
}
