import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import {
  HubRow,
  LinkConsultoriasHub,
} from '@/components/admin/consultorias/ConsultoriasHubParts'

export default function AdminConsultoriasProLideresPage() {
  return (
    <AdminProtectedRoute>
      <main className="min-h-screen bg-gray-50 px-4 py-6 sm:py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          <header className="space-y-2">
            <LinkConsultoriasHub />
            <p className="text-sm font-medium text-indigo-700">YLADA · Admin</p>
            <h1 className="text-2xl font-bold text-gray-900">Pro Líderes</h1>
            <p className="text-sm text-gray-600 max-w-2xl">
              Consultoria (materiais), links de onboarding e conta criada à mão com a tua senha.
            </p>
          </header>

          <ul className="grid gap-3 sm:grid-cols-3">
            <HubRow
              href="/admin/pro-lideres/consultoria"
              icon="📋"
              title="Materiais e consultoria"
              description="Roteiros, documentos, formulários e respostas por material"
              border="border-emerald-200"
              hover="hover:border-emerald-400 hover:bg-emerald-50/50"
            />
            <HubRow
              href="/admin/pro-lideres/onboarding"
              icon="🧭"
              title="Onboarding (links)"
              description="Criar links e acompanhar respostas por e-mail"
              border="border-teal-200"
              hover="hover:border-teal-400 hover:bg-teal-50/50"
            />
            <HubRow
              href="/admin/pro-lideres/manual-leader"
              icon="🔑"
              title="Cadastro manual"
              description="Conta, tenant, senha e texto para enviares ao líder"
              border="border-amber-200"
              hover="hover:border-amber-400 hover:bg-amber-50/50"
            />
          </ul>
        </div>
      </main>
    </AdminProtectedRoute>
  )
}
