'use client'

import Link from 'next/link'
import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { buildProLideresYladaInteresseWhatsappUrl } from '@/lib/pro-lideres-reset-content'
import {
  PRO_LIDERES_LANDING_BRIDGE,
  PRO_LIDERES_LANDING_CTA_HINT,
  PRO_LIDERES_LANDING_CTA_PRIMARY,
  PRO_LIDERES_LANDING_QUESTIONS,
  PRO_LIDERES_LANDING_SOURCE_BANNERS,
} from '@/lib/pro-lideres-landing-content'

export function ProLideresHomeBody() {
  const searchParams = useSearchParams()
  const source = searchParams.get('source')
  const interesseHref = buildProLideresYladaInteresseWhatsappUrl(source)
  const sourceBanner = source ? PRO_LIDERES_LANDING_SOURCE_BANNERS[source] : null

  const handleInteresse = useCallback(async () => {
    try {
      await fetch('/api/pro-lideres/interesse-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: source || 'pro-lideres' }),
      })
    } catch {
      /* WhatsApp abre mesmo se o e-mail falhar */
    }
    window.open(interesseHref, '_blank', 'noopener,noreferrer')
  }, [interesseHref, source])

  return (
    <div className="pl-landing">
      <div className="pl-landing__wrap">
        {sourceBanner ? (
          <p className="pl-landing__source-banner" role="note">
            {sourceBanner}
          </p>
        ) : null}

        <header className="pl-landing__hero">
          <p className="pl-landing__eyebrow">Ylada Pro Líderes</p>
          <h1 className="pl-landing__title">Boas conversas começam com boas perguntas.</h1>
          <p className="pl-landing__lead">Você lidera uma equipe em campo. Alguma dessas ecoa?</p>
        </header>

        <section className="pl-landing__questions" aria-label="Perguntas para reflexão">
          <ul className="pl-landing__question-list">
            {PRO_LIDERES_LANDING_QUESTIONS.map((question) => (
              <li key={question} className="pl-landing__question-item">
                {question}
              </li>
            ))}
          </ul>
        </section>

        <p className="pl-landing__bridge">{PRO_LIDERES_LANDING_BRIDGE}</p>

        <section className="pl-landing__cta-block" aria-label="Falar com a Ylada">
          <button type="button" onClick={handleInteresse} className="pl-landing__cta-primary">
            {PRO_LIDERES_LANDING_CTA_PRIMARY}
          </button>
          <p className="pl-landing__cta-hint">{PRO_LIDERES_LANDING_CTA_HINT}</p>
          <Link href="/pro-lideres/entrar" className="pl-landing__cta-secondary">
            Já sou cliente — entrar no painel
          </Link>
        </section>

        <footer className="pl-landing__footer">
          <Link href="/pro-lideres/acompanhar">Acompanhar o que já existe</Link>
        </footer>
      </div>
    </div>
  )
}
