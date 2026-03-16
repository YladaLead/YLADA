'use client'

import Link from 'next/link'
import { nutraOfertaTranslations, type NutraLocale } from '@/lib/nutra-i18n'

interface NutraOfertaContentProps {
  locale: NutraLocale
  /** Base path for nutra (e.g. /pt/nutra, /en/nutra, /es/nutra) */
  basePath: string
}

export default function NutraOfertaContent({ locale, basePath }: NutraOfertaContentProps) {
  const t = nutraOfertaTranslations[locale]

  const handleCheckout = (plan: 'monthly' | 'annual') => {
    window.location.href = `${basePath}/checkout?plan=${plan}`
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur h-14 flex items-center">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href={basePath} className="flex items-center gap-2">
            <span className="font-bold text-gray-900">YLADA</span>
            <span className="text-gray-500 text-sm">· Nutra</span>
          </Link>
          <Link
            href={`${basePath}/login`}
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            {t.alreadyHaveAccount}
          </Link>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-10 sm:py-14">
        <section className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{t.headline}</h1>
          <p className="text-lg sm:text-xl font-semibold text-blue-600">{t.subheadline}</p>
        </section>

        <section className="mb-10 text-center">
          <p className="text-gray-700 leading-relaxed">{t.benefit}</p>
        </section>

        <section className="mb-10 bg-gray-50 rounded-xl p-6 border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">{t.whatYouGet}</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2"><span className="text-green-600 text-lg">✓</span>{t.link1}</li>
            <li className="flex items-start gap-2"><span className="text-green-600 text-lg">✓</span>{t.link2}</li>
            <li className="flex items-start gap-2"><span className="text-green-600 text-lg">✓</span>{t.link3}</li>
            <li className="flex items-start gap-2"><span className="text-green-600 text-lg">✓</span>{t.link4}</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-bold text-gray-900 mb-4 text-center">{t.choosePlan}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200 text-center">
              <p className="font-semibold text-gray-800">{t.monthly}</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">R$ 97<span className="text-sm font-normal text-gray-600">/mês</span></p>
              <button
                type="button"
                onClick={() => handleCheckout('monthly')}
                className="mt-3 w-full py-2.5 rounded-lg bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
              >
                {t.chooseMonthly}
              </button>
            </div>
            <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-4 text-center text-white border-2 border-blue-600 shadow-lg">
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-white/95 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm">
                ⭐ {t.mostChosen}
              </div>
              <p className="font-semibold mt-1">{t.annual}</p>
              <p className="text-2xl font-bold mt-1">R$ 59<span className="text-sm font-normal text-white/90">/mês</span></p>
              <p className="text-sm text-white/90">{t.annualBilling}</p>
              <p className="text-blue-100 text-sm font-semibold mt-1">{t.saveAnnual}</p>
              <button
                type="button"
                onClick={() => handleCheckout('annual')}
                className="mt-3 w-full py-2.5 rounded-lg bg-white text-blue-600 font-semibold text-sm hover:bg-white/90 transition-colors"
              >
                {t.startNow}
              </button>
            </div>
          </div>
        </section>

        <section className="mb-10 text-center bg-blue-50 rounded-xl p-6">
          <p className="text-2xl mb-2">🛡️</p>
          <h2 className="font-bold text-gray-900 mb-2">{t.guaranteeTitle}</h2>
          <p className="text-gray-700 text-sm">{t.guaranteeText}</p>
        </section>

        <section>
          <button
            type="button"
            onClick={() => handleCheckout('annual')}
            className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            {t.ctaButton}
          </button>
          <p className="text-center text-xs text-gray-500 mt-3">{t.priceNote}</p>
        </section>
      </main>
    </div>
  )
}
