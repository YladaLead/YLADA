/**
 * Types para o sistema LYA Nutri
 * Prefixo: ylada_nutri_lya_
 */

// ============================================
// PERFIS DA NUTRICIONISTA
// ============================================

export type NutriProfile = 
  | 'iniciante_empresarial'
  | 'consolidacao'
  | 'avancada_desorganizada'
  | 'estrategica'

export type NutriState = 
  | 'caotica'
  | 'confusa'
  | 'clara'
  | 'acelerada'

// ============================================
// FLUXOS EMPRESARIAIS
// ============================================

export type LyaFlow = 
  | 'organizacao_inicial'
  | 'postura_empresarial'
  | 'posicionamento_estrategico'
  | 'agenda_rotina'
  | 'atracao_clientes'
  | 'precificacao_ofertas'
  | 'organizacao_financeira'
  | 'crescimento_sustentavel'

export type LyaCycle = 
  | 'diario'
  | 'semanal'
  | 'mensal'

// ============================================
// CONTEXTO DA NUTRICIONISTA
// ============================================

export interface NutriContext {
  id: string
  user_id: string
  profile?: NutriProfile
  state?: NutriState
  active_flow?: LyaFlow
  cycle?: LyaCycle
  created_at: string
  updated_at: string
}

// ============================================
// INTERAÇÕES (MEMÓRIA DA LYA)
// ============================================

export interface LyaInteraction {
  id: string
  user_id: string
  message: string
  response: string
  profile_detected?: NutriProfile
  state_detected?: NutriState
  flow_used?: LyaFlow
  cycle_used?: LyaCycle
  link_used?: boolean
  violation_attempt?: boolean
  thread_id?: string
  created_at: string
}

// ============================================
// REQUESTS/RESPONSES
// ============================================

export interface LyaResponderRequest {
  user_id: string
  message: string
  conversation_history?: Array<{ role: 'user' | 'assistant'; content: string }>
  threadId?: string
}

export interface LyaResponderResponse {
  response: string
  profile_detected?: NutriProfile
  state_detected?: NutriState
  flow_used?: LyaFlow
  cycle_used?: LyaCycle
  threadId?: string
  functionCalls?: Array<{ name: string; arguments: any; result: any }>
}

// ============================================
// RECURSOS E FLUXOS
// ============================================

export interface LyaFlowInfo {
  id: string
  flow_name: LyaFlow
  title: string
  description: string
  when_to_use: string
  objective: string
  delivery: string[]
  created_at: string
  updated_at: string
}

export interface LyaResource {
  id: string
  resource_type: 'organizacao' | 'posicionamento' | 'acao_empresarial' | 'evolucao'
  title: string
  description: string
  link?: string
  flow_related?: LyaFlow
  created_at: string
  updated_at: string
}
