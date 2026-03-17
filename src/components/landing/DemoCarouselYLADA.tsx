'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'

export type DemoSlide = {
  tag: string
  tagIcon?: string
  title: string
  description: string
  pills: string[]
  chatTitle: string
  chatSubtitle: string
  messages: { from: 'client' | 'pro'; text: string; time: string }[]
}

const DEMO_SLIDES: DemoSlide[] = [
  {
    tag: 'Nutricionista',
    tagIcon: '🥗',
    title: 'Diagnóstico que qualifica antes do primeiro contato',
    description:
      'Cliente acessa seu link, responde ao quiz e recebe resultado personalizado. No WhatsApp já chega sabendo por que te procurar.',
    pills: ['Diagnóstico', 'Link inteligente', 'WhatsApp'],
    chatTitle: 'Dra. Ana · Nutri',
    chatSubtitle: 'online agora',
    messages: [
      { from: 'client', text: 'Fiz o quiz que você postou. Deu que meu perfil é mais ansiedade e sono.', time: '14:22' },
      {
        from: 'pro',
        text: 'Isso, pelo que você respondeu faz sentido. Quer que a gente marque uma consulta para montar um plano?',
        time: '14:23',
      },
      { from: 'client', text: 'Quero sim.', time: '14:23' },
    ],
  },
  {
    tag: 'Wellness',
    tagIcon: '✨',
    title: 'Script que gera interesse sem pressionar',
    description:
      'Você envia um link de valor; a pessoa consome e, se quiser, te procura. A conversa começa com quem já demonstrou interesse.',
    pills: ['Link de valor', 'Script', 'Primeiro contato'],
    chatTitle: 'Consultor · Bem-Estar',
    chatSubtitle: 'online agora',
    messages: [
      { from: 'client', text: 'Vi o material que você mandou sobre os 3 erros.', time: '10:15' },
      { from: 'pro', text: 'Que bom! O que mais fez sentido pra você?', time: '10:16' },
      { from: 'client', text: 'O do café da manhã. Acho que é isso que tá me atrapalhando.', time: '10:17' },
      {
        from: 'pro',
        text: 'Então faz sentido a gente conversar. Te mando o link para agendar um horário?',
        time: '10:17',
      },
    ],
  },
  {
    tag: 'Coach',
    tagIcon: '🎯',
    title: 'Quem chega no seu WhatsApp já passou pelo filtro',
    description:
      'Diagnóstico ou quiz no link filtra curiosos. Quem clica em "Falar comigo" já se identificou com o conteúdo.',
    pills: ['Filtragem', 'Diagnóstico', 'Conversas melhores'],
    chatTitle: 'Coach · Prioridades',
    chatSubtitle: 'online agora',
    messages: [
      { from: 'client', text: 'Fiz o diagnóstico de prioridades. Deu que preciso focar em rotina primeiro.', time: '09:42' },
      {
        from: 'pro',
        text: 'Perfeito, então já estamos falando no ponto certo. Quer que eu te explique como trabalho a rotina com os clientes?',
        time: '09:43',
      },
      { from: 'client', text: 'Sim, por favor.', time: '09:43' },
    ],
  },
  {
    tag: 'Saúde',
    tagIcon: '🩺',
    title: 'Paciente chega na consulta já consciente do problema',
    description:
      'Link com conteúdo ou mini-avaliação faz o paciente refletir antes. No consultório a conversa é mais objetiva e valorizada.',
    pills: ['Consciência', 'Pré-consulta', 'Autoridade'],
    chatTitle: 'Dr. Santos · Consultório',
    chatSubtitle: 'online agora',
    messages: [
      { from: 'client', text: 'Fiz aquele checklist que você indicou. Acho que meu caso é mais estresse.', time: '11:05' },
      {
        from: 'pro',
        text: 'Ótimo que você já trouxe isso. Na consulta a gente aprofunda e monta o plano. Te mando o link para agendar?',
        time: '11:06',
      },
    ],
  },
  {
    tag: 'Vendedor',
    tagIcon: '📦',
    title: 'Oferta aparece depois do valor',
    description:
      'Cliente acessa calculadora, quiz ou conteúdo; recebe resultado útil. Quem te procurar no WhatsApp já viu valor e tende a converter melhor.',
    pills: ['Valor primeiro', 'Conversão', 'Link'],
    chatTitle: 'Suplementos · Especialista',
    chatSubtitle: 'online agora',
    messages: [
      { from: 'client', text: 'Usei a calculadora que você mandou. Faz sentido eu repor vitamina D?', time: '15:30' },
      {
        from: 'pro',
        text: 'Pelo que você colocou, vale a pena a gente conversar. Quer que eu te indique o próximo passo?',
        time: '15:31',
      },
    ],
  },
  {
    tag: 'Método YLADA',
    tagIcon: '🔗',
    title: 'Do link ao WhatsApp: valor → consciência → conversa',
    description:
      'Em todo segmento o fluxo é o mesmo: servir primeiro, educar, depois o CTA natural para o seu WhatsApp.',
    pills: ['Servir primeiro', 'Diagnóstico', 'Conversa'],
    chatTitle: 'YLADA',
    chatSubtitle: 'como funciona',
    messages: [
      { from: 'client', text: 'Recebi o resultado do diagnóstico.', time: '—' },
      { from: 'pro', text: 'Faz sentido pra você?', time: '—' },
      { from: 'client', text: 'Faz. Quero falar com você.', time: '—' },
    ],
  },
]

