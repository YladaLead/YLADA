/**
 * Hook para buscar perfil do distribuidor Wellness
 * Inclui WhatsApp e outras informações do perfil
 */

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/wellness/profile', {
          credentials: 'include',
          cache: 'no-store'
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
            userSlug: data.profile.userSlug || ''
          })
        }
      } catch (err: any) {
        console.error('Erro ao buscar perfil Wellness:', err)
        setError(err.message || 'Erro ao carregar perfil')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  return { profile, loading, error }
}

