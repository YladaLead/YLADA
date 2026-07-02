import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import ProLideresNoelLeaderClient from '@/components/pro-lideres/ProLideresNoelLeaderClient'
import { PRO_LIDERES_BASE_PATH } from '@/config/pro-lideres-menu'
import {
  createProLideresServerClient,
  ensureLeaderTenantAccess,
  resolvedUserEmail,
} from '@/lib/pro-lideres-server'
import { proLideresTenantUsesUnifiedMatrixNoel } from '@/lib/pro-lideres-noel-member-access'

export default async function ProLideresNoelPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const supabase = await createProLideresServerClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user?.id) redirect('/pro-lideres/entrar')

  if (gate.role !== 'leader') {
    redirect(PRO_LIDERES_BASE_PATH)
  }

  const useUnifiedMatrixNoel = proLideresTenantUsesUnifiedMatrixNoel(gate.tenant, {
    ownerEmail: resolvedUserEmail(user),
    role: gate.role,
  })

  return (
    <Suspense fallback={<p className="p-4 text-sm text-gray-500">Carregando…</p>}>
      <ProLideresNoelLeaderClient useUnifiedMatrixNoel={useUnifiedMatrixNoel} />
    </Suspense>
  )
}
