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
  /** Se false, a equipe não vê Tarefas diárias (líder vê sempre). */
  daily_tasks_visible_to_team?: boolean
  /** Pontos extra uma vez por dia quando o membro marca todas as tarefas desse dia. */
  daily_tasks_full_day_bonus_points?: number
  created_at: string
  updated_at: string
}

/** Estado de acesso à equipe (linha em leader_tenant_members). */
export type ProLideresTeamAccessState = 'active' | 'paused'

/** Membro do tenant (líder ou equipe). */
export type LeaderTenantMemberRow = {
  id: string
  leader_tenant_id: string
  user_id: string
  role: ProLideresTenantRole
  /** Só aplica a role member; líder fica sempre active. */
  team_access_state: ProLideresTeamAccessState
  /** Slug escolhido no convite; segmento padrão nos links /l/…/… por membro. */
  pro_lideres_share_slug?: string | null
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
  /** Se false, só o líder vê esta sequência no painel; a equipe não. */
  visible_to_team: boolean
  sort_order: number
  /** vendas | recrutamento — filtro e biblioteca YLADA (opcional até migration 322). */
  focus_main?: 'vendas' | 'recrutamento'
  /** Alinhado ao guiado (ex.: novos_contatos) ou geral. */
  intention_key?: string
  /** Preset do fluxo guiado (ex.: espaco_saudavel), opcional. */
  tool_preset_key?: string | null
  /** Cópia da biblioteca YLADA, se aplicável. */
  source_template_id?: string | null
  /** Uma linha: quando usar (biblioteca guiada). */
  usage_hint?: string | null
  /** Resumo da sequência (ex.: Permissão → Convite). */
  sequence_label?: string | null
  /** Momento da conversa para filtros (migration 325). */
  conversation_stage?: string | null
  created_at: string
  updated_at: string
}

/** Template global da biblioteca YLADA (tabela pro_lideres_script_templates). */
export type ProLideresScriptTemplateRow = {
  id: string
  focus_main: 'vendas' | 'recrutamento'
  intention_key: string
  tool_preset_key: string | null
  title: string
  subtitle: string | null
  /** Quando usar (uma frase). */
  usage_hint?: string | null
  /** Sequência resumida para o líder. */
  sequence_label?: string | null
  /** Filtro «momento da conversa». */
  conversation_stage?: string | null
  entries: ProLideresScriptTemplateEntry[]
  sort_order: number
  vertical_code: string | null
  created_at: string
  updated_at: string
}

export type ProLideresScriptTemplateEntry = {
  title: string
  subtitle: string | null
  body: string
  how_to_use: string | null
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
