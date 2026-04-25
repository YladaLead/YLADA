'use client'

import { useState, useCallback, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { YLADA_LANDING_AREAS } from '@/config/ylada-landing-areas'
import { getFlowForArea } from '@/config/ylada-carousel-flows'
import { YLADALogo } from '@/components/YLADALogo'

const CARROSSEL_AREAS = YLADA_LANDING_AREAS.map((a) => ({
  codigo: a.codigo,
  label: a.label,
  slogan: a.slogan,
  icon:
    a.codigo === 'med'
      ? '🩺'
      : a.codigo === 'nutri'
        ? '🥗'
        : a.codigo === 'psi'
          ? '🧠'
          : a.codigo === 'psicanalise'
            ? '🛋️'
            : a.codigo === 'odonto'
              ? '🦷'
              : a.codigo === 'estetica'
                ? '✨'
                : a.codigo === 'coach'
                  ? '🧘'
                  : a.codigo === 'fitness'
                    ? '💪'
                    : a.codigo === 'perfumaria'
                      ? '🌸'
                      : a.codigo === 'joias'
                        ? '💎'
                        : '💼',
}))

type ChatMessage = { from: 'client' | 'pro'; text: string; time?: string }

type SlideBase = {
  tag: string
  tagIcon?: string
  title: string
  description: string
  pills: string[]
}

type SlideChat = SlideBase & {
  visualType: 'chat'
  chatVariant: 'noel' | 'whatsapp'
  chatTitle: string
  chatSubtitle: string
  messages: ChatMessage[]
}

type SlidePlatform = SlideBase & {
  visualType: 'platform'
  platformLabel: string
  platformHint?: string
  /** 'simple' | 'home' | 'login' | 'problem-solution' = dúvida + luz na mesma tela */
  platformVariant?: 'simple' | 'home' | 'login' | 'problem-solution'
  /** Mostrar logo YLADA no topo */
  showBrandLogo?: boolean
}

type SlideLink = SlideBase & {
  visualType: 'link'
  linkTitle: string
  linkHint?: string
  /** 'noel' = profissional vê o link criado; 'person' = pessoa abrindo */
  linkVariant?: 'noel' | 'person'
}

type SlideShare = SlideBase & {
  visualType: 'share'
  shareChannel: string
  sharePreview: string
  shareHint?: string
}

type SlideForm = SlideBase & {
  visualType: 'form'
  formQuestion: string
  formOptions: string[]
}

type SlideResult = SlideBase & {
  visualType: 'result'
  resultInsight: string
  resultCta: string
  /** Sub-explicação abaixo do insight principal */
  resultSubtext?: string
  /** Insights em bullets (2-3) */
  resultInsights?: string[]
  /** Mostrar "..." indicando que tem mais */
  resultHasMore?: boolean
}

type SlideClosing = SlideBase & {
  visualType: 'closing'
  closingPhrase: string
  /** Benefícios para exibir (opcional) */
  benefits?: string[]
}

export type DemoSlide =
  | SlideChat
  | SlidePlatform
  | SlideLink
  | SlideShare
  | SlideForm
  | SlideResult
  | SlideClosing

const DEMO_SLIDES: DemoSlide[] = [
  {
    tag: '1. Dúvida → Luz',
    tagIcon: '💡',
    title: 'Não sei por onde começar.',
    description:
      'É aqui que a coisa acontece.',
    pills: ['Dúvida', 'Solução'],
    visualType: 'platform',
    platformLabel: 'Não sei por onde começar',
    platformHint: 'É aqui que a coisa acontece',
    platformVariant: 'problem-solution',
    showBrandLogo: true,
  },
  {
    tag: '2. Entrada',
    tagIcon: '🚀',
    title: 'Entre na sua conta YLADA e faça a pergunta para o Noel.',
    description:
      'É aqui dentro que a coisa acontece.',
    pills: ['Acesse', 'É aqui'],
    visualType: 'platform',
    platformLabel: 'YLADA',
    platformHint: 'Entre na sua conta',
    platformVariant: 'login',
    showBrandLogo: true,
  },
  {
    tag: '3. Pergunta',
    tagIcon: '💬',
    title: 'Você só precisa perguntar.',
    description:
      'Sem estratégia complicada. Sem travar.',
    pills: ['Simples'],
    visualType: 'chat',
    chatVariant: 'noel',
    chatTitle: 'Noel · YLADA',
    chatSubtitle: 'mentor',
    messages: [
      { from: 'client', text: 'Preciso atrair clientes, o que eu faço?', time: '14:20' },
    ],
  },
  {
    tag: '4. Noel orienta',
    tagIcon: '💡',
    title: 'O Noel te mostra o caminho.',
    description:
      'Ele organiza o próximo passo pra você.',
    pills: ['Organiza', 'Direção'],
    visualType: 'chat',
    chatVariant: 'noel',
    chatTitle: 'Noel · YLADA',
    chatSubtitle: 'mentor',
    messages: [
      { from: 'client', text: 'Preciso atrair clientes, o que eu faço?', time: '14:20' },
      {
        from: 'pro',
        text: 'Entendo. Você não precisa convencer — precisa atrair quem já está pronto.',
        time: '14:21',
      },
      {
        from: 'pro',
        text: 'Um diagnóstico faz isso: perguntas que fazem a pessoa refletir. Quando chega em você, já sabe do que precisa.',
        time: '14:21',
      },
      {
        from: 'pro',
        text: 'Vou criar um pra você. Um pronto que atrai as pessoas certas.',
        time: '14:22',
      },
    ],
  },
  {
    tag: '5. Execução',
    tagIcon: '🔗',
    title: 'Ele cria perguntas que atraem o cliente certo.',
    description:
      'Uma sequência simples que faz a pessoa pensar e se identificar.',
    pills: ['Perguntas'],
    visualType: 'link',
    linkTitle: 'Responda e entenda o que precisa mudar',
    linkHint: '3 perguntas rápidas · Resultado na hora',
    linkVariant: 'noel',
  },
  {
    tag: '6. Distribuição',
    tagIcon: '📤',
    title: 'O link aparece bonito quando você posta.',
    description:
      'A prévia chama atenção. Você compartilha e as pessoas entram por curiosidade.',
    pills: ['Aparência', 'Curiosidade'],
    visualType: 'share',
    shareChannel: 'Story',
    sharePreview: 'Responda e veja o que precisa mudar',
    shareHint: '3 perguntas · Resultado na hora',
  },
  {
    tag: '7. Entrada',
    tagIcon: '👀',
    title: 'O link que atrai clientes da sua área.',
    description:
      'É o que o Noel criou pra você compartilhar. A pessoa vê e quer responder.',
    pills: ['Captação'],
    visualType: 'link',
    linkTitle: 'Responda e entenda o que precisa mudar',
    linkHint: 'Começar agora',
    linkVariant: 'person',
  },
  {
    tag: '8. Envolvimento',
    tagIcon: '📝',
    title: 'Elas respondem e se envolvem.',
    description:
      'Começam a entender o próprio problema.',
    pills: ['Envolvimento'],
    visualType: 'form',
    formQuestion: 'O que mais te dificulta hoje?',
    formOptions: ['Falta de tempo', 'Ansiedade', 'Não sei por onde começar', 'Já tentei tudo'],
  },
  {
    tag: '9. Virada',
    tagIcon: '✨',
    title: 'Agora elas têm clareza.',
    description:
      'E isso gera vontade de falar com você.',
    pills: ['Clareza'],
    visualType: 'result',
    resultInsight: 'O problema não é dieta. É rotina.',
    resultSubtext: 'Você até tenta, mas sua rotina não sustenta consistência.',
    resultInsights: [
      'Você começa e para',
      'Falta organização no dia a dia',
      'Depende de motivação',
    ],
    resultHasMore: true,
    resultCta: 'Quero ajuda com isso',
  },
  {
    tag: '10. Resultado',
    tagIcon: '💬',
    title: 'Elas te chamam.',
    description:
      'Já sabendo o que querem.',
    pills: ['Conversa'],
    visualType: 'chat',
    chatVariant: 'whatsapp',
    chatTitle: 'Dra. Ana · Nutri',
    chatSubtitle: 'online agora',
    messages: [
      { from: 'client', text: 'Oi! Fiz seu diagnóstico. Vi que meu problema é mais rotina.', time: '14:35' },
      { from: 'client', text: 'Quero falar com você.', time: '14:35' },
      {
        from: 'pro',
        text: 'Que bom! Posso te ajudar…',
        time: '14:36',
      },
    ],
  },
  {
    tag: '11. Promessa',
    tagIcon: '🎯',
    title: 'Seu trabalho fica mais leve.',
    description:
      'Você não precisa convencer. As pessoas já chegam prontas.',
    pills: ['Sem convencer'],
    visualType: 'closing',
    closingPhrase: 'Experimente agora. Comece gratuitamente.',
    benefits: [
      'Pessoas chegam mais prontas',
      'Conversas ficam mais fáceis',
      'Você ganha mais autoridade',
      'Sem correr atrás',
    ],
  },
]

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[300px] flex-shrink-0">
      <div className="rounded-[2.5rem] border-[10px] border-gray-800 bg-gray-900 p-2 shadow-xl">
        <div className="overflow-hidden rounded-[1.75rem] bg-white min-h-[360px]">{children}</div>
      </div>
    </div>
  )
}

