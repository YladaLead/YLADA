'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LyaSalesWidget from '@/components/nutri/LyaSalesWidget'
import { landingPageVideos } from '@/lib/landing-pages-assets'
import { trackNutriSalesView } from '@/lib/facebook-pixel'
import { videoProgressPercentForRetention } from '@/lib/video-progress-retention'

const WHATSAPP_NUTRI = '5519997230912'
const WHATSAPP_MSG = 'Olá! Estou na página da YLADA Nutri e gostaria de tirar dúvidas.'

export default function NutriLandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [lyaWidgetOpen, setLyaWidgetOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const [videoProgress, setVideoProgress] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Rastrear visualização da página de vendas
  useEffect(() => {
    trackNutriSalesView()
  }, [])

  // Se o anúncio trouxer com #video, rolar direto para o vídeo
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.location.hash !== '#video') return
    const el = document.getElementById('video')
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
  }, [])

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index)
  }

  const openLyaWidget = () => {
    setLyaWidgetOpen(true)
  }

  // Área Nutri: mensal R$ 97 ou anual 12× de R$ 59 (R$ 708)
  const handleCheckout = (plan: 'monthly' | 'annual' = 'annual') => {
    window.location.href = `/pt/nutri/checkout?plan=${plan}`
  }

  const onVideoTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration || Number.isNaN(video.duration)) return
    const realPct = (video.currentTime / video.duration) * 100
    setVideoProgress(Math.min(100, realPct))
  }

  // Barra avança rápido no começo e devagar no final (retenção)
  const displayVideoProgress = videoProgressPercentForRetention(videoProgress)

  const toggleVideoPlay = () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
      setVideoPlaying(true)
    } else {
      video.pause()
      setVideoPlaying(false)
    }
  }

  const toggleFullscreen = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const container = videoContainerRef.current
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
      // Fallback: alguns navegadores não suportam fullscreen no container
      const video = videoRef.current
      if (video && !document.fullscreenElement) {
        await video.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

  return (
    <div className="min-h-screen bg-white relative">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <Link href="/pt">
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

      <main>
        {/* BLOCO 1 — HERO: dor + headline + CTA direto */}
        <section className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white pt-8 sm:pt-10 pb-8 sm:pb-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-base sm:text-lg text-white/95 mb-3 font-semibold">
                Nutri, sua agenda não está vazia por falta de competência.
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">
                O sistema de captação com orientação que{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  destrava sua agenda
                </span>
                , sem improviso e sem ansiedade.
              </h1>
              <a
                href="#video"
                className="inline-flex items-center justify-center mt-5 px-6 py-3 rounded-xl bg-white text-[#2563EB] font-bold text-base hover:bg-white/95 transition-colors shadow-lg"
              >
                Quero parar de improvisar
              </a>
            </div>
          </div>
        </section>

        {/* VÍDEO — Use /pt/nutri#video no anúncio para desembocar direto aqui */}
        <section id="video" className="pt-8 sm:pt-10 pb-8 sm:pb-10 bg-white scroll-mt-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <p className="text-base sm:text-lg text-center text-gray-700 font-medium mb-1">
                ⚠️ Assista antes de decidir.
              </p>
              <p className="text-sm sm:text-base text-center text-gray-600 mb-5 sm:mb-6">
                Esse vídeo explica por que você trava e como sair disso sem improviso.
              </p>
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-5 ring-1 ring-black/5">
                <div
                  ref={videoContainerRef}
                  className="aspect-video bg-gray-900 relative cursor-pointer group"
                  onClick={toggleVideoPlay}
                  onKeyDown={(e) => e.key === ' ' && (e.preventDefault(), toggleVideoPlay())}
                  role="button"
                  tabIndex={0}
                  aria-label={videoPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
                >
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    loop
                    playsInline
                    preload="metadata"
                    poster={landingPageVideos.nutriHeroPoster}
                    onTimeUpdate={onVideoTimeUpdate}
                    onLoadedMetadata={onVideoTimeUpdate}
                    onPlay={() => setVideoPlaying(true)}
                    onPause={() => setVideoPlaying(false)}
                    onEnded={() => setVideoPlaying(false)}
                    onError={(e) => console.error('Erro ao carregar vídeo:', e)}
                  >
                    <source src={landingPageVideos.nutriHero} type="video/mp4" />
                    Seu navegador não suporta vídeo HTML5.
                  </video>
                  {!videoPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40" aria-hidden>
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
                    className="absolute bottom-3 right-3 p-2 rounded-lg bg-black/50 hover:bg-black/70 text-white transition-colors z-10"
                    aria-label={isFullscreen ? 'Sair da tela cheia' : 'Assistir em tela cheia'}
                    title={isFullscreen ? 'Sair da tela cheia' : 'Assistir em tela cheia (pode virar o celular)'}
                  >
                    {isFullscreen ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                    )}
                  </button>
                </div>
                <div className="h-1.5 w-full bg-gray-200">
                  <div className="h-full bg-[#2563EB] transition-[width] duration-150 ease-out" style={{ width: `${displayVideoProgress}%` }} />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center pt-4 sm:pt-5">
                <a
                  href={`https://wa.me/${WHATSAPP_NUTRI}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sm:min-w-[140px] order-2 sm:order-1 inline-flex justify-center items-center px-6 py-3.5 rounded-xl text-base font-medium border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Tirar dúvida
                </a>
                <Link
                  href="/pt/nutri/checkout"
                  className="sm:min-w-[220px] order-1 sm:order-2 inline-flex justify-center items-center px-8 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all shadow-lg hover:shadow-xl"
                >
                  Quero sair do improviso
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 2 — DOR (curto, punch) — alinhamento central consistente */}
        <section className="py-10 sm:py-14 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-[#1A1A1A]">
                Você já se sentiu assim?
              </h2>
              <ul className="space-y-3 text-lg sm:text-xl text-gray-700 inline-block text-left">
                <li className="font-semibold text-[#2563EB]">• Agenda vazia</li>
                <li className="font-semibold text-[#2563EB]">• Dúvida na cobrança</li>
                <li className="font-semibold text-[#2563EB]">• Sensação de recomeçar de novo</li>
              </ul>
              <div className="mt-8 space-y-2 text-lg sm:text-xl text-gray-700">
                <p className="font-semibold">Você já tentou.</p>
                <p>Organizou.</p>
                <p>Recomeçou.</p>
                <p className="pt-2">E voltou ao mesmo lugar:</p>
                <p className="font-bold text-[#1A1A1A] text-[#2563EB]">improviso, solidão, sem clareza do que fazer amanhã.</p>
              </div>
              <p className="mt-8 text-xl font-bold text-[#1A1A1A]">
                Se você se reconheceu, continue.
              </p>
            </div>
          </div>
        </section>

        {/* DECISÃO LOGO APÓS VÍDEO + DOR — captura quem já decidiu cedo */}
        <section className="py-10 sm:py-12 bg-gradient-to-b from-[#E9F1FF] to-[#D6E6FF]/80">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center rounded-2xl bg-white/60 backdrop-blur-sm py-8 px-6 sm:px-10 shadow-sm border border-[#2563EB]/10">
              <p className="text-lg sm:text-xl font-bold text-[#1A1A1A] mb-3">
                Se isso já fez sentido pra você, não precisa continuar rolando agora.
              </p>
              <p className="text-base text-gray-700 mb-6">
                Você pode começar hoje.
              </p>
              <Link
                href="/pt/nutri/checkout"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all shadow-lg hover:shadow-xl"
              >
                Quero aplicar isso na minha agenda
              </Link>
            </div>
          </div>
        </section>

        {/* BLOCO 3 — O problema não é você + faculdade (um bloco emocional único) */}
        <section className="py-12 sm:py-16 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-[#1A1A1A]">
                O problema não é você. É falta de sistema.
              </h2>
              <div className="bg-white rounded-2xl shadow-md p-8 sm:p-10 ring-1 ring-black/5">
                <p className="text-lg sm:text-xl text-gray-700 mb-4 leading-relaxed font-semibold">
                  Respire fundo. Você não está quebrada.
                </p>
                
                <p className="text-lg text-gray-700 mb-4">
                  A faculdade te ensinou a ser nutricionista técnica. Não te ensinou a captar clientes, organizar o negócio nem cobrar com clareza.
                </p>
                <p className="text-lg text-gray-700 font-semibold">
                  O que falta é metodologia clara e estrutura que destrave. A diferença entre quem cresce e quem fica no improviso não é talento. <strong>É sistema.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 5 — O que muda com o sistema (2 colunas no desktop) */}
        <section className="py-14 sm:py-20 lg:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#1A1A1A]">
                O que muda com o sistema
              </h2>
              
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 lg:p-10 ring-1 ring-black/5 overflow-hidden">
                <p className="text-lg sm:text-xl font-bold text-gray-800 mb-6 lg:mb-8 text-center leading-snug">
                  Quem adota um sistema de captação para de depender de sorte e de “dar um jeito”.
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 text-base sm:text-lg text-gray-700">
                  <div className="space-y-4 lg:space-y-5 lg:pr-6 lg:border-r border-gray-200">
                    <p className="font-bold text-[#FF4F4F] text-lg">Sem sistema:</p>
                    <ul className="space-y-3 list-none pl-0">
                      <li>sorte, indicação, improviso.</li>
                      <li>“o que faço amanhã?”, indecisão.</li>
                      <li>você trava.</li>
                    </ul>
                  </div>
                  <div className="space-y-4 lg:space-y-5">
                    <p className="font-bold text-[#29CC6A] text-lg">Com sistema:</p>
                    <ul className="space-y-3 list-none pl-0">
                      <li>metodologia clara, agenda que enche.</li>
                      <li>rotina definida, estrutura de apoio.</li>
                      <li>você segue.</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 lg:p-10 ring-1 ring-black/5 text-center overflow-hidden">
                <h3 className="text-xl font-bold mb-6 text-[#1A1A1A]">
                  Nutri Tradicional × Nutri-Empresária
                </h3>
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-center gap-3 sm:gap-6 lg:gap-8 text-lg text-gray-700 mb-6">
                  <span><span className="font-bold text-[#FF4F4F]">Improviso</span> × <span className="font-bold text-[#29CC6A]">Método</span></span>
                  <span><span className="font-bold text-[#FF4F4F]">Sorte</span> × <span className="font-bold text-[#29CC6A]">Sistema</span></span>
                  <span><span className="font-bold text-[#FF4F4F]">Solidão</span> × <span className="font-bold text-[#29CC6A]">Orientação</span></span>
                </div>
                <p className="text-base sm:text-lg font-semibold text-gray-800 min-w-0 break-words px-1">
                  O divisor de águas não é conhecimento. É sistema.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-2xl py-6 px-6 text-center text-white shadow-lg">
                <p className="text-lg sm:text-xl font-bold leading-snug">Você quer encher agenda com método e parar de travar?</p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 6 — APRESENTAÇÃO DO YLADA NUTRI (SOLUÇÃO) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                O que é o YLADA Nutri?
              </h2>
              
              <div className="bg-white rounded-2xl shadow-md p-8 sm:p-10 mb-8 border-2 border-[#2563EB]/30 ring-1 ring-[#2563EB]/20">
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-6 leading-snug">
                  É o sistema de captação com orientação que destrava.
                </p>
                
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                  Estrutura de apoio para nutricionistas que querem encher agenda, parar de agendar ansiosa e ter metodologia clara, sem travar e sem indecisão.
                </p>
                
                <p className="text-lg text-gray-700 mb-4">
                  Não é curso. Não é ferramenta. É sistema:
                </p>
                <ul className="space-y-2 text-lg text-gray-700 mb-6">
                  <li className="flex items-start">
                    <span className="text-[#2563EB] mr-3 text-xl font-bold">•</span>
                    <span>Sistema de captação previsível</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#2563EB] mr-3 text-xl font-bold">•</span>
                    <span>Trilha empresarial clara</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#2563EB] mr-3 text-xl font-bold">•</span>
                    <span>Noel como mentor que impede abandono</span>
                  </li>
                </ul>
              </div>

              {/* CTA antecipado: quem está pronta compra aqui */}
              <div className="mt-8 text-center">
                <p className="text-xl font-bold text-[#1A1A1A] mb-4">
                  Se isso já fez sentido pra você, você pode começar agora.
                </p>
                <Link
                  href="/pt/nutri/checkout"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all shadow-xl"
                >
                  Quero um método claro
                </Link>
                <p className="text-sm text-gray-600 mt-3">Quem não está pronta continua lendo.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 7 — O MÉTODO YLADA (COMO FUNCIONA) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                O Método YLADA
              </h2>
              
              <div className="space-y-6">
                {[
                  {
                    title: '1. Captação Previsível',
                    desc: 'Você para de depender de indicação ou sorte. Sistema de captação que funciona de forma consistente.'
                  },
                  {
                    title: '2. Trilha empresarial clara',
                    desc: 'Próximo passo definido. Você executa com método, não na base do improviso. Sem “gestão de clientes” pesada; apenas controle claro de leads e conversão.'
                  },
                  {
                    title: '3. Noel como mentoria estratégica',
                    desc: 'Orientações que impedem abandono e travas. Você não fica sozinha.'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-[#2563EB]">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-[#1A1A1A]">{item.title}</h3>
                    <p className="text-lg text-gray-700 leading-relaxed">
                      <strong>O que isso muda na sua vida:</strong> {item.desc}
                    </p>
                  </div>
                ))}
              </div>
              
            </div>
          </div>
        </section>

        {/* BLOCO 8 — O NOEL (MENTOR ESTRATÉGICO) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[#1A1A1A]">
                Noel: Seu Mentor Estratégico
              </h2>
              <p className="text-xl text-center text-gray-600 mb-12">
                Direcionamento diário, clareza de foco e execução prática
              </p>
              
              <div className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-xl shadow-lg p-8 sm:p-10 mb-8 text-white">
                <p className="text-xl sm:text-2xl font-bold mb-4">
                  O Noel existe para impedir que você volte ao improviso.
                </p>
                <p className="text-lg mb-0 leading-relaxed">
                  Ele não te dá lista infinita de opções. Ele te diz: <strong>o foco agora, a ação, onde aplicar.</strong> Mentoria estratégica que funciona.
                </p>
              </div>
              
              <div className="text-center bg-white rounded-xl shadow-lg p-6 border-2 border-[#2563EB]">
                <p className="text-xl font-bold text-[#2563EB]">
                  O Noel não executa por você. Ele impede que você trave.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 9 — TRANSFORMAÇÃO (ANTES × DEPOIS) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Transformação Real
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#FF4F4F]/10 rounded-xl p-8 border-2 border-[#FF4F4F]">
                  <h3 className="text-2xl font-bold mb-6 text-[#FF4F4F]">Antes do YLADA, você:</h3>
                  <ul className="space-y-3 text-lg text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#FF4F4F] mr-3 text-xl font-bold">✗</span>
                      <span>Acordava ansiosa, sem saber se teria clientes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF4F4F] mr-3 text-xl font-bold">✗</span>
                      <span>Sentia vergonha quando não sabia quanto cobrar</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF4F4F] mr-3 text-xl font-bold">✗</span>
                      <span>Se sentia sozinha, sem ninguém para ajudar</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF4F4F] mr-3 text-xl font-bold">✗</span>
                      <span>Dormia frustrada, pensando que nunca ia dar certo</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#FF4F4F] mr-3 text-xl font-bold">✗</span>
                      <span>Trabalhava na base do improviso</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#29CC6A]/10 rounded-xl p-8 border-2 border-[#29CC6A]">
                  <h3 className="text-2xl font-bold mb-6 text-[#29CC6A]">Com o YLADA, você:</h3>
                  <ul className="space-y-3 text-lg text-gray-700">
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl font-bold">✓</span>
                      <span>Acorda tranquila, com sistema de captação funcionando</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl font-bold">✓</span>
                      <span>Se sente confiante para cobrar</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl font-bold">✓</span>
                      <span>Tem mentoria e estrutura, não está sozinha</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[#29CC6A] mr-3 text-xl font-bold">✓</span>
                      <span>Trabalha com método, não na base do improviso</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                  A diferença não é sorte. É método.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 10 — POR QUE O YLADA ACELERA RESULTADOS */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Por que o YLADA acelera resultados?
              </h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Captação Automática',
                    paraDe: 'depender de indicação',
                    resultado: 'Captação que funciona sem postar e torcer.'
                  },
                  {
                    title: 'Organização Total',
                    paraDe: 'trabalhar no improviso',
                    resultado: 'Rotina e captação claras: o que fazer hoje, o que converter.'
                  },
                  {
                    title: 'Clareza Empresarial',
                    paraDe: 'tentar sem método',
                    resultado: 'Trilha Empresarial (30 dias) com passo a passo.'
                  },
                  {
                    title: 'Comunidade',
                    paraDe: 'se sentir sozinha',
                    resultado: 'Nutri-Empresárias crescendo juntas e com suporte.'
                  },
                  {
                    title: 'Suporte Humano',
                    paraDe: 'ficar só na tecnologia',
                    resultado: 'Noel + suporte humano quando precisar.'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
                    <h3 className="text-xl font-bold mb-3 text-[#1A1A1A]">{item.title}</h3>
                    <p className="text-gray-700 font-medium">Você para de {item.paraDe}.</p>
                    <p className="text-gray-600 text-sm mt-1"><strong>Resultado prático:</strong> {item.resultado}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <p className="text-lg sm:text-xl text-gray-700">
                  Cada benefício acelera seus resultados porque <strong>elimina uma trava que te impede de crescer.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 12 — ANCORAGEM DE VALOR (ANTES DO PREÇO) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-[#1A1A1A]">
                Antes de mostrar o investimento, vamos falar sobre o que você está perdendo enquanto não decide:
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border-2 border-[#FF9800] text-center">
                  <div className="text-4xl mb-4">😔</div>
                  <p className="text-lg font-bold text-gray-700">
                    Cada mês sem método = mais frustração acumulada
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border-2 border-[#FF4F4F] text-center">
                  <div className="text-4xl mb-4">💸</div>
                  <p className="text-lg font-bold text-gray-700">
                    Cada cliente que você perde por falta de organização = dinheiro que não volta
                  </p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border-2 border-[#2563EB] text-center">
                  <div className="text-4xl mb-4">⏰</div>
                  <p className="text-lg font-bold text-gray-700">
                    Cada dia que você adia = mais tempo longe da carreira que você quer ter
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-[#FFF4E6] rounded-xl p-6 border-2 border-[#FF9800]">
                  <h3 className="text-xl font-bold mb-3 text-[#FF9800]">Custo de errar e de ficar sem apoio</h3>
                  <p className="text-gray-700 mb-3">
                    Cada mês sem método = oportunidades perdidas, frustração, tempo desperdiçado, receita que não entra. Você já tentou organizar processos, criar captação, definir preço, seguir rotinas. E voltou ao mesmo lugar. Cada tentativa custa tempo, energia e confiança.
                  </p>
                  <p className="text-lg font-semibold text-gray-700">
                    O custo não é só financeiro. É emocional.
                  </p>
                </div>
                
                <div className="bg-[#E9F1FF] rounded-xl p-6 border-2 border-[#2563EB]">
                  <h3 className="text-xl font-bold mb-3 text-[#2563EB]">Investir no YLADA é decisão estratégica</h3>
                  <p className="text-gray-700 mb-3">
                    Método em vez de tentativa e erro. Organização, clareza, suporte, crescimento. O investimento se paga quando você para de perder oportunidades e começa a criar resultados.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 12b — O QUE CUSTA NÃO DECIDIR */}
        <section className="py-12 sm:py-16 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-6">
                O que custa não decidir?
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                Agenda vazia, insegurança constante, dependência de terceiros.
              </p>
              <p className="text-xl font-bold text-[#2563EB]">
                O próximo passo é seu.
              </p>
            </div>
          </div>
        </section>

        {/* ATERRISSAGEM MENTAL — síntese emocional antes da oferta */}
        <section className="py-10 sm:py-14 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-4">
                Até aqui, você não precisa acreditar em nada.
              </p>
              <p className="text-lg sm:text-xl font-semibold text-[#1A1A1A]">
                Só responder uma pergunta: faz sentido pra você ter método em vez de improviso?
              </p>
            </div>
          </div>
        </section>

        {/* BLOCO 13 — OFERTA (SÓ PLANO ANUAL | DECISÃO) */}
        <section id="oferta" className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] relative z-0" style={{ position: 'relative', zIndex: 1 }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-white">
                Isso não é uma assinatura.
              </h2>
              <p className="text-xl sm:text-2xl font-bold text-center text-white/95 mb-4">
                É uma decisão de sair do improviso.
              </p>
              <p className="text-lg text-center text-white/90 mb-10">
                Noel é orientação que destrava: direcionamento diário e metodologia clara de captação. Estrutura de apoio para você encher agenda e parar de agendar ansiosa.
              </p>
              
              <div className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-yellow-400 relative" style={{ pointerEvents: 'auto' }}>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-[#1A1A1A]">Escolha seu plano</h3>
                  <p className="text-gray-600 mb-1">Mensal ou anual. Você decide.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 text-center">
                    <p className="font-semibold text-gray-800">Plano Mensal</p>
                    <p className="text-2xl font-bold text-[#2563EB] mt-1">R$ 97<span className="text-sm font-normal text-gray-600">/mês</span></p>
                    <p className="text-xs text-gray-600 mt-1">Cobrança mês a mês</p>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCheckout('monthly') }}
                      onTouchStart={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="mt-3 w-full py-2.5 rounded-lg bg-[#2563EB] text-white font-semibold text-sm hover:bg-[#1D4ED8] transition-colors"
                    >
                      Escolher mensal
                    </button>
                  </div>
                  <div className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-xl p-4 text-center text-white border-2 border-[#2563EB]">
                    <p className="font-semibold">Plano Anual</p>
                    <p className="text-2xl font-bold mt-1">12× de R$ 59</p>
                    <p className="text-sm text-white/90 mt-1">Total: R$ 708 (1 ano)</p>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCheckout('annual') }}
                      onTouchStart={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="mt-3 w-full py-2.5 rounded-lg bg-white text-[#2563EB] font-semibold text-sm hover:bg-white/90 transition-colors"
                    >
                      Começar agora
                    </button>
                  </div>
                </div>
                <p className="text-center text-gray-700 mb-4 font-semibold">
                  Isso não é uma assinatura. É uma decisão de sair do improviso.
                </p>
                <ul className="space-y-3 mb-6 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-[#29CC6A] mr-3 text-xl">✓</span>
                    <span>Sistema de captação com orientação Noel (você não trava)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#29CC6A] mr-3 text-xl">✓</span>
                    <span>Links inteligentes e rotina que gera agenda</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#29CC6A] mr-3 text-xl">✓</span>
                    <span>Metodologia clara para encher agenda e parar de agendar ansiosa</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#29CC6A] mr-3 text-xl">✓</span>
                    <span>7 dias de garantia incondicional</span>
                  </li>
                </ul>
                <div className="relative" style={{ zIndex: 100, pointerEvents: 'auto' }}>
                  <a
                    href="/pt/nutri/checkout"
                    onClick={(e) => {
                      e.preventDefault()
                      handleCheckout('annual')
                    }}
                    className="block w-full text-center bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white px-6 py-4 rounded-xl text-lg font-bold hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all shadow-xl cursor-pointer"
                    style={{ pointerEvents: 'auto' }}
                  >
                    Começar com o YLADA agora
                  </a>
                </div>
              </div>
              
              <p className="text-center text-sm text-white/80 mt-6">
                Plano mensal R$ 97/mês ou anual 12× de R$ 59 (R$ 708/ano). Garantia de 7 dias.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center text-white mt-8">
                <p className="text-xl font-bold mb-4">Mentoria estratégica, não curso.</p>
                <p className="text-lg mb-4">
                  O Noel não executa por você. Ele impede que você trave. É direcionamento diário e clareza sobre o próximo passo certo.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 14 — GARANTIA */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#E9F1FF]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-6xl mb-4">🛡️</div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-[#1A1A1A]">
                Garantia Incondicional de 7 Dias
              </h2>
              <p className="text-xl sm:text-2xl font-bold text-[#2563EB] mb-6 py-4 px-6 bg-white/60 rounded-xl inline-block">
                Teste sem medo. Se não funcionar, você não perde nada.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                Devolvemos 100% do investimento. Sem burocracia, sem julgamento. Entre em contato com o suporte em até 7 dias.
              </p>
              <p className="text-lg text-gray-600">Simples assim.</p>
            </div>
          </div>
        </section>

        {/* BLOCO 15 — CTA FINAL (DECISÃO) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Você não precisa mais agendar ansiosa.
              </h2>
              <p className="text-xl font-bold mb-6 text-white">
                Sistema, orientação que destrava e agenda que enche. O próximo passo é seu.
              </p>
              <p className="text-lg font-semibold mb-8">Decida sair do improviso.</p>
              <Link
                href="#oferta"
                className="inline-block bg-white text-[#2563EB] px-10 py-5 rounded-xl text-xl font-bold hover:bg-gray-100 transition-all shadow-2xl"
              >
                Começar com o YLADA agora
              </Link>
            </div>
          </div>
        </section>

        {/* BLOCO 16 — FAQ (OBJEÇÕES) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                Perguntas Frequentes
              </h2>
              
              <div className="space-y-4">
                {[
                  {
                    pergunta: 'Como funciona o suporte?',
                    resposta: 'Orientação 24h por dia, 7 dias por semana, e suporte técnico via WhatsApp.'
                  },
                  {
                    pergunta: 'Para quem é o YLADA Nutri?',
                    resposta: 'Para nutricionistas que querem encher agenda, parar de agendar ansiosa e ter orientação que destrava.'
                  },
                  {
                    pergunta: 'Quanto tempo leva para ver resultados?',
                    resposta: 'Primeiros resultados em semanas. O importante é consistência.'
                  },
                  {
                    pergunta: 'Preciso ter conhecimento técnico avançado?',
                    resposta: 'Não. O método te guia passo a passo.'
                  },
                  {
                    pergunta: 'E se eu não usar tudo? Vou desperdiçar meu dinheiro?',
                    resposta: 'Não precisa usar tudo. Use o que fizer sentido pro seu momento. E você tem 7 dias de garantia para testar sem risco.'
                  },
                  {
                    pergunta: 'E se eu não tiver tempo?',
                    resposta: 'O YLADA foi feito para economizar seu tempo, não para consumir. Foco no que importa.'
                  },
                  {
                    pergunta: 'Posso cancelar durante o ano?',
                    resposta: 'Plano anual: compromisso de 12 meses (12× de R$ 59). Plano mensal (R$ 97/mês): pode cancelar quando quiser. Você tem 7 dias de garantia: se não for pra você, devolvemos 100%.'
                  }
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-[#1A1A1A] pr-4">{item.pergunta}</span>
                      <span className="text-[#2563EB] text-2xl flex-shrink-0">
                        {faqOpen === index ? '−' : '+'}
                      </span>
                    </button>
                    {faqOpen === index && (
                      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{item.resposta}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Botão flutuante fixo - Noel IA Vendedora */}
      <button
        onClick={openLyaWidget}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full shadow-2xl hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all flex items-center gap-2 sm:gap-3 font-semibold text-sm sm:text-base pointer-events-auto"
        style={{ bottom: '80px', zIndex: 40 }}
      >
        <span className="text-xl sm:text-2xl">💬</span>
        <span>Fale Conosco</span>
      </button>

      {/* Widget Noel IA Vendedora */}
      <LyaSalesWidget 
        isOpen={lyaWidgetOpen} 
        onOpenChange={setLyaWidgetOpen}
        hideButton={true}
      />

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <Image
                src="/images/logo/nutri-horizontal.png"
                alt="YLADA Nutri"
                width={133}
                height={40}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-600 text-sm mb-2 text-center">
              YLADA Nutricionista: Your Leading Advanced Data Assistant
            </p>
            <p className="text-gray-500 text-xs text-center mb-2">
              © {new Date().getFullYear()} YLADA. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-xs text-center">
              Portal Solutions Tech & Innovation LTDA
            </p>
            <p className="text-gray-400 text-xs text-center">
              CNPJ: 63.447.492/0001-88
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
