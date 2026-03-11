'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'
import { useAuth } from '@/contexts/AuthContext'
const AREAS_HOME = [
  { label: 'Nutricionistas', href: '/pt/nutri' },
  { label: 'Psicólogos', href: '/pt/psi' },
  { label: 'Estética', href: '/pt/estetica' },
  { label: 'Odontologia', href: '/pt/odonto' },
  { label: 'Fitness', href: '/pt/fitness' },
  { label: 'Bem-estar', href: '/pt/coach-bem-estar' },
  { label: 'Coaches', href: '/pt/coach' },
]

const EXEMPLOS_DIAGNOSTICOS = [
  { titulo: 'Descubra por que você não consegue emagrecer', href: '/pt/diagnostico' },
  { titulo: 'Seu marketing atrai curiosos ou clientes?', href: '/pt/diagnostico' },
  { titulo: 'Seu intestino está funcionando bem?', href: '/pt/diagnostico' },
  { titulo: 'Seu nível de energia está ideal?', href: '/pt/diagnostico' },
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
            <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden md:inline">
              Método
            </Link>
            <Link href="/pt/diagnostico" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden md:inline">
              Diagnóstico
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
              Começar agora
            </Link>
            <LanguageSelector />
          </nav>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. Hero */}
        <section className="py-12 sm:py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              E se seus clientes entendessem o valor do seu trabalho antes mesmo de falar com você?
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              A maioria dos profissionais precisa explicar demais o que faz. O método YLADA usa diagnósticos para que o próprio cliente descubra o problema antes da conversa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pt/diagnostico"
                className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
              >
                Testar diagnóstico
              </Link>
              <Link
                href="/pt/metodo-ylada"
                className="inline-flex items-center justify-center min-h-[48px] px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
              >
                Entender o método
              </Link>
            </div>
          </div>
        </section>

        {/* 2. O problema atual */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              O marketing tradicional atrai curiosos
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

        {/* 3. A nova abordagem */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6">
              E se o cliente descobrisse o problema antes da conversa?
            </h2>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              Quando o cliente responde um diagnóstico, ele começa a entender sua própria situação. Isso muda completamente a qualidade da conversa.
            </p>
            <ul className="space-y-2 text-gray-700 font-medium">
              <li className="flex items-center justify-center gap-2">
                <span className="text-green-600">✓</span> Mais clareza
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="text-green-600">✓</span> Mais autoridade
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="text-green-600">✓</span> Mais clientes preparados para contratar
              </li>
            </ul>
          </div>
        </section>

        {/* 4. O método YLADA */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
              O método YLADA
            </h2>
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {[
                { num: 1, titulo: 'Diagnóstico', desc: 'O cliente descobre algo sobre sua situação.' },
                { num: 2, titulo: 'Clareza', desc: 'Ele entende melhor o problema.' },
                { num: 3, titulo: 'Conversa estratégica', desc: 'O profissional entra na conversa com muito mais autoridade.' },
                { num: 4, titulo: 'Decisão', desc: 'A contratação acontece com menos esforço.' },
              ].map((item) => (
                <div key={item.num} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-3">
                    {item.num}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.titulo}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/pt/metodo-ylada"
                className="inline-flex items-center justify-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
              >
                Conhecer o método YLADA
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Como funciona na prática */}
        <section className="py-12 sm:py-16 lg:py-20">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            Como profissionais usam o YLADA
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { passo: 1, titulo: 'Criar um diagnóstico' },
              { passo: 2, titulo: 'Compartilhar o link' },
              { passo: 3, titulo: 'Receber respostas e contatos' },
              { passo: 4, titulo: 'Converter clientes com mais facilidade' },
            ].map((item) => (
              <div key={item.passo} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center mx-auto mb-3">
                  {item.passo}
                </div>
                <h3 className="font-semibold text-gray-900">{item.titulo}</h3>
              </div>
            ))}
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
                  <span className="text-blue-600 text-sm mt-2 inline-block">Testar →</span>
                </Link>
              ))}
            </div>
            <p className="text-center text-gray-600 text-sm">
              Esses são exemplos de diagnósticos que profissionais podem criar com YLADA.
            </p>
          </div>
        </section>

        {/* 7. Para quais profissionais */}
        <section className="py-12 sm:py-16 lg:py-20">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
            Para quais profissionais
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            {AREAS_HOME.map((area) => (
              <Link
                key={area.href}
                href={area.href}
                className="block bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center font-medium text-gray-900"
              >
                {area.label}
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
                Testar diagnóstico
              </Link>
              <Link
                href="/pt/escolha-perfil"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                Começar com YLADA
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
              <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900">
                Método
              </Link>
              <Link href="/pt/diagnostico" className="text-gray-600 hover:text-gray-900">
                Diagnóstico
              </Link>
              <Link href="/pt/como-funciona" className="text-gray-600 hover:text-gray-900">
                Como funciona
              </Link>
              <Link href="/pt/precos" className="text-gray-600 hover:text-gray-900">
                Preços
              </Link>
              <Link href="/pt/profissionais" className="text-gray-600 hover:text-gray-900">
                Profissionais
              </Link>
              <Link href="/pt/login" className="text-gray-600 hover:text-gray-900">
                Login
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
