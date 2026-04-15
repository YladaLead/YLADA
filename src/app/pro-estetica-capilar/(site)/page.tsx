import { redirect } from 'next/navigation'
import { ensureEsteticaCapilarTenantAccess } from '@/lib/pro-estetica-capilar-server'

export default async function ProEsteticaCapilarHomePage() {
  const gate = await ensureEsteticaCapilarTenantAccess()
  if (gate.ok) redirect('/pro-estetica-capilar/painel')
  if (gate.redirect !== '/pro-estetica-capilar/entrar') redirect(gate.redirect)

  return (
    <div className="mx-auto max-w-3xl space-y-4 text-center">
      <p className="text-sm font-medium text-blue-600">Pro Estetica Capilar</p>
      <h1 className="text-3xl font-bold text-gray-900">Jornada comercial para profissionais de estetica capilar</h1>
      <p className="text-gray-600">
        Estrutura de captacao, retencao e acompanhamento para transformar atendimento em previsibilidade de vendas.
      </p>
    </div>
  )
}
