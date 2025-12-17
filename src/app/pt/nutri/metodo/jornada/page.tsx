'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useJornadaProgress } from '@/hooks/useJornadaProgress'

export default function JornadaPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { progress, loading: progressLoading } = useJornadaProgress()

  useEffect(() => {
    if (authLoading || progressLoading) return

    // Se não tem progresso, redirecionar para Dia 1
    if (!progress || !progress.current_day) {
      router.replace('/pt/nutri/metodo/jornada/dia/1')
      return
    }

    // Se tem progresso, redirecionar para o dia atual
    router.replace(`/pt/nutri/metodo/jornada/dia/${progress.current_day}`)
  }, [authLoading, progressLoading, progress, router])

  // Loading state
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Carregando jornada...</p>
      </div>
    </div>
  )
}