function ChatMockup({ slide }: { slide: SlideChat }) {
  const isNoel = slide.chatVariant === 'noel'
  const headerBg = isNoel ? 'bg-sky-600' : 'bg-[#075E54]'
  // client = quem pergunta (profissional no Noel, cliente no WhatsApp)
  const userBg = isNoel ? 'bg-sky-100 text-sky-900 border border-sky-200' : 'bg-[#DCF8C6] text-gray-900'
  // pro = Noel ou profissional
  const proBg = isNoel ? 'bg-sky-600 text-white' : 'bg-white'

  return (
    <PhoneFrame>
      <div className={`${headerBg} px-4 py-3 text-white`}>
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
      <div
        className={`min-h-[320px] p-3 space-y-2 ${
          isNoel ? 'bg-sky-50/80' : 'bg-[#E5DDD5]'
        }`}
      >
        {slide.messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === 'client' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 shadow-sm ${
                msg.from === 'client' ? userBg : `${proBg} text-gray-800`
              }`}
            >
              <p className="text-sm leading-snug">{msg.text}</p>
              {msg.time && (
                <p className="text-[10px] text-gray-500 mt-1 text-right opacity-80">{msg.time}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </PhoneFrame>
  )
}

function PlatformMockup({ slide }: { slide: SlidePlatform }) {
  const isHome = slide.platformVariant === 'home'
  const isLogin = slide.platformVariant === 'login'
  const isProblemSolution = slide.platformVariant === 'problem-solution'
  const showLogo = slide.showBrandLogo
  return (
    <PhoneFrame>
      <div className="p-4 min-h-[360px] flex flex-col justify-center bg-gradient-to-b from-sky-50 to-white">
        {isProblemSolution && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-base font-semibold text-gray-600 mb-1">😓 {slide.platformLabel}</p>
              <p className="text-xs text-gray-400">Tenta várias coisas, mas nada conecta</p>
            </div>
            <div className="flex justify-center">
              <span className="text-sky-400 text-lg">↓</span>
            </div>
            <div className="text-center rounded-xl border border-sky-200 bg-sky-50/80 py-4 px-3">
              <div className="flex justify-center mb-2">
                <YLADALogo size="sm" variant="horizontal" className="opacity-95" />
              </div>
              <p className="text-sm font-semibold text-sky-700">✨ {slide.platformHint}</p>
            </div>
          </div>
        )}
        {!isHome && !isLogin && !isProblemSolution && (
          <div className="text-center mb-4">
            {showLogo && (
              <div className="flex justify-center mb-6 mt-1">
                <YLADALogo size="sm" variant="horizontal" className="opacity-95" />
              </div>
            )}
            {!showLogo && <div className="text-xl font-bold text-sky-700 mb-1">YLADA</div>}
            <p className="text-base font-semibold text-gray-800 mb-1">{slide.platformLabel}</p>
            {slide.platformHint && (
              <p className="text-sm text-gray-500">{slide.platformHint}</p>
            )}
          </div>
        )}
        {showLogo && !isProblemSolution && (isHome || isLogin) && (
          <div className="flex justify-center mb-6 mt-1">
            <YLADALogo size="sm" variant="horizontal" className="opacity-95" />
          </div>
        )}
        {isLogin && (
          <div className="space-y-4">
            <p className="text-center text-sm text-gray-600 font-medium">{slide.platformHint || 'Entre na sua conta'}</p>
            <div className="space-y-3">
              <div className="rounded-xl border border-gray-200 bg-white px-3 py-2.5">
                <p className="text-xs text-gray-400 mb-0.5">E-mail</p>
                <p className="text-sm text-gray-600">seu@email.com</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white px-3 py-2.5">
                <p className="text-xs text-gray-400 mb-0.5">Senha</p>
                <p className="text-sm text-gray-500">••••••••</p>
              </div>
              <div className="py-3 px-4 bg-sky-600 text-white text-center rounded-xl text-sm font-semibold shadow-md">
                Entrar
              </div>
            </div>
          </div>
        )}
        {isHome && (
          <div className="space-y-3">
            <div className="rounded-xl border border-sky-200 bg-white p-3 shadow-sm">
              <p className="text-xs text-sky-600 font-medium mb-1">Perguntar ao Noel</p>
              <p className="text-sm text-gray-500">O que eu faço pra atrair clientes?</p>
            </div>
            <div className="flex gap-2 justify-center">
              <span className="px-2 py-1 rounded-lg bg-sky-100 text-sky-700 text-xs font-medium">Board</span>
              <span className="px-2 py-1 rounded-lg bg-sky-100 text-sky-700 text-xs font-medium">Noel</span>
              <span className="px-2 py-1 rounded-lg bg-sky-100 text-sky-700 text-xs font-medium">Links</span>
            </div>
          </div>
        )}
      </div>
    </PhoneFrame>
  )
}

function LinkMockup({ slide }: { slide: SlideLink }) {
  const isPerson = slide.linkVariant === 'person'
  return (
    <PhoneFrame>
      <div
        className={`p-4 min-h-[360px] flex flex-col justify-center ${
          isPerson ? 'bg-gray-50' : 'bg-sky-50/50'
        }`}
      >
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-md">
          {!isPerson && (
            <p className="text-xs text-sky-600 font-medium mb-2">Link criado pelo Noel</p>
          )}
          <p className="text-base font-semibold text-gray-900 mb-2">{slide.linkTitle}</p>
          {!isPerson && slide.linkHint && (
            <p className="text-sm text-gray-500 mb-4">{slide.linkHint}</p>
          )}
          {isPerson ? (
            <div className="py-3 px-4 bg-indigo-600 text-white text-center rounded-xl text-sm font-semibold mt-4 shadow-lg">
              {slide.linkHint || 'Começar agora'}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-sky-600 text-white text-sm font-semibold shadow-md">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 8a2 2 0 01-2 2h-2m-4-4V6" />
              </svg>
              Copiar e usar
            </div>
          )}
        </div>
      </div>
    </PhoneFrame>
  )
}

function ShareMockup({ slide }: { slide: SlideShare }) {
  return (
    <PhoneFrame>
      <div className="p-4 min-h-[360px] flex flex-col justify-center bg-gradient-to-b from-gray-100 to-gray-50">
        <p className="text-xs text-gray-500 mb-3 text-center">Instagram · {slide.shareChannel}</p>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg overflow-hidden">
          <div className="flex gap-3">
            <div className="w-14 h-14 shrink-0 rounded-xl bg-gradient-to-br from-sky-500 to-sky-600 flex items-center justify-center">
              <span className="text-2xl text-white">📋</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 leading-snug">{slide.sharePreview}</p>
              {slide.shareHint && (
                <p className="text-xs text-gray-500 mt-1">{slide.shareHint}</p>
              )}
              <p className="text-xs text-sky-600 font-medium mt-2">ylada.app →</p>
            </div>
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

function FormMockup({ slide }: { slide: SlideForm }) {
  return (
    <PhoneFrame>
      <div className="p-4 bg-gray-50 min-h-[360px] flex flex-col justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm font-medium text-gray-700 mb-3">{slide.formQuestion}</p>
          <div className="space-y-2">
            {slide.formOptions.map((opt, i) => (
              <div
                key={i}
                className="flex items-center gap-2 py-2 px-3 rounded-lg border border-gray-200 bg-white"
              >
                <span className="w-4 h-4 rounded-full border-2 border-gray-300" />
                <span className="text-sm text-gray-800">{opt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

function ResultMockup({ slide }: { slide: SlideResult }) {
  return (
    <PhoneFrame>
      <div className="p-4 bg-gray-50 min-h-[360px] flex flex-col justify-center">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-md">
          <p className="text-xs text-gray-500 mb-2">Seu resultado</p>
          <p className="text-lg font-bold text-gray-900 mb-2 leading-snug">{slide.resultInsight}</p>
          {slide.resultSubtext && (
            <p className="text-sm text-gray-600 mb-3">{slide.resultSubtext}</p>
          )}
          {slide.resultInsights && slide.resultInsights.length > 0 && (
            <div className="space-y-1.5 mb-3">
              {slide.resultInsights.map((insight, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sky-600 text-xs">✔</span>
                  <span className="text-sm text-gray-700">{insight}</span>
                </div>
              ))}
              {slide.resultHasMore && (
                <p className="text-gray-400 text-xs pl-4">...</p>
              )}
            </div>
          )}
          <div className="py-3 px-4 bg-[#25D366] text-white text-center rounded-xl text-sm font-semibold shadow-lg">
            {slide.resultCta}
          </div>
        </div>
      </div>
    </PhoneFrame>
  )
}

function ClosingMockup({ slide }: { slide: SlideClosing }) {
  return (
    <PhoneFrame>
      <div className="p-6 min-h-[360px] flex flex-col justify-center bg-gradient-to-b from-sky-50 to-white">
        {slide.benefits && slide.benefits.length > 0 ? (
          <div className="space-y-5">
            <div className="space-y-3">
              {slide.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sky-600 text-white text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-sm font-medium text-gray-800">{b}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-base font-bold text-sky-700 pt-4 mt-2 border-t border-sky-200 leading-snug">
              {slide.closingPhrase}
            </p>
          </div>
        ) : (
          <p className="text-center text-lg font-bold text-sky-700 leading-snug">
            {slide.closingPhrase}
          </p>
        )}
      </div>
    </PhoneFrame>
  )
}

function SlideVisual({ slide }: { slide: DemoSlide }) {
  switch (slide.visualType) {
    case 'chat':
      return <ChatMockup slide={slide} />
    case 'platform':
      return <PlatformMockup slide={slide} />
    case 'link':
      return <LinkMockup slide={slide} />
    case 'share':
      return <ShareMockup slide={slide} />
    case 'form':
      return <FormMockup slide={slide} />
    case 'result':
      return <ResultMockup slide={slide} />
    case 'closing':
      return <ClosingMockup slide={slide} />
  }
}

const SLIDE_DURATION_MS = 6500

function buildSlidesWithFlow(baseSlides: DemoSlide[], area: string | null): DemoSlide[] {
  const flow = getFlowForArea(area)
  if (!flow) return baseSlides

  return baseSlides.map((s, i) => {
    const idx = i + 1
    if (idx === 1 && s.visualType === 'platform' && s.platformVariant === 'problem-solution') {
      return { ...s, platformLabel: flow.slide1Problem, platformHint: flow.slide1ProblemHint }
    }
    if (idx === 3 && s.visualType === 'chat') {
      return { ...s, messages: [{ from: 'client' as const, text: flow.slide3Question, time: '14:20' }] }
    }
    if (idx === 4 && s.visualType === 'chat' && s.messages.length >= 2) {
      return {
        ...s,
        messages: [
          { from: 'client' as const, text: flow.slide3Question, time: '14:20' },
          ...s.messages.slice(1),
        ],
      }
    }
    if (idx === 5 && s.visualType === 'link') {
      return { ...s, linkTitle: flow.linkTitle, linkHint: flow.linkHint }
    }
    if (idx === 6 && s.visualType === 'share') {
      return { ...s, sharePreview: flow.linkTitle, shareHint: flow.linkHint }
    }
    if (idx === 7 && s.visualType === 'link') {
      return { ...s, linkTitle: flow.linkTitle, linkHint: 'Começar agora' }
    }
    if (idx === 8 && s.visualType === 'form') {
      return { ...s, formQuestion: flow.formQuestion, formOptions: flow.formOptions }
    }
    if (idx === 9 && s.visualType === 'result') {
      return {
        ...s,
        resultInsight: flow.resultInsight,
        resultSubtext: flow.resultSubtext,
        resultInsights: flow.resultInsights,
        resultCta: flow.resultCta,
      }
    }
    if (idx === 10 && s.visualType === 'chat') {
      return {
        ...s,
        chatTitle: flow.whatsappProTitle,
        messages: [
          { from: 'client' as const, text: flow.whatsappClientMsg1, time: '14:35' },
          { from: 'client' as const, text: flow.whatsappClientMsg2, time: '14:35' },
          { from: 'pro' as const, text: 'Que bom! Posso te ajudar…', time: '14:36' },
        ],
      }
    }
    if (idx === 11 && s.visualType === 'closing' && s.benefits) {
      return {
        ...s,
        benefits: [flow.closingBenefit, ...s.benefits.slice(1)],
      }
    }
    return s
  })
}

export interface DemoCarouselYLADAProps {
  /** Na página de estética: já usa argumentos de estética e não pergunta área ao clicar em assistir. */
  initialArea?: string | null
}

export default function DemoCarouselYLADA({ initialArea = null }: DemoCarouselYLADAProps) {
  const [index, setIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [slideProgress, setSlideProgress] = useState(0)
  const [selectedArea, setSelectedArea] = useState<string | null>(initialArea ?? null)
  const [showAreaSelector, setShowAreaSelector] = useState(false)
  const slides = useMemo(() => buildSlidesWithFlow(DEMO_SLIDES, selectedArea), [selectedArea])
  const total = slides.length
  const slide = slides[index]

  const goPrev = useCallback(() => {
    setIndex((i) => (i === 0 ? total - 1 : i - 1))
    setSlideProgress(0)
  }, [total])

  const goNext = useCallback(() => {
    setIndex((i) => (i === total - 1 ? 0 : i + 1))
    setSlideProgress(0)
  }, [total])

  useEffect(() => {
    if (!isPlaying) return
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % total)
      setSlideProgress(0)
    }, SLIDE_DURATION_MS)
    return () => clearInterval(t)
  }, [isPlaying, total])

  useEffect(() => {
    if (!isPlaying) {
      setSlideProgress(0)
      return
    }
    setSlideProgress(0)
    const start = Date.now()
    const tick = setInterval(() => {
      const elapsed = Date.now() - start
      const p = Math.min(1, elapsed / SLIDE_DURATION_MS)
      setSlideProgress(p)
    }, 50)
    return () => clearInterval(tick)
  }, [isPlaying, index])

  return (
    <>
      {/* Seção 1: só o título — sempre visível no topo */}
      <section
        id="como-funciona-na-pratica"
        className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pt-16 sm:pt-20 pb-8 sm:pb-10"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Veja como atrair clientes sem precisar convencer
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto">
              De uma simples pergunta até pessoas te chamarem no WhatsApp.
            </p>
          </div>
        </div>
      </section>

      {/* Seção 2: número da execução (1, 2, 3…), texto do slide e vídeo — no mobile fica em destaque; sticky quando tocando */}
      <section
        aria-label="Passo a passo do fluxo"
        className={`relative overflow-hidden bg-gradient-to-b from-slate-50 to-white py-8 sm:py-12 pb-16 sm:pb-20 transition-shadow ${
          isPlaying ? 'sticky top-0 z-30 shadow-lg' : ''
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 max-w-5xl mx-auto relative">
          <div className="flex-1 min-w-0 w-full max-w-md order-1 lg:order-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100/80 text-indigo-700 px-2.5 py-0.5 text-xs font-medium mb-4">
              {slide.tagIcon && <span>{slide.tagIcon}</span>}
              {slide.tag}
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {slide.title}
            </h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{slide.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {slide.pills.map((pill) => (
                <span
                  key={pill}
                  className="inline-flex items-center rounded-md bg-gray-100 text-gray-600 px-2 py-0.5 text-xs font-medium"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 relative order-2 lg:order-2">
            <div className="relative" key={index}>
              <SlideVisual slide={slide} />
              {isPlaying && (
                <div className="absolute -bottom-6 left-0 right-0 mx-auto w-[calc(100%-1rem)] max-w-[280px] sm:max-w-[300px] h-2 bg-gray-800 rounded-full overflow-hidden border border-gray-600 shadow-lg">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-75 ease-linear"
                    style={{ width: `${((index + slideProgress) / total) * 100}%` }}
                  />
                </div>
              )}
            </div>
            {!isPlaying ? (
                <button
                  type="button"
                  onClick={() => {
                    if (initialArea) {
                      setSelectedArea(initialArea)
                      setIsPlaying(true)
                    } else {
                      setSelectedArea((prev) => prev ?? 'nutri')
                      setShowAreaSelector(true)
                    }
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/25 rounded-[2.5rem] transition-opacity hover:bg-black/35"
                  aria-label="Assistir"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-xl">
                    <svg
                      className="ml-1 h-8 w-8 text-indigo-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path d="M8 5v14l11-7L8 5z" />
                    </svg>
                  </div>
                </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsPlaying(false)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/25 text-white/90 hover:bg-black/35 transition-colors opacity-70 hover:opacity-100"
                aria-label="Pausar"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {showAreaSelector && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && setShowAreaSelector(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="area-selector-title"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 id="area-selector-title" className="text-lg font-semibold text-gray-900">
                  Escolha sua área
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAreaSelector(false)}
                  className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  aria-label="Fechar"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {CARROSSEL_AREAS.map((area) => (
                  <button
                    key={area.codigo}
                    type="button"
                    onClick={() => setSelectedArea(area.codigo)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                      selectedArea === area.codigo
                        ? 'border-indigo-500 bg-indigo-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <span className="text-xl">{area.icon}</span>
                    <span className={`font-semibold text-sm ${selectedArea === area.codigo ? 'text-indigo-700' : 'text-gray-900'}`}>
                      {area.label}
                    </span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowAreaSelector(false)
                  setIsPlaying(true)
                }}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7L8 5z" />
                </svg>
                Assistir
              </button>
            </div>
          </div>
        )}

        <>
        <div className="flex items-center justify-center gap-3 mt-10 opacity-80">
          <button
            type="button"
            onClick={goPrev}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
            aria-label="Slide anterior"
          >
            <span className="sr-only">Anterior</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7 7 7-7" />
            </svg>
          </button>

          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === index ? 'bg-indigo-500 scale-125' : 'bg-gray-300/70 hover:bg-gray-400'
                }`}
                aria-label={`Ir para slide ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
              />
            ))}
          </div>

          <span className="text-xs text-gray-400 min-w-[3ch]">
            {index + 1}/{total}
          </span>

          <button
            type="button"
            onClick={goNext}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-colors"
            aria-label="Próximo slide"
          >
            <span className="sr-only">Próximo</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {isPlaying && (
          <p className="text-center text-xs text-gray-400 mt-2">
            Assista no seu ritmo
          </p>
        )}

        <div className="text-center mt-12">
          <Link
            href="/pt/cadastro"
            className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25 text-lg"
          >
            Quero testar isso agora
          </Link>
          <p className="text-sm text-gray-500 mt-2">Comece gratuitamente</p>
        </div>
        </>
        </div>
      </section>
    </>
  )
}
