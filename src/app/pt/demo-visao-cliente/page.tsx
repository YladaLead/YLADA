'use client'

/**
 * Demo: visão do cliente/contato quando o profissional manda o link.
 * Mostra exatamente o que a pessoa vê após preencher um diagnóstico (resultado + disclaimer + Powered by YLADA).
 * Acesse: /pt/demo-visao-cliente
 */
import Link from 'next/link'
import DiagnosisDisclaimer from '@/components/ylada/DiagnosisDisclaimer'
import PoweredByYlada from '@/components/ylada/PoweredByYlada'

export default function DemoVisaoClientePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-sky-50/90 to-blue-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100/80 p-6 sm:p-8">
        {/* Badge só na demo */}
        <p className="text-xs font-medium text-amber-600 uppercase tracking-wider mb-4 text-center">
          Demo — o que seu cliente/contato vê
        </p>

        <h1 className="text-xl font-bold text-gray-900 mb-2">Exemplo de diagnóstico</h1>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Seu resultado</h2>
          <p className="text-gray-600 mt-2">
            Com base nas suas respostas, identificamos um perfil inicial. Um profissional pode aprofundar a análise em uma conversa.
          </p>
        </div>

        <button
          type="button"
          className="w-full py-4 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-colors"
          disabled
        >
          Falar no WhatsApp
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">(botão inativo na demo)</p>

        {/* Disclaimer e Powered by — igual ao que o cliente vê de verdade */}
        <DiagnosisDisclaimer variant="informative" className="mt-5 pt-4 border-t border-gray-100" />
        <PoweredByYlada variant="compact" />

        {/* Voltar para área do profissional */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <Link
            href="/pt"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Voltar para a página inicial do YLADA
          </Link>
        </div>
      </div>
    </div>
  )
}
