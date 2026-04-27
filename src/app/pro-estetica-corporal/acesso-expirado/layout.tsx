import type { ReactNode } from 'react'
import { ensureEsteticaCorporalTenantAccess } from '@/lib/pro-estetica-corporal-server'
import { redirect } from 'next/navigation'

export default async function ProEsteticaCorporalAcessoExpiradoLayout({ children }: { children: ReactNode }) {
  const gate = await ensureEsteticaCorporalTenantAccess({ skipConsultoriaAccessCheck: true })
  if (!gate.ok) {
    redirect(gate.redirect)
  }
  return <>{children}</>
}
