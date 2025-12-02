'use client'

import { useState, useEffect } from 'react'
import type { JourneyStats } from '@/types/formacao'
import { canAccessDay, isDayLocked, getNextAvailableDay } from '@/utils/jornada-access'
import type { JornadaProgress } from '@/utils/jornada-access'
import { useAuth } from '@/contexts/AuthContext'

export function useJornadaProgress() {
  const { user } = useAuth()
  const [progress, setProgress] = useState<JornadaProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const userEmail = user?.email || null

  useEffect(() => {
    const carregarProgresso = async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch('/api/nutri/metodo/jornada', {
          credentials: 'include'
        })

        if (!res.ok) {
          throw new Error('Erro ao carregar progresso')
        }

        const data = await res.json()
        if (data.success && data.data?.stats) {
          const stats = data.data.stats
          setProgress({
            current_day: stats.current_day || 1,
            completed_days: stats.completed_days || 0,
            total_days: stats.total_days || 30
          })
        } else {
          // Se não há progresso, inicializar
          setProgress({
            current_day: 1,
            completed_days: 0,
            total_days: 30
          })
        }
      } catch (err: any) {
        console.error('Erro ao carregar progresso:', err)
        setError(err.message || 'Erro ao carregar progresso')
        // Em caso de erro, permitir acesso ao dia 1
        setProgress({
          current_day: 1,
          completed_days: 0,
          total_days: 30
        })
      } finally {
        setLoading(false)
      }
    }

    carregarProgresso()
  }, [])

  const refreshProgress = async () => {
    try {
      const res = await fetch('/api/nutri/metodo/jornada', {
        credentials: 'include'
      })

      if (res.ok) {
        const data = await res.json()
        if (data.success && data.data?.stats) {
          const stats = data.data.stats
          setProgress({
            current_day: stats.current_day || 1,
            completed_days: stats.completed_days || 0,
            total_days: stats.total_days || 30
          })
        }
      }
    } catch (err) {
      console.error('Erro ao atualizar progresso:', err)
    }
  }

  return {
    progress,
    loading,
    error,
    canAccessDay: (day: number) => canAccessDay(day, progress, userEmail),
    isDayLocked: (day: number) => isDayLocked(day, progress, userEmail),
    getNextAvailableDay: () => getNextAvailableDay(progress),
    refreshProgress,
    userEmail // Expor e-mail para uso em componentes
  }
}

