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
  buildPortaEntradaUrlWithReferral,
  buildSignupUrlWithReferral,
  parseReferralParams,
  type ReferralSource,
} from '@/lib/referrals/referral-url'
import { persistReferral, trackReferralLanding } from '@/lib/referrals/referral-client'
import { isNoelDiretoEnabled } from '@/lib/porta-unica/porta-unica-flag'
import { PORTA_START_DESAFIO } from '@/lib/referrals/referral-url'

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
  const [ref, setRef] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : parseReferralParams(window.location.search).ref,
  )
  const [source, setSource] = useState<ReferralSource>(() =>
    typeof window === 'undefined'
      ? 'diagnostico'
      : parseReferralParams(window.location.search).source,
  )

  useEffect(() => {
    const parsed = parseReferralParams(window.location.search)
    setRef(parsed.ref)
    setSource(parsed.source)
    persistReferral(parsed.ref, parsed.source)
    void trackReferralLanding(parsed.ref, parsed.source)
  }, [])

  // /criar é Porta 2 (loop): pessoa já tem contexto (fez um diagnóstico), não precisa do
  // hero. Pula a Tela1 e vai direto pro desafio (?start=desafio) → devolutiva → cadastro.
  // Nunca manda pra /pt (CATEGORIA é pra tráfego frio; loop vai pra /descubra com start).
  const signupUrl = useMemo(() => {
    if (isNoelDiretoEnabled()) {
      return buildPortaEntradaUrlWithReferral({
        code: ref,
        destino: 'descubra',
        source,
        start: PORTA_START_DESAFIO,
      })
    }
    return buildSignupUrlWithReferral({ code: ref })
  }, [ref, source])
  const copy = HEADLINES[source]
  const ctaLabel = isNoelDiretoEnabled() ? 'Começar' : 'Criar minha conta'

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
