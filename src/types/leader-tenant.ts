/** Papel no espaço Pro Líderes (consultoria + tenant). */
export type ProLideresTenantRole = 'leader' | 'member'

/** Tenant Pro Líderes (tabela leader_tenants). */
export type LeaderTenantRow = {
  id: string
  owner_user_id: string
  slug: string
  display_name: string | null
  team_name: string | null
  whatsapp: string | null
  contact_email: string | null
  focus_notes: string | null
  /** Operador / vertical (ex. h-lider = Herbalife). */
  vertical_code?: string
  /** Máximo de convites pending (não expirados) em simultâneo. */
  team_invite_pending_quota?: number
  created_at: string
  updated_at: string
}

/** Membro do tenant (líder ou equipe). */
export type LeaderTenantMemberRow = {
  id: string
  leader_tenant_id: string
  user_id: string
  role: ProLideresTenantRole
  created_at: string
}

/** Fluxos no catálogo Pro Líderes (vendas vs recrutamento). */
export type ProLideresFlowCategory = 'sales' | 'recruitment'

export type LeaderTenantInviteStatus = 'pending' | 'used' | 'expired' | 'revoked'

/** Convite para a equipe (link + e-mail). */
export type LeaderTenantInviteRow = {
  id: string
  leader_tenant_id: string
  token: string
  invited_email: string
  created_by_user_id: string
  expires_at: string
  used_at: string | null
  used_by_user_id: string | null
  status: LeaderTenantInviteStatus
  created_at: string
}

/** Situação/ferramenta no painel Pro Líderes — Scripts (tabela leader_tenant_pl_script_sections). */
export type LeaderTenantPlScriptSectionRow = {
  id: string
  leader_tenant_id: string
  title: string
  subtitle: string | null
  ylada_link_id: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

/** Peça de roteiro ordenada dentro de uma situação (tabela leader_tenant_pl_script_entries). */
export type LeaderTenantPlScriptEntryRow = {
  id: string
  section_id: string
  title: string
  subtitle: string | null
  body: string
  how_to_use: string | null
  sort_order: number
  created_at: string
  updated_at: string
}

export type ProLideresScriptSectionWithEntries = LeaderTenantPlScriptSectionRow & {
  entries: LeaderTenantPlScriptEntryRow[]
}

/** Script guardado no painel Pro Estética Corporal (tabela leader_tenant_estetica_scripts). */
export type LeaderTenantEsteticaScriptRow = {
  id: string
  leader_tenant_id: string
  title: string
  body: string
  sort_order: number
  category: 'captar' | 'retencao' | 'acompanhar' | 'geral'
  created_at: string
  updated_at: string
}

/** Resposta enriquecida na listagem do painel do líder. */
export type LeaderTenantInviteListItem = LeaderTenantInviteRow & {
  effectiveStatus: LeaderTenantInviteStatus
  memberNome: string | null
  memberWhatsapp: string | null
  /** Pelo menos uma view/result_view em link /l com token pl_m. */
  linksEngaged: boolean
}
