'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import LanguageSelector from '../../../components/LanguageSelector'
import SalesSupportChat from '@/components/wellness/SalesSupportChat'

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
          <LanguageSelector />
        </div>
      </header>

      <main>
        {/* 🟣 HERO (Abertura) */}
        <section className="bg-gradient-to-br from-purple-50 via-green-50 to-emerald-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Seu trabalho com bem-estar fica muito mais simples, organizado e produtivo a partir de hoje.
              </h1>
              
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-200 shadow-lg">
                <p className="text-lg sm:text-xl text-gray-700 mb-4 leading-relaxed">
                  Se você sente que às vezes fica perdido, sem saber o que fazer no dia, sem ritmo, sem clareza…
                </p>
                <p className="text-lg sm:text-xl text-gray-700 mb-4 leading-relaxed">
                  Se sente que poderia crescer mais, mas falta direção…
                </p>
                <p className="text-lg sm:text-xl text-gray-700 mb-4 leading-relaxed">
                  Ou se já tentou várias vezes e acabou travando no meio do caminho…
                </p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 mt-6">
                  👉 O Wellness System foi criado exatamente para resolver isso.
                </p>
                <p className="text-lg sm:text-xl font-semibold text-gray-900 mt-4">
                  E com o Mentor NOEL, você nunca mais vai trabalhar sozinho ou sem saber o que fazer.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🎥 Vídeo Explicativo */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  🎥 Veja Como Funciona na Prática
                </h2>
                <p className="text-lg text-gray-600">
                  Entenda como o Wellness System pode transformar sua rotina
                </p>
              </div>
              
              <div className="bg-gray-100 rounded-xl overflow-hidden shadow-lg aspect-video">
                {/* 
                  OPÇÃO 1: YouTube (RECOMENDADO)
                  - Faça upload do vídeo no YouTube
                  - Copie o ID do vídeo (ex: dQw4w9WgXcQ)
                  - Substitua YOUTUBE_VIDEO_ID abaixo
                */}
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/Qg0ZQeX2Hrg?rel=0&modestbranding=1&controls=1&enablejsapi=1&origin=https://ylada.app"
                  title="Wellness System - Como Funciona na Prática"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  id="wellness-video-player"
                ></iframe>
                
                {/* 
                  OPÇÃO 2: Vídeo direto (se hospedar em CDN externo)
                  Descomente e ajuste a URL do seu CDN:
                  
                <video
                  className="w-full h-full object-cover"
                  controls
                  autoPlay={false}
                  playsInline
                  preload="metadata"
                >
                  <source src="https://seu-cdn.com/videos/wellness-explicativo.mp4" type="video/mp4" />
                  <p className="text-center text-gray-600 p-8">
                    Seu navegador não suporta a reprodução de vídeo.
                  </p>
                </video>
                */}
              </div>
            </div>
          </div>
        </section>

        {/* ⭐ Por que tantas pessoas travam */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-8">
                ⭐ Por que tantas pessoas travam quando trabalham com wellness?
              </h2>
              
              <p className="text-lg text-gray-700 text-center mb-8 leading-relaxed">
                Porque é normal enfrentar:
              </p>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-gray-700">❌ Falta de clareza sobre o que fazer todo dia</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-gray-700">❌ Dúvidas sobre como convidar pessoas</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-gray-700">❌ Insegurança para falar com clientes</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-gray-700">❌ Medo de fazer apresentação</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-gray-700">❌ Falta de ritmo</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-gray-700">❌ Procrastinação</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-gray-700">❌ Desorganização</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <p className="text-gray-700">❌ Falta de método</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200 sm:col-span-2">
                  <p className="text-gray-700">❌ Não saber treinar um novo integrante</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 text-center">
                <p className="text-lg text-gray-700 mb-2">
                  E quando você trabalha sozinho, tudo fica ainda mais difícil.
                </p>
                <p className="text-xl font-bold text-green-600">
                  👉 O Wellness System existe para eliminar todas essas dificuldades.
                </p>
                <p className="text-lg text-gray-900 mt-4 font-semibold">
                  Aqui você não precisa adivinhar nada.
                </p>
                <p className="text-lg text-gray-900 font-semibold">
                  Aqui você sabe exatamente como avançar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 O que o Wellness System faz por você */}
        <section className="bg-gray-50 py-16 sm:py-20 lg:py-24">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
                🔥 O que o Wellness System faz por você:
              </h2>

              {/* Benefício 1 */}
              <div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-gray-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">1️⃣</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Mostra exatamente o que você deve fazer todos os dias
                    </h3>
                    <p className="text-lg text-gray-700 mb-4">
                      Com o método 2•5•10™, você tem um plano diário simples e claro:
                    </p>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                        <p className="text-2xl font-bold text-green-600 mb-2">✔ 2</p>
                        <p className="text-gray-700">ações rápidas</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                        <p className="text-2xl font-bold text-green-600 mb-2">✔ 5</p>
                        <p className="text-gray-700">mensagens estratégicas</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                        <p className="text-2xl font-bold text-green-600 mb-2">✔ 10</p>
                        <p className="text-gray-700">minutos de progresso real</p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mt-4">
                      Você nunca mais vai acordar "sem rumo".
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefício 2 */}
              <div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-gray-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">2️⃣</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Dá clareza total para trabalhar sem medo, confusão ou travas
                    </h3>
                    <p className="text-lg text-gray-700 mb-4">Você recebe:</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✔</span>
                        <p className="text-gray-700">Scripts prontos</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✔</span>
                        <p className="text-gray-700">Conversas completas</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✔</span>
                        <p className="text-gray-700">Como convidar</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✔</span>
                        <p className="text-gray-700">Como fazer apresentação</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✔</span>
                        <p className="text-gray-700">Como fazer follow-up</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✔</span>
                        <p className="text-gray-700">Como vender bebidas funcionais</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✔</span>
                        <p className="text-gray-700">Como direcionar kits</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✔</span>
                        <p className="text-gray-700">Como orientar novos integrantes</p>
                      </div>
                    </div>
                    <p className="text-lg text-gray-700 mt-4 italic">
                      Tudo de forma simples, humana e prática.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefício 3 - NOEL */}
              <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-xl p-8 mb-8 shadow-lg border-2 border-green-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">3️⃣</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      O NOEL — seu mentor que explica, orienta e te ajuda em tempo real
                    </h3>
                    <p className="text-lg text-gray-700 mb-4">
                      O NOEL é como um mentor inteligente disponível 24 horas por dia.
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mb-4">
                      Ele te ajuda quando você:
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 text-xl">💡</span>
                        <p className="text-gray-700">Não sabe o que responder</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 text-xl">💡</span>
                        <p className="text-gray-700">Não sabe como convidar</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 text-xl">💡</span>
                        <p className="text-gray-700">Quer treinar alguém</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 text-xl">💡</span>
                        <p className="text-gray-700">Está travado</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 text-xl">💡</span>
                        <p className="text-gray-700">Perdeu o foco</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 text-xl">💡</span>
                        <p className="text-gray-700">Não sabe como criar ritmo</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 text-xl">💡</span>
                        <p className="text-gray-700">Quer melhorar suas vendas</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 text-xl">💡</span>
                        <p className="text-gray-700">Quer estruturar sua rotina</p>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mt-4">
                      É como ter um líder experiente o tempo todo ao seu lado.
                    </p>
                  </div>
                </div>
              </div>

              {/* Benefício 4 */}
              <div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-gray-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">4️⃣</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Tira o peso e a bagunça da sua rotina
                    </h3>
                    <p className="text-lg text-gray-700 mb-4">Você aprende:</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✔</span>
                        <p className="text-gray-700">Como se organizar</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✔</span>
                        <p className="text-gray-700">Como agir todo dia</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✔</span>
                        <p className="text-gray-700">Como criar consistência</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✔</span>
                        <p className="text-gray-700">Como acompanhar clientes</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✔</span>
                        <p className="text-gray-700">Como treinar equipe</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-xl">✔</span>
                        <p className="text-gray-700">Como melhorar sua comunicação</p>
                      </div>
                      <div className="flex items-center gap-2 sm:col-span-2">
                        <span className="text-green-600 text-xl">✔</span>
                        <p className="text-gray-700">Como manter ritmo mesmo em dias difíceis</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefício 5 */}
              <div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-gray-200">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">5️⃣</span>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Ajuda você a crescer com naturalidade
                    </h3>
                    <p className="text-lg text-gray-700 mb-4">
                      Sem pressão.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                      Sem complicação.
                    </p>
                    <p className="text-lg text-gray-700 mb-4">
                      Sem métodos mirabolantes.
                    </p>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200 mt-4">
                      <p className="text-lg font-semibold text-gray-900">
                        A filosofia YLADA é simples:
                      </p>
                      <p className="text-xl font-bold text-green-600 mt-2">
                        O que é simples, funciona. E o que funciona, duplica.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 📈 Para quem é / Para quem NÃO é */}
        <section className="py-16 sm:py-20 lg:py-24 bg-white">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <div className="grid sm:grid-cols-2 gap-8">
                {/* Para quem é */}
                <div className="bg-green-50 rounded-xl p-8 border-2 border-green-200">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    📈 Para quem é o Wellness System?
                  </h2>
                  
                  <p className="text-lg font-semibold text-gray-900 mb-4">Para quem trabalha com:</p>
                  <ul className="space-y-2 mb-6 text-gray-700">
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      Bebidas funcionais
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      Bem-estar
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      Produtos de saúde
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      Rotina com clientes
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      Processo de acompanhamento
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-600">•</span>
                      Desenvolvimento de equipe
                    </li>
                  </ul>

                  <p className="text-lg font-semibold text-gray-900 mb-4">E quer:</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-xl">✔</span>
                      <p className="text-gray-700">Ter clareza</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-xl">✔</span>
                      <p className="text-gray-700">Ganhar confiança</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-xl">✔</span>
                      <p className="text-gray-700">Aumentar vendas</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-xl">✔</span>
                      <p className="text-gray-700">Trabalhar melhor</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-xl">✔</span>
                      <p className="text-gray-700">Crescer com consistência</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 text-xl">✔</span>
                      <p className="text-gray-700">Construir resultados de verdade</p>
                    </div>
                  </div>
                </div>

                {/* Para quem NÃO é */}
                <div className="bg-red-50 rounded-xl p-8 border-2 border-red-200">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                    🟢 Para quem NÃO é:
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 text-xl">❌</span>
                      <p className="text-gray-700">Quem complica o simples</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 text-xl">❌</span>
                      <p className="text-gray-700">Quem não aplica nada</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 text-xl">❌</span>
                      <p className="text-gray-700">Quem desiste rápido</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 text-xl">❌</span>
                      <p className="text-gray-700">Quem quer resultado sem método</p>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center mb-12">
              🚀 Escolha seu Plano e Comece Agora
            </h2>
            
            <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-8">
              {/* Plano Anual */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-green-500 hover:border-green-600 transition-all transform scale-105 relative">
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
                  RECOMENDADO
                </div>
                <div className="text-4xl mb-4 text-center mt-4">🔥</div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Plano Anual</h3>
                <p className="text-3xl font-bold text-green-600 text-center mb-6">12x de R$ 59,90</p>
                <ul className="space-y-3 mb-6 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Acesso completo
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Mais econômico
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    A melhor opção pra quem quer crescer
                  </li>
                </ul>
                <Link
                  href="/pt/wellness/checkout?plan=annual"
                  className="block w-full text-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  💚 Quero o Plano Anual
                </Link>
              </div>
              
              {/* Plano Mensal */}
              <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-gray-200 hover:border-green-500 transition-all">
                <div className="text-4xl mb-4 text-center">🌿</div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Plano Mensal</h3>
                <p className="text-3xl font-bold text-green-600 text-center mb-6">R$ 97,00</p>
                <ul className="space-y-3 mb-6 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Acesso completo
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-600 mr-2">✓</span>
                    Ideal para quem quer experimentar
                  </li>
                </ul>
                <Link
                  href="/pt/wellness/checkout?plan=monthly"
                  className="block w-full text-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  💚 Quero o Mensal
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
                  🛡 Garantia de 7 Dias Sem Risco
                </h2>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Se não fizer sentido para você,
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
                Você não precisa mais tentar adivinhar o caminho.
              </h2>
              <p className="text-xl text-green-50 mb-8 leading-relaxed">
                O Wellness System te mostra exatamente como crescer – todos os dias.
              </p>
              <Link
                href="/pt/wellness/checkout?plan=annual"
                className="inline-flex items-center px-10 py-5 bg-white text-green-600 text-xl font-bold rounded-xl hover:bg-green-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                🚀 Quero Começar Agora
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
