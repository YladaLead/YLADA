import { redirect } from 'next/navigation'

import { ensureEsteticaCorporalTenantAccess } from '@/lib/pro-estetica-corporal-server'

export default async function ProEsteticaCorporalConfiguracaoPage() {
  const gate = await ensureEsteticaCorporalTenantAccess()
  if (!gate.ok) redirect(gate.redirect)
  if (gate.role !== 'leader') redirect('/pro-estetica-corporal/painel')

  redirect('/pro-estetica-corporal/painel/perfil')
}
