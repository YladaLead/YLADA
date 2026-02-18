'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { landingPageVideos } from '@/lib/landing-pages-assets'
import { videoProgressPercentForRetention } from '@/lib/video-progress-retention'
import { trackNutriVideoCTAClick } from '@/lib/facebook-pixel'

const NUTRI_VIDEO_SRC = landingPageVideos.nutriHero
const NUTRI_POSTER_SRC = landingPageVideos.nutriHeroPoster

/** Liberar botões de CTA apenas após o usuário assistir até 5:00 */
const UNLOCK_AFTER_SECONDS = 5 * 60 // 5:00

const checkoutUrl = '/pt/nutri/checkout?plan=annual'

/** Número WhatsApp para dúvidas (formato: 5511999999999). Configure NEXT_PUBLIC_NUTRI_SUPPORT_WHATSAPP no .env.local */
const supportWhatsApp = typeof process.env.NEXT_PUBLIC_NUTRI_SUPPORT_WHATSAPP === 'string'
  ? process.env.NEXT_PUBLIC_NUTRI_SUPPORT_WHATSAPP.trim()
  : ''
const supportWhatsAppUrl = supportWhatsApp
  ? `https://wa.me/${supportWhatsApp.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Vi o vídeo da Nutri e tenho dúvidas.')}`
  : ''

export default function NutriVideoContent() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [buttonsUnlocked, setButtonsUnlocked] = useState(false)

  const onTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration || Number.isNaN(video.duration)) return
    const realPct = (video.currentTime / video.duration) * 100
    setProgress(Math.min(100, realPct))
    if (video.currentTime >= UNLOCK_AFTER_SECONDS) setButtonsUnlocked(true)
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
          {buttonsUnlocked ? (
            <Link
              href={checkoutUrl}
              className="mt-5 inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base sm:text-lg font-bold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all shadow-lg"
              onClick={() => trackNutriVideoCTAClick({ button_position: 'top', content_name: 'Quero parar de depender de indicação' })}
            >
              👉 Quero parar de depender de indicação
            </Link>
          ) : (
            <span
              className="mt-5 inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base sm:text-lg font-bold bg-gray-300 text-gray-500 cursor-not-allowed transition-all shadow-lg"
              aria-disabled="true"
              title="Assista o vídeo até 5:00 para desbloquear"
            >
              👉 Quero parar de depender de indicação
            </span>
          )}
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
          {buttonsUnlocked ? (
            <Link
              href={checkoutUrl}
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base sm:text-lg font-bold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all shadow-lg"
              onClick={() => trackNutriVideoCTAClick({ button_position: 'bottom', content_name: 'Quero aplicar isso na minha agenda' })}
            >
              👉 Quero aplicar isso na minha agenda
            </Link>
          ) : (
            <span
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-base sm:text-lg font-bold bg-gray-300 text-gray-500 cursor-not-allowed transition-all shadow-lg"
              aria-disabled="true"
              title="Assista o vídeo até 5:00 para desbloquear"
            >
              👉 Quero aplicar isso na minha agenda
            </span>
          )}
          {supportWhatsAppUrl && (
            <p className="mt-4 text-center">
              <a
                href={supportWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#25D366] transition-colors"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Tirar dúvidas? Fale no WhatsApp
              </a>
            </p>
          )}
        </section>
      </main>

      {/* Rodapé minimalista — sem menu, sem navegação */}
      <footer className="border-t border-gray-100 py-6 px-4 text-center text-sm text-gray-500 shrink-0">
        <div className="container mx-auto max-w-3xl flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1">
          {supportWhatsAppUrl && (
            <>
              <a
                href={supportWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#25D366] inline-flex items-center gap-1"
              >
                WhatsApp
              </a>
              <span className="hidden sm:inline">·</span>
            </>
          )}
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
