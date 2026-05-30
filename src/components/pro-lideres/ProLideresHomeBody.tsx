'use client'

import Link from 'next/link'
import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { buildProLideresYladaInteresseWhatsappUrl } from '@/lib/pro-lideres-reset-content'
import {
  PRO_LIDERES_LANDING_AFTER,
  PRO_LIDERES_LANDING_AUDIENCE,
  PRO_LIDERES_LANDING_BEFORE,
  PRO_LIDERES_LANDING_PAINS,
  PRO_LIDERES_LANDING_PILLARS,
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
          <span className="pl-landing__eyebrow">Ylada Pro Líderes</span>
          <h1 className="pl-landing__title">
            Sua equipe trava na hora de falar com o cliente?
          </h1>
          <p className="pl-landing__subtitle">
            Você não precisa de mais motivação. Precisa de um sistema que cada pessoa da equipe consiga
            repetir — link, mensagem e rotina — sem depender de você o tempo todo.
          </p>
          <p className="pl-landing__proof">
            Páginas prontas de divulgação, scripts no WhatsApp e tarefas diárias — tudo personalizado por
            membro, com visão clara para quem lidera.
          </p>
          <div className="pl-landing__swoosh" aria-hidden />
        </header>

        <section className="pl-landing__section" aria-labelledby="pl-landing-dores">
          <h2 id="pl-landing-dores" className="pl-landing__section-title">
            Se isso acontece no seu time
          </h2>
          <p className="pl-landing__section-lead">Reconhece alguma dessas situações?</p>
          <div className="pl-landing__pain-grid">
            {PRO_LIDERES_LANDING_PAINS.map((pain) => (
              <article key={pain.title} className="pl-landing__pain-card">
                <div className="pl-landing__pain-emoji" aria-hidden>
                  {pain.emoji}
                </div>
                <h3 className="pl-landing__pain-title">{pain.title}</h3>
                <p className="pl-landing__pain-text">{pain.text}</p>
              </article>
            ))}
          </div>
          <p className="pl-landing__bridge">
            Não é falta de esforço — é falta de sistema repetível que qualquer pessoa consiga seguir.
          </p>
        </section>

        <section className="pl-landing__section pl-landing__section--alt" aria-labelledby="pl-landing-pilares">
          <h2 id="pl-landing-pilares" className="pl-landing__section-title">
            O que o Pro Líderes entrega
          </h2>
          <p className="pl-landing__section-lead">
            A mesma lógica das páginas que você viu — só que para toda a equipe, com controle para você.
          </p>
          <div className="pl-landing__pillar-grid">
            {PRO_LIDERES_LANDING_PILLARS.map((pillar) => (
              <article key={pillar.title} className="pl-landing__pillar">
                <div className="pl-landing__pillar-emoji" aria-hidden>
                  {pillar.emoji}
                </div>
                <h3 className="pl-landing__pillar-title">{pillar.title}</h3>
                <p className="pl-landing__pillar-text">{pillar.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pl-landing__section pl-landing__section--dark" aria-labelledby="pl-landing-compare">
          <h2 id="pl-landing-compare" className="pl-landing__section-title">
            Antes × Depois
          </h2>
          <p className="pl-landing__section-lead">O que muda quando você estrutura a operação</p>
          <div className="pl-landing__compare">
            <div className="pl-landing__compare-col pl-landing__compare-col--before">
              <p className="pl-landing__compare-label">Antes</p>
              <ul className="pl-landing__compare-list">
                {PRO_LIDERES_LANDING_BEFORE.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="pl-landing__compare-col pl-landing__compare-col--after">
              <p className="pl-landing__compare-label">Depois</p>
              <ul className="pl-landing__compare-list">
                {PRO_LIDERES_LANDING_AFTER.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="pl-landing__section" aria-labelledby="pl-landing-audiencia">
          <h2 id="pl-landing-audiencia" className="pl-landing__section-title">
            Para quem é
          </h2>
          <ul className="pl-landing__audience-list">
            {PRO_LIDERES_LANDING_AUDIENCE.map((item) => (
              <li key={item}>
                <span aria-hidden>→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="pl-landing__cta-block" aria-label="Falar com a Ylada">
          <button type="button" onClick={handleInteresse} className="pl-landing__cta-primary">
            Tenho interesse — falar no WhatsApp
          </button>
          <p className="pl-landing__cta-hint">Resposta humana. Sem compromisso.</p>
          <Link href="/pro-lideres/entrar" className="pl-landing__cta-secondary">
            Já sou cliente — entrar no painel
          </Link>
        </section>

        <footer className="pl-landing__footer">
          <Link href="/pro-lideres/acompanhar">Acompanhar o que já existe</Link>
          <span aria-hidden> · </span>
          <span>Página pública, sem login</span>
        </footer>
      </div>
    </div>
  )
}
