'use client'

import Link from 'next/link'

export default function MedLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/pt" className="text-lg font-semibold text-gray-900">
            YLADA Medicina
          </Link>
          <Link
            href="/pt/med/login"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Entrar
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 text-center mb-4">
          Medicina no YLADA
        </h1>
        <p className="text-gray-600 text-center max-w-xl mb-8">
          Diagnóstico, links inteligentes e IA para médicos e especialistas. Aumente sua autoridade
          e qualifique contatos no campo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/pt/med/login"
            className="inline-flex justify-center items-center min-h-[48px] px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Acessar área Medicina
          </Link>
          <Link
            href="/pt"
            className="inline-flex justify-center items-center min-h-[48px] px-6 py-3 border border-gray-300 bg-white font-medium rounded-lg hover:bg-gray-50"
          >
            Voltar ao início
          </Link>
        </div>
      </main>
    </div>
  )
}
