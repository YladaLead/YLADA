/**
 * Templates por arquitetura do Strong Diagnosis Engine.
 * Slots: {THEME}, {LEVEL}, {BLOCKER}, {PROFILE}, {SCORE}, {NAME}, {DAYS}, etc.
 * @see docs/LINKS-INTELIGENTES-DIAGNOSIS-ENGINE-SPEC.md (Bloco C)
 */

import type { DiagnosisArchitecture } from './diagnosis-types'

export interface ArchitectureTemplates {
  title: string[]
  explanation: string
  consequence: string
  possibility: string
  cta_helper: string
  cta_button: string[]
  /** CTA imperativo (motor de decisão). Não usar "Quero" / "Quer que". */
  cta_imperative: string
  whatsapp_prefill: string
}

const RISK: ArchitectureTemplates = {
  title: [
    'Seu resultado em {THEME}',
    'O que apareceu em {THEME}',
  ],
  explanation:
    'Pelos sinais que você relatou, algo está pesando em {THEME} e vale atenção.',
  consequence:
    'Se nada mudar, tende a continuar igual ou piorar.',
  possibility:
    'Vale conversar com quem entende pra ver o próximo passo.',
  cta_helper: 'Quer que eu olhe seu caso e te diga o primeiro passo?',
  cta_button: ['Quero analisar meu caso', 'Quero meu próximo passo'],
  cta_imperative: 'Fale comigo sobre isso',
  whatsapp_prefill:
    'Oi {NAME}, fiz a análise de {THEME} e apareceu risco {LEVEL}. Quero entender o próximo passo pro meu caso.',
}

const BLOCKER: ArchitectureTemplates = {
  title: [
    'O que mais te trava em {THEME}',
    'Seu resultado em {THEME}',
  ],
  explanation:
    'Não é falta de vontade — é algo no dia a dia que trava e quebra a constância.',
  consequence:
    'Se continuar assim, o ciclo tende a se repetir.',
  possibility: 'Dá pra ajustar com um passo simples. Vale conversar.',
  cta_helper: 'Quer que eu te diga como ajustar isso no seu caso?',
  cta_button: ['Quero destravar isso', 'Quero ajustar'],
  cta_imperative: 'Fale comigo sobre isso',
  whatsapp_prefill:
    'Oi {NAME}, minha análise em {THEME} apontou {BLOCKER}. Quero uma orientação prática pro meu caso.',
}

const PROJECTION: ArchitectureTemplates = {
  title: [
    'Sua projeção para {THEME}',
    'Cenário provável em {THEME}',
  ],
  explanation:
    'Com base no que você informou, essa é uma projeção realista.',
  consequence:
    'Se a meta estiver fora do realista, tende a desistir cedo.',
  possibility:
    'Vale calibrar com quem acompanha. Dá pra evoluir.',
  cta_helper: 'Quer que eu monte seu próximo passo com base nisso?',
  cta_button: ['Quero calibrar', 'Quero um plano'],
  cta_imperative: 'Fale comigo sobre isso',
  whatsapp_prefill:
    'Oi {NAME}, vi minha projeção para {THEME}. Quero calibrar e entender o próximo passo.',
}

const PROFILE: ArchitectureTemplates = {
  title: [
    'Seu perfil em {THEME}: {PROFILE}',
    'Seu estilo em {THEME}: {PROFILE}',
  ],
  explanation:
    'Seu jeito de lidar com isso tem pontos fortes e alguns que atrapalham.',
  consequence:
    'Se o caminho não combinar com seu perfil, tende a ficar inconsistente.',
  possibility:
    'Quando combina, fica mais leve. Vale conversar pra alinhar.',
  cta_helper: 'Quer que eu te diga o caminho ideal pro seu perfil?',
  cta_button: ['Quero o caminho do meu perfil', 'Quero aplicar'],
  cta_imperative: 'Fale comigo sobre isso',
  whatsapp_prefill:
    'Oi {NAME}, meu perfil em {THEME} deu {PROFILE}. Quero o caminho ideal pro meu caso.',
}

const READINESS: ArchitectureTemplates = {
  title: [
    'Seu nível em {THEME}: {SCORE}/100',
    'Resultado do checklist: {SCORE}/100',
  ],
  explanation:
    'Alguns pontos pesam mais. Quando falham, o resultado fica instável.',
  consequence: 'Ignorar os críticos corrige efeito, não causa.',
  possibility: 'Ajustando poucos pontos, melhora bastante. Vale conversar.',
  cta_helper: 'Quer que eu te diga por onde começar?',
  cta_button: ['Quero revisar', 'Quero meu plano'],
  cta_imperative: 'Fale comigo sobre isso',
  whatsapp_prefill:
    'Oi {NAME}, meu checklist de {THEME} deu {SCORE}/100. Você pode me orientar por onde começar?',
}

export const DIAGNOSIS_TEMPLATES: Record<DiagnosisArchitecture, ArchitectureTemplates> = {
  RISK_DIAGNOSIS: RISK,
  BLOCKER_DIAGNOSIS: BLOCKER,
  PROJECTION_CALCULATOR: PROJECTION,
  PROFILE_TYPE: PROFILE,
  READINESS_CHECKLIST: READINESS,
}

const SLOT_REGEX = /\{([A-Z_]+)\}/g

export function fillSlots(
  text: string,
  slots: Record<string, string | number | undefined>
): string {
  return text.replace(SLOT_REGEX, (_, key) => {
    const v = slots[key]
    return v !== undefined && v !== null ? String(v) : `{${key}}`
  })
}

export function pickTitle(arch: DiagnosisArchitecture, slots: Record<string, string | number | undefined>): string {
  const t = DIAGNOSIS_TEMPLATES[arch]
  const choice = t.title[Math.floor(Math.random() * t.title.length)] ?? t.title[0]
  return fillSlots(choice, slots)
}

export function pickCtaButton(arch: DiagnosisArchitecture): string {
  const t = DIAGNOSIS_TEMPLATES[arch]
  const choice = t.cta_button[Math.floor(Math.random() * t.cta_button.length)] ?? t.cta_button[0]
  return choice
}
