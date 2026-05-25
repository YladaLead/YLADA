import { redirect } from 'next/navigation'

import { ProLideresMembroAtivacaoPanel } from '@/components/pro-lideres/ProLideresMembroAtivacaoPanel'
import { createProLideresServerClient } from '@/lib/pro-lideres-server'
import {
  PRO_LIDERES_MEMBRO_ATIVACAO_PATH,
  resolveProLideresMembroAtivacaoPage,
} from '@/lib/pro-lideres-membro-ativacao'

export default async function ProLideresMembroAtivacaoPage() {
  const supabase = await createProLideresServerClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) {
    redirect(`/pro-lideres/entrar?next=${encodeURIComponent(PRO_LIDERES_MEMBRO_ATIVACAO_PATH)}`)
  }

  const resolved = await resolveProLideresMembroAtivacaoPage(user.id)
  if (!resolved.ok) {
    redirect(resolved.redirect)
  }

  return (
    <ProLideresMembroAtivacaoPanel
      spaceLabel={resolved.spaceLabel}
      cardUrl={resolved.cardUrl}
      pixUrl={resolved.pixUrl}
    />
  )
}
