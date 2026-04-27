import Link from 'next/link'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import { FichasPipelineBento } from '@/components/admin/FichasPipelineBento'
import { LinkConsultoriasHub } from '@/components/admin/consultorias/ConsultoriasHubParts'

export default function AdminConsultoriasTerapiaCapilarPage() {
  return (
    <AdminProtectedRoute>
      <main className="min-h-screen bg-gray-50 px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="space-y-2">
            <LinkConsultoriasHub />
            <p className="text-sm font-medium text-indigo-700">YLADA · Admin</p>
            <h1 className="text-2xl font-bold text-gray-900">Terapia capilar</h1>
            <p className="text-sm text-gray-600 max-w-2xl">
              Fichas em pipeline (pré vs diagnóstico). Abaixo, a consultoria completa com materiais e respostas.
            </p>
          </header>

          <FichasPipelineBento linha="capilar" />

          <ul className="grid gap-3">
            <li>
              <Link
                href="/admin/estetica-consultoria?segmento=capilar"
                className="block rounded-2xl border border-violet-200 bg-white p-5 shadow-sm transition hover:border-violet-400 hover:bg-violet-50/40"
              >
                <span className="text-2xl" aria-hidden>
                  ✨
                </span>
                <h2 className="mt-2 text-lg font-semibold text-gray-900">Consultoria e diagnóstico (capilar)</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Clientes, terapia capilar, materiais e respostas (inclui registos “ambos” com corporal, se existirem).
                </p>
              </Link>
            </li>
          </ul>

          <p className="text-xs text-gray-500">
            Podes ajustar o segmento por cliente (capilar, corporal ou ambos) nos dados administrativos.
          </p>
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
