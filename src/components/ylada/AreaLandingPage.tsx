'use client'

/**
 * Landing compartilhada para áreas (nutri, estetica, fitness, etc.).
 * Recebe locale e area. Links de login/checkout sempre vão para /pt (painel não traduzido).
 */
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { UseCasesSection } from '@/components/ylada/UseCasesSection'
import { HeroBeforeAfter } from '@/components/ylada/HeroBeforeAfter'
import { DiagnosticoExemploSection } from '@/components/ylada/DiagnosticoExemploSection'
import { PricingSectionLanding } from '@/components/ylada/PricingSectionLanding'
import { useRouter } from 'next/navigation'
import type { Language } from '@/lib/i18n'

const AREA_LABELS: Record<string, Record<Language, string>> = {
  nutri: { pt: 'Nutrição', en: 'Nutrition', es: 'Nutrición' },
  estetica: { pt: 'Estética', en: 'Aesthetics', es: 'Estética' },
  fitness: { pt: 'Fitness', en: 'Fitness', es: 'Fitness' },
  psi: { pt: 'Psicologia', en: 'Psychology', es: 'Psicología' },
  odonto: { pt: 'Odontologia', en: 'Dentistry', es: 'Odontología' },
  med: { pt: 'Medicina', en: 'Medicine', es: 'Medicina' },
  nutra: { pt: 'Nutra', en: 'Nutra', es: 'Nutra' },
  perfumaria: { pt: 'Perfumaria', en: 'Perfumery', es: 'Perfumería' },
  'coach-bem-estar': { pt: 'Coach de bem-estar', en: 'Wellness Coach', es: 'Coach de bienestar' },
  seller: { pt: 'Vendedores', en: 'Sales', es: 'Vendedores' },
}

const COMMON = {
  pt: {
    platformPart: 'Parte da plataforma YLADA',
    enter: 'Entrar',
    backHome: 'YLADA',
  },
  en: {
    platformPart: 'Part of the YLADA platform',
    enter: 'Log in',
    backHome: 'YLADA',
  },
  es: {
    platformPart: 'Parte de la plataforma YLADA',
    enter: 'Entrar',
    backHome: 'YLADA',
  },
}

export type AreaLandingArea = 'nutri' | 'estetica' | 'fitness' | 'psi' | 'odonto' | 'med' | 'nutra' | 'perfumaria' | 'coach-bem-estar' | 'seller'

/** Mapeia área institucional para área dos componentes (HeroBeforeAfter, UseCasesSection) */
const AREA_TO_COMPONENT: Record<string, 'med' | 'psi' | 'odonto' | 'nutri' | 'estetica' | 'fitness' | 'coach' | 'seller' | 'perfumaria'> = {
  nutri: 'nutri',
  estetica: 'estetica',
  fitness: 'fitness',
  psi: 'psi',
  odonto: 'odonto',
  med: 'med',
  nutra: 'seller',
  perfumaria: 'perfumaria',
  'coach-bem-estar': 'coach',
  seller: 'seller',
}

interface AreaLandingPageProps {
  area: AreaLandingArea
  locale: Language
  /** Path base do app (sempre /pt - painel não traduzido) */
  appBasePath?: string
}

/** Áreas de vendas: nutra (suplementos/nutraceuticos) e seller (vendedores em geral). Comunicação com "clientes" e "conversas". */
const SALES_AREAS: AreaLandingArea[] = ['nutra', 'seller']

/** Área → índice 0–6 para o quiz de diagnóstico (comunicacao). Usado em /pt/diagnostico?area= */
const AREA_TO_QUIZ_INDEX: Record<AreaLandingArea, number> = {
  nutri: 3,
  estetica: 2,
  fitness: 4,
  psi: 1,
  odonto: 6,
  med: 0,
  nutra: 5,
  perfumaria: 6,
  'coach-bem-estar': 5,
  seller: 5,
}

/** Textos da seção "três dificuldades" por área (headline PT/EN/ES). Respeita área para não mostrar "Nutricionistas" em estética. */
const DIAGNOSTIC_SECTION_BY_AREA: Record<
  AreaLandingArea,
  { pt: string; en: string; es: string; bullet1: { pt: string; en: string; es: string }; bullet2: { pt: string; en: string; es: string }; closing: { pt: string; en: string; es: string } }
