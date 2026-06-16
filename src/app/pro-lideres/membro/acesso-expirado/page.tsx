import Link from 'next/link'
import Image from 'next/image'
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
  formatProLideresAccessExpiryDatePtBr,
  isProLideresTeamAccessExpired,
} from '@/lib/pro-lideres-team-access-expiry-ui'
import { YLADA_OG_FALLBACK_LOGO_PATH } from '@/lib/ylada-og-fallback-logo'

export default async function ProLideresMembroAcessoExpiradoPage() {
  const supabase = await createProLideresServerClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user) {
    redirect('/pro-lideres/entrar?next=/pro-lideres/membro/acesso-expirado')
  }

  if (await isProLideresLeaderTenantOwner(user.id)) {
    redirect('/pro-lideres/painel')
  }

  const membership = await loadProLideresMemberMembershipForGate(user.id)
  if (!membership) {
    redirect('/pro-lideres/aguardando-acesso')
  }

  const st = membership.teamAccessState
  if (st === 'pending_activation') {
    redirect('/pro-lideres/membro/ativacao')
  }

  const exp = membership.teamAccessExpiresAt
  const expired = exp ? isProLideresTeamAccessExpired(exp) : false

  if (st === 'paused' && !expired) {
    redirect('/pro-lideres/acesso-pausado')
  }

  if (!expired) {
    redirect('/pro-lideres/membro/renovar')
  }

  const renewal = await loadProLideresMembroRenovacaoContext(user.id, membership.leaderTenantId)
  const expLabel = exp ? formatProLideresAccessExpiryDatePtBr(exp) : 'data anterior'
  const firstName =
    user.user_metadata?.full_name?.split(' ')?.[0]?.trim() ||
    user.email?.split('@')[0]?.trim() ||
    'Olá'
  const leaderWaUrl = buildProLideresLeaderRenewalWaUrl(renewal?.leaderWhatsapp, firstName, expLabel, 'expired')

  return (
    <div className="flex min-h-[100svh] min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="mb-6 flex justify-center">
          <Image
            src={YLADA_OG_FALLBACK_LOGO_PATH}
            alt="YLADA"
            width={200}
            height={56}
            className="h-14 w-auto object-contain"
            priority
          />
        </div>
        <h1 className="text-center text-xl font-bold text-gray-900">Renovar acesso ao Pro Líderes</h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-gray-700">
          O período de acesso em{' '}
          <strong className="text-gray-900">{renewal?.spaceLabel ?? 'sua equipe'}</strong> terminou em{' '}
          <strong className="text-gray-900">{expLabel}</strong>. Conclua o pagamento abaixo e avise sua equipe — o
          acesso é liberado pelo líder após a confirmação.
        </p>

        <div className="mt-6">
          <ProLideresMembroPaymentLinksCard
            cardUrl={renewal?.cardUrl ?? null}
            pixUrl={renewal?.pixUrl ?? null}
            leaderWaUrl={leaderWaUrl}
            emptyMessage="Não há link de pagamento configurado para esta equipe. Fale com sua líder pelo WhatsApp ou e-mail para combinar a renovação."
          />
        </div>

        {renewal?.leaderContactEmail ? (
          <p className="mt-4 text-center text-xs text-gray-500">
            E-mail da equipe:{' '}
            <a href={`mailto:${renewal.leaderContactEmail}`} className="font-medium text-blue-600 underline">
              {renewal.leaderContactEmail}
            </a>
          </p>
        ) : null}

        <p className="mt-6 text-center text-sm text-gray-600">
          <Link href="/pro-lideres/entrar" className="font-semibold text-blue-600 underline hover:text-blue-800">
            Voltar ao login
          </Link>
        </p>
      </div>
    </div>
  )
}
