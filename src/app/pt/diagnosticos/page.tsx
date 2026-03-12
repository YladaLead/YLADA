'use client'

import Link from 'next/link'
import YLADALogo from '@/components/YLADALogo'
import { DIAGNOSTICOS } from '@/config/ylada-diagnosticos'
import { listarVariantes, PROFISSOES } from '@/config/ylada-diagnostico-variantes'

/** Agrupa variantes por diagnóstico base */
function agruparPorBase() {
  const variantes = listarVariantes()
  const porBase: Record<string, typeof variantes> = {}
  for (const v of variantes) {
    if (!porBase[v.baseSlug]) porBase[v.baseSlug] = []
    porBase[v.baseSlug].push(v)
  }
  return porBase
}

export default function DiagnosticosPage() {
  const porBase = agruparPorBase()
  const bases = Object.keys(DIAGNOSTICOS)

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <Link href="/pt" className="flex-shrink-0" aria-label="YLADA início">
            <YLADALogo size="md" responsive className="bg-transparent" />
          </Link>
          <nav className="flex gap-4">
            <Link href="/pt/diagnostico" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Fazer diagnóstico
            </Link>
            <Link href="/pt/metodo-ylada" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Método
            </Link>
          </nav>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-4">
          Biblioteca de diagnósticos profissionais
        </h1>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Escolha um diagnóstico e descubra em menos de 1 minuto o que pode estar travando o crescimento do seu negócio.
        </p>

        <div className="space-y-12">
          {bases.map((baseSlug) => {
            const config = DIAGNOSTICOS[baseSlug]
            const variantes = porBase[baseSlug] || []
            const hrefBase = baseSlug === 'comunicacao' ? '/pt/diagnostico' : `/pt/diagnostico/${baseSlug}`

            return (
              <section key={baseSlug}>
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  {config?.nome || baseSlug}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Link para versão genérica */}
                  <Link
                    href={hrefBase}
                    className="block p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50 transition-all"
                  >
                    <p className="font-medium text-gray-900">Versão geral</p>
                    <span className="text-blue-600 text-sm mt-1 inline-block">Fazer diagnóstico →</span>
                  </Link>
                  {/* Variantes por profissão */}
                  {variantes.map((v) => (
                    <Link
                      key={v.slugCompleto}
                      href={`/pt/diagnostico/${v.slugCompleto}`}
                      className="block p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 bg-white hover:bg-blue-50 transition-all"
                    >
                      <p className="font-medium text-gray-900">{v.profissao.label}</p>
                      <span className="text-blue-600 text-sm mt-1 inline-block">Fazer diagnóstico →</span>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        <div className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Por profissão</h2>
          <p className="text-gray-600 text-sm mb-6">
            Diagnósticos disponíveis para: {PROFISSOES.map((p) => p.label).join(', ')}.
          </p>
          <Link
            href="/pt/diagnostico"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
          >
            Começar diagnóstico
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-16 py-6">
        <div className="max-w-4xl mx-auto px-4 text-center text-sm text-gray-500">
          <Link href="/pt" className="hover:text-gray-700">YLADA</Link>
          <span className="mx-2">•</span>
          <Link href="/pt/metodo-ylada" className="hover:text-gray-700">Método</Link>
        </div>
      </footer>
    </div>
  )
}
