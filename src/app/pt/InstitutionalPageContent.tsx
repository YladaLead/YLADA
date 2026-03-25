'use client'

/**
 * BLUEPRINT – HOME YLADA (foco conversão: menos texto, mais visual)
 * Ordem: HERO → QUIZ → VÍDEO → PROBLEMA → VIRADA → COMPARAÇÃO (imagem) → COMO FUNCIONA (4) → O QUE ACONTECE (1 bloco) → EXEMPLOS → BENEFÍCIOS → PARA QUEM É → TESTE GRÁTIS → CTA
 * Funil YLADA está na imagem "Marketing tradicional vs YLADA". Sem seção duplicada.
 */

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'
import { useAuth } from '@/contexts/AuthContext'
import { YladaProfissionaisGridSection } from '@/components/landing/YladaProfissionaisGridSection'
import DemoCarouselYLADA from '@/components/landing/DemoCarouselYLADA'
import { getLocaleFromPathname, type Language } from '@/lib/i18n'
import { ptTranslations } from '@/lib/translations/pt'
import { enTranslations } from '@/lib/translations/en'
import { esTranslations } from '@/lib/translations/es'

const PERGUNTA_HERO_VALUES = [2, 1, 0, 1] as const

const EXEMPLOS_DIAGNOSTICOS = [
  { titulo: 'O que está travando o crescimento do seu negócio?', href: '/pt/diagnostico' },
  { titulo: 'Seu posicionamento transmite autoridade?', href: '/pt/diagnostico/autoridade' },
  { titulo: 'Por que sua agenda não enche como poderia?', href: '/pt/diagnostico/agenda' },
  { titulo: 'Seu conteúdo atrai clientes ou apenas engajamento?', href: '/pt/diagnostico/conteudo' },
]

/** Rotas com landing em pt/en/es. Outras usam /pt (painel não traduzido). */
const LOCALIZED_BASE = new Set([
  'nutri',
  'estetica',
  'fitness',
  'psi',
  'psicanalise',
  'odonto',
  'med',
  'nutra',
  'perfumaria',
  'coach',
  'seller',
])

