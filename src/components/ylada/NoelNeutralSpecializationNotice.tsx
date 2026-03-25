'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { NOEL_NEUTRAL_SPECIALIZATION_NOTICE } from '@/config/noel-ux-content'
import type { NoelArea } from '@/config/noel-ux-content'

const STORAGE_PREFIX = 'ylada_noel_neutral_notice_v1'

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}_${userId}`
}

function isNeutralPerfil(perfil: string | null | undefined): boolean {
  return perfil === 'ylada' || perfil === 'outros'
}

/**
 * Recepção do Noel em /pt/home: aviso para quem ainda não tem segmento definido (ylada/outros).
 * Exibido uma vez por usuário (localStorage); botão "Entendi" dispensa.
 */
export default function NoelNeutralSpecializationNotice({ mentorArea }: { mentorArea: NoelArea }) {
  const { user, userProfile, loading } = useAuth()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (loading || !user?.id) return
    if (mentorArea !== 'ylada') return
    if (!userProfile || !isNeutralPerfil(userProfile.perfil)) return

    try {
      if (typeof window !== 'undefined' && localStorage.getItem(storageKey(user.id)) === '1') {
        return
      }
    } catch {
      /* private mode / quota */
    }
    setVisible(true)
  }, [loading, user?.id, userProfile, mentorArea])

  const dismiss = () => {
    if (user?.id) {
      try {
        localStorage.setItem(storageKey(user.id), '1')
      } catch {
        /* ignore */
      }
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="mb-4 rounded-xl border border-amber-200/90 bg-amber-50 px-3 py-3 sm:px-4 text-sm text-amber-950 shadow-sm"
      role="status"
    >
      <p className="leading-relaxed">{NOEL_NEUTRAL_SPECIALIZATION_NOTICE}</p>
      <button
        type="button"
        onClick={dismiss}
        className="mt-3 text-sm font-semibold text-amber-900 underline underline-offset-2 hover:text-amber-950"
      >
        Entendi
      </button>
    </div>
  )
}
