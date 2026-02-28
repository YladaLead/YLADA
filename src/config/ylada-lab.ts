/**
 * Configuração do YLADA Lab — sandbox de teste estratégico.
 * Perguntas adaptadas por profile_type para Bloco 3.
 * @see /pt/ylada-lab
 */

export const LAB_PROFILE_TYPES = [
  { value: 'profissional_liberal', label: 'Profissional Liberal' },
  { value: 'vendedor', label: 'Vendedor / Representante' },
  { value: 'wellness', label: 'Wellness / MMN' },
  { value: 'nutricionista', label: 'Nutricionista' },
  { value: 'clinica', label: 'Dono de Clínica' },
  { value: 'outro', label: 'Outro' },
] as const

export type LabProfileType = (typeof LAB_PROFILE_TYPES)[number]['value']

/** Refinadores estratégicos (Bloco 2) — alimentam deriveStrategicProfile. */
export const LAB_DOMINANT_PAINS = [
  { value: 'agenda_vazia', label: 'Agenda vazia / instável' },
  { value: 'falta_de_constancia', label: 'Falta de constância' },
  { value: 'baixa_conversao', label: 'Baixa conversão' },
  { value: 'time_nao_duplica', label: 'Time não duplica' },
] as const

export const LAB_URGENCY_LEVELS = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
] as const

export const LAB_SELF_STAGES = [
  { value: 'iniciante', label: 'Iniciante' },
  { value: 'intermediario', label: 'Intermediário' },
  { value: 'avancado', label: 'Avançado' },
] as const

export interface LabQuestion {
  id: string
  text: string
}

/** Perguntas estratégicas por profile_type (Bloco 3). */
export const LAB_PROFILE_QUESTIONS: Record<string, LabQuestion[]> = {
  profissional_liberal: [
    { id: 'q1', text: 'Sua agenda oscila durante o mês?' },
    { id: 'q2', text: 'Você depende de indicação?' },
    { id: 'q3', text: 'Você tem oferta principal clara?' },
    { id: 'q4', text: 'Você já tentou gerar leads online?' },
    { id: 'q5', text: 'Você sente que conversa muito e fecha pouco?' },
  ],
  vendedor: [
    { id: 'q1', text: 'Quantas pessoas você aborda por dia?' },
    { id: 'q2', text: 'Seu time replica sua comunicação?' },
    { id: 'q3', text: 'Você tem script definido?' },
    { id: 'q4', text: 'Seu funil é previsível?' },
    { id: 'q5', text: 'Você sente que poderia falar com 10x mais pessoas?' },
  ],
  wellness: [
    { id: 'q1', text: 'Você recruta com consistência?' },
    { id: 'q2', text: 'Sua equipe trava na abordagem?' },
    { id: 'q3', text: 'Você tem fluxo diário de contato?' },
    { id: 'q4', text: 'Você usa link estratégico?' },
    { id: 'q5', text: 'Você sente que poderia duplicar melhor?' },
  ],
  nutricionista: [
    { id: 'q1', text: 'Sua agenda oscila durante o mês?' },
    { id: 'q2', text: 'Você divulga com regularidade?' },
    { id: 'q3', text: 'Você tem oferta clara (ex.: consulta, programa)?' },
    { id: 'q4', text: 'Você já usou quiz ou calculadora para captar?' },
    { id: 'q5', text: 'Você sente que converte pouco quem demonstra interesse?' },
  ],
  clinica: [
    { id: 'q1', text: 'Sua clínica tem agenda previsível?' },
    { id: 'q2', text: 'Você depende de indicação ou convênio?' },
    { id: 'q3', text: 'Você tem oferta principal definida?' },
    { id: 'q4', text: 'Você já investiu em captação online?' },
    { id: 'q5', text: 'Você sente que poderia preencher mais vagas?' },
  ],
  outro: [
    { id: 'q1', text: 'Qual seu principal objetivo hoje?' },
    { id: 'q2', text: 'Qual sua maior dificuldade?' },
    { id: 'q3', text: 'Você gera leads com regularidade?' },
    { id: 'q4', text: 'Você tem processo definido de captação?' },
    { id: 'q5', text: 'Sua urgência hoje é baixa, média ou alta?' },
  ],
}

/** Mapeia dor do lab para dor_principal usada por deriveStrategicProfile. */
export const LAB_PAIN_TO_PROFILE_DOR: Record<string, string> = {
  agenda_vazia: 'agenda_vazia',
  falta_de_constancia: 'sem_leads',
  baixa_conversao: 'nao_converte',
  time_nao_duplica: 'autoridade',
}

/** Mapeia urgência do lab para objetivo (interpretação). */
export const LAB_URGENCY_TO_OBJETIVO: Record<string, string> = {
  alta: 'captar',
  media: 'educar',
  baixa: 'reter',
}

/** Mapeia selfStage do lab para fase_negocio. */
export const LAB_STAGE_TO_FASE: Record<string, string> = {
  iniciante: 'iniciante',
  intermediario: 'em_crescimento',
  avancado: 'estabilizado',
}
