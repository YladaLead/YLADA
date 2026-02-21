'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LyaSalesWidget from '@/components/nutri/LyaSalesWidget'
import { trackNutriSalesView } from '@/lib/facebook-pixel'
import { landingPageVideos } from '@/lib/landing-pages-assets'

export default function NutriLandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [lyaWidgetOpen, setLyaWidgetOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)

  useEffect(() => {
    trackNutriSalesView()
  }, [])

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index)
  }

  const openLyaWidget = () => {
    setLyaWidgetOpen(true)
  }

  const handleCheckout = (plan: 'monthly' | 'annual' = 'annual') => {
    window.location.href = `/pt/nutri/checkout?plan=${plan}`
  }

  const toggleVideo = () => {
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
        {/* 1️⃣ HERO — página oficial de vendas (Sistema + dor + conversa) */}
        <section className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white pt-10 sm:pt-14 pb-10 sm:pb-14">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-3">
                Sistema de Conversas Ativas para Nutricionistas
              </h1>
              <p className="text-lg sm:text-xl text-white/95 mb-3">
                Se sua agenda oscila todo mês, o problema não é falta de pacientes. É falta de sistema.
              </p>
              <p className="text-base sm:text-lg font-medium italic text-white/90 mb-6">
                Venda não nasce do post. Nasce da conversa.
              </p>
              <div className="flex flex-col items-center">
                <Link
                  href="/pt/nutri/checkout"
                  className="inline-flex items-center justify-center w-full sm:w-auto max-w-md px-8 py-4 rounded-xl bg-white text-[#2563EB] font-bold text-lg hover:bg-white/95 transition-all shadow-2xl shadow-black/25 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)]"
                >
                  👉 Quero aplicar o método na minha agenda
                </Link>
                <p className="text-sm text-white/90 mt-4">
                  Sem depender de indicação, reels ou sorte.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2️⃣ VÍDEO — protagonista (trocar src quando tiver o vídeo fechador) */}
        <section id="video" className="py-10 sm:py-14 bg-white scroll-mt-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <p className="text-center text-gray-700 mb-4 text-sm sm:text-base font-medium">
                👉 Assista e entenda por que sua agenda oscila.
              </p>
              <div
                role="button"
                tabIndex={0}
                onClick={toggleVideo}
                onKeyDown={(e) => e.key === 'Enter' && toggleVideo()}
                className="aspect-video max-h-[400px] bg-gray-900 rounded-2xl overflow-hidden cursor-pointer group relative border-2 border-gray-200 shadow-xl"
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  poster={landingPageVideos.nutriHeroPoster}
                  playsInline
                  onPlay={() => setVideoPlaying(true)}
                  onPause={() => setVideoPlaying(false)}
                >
                  <source src={landingPageVideos.nutriHero} type="video/mp4" />
                </video>
                {!videoPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                    <span className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center text-blue-600 shadow-lg">
                      <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <Link
                  href="/pt/nutri/checkout"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] transition-colors"
                >
                  Quero aplicar o método
                </Link>
                <a href="#planos" className="inline-flex items-center justify-center px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  Ver planos
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ Reforço curto da dor */}
        <section className="py-8 sm:py-10 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                Nutri, sua agenda não estava vazia por falta de competência.
              </p>
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mt-2">
                Estava vazia por falta de sistema.
              </p>
              <p className="text-lg sm:text-xl font-semibold text-[#1A1A1A] mt-4">
                Agora você já entendeu isso. O próximo passo é aplicar.
              </p>
            </div>
          </div>
        </section>

        {/* 4️⃣ Você já se sentiu assim? — âncora emocional; punchline sozinha, maior, soco */}
        <section className="py-10 sm:py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center">
              <p className="text-base sm:text-lg text-gray-600 mb-4">
                Se você já viveu isso, você não está sozinha.
              </p>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-4">
                Você já se sentiu assim?
              </h2>
              <ul className="space-y-2 text-gray-700 text-left inline-block mb-10">
                <li>• Agenda vazia</li>
                <li>• Dúvida na cobrança</li>
                <li>• Sensação constante de recomeçar</li>
                <li>• Falta de clareza do próximo passo</li>
              </ul>
              <p className="text-3xl sm:text-4xl font-black text-[#1A1A1A] text-center leading-tight py-6 px-2">
                O problema não é você. É falta de método.
              </p>
            </div>
          </div>
        </section>

        {/* 5️⃣ O que você recebe (objetivo) — título centralizado, lista à esquerda */}
        <section className="py-10 sm:py-14 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-4 text-center">
                O que você recebe
              </h2>
              <p className="text-lg text-gray-700 mb-6 text-center">
                YLADA Nutri é a aplicação prática do Sistema de Conversas Ativas.
              </p>
              <p className="text-gray-700 font-medium mb-3 text-left">Dentro do YLADA Nutri você recebe:</p>
              <ul className="space-y-3 text-gray-700 mb-6 text-left">
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </span>
                  <span><span className="text-[#29CC6A] font-bold">✓</span> Sistema de captação com orientação Noel</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </span>
                  <span><span className="text-[#29CC6A] font-bold">✓</span> Links inteligentes que provocam conversa</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </span>
                  <span><span className="text-[#29CC6A] font-bold">✓</span> Trilha Empresarial de 30 dias</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                  </span>
                  <span><span className="text-[#29CC6A] font-bold">✓</span> Direcionamento estratégico diário</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-[#2563EB]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </span>
                  <span><span className="text-[#29CC6A] font-bold">✓</span> Suporte humano quando necessário</span>
                </li>
              </ul>
              <p className="text-center text-gray-600 font-medium">
                Sem curso longo. Sem teoria solta. Sem improviso.
              </p>
            </div>
          </div>
        </section>

        {/* 4️⃣ Bloco visual: Método resumido — 3 pilares com ícones, sombra e hover */}
        <section className="py-10 sm:py-14 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <p className="text-center text-gray-700 font-medium mb-2">
                👉 Você não precisa de mais conteúdo. Você precisa de estrutura.
              </p>
              <h2 className="text-xl font-bold text-[#1A1A1A] mb-6 text-center">
                Método resumido
              </h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#3B82F6]/10 rounded-xl p-6 border-2 border-[#2563EB]/30 text-center shadow-md hover:shadow-lg hover:border-[#2563EB]/50 hover:scale-[1.02] transition-all duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#2563EB]/15 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                  <p className="font-bold text-[#1A1A1A] text-lg">Captação previsível</p>
                </div>
                <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#3B82F6]/10 rounded-xl p-6 border-2 border-[#2563EB]/30 text-center shadow-md hover:shadow-lg hover:border-[#2563EB]/50 hover:scale-[1.02] transition-all duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#2563EB]/15 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <p className="font-bold text-[#1A1A1A] text-lg">Clareza empresarial</p>
                </div>
                <div className="bg-gradient-to-br from-[#2563EB]/10 to-[#3B82F6]/10 rounded-xl p-6 border-2 border-[#2563EB]/30 text-center shadow-md hover:shadow-lg hover:border-[#2563EB]/50 hover:scale-[1.02] transition-all duration-200">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#2563EB]/15 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  </div>
                  <p className="font-bold text-[#1A1A1A] text-lg">Orientação que impede abandono</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ Transformação resumida — impacto visual (fundo distinto, títulos maiores, bordas marcadas) */}
        <section className="py-10 sm:py-14 bg-gray-200/80">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border-2 border-red-300 shadow-md">
                  <h3 className="text-2xl font-bold text-red-700 mb-4">Antes</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2"><span className="text-red-500 font-bold">✗</span> Ansiedade</li>
                    <li className="flex items-center gap-2"><span className="text-red-500 font-bold">✗</span> Agenda vazia</li>
                    <li className="flex items-center gap-2"><span className="text-red-500 font-bold">✗</span> Insegurança</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl p-6 border-2 border-emerald-400 shadow-md">
                  <h3 className="text-2xl font-bold text-[#29CC6A] mb-4">Depois</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2"><span className="text-[#29CC6A] font-bold">✓</span> Conversas abertas</li>
                    <li className="flex items-center gap-2"><span className="text-[#29CC6A] font-bold">✓</span> Segurança na cobrança</li>
                    <li className="flex items-center gap-2"><span className="text-[#29CC6A] font-bold">✓</span> Método claro</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8️⃣ Planos — parte principal */}
        <section id="planos" className="py-14 sm:py-20 bg-gradient-to-br from-[#2563EB] to-[#3B82F6] scroll-mt-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-2">
                Escolha seu plano
              </h2>
              <p className="text-center text-white/95 mb-8 text-lg">
                Se você já entendeu que precisa de método, aqui é onde decide aplicar.
              </p>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Plano Mensal */}
                <div className="bg-white rounded-2xl p-6 shadow-xl text-center">
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Plano Mensal</h3>
                  <p className="text-3xl font-bold text-[#2563EB]">R$ 97<span className="text-base font-normal text-gray-600">/mês</span></p>
                  <p className="text-sm text-gray-600 mt-2">Sem fidelidade</p>
                  <p className="text-sm text-gray-600 mt-0.5">Pode cancelar quando quiser</p>
                  <p className="text-sm text-gray-700 mt-2 font-medium">Ideal para testar o método sem compromisso.</p>
                  <p className="text-sm text-gray-600 mt-3 flex items-center justify-center gap-1.5">
                    <span>🛡️</span> Garantia 7 dias
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCheckout('monthly')}
                    className="mt-5 w-full py-3 rounded-xl bg-[#2563EB] text-white font-semibold hover:bg-[#1D4ED8] transition-colors"
                  >
                    Começar mensal
                  </button>
                </div>

                {/* Plano Anual */}
                <div className="bg-white rounded-2xl p-6 shadow-xl text-center border-2 border-yellow-400 relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-0.5 rounded-full">Recomendado</span>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Plano Anual</h3>
                  <p className="text-2xl font-bold text-[#2563EB]">12× de R$ 59</p>
                  <p className="text-sm text-gray-600 mt-1">Total R$ 708</p>
                  <p className="text-sm font-semibold text-emerald-600 mt-1">Economia de R$ 456 no ano</p>
                  <p className="text-xs font-medium text-gray-600 mt-1">Menos de R$ 2 por dia para ter agenda previsível.</p>
                  <p className="text-sm text-gray-700 mt-2 font-medium">Para nutricionistas que decidiram parar de viver de instabilidade.</p>
                  <p className="text-sm text-gray-600 mt-3 flex items-center justify-center gap-1.5">
                    <span>🛡️</span> Garantia 7 dias
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCheckout('annual')}
                    className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white font-semibold hover:from-[#1D4ED8] hover:to-[#2563EB] transition-colors"
                  >
                    Começar anual
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7️⃣ Garantia — ícone maior, fundo azul com mais contraste */}
        <section className="py-12 sm:py-16 bg-[#BFDBFE]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <span className="text-6xl sm:text-7xl block mb-4">🛡️</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-3">
                Garantia de 7 dias incondicional
              </h2>
              <p className="text-lg text-gray-700 mb-2">
                Teste. Se não fizer sentido, devolvemos 100%.
              </p>
              <p className="text-gray-600">
                Sem burocracia. Sem julgamento.
              </p>
            </div>
          </div>
        </section>

        {/* 🔟 FAQ — enxuto */}
        <section className="py-12 sm:py-16 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-center text-[#1A1A1A] mb-8">
                Perguntas frequentes
              </h2>
              <div className="space-y-3">
                {[
                  { pergunta: 'Para quem é?', resposta: 'Para nutricionistas que querem encher agenda com método, não com indicação ou sorte. Se você quer captação previsível e clareza no próximo passo, é pra você.' },
                  { pergunta: 'Posso cancelar?', resposta: 'Você tem 7 dias de garantia para testar: tanto no plano mensal quanto no anual. Se não fizer sentido, devolvemos 100%. No mensal, depois da garantia você cancela quando quiser. No anual, o compromisso é de 12 meses — mas os 7 primeiros dias são sem risco.' },
                  { pergunta: 'Como é o suporte?', resposta: 'O Noel te orienta no dia a dia (o que fazer, onde focar). Quando precisar de pessoa real, tem suporte humano. Você não fica sozinha.' },
                  { pergunta: 'E se não gostar?', resposta: 'Em até 7 dias você pede reembolso e devolvemos 100%. Sem burocracia, sem julgamento. O risco é nosso.' },
                  { pergunta: 'Quando começo a usar?', resposta: 'Assim que concluir o pagamento você já acessa. Não tem fila: começa hoje.' },
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-semibold text-[#1A1A1A] pr-4">{item.pergunta}</span>
                      <span className="text-[#2563EB] text-xl flex-shrink-0 transition-transform duration-300">{faqOpen === index ? '−' : '+'}</span>
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-out ${faqOpen === index ? 'max-h-56 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                        <p className="text-gray-700 text-sm">{item.resposta}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA final — uma direção, limpo e direto */}
        <section className="py-10 sm:py-12 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center">
              <p className="text-lg font-semibold text-gray-800 mb-6">
                Continuar como está também é uma decisão.
              </p>
              <Link
                href="/pt/nutri/checkout"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white hover:from-[#1D4ED8] hover:to-[#2563EB] transition-all shadow-lg"
              >
                👉 Quero aplicar o método na minha agenda
              </Link>
            </div>
          </div>
        </section>
      </main>

      <button
        onClick={openLyaWidget}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full shadow-2xl hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all flex items-center gap-2 sm:gap-3 font-semibold text-sm sm:text-base"
      >
        <span className="text-xl sm:text-2xl">💬</span>
        <span>Fale Conosco</span>
      </button>

      <LyaSalesWidget isOpen={lyaWidgetOpen} onOpenChange={setLyaWidgetOpen} hideButton={true} />

      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <Image src="/images/logo/nutri-horizontal.png" alt="YLADA Nutri" width={133} height={40} className="h-8 w-auto mb-4" />
            <p className="text-gray-600 text-sm text-center">YLADA Nutricionista. © {new Date().getFullYear()} YLADA.</p>
            <p className="text-gray-400 text-xs text-center mt-1">Portal Solutions Tech & Innovation LTDA — CNPJ 63.447.492/0001-88</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
