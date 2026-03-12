'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'
import { useAuth } from '@/contexts/AuthContext'
import { YLADA_LANDING_AREAS } from '@/config/ylada-landing-areas'

const EXEMPLOS_DIAGNOSTICOS = [
  { titulo: 'O que está travando o crescimento do seu negócio?', href: '/pt/diagnostico' },
  { titulo: 'Seu posicionamento transmite autoridade?', href: '/pt/diagnostico/autoridade' },
  { titulo: 'Por que sua agenda não enche como poderia?', href: '/pt/diagnostico/agenda' },
  { titulo: 'Seu conteúdo atrai clientes ou apenas engajamento?', href: '/pt/diagnostico/conteudo' },
]

export default function InstitutionalPageContent() {
  const { t } = useTranslations('pt')
  const inst = t?.institutional
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isInstitutionalPage = pathname === '/pt' || pathname === '/pt/'

  useEffect(() => {
    if (loading) return
    if (!pathname || !isInstitutionalPage) return
    if (user) {
      router.replace('/pt/home')
    }
  }, [loading, user, pathname, router, isInstitutionalPage])

  const [authTimeout, setAuthTimeout] = useState(false)
  useEffect(() => {
    const id = setTimeout(() => setAuthTimeout(true), 2000)
    return () => clearTimeout(id)
  }, [])

  if (!inst) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  const showAuthLoading = loading && isInstitutionalPage && !authTimeout
  if (showAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  if (user && isInstitutionalPage) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Redirecionando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm min-h-14 sm:min-h-[4.5rem] flex items-center safe-area-inset-top">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between">
          <Link href="/pt" className="flex-shrink-0 touch-manipulation" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link href="/pt/diagnostico" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden md:inline">
              Fazer diagnóstico
            </Link>
            <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden md:inline">
              Método
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
            <Link href="/pt/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Entrar
            </Link>
            <Link
              href="/pt/escolha-perfil"
              className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              Criar diagnóstico
            </Link>
            <LanguageSelector />
          </nav>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Hero — Proposta de geração de conversa */}
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              Seu marketing atrai curiosos ou clientes prontos para contratar?
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Descubra em poucos minutos se sua comunicação profissional está realmente atraindo as pessoas certas.
            </p>
            <p className="text-lg font-semibold text-gray-900 mb-4 text-left">
              Você vai descobrir:
            </p>
            <ul className="text-left space-y-2 mb-8 max-w-xl mx-auto">
              <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Se seu marketing atrai curiosos ou clientes preparados</li>
              <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Por que algumas conversas não avançam</li>
              <li className="flex items-center gap-2"><span className="text-green-600">✔</span> Como profissionais usam diagnósticos para atrair clientes melhores</li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <Link
                href="/pt/diagnostico"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
              >
                Fazer diagnóstico
              </Link>
              <Link
                href="/pt/metodo-ylada"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all"
              >
                Entender o método
              </Link>
            </div>
            <p className="text-sm text-gray-500">
              7 perguntas • menos de 1 minuto
            </p>
          </div>
        </section>

        {/* 2. O problema */}
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
                <span>Clientes que não entendem o valor do serviço</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1">•</span>
                <span>Profissionais que precisam convencer o tempo todo</span>
              </li>
            </ul>
            <p className="text-lg font-semibold text-gray-900 text-center">
              O problema não é seu conhecimento. É a forma como o cliente chega até você.
            </p>
          </div>
        </section>

        {/* 2b. Narrativa investimento */}
        <section className="py-8 sm:py-12">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-700 mb-4">
              Muitos profissionais investem constantemente em crescimento:
            </p>
            <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-600 text-sm mb-4">
              <li>cursos</li>
              <li>equipamentos</li>
              <li>ferramentas</li>
              <li>marketing</li>
            </ul>
            <p className="text-gray-800 font-medium">
              Mas um fator muitas vezes é ignorado:{' '}
              <span className="text-blue-600">como os clientes entendem o próprio problema antes da conversa.</span>
            </p>
            <p className="text-gray-600 text-sm mt-2">
              É exatamente isso que os diagnósticos ajudam a resolver.
            </p>
          </div>
        </section>

        {/* 3. Como funciona */}
        <section className="py-12 sm:py-16 lg:py-20">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            Como funciona
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { emoji: '🧠', titulo: 'Criar diagnóstico', desc: 'Transforme seu conhecimento em perguntas que revelam o problema do cliente.' },
              { emoji: '🔗', titulo: 'Compartilhar link', desc: 'Envie nas redes sociais, WhatsApp ou anúncios.' },
              { emoji: '📊', titulo: 'Receber respostas', desc: 'Veja quem respondeu e entenda melhor cada situação.' },
              { emoji: '🤝', titulo: 'Converter clientes', desc: 'O cliente já chega preparado, mais decidido e escolhe você com confiança.' },
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
              href="/pt/metodo-ylada"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Conhecer o método YLADA →
            </Link>
          </div>
        </section>

        {/* 4. O que acontece depois do diagnóstico */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="max-w-2xl mx-auto">
            <p className="text-center text-gray-700 font-medium mb-6">
              Mais de 80% dos profissionais descobrem no diagnóstico que o problema não é competência — é posicionamento.
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-2">
              O que acontece depois do diagnóstico
            </h2>
            <p className="text-gray-600 text-center mb-10">
              Em poucos minutos você recebe um resultado claro e entende qual é o próximo passo.
            </p>
            <div className="space-y-6 mb-10">
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">1</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Você descobre seu perfil</h3>
                  <p className="text-gray-600 text-sm">O diagnóstico identifica como sua comunicação profissional está funcionando hoje.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">2</span>
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
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">3</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Você vê como melhorar</h3>
                  <p className="text-gray-600 text-sm">O diagnóstico mostra o caminho que profissionais usam para atrair clientes mais preparados.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">4</span>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Você pode aplicar isso no seu negócio</h3>
                  <p className="text-gray-600 text-sm">Se fizer sentido para você, o YLADA permite criar seus próprios diagnósticos e aplicar esse método com seus clientes.</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <Link
                href="/pt/diagnostico"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
              >
                Fazer diagnóstico agora
              </Link>
            </div>
          </div>
        </section>

        {/* 6. Exemplos de diagnósticos */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
              Exemplos de diagnósticos
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {EXEMPLOS_DIAGNOSTICOS.map((ex) => (
                <Link
                  key={ex.titulo}
                  href={ex.href}
                  className="block bg-white rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <p className="font-medium text-gray-900">{ex.titulo}</p>
                  <span className="text-blue-600 text-sm mt-2 inline-block">Fazer diagnóstico →</span>
                </Link>
              ))}
            </div>
            <p className="text-center text-gray-600 text-sm">
              Esses são exemplos de diagnósticos que profissionais podem criar com YLADA.
            </p>
          </div>
        </section>

        {/* 6b. Profissionais usam diagnósticos para */}
        <section className="py-8 sm:py-12">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-sm font-semibold text-gray-800 mb-4">Profissionais usam diagnósticos para:</p>
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

        {/* 7. Para quais profissionais o YLADA foi criado */}
        <section className="py-12 sm:py-16 lg:py-20">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
            Para quais profissionais o YLADA foi criado
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Profissionais e vendedores consultivos usam diagnósticos para atrair clientes mais preparados.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            {YLADA_LANDING_AREAS.map((area) => (
              <Link
                key={area.codigo}
                href={area.href}
                className="block bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center"
              >
                <span className="font-semibold text-gray-900 block mb-1">{area.label}</span>
                <span className="text-sm text-gray-600">{area.slogan}</span>
              </Link>
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/pt/profissionais"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
            >
              Ver todas as áreas
            </Link>
          </div>
        </section>

        {/* 8. CTA final */}
        <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-16 sm:py-20 rounded-2xl">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 leading-tight">
              Transforme seu conhecimento em diagnósticos que atraem clientes
            </h2>
            <p className="text-lg text-blue-100 mb-10 leading-relaxed">
              Com o YLADA você pode criar diagnósticos estratégicos que ajudam seus clientes a entender melhor seus próprios problemas — antes mesmo da primeira conversa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pt/diagnostico"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg"
              >
                Descobrir meu perfil de comunicação
              </Link>
              <Link
                href="/pt/escolha-perfil"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Criar meus diagnósticos
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Rodapé */}
      <footer className="border-t border-gray-200 bg-white mt-10 sm:mt-16">
        <div className="w-full max-w-7xl mx-auto px-4 py-8 sm:py-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-6">
              <YLADALogo size="lg" className="bg-transparent" />
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-6 text-sm">
              <Link href="/pt/diagnostico" className="text-gray-600 hover:text-gray-900">
                Fazer diagnóstico
              </Link>
              <Link href="/pt/diagnosticos" className="text-gray-600 hover:text-gray-900">
                Biblioteca de diagnósticos
              </Link>
              <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900">
                Método
              </Link>
              <Link href="/pt/profissionais" className="text-gray-600 hover:text-gray-900">
                Profissionais
              </Link>
              <Link href="/pt/como-funciona" className="text-gray-600 hover:text-gray-900">
                Como funciona
              </Link>
              <Link href="/pt/precos" className="text-gray-600 hover:text-gray-900">
                Preços
              </Link>
              <Link href="/pt/login" className="text-gray-600 hover:text-gray-900">
                Entrar
              </Link>
              <Link href="/pt/escolha-perfil" className="text-blue-600 hover:text-blue-700 font-medium">
                Criar diagnóstico
              </Link>
            </nav>
            <p className="text-gray-600 text-sm mb-4">{inst.footer.tagline}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-4 text-sm text-gray-500">
              <Link href="/pt/politica-de-privacidade" className="hover:text-gray-700">
                {inst.footer.privacy}
              </Link>
              <span aria-hidden>•</span>
              <Link href="/pt/termos-de-uso" className="hover:text-gray-700">
                {inst.footer.terms}
              </Link>
              <span aria-hidden>•</span>
              <Link href="/pt/politica-de-cookies" className="hover:text-gray-700">
                {inst.footer.cookies}
              </Link>
              <span aria-hidden>•</span>
              <Link href="/pt/politica-de-reembolso" className="hover:text-gray-700">
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
