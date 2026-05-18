'use client'

import { getCountryByCode, inferCountryIsoFromLeadingDigits } from '@/components/CountrySelector'
import type { ParsedOpportunityVideo } from '@/lib/pro-lideres-opportunity-video'

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

export default function ProLideresHOMClient({
  headline,
  subheadline,
  memberName,
  parsedVideo,
  videoUrlInvalid = false,
  memberWhatsapp,
}: ProLideresHOMClientProps) {
  const memberLabel = memberName?.trim() || 'seu distribuidor'

  const waMsgDuvida = `Olá! 👋\n\nAssisti à apresentação e gostaria de tirar uma dúvida antes de decidir.`
  const waMsgComecar = `Olá! 👋\n\nAssisti à apresentação, gostei e quero saber como começar!`

  const openWa = (text: string) => {
    if (!memberWhatsapp?.trim()) {
      alert('WhatsApp não disponível no momento.')
      return
    }
    const url = buildWhatsappUrl(memberWhatsapp, text)
    if (!url) { alert('WhatsApp não disponível no momento.'); return }
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="mx-auto max-w-lg px-3 py-3">

        {/* Header — compacto, mobile-first */}
        <div className="relative mb-3 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-slate-800 px-4 py-5 shadow-lg">
          <div className="relative z-10 text-center">
            <h1 className="text-lg font-extrabold leading-snug text-white drop-shadow sm:text-xl">
              {headline}
            </h1>
            <p className="mt-1 text-xs font-medium text-emerald-100 sm:text-sm">
              {subheadline}
            </p>
          </div>
        </div>

        {/* Vídeo — sem título duplicado, sem borda extra */}
        <div className="mb-3 overflow-hidden rounded-2xl bg-black shadow-lg">
          <div className="aspect-video w-full">
            {parsedVideo?.kind === 'youtube' ? (
              <iframe
                title="Apresentação HOM"
                width="100%"
                height="100%"
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${parsedVideo.videoId}?rel=0&modestbranding=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : parsedVideo?.kind === 'vimeo' ? (
              <iframe
                title="Apresentação HOM"
                width="100%"
                height="100%"
                className="h-full w-full"
                src={`https://player.vimeo.com/video/${parsedVideo.id}`}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : parsedVideo?.kind === 'mp4' ? (
              <video className="h-full w-full object-contain" controls playsInline preload="metadata">
                <source src={parsedVideo.src} type="video/mp4" />
              </video>
            ) : (
              <div className="flex aspect-video flex-col items-center justify-center gap-2 text-center">
                <span className="text-3xl">🎬</span>
                <p className="text-xs text-gray-400">Vídeo em breve. Use os botões abaixo.</p>
              </div>
            )}
          </div>
        </div>

        {/* CTAs */}
        <div className="rounded-2xl bg-white px-4 py-4 shadow-md">
          <p className="mb-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Qual é o seu próximo passo?
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => openWa(waMsgComecar)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-4 text-sm font-bold text-white shadow-md transition active:scale-[0.98] hover:bg-emerald-700"
            >
              🚀 Gostei — quero começar!
            </button>
            <button
              type="button"
              onClick={() => openWa(waMsgDuvida)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition active:scale-[0.98] hover:border-gray-300 hover:bg-gray-50"
            >
              🤔 Tenho uma dúvida
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-gray-400">
          Seus dados não são armazenados ao assistir ao vídeo.
        </p>
      </div>
    </div>
  )
}
