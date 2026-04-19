import type { ProLideresScriptPillarId } from '@/lib/pro-lideres-scripts-noel'

/** Passo inicial: separa linguagem e CTA (venda vs oportunidade). */
export const PL_SCRIPT_GUIDED_FOCUS = [
  { id: 'vendas', label: 'Vendas (produto, consumo, experiência)' },
  { id: 'recrutamento', label: 'Recrutamento (oportunidade, negócio)' },
] as const

export type PlScriptGuidedFocusId = (typeof PL_SCRIPT_GUIDED_FOCUS)[number]['id']

/** Subtom após o foco — opções diferentes por foco (um passo curto). */
export const PL_SCRIPT_GUIDED_ANGLE_SALES = [
  {
    id: 'sales_rotina',
    label: 'Rotina e bem-estar (leve, sem claims médicos)',
  },
  { id: 'sales_curiosidade', label: 'Curiosidade e benefício prático leve' },
  { id: 'sales_equilibrado', label: 'Equilibrado (Noel equilibra o tom)' },
] as const

export const PL_SCRIPT_GUIDED_ANGLE_RECRUIT = [
  {
    id: 'rec_projeto',
    label: 'Projeto paralelo / tempo (sem prometer renda)',
  },
  { id: 'rec_crescimento', label: 'Crescimento, aprendizado e time' },
  { id: 'rec_equilibrado', label: 'Equilibrado (Noel equilibra o tom)' },
] as const

export type PlScriptGuidedAngleSalesId = (typeof PL_SCRIPT_GUIDED_ANGLE_SALES)[number]['id']
export type PlScriptGuidedAngleRecruitId = (typeof PL_SCRIPT_GUIDED_ANGLE_RECRUIT)[number]['id']
export type PlScriptGuidedAngleId = PlScriptGuidedAngleSalesId | PlScriptGuidedAngleRecruitId

const SALES_ANGLE_SET = new Set<string>(PL_SCRIPT_GUIDED_ANGLE_SALES.map((a) => a.id))
const RECRUIT_ANGLE_SET = new Set<string>(PL_SCRIPT_GUIDED_ANGLE_RECRUIT.map((a) => a.id))

export function anglesForFocus(focus: PlScriptGuidedFocusId) {
  return focus === 'vendas' ? PL_SCRIPT_GUIDED_ANGLE_SALES : PL_SCRIPT_GUIDED_ANGLE_RECRUIT
}

export function defaultAngleForFocus(focus: PlScriptGuidedFocusId): PlScriptGuidedAngleId {
  return focus === 'vendas' ? 'sales_equilibrado' : 'rec_equilibrado'
}

export function isAngleValidForFocus(angleId: string, focus: PlScriptGuidedFocusId): boolean {
  return focus === 'vendas' ? SALES_ANGLE_SET.has(angleId) : RECRUIT_ANGLE_SET.has(angleId)
}

/** Opções curtas — fluxo conversacional, não formulário longo. */
export const PL_SCRIPT_GUIDED_OBJECTIVES = [
  { id: 'novos_contatos', label: 'Gerar novos contatos' },
  { id: 'reativar', label: 'Reativar contatos' },
  { id: 'converter', label: 'Converter interesse' },
  { id: 'engajar', label: 'Engajar cliente' },
  { id: 'indicacao', label: 'Pedir indicação' },
] as const

export type PlScriptGuidedObjectiveId = (typeof PL_SCRIPT_GUIDED_OBJECTIVES)[number]['id']

export const PL_SCRIPT_GUIDED_TOOLS = [
  { id: 'desafio_21', label: 'Desafio 21 dias' },
  { id: 'espaco_saudavel', label: 'Espaço saudável' },
  { id: 'hype_drink', label: 'Hype Drink' },
  { id: 'avaliacao', label: 'Avaliação' },
  { id: 'evento', label: 'Evento ou reunião' },
  { id: 'direto', label: 'Conversa direta (sem ferramenta)' },
  { id: 'outra', label: 'Outra — descrevo abaixo' },
] as const

export type PlScriptGuidedToolPresetId = (typeof PL_SCRIPT_GUIDED_TOOLS)[number]['id']

export const PL_SCRIPT_GUIDED_AUDIENCES = [
  { id: 'fria', label: 'Pessoa nova (fria)' },
  { id: 'interesse', label: 'Já demonstrou interesse' },
  { id: 'cliente', label: 'Cliente atual' },
  { id: 'antigo', label: 'Cliente antigo' },
  { id: 'amigo', label: 'Amigo ou conhecido' },
] as const

export type PlScriptGuidedAudienceId = (typeof PL_SCRIPT_GUIDED_AUDIENCES)[number]['id']

export const PL_SCRIPT_GUIDED_TONES = [
  { id: 'leve', label: 'Leve e natural' },
  { id: 'direto', label: 'Direto ao ponto' },
  { id: 'curioso', label: 'Curioso (pergunta)' },
  { id: 'autoridade', label: 'Com mais autoridade' },
  { id: 'emocional', label: 'Mais emocional' },
] as const

export type PlScriptGuidedToneId = (typeof PL_SCRIPT_GUIDED_TONES)[number]['id']

