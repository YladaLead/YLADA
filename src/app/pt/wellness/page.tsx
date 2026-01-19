'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LanguageSelector from '../../../components/LanguageSelector'
import SalesSupportChat from '@/components/wellness/SalesSupportChat'
import { landingPageVideos } from '@/lib/landing-pages-assets'

export default function WellnessPage() {
  const [currentUrl, setCurrentUrl] = useState('https://ylada.app/pt/wellness')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href)
    }

    // Configurar YouTube Player API para resetar vídeo quando terminar
    if (typeof window !== 'undefined' && !(window as any).YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    let ytPlayer: any = null

    // Função para inicializar o player quando a API estiver pronta
    const initPlayer = () => {
      if ((window as any).YT && (window as any).YT.Player) {
        const iframe = document.getElementById('wellness-video-player')
        if (iframe && !ytPlayer) {
          ytPlayer = new (window as any).YT.Player('wellness-video-player', {
            events: {
              onStateChange: (event: any) => {
                // Quando o vídeo terminar (state = 0 = ENDED)
                if (event.data === (window as any).YT.PlayerState.ENDED) {
                  // Resetar para o início e pausar
                  setTimeout(() => {
                    ytPlayer.seekTo(0, true)
                    ytPlayer.pauseVideo()
                  }, 500)
                }
              },
            },
          })
        }
      }
    }

    // Se a API já estiver carregada
    if ((window as any).YT && (window as any).YT.Player) {
      setTimeout(initPlayer, 1000)
    } else {
      // Aguardar a API carregar
      ;(window as any).onYouTubeIframeAPIReady = () => {
        setTimeout(initPlayer, 500)
      }
    }

    return () => {
      // Cleanup
      if (ytPlayer) {
        try {
          ytPlayer.destroy()
        } catch (e) {
          // Ignorar erros de cleanup
        }
      }
    }
  }, [])
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="bg-transparent inline-block">
            <Image
              src="/images/logo/wellness-horizontal.png"
              alt="WELLNESS - Your Leading Data System"
              width={572}
              height={150}
              className="bg-transparent object-contain h-14 sm:h-16 lg:h-20 w-auto"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/pt/wellness/trial"
              className="px-3 sm:px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm whitespace-nowrap"
            >
              🎁 Teste 3 dias grátis
            </Link>
            <Link
              href="/pt/wellness/login"
              className="px-3 sm:px-4 py-2 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors text-xs sm:text-sm sm:text-base"
            >
              Entrar
            </Link>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main>
        {/* 🟣 HERO (Abertura) */}
        <section className="bg-gradient-to-br from-purple-50 via-green-50 to-emerald-50 py-12 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              {/* Gancho emocional */}
              <div className="mb-4 sm:mb-6">
                <p className="text-lg sm:text-xl text-gray-700 mb-2 font-semibold">
                  Você já se sentiu travado na hora de convidar alguém?
                </p>
                <p className="text-lg sm:text-xl text-gray-700 mb-2 font-semibold">
                  Você já ficou sem saber o que responder quando alguém perguntou sobre seu negócio?
                </p>
                <p className="text-lg sm:text-xl text-gray-700 font-semibold">
                  Você já desistiu de falar com alguém porque não sabia como começar?
                </p>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Pare de se sentir travado na hora de falar sobre Bem Estar.
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-700 mb-4 sm:mb-6 font-semibold">
                Com os links inteligentes e o NOEL, você para de adivinhar e começa a agir com clareza.
              </p>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 sm:p-6 mb-6 sm:mb-8 border border-gray-200 shadow-lg">
                <p className="text-base sm:text-lg text-gray-700 mb-3 sm:mb-4 leading-relaxed">
                  <strong className="font-bold">Você não precisa mais carregar tudo sozinho.</strong>
                </p>
                <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                  As conversas fluem melhor, e os resultados começam a aparecer.
                </p>
                
                <ul className="text-left space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1 flex-shrink-0">✔</span>
                    <span>Menos travas para conversar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1 flex-shrink-0">✔</span>
                    <span>Mais facilidade para explicar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1 flex-shrink-0">✔</span>
                    <span>Mais constância e resultados no dia a dia</span>
                  </li>
                </ul>
              </div>

              {/* CTA emocional no Hero */}
              <div className="text-center">
                <Link
                  href="/pt/wellness/checkout?plan=annual"
                  className="inline-block w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-base sm:text-lg"
                >
                  👉 Quero parar de me sentir travado e começar a conversar com mais pessoas
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 🎥 Vídeo Explicativo */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Veja como outras pessoas pararam de se sentir travadas
                </h2>
                <p className="text-base sm:text-lg text-gray-600 px-2 mb-2">
                  Sem pressão. Sem complicação. Sem precisar decorar nada.
                </p>
                <p className="text-base sm:text-lg text-gray-600 px-2">
                  Entenda como o Wellness, com links inteligentes e o NOEL, pode trazer mais leveza, organização e confiança para o seu dia a dia.
                </p>
              </div>
              
              <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg aspect-video mx-2 sm:mx-0 mb-6 sm:mb-8">
                {/* Vídeo do Supabase Storage */}
                <video 
                  className="w-full h-full object-cover"
                  controls
                  loop
                  playsInline
                  preload="metadata"
                  poster={landingPageVideos.wellnessHeroPoster}
                  onError={(e) => {
                    const video = e.currentTarget
                    const error = video.error
                    console.error('❌ Erro ao carregar vídeo:', {
                      errorCode: error?.code,
                      errorMessage: error?.message,
                      videoSrc: video.src,
                      videoCurrentSrc: video.currentSrc,
                      poster: video.poster,
                      networkState: video.networkState,
                      readyState: video.readyState,
                    })
                    
                    // Tentar carregar novamente após 2 segundos
                    setTimeout(() => {
                      video.load()
                    }, 2000)
                  }}
                  onLoadStart={() => {
                    console.log('🔄 Iniciando carregamento do vídeo:', landingPageVideos.wellnessHero)
                  }}
                  onLoadedMetadata={(e) => {
                    const video = e.currentTarget
                    console.log('✅ Vídeo carregado com sucesso:', {
                      duration: video.duration,
                      videoWidth: video.videoWidth,
                      videoHeight: video.videoHeight,
                      src: video.src,
                      currentSrc: video.currentSrc,
                      networkState: video.networkState,
                    })
                  }}
                  onCanPlay={() => {
                    console.log('▶️ Vídeo pronto para reproduzir')
                  }}
                >
                  <source src={landingPageVideos.wellnessHero} type="video/mp4" />
                  Seu navegador não suporta vídeo HTML5.
                </video>
              </div>

              <div className="text-center">
                <Link
                  href="/pt/wellness/checkout?plan=annual"
                  className="inline-block w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-base sm:text-lg text-center"
                >
                  👉 Quero parar de me sentir travado e começar a conversar com mais pessoas
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Menos peso. Mais clareza. */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Gancho emocional */}
              <p className="text-xl sm:text-2xl text-gray-700 text-center mb-4 font-semibold">
                Você já se sentiu sobrecarregado tentando explicar tudo sozinho?
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
                Você não precisa mais carregar tudo sozinho.
              </h2>
              
              <p className="text-lg text-gray-700 text-center mb-6 leading-relaxed">
                Com Wellness, você não precisa:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-gray-700">❌ improvisar conversas</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-gray-700">❌ decorar falas</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-gray-700">❌ explicar tudo sozinho</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-gray-700">❌ carregar tudo nas costas</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 text-center">
                <p className="text-lg text-gray-700 mb-2">
                  Você passa a contar com Links Inteligentes e com o NOEL, que te orienta em cada passo.
                </p>
                <p className="text-lg text-gray-700 font-semibold mt-4">
                  E agora você tem apoio. Não precisa mais tentar sozinho.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🔗 Links Inteligentes */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              {/* Gancho emocional */}
              <p className="text-xl sm:text-2xl text-gray-700 text-center mb-4 font-semibold">
                Você já desistiu de falar com alguém porque não sabia como começar?
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
                Links que fazem você parar de se sentir travado na hora de convidar
              </h2>

              <div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-gray-200">
                <p className="text-lg text-gray-700 mb-4 font-semibold">
                  Imagine não precisar mais improvisar. Não precisar mais decorar. Não precisar mais se sentir pressionado.
                </p>
                <p className="text-lg text-gray-700 mb-6 font-semibold">
                  Na prática, a plataforma Wellness funciona assim:
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Você usa Links Inteligentes, criados para facilitar o contato com mais pessoas, sem peso e sem abordagem forçada.
                </p>
                <p className="text-lg text-gray-700 mb-4 font-semibold">
                  Esses links ajudam você a:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700"><strong>Abrir conversas</strong> de <strong>forma natural</strong>, sem parecer convite direto</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700"><strong>Gerar interesse</strong> e <strong>curiosidade</strong>, porque entregam valor logo de início</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700"><strong>Se propagar facilmente</strong>, sendo compartilhados, indicados e reenviados</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700"><strong>Falar com mais pessoas ao mesmo tempo</strong>, sem repetir explicações</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700"><strong>Agregar valor antes da venda</strong>, o que aumenta a abertura e a confiança</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700"><strong>Facilitar indicações</strong>, porque a própria pessoa se sente confortável em compartilhar</span>
                  </li>
                </ul>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    👉 Você não precisa mais se sentir pressionado.
                  </p>
                  <p className="text-lg font-semibold text-gray-900 mb-2">
                    👉 Você não precisa mais convencer ninguém.
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    👉 Você só precisa compartilhar algo que faz sentido.
                  </p>
                </div>
              </div>

              {/* Imagem Decorativa - Dentro da Seção de Links */}
              <div className="my-8 sm:my-12 flex justify-center">
                <div className="w-full max-w-md opacity-60 hover:opacity-80 transition-opacity duration-300">
                  <Image
                    src="/images/wellness-hero-com-logo.png"
                    alt="Pessoas conversando sobre Bem Estar de forma simples e leve"
                    width={600}
                    height={337}
                    className="w-full h-auto rounded-xl shadow-lg"
                  />
                </div>
              </div>

              {/* Conteúdo adicional */}
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg border border-gray-200">
                <p className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                  👉 Você não precisa empurrar nada.
                </p>
                <p className="text-base sm:text-lg font-bold text-gray-900 mb-4">
                  👉 Você só compartilha algo que faz sentido.
                </p>
                <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
                  Quando o conteúdo agrega valor, as pessoas se interessam, se aproximam e a conversa acontece.
                </p>
                <p className="text-base sm:text-lg text-gray-700 mb-3">
                  Isso traz:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-gray-900 mt-1">•</span>
                    <span className="text-base sm:text-lg">mais leveza</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-900 mt-1">•</span>
                    <span className="text-base sm:text-lg">mais naturalidade</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-900 mt-1">•</span>
                    <span className="text-base sm:text-lg">mais alcance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-gray-900 mt-1">•</span>
                    <span className="text-base sm:text-lg">mais resultados, sem desgaste</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 🤖 NOEL */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              {/* Gancho emocional */}
              <p className="text-xl sm:text-2xl text-gray-700 text-center mb-4 font-semibold">
                Você já ficou sem saber o que responder quando alguém perguntou sobre seu negócio?
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
                NOEL: você não precisa mais ficar sem saber o que responder
              </h2>

              <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-8 shadow-lg border-2 border-green-200">
                <p className="text-lg text-gray-700 mb-6">
                  O NOEL é a inteligência do Wellness.
                </p>
                <p className="text-lg font-semibold text-gray-900 mb-4">
                  Ele está ali para te ajudar quando você:
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-xl">•</span>
                    <p className="text-gray-700">não sabe o que responder</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-xl">•</span>
                    <p className="text-gray-700">não sabe como convidar</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-xl">•</span>
                    <p className="text-gray-700">está travado</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-xl">•</span>
                    <p className="text-gray-700">perdeu o foco</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-xl">•</span>
                    <p className="text-gray-700">quer organizar melhor o dia</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 text-xl">•</span>
                    <p className="text-gray-700">quer se comunicar com mais segurança</p>
                  </div>
                </div>
                <p className="text-lg text-gray-700 italic mb-4">
                  É como ter alguém experiente te orientando, sem julgamento e sem cobrança.
                </p>
                <p className="text-lg text-gray-700 font-semibold">
                  Você não precisa mais tentar sozinho. Você tem apoio.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tudo flui melhor */}
        <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {/* Gancho emocional */}
              <p className="text-xl sm:text-2xl text-gray-700 text-center mb-4 font-semibold">
                Você já se sentiu sobrecarregado tentando fazer tudo sozinho?
              </p>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
                Você não precisa mais se sentir sobrecarregado
              </h2>

              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
                <p className="text-lg text-gray-700 mb-6">
                  Com o Noel e a plataforma Wellness, você percebe que:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700">o trabalho fica mais organizado</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700">as conversas ficam mais leves</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700">a confiança aumenta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700">o dia rende mais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-gray-700">a cabeça fica mais tranquila</span>
                  </li>
                </ul>
                <p className="text-lg font-semibold text-gray-900 mt-6">
                  Você para de adivinhar e começa a agir com mais clareza.
                </p>
                <p className="text-lg text-gray-700 font-semibold mt-4">
                  E agora você tem clareza. Não precisa mais tentar sozinho.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 📈 Para quem é / Para quem NÃO é */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              {/* Gancho emocional */}
              <p className="text-xl sm:text-2xl text-gray-700 text-center mb-6 font-semibold">
                Você se sente travado na hora de conversar sobre Bem Estar?
              </p>

              <div className="grid sm:grid-cols-2 gap-8">
                {/* Para quem é */}
                <div className="bg-green-50 rounded-xl p-8 border-2 border-green-200">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Para quem quer parar de se sentir travado
                  </h2>
                  
                  <p className="text-lg text-gray-700 mb-4">
                    Se você se sente travado, sobrecarregado ou sem saber como começar, o Wellness é para você.
                  </p>
                  
                  <p className="text-lg font-semibold text-gray-900 mb-4">Para quem trabalha com:</p>
                  <ul className="space-y-2 mb-6 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      bem-estar
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      relacionamento com pessoas
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      rotina com clientes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      acompanhamento
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      desenvolvimento de equipe
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      multinível
                    </li>
                  </ul>

                  <p className="text-lg font-semibold text-gray-900 mb-4">E quer:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-xl">✔</span>
                      <p className="text-gray-700">mais clareza</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-xl">✔</span>
                      <p className="text-gray-700">mais leveza</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-xl">✔</span>
                      <p className="text-gray-700">mais organização</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-xl">✔</span>
                      <p className="text-gray-700">mais confiança</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-xl">✔</span>
                      <p className="text-gray-700">crescer sem pressão</p>
                    </div>
                  </div>
                </div>

                {/* Para quem NÃO é */}
                <div className="bg-red-50 rounded-xl p-8 border-2 border-red-200">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    Para quem não é:
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 text-xl">❌</span>
                      <p className="text-gray-700">quem não aplica</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 text-xl">❌</span>
                      <p className="text-gray-700">quem procura fórmula mágica</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 text-xl">❌</span>
                      <p className="text-gray-700">quem não quer se organizar</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 text-xl">❌</span>
                      <p className="text-gray-700">quem desiste fácil</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🚀 Escolha seu Plano */}
        <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            {/* Gancho emocional */}
            <p className="text-xl sm:text-2xl text-gray-700 text-center mb-4 font-semibold">
              Você está pronto para parar de se sentir travado?
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
              Você não precisa mais se sentir travado. Comece agora.
            </h2>

            <p className="text-lg text-gray-700 text-center mb-12">
              Sem compromisso. Sem pressão. Sem precisar decorar nada.
            </p>
            
            <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-8">
              {/* Plano Anual */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-500 hover:border-green-600 transition-all transform scale-105 relative">
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                  RECOMENDADO
                </div>
                <div className="text-4xl mb-4 text-center mt-4">🔥</div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Plano Anual — Recomendado</h3>
                <p className="text-3xl font-bold text-green-600 text-center mb-6">12x de R$ 59,90</p>
                <ul className="space-y-3 mb-6 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✔</span>
                    acesso completo
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✔</span>
                    links inteligentes
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✔</span>
                    inteligência NOEL
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✔</span>
                    uso da plataforma Wellness
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✔</span>
                    melhor custo-benefício
                  </li>
                </ul>
                <Link
                  href="/pt/wellness/checkout?plan=annual"
                  className="block w-full text-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  👉 Quero parar de me sentir travado e começar a conversar com mais pessoas
                </Link>
              </div>
              
              {/* Plano Mensal */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 hover:border-green-500 transition-all">
                <div className="text-4xl mb-4 text-center">🌿</div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Plano Mensal</h3>
                <p className="text-3xl font-bold text-green-600 text-center mb-6">R$ 97,00</p>
                <ul className="space-y-3 mb-6 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✔</span>
                    acesso completo
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✔</span>
                    links inteligentes
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✔</span>
                    inteligência NOEL
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✔</span>
                    uso da plataforma Wellness
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✔</span>
                    ideal para sentir na prática
                  </li>
                </ul>
                <Link
                  href="/pt/wellness/checkout?plan=monthly"
                  className="block w-full text-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  👉 Quero parar de me sentir travado e começar a conversar com mais pessoas
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 🛡 Garantia */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 border-2 border-green-200">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                  Teste sem medo. Se não funcionar, você não perde nada.
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Se você não sentir que está no caminho certo,
                </p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  devolvemos 100% do valor.
                </p>
                <p className="text-lg text-gray-600 mt-4 italic">
                  Simples assim.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 CTA FINAL */}
        <section className="bg-gradient-to-br from-green-600 to-emerald-700 py-16 sm:py-20 lg:py-24 text-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Você não precisa mais se sentir travado.
              </h2>
              <p className="text-xl text-green-50 mb-4 leading-relaxed">
                Cada dia que você adia é mais um dia longe da carreira que você quer ter.
              </p>
              <p className="text-xl text-green-50 mb-6 leading-relaxed">
                O Wellness existe para deixar seu trabalho:
              </p>
              <ul className="text-lg text-green-50 mb-6 space-y-2">
                <li>• mais leve</li>
                <li>• mais claro</li>
                <li>• mais organizado</li>
                <li>• mais natural</li>
              </ul>
              <div className="mb-6 text-green-50">
                <p className="text-lg mb-2">🔗 Com links que ajudam</p>
                <p className="text-lg mb-2">🤖 Com uma inteligência que orienta</p>
                <p className="text-lg mb-4">💚 Com apoio no dia a dia</p>
              </div>
              <p className="text-lg text-green-50 mb-8 leading-relaxed">
                Você não precisa mais acordar ansioso. Você não precisa mais se sentir sozinho. Você não precisa mais tentar descobrir tudo sozinho.
              </p>
              <Link
                href="/pt/wellness/checkout?plan=annual"
                className="inline-flex items-center px-10 py-5 bg-white text-green-600 text-xl font-bold rounded-xl hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                👉 Quero parar de me sentir travado e começar a conversar com mais pessoas
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 bg-transparent inline-block">
              <Image
                src="/images/logo/wellness-horizontal.png"
                alt="WELLNESS - Your Leading Data System"
                width={572}
                height={150}
                className="bg-transparent object-contain h-20 w-auto"
                style={{ backgroundColor: 'transparent' }}
                priority
              />
            </div>
            <p className="text-gray-600 text-sm mb-2 text-center">
              Powered by <span className="font-semibold">YLADA</span>
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

      {/* Chat de Suporte */}
      <SalesSupportChat />
    </div>
  )
}
