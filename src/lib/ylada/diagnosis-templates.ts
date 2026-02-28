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
    'Seu padrão indica {LEVEL} risco em {THEME}',
    'Sinais apontam {LEVEL} risco ligado a {THEME}',
  ],
  explanation:
    'Isso costuma acontecer quando sinais importantes se acumulam e ninguém ajusta a estratégia certa no que realmente influencia {THEME}.',
  consequence:
    'Se isso continuar, é comum o problema ficar estável (ou piorar) mesmo com esforço isolado.',
  possibility:
    'A boa notícia: com ajustes direcionados e um plano coerente, dá para destravar progresso com segurança.',
  cta_helper: 'Quer que eu olhe seu caso e te diga o primeiro passo?',
  cta_button: ['Quero analisar meu caso', 'Quero meu próximo passo'],
  cta_imperative: 'Analise seu caso',
  whatsapp_prefill:
    'Oi {NAME}, fiz o diagnóstico de {THEME} e apareceu risco {LEVEL}. Quero entender o que mais está pesando no meu caso e qual o primeiro passo.',
}

const BLOCKER: ArchitectureTemplates = {
  title: [
    'Seu principal bloqueio em {THEME} é: {BLOCKER}',
    'O que mais te trava em {THEME} hoje é: {BLOCKER}',
  ],
  explanation:
    'Isso não é falta de vontade. É um padrão de rotina/decisão que cria atrito e quebra constância.',
  consequence:
    'Se esse bloqueio continuar, você tende a repetir o ciclo: tentativa forte → quebra → frustração.',
  possibility: 'A boa notícia: dá para ajustar com um passo simples e bem direcionado.',
  cta_helper: 'Quer que eu te diga como ajustar esse bloqueio no seu contexto?',
  cta_button: ['Quero destravar isso', 'Quero ajustar meu bloqueio'],
  cta_imperative: 'Destrave esse bloqueio',
  whatsapp_prefill:
    'Oi {NAME}, meu diagnóstico em {THEME} apontou bloqueio {BLOCKER}. Quero uma orientação prática para ajustar isso no meu caso.',
}

const PROJECTION: ArchitectureTemplates = {
  title: [
    'Sua projeção realista para {THEME}',
    'Cenário provável de {THEME} com base no que você informou',
  ],
  explanation:
    'Projeção funciona quando a meta respeita seu ponto de partida e a constância possível na sua rotina.',
  consequence:
    'Se a meta estiver acima do realista, o mais comum é desistir cedo — por plano mal calibrado.',
  possibility:
    'A boa notícia: calibrando alvo e caminho, você aumenta muito a chance de consistência.',
  cta_helper: 'Quer que eu monte seu próximo passo com base nessa projeção?',
  cta_button: ['Quero calibrar minha meta', 'Quero um plano com base nisso'],
  cta_imperative: 'Calibre sua meta',
  whatsapp_prefill:
    'Oi {NAME}, vi minha projeção para {THEME}. Quero calibrar minha meta e entender o próximo passo mais realista.',
}

const PROFILE: ArchitectureTemplates = {
  title: [
    'Seu perfil em {THEME} é: {PROFILE}',
    'Seu estilo dominante em {THEME} é: {PROFILE}',
  ],
  explanation:
    'Seu resultado mostra forças e armadilhas típicas. O segredo é usar a força certa sem cair na armadilha do seu perfil.',
  consequence:
    'Se você insistir num caminho que não combina com seu perfil, o resultado tende a ser inconsistente.',
  possibility:
    'A boa notícia: quando a estratégia combina com seu perfil, tudo fica mais leve e previsível.',
  cta_helper: 'Quer que eu te diga o caminho ideal para o seu perfil?',
  cta_button: ['Quero o caminho do meu perfil', 'Quero aplicar isso agora'],
  cta_imperative: 'Veja o caminho do seu perfil',
  whatsapp_prefill:
    'Oi {NAME}, meu perfil em {THEME} deu {PROFILE}. Quero o caminho ideal para eu aplicar isso na prática.',
}

const READINESS: ArchitectureTemplates = {
  title: [
    'Seu nível de prontidão para {THEME}: {SCORE}/100',
    'Checklist de prontidão para {THEME}: {SCORE}/100',
  ],
  explanation:
    'Prontidão não é motivação. É estrutura. Quando alguns pontos falham, o resultado fica instável mesmo com esforço.',
  consequence: 'Se você ignorar os pontos críticos, você corrige efeito e não a causa.',
  possibility: 'A boa notícia: ajustando poucos pontos-chave, você melhora muito o resultado.',
  cta_helper: 'Quer que eu revise seus pontos críticos e te diga por onde começar?',
  cta_button: ['Quero revisar meus pontos', 'Quero meu plano de ajuste'],
  cta_imperative: 'Revise seus pontos críticos',
  whatsapp_prefill:
    'Oi {NAME}, meu checklist de {THEME} deu {SCORE}/100 e surgiram pontos críticos. Você pode me orientar por onde começar?',
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
