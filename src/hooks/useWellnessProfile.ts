/**
 * Hook para buscar perfil do distribuidor Wellness / Coach de bem-estar
 * Inclui WhatsApp e outras informações do perfil (user_slug pode ser gerado no GET da API)
 */

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface WellnessProfile {
  nome: string
  email: string
  whatsapp: string
  countryCode: string
  bio: string
  userSlug: string
}

export function useWellnessProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<WellnessProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadProfile = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/wellness/profile', {
        credentials: 'include',
        cache: 'no-store',
        signal,
      })

      if (!response.ok) {
        throw new Error('Erro ao carregar perfil')
      }

      const data = await response.json()

      if (data.profile) {
        setProfile({
          nome: data.profile.nome || '',
          email: data.profile.email || '',
          whatsapp: data.profile.whatsapp || '',
          countryCode: data.profile.countryCode || 'BR',
          bio: data.profile.bio || '',
          userSlug: data.profile.userSlug || '',
        })
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.warn('Timeout ao carregar perfil Wellness')
      } else {
        console.error('Erro ao buscar perfil Wellness:', err)
        setError(err instanceof Error ? err.message : 'Erro ao carregar perfil')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const abortController = new AbortController()
    const timeoutId = setTimeout(() => {
      abortController.abort()
    }, 10000)

    loadProfile(abortController.signal)

    return () => {
      clearTimeout(timeoutId)
      abortController.abort()
    }
  }, [user, loadProfile])

  const refetch = useCallback(async () => {
    if (!user) return
    await loadProfile()
  }, [user, loadProfile])

  return { profile, loading, error, refetch }
}
