/**
 * Perfil Estratégico Derivado — inferido a partir de ylada_noel_profile + interpretação.
 * Usado para adaptar StrategicIntro e CTA sem alterar diagnosis-engine.
 * Campos disponíveis no perfil hoje: tempo_atuacao_anos, dor_principal, fase_negocio,
 * profile_type, profession, category, sub_category, prioridade_atual, capacidade_semana,
 * objetivos_curto_prazo, modelo_atuacao, canais_principais.
 * @see docs/ANALISE-PROMPT-CAMADA-DECISAO-SERGIO.md
 */

export type MaturityStage = 'iniciante' | 'instavel' | 'crescendo' | 'consolidado'
export type DominantPain = 'agenda' | 'posicionamento' | 'conversao' | 'autoridade'
export type UrgencyLevel = 'alta' | 'media' | 'baixa'
export type StrategicMindset = 'tecnico' | 'comercial' | 'inseguro' | 'estrategico'

export interface StrategicProfile {
  maturityStage: MaturityStage
  dominantPain: DominantPain
  urgencyLevel: UrgencyLevel
  mindset: StrategicMindset
}

/** Dados do perfil (ylada_noel_profile) + contexto da interpretação ao gerar link. */
export interface ProfileDataInput {
  tempo_atuacao_anos?: number | null
  dor_principal?: string | null
  fase_negocio?: string | null
  profile_type?: string | null
  profession?: string | null
  prioridade_atual?: string | null
  capacidade_semana?: number | null
  objetivos_curto_prazo?: string | null
}

export interface InterpretacaoContext {
  objetivo?: string
  tema?: string
  area_profissional?: string
}

/**
 * Deriva estágio de maturidade, dor dominante, urgência e mentalidade a partir
 * do perfil salvo e da interpretação (objetivo/tema). Heurísticas simples; sem IA.
 */
export function deriveStrategicProfile(
  profile: ProfileDataInput | null,
  interpretacao?: InterpretacaoContext | null
): StrategicProfile {
  const obj = (interpretacao?.objetivo ?? '').toString().trim().toLowerCase()
  const area = (interpretacao?.area_profissional ?? '').toString().trim().toLowerCase()
  const tema = (interpretacao?.tema ?? '').toString().trim().toLowerCase()

  const tempo = typeof profile?.tempo_atuacao_anos === 'number' ? profile.tempo_atuacao_anos : null
  const dor = (profile?.dor_principal ?? '').toString().trim().toLowerCase()
  const fase = (profile?.fase_negocio ?? '').toString().trim().toLowerCase()
  const profileType = (profile?.profile_type ?? '').toString().trim().toLowerCase()
  const profession = (profile?.profession ?? '').toString().trim().toLowerCase()
  const capacidade = typeof profile?.capacidade_semana === 'number' ? profile.capacidade_semana : null

  // --- Maturidade ---
  let maturityStage: MaturityStage = 'instavel'
  if (fase === 'escalando') maturityStage = 'consolidado'
  else if (fase === 'estabilizado' || (capacidade != null && capacidade >= 20)) maturityStage = 'crescendo'
  else if (tempo != null && tempo < 2) maturityStage = 'iniciante'
  else if (fase === 'iniciante') maturityStage = 'iniciante'
  else if (obj === 'captar' || fase === 'em_crescimento') maturityStage = 'instavel'

  // --- Dor dominante ---
  let dominantPain: DominantPain = 'agenda'
  if (/agenda_vazia|agenda_instavel/.test(dor)) dominantPain = 'agenda'
  else if (/autoridade|nao_postar|posicionamento/.test(dor) || /nicho|posicionamento|marca/.test(tema)) dominantPain = 'posicionamento'
  else if (/nao_converte|followup_fraco|sem_leads|sem_indicacao/.test(dor)) dominantPain = 'conversao'
  else if (obj === 'captar') dominantPain = 'agenda'

  // --- Urgência ---
  let urgencyLevel: UrgencyLevel = 'media'
  if (obj === 'captar') urgencyLevel = 'alta'
  else if (obj === 'educar' || obj === 'reter') urgencyLevel = 'media'
  else urgencyLevel = 'baixa'

  // --- Mentalidade ---
  let mindset: StrategicMindset = 'tecnico'
  if (profileType === 'vendas' || /venda|vendedor|representante|seller/.test(profession)) mindset = 'comercial'
  else if (maturityStage === 'iniciante') mindset = 'inseguro'
  else if (maturityStage === 'consolidado' || fase === 'escalando') mindset = 'estrategico'
  else if (/medico|nutri|psi|odont|coach|estetica/.test(profession)) mindset = 'tecnico'

  return { maturityStage, dominantPain, urgencyLevel, mindset }
}

/**
 * Retorna CTA adaptada ao perfil estratégico (para substituir cta_text do motor quando desejado).
 * Não altera o motor; só a camada de copy.
 */
export function getAdaptedCta(
  strategic: StrategicProfile,
  defaultCta: string
): string {
  const { maturityStage, mindset } = strategic
  if (maturityStage === 'iniciante') return 'Comece estruturando sua captação hoje.'
  if (maturityStage === 'consolidado') return 'Escale sua estratégia com consistência.'
  if (mindset === 'inseguro') return 'Veja como aplicar isso com segurança no seu caso.'
  if (mindset === 'comercial') return 'Ative essa estratégia e gere mais conversas ainda hoje.'
  if (mindset === 'tecnico') return 'Veja os próximos passos objetivos para aplicar agora.'
  return defaultCta
}

/**
 * Retorna frase de abertura do diagnóstico (tom adaptativo por perfil).
 * Mesmo score/motor; só a abertura muda. Deve ser preposta ao profile_summary do motor.
 * Não altera cálculo; só copy.
 */
export function getAdaptedDiagnosisOpening(strategic: StrategicProfile): string {
  const { maturityStage, mindset } = strategic
  // iniciante
  if (maturityStage === 'iniciante' && mindset === 'inseguro')
    return 'Seu padrão indica oportunidade clara de organização.'
  if (maturityStage === 'iniciante' && mindset === 'tecnico')
    return 'Seu padrão aponta para ajustes objetivos que aumentam previsibilidade.'
  if (maturityStage === 'iniciante') return 'Seu padrão mostra onde começar para gerar mais consultas com previsibilidade.'
  // instavel
  if (maturityStage === 'instavel' && mindset === 'comercial')
    return 'Seu padrão mostra onde atuar para gerar mais conversas com consistência.'
  if (maturityStage === 'instavel' && mindset === 'tecnico')
    return 'Seu padrão aponta para ajustes objetivos que aumentam previsibilidade.'
  if (maturityStage === 'instavel') return 'Seu padrão indica próximos passos claros para organizar sua captação.'
  // crescendo
  if (maturityStage === 'crescendo' && mindset === 'estrategico')
    return 'Seu padrão mostra espaço para otimizar conversão e preencher melhor a agenda.'
  if (maturityStage === 'crescendo') return 'Seu padrão aponta para otimizações que aumentam resultado.'
  // consolidado
  if (maturityStage === 'consolidado' && mindset === 'estrategico')
    return 'Seu padrão mostra espaço estratégico para otimizar conversão e escalar sua captação com consistência.'
  if (maturityStage === 'consolidado') return 'Seu padrão mostra onde escalar com consistência.'
  return 'Seu padrão indica o próximo passo estratégico.'
}
