import { redirect } from 'next/navigation'
import { ensureProJoiasTenantAccess } from '@/lib/pro-joias-server'

export default async function ProJoiasConfiguracaoPage() {
  const gate = await ensureProJoiasTenantAccess()
  if (!gate.ok) redirect(gate.redirect)
  if (gate.role !== 'leader') redirect('/pro-joias/painel')

  redirect('/pro-joias/painel/perfil')
}
