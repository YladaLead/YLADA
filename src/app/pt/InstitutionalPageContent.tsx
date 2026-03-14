'use client'

/**
 * BLUEPRINT VISUAL – HOME YLADA
 * Ordem: HEADER → HERO → PROBLEMA → METÁFORA MÉDICA → FUNIL DE DIAGNÓSTICO → PRINCÍPIO VISUAL → EXEMPLOS → BENEFÍCIOS → COMO FUNCIONA → ÁREAS → O QUE ACONTECE → CTA → FOOTER
 * Objetivo: levar o visitante a fazer o diagnóstico. Posicionamento: plataforma de preparação de conversas (funil de diagnóstico).
 */

import { useState, useEffect } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import YLADALogo from '@/components/YLADALogo'
import LanguageSelector from '@/components/LanguageSelector'
import Link from 'next/link'
import { useTranslations } from '@/hooks/useTranslations'
import { useAuth } from '@/contexts/AuthContext'
import { YLADA_LANDING_AREAS } from '@/config/ylada-landing-areas'

const PERGUNTA_HERO_OPCOES = [
  { value: 2, label: 'pergunta o preço logo no início' },
  { value: 1, label: 'pede mais informações mas não decide' },
  { value: 0, label: 'já chega entendendo o valor' },
  { value: 1, label: 'depende muito da pessoa' },
]

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

  const searchParams = useSearchParams()
  const isInstitutionalPage = pathname === '/pt' || pathname === '/pt/'
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

  if (!inst) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  const showAuthLoading = loading && isInstitutionalPage && !authTimeout && !forceLanding
  if (showAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Carregando...</p>
      </div>
    )
  }

  if (user && isInstitutionalPage && !forceLanding) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <p className="text-gray-500">Redirecionando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 1️⃣ HEADER — 72px, fundo branco */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-[72px] flex items-center safe-area-inset-top">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
          <Link href="/pt" className="flex-shrink-0 touch-manipulation" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link href="/pt/diagnostico" className="text-gray-600 hover:text-gray-900 text-sm font-medium hidden md:inline">
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
            <Link href="/pt/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Entrar
            </Link>
            <Link
              href="/pt/diagnostico"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-all"
            >
              Descobrir meu perfil
            </Link>
            <LanguageSelector />
          </nav>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2️⃣ HERO — Pergunta alinhada com título (curiosos vs clientes preparados) */}
        <section className="py-12 sm:py-16 lg:py-20 bg-[#f8fafc] border-b border-gray-200">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight text-center">
              Seu marketing atrai curiosos ou clientes prontos para contratar?
            </h1>
            <p className="text-lg sm:text-xl text-gray-800 font-semibold mb-3 text-center">
              Boas conversas começam com boas perguntas.
            </p>
            <p className="text-base sm:text-lg text-gray-600 mb-4 text-center leading-relaxed">
              Descubra em menos de 1 minuto se sua comunicação profissional está realmente atraindo pessoas interessadas.
            </p>
            <p className="text-base text-gray-700 font-medium mb-6 text-center">
              YLADA usa diagnósticos inteligentes para transformar curiosidade em conversas com clientes.
            </p>

            <div className="bg-white rounded-xl p-6 sm:p-8 border border-gray-200 shadow-sm">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Pergunta 1 de 7</p>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2563eb] rounded-full transition-all duration-300"
                    style={{ width: '14.3%' }}
                  />
                </div>
              </div>
              <p className="font-semibold text-gray-900 mb-4">Quando alguém entra em contato com você normalmente:</p>
              <div className="space-y-2 mb-6">
                {PERGUNTA_HERO_OPCOES.map((op, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all border-2 ${
                      respostaHeroIdx === idx
                        ? 'border-[#2563eb] bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="hero"
                      value={idx}
                      checked={respostaHeroIdx === idx}
                      onChange={() => setRespostaHeroIdx(idx)}
                      className="sr-only"
                    />
                    <span className="flex-shrink-0 w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                      {respostaHeroIdx === idx && (
                        <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                      )}
                    </span>
                    <span className="text-gray-800">{op.label}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (respostaHeroIdx !== null) {
                    const problemaValue = PERGUNTA_HERO_OPCOES[respostaHeroIdx].value
                    router.push(`/pt/diagnostico?fromHome=1&problema=${problemaValue}`)
                  }
                }}
                disabled={respostaHeroIdx === null}
                className="block w-full text-center px-6 py-4 bg-[#2563eb] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Descobrir meu perfil
              </button>
            </div>

            <p className="text-gray-500 text-sm mt-4 text-center">
              7 perguntas rápidas • menos de 1 minuto
            </p>
            <p className="text-gray-600 text-sm font-medium mt-1 text-center">
              +3.000 profissionais já testaram
            </p>
          </div>
        </section>

        {/* 2b Duolingo moment — entender o produto em 3 segundos */}
        <section className="py-10 sm:py-14 bg-white border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-6 leading-tight">
              Boas conversas começam com boas perguntas.
            </h2>
            <div className="bg-gray-900 text-white rounded-2xl p-8 sm:p-10 mb-8">
              <p className="text-base sm:text-lg text-gray-300 text-center mb-3">
                Explicar demais não cria clientes.
              </p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center leading-tight">
                Boas conversas começam com boas perguntas.
              </p>
            </div>
            <p className="text-gray-600 text-center mb-8 max-w-xl mx-auto leading-relaxed">
              Antes de iniciar uma conversa, médicos fazem perguntas para entender o problema. Profissionais também podem fazer isso. YLADA transforma conhecimento em diagnósticos que iniciam conversas melhores.
            </p>

            {/* Comparação visual: tradicional vs YLADA */}
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

            {/* Diagrama central */}
            <div className="flex flex-col items-center gap-2 py-6 px-6 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-sm font-semibold text-gray-800">Pergunta</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">Diagnóstico</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">Conversa</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-bold text-gray-900">Cliente</span>
            </div>
          </div>
        </section>

        {/* 3️⃣ PROBLEMA DO MERCADO — Fundo cinza claro */}
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
            <p className="text-gray-800 font-semibold text-center">
              Explicar demais não cria clientes.<br />
              Boas conversas começam com boas perguntas.
            </p>
            <p className="text-gray-500 text-sm text-center mt-6">
              Muitos profissionais investem em cursos, marketing e ferramentas.
              Mas ignoram um fator essencial:
              como o cliente entende o próprio problema antes da conversa.
            </p>
          </div>
        </section>

        {/* 3b A metáfora médica */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
              O marketing tradicional explica. O YLADA pergunta primeiro.
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Antes de indicar um tratamento, médicos fazem perguntas. Eles precisam entender o problema primeiro.
            </p>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Profissionais também podem fazer isso. Em vez de explicar tudo logo no início, o cliente pode primeiro entender o próprio problema. É isso que o diagnóstico faz.
            </p>
            <p className="text-lg font-semibold text-gray-900 text-center">
              Antes do tratamento vem o diagnóstico.<br />
              Antes da venda vem a conversa.
            </p>
          </div>
        </section>

        {/* 3c O funil de diagnóstico YLADA */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
              O funil de diagnóstico YLADA
            </h2>
            <p className="text-gray-600 text-center mb-8 text-sm sm:text-base">
              Não é o funil tradicional de marketing. É um funil que prepara a conversa antes dela acontecer.
            </p>
            <div className="mb-10 flex justify-center">
              <Image
                src="/images/ylada/funil-tradicional-vs-funil-diagnostico-ylada.png"
                alt="Comparação: Funil tradicional de marketing (Atenção, Interesse, Desejo, Ação) versus Funil de diagnóstico YLADA (Curiosidade, Perguntas, Clareza, Conversa, Cliente)"
                width={800}
                height={500}
                className="w-full max-w-2xl h-auto rounded-xl border border-gray-200 shadow-sm"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 border border-red-100">
                <h3 className="font-bold text-gray-900 mb-3 text-center">Marketing tradicional</h3>
                <div className="flex flex-col items-center gap-1 py-4">
                  <span className="text-sm font-medium text-gray-700">Atenção</span>
                  <span className="text-gray-400">↓</span>
                  <span className="text-sm font-medium text-gray-700">Interesse</span>
                  <span className="text-gray-400">↓</span>
                  <span className="text-sm font-medium text-gray-700">Desejo</span>
                  <span className="text-gray-400">↓</span>
                  <span className="text-sm font-medium text-gray-700">Ação</span>
                </div>
                <p className="text-center text-red-600 text-sm font-medium mt-2">Resultado: curiosos e conversas fracas.</p>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-[#2563eb] bg-blue-50/30">
                <h3 className="font-bold text-gray-900 mb-3 text-center">Funil de diagnóstico</h3>
                <div className="flex flex-col items-center gap-1 py-4">
                  <span className="text-sm font-medium text-gray-800">Curiosidade</span>
                  <span className="text-gray-400">↓</span>
                  <span className="text-sm font-medium text-gray-800">Perguntas</span>
                  <span className="text-gray-400">↓</span>
                  <span className="text-sm font-medium text-gray-800">Clareza</span>
                  <span className="text-gray-400">↓</span>
                  <span className="text-sm font-medium text-gray-800">Conversa</span>
                  <span className="text-gray-400">↓</span>
                  <span className="text-sm font-bold text-gray-900">Cliente</span>
                </div>
                <p className="text-center text-[#2563eb] text-sm font-medium mt-2">Resultado: conversas mais preparadas.</p>
              </div>
            </div>
            <p className="text-center text-gray-600 text-sm mt-6 max-w-xl mx-auto">
              CRM organiza conversas depois que elas acontecem. YLADA prepara a conversa antes dela acontecer.
            </p>
          </div>
        </section>

        {/* Princípio visual — bloco forte da frase */}
        <section className="py-10 sm:py-14 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-900 text-white rounded-2xl p-8 sm:p-10 mb-6">
              <p className="text-sm sm:text-base uppercase tracking-wider text-gray-300 mb-2">Explicar · Convencer · Insistir</p>
              <p className="text-base sm:text-lg text-gray-400 mb-4">não funciona.</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                Boas conversas começam com boas perguntas.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2 py-4 px-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-sm font-semibold text-gray-800">Pergunta</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">Diagnóstico</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-semibold text-gray-800">Conversa</span>
              <span className="text-gray-400">↓</span>
              <span className="text-sm font-bold text-gray-900">Cliente</span>
            </div>
          </div>
        </section>

        {/* 4️⃣ EXEMPLOS DE DIAGNÓSTICOS — Grid 2x2 */}
        <section className="py-12 sm:py-16 lg:py-20">
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
                  <span className="text-blue-600 text-sm mt-2 inline-block">Testar diagnóstico →</span>
                </Link>
              ))}
            </div>
            <p className="text-center text-gray-600 text-sm">
              Esses são exemplos de diagnósticos que profissionais podem criar com YLADA.
            </p>
          </div>
        </section>

        {/* 5️⃣ BENEFÍCIOS DO DIAGNÓSTICO — Checklist central */}
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

        {/* 6️⃣ COMO FUNCIONA — 4 cards horizontais */}
        <section className="py-12 sm:py-16 lg:py-20">
          <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-8">
            Como funciona
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { emoji: '🧠', titulo: 'Criar diagnóstico', desc: 'Transforme seu conhecimento em perguntas que revelam o problema do cliente.' },
              { emoji: '🔗', titulo: 'Compartilhar link', desc: 'Envie nas redes sociais, WhatsApp ou anúncios.' },
              { emoji: '📊', titulo: 'Receber respostas', desc: 'Veja quem respondeu e entenda melhor a situação de cada pessoa.' },
              { emoji: '🤝', titulo: 'Iniciar uma conversa mais preparada', desc: 'O cliente chega com mais clareza e a conversa avança com mais facilidade.' },
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
              Conhecer a filosofia YLADA →
            </Link>
          </div>

          {/* Os três motores do YLADA */}
          <div className="mt-12 pt-12 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
              Os três motores do YLADA
            </h3>
            <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center bg-white rounded-xl p-6 border border-gray-200">
                <span className="text-3xl mb-2 block" aria-hidden>🧠</span>
                <h4 className="font-semibold text-gray-900 mb-2">Diagnóstico</h4>
                <p className="text-sm text-gray-600">Diagnósticos despertam curiosidade e atraem pessoas interessadas.</p>
              </div>
              <div className="text-center bg-white rounded-xl p-6 border border-gray-200">
                <span className="text-3xl mb-2 block" aria-hidden>💬</span>
                <h4 className="font-semibold text-gray-900 mb-2">Conversa</h4>
                <p className="text-sm text-gray-600">O cliente chega com mais clareza e a conversa começa melhor.</p>
              </div>
              <div className="text-center bg-white rounded-xl p-6 border border-gray-200">
                <span className="text-3xl mb-2 block" aria-hidden>🚀</span>
                <h4 className="font-semibold text-gray-900 mb-2">Estratégia</h4>
                <p className="text-sm text-gray-600">O Noel ajuda você a melhorar seus diagnósticos e sua comunicação.</p>
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">
              Diagnóstico → Conversa → Estratégia → crescimento
            </p>
          </div>
        </section>

        {/* 7️⃣ ÁREAS — Grid 4x2 */}
        <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-2">
              Para quais profissionais o YLADA foi criado
            </h2>
            <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
              Profissionais e vendedores consultivos usam diagnósticos para atrair clientes mais preparados.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {YLADA_LANDING_AREAS.map((area) => (
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
                href="/pt/profissionais"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
              >
                Ver todas as áreas
              </Link>
            </div>
          </div>
        </section>

        {/* 8️⃣ O QUE ACONTECE DEPOIS — Etapas numeradas (conciso) */}
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
                href="/pt/diagnostico"
                className="inline-flex items-center justify-center px-8 py-4 bg-[#2563eb] text-white font-semibold rounded-xl hover:bg-[#1d4ed8] transition-all"
              >
                Descobrir meu perfil
              </Link>
            </div>
          </div>
        </section>

        {/* 9️⃣ CTA FINAL — Estilo profissional */}
        <section className="bg-[#1e3a8a] py-16 sm:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 leading-tight">
              Verifique agora se você atrai curiosos ou clientes preparados.
            </h2>
            <Link
              href="/pt/diagnostico"
              className="inline-flex items-center justify-center px-10 py-4 bg-white text-[#1e3a8a] font-semibold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
            >
              Descobrir meu perfil
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
              <Link href="/pt/diagnostico" className="text-gray-600 hover:text-gray-900">
                Fazer diagnóstico
              </Link>
              <Link href="/pt/diagnosticos" className="text-gray-600 hover:text-gray-900">
                Biblioteca de diagnósticos
              </Link>
              <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900">
                Filosofia
              </Link>
              <Link href="/pt/sobre" className="text-gray-600 hover:text-gray-900">
                Sobre
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
