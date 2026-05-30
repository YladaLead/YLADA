'use client'

import Image from 'next/image'
import { getCountryByCode, inferCountryIsoFromLeadingDigits } from '@/components/CountrySelector'
import {
  PRO_LIDERES_RESET_BENEFICIOS,
  PRO_LIDERES_RESET_FRASE_COMPARTILHAR,
  PRO_LIDERES_RESET_FRASE_RECRUTAMENTO,
  PRO_LIDERES_HOM_VIDEO_POSTER,
  PRO_LIDERES_RESET_VIDEO_POSTER,
  PRO_LIDERES_RESET_WHATSAPP_COMPARTILHAR,
  PRO_LIDERES_RESET_WHATSAPP_PEDIDO,
} from '@/lib/pro-lideres-reset-content'
import type { ParsedOpportunityVideo } from '@/lib/pro-lideres-opportunity-video'
import { buildVimeoEmbedSrc, buildYouTubeEmbedSrc } from '@/lib/pro-lideres-opportunity-video'

export type ProLideresResetPublicClientProps = {
  headline: string
  subheadline: string
  description: string
  memberName: string | null
  parsedVideo: ParsedOpportunityVideo | null
  memberWhatsapp: string | null
  /** Página sacola (padrão) vs. Reset completa (bebida + negócio, sem encomendar). */
  variant?: 'bebida' | 'completa'
  homHeadline?: string
  homSubheadline?: string
  parsedHomVideo?: ParsedOpportunityVideo | null
}

function buildWhatsappUrl(whatsappRaw: string, message: string): string | null {
  const phoneNumber = whatsappRaw.replace(/\D/g, '')
  if (!phoneNumber) return null
  const countryIso = inferCountryIsoFromLeadingDigits(phoneNumber, 'BR')
  const country = getCountryByCode(countryIso)
  const phoneCode = country?.phoneCode ? country.phoneCode.replace(/[^0-9]/g, '') : '55'
  const numeroLimpo = phoneNumber.startsWith(phoneCode)
    ? phoneNumber.substring(phoneCode.length)
    : phoneNumber
  return `https://wa.me/${phoneCode}${numeroLimpo}?text=${encodeURIComponent(message)}`
}

