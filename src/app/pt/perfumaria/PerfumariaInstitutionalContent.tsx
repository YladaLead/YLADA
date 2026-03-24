'use client'

/**
 * Landing longa Perfumaria — /pt/perfumaria/como-funciona. Entrada minimal: /pt/perfumaria.
 */

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import { useAuth } from '@/contexts/AuthContext'
import DemoCarouselYLADA from '@/components/landing/DemoCarouselYLADA'
import { YladaProfissionaisGridSection } from '@/components/landing/YladaProfissionaisGridSection'
import { isPtAreaComoFuncionaPage } from '@/config/area-public-entry'

const PERGUNTA_HERO_VALUES = [2, 1, 0, 1] as const

const EXEMPLOS_PERFUMARIA = [
  { titulo: 'Qual fragrância combina com seu perfil?', href: '/pt/diagnostico?area=6&fromArea=perfumaria' },
  { titulo: 'Descubra sua fragrância ideal', href: '/pt/diagnostico?area=6&fromArea=perfumaria' },
  { titulo: 'Que tipo de fragrância você busca?', href: '/pt/diagnostico?area=6&fromArea=perfumaria' },
  { titulo: 'Você está pronto para encontrar sua próxima fragrância?', href: '/pt/diagnostico?area=6&fromArea=perfumaria' },
]

const HOW_IT_WORKS_PERFUMARIA = [
  { title: 'Criar diagnóstico', desc: 'Transforme seu conhecimento em perguntas de perfil olfativo que revelam preferências e ocasiões.' },
  { title: 'Compartilhar link', desc: 'Envie nas redes sociais, WhatsApp ou site.' },
  { title: 'O cliente responde', desc: 'O cliente responde e inicia conversa com você no WhatsApp.' },
  { title: 'Conversa com contexto', desc: 'O cliente chega com perfil claro e a indicação de fragrância avança com mais facilidade.' },
]

