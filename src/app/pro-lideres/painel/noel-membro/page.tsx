import { Suspense } from 'react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import ProLideresNoelMembroClient from '@/components/pro-lideres/ProLideresNoelMembroClient'
import {
  PRO_LIDERES_DEMO_MEMBER_INVITE_EMAIL,
  PRO_LIDERES_DEMO_MEMBER_INVITE_TOKEN,
  proLideresDemoMemberInviteHref,
} from '@/config/pro-lideres-demo'
import { PRO_LIDERES_BASE_PATH, PRO_LIDERES_MEMBER_BASE_PATH } from '@/config/pro-lideres-menu'
import {
  createProLideresServerClient,
  ensureLeaderTenantAccess,
  resolveProLideresPainelUiState,
} from '@/lib/pro-lideres-server'
import {
  proLideresNoelMemberMonthlyAmountBrl,
  proLideresTenantUsesUnifiedMatrixNoel,
  resolveProLideresNoelMemberSurface,
} from '@/lib/pro-lideres-noel-member-access'
import { resolvedUserEmail } from '@/lib/pro-lideres-server'
import { getSupabaseAdmin } from '@/lib/supabase'

/**
 * Líder: Noel da equipe (incluído no Pro Líderes equipe) ou pré-visualização «Ver como equipe».
 * Membros: `/pro-lideres/membro/noel-membro`.
 */
export default async function ProLideresPainelNoelMembroPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const supabase = await createProLideresServerClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user?.id) redirect('/pro-lideres/entrar')

  const admin = getSupabaseAdmin()
  if (!admin) redirect(PRO_LIDERES_BASE_PATH)

  const cookieStore = await cookies()
  const ui = await resolveProLideresPainelUiState(gate, user.id, cookieStore, admin)

  if (!ui.canManageAsLeader) {
    redirect(PRO_LIDERES_BASE_PATH)
  }

  const surface = await resolveProLideresNoelMemberSurface(admin, user, gate, {
    isActiveMemberRow: ui.isActiveMemberRow,
    teamViewPreview: ui.teamViewPreview,
  })
  if (!surface.showSidebarNav) {
    redirect(PRO_LIDERES_BASE_PATH)
  }

  const leaderNoelHref = `${PRO_LIDERES_BASE_PATH.replace(/\/$/, '')}/noel`
  const noelEquipeHref = `${PRO_LIDERES_BASE_PATH.replace(/\/$/, '')}/configuracao`
  const demoConviteHref = proLideresDemoMemberInviteHref()

  const useUnifiedMatrixNoel = proLideresTenantUsesUnifiedMatrixNoel(gate.tenant, {
    ownerEmail: resolvedUserEmail(user),
    role: gate.role,
  })

  if (!ui.teamViewPreview && surface.noelMemberIncludedForLeader && surface.canOpenChat) {
    return (
      <Suspense fallback={<p className="p-4 text-sm text-gray-500">Carregando…</p>}>
        <ProLideresNoelMembroClient
          variant="leader_included"
          initialHasSubscription
          initialCanChat
          monthlyAmountBrl={proLideresNoelMemberMonthlyAmountBrl()}
          useUnifiedMatrixNoel={useUnifiedMatrixNoel}
        />
      </Suspense>
    )
  }

  if (!ui.teamViewPreview && surface.noelMemberIncludedForLeader && !surface.canOpenChat) {
    return (
      <div className="mx-auto max-w-lg space-y-3 py-4 text-sm text-gray-700">
        <h1 className="text-xl font-bold text-gray-900">Noel</h1>
        <p>
          A assinatura <strong>Pro Líderes equipe</strong> deste espaço não está ativa. Renove o pagamento para usar o
          Noel da equipe (incluído no plano, sem taxa extra).
        </p>
        <Link href={noelEquipeHref} className="inline-block text-sm font-semibold text-blue-700 underline">
          Noel equipe
        </Link>
      </div>
    )
  }

  if (!ui.teamViewPreview) {
    redirect(PRO_LIDERES_BASE_PATH)
  }

  return (
    <div className="mx-auto max-w-xl space-y-5 py-2">
      <h1 className="text-2xl font-bold text-gray-900">Noel na equipe</h1>

      <div className="rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 text-sm text-emerald-950">
        <p className="font-semibold text-emerald-900">Pré-visualização: menu como a equipe</p>
        <p className="mt-1 text-emerald-900/95">
          A adesão ao Noel membro (checklist + botão) é só na <strong>área do membro</strong>, com login de quem entrou
          pela equipe.
        </p>
      </div>

      <div className="flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap">
        <Link
          href={noelEquipeHref}
          className="inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
        >
          Ligar oferta: Noel equipe
        </Link>
        <Link
          href={leaderNoelHref}
          className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-800 hover:bg-gray-50"
        >
          Noel do painel (líder)
        </Link>
        <Link
          href={`${PRO_LIDERES_MEMBER_BASE_PATH}/noel-membro`}
          className="inline-flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-800 hover:bg-gray-50"
        >
          Ver tela do membro
        </Link>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50/90 p-3 text-xs text-amber-950">
        <p className="font-semibold text-amber-900">Demo: convite fixo (membro de teste)</p>
        <p className="mt-1 break-all font-mono">{demoConviteHref}</p>
        <p className="mt-1">
          E-mail da conta: <span className="font-mono">{PRO_LIDERES_DEMO_MEMBER_INVITE_EMAIL}</span> · token{' '}
          <span className="font-mono">{PRO_LIDERES_DEMO_MEMBER_INVITE_TOKEN}</span> · tabulador{' '}
          <strong>Demonstração</strong>.
        </p>
      </div>
    </div>
  )
}
