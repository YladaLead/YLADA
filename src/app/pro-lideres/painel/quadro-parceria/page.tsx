import { redirect } from 'next/navigation'
import { ensureLeaderTenantAccess } from '@/lib/pro-lideres-server'
import { ProLideresQuadroParceriaContent } from '@/components/pro-lideres/ProLideresQuadroParceriaContent'

export const metadata = {
  title: 'Quadro parceria | Pro Líderes',
  description: 'Gere um quadro imprimível com QR codes dos seus links para compartilhar com parceiros.',
}

export default async function ProLideresPainelQuadroParceriaPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  return <ProLideresQuadroParceriaContent />
}
