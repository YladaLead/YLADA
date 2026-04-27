import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import {
  AreaPrincipalCard,
  LinkPainelAdmin,
} from '@/components/admin/consultorias/ConsultoriasHubParts'

export default function AdminConsultoriasHubPage() {
  return (
    <AdminProtectedRoute>
      <main className="min-h-screen bg-gray-50 px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-4xl space-y-8">
          <header className="space-y-2">
            <LinkPainelAdmin />
            <p className="text-sm font-medium text-indigo-700">YLADA · Admin</p>
            <h1 className="text-2xl font-bold text-gray-900">Consultorias</h1>
            <p className="text-sm text-gray-600 max-w-2xl">
              Escolhe uma das três áreas. Dentro de cada uma tens as ferramentas, materiais e manuseio específicos.
            </p>
          </header>

          <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
            <AreaPrincipalCard
              href="/admin/consultorias/pro-lideres"
              icon="🧭"
              title="Pro Líderes"
              border="border-emerald-200"
              hover="hover:border-emerald-400 hover:bg-emerald-50/50"
            />
            <AreaPrincipalCard
              href="/admin/consultorias/terapia-capilar"
              icon="✨"
              title="Terapia capilar"
              border="border-violet-200"
              hover="hover:border-violet-400 hover:bg-violet-50/50"
            />
            <AreaPrincipalCard
              href="/admin/consultorias/estetica-corporal"
              icon="💆‍♀️"
              title="Estética corporal"
              border="border-rose-200"
              hover="hover:border-rose-400 hover:bg-rose-50/50"
            />
          </ul>
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
