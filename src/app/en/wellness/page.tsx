'use client'

import Image from 'next/image'
import LanguageSelector from '../../../components/LanguageSelector'

export default function WellnessPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm h-16 sm:h-20 flex items-center">
        <div className="container mx-auto px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="bg-transparent inline-block">
            <Image
              src="/images/logo/wellness-horizontal.png"
              alt="WELLNESS - Your Leading Data System"
              width={572}
              height={150}
              className="bg-transparent object-contain h-14 sm:h-16 lg:h-20 w-auto"
              style={{ backgroundColor: 'transparent' }}
              priority
            />
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main>
        {/* Under Construction */}
        <section className="bg-gradient-to-br from-purple-50 via-green-50 to-emerald-50 py-32 sm:py-40 lg:py-48">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Under Construction
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600">
                We are working to bring you the best experience.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4 bg-transparent inline-block">
              <Image
                src="/images/logo/wellness-horizontal.png"
                alt="WELLNESS - Your Leading Data System"
                width={572}
                height={150}
                className="bg-transparent object-contain h-20 w-auto"
                style={{ backgroundColor: 'transparent' }}
                priority
              />
            </div>
            <p className="text-gray-600 text-sm mb-2 text-center">
              Powered by <span className="font-semibold">YLADA</span>
            </p>
            <p className="text-gray-500 text-xs text-center mb-2">
              © {new Date().getFullYear()} YLADA. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs text-center">
              Portal Solutions Tech & Innovation LTDA
            </p>
            <p className="text-gray-400 text-xs text-center">
              CNPJ: 63.447.492/0001-88
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
