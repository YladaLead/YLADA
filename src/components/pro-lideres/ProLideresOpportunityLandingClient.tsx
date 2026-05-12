'use client'

import { getCountryByCode, inferCountryIsoFromLeadingDigits } from '@/components/CountrySelector'
import type { ParsedOpportunityVideo } from '@/lib/pro-lideres-opportunity-video'

export type ProLideresOpportunityLandingClientProps = {
  displayName: string
  whatsapp: string | null
  parsedVideo: ParsedOpportunityVideo | null
  /** URL inválido na base (ex. URL apagado manualmente na BD). */
  videoUrlInvalid?: boolean
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
  const whatsappNumber = `${phoneCode}${numeroLimpo}`
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}

export default function ProLideresOpportunityLandingClient({
  displayName,
  whatsapp,
  parsedVideo,
  videoUrlInvalid = false,
}: ProLideresOpportunityLandingClientProps) {
  const waMsgDuvida = `Olá! 👋

Assisti à apresentação da oportunidade e gostaria de tirar uma dúvida.`
  const waMsgComecar = `Olá! 👋

Assisti ao vídeo da oportunidade, gostei e gostaria de saber como começar.`

  const openWa = (text: string) => {
    if (!whatsapp?.trim()) {
      alert('WhatsApp deste líder não está disponível neste momento.')
      return
    }
    const url = buildWhatsappUrl(whatsapp, text)
    if (!url) {
      alert('WhatsApp deste líder não está disponível neste momento.')
      return
    }
    window.open(url, '_blank')
  }

  const leaderLabel = displayName.trim() || 'O teu líder'

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50">
      <div className="mx-auto max-w-4xl px-4 py-3 sm:py-4">
        <div className="relative mb-4 overflow-hidden rounded-xl border border-sky-200/80 bg-gradient-to-br from-sky-600 via-indigo-600 to-slate-800 p-3 shadow-xl sm:p-4">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="relative z-10 text-center">
            <h1 className="mb-1 text-lg font-extrabold leading-tight text-white drop-shadow sm:text-2xl md:text-3xl">
              Oportunidade de negócio
            </h1>
            <p className="text-xs font-medium text-sky-100 sm:text-sm md:text-base">
              Apresentação com {leaderLabel}
            </p>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-sky-100 bg-white p-3 shadow-xl sm:p-4">
          <h2 className="mb-2 text-center text-base font-bold text-gray-900 sm:text-lg">Assiste à apresentação</h2>
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-900 shadow-lg">
            {parsedVideo?.kind === 'youtube' ? (
              <iframe
                title="Apresentação — YouTube"
                width="100%"
                height="100%"
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${parsedVideo.videoId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : parsedVideo?.kind === 'vimeo' ? (
              <iframe
                title="Apresentação — Vimeo"
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
                O teu navegador não suporta vídeo HTML5.
              </video>
            ) : videoUrlInvalid ? (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 px-4 text-center text-sm text-amber-100">
                <p>O link do vídeo não está válido.</p>
                <p className="text-xs text-gray-300">Contacta o líder para atualizar a página.</p>
              </div>
            ) : (
              <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 px-4 text-center text-sm text-gray-200">
                <p>O líder ainda não associou um vídeo a esta página.</p>
                <p className="text-xs text-gray-400">Usa os botões abaixo para falares diretamente.</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-sky-100 bg-white p-3 shadow-xl sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => openWa(waMsgDuvida)}
              className="flex flex-1 transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:from-blue-600 hover:to-blue-700 sm:px-6 sm:py-4 sm:text-base"
            >
              Quero tirar uma dúvida
            </button>
            <button
              type="button"
              onClick={() => openWa(waMsgComecar)}
              className="flex flex-1 transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:from-emerald-600 hover:to-green-700 sm:px-6 sm:py-4 sm:text-base"
            >
              Gostei — quero começar
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Página YLADA Pro Líderes · Os teus dados não são guardados ao assistires ao vídeo.
        </p>
      </div>
    </div>
  )
}
