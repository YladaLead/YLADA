'use client'

import { useRef, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { landingPageVideos } from '@/lib/landing-pages-assets'
import { cn } from '@/lib/utils'
import { videoProgressPercentForRetention } from '@/lib/video-progress-retention'

const WHATSAPP_NUTRI = '5519997230912'
const WHATSAPP_MSG = 'Olá! Assisti o vídeo da YLADA Nutri e gostaria de tirar dúvidas.'

const NUTRI_VIDEO_SRC = landingPageVideos.nutriHero
const NUTRI_POSTER_SRC = landingPageVideos.nutriHeroPoster

/** Em mobile: conteúdo abaixo do vídeo só aparece após 17:20 do vídeo (campanha de anúncio). */
const UNLOCK_AFTER_SECONDS = 17 * 60 + 20 // 17:20

export default function NutriVideoContent() {
  const searchParams = useSearchParams()
  const previewUnlock = searchParams.get('preview') === '1'
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [contentUnlocked, setContentUnlocked] = useState(previewUnlock)
  const [videoEnded, setVideoEnded] = useState(false)
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUTRI}?text=${encodeURIComponent(WHATSAPP_MSG)}`
  const checkoutUrl = '/pt/nutri/checkout?plan=annual'
  const vendasUrl = '/pt/nutri'

  const onTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration || Number.isNaN(video.duration)) return
    const realPct = (video.currentTime / video.duration) * 100
    setProgress(Math.min(100, realPct))
    if (video.currentTime >= UNLOCK_AFTER_SECONDS) setContentUnlocked(true)
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

    // iOS Safari: fullscreen só funciona no elemento <video> via webkitEnterFullscreen
    const videoEl = video as HTMLVideoElement & { webkitEnterFullscreen?: () => void; webkitExitFullscreen?: () => void }
    if (videoEl?.webkitEnterFullscreen && !document.fullscreenElement) {
      try {
        videoEl.webkitEnterFullscreen()
        setIsFullscreen(true)
      } catch {
        // fallback: tentar requestFullscreen no container
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

    // iOS: ao sair do fullscreen nativo do vídeo (usuário toca em "Concluído")
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
    <div className="min-h-screen bg-white">
      <main
        className={cn(
          'container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl',
          !contentUnlocked && 'pt-6'
        )}
      >
        <section className="pt-6 sm:pt-8 pb-4 sm:pb-6 text-center">
          <p className="text-xs sm:text-sm font-medium text-[#2563EB] uppercase tracking-wider mb-2">
            Vídeo exclusivo para nutricionistas
          </p>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1A1A1A] leading-tight max-w-2xl mx-auto">
            Assista e compare: o que você faz hoje versus o que nós propomos.
          </h1>
        </section>

        <section className="pt-6 md:pt-0 pb-6">
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
                className="absolute bottom-3 right-3 p-3 sm:p-2 rounded-xl bg-black/50 hover:bg-black/70 active:bg-black/80 text-white transition-colors z-10 touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
                aria-label={isFullscreen ? 'Sair da tela cheia' : 'Assistir em tela cheia (vire o celular para ver maior)'}
                title={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia — toque e vire o celular para assistir deitado'}
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

        {contentUnlocked && (
          <>
            <section className="pt-8 pb-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center flex-wrap">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex justify-center items-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white transition-all shadow-md hover:shadow-lg"
                >
                  Tirar dúvida
                </a>
                <Link
                  href={vendasUrl}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-md"
                >
                  Saber mais
                </Link>
                <Link
                  href={checkoutUrl}
                  className="w-full sm:w-auto inline-flex justify-center items-center px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all shadow-xl hover:shadow-2xl"
                >
                  Quero começar
                </Link>
              </div>
            </section>
          </>
        )}

        {videoEnded && (
          <section className="pb-16 pt-2 text-center border-t border-gray-200">
            <p className="text-lg font-semibold text-[#1A1A1A] mb-2">Pronto para sair do improviso?</p>
            <Link
              href={checkoutUrl}
              className="inline-flex items-center px-8 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all shadow-xl"
            >
              Aderir ao sistema
            </Link>
          </section>
        )}
      </main>
    </div>
  )
}