function WhatsAppMockup({ slide }: { slide: DemoSlide }) {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[300px] flex-shrink-0">
      {/* Moldura do celular */}
      <div className="rounded-[2.5rem] border-[10px] border-gray-800 bg-gray-900 p-2 shadow-xl">
        <div className="overflow-hidden rounded-[1.75rem] bg-white">
          {/* Barra de status / cabeçalho WhatsApp */}
          <div className="bg-[#075E54] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
                {slide.tagIcon ?? '💬'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-sm">{slide.chatTitle}</p>
                <p className="truncate text-xs opacity-90">{slide.chatSubtitle}</p>
              </div>
            </div>
          </div>
          {/* Área das mensagens */}
          <div className="bg-[#E5DDD5] min-h-[320px] p-3 space-y-2">
            {slide.messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.from === 'client' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 shadow-sm ${
                    msg.from === 'client'
                      ? 'bg-[#DCF8C6] text-gray-900'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  <p className="text-sm leading-snug">{msg.text}</p>
                  <p className="text-[10px] text-gray-500 mt-1 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DemoCarouselYLADA() {
  const [index, setIndex] = useState(0)
  const total = DEMO_SLIDES.length
  const slide = DEMO_SLIDES[index]

  const goPrev = useCallback(() => {
    setIndex((i) => (i === 0 ? total - 1 : i - 1))
  }, [total])

  const goNext = useCallback(() => {
    setIndex((i) => (i === total - 1 ? 0 : i + 1))
  }, [total])

  // Autoplay (6s por slide)
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % total), 6000)
    return () => clearInterval(t)
  }, [total])

  return (
    <section
      id="como-funciona-na-pratica"
      className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-16 sm:py-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline da seção */}
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Veja como funciona na prática
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Valor no link. Consciência no resultado. Conversa no seu WhatsApp.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 max-w-5xl mx-auto">
          {/* Lado esquerdo: texto */}
          <div className="flex-1 min-w-0 order-2 lg:order-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 text-indigo-800 px-3 py-1 text-sm font-medium mb-4">
              {slide.tagIcon && <span>{slide.tagIcon}</span>}
              {slide.tag}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">
              {slide.title}
            </h3>
            <p className="text-gray-600 mb-5 leading-relaxed">{slide.description}</p>
            <div className="flex flex-wrap gap-2">
              {slide.pills.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center rounded-lg bg-indigo-50 text-indigo-700 px-3 py-1.5 text-sm font-medium"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          {/* Lado direito: mockup WhatsApp */}
          <div className="flex-shrink-0 order-1 lg:order-2">
            <WhatsAppMockup slide={slide} />
          </div>
        </div>

        {/* Navegação: setas + bolinhas + contador */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            type="button"
            onClick={goPrev}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            aria-label="Slide anterior"
          >
            <span className="sr-only">Anterior</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {DEMO_SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i === index ? 'bg-indigo-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir para slide ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
              />
            ))}
          </div>

          <span className="text-sm font-medium text-gray-500 min-w-[3ch]">
            {index + 1}/{total}
          </span>

          <button
            type="button"
            onClick={goNext}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-300 text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            aria-label="Próximo slide"
          >
            <span className="sr-only">Próximo</span>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* CTA após o carrossel */}
        <div className="text-center mt-10">
          <Link
            href="/pt/diagnostico"
            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
          >
            Quero aplicar o Método YLADA
          </Link>
        </div>
      </div>
    </section>
  )
}