export default function PerfumariaInstitutionalContent() {
  const pathname = usePathname() ?? ''
  const locale = pathname.startsWith('/en') ? 'en' : pathname.startsWith('/es') ? 'es' : 'pt'
  const { user, loading } = useAuth()
  const router = useRouter()

  const isPerfumariaPage = isPtAreaComoFuncionaPage(pathname, 'perfumaria')
  const [respostaHeroIdx, setRespostaHeroIdx] = useState<number | null>(null)
  const [authTimeout, setAuthTimeout] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setAuthTimeout(true), 2000)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (loading || !isPerfumariaPage) return
    if (user) {
      router.replace('/pt/perfumaria/home')
    }
  }, [loading, user, pathname, router, isPerfumariaPage])

  const showAuthLoading = loading && isPerfumariaPage && !authTimeout
  if (showAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  if (user && isPerfumariaPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Redirecionando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-[72px] flex items-center safe-area-inset-top">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
          <Link href="/pt" className="flex items-center gap-2 flex-shrink-0 touch-manipulation" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
            <span className="text-gray-500 text-sm font-medium hidden sm:inline">· Perfumaria</span>
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link href="/pt/diagnostico?area=6&fromArea=perfumaria" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden md:inline">
              Fazer diagnóstico
            </Link>
            <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden md:inline">
              Filosofia
            </Link>
            <Link href="/pt/sobre" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden md:inline">
              Sobre
            </Link>
            <Link href="/pt/profissionais" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden lg:inline">
              Profissionais
            </Link>
            <Link href="/pt/como-funciona" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden lg:inline">
              Como funciona
            </Link>
            <Link href="/pt/precos" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden lg:inline">
              Preços
            </Link>
            <Link href="/pt/perfumaria/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Entrar
            </Link>
            <Link
              href="/pt/cadastro?area=perfumaria"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              Começar grátis
            </Link>
          </nav>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <section className="py-10 sm:py-14 lg:py-16 bg-gradient-to-b from-sky-50 to-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-1">
            <h1 className="text-center mb-8">
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-2">
                Mostra produtos, mas não vende?
              </span>
              <span className="block text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 leading-snug">
                Aprenda a se posicionar e atrair
                <br className="hidden sm:block" />
                <span className="sm:inline"> os clientes certos.</span>
              </span>
            </h1>
            <div className="flex justify-center mb-8">
              <button
                type="button"
                onClick={() => document.getElementById('quiz-diagnostico')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl text-base sm:text-lg"
              >
                Descubra seu perfil de marketing em 30 segundos.
              </button>
            </div>

            <div id="quiz-diagnostico" className="max-w-xl mx-auto mb-8 rounded-2xl bg-white border-2 border-gray-200 shadow-lg shadow-gray-200/50 scroll-mt-8 overflow-hidden">
              <div className="bg-blue-600 px-6 py-3 text-center">
                <p className="text-white font-semibold text-sm sm:text-base">
                  Selecione o que está acontecendo com você agora
                </p>
              </div>
              <div className="p-6 sm:p-8">
                <p className="text-sm font-semibold text-gray-700 mb-3">Qual é o seu caso?</p>
                <p className="font-semibold text-gray-900 mb-4">Seu marketing hoje atrai mais:</p>
                <div className="space-y-2 mb-6">
                  {[
                    { label: 'Clientes pedindo indicação sem demonstrar interesse de compra', value: 0 },
                    { label: 'Conversas que não viram venda', value: 1 },
                    { label: 'Clientes realmente preparados para comprar', value: 2 },
                    { label: 'Não tenho certeza', value: 3 },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border-2 ${
                        respostaHeroIdx === opt.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:border-gray-300'
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
                        {respostaHeroIdx === opt.value && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                      </span>
                      <span className="text-gray-800">{opt.label}</span>
                    </label>
                  ))}
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-4">
                  Selecione uma opção e veja seu perfil em 1 minuto.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      if (respostaHeroIdx !== null) {
                        const problemaValue = PERGUNTA_HERO_VALUES[respostaHeroIdx] ?? 1
                        router.push(`/pt/diagnostico?fromHome=1&area=6&fromArea=perfumaria&problema=${problemaValue}`)
                      }
                    }}
                    disabled={respostaHeroIdx === null}
                    className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-base"
                  >
                    {respostaHeroIdx !== null ? 'Fazer meu diagnóstico' : 'Selecione uma opção acima'}
                  </button>
                  <Link
                    href="/pt/cadastro?area=perfumaria"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white text-gray-700 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all"
                  >
                    Criar meu diagnóstico
                  </Link>
                </div>
                <p className="text-xs text-gray-500 text-center mt-3">+3.000 profissionais já testaram</p>
              </div>
            </div>
          </div>
        </section>

        <DemoCarouselYLADA initialArea="perfumaria" />

        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              A maioria dos consultores de perfumaria explica demais antes da primeira conversa.
            </h2>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Clientes pedindo indicação sem demonstrar interesse de compra</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Conversas que não viram venda</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Clientes que não entendem o valor da indicação</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Profissionais que precisam convencer o tempo todo</span>
              </li>
            </ul>
            <p className="text-lg font-semibold text-gray-900 text-center mb-8">
              O problema raramente é seu conhecimento.<br />
              É a forma como o cliente chega até você — e por que a conversa não vira venda.
            </p>
            <p className="text-gray-500 text-sm text-center">
              Muitos profissionais investem em cursos e marketing. Mas ignoram um fator essencial: como o cliente entende a própria necessidade antes da conversa.
            </p>
          </div>
        </section>

        <section className="py-10 sm:py-14 bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto text-center px-4">
            <div className="bg-gray-900 text-white rounded-2xl p-8 sm:p-10">
              <p className="text-base sm:text-lg text-gray-300 mb-3">Explicar demais não cria clientes.</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                Boas conversas começam com boas perguntas.
              </p>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-gray-50/50">
              <Image
                src="/images/ylada/marketing-tradicional-vs-ylada-funil.png"
                alt="Comparação: Funil tradicional vs Funil de diagnóstico YLADA. Boas conversas começam com boas perguntas."
                width={900}
                height={600}
                className="w-full h-auto"
                priority
                sizes="(max-width: 768px) 100vw, 900px"
              />
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-8">Como funciona</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto px-4">
            {HOW_IT_WORKS_PERFUMARIA.map((item, i) => (
              <div key={i} className="text-center bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="text-4xl mb-3" aria-hidden>{['🌸', '🔗', '💬', '🤝'][i]}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pt/metodo-ylada" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Conhecer a filosofia YLADA →
            </Link>
          </div>
        </section>

        <section className="bg-gray-50 py-10 sm:py-14 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              O que acontece quando alguém responde um diagnóstico
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Quando uma pessoa responde perguntas sobre preferências, ocasiões ou perfil olfativo, ela começa a entender o que busca antes da conversa.
            </p>
            <div className="flex flex-col items-center gap-2 py-6 px-6 bg-white rounded-xl border border-gray-100 max-w-xs mx-auto shadow-sm">
              <span className="text-sm font-semibold text-gray-800">Perguntas</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">Reflexão</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">Clareza</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">Conversa</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-bold text-gray-900">Cliente / Venda</span>
            </div>
            <p className="text-lg font-semibold text-gray-900 mt-6">
              Quando o cliente entende o que busca, a conversa e a venda mudam.
            </p>
          </div>
        </section>

        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
              Exemplos de diagnósticos para perfumaria
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {EXEMPLOS_PERFUMARIA.map((ex, i) => (
                <Link
                  key={i}
                  href={ex.href}
                  className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <p className="font-medium text-gray-900">{ex.titulo}</p>
                  <span className="text-blue-600 text-sm mt-2 inline-block">Testar diagnóstico →</span>
                </Link>
              ))}
            </div>
            <p className="text-center text-gray-600 text-sm">
              Esses são exemplos de diagnósticos que consultores de perfumaria podem criar com YLADA.
            </p>
          </div>
        </section>

        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Consultores de perfumaria usam diagnósticos para:
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center justify-center gap-2">
                <span className="text-green-600">✔</span>
                <span>atrair clientes mais interessados em fragrâncias ideais</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="text-green-600">✔</span>
                <span>evitar conversas que não viram venda</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="text-green-600">✔</span>
                <span>explicar valor da indicação com mais facilidade</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="text-green-600">✔</span>
                <span>transformar curiosidade em decisão de compra</span>
              </li>
            </ul>
          </div>
        </section>

        <YladaProfissionaisGridSection locale={locale} highlightCodigo="perfumaria" />

        <section className="bg-sky-50 py-12 sm:py-16 border-y border-sky-100">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Comece grátis
            </h2>
            <p className="text-gray-600 mb-6">Comece grátis e teste com clientes reais.</p>
            <Link
              href="/pt/cadastro?area=perfumaria"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
            >
              Criar meu primeiro diagnóstico grátis
            </Link>
          </div>
        </section>

        <section className="bg-[#1e3a8a] py-16 sm:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
              Crie um diagnóstico, compartilhe o link e atraia clientes certos para seu WhatsApp.
            </h2>
            <p className="text-white/90 text-base sm:text-lg mb-8 max-w-xl mx-auto">
              Em vez de explicar e convencer, deixe o cliente chegar já entendendo o que busca — e feche mais vendas.
            </p>
            <Link
              href="/pt/cadastro?area=perfumaria"
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-[#1e3a8a] font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
            >
              Criar meu primeiro diagnóstico grátis
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white mt-10 sm:mt-16">
        <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:py-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <YLADALogo size="lg" className="bg-transparent" />
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-6 text-sm">
              <Link href="/pt/diagnostico?area=6&fromArea=perfumaria" className="text-gray-600 hover:text-gray-900">Fazer diagnóstico</Link>
              <Link href="/pt/diagnosticos" className="text-gray-600 hover:text-gray-900">Biblioteca de diagnósticos</Link>
              <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900">Filosofia</Link>
              <Link href="/pt/sobre" className="text-gray-600 hover:text-gray-900">Sobre</Link>
              <Link href="/pt/profissionais" className="text-gray-600 hover:text-gray-900">Profissionais</Link>
              <Link href="/pt/como-funciona" className="text-gray-600 hover:text-gray-900">Como funciona</Link>
              <Link href="/pt/precos" className="text-gray-600 hover:text-gray-900">Preços</Link>
              <Link href="/pt/perfumaria/login" className="text-gray-600 hover:text-gray-900">Entrar</Link>
              <Link href="/pt/cadastro?area=perfumaria" className="text-blue-600 hover:text-blue-700 font-medium">Criar diagnóstico</Link>
            </nav>
            <p className="text-gray-600 text-sm mb-4">Plataforma de diagnósticos para iniciar conversas com contexto.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-4 text-sm text-gray-500">
              <Link href="/pt/politica-de-privacidade" className="hover:text-gray-700">Privacidade</Link>
              <span aria-hidden>•</span>
              <Link href="/pt/termos-de-uso" className="hover:text-gray-700">Termos</Link>
              <span aria-hidden>•</span>
              <Link href="/pt/politica-de-cookies" className="hover:text-gray-700">Cookies</Link>
              <span aria-hidden>•</span>
              <Link href="/pt/politica-de-reembolso" className="hover:text-gray-700">Reembolso</Link>
            </div>
            <p className="text-gray-500 text-xs">© {new Date().getFullYear()} YLADA</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
