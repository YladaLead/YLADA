import Link from 'next/link'

export default function ProEsteticaCorporalAcompanharPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-semibold text-blue-600">Roadmap</p>
        <h1 className="text-2xl font-bold text-gray-900">Pro Estética Corporal — acompanhar</h1>
        <p className="mt-2 max-w-2xl text-gray-600">
          Visão pública do que está disponível nesta edição. Rotas principais:{' '}
          <code className="rounded bg-gray-100 px-1 text-xs">/pro-estetica-corporal</code>,{' '}
          <code className="rounded bg-gray-100 px-1 text-xs">/pro-estetica-corporal/painel</code>,{' '}
          <code className="rounded bg-gray-100 px-1 text-xs">/pro-estetica-corporal/entrar</code>.
        </p>
      </div>

      <ul className="list-inside list-disc space-y-2 text-gray-700">
        <li>
          Tenant com <code className="rounded bg-gray-50 px-1 text-xs">vertical_code = estetica-corporal</code> na tabela{' '}
          <code className="rounded bg-gray-50 px-1 text-xs">leader_tenants</code>.
        </li>
        <li>
          API Noel:{' '}
          <code className="rounded bg-gray-50 px-1 text-xs">POST /api/pro-estetica-corporal/noel</code>
        </li>
        <li>
          APIs catálogo/tenant:{' '}
          <code className="rounded bg-gray-50 px-1 text-xs">/api/pro-estetica-corporal/flows</code>,{' '}
          <code className="rounded bg-gray-50 px-1 text-xs">/api/pro-estetica-corporal/tenant</code>
        </li>
      </ul>

      <p className="text-sm text-gray-500">
        <Link href="/pro-estetica-corporal" className="font-medium text-blue-600 underline hover:text-blue-900">
          ← Site Pro Estética
        </Link>
      </p>
    </div>
  )
}
