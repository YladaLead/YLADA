'use client'

import Image from 'next/image'
import { getCountryByCode, inferCountryIsoFromLeadingDigits } from '@/components/CountrySelector'
import type { ParsedOpportunityVideo } from '@/lib/pro-lideres-opportunity-video'
import { buildVimeoEmbedSrc, buildYouTubeEmbedSrc } from '@/lib/pro-lideres-opportunity-video'
import { PRO_LIDERES_HOM_RESET_VIDEO_POSTER } from '@/lib/pro-lideres-reset-content'
import ProLideresResetYladaFooter from '@/components/pro-lideres/ProLideresResetYladaFooter'

export type ProLideresHOMClientProps = {
  headline: string
  subheadline: string
  memberName: string | null
  parsedVideo: ParsedOpportunityVideo | null
  videoUrlInvalid?: boolean
  memberWhatsapp: string | null
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

function HomVideo({
  parsedVideo,
  memberLabel,
}: {
  parsedVideo: ParsedOpportunityVideo | null
  memberLabel: string
}) {
  if (parsedVideo?.kind === 'youtube') {
    return (
      <div className="pl-reset-embed-youtube">
        <iframe
          className="pl-reset-oportunidade__iframe"
          title="Apresentação Reset Metabólico"
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
        title="Apresentação Reset Metabólico"
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
        poster={PRO_LIDERES_HOM_RESET_VIDEO_POSTER}
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

export default function ProLideresHOMClient({
  memberWhatsapp,
  parsedVideo,
  memberName,
}: ProLideresHOMClientProps) {
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
      <section className="pl-reset-hero" aria-label="Oportunidade de negócio">
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
          <p className="pl-reset-hero__headline">Oportunidade de Negócio</p>
          <p className="pl-reset-hero__tagline pl-reset-hero__tagline--hom">
            R$500,00 extra por semana
            <br />
            com bebidas funcionais
          </p>
        </div>
      </section>

      <section className="pl-reset-hom-page__main" aria-label="Vídeo e próximo passo">
        <div className="pl-reset-oportunidade__container">
          <div className="pl-reset-oportunidade__video-wrap">
            <HomVideo parsedVideo={parsedVideo} memberLabel={memberLabel} />
          </div>

          <div className="pl-reset-oportunidade__actions pl-reset-hom-page__actions">
            <button
              type="button"
              onClick={() => openWa('Olá! 👋\n\nAssisti à apresentação, gostei e quero tirar minha licença!')}
              className="pl-reset-oportunidade__cta pl-reset-oportunidade__cta--primary pl-reset-oportunidade__cta--gradient"
            >
              🚀 Gostei, quero minha licença!
            </button>
            <button
              type="button"
              onClick={() =>
                openWa('Olá! 👋\n\nGostaria de tirar uma dúvida.')
              }
              className="pl-reset-oportunidade__cta pl-reset-oportunidade__cta--secondary"
            >
              🤔 Gostaria de tirar uma dúvida
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
