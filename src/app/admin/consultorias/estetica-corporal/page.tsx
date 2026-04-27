import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import { FichasPipelineBento } from '@/components/admin/FichasPipelineBento'
import {
  HubRow,
  LinkConsultoriasHub,
} from '@/components/admin/consultorias/ConsultoriasHubParts'

export default function AdminConsultoriasEsteticaCorporalPage() {
  return (
    <AdminProtectedRoute>
      <main className="min-h-screen bg-gray-50 px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <header className="space-y-2">
            <LinkConsultoriasHub />
            <p className="text-sm font-medium text-indigo-700">YLADA · Admin</p>
            <h1 className="text-2xl font-bold text-gray-900">Estética corporal</h1>
            <p className="text-sm text-gray-600 max-w-2xl">
              Fichas em pipeline (pré vs diagnóstico). Abaixo, consultoria, Pro Estética e B2B.
            </p>
          </header>

          <FichasPipelineBento linha="corporal" />

          <ul className="grid gap-3 sm:grid-cols-1 md:grid-cols-3">
            <HubRow
              href="/admin/estetica-consultoria?segmento=corporal"
              icon="🧾"
              title="Consultoria YLADA (corporal)"
              description="Clientes, diagnóstico, link por clínica, respostas"
              border="border-rose-200"
              hover="hover:border-rose-400 hover:bg-rose-50/50"
            />
            <HubRow
              href="/admin/pro-estetica-corporal/onboarding"
              icon="💆‍♀️"
              title="Pro Estética — onboarding"
              description="Questionários; respostas no ambiente da clínica"
              border="border-sky-200"
              hover="hover:border-sky-400 hover:bg-sky-50/50"
            />
            <HubRow
              href="/admin/ylada/clinicas-estetica-corporal"
              icon="🏥"
              title="Clínicas (B2B)"
              description="Intake da landing, CSV e e-mail"
              border="border-teal-200"
              hover="hover:border-teal-400 hover:bg-teal-50/50"
            />
          </ul>
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
