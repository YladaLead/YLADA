import { redirect } from 'next/navigation'

import { ProEsteticaCorporalHomeBody } from '@/components/pro-estetica-corporal/ProEsteticaCorporalHomeBody'
import { ensureEsteticaCorporalTenantAccess } from '@/lib/pro-estetica-corporal-server'

/**
 * Página pública de apresentação (vendas) só para quem **não** está dentro do produto.
 * Com sessão + tenant Pro Estética (ou stub dev), vai directo ao painel.
 */
export default async function ProEsteticaCorporalHomePage() {
  const gate = await ensureEsteticaCorporalTenantAccess()

  if (gate.ok) {
    if (!gate.previewWithoutLogin) {
      redirect('/pro-estetica-corporal/painel')
    }
    return <ProEsteticaCorporalHomeBody />
  }

  const dest = gate.redirect
  if (dest !== '/pro-estetica-corporal/entrar') {
    redirect(dest)
  }

  return <ProEsteticaCorporalHomeBody />
}
