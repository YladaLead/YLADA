import Link from 'next/link'
import { redirect } from 'next/navigation'

import { ProLideresMembroPaymentLinksCard } from '@/components/pro-lideres/ProLideresMembroPaymentLinksCard'
import { createProLideresServerClient } from '@/lib/pro-lideres-server'
import {
  buildProLideresLeaderRenewalWaUrl,
  isProLideresLeaderTenantOwner,
  loadProLideresMemberMembershipForGate,
  loadProLideresMembroRenovacaoContext,
} from '@/lib/pro-lideres-membro-renovacao'
import {
  computeProLideresMemberAccessExpiryUi,
  formatProLideresAccessExpiryDatePtBr,
  isProLideresTeamAccessExpired,
} from '@/lib/pro-lideres-team-access-expiry-ui'

export default async function ProLideresMembroRenovarPage() {
  const supabase = await createProLideresServerClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) {
    redirect('/pro-lideres/entrar?next=/pro-lideres/membro/renovar')
  }

  if (await isProLideresLeaderTenantOwner(user.id)) {
    redirect('/pro-lideres/painel')
  }

  const membership = await loadProLideresMemberMembershipForGate(user.id)
  if (!membership) {
    redirect('/pro-lideres/aguardando-acesso')
  }

  const st = membership.teamAccessState
  if (st === 'pending_activation') redirect('/pro-lideres/membro/ativacao')
  if (st === 'paused') redirect('/pro-lideres/acesso-pausado')

  const exp = membership.teamAccessExpiresAt
  if (exp && isProLideresTeamAccessExpired(exp)) {
    redirect('/pro-lideres/membro/acesso-expirado')
  }

  const tenantId = membership.leaderTenantId
  const renewal = await loadProLideresMembroRenovacaoContext(user.id, tenantId)
  const ui = computeProLideresMemberAccessExpiryUi(exp)
  const expLabel = exp ? formatProLideresAccessExpiryDatePtBr(exp) : null
  const firstName =
    user.user_metadata?.full_name?.split(' ')?.[0]?.trim() ||
    user.email?.split('@')[0]?.trim() ||
    'Olá'
  const leaderWaUrl = expLabel
    ? buildProLideresLeaderRenewalWaUrl(renewal?.leaderWhatsapp, firstName, expLabel, 'upcoming')
    : null

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Renovar acesso</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          {expLabel ? (
            <>
              Seu acesso a <strong className="text-gray-800">{renewal?.spaceLabel ?? 'sua equipe'}</strong> é válido até{' '}
              <strong className="text-gray-800">{expLabel}</strong>
              {ui.daysLeft != null && ui.daysLeft >= 0 ? (
                <>
                  {' '}
                  ({ui.daysLeft === 0 ? 'vence hoje' : `faltam ${ui.daysLeft} dia${ui.daysLeft === 1 ? '' : 's'}`})
                </>
              ) : null}
              . Antecipe o pagamento para não ficar sem acesso.
            </>
          ) : (
            <>Combine a renovação do seu acesso ao Pro Líderes com a sua equipe.</>
          )}
        </p>
      </div>

      <ProLideresMembroPaymentLinksCard
        cardUrl={renewal?.cardUrl ?? null}
        pixUrl={renewal?.pixUrl ?? null}
        leaderWaUrl={leaderWaUrl}
      />

      <p className="text-center text-sm text-gray-500">
        <Link href="/pro-lideres/membro" className="font-medium text-blue-600 underline hover:text-blue-800">
          Voltar ao painel
        </Link>
      </p>
    </div>
  )
}