function getLocalizedPath(path: string, locale: Language): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const withoutLocale = normalized.replace(/^\/(pt|en|es)\//, '/').replace(/^\/(pt|en|es)$/, '/') || '/'
  const segment = withoutLocale.replace(/^\//, '').split('/')[0]?.split('?')[0] ?? ''
  if (LOCALIZED_BASE.has(segment) && (locale === 'en' || locale === 'es')) {
    const qs = path.includes('?') ? path.slice(path.indexOf('?')) : ''
    return `/${locale}${withoutLocale}${qs}`.replace(/\/+/g, '/')
  }
  return normalized
}

const LOCALE_TRANSLATIONS = { pt: ptTranslations, en: enTranslations, es: esTranslations } as const

export default function InstitutionalPageContent() {
  const pathname = usePathname() ?? ''
  const locale = getLocaleFromPathname(pathname)
  useTranslations(locale)
  const t = LOCALE_TRANSLATIONS[locale] ?? ptTranslations
  const inst = t?.institutional
  const { user, loading } = useAuth()
  const router = useRouter()

  const searchParams = useSearchParams()
  const isInstitutionalPage =
    pathname === '/pt/institucional' ||
    pathname === '/pt/institucional/' ||
    pathname === '/en' ||
    pathname === '/en/' ||
    pathname === '/es' ||
    pathname === '/es/'
  const forceLanding = searchParams?.get('landing') === '1'

  useEffect(() => {
    if (loading) return
    if (!pathname || !isInstitutionalPage) return
    if (user && !forceLanding) {
      router.replace('/pt/home')
    }
  }, [loading, user, pathname, router, isInstitutionalPage, forceLanding])

  const [authTimeout, setAuthTimeout] = useState(false)
  const [respostaHeroIdx, setRespostaHeroIdx] = useState<number | null>(null)
  useEffect(() => {
    const id = setTimeout(() => setAuthTimeout(true), 2000)
    return () => clearTimeout(id)
  }, [])

  const home = t?.home
  if (!inst) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">{home?.loading ?? 'Carregando...'}</p>
      </div>
    )
  }

  const showAuthLoading = loading && isInstitutionalPage && !authTimeout && !forceLanding
  if (showAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">{home?.loading ?? 'Carregando...'}</p>
      </div>
    )
  }

  if (user && isInstitutionalPage && !forceLanding) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">{home?.redirecting ?? 'Redirecionando...'}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 1️⃣ HEADER — 72px, fundo branco */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-[72px] flex items-center safe-area-inset-top">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
          <Link href={`/${locale}`} className="flex-shrink-0 touch-manipulation" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link href={getLocalizedPath('/pt/diagnostico', locale)} className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden md:inline">
              {home?.nav?.doDiagnosis ?? 'Fazer diagnóstico'}
            </Link>
            <Link href={getLocalizedPath('/pt/metodo-ylada', locale)} className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden md:inline">
              {home?.nav?.philosophy ?? 'Filosofia'}
            </Link>
            <Link href={getLocalizedPath('/pt/sobre', locale)} className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden md:inline">
              {home?.nav?.about ?? 'Sobre'}
            </Link>
            <Link href={getLocalizedPath('/pt/profissionais', locale)} className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden lg:inline">
              {home?.nav?.professionals ?? 'Profissionais'}
            </Link>
            <Link href={getLocalizedPath('/pt/como-funciona', locale)} className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden lg:inline">
              {home?.nav?.howItWorks ?? 'Como funciona'}
            </Link>
            <Link href={getLocalizedPath('/pt/precos', locale)} className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden lg:inline">
              {home?.nav?.pricing ?? 'Preços'}
            </Link>
            <Link href={getLocalizedPath('/pt/login', locale)} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              {home?.nav?.login ?? 'Entrar'}
            </Link>
            <Link
              href={getLocalizedPath('/pt/cadastro', locale)}
              className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              {home?.nav?.startFree ?? home?.nav?.discoverProfile ?? 'Começar grátis'}
            </Link>
            <LanguageSelector />
          </nav>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1️⃣ HERO — Impacto direto + experiência interativa obrigatória */}
        <section className="py-10 sm:py-14 lg:py-16 bg-gradient-to-b from-sky-50 to-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight text-center">
              {home?.hero?.title ?? 'Seu WhatsApp está cheio de curiosos ou clientes prontos?'}
            </h1>
            <div className="flex justify-center mb-8">
              <button
                type="button"
                onClick={() => document.getElementById('quiz-diagnostico')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl text-base sm:text-lg"
              >
                {home?.hero?.subtitle ?? 'Descubra seu perfil de marketing em 30 segundos.'}
              </button>
            </div>

            {/* 2️⃣ QUIZ EM DESTAQUE — Fluxo visual óbvio: experiência interativa, não conteúdo institucional */}
            <div id="quiz-diagnostico" className="max-w-xl mx-auto mb-8 rounded-2xl bg-white border-2 border-gray-200 shadow-lg shadow-gray-200/50 scroll-mt-8 overflow-hidden">
              <div className="bg-blue-600 px-6 py-3 text-center">
                <p className="text-white font-semibold text-sm sm:text-base">
                  {home?.preEngagement?.diagnosticBadge ?? 'Selecione o que está acontecendo com você agora'}
                </p>
              </div>
              <div className="p-6 sm:p-8">
              <p className="text-sm font-semibold text-gray-700 mb-3">{home?.preEngagement?.beforeStart ?? 'Qual é o seu caso?'}</p>
              <p className="font-semibold text-gray-900 mb-4">{home?.preEngagement?.questionPreEngage ?? 'Seu marketing hoje atrai mais:'}</p>
              <div className="space-y-2 mb-6">
                {[
                  { label: home?.preEngagement?.optCurious ?? 'Curiosos perguntando preço', value: 0 },
                  { label: home?.preEngagement?.optStuck ?? 'Conversas que não avançam', value: 1 },
                  { label: home?.preEngagement?.optPrepared ?? 'Clientes realmente preparados', value: 2 },
                  { label: home?.preEngagement?.optNotSure ?? 'Não tenho certeza', value: 3 },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                      respostaHeroIdx === opt.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="preengage"
                      value={opt.value}
                      checked={respostaHeroIdx === opt.value}
                      onChange={() => setRespostaHeroIdx(opt.value)}
                      className="sr-only"
                    />
                    <span className="flex-shrink-0 w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                      {respostaHeroIdx === opt.value && (
                        <span className="w-2 h-2 rounded-full bg-blue-600" />
                      )}
                    </span>
                    <span className="text-gray-800">{opt.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm font-semibold text-gray-800 mb-4">
                {home?.preEngagement?.discoverProfileMinute ?? 'Selecione uma opção e veja seu perfil em 1 minuto.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => {
                    if (respostaHeroIdx !== null) {
                      const problemaValue = PERGUNTA_HERO_VALUES[respostaHeroIdx] ?? 1
                      router.push(getLocalizedPath(`/pt/diagnostico?fromHome=1&problema=${problemaValue}`, locale))
                    }
                  }}
                  disabled={respostaHeroIdx === null}
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-base"
                >
                  {respostaHeroIdx !== null
                    ? (home?.preEngagement?.ctaFreeDiagnosis ?? 'Fazer meu diagnóstico')
                    : (home?.preEngagement?.ctaFreeDiagnosisDisabled ?? 'Selecione uma opção acima')}
                </button>
                <Link
                  href={getLocalizedPath('/pt/cadastro', locale)}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all"
                >
                  {home?.preEngagement?.ctaCreateDiagnosis ?? 'Criar meu diagnóstico'}
                </Link>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                {home?.hero?.proof ?? '+3.000 profissionais já testaram'}
              </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ FLUXO — Como funciona na prática (carrossel do método) */}
        <DemoCarouselYLADA />

        {/* 4️⃣ IDENTIFICAÇÃO DO PROBLEMA */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              {home?.problem?.title ?? 'A maioria dos profissionais explica demais o que faz.'}
            </h2>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>{home?.problem?.list1 ?? 'Pessoas pedindo preço'}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>{home?.problem?.list2 ?? 'Conversas que não avançam'}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>{home?.problem?.list3 ?? 'Clientes que não entendem o valor'}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>{home?.problem?.list4 ?? 'Profissionais que precisam convencer o tempo todo'}</span>
              </li>
            </ul>
            <p className="text-lg font-semibold text-gray-900 text-center mb-8">
              {home?.problem?.conclusion1 ?? 'O problema raramente é seu conhecimento.'}<br />
              {home?.problem?.conclusion2 ?? 'É a forma como o cliente chega até você.'}
            </p>
            <p className="text-gray-500 text-sm text-center">
              {home?.problem?.footnote ?? 'Muitos profissionais investem em cursos, marketing e ferramentas. Mas ignoram um fator essencial: como o cliente entende o próprio problema antes da conversa.'}
            </p>
          </div>
        </section>

        {/* 3️⃣ A VIRADA DE CHAVE — frase forte uma vez só */}
        <section className="py-10 sm:py-14 bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto text-center px-4">
            <div className="bg-gray-900 text-white rounded-2xl p-8 sm:p-10">
              <p className="text-base sm:text-lg text-gray-300 mb-3">
                {home?.duolingo?.explainNot ?? 'Explicar demais não cria clientes.'}
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                {home?.viradaTagline ?? 'Boas conversas começam com boas perguntas.'}
              </p>
            </div>
          </div>
        </section>

        {/* 4️⃣ A NOVA LÓGICA — só a imagem (título e frase já estão dentro da arte) */}
        <section className="py-10 sm:py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-50/50">
              <Image
                src="/images/ylada/marketing-tradicional-vs-ylada-funil.png"
                alt="Comparação: Funil tradicional de vendas (Atenção, Interesse, Desejo, Ação) gera curiosidade superficial e resistência. Funil de diagnóstico YLADA (Curiosidade, Perguntas, Clareza, Conversa, Cliente) gera cliente que entende o problema, reconhece autoridade e está preparado para agir. Boas conversas começam com boas perguntas."
                width={900}
                height={600}
                className="w-full h-auto"
                priority
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>
          </div>
        </section>

        {/* 5️⃣ COMO FUNCIONA — 4 passos */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            {home?.howItWorks?.title ?? 'Como funciona'}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
            {(home?.howItWorks?.steps ?? [
              { title: 'Criar diagnóstico', desc: 'Transforme seu conhecimento em perguntas que revelam o problema do cliente.' },
              { title: 'Compartilhar link', desc: 'Envie nas redes sociais, WhatsApp ou anúncios.' },
              { title: 'Pessoa responde', desc: 'Pessoas respondem e iniciam conversa com você no WhatsApp.' },
              { title: 'Inicia conversa no WhatsApp', desc: 'O cliente chega com mais clareza e a conversa avança com mais facilidade.' },
            ]).map((item, i) => (
              <div key={i} className="text-center bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="text-4xl mb-3" aria-hidden>{['🧠', '🔗', '💬', '🤝'][i]}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href={getLocalizedPath('/pt/metodo-ylada', locale)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {home?.howItWorks?.linkText ?? 'Conhecer a filosofia YLADA →'}
            </Link>
          </div>
        </section>

        {/* 6️⃣ O QUE ACONTECE QUANDO ALGUÉM RESPONDE */}
        <section className="bg-gray-50 py-10 sm:py-14 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              {home?.whatHappens?.title ?? 'O que acontece quando alguém responde um diagnóstico'}
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {home?.whatHappens?.intro ?? 'Quando uma pessoa responde perguntas sobre o próprio problema, ela começa a entender a situação antes da conversa.'}
            </p>
            <div className="flex flex-col items-center gap-2 py-6 px-6 bg-white rounded-xl border border-gray-100 max-w-xs mx-auto shadow-sm">
              <span className="text-sm font-semibold text-gray-800">{home?.whatHappens?.step1 ?? 'Perguntas'}</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">{home?.whatHappens?.step2 ?? 'Reflexão'}</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">{home?.whatHappens?.step3 ?? 'Clareza'}</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">{home?.whatHappens?.step4 ?? 'Conversa'}</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-bold text-gray-900">{home?.whatHappens?.step5 ?? 'Cliente'}</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 mt-6">
              {home?.whatHappens?.closing ?? 'Quando o cliente entende o problema, a conversa muda.'}
            </p>
          </div>
        </section>

        {/* 7️⃣ EXEMPLOS DE DIAGNÓSTICOS */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
              {home?.examples?.title ?? 'Exemplos de diagnósticos'}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {(home?.examplesTitles ?? EXEMPLOS_DIAGNOSTICOS.map((ex) => ex.titulo)).map((titulo, i) => (
                <Link
                  key={i}
                  href={getLocalizedPath(EXEMPLOS_DIAGNOSTICOS[i]?.href ?? '/pt/diagnostico', locale)}
                  className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <p className="font-medium text-gray-900">{titulo}</p>
                  <span className="text-blue-600 text-sm mt-2 inline-block">{home?.examples?.testLink ?? 'Testar diagnóstico →'}</span>
                </Link>
              ))}
            </div>
            <p className="text-center text-gray-600 text-sm">
              {home?.examples?.subtitle ?? 'Esses são exemplos de diagnósticos que profissionais podem criar com YLADA.'}
            </p>
          </div>
        </section>

        {/* BENEFÍCIOS */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              {home?.benefits?.title ?? 'Profissionais usam diagnósticos para:'}
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center justify-center gap-2">
                <span className="text-green-600">✔</span>
                <span>{home?.benefits?.item1 ?? 'atrair clientes melhores'}</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="text-green-600">✔</span>
                <span>{home?.benefits?.item2 ?? 'evitar conversas improdutivas'}</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="text-green-600">✔</span>
                <span>{home?.benefits?.item3 ?? 'explicar valor com mais facilidade'}</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="text-green-600">✔</span>
                <span>{home?.benefits?.item4 ?? 'transformar curiosidade em decisão'}</span>
              </li>
            </ul>
          </div>
        </section>

        <YladaProfissionaisGridSection
          locale={locale}
          title={home?.areas?.title}
          subtitle={home?.areas?.subtitle}
          verTodasHref={getLocalizedPath('/pt/profissionais', locale)}
          verTodasLabel={home?.areas?.seeAll}
        />

        {/* TESTE GRÁTIS */}
        <section className="bg-sky-50 py-12 sm:py-16 border-y border-sky-100">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              {home?.freeTrial?.title ?? 'Comece grátis'}
            </h2>
            <p className="text-gray-600 mb-6">{home?.freeTrial?.subtitle ?? 'Comece grátis e teste com clientes reais.'}</p>
            <Link
              href={getLocalizedPath('/pt/cadastro', locale)}
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
            >
              {home?.freeTrial?.cta ?? 'Criar meu primeiro diagnóstico grátis'}
            </Link>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="bg-[#1e3a8a] py-16 sm:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              {home?.ctaFinal?.headline ?? 'Crie um diagnóstico, compartilhe o link e atraia clientes certos para seu WhatsApp.'}
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              {home?.ctaFinal?.subheadline ?? 'Em vez de explicar e convencer, deixe o cliente chegar já entendendo o próprio problema.'}
            </p>
            <Link
              href={getLocalizedPath('/pt/cadastro', locale)}
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-[#1e3a8a] font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
            >
              {home?.ctaFinal?.button ?? 'Criar meu primeiro diagnóstico grátis'}
            </Link>
          </div>
        </section>
      </main>

      {/* 🔟 FOOTER */}
      <footer className="border-t border-gray-200 bg-white mt-10 sm:mt-16">
        <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:py-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <YLADALogo size="lg" className="bg-transparent" />
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-6 text-sm">
              <Link href={getLocalizedPath('/pt/diagnostico', locale)} className="text-gray-600 hover:text-gray-900">
                {home?.footer?.doDiagnosis ?? 'Fazer diagnóstico'}
              </Link>
              <Link href={getLocalizedPath('/pt/diagnosticos', locale)} className="text-gray-600 hover:text-gray-900">
                {home?.footer?.library ?? 'Biblioteca de diagnósticos'}
              </Link>
              <Link href={getLocalizedPath('/pt/metodo-ylada', locale)} className="text-gray-600 hover:text-gray-900">
                {home?.footer?.philosophy ?? 'Filosofia'}
              </Link>
              <Link href={getLocalizedPath('/pt/sobre', locale)} className="text-gray-600 hover:text-gray-900">
                {home?.footer?.about ?? 'Sobre'}
              </Link>
              <Link href={getLocalizedPath('/pt/profissionais', locale)} className="text-gray-600 hover:text-gray-900">
                {home?.footer?.professionals ?? 'Profissionais'}
              </Link>
              <Link href={getLocalizedPath('/pt/como-funciona', locale)} className="text-gray-600 hover:text-gray-900">
                {home?.footer?.howItWorks ?? 'Como funciona'}
              </Link>
              <Link href={getLocalizedPath('/pt/precos', locale)} className="text-gray-600 hover:text-gray-900">
                {home?.footer?.pricing ?? 'Preços'}
              </Link>
              <Link href={getLocalizedPath('/pt/login', locale)} className="text-gray-600 hover:text-gray-900">
                {home?.footer?.login ?? 'Entrar'}
              </Link>
              <Link href={getLocalizedPath('/pt/cadastro', locale)} className="text-blue-600 hover:text-blue-700 font-medium">
                {home?.footer?.createDiagnosis ?? 'Criar diagnóstico'}
              </Link>
            </nav>
            <p className="text-gray-600 text-sm mb-4">{inst.footer.tagline}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-4 text-sm text-gray-500">
              <Link href={getLocalizedPath('/pt/politica-de-privacidade', locale)} className="hover:text-gray-700">
                {inst.footer.privacy}
              </Link>
              <span aria-hidden>•</span>
              <Link href={getLocalizedPath('/pt/termos-de-uso', locale)} className="hover:text-gray-700">
                {inst.footer.terms}
              </Link>
              <span aria-hidden>•</span>
              <Link href={getLocalizedPath('/pt/politica-de-cookies', locale)} className="hover:text-gray-700">
                {inst.footer.cookies}
              </Link>
              <span aria-hidden>•</span>
              <Link href={getLocalizedPath('/pt/politica-de-reembolso', locale)} className="hover:text-gray-700">
                {inst.footer.refund}
              </Link>
              <span className="text-gray-400">{inst.footer.languages}</span>
            </div>
            <p className="text-gray-500 text-xs">
              {inst.footer.copyright.replace('{year}', String(new Date().getFullYear()))}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
