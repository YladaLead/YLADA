'use client'

import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import { YLADA_LANDING_AREAS } from '@/config/ylada-landing-areas'

export default function ProfissionaisPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/pt" className="flex-shrink-0" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <div className="flex gap-4">
            <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Método
            </Link>
            <Link href="/pt/diagnostico" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Diagnóstico
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
          Para quais profissionais é o YLADA
        </h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Escolha sua área e veja como o método funciona na prática.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {YLADA_LANDING_AREAS.map((area) => (
            <Link
              key={area.codigo}
              href={area.href}
              className="block bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-2">{area.label}</h3>
              <p className="text-gray-600 text-sm mb-4">{area.descricao}</p>
              <span className="text-blue-600 text-sm font-medium">Conhecer →</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
