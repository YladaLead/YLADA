import type { ReactNode } from 'react'
import { ensureEsteticaCapilarTenantAccess } from '@/lib/pro-estetica-capilar-server'
import { redirect } from 'next/navigation'

export default async function ProEsteticaCapilarAcessoExpiradoLayout({ children }: { children: ReactNode }) {
  const gate = await ensureEsteticaCapilarTenantAccess({ skipConsultoriaAccessCheck: true })
  if (!gate.ok) {
    redirect(gate.redirect)
  }
  return <>{children}</>
}
