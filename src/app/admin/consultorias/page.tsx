import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'

export default function AdminConsultoriasHubPage() {
  return (
    <AdminProtectedRoute>
      <main className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-8">
          <header className="space-y-2">
            <p className="text-sm font-medium text-indigo-700">YLADA · Admin</p>
            <h1 className="text-2xl font-bold text-gray-900">Consultorias</h1>
            <p className="text-sm text-gray-600 max-w-xl">
              Escolhe a área: Pro Líderes (líderes e equipas) ou estética capilar / corporal (clientes, pagamentos,
              materiais e formulários).
            </p>
            <p className="text-xs text-gray-500 max-w-xl">
              Atalhos diretos também estão no menu <strong className="font-medium text-gray-700">Área administrativa</strong>{' '}
              (topo) e no cartão <strong className="font-medium text-gray-700">Estética corporal — consultoria YLADA</strong> na
              página inicial do admin.
            </p>
          </header>

          <ul className="grid gap-4 sm:grid-cols-1">
            <li>
              <Link
                href="/admin/pro-lideres/consultoria"
                className="block rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm transition hover:border-emerald-400 hover:bg-emerald-50/40"
              >
                <span className="text-2xl" aria-hidden>
                  📋
                </span>
                <h2 className="mt-2 text-lg font-semibold text-gray-900">Pro Líderes — consultoria</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Materiais, roteiros, documentos e formulários com link para o líder — respostas guardadas por
                  material.
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/estetica-consultoria?segmento=capilar"
                className="block rounded-2xl border border-pink-200 bg-white p-5 shadow-sm transition hover:border-pink-400 hover:bg-pink-50/40"
              >
                <span className="text-2xl" aria-hidden>
                  💇‍♀️
                </span>
                <h2 className="mt-2 text-lg font-semibold text-gray-900">Estética — capilar</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Clientes e consultoria com foco capilar (inclui registos marcados como ambos).
                </p>
              </Link>
            </li>
            <li>
              <Link
                href="/admin/estetica-consultoria?segmento=corporal"
                className="block rounded-2xl border border-rose-200 bg-white p-5 shadow-sm transition hover:border-rose-400 hover:bg-rose-50/40"
              >
                <span className="text-2xl" aria-hidden>
                  💆‍♀️
                </span>
                <h2 className="mt-2 text-lg font-semibold text-gray-900">Estética — corporal</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Clientes e consultoria com foco corporal (inclui registos marcados como ambos).
                </p>
              </Link>
            </li>
          </ul>

          <p className="text-xs text-gray-500">
            Na estética podes ainda alterar o segmento por cliente (capilar, corporal ou ambos) nos dados
            administrativos.
          </p>
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
