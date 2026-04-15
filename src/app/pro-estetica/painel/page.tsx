import Link from 'next/link'
import { getProEsteticaPainelContext, listProEsteticaSegmentos } from '@/lib/pro-estetica-server'

export default async function ProEsteticaPainelPage() {
  const ctx = await getProEsteticaPainelContext()
  const segmentos = listProEsteticaSegmentos()

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6">
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-6">
        <p className="text-sm font-medium text-blue-600">Pro Estetica</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">Painel interno por segmentos</h1>
        <p className="mt-2 text-sm text-gray-700 sm:text-base">
          Base unica do produto Pro Estetica, com jornadas separadas por nicho. O objetivo e nao misturar a
          filosofia de rede do Pro Lideres com a rotina comercial da profissional de estetica.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-white px-3 py-1 text-gray-700 ring-1 ring-gray-200">
            Segmento ativo: <strong>{ctx.activeSegment?.label ?? 'Estetica Corporal'}</strong>
          </span>
          {ctx.tenantDisplayName ? (
            <span className="rounded-full bg-white px-3 py-1 text-gray-700 ring-1 ring-gray-200">
              Operacao: <strong>{ctx.tenantDisplayName}</strong>
            </span>
          ) : null}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {segmentos.map((segmento) => {
          const isLive = segmento.status === 'live'
          const isActive = segmento.code === ctx.activeSegmentCode
          return (
            <article key={segmento.code} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-gray-900">{segmento.label}</h2>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isLive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {isLive ? 'Liberado' : 'Em construcao'}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{segmento.description}</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-500">{isActive ? 'Segmento atual da conta' : 'Segmento disponivel'}</span>
                {isLive ? (
                  <Link
                    href={segmento.painelHref}
                    className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Abrir painel
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="cursor-not-allowed rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-500"
                  >
                    Em breve
                  </button>
                )}
              </div>
            </article>
          )
        })}
      </section>
    </main>
  )
}
