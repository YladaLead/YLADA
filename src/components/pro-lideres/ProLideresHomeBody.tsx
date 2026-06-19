'use client'

import Link from 'next/link'
import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { buildProLideresYladaInteresseWhatsappUrl } from '@/lib/pro-lideres-reset-content'
import {
  PRO_LIDERES_LANDING_CTA_HINT,
  PRO_LIDERES_LANDING_CTA_PRIMARY,
  PRO_LIDERES_LANDING_HEADLINE,
  PRO_LIDERES_LANDING_LEAD,
  PRO_LIDERES_LANDING_PHILOSOPHY_INTRO,
  PRO_LIDERES_LANDING_PHILOSOPHY_TEXT,
  PRO_LIDERES_LANDING_PHILOSOPHY_TITLE,
  PRO_LIDERES_LANDING_QUESTIONS,
  PRO_LIDERES_LANDING_SECONDARY_CTA,
} from '@/lib/pro-lideres-landing-content'

function renderHeadline(text: string) {
  const token = '10X'
  const idx = text.indexOf(token)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <span className="pl-landing__title-highlight">{token}</span>
      {text.slice(idx + token.length)}
    </>
  )
}

function WhatsappIcon() {
  return (
    <svg className="pl-landing__wa-icon" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function ProLideresHomeBody() {
  const searchParams = useSearchParams()
  const source = searchParams.get('source')
  const interesseHref = buildProLideresYladaInteresseWhatsappUrl(source)

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
        <header className="pl-landing__hero">
          <p className="pl-landing__eyebrow">Ylada Pro Líderes</p>
          <h1 className="pl-landing__title">{renderHeadline(PRO_LIDERES_LANDING_HEADLINE)}</h1>
          {PRO_LIDERES_LANDING_LEAD && (
            <p className="pl-landing__lead">{PRO_LIDERES_LANDING_LEAD}</p>
          )}
        </header>

        {PRO_LIDERES_LANDING_QUESTIONS.length > 0 && (
          <section className="pl-landing__questions" aria-label="Perguntas para o líder">
            <ul className="pl-landing__question-list">
              {PRO_LIDERES_LANDING_QUESTIONS.map((question) => (
                <li key={question} className="pl-landing__question-item">
                  {question}
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="pl-landing__philosophy" aria-labelledby="pl-landing-filosofia">
          <h2 id="pl-landing-filosofia" className="pl-landing__philosophy-title">
            {PRO_LIDERES_LANDING_PHILOSOPHY_TITLE}
          </h2>
          <p className="pl-landing__philosophy-intro">{PRO_LIDERES_LANDING_PHILOSOPHY_INTRO}</p>
          <p className="pl-landing__philosophy-text">{PRO_LIDERES_LANDING_PHILOSOPHY_TEXT}</p>
        </section>

        <section className="pl-landing__cta-block" aria-label="Falar com a Ylada">
          <button type="button" onClick={handleInteresse} className="pl-landing__cta-primary">
            <WhatsappIcon />
            {PRO_LIDERES_LANDING_CTA_PRIMARY}
          </button>
          <p className="pl-landing__cta-hint">{PRO_LIDERES_LANDING_CTA_HINT}</p>
        </section>
      </div>
    </div>
  )
}
