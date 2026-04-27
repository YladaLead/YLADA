import Link from 'next/link'

export function LinkPainelAdmin() {
  return (
    <p className="text-sm text-gray-500">
      <Link href="/admin" className="font-medium text-indigo-600 hover:text-indigo-800">
        ← Painel admin
      </Link>
    </p>
  )
}

export function LinkConsultoriasHub() {
  return (
    <p className="text-sm text-gray-500">
      <Link href="/admin/consultorias" className="font-medium text-indigo-600 hover:text-indigo-800">
        ← Consultorias
      </Link>
    </p>
  )
}

/** Cartão na raiz do hub (apenas as 3 áreas): título + abrir; clique em qualquer sítio do cartão */
export function AreaPrincipalCard({
  href,
  title,
  icon,
  border,
  hover,
}: {
  href: string
  title: string
  icon: string
  border: string
  hover: string
}) {
  return (
    <li className="min-w-0">
      <Link
        href={href}
        aria-label={`${title} — abrir`}
        className={`group flex h-full min-h-[11rem] flex-col rounded-2xl border-2 bg-white p-5 shadow-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 ${border} ${hover}`}
      >
        <span className="text-3xl" aria-hidden>
          {icon}
        </span>
        <h2 className="mt-3 flex-1 text-xl font-semibold text-gray-900 leading-snug">{title}</h2>
        <span className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition group-hover:bg-indigo-700">
          Abrir
        </span>
      </Link>
    </li>
  )
}

/** Cartões secundários dentro de cada área */
export function HubRow({
  href,
  title,
  description,
  icon,
  border,
  hover,
}: {
  href: string
  title: string
  description: string
  icon: string
  border: string
  hover: string
}) {
  return (
    <li>
      <Link
        href={href}
        className={`block h-full rounded-xl border bg-white p-4 shadow-sm transition ${border} ${hover}`}
      >
        <span className="text-xl" aria-hidden>
          {icon}
        </span>
        <h3 className="mt-1.5 text-base font-semibold text-gray-900">{title}</h3>
        <p className="mt-0.5 text-sm text-gray-600 leading-snug">{description}</p>
      </Link>
    </li>
  )
}