> = {
  nutri: {
    pt: 'Nutricionistas enfrentam três dificuldades comuns no marketing online',
    en: 'Nutritionists face three common challenges in online marketing',
    es: 'Los nutricionistas enfrentan tres dificultades comunes en el marketing online',
    bullet1: { pt: 'Pacientes pedindo orientação gratuita', en: 'Patients asking for free guidance', es: 'Pacientes pidiendo orientación gratuita' },
    bullet2: { pt: 'Conversas que não viram consulta', en: 'Conversations that don\'t turn into consultations', es: 'Conversaciones que no se convierten en consulta' },
    closing: { pt: 'Isso consome tempo, gera conversas improdutivas e reduz a qualidade das consultas.', en: 'This consumes time, generates unproductive conversations and reduces the quality of consultations.', es: 'Esto consume tiempo, genera conversaciones improductivas y reduce la calidad de las consultas.' },
  },
  estetica: {
    pt: 'Profissionais de estética enfrentam três dificuldades comuns no marketing online',
    en: 'Aesthetics professionals face three common challenges in online marketing',
    es: 'Los profesionales de estética enfrentan tres dificultades comunes en el marketing online',
    bullet1: { pt: 'Clientes pedindo orientação sem demonstrar interesse real', en: 'Clients asking for guidance without showing real interest', es: 'Clientes pidiendo orientación sin demostrar interés real' },
    bullet2: { pt: 'Conversas que não viram agendamento', en: 'Conversations that don\'t turn into bookings', es: 'Conversaciones que no se convierten en cita' },
    closing: { pt: 'Isso consome tempo, gera conversas improdutivas e reduz a qualidade dos agendamentos.', en: 'This consumes time, generates unproductive conversations and reduces the quality of bookings.', es: 'Esto consume tiempo, genera conversaciones improductivas y reduce la calidad de las citas.' },
  },
  fitness: {
    pt: 'Profissionais de fitness enfrentam três dificuldades comuns no marketing online',
    en: 'Fitness professionals face three common challenges in online marketing',
    es: 'Los profesionales de fitness enfrentan tres dificultades comunes en el marketing online',
    bullet1: { pt: 'Alunos pedindo orientação sem compromisso', en: 'Students asking for guidance without commitment', es: 'Alumnos pidiendo orientación sin compromiso' },
    bullet2: { pt: 'Conversas que não viram matrícula ou consulta', en: 'Conversations that don\'t turn into enrollment or consultation', es: 'Conversaciones que no se convierten en matrícula o consulta' },
    closing: { pt: 'Isso consome tempo, gera conversas improdutivas e reduz a qualidade das consultas.', en: 'This consumes time, generates unproductive conversations and reduces the quality of consultations.', es: 'Esto consume tiempo, genera conversaciones improductivas y reduce la calidad de las consultas.' },
  },
  psi: {
    pt: 'Psicólogos e terapeutas enfrentam três dificuldades comuns no marketing online',
    en: 'Psychologists and therapists face three common challenges in online marketing',
    es: 'Los psicólogos y terapeutas enfrentan tres dificultades comunes en el marketing online',
    bullet1: { pt: 'Pacientes pedindo orientação gratuita', en: 'Patients asking for free guidance', es: 'Pacientes pidiendo orientación gratuita' },
    bullet2: { pt: 'Conversas que não viram consulta', en: 'Conversations that don\'t turn into consultations', es: 'Conversaciones que no se convierten en consulta' },
    closing: { pt: 'Isso consome tempo, gera conversas improdutivas e reduz a qualidade das consultas.', en: 'This consumes time, generates unproductive conversations and reduces the quality of consultations.', es: 'Esto consume tiempo, genera conversaciones improductivas y reduce la calidad de las consultas.' },
  },
  odonto: {
    pt: 'Dentistas enfrentam três dificuldades comuns no marketing online',
    en: 'Dentists face three common challenges in online marketing',
    es: 'Los dentistas enfrentan tres dificultades comunes en el marketing online',
    bullet1: { pt: 'Pacientes pedindo orçamento sem demonstrar interesse real', en: 'Patients asking for quotes without showing real interest', es: 'Pacientes pidiendo presupuesto sin demostrar interés real' },
    bullet2: { pt: 'Conversas que não viram agendamento', en: 'Conversations that don\'t turn into appointments', es: 'Conversaciones que no se convierten en cita' },
    closing: { pt: 'Isso consome tempo, gera conversas improdutivas e reduz a qualidade dos agendamentos.', en: 'This consumes time, generates unproductive conversations and reduces the quality of appointments.', es: 'Esto consume tiempo, genera conversaciones improductivas y reduce la calidad de las citas.' },
  },
  med: {
    pt: 'Médicos enfrentam três dificuldades comuns no marketing online',
    en: 'Physicians face three common challenges in online marketing',
    es: 'Los médicos enfrentan tres dificultades comunes en el marketing online',
    bullet1: { pt: 'Pacientes pedindo orientação gratuita', en: 'Patients asking for free guidance', es: 'Pacientes pidiendo orientación gratuita' },
    bullet2: { pt: 'Conversas que não viram consulta', en: 'Conversations that don\'t turn into consultations', es: 'Conversaciones que no se convierten en consulta' },
    closing: { pt: 'Isso consome tempo, gera conversas improdutivas e reduz a qualidade das consultas.', en: 'This consumes time, generates unproductive conversations and reduces the quality of consultations.', es: 'Esto consume tiempo, genera conversaciones improductivas y reduce la calidad de las consultas.' },
  },
  nutra: {
    pt: 'Consultores de suplementos e nutraceuticos enfrentam três dificuldades comuns',
    en: 'Supplement and nutraceutical consultants face three common challenges',
    es: 'Consultores de suplementos y nutracéuticos enfrentan tres dificultades comunes',
    bullet1: { pt: 'Clientes pedindo orientação sem demonstrar interesse real', en: 'Clients asking for guidance without showing real interest', es: 'Clientes pidiendo orientación sin demostrar interés real' },
    bullet2: { pt: 'Conversas que não viram venda', en: 'Conversations that don\'t turn into sales', es: 'Conversaciones que no se convierten en venta' },
    closing: { pt: 'Isso consome tempo, gera conversas improdutivas e reduz a qualidade das vendas.', en: 'This consumes time, generates unproductive conversations and reduces the quality of sales.', es: 'Esto consume tiempo, genera conversaciones improductivas y reduce la calidad de las ventas.' },
  },
  perfumaria: {
    pt: 'Profissionais de perfumaria enfrentam três dificuldades comuns no marketing online',
    en: 'Perfumery professionals face three common challenges in online marketing',
    es: 'Los profesionales de perfumería enfrentan tres dificultades comunes en el marketing online',
    bullet1: { pt: 'Clientes pedendo indicação sem demonstrar interesse de compra', en: 'Clients asking for recommendations without showing purchase interest', es: 'Clientes pidiendo recomendación sin demostrar interés de compra' },
    bullet2: { pt: 'Conversas que não viram venda', en: 'Conversations that don\'t turn into sales', es: 'Conversaciones que no se convierten en venta' },
    closing: { pt: 'Isso consome tempo, gera conversas improdutivas e reduz a qualidade das vendas.', en: 'This consumes time, generates unproductive conversations and reduces the quality of sales.', es: 'Esto consume tiempo, genera conversaciones improductivas y reduce la calidad de las ventas.' },
  },
  'coach-bem-estar': {
    pt: 'Coaches enfrentam três dificuldades comuns no marketing online',
    en: 'Coaches face three common challenges in online marketing',
    es: 'Los coaches enfrentan tres dificultades comunes en el marketing online',
    bullet1: { pt: 'Clientes pedindo orientação sem demonstrar compromisso', en: 'Clients asking for guidance without showing commitment', es: 'Clientes pidiendo orientación sin demostrar compromiso' },
    bullet2: { pt: 'Conversas que não viram sessão', en: 'Conversations that don\'t turn into sessions', es: 'Conversaciones que no se convierten en sesión' },
    closing: { pt: 'Isso consome tempo, gera conversas improdutivas e reduz a qualidade das sessões.', en: 'This consumes time, generates unproductive conversations and reduces the quality of sessions.', es: 'Esto consume tiempo, genera conversaciones improductivas y reduce la calidad de las sesiones.' },
  },
  seller: {
    pt: 'Consultores de suplementos e nutraceuticos enfrentam três dificuldades comuns',
    en: 'Supplement and nutraceutical consultants face three common challenges',
    es: 'Consultores de suplementos y nutracéuticos enfrentan tres dificultades comunes',
    bullet1: { pt: 'Clientes pedindo orientação sem demonstrar interesse real', en: 'Clients asking for guidance without showing real interest', es: 'Clientes pidiendo orientación sin demostrar interés real' },
    bullet2: { pt: 'Conversas que não viram venda', en: 'Conversations that don\'t turn into sales', es: 'Conversaciones que no se convierten en venta' },
    closing: { pt: 'Isso consome tempo, gera conversas improdutivas e reduz a qualidade das vendas.', en: 'This consumes time, generates unproductive conversations and reduces the quality of sales.', es: 'Esto consume tiempo, genera conversaciones improductivas y reduce la calidad de las ventas.' },
  },
}

