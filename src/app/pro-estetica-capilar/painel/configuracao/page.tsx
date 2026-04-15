import { redirect } from 'next/navigation'
import { ensureEsteticaCapilarTenantAccess } from '@/lib/pro-estetica-capilar-server'

export default async function ProEsteticaCapilarConfiguracaoPage() {
  const gate = await ensureEsteticaCapilarTenantAccess()
  if (!gate.ok) redirect(gate.redirect)
  if (gate.role !== 'leader') redirect('/pro-estetica-capilar/painel')
  redirect('/pro-estetica-capilar/painel/perfil')
}