function WhatsappIcon() {
  return (
    <svg className="pl-reset-beneficios__wa-icon" viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg className="pl-reset-beneficios__share-icon" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ResetVideo({
  parsedVideo,
  memberLabel,
  variant = 'vertical',
}: {
  parsedVideo: ParsedOpportunityVideo | null
  memberLabel: string
  variant?: 'vertical' | 'horizontal'
}) {
  const iframeClass =
    variant === 'horizontal' ? 'pl-reset-oportunidade__iframe' : 'pl-reset-bebida__iframe'
  const videoClass =
    variant === 'horizontal' ? 'pl-reset-oportunidade__video' : 'pl-reset-bebida__video'
  const placeholderClass =
    variant === 'horizontal' ? 'pl-reset-oportunidade__placeholder' : 'pl-reset-bebida__placeholder'
  if (parsedVideo?.kind === 'youtube') {
    return (
      <div className="pl-reset-embed-youtube">
        <iframe
          className={iframeClass}
          title={variant === 'horizontal' ? 'Apresentação Reset Metabólico' : 'Reset Metabólico — bebida funcional'}
          src={buildYouTubeEmbedSrc(parsedVideo.videoId)}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    )
  }

  if (parsedVideo?.kind === 'vimeo') {
    return (
      <iframe
        className={iframeClass}
        title={variant === 'horizontal' ? 'Apresentação Reset Metabólico' : 'Reset Metabólico — bebida funcional'}
        src={buildVimeoEmbedSrc(parsedVideo.id)}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    )
  }

  if (parsedVideo?.kind === 'mp4') {
    return (
      <video
        className={videoClass}
        controls
        playsInline
        preload="metadata"
        poster={variant === 'horizontal' ? PRO_LIDERES_HOM_VIDEO_POSTER : PRO_LIDERES_RESET_VIDEO_POSTER}
      >
        <source src={parsedVideo.src} type="video/mp4" />
      </video>
    )
  }

  return (
    <div className={placeholderClass}>
      <span aria-hidden style={{ fontSize: '2rem' }}>
        🎬
      </span>
      <p>Vídeo em breve. Use o botão abaixo para falar com {memberLabel}.</p>
    </div>
  )
}

export default function ProLideresResetPublicClient({
  headline,
  subheadline,
  description,
  memberName,
  parsedVideo,
  memberWhatsapp,
  variant = 'bebida',
  parsedHomVideo = null,
}: ProLideresResetPublicClientProps) {
  const isCompleta = variant === 'completa'
  const memberLabel = memberName?.trim() || 'seu consultor'
  const firstName = memberLabel.split(/\s+/)[0] || memberLabel

  const openWa = (text: string) => {
    if (!memberWhatsapp?.trim()) {
      alert('WhatsApp não disponível no momento.')
      return
    }
    const url = buildWhatsappUrl(memberWhatsapp, text)
    if (!url) {
      alert('WhatsApp não disponível no momento.')
      return
    }
    window.open(url, '_blank')
  }

  const openCompartilhar = () => {
    const pageUrl = typeof window !== 'undefined' ? window.location.href.split('#')[0] : ''
    const msg = `${PRO_LIDERES_RESET_WHATSAPP_COMPARTILHAR}${pageUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  const encomendarReset = () =>
    openWa(
      PRO_LIDERES_RESET_WHATSAPP_PEDIDO.replace(
        'Olá!',
        memberName?.trim() ? `Olá, ${firstName}!` : 'Olá!'
      )
    )

  return (
    <div className="pl-reset-public">
      {/* Hero compacto — logo + tagline, vídeo logo abaixo */}
      <section className="pl-reset-hero" aria-label="Reset Metabólico">
        <div className="pl-reset-hero__bg" aria-hidden />
        <div className="pl-reset-hero__content">
          <h1 className="pl-reset-hero__title">
            <Image
              src="/images/pro-lideres/reset-metabolico-logo.png"
              alt="Litrão — Reset Metabólico"
              width={200}
              height={86}
              className="pl-reset-hero__logo"
              priority
            />
          </h1>
          <div className="pl-reset-swoosh pl-reset-swoosh--bottom" aria-hidden />
          <p className="pl-reset-hero__tagline">{subheadline}</p>
          <p className="pl-reset-hero__desc">{description}</p>
        </div>
      </section>

      {/* Vídeo vertical — seção Bebida */}
      <section id="bebida" className="pl-reset-bebida" aria-label="Vídeo sobre a bebida">
        <div className="pl-reset-bebida__container">
          <div className="pl-reset-bebida__content">
            <div className="pl-reset-bebida__video-wrap">
              <ResetVideo parsedVideo={parsedVideo} memberLabel={memberLabel} />
            </div>
            {isCompleta ? (
              <button
                type="button"
                onClick={encomendarReset}
                className="pl-reset-beneficios__cta pl-reset-bebida__cta-completa"
              >
                <WhatsappIcon />
                Quero meu Reset agora
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* Benefícios + frase sacola + CTA WhatsApp */}
      <section id="beneficios" className="pl-reset-beneficios" aria-labelledby="reset-beneficios-title">
        <div className="pl-reset-beneficios__container">
          <div className="pl-reset-swoosh pl-reset-swoosh--top pl-reset-swoosh--large" aria-hidden />
          <h2 id="reset-beneficios-title" className="pl-reset-beneficios__title">
            Benefícios
          </h2>
          <ul className="pl-reset-beneficios__list">
            {PRO_LIDERES_RESET_BENEFICIOS.map((item) => (
              <li key={item} className="pl-reset-beneficios__item">
                <span className="pl-reset-beneficios__check" aria-hidden>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {!isCompleta ? (
            <button
              id="reset-encomendar"
              type="button"
              onClick={encomendarReset}
              className="pl-reset-beneficios__cta"
            >
              <WhatsappIcon />
              Quero encomendar minha sacola
            </button>
          ) : null}

          {!isCompleta ? (
            <button
              type="button"
              onClick={openCompartilhar}
              className="pl-reset-beneficios__share"
            >
              <ShareIcon />
              <span>{PRO_LIDERES_RESET_FRASE_COMPARTILHAR}</span>
            </button>
          ) : null}

          {!isCompleta ? (
            <p className="pl-reset-beneficios__footnote">
              {headline !== 'Reset Metabólico' ? `${headline} · ` : null}
              {`Ao clicar, você fala no WhatsApp de ${memberLabel}. Seus dados não são armazenados ao assistir ao vídeo.`}
            </p>
          ) : null}
        </div>
      </section>

      {isCompleta ? (
        <section id="oportunidade" className="pl-reset-oportunidade" aria-labelledby="reset-oportunidade-title">
          <div className="pl-reset-oportunidade__container">
            <div className="pl-reset-swoosh pl-reset-swoosh--top pl-reset-swoosh--large" aria-hidden />
            <h2 id="reset-oportunidade-title" className="pl-reset-oportunidade__title">
              Oportunidade de Negócio
            </h2>
            <p className="pl-reset-oportunidade__frase pl-reset-oportunidade__frase--above-video">
              {PRO_LIDERES_RESET_FRASE_RECRUTAMENTO}
            </p>
            <div className="pl-reset-oportunidade__video-wrap">
              <ResetVideo parsedVideo={parsedHomVideo} memberLabel={memberLabel} variant="horizontal" />
            </div>
            <div className="pl-reset-oportunidade__actions pl-reset-oportunidade__actions--after-video">
              <button
                type="button"
                onClick={() => openWa('Olá! 👋\n\nAssisti à apresentação, gostei e quero saber como começar!')}
                className="pl-reset-oportunidade__cta pl-reset-oportunidade__cta--primary pl-reset-oportunidade__cta--gradient"
              >
                🚀 Gostei — quero começar!
              </button>
              <button
                type="button"
                onClick={() =>
                  openWa('Olá! 👋\n\nAssisti à apresentação e gostaria de tirar uma dúvida antes de decidir.')
                }
                className="pl-reset-oportunidade__cta pl-reset-oportunidade__cta--secondary"
              >
                🤔 Tenho uma dúvida
              </button>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  )
}
