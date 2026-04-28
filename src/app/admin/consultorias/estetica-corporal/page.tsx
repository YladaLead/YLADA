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

          <aside className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-950 space-y-1 max-w-3xl">
            <p className="font-semibold text-gray-900">Painel Estética corporal — demo (se aplicaste o SQL no Supabase)</p>
            <p>
              <strong>E-mail:</strong>{' '}
              <code className="text-xs bg-white/80 px-1 rounded border border-amber-100">demo@proesteticacorporal.com</code>{' '}
              · <strong>Senha:</strong>{' '}
              <code className="text-xs bg-white/80 px-1 rounded border border-amber-100">123456</code>
            </p>
            <p className="text-xs text-amber-900/90">
              Script: <code className="text-[11px]">scripts/pro-estetica-corporal-demo-login.sql</code> · Entrada:{' '}
              <code className="text-[11px]">/pro-estetica-corporal/entrar</code>. Clientes reais: e-mail dedicado + senha
              própria.
            </p>
          </aside>

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
              title="Estética corporal — onboarding"
              description="Questionários; respostas no ambiente da clínica"
              border="border-sky-200"
              hover="hover:border-sky-400 hover:bg-sky-50/50"
            />
            <HubRow
              href="/admin/pro-lideres/manual-leader"
              icon="🔐"
              title="Cadastro manual — Pro Estética corporal"
              description="Na ficha (consultoria corporal), há atalho com dados pré-preenchidos; segmento estetica-corporal"
              border="border-blue-200"
              hover="hover:border-blue-400 hover:bg-blue-50/50"
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
