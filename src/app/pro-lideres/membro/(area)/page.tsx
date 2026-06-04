import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

import {
  PRO_LIDERES_MEMBER_BASE_PATH,
  proLideresItemHrefWithBase,
} from '@/config/pro-lideres-menu'
import { fetchProLideresCatalogLinkDiagnosticRows } from '@/lib/pro-lideres-catalog-link-diagnostics'
import {
  ensureLeaderTenantAccess,
  createProLideresServerClient,
  defaultDisplayNameFromUser,
  resolveProLideresPainelUiState,
} from '@/lib/pro-lideres-server'
import { resolveProLideresNoelMemberSurface } from '@/lib/pro-lideres-noel-member-access'
import { getSupabaseAdmin } from '@/lib/supabase'
import ProLideresMembroHomeClient from '@/components/pro-lideres/ProLideresMembroHomeClient'
import type { ProLideresMembroHomeLinkItem } from '@/components/pro-lideres/ProLideresMembroHomeClient'

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://www.ylada.com').replace(/\/$/, '')

export default async function ProLideresMembroVisaoPage() {
  const gate = await ensureLeaderTenantAccess()
  if (!gate.ok) redirect(gate.redirect)

  const supabase = await createProLideresServerClient()
  const { data: userData } = await supabase.auth.getUser()
  const user = userData.user
  if (!user?.id) redirect('/pro-lideres/entrar')

  const admin = getSupabaseAdmin()
  const base = PRO_LIDERES_MEMBER_BASE_PATH
  const cookieStore = await cookies()

  // Primeiro nome para saudação
  const fullName = defaultDisplayNameFromUser(user)
  const firstName = fullName.split(' ')[0] || fullName

  // Acesso ao Noel
  let noelEnabled = false
  if (admin) {
    const ui = await resolveProLideresPainelUiState(gate, user.id, cookieStore, admin)
    const noel = await resolveProLideresNoelMemberSurface(admin, user, gate, {
      isActiveMemberRow: ui.isActiveMemberRow,
      teamViewPreview: ui.teamViewPreview,
    })
    noelEnabled = noel.showSidebarNav
  }

  // Links do catálogo
  let allLinkRows: Awaited<ReturnType<typeof fetchProLideresCatalogLinkDiagnosticRows>>['rows'] = []
  let statsDays = 30

  if (admin) {
    try {
      const pack = await fetchProLideresCatalogLinkDiagnosticRows(admin, {
        tenantId: gate.tenant.id,
        ownerUserId: gate.tenant.owner_user_id,
        memberUserId: user.id,
        days: statsDays,
      })
      allLinkRows = pack.rows
      statsDays = pack.days
    } catch (e) {
      console.error('[membro home] links', e)
    }
  }

  // Primeiros 3 links para exibição rápida
  const previewLinks: ProLideresMembroHomeLinkItem[] = allLinkRows.slice(0, 3).map((r) => ({
    linkId: r.linkId,
    slug: r.slug,
    title: r.title,
    publicUrl: `${APP_URL}/l/${r.slug}`,
  }))

  // Totais de atividade
  const activeLinks = allLinkRows.filter(
    (r) => r.views + r.starts + r.completions + r.whatsappClicks > 0
  )
  const totals = activeLinks.reduce(
    (acc, r) => {
      acc.views += r.views
      acc.starts += r.starts
      acc.completions += r.completions
      acc.whatsapp += r.whatsappClicks
      return acc
    },
    { views: 0, starts: 0, completions: 0, whatsapp: 0 }
  )

  return (
    <ProLideresMembroHomeClient
      firstName={firstName}
      noelEnabled={noelEnabled}
      noelHref={proLideresItemHrefWithBase(base, 'noel-membro')}
      linksHref={proLideresItemHrefWithBase(base, 'catalogo')}
      boardsHref={proLideresItemHrefWithBase(base, 'boards')}
      links={previewLinks}
      stats={totals}
      statsDays={statsDays}
      hasActivity={activeLinks.length > 0}
    />
  )
}
