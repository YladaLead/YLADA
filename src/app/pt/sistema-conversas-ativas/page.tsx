'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { landingPageVideos } from '@/lib/landing-pages-assets'

/**
 * Página institucional do Sistema de Conversas Ativas.
 * Educa e aquece → CTA para /pt/nutri (não fala preço, plano nem Noel em profundidade).
 */
export default function SistemaConversasAtivasPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoPlaying, setVideoPlaying] = useState(false)

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

  const pilares = [
    { num: 1, title: 'Ativação', desc: 'Você provoca a conversa — não espera.' },
    { num: 2, title: 'Direcionamento', desc: 'Você conduz com estratégia.' },
    { num: 3, title: 'Qualificação', desc: 'Você identifica interesse real.' },
    { num: 4, title: 'Conversão', desc: 'Você apresenta solução com naturalidade.' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/pt/nutri" className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
            <Image src="/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png" alt="YLADA" width={100} height={32} />
            <span className="text-sm font-medium hidden sm:inline">Nutri</span>
          </Link>
          <Link
            href="/pt/nutri"
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ir para Nutri
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        {/* 🔷 HERO */}
        <section className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Sistema de Conversas Ativas para Nutricionistas
          </h1>
          <p className="text-xl text-gray-800 max-w-2xl mx-auto mb-2 font-medium">
            Sua agenda não está vazia por falta de competência.
          </p>
          <p className="text-xl text-gray-800 max-w-2xl mx-auto mb-4 font-medium">
            Está vazia por falta de sistema.
          </p>
          <p className="text-lg text-gray-700 font-medium italic mb-6">
            Venda não nasce do post.<br />Nasce da conversa.
          </p>

          {/* 🎥 Vídeo — altura reduzida, sombra e borda premium (será trocado pelo vídeo estratégico) */}
          <div className="max-w-2xl mx-auto mb-6">
            <div
              role="button"
              tabIndex={0}
              onClick={toggleVideo}
              onKeyDown={(e) => e.key === 'Enter' && toggleVideo()}
              className="aspect-[16/10] max-h-[320px] bg-gray-900 rounded-2xl overflow-hidden cursor-pointer group relative border-2 border-gray-200/80 shadow-lg shadow-gray-300/40 ring-2 ring-white/50"
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
                  <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center text-blue-600 shadow-lg">
                    <svg className="w-7 h-7 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
              )}
            </div>
          </div>

          <Link
            href="/pt/nutri"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
          >
            👉 Quero aplicar o método na minha agenda
          </Link>
          <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">
            Você será direcionada para conhecer o YLADA Nutri.
          </p>

          {/* Prova implícita — mais concreto */}
          <p className="text-sm text-gray-500 mt-6">
            Nutricionistas já estão aplicando o método para gerar conversas todos os dias.
          </p>
        </section>

        {/* 🔷 BLOCO 2 – Você já se sentiu assim? — espaçamento reduzido, punchline destacada */}
        <section className="mb-10 sm:mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Você já se sentiu assim?
          </h2>
          <ul className="max-w-md mx-auto space-y-2 text-gray-700 text-base mb-4">
            <li>• Agenda vazia</li>
            <li>• Dúvida na cobrança</li>
            <li>• Sensação constante de recomeçar</li>
            <li>• Falta de clareza do próximo passo</li>
          </ul>
          <p className="text-center text-2xl font-bold text-gray-900">
            O problema não é você. É falta de método.
          </p>
        </section>

        {/* 🔷 BLOCO 3 – O que não é / O que é — contraste emocional forte */}
        <section className="mb-12 sm:mb-14">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="bg-red-100/90 border-2 border-red-300 rounded-xl p-5">
              <h2 className="font-bold text-gray-900 mb-2">❌ Não é</h2>
              <ul className="text-gray-800 text-sm space-y-1.5">
                <li>• Automação fria</li>
                <li>• Disparo em massa</li>
                <li>• Depender do algoritmo</li>
                <li>• “Forçar venda”</li>
              </ul>
            </div>
            <div className="bg-emerald-100/90 border-2 border-emerald-400 rounded-xl p-5">
              <h2 className="font-bold text-gray-900 mb-2">✅ É</h2>
              <ul className="text-gray-800 text-sm space-y-1.5 font-medium">
                <li>• Sistema estratégico</li>
                <li>• Conversa com intenção</li>
                <li>• Captação previsível</li>
                <li>• Metodologia clara</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 🔷 BLOCO 4 – Os 4 pilares — ícones em círculos com gradiente */}
        <section className="mb-12 sm:mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">
            Os 4 pilares
          </h2>
          <p className="text-gray-600 text-center mb-6 max-w-xl mx-auto text-sm">
            Sem esses 4 pilares, você só está postando.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pilares.map((p) => (
              <div key={p.title} className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 font-bold text-sm mb-3">
                  {p.num}
                </span>
                <h3 className="font-semibold text-gray-900 mb-1">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🔷 NOVO – Para quem é (entre 4 pilares e Enquanto a maioria) */}
        <section className="mb-12 sm:mb-14">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">
            Esse método é para você que:
          </h2>
          <ul className="max-w-md mx-auto space-y-2 text-gray-700">
            <li className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              Quer agenda previsível
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              Não quer depender de reels
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              Quer método, não sorte
            </li>
          </ul>
        </section>

        {/* 🔷 BLOCO 5 – Enquanto a maioria… — conclusão em destaque */}
        <section className="mb-12 sm:mb-14 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-5 text-center">
            Enquanto a maioria…
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-2">A maioria:</p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Posta e espera</li>
                <li>• Faz tráfego e torce</li>
                <li>• Reclama do algoritmo</li>
              </ul>
            </div>
            <div>
              <p className="text-blue-600 text-sm font-medium mb-2">Quem usa Conversas Ativas:</p>
              <ul className="text-gray-800 text-sm space-y-1 font-medium">
                <li>• Provoca interesse</li>
                <li>• Abre diálogo</li>
                <li>• Constrói conexão</li>
                <li>• Fecha venda</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 pt-5 pb-1 border-t-2 border-b-2 border-gray-300">
            <p className="text-center text-2xl sm:text-3xl font-bold text-gray-900 italic py-2">
              Sem conversa, não existe conversão.
            </p>
          </div>
        </section>

        {/* 🔷 BLOCO FINAL — área de decisão (fundo diferenciado) */}
        <section className="text-center py-10 sm:py-12 px-4 bg-blue-50/70 border border-blue-100 rounded-2xl shadow-sm">
          <p className="text-base text-gray-700 mb-1">
            Se isso já fez sentido para você…
          </p>
          <p className="text-base text-gray-800 font-medium mb-1">
            Você não precisa continuar rolando.
          </p>
          <p className="text-lg text-gray-900 font-semibold mb-6">
            Você pode começar hoje.
          </p>
          <Link
            href="/pt/nutri"
            className="inline-flex items-center gap-2 px-9 py-[1.05rem] text-lg bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/25"
          >
            👉 Quero aplicar isso na minha Nutri
          </Link>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <p>YLADA — Sistema de Conversas Ativas. Método para nutricionistas.</p>
      </footer>
    </div>
  )
}
