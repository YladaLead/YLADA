import { redirect } from 'next/navigation'

import { ProEsteticaCapilarHomeBody } from '@/components/pro-estetica-capilar/ProEsteticaCapilarHomeBody'
import { ensureEsteticaCapilarTenantAccess } from '@/lib/pro-estetica-capilar-server'

export default async function ProEsteticaCapilarHomePage() {
  const gate = await ensureEsteticaCapilarTenantAccess()
  if (gate.ok) redirect('/pro-estetica-capilar/painel')
  if (gate.redirect !== '/pro-estetica-capilar/entrar') redirect(gate.redirect)

  return <ProEsteticaCapilarHomeBody />
}
