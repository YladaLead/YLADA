'use client'

import Link from 'next/link'
import YladaHubHeader from '@/components/landing/YladaHubHeader'
import ManifestoYLADA from '@/components/landing/ManifestoYLADA'

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-white">
      <YladaHubHeader ctaLabel="Descobrir meu perfil" ctaHref="/pt/diagnostico" showLanguageSelector={false} />

      <main>
        <section className="py-12 sm:py-16 bg-[#f8fafc] border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Sobre o YLADA
              </h1>
              <p className="text-lg text-gray-600">
                Por que criamos uma plataforma onde profissionais transformam conhecimento em perguntas — e iniciam conversas melhores.
              </p>
            </div>
          </div>
        </section>

        <ManifestoYLADA showDiagram showTitle variant="card" />

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 text-center">
            <Link
              href="/pt/diagnostico"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
            >
              Descobrir meu perfil
            </Link>
            <span className="mx-3 text-gray-400">·</span>
            <Link href="/pt/metodo-ylada" className="text-blue-600 hover:text-blue-700 font-medium">
              Filosofia YLADA
            </Link>
            <span className="mx-3 text-gray-400">·</span>
            <Link href="/pt" className="text-gray-600 hover:text-gray-900">
              Início
            </Link>
          </div>
        </section>
      </main>

      <footer className="py-8 border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <Link href="/pt" className="hover:text-gray-700">
            YLADA
          </Link>
          <span className="mx-2">·</span>
          <Link href="/pt/sobre" className="hover:text-gray-700">
            Sobre
          </Link>
          <span className="mx-2">·</span>
          <Link href="/pt/metodo-ylada" className="hover:text-gray-700">
            Filosofia
          </Link>
          <span className="mx-2">·</span>
          <Link href="/pt/precos" className="hover:text-gray-700">
            Preços
          </Link>
        </div>
      </footer>
    </div>
  )
}