export const PL_SCRIPT_GUIDED_SITUATIONS = [
  { id: 'story', label: 'Veio de story' },
  { id: 'indicacao', label: 'Veio de indicação' },
  { id: 'parou', label: 'Parou de responder' },
  { id: 'nunca', label: 'Nunca respondeu' },
  { id: 'comprou', label: 'Já comprou antes' },
  { id: 'nenhum', label: 'Nada em especial' },
] as const

export type PlScriptGuidedSituationId = (typeof PL_SCRIPT_GUIDED_SITUATIONS)[number]['id']

export const PL_SCRIPT_GUIDED_CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp (1:1)' },
  { id: 'grupo_wa', label: 'WhatsApp (grupo de clientes)' },
  { id: 'rede', label: 'Rede social / post' },
  { id: 'story', label: 'Stories' },
  { id: 'presencial', label: 'Presencial / reunião' },
  { id: 'misto', label: 'Misto ou outro canal' },
] as const

export type PlScriptGuidedChannelId = (typeof PL_SCRIPT_GUIDED_CHANNELS)[number]['id']

export type PlScriptGuidedBriefing = {
  focusMainId: PlScriptGuidedFocusId
  angleId: PlScriptGuidedAngleId
  objectiveId: PlScriptGuidedObjectiveId
  toolPresetId: PlScriptGuidedToolPresetId
  /** Texto quando toolPresetId === outra ou complemento da ferramenta. */
  toolFreeform: string
  /** Rótulo da ferramenta YLADA do catálogo (só UI), não enviamos URL inventada. */
  catalogToolLabel: string | null
  audienceId: PlScriptGuidedAudienceId
  toneId: PlScriptGuidedToneId
  situationId: PlScriptGuidedSituationId
  channelId: PlScriptGuidedChannelId
  /** Notas livres do líder (opcional). */
  leaderNotes: string
}

function labelById<T extends readonly { id: string; label: string }[]>(list: T, id: string): string {
  return list.find((x) => x.id === id)?.label ?? id
}

function labelAngle(b: PlScriptGuidedBriefing): string {
  const list = anglesForFocus(b.focusMainId)
  return labelById(list as readonly { id: string; label: string }[], b.angleId)
}

/** Texto enviado ao modelo como «propósito» estruturado. */
export function composeGuidedScriptPurpose(b: PlScriptGuidedBriefing): string {
  const focus = labelById(PL_SCRIPT_GUIDED_FOCUS, b.focusMainId)
  const angle = labelAngle(b)
  const obj = labelById(PL_SCRIPT_GUIDED_OBJECTIVES, b.objectiveId)
  const toolPreset = labelById(PL_SCRIPT_GUIDED_TOOLS, b.toolPresetId)
  const toolParts: string[] = [toolPreset]
  if (b.catalogToolLabel?.trim()) {
    toolParts.push(`Ferramenta no catálogo YLADA: ${b.catalogToolLabel.trim()}`)
  }
  const tf = b.toolFreeform.trim()
  if (tf) toolParts.push(`Detalhe: ${tf}`)
  const audience = labelById(PL_SCRIPT_GUIDED_AUDIENCES, b.audienceId)
  const tone = labelById(PL_SCRIPT_GUIDED_TONES, b.toneId)
  const situation = labelById(PL_SCRIPT_GUIDED_SITUATIONS, b.situationId)
  const channel = labelById(PL_SCRIPT_GUIDED_CHANNELS, b.channelId)
  const notes = b.leaderNotes.trim()

  const focusRules =
    b.focusMainId === 'recrutamento'
      ? 'Tom recrutamento ético: sem promessa de renda, sem garantia de ganho, sem "ganhar fácil"; convite para conversa e curiosidade profissional.'
      : 'Tom consumo/experiência: sem claims de cura ou resultado garantido; consultivo.'

  const lines = [
    `FOCO PRINCIPAL: ${focus}`,
    `ÂNGULO DE ABORDAGEM: ${angle}`,
    `REGRAS DE FOCO: ${focusRules}`,
    `OBJETIVO DO SCRIPT: ${obj}`,
    `FERRAMENTA OU SITUAÇÃO: ${toolParts.join(' · ')}`,
    `PÚBLICO: ${audience}`,
    `TOM DESEJADO: ${tone}`,
    b.situationId !== 'nenhum' ? `CONTEXTO ESPECÍFICO: ${situation}` : null,
    `CANAL / FORMATO: ${channel}`,
    notes ? `NOTAS DO LÍDER: ${notes}` : null,
    '',
    'Instrução: monta a sequência de textos para o distribuidor copiar e colar nesse canal, respeitando tom e público.',
  ].filter(Boolean) as string[]

  return lines.join('\n')
}

export function suggestPillarFromObjective(objectiveId: PlScriptGuidedObjectiveId): ProLideresScriptPillarId {
  switch (objectiveId) {
    case 'novos_contatos':
      return 'whatsapp'
    case 'reativar':
      return 'whatsapp'
    case 'converter':
      return 'ferramenta_depois'
    case 'engajar':
      return 'ferramenta_depois'
    case 'indicacao':
      return 'ferramenta_depois'
  }
}

/** Considera foco vendas vs recrutamento para sugerir o pilar Noel. */
export function suggestPillarFromBriefing(b: PlScriptGuidedBriefing): ProLideresScriptPillarId {
  if (b.focusMainId === 'recrutamento') {
    if (b.objectiveId === 'engajar') return 'ferramenta_depois'
    return 'recrutamento'
  }
  return suggestPillarFromObjective(b.objectiveId)
}