/** Mapeia área para checkout real. Áreas sem checkout próprio usam nutri. "Começar agora" vai direto ao checkout (escolher plano anual/mensal). */
const AREA_TO_CHECKOUT: Record<AreaLandingArea, string> = {
  nutri: '/pt/nutri/checkout',
  estetica: '/pt/nutri/checkout',
  fitness: '/pt/nutri/checkout',
  psi: '/pt/nutri/checkout',
  odonto: '/pt/nutri/checkout',
  med: '/pt/nutri/checkout',
  nutra: '/pt/nutra/checkout',
  perfumaria: '/pt/nutri/checkout',
  'coach-bem-estar': '/pt/wellness/checkout',
  seller: '/pt/nutri/checkout',
}

export function AreaLandingPage({ area, locale, appBasePath = '/pt' }: AreaLandingPageProps) {
  const componentArea = AREA_TO_COMPONENT[area] ?? 'nutri'
  const isSalesArea = SALES_AREAS.includes(area)
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [faqOpen, setFaqOpen] = useState<number | null>(null)

  const homeHref = `/${locale}`
  const loginHref = `${appBasePath}/${area}/login`
  const homeRedirect = `${appBasePath}/${area}/home`
  /** Checkout direto (escolher plano anual/mensal). Nutra: por locale (/pt, /en, /es); demais: /pt. */
  const checkoutBase = area === 'nutra' ? `/${locale}/nutra/checkout` : (AREA_TO_CHECKOUT[area] ?? '/pt/nutri/checkout')

  const c = COMMON[locale]
  const label = AREA_LABELS[area]?.[locale] ?? AREA_LABELS[area]?.pt ?? area

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || loading) return
    if (user) {
      router.replace(homeRedirect)
    }
  }, [mounted, loading, user, router, homeRedirect])

  if (loading || (mounted && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-14 sm:h-16 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={homeHref} className="flex items-center gap-2">
              <span className="font-bold text-gray-900">YLADA</span>
              <span className="text-gray-500 text-sm">· {label}</span>
            </Link>
            <span className="hidden sm:inline text-xs text-gray-400 border-l border-gray-200 pl-3">
              {c.platformPart}
            </span>
          </div>
          <Link
            href={loginHref}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            {c.enter}
          </Link>
        </div>
      </header>

      <main>
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                {isSalesArea ? (
                  locale === 'pt' ? (
                    <>Gere conversas com potenciais clientes<br />sem precisar explicar tudo logo no início</>
                  ) : locale === 'en' ? (
                    <>Generate conversations with potential clients<br />without having to explain everything upfront</>
                  ) : (
                    <>Genera conversaciones con clientes potenciales<br />sin tener que explicar todo al principio</>
                  )
                ) : (
                  locale === 'pt' ? (
                    <>Crie diagnósticos que despertam interesse<br />sem precisar explicar tudo logo no início</>
                  ) : locale === 'en' ? (
                    <>Create diagnostics that spark interest<br />without having to explain everything upfront</>
                  ) : (
                    <>Crea diagnósticos que despiertan interés<br />sin tener que explicar todo al principio</>
                  )
                )}
              </h1>
              <p className="text-base sm:text-lg text-gray-600 mb-4">
                {locale === 'pt' && 'Crie um diagnóstico, compartilhe com seu público e transforme curiosidade em conversa no WhatsApp.'}
                {locale === 'en' && 'Create a diagnosis, share with your audience and turn curiosity into WhatsApp conversations.'}
                {locale === 'es' && 'Crea un diagnóstico, comparte con tu público y transforma la curiosidad en conversación por WhatsApp.'}
              </p>
              <p className="text-sm text-gray-500 italic mb-4">
                {locale === 'pt' && 'A YLADA não foi feita para gerar apenas respostas. Foi feita para gerar conversas reais com potenciais clientes.'}
                {locale === 'en' && 'YLADA was not made to just collect responses. It was made to generate real conversations with potential clients.'}
                {locale === 'es' && 'YLADA no fue hecha para solo generar respuestas. Fue hecha para generar conversaciones reales con clientes potenciales.'}
              </p>
              <p className="text-lg sm:text-xl text-gray-700 font-medium mb-6">
                {isSalesArea ? (
                  locale === 'pt' ? 'Transforme curiosos em clientes preparados para conversa.'
                  : locale === 'en' ? 'Turn curious people into clients prepared for conversation.'
                  : 'Transforma curiosos en clientes preparados para conversación.'
                ) : (
                  locale === 'pt' ? 'Transforme curiosos em pacientes preparados para consulta.'
                  : locale === 'en' ? 'Turn curious people into patients prepared for consultation.'
                  : 'Transforma curiosos en pacientes preparados para consulta.'
                )}
              </p>
              <p className="text-sm sm:text-base text-gray-600 italic mb-6 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50 rounded-r-lg text-left max-w-md mx-auto">
                {isSalesArea ? (
                  locale === 'pt' ? 'Servir antes de vender. Entender antes de orientar. Conversar antes da venda.'
                  : locale === 'en' ? 'Serve before selling. Understand before guiding. Talk before the sale.'
                  : 'Servir antes de vender. Entender antes de orientar. Conversar antes de la venta.'
                ) : (
                  locale === 'pt' ? 'Servir antes de vender. Entender antes de orientar. Conversar antes da consulta.'
                  : locale === 'en' ? 'Serve before selling. Understand before guiding. Talk before the consultation.'
                  : 'Servir antes de vender. Entender antes de orientar. Conversar antes de la consulta.'
                )}
              </p>
              <div className="flex flex-col items-center gap-1 mb-8 text-sm text-gray-600">
                <span>
                  {isSalesArea ? (
                    locale === 'pt' ? 'Cliente responde avaliação' : locale === 'en' ? 'Client completes assessment' : 'El cliente responde la evaluación'
                  ) : (
                    locale === 'pt' ? 'Paciente responde avaliação' : locale === 'en' ? 'Patient completes assessment' : 'El paciente responde la evaluación'
                  )}
                </span>
                <span className="text-gray-400">↓</span>
                <span>
                  {locale === 'pt' && 'Sistema gera diagnóstico'}
                  {locale === 'en' && 'System generates diagnosis'}
                  {locale === 'es' && 'El sistema genera diagnóstico'}
                </span>
                <span className="text-gray-400">↓</span>
                <span>
                  {locale === 'pt' && 'Inicia conversa no WhatsApp'}
                  {locale === 'en' && 'Starts conversation on WhatsApp'}
                  {locale === 'es' && 'Inicia conversación en WhatsApp'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href={locale === 'pt' ? `/pt/diagnostico?area=${AREA_TO_QUIZ_INDEX[area]}` : `${appBasePath}/diagnostico?area=${AREA_TO_QUIZ_INDEX[area]}`}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
                  data-cta="comecar-avaliacao"
                  aria-label={locale === 'pt' ? 'Começar avaliação' : locale === 'en' ? 'Start assessment' : 'Comenzar evaluación'}
                >
                  {locale === 'pt' && 'Começar avaliação'}
                  {locale === 'en' && 'Start assessment'}
                  {locale === 'es' && 'Comenzar evaluación'}
                  <span className="ml-2" aria-hidden>→</span>
                </Link>
                <Link
                  href={loginHref}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  {locale === 'pt' && 'Criar meu diagnóstico grátis'}
                  {locale === 'en' && 'Create my free diagnosis'}
                  {locale === 'es' && 'Crear mi diagnóstico gratis'}
                </Link>
                <Link
                  href={locale === 'pt' ? '/pt/precos' : `${appBasePath}/precos`}
                  className="inline-flex items-center justify-center px-8 py-4 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  {locale === 'pt' && 'Ver plano Pro'}
                  {locale === 'en' && 'View Pro plan'}
                  {locale === 'es' && 'Ver plan Pro'}
                </Link>
              </div>
              <p className="text-gray-500 text-sm mt-3">
                {locale === 'pt' && 'Comece grátis com 1 diagnóstico ativo'}
                {locale === 'en' && 'Start free with 1 active diagnosis'}
                {locale === 'es' && 'Comienza gratis con 1 diagnóstico activo'}
              </p>
            </div>
          </div>
        </section>

        <HeroBeforeAfter area={componentArea} locale={locale} />

        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                {locale === 'pt' ? DIAGNOSTIC_SECTION_BY_AREA[area].pt : locale === 'en' ? DIAGNOSTIC_SECTION_BY_AREA[area].en : DIAGNOSTIC_SECTION_BY_AREA[area].es}
              </h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0">•</span>
                  <span>{locale === 'pt' ? DIAGNOSTIC_SECTION_BY_AREA[area].bullet1.pt : locale === 'en' ? DIAGNOSTIC_SECTION_BY_AREA[area].bullet1.en : DIAGNOSTIC_SECTION_BY_AREA[area].bullet1.es}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0">•</span>
                  <span>{locale === 'pt' ? DIAGNOSTIC_SECTION_BY_AREA[area].bullet2.pt : locale === 'en' ? DIAGNOSTIC_SECTION_BY_AREA[area].bullet2.en : DIAGNOSTIC_SECTION_BY_AREA[area].bullet2.es}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0">•</span>
                  <span>
                    {locale === 'pt' && 'Falta de clareza no primeiro contato'}
                    {locale === 'en' && 'Lack of clarity in the first contact'}
                    {locale === 'es' && 'Falta de claridad en el primer contacto'}
                  </span>
                </li>
              </ul>
              <p className="text-center text-gray-600 mt-8 font-medium">
                {locale === 'pt' ? DIAGNOSTIC_SECTION_BY_AREA[area].closing.pt : locale === 'en' ? DIAGNOSTIC_SECTION_BY_AREA[area].closing.en : DIAGNOSTIC_SECTION_BY_AREA[area].closing.es}
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                {isSalesArea ? (
                  locale === 'pt' ? 'O YLADA ajuda você a qualificar clientes antes da conversa'
                  : locale === 'en' ? 'YLADA helps you qualify clients before the conversation'
                  : 'YLADA te ayuda a cualificar clientes antes de la conversación'
                ) : (
                  locale === 'pt' ? 'O YLADA ajuda você a explicar o processo antes da consulta'
                  : locale === 'en' ? 'YLADA helps you explain the process before the consultation'
                  : 'YLADA te ayuda a explicar el proceso antes de la consulta'
                )}
              </h2>
              <p className="text-lg text-gray-700 mb-6 text-center">
                {isSalesArea ? (
                  locale === 'pt' ? 'O cliente responde uma avaliação rápida antes do contato. Assim você entende necessidades, objetivos e pode orientar sobre as melhores opções.'
                  : locale === 'en' ? 'The client completes a quick assessment before contact. This way you understand needs, goals and can guide them about the best options.'
                  : 'El cliente responde una evaluación rápida antes del contacto. Así entiendes necesidades, objetivos y puedes orientar sobre las mejores opciones.'
                ) : (
                  locale === 'pt' ? 'O paciente responde uma avaliação rápida antes do contato. Assim você entende hábitos, objetivos e pode orientar sobre o processo da consulta.'
                  : locale === 'en' ? 'The patient completes a quick assessment before contact. This way you understand habits, goals and can guide them about the consultation process.'
                  : 'El paciente responde una evaluación rápida antes del contacto. Así entiendes hábitos, objetivos y puedes orientar sobre el proceso de la consulta.'
                )}
              </p>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <p className="text-gray-700 text-center">
                  {isSalesArea ? (
                    locale === 'pt' ? 'Iniciar conversas com clientes que já demonstraram interesse.'
                    : locale === 'en' ? 'Start conversations with clients who have already shown interest.'
                    : 'Iniciar conversaciones con clientes que ya demostraron interés.'
                  ) : (
                    locale === 'pt' ? 'Explicar melhor o processo antes da primeira consulta.'
                    : locale === 'en' ? 'Better explain the process before the first consultation.'
                    : 'Explicar mejor el proceso antes de la primera consulta.'
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 text-center">
                {locale === 'pt' && 'Como funciona'}
                {locale === 'en' && 'How it works'}
                {locale === 'es' && 'Cómo funciona'}
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(
                  isSalesArea
                    ? [
                        { step: '1', titlePt: 'Escolha uma avaliação', titleEn: 'Choose an assessment', titleEs: 'Elige una evaluación', descPt: 'Quizzes e diagnósticos prontos para suplementos e nutraceuticos.', descEn: 'Ready-made quizzes and diagnostics for supplements and nutraceuticals.', descEs: 'Cuestionarios y diagnósticos listos para suplementos y nutracéuticos.' },
                        { step: '2', titlePt: 'Compartilhe o link', titleEn: 'Share the link', titleEs: 'Comparte el enlace', descPt: 'Use em redes sociais, WhatsApp ou site.', descEn: 'Use on social media, WhatsApp or website.', descEs: 'Usa en redes sociales, WhatsApp o sitio web.' },
                        { step: '3', titlePt: 'O cliente responde', titleEn: 'The client responds', titleEs: 'El cliente responde', descPt: 'O sistema identifica necessidades, objetivos e o momento.', descEn: 'The system identifies needs, goals and timing.', descEs: 'El sistema identifica necesidades, objetivos y el momento.' },
                        { step: '4', titlePt: 'Conversa com contexto', titleEn: 'Conversation with context', titleEs: 'Conversación con contexto', descPt: 'Você atende clientes que já demonstraram interesse real.', descEn: 'You serve clients who have already shown real interest.', descEs: 'Atiendes clientes que ya demostraron interés real.' },
                      ]
                    : [
                        { step: '1', titlePt: 'Escolha uma avaliação', titleEn: 'Choose an assessment', titleEs: 'Elige una evaluación', descPt: 'Quizzes e diagnósticos prontos para nutrição.', descEn: 'Ready-made quizzes and diagnostics for nutrition.', descEs: 'Cuestionarios y diagnósticos listos para nutrición.' },
                        { step: '2', titlePt: 'Compartilhe o link', titleEn: 'Share the link', titleEs: 'Comparte el enlace', descPt: 'Use em redes sociais, WhatsApp ou site.', descEn: 'Use on social media, WhatsApp or website.', descEs: 'Usa en redes sociales, WhatsApp o sitio web.' },
                        { step: '3', titlePt: 'O paciente responde', titleEn: 'The patient responds', titleEs: 'El paciente responde', descPt: 'O sistema identifica hábitos, objetivos e o momento.', descEn: 'The system identifies habits, goals and timing.', descEs: 'El sistema identifica hábitos, objetivos y el momento.' },
                        { step: '4', titlePt: 'Consulta com contexto', titleEn: 'Consultation with context', titleEs: 'Consulta con contexto', descPt: 'Você atende pacientes que já entendem o valor da avaliação.', descEn: 'You serve patients who already understand the value of the assessment.', descEs: 'Atiendes pacientes que ya entienden el valor de la evaluación.' },
                      ]
                ).map((item) => (
                  <div key={item.step} className="text-center p-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold text-lg mb-3">
                      {item.step}
                    </span>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {locale === 'pt' ? item.titlePt : locale === 'en' ? item.titleEn : item.titleEs}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {locale === 'pt' ? item.descPt : locale === 'en' ? item.descEn : item.descEs}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <DiagnosticoExemploSection area={area === 'nutra' ? 'nutra' : componentArea} ctaHref={`${checkoutBase}?plan=annual`} />

        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                {isSalesArea ? (
                  locale === 'pt' ? 'Quando a conversa começa com contexto, tudo muda'
                  : locale === 'en' ? 'When the conversation starts with context, everything changes'
                  : 'Cuando la conversación comienza con contexto, todo cambia'
                ) : (
                  locale === 'pt' ? 'Quando a consulta começa com contexto, tudo muda'
                  : locale === 'en' ? 'When the consultation starts with context, everything changes'
                  : 'Cuando la consulta comienza con contexto, todo cambia'
                )}
              </h2>
              <ul className="space-y-4 mb-6">
                {(isSalesArea
                  ? [
                      { pt: 'Menos curiosos', en: 'Fewer curious people', es: 'Menos curiosos' },
                      { pt: 'Clientes mais preparados', en: 'More prepared clients', es: 'Clientes más preparados' },
                      { pt: 'Conversas mais qualificadas', en: 'More qualified conversations', es: 'Conversaciones más cualificadas' },
                      { pt: 'Mais clareza no primeiro contato', en: 'More clarity in the first contact', es: 'Más claridad en el primer contacto' },
                      { pt: 'Menos tempo explicando no WhatsApp', en: 'Less time explaining on WhatsApp', es: 'Menos tiempo explicando en WhatsApp' },
                      { pt: 'Mais autoridade profissional', en: 'More professional authority', es: 'Más autoridad profesional' },
                    ]
                  : [
                      { pt: 'Menos curiosos', en: 'Fewer curious people', es: 'Menos curiosos' },
                      { pt: 'Pacientes mais preparados', en: 'More prepared patients', es: 'Pacientes más preparados' },
                      { pt: 'Consultas mais qualificadas', en: 'More qualified consultations', es: 'Consultas más cualificadas' },
                      { pt: 'Mais clareza no primeiro contato', en: 'More clarity in the first contact', es: 'Más claridad en el primer contacto' },
                      { pt: 'Menos tempo explicando no WhatsApp', en: 'Less time explaining on WhatsApp', es: 'Menos tiempo explicando en WhatsApp' },
                      { pt: 'Mais autoridade profissional', en: 'More professional authority', es: 'Más autoridad profesional' },
                    ]
                ).map((b) => (
                  <li key={b.pt} className="flex items-center gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">✔</span>
                    <span>{locale === 'pt' ? b.pt : locale === 'en' ? b.en : b.es}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-800 font-semibold text-center mt-6">
                {isSalesArea ? (
                  locale === 'pt' ? 'Menos curiosos. Mais clientes realmente interessados.'
                  : locale === 'en' ? 'Fewer curious people. More truly interested clients.'
                  : 'Menos curiosos. Más clientes realmente interesados.'
                ) : (
                  locale === 'pt' ? 'Menos curiosos. Mais pacientes realmente interessados.'
                  : locale === 'en' ? 'Fewer curious people. More truly interested patients.'
                  : 'Menos curiosos. Más pacientes realmente interesados.'
                )}
              </p>
            </div>
          </div>
        </section>

        <UseCasesSection area={area === 'nutra' ? 'nutra' : componentArea} locale={locale} />

        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <PricingSectionLanding checkoutBasePath={checkoutBase} />
            </div>
          </div>
        </section>

        <section className="py-14 sm:py-20 bg-blue-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                {locale === 'pt' && 'Comece a usar o YLADA hoje'}
                {locale === 'en' && 'Start using YLADA today'}
                {locale === 'es' && 'Empieza a usar YLADA hoy'}
              </h2>
              <p className="text-blue-100 mb-6">
                {locale === 'pt' && 'Crie seu primeiro diagnóstico em minutos.'}
                {locale === 'en' && 'Create your first diagnosis in minutes.'}
                {locale === 'es' && 'Crea tu primer diagnóstico en minutos.'}
              </p>
              <Link
                href={`${checkoutBase}?plan=annual`}
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
              >
                {locale === 'pt' && 'Começar agora'}
                {locale === 'en' && 'Get started'}
                {locale === 'es' && 'Comenzar ahora'}
                <span className="ml-2" aria-hidden>→</span>
              </Link>
              <p className="text-blue-100 text-sm mt-3">
                {locale === 'pt' && 'Acesso liberado após o pagamento'}
                {locale === 'en' && 'Access granted after payment'}
                {locale === 'es' && 'Acceso liberado después del pago'}
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
              <div className="text-center sm:text-left">
                <span className="font-bold text-gray-900 text-lg">YLADA</span>
                <p className="text-gray-600 text-sm mt-1">
                  {locale === 'pt' && 'Plataforma de diagnósticos para iniciar conversas com contexto.'}
                  {locale === 'en' && 'Diagnostics platform to start conversations with context.'}
                  {locale === 'es' && 'Plataforma de diagnósticos para iniciar conversas con contexto.'}
                </p>
              </div>
              <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
                <Link href={locale === 'pt' ? '/pt/metodo-ylada' : `${appBasePath}/metodo-ylada`} className="text-gray-600 hover:text-gray-900">
                  {locale === 'pt' ? 'Método YLADA' : locale === 'en' ? 'YLADA Method' : 'Método YLADA'}
                </Link>
                <Link href={locale === 'pt' ? '/pt/profissionais' : `${appBasePath}/profissionais`} className="text-gray-600 hover:text-gray-900">
                  {locale === 'pt' ? 'Profissionais' : locale === 'en' ? 'Professionals' : 'Profesionales'}
                </Link>
                <Link href={locale === 'pt' ? '/pt/precos' : `${appBasePath}/precos`} className="text-gray-600 hover:text-gray-900">
                  {locale === 'pt' ? 'Planos' : locale === 'en' ? 'Plans' : 'Planes'}
                </Link>
                <Link href={locale === 'pt' ? '/pt/politica-de-privacidade' : `${appBasePath}/politica-de-privacidade`} className="text-gray-600 hover:text-gray-900">
                  {locale === 'pt' ? 'Privacidade' : locale === 'en' ? 'Privacy' : 'Privacidad'}
                </Link>
                <Link href={locale === 'pt' ? '/pt/termos-de-uso' : `${appBasePath}/termos-de-uso`} className="text-gray-600 hover:text-gray-900">
                  {locale === 'pt' ? 'Termos' : locale === 'en' ? 'Terms' : 'Términos'}
                </Link>
              </nav>
            </div>
            <p className="text-center sm:text-left text-gray-500 text-xs">
              © {new Date().getFullYear()} YLADA
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
