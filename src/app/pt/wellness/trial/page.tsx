'use client'

import Link from 'next/link'

/**
 * Página pública de trial/assinatura Wellness.
 * Quem chega aqui (sem link do presidente) vê a mensagem:
 * precisa do link direto do presidente para testar 3 dias ou assinar.
 */
export default function TrialPublicPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="mb-6">
          <span className="text-5xl" aria-hidden>🔗</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Você precisa do link direto do seu presidente
        </h1>
        <p className="text-gray-700 mb-6 leading-relaxed">
          Para testar por 3 dias, assinar ou acessar o Wellness, peça ao seu presidente o{' '}
          <strong>link de convite</strong> que só ele pode enviar. Esse link é pessoal e direto.
        </p>
        <p className="text-gray-600 text-sm mb-8">
          Se você já recebeu o link, use-o no mesmo e-mail ou mensagem em que seu presidente enviou.
        </p>
        <div className="space-y-3">
          <Link
            href="/pt/wellness"
            className="block w-full py-3 px-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            Voltar à página inicial
          </Link>
          <Link
            href="/pt/wellness/login"
            className="block w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Já tenho conta — Entrar
          </Link>
        </div>
      </div>
    </div>
  )
}
