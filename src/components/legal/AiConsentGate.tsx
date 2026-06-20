'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch'
import { isIOSNativeApp } from '@/lib/native-app'

/**
 * Portão de consentimento de IA (Apple 5.1.1 / 5.1.2 + LGPD).
 *
 * Mostra, UMA vez, um aviso + opt-in antes de o usuário usar qualquer recurso
 * de IA do app (Noel, criação de fluxo com IA, etc.). O que o usuário escreve
 * nessas ferramentas é enviado a um provedor de IA de terceiros só para gerar a
 * resposta — a Apple exige que isso seja divulgado e consentido.
 *
 * Escopo atual: APENAS o app iOS nativo (Capacitor) — é o que a App Review
 * precisa ver. Para ligar também no Android (TWA) ou na web (LGPD), basta
 * remover/ampliar a checagem `isIOSNativeApp()` abaixo.
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
    // Só dentro do app iOS nativo por enquanto (ver doc do componente).
    if (typeof window === 'undefined' || !isIOSNativeApp()) {
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
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-consent-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 id="ai-consent-title" className="text-lg font-bold text-gray-900">
          Este app usa inteligência artificial
        </h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-gray-700">
          <p>
            O YLADA usa inteligência artificial pra te ajudar a criar diagnósticos, escrever conteúdo e
            usar o assistente Noel.
          </p>
          <p>
            O que você escreve nessas ferramentas é enviado a um provedor de inteligência artificial só
            pra gerar a resposta. Evite incluir dados sensíveis de terceiros sem autorização. Detalhes na
            nossa{' '}
            <Link
              href="/pt/politica-de-privacidade"
              className="font-medium text-sky-700 underline"
            >
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            onClick={concordar}
            disabled={submitting}
            className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 disabled:opacity-60"
          >
            {submitting ? 'Salvando…' : 'Concordo e continuar'}
          </button>
          <button
            type="button"
            onClick={agoraNao}
            disabled={submitting}
            className="w-full rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 disabled:opacity-60"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  )
}
