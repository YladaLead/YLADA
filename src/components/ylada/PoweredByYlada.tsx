'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { isReferralLoopEnabled } from '@/lib/referrals/referral-loop-flag'
import { buildReferralLandingUrl } from '@/lib/referrals/referral-url'
import { fetchReferralCodeForSeal } from '@/lib/referrals/referral-client'

/**
 * Rodapé "Powered by YLADA" para resultados de diagnóstico.
 * Objetivos: proteção institucional/jurídica e crescimento orgânico (duplicação / loop).
 * Variante compact: texto neutro + domínio em sky (parece link); clique em toda a linha.
 * Exibir antes do DiagnosisDisclaimer na ordem final da página.
 *
 * Loop (Spec_Loop_KFactor): com a flag ON e `linkSlug` em escopo, o destino vira a
 * página dedicada /criar carregando o ?ref do indicador. Flag OFF / sem code →
 * fallback no destino antigo (/pt?source=diagnostico). Adição compatível e inerte.
 * @see DiagnosisDisclaimer.tsx
 */

const YLADA_HOME_SOURCE = '/pt?source=diagnostico'

type Props = {
  /** 'full' = bloco completo com frases jurídicas (onde o contato do profissional vê); 'fullCaptacao' = só curiosidade + CTA, sem jurídico (página de venda/captação); 'compact' = só link */
  variant?: 'full' | 'fullCaptacao' | 'compact'
  className?: string
  /** slug do link em exibição — habilita o destino do loop (?ref) quando a flag está ON. */
  linkSlug?: string | null
}

/** Resolve o destino do selo: loop (com ref) quando ligado, senão o destino antigo. */
function useReferralAwareHref(linkSlug?: string | null): string {
  const [href, setHref] = useState<string>(YLADA_HOME_SOURCE)

  useEffect(() => {
    if (!isReferralLoopEnabled() || !linkSlug) return
    let active = true
    const plToken = new URLSearchParams(window.location.search).get('pl_m')?.trim() || null
    void fetchReferralCodeForSeal(linkSlug, plToken).then((code) => {
      if (active && code) setHref(buildReferralLandingUrl({ code, source: 'diagnostico' }))
    })
    return () => {
      active = false
    }
  }, [linkSlug])

  return href
}

export default function PoweredByYlada({ variant = 'compact', className = '', linkSlug = null }: Props) {
  const href = useReferralAwareHref(linkSlug)

  if (variant === 'compact') {
    return (
      <div
        className={`mt-4 pt-4 border-t border-gray-100 text-center ${className}`}
        role="contentinfo"
        aria-label="Plataforma que gerou o diagnóstico"
      >
        <Link
          href={href}
          className="group inline-flex flex-wrap items-baseline justify-center gap-x-1 text-sm font-medium text-center"
        >
          <span className="text-gray-600">Powered by</span>
          <span className="text-sky-600 underline-offset-2 transition-colors group-hover:text-sky-700 group-hover:underline">
            ylada.com
          </span>
        </Link>
      </div>
    )
  }

  const isCaptacao = variant === 'fullCaptacao'

  return (
    <div
      className={`bg-gray-50 rounded-xl p-6 border border-gray-100 text-center ${className}`}
      role="contentinfo"
      aria-label="Plataforma que gerou o diagnóstico"
    >
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
        Powered by YLADA
      </p>
      <p className="text-sm text-gray-600 leading-relaxed mb-2">
        Este diagnóstico foi gerado pela plataforma YLADA – Your Leading Advanced Data Assistant.
      </p>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        O YLADA ajuda profissionais a criar diagnósticos inteligentes para iniciar conversas com mais contexto e atrair clientes mais preparados.
      </p>
      {!isCaptacao && (
        <>
          <p className="text-sm text-gray-600 leading-relaxed mb-1">
            Os resultados apresentados aqui têm caráter informativo e educativo, baseados exclusivamente nas respostas fornecidas.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Eles não substituem avaliação profissional, consultoria especializada ou orientação personalizada.
          </p>
        </>
      )}
      {isCaptacao && <div className="mb-5" />}
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors"
      >
        <span>👉</span>
        <span>Criar diagnósticos como este</span>
      </Link>
    </div>
  )
}
