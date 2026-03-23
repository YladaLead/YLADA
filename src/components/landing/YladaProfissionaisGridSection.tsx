'use client'

/**
 * Grid único "Para quais profissionais o YLADA foi criado" — usado em todas as landings por área.
 * Fonte de verdade: getYladaLandingAreas (ylada-landing-areas.ts). Inclui psicanalistas junto às demais áreas.
 */
import Link from 'next/link'
import { getYladaLandingAreas } from '@/config/ylada-landing-areas'

const DEFAULT_TITLE = 'Para quais profissionais o YLADA foi criado'
const DEFAULT_SUBTITLE =
  'Profissionais e vendedores consultivos usam diagnósticos para atrair clientes mais preparados.'

export interface YladaProfissionaisGridSectionProps {
  locale: string
  /** Card destacado (borda azul), ex.: nutri, med, psicanalise */
  highlightCodigo?: string
  title?: string
  subtitle?: string
  verTodasHref?: string
  verTodasLabel?: string
}

export function YladaProfissionaisGridSection({
  locale,
  highlightCodigo,
  title,
  subtitle,
  verTodasHref = '/pt/profissionais',
  verTodasLabel = 'Ver todas as áreas',
}: YladaProfissionaisGridSectionProps) {
  const areas = getYladaLandingAreas(locale)
  const heading = title?.trim() ? title : DEFAULT_TITLE
  const sub = subtitle?.trim() ? subtitle : DEFAULT_SUBTITLE

  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-20 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 text-center mb-2">{heading}</h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">{sub}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {areas.map((area) => (
            <Link
              key={area.codigo}
              href={area.href}
              className={`block rounded-xl p-5 border text-center transition-all ${
                highlightCodigo && area.codigo === highlightCodigo
                  ? 'border-blue-400 bg-blue-50/50 hover:border-blue-500 hover:shadow-md'
                  : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <span className="font-semibold text-gray-900 block mb-1">{area.label}</span>
              <span className="text-sm text-gray-600">{area.slogan}</span>
            </Link>
          ))}
        </div>
        <div className="text-center">
          <Link
            href={verTodasHref}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all"
          >
            {verTodasLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}
