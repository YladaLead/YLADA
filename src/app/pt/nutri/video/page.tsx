'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { landingPageVideos } from '@/lib/landing-pages-assets'
import { cn } from '@/lib/utils'

const WHATSAPP_NUTRI = '5519997230912'
const WHATSAPP_MSG = 'Olá! Assisti o vídeo da YLADA Nutri e gostaria de tirar dúvidas.'

const NUTRI_VIDEO_SRC = landingPageVideos.nutriHero
const NUTRI_POSTER_SRC = landingPageVideos.nutriHeroPoster

/** Em mobile: conteúdo abaixo do vídeo só aparece após 18:30 do vídeo (campanha de anúncio). */
const UNLOCK_AFTER_SECONDS = 18 * 60 + 30 // 18:30

export default function NutriVideoPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [contentUnlocked, setContentUnlocked] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUTRI}?text=${encodeURIComponent(WHATSAPP_MSG)}`
  const checkoutUrl = '/pt/nutri/checkout?plan=annual'

  const onTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration || Number.isNaN(video.duration)) return
    const pct = (video.currentTime / video.duration) * 100
    setProgress(Math.min(100, pct))
    if (video.currentTime >= UNLOCK_AFTER_SECONDS) setContentUnlocked(true)
  }

  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setIsPlaying(true)
    } else {
      video.pause()
      setIsPlaying(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header — na página de anúncio só aparece após 18:30 (logo + Entrar) */}
      <header
        className={cn(
          'sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center',
          contentUnlocked ? 'flex' : 'hidden'
        )}
      >
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt/nutri">
            <Image
              src="/images/logo/nutri-horizontal.png"
              alt="YLADA Nutri"
              width={133}
              height={40}
              className="h-8 sm:h-10 w-auto"
              priority
            />
          </Link>
          <Link
            href="/pt/nutri/login"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-2.5 bg-[#2563EB] text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-[#1D4ED8] transition-all shadow-md hover:shadow-lg"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main
        className={cn(
          'container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl',
          !contentUnlocked && 'pt-4'
        )}
      >
        {/* Hero — título sempre visível para quem cai na página (foco no tema) */}
        <section className="pt-6 sm:pt-10 pb-6 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] leading-tight">
            Como ter pacientes novos chegando todos os dias
          </h1>
        </section>

        {/* Vídeo + barra de progresso — no mobile é a primeira coisa visível (landing de anúncio) */}
        <section className="pt-6 md:pt-0 pb-6">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div
              className="aspect-video bg-gray-900 relative cursor-pointer group"
              onClick={togglePlay}
              onKeyDown={(e) => e.key === ' ' && (e.preventDefault(), togglePlay())}
              role="button"
              tabIndex={0}
              aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
            >
              <video
                key={NUTRI_VIDEO_SRC}
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
                preload="auto"
                poster={NUTRI_POSTER_SRC}
                src={NUTRI_VIDEO_SRC}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onTimeUpdate}
                onLoadedData={() => setVideoError(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => {
                  setIsPlaying(false)
                  setVideoEnded(true)
                }}
                onError={() => {
                  setVideoError(true)
                  console.error('Erro ao carregar vídeo. URL:', NUTRI_VIDEO_SRC)
                }}
              >
                Seu navegador não suporta vídeo HTML5.
              </video>
              {videoError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center text-sm">
                  <p className="font-semibold mb-2">Vídeo indisponível</p>
                  <p className="opacity-90">Recarregue a página ou tente em outro navegador.</p>
                  <p className="mt-2 opacity-70 text-xs">Se o problema continuar, o formato do arquivo pode não ser compatível (use MP4 com codec H.264).</p>
                </div>
              )}
              {/* Botão play central quando pausado — sem tempo, sem controles nativos */}
              {!isPlaying && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/40"
                  aria-hidden
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#2563EB] ml-1" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M8 5v14l11-7L8 5z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            {/* Barra que acompanha o vídeo — sem tempo restante */}
            <div className="h-1.5 w-full bg-gray-200">
              <div
                className="h-full bg-[#2563EB] transition-[width] duration-150 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </section>

        {/* Tirar dúvida aparece após 18:30; Aderir ao sistema só quando o vídeo termina */}
        <section
          className={cn(
            'pt-8 pb-6',
            contentUnlocked ? 'block' : 'hidden'
          )}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 rounded-xl text-lg font-semibold border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-all shadow-md hover:shadow-lg"
            >
              Tirar dúvida
            </a>
            {videoEnded && (
              <Link
                href={checkoutUrl}
                className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all shadow-xl hover:shadow-2xl"
              >
                Aderir ao sistema
              </Link>
            )}
          </div>
        </section>

        {/* Só no final do vídeo — CTA + garantia enxuta */}
        {videoEnded && (
          <section className="pb-16 pt-2 text-center">
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              Garantia de 7 dias: se não for pra você, devolvemos 100%.
            </p>
          </section>
        )}
      </main>
    </div>
  )
}
