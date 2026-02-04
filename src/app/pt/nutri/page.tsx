'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LyaSalesWidget from '@/components/nutri/LyaSalesWidget'
import { landingPageVideos } from '@/lib/landing-pages-assets'
import { trackNutriSalesView } from '@/lib/facebook-pixel'

const WHATSAPP_NUTRI = '5519997230912'
const WHATSAPP_MSG = 'Olá! Estou na página da YLADA Nutri e gostaria de tirar dúvidas.'

export default function NutriLandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(0)
  const [lyaWidgetOpen, setLyaWidgetOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoProgress, setVideoProgress] = useState(0)
  const [videoPlaying, setVideoPlaying] = useState(false)

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

  const handleCheckout = (planType: 'annual' | 'monthly') => {
    const checkoutUrl = `/pt/nutri/checkout?plan=${planType}`
    window.location.href = checkoutUrl
  }

  const onVideoTimeUpdate = () => {
    const video = videoRef.current
    if (!video || !video.duration || Number.isNaN(video.duration)) return
    const pct = (video.currentTime / video.duration) * 100
    setVideoProgress(Math.min(100, pct))
  }

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
        {/* BLOCO 1 — HERO (compacto: anúncio pode usar #video para cair no vídeo) */}
        <section className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] text-white pt-8 sm:pt-10 pb-10 sm:pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-base sm:text-lg text-white/85 mb-2 font-medium">
                Para nutricionistas cansadas de tentar sozinhas e improvisar a própria agenda.
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-4 leading-tight">
                O sistema de captação{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  com orientação que destrava.
                </span>
              </h1>
              <p className="text-base text-white/90 mb-6 max-w-xl mx-auto">
                Estrutura de apoio para você sair do improviso, sem indecisão.
              </p>
              <Link
                href="#video"
                className="inline-block bg-white text-[#2563EB] px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-bold hover:bg-gray-100 transition-all shadow-xl"
              >
                Quero sair do improviso
              </Link>
              <p className="text-xs text-white/70 mt-2 font-normal">
                Veja se esse sistema faz sentido para você
              </p>
            </div>
          </div>
        </section>

        {/* VÍDEO — Use /pt/nutri#video no anúncio para desembocar direto aqui */}
        <section id="video" className="pt-2 sm:pt-4 pb-10 sm:pb-14 bg-white scroll-mt-4">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <p className="text-base sm:text-lg text-center text-gray-600 mb-3">
                Entenda como organizar sua agenda e ter tração de verdade. Assista ao vídeo.
              </p>
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden mb-4">
                <div
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
                </div>
                <div className="h-1.5 w-full bg-gray-200">
                  <div className="h-full bg-[#2563EB] transition-[width] duration-150 ease-out" style={{ width: `${videoProgress}%` }} />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 pb-2">
                <a
                  href={`https://wa.me/${WHATSAPP_NUTRI}?text=${encodeURIComponent(WHATSAPP_MSG)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex justify-center items-center px-5 py-3 rounded-lg text-base font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Tirar dúvida
                </a>
                <Link
                  href="/pt/nutri/checkout?plan=annual"
                  className="w-full sm:flex-1 sm:max-w-xs inline-flex justify-center items-center px-8 py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all shadow-xl"
                >
                  Sair do improviso
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 2 — DOR (ENXUTO | FRASES DURAS) */}
        <section className="py-14 sm:py-18 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-[#1A1A1A]">
                Você já se sentiu assim?
              </h2>
              
              <ul className="space-y-3 text-lg sm:text-xl text-gray-700">
                <li className="font-semibold text-[#2563EB]">• Agenda vazia</li>
                <li className="font-semibold text-[#2563EB]">• Dúvida na cobrança</li>
                <li className="font-semibold text-[#2563EB]">• Sensação de recomeçar de novo</li>
              </ul>
              <p className="mt-6 text-lg text-gray-700 leading-relaxed">
                Conteúdo que não gera conversa não gera agenda. Você posta, os likes vêm, <strong>"quanto custa?"</strong> não chega. Planilhas, apps, rotinas: você já tentou. E volta ao mesmo lugar: <strong>improviso, solidão, sem clareza do que fazer amanhã.</strong>
              </p>
              
              <div className="mt-10 text-center">
                <p className="text-xl font-bold text-[#1A1A1A]">
                  Se você se reconheceu, continue.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 3 — O PROBLEMA NÃO É VOCÊ (ENXUTO | CONTRASTE TÉCNICO × EMPRESARIAL) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-[#1A1A1A]">
                O problema não é você. É falta de sistema.
              </h2>
              
              <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 mb-8">
                <p className="text-lg sm:text-xl text-gray-700 mb-6 leading-relaxed font-semibold">
                  Respire fundo. Você não está quebrada. O que falta é uma metodologia clara de captação e uma estrutura de apoio que destrave. Não mais indecisão, não mais “o que faço amanhã?”.
                </p>
                
                <p className="text-lg text-gray-700 mb-4">
                  A faculdade te ensinou a ser nutricionista técnica. Não te ensinou a captar clientes, organizar o negócio nem cobrar com clareza.
                </p>
                <p className="text-lg text-gray-700 font-semibold">
                  A diferença entre quem cresce e quem fica no improviso não é talento. <strong>É sistema.</strong>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 4 — O INIMIGO INVISÍVEL (FACULDADE + MERCADO) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                O que a faculdade te ensinou, e o que ela não te ensinou
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-[#E9F1FF] rounded-xl p-8 border-2 border-[#2563EB]">
                  <h3 className="text-2xl font-bold mb-4 text-[#2563EB]">O Que a Faculdade Ensinou</h3>
                  <p className="text-gray-700 mb-4">Você aprendeu:</p>
                  <ul className="space-y-3 text-gray-700">
                    <li>• Avaliar paciente e necessidades nutricionais</li>
                    <li>• Prescrever dietas e interpretar exames</li>
                    <li>• Acompanhar evolução clínica</li>
                  </ul>
                  <p className="text-lg font-semibold text-gray-700 mt-6">Isso é fundamental. E você domina.</p>
                </div>
                
                <div className="bg-[#FFF4E6] rounded-xl p-8 border-2 border-[#FF9800]">
                  <h3 className="text-2xl font-bold mb-4 text-[#FF9800]">O Que a Faculdade Não Ensinou</h3>
                  <p className="text-gray-700 mb-4">Não te preparou para:</p>
                  <ul className="space-y-3 text-gray-700">
                    <li>• Construir negócio e captar clientes</li>
                    <li>• Organizar processos e precificar</li>
                    <li>• Criar sistemas que funcionem sem você</li>
                    <li>• Transformar conhecimento em receita</li>
                  </ul>
                  <p className="text-lg font-semibold text-gray-700 mt-6">Ela cumpre seu papel: formar técnicos.</p>
                </div>
              </div>
              
              <div className="bg-[#2563EB] rounded-xl py-6 px-6 text-center text-white max-w-2xl mx-auto">
                <p className="text-xl font-bold mb-2">
                  O mercado exige que você seja duas coisas:
                </p>
                <p className="text-lg">1. <strong>Nutricionista técnica</strong> (isso você já é). 2. <strong>Empresária estratégica</strong> (isso ninguém te ensinou)</p>
                <p className="text-xl font-bold mt-4">É aqui que nasce a Nutri-Empresária.</p>
              </div>
            </div>
          </div>
        </section>

        {/* BLOCO 5 — NASCE A NUTRI-EMPRESÁRIA (MOVIMENTO) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-[#F5F7FA]">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-[#1A1A1A]">
                O que muda com o sistema
              </h2>
              
              <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 mb-8">
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
                  Quem adota um sistema de captação para de depender de sorte e de “dar um jeito”.
                </p>
                
                <div className="space-y-4 text-lg text-gray-700 mb-8">
                  <div className="flex flex-wrap gap-2 items-baseline">
                    <span className="font-bold text-[#FF4F4F]">Sem sistema:</span> sorte, indicação, improviso.
                    <span className="font-bold text-[#29CC6A]">Com sistema:</span> metodologia clara, agenda que enche.
                  </div>
                  <div className="flex flex-wrap gap-2 items-baseline">
                    <span className="font-bold text-[#FF4F4F]">Sem sistema:</span> “o que faço amanhã?”, indecisão.
                    <span className="font-bold text-[#29CC6A]">Com sistema:</span> rotina definida, estrutura de apoio.
                  </div>
                  <div className="flex flex-wrap gap-2 items-baseline pt-2">
                    <span className="font-bold text-[#FF4F4F]">Sem sistema:</span> você trava.
                    <span className="font-bold text-[#29CC6A]">Com sistema:</span> você segue.
                  </div>
                </div>
              </div>
              
              {/* Tabela Comparativa */}
              <div className="bg-white rounded-xl shadow-lg p-8 mb-6 overflow-x-auto">
                <h3 className="text-2xl font-bold mb-6 text-center text-[#1A1A1A]">
                  Nutri Tradicional × Nutri-Empresária
                </h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-[#FF4F4F]/5 rounded-lg p-6 border-2 border-[#FF4F4F]/30">
                    <h4 className="text-xl font-bold mb-4 text-[#FF4F4F]">Nutri Tradicional</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li>• Indicação, agenda inconsistente</li>
                      <li>• Insegurança para cobrar</li>
                      <li>• Improviso, recomeçando</li>
                      <li>• Solidão, só técnico</li>
                    </ul>
                  </div>
                  <div className="bg-[#29CC6A]/10 rounded-lg p-6 border-2 border-[#29CC6A]/50">
                    <h4 className="text-xl font-bold mb-4 text-[#29CC6A]">Nutri-Empresária</h4>
                    <ul className="space-y-3 text-gray-700">
                      <li>• Sistemas de captação</li>
                      <li>• Agenda previsível, clareza de preço</li>
                      <li>• Processos definidos, crescimento</li>
                      <li>• Mentoria + mentalidade empresarial</li>
                    </ul>
                  </div>
                </div>
                <p className="text-center text-lg font-semibold text-gray-800 mt-6">
                  O divisor de águas não é conhecimento. É sistema.
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] rounded-xl py-5 px-6 text-center text-white max-w-2xl mx-auto">
                <p className="text-xl font-bold">
                  O divisor de águas não é conhecimento. É sistema.
                </p>
                <p className="text-base mt-2 opacity-95">Você quer encher agenda com método e parar de travar?</p>
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
              
              <div className="bg-white rounded-xl shadow-lg p-8 sm:p-10 mb-8 border-2 border-[#2563EB]">
                <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
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
                    <span>LYA como mentora que impede abandono</span>
                  </li>
                </ul>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#E9F1FF] rounded-xl p-8 border-2 border-[#2563EB]">
                  <h3 className="text-2xl font-bold mb-6 text-[#2563EB]">Para Quem É</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Quer encher agenda e parar de agendar ansiosa</li>
                    <li>• Quer se livrar de indecisão e ter metodologia clara de captação</li>
                    <li>• Está cansada de depender de sorte ou indicação</li>
                    <li>• Quer estrutura de apoio e orientação que destrava</li>
                    <li>• Quer parar de travar e ter rotina que gera agenda</li>
                  </ul>
                </div>
                
                <div className="bg-[#FFF4E6] rounded-xl p-8 border-2 border-[#FF9800]">
                  <h3 className="text-2xl font-bold mb-6 text-[#FF9800]">Para Quem NÃO É</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Não é para quem ainda quer "ver se dá"</li>
                    <li>• Não quer assumir um sistema de captação agora</li>
                    <li>• Esperam resultados sem seguir um método</li>
                    <li>• Querem soluções mágicas sem trabalho</li>
                    <li>• Não estão abertas a mudar mentalidade e processos</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                  Se você está pronta para se tornar uma Nutri-Empresária, o YLADA é para você.
                </p>
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
                    title: '3. LYA como mentoria estratégica',
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

        {/* BLOCO 8 — A LYA (MENTORA ESTRATÉGICA) */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-[#1A1A1A]">
                LYA: Sua Mentora Estratégica
              </h2>
              <p className="text-xl text-center text-gray-600 mb-12">
                Direcionamento diário, clareza de foco e execução prática
              </p>
              
              <div className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-xl shadow-lg p-8 sm:p-10 mb-8 text-white">
                <p className="text-xl sm:text-2xl font-bold mb-4">
                  A LYA existe para impedir que você volte ao improviso.
                </p>
                <p className="text-lg mb-0 leading-relaxed">
                  Ela não te dá lista infinita de opções. Ela te diz: <strong>o foco agora, a ação, onde aplicar.</strong> Mentoria estratégica que funciona.
                </p>
              </div>
              
              <div className="text-center bg-white rounded-xl shadow-lg p-6 border-2 border-[#2563EB]">
                <p className="text-xl font-bold text-[#2563EB]">
                  LYA não executa por você. Ela impede que você trave.
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
                    resultado: 'LYA + suporte humano quando precisar.'
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
                LYA é orientação que destrava: direcionamento diário e metodologia clara de captação. Estrutura de apoio para você encher agenda e parar de agendar ansiosa.
              </p>
              
              <div className="bg-white rounded-2xl p-8 shadow-2xl border-4 border-yellow-400 relative" style={{ pointerEvents: 'auto' }}>
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2 text-[#1A1A1A]">Plano Anual</h3>
                  <p className="text-gray-600 mb-1">Acesso válido por 12 meses</p>
                  <p className="text-sm text-gray-500">Compromisso com economia clara</p>
                </div>
                <div className="bg-gradient-to-br from-[#2563EB] to-[#3B82F6] rounded-xl p-6 mb-6 text-center text-white">
                  <p className="text-3xl sm:text-4xl font-bold">12× de R$ 97</p>
                  <p className="text-sm text-white/90 mt-2">Total: R$ 1.164 (1 ano de acesso)</p>
                </div>
                <p className="text-center text-gray-700 mb-4 font-semibold">
                  Isso não é uma assinatura. É uma decisão de sair do improviso.
                </p>
                <ul className="space-y-3 mb-6 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-[#29CC6A] mr-3 text-xl">✓</span>
                    <span>Sistema de captação com orientação LYA (você não trava)</span>
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
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleCheckout('annual')
                    }}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleCheckout('annual')
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="w-full bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white px-6 py-4 rounded-xl text-lg font-bold hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all shadow-xl cursor-pointer active:scale-95"
                    style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent', pointerEvents: 'auto', position: 'relative', zIndex: 100, userSelect: 'none', WebkitUserSelect: 'none', minHeight: '48px' }}
                  >
                    👉 Quero sair do improviso
                  </button>
                </div>
              </div>
              
              <p className="text-center text-sm text-white/80 mt-6">
                Plano anual com fidelidade de 12 meses. Garantia de 7 dias. Detalhes no checkout.
              </p>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center text-white mt-8">
                <p className="text-xl font-bold mb-4">Mentoria estratégica, não curso.</p>
                <p className="text-lg mb-4">
                  LYA não executa por você. Ela impede que você trave. É direcionamento diário e clareza sobre o próximo passo certo.
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
                Quero sair do improviso
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
                    pergunta: 'Posso cancelar durante o ano?',
                    resposta: 'O plano anual é um compromisso de 12 meses (12× de R$ 97, total R$ 1.164/ano). Não há cancelamento durante o período anual. A decisão de 12 meses reflete o compromisso com sua transformação. Você tem 7 dias de garantia incondicional para testar: se não for pra você, devolvemos 100%.'
                  },
                  {
                    pergunta: 'Como funciona o suporte?',
                    resposta: 'Você tem acesso a: LYA (mentora estratégica digital), disponível 24/7 para orientações estratégicas. Suporte técnico, para dúvidas sobre uso da plataforma. Comunidade, para trocar experiências com outras Nutri-Empresárias.'
                  },
                  {
                    pergunta: 'Para quem é o YLADA Nutri?',
                    resposta: 'O YLADA Nutri é para nutricionistas que querem encher agenda e parar de agendar ansiosa. Que querem se livrar de indecisão e ter metodologia clara de captação. Que estão cansadas de depender de sorte ou indicação e querem estrutura de apoio e orientação que destrava. Se você quer parar de travar e ter rotina que gera agenda, o YLADA é para você.'
                  },
                  {
                    pergunta: 'Quanto tempo leva para ver resultados?',
                    resposta: 'Os primeiros resultados aparecem nas primeiras semanas, quando você começa a organizar seus processos e criar suas primeiras ferramentas de captação. A transformação completa acontece ao longo de 3 a 6 meses, quando você aplica o método com consistência e desenvolve a mentalidade de Nutri-Empresária. O importante não é velocidade. É consistência e método.'
                  },
                  {
                    pergunta: 'Preciso ter conhecimento técnico avançado?',
                    resposta: 'Não. O YLADA Nutri não ensina nutrição clínica (isso você já sabe). Ele ensina como transformar seu conhecimento técnico em um negócio que funciona. Você não precisa de conhecimento avançado em tecnologia, marketing ou gestão. O método te guia passo a passo.'
                  },
                  {
                    pergunta: 'E se eu não usar todas as ferramentas?',
                    resposta: 'Tudo bem. O YLADA não é sobre usar tudo. É sobre usar o que você precisa, quando precisa. A LYA te ajuda a focar no que é prioritário para o seu momento atual. Você não precisa usar todas as ferramentas. Precisa usar as ferramentas certas, no momento certo. O método te guia. Você não precisa descobrir sozinha.'
                  },
                  {
                    pergunta: 'E se eu não conseguir usar tudo? Vou ter desperdiçado meu dinheiro?',
                    resposta: 'Você não precisa usar tudo. O YLADA não é sobre usar todas as ferramentas. É sobre usar as ferramentas certas, no momento certo. A LYA te ajuda a focar no que é prioritário para o seu momento atual. Você não precisa descobrir sozinha. E com a garantia de 7 dias, você pode testar sem risco.'
                  },
                  {
                    pergunta: 'E se eu não tiver tempo para isso?',
                    resposta: 'O YLADA foi feito para economizar seu tempo, não para consumir. A ideia é você trabalhar menos e ganhar mais. A LYA te guia para focar no que realmente importa, sem perder tempo com o que não faz diferença agora. O método foi pensado para nutricionistas que já têm uma rotina corrida.'
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

      {/* Botão flutuante fixo - LYA IA Vendedora */}
      <button
        onClick={openLyaWidget}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full shadow-2xl hover:from-[#3B82F6] hover:to-[#1D4ED8] transition-all flex items-center gap-2 sm:gap-3 font-semibold text-sm sm:text-base pointer-events-auto"
        style={{ bottom: '80px', zIndex: 40 }}
      >
        <span className="text-xl sm:text-2xl">💬</span>
        <span>Fale Conosco</span>
      </button>

      {/* Widget LYA IA Vendedora */}
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
