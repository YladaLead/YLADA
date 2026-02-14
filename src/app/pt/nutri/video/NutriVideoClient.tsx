'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { landingPageVideos } from '@/lib/landing-pages-assets'
import { videoProgressPercentForRetention } from '@/lib/video-progress-retention'
import { trackNutriVideoCTAClick } from '@/lib/facebook-pixel'

const NUTRI_VIDEO_SRC = landingPageVideos.nutriHero
const NUTRI_POSTER_SRC = landingPageVideos.nutriHeroPoster

const checkoutUrl = '/pt/nutri/checkout?plan=annual'

export default function NutriVideoContent() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [videoError, setVideoError] = useState(false)

  const onTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration || Number.isNaN(video.duration)) return
    const realPct = (video.currentTime / video.duration) * 100
    setProgress(Math.min(100, realPct))
  }

  const displayProgress = videoProgressPercentForRetention(progress)

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

  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const video = videoRef.current
    const container = videoContainerRef.current

    const videoEl = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void }
    if (videoEl?.webkitEnterFullscreen && !document.fullscreenElement) {
      try {
        videoEl.webkitEnterFullscreen()
        setIsFullscreen(true)
      } catch {
        if (container) {
          try {
            await container.requestFullscreen()
            setIsFullscreen(true)
          } catch {}
        }
      }
      return
    }

    if (!container) return
    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch {
      if (video && !document.fullscreenElement) {
        try {
          await video.requestFullscreen()
          setIsFullscreen(true)
        } catch {}
      } else {
        try {
          await document.exitFullscreen()
          setIsFullscreen(false)
        } catch {}
      }
    }
  }

  useEffect(() => {
    const video = videoRef.current
    const onFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    const onWebKitEndFullscreen = () => setIsFullscreen(false)
    if (video) {
      video.addEventListener('webkitendfullscreen', onWebKitEndFullscreen)
      return () => {
        document.removeEventListener('fullscreenchange', onFullscreenChange)
        video.removeEventListener('webkitendfullscreen', onWebKitEndFullscreen)
      }
    }
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur shrink-0">
        <div className="container mx-auto px-4 h-14 flex items-center justify-center">
          <Image
            src="/images/logo/nutri-horizontal.png"
            alt="YLADA Nutri"
            width={140}
            height={42}
            className="h-9 w-auto"
          />
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl flex-1">
        {/* 1. Headline + subheadline — gera tensão */}
        <section className="pt-6 sm:pt-8 pb-4 text-center">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight max-w-2xl mx-auto">
            Se sua agenda depende de indicação, você está em risco.
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mt-3 max-w-xl mx-auto">
            Assista esse vídeo antes de decidir continuar no improviso.
          </p>
          <Link
            href={checkoutUrl}
            className="mt-5 inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base sm:text-lg font-bold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all shadow-lg"
            onClick={() => trackNutriVideoCTAClick({ button_position: 'top', content_name: 'Quero parar de depender de indicação' })}
          >
            👉 Quero parar de depender de indicação
          </Link>
        </section>

        {/* 2. Vídeo — elemento dominante */}
        <section className="pb-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <div
              ref={videoContainerRef}
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
                </div>
              )}
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
              <button
                type="button"
                onClick={toggleFullscreen}
                className="absolute bottom-3 right-3 p-3 sm:p-2 rounded-xl bg-black/50 hover:bg-black/70 text-white transition-colors z-10 touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
              >
                {isFullscreen ? (
                  <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
                ) : (
                  <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                )}
              </button>
            </div>
            <div className="h-1.5 w-full bg-gray-200">
              <div
                className="h-full bg-[#2563EB] transition-[width] duration-150 ease-out"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
          </div>
        </section>

        {/* 3. Botão depois do vídeo — acompanha estado emocional */}
        <section className="pb-8 text-center">
          <Link
            href={checkoutUrl}
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base sm:text-lg font-bold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all shadow-lg"
            onClick={() => trackNutriVideoCTAClick({ button_position: 'bottom', content_name: 'Quero aplicar isso na minha agenda' })}
          >
            👉 Quero aplicar isso na minha agenda
          </Link>
        </section>
      </main>

      {/* Rodapé minimalista — sem menu, sem navegação */}
      <footer className="border-t border-gray-100 py-6 px-4 text-center text-sm text-gray-500 shrink-0">
        <div className="container mx-auto max-w-3xl flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <Link href="/pt/termos-de-uso" className="hover:text-gray-700">
            Termos de uso
          </Link>
          <Link href="/pt/politica-de-privacidade" className="hover:text-gray-700">
            Política de privacidade
          </Link>
          <span className="hidden sm:inline">·</span>
          <span>© {new Date().getFullYear()} YLADA</span>
        </div>
      </footer>
    </div>
  )
}
