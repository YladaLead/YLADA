import Link from 'next/link'

type ProEsteticaJornadaIntroProps = {
  eyebrow: string
  title: string
  lead: string
  bullets: string[]
  nextHint?: string
  basePath?: string
}

/**
 * Página guia da jornada (captar / retenção / acompanhar) — texto + atalho à biblioteca e links.
 */
export function ProEsteticaJornadaIntro({
  eyebrow,
  title,
  lead,
  bullets,
  nextHint,
  basePath = '/pro-estetica-corporal/painel',
}: ProEsteticaJornadaIntroProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm font-medium text-blue-600">{eyebrow}</p>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-gray-700">{lead}</p>
      </div>
      <ul className="list-inside list-disc space-y-2 text-gray-700 marker:text-blue-600">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      {nextHint ? <p className="text-sm text-gray-600">{nextHint}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Link
          href={`${basePath}/biblioteca-links`}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Abrir biblioteca e links
        </Link>
        <Link
          href={`${basePath}/noel`}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
        >
          Falar com o Noel
        </Link>
      </div>
    </div>
  )
}
