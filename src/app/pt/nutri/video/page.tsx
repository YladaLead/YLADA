'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { landingPageVideos } from '@/lib/landing-pages-assets'

const WHATSAPP_NUTRI = '5519997230912'
const WHATSAPP_MSG = 'Olá! Assisti o vídeo da YLADA Nutri e gostaria de tirar dúvidas.'

export default function NutriVideoPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUTRI}?text=${encodeURIComponent(WHATSAPP_MSG)}`
  const checkoutUrl = '/pt/nutri/checkout?plan=annual'

  const onTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration || Number.isNaN(video.duration)) return
    const pct = (video.currentTime / video.duration) * 100
    setProgress(Math.min(100, pct))
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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
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

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        {/* Hero */}
        <section className="pt-10 sm:pt-14 pb-8 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1A1A1A] mb-3 leading-tight">
            Como gerar contatos todos os dias sem depender de sorte
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">
            Para nutricionistas cansadas de agenda ociosa
          </p>
        </section>

        {/* Vídeo + barra de progresso (sem controles nativos = sem tempo na tela) */}
        <section className="pb-6">
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
                ref={videoRef}
                className="w-full h-full object-cover"
                loop
                playsInline
                preload="metadata"
                poster={landingPageVideos.nutriHeroPoster}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                onError={(e) => {
                  console.error('Erro ao carregar vídeo:', e)
                }}
              >
                <source src={landingPageVideos.nutriHero} type="video/mp4" />
                Seu navegador não suporta vídeo HTML5.
              </video>
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

        {/* Red line + CTAs */}
        <section className="pt-2 pb-16">
          <div
            className="h-1 rounded-full mb-8"
            style={{ backgroundColor: '#DC2626' }}
            aria-hidden
          />
          <p className="text-center text-gray-600 mb-6">
            Escolha o próximo passo:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 rounded-xl text-lg font-semibold border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-all shadow-md hover:shadow-lg"
            >
              Tirar dúvida
            </a>
            <Link
              href={checkoutUrl}
              className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all shadow-xl hover:shadow-2xl"
            >
              Aderir ao sistema
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
