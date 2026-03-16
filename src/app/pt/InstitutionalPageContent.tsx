'use client'

/**
 * BLUEPRINT VISUAL – HOME YLADA (estrutura de venda: Dor → Identificação → Nova lógica → Demonstração → Credibilidade → Aplicação → Teste)
 * Ordem: HEADER → HERO (dor imediata) → AUTO DIAGNÓSTICO (quiz) → VÍDEO → PROBLEMA → VIRADA → NOVA LÓGICA → DEMONSTRAÇÃO (4 passos) → PSICOLOGIA → FUNIL YLADA → EXEMPLOS → BENEFÍCIOS → PARA QUEM É → O QUE ACONTECE → TESTE GRÁTIS → CTA → FOOTER
 * Vídeo: NEXT_PUBLIC_YLADA_HOME_VIDEO_URL (60–90s). Frase central apenas no hero (subtítulo) e na virada de chave.
 */

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'
import { useAuth } from '@/contexts/AuthContext'
import { getYladaLandingAreas } from '@/config/ylada-landing-areas'
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
const LOCALIZED_BASE = new Set(['nutri', 'estetica', 'fitness', 'psi', 'odonto', 'med', 'nutra', 'perfumaria', 'coach-bem-estar', 'seller'])

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
  const isInstitutionalPage = pathname === '/pt' || pathname === '/pt/' || pathname === '/en' || pathname === '/en/' || pathname === '/es' || pathname === '/es/'
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
        {/* 1️⃣ HERO — Dor imediata + proposta */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-sky-50 to-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {home?.hero?.title ?? 'Seu marketing hoje atrai curiosos perguntando preço?'}
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-4 leading-relaxed">
              {home?.hero?.subtitle ?? 'A maioria dos profissionais precisa explicar, convencer e insistir para vender. Boas conversas começam com boas perguntas.'}
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-2">
              {home?.hero?.tagline ?? 'Crie diagnósticos, compartilhe o link e veja pessoas iniciarem conversa com você no WhatsApp.'}
            </p>
            <p className="text-lg font-semibold text-gray-900 mb-8">
              {home?.hero?.ctaCuriososPreparados ?? 'Pare de conversar com curiosos. Comece a conversar com clientes preparados.'}
            </p>

            {/* 2️⃣ AUTO DIAGNÓSTICO — Quiz rápido (prende a pessoa) */}
            <div className="max-w-xl mx-auto mb-10">
              <p className="text-sm font-medium text-gray-600 mb-4">{home?.preEngagement?.beforeStart ?? 'Antes de começar, responda rápido:'}</p>
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
              <p className="text-base font-medium text-gray-700 mb-4">
                {home?.preEngagement?.discoverProfileMinute ?? 'Descubra seu perfil profissional em menos de 1 minuto.'}
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
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {home?.preEngagement?.ctaFreeDiagnosis ?? 'Fazer diagnóstico grátis'}
                </button>
                <Link
                  href={getLocalizedPath('/pt/cadastro', locale)}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all"
                >
                  {home?.preEngagement?.ctaCreateDiagnosis ?? 'Criar meu diagnóstico'}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3️⃣ VÍDEO EXPLICATIVO — 60–90s: problema, nova lógica, como testar */}
        <section className="py-10 sm:py-14 bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6">
              O que é o YLADA em 90 segundos
            </h2>
            {typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_YLADA_HOME_VIDEO_URL ? (
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900">
                <iframe
                  src={process.env.NEXT_PUBLIC_YLADA_HOME_VIDEO_URL}
                  title="Vídeo explicativo YLADA"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-3 p-8 text-center">
                <span className="text-4xl" aria-hidden>🎥</span>
                <p className="text-gray-600 font-medium">Vídeo explicativo em breve</p>
                <p className="text-sm text-gray-500 max-w-md">
                  Em 60–90 segundos: o problema que o YLADA resolve, a lógica de diagnóstico antes da conversa e como testar grátis.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 4️⃣ IDENTIFICAÇÃO DO PROBLEMA — A maioria dos profissionais explica demais */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              A maioria dos profissionais explica demais o que faz.
            </h2>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Pessoas pedindo preço</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Conversas que não avançam</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Clientes que não entendem o valor</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Profissionais que precisam convencer o tempo todo</span>
              </li>
            </ul>
            <p className="text-lg font-semibold text-gray-900 text-center mb-8">
              O problema raramente é seu conhecimento.<br />
              É a forma como o cliente chega até você.
            </p>
            <p className="text-gray-500 text-sm text-center">
              Muitos profissionais investem em cursos, marketing e ferramentas.
              Mas ignoram um fator essencial:
              como o cliente entende o próprio problema antes da conversa.
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
                Boas conversas começam com boas perguntas.
              </p>
            </div>
          </div>
        </section>

        {/* 4️⃣ A NOVA LÓGICA — Marketing tradicional vs YLADA */}
        <section className="py-10 sm:py-14 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-6">
              Marketing tradicional vs YLADA
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="rounded-xl p-6 border-2 border-red-100 bg-red-50/50">
                <p className="font-bold text-gray-900 mb-4 text-center text-sm uppercase tracking-wider text-red-800">Marketing tradicional</p>
                <div className="flex flex-col items-center gap-1 text-gray-700">
                  <span className="text-sm font-medium">Explicar</span>
                  <span className="text-red-300">↓</span>
                  <span className="text-sm font-medium">Convencer</span>
                  <span className="text-red-300">↓</span>
                  <span className="text-sm font-medium">Insistir</span>
                </div>
                <p className="text-center text-red-600 text-sm font-medium mt-4">Resultado:</p>
                <ul className="text-center text-sm text-gray-600 mt-1 space-y-0.5">
                  <li>❌ curiosos</li>
                  <li>❌ conversas fracas</li>
                </ul>
              </div>
              <div className="rounded-xl p-6 border-2 border-[#2563eb] bg-blue-50/50">
                <p className="font-bold text-gray-900 mb-4 text-center text-sm uppercase tracking-wider text-[#2563eb]">YLADA</p>
                <div className="flex flex-col items-center gap-1 text-gray-800">
                  <span className="text-sm font-medium">Perguntar</span>
                  <span className="text-blue-300">↓</span>
                  <span className="text-sm font-medium">Diagnosticar</span>
                  <span className="text-blue-300">↓</span>
                  <span className="text-sm font-medium">Conversar</span>
                </div>
                <p className="text-center text-[#2563eb] text-sm font-medium mt-4">Resultado:</p>
                <ul className="text-center text-sm text-gray-700 mt-1 space-y-0.5">
                  <li>✔ clientes preparados</li>
                  <li>✔ conversas melhores</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 6️⃣ DEMONSTRAÇÃO — 4 passos (reduz fricção) */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            Como funciona
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
            {[
              { emoji: '🧠', titulo: 'Criar diagnóstico', desc: 'Transforme seu conhecimento em perguntas que revelam o problema do cliente.' },
              { emoji: '🔗', titulo: 'Compartilhar link', desc: 'Envie nas redes sociais, WhatsApp ou anúncios.' },
              { emoji: '💬', titulo: 'Pessoa responde', desc: 'Pessoas respondem e iniciam conversa com você no WhatsApp.' },
              { emoji: '🤝', titulo: 'Inicia conversa no WhatsApp', desc: 'O cliente chega com mais clareza e a conversa avança com mais facilidade.' },
            ].map((item) => (
              <div key={item.titulo} className="text-center bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="text-4xl mb-3" aria-hidden>{item.emoji}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.titulo}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href={getLocalizedPath('/pt/metodo-ylada', locale)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Conhecer a filosofia YLADA →
            </Link>
          </div>
        </section>

        {/* 7️⃣ PSICOLOGIA DO DIAGNÓSTICO — uma vez só (auto-diagnóstico, compromisso, identidade) */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
              O que acontece na mente de quem responde
            </h2>
            <p className="text-gray-700 text-center mb-10 leading-relaxed">
              Quando a pessoa responde perguntas sobre o próprio problema, ela começa a construir a conclusão sozinha. E quando reconhece o problema, tende a querer agir — a conversa não começa com convencimento, começa com coerência interna.
            </p>

            <div className="space-y-8 mb-10">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">🧠 Auto-descoberta</h3>
                <p className="text-gray-600 text-sm mb-3">Perguntas como &quot;As pessoas pedem preço antes de entender o valor?&quot; fazem o cérebro refletir: &quot;Talvez isso esteja acontecendo comigo.&quot; A conclusão nasce dentro da cabeça da pessoa — muito mais forte do que alguém dizer.</p>
                <div className="flex flex-col items-center gap-1 text-sm text-gray-500">
                  <span>Pergunta</span>
                  <span>↓</span>
                  <span>Reflexão</span>
                  <span>↓</span>
                  <span>Percepção do problema</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">🎯 Consistência</h3>
                <p className="text-gray-600 text-sm mb-3">Quando a pessoa responde e &quot;assume&quot; um problema (mesmo que só para si), o cérebro cria um impulso: &quot;Se isso é verdade, preciso resolver.&quot; A conversa começa com muito mais interesse — menos resistência, mais abertura, decisões mais rápidas.</p>
                <div className="flex flex-col items-center gap-1 text-sm text-gray-500">
                  <span>Reconhecimento do problema</span>
                  <span>↓</span>
                  <span>Desejo de consistência</span>
                  <span>↓</span>
                  <span>Busca por solução</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">👤 Identidade</h3>
                <p className="text-gray-600 text-sm mb-3">O diagnóstico revela um perfil (&quot;Explica demais&quot;, &quot;Atrai curiosos&quot;, &quot;Conversa que converte&quot;). As pessoas gostam de descobrir algo sobre si mesmas — e quando descobrem, tendem a compartilhar. Isso gera curiosidade e engajamento natural.</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                    <p className="font-semibold text-gray-800 mb-1">Sem diagnóstico</p>
                    <p className="text-gray-600">Confusão → explicação → tentativa de convencer</p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                    <p className="font-semibold text-gray-800 mb-1">Com diagnóstico</p>
                    <p className="text-gray-600">Clareza → conversa → decisão</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-700 text-center mb-4">
              Diagnósticos não apenas coletam respostas. Eles ajudam as pessoas a entender quem são e o que precisam mudar.
            </p>
            <p className="text-xl font-bold text-gray-900 text-center mb-4">
              Quando o cliente entende o problema, a conversa muda.
            </p>
            <p className="text-gray-600 text-center mb-6 text-sm">
              O YLADA não é só um formulário — é uma forma de criar consciência do cliente antes da conversa. Quando o cliente entende o problema, a venda deixa de ser convencimento.
            </p>
            <div className="flex flex-col items-center gap-2 py-4 px-6 bg-white rounded-xl border border-gray-100">
              <span className="text-sm font-semibold text-gray-800">Perguntas</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">Auto-reflexão</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">Diagnóstico / Perfil</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">Clareza</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">Conversa melhor</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-bold text-gray-900">Cliente</span>
            </div>
          </div>
        </section>

        {/* 8️⃣ O FUNIL YLADA — Curiosidade → Perguntas → Clareza → Conversa → Cliente */}
        <section className="py-10 sm:py-14 bg-white">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              O funil YLADA
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Não é o funil tradicional. É um funil que prepara a conversa antes dela acontecer.
            </p>
            <div className="flex flex-col items-center gap-2 py-6 px-6 bg-gray-50 rounded-xl border border-gray-100 max-w-sm mx-auto">
              <span className="text-sm font-semibold text-gray-800">Curiosidade</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">Perguntas</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">Clareza</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">Conversa</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-bold text-gray-900">Cliente</span>
            </div>
          </div>
        </section>

        {/* 9️⃣ EXEMPLOS DE DIAGNÓSTICOS — inspiração de uso real */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
              Exemplos de diagnósticos
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {EXEMPLOS_DIAGNOSTICOS.map((ex) => (
                <Link
                  key={ex.titulo}
                  href={getLocalizedPath(ex.href, locale)}
                  className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <p className="font-medium text-gray-900">{ex.titulo}</p>
                  <span className="text-blue-600 text-sm mt-2 inline-block">Testar diagnóstico →</span>
                </Link>
              ))}
            </div>
            <p className="text-center text-gray-600 text-sm">
              Esses são exemplos de diagnósticos que profissionais podem criar com YLADA.
            </p>
          </div>
        </section>

        {/* 9️⃣ BENEFÍCIOS — Profissionais usam diagnósticos para */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Profissionais usam diagnósticos para:
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center justify-center gap-2">
                <span className="text-green-600">✔</span>
                <span>atrair clientes melhores</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="text-green-600">✔</span>
                <span>evitar conversas improdutivas</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="text-green-600">✔</span>
                <span>explicar valor com mais facilidade</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="text-green-600">✔</span>
                <span>transformar curiosidade em decisão</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 10️⃣ PARA QUEM É — Áreas */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
              {home?.areas?.title ?? 'Para quais profissionais o YLADA foi criado'}
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              {home?.areas?.subtitle ?? 'Profissionais e vendedores consultivos usam diagnósticos para atrair clientes mais preparados.'}
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {getYladaLandingAreas(locale).map((area) => (
                <Link
                  key={area.codigo}
                  href={area.href}
                  className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center"
                >
                  <span className="font-semibold text-gray-900 block mb-1">{area.label}</span>
                  <span className="text-sm text-gray-600">{area.slogan}</span>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link
                href={getLocalizedPath('/pt/profissionais', locale)}
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
              >
                {home?.areas?.seeAll ?? 'Ver todas as áreas'}
              </Link>
            </div>
          </div>
        </section>

        {/* 11️⃣ O QUE ACONTECE DEPOIS — Etapas numeradas (conciso) */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
              O que acontece depois do diagnóstico
            </h2>
            <p className="text-gray-700 font-medium text-center mb-4">
              O diagnóstico não é apenas um teste. Ele prepara a conversa.
            </p>
            <p className="text-gray-600 text-center mb-6 text-sm">
              Resultado claro em poucos minutos.
            </p>

            {/* Diagrama visual do sistema */}
            <div className="flex flex-col items-center gap-2 mb-10 py-6 px-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-sm font-medium text-gray-700">Pessoa vê diagnóstico</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-medium text-gray-700">Pessoa responde perguntas</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-medium text-gray-700">Recebe resultado</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-medium text-gray-700">Conversa começa</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-900">Cliente</span>
            </div>

            <div className="space-y-6 mb-10">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2563eb] text-white font-bold text-sm flex items-center justify-center">1</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Você descobre seu perfil</h3>
                  <p className="text-gray-600 text-sm">O diagnóstico identifica como sua comunicação profissional está funcionando hoje.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2563eb] text-white font-bold text-sm flex items-center justify-center">2</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Você entende o que está travando seus resultados</h3>
                  <p className="text-gray-600 text-sm mb-2">O resultado mostra o que normalmente acontece com profissionais no mesmo perfil.</p>
                  <ul className="text-gray-500 text-sm space-y-1">
                    <li>• atraem muitos curiosos</li>
                    <li>• explicam demais o que fazem</li>
                    <li>• têm conversas que não avançam</li>
                  </ul>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2563eb] text-white font-bold text-sm flex items-center justify-center">3</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Você vê como melhorar</h3>
                  <p className="text-gray-600 text-sm">O diagnóstico mostra o caminho que profissionais usam para atrair clientes mais preparados.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2563eb] text-white font-bold text-sm flex items-center justify-center">4</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Você pode aplicar isso no seu negócio</h3>
                  <p className="text-gray-600 text-sm">Se fizer sentido para você, o YLADA permite criar seus próprios diagnósticos e aplicar esse método com seus clientes.</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Link
                href={getLocalizedPath('/pt/diagnostico', locale)}
                className="inline-flex items-center justify-center px-8 py-4 bg-[#2563eb] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all"
              >
                Descobrir meu perfil
              </Link>
            </div>
          </div>
        </section>

        {/* 12️⃣ PLANO FREE — Comece grátis */}
        <section className="bg-sky-50 py-12 sm:py-16 border-y border-sky-100">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Comece grátis com 1 diagnóstico ativo
            </h2>
            <p className="text-gray-600 mb-4">Comece grátis e teste com clientes reais.</p>
            <ul className="space-y-2 text-gray-700 mb-6 text-left max-w-sm mx-auto">
              <li className="flex items-center gap-2"><span className="text-green-600">✔</span> 1 diagnóstico ativo</li>
              <li className="flex items-center gap-2"><span className="text-green-600">✔</span> até 10 contatos no WhatsApp por mês</li>
              <li className="flex items-center gap-2"><span className="text-green-600">✔</span> até 10 análises do Noel por mês</li>
            </ul>
            <Link
              href={getLocalizedPath('/pt/cadastro', locale)}
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
            >
              Criar meu primeiro diagnóstico grátis
            </Link>
          </div>
        </section>

        {/* CTA FINAL — Estilo profissional */}
        <section className="bg-[#1e3a8a] py-16 sm:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 leading-tight">
              Crie, compartilhe e gere conversas no WhatsApp
            </h2>
            <Link
              href={getLocalizedPath('/pt/cadastro', locale)}
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-[#1e3a8a] font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
            >
              Criar meu primeiro diagnóstico grátis
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
