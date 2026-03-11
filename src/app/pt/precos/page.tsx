'use client'

import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import { YLADA_LANDING_AREAS } from '@/config/ylada-landing-areas'

const AREAS_COM_PRECOS: { label: string; href: string }[] = [
  { label: 'Nutricionistas', href: '/pt/nutri/oferta' },
  { label: 'Wellness', href: '/pt/wellness' },
  ...YLADA_LANDING_AREAS.filter((a) => !['nutri', 'wellness'].includes(a.codigo)).map((a) => ({
    label: a.label,
    href: a.href,
  })),
]

export default function PrecosPage() {
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

      <main className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
          Planos por área
        </h1>
        <p className="text-gray-600 text-center mb-10">
          Escolha sua área para ver os planos disponíveis.
        </p>
        <div className="space-y-3">
          {AREAS_COM_PRECOS.map((area) => (
            <Link
              key={area.href}
              href={area.href}
              className="block px-6 py-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-medium text-gray-800"
            >
              {area.label} →
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
