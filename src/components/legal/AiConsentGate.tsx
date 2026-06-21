'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { isNativeApp } from '@/lib/native-app'

/**
 * Portão de consentimento de IA (Apple 5.1.1 / 5.1.2 + LGPD).
 *
 * Mostra, UMA vez, um aviso + opt-in antes de o usuário usar qualquer recurso
 * de IA do app (Noel, criação de fluxo com IA, etc.). O que o usuário escreve
 * nessas ferramentas é enviado a um provedor de IA de terceiros só para gerar a
 * resposta — a Apple exige que isso seja divulgado e consentido.
 *
 * Escopo: apps nativos (iOS Capacitor + Android TWA) — fecha a exigência da
 * App Review (Apple 5.1.1) e atende LGPD/Google. Na web segue sem o portão
 * (pode ampliar trocando `isNativeApp()` por sempre-true se quiser na web).
 *
 * "Concordo" grava o consentimento (tabela user_consents via /api/consent) e
 * não pergunta de novo. "Agora não" fecha e o app segue funcionando (a IA fica
 * desligada até o usuário concordar); o aviso volta na próxima sessão.
 */

const CONSENT_TYPE = 'ai'
const CONSENT_VERSION = '1.0'
const SNOOZE_KEY = 'ylada_ai_consent_snooze_v1'

export default function AiConsentGate() {
  const { user, loading } = useAuth()
  const authenticatedFetch = useAuthenticatedFetch()
  const [show, setShow] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (loading || !user || checked) return
    // Só dentro de app nativo (iOS Capacitor ou Android TWA) — ver doc do componente.
    if (typeof window === 'undefined' || !isNativeApp()) {
      setChecked(true)
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const res = await authenticatedFetch('/api/consent')
        const json = (await res.json().catch(() => ({}))) as {
          data?: Array<{ consent_type?: string; granted?: boolean }>
        }
        const alreadyGranted = Boolean(
          json?.data?.some((c) => c.consent_type === CONSENT_TYPE && c.granted === true)
        )
        if (cancelled) return
        let snoozed = false
        try {
          snoozed = sessionStorage.getItem(SNOOZE_KEY) === '1'
        } catch {
          /* ignore */
        }
        if (!alreadyGranted && !snoozed) setShow(true)
      } catch {
        // Em caso de erro de rede não trava o app; tenta de novo na próxima sessão.
      } finally {
        if (!cancelled) setChecked(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [loading, user, checked, authenticatedFetch])

  const concordar = useCallback(async () => {
    if (submitting) return
    setSubmitting(true)
    try {
      const res = await authenticatedFetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consentType: CONSENT_TYPE, version: CONSENT_VERSION, granted: true }),
      })
      if (res.ok) {
        setShow(false)
      }
    } catch {
      // Mantém o modal aberto para o usuário tentar de novo.
    } finally {
      setSubmitting(false)
    }
  }, [authenticatedFetch, submitting])

  const agoraNao = useCallback(() => {
    try {
      sessionStorage.setItem(SNOOZE_KEY, '1')
    } catch {
      /* ignore */
    }
    setShow(false)
  }, [])

  if (!show) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[9999] px-3"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 0.75rem)' }}
      role="dialog"
      aria-live="polite"
      aria-label="Aviso de uso de inteligência artificial"
    >
      <div className="mx-auto max-w-md rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
        <p className="text-[11px] leading-snug text-gray-500">
          Usamos IA para gerar respostas; seus textos vão a um provedor de IA.{' '}
          <Link href="/pt/politica-de-privacidade" className="font-medium text-sky-700 underline">
            Privacidade
          </Link>
        </p>
        <div className="mt-2 flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={agoraNao}
            disabled={submitting}
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-60"
          >
            Agora não
          </button>
          <button
            type="button"
            onClick={concordar}
            disabled={submitting}
            className="rounded-lg bg-sky-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-sky-700 disabled:opacity-60"
          >
            {submitting ? 'Salvando…' : 'Concordo'}
          </button>
        </div>
      </div>
    </div>
  )
}
