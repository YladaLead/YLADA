/**
 * Módulo de fase da conversa — lei única do sistema.
 * tags + contexto → fase. Fonte: FLUXO-COMPLETO-WHATSAPP-SCRIPTS.md e CAROL-OPERACAO-WORKER-ESTADOS-E-CENARIOS.md
 */

export type Fase =
  | 'inscrito_nao_chamou'
  | 'chamou_nao_fechou'
  | 'agendou'
  | 'participou'
  | 'nao_participou'

export interface ContextoFase {
  /** ID da sessão de workshop agendada (quando a pessoa escolheu uma opção) */
  workshop_session_id?: string | null
}

/**
 * Deriva a fase a partir apenas de tags e contexto.
 * Ordem de prioridade (lei do sistema):
 * 1. participou_aula → participou
 * 2. nao_participou_aula (e não participou_aula) → nao_participou
 * 3. (veio ou recebeu_link) e (agendou_aula ou workshop_session_id) → agendou
 * 4. veio_aula_pratica ou recebeu_link_workshop → chamou_nao_fechou
 * 5. else → inscrito_nao_chamou
 */
export function getFaseFromTagsAndContext(
  tags: string[],
  contexto?: ContextoFase | null
): Fase {
  const tagSet = new Set((tags || []).map((t) => String(t).trim()).filter(Boolean))
  const has = (t: string) => tagSet.has(t)
  const sessionId = contexto?.workshop_session_id ?? null
  const temSessao = Boolean(sessionId && String(sessionId).trim())

  if (has('participou_aula')) return 'participou'
  if (has('nao_participou_aula') && !has('participou_aula')) return 'nao_participou'

  const temWorkshop = has('veio_aula_pratica') || has('recebeu_link_workshop')
  const agendou = has('agendou_aula') || temSessao
  if (temWorkshop && agendou) return 'agendou'
  if (temWorkshop) return 'chamou_nao_fechou'

  return 'inscrito_nao_chamou'
}
