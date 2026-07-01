'use client'

/**
 * Página dedicada do Caminho B do loop (Spec_Loop_KFactor §5.2).
 * "Você acabou de fazer um diagnóstico. Crie o seu em minutos."
 * Lê e preserva o ?ref até o cadastro existente; serve duas origens (diagnóstico/conteúdo).
 * Página existe independente da flag; o selo só aponta pra cá quando a flag está ON.
 */
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  buildSignupUrlWithReferral,
  parseReferralParams,
  type ReferralSource,
} from '@/lib/referrals/referral-url'
import { persistReferral, trackReferralLanding } from '@/lib/referrals/referral-client'

const HEADLINES: Record<ReferralSource, { titulo: string; sub: string }> = {
  diagnostico: {
    titulo: 'Você acabou de fazer um diagnóstico. Crie o seu.',
    sub: 'A mesma ferramenta que te entregou essa análise pode trabalhar pelo seu negócio. Monte o seu em minutos.',
  },
  conteudo: {
    titulo: 'Crie diagnósticos que iniciam a conversa por você.',
    sub: 'Atraia clientes mais preparados com perguntas que revelam o problema antes de qualquer oferta. Comece em minutos.',
  },
}

export default function CriarPage() {
  const [ref, setRef] = useState<string | null>(null)
  const [source, setSource] = useState<ReferralSource>('diagnostico')

  useEffect(() => {
    const parsed = parseReferralParams(window.location.search)
    setRef(parsed.ref)
    setSource(parsed.source)
    persistReferral(parsed.ref, parsed.source)
    void trackReferralLanding(parsed.ref, parsed.source)
  }, [])

  // /criar é Porta 2 (loop) — a pessoa já fez um diagnóstico, não precisa do hero.
  // Vai direto pro cadastro preservando o ?ref. Nunca passa pela Porta 1 (evita duplo clique).
  const signupUrl = useMemo(() => buildSignupUrlWithReferral({ code: ref }), [ref])
  const copy = HEADLINES[source]
  const ctaLabel = 'Criar minha conta'

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-sky-600 mb-3">YLADA</p>
        <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-3">{copy.titulo}</h1>
        <p className="text-base text-gray-600 leading-relaxed mb-8">{copy.sub}</p>
        <Link
          href={signupUrl}
          className="inline-flex w-full items-center justify-center rounded-xl bg-sky-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-sky-700"
        >
          {ctaLabel}
        </Link>
        <p className="mt-4 text-sm text-gray-500">
          Já tem conta?{' '}
          <Link href="/entrar" className="font-medium text-sky-600 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
