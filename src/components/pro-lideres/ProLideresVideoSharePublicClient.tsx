'use client'

import Image from 'next/image'
import { getCountryByCode, inferCountryIsoFromLeadingDigits } from '@/components/CountrySelector'
import type { ParsedOpportunityVideo } from '@/lib/pro-lideres-opportunity-video'
import { buildVimeoEmbedSrc, buildYouTubeEmbedSrc } from '@/lib/pro-lideres-opportunity-video'
import ProLideresResetYladaFooter from '@/components/pro-lideres/ProLideresResetYladaFooter'

export type ProLideresVideoSharePublicClientProps = {
  headline: string
  subheadline: string
  memberName: string | null
  memberWhatsapp: string | null
  parsedVideo: ParsedOpportunityVideo | null
  poster: string
  videoTitle: string
  ctaPrimaryLabel: string
  ctaPrimaryMessage: string
  ctaSecondaryLabel: string
  ctaSecondaryMessage: string
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

function ShareVideo({
  parsedVideo,
  poster,
  memberLabel,
  videoTitle,
}: {
  parsedVideo: ParsedOpportunityVideo | null
  poster: string
  memberLabel: string
  videoTitle: string
}) {
  if (parsedVideo?.kind === 'youtube') {
    return (
      <div className="pl-reset-embed-youtube">
        <iframe
          className="pl-reset-oportunidade__iframe"
          title={videoTitle}
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
        className="pl-reset-oportunidade__iframe"
        title={videoTitle}
        src={buildVimeoEmbedSrc(parsedVideo.id)}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    )
  }

  if (parsedVideo?.kind === 'mp4') {
    return (
      <video
        className="pl-reset-oportunidade__video"
        controls
        playsInline
        preload="metadata"
        {...(poster ? { poster } : {})}
      >
        <source src={parsedVideo.src} type="video/mp4" />
      </video>
    )
  }

  return (
    <div className="pl-reset-oportunidade__placeholder">
      <span aria-hidden style={{ fontSize: '2rem' }}>
        🎬
      </span>
      <p>Vídeo em breve. Use os botões abaixo para falar com {memberLabel}.</p>
    </div>
  )
}

export default function ProLideresVideoSharePublicClient({
  headline,
  subheadline,
  memberWhatsapp,
  parsedVideo,
  memberName,
  poster,
  videoTitle,
  ctaPrimaryLabel,
  ctaPrimaryMessage,
  ctaSecondaryLabel,
  ctaSecondaryMessage,
}: ProLideresVideoSharePublicClientProps) {
  const memberLabel = memberName?.trim() || 'seu consultor'

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

  return (
    <div className="pl-reset-public pl-reset-hom-page">
      <section className="pl-reset-hero" aria-label={headline}>
        <div className="pl-reset-hero__bg" aria-hidden />
        <div className="pl-reset-hero__content">
          <h1 className="pl-reset-hero__title">
            <Image
              src="/images/pro-lideres/reset-metabolico-logo.png"
              alt="Reset Metabólico"
              width={140}
              height={60}
              className="pl-reset-hero__logo pl-reset-hero__logo--hom"
              priority
            />
          </h1>
          <div className="pl-reset-swoosh pl-reset-swoosh--bottom" aria-hidden />
          <p className="pl-reset-hero__headline">{headline}</p>
          {subheadline ? (
            <p className="pl-reset-hero__tagline pl-reset-hero__tagline--hom">{subheadline}</p>
          ) : null}
        </div>
      </section>

      <section className="pl-reset-hom-page__main" aria-label="Vídeo e próximo passo">
        <div className="pl-reset-oportunidade__container">
          <div className="pl-reset-oportunidade__video-wrap">
            <ShareVideo
              parsedVideo={parsedVideo}
              poster={poster}
              memberLabel={memberLabel}
              videoTitle={videoTitle}
            />
          </div>

          <div className="pl-reset-oportunidade__actions pl-reset-hom-page__actions">
            <button
              type="button"
              onClick={() => openWa(ctaPrimaryMessage)}
              className="pl-reset-oportunidade__cta pl-reset-oportunidade__cta--primary pl-reset-oportunidade__cta--gradient"
            >
              {ctaPrimaryLabel}
            </button>
            <button
              type="button"
              onClick={() => openWa(ctaSecondaryMessage)}
              className="pl-reset-oportunidade__cta pl-reset-oportunidade__cta--secondary"
            >
              {ctaSecondaryLabel}
            </button>
          </div>

          <p className="pl-reset-beneficios__footnote">
            Ao clicar, você fala no WhatsApp de {memberLabel}. Seus dados não são armazenados ao assistir ao vídeo.
          </p>
        </div>
      </section>

      <ProLideresResetYladaFooter source="hom" />
    </div>
  )
}
