'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

/**
 * Landing YLADA para Coaches de bem-estar.
 * Segmento novo, separado de Wellness (Herbalife).
 * Fluxo: institucional → /pt/coach-bem-estar (esta página) → CTA Começar → /pt/coach-bem-estar/login
 * Se já logado, redireciona para /pt/coach-bem-estar/home (que leva à plataforma wellness).
 */
export default function CoachBemEstarLandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || loading) return
    if (user) {
      router.replace('/pt/coach-bem-estar/home')
    }
  }, [mounted, loading, user, router])

  if (loading || (mounted && user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-emerald-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-14 sm:h-16 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/pt" className="flex items-center gap-2">
              <span className="font-bold text-gray-900">YLADA</span>
              <span className="text-gray-500 text-sm">· Coach de bem-estar</span>
            </Link>
            <span className="hidden sm:inline text-xs text-gray-400 border-l border-gray-200 pl-3">
              Parte da plataforma YLADA
            </span>
          </div>
          <Link
            href="/pt/coach-bem-estar/login"
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main>
        {/* 1️⃣ HERO */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                YLADA para Coaches de bem-estar
              </h1>
              <p className="text-lg sm:text-xl text-gray-700 mb-4">
                Inicie conversas com pessoas que já demonstraram interesse em bem-estar.
              </p>
              <p className="text-base sm:text-lg text-gray-600 mb-8">
                Avaliações rápidas antes da conversa. Menos curiosos, mais clientes engajados.
              </p>
              <Link
                href="/pt/coach-bem-estar/login"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-emerald-600 text-white font-semibold text-lg hover:bg-emerald-700 transition-colors shadow-lg"
              >
                Começar
                <span className="ml-2" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 2️⃣ PROBLEMA */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                Coaches de bem-estar enfrentam três dificuldades comuns
              </h2>
              <ul className="space-y-4 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0">•</span>
                  <span>Curiosos pedindo informação sem intenção real de transformação</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0">•</span>
                  <span>Pessoas que somem depois da conversa inicial</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold shrink-0">•</span>
                  <span>Dificuldade em qualificar leads e entender o momento de cada pessoa</span>
                </li>
              </ul>
              <p className="text-center text-gray-600 mt-8 font-medium">
                Isso consome tempo e energia.
              </p>
            </div>
          </div>
        </section>

        {/* 3️⃣ SOLUÇÃO */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                O YLADA ajuda você a iniciar conversas com contexto
              </h2>
              <p className="text-lg text-gray-700 mb-6 text-center">
                A pessoa responde uma avaliação rápida antes da conversa. Assim você entende interesses, necessidades e o momento da pessoa em relação ao bem-estar.
              </p>
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <p className="text-gray-700 text-center">
                  Menos curiosos. Mais conversas que evoluem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4️⃣ COMO FUNCIONA */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 text-center">
                Como funciona
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: '1', title: 'Escolha uma avaliação', desc: 'Quizzes e diagnósticos prontos para bem-estar.' },
                  { step: '2', title: 'Compartilhe o link', desc: 'Use em redes sociais, WhatsApp ou site.' },
                  { step: '3', title: 'A pessoa responde', desc: 'O sistema revela interesses e necessidades.' },
                  { step: '4', title: 'Conversa com contexto', desc: 'Você fala com quem realmente quer transformação.' },
                ].map((item) => (
                  <div key={item.step} className="text-center p-4">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 font-bold text-lg mb-3">
                      {item.step}
                    </span>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5️⃣ EXEMPLOS DE AVALIAÇÕES */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                Avaliações usadas por coaches de bem-estar
              </h2>
              <p className="text-gray-700 mb-6 text-center">
                Coaches usam avaliações como:
              </p>
              <ul className="space-y-3 text-gray-700 mb-6">
                {[
                  'Descubra seu perfil de bem-estar',
                  'Como está seu nível de energia?',
                  'Você está pronto para mudar hábitos?',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-emerald-600 font-bold shrink-0">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-gray-600 text-center text-sm">
                Essas avaliações ajudam a iniciar conversas relevantes.
              </p>
            </div>
          </div>
        </section>

        {/* 6️⃣ BENEFÍCIOS */}
        <section className="py-12 sm:py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 text-center">
                Quando a conversa começa com contexto, tudo muda
              </h2>
              <ul className="space-y-4">
                {[
                  'Menos curiosos',
                  'Menos tempo explicando no WhatsApp',
                  'Mais clareza na conversa',
                  'Mais segurança profissional',
                  'Mais autoridade',
                ].map((benefit) => (
                  <li key={benefit} className="flex items-center gap-3 text-gray-700">
                    <span className="text-green-600 font-bold">✔</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 7️⃣ CTA FINAL */}
        <section className="py-14 sm:py-20 bg-emerald-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Comece a usar o YLADA como coach de bem-estar
              </h2>
              <p className="text-emerald-100 mb-8">
                Crie seu primeiro link em minutos.
              </p>
              <Link
                href="/pt/coach-bem-estar/login"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-emerald-600 font-semibold text-lg hover:bg-emerald-50 transition-colors shadow-lg"
              >
                Criar meu primeiro link
                <span className="ml-2" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="container mx-auto px-4 text-center">
          <Link href="/pt" className="text-gray-600 hover:text-gray-900 text-sm">
            ← Voltar à página inicial
          </Link>
          <p className="text-gray-500 text-xs mt-4">YLADA · Coach de bem-estar · {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  )
}
